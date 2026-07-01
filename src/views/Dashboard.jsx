import React, { useState } from 'react';
import { Plus, Sparkles, CalendarDays, TrendingUp } from 'lucide-react';
import { useGoogleCalendar } from '../context/GoogleCalendarContext';
import { useDarkMode } from '../context/DarkModeContext';
import { getDailyMessage } from '../data/messages';
import { getGreeting, getUpcomingEvents, getTodayEvents, MONTHS_ES, DAYS_FULL_ES } from '../utils/dateUtils';
import MiniCalendar from '../components/MiniCalendar';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import { TulipIcon, PetalBackground } from '../components/TulipGarden';

export default function Dashboard() {
  const { events, createEvent, updateEvent, deleteEvent, isConfigured, userName, userProfile } = useGoogleCalendar();
  const { dark } = useDarkMode();
  const [modalOpen,    setModalOpen]    = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalDate,    setModalDate]    = useState(null);

  const message   = getDailyMessage();
  const greeting  = getGreeting();
  const today     = new Date();
  const todayEvts = getTodayEvents(events);
  const upcoming  = getUpcomingEvents(events, 7).filter(e => new Date(e.start).toDateString() !== today.toDateString());

  const onDayClick    = (date) => { setModalDate(date);  setSelectedEvent(null); setModalOpen(true); };
  const onEventClick  = (evt)  => { setSelectedEvent(evt); setModalDate(null);  setModalOpen(true); };
  const onSave        = async (data) => { if (selectedEvent) await updateEvent(selectedEvent.id, data); else await createEvent(data); };
  const onDelete      = async (id)   => deleteEvent(id);

  const dayName   = DAYS_FULL_ES[(today.getDay()+6)%7];
  const dayNum    = today.getDate();
  const monthName = MONTHS_ES[today.getMonth()];

  const textMain = dark ? '#F0E8F4' : '#1A1220';
  const textSub  = dark ? 'rgba(240,232,244,0.45)' : 'rgba(26,18,32,0.45)';
  const cardBg   = dark ? 'rgba(30,20,40,0.95)' : 'white';
  const border   = dark ? 'rgba(232,49,79,0.14)' : 'rgba(232,49,79,0.10)';
  const divider  = dark ? 'rgba(232,49,79,0.10)' : 'rgba(232,49,79,0.08)';

  return (
    <div className="animate-fade-in space-y-5">

      {/* ── Hero ── */}
      <div className="relative rounded-4xl overflow-hidden"
        style={{ background:'linear-gradient(135deg,#1A1220 0%,#2D1B35 60%,#1A2510 100%)', minHeight:148 }}>
        <PetalBackground count={6} />
        {/* Decorative tulips */}
        <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none select-none">
          <svg width="110" height="130" viewBox="0 0 110 130" fill="none">
            <path d="M25,130 C23,112 27,94 25,72" stroke="#4A7C59" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            <path d="M25,95 C15,87 10,76 17,72" stroke="#4A7C59" strokeWidth="1.4" fill="#4A7C59" fillOpacity="0.6"/>
            <ellipse cx="25" cy="58" rx="9" ry="13" fill="#E8314F" opacity="0.85"/>
            <path d="M25,66 C19,56 16,41 20,33 C22.5,28 25,36 25,50" fill="#FF8FAF" opacity="0.85"/>
            <path d="M25,66 C31,56 34,41 30,33 C27.5,28 25,36 25,50" fill="#FF8FAF" opacity="0.85"/>
            <path d="M25,68 C23,52 23,37 25,27 C27,37 27,52 25,68" fill="#E8314F" opacity="0.75"/>
            <path d="M65,130 C63,108 69,88 65,62" stroke="#4A7C59" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            <path d="M65,94 C77,84 83,72 75,68" stroke="#4A7C59" strokeWidth="1.4" fill="#4A7C59" fillOpacity="0.6"/>
            <ellipse cx="65" cy="47" rx="10" ry="14" fill="#C9183A" opacity="0.85"/>
            <path d="M65,57 C58,46 55,30 59,22 C61.5,17 65,26 65,40" fill="#F5607A" opacity="0.85"/>
            <path d="M65,57 C72,46 75,30 71,22 C68.5,17 65,26 65,40" fill="#F5607A" opacity="0.85"/>
            <path d="M65,59 C63,43 63,27 65,16 C67,27 67,43 65,59" fill="#C9183A" opacity="0.75"/>
          </svg>
        </div>
        <div className="relative z-10 px-6 py-6">
          <p className="section-label text-white/35 mb-1">{dayName}, {dayNum} de {monthName}</p>
          <h1 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'1.85rem', fontWeight:600, color:'white', lineHeight:1.2 }}>
            {greeting}{userName?`, ${userName}`:''} 🌷
          </h1>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.875rem', marginTop:4, fontWeight:300 }}>
            {todayEvts.length === 0 ? '¡Un día libre para florecer!' : `${todayEvts.length} ${todayEvts.length===1?'evento':'eventos'} hoy`}
          </p>
        </div>
      </div>

      {/* ── Message of the day ── */}
      <div className="rounded-3xl px-5 py-4 flex items-start gap-4 relative overflow-hidden transition-colors duration-300"
        style={{ background: dark?'rgba(232,49,79,0.07)':'linear-gradient(120deg,#FFF0F4,#FFF8F0)',
          border:`1px solid ${dark?'rgba(232,49,79,0.18)':'rgba(232,49,79,0.14)'}` }}>
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background:'rgba(232,49,79,0.12)' }}>
          <Sparkles size={17} className="text-tulip-500 animate-float" />
        </div>
        <div>
          <p className="section-label mb-1">mensaje del día</p>
          <p className="text-sm leading-relaxed font-medium" style={{ color: dark?'rgba(240,232,244,0.80)':'rgba(26,18,32,0.78)' }}>
            {message}
          </p>
        </div>
        <div className="absolute right-4 bottom-0 opacity-[0.07] pointer-events-none">
          <TulipIcon size={52} color="#E8314F" />
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">

          {/* Today */}
          <div className="rounded-3xl overflow-hidden shadow-card transition-colors duration-300"
            style={{ background:cardBg, border:`1px solid ${border}` }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:`1px solid ${divider}` }}>
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-tulip-500" />
                <h2 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontWeight:600, color:textMain, fontSize:'1rem' }}>Hoy</h2>
              </div>
              <button onClick={() => { setSelectedEvent(null); setModalDate(today); setModalOpen(true); }}
                className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3">
                <Plus size={13}/> Nuevo evento
              </button>
            </div>
            <div className="px-3 py-3">
              {todayEvts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-2 animate-float">🌷</p>
                  <p className="text-sm font-medium" style={{ color:textSub }}>Sin eventos hoy</p>
                  <p className="text-xs mt-1" style={{ color:dark?'rgba(240,232,244,0.22)':'rgba(26,18,32,0.25)' }}>¡Un día libre para florecer!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {todayEvts.map(e => <EventCard key={e.id} event={e} onClick={onEventClick} compact dark={dark} />)}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="rounded-3xl overflow-hidden shadow-card transition-colors duration-300"
              style={{ background:cardBg, border:`1px solid ${border}` }}>
              <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom:`1px solid ${divider}` }}>
                <TrendingUp size={18} className="text-tulip-500" />
                <h2 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontWeight:600, color:textMain, fontSize:'1rem' }}>Próximos eventos</h2>
              </div>
              <div className="px-3 py-3 space-y-1">
                {upcoming.slice(0,5).map(e => <EventCard key={e.id} event={e} onClick={onEventClick} compact dark={dark}/>)}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div className="rounded-3xl px-4 py-4 shadow-card transition-colors duration-300"
            style={{ background:cardBg, border:`1px solid ${border}` }}>
            <MiniCalendar events={events} onDayClick={onDayClick} dark={dark} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[{label:'hoy',icon:'🌸',val:todayEvts.length},{label:'esta semana',icon:'🌷',val:upcoming.length}].map((s,i)=>(
              <div key={i} className="rounded-3xl text-center py-5 px-2 shadow-card transition-colors duration-300"
                style={{ background:cardBg, border:`1px solid ${border}` }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <p style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'1.75rem', fontWeight:700, color:'#E8314F', lineHeight:1 }}>{s.val}</p>
                <p className="section-label mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {!isConfigured && (
            <div className="rounded-2xl px-4 py-3 text-center"
              style={{ background:dark?'rgba(232,49,79,0.08)':'rgba(232,49,79,0.06)', border:`1px solid ${dark?'rgba(232,49,79,0.18)':'rgba(232,49,79,0.12)'}` }}>
              <p className="text-xs font-bold text-tulip-500 mb-0.5">Modo local</p>
              <p className="text-xs" style={{ color:'rgba(232,49,79,0.65)' }}>Configura Google Calendar para sincronizar</p>
            </div>
          )}
        </div>
      </div>

      <EventModal isOpen={modalOpen} onClose={()=>{setModalOpen(false);setSelectedEvent(null);}}
        onSave={onSave} onDelete={onDelete} initialData={selectedEvent} initialDate={modalDate} dark={dark}/>
    </div>
  );
}
