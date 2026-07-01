import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, AlignLeft, Bell } from 'lucide-react';
import { toLocalISOString } from '../utils/dateUtils';
import { TulipIcon } from './TulipGarden';

const REMINDER_OPTS = [
  {label:'5 minutos antes',value:5},{label:'15 minutos antes',value:15},
  {label:'30 minutos antes',value:30},{label:'1 hora antes',value:60},
  {label:'2 horas antes',value:120},{label:'1 día antes',value:1440},
];

export default function EventModal({ isOpen, onClose, onSave, onDelete, initialData, initialDate, dark=false }) {
  const mkDefault = () => {
    const s = initialDate ? toLocalISOString(initialDate) : toLocalISOString(new Date());
    const e = initialDate ? toLocalISOString(new Date(initialDate.getTime()+3600000)) : toLocalISOString(new Date(Date.now()+3600000));
    return { title:'', start:s, end:e, description:'', allDay:false, reminderEmail:false, reminderNotif:true, reminderMinutes:30 };
  };
  const [form,   setForm]   = useState(mkDefault);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm({
        title:          initialData.title||'',
        start:          initialData.start ? toLocalISOString(new Date(initialData.start)) : mkDefault().start,
        end:            initialData.end   ? toLocalISOString(new Date(initialData.end))   : mkDefault().end,
        description:    initialData.description||'',
        allDay:         initialData.allDay||false,
        reminderEmail:  initialData.reminders?.overrides?.some(r=>r.method==='email')||false,
        reminderNotif:  initialData.reminders?.overrides?.some(r=>r.method==='popup')??true,
        reminderMinutes:initialData.reminders?.overrides?.[0]?.minutes||30,
      });
    } else {
      setForm(mkDefault());
    }
  }, [isOpen, initialData, initialDate]);

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const startISO = form.allDay ? form.start.split('T')[0] : new Date(form.start).toISOString();
    const endISO   = form.allDay ? form.end.split('T')[0]   : new Date(form.end).toISOString();
    await onSave({...form, start:startISO, end:endISO});
    setSaving(false);
    onClose();
  };

  const del = async () => {
    if (!initialData || !window.confirm('¿Eliminar este evento?')) return;
    await onDelete(initialData.id);
    onClose();
  };

  if (!isOpen) return null;

  const bg     = dark ? '#0F0A14' : 'white';
  const border = dark ? 'rgba(232,49,79,0.18)' : 'rgba(232,49,79,0.10)';
  const inputBg= dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,245,247,0.8)';
  const inputBorder = dark?'rgba(232,49,79,0.22)':'rgba(232,49,79,0.20)';
  const textMain= dark?'#F0E8F4':'#1A1220';
  const textSub = dark?'rgba(240,232,244,0.45)':'rgba(26,18,32,0.45)';
  const sectionBg = dark?'rgba(232,49,79,0.06)':'rgba(255,245,247,0.9)';

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0" style={{background:'rgba(10,5,18,0.45)',backdropFilter:'blur(6px)'}} onClick={onClose}/>
      <div className="relative w-full md:max-w-md animate-slide-up overflow-hidden"
        style={{ borderRadius:'1.75rem 1.75rem 0 0', background:bg, border:`1px solid ${border}`,
          boxShadow:'0 -12px 60px rgba(10,5,18,0.25)' }}>
        {/* Accent bar */}
        <div className="h-1" style={{background:'linear-gradient(90deg,#FFB3C6,#E8314F,#C9183A)'}}/>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <TulipIcon size={20} color="#E8314F"/>
            <h2 style={{fontFamily:'"Playfair Display",Georgia,serif',fontWeight:600,fontSize:'1.1rem',color:textMain}}>
              {initialData?'Editar evento':'Nuevo evento'}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            {initialData&&<button onClick={del} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors"><Trash2 size={17}/></button>}
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-tulip-100 transition-colors" style={{color:textSub}}><X size={17}/></button>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={submit} className="px-6 pb-0 space-y-4 max-h-[68vh] overflow-y-auto">
          <input className="input-field text-base font-bold placeholder:font-light"
            style={{background:inputBg,borderColor:inputBorder,color:textMain}}
            placeholder="¿Qué tienes planeado?" value={form.title} onChange={e=>set('title',e.target.value)} required autoFocus/>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <button type="button" onClick={()=>set('allDay',!form.allDay)}
              className="w-11 h-6 rounded-full relative flex-shrink-0 transition-colors duration-200"
              style={{background:form.allDay?'#E8314F':dark?'rgba(255,255,255,0.1)':'rgba(232,49,79,0.15)'}}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.allDay?'translate-x-5':''}`}/>
            </button>
            <span className="text-sm font-bold" style={{color:textSub}}>Todo el día</span>
          </label>

          {/* Dates */}
          <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${inputBorder}`,background:sectionBg}}>
            <div className="flex items-center gap-2 px-4 py-2.5" style={{borderBottom:`1px solid ${inputBorder}`}}>
              <Calendar size={14} className="text-tulip-500"/>
              <span className="section-label">fecha y hora</span>
            </div>
            <div className="p-3 space-y-2">
              <div>
                <label className="section-label block mb-1">Inicio</label>
                <input type={form.allDay?'date':'datetime-local'} className="input-field text-sm"
                  style={{background:inputBg,borderColor:inputBorder,color:textMain}}
                  value={form.allDay?form.start.split('T')[0]:form.start} onChange={e=>set('start',e.target.value)} required/>
              </div>
              {!form.allDay&&(
                <div>
                  <label className="section-label block mb-1">Fin</label>
                  <input type="datetime-local" className="input-field text-sm"
                    style={{background:inputBg,borderColor:inputBorder,color:textMain}}
                    value={form.end} onChange={e=>set('end',e.target.value)} min={form.start}/>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start gap-3">
            <AlignLeft size={16} className="text-tulip-400 flex-shrink-0 mt-3"/>
            <textarea className="input-field text-sm resize-none flex-1"
              style={{background:inputBg,borderColor:inputBorder,color:textMain}}
              rows={3} placeholder="Descripción o notas..." value={form.description} onChange={e=>set('description',e.target.value)}/>
          </div>

          {/* Reminders */}
          <div className="rounded-2xl overflow-hidden" style={{border:`1px solid ${inputBorder}`,background:sectionBg}}>
            <div className="flex items-center gap-2 px-4 py-2.5" style={{borderBottom:`1px solid ${inputBorder}`}}>
              <Bell size={14} className="text-tulip-500"/>
              <span className="section-label">recordatorios</span>
            </div>
            <div className="p-4 space-y-3">
              {[{k:'reminderNotif',label:'Notificación push'},{k:'reminderEmail',label:'Correo electrónico'}].map(r=>(
                <label key={r.k} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form[r.k]} onChange={e=>set(r.k,e.target.checked)} className="accent-tulip-500 w-4 h-4"/>
                  <span className="text-sm font-medium" style={{color:textMain}}>{r.label}</span>
                </label>
              ))}
              {(form.reminderEmail||form.reminderNotif)&&(
                <select className="input-field text-sm" style={{background:inputBg,borderColor:inputBorder,color:textMain}}
                  value={form.reminderMinutes} onChange={e=>set('reminderMinutes',Number(e.target.value))}>
                  {REMINDER_OPTS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              )}
            </div>
          </div>
          <div className="h-2"/>
        </form>
        {/* Footer */}
        <div className="px-6 py-4 flex gap-3" style={{borderTop:`1px solid ${border}`}}>
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
          <button onClick={submit} disabled={saving||!form.title.trim()} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
            {saving?'Guardando...':initialData?'Actualizar':'Crear evento'}
          </button>
        </div>
      </div>
    </div>
  );
}
