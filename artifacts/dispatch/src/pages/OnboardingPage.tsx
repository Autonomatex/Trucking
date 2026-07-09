import { useState, FormEvent } from 'react';
import { useLocation } from 'wouter';
import { FadeUp } from '@/components/FadeUp';

const ACCENT = '#0D9488';
const BORDER = '#E6EAF0';

type FormData = {
  name: string; company: string; email: string;
  paid_plan: string; active_dry_van_trucks: string;
  load_source: string; truck_message: string;
  truck_rules: string; pain: string;
};

const INITIAL: FormData = {
  name: '', company: '', email: '', paid_plan: '',
  active_dry_van_trucks: '', load_source: '', truck_message: '',
  truck_rules: '', pain: '',
};

const encode = (data: Record<string, string>) =>
  Object.keys(data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 8,
  border: `1px solid ${BORDER}`, fontSize: 14, color: '#101828',
  background: '#fff', outline: 'none', transition: 'border-color 0.15s',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500, color: '#101828', marginBottom: 6 };

export function OnboardingPage() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'autonomatex-paid-pilot-onboarding', ...form }),
      });
      if (res.ok) { navigate('/thank-you'); window.scrollTo({ top: 0 }); }
      else setError('Something went wrong. Please email us directly.');
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return (
    <main style={{ padding: '80px 24px', maxWidth: 760, margin: '0 auto' }}>
      <FadeUp>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: ACCENT, marginBottom: 14 }}>
          Paid pilot onboarding
        </div>
        <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 700, color: '#101828', letterSpacing: '-0.025em', lineHeight: 1.25, marginBottom: 14 }}>
          Tell us how your dry van dispatch operation works.
        </h1>
        <p style={{ fontSize: 16, color: '#667085', lineHeight: 1.7, marginBottom: 8 }}>
          This form is for paid pilot users preparing their dispatch setup. It helps us configure your truck profile without a long call.
        </p>
        <ul style={{ paddingLeft: 20, listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 48 }}>
          {['No live call required.', 'Email support only.', 'Dry van dispatch workflow only.'].map(item => (
            <li key={item} style={{ fontSize: 13.5, color: '#667085' }}>{item}</li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} name="autonomatex-paid-pilot-onboarding" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <input type="hidden" name="form-name" value="autonomatex-paid-pilot-onboarding" />

          <div style={{ background: '#F5F7FA', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '18px 20px' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#101828', marginBottom: 6 }}>How support works</p>
            <p style={{ fontSize: 13, color: '#667085', lineHeight: 1.65 }}>
              Paid pilot users can submit questions through this form and follow-up email support. No live call is required to start.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label htmlFor="ob-name" style={labelStyle}>Full name <span style={{ color: '#F04438' }}>*</span></label>
              <input id="ob-name" required style={inputStyle} value={form.name} onChange={set('name')} placeholder="John Smith"
                onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = BORDER} />
            </div>
            <div>
              <label htmlFor="ob-company" style={labelStyle}>Company <span style={{ color: '#F04438' }}>*</span></label>
              <input id="ob-company" required style={inputStyle} value={form.company} onChange={set('company')} placeholder="ABC Dispatch LLC"
                onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = BORDER} />
            </div>
          </div>

          <div>
            <label htmlFor="ob-email" style={labelStyle}>Business email <span style={{ color: '#F04438' }}>*</span></label>
            <input id="ob-email" required type="email" style={inputStyle} value={form.email} onChange={set('email')} placeholder="name@company.com"
              onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = BORDER} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label htmlFor="ob-plan" style={labelStyle}>Paid plan <span style={{ color: '#F04438' }}>*</span></label>
              <select id="ob-plan" required style={{ ...inputStyle, appearance: 'none' }} value={form.paid_plan} onChange={set('paid_plan')}
                onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = BORDER}>
                <option value="">Select</option>
                {['$79 Paid Pilot Access','$99/mo — 1 Truck Access','$199/mo — 4 Truck Team','$299/mo — Core Dispatch','$749/mo — Growth Dispatch','$1,499/mo — Pro Dispatch'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ob-trucks" style={labelStyle}>Active dry van trucks <span style={{ color: '#F04438' }}>*</span></label>
              <input id="ob-trucks" required type="number" min="1" style={inputStyle} value={form.active_dry_van_trucks} onChange={set('active_dry_van_trucks')} placeholder="e.g. 8"
                onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = BORDER} />
            </div>
          </div>

          <div>
            <label htmlFor="ob-source" style={labelStyle}>Main load source</label>
            <input id="ob-source" style={inputStyle} value={form.load_source} onChange={set('load_source')} placeholder="DAT / Truckstop / approved source / internal"
              onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = BORDER} />
          </div>

          <div>
            <label htmlFor="ob-truck-msg" style={labelStyle}>Typical truck availability message</label>
            <textarea id="ob-truck-msg" rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.truck_message} onChange={set('truck_message')}
              placeholder="Example: Truck 12 empty Dallas tomorrow 8 AM. Midwest preferred. Min $2.30. No NYC."
              onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = BORDER} />
          </div>

          <div>
            <label htmlFor="ob-rules" style={labelStyle}>Top 5 truck rules or preferences</label>
            <textarea id="ob-rules" rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={form.truck_rules} onChange={set('truck_rules')}
              placeholder="No-go areas, minimum RPM, deadhead limits, preferred lanes, broker notes..."
              onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = BORDER} />
          </div>

          <div>
            <label htmlFor="ob-pain" style={labelStyle}>Main dispatch challenge or question for Autonomatex</label>
            <textarea id="ob-pain" rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={form.pain} onChange={set('pain')}
              placeholder="Weak loads, senior dispatcher overload, junior team training, broker memory, lane memory, stress, truck growth..."
              onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = BORDER} />
          </div>

          {error && (
            <div style={{ background: 'rgba(240,68,56,0.08)', border: '1px solid rgba(240,68,56,0.2)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#dc2626' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting}
            style={{ background: submitting ? '#9ca3af' : ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '14px', fontWeight: 600, fontSize: 15, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.15s', fontFamily: 'Inter, system-ui, sans-serif' }}
            onMouseEnter={e => { if (!submitting) (e.target as HTMLElement).style.background = '#0f766e'; }}
            onMouseLeave={e => { if (!submitting) (e.target as HTMLElement).style.background = ACCENT; }}
          >
            {submitting ? 'Submitting…' : 'Submit Onboarding'}
          </button>

          <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', lineHeight: 1.6 }}>
            This does not auto-book freight. Autonomatex supports dispatch decisions and keeps the dispatcher in control.
          </p>
        </form>
      </FadeUp>
    </main>
  );
}
