import { useLocation } from 'wouter';
import { FadeUp } from '@/components/FadeUp';
import { CheckCircle } from 'lucide-react';

const ACCENT = '#0D9488';

export function ThankYouPage() {
  const [, navigate] = useLocation();

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
      <FadeUp>
        <div style={{ maxWidth: 560, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={32} color={ACCENT} />
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>
            Request received
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#101828', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 16 }}>
            Thank you for reaching out.
          </h1>
          <p style={{ fontSize: 16, color: '#667085', lineHeight: 1.7, marginBottom: 12 }}>
            Your paid pilot onboarding request has been submitted. We will follow up by email with next steps.
          </p>
          <p style={{ fontSize: 15, color: '#667085', lineHeight: 1.7, marginBottom: 40 }}>
            No live call is required. You will receive email support to guide your first dispatch workflow.
          </p>

          <div style={{ background: '#F5F7FA', borderRadius: 12, padding: 24, textAlign: 'left', marginBottom: 32, border: '1px solid #E6EAF0' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#101828', marginBottom: 12 }}>What happens next</p>
            <ol style={{ paddingLeft: 20, listStyle: 'decimal', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'We review your onboarding form and prepare your dispatch setup.',
                'You receive an email with account activation details.',
                'Your 7-day paid pilot begins after activation.',
                'Submit questions through email or form support — no calls required.',
              ].map((step, i) => (
                <li key={i} style={{ fontSize: 14, color: '#667085', lineHeight: 1.6 }}>{step}</li>
              ))}
            </ol>
          </div>

          <button
            onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = '#0f766e'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = ACCENT; }}
          >
            Back to Home
          </button>
        </div>
      </FadeUp>
    </main>
  );
}
