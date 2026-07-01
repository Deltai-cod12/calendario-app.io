// Date utility functions

/**
 * CRITICAL: Parse a date string safely in LOCAL timezone.
 * "2025-07-04" parsed with new Date() becomes UTC midnight → shifts to Jul 3 in UTC-6.
 * We detect all-day strings (YYYY-MM-DD) and build the date locally.
 */
export function parseDate(dateStr) {
  if (!dateStr) return new Date();
  // All-day format: YYYY-MM-DD  (no T, no Z)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d); // LOCAL time, no UTC shift
  }
  return new Date(dateStr); // ISO with time/Z → let JS handle it
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return parseDate(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 'Todo el día';
  return new Date(dateStr).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  return parseDate(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export function isSameDay(d1, d2) {
  const a = d1 instanceof Date ? d1 : parseDate(d1);
  const b = d2 instanceof Date ? d2 : parseDate(d2);
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate();
}

export function isToday(dateStr) {
  return isSameDay(dateStr, new Date());
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday-start
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return '¡Buenos días';
  if (h < 18) return '¡Buenas tardes';
  return '¡Buenas noches';
}

export function getUpcomingEvents(events, days = 7) {
  const now    = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);
  return events
    .filter(e => {
      const s = parseDate(e.start);
      return s >= now && s <= future;
    })
    .sort((a, b) => parseDate(a.start) - parseDate(b.start));
}

export function getTodayEvents(events) {
  return events.filter(e => isSameDay(e.start, new Date()));
}

export function getEventsForDay(events, year, month, day) {
  const date = new Date(year, month, day);
  return events.filter(e => isSameDay(e.start, date));
}

export function toLocalISOString(date) {
  const d   = new Date(date);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const MONTHS_ES    = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
export const DAYS_ES      = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
export const DAYS_FULL_ES = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
