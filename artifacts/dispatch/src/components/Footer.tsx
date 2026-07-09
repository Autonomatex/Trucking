import { NavHref } from './NavHref';

const ACCENT = '#0D9488';
const SECONDARY = '#667085';

const FOOTER_LINKS = [
  { label: 'Quick Summary', href: '/#quick-summary' },
  { label: 'Workflow',      href: '/workflow' },
  { label: 'Pricing',       href: '/#pricing' },
  { label: 'Paid Pilot',    href: '/#paid-pilot' },
  { label: 'FAQ',           href: '/#faq' },
  { label: 'Contact',       href: '/#contact' },
];

export function Footer() {
  return (
    <footer style={{ background: '#1E2433', color: '#fff', padding: '56px 24px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between', marginBottom: 48 }}>
          {/* Brand */}
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="2.5" fill="#fff" />
                <circle cx="11" cy="11" r="1" fill={ACCENT} />
                <circle cx="11" cy="4"  r="1.2" fill="#fff" opacity="0.4" />
                <circle cx="18" cy="11" r="1.2" fill="#fff" opacity="0.4" />
                <circle cx="11" cy="18" r="1.2" fill="#fff" opacity="0.4" />
                <circle cx="4"  cy="11" r="1.2" fill="#fff" opacity="0.4" />
                <circle cx="16.5" cy="5.5" r="0.9" fill={ACCENT} opacity="0.55" />
                <line x1="11" y1="11" x2="11" y2="5.2"  stroke="#fff" strokeWidth="0.6" opacity="0.2" />
                <line x1="11" y1="11" x2="17" y2="11"   stroke="#fff" strokeWidth="0.6" opacity="0.2" />
                <line x1="11" y1="11" x2="11" y2="16.8" stroke="#fff" strokeWidth="0.6" opacity="0.2" />
                <line x1="11" y1="11" x2="5"  y2="11"   stroke="#fff" strokeWidth="0.6" opacity="0.2" />
              </svg>
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Autonomatex</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>
              The Operational Intelligence Layer behind modern dry van dispatch companies.
            </p>
          </div>

          {/* Links */}
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 32px' }} aria-label="Footer navigation">
            {FOOTER_LINKS.map(link => (
              <NavHref key={link.label} href={link.href}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
                  transition: 'color 0.15s', display: 'block' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
                >
                  {link.label}
                </span>
              </NavHref>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            © 2026 Autonomatex. Built first for dry van dispatch companies.
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            Decision-support only. No auto-booking. Authorized data sources only.
          </p>
        </div>
      </div>
    </footer>
  );
}
