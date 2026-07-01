import React from 'react';
import { AlignLeft } from 'lucide-react';
import { formatTime, formatDateShort, isToday } from '../utils/dateUtils';

export default function EventCard({ event, onClick, compact = false, dark = false }) {
  const timeStr    = formatTime(event.start);
  const dateStr    = formatDateShort(event.start);
  const todayEvt   = isToday(event.start);
  const accent     = event.color || '#E8314F';
  const textMain   = dark ? '#F0E8F4' : '#1A1220';
  const textSub    = dark ? 'rgba(240,232,244,0.40)' : 'rgba(26,18,32,0.40)';
  const hoverBg    = dark ? 'rgba(232,49,79,0.08)' : 'rgba(232,49,79,0.05)';

  if (compact) {
    return (
      <button onClick={()=>onClick&&onClick(event)}
        className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all group"
        onMouseEnter={e=>e.currentTarget.style.background=hoverBg}
        onMouseLeave={e=>e.currentTarget.style.background=''}
      >
        <div className="w-1.5 h-7 rounded-full flex-shrink-0" style={{background:accent}}/>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{color:textMain}}>{event.title}</p>
          <p className="text-xs font-light" style={{color:textSub}}>{event.allDay?'Todo el día':timeStr}</p>
        </div>
        {!todayEvt && (
          <span className="text-xs font-bold flex-shrink-0 px-2 py-0.5 rounded-lg"
            style={{ color:accent, background:`${accent}18` }}>{dateStr}</span>
        )}
      </button>
    );
  }

  const cardBg = dark ? 'rgba(30,20,40,0.95)' : 'white';
  const cardBorder = dark ? 'rgba(232,49,79,0.14)' : 'rgba(232,49,79,0.10)';

  return (
    <button onClick={()=>onClick&&onClick(event)}
      className="w-full text-left rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background:cardBg, border:`1px solid ${cardBorder}`, boxShadow:'0 2px 12px rgba(26,18,32,0.06)' }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow='0 6px 24px rgba(26,18,32,0.14)'}
      onMouseLeave={e=>e.currentTarget.style.boxShadow='0 2px 12px rgba(26,18,32,0.06)'}
    >
      <div className="h-0.5 w-full" style={{background:accent}}/>
      <div className="px-4 py-3 flex items-start gap-3">
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-xl text-xs font-bold"
          style={{ background:`${accent}15`, color:accent }}>
          {event.allDay ? (
            <span className="text-[9px] font-bold uppercase tracking-wide text-center leading-tight">Todo<br/>el día</span>
          ) : (
            <>
              <span className="text-sm font-black leading-none">{formatTime(event.start).split(':')[0]}</span>
              <span className="text-[9px] opacity-70">{timeStr.includes('AM')?'AM':'PM'}</span>
            </>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate" style={{color:textMain}}>{event.title}</p>
          {event.description && (
            <p className="text-xs mt-0.5 line-clamp-1 flex items-center gap-1" style={{color:textSub}}>
              <AlignLeft size={10} className="flex-shrink-0"/>{event.description}
            </p>
          )}
          {!todayEvt && <p className="text-xs font-bold mt-0.5" style={{color:accent}}>{dateStr}</p>}
        </div>
      </div>
    </button>
  );
}
