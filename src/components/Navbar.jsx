import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Bell, LogOut, Sun, Moon, LogIn } from 'lucide-react';
import { useGoogleCalendar } from '../context/GoogleCalendarContext';
import { useDarkMode } from '../context/DarkModeContext';
import { TulipSidebarDeco, TulipIcon } from './TulipGarden';

const navItems = [
  { to: '/',              icon: LayoutDashboard, label: 'Inicio'        },
  { to: '/calendario',    icon: Calendar,        label: 'Calendario'    },
  { to: '/recordatorios', icon: Bell,            label: 'Recordatorios' },
];

/* Avatar: shows the first initial on a gradient circle */
function InitialAvatar({ name, size = 34, fontSize = 15 }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const hasName = !!name;
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 select-none"
      style={{
        width: size, height: size,
        background: hasName
          ? 'linear-gradient(135deg,#FF8FAF,#E8314F)'
          : 'rgba(232,49,79,0.12)',
        border: '2px solid rgba(232,49,79,0.25)',
        boxShadow: hasName ? '0 2px 12px rgba(232,49,79,0.30)' : 'none',
      }}
    >
      <span style={{
        color: hasName ? 'white' : '#E8314F',
        fontSize, fontWeight: 700,
        fontFamily: '"Playfair Display",Georgia,serif',
        lineHeight: 1,
      }}>
        {initial}
      </span>
    </div>
  );
}

export default function Navbar() {
  const { isSignedIn, signIn, signOut, signOutLocal, userProfile, isConfigured, gapiInited, gisInited } = useGoogleCalendar();
  const { dark, toggle } = useDarkMode();

  const canAuth     = gapiInited && gisInited && isConfigured;
  const name        = userProfile?.name || '';
  const displayName = name || 'Mi cuenta';

  const sidebarBg  = dark ? 'linear-gradient(180deg,#130B1A 0%,#0F0A14 60%,#0A0D08 100%)' : 'linear-gradient(180deg,#FAF0F4 0%,#FFF5F7 60%,#F5F0FF 100%)';
  const borderClr  = dark ? 'rgba(232,49,79,0.12)' : 'rgba(232,49,79,0.10)';
  const textMain   = dark ? '#F0E8F4' : '#1A1220';
  const textSub    = dark ? 'rgba(240,232,244,0.42)' : 'rgba(26,18,32,0.42)';
  const sectionBg  = dark ? 'rgba(232,49,79,0.08)' : 'rgba(232,49,79,0.05)';
  const sectionBdr = dark ? 'rgba(232,49,79,0.16)' : 'rgba(232,49,79,0.10)';

  return (
    <>
      {/* ══ Desktop sidebar ══ */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 z-40 overflow-hidden transition-colors duration-300"
        style={{ background: sidebarBg, borderRight: `1px solid ${borderClr}` }}>

        {/* Brand */}
        <div className="px-6 pt-7 pb-5">
          <div className="flex items-center gap-2.5">
            <TulipIcon size={30} color="#E8314F" />
            <div>
              <h1 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontSize:'1.35rem', fontWeight:600, color:textMain, fontStyle:'italic', lineHeight:1.1 }}>
                Tulipán
              </h1>
              <p style={{ fontFamily:'"Dancing Script",cursive', fontSize:'0.72rem', color:'#E8314F', opacity:0.75, letterSpacing:'0.05em' }}>
                tu jardín de días
              </p>
            </div>
          </div>
        </div>

        <div className="mx-5 h-px mb-5" style={{ background: borderClr }} />

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 flex-1">
          <p className="section-label px-3 mb-2">navegación</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}>
              <Icon size={18} strokeWidth={2} />{label}
            </NavLink>
          ))}
        </nav>

        {/* Tulip deco */}
        <TulipSidebarDeco className="w-full opacity-80" />

        {/* Bottom controls */}
        <div className="px-4 pb-5 space-y-2 mt-1">

          {/* Dark mode toggle */}
          <button onClick={toggle}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-200"
            style={{ background: sectionBg, border: `1px solid ${sectionBdr}` }}>
            {dark ? <Sun size={16} className="text-tulip-400 flex-shrink-0" /> : <Moon size={16} className="text-tulip-500 flex-shrink-0" />}
            <span className="text-sm font-bold flex-1 text-left" style={{ color: dark?'#FF8FAF':'#C9183A' }}>
              {dark ? 'Modo claro' : 'Modo oscuro'}
            </span>
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0 ${dark?'bg-tulip-500':'bg-tulip-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${dark?'translate-x-5 left-0.5':'left-0.5'}`} />
            </div>
          </button>

          {/* User section */}
          {isSignedIn ? (
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${sectionBdr}` }}>
              <div className="flex items-center gap-2.5 px-3 py-2.5" style={{ background: sectionBg }}>
                <InitialAvatar name={name} size={34} fontSize={15} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-tulip-400 leading-tight">Conectada como</p>
                  <p className="text-sm font-bold truncate leading-tight" style={{ color: textMain }}>
                    {displayName}
                  </p>
                </div>
              </div>
              <button onClick={signOut}
                className="w-full flex items-center gap-2 px-4 py-2 transition-colors duration-200 hover:bg-red-50"
                style={{ borderTop: `1px solid ${sectionBdr}` }}>
                <LogOut size={14} className="text-red-400 flex-shrink-0" />
                <span className="text-sm font-bold text-red-400">Cerrar sesión</span>
              </button>
            </div>
          ) : isConfigured ? (
            <button onClick={signIn} disabled={!canAuth}
              className="w-full btn-primary flex items-center justify-center gap-2 text-sm disabled:opacity-50">
              <LogIn size={16} /> Entrar con Google
            </button>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${sectionBdr}` }}>
              <div className="flex items-center gap-2.5 px-3 py-2.5" style={{ background: sectionBg }}>
                <InitialAvatar name="" size={34} fontSize={15} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-tulip-400 leading-tight">Modo local</p>
                  <p className="text-sm font-bold leading-tight" style={{ color: textMain }}>Sin cuenta</p>
                </div>
              </div>
              <button onClick={signOutLocal}
                className="w-full flex items-center gap-2 px-4 py-2 transition-colors duration-200 hover:bg-red-50"
                style={{ borderTop: `1px solid ${sectionBdr}` }}>
                <LogOut size={14} className="text-red-400 flex-shrink-0" />
                <span className="text-sm font-bold text-red-400">Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ══ Mobile bottom nav ══ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 transition-colors duration-300"
        style={{ background: dark?'rgba(15,10,20,0.96)':'rgba(255,245,247,0.96)', backdropFilter:'blur(16px)', borderTop:`1px solid ${borderClr}` }}>
        <div className="flex justify-around items-center h-16 px-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all duration-200 min-w-[48px]
                 ${isActive ? 'text-tulip-500' : dark?'text-white/30':'text-night-800/35'}`}>
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl ${isActive?'bg-tulip-100':''}`}>
                    <Icon size={19} strokeWidth={isActive?2.5:1.8} />
                  </div>
                  <span className="text-[9px] font-bold tracking-wide uppercase">{label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Dark mode toggle */}
          <button onClick={toggle}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all min-w-[48px] ${dark?'text-tulip-400':'text-night-800/35'}`}>
            <div className="p-1.5 rounded-xl">
              {dark ? <Sun size={19} strokeWidth={1.8}/> : <Moon size={19} strokeWidth={1.8}/>}
            </div>
            <span className="text-[9px] font-bold tracking-wide uppercase">{dark?'Claro':'Oscuro'}</span>
          </button>

          {/* Sign out */}
          <button
            onClick={isSignedIn ? signOut : signOutLocal}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all min-w-[48px] ${dark?'text-white/30':'text-night-800/35'} hover:text-red-400`}>
            <div className="p-1 rounded-xl">
              {isSignedIn
                ? <InitialAvatar name={name} size={22} fontSize={10} />
                : <LogOut size={19} strokeWidth={1.8}/>}
            </div>
            <span className="text-[9px] font-bold tracking-wide uppercase">Salir</span>
          </button>
        </div>
      </nav>
    </>
  );
}
