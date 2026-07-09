import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const EASE: [number,number,number,number] = [0.25,0.46,0.45,0.94];
const ACCENT = '#0D9488';
const DARK   = '#1E2433';

function AtxMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="2.5" fill={DARK} />
      <circle cx="11" cy="11" r="1"   fill={ACCENT} />
      <circle cx="11" cy="4"  r="1.2" fill={DARK} opacity="0.5" />
      <circle cx="18" cy="11" r="1.2" fill={DARK} opacity="0.5" />
      <circle cx="11" cy="18" r="1.2" fill={DARK} opacity="0.5" />
      <circle cx="4"  cy="11" r="1.2" fill={DARK} opacity="0.5" />
      <circle cx="16.5" cy="5.5" r="0.9" fill={ACCENT} opacity="0.55" />
      <line x1="11" y1="11" x2="11" y2="5.2"  stroke={DARK} strokeWidth="0.6" opacity="0.3" />
      <line x1="11" y1="11" x2="17" y2="11"   stroke={DARK} strokeWidth="0.6" opacity="0.3" />
      <line x1="11" y1="11" x2="11" y2="16.8" stroke={DARK} strokeWidth="0.6" opacity="0.3" />
      <line x1="11" y1="11" x2="5"  y2="11"   stroke={DARK} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: 'Quick Summary',  href: '/#quick-summary'   },
  { label: 'Workflow',       href: '/workflow'          },
  { label: 'Dispatch Side',  href: '/#dispatcher-side'  },
  { label: 'Pricing',        href: '/#pricing'          },
  { label: 'Paid Pilot',     href: '/#paid-pilot'       },
  { label: 'Contact',        href: '/#contact'          },
];

const MOBILE_LINKS = [
  { label: 'Quick Summary',      href: '/#quick-summary',      sub: 'Start here for the short version' },
  { label: 'Self-Guided Workflow', href: '/workflow',           sub: 'See the workflow without a live call' },
  { label: 'Dispatch Side',      href: '/#dispatcher-side',    sub: 'Less pressure, better decisions' },
  { label: 'Owner Side',         href: '/#owner-side',         sub: 'Company-owned dispatch intelligence' },
  { label: 'New Truck Onboarding', href: '/#new-truck-onboarding', sub: 'Start new trucks professionally' },
  { label: 'Client Lifecycle',   href: '/#client-lifecycle',   sub: 'From first call to long-term retention' },
  { label: 'Technical Side',     href: '/#technical-side',     sub: 'How it works behind the scenes' },
  { label: 'Pricing',            href: '/#pricing',            sub: 'Start small, scale the dispatch brain' },
  { label: 'Paid Pilot',         href: '/#paid-pilot',         sub: 'Start testing without a sales call' },
  { label: 'Contact',            href: '/#contact',            sub: 'Email-first, no calls required' },
];

function scrollTo(hash: string) {
  if (!hash) return;
  const el = document.querySelector(hash);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function NavHref({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  const [, navigate] = useLocation();
  const isExternal = href.startsWith('http');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isExternal) return;
    e.preventDefault();
    onClick?.();
    if (href.startsWith('/#')) {
      navigate('/');
      setTimeout(() => scrollTo(href.replace('/', '')), 50);
    } else if (href.includes('#')) {
      const [path, hash] = href.split('#');
      navigate(path || '/');
      setTimeout(() => scrollTo(`#${hash}`), 50);
    } else {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <a href={href} onClick={handleClick} style={{ color: 'inherit', textDecoration: 'none' }}>
      {children}
    </a>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? 'rgba(250,251,252,0.96)' : '#FAFBFC',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #E6EAF0' : '1px solid transparent',
          transition: 'all 0.25s ease',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', gap: 32 }}>
          {/* Logo */}
          <NavHref href="/">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <AtxMark size={20} />
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', color: '#101828' }}>
                Autonomatex
              </span>
            </div>
          </NavHref>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}
               className="hidden md:flex" aria-label="Primary navigation">
            {NAV_LINKS.map(link => (
              <NavHref key={link.label} href={link.href}>
                <span style={{
                  fontSize: 13.5, fontWeight: 500, color: '#667085', padding: '6px 12px',
                  borderRadius: 6, cursor: 'pointer', transition: 'color 0.15s, background 0.15s',
                  display: 'block',
                }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.color = '#101828'; (e.target as HTMLElement).style.background = '#F5F7FA'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.color = '#667085'; (e.target as HTMLElement).style.background = ''; }}
                >
                  {link.label}
                </span>
              </NavHref>
            ))}
          </nav>

          {/* CTA */}
          <NavHref href="/#paid-pilot">
            <span style={{
              fontSize: 13.5, fontWeight: 600, color: '#fff',
              background: ACCENT, padding: '8px 18px', borderRadius: 8,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'background 0.15s',
              display: 'none',
            }}
              className="md:inline-block"
              onMouseEnter={e => { (e.target as HTMLElement).style.background = '#0f766e'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = ACCENT; }}
            >
              Start Paid Pilot
            </span>
          </NavHref>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#101828', padding: 4 }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(16,24,40,0.35)' }}
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '85%', maxWidth: 360,
                zIndex: 99, background: '#fff', overflowY: 'auto', padding: '80px 24px 32px',
                boxShadow: '-8px 0 32px rgba(16,24,40,0.12)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {MOBILE_LINKS.map(link => (
                  <NavHref key={link.label} href={link.href} onClick={() => setOpen(false)}>
                    <div style={{
                      padding: '12px 16px', borderRadius: 8, cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F5F7FA'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#101828' }}>{link.label}</div>
                      <div style={{ fontSize: 12, color: '#667085', marginTop: 2 }}>{link.sub}</div>
                    </div>
                  </NavHref>
                ))}
              </div>
              <div style={{ marginTop: 24 }}>
                <NavHref href="/#paid-pilot" onClick={() => setOpen(false)}>
                  <div style={{
                    background: ACCENT, color: '#fff', fontWeight: 600, fontSize: 14,
                    textAlign: 'center', padding: '14px', borderRadius: 8, cursor: 'pointer',
                  }}>
                    Start Paid Pilot
                  </div>
                </NavHref>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div style={{ height: 72 }} />
    </>
  );
}
