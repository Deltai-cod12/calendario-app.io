import React, { useState } from 'react';
import { Plus, Sparkles, CalendarDays, TrendingUp } from 'lucide-react';
import { useGoogleCalendar } from '../context/GoogleCalendarContext';
import { getDailyMessage } from '../data/messages';
import { getGreeting, getUpcomingEvents, getTodayEvents, MONTHS_ES, DAYS_FULL_ES, formatTime } from '../utils/dateUtils';
import MiniCalendar from '../components/MiniCalendar';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import { TulipIcon, PetalBackground } from '../components/TulipGarden';

export default function Dashboard() {
  const { events, createEvent, updateEvent, deleteEvent, isSignedIn, isConfigured, userName } = useGoogleCalendar();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalDate, setModalDate] = useState(null);

  const message = getDailyMessage();
  const greeting = getGreeting();
  const today = new Date();
  const todayEvents = getTodayEvents(events);
  const upcomingEvents = getUpcomingEvents(events, 7).filter(e => {
    const d = new Date(e.start);
    return d.toDateString() !== today.toDateString();
  });

  const handleDayClick = (date) => { setModalDate(date); setSelectedEvent(null); setModalOpen(true); };
  const handleEventClick = (event) => { setSelectedEvent(event); setModalDate(null); setModalOpen(true); };
  const handleSave = async (data) => { if (selectedEvent) await updateEvent(selectedEvent.id, data); else await createEvent(data); };
  const handleDelete = async (id) => { await deleteEvent(id); };

  const dayName = DAYS_FULL_ES[(today.getDay() + 6) % 7];
  const dayNum = today.getDate();
  const monthName = MONTHS_ES[today.getMonth()];

  return (
    <div className="animate-fade-in space-y-6">

      {/* ── Hero greeting ── */}
      <div className="relative rounded-4xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1220 0%, #2D1B35 60%, #1A2510 100%)', minHeight: 160 }}>
        <PetalBackground count={6} />

        {/* Decorative tulips right side */}
        <div className="absolute right-0 bottom-0 opacity-25 pointer-events-none select-none">
          <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
            {/* stem 1 */}
            <path d="M30,140 C28,120 32,100 30,75" stroke="#4A7C59" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M30,100 C20,92 14,82 20,78" stroke="#4A7C59" strokeWidth="1.5" fill="#4A7C59" fillOpacity="0.6"/>
            <ellipse cx="30" cy="60" rx="10" ry="15" fill="#E8314F" opacity="0.8"/>
            <path d="M30,68 C24,58 20,44 24,36 C27,30 30,38 30,52" fill="#FF8FAF" opacity="0.8"/>
            <path d="M30,68 C36,58 40,44 36,36 C33,30 30,38 30,52" fill="#FF8FAF" opacity="0.8"/>
            <path d="M30,70 C28,55 28,40 30,30 C32,40 32,55 30,70" fill="#E8314F" opacity="0.7"/>
            {/* stem 2 */}
            <path d="M70,140 C68,115 74,95 70,65" stroke="#4A7C59" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M70,98 C82,88 88,76 80,72" stroke="#4A7C59" strokeWidth="1.5" fill="#4A7C59" fillOpacity="0.6"/>
            <ellipse cx="70" cy="50" rx="11" ry="16" fill="#C9183A" opacity="0.8"/>
            <path d="M70,60 C63,48 59,33 64,25 C67,18 70,27 70,43" fill="#F5607A" opacity="0.8"/>
            <path d="M70,60 C77,48 81,33 76,25 C73,18 70,27 70,43" fill="#F5607A" opacity="0.8"/>
            <path d="M70,62 C68,46 68,30 70,19 C72,30 72,46 70,62" fill="#C9183A" opacity="0.7"/>
          </svg>
        </div>

        <div className="relative z-10 px-7 py-7">
          <p className="section-label text-white/40 mb-1">
            {dayName}, {dayNum} de {monthName}
          </p>
          <h1 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'1.9rem', fontWeight:600, color:'white', lineHeight:1.2 }}>
            {greeting}{userName ? `, ${userName}` : ''} 🌷
          </h1>
          <p className="text-white/50 text-sm mt-1 font-light">
            {todayEvents.length === 0
              ? 'No tienes eventos hoy, ¡disfruta tu día!'
              : `Tienes ${todayEvents.length} ${todayEvents.length === 1 ? 'evento' : 'eventos'} hoy`}
          </p>
        </div>
      </div>

      {/* ── Message of the day ── */}
      <div className="rounded-3xl px-5 py-4 flex items-start gap-4 relative overflow-hidden"
        style={{ background:'linear-gradient(120deg,#FFF0F4 0%,#FFF8F0 100%)', border:'1px solid rgba(232,49,79,0.15)' }}>
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background:'rgba(232,49,79,0.10)' }}>
            <Sparkles size={18} className="text-tulip-500 animate-float" />
          </div>
        </div>
        <div>
          <p className="section-label mb-1">mensaje del día</p>
          <p className="text-night-800/80 text-sm leading-relaxed font-medium">{message}</p>
        </div>
        {/* tiny tulip decoration */}
        <div className="absolute right-4 bottom-0 opacity-10 pointer-events-none">
          <TulipIcon size={48} color="#E8314F" />
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: today + upcoming */}
        <div className="lg:col-span-2 space-y-5">

          {/* Today's events */}
          <div className="card p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:'1px solid rgba(232,49,79,0.08)' }}>
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-tulip-500" />
                <h2 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontWeight:600, color:'#1A1220', fontSize:'1rem' }}>
                  Hoy
                </h2>
              </div>
              <button
                onClick={() => { setSelectedEvent(null); setModalDate(today); setModalOpen(true); }}
                className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3"
              >
                <Plus size={14} /> Nuevo evento
              </button>
            </div>

            <div className="px-3 py-3">
              {todayEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-2 animate-float">🌷</p>
                  <p className="text-night-800/40 text-sm font-medium">Sin eventos hoy</p>
                  <p className="text-night-800/25 text-xs mt-1">¡Un día libre para florecer!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {todayEvents.map(e => <EventCard key={e.id} event={e} onClick={handleEventClick} compact />)}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming */}
          {upcomingEvents.length > 0 && (
            <div className="card p-0 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom:'1px solid rgba(232,49,79,0.08)' }}>
                <TrendingUp size={18} className="text-tulip-500" />
                <h2 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontWeight:600, color:'#1A1220', fontSize:'1rem' }}>
                  Próximos eventos
                </h2>
              </div>
              <div className="px-3 py-3 space-y-1">
                {upcomingEvents.slice(0, 5).map(e => <EventCard key={e.id} event={e} onClick={handleEventClick} compact />)}
              </div>
            </div>
          )}
        </div>

        {/* Right: mini calendar + stats */}
        <div className="space-y-5">
          <div className="card px-4 py-4">
            <MiniCalendar events={events} onDayClick={handleDayClick} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'hoy', value: todayEvents.length, icon: '🌸' },
              { label: 'esta semana', value: upcomingEvents.length, icon: '🌷' },
            ].map((s, i) => (
              <div key={i} className="card text-center py-5 px-2">
                <div className="text-2xl mb-1">{s.icon}</div>
                <p style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'1.75rem', fontWeight:700, color:'#E8314F', lineHeight:1 }}>
                  {s.value}
                </p>
                <p className="section-label mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Local mode notice */}
          {!isConfigured && (
            <div className="rounded-2xl px-4 py-3 text-center" style={{ background:'rgba(232,49,79,0.06)', border:'1px solid rgba(232,49,79,0.12)' }}>
              <p className="text-xs font-bold text-tulip-500 mb-0.5">Modo local</p>
              <p className="text-xs text-tulip-400/80">Configura Google Calendar para sincronizar</p>
            </div>
          )}
        </div>
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedEvent(null); }}
        onSave={handleSave}
        onDelete={handleDelete}
        initialData={selectedEvent}
        initialDate={modalDate}
      />
    </div>
  );
}
