'use client';

import { useState, useEffect, useRef } from 'react';

const BG     = '#07090a';
const TEAL   = '#2dd4bf';
const WHITE  = '#f1fbf8';
const MUTED  = 'rgba(241,251,248,0.44)';
const DIM    = 'rgba(241,251,248,0.16)';
const BORDER = 'rgba(255,255,255,0.065)';
const PANEL  = 'rgba(255,255,255,0.028)';

interface Props {
  accentColor?: string;
  /** Какая роль активна — подставляется в source */
  role?: 'user' | 'manager' | 'owner' | 'demo';
  /** Текст кнопки-триггера */
  label?: string;
}

export default function DemoContactModal({ accentColor = TEAL, role = 'demo', label = 'Связаться' }: Props) {
  const [open, setOpen]       = useState(false);
  const [status, setStatus]   = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const firstRef              = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', position: '', company: '', message: '',
    website: '', // honeypot
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name:     form.name.trim(),
          email:    form.email.trim(),
          phone:    form.phone.trim(),
          company:  form.company.trim(),
          message:  [
            form.position ? `Должность: ${form.position}` : '',
            form.message,
          ].filter(Boolean).join('\n'),
          source:   `demo/${role}`,
          website:  form.website,
        }),
      });
      const json = await res.json();
      setStatus(json.ok ? 'ok' : 'err');
    } catch {
      setStatus('err');
    }
  }

  function close() {
    setOpen(false);
    setTimeout(() => { setStatus('idle'); setForm({ name:'', email:'', phone:'', position:'', company:'', message:'', website:'' }); }, 400);
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px', background: PANEL, border: `1px solid ${BORDER}`,
    borderRadius: 9, color: WHITE, fontSize: 13.5, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit', transition: 'border-color 0.15s',
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{ fontSize: 13, fontWeight: 600, padding: '7px 16px', background: WHITE, color: BG, borderRadius: 7, border: 'none', cursor: 'pointer', letterSpacing: '-0.01em' }}
      >
        {label}
      </button>

      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Форма обращения"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 1001,
          width: 'min(520px, 100vw)',
          background: '#0b0f12',
          borderLeft: `1px solid ${BORDER}`,
          display: 'flex', flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.32,0,0.15,1)',
          boxShadow: '-24px 0 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 28px 18px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 10, color: DIM, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>OneStack</div>
            <div style={{ fontSize: 18, fontWeight: 400, fontFamily: '"DM Serif Display", Georgia, serif', color: WHITE, lineHeight: 1.2 }}>
              Расскажите о вашем<br/>учреждении
            </div>
            <p style={{ fontSize: 12.5, color: MUTED, margin: '8px 0 0', lineHeight: 1.6 }}>
              Мы свяжемся в течение одного рабочего дня и подберём подходящий формат внедрения.
            </p>
          </div>
          <button
            onClick={close}
            style={{ background: 'transparent', border: 'none', color: DIM, cursor: 'pointer', padding: 4, flexShrink: 0, marginTop: 2 }}
            aria-label="Закрыть"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {status === 'ok' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20, textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${accentColor}15`, border: `1px solid ${accentColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <polyline points="20 6 9 17 4 12" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 400, fontFamily: '"DM Serif Display", Georgia, serif', color: WHITE, marginBottom: 10 }}>Заявка получена</div>
                <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.7, margin: 0 }}>
                  Спасибо! Мы свяжемся с вами в течение одного рабочего дня.
                </p>
              </div>
              <button
                onClick={close}
                style={{ padding: '10px 24px', background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 9, color: MUTED, fontSize: 13, cursor: 'pointer', marginTop: 8 }}
              >
                Закрыть
              </button>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Honeypot */}
              <input name="website" value={form.website} onChange={set('website')} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: DIM, fontWeight: 600 }}>Имя *</span>
                  <input
                    ref={firstRef}
                    required
                    placeholder="Иван Иванов"
                    value={form.name}
                    onChange={set('name')}
                    style={inp}
                    onFocus={e => (e.currentTarget.style.borderColor = `${accentColor}50`)}
                    onBlur={e => (e.currentTarget.style.borderColor = BORDER)}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: DIM, fontWeight: 600 }}>Email *</span>
                  <input
                    required
                    type="email"
                    placeholder="ivan@mfc.ru"
                    value={form.email}
                    onChange={set('email')}
                    style={inp}
                    onFocus={e => (e.currentTarget.style.borderColor = `${accentColor}50`)}
                    onBlur={e => (e.currentTarget.style.borderColor = BORDER)}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: DIM, fontWeight: 600 }}>Телефон</span>
                  <input
                    type="tel"
                    placeholder="+7 999 000 00 00"
                    value={form.phone}
                    onChange={set('phone')}
                    style={inp}
                    onFocus={e => (e.currentTarget.style.borderColor = `${accentColor}50`)}
                    onBlur={e => (e.currentTarget.style.borderColor = BORDER)}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: DIM, fontWeight: 600 }}>Должность</span>
                  <input
                    placeholder="Директор МФЦ"
                    value={form.position}
                    onChange={set('position')}
                    style={inp}
                    onFocus={e => (e.currentTarget.style.borderColor = `${accentColor}50`)}
                    onBlur={e => (e.currentTarget.style.borderColor = BORDER)}
                  />
                </label>
              </div>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11.5, color: DIM, fontWeight: 600 }}>Учреждение / организация</span>
                <input
                  placeholder="МФЦ Центральный район, г. Казань"
                  value={form.company}
                  onChange={set('company')}
                  style={inp}
                  onFocus={e => (e.currentTarget.style.borderColor = `${accentColor}50`)}
                  onBlur={e => (e.currentTarget.style.borderColor = BORDER)}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11.5, color: DIM, fontWeight: 600 }}>Что хотите автоматизировать?</span>
                <textarea
                  rows={4}
                  placeholder="Расскажите о задаче — количество сотрудников, текущий процесс, что не устраивает..."
                  value={form.message}
                  onChange={set('message')}
                  style={{ ...inp, resize: 'vertical', minHeight: 100, lineHeight: 1.6 }}
                  onFocus={e => (e.currentTarget.style.borderColor = `${accentColor}50`)}
                  onBlur={e => (e.currentTarget.style.borderColor = BORDER)}
                />
              </label>

              {status === 'err' && (
                <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 9, fontSize: 12.5, color: '#f87171' }}>
                  Что-то пошло не так. Напишите нам напрямую: hello@onestack.ru
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  padding: '12px', background: status === 'loading' ? PANEL : WHITE,
                  color: BG, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700,
                  cursor: status === 'loading' ? 'default' : 'pointer', letterSpacing: '-0.01em',
                  transition: 'opacity 0.15s', opacity: status === 'loading' ? 0.6 : 1,
                }}
              >
                {status === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
              </button>

              <p style={{ fontSize: 11, color: DIM, margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
              </p>
            </form>
          )}
        </div>

        {/* Footer — social proof */}
        {status !== 'ok' && (
          <div style={{ padding: '16px 28px', borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 20 }}>
              {[['30 дней', 'внедрение'], ['0 ₽', 'за пилот'], ['24/7', 'поддержка']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: WHITE }}>{v}</div>
                  <div style={{ fontSize: 10.5, color: DIM, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
