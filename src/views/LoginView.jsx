import React, { useState } from 'react';
import { useGoogleCalendar } from '../context/GoogleCalendarContext';
import { TulipGardenFull, TulipIcon } from '../components/TulipGarden';
import { Sparkles, Mail, LogIn } from 'lucide-react';

export default function LoginView({ onContinueLocal }) {
  const { signIn, gapiInited, gisInited, isConfigured } = useGoogleCalendar();
  const canAuth = gapiInited && gisInited && isConfigured;
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    signIn();
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-night-900">

      {/* ── LEFT: Tulip Garden ── */}
      <div className="hidden lg:flex w-1/2 xl:w-[55%] relative">
        <TulipGardenFull className="w-full h-full" />

        {/* Overlay text on garden */}
        <div className="absolute inset-0 flex flex-col justify-center items-center z-10 px-12">
          {/* App brand */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TulipIcon size={36} color="#FF8FAF" />
              <span
                className="text-white/90 font-display text-4xl font-semibold italic tracking-wide"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
              >
                Tulipán
              </span>
            </div>
            <p
              className="text-tulip-200/70 text-sm font-light tracking-[0.2em] uppercase"
              style={{ fontFamily: '"Dancing Script", cursive', fontSize: '1rem', letterSpacing: '0.1em' }}
            >
              tu jardín de días
            </p>
          </div>

          {/* Quote card floating over garden */}
          <div
            className="rounded-3xl px-8 py-6 max-w-xs text-center animate-float"
            style={{
              background: 'rgba(10,6,14,0.55)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,143,175,0.2)',
            }}
          >
            <p
              className="text-white/90 text-lg leading-relaxed"
              style={{ fontFamily: '"Dancing Script", cursive', fontSize: '1.25rem' }}
            >
              "Donde florecen los tulipanes,<br />florece también el orden."
            </p>
            <div className="mt-3 flex justify-center">
              <div className="h-px w-12 bg-tulip-400/40" />
            </div>
            <p className="mt-2 text-tulip-300/50 text-xs tracking-widest uppercase">para ti</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Login form ── */}
      <div className="flex-1 flex flex-col justify-center relative overflow-hidden">
        {/* Background for right side */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #FAF0F4 0%, #FFF5F7 60%, #F8F0FF 100%)' }} />

        {/* Subtle petal decorations */}
        <div className="absolute top-8 right-8 opacity-20" style={{ transform: 'rotate(30deg)' }}>
          <svg width="40" height="52" viewBox="0 0 20 26" fill="none">
            <path d="M10 1 C5 4, 1 11, 3 18 C5 24, 15 26, 17 20 C19 14, 16 5, 10 1Z" fill="#E8314F" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-8 opacity-10" style={{ transform: 'rotate(-45deg) scale(1.5)' }}>
          <svg width="40" height="52" viewBox="0 0 20 26" fill="none">
            <path d="M10 1 C5 4, 1 11, 3 18 C5 24, 15 26, 17 20 C19 14, 16 5, 10 1Z" fill="#E8314F" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-6 opacity-10" style={{ transform: 'rotate(70deg) scale(0.8)' }}>
          <svg width="40" height="52" viewBox="0 0 20 26" fill="none">
            <path d="M10 1 C5 4, 1 11, 3 18 C5 24, 15 26, 17 20 C19 14, 16 5, 10 1Z" fill="#F5607A" />
          </svg>
        </div>

        {/* Mobile garden strip */}
        <div className="lg:hidden relative h-48 overflow-hidden">
          <TulipGardenFull className="w-full h-full" />
        </div>

        {/* Form content */}
        <div className="relative z-10 px-8 sm:px-16 py-12 flex flex-col max-w-md mx-auto w-full animate-slide-up">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TulipIcon size={28} color="#E8314F" />
              <span
                className="text-night-800 text-3xl font-semibold italic"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Tulipán
              </span>
            </div>
            <p className="text-tulip-400 text-sm tracking-wider" style={{ fontFamily: '"Dancing Script", cursive' }}>
              tu jardín de días
            </p>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <p className="section-label mb-2">bienvenida de nuevo</p>
            <h1
              className="text-night-800 leading-tight"
              style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '2.25rem', fontWeight: 600 }}
            >
              Tu jardín<br />
              <span className="italic text-tulip-500">te espera</span>
            </h1>
            <p className="mt-3 text-night-800/50 text-sm leading-relaxed font-light">
              Conecta con Google Calendar para sincronizar tus recordatorios y recibir avisos en tu correo automáticamente.
            </p>
          </div>

          {/* Sign in options */}
          <div className="space-y-4">
            {/* Google sign in */}
            {isConfigured ? (
              <button
                onClick={handleSignIn}
                disabled={!canAuth || loading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white transition-all duration-200 disabled:opacity-60 shadow-deep active:scale-95"
                style={{ background: 'linear-gradient(135deg, #E8314F 0%, #C9183A 100%)', boxShadow: '0 4px 24px rgba(232,49,79,0.35)' }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2 a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Conectando...
                  </span>
                ) : (
                  <>
                    {/* Google G icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="rgba(255,255,255,0.9)"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="rgba(255,255,255,0.8)"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="rgba(255,255,255,0.7)"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white"/>
                    </svg>
                    Entrar con Google
                  </>
                )}
              </button>
            ) : (
              <div className="w-full py-4 px-5 rounded-2xl bg-tulip-100 border border-tulip-200 text-center">
                <p className="text-tulip-600 text-sm font-semibold mb-1">🔧 Configuración pendiente</p>
                <p className="text-tulip-500/80 text-xs">Agrega tus credenciales de Google en el archivo .env</p>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-tulip-200/60" />
              <span className="text-xs text-tulip-300 font-medium tracking-widest uppercase">o</span>
              <div className="flex-1 h-px bg-tulip-200/60" />
            </div>

            {/* Continue without signing in */}
            <button
              onClick={onContinueLocal}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-tulip-600 border-2 border-tulip-200 hover:border-tulip-400 hover:bg-tulip-50 transition-all duration-200 active:scale-95"
            >
              <Sparkles size={18} />
              Continuar sin cuenta
            </button>
          </div>

          {/* Features hint */}
          <div className="mt-10 space-y-3">
            <p className="section-label mb-3">con google calendar obtienes</p>
            {[
              { icon: '📅', text: 'Sincronización en todos tus dispositivos' },
              { icon: '✉️', text: 'Recordatorios automáticos por correo' },
              { icon: '🔔', text: 'Notificaciones push en tu teléfono' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-tulip-100 flex items-center justify-center text-sm flex-shrink-0">
                  {f.icon}
                </div>
                <p className="text-night-800/60 text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
