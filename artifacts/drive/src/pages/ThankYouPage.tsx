import { NavHref } from '@/components/NavHref';
import { CheckCircle2 } from 'lucide-react';

export function ThankYouPage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', background: '#1E2433', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'rgba(13,148,136,0.1)', marginBottom: 24 }}>
          <CheckCircle2 size={32} color="#0D9488" />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
          Thank you — we'll be in touch.
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>
          We've received your request and will follow up via email shortly. No sales calls required.
        </p>
        <NavHref href="/">
          <span style={{ display: 'inline-block', background: '#0D9488', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
            Back to Home
          </span>
        </NavHref>
      </div>
    </div>
  );
}