import React, { useState, useMemo } from 'react';
import { Plus, Bell, Search, AlertCircle } from 'lucide-react';
import { useGoogleCalendar } from '../context/GoogleCalendarContext';
import { isToday, MONTHS_ES } from '../utils/dateUtils';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import { TulipIcon } from '../components/TulipGarden';

const FILTERS = [
  { key:'all', label:'Todos' },
  { key:'today', label:'Hoy' },
  { key:'week', label:'Esta semana' },
  { key:'month', label:'Este mes' },
];

export default function RemindersView() {
  const { events, createEvent, updateEvent, deleteEvent, isConfigured } = useGoogleCalendar();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const now = new Date();

  const filteredEvents = useMemo(() => {
    let evts = [...events].sort((a,b) => new Date(a.start)-new Date(b.start));
    evts = evts.filter(e => {
      const start = new Date(e.start);
      return start >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
    });
    if (filter==='today') evts = evts.filter(e=>isToday(e.start));
    else if (filter==='week') { const w=new Date(now); w.setDate(w.getDate()+7); evts=evts.filter(e=>new Date(e.start)<=w); }
    else if (filter==='month') { const m=new Date(now.getFullYear(),now.getMonth()+1,0); evts=evts.filter(e=>new Date(e.start)<=m); }
    if (search) { const q=search.toLowerCase(); evts=evts.filter(e=>e.title.toLowerCase().includes(q)||(e.description||'').toLowerCase().includes(q)); }
    return evts;
  }, [events, filter, search]);

  const grouped = useMemo(() => {
    const groups = {};
    filteredEvents.forEach(evt => {
      const d = new Date(evt.start);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!groups[key]) groups[key] = { date: d, events: [] };
      groups[key].events.push(evt);
    });
    return Object.values(groups).sort((a,b) => a.date-b.date);
  }, [filteredEvents]);

  const handleEventClick = (event) => { setSelectedEvent(event); setModalOpen(true); };
  const handleSave = async (data) => { if (selectedEvent) await updateEvent(selectedEvent.id,data); else await createEvent(data); };
  const handleDelete = async (id) => { await deleteEvent(id); };

  const getDateLabel = (date) => {
    const d = new Date(date);
    if (isToday(d)) return 'Hoy';
    const tom = new Date(now); tom.setDate(tom.getDate()+1);
    if (d.toDateString()===tom.toDateString()) return 'Mañana';
    return d.toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' });
  };

  return (
    <div className="animate-fade-in space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell size={20} className="text-tulip-500" />
            <h1 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'1.7rem', fontWeight:600, color:'#1A1220' }}>
              Recordatorios
            </h1>
          </div>
          <p className="text-night-800/40 text-sm font-light">
            {filteredEvents.length} {filteredEvents.length===1?'próximo evento':'próximos eventos'}
          </p>
        </div>
        <button
          onClick={() => { setSelectedEvent(null); setModalOpen(true); }}
          className="btn-primary flex items-center gap-1.5 text-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Nuevo recordatorio</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </div>

      {/* Banner if no Google */}
      {!isConfigured && (
        <div className="rounded-2xl px-4 py-3 flex items-start gap-3"
          style={{ background:'rgba(232,49,79,0.05)', border:'1px solid rgba(232,49,79,0.15)' }}>
          <AlertCircle size={16} className="text-tulip-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-tulip-600">Modo local activo</p>
            <p className="text-xs text-tulip-500/80">Los recordatorios por correo requieren Google Calendar. Configura <code className="bg-white/60 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> para activarlos.</p>
          </div>
        </div>
      )}

      {/* Search + filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-tulip-300" />
          <input className="input-field pl-10" placeholder="Buscar eventos o recordatorios..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200
                ${filter===f.key ? 'bg-tulip-500 text-white shadow-petal' : 'bg-tulip-100 text-tulip-500 hover:bg-tulip-200'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {grouped.length === 0 ? (
        <div className="card text-center py-20">
          <div className="flex justify-center mb-4">
            <TulipIcon size={52} color="#E8314F" className="animate-float opacity-40" />
          </div>
          <h3 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontWeight:600, color:'#1A1220', fontSize:'1.1rem' }}>
            {search ? 'Sin resultados' : 'Tu jardín está vacío'}
          </h3>
          <p className="text-night-800/40 text-sm mt-1 mb-6">
            {search ? 'Prueba con otros términos de búsqueda' : '¡Crea tu primer recordatorio y empieza a florecer!'}
          </p>
          {!search && (
            <button onClick={() => { setSelectedEvent(null); setModalOpen(true); }} className="btn-primary mx-auto">
              Crear recordatorio
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ date, events: dayEvts }) => (
            <div key={date.toString()}>
              {/* Date header */}
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 ${isToday(date) ? 'shadow-petal' : ''}`}
                  style={{ background: isToday(date) ? 'linear-gradient(135deg,#E8314F,#C9183A)' : 'rgba(232,49,79,0.08)' }}>
                  <span className={`text-sm font-black leading-none ${isToday(date)?'text-white':'text-tulip-500'}`}>{date.getDate()}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${isToday(date)?'text-white/70':'text-tulip-400'}`}>
                    {MONTHS_ES[date.getMonth()].slice(0,3)}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily:'"Playfair Display",Georgia,serif', fontWeight:600, color:'#1A1220', fontSize:'0.95rem', textTransform:'capitalize' }}>
                    {getDateLabel(date)}
                  </p>
                  <p className="section-label">{dayEvts.length} {dayEvts.length===1?'evento':'eventos'}</p>
                </div>
                {/* line */}
                <div className="flex-1 h-px bg-tulip-100" />
              </div>

              {/* Cards */}
              <div className="space-y-2 pl-16">
                {dayEvts.map(evt => <EventCard key={evt.id} event={evt} onClick={handleEventClick} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      <EventModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedEvent(null); }}
        onSave={handleSave}
        onDelete={handleDelete}
        initialData={selectedEvent}
        initialDate={selectedEvent ? null : new Date()}
      />
    </div>
  );
}
