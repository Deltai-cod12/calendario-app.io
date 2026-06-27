import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useGoogleCalendar } from '../context/GoogleCalendarContext';
import { MONTHS_ES, DAYS_ES, getDaysInMonth, getFirstDayOfMonth, isSameDay, getEventsForDay, formatTime } from '../utils/dateUtils';
import EventModal from '../components/EventModal';
import EventCard from '../components/EventCard';
import { TulipIcon } from '../components/TulipGarden';

export default function CalendarView() {
  const { events, createEvent, updateEvent, deleteEvent, isLoading } = useGoogleCalendar();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dayPanelOpen, setDayPanelOpen] = useState(false);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => { if (viewMonth===0){setViewYear(y=>y-1);setViewMonth(11);}else setViewMonth(m=>m-1); };
  const nextMonth = () => { if (viewMonth===11){setViewYear(y=>y+1);setViewMonth(0);}else setViewMonth(m=>m+1); };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const handleDayClick = (day) => { setSelectedDay(new Date(viewYear, viewMonth, day)); setDayPanelOpen(true); };
  const handleEventClick = (event) => { setSelectedEvent(event); setModalOpen(true); };
  const handleSave = async (data) => { if (selectedEvent) await updateEvent(selectedEvent.id, data); else await createEvent(data); };
  const handleDelete = async (id) => { await deleteEvent(id); setDayPanelOpen(false); };

  const selectedDayEvents = selectedDay
    ? getEventsForDay(events, selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate())
    : [];

  // Calculate weeks for the grid
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  return (
    <div className="animate-fade-in flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-tulip-100 transition-colors text-night-800/50 hover:text-tulip-500">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center min-w-[160px]">
            <h2 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'1.6rem', fontWeight:600, color:'#1A1220', lineHeight:1.1 }}>
              {MONTHS_ES[viewMonth]}
            </h2>
            <p className="text-night-800/40 text-sm">{viewYear}</p>
          </div>
          <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-tulip-100 transition-colors text-night-800/50 hover:text-tulip-500">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }} className="btn-ghost text-sm py-2 px-4 hidden sm:block">
            Hoy
          </button>
          <button
            onClick={() => { setSelectedEvent(null); setSelectedDay(today); setModalOpen(true); }}
            className="btn-primary flex items-center gap-1.5 text-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nuevo evento</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-2">
          <TulipIcon size={16} color="#E8314F" className="animate-float" />
          <p className="text-tulip-400 text-sm font-medium animate-pulse">Cargando eventos...</p>
        </div>
      )}

      {/* Calendar */}
      <div className="card p-0 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-tulip-100">
          {DAYS_ES.map(d => (
            <div key={d} className="section-label text-center py-3">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return (
              <div key={`e-${i}`} className="min-h-[88px] md:min-h-[110px] border-b border-r border-tulip-50 bg-tulip-50/30" />
            );
            const date = new Date(viewYear, viewMonth, day);
            const isToday = isSameDay(date, today);
            const dayEvts = getEventsForDay(events, viewYear, viewMonth, day);
            const isSelected = selectedDay && isSameDay(date, selectedDay);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const col = (firstDay + day - 1) % 7;
            const isLastCol = col === 6;

            return (
              <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`min-h-[88px] md:min-h-[110px] p-1.5 cursor-pointer transition-all duration-150
                  border-b border-r border-tulip-50
                  ${isLastCol ? 'border-r-0' : ''}
                  ${isSelected ? 'bg-tulip-50' : isWeekend ? 'bg-tulip-50/20' : 'bg-white'}
                  hover:bg-tulip-50/60`}
              >
                {/* Day number */}
                <div className="flex justify-end mb-1">
                  <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors
                    ${isToday ? 'bg-tulip-500 text-white shadow-petal' : 'text-night-800/60'}`}>
                    {day}
                  </span>
                </div>

                {/* Events */}
                <div className="space-y-0.5">
                  {dayEvts.slice(0, 3).map(evt => (
                    <div
                      key={evt.id}
                      onClick={e => { e.stopPropagation(); handleEventClick(evt); }}
                      className="text-[10px] md:text-xs px-1.5 py-0.5 rounded-md truncate text-white font-bold cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: evt.color || '#E8314F' }}
                    >
                      {!evt.allDay && <span className="opacity-70 mr-0.5">{formatTime(evt.start).replace(' AM','a').replace(' PM','p')}</span>}
                      {evt.title}
                    </div>
                  ))}
                  {dayEvts.length > 3 && (
                    <div className="text-[10px] text-tulip-500 font-bold px-1.5">+{dayEvts.length-3}</div>
                  )}
                </div>
              </div>
            );
          })}
          {/* Fill remaining cells */}
          {Array.from({ length: totalCells - (firstDay + daysInMonth) }).map((_, i) => (
            <div key={`tail-${i}`} className="min-h-[88px] md:min-h-[110px] border-b border-r border-tulip-50 bg-tulip-50/20" />
          ))}
        </div>
      </div>

      {/* Day panel */}
      {dayPanelOpen && selectedDay && (
        <div className="fixed inset-0 z-40 md:relative md:inset-auto">
          <div className="absolute inset-0 bg-night-900/25 backdrop-blur-sm md:hidden" onClick={() => setDayPanelOpen(false)} />
          <div
            className="absolute bottom-0 left-0 right-0 md:relative md:bottom-auto animate-slide-up"
            style={{ background:'white', borderRadius:'1.75rem 1.75rem 0 0', boxShadow:'0 -8px 40px rgba(26,18,32,0.14)', border:'1px solid rgba(232,49,79,0.10)' }}
          >
            <div className="h-1 rounded-t-full" style={{ background:'linear-gradient(90deg,#FFB3C6,#E8314F,#C9183A)' }} />
            <div className="flex items-center justify-between px-5 py-4 border-b border-tulip-100">
              <h3 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontWeight:600, color:'#1A1220', fontSize:'1rem' }}>
                {selectedDay.toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' })}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setSelectedEvent(null); setModalOpen(true); }}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <Plus size={13} /> Agregar
                </button>
                <button onClick={() => setDayPanelOpen(false)} className="p-1.5 rounded-xl text-night-800/30 hover:bg-tulip-100">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="p-4 max-h-[50vh] md:max-h-[280px] overflow-y-auto">
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2 animate-float">🌷</p>
                  <p className="text-night-800/40 text-sm font-medium">Sin eventos este día</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDayEvents.map(e => <EventCard key={e.id} event={e} onClick={handleEventClick} compact />)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <EventModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedEvent(null); }}
        onSave={handleSave}
        onDelete={handleDelete}
        initialData={selectedEvent}
        initialDate={selectedEvent ? null : (selectedDay || today)}
      />
    </div>
  );
}
