// Date utility functions

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  if (!dateStr.includes('T')) return 'Todo el día';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export function isSameDay(d1, d2) {
  const a = new Date(d1);
  const b = new Date(d2);
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export function isToday(dateStr) {
  return isSameDay(dateStr, new Date());
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
  // 0=Sunday, adjust to Monday start
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '¡Buenos días';
  if (hour < 18) return '¡Buenas tardes';
  return '¡Buenas noches';
}

export function getUpcomingEvents(events, days = 7) {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);
  return events
    .filter(e => {
      const start = new Date(e.start);
      return start >= now && start <= future;
    })
    .sort((a, b) => new Date(a.start) - new Date(b.start));
}

export function getTodayEvents(events) {
  return events.filter(e => isSameDay(e.start, new Date()));
}

export function getEventsForDay(events, year, month, day) {
  const date = new Date(year, month, day);
  return events.filter(e => isSameDay(e.start, date));
}

export function toLocalISOString(date) {
  const d = new Date(date);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const DAYS_FULL_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
