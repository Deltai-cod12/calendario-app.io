import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTHS_ES, DAYS_ES, getDaysInMonth, getFirstDayOfMonth, isSameDay, getEventsForDay } from '../utils/dateUtils';

export default function MiniCalendar({ events = [], onDayClick }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); } else setViewMonth(m => m-1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); } else setViewMonth(m => m+1); };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-xl hover:bg-tulip-100 transition-colors text-night-800/50 hover:text-tulip-500">
          <ChevronLeft size={16} />
        </button>
        <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: '#1A1220', fontSize: '0.9rem' }}>
          {MONTHS_ES[viewMonth]} {viewYear}
        </h3>
        <button onClick={nextMonth} className="p-1.5 rounded-xl hover:bg-tulip-100 transition-colors text-night-800/50 hover:text-tulip-500">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_ES.map(d => (
          <div key={d} className="text-center section-label py-1">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const date = new Date(viewYear, viewMonth, day);
          const isToday = isSameDay(date, today);
          const hasEvents = getEventsForDay(events, viewYear, viewMonth, day).length > 0;

          return (
            <button
              key={day}
              onClick={() => onDayClick && onDayClick(date)}
              className={`relative flex flex-col items-center py-1.5 rounded-xl transition-all duration-150 text-xs font-bold
                ${isToday
                  ? 'bg-tulip-500 text-white shadow-petal'
                  : 'hover:bg-tulip-100 text-night-800/70 hover:text-tulip-600'
                }`}
            >
              {day}
              {hasEvents && (
                <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isToday ? 'bg-white/70' : 'bg-tulip-400'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
