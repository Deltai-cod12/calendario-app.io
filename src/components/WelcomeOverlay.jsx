import React, { useState, useEffect, useRef } from 'react';
import { TulipIcon } from './TulipGarden';

/* Tiny floating tulip for the overlay */
function FloatingTulip({ style }) {
  return (
    <div className="absolute pointer-events-none select-none animate-float" style={style}>
      <TulipIcon size={28} color="#FF8FAF" />
    </div>
  );
}

/* Single petal element */
function Petal({ style }) {
  return (
    <div className="absolute pointer-events-none select-none animate-petal-fall" style={style}>
      <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
        <path d="M6 1C3.5 3 1 7 2.5 11C4 14.5 8 15 10 12.5C12 10 10.5 4 6 1Z"
          fill="#FF8FAF" fillOpacity="0.75" />
        <path d="M6 1C6 5 6 10 6 15" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

export default function WelcomeOverlay({ onSave }) {
  const [name,    setName]    = useState('');
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const inputRef = useRef(null);

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (visible) setTimeout(() => inputRef.current?.focus(), 300);
  }, [visible]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    // Animate out before saving
    setLeaving(true);
    setTimeout(() => onSave(name.trim()), 600);
  };

  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500"
      style={{ opacity: visible && !leaving ? 1 : 0, pointerEvents: leaving ? 'none' : 'auto' }}
    >
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0"
        style={{ backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', background: 'rgba(10,5,18,0.55)' }}
      />

      {/* Falling petals */}
      {[
        { left:'8%',  top:'-10px', animationDelay:'0s',   animationDuration:'8s'  },
        { left:'22%', top:'-10px', animationDelay:'2s',   animationDuration:'10s' },
        { left:'45%', top:'-10px', animationDelay:'0.8s', animationDuration:'7s'  },
        { left:'65%', top:'-10px', animationDelay:'3s',   animationDuration:'9s'  },
        { left:'82%', top:'-10px', animationDelay:'1.5s', animationDuration:'11s' },
        { left:'55%', top:'-10px', animationDelay:'4s',   animationDuration:'8.5s'},
      ].map((s, i) => <Petal key={i} style={s} />)}

      {/* Floating tulip decorations */}
      <FloatingTulip style={{ top:'12%', left:'8%',  animationDelay:'0s',   animationDuration:'3s',   opacity:0.5 }} />
      <FloatingTulip style={{ top:'15%', right:'9%', animationDelay:'1.2s', animationDuration:'3.8s', opacity:0.4 }} />
      <FloatingTulip style={{ bottom:'18%', left:'6%',  animationDelay:'0.6s', animationDuration:'4s', opacity:0.35 }} />
      <FloatingTulip style={{ bottom:'15%', right:'7%', animationDelay:'1.8s', animationDuration:'3.5s',opacity:0.45 }} />

      {/* Main card */}
      <div
        className="relative z-10 w-full max-w-sm mx-4 animate-bloom"
        style={{ borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 24px 80px rgba(10,5,18,0.5)' }}
      >
        {/* Gradient top strip */}
        <div style={{ height: 5, background: 'linear-gradient(90deg, #FFB3C6, #E8314F, #C9183A)' }} />

        {/* Dark garden scene at top */}
        <div
          className="relative overflow-hidden flex items-end justify-center"
          style={{ height: 160, background: 'linear-gradient(180deg,#05020F 0%,#0A0618 50%,#0C1A08 100%)' }}
        >
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{
                width: i % 4 === 0 ? 2 : 1, height: i % 4 === 0 ? 2 : 1,
                top: `${5 + (i * 137.5) % 60}%`, left: `${(i * 97.3) % 95}%`,
                opacity: 0.15 + (i % 5) * 0.12,
              }} />
          ))}

          {/* SVG tulips inside the card */}
          <svg viewBox="0 0 320 120" width="100%" height="120"
            preserveAspectRatio="xMidYMax meet" style={{ position:'absolute', bottom:0 }}>
            {/* Ground */}
            <rect x="0" y="102" width="320" height="20" fill="#081408" />
            <rect x="0" y="100" width="320" height="5" fill="#1A3520" opacity="0.9" />
            {/* Grass */}
            {Array.from({length:28},(_,i)=>{
              const bx=(i/28)*320+5, bh=5+(i%4)*3, lean=(i%3-1)*2;
              return <path key={i} d={`M${bx},102 C${bx+lean},${102-bh*0.5} ${bx},${102-bh*0.8} ${bx+lean*0.3},${102-bh}`}
                stroke={i%4===0?'#2D5E3E':'#1A3E28'} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.7"/>;
            })}
            {/* Tulips */}
            {[
              {x:18,  s:0.55, c1:'#A02235', c2:'#7A1525'}, {x:52,  s:0.70, c1:'#E8314F', c2:'#C01835'},
              {x:88,  s:0.62, c1:'#FF8FAF', c2:'#F5607A'}, {x:124, s:0.78, c1:'#F5607A', c2:'#D83A55'},
              {x:160, s:0.82, c1:'#E8314F', c2:'#A01030'}, {x:196, s:0.75, c1:'#FF8FAF', c2:'#E8314F'},
              {x:232, s:0.68, c1:'#F5607A', c2:'#C9183A'}, {x:268, s:0.72, c1:'#E8314F', c2:'#B02040'},
              {x:298, s:0.58, c1:'#C03050', c2:'#9A2040'},
            ].map((t,i) => {
              const {x,s,c1,c2} = t;
              const sh=80*s, ls=i%2===0?1:-1;
              return (
                <g key={i} transform={`translate(${x},102)`}>
                  <path d={`M0,0 C${-2*s},${-sh*0.3} ${2*s},${-sh*0.7} 0,${-sh}`} stroke="#3A6B45" strokeWidth={2*s} fill="none" strokeLinecap="round"/>
                  <path d={`M0,${-sh*0.45} C${ls*14*s},${-sh*0.55} ${ls*17*s},${-sh*0.7} ${ls*9*s},${-sh*0.72}`} stroke="#3A6B45" strokeWidth={1.3*s} fill="#4A7C59" fillOpacity="0.7"/>
                  <ellipse cx="0" cy={-sh} rx={6*s} ry={4*s} fill="#2D5E3E" opacity="0.9"/>
                  <path d={`M${-3*s},${-sh} C${-13*s},${-sh-9*s} ${-14*s},${-sh-24*s} ${-7*s},${-sh-33*s} C${-3*s},${-sh-37*s} 0,${-sh-30*s} 0,${-sh-24*s}`} fill={c1} opacity="0.93"/>
                  <path d={`M${3*s},${-sh} C${13*s},${-sh-9*s} ${14*s},${-sh-24*s} ${7*s},${-sh-33*s} C${3*s},${-sh-37*s} 0,${-sh-30*s} 0,${-sh-24*s}`} fill={c1} opacity="0.93"/>
                  <path d={`M0,${-sh-3*s} C${-4*s},${-sh-15*s} ${-4*s},${-sh-32*s} 0,${-sh-44*s} C${4*s},${-sh-32*s} ${4*s},${-sh-15*s} 0,${-sh-3*s}`} fill={c2} opacity="0.85"/>
                  <path d={`M${-1.5*s},${-sh-15*s} C${-1*s},${-sh-26*s} ${1*s},${-sh-31*s} ${1.5*s},${-sh-28*s}`} stroke="rgba(255,255,255,0.28)" strokeWidth={1.2*s} fill="none" strokeLinecap="round"/>
                </g>
              );
            })}
            {/* Fireflies */}
            {[{cx:60,cy:70,r:2},{cx:160,cy:55,r:1.8},{cx:255,cy:68,r:2.2}].map((f,i)=>(
              <circle key={i} cx={f.cx} cy={f.cy} r={f.r} fill="#FFFAAA" opacity="0">
                <animate attributeName="opacity" values="0;0.9;0.3;0.9;0" dur={`${2.5+i*0.8}s`} begin={`${i*1.1}s`} repeatCount="indefinite"/>
              </circle>
            ))}
          </svg>

          {/* App name over garden */}
          <div className="absolute top-5 left-0 right-0 flex flex-col items-center z-10">
            <div className="flex items-center gap-2">
              <TulipIcon size={22} color="#FF8FAF" />
              <span style={{ fontFamily:'"Playfair Display",Georgia,serif', color:'rgba(255,255,255,0.92)', fontSize:'1.25rem', fontWeight:600, fontStyle:'italic' }}>
                Tulipán
              </span>
            </div>
          </div>
        </div>

        {/* Form area */}
        <div style={{ background:'white', padding:'1.75rem 1.75rem 1.5rem' }}>
          <div className="text-center mb-5">
            {/* Avatar preview */}
            <div className="flex justify-center mb-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  background: initial
                    ? 'linear-gradient(135deg,#FF8FAF,#E8314F)'
                    : 'rgba(232,49,79,0.10)',
                  border: '3px solid rgba(232,49,79,0.20)',
                  boxShadow: initial ? '0 4px 20px rgba(232,49,79,0.30)' : 'none',
                }}
              >
                {initial ? (
                  <span style={{ color:'white', fontSize:'1.75rem', fontWeight:700, fontFamily:'"Playfair Display",Georgia,serif', lineHeight:1 }}>
                    {initial}
                  </span>
                ) : (
                  <TulipIcon size={28} color="#E8314F" />
                )}
              </div>
            </div>

            <h2 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'1.3rem', fontWeight:600, color:'#1A1220', marginBottom:4 }}>
              ¡Bienvenida a tu jardín!
            </h2>
            <p style={{ color:'rgba(26,18,32,0.50)', fontSize:'0.82rem', lineHeight:1.5 }}>
              ¿Cómo te llamas? Así te saludaremos cada día.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              ref={inputRef}
              className="input-field text-center font-bold text-base"
              placeholder="Tu nombre aquí..."
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={30}
              autoComplete="given-name"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full btn-primary py-3 text-base disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Entrar a mi jardín 🌷
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:'0.75rem', color:'rgba(232,49,79,0.45)', fontSize:'0.72rem' }}>
            Solo se guarda en este dispositivo
          </p>
        </div>
      </div>
    </div>
  );
}
