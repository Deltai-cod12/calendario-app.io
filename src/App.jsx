import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { GoogleCalendarProvider, useGoogleCalendar } from './context/GoogleCalendarContext';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import CalendarView from './views/CalendarView';
import RemindersView from './views/RemindersView';
import LoginView from './views/LoginView';

function AppShell() {
  const { isSignedIn, isConfigured } = useGoogleCalendar();
  const [skipLogin, setSkipLogin] = useState(() => localStorage.getItem('skipLogin') === 'true');

  const handleContinueLocal = () => {
    localStorage.setItem('skipLogin', 'true');
    setSkipLogin(true);
  };

  // Show login if: google is configured and not signed in, and user hasn't skipped
  const showLogin = isConfigured && !isSignedIn && !skipLogin;

  // If no config at all, allow auto-pass-through
  if (showLogin) {
    return <LoginView onContinueLocal={handleContinueLocal} />;
  }

  return (
    <div className="min-h-screen" style={{ background:'linear-gradient(160deg, #FFF5F7 0%, #FFFAF5 50%, #F9F5FF 100%)' }}>
      <Navbar />
      <main className="md:ml-64 pb-20 md:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendario" element={<CalendarView />} />
            <Route path="/recordatorios" element={<RemindersView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <GoogleCalendarProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </GoogleCalendarProvider>
  );
}
