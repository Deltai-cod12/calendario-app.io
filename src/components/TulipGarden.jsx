import React from 'react';

/* ── Single Tulip drawn at (x, y) where y = ground level ── */
function Tulip({ x, y, scale = 1, color1, color2, leafSide = 1, stemH = 90 }) {
  const s  = scale;
  const sh = stemH * s;
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Stem */}
      <path d={`M0,0 C${-3*s},${-sh*0.3} ${3*s},${-sh*0.7} 0,${-sh}`}
        stroke="#3A6B45" strokeWidth={2.5*s} fill="none" strokeLinecap="round"/>
      {/* Leaf */}
      <path d={`M0,${-sh*0.45} C${leafSide*18*s},${-sh*0.55} ${leafSide*22*s},${-sh*0.7} ${leafSide*12*s},${-sh*0.72}`}
        stroke="#3A6B45" strokeWidth={1.5*s} fill="#4A7C59" fillOpacity="0.75" strokeLinejoin="round"/>
      {/* Sepal */}
      <ellipse cx={0} cy={-sh} rx={7*s} ry={5*s} fill="#2D5E3E" opacity="0.9"/>
      {/* Outer left petal */}
      <path d={`M${-4*s},${-sh} C${-15*s},${-sh-10*s} ${-17*s},${-sh-28*s} ${-9*s},${-sh-38*s} C${-4*s},${-sh-43*s} ${-1*s},${-sh-36*s} 0,${-sh-28*s}`}
        fill={color1} opacity="0.93"/>
      {/* Outer right petal */}
      <path d={`M${4*s},${-sh} C${15*s},${-sh-10*s} ${17*s},${-sh-28*s} ${9*s},${-sh-38*s} C${4*s},${-sh-43*s} ${1*s},${-sh-36*s} 0,${-sh-28*s}`}
        fill={color1} opacity="0.93"/>
      {/* Inner left petal */}
      <path d={`M${-2*s},${-sh-2*s} C${-11*s},${-sh-14*s} ${-11*s},${-sh-33*s} ${-3*s},${-sh-45*s} C${-1*s},${-sh-48*s} ${1*s},${-sh-45*s} 0,${-sh-36*s}`}
        fill={color2} opacity="0.88"/>
      {/* Inner right petal */}
      <path d={`M${2*s},${-sh-2*s} C${11*s},${-sh-14*s} ${11*s},${-sh-33*s} ${3*s},${-sh-45*s} C${1*s},${-sh-48*s} ${-1*s},${-sh-45*s} 0,${-sh-36*s}`}
        fill={color2} opacity="0.88"/>
      {/* Centre petal */}
      <path d={`M0,${-sh-4*s} C${-5*s},${-sh-18*s} ${-5*s},${-sh-38*s} 0,${-sh-52*s} C${5*s},${-sh-38*s} ${5*s},${-sh-18*s} 0,${-sh-4*s}`}
        fill={color1} opacity="0.85"/>
      {/* Specular highlight */}
      <path d={`M${-2*s},${-sh-18*s} C${-1*s},${-sh-30*s} ${1*s},${-sh-37*s} ${2*s},${-sh-33*s}`}
        stroke="rgba(255,255,255,0.32)" strokeWidth={1.5*s} fill="none" strokeLinecap="round"/>
    </g>
  );
}

/* ── Firefly ── */
function Firefly({ cx, cy, r, delay, duration }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 3.5} fill="#FFFFE0" opacity="0">
        <animate attributeName="opacity" values="0;0.10;0" dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite"/>
      </circle>
      <circle cx={cx} cy={cy} r={r} fill="#FFFAAA" opacity="0">
        <animate attributeName="opacity" values="0;0.95;0.35;0.95;0" dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite"/>
      </circle>
    </g>
  );
}

/* ── Falling petal (DOM) ── */
function FallingPetal({ left, delay, duration, color, size = 12 }) {
  return (
    <div className="absolute pointer-events-none select-none animate-petal-fall"
      style={{ left, top: -(size * 2), animationDelay: `${delay}s`, animationDuration: `${duration}s` }}>
      <svg width={size} height={size * 1.4} viewBox="0 0 12 17" fill="none">
        <path d="M6 1C3 3.5 1 8 2.5 12.5C4 16.5 8 17 10 14C12 11 11 5 6 1Z" fill={color} fillOpacity="0.82"/>
        <path d="M6 1C6 5 6 10 6 16" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6"/>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FULL LOGIN GARDEN  — fills entire left panel
   ══════════════════════════════════════════════════════════ */
export function TulipGardenFull({ className = '' }) {
  // Use a wide viewBox so tulips spread edge-to-edge
  const W = 600, H = 800;
  const ground = H - 35;

  /* Tulips: spread across x = 0 … W
     Each row sorted back→front (smaller/darker first, painted first) */
  const tulips = [
    // ── Row 1 back: darkest, smallest, x covers full width ──
    { x:  20, s:0.55, c1:'#8C1A2E', c2:'#6A1022', ls: 1, sh:72 },
    { x:  78, s:0.58, c1:'#952030', c2:'#731525', ls:-1, sh:75 },
    { x: 138, s:0.53, c1:'#861828', c2:'#661020', ls: 1, sh:70 },
    { x: 198, s:0.60, c1:'#9E2535', c2:'#7C1828', ls:-1, sh:77 },
    { x: 258, s:0.56, c1:'#8A1C2C', c2:'#6A1220', ls: 1, sh:73 },
    { x: 318, s:0.59, c1:'#961E30', c2:'#741525', ls:-1, sh:76 },
    { x: 378, s:0.54, c1:'#881A2A', c2:'#681020', ls: 1, sh:71 },
    { x: 438, s:0.61, c1:'#A02238', c2:'#7E182C', ls:-1, sh:78 },
    { x: 498, s:0.57, c1:'#8E1C2E', c2:'#6C1222', ls: 1, sh:74 },
    { x: 558, s:0.55, c1:'#901E30', c2:'#701428', ls:-1, sh:72 },

    // ── Row 2 mid-back: medium size ──
    { x:  10, s:0.75, c1:'#C03050', c2:'#9A2040', ls:-1, sh:88 },
    { x:  68, s:0.80, c1:'#CC3858', c2:'#A82445', ls: 1, sh:93 },
    { x: 128, s:0.77, c1:'#C43255', c2:'#A01E42', ls:-1, sh:90 },
    { x: 188, s:0.82, c1:'#D03C5C', c2:'#AE2848', ls: 1, sh:95 },
    { x: 248, s:0.78, c1:'#C63658', c2:'#A42244', ls:-1, sh:91 },
    { x: 308, s:0.83, c1:'#D13E5E', c2:'#AF2A4A', ls: 1, sh:96 },
    { x: 368, s:0.76, c1:'#C23050', c2:'#A01E3E', ls:-1, sh:89 },
    { x: 428, s:0.81, c1:'#CB3A5A', c2:'#A92648', ls: 1, sh:94 },
    { x: 488, s:0.79, c1:'#C73455', c2:'#A52040', ls:-1, sh:92 },
    { x: 548, s:0.74, c1:'#BE2E4E', c2:'#9C1C3C', ls: 1, sh:87 },

    // ── Row 3 mid-front: brighter ──
    { x:  35, s:0.92, c1:'#E04060', c2:'#BC2A48', ls: 1, sh:105 },
    { x:  95, s:0.96, c1:'#E84A68', c2:'#C43450', ls:-1, sh:109 },
    { x: 155, s:0.93, c1:'#E24262', c2:'#BE2C4A', ls: 1, sh:106 },
    { x: 215, s:0.98, c1:'#EC4C6C', c2:'#C83654', ls:-1, sh:111 },
    { x: 275, s:0.94, c1:'#E44464', c2:'#C02E4C', ls: 1, sh:107 },
    { x: 335, s:0.97, c1:'#EB4A6A', c2:'#C73452', ls:-1, sh:110 },
    { x: 395, s:0.91, c1:'#DF3E5E', c2:'#BB2846', ls: 1, sh:104 },
    { x: 455, s:0.95, c1:'#E84868', c2:'#C43250', ls:-1, sh:108 },
    { x: 515, s:0.93, c1:'#E34262', c2:'#BF2C4A', ls: 1, sh:106 },
    { x: 572, s:0.90, c1:'#DC3C5C', c2:'#B82844', ls:-1, sh:103 },

    // ── Row 4 front: largest, brightest ──
    { x:  15, s:1.10, c1:'#F5607A', c2:'#D83A58', ls:-1, sh:118 },
    { x:  75, s:1.16, c1:'#FF6B85', c2:'#E04262', ls: 1, sh:124 },
    { x: 137, s:1.12, c1:'#F86280', c2:'#DA3C5C', ls:-1, sh:120 },
    { x: 198, s:1.18, c1:'#FF7090', c2:'#E44868', ls: 1, sh:126 },
    { x: 260, s:1.13, c1:'#F96485', c2:'#DB3E5E', ls:-1, sh:121 },
    { x: 322, s:1.17, c1:'#FF6E8E', c2:'#E34666', ls: 1, sh:125 },
    { x: 382, s:1.11, c1:'#F65E7C', c2:'#D83858', ls:-1, sh:119 },
    { x: 443, s:1.15, c1:'#FF6888', c2:'#E14060', ls: 1, sh:123 },
    { x: 503, s:1.12, c1:'#F86282', c2:'#DA3C5C', ls:-1, sh:120 },
    { x: 562, s:1.09, c1:'#F45C78', c2:'#D63655', ls: 1, sh:117 },
  ];

  // Fireflies spread across full garden
  const fireflies = [
    { cx: 50,  cy: 480, r:2.5, delay:0.0, duration:3.2 },
    { cx: 140, cy: 420, r:2.0, delay:1.4, duration:2.8 },
    { cx: 210, cy: 500, r:2.8, delay:0.7, duration:3.6 },
    { cx: 300, cy: 450, r:1.8, delay:2.1, duration:2.5 },
    { cx: 370, cy: 530, r:2.2, delay:0.3, duration:3.1 },
    { cx: 450, cy: 400, r:1.5, delay:1.8, duration:2.9 },
    { cx: 520, cy: 470, r:2.0, delay:0.9, duration:3.4 },
    { cx: 570, cy: 440, r:1.8, delay:2.5, duration:2.7 },
    { cx:  90, cy: 560, r:2.4, delay:1.1, duration:3.0 },
    { cx: 170, cy: 350, r:1.6, delay:0.5, duration:2.6 },
    { cx: 340, cy: 380, r:2.0, delay:1.6, duration:3.3 },
    { cx: 490, cy: 550, r:1.7, delay:0.2, duration:2.8 },
  ];

  // Stars across full viewBox width
  const stars = Array.from({ length: 55 }, (_, i) => ({
    x:     ((i * 109.3) % 96) + 2,
    y:     ((i * 73.7)  % 50) + 1,
    r:     i % 6 === 0 ? 1.3 : 0.75,
    op:    0.12 + (i % 7) * 0.08,
    blink: i % 4 === 0,
    dur:   1.8 + (i % 5) * 0.7,
  }));

  return (
    <div className={`relative overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(180deg,#05020F 0%,#0A0618 30%,#080F05 75%,#050C03 100%)' }}>

      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
        {stars.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.op}>
            {s.blink && <animate attributeName="opacity" values={`${s.op};${s.op*0.25};${s.op}`} dur={`${s.dur}s`} repeatCount="indefinite"/>}
          </circle>
        ))}
      </svg>

      {/* Moon glow */}
      <div className="absolute pointer-events-none" style={{
        width:220, height:220, top:-55, right:-35,
        background:'radial-gradient(circle,rgba(255,248,220,0.16) 0%,rgba(255,240,200,0.07) 40%,transparent 70%)',
        borderRadius:'50%',
      }}/>
      <div className="absolute pointer-events-none rounded-full" style={{
        width:72, height:72, top:22, right:28,
        background:'radial-gradient(circle,rgba(255,250,235,0.60) 0%,rgba(255,245,220,0.20) 55%,transparent 100%)',
        boxShadow:'0 0 28px 10px rgba(255,248,220,0.14)',
      }}/>

      {/* Main garden SVG — full width, bottom-anchored */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 left-0 w-full" style={{ height:'70%' }}>

        {/* Ground */}
        <rect x={0} y={ground} width={W} height={H-ground} fill="#060E06"/>
        <rect x={0} y={ground-3} width={W} height={7} fill="#173520" opacity="0.85"/>
        <ellipse cx={W/2} cy={ground+16} rx={W*0.75} ry={20} fill="#0A1A0A" opacity="0.7"/>

        {/* Grass blades across full width */}
        {Array.from({ length: 50 }, (_, i) => {
          const bx  = (i / 50) * W + 5;
          const bh  = 7 + (i % 6) * 3;
          const lean = (i % 3 - 1) * 4;
          return (
            <path key={i}
              d={`M${bx},${ground} C${bx+lean},${ground-bh*0.5} ${bx+lean*0.5},${ground-bh*0.8} ${bx+lean*0.3},${ground-bh}`}
              stroke={i%5===0?'#2D5E3E':'#1A3E28'} strokeWidth={i%6===0?2:1.4} fill="none" strokeLinecap="round" opacity={0.6+0.4*(i%3===0?1:0)}/>
          );
        })}

        {/* All tulips — back to front order (already sorted in array) */}
        {tulips.map((t, i) => (
          <Tulip key={i} x={t.x} y={ground} scale={t.s} color1={t.c1} color2={t.c2} leafSide={t.ls} stemH={t.sh}/>
        ))}

        {/* Fireflies */}
        {fireflies.map((f, i) => <Firefly key={i} {...f}/>)}
      </svg>

      {/* Falling petals — spread across width */}
      {[
        { left:'5%',  delay:0,   dur:9,   color:'#FF8FAF', size:13 },
        { left:'18%', delay:3.1, dur:11,  color:'#F5607A', size:11 },
        { left:'33%', delay:5.5, dur:8.5, color:'#FFB3C6', size:14 },
        { left:'50%', delay:1.2, dur:10,  color:'#E8314F', size:10 },
        { left:'65%', delay:7.2, dur:12,  color:'#FF8FAF', size:12 },
        { left:'78%', delay:4.0, dur:9.5, color:'#FFB3C6', size:11 },
        { left:'90%', delay:2.3, dur:8,   color:'#F5607A', size:13 },
        { left:'42%', delay:6.5, dur:10.5,color:'#FF8FAF', size:10 },
      ].map((p, i) => <FallingPetal key={i} {...p}/>)}
    </div>
  );
}

/* ── Compact sidebar deco ── */
export function TulipSidebarDeco({ className = '' }) {
  const W = 240, H = 130, ground = H - 12;
  const tulips = [
    { x:20,  s:0.60, c1:'#F5607A', c2:'#D83A55', ls:-1, sh:70 },
    { x:68,  s:0.70, c1:'#E8314F', c2:'#C01835', ls: 1, sh:80 },
    { x:116, s:0.66, c1:'#FF8FAF', c2:'#F5607A', ls:-1, sh:76 },
    { x:163, s:0.63, c1:'#F06078', c2:'#CC3858', ls: 1, sh:73 },
    { x:208, s:0.58, c1:'#E04060', c2:'#BC2040', ls:-1, sh:68 },
  ];
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height:130 }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax meet" width="100%" height="100%">
        <rect x={0} y={ground} width={W} height={H-ground+2} fill="#1A3520" opacity="0.4" rx={3}/>
        {Array.from({length:22},(_,i)=>{
          const bx=(i/22)*W+4; const bh=4+(i%5)*3; const lean=(i%3-1)*2;
          return <path key={i} d={`M${bx},${ground} C${bx+lean},${ground-bh*0.5} ${bx},${ground-bh*0.8} ${bx+lean*0.3},${ground-bh}`} stroke="#2D5E3E" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.65"/>;
        })}
        {tulips.map((t,i)=><Tulip key={i} x={t.x} y={ground} scale={t.s} color1={t.c1} color2={t.c2} leafSide={t.ls} stemH={t.sh}/>)}
      </svg>
    </div>
  );
}

/* ── Inline tulip icon ── */
export function TulipIcon({ size=24, color='#E8314F', className='' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 22 C12 17 12 13 12 9" stroke="#4A7C59" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 15 C10 14 8 12 9 10 C10 8 12 9 12 12" stroke="#4A7C59" strokeWidth="1.2" fill="#4A7C59" fillOpacity="0.5"/>
      <path d="M12 9 C8 7 6 3 8.5 1 C10 0 12 3 12 7"   fill={color} opacity="0.92"/>
      <path d="M12 9 C16 7 18 3 15.5 1 C14 0 12 3 12 7" fill={color} opacity="0.86"/>
      <path d="M12 10 C8 9 5 7 7 4 C8 2.5 12 5 12 8"   fill={color} opacity="0.76"/>
      <path d="M12 10 C16 9 19 7 17 4 C16 2.5 12 5 12 8" fill={color} opacity="0.76"/>
      <path d="M12 11 C11 8 11 4 12 1.5 C13 4 13 8 12 11" fill={color} opacity="0.68"/>
    </svg>
  );
}

/* ── Scattered petal background ── */
export function PetalBackground({ count=6, className='' }) {
  const petals = [
    { top:'6%',  left:'1%',   rot: 25,  sc:0.9, c:'#FFB3C6', op:0.35 },
    { top:'18%', right:'3%',  rot:-40,  sc:1.1, c:'#F5607A', op:0.20 },
    { top:'52%', left:'0%',   rot: 65,  sc:0.7, c:'#FF8FAF', op:0.25 },
    { top:'73%', right:'1%',  rot:-18,  sc:1.0, c:'#FFB3C6', op:0.30 },
    { top:'38%', left:'93%',  rot: 82,  sc:0.8, c:'#F5607A', op:0.18 },
    { top:'86%', left:'6%',   rot:-62,  sc:0.6, c:'#FF8FAF', op:0.28 },
  ].slice(0, count);
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {petals.map((p,i)=>(
        <div key={i} className="absolute" style={{top:p.top,left:p.left,right:p.right,transform:`rotate(${p.rot}deg) scale(${p.sc})`,opacity:p.op}}>
          <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
            <path d="M11 1C6 4 2 11 4 18C6 24 16 27 19 21C22 15 19 5 11 1Z" fill={p.c}/>
            <path d="M11 1C11 8 11 16 11 26" stroke="rgba(255,255,255,0.2)" strokeWidth="0.7"/>
          </svg>
        </div>
      ))}
    </div>
  );
}
