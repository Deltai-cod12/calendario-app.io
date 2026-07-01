import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { GoogleCalendarProvider, useGoogleCalendar } from './context/GoogleCalendarContext';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import CalendarView from './views/CalendarView';
import RemindersView from './views/RemindersView';
import LoginView from './views/LoginView';
import WelcomeOverlay from './components/WelcomeOverlay';
import { TulipIcon } from './components/TulipGarden';

function AuthSplash() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center"
      style={{ background:'linear-gradient(160deg,#060310 0%,#0D0820 50%,#0A1508 100%)' }}>
      <TulipIcon size={48} color="#FF8FAF" className="animate-float mb-4" />
      <p style={{ fontFamily:'"Playfair Display",Georgia,serif', color:'#FFB3C6', fontSize:'1.5rem', fontStyle:'italic' }}>
        Tulipán
      </p>
      <p className="text-tulip-400/50 text-xs mt-2 tracking-widest uppercase animate-pulse">
        cargando tu jardín...
      </p>
    </div>
  );
}

function AppShell() {
  const { isSignedIn, authReady, isConfigured, justLoggedOut, setJustLoggedOut, needsName, saveName } = useGoogleCalendar();
  const { dark } = useDarkMode();
  const [skipLogin, setSkipLogin] = useState(() => localStorage.getItem('skipLogin') === 'true');

  const handleContinueLocal = () => {
    localStorage.setItem('skipLogin', 'true');
    setSkipLogin(true);
    setJustLoggedOut(false);
  };

  useEffect(() => {
    if (justLoggedOut) setSkipLogin(false);
  }, [justLoggedOut]);

  // Show splash while Google scripts initialize (prevents flicker to login)
  if (isConfigured && !authReady) return <AuthSplash />;

  // Show login if configured, not signed in, and user hasn't chosen to skip
  const showLogin = isConfigured && !isSignedIn && !skipLogin;
  if (showLogin) return <LoginView onContinueLocal={handleContinueLocal} />;

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={dark
        ? { background:'linear-gradient(160deg,#0F0A14 0%,#150D1E 50%,#0A0F09 100%)' }
        : { background:'linear-gradient(160deg,#FFF5F7 0%,#FFFAF5 50%,#F9F5FF 100%)' }
      }
    >
      <Navbar />
      <main className="md:ml-64 pb-20 md:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <Routes>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/calendario"    element={<CalendarView />} />
            <Route path="/recordatorios" element={<RemindersView />} />
          </Routes>
        </div>
      </main>

      {/* Welcome overlay — shown only once after first sign-in */}
      {needsName && <WelcomeOverlay onSave={saveName} />}
    </div>
  );
}

export default function App() {
  return (
    <DarkModeProvider>
      <GoogleCalendarProvider>
        <HashRouter>
          <AppShell />
        </HashRouter>
      </GoogleCalendarProvider>
    </DarkModeProvider>
  );
}
