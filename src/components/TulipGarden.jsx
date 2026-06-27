import React from 'react';

// Individual tulip component
function Tulip({ x, y, color1, color2, stemColor = '#4A7C59', scale = 1, swayClass = 'sway-1', flip = false }) {
  const s = scale;
  const flipX = flip ? -1 : 1;
  return (
    <g
      transform={`translate(${x}, ${y}) scale(${flipX * s}, ${s})`}
      className={`animate-sway origin-bottom`}
      style={{ animationDelay: swayClass === 'sway-1' ? '0s' : swayClass === 'sway-2' ? '0.6s' : swayClass === 'sway-3' ? '1.2s' : swayClass === 'sway-4' ? '0.3s' : '0.9s' }}
    >
      {/* Stem */}
      <path
        d={`M0,0 C-2,-${20*s} 2,-${40*s} 0,-${70*s}`}
        stroke={stemColor}
        strokeWidth={3*s}
        fill="none"
        strokeLinecap="round"
      />
      {/* Leaf */}
      <path
        d={`M-1,-${35*s} C-${15*s},-${45*s} -${18*s},-${55*s} -${8*s},-${52*s}`}
        stroke={stemColor}
        strokeWidth={2*s}
        fill={stemColor}
        fillOpacity="0.7"
        strokeLinecap="round"
      />
      {/* Tulip cup — outer petals */}
      <ellipse cx={0} cy={-80*s} rx={12*s} ry={18*s} fill={color1} opacity="0.95" />
      {/* Inner left petal */}
      <path
        d={`M0,-${70*s} C-${8*s},-${80*s} -${14*s},-${95*s} -${6*s},-${100*s} C-${2*s},-${104*s} 0,-${98*s} 0,-${90*s}`}
        fill={color2}
        opacity="0.9"
      />
      {/* Inner right petal */}
      <path
        d={`M0,-${70*s} C${8*s},-${80*s} ${14*s},-${95*s} ${6*s},-${100*s} C${2*s},-${104*s} 0,-${98*s} 0,-${90*s}`}
        fill={color2}
        opacity="0.9"
      />
      {/* Center petal */}
      <path
        d={`M0,-${72*s} C-${4*s},-${88*s} -${4*s},-${102*s} 0,-${108*s} C${4*s},-${102*s} ${4*s},-${88*s} 0,-${72*s}`}
        fill={color1}
        opacity="0.85"
      />
      {/* Highlight */}
      <ellipse cx={-3*s} cy={-88*s} rx={2*s} ry={5*s} fill="white" opacity="0.25" transform={`rotate(-15, ${-3*s}, ${-88*s})`} />
    </g>
  );
}

// Falling petal
function FallingPetal({ className, style, color = '#FFB3C6' }) {
  return (
    <div
      className={`absolute animate-petal-fall pointer-events-none select-none ${className}`}
      style={style}
    >
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
        <path
          d="M7 1 C3 3, 0 8, 2 13 C4 17, 10 18, 12 14 C14 10, 12 4, 7 1Z"
          fill={color}
          fillOpacity="0.75"
        />
        <path
          d="M7 1 C7 6, 7 12, 7 17"
          stroke="white"
          strokeWidth="0.5"
          strokeOpacity="0.4"
        />
      </svg>
    </div>
  );
}

// Ground / soil stripe
function Ground({ width, y }) {
  return (
    <g>
      <ellipse cx={width / 2} cy={y} rx={width * 0.6} ry={10} fill="#2D5E3E" opacity="0.18" />
      <rect x={0} y={y - 4} width={width} height={16} fill="#3D7A52" opacity="0.15" rx={4} />
    </g>
  );
}

// The full garden for the login screen (tall, dark background)
export function TulipGardenFull({ className = '' }) {
  const W = 420;
  const H = 700;
  const baseY = H - 30;

  const tulips = [
    // Back row (smaller, darker)
    { x: 50,  color1: '#C94060', color2: '#A01030', scale: 0.72, sw: 'sway-3', flip: false },
    { x: 120, color1: '#D4506A', color2: '#B03050', scale: 0.78, sw: 'sway-1', flip: true  },
    { x: 200, color1: '#B83060', color2: '#901040', scale: 0.68, sw: 'sway-4', flip: false },
    { x: 275, color1: '#C04070', color2: '#A02050', scale: 0.75, sw: 'sway-2', flip: false },
    { x: 360, color1: '#D84065', color2: '#B02045', scale: 0.70, sw: 'sway-5', flip: true  },

    // Mid row
    { x: 30,  color1: '#F5607A', color2: '#E8314F', scale: 0.92, sw: 'sway-2', flip: true  },
    { x: 100, color1: '#FF8FAF', color2: '#F5607A', scale: 0.95, sw: 'sway-4', flip: false },
    { x: 175, color1: '#E8314F', color2: '#C9183A', scale: 1.0,  sw: 'sway-1', flip: false },
    { x: 240, color1: '#FF7A9E', color2: '#E8415F', scale: 0.90, sw: 'sway-3', flip: true  },
    { x: 315, color1: '#F56080', color2: '#D83050', scale: 0.98, sw: 'sway-5', flip: false },
    { x: 385, color1: '#FF9BB8', color2: '#F07090', scale: 0.88, sw: 'sway-2', flip: true  },

    // Front row (largest)
    { x: 60,  color1: '#FF8FAF', color2: '#F07090', scale: 1.1,  sw: 'sway-5', flip: false },
    { x: 145, color1: '#E8314F', color2: '#A01030', scale: 1.15, sw: 'sway-2', flip: false },
    { x: 225, color1: '#FFB3C6', color2: '#F5607A', scale: 1.12, sw: 'sway-4', flip: true  },
    { x: 300, color1: '#F5607A', color2: '#C9183A', scale: 1.18, sw: 'sway-1', flip: false },
    { x: 375, color1: '#FF8FAF', color2: '#E8415F', scale: 1.08, sw: 'sway-3', flip: true  },
  ];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Dark garden sky */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0F0A14 0%, #1A1220 40%, #1A2510 80%, #0D1A09 100%)',
        }}
      />

      {/* Stars */}
      {[...Array(28)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: i % 4 === 0 ? 2 : 1,
            height: i % 4 === 0 ? 2 : 1,
            top: `${5 + (i * 137.5) % 55}%`,
            left: `${(i * 97.3) % 95}%`,
            opacity: 0.15 + (i % 5) * 0.12,
          }}
        />
      ))}

      {/* Soft moon glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 180,
          height: 180,
          top: -40,
          right: -30,
          background: 'radial-gradient(circle, rgba(255,240,220,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Garden SVG */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMax meet"
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      >
        {/* Grass layers */}
        <rect x={0} y={baseY - 10} width={W} height={50} fill="#1A3D28" rx={0} />
        <rect x={0} y={baseY + 5}  width={W} height={30} fill="#0D2418" />

        {/* Grass blades */}
        {[...Array(30)].map((_, i) => (
          <path
            key={i}
            d={`M${15 + i * 13},${ baseY - 5} C${14 + i * 13},${baseY - 20} ${18 + i * 13},${baseY - 22} ${17 + i * 13},${baseY - 8}`}
            stroke="#2D5E3E"
            strokeWidth="2"
            fill="none"
            opacity={0.5 + (i % 3) * 0.2}
          />
        ))}

        {/* All tulips — back to front */}
        {tulips.map((t, i) => (
          <Tulip
            key={i}
            x={t.x}
            y={baseY - (t.scale < 0.8 ? 10 : t.scale < 1 ? 5 : 0)}
            color1={t.color1}
            color2={t.color2}
            stemColor={t.scale < 0.8 ? '#2D5E3E' : '#4A7C59'}
            scale={t.scale}
            swayClass={t.sw}
            flip={t.flip}
          />
        ))}

        {/* Fireflies / glows */}
        {[
          { x: 80,  y: 450, r: 3, delay: '0s'   },
          { x: 210, y: 380, r: 2, delay: '1.5s'  },
          { x: 330, y: 420, r: 3, delay: '0.8s'  },
          { x: 160, y: 510, r: 2, delay: '2.2s'  },
          { x: 290, y: 490, r: 2, delay: '0.3s'  },
        ].map((f, i) => (
          <circle
            key={i}
            cx={f.x} cy={f.y} r={f.r}
            fill="#FFFACD"
            opacity="0"
            className="animate-float"
            style={{ animationDelay: f.delay, animationDuration: `${2.5 + i * 0.6}s` }}
          >
            <animate attributeName="opacity" values="0;0.7;0" dur={`${2.5 + i * 0.6}s`} repeatCount="indefinite" begin={f.delay} />
          </circle>
        ))}
      </svg>

      {/* Falling petals */}
      <FallingPetal className="petal-1 left-[15%]"  style={{ top: '-20px' }} color="#FF8FAF" />
      <FallingPetal className="petal-2 left-[45%]"  style={{ top: '-20px' }} color="#F5607A" />
      <FallingPetal className="petal-3 left-[72%]"  style={{ top: '-20px' }} color="#FFB3C6" />
      <FallingPetal className="petal-4 left-[28%]"  style={{ top: '-20px' }} color="#E8314F" />
      <FallingPetal className="petal-5 left-[85%]"  style={{ top: '-20px' }} color="#FF8FAF" />
    </div>
  );
}

// Compact decorative tulips for the sidebar
export function TulipSidebarDeco({ className = '' }) {
  const W = 220;
  const H = 160;
  const baseY = H - 10;
  const tulips = [
    { x: 30,  color1: '#FF8FAF', color2: '#F5607A', scale: 0.72, sw: 'sway-2', flip: false },
    { x: 80,  color1: '#E8314F', color2: '#A01030', scale: 0.85, sw: 'sway-1', flip: false },
    { x: 130, color1: '#FFB3C6', color2: '#F5607A', scale: 0.78, sw: 'sway-3', flip: true  },
    { x: 175, color1: '#F5607A', color2: '#C9183A', scale: 0.68, sw: 'sway-4', flip: false },
  ];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
        <rect x={0} y={baseY - 5} width={W} height={20} fill="#1A3D28" opacity="0.5" rx={4} />
        {[...Array(15)].map((_, i) => (
          <path
            key={i}
            d={`M${8 + i * 14},${baseY} C${7 + i * 14},${baseY - 12} ${11 + i * 14},${baseY - 14} ${10 + i * 14},${baseY - 4}`}
            stroke="#2D5E3E"
            strokeWidth="1.5"
            fill="none"
            opacity={0.6}
          />
        ))}
        {tulips.map((t, i) => (
          <Tulip key={i} x={t.x} y={baseY} color1={t.color1} color2={t.color2} stemColor="#4A7C59" scale={t.scale} swayClass={t.sw} flip={t.flip} />
        ))}
      </svg>
    </div>
  );
}

// Tiny inline tulip icon SVG
export function TulipIcon({ size = 24, color = '#E8314F', className = '' }) {
  const s = size / 24;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 22 C12 18 12 14 12 10" stroke="#4A7C59" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 16 C10 15 8 13 9 11 C10 9 12 10 12 12" stroke="#4A7C59" strokeWidth="1" fill="#4A7C59" fillOpacity="0.5" />
      <path d="M12 8 C10 6 9 3 11 2 C12 1.5 12 4 12 6" fill={color} />
      <path d="M12 8 C14 6 15 3 13 2 C12 1.5 12 4 12 6" fill={color} opacity="0.8" />
      <path d="M12 10 C9 9 7 7 8 5 C9 3 12 5 12 8" fill={color} opacity="0.7" />
      <path d="M12 10 C15 9 17 7 16 5 C15 3 12 5 12 8" fill={color} opacity="0.7" />
    </svg>
  );
}

// Scattered petals background decoration
export function PetalBackground({ count = 6, className = '' }) {
  const petals = [
    { top: '8%',  left: '3%',  rotate: 25,  scale: 0.9, color: '#FFB3C6', opacity: 0.4 },
    { top: '20%', right: '4%', rotate: -40, scale: 1.1, color: '#F5607A', opacity: 0.25 },
    { top: '55%', left: '1%',  rotate: 60,  scale: 0.7, color: '#FF8FAF', opacity: 0.3 },
    { top: '75%', right: '2%', rotate: -15, scale: 1.0, color: '#FFB3C6', opacity: 0.35 },
    { top: '40%', left: '92%', rotate: 80,  scale: 0.8, color: '#F5607A', opacity: 0.2 },
    { top: '88%', left: '8%',  rotate: -60, scale: 0.6, color: '#FF8FAF', opacity: 0.3 },
  ].slice(0, count);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {petals.map((p, i) => (
        <div key={i} className="absolute" style={{ top: p.top, left: p.left, right: p.right, transform: `rotate(${p.rotate}deg) scale(${p.scale})`, opacity: p.opacity }}>
          <svg width="20" height="26" viewBox="0 0 20 26" fill="none">
            <path d="M10 1 C5 4, 1 11, 3 18 C5 24, 15 26, 17 20 C19 14, 16 5, 10 1Z" fill={p.color} />
          </svg>
        </div>
      ))}
    </div>
  );
}
