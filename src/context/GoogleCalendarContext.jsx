import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

const GoogleCalendarContext = createContext(null);

export function GoogleCalendarProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [events, setEvents] = useState([]);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);

  const isConfigured = CLIENT_ID && API_KEY;

  // Load gapi
  useEffect(() => {
    if (!isConfigured) return;
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client', async () => {
        await window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        setGapiInited(true);
      });
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [isConfigured]);

  // Load GIS
  useEffect(() => {
    if (!isConfigured) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      const tc = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (resp) => {
          if (resp.error) { setError(resp.error); return; }
          setIsSignedIn(true);
          fetchUserInfo();
          fetchEvents();
        },
      });
      setTokenClient(tc);
      setGisInited(true);
    };
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [isConfigured]);

  const fetchUserInfo = useCallback(async () => {
    try {
      const res = await window.gapi.client.request({
        path: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });
      setUserName(res.result.given_name || res.result.name || '');
    } catch (e) {
      console.error('Error fetching user info', e);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const now = new Date();
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
        timeMax: threeMonthsLater.toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 250,
        orderBy: 'startTime',
      });
      const items = response.result.items || [];
      const mapped = items.map(e => ({
        id: e.id,
        title: e.summary || 'Sin título',
        start: e.start.dateTime || e.start.date,
        end: e.end?.dateTime || e.end?.date,
        description: e.description || '',
        allDay: !e.start.dateTime,
        color: e.colorId ? colorMap[e.colorId] : '#E75480',
        reminders: e.reminders,
        source: 'google',
      }));
      setEvents(mapped);
    } catch (e) {
      console.error('Error fetching events', e);
      setError('No se pudieron cargar los eventos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(() => {
    if (!isConfigured) return;
    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }, [tokenClient, isConfigured]);

  const signOut = useCallback(() => {
    const token = window.gapi.client.getToken();
    if (token) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
    }
    setIsSignedIn(false);
    setEvents([]);
    setUserName('');
  }, []);

  const createEvent = useCallback(async (eventData) => {
    if (!isSignedIn) return null;
    try {
      const event = {
        summary: eventData.title,
        description: eventData.description || '',
        start: eventData.allDay
          ? { date: eventData.start.split('T')[0] }
          : { dateTime: eventData.start, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: eventData.allDay
          ? { date: (eventData.end || eventData.start).split('T')[0] }
          : { dateTime: eventData.end || eventData.start, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        reminders: eventData.reminderEmail || eventData.reminderNotif
          ? {
              useDefault: false,
              overrides: [
                ...(eventData.reminderEmail ? [{ method: 'email', minutes: eventData.reminderMinutes || 30 }] : []),
                ...(eventData.reminderNotif ? [{ method: 'popup', minutes: eventData.reminderMinutes || 30 }] : []),
              ],
            }
          : { useDefault: true },
      };
      const res = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      await fetchEvents();
      return res.result;
    } catch (e) {
      console.error('Error creating event', e);
      setError('No se pudo crear el evento.');
      return null;
    }
  }, [isSignedIn, fetchEvents]);

  const updateEvent = useCallback(async (eventId, eventData) => {
    if (!isSignedIn) return null;
    try {
      const event = {
        summary: eventData.title,
        description: eventData.description || '',
        start: eventData.allDay
          ? { date: eventData.start.split('T')[0] }
          : { dateTime: eventData.start, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: eventData.allDay
          ? { date: (eventData.end || eventData.start).split('T')[0] }
          : { dateTime: eventData.end || eventData.start, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        reminders: eventData.reminderEmail || eventData.reminderNotif
          ? {
              useDefault: false,
              overrides: [
                ...(eventData.reminderEmail ? [{ method: 'email', minutes: eventData.reminderMinutes || 30 }] : []),
                ...(eventData.reminderNotif ? [{ method: 'popup', minutes: eventData.reminderMinutes || 30 }] : []),
              ],
            }
          : { useDefault: true },
      };
      const res = await window.gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId,
        resource: event,
      });
      await fetchEvents();
      return res.result;
    } catch (e) {
      console.error('Error updating event', e);
      setError('No se pudo actualizar el evento.');
      return null;
    }
  }, [isSignedIn, fetchEvents]);

  const deleteEvent = useCallback(async (eventId) => {
    if (!isSignedIn) return;
    try {
      await window.gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId,
      });
      await fetchEvents();
    } catch (e) {
      console.error('Error deleting event', e);
      setError('No se pudo eliminar el evento.');
    }
  }, [isSignedIn, fetchEvents]);

  // Local events (when not signed in)
  const [localEvents, setLocalEvents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('localEvents') || '[]');
    } catch { return []; }
  });

  const saveLocalEvents = (evts) => {
    setLocalEvents(evts);
    localStorage.setItem('localEvents', JSON.stringify(evts));
  };

  const createLocalEvent = (eventData) => {
    const newEvent = { ...eventData, id: 'local-' + Date.now(), source: 'local', color: '#E75480' };
    saveLocalEvents([...localEvents, newEvent]);
    return newEvent;
  };

  const updateLocalEvent = (id, eventData) => {
    saveLocalEvents(localEvents.map(e => e.id === id ? { ...e, ...eventData } : e));
  };

  const deleteLocalEvent = (id) => {
    saveLocalEvents(localEvents.filter(e => e.id !== id));
  };

  const allEvents = isSignedIn ? events : localEvents;

  const handleCreateEvent = isSignedIn ? createEvent : (d) => Promise.resolve(createLocalEvent(d));
  const handleUpdateEvent = isSignedIn ? updateEvent : (id, d) => Promise.resolve(updateLocalEvent(id, d));
  const handleDeleteEvent = isSignedIn ? deleteEvent : (id) => Promise.resolve(deleteLocalEvent(id));

  return (
    <GoogleCalendarContext.Provider value={{
      isSignedIn, isLoading, gapiInited, gisInited, isConfigured,
      events: allEvents, userName, error, setError,
      signIn, signOut, fetchEvents,
      createEvent: handleCreateEvent,
      updateEvent: handleUpdateEvent,
      deleteEvent: handleDeleteEvent,
    }}>
      {children}
    </GoogleCalendarContext.Provider>
  );
}

export function useGoogleCalendar() {
  const ctx = useContext(GoogleCalendarContext);
  if (!ctx) throw new Error('useGoogleCalendar must be used within GoogleCalendarProvider');
  return ctx;
}

const colorMap = {
  '1': '#7986CB', '2': '#33B679', '3': '#8E24AA', '4': '#E67C73',
  '5': '#F6BF26', '6': '#F4511E', '7': '#039BE5', '8': '#616161',
  '9': '#3F51B5', '10': '#0B8043', '11': '#D50000',
};
