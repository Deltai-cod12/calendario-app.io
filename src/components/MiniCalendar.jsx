import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTHS_ES, DAYS_ES, getDaysInMonth, getFirstDayOfMonth, isSameDay, getEventsForDay } from '../utils/dateUtils';

export default function MiniCalendar({ events = [], onDayClick, dark = false }) {
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth);

  const prev = () => { if (viewMonth===0){setViewYear(y=>y-1);setViewMonth(11);}else setViewMonth(m=>m-1); };
  const next = () => { if (viewMonth===11){setViewYear(y=>y+1);setViewMonth(0);}else setViewMonth(m=>m+1); };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const textColor    = dark ? 'rgba(240,232,244,0.70)' : 'rgba(26,18,32,0.70)';
  const hoverBg      = dark ? 'rgba(232,49,79,0.12)' : '';

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-1.5 rounded-xl hover:bg-tulip-100 transition-colors" style={{color:textColor}}>
          <ChevronLeft size={16}/>
        </button>
        <h3 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontWeight:600, color: dark?'#F0E8F4':'#1A1220', fontSize:'0.88rem' }}>
          {MONTHS_ES[viewMonth]} {viewYear}
        </h3>
        <button onClick={next} className="p-1.5 rounded-xl hover:bg-tulip-100 transition-colors" style={{color:textColor}}>
          <ChevronRight size={16}/>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS_ES.map(d=>(
          <div key={d} className="section-label text-center py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day,i)=>{
          if (!day) return <div key={`e-${i}`}/>;
          const date = new Date(viewYear, viewMonth, day);
          const isToday    = isSameDay(date, today);
          const hasEvents  = getEventsForDay(events, viewYear, viewMonth, day).length > 0;
          return (
            <button key={day} onClick={()=>onDayClick&&onDayClick(date)}
              className="relative flex flex-col items-center py-1.5 rounded-xl transition-all duration-150 text-xs font-bold"
              style={{
                background: isToday ? '#E8314F' : undefined,
                color: isToday ? 'white' : textColor,
                boxShadow: isToday ? '0 2px 8px rgba(232,49,79,0.35)' : undefined,
              }}
              onMouseEnter={e=>{ if(!isToday) e.currentTarget.style.background=dark?'rgba(232,49,79,0.12)':'rgba(232,49,79,0.08)'; }}
              onMouseLeave={e=>{ if(!isToday) e.currentTarget.style.background=''; }}
            >
              {day}
              {hasEvents && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full"
                  style={{ background: isToday ? 'rgba(255,255,255,0.7)' : '#E8314F' }}/>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
