import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const CLIENT_ID  = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_KEY    = import.meta.env.VITE_GOOGLE_API_KEY   || '';
const SCOPES     = 'https://www.googleapis.com/auth/calendar';
const DISCOVERY  = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const TOKEN_KEY  = 'gapi_token';
const USER_KEY   = 'gapi_user'; // { name, initial } — set by the user themselves

const Ctx = createContext(null);

export function GoogleCalendarProvider({ children }) {
  const [isSignedIn,    setIsSignedIn]    = useState(false);
  const [authReady,     setAuthReady]     = useState(false);
  const [isLoading,     setIsLoading]     = useState(false);
  const [gapiInited,    setGapiInited]    = useState(false);
  const [gisInited,     setGisInited]     = useState(false);
  const [tokenClient,   setTokenClient]   = useState(null);
  const [events,        setEvents]        = useState([]);
  const [error,         setError]         = useState(null);
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  // needsName = true when signed in but no name saved yet → show welcome screen
  const [needsName,     setNeedsName]     = useState(false);

  const [userProfile, setUserProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') || { name: '', initial: '' }; }
    catch { return { name: '', initial: '' }; }
  });

  const isConfigured = !!(CLIENT_ID && API_KEY);
  const fetchEventsRef = useRef(null);

  /* ── Save a user-chosen name, keyed by token so it survives reloads ── */
  const saveName = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const profile = { name: trimmed, initial: trimmed.charAt(0).toUpperCase() };
    setUserProfile(profile);
    setNeedsName(false);
    // Save globally AND keyed to the current access token so we can
    // reload it on future sessions without re-asking
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  }, []);

  /* ── Restore saved token on reload ── */
  const restoreToken = useCallback(async () => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) { setAuthReady(true); return; }
    try {
      const token = JSON.parse(saved);
      if (token.expires_at && Date.now() > token.expires_at) {
        localStorage.removeItem(TOKEN_KEY);
        setAuthReady(true);
        return;
      }
      // Pass ONLY access_token to gapi — strip our custom metadata
      window.gapi.client.setToken({ access_token: token.access_token });
      setIsSignedIn(true);
      await fetchEventsRef.current?.();
      // Check if we already have a name saved
      const savedUser = localStorage.getItem(USER_KEY);
      const profile = savedUser ? JSON.parse(savedUser) : null;
      if (!profile?.name) setNeedsName(true); // ask for name if not saved
    } catch {
      localStorage.removeItem(TOKEN_KEY);
    }
    setAuthReady(true);
  }, []);

  /* ── Load gapi ── */
  useEffect(() => {
    if (!isConfigured) { setAuthReady(true); return; }
    const s = document.createElement('script');
    s.src = 'https://apis.google.com/js/api.js';
    s.onload = () => {
      window.gapi.load('client', async () => {
        await window.gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY] });
        setGapiInited(true);
      });
    };
    document.body.appendChild(s);
    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, [isConfigured]);

  /* ── Load GIS ── */
  useEffect(() => {
    if (!isConfigured) return;
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.onload = () => {
      const tc = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (resp) => {
          if (resp.error) { setError(resp.error); return; }
          const rawToken = window.gapi.client.getToken();
          localStorage.setItem(TOKEN_KEY, JSON.stringify({
            ...rawToken,
            expires_at: Date.now() + 55 * 60 * 1000,
          }));
          setJustLoggedOut(false);
          setIsSignedIn(true);
          fetchEventsRef.current?.();
          // Check if user has already entered their name before
          const savedUser = localStorage.getItem(USER_KEY);
          const profile = savedUser ? JSON.parse(savedUser) : null;
          if (!profile?.name) {
            setNeedsName(true); // → show welcome/name screen
          }
        },
      });
      setTokenClient(tc);
      setGisInited(true);
    };
    document.body.appendChild(s);
    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, [isConfigured]);

  useEffect(() => { if (gapiInited) restoreToken(); }, [gapiInited, restoreToken]);

  /* ── Fetch events ── */
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const now    = new Date();
      const future = new Date(); future.setMonth(future.getMonth() + 3);
      const resp   = await window.gapi.client.calendar.events.list({
        calendarId:   'primary',
        timeMin:      new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
        timeMax:      future.toISOString(),
        showDeleted:  false,
        singleEvents: true,
        maxResults:   250,
        orderBy:      'startTime',
      });
      setEvents((resp.result.items || []).map(e => ({
        id:          e.id,
        title:       e.summary        || 'Sin título',
        start:       e.start.dateTime || e.start.date,
        end:         e.end?.dateTime  || e.end?.date,
        description: e.description    || '',
        allDay:      !e.start.dateTime,
        color:       e.colorId ? colorMap[e.colorId] : '#E8314F',
        reminders:   e.reminders,
        source:      'google',
      })));
    } catch (e) {
      console.error('fetchEvents error', e?.status, e?.result?.error?.message || e);
    } finally {
      setIsLoading(false);
    }
  }, []);
  fetchEventsRef.current = fetchEvents;

  const signIn = useCallback(() => {
    if (!isConfigured || !tokenClient) return;
    const existing = window.gapi.client.getToken();
    tokenClient.requestAccessToken({ prompt: existing ? '' : 'consent' });
  }, [tokenClient, isConfigured]);

  const signOut = useCallback(() => {
    const token = window.gapi?.client?.getToken?.();
    if (token?.access_token) {
      try { window.google.accounts.oauth2.revoke(token.access_token); } catch {}
      window.gapi.client.setToken('');
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('skipLogin');
    setIsSignedIn(false);
    setNeedsName(false);
    setEvents([]);
    setUserProfile({ name: '', initial: '' });
    setJustLoggedOut(true);
  }, []);

  const signOutLocal = useCallback(() => {
    localStorage.removeItem('skipLogin');
    setJustLoggedOut(true);
  }, []);

  /* ── CRUD ── */
  const buildGEvent = (d) => ({
    summary:     d.title,
    description: d.description || '',
    start: d.allDay ? { date: d.start.split('T')[0] }
      : { dateTime: d.start, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    end: d.allDay ? { date: (d.end || d.start).split('T')[0] }
      : { dateTime: d.end || d.start, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    reminders: (d.reminderEmail || d.reminderNotif)
      ? { useDefault: false, overrides: [
          ...(d.reminderNotif ? [{ method: 'popup',  minutes: d.reminderMinutes || 30 }] : []),
          ...(d.reminderEmail ? [{ method: 'email',  minutes: d.reminderMinutes || 30 }] : []),
        ]}
      : { useDefault: true },
  });

  const createEvent = useCallback(async (d) => {
    if (!isSignedIn) return;
    try { await window.gapi.client.calendar.events.insert({ calendarId: 'primary', resource: buildGEvent(d) }); await fetchEvents(); }
    catch { setError('No se pudo crear el evento.'); }
  }, [isSignedIn, fetchEvents]);

  const updateEvent = useCallback(async (id, d) => {
    if (!isSignedIn) return;
    try { await window.gapi.client.calendar.events.update({ calendarId: 'primary', eventId: id, resource: buildGEvent(d) }); await fetchEvents(); }
    catch { setError('No se pudo actualizar el evento.'); }
  }, [isSignedIn, fetchEvents]);

  const deleteEvent = useCallback(async (id) => {
    if (!isSignedIn) return;
    try { await window.gapi.client.calendar.events.delete({ calendarId: 'primary', eventId: id }); await fetchEvents(); }
    catch { setError('No se pudo eliminar el evento.'); }
  }, [isSignedIn, fetchEvents]);

  /* ── Local fallback ── */
  const [localEvents, setLocalEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem('localEvents') || '[]'); } catch { return []; }
  });
  const saveLocal        = (evts) => { setLocalEvents(evts); localStorage.setItem('localEvents', JSON.stringify(evts)); };
  const createLocalEvent = (d)     => { const e = { ...d, id: 'local-' + Date.now(), source: 'local', color: '#E8314F' }; saveLocal([...localEvents, e]); return e; };
  const updateLocalEvent = (id, d) => saveLocal(localEvents.map(e => e.id === id ? { ...e, ...d } : e));
  const deleteLocalEvent = (id)    => saveLocal(localEvents.filter(e => e.id !== id));

  return (
    <Ctx.Provider value={{
      isSignedIn, authReady, isLoading, gapiInited, gisInited, isConfigured,
      events:      isSignedIn ? events : localEvents,
      userProfile, needsName, saveName,
      error, setError, justLoggedOut, setJustLoggedOut,
      userName:    userProfile.name,
      signIn, signOut, signOutLocal, fetchEvents,
      createEvent: isSignedIn ? createEvent : (d)      => Promise.resolve(createLocalEvent(d)),
      updateEvent: isSignedIn ? updateEvent : (id, d)  => Promise.resolve(updateLocalEvent(id, d)),
      deleteEvent: isSignedIn ? deleteEvent : (id)     => Promise.resolve(deleteLocalEvent(id)),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useGoogleCalendar() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGoogleCalendar must be used within GoogleCalendarProvider');
  return ctx;
}

const colorMap = {
  '1':'#7986CB','2':'#33B679','3':'#8E24AA','4':'#E67C73',
  '5':'#F6BF26','6':'#F4511E','7':'#039BE5','8':'#616161',
  '9':'#3F51B5','10':'#0B8043','11':'#D50000',
};
