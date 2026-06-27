import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Bell, LogOut, User, ChevronDown } from 'lucide-react';
import { useGoogleCalendar } from '../context/GoogleCalendarContext';
import { TulipSidebarDeco, TulipIcon } from './TulipGarden';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/calendario', icon: Calendar, label: 'Calendario' },
  { to: '/recordatorios', icon: Bell, label: 'Recordatorios' },
];

export default function Navbar() {
  const { isSignedIn, signOut, userName } = useGoogleCalendar();

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 z-40 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #FAF0F4 0%, #FFF5F7 60%, #F5F0FF 100%)', borderRight: '1px solid rgba(232,49,79,0.10)' }}
      >
        {/* Top: brand */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-2.5">
            <TulipIcon size={30} color="#E8314F" />
            <div>
              <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.35rem', fontWeight: 600, color: '#1A1220', fontStyle: 'italic', lineHeight: 1.1 }}>
                Tulipán
              </h1>
              <p style={{ fontFamily: '"Dancing Script", cursive', fontSize: '0.75rem', color: '#E8314F', opacity: 0.75, letterSpacing: '0.05em' }}>
                tu jardín de días
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-tulip-200/50 mb-5" />

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-3 flex-1">
          <p className="section-label px-3 mb-2">navegación</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Tulip deco */}
        <TulipSidebarDeco className="w-full" style={{ height: 130 }} />

        {/* User / sign out */}
        {isSignedIn && (
          <div className="px-4 pb-6">
            <div className="rounded-2xl p-3 flex items-center gap-3"
              style={{ background: 'rgba(232,49,79,0.06)', border: '1px solid rgba(232,49,79,0.12)' }}>
              <div className="w-8 h-8 rounded-full bg-tulip-100 flex items-center justify-center flex-shrink-0">
                <User size={15} className="text-tulip-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-tulip-400 font-medium">Conectada como</p>
                <p className="text-sm font-bold text-night-800 truncate">{userName || 'Mi cuenta'}</p>
              </div>
              <button onClick={signOut} className="p-1.5 rounded-xl hover:bg-tulip-100 transition-colors text-tulip-400 hover:text-tulip-600 flex-shrink-0" title="Cerrar sesión">
                <LogOut size={15} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-tulip-200/40">
        <div className="flex justify-around items-center h-16 px-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 min-w-[56px]
                 ${isActive ? 'text-tulip-500' : 'text-night-800/40 hover:text-tulip-400'}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-tulip-100' : ''}`}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className="text-[9px] font-bold tracking-wide uppercase">{label}</span>
                </>
              )}
            </NavLink>
          ))}
          {isSignedIn && (
            <button
              onClick={signOut}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-night-800/40 hover:text-tulip-400 transition-all min-w-[56px]"
            >
              <div className="p-1.5 rounded-xl">
                <LogOut size={20} strokeWidth={1.8} />
              </div>
              <span className="text-[9px] font-bold tracking-wide uppercase">Salir</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
