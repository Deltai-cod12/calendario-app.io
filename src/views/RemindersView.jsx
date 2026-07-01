import React, { useState, useMemo } from 'react';
import { Plus, Bell, Search, AlertCircle } from 'lucide-react';
import { useGoogleCalendar } from '../context/GoogleCalendarContext';
import { useDarkMode } from '../context/DarkModeContext';
import { isToday, MONTHS_ES } from '../utils/dateUtils';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import { TulipIcon } from '../components/TulipGarden';

const FILTERS = [{key:'all',label:'Todos'},{key:'today',label:'Hoy'},{key:'week',label:'Esta semana'},{key:'month',label:'Este mes'}];

export default function RemindersView() {
  const { events, createEvent, updateEvent, deleteEvent, isConfigured } = useGoogleCalendar();
  const { dark } = useDarkMode();
  const [modalOpen, setModalOpen]       = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [search, setSearch]             = useState('');
  const [filter, setFilter]             = useState('all');

  const now = new Date();

  const filtered = useMemo(() => {
    let evts = [...events].sort((a,b)=>new Date(a.start)-new Date(b.start));
    evts = evts.filter(e=>new Date(e.start)>=new Date(now.getFullYear(),now.getMonth(),now.getDate()));
    if(filter==='today')evts=evts.filter(e=>isToday(e.start));
    else if(filter==='week'){const w=new Date(now);w.setDate(w.getDate()+7);evts=evts.filter(e=>new Date(e.start)<=w);}
    else if(filter==='month'){const m=new Date(now.getFullYear(),now.getMonth()+1,0);evts=evts.filter(e=>new Date(e.start)<=m);}
    if(search){const q=search.toLowerCase();evts=evts.filter(e=>e.title.toLowerCase().includes(q)||(e.description||'').toLowerCase().includes(q));}
    return evts;
  },[events,filter,search]);

  const grouped = useMemo(()=>{
    const g={};
    filtered.forEach(evt=>{
      const d=new Date(evt.start);
      const k=`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if(!g[k])g[k]={date:d,events:[]};
      g[k].events.push(evt);
    });
    return Object.values(g).sort((a,b)=>a.date-b.date);
  },[filtered]);

  const onEventClick = (e)  => { setSelectedEvent(e); setModalOpen(true); };
  const onSave       = async (d) => { if(selectedEvent) await updateEvent(selectedEvent.id,d); else await createEvent(d); };
  const onDelete     = async (id) => deleteEvent(id);

  const getLabel = (date) => {
    if(isToday(date)) return 'Hoy';
    const tom=new Date(now); tom.setDate(tom.getDate()+1);
    if(new Date(date).toDateString()===tom.toDateString()) return 'Mañana';
    return new Date(date).toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});
  };

  const textMain = dark?'#F0E8F4':'#1A1220';
  const textSub  = dark?'rgba(240,232,244,0.38)':'rgba(26,18,32,0.38)';
  const cardBg   = dark?'rgba(25,16,34,0.98)':'white';
  const border   = dark?'rgba(232,49,79,0.14)':'rgba(232,49,79,0.09)';

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell size={20} className="text-tulip-500"/>
            <h1 style={{fontFamily:'"Playfair Display",Georgia,serif',fontSize:'1.7rem',fontWeight:600,color:textMain}}>Recordatorios</h1>
          </div>
          <p className="text-sm font-light" style={{color:textSub}}>{filtered.length} {filtered.length===1?'próximo evento':'próximos eventos'}</p>
        </div>
        <button onClick={()=>{setSelectedEvent(null);setModalOpen(true);}} className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={16}/><span className="hidden sm:inline">Nuevo recordatorio</span><span className="sm:hidden">Nuevo</span>
        </button>
      </div>

      {!isConfigured&&(
        <div className="rounded-2xl px-4 py-3 flex items-start gap-3"
          style={{background:dark?'rgba(232,49,79,0.06)':'rgba(232,49,79,0.04)',border:`1px solid ${dark?'rgba(232,49,79,0.16)':'rgba(232,49,79,0.12)'}`}}>
          <AlertCircle size={16} className="text-tulip-500 flex-shrink-0 mt-0.5"/>
          <div>
            <p className="text-sm font-bold text-tulip-500">Modo local activo</p>
            <p className="text-xs" style={{color:'rgba(232,49,79,0.65)'}}>Los recordatorios por correo requieren Google Calendar.</p>
          </div>
        </div>
      )}

      {/* Search + filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-tulip-300"/>
          <input className="input-field pl-10" placeholder="Buscar eventos..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map(f=>(
            <button key={f.key} onClick={()=>setFilter(f.key)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200"
              style={{
                background:filter===f.key?'#E8314F':dark?'rgba(232,49,79,0.12)':'rgba(232,49,79,0.08)',
                color:filter===f.key?'white':dark?'#FF8FAF':'#C9183A',
                boxShadow:filter===f.key?'0 2px 12px rgba(232,49,79,0.30)':undefined,
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {grouped.length===0 ? (
        <div className="rounded-3xl text-center py-20 shadow-card transition-colors duration-300"
          style={{background:cardBg,border:`1px solid ${border}`}}>
          <div className="flex justify-center mb-4">
            <TulipIcon size={52} color="#E8314F" className="animate-float opacity-30"/>
          </div>
          <h3 style={{fontFamily:'"Playfair Display",Georgia,serif',fontWeight:600,color:textMain,fontSize:'1.1rem'}}>
            {search?'Sin resultados':'Tu jardín está vacío'}
          </h3>
          <p className="text-sm mt-1 mb-6" style={{color:textSub}}>
            {search?'Prueba otros términos':'¡Crea tu primer recordatorio!'}
          </p>
          {!search&&<button onClick={()=>{setSelectedEvent(null);setModalOpen(true);}} className="btn-primary mx-auto">Crear recordatorio</button>}
        </div>
      ):(
        <div className="space-y-8">
          {grouped.map(({date,events:dayEvts})=>(
            <div key={date.toString()}>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
                  style={{
                    background: isToday(date)?'linear-gradient(135deg,#E8314F,#C9183A)':dark?'rgba(232,49,79,0.12)':'rgba(232,49,79,0.08)',
                    boxShadow: isToday(date)?'0 4px 16px rgba(232,49,79,0.35)':undefined,
                  }}>
                  <span className="text-sm font-black leading-none" style={{color:isToday(date)?'white':'#E8314F'}}>{date.getDate()}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{color:isToday(date)?'rgba(255,255,255,0.7)':'rgba(232,49,79,0.6)'}}>{MONTHS_ES[date.getMonth()].slice(0,3)}</span>
                </div>
                <div>
                  <p style={{fontFamily:'"Playfair Display",Georgia,serif',fontWeight:600,color:textMain,fontSize:'0.95rem',textTransform:'capitalize'}}>{getLabel(date)}</p>
                  <p className="section-label">{dayEvts.length} {dayEvts.length===1?'evento':'eventos'}</p>
                </div>
                <div className="flex-1 h-px" style={{background:dark?'rgba(232,49,79,0.10)':'rgba(232,49,79,0.08)'}}/>
              </div>
              <div className="space-y-2 pl-16">
                {dayEvts.map(evt=><EventCard key={evt.id} event={evt} onClick={onEventClick} dark={dark}/>)}
              </div>
            </div>
          ))}
        </div>
      )}

      <EventModal isOpen={modalOpen} onClose={()=>{setModalOpen(false);setSelectedEvent(null);}}
        onSave={onSave} onDelete={onDelete} initialData={selectedEvent} initialDate={selectedEvent?null:new Date()} dark={dark}/>
    </div>
  );
}
