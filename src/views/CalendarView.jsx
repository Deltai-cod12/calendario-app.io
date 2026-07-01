import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useGoogleCalendar } from '../context/GoogleCalendarContext';
import { useDarkMode } from '../context/DarkModeContext';
import { MONTHS_ES, DAYS_ES, getDaysInMonth, getFirstDayOfMonth, isSameDay, getEventsForDay, formatTime } from '../utils/dateUtils';
import EventModal from '../components/EventModal';
import EventCard from '../components/EventCard';
import { TulipIcon } from '../components/TulipGarden';

export default function CalendarView() {
  const { events, createEvent, updateEvent, deleteEvent, isLoading } = useGoogleCalendar();
  const { dark } = useDarkMode();
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay,   setSelectedDay]   = useState(null);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dayPanelOpen,  setDayPanelOpen]  = useState(false);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth);

  const prev = () => { if(viewMonth===0){setViewYear(y=>y-1);setViewMonth(11);}else setViewMonth(m=>m-1); };
  const next = () => { if(viewMonth===11){setViewYear(y=>y+1);setViewMonth(0);}else setViewMonth(m=>m+1); };

  const cells = [];
  for(let i=0;i<firstDay;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);
  const totalCells = Math.ceil((firstDay+daysInMonth)/7)*7;

  const onDayClick    = (day)  => { setSelectedDay(new Date(viewYear,viewMonth,day)); setDayPanelOpen(true); };
  const onEventClick  = (evt)  => { setSelectedEvent(evt); setModalOpen(true); };
  const onSave        = async (d) => { if(selectedEvent) await updateEvent(selectedEvent.id,d); else await createEvent(d); };
  const onDelete      = async (id) => { await deleteEvent(id); setDayPanelOpen(false); };

  const selDayEvts = selectedDay
    ? getEventsForDay(events, selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate())
    : [];

  const cardBg   = dark ? 'rgba(25,16,34,0.98)' : 'white';
  const border   = dark ? 'rgba(232,49,79,0.14)' : 'rgba(232,49,79,0.09)';
  const textMain = dark ? '#F0E8F4' : '#1A1220';
  const textSub  = dark ? 'rgba(240,232,244,0.35)' : 'rgba(26,18,32,0.35)';
  const cellBg   = dark ? 'rgba(18,10,26,0.6)'  : 'white';
  const cellAlt  = dark ? 'rgba(232,49,79,0.04)' : 'rgba(232,49,79,0.02)';
  const cellSel  = dark ? 'rgba(232,49,79,0.10)' : 'rgba(232,49,79,0.04)';
  const cellHov  = dark ? 'rgba(232,49,79,0.08)' : 'rgba(232,49,79,0.03)';
  const divider  = dark ? 'rgba(232,49,79,0.09)' : 'rgba(232,49,79,0.07)';

  return (
    <div className="animate-fade-in flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={prev} className="p-2 rounded-xl hover:bg-tulip-100 transition-colors" style={{color:textSub}}>
            <ChevronLeft size={20}/>
          </button>
          <div className="text-center min-w-[155px]">
            <h2 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'1.6rem', fontWeight:600, color:textMain, lineHeight:1.1 }}>
              {MONTHS_ES[viewMonth]}
            </h2>
            <p className="text-xs" style={{color:textSub}}>{viewYear}</p>
          </div>
          <button onClick={next} className="p-2 rounded-xl hover:bg-tulip-100 transition-colors" style={{color:textSub}}>
            <ChevronRight size={20}/>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>{setViewYear(today.getFullYear());setViewMonth(today.getMonth());}} className="btn-ghost text-sm py-2 px-4 hidden sm:block">Hoy</button>
          <button onClick={()=>{setSelectedEvent(null);setSelectedDay(today);setModalOpen(true);}} className="btn-primary flex items-center gap-1.5 text-sm">
            <Plus size={16}/> <span className="hidden sm:inline">Nuevo evento</span><span className="sm:hidden">+</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-1">
          <TulipIcon size={15} color="#E8314F" className="animate-float"/>
          <p className="text-tulip-400 text-sm animate-pulse">Cargando eventos...</p>
        </div>
      )}

      {/* Grid */}
      <div className="rounded-3xl overflow-hidden shadow-card" style={{background:cardBg, border:`1px solid ${border}`}}>
        {/* Day headers */}
        <div className="grid grid-cols-7" style={{borderBottom:`1px solid ${divider}`}}>
          {DAYS_ES.map(d=>(
            <div key={d} className="section-label text-center py-3">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((day,i)=>{
            if(!day) return <div key={`e-${i}`} className="min-h-[88px] md:min-h-[108px]" style={{background:cellAlt, borderBottom:`1px solid ${divider}`, borderRight:`1px solid ${divider}`}}/>;
            const date    = new Date(viewYear,viewMonth,day);
            const isT     = isSameDay(date,today);
            const dayEvts = getEventsForDay(events,viewYear,viewMonth,day);
            const isSel   = selectedDay && isSameDay(date,selectedDay);
            const isWknd  = date.getDay()===0||date.getDay()===6;
            const isLastC = (firstDay+day-1)%7===6;
            return (
              <div key={day} onClick={()=>onDayClick(day)}
                className="min-h-[88px] md:min-h-[108px] p-1.5 cursor-pointer transition-all duration-150"
                style={{
                  background: isSel ? cellSel : isWknd ? cellAlt : cellBg,
                  borderBottom:`1px solid ${divider}`,
                  borderRight: isLastC?'none':`1px solid ${divider}`,
                }}
                onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background=cellHov; }}
                onMouseLeave={e=>{ if(!isSel) e.currentTarget.style.background=isSel?cellSel:isWknd?cellAlt:cellBg; }}
              >
                <div className="flex justify-end mb-1">
                  <span className="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full"
                    style={{ background:isT?'#E8314F':undefined, color:isT?'white':textSub,
                      boxShadow:isT?'0 2px 8px rgba(232,49,79,0.35)':undefined }}>
                    {day}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {dayEvts.slice(0,3).map(evt=>(
                    <div key={evt.id}
                      onClick={e=>{e.stopPropagation();onEventClick(evt);}}
                      className="text-[10px] md:text-xs px-1.5 py-0.5 rounded-md truncate text-white font-bold cursor-pointer hover:opacity-75 transition-opacity"
                      style={{background:evt.color||'#E8314F'}}>
                      {!evt.allDay&&<span className="opacity-70 mr-0.5">{formatTime(evt.start).replace(' AM','a').replace(' PM','p')}</span>}
                      {evt.title}
                    </div>
                  ))}
                  {dayEvts.length>3&&<div className="text-[10px] font-bold px-1.5" style={{color:'#E8314F'}}>+{dayEvts.length-3}</div>}
                </div>
              </div>
            );
          })}
          {Array.from({length:totalCells-(firstDay+daysInMonth)},(_,i)=>(
            <div key={`t-${i}`} className="min-h-[88px] md:min-h-[108px]"
              style={{background:cellAlt,borderBottom:`1px solid ${divider}`,borderRight:`1px solid ${divider}`}}/>
          ))}
        </div>
      </div>

      {/* Day panel */}
      {dayPanelOpen && selectedDay && (
        <div className="fixed inset-0 z-40 md:relative md:inset-auto">
          <div className="absolute inset-0 md:hidden" style={{background:'rgba(15,10,20,0.3)',backdropFilter:'blur(4px)'}} onClick={()=>setDayPanelOpen(false)}/>
          <div className="absolute bottom-0 left-0 right-0 md:relative md:bottom-auto animate-slide-up rounded-t-3xl md:rounded-3xl overflow-hidden"
            style={{background:cardBg,border:`1px solid ${border}`,boxShadow:'0 -8px 40px rgba(15,10,20,0.18)'}}>
            <div className="h-1" style={{background:'linear-gradient(90deg,#FFB3C6,#E8314F,#C9183A)'}}/>
            <div className="flex items-center justify-between px-5 py-4" style={{borderBottom:`1px solid ${divider}`}}>
              <h3 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontWeight:600, color:textMain, fontSize:'0.95rem', textTransform:'capitalize' }}>
                {selectedDay.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={()=>{setSelectedEvent(null);setModalOpen(true);}} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                  <Plus size={13}/> Agregar
                </button>
                <button onClick={()=>setDayPanelOpen(false)} className="p-1.5 rounded-xl hover:bg-tulip-100 transition-colors" style={{color:textSub}}>
                  <X size={16}/>
                </button>
              </div>
            </div>
            <div className="p-4 max-h-[50vh] md:max-h-[260px] overflow-y-auto">
              {selDayEvts.length===0
                ? <div className="text-center py-8"><p className="text-3xl mb-2 animate-float">🌷</p><p className="text-sm font-medium" style={{color:textSub}}>Sin eventos este día</p></div>
                : <div className="space-y-2">{selDayEvts.map(e=><EventCard key={e.id} event={e} onClick={onEventClick} compact dark={dark}/>)}</div>
              }
            </div>
          </div>
        </div>
      )}

      <EventModal isOpen={modalOpen} onClose={()=>{setModalOpen(false);setSelectedEvent(null);}}
        onSave={onSave} onDelete={onDelete} initialData={selectedEvent} initialDate={selectedEvent?null:(selectedDay||today)} dark={dark}/>
    </div>
  );
}
