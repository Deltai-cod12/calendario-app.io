import React from 'react';
import { Clock, AlignLeft, Repeat } from 'lucide-react';
import { formatTime, formatDateShort, isToday } from '../utils/dateUtils';

export default function EventCard({ event, onClick, compact = false }) {
  const timeStr = formatTime(event.start);
  const dateStr = formatDateShort(event.start);
  const todayEvt = isToday(event.start);
  const accentColor = event.color || '#E8314F';

  if (compact) {
    return (
      <button
        onClick={() => onClick && onClick(event)}
        className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-tulip-50 transition-all group"
      >
        <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-night-800 truncate group-hover:text-tulip-600 transition-colors">{event.title}</p>
          <p className="text-xs text-night-800/40 font-light">{event.allDay ? 'Todo el día' : timeStr}</p>
        </div>
        {!todayEvt && (
          <span className="text-xs font-semibold text-tulip-400 flex-shrink-0 bg-tulip-50 px-2 py-0.5 rounded-lg">
            {dateStr}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick && onClick(event)}
      className="w-full text-left group rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-deep"
      style={{ border: '1px solid rgba(232,49,79,0.10)', background: 'white' }}
    >
      {/* Color bar top */}
      <div className="h-0.5 w-full" style={{ backgroundColor: accentColor }} />
      <div className="px-4 py-3 flex items-start gap-3">
        {/* Time badge */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl text-white text-xs font-bold" style={{ background: `${accentColor}18`, color: accentColor }}>
          {event.allDay ? (
            <span className="text-[9px] font-bold uppercase tracking-wide">Todo<br/>el día</span>
          ) : (
            <>
              <span className="text-sm font-black leading-none">{formatTime(event.start).split(':')[0]}</span>
              <span className="text-[9px] opacity-70">{timeStr.split(' ')[1]}</span>
            </>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-night-800 truncate group-hover:text-tulip-600 transition-colors">{event.title}</p>
          {event.description && (
            <p className="text-xs text-night-800/40 mt-0.5 line-clamp-1 flex items-center gap-1">
              <AlignLeft size={10} className="flex-shrink-0" />
              {event.description}
            </p>
          )}
          {!todayEvt && (
            <p className="text-xs font-semibold text-tulip-400 mt-0.5">{dateStr}</p>
          )}
        </div>
      </div>
    </button>
  );
}
