import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, AlignLeft, Bell, Clock } from 'lucide-react';
import { toLocalISOString } from '../utils/dateUtils';
import { TulipIcon } from './TulipGarden';

const reminderOptions = [
  { label: '5 minutos antes', value: 5 },
  { label: '15 minutos antes', value: 15 },
  { label: '30 minutos antes', value: 30 },
  { label: '1 hora antes', value: 60 },
  { label: '2 horas antes', value: 120 },
  { label: '1 día antes', value: 1440 },
];

export default function EventModal({ isOpen, onClose, onSave, onDelete, initialData, initialDate }) {
  const defaultStart = initialDate ? toLocalISOString(initialDate) : toLocalISOString(new Date());
  const defaultEnd   = initialDate
    ? toLocalISOString(new Date(initialDate.getTime() + 60*60*1000))
    : toLocalISOString(new Date(Date.now() + 60*60*1000));

  const [form, setForm] = useState({ title:'', start: defaultStart, end: defaultEnd, description:'', allDay: false, reminderEmail: false, reminderNotif: true, reminderMinutes: 30 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm({
        title: initialData.title || '',
        start: initialData.start ? toLocalISOString(new Date(initialData.start)) : defaultStart,
        end:   initialData.end   ? toLocalISOString(new Date(initialData.end))   : defaultEnd,
        description: initialData.description || '',
        allDay: initialData.allDay || false,
        reminderEmail: initialData.reminders?.overrides?.some(r => r.method==='email') || false,
        reminderNotif: initialData.reminders?.overrides?.some(r => r.method==='popup') ?? true,
        reminderMinutes: initialData.reminders?.overrides?.[0]?.minutes || 30,
      });
    } else {
      const s = initialDate ? toLocalISOString(initialDate) : defaultStart;
      const e = initialDate ? toLocalISOString(new Date(initialDate.getTime()+60*60*1000)) : defaultEnd;
      setForm({ title:'', start:s, end:e, description:'', allDay:false, reminderEmail:false, reminderNotif:true, reminderMinutes:30 });
    }
  }, [isOpen, initialData, initialDate]);

  const set = (k, v) => setForm(p => ({...p, [k]: v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const startISO = form.allDay ? form.start.split('T')[0] : new Date(form.start).toISOString();
    const endISO   = form.allDay ? form.end.split('T')[0]   : new Date(form.end).toISOString();
    await onSave({...form, start:startISO, end:endISO});
    setSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!initialData || !window.confirm('¿Eliminar este evento?')) return;
    await onDelete(initialData.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-night-900/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full md:max-w-md md:rounded-4xl animate-slide-up overflow-hidden"
        style={{ borderRadius: '1.75rem 1.75rem 0 0', background: 'white', boxShadow: '0 -8px 48px rgba(26,18,32,0.18)' }}
      >
        {/* Tulip accent strip */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FFB3C6 0%, #E8314F 50%, #C9183A 100%)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <TulipIcon size={20} color="#E8314F" />
            <h2 style={{ fontFamily:'"Playfair Display",Georgia,serif', fontWeight:600, fontSize:'1.1rem', color:'#1A1220' }}>
              {initialData ? 'Editar evento' : 'Nuevo evento'}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {initialData && (
              <button onClick={handleDelete} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors">
                <Trash2 size={17} />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-xl text-night-800/30 hover:bg-tulip-100 transition-colors">
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-0 space-y-4 max-h-[68vh] overflow-y-auto">

          {/* Title */}
          <input
            className="input-field text-base font-bold placeholder:font-light"
            placeholder="¿Qué tienes planeado?"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            required autoFocus
          />

          {/* All day */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => set('allDay', !form.allDay)}
              className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${form.allDay ? 'bg-tulip-500' : 'bg-tulip-100'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.allDay ? 'translate-x-5' : ''}`} />
            </button>
            <span className="text-sm font-bold text-night-800/70">Todo el día</span>
          </label>

          {/* Date/time */}
          <div className="rounded-2xl overflow-hidden" style={{ border:'1px solid rgba(232,49,79,0.15)', background:'#FFF5F7' }}>
            <div className="flex items-center gap-2 px-4 py-2 border-b border-tulip-100">
              <Calendar size={15} className="text-tulip-500" />
              <span className="text-xs font-bold text-tulip-500 uppercase tracking-wider">Fecha y hora</span>
            </div>
            <div className="p-3 space-y-2">
              <div>
                <label className="text-[10px] text-tulip-400 font-bold uppercase tracking-wider mb-1 block">Inicio</label>
                <input
                  type={form.allDay ? 'date' : 'datetime-local'}
                  className="input-field text-sm"
                  value={form.allDay ? form.start.split('T')[0] : form.start}
                  onChange={e => set('start', e.target.value)}
                  required
                />
              </div>
              {!form.allDay && (
                <div>
                  <label className="text-[10px] text-tulip-400 font-bold uppercase tracking-wider mb-1 block">Fin</label>
                  <input
                    type="datetime-local"
                    className="input-field text-sm"
                    value={form.end}
                    onChange={e => set('end', e.target.value)}
                    min={form.start}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start gap-3">
            <AlignLeft size={16} className="text-tulip-400 flex-shrink-0 mt-3" />
            <textarea
              className="input-field text-sm resize-none flex-1"
              rows={3}
              placeholder="Descripción o notas..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Reminders */}
          <div className="rounded-2xl overflow-hidden" style={{ border:'1px solid rgba(232,49,79,0.15)', background:'#FFF5F7' }}>
            <div className="flex items-center gap-2 px-4 py-2 border-b border-tulip-100">
              <Bell size={15} className="text-tulip-500" />
              <span className="text-xs font-bold text-tulip-500 uppercase tracking-wider">Recordatorios</span>
            </div>
            <div className="p-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.reminderNotif} onChange={e => set('reminderNotif', e.target.checked)} className="accent-tulip-500 w-4 h-4" />
                <span className="text-sm text-night-800/80 font-medium">Notificación push</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.reminderEmail} onChange={e => set('reminderEmail', e.target.checked)} className="accent-tulip-500 w-4 h-4" />
                <span className="text-sm text-night-800/80 font-medium">Correo electrónico</span>
              </label>
              {(form.reminderEmail || form.reminderNotif) && (
                <select className="input-field text-sm mt-1" value={form.reminderMinutes} onChange={e => set('reminderMinutes', Number(e.target.value))}>
                  {reminderOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              )}
            </div>
          </div>

          <div className="h-2" />
        </form>

        {/* Footer */}
        <div className="px-6 py-4 flex gap-3" style={{ borderTop:'1px solid rgba(232,49,79,0.08)' }}>
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.title.trim()}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear evento'}
          </button>
        </div>
      </div>
    </div>
  );
}
