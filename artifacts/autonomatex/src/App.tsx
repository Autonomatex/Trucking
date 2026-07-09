import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, useScroll, useSpring, useInView, MotionConfig, AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import {
  BrainCircuit,
  Database,
  GitMerge,
  Cpu,
  RefreshCcw,
  ShieldCheck,
  Lock,
  Scale,
  Eye,
  Activity,
  FileCheck,
  Server,
  X,
  Menu
} from 'lucide-react';

const queryClient = new QueryClient();

// ── Brand tokens ─────────────────────────────────────────────────────────────
// Accent shifted from #16C6B7 (bright cyan) to #0D9488 (deep mature teal)
const ACCENT   = '#0D9488';
const ACCENT_DIM = '#6BB8B3';     // muted, for secondary decorations
const DARK     = '#1E2433';       // nav dark, vision bg
const PRIMARY  = '#101828';       // body text
const SECONDARY = '#667085';      // body text muted
const BORDER   = '#E6EAF0';       // all borders
const BG       = '#FAFBFC';       // page background
const SURFACE  = '#FFFFFF';       // card / section backgrounds
const DEEP_ALT = '#F0F4F8';       // slightly cooler than BG, section alt

// ==========================================
// ANIMATION VARIANTS — calmer, more confident
// ==========================================

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const fadeUpVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: custom * 0.1, ease: EASE }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } }
};

const mobileMenuVariant = {
  hidden: { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: EASE } },
  exit:   { opacity: 0, x: '100%', transition: { duration: 0.22, ease: EASE } }
};

// ==========================================
// SHARED HELPERS
// ==========================================

const NAVBAR_H = 76; // px — fixed header height

function doScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_H;
  window.scrollTo({ top, behavior: 'smooth' });
}

// ── WORDMARK MARK (SVG) ──────────────────────────────────────────────────────

function AtxMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
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

// ── SECTION NODE DIVIDER ─────────────────────────────────────────────────────

function NodeDivider() {
  return (
    <div className="flex items-center justify-center gap-2 py-2" aria-hidden="true">
      <div className="w-[1px] h-5" style={{ background: BORDER }} />
      <svg width="40" height="10" viewBox="0 0 40 10" fill="none">
        <circle cx="5"  cy="5" r="2"   fill={BORDER} />
        <circle cx="20" cy="5" r="2.5" fill={ACCENT} opacity="0.45" />
        <circle cx="35" cy="5" r="2"   fill={BORDER} />
        <line x1="7"    y1="5" x2="17.5" y2="5" stroke={BORDER} strokeWidth="0.8" />
        <line x1="22.5" y1="5" x2="33"   y2="5" stroke={BORDER} strokeWidth="0.8" />
      </svg>
      <div className="w-[1px] h-5" style={{ background: BORDER }} />
    </div>
  );
}

// ==========================================
// SCROLL PROGRESS
// ==========================================

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
      style={{ scaleX, background: ACCENT }}
    />
  );
}

// ==========================================
// NAVBAR (desktop + mobile)
// ==========================================

function Navbar() {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen]     = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef    = useRef<HTMLDivElement>(null);

  const navLinks = [
    { id: 'why',          label: 'Why' },
    { id: 'intelligence', label: 'Intelligence' },
    { id: 'thinking',     label: 'Thinking' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'principles',   label: 'Principles' },
    { id: 'security',     label: 'Security' },
    { id: 'vision',       label: 'Vision' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
      const sections = ['home', ...navLinks.map(l => l.id), 'contact'];
      let current = '';
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) current = id;
        }
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const close = () => setMobileOpen(false);
    window.addEventListener('scroll', close, { once: true, passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    // Make background inert while drawer is open
    const main = document.getElementById('main-content');
    if (main) {
      if (mobileOpen) { main.setAttribute('aria-hidden', 'true'); (main as any).inert = true; }
      else             { main.removeAttribute('aria-hidden'); (main as any).inert = false; }
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Focus management: focus first drawer item on open, return to hamburger on close
  useEffect(() => {
    if (mobileOpen) {
      const first = drawerRef.current?.querySelector<HTMLElement>('button, a');
      first?.focus();
    } else {
      hamburgerRef.current?.focus();
    }
  }, [mobileOpen]);

  // Escape closes drawer
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  // Focus trap inside drawer
  useEffect(() => {
    if (!mobileOpen || !drawerRef.current) return;
    const el = drawerRef.current;
    const focusable = () => Array.from(el.querySelectorAll<HTMLElement>('button, a, input, [tabindex]')).filter(n => !(n as HTMLButtonElement).disabled);
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
    };
    el.addEventListener('keydown', trap);
    return () => el.removeEventListener('keydown', trap);
  }, [mobileOpen]);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    setTimeout(() => doScrollTo(id), 50);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/92 backdrop-blur-md border-b py-4' : 'bg-transparent py-7'
        }`}
        style={{ borderColor: isScrolled ? BORDER : 'transparent' }}
      >
        <div className="mx-auto px-6 md:px-8 max-w-7xl flex items-center justify-between">
          {/* Wordmark */}
          <button
            onClick={() => doScrollTo('home')}
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm"
            style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
            aria-label="Autonomatex — return to top"
          >
            <AtxMark size={20} />
            <span className="font-semibold text-[17px] tracking-[-0.01em]" style={{ color: PRIMARY }}>
              Autonomatex
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                aria-current={activeSection === link.id ? 'true' : undefined}
                className="text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm"
                style={{
                  color: activeSection === link.id ? ACCENT : SECONDARY,
                  '--tw-ring-color': ACCENT
                } as React.CSSProperties}
                onMouseEnter={e => { if (activeSection !== link.id) e.currentTarget.style.color = PRIMARY; }}
                onMouseLeave={e => { if (activeSection !== link.id) e.currentTarget.style.color = SECONDARY; }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* CTA — desktop */}
            <button
              onClick={() => handleNavClick('contact')}
              className="hidden lg:block text-[13px] font-medium px-5 py-2.5 rounded-md border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ borderColor: BORDER, color: PRIMARY, '--tw-ring-color': ACCENT } as React.CSSProperties}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = PRIMARY; }}
            >
              Begin the Conversation
            </button>

            {/* Hamburger — mobile/tablet */}
            <button
              ref={hamburgerRef}
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ color: PRIMARY, '--tw-ring-color': ACCENT } as React.CSSProperties}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              ref={drawerRef}
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              variants={mobileMenuVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col"
              style={{ background: SURFACE, borderLeft: `1px solid ${BORDER}` }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: BORDER }}>
                <div className="flex items-center gap-2">
                  <AtxMark size={18} />
                  <span className="font-semibold text-[15px]" style={{ color: PRIMARY }}>Autonomatex</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ color: SECONDARY, '--tw-ring-color': ACCENT } as React.CSSProperties}
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-4 py-4 flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="text-left px-3 py-3 rounded-lg text-[15px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      color: activeSection === link.id ? ACCENT : PRIMARY,
                      background: activeSection === link.id ? `${ACCENT}11` : 'transparent',
                      '--tw-ring-color': ACCENT
                    } as React.CSSProperties}
                    aria-current={activeSection === link.id ? 'true' : undefined}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              <div className="px-4 pb-8 pt-2 border-t" style={{ borderColor: BORDER }}>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="w-full py-3.5 rounded-md text-[14px] font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ background: DARK, '--tw-ring-color': ACCENT } as React.CSSProperties}
                >
                  Begin the Conversation
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ==========================================
// HERO — stronger headline, more whitespace
// ==========================================

function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center pt-28 pb-28 overflow-hidden"
      style={{ background: BG }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #1E2433 1px, transparent 1px), linear-gradient(to bottom, #1E2433 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: 0.03
        }}
      />
      {/* Accent glow — very subtle */}
      <div
        className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ACCENT}, transparent 68%)`, opacity: 0.04 }}
      />

      <div className="mx-auto px-6 md:px-8 max-w-7xl relative z-10 grid lg:grid-cols-2 gap-20 items-center w-full">
        {/* Text */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-xl"
        >
          <motion.div variants={staggerItem}>
            <span
              className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase mb-12"
              style={{ color: ACCENT }}
            >
              Operational Intelligence
            </span>
          </motion.div>

          {/* Hero headline */}
          <motion.h1
            variants={staggerItem}
            className="tracking-[-0.022em] leading-[1.05] mb-12"
          >
            <span
              className="block font-bold"
              style={{ fontSize: 'clamp(2.8rem, 5.2vw, 4.75rem)', color: PRIMARY }}
            >
              Every organization
              <br />creates experience.
            </span>
            <span
              className="block font-light italic mt-4"
              style={{
                fontSize: 'clamp(1.65rem, 2.8vw, 2.9rem)',
                color: SECONDARY,
                letterSpacing: '-0.01em'
              }}
            >
              Very few transform it into intelligence.
            </span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-[17px] leading-[1.8] mb-12 max-w-[440px]"
            style={{ color: SECONDARY }}
          >
            Autonomatex preserves operational knowledge, improves decision
            quality, and keeps humans in control — permanently.
          </motion.p>

          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => doScrollTo('why')}
              className="px-8 py-4 rounded-md text-[14px] font-medium text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: DARK, '--tw-ring-color': ACCENT } as React.CSSProperties}
              onMouseEnter={e => { e.currentTarget.style.background = '#2F3A4D'; }}
              onMouseLeave={e => { e.currentTarget.style.background = DARK; }}
            >
              Our Purpose
            </button>
            <button
              onClick={() => doScrollTo('contact')}
              className="px-8 py-4 rounded-md text-[14px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: 'transparent', color: PRIMARY, border: `1px solid ${BORDER}`, '--tw-ring-color': ACCENT } as React.CSSProperties}
              onMouseEnter={e => { e.currentTarget.style.borderColor = PRIMARY; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; }}
            >
              Begin the Conversation
            </button>
          </motion.div>
        </motion.div>

        {/* Abstract SVG — cross-browser safe, no CSS transformOrigin on SVG elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
          className="hidden lg:flex items-center justify-center"
          aria-hidden="true"
        >
          <svg viewBox="0 0 480 480" className="w-full max-w-[440px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Rings */}
            <circle cx="240" cy="240" r="210" stroke={BORDER} strokeWidth="1" />
            <circle cx="240" cy="240" r="150" stroke={BORDER} strokeWidth="1" />
            <circle cx="240" cy="240" r="90"  stroke={BORDER} strokeWidth="1" />
            <circle cx="240" cy="240" r="32"  stroke={BORDER} strokeWidth="1" />

            {/* Pulse rings — use <g transform> at center */}
            <g transform="translate(240 240)">
              <motion.circle
                cx="0" cy="0" r="32"
                stroke={ACCENT} strokeWidth="1.5"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 4.2, opacity: 0 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
              <motion.circle
                cx="0" cy="0" r="32"
                stroke={ACCENT} strokeWidth="1"
                initial={{ scale: 1, opacity: 0.25 }}
                animate={{ scale: 6.5, opacity: 0 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 2, repeatDelay: 1 }}
              />
            </g>

            {/* Connection lines */}
            <line x1="240" y1="240" x2="360" y2="120" stroke="#2F3A4D" strokeWidth="0.7" opacity="0.35" />
            <line x1="240" y1="240" x2="100" y2="150" stroke="#2F3A4D" strokeWidth="0.7" opacity="0.35" />
            <line x1="240" y1="240" x2="90"  y2="320" stroke="#2F3A4D" strokeWidth="0.7" opacity="0.35" />
            <line x1="240" y1="240" x2="370" y2="340" stroke="#2F3A4D" strokeWidth="0.7" opacity="0.35" />
            <line x1="240" y1="240" x2="240" y2="50"  stroke="#2F3A4D" strokeWidth="0.7" opacity="0.25" />
            <line x1="100" y1="150" x2="360" y2="120" stroke="#2F3A4D" strokeWidth="0.5" opacity="0.15" />
            <line x1="90"  y1="320" x2="370" y2="340" stroke="#2F3A4D" strokeWidth="0.5" opacity="0.15" />

            {/* Core */}
            <circle cx="240" cy="240" r="10" fill={DARK} />
            <circle cx="240" cy="240" r="4"  fill={ACCENT} />

            {/* Peripheral nodes */}
            <circle cx="360" cy="120" r="9"   fill={DARK} />
            <circle cx="360" cy="120" r="3.5" fill={ACCENT_DIM} />
            <circle cx="100" cy="150" r="7"   fill="#2F3A4D" />
            <circle cx="100" cy="150" r="2.5" fill={ACCENT} />
            <circle cx="90"  cy="320" r="9"   fill={DARK} />
            <circle cx="90"  cy="320" r="3.5" fill={ACCENT} />
            <circle cx="370" cy="340" r="7"   fill="#2F3A4D" />
            <circle cx="370" cy="340" r="2.5" fill={ACCENT_DIM} />
            <circle cx="240" cy="50"  r="5"   fill="#2F3A4D" opacity="0.5" />

            {/* Orbiting dots — <g> with style originX/originY for React */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
              style={{ originX: '240px', originY: '240px' }}
            >
              <circle cx="240" cy="90" r="5" fill={ACCENT} />
            </motion.g>

            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
              style={{ originX: '240px', originY: '240px' }}
            >
              <circle cx="240" cy="32" r="3.5" fill={ACCENT_DIM} opacity="0.55" />
            </motion.g>
          </svg>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ delay: 2.2 }}
        aria-hidden="true"
      >
        <div className="w-[1px] h-12" style={{ background: DARK }} />
      </motion.div>
    </section>
  );
}

// ==========================================
// MANIFESTO — emotional heart, almost empty
// ==========================================

function ManifestoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const lines = [
    { text: 'Operations change.',    opacity: 0.52, weight: '300' },
    { text: 'People change.',        opacity: 0.68, weight: '300' },
    { text: "Experience shouldn't.", opacity: 1.0,  weight: '600' },
  ];

  return (
    <section
      className="py-44 md:py-64 px-6 md:px-8 text-center"
      style={{ background: SURFACE }}
      aria-label="Manifesto"
    >
      <div className="mx-auto max-w-4xl" ref={ref}>
        <div className="space-y-5 md:space-y-6">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              custom={i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUpVariant}
              className="tracking-tight leading-[1.1]"
              style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
                color: PRIMARY,
                opacity: line.opacity,
                fontWeight: line.weight
              }}
            >
              {line.text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// EYEBROW
// ==========================================

function Eyebrow({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <div
      className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-8"
      style={{ color: muted ? SECONDARY : ACCENT }}
    >
      {children}
    </div>
  );
}

// ==========================================
// WHY WE EXIST
// ==========================================

function WhySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  const statements = [
    'Knowledge disappears.',
    'Experience leaves.',
    'Operations restart.',
    'Teams begin again.',
  ];

  return (
    <section id="why" className="py-32 md:py-44" style={{ background: BG }}>
      <div className="mx-auto px-6 md:px-8 max-w-5xl" ref={ref}>
        <Eyebrow>Why We Exist</Eyebrow>

        <div className="space-y-7 mb-20">
          {statements.map((text, i) => (
            <motion.p
              key={i}
              custom={i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUpVariant}
              className="font-medium tracking-tight leading-[1.1]"
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)',
                color: PRIMARY,
                opacity: 0.25 + i * 0.2
              }}
            >
              {text}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUpVariant}
          custom={statements.length + 1}
          className="border-l-[3px] pl-8 py-2"
          style={{ borderColor: ACCENT }}
        >
          <p
            className="text-2xl md:text-[1.7rem] font-semibold leading-[1.3] mb-4"
            style={{ color: PRIMARY }}
          >
            Autonomatex exists so that operational intelligence compounds instead of disappearing.
          </p>
          <p className="text-base leading-[1.8] max-w-lg" style={{ color: SECONDARY }}>
            Every organization carries knowledge in its people — patterns recognized,
            decisions made, lessons earned over years. When those people move on, that
            intelligence must not go with them.
          </p>
        </motion.div>
      </div>
      <NodeDivider />
    </section>
  );
}

// ==========================================
// OPERATIONAL INTELLIGENCE
// ==========================================

function OperationalIntelligenceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section id="intelligence" className="py-28 md:py-40" style={{ background: SURFACE }}>
      <div className="mx-auto px-6 md:px-8 max-w-6xl" ref={ref}>
        <Eyebrow>Operational Intelligence</Eyebrow>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.h2
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUpVariant}
            className="text-3xl md:text-[2.1rem] font-semibold leading-[1.2] tracking-tight"
            style={{ color: PRIMARY }}
          >
            Intelligence built from experience —<br />not assumptions.
          </motion.h2>

          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="space-y-6"
          >
            {[
              'Most systems are built to process data. Operational Intelligence is built to preserve experience — the knowledge of what actually happened, what decisions were made, and why they worked.',
              'Organizations that build Operational Intelligence don\'t just operate better today. They grow wiser with every passing year.'
            ].map((para, i) => (
              <motion.p key={i} variants={staggerItem} className="text-base leading-[1.85]" style={{ color: SECONDARY }}>
                {para}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="mx-auto px-6 md:px-8 max-w-6xl mt-16">
        <NodeDivider />
      </div>
    </section>
  );
}

// ==========================================
// OUR THINKING — typographic drama
// ==========================================

function OurThinkingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const pillars = [
    {
      number: '01',
      title: 'Technology should reduce complexity.',
      body: 'If a system makes operations harder to understand, it is the wrong system. Clarity is a design requirement.'
    },
    {
      number: '02',
      title: 'Humans remain responsible.',
      body: 'AI surfaces patterns and supports decisions. Accountability belongs to people. Every recommendation is a suggestion — never a mandate.'
    },
    {
      number: '03',
      title: 'Knowledge compounds.',
      body: 'The longer an intelligence system operates within an environment, the more accurate and valuable it becomes. This is the architecture.'
    },
    {
      number: '04',
      title: 'Build for decades, not quarters.',
      body: 'We make decisions about technology the way sound organizations make decisions about anything important — with long-term consequences in mind.'
    }
  ];

  return (
    <section id="thinking" className="py-28 md:py-36 border-y" style={{ background: BG, borderColor: BORDER }}>
      <div className="mx-auto px-6 md:px-8 max-w-7xl" ref={ref}>
        <Eyebrow>Our Thinking</Eyebrow>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2"
        >
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              className="relative overflow-hidden p-10 md:p-14"
              style={{
                borderRight: idx % 2 === 0 ? `1px solid ${BORDER}` : 'none',
                borderBottom: idx < 2 ? `1px solid ${BORDER}` : 'none'
              }}
            >
              {/* Display-scale ghost number */}
              <div
                className="absolute top-6 right-6 font-bold select-none pointer-events-none"
                style={{ fontSize: '7rem', color: DARK, opacity: 0.035, lineHeight: 1 }}
                aria-hidden="true"
              >
                {pillar.number}
              </div>

              <div
                className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6"
                style={{ color: ACCENT }}
              >
                {pillar.number}
              </div>

              <h3
                className="text-xl md:text-[1.3rem] font-semibold mb-4 leading-[1.25] relative z-10"
                style={{ color: PRIMARY }}
              >
                {pillar.title}
              </h3>
              <p className="text-[15px] leading-[1.8] relative z-10" style={{ color: SECONDARY }}>
                {pillar.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// INTELLIGENCE ARCHITECTURE — SVG diagram
// ==========================================

function ArchitectureDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const layers = [
    { id: 'human',       label: 'Human Intelligence',        sub: 'Every insight begins with the people who do the work.',           icon: BrainCircuit },
    { id: 'memory',      label: 'Memory Intelligence',        sub: 'Operational patterns are captured so knowledge compounds.',        icon: Database },
    { id: 'decision',    label: 'Decision Intelligence',      sub: 'Context-aware frameworks guide consistent, high-quality decisions.', icon: GitMerge },
    { id: 'operational', label: 'Operational Intelligence',   sub: 'Human experience and operational data create a living layer.',     icon: Cpu },
    { id: 'continuous',  label: 'Continuous Intelligence',    sub: 'Each decision feeds the system forward. The organization grows smarter.', icon: RefreshCcw },
  ];

  const BOX_W = 560;
  const BOX_H = 58;
  const GAP   = 26;
  const STEP  = BOX_H + GAP;
  const SVG_W = BOX_W + 80;
  const SVG_H = layers.length * STEP - GAP + 2;
  const X0    = 40;

  return (
    <div ref={ref}>
      {/* Desktop: SVG diagram */}
      <div className="hidden md:block" aria-label="Five-layer intelligence architecture diagram">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full"
          style={{ maxWidth: 680 }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {layers.map((layer, i) => {
            const y = i * STEP;
            const isCore = layer.id === 'operational';
            const delay  = i * 0.12;

            return (
              <g key={layer.id}>
                {/* Connector line to next layer */}
                {i < layers.length - 1 && (
                  <motion.line
                    x1={X0 + BOX_W / 2} y1={y + BOX_H}
                    x2={X0 + BOX_W / 2} y2={y + BOX_H + GAP}
                    stroke={BORDER}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: delay + 0.3, duration: 0.4 }}
                  />
                )}

                {/* Animated data dot on connector */}
                {i < layers.length - 1 && isInView && (
                  <motion.circle
                    r="3"
                    fill={ACCENT}
                    initial={{ cx: X0 + BOX_W / 2, cy: y + BOX_H }}
                    animate={{ cx: X0 + BOX_W / 2, cy: y + BOX_H + GAP }}
                    transition={{
                      delay: delay + 1.2,
                      duration: 0.6,
                      repeat: Infinity,
                      repeatDelay: layers.length * 0.5 + 1,
                      ease: EASE
                    }}
                    opacity={0.7}
                  />
                )}

                {/* Layer box */}
                <motion.rect
                  x={X0} y={y}
                  width={BOX_W} height={BOX_H}
                  rx="8"
                  fill={isCore ? DARK : SURFACE}
                  stroke={isCore ? ACCENT : BORDER}
                  strokeWidth={isCore ? 1.5 : 1}
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ delay, duration: 0.55, ease: EASE }}
                />

                {/* Label */}
                <motion.text
                  x={X0 + 48}
                  y={y + BOX_H / 2 + 5}
                  fontSize="15"
                  fontWeight={isCore ? '600' : '500'}
                  fill={isCore ? '#FAFBFC' : PRIMARY}
                  fontFamily="Inter, system-ui, sans-serif"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: delay + 0.15, duration: 0.4 }}
                >
                  {layer.label}
                </motion.text>

                {/* Icon dot */}
                <motion.circle
                  cx={X0 + 24}
                  cy={y + BOX_H / 2}
                  r="7"
                  fill={isCore ? `${ACCENT}30` : DEEP_ALT}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: delay + 0.1, duration: 0.4 }}
                />
                <motion.circle
                  cx={X0 + 24}
                  cy={y + BOX_H / 2}
                  r="3"
                  fill={isCore ? ACCENT : '#2F3A4D'}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: delay + 0.2, duration: 0.4 }}
                />

                {/* Sub-label to the right of box */}
                <motion.text
                  x={X0 + BOX_W + 20}
                  y={y + BOX_H / 2 + 4}
                  fontSize="11.5"
                  fill={SECONDARY}
                  fontFamily="Inter, system-ui, sans-serif"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
                  transition={{ delay: delay + 0.3, duration: 0.5 }}
                >
                  {/* Wrapped manually for SVG — show short version */}
                  {layer.sub.length > 48 ? layer.sub.slice(0, 48) + '…' : layer.sub}
                </motion.text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile: clean vertical list */}
      <div className="md:hidden space-y-3">
        {layers.map((layer, i) => {
          const isCore = layer.id === 'operational';
          const Icon = layer.icon;
          return (
            <motion.div
              key={layer.id}
              custom={i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUpVariant}
              className="flex items-start gap-4 p-5 rounded-xl border"
              style={{
                background: isCore ? DARK : SURFACE,
                borderColor: isCore ? ACCENT : BORDER
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: isCore ? `${ACCENT}25` : DEEP_ALT }}
              >
                <Icon className="w-4 h-4" style={{ color: isCore ? ACCENT : '#2F3A4D' }} />
              </div>
              <div>
                <h3
                  className="text-[15px] font-semibold mb-1"
                  style={{ color: isCore ? '#FAFBFC' : PRIMARY }}
                >
                  {layer.label}
                </h3>
                <p
                  className="text-[13px] leading-[1.7]"
                  style={{ color: isCore ? `${ACCENT_DIM}cc` : SECONDARY }}
                >
                  {layer.sub}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ArchitectureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section id="architecture" className="py-28 md:py-40" style={{ background: SURFACE }}>
      <div className="mx-auto px-6 md:px-8 max-w-5xl" ref={ref}>
        <Eyebrow>Intelligence Architecture</Eyebrow>

        <div className="mb-14 max-w-xl">
          <motion.h2
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUpVariant}
            className="text-3xl md:text-[2.1rem] font-semibold leading-[1.2] tracking-tight"
            style={{ color: PRIMARY }}
          >
            Five layers.<br />One compounding system.
          </motion.h2>
          <motion.p
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUpVariant}
            custom={1}
            className="mt-5 text-[15px] leading-[1.8]"
            style={{ color: SECONDARY }}
          >
            Each layer builds on the one before it. Over time, the entire system
            becomes more accurate, more consistent, and more valuable.
          </motion.p>
        </div>

        <ArchitectureDiagram />
      </div>
    </section>
  );
}

// ==========================================
// PRINCIPLES
// ==========================================

function PrinciplesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const principles = [
    { title: 'Experience compounds.',     text: 'Every operational cycle adds to the intelligence of the system. Value grows with time, not against it.' },
    { title: 'Humans remain accountable.', text: 'Intelligence advises. People decide. Responsibility is never delegated to a machine.' },
    { title: 'Knowledge should survive.',  text: 'When experience exits the organization, the intelligence stays. Continuity is built in.' },
    { title: 'Trust is earned.',           text: 'We build incrementally, transparently, and only claim what we can demonstrate.' },
    { title: 'Design for decades.',        text: 'Every architectural decision considers what must hold for the next twenty years.' },
    { title: 'Reduce complexity.',         text: 'If a system makes operations harder to understand, it is the wrong system.' },
  ];

  return (
    <section id="principles" className="py-28 md:py-40" style={{ background: BG }}>
      <div className="mx-auto px-6 md:px-8 max-w-7xl" ref={ref}>
        <Eyebrow>Our Principles</Eyebrow>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
        >
          {principles.map((p, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              className="border rounded-xl p-8"
              style={{ borderColor: BORDER, background: SURFACE }}
            >
              <h3 className="text-[16px] font-semibold mb-3 leading-snug" style={{ color: PRIMARY }}>
                {p.title}
              </h3>
              <p className="text-[14px] leading-[1.8]" style={{ color: SECONDARY }}>{p.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Human warmth — one quiet line */}
        <motion.p
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUpVariant}
          custom={principles.length + 1}
          className="mt-16 text-center text-[15px] font-light italic"
          style={{ color: SECONDARY, opacity: 0.75 }}
        >
          Technology should help people do their best work. Not replace them.
        </motion.p>
      </div>
      <div className="mx-auto px-6 md:px-8 max-w-7xl mt-14">
        <NodeDivider />
      </div>
    </section>
  );
}

// ==========================================
// SECURITY
// ==========================================

function SecuritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const items = [
    { label: 'Privacy',                     desc: 'Data sovereignty and privacy-by-design at every layer. Your operational data belongs to you.',          icon: <Lock       className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> },
    { label: 'Security by Design',           desc: 'Security is a foundation, not a feature. Every system is built on zero-trust principles from day one.', icon: <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> },
    { label: 'Responsible AI',               desc: 'All AI systems undergo rigorous evaluation for reliability, consistency, and alignment with human values.', icon: <Scale      className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> },
    { label: 'Human Oversight',              desc: 'No automated action occurs without defined human review checkpoints. Autonomy is always bounded.',       icon: <Eye        className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> },
    { label: 'Transparency',                 desc: 'Organizations have full visibility into how their intelligence systems operate and inform decisions.',    icon: <Activity   className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> },
    { label: 'Compliance-Ready',             desc: 'Built to accommodate regulatory requirements across jurisdictions without architectural rework.',         icon: <FileCheck  className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> },
    { label: 'Enterprise Infrastructure',    desc: 'Infrastructure that scales with operational demand without compromising availability or reliability.',    icon: <Server     className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> }
  ];

  return (
    <section id="security" className="py-28 md:py-40" style={{ background: DEEP_ALT }}>
      <div className="mx-auto px-6 md:px-8 max-w-6xl" ref={ref}>
        <Eyebrow>Security and Trust</Eyebrow>

        <div className="mb-14 max-w-2xl">
          <motion.h2
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUpVariant}
            className="text-3xl font-semibold leading-[1.2] tracking-tight"
            style={{ color: PRIMARY }}
          >
            Designed to be trusted by organizations that cannot afford mistakes.
          </motion.h2>
        </div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10"
        >
          {items.map((item, idx) => (
            <motion.div key={idx} variants={staggerItem} className="flex gap-4">
              <div className="mt-0.5">{item.icon}</div>
              <div>
                <h4 className="text-[15px] font-semibold mb-1.5" style={{ color: PRIMARY }}>{item.label}</h4>
                <p className="text-[14px] leading-[1.8]" style={{ color: SECONDARY }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// VISION — closed narrative arc
// ==========================================

function VisionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section id="vision" className="py-40 md:py-56 text-center px-6 md:px-8" style={{ background: DARK }}>
      <div className="mx-auto max-w-3xl" ref={ref}>
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.div variants={staggerItem}>
            <span
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-16 inline-block"
              style={{ color: ACCENT }}
            >
              Vision
            </span>
          </motion.div>

          <motion.p
            variants={staggerItem}
            className="font-semibold leading-[1.15] tracking-tight mb-10"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
              color: '#FAFBFC'
            }}
          >
            Experience becomes intelligence
            <br />only when it is remembered.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="w-8 h-[2px] mx-auto mb-10"
            style={{ background: ACCENT }}
          />

          <motion.p
            variants={staggerItem}
            className="text-[1.05rem] font-light leading-[1.85] max-w-xl mx-auto"
            style={{ color: '#8899A8' }}
          >
            Every organization creates knowledge. Autonomatex is building the
            architecture that ensures it is never lost — for any organization
            where experience and decision quality matter.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// BEGIN THE CONVERSATION
// ==========================================

function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitted');
  };

  const inputClass = [
    'w-full bg-white border rounded-md px-4 py-3 text-[14px] transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'placeholder:text-[#667085]/50'
  ].join(' ');

  const inputStyle = { borderColor: BORDER, color: PRIMARY, '--tw-ring-color': ACCENT } as React.CSSProperties;

  return (
    <section id="contact" className="py-28 md:py-40" style={{ background: SURFACE }}>
      <div className="mx-auto px-6 md:px-8 max-w-2xl">
        <Eyebrow>Begin the Conversation</Eyebrow>
        <h2
          className="text-3xl md:text-[2.1rem] font-semibold tracking-tight leading-[1.2] mb-4"
          style={{ color: PRIMARY }}
        >
          We would be glad to learn about your organization.
        </h2>
        <p className="text-[15px] mb-12 leading-[1.8]" style={{ color: SECONDARY }}>
          We engage with a small number of organizations at a time. Tell us about yours.
        </p>

        {status === 'submitted' ? (
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="rounded-xl p-14 flex flex-col items-center border"
            style={{ background: BG, borderColor: BORDER }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center mb-6"
              style={{ background: `${ACCENT}18` }}
            >
              <ShieldCheck className="w-5 h-5" style={{ color: ACCENT }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: PRIMARY }}>Message received.</h3>
            <p className="text-[14px] text-center" style={{ color: SECONDARY }}>
              Thank you for reaching out. A representative will be in touch shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border p-8 md:p-10"
            style={{ background: BG, borderColor: BORDER }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-[13px] font-medium" style={{ color: PRIMARY }}>Name</label>
                <input required type="text" id="name" name="name" autoComplete="name"
                  className={inputClass} style={inputStyle} />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-[13px] font-medium" style={{ color: PRIMARY }}>Company</label>
                <input required type="text" id="company" name="company" autoComplete="organization"
                  className={inputClass} style={inputStyle} />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-[13px] font-medium" style={{ color: PRIMARY }}>Business Email</label>
              <input required type="email" id="email" name="email" autoComplete="email"
                className={inputClass} style={inputStyle} />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-[13px] font-medium" style={{ color: PRIMARY }}>Message</label>
              <textarea
                required id="message" name="message" autoComplete="off" rows={5}
                placeholder="Tell us about your organization."
                className={inputClass + ' resize-none'}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-md text-[14px] font-medium text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-[#2F3A4D]"
              style={{ background: DARK, '--tw-ring-color': ACCENT } as React.CSSProperties}
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ==========================================
// FOOTER — extremely minimal
// ==========================================

function Footer() {
  return (
    <footer className="border-t" style={{ background: SURFACE, borderColor: BORDER }}>
      <div className="mx-auto px-6 md:px-8 max-w-7xl py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2.5">
          <AtxMark size={17} />
          <span className="text-[13px] font-medium" style={{ color: PRIMARY }}>Autonomatex</span>
        </div>

        <div className="flex items-center gap-6">
          {['Privacy', 'Terms'].map((label) => (
            <a
              key={label}
              href="#"
              className="text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm"
              style={{ color: SECONDARY, '--tw-ring-color': ACCENT } as React.CSSProperties}
              onMouseEnter={e => { e.currentTarget.style.color = PRIMARY; }}
              onMouseLeave={e => { e.currentTarget.style.color = SECONDARY; }}
            >
              {label}
            </a>
          ))}
          <button
            onClick={() => doScrollTo('contact')}
            className="text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm"
            style={{ color: SECONDARY, '--tw-ring-color': ACCENT } as React.CSSProperties}
            onMouseEnter={e => { e.currentTarget.style.color = PRIMARY; }}
            onMouseLeave={e => { e.currentTarget.style.color = SECONDARY; }}
          >
            Contact
          </button>
          <p className="text-[12px]" style={{ color: `${SECONDARY}80` }}>
            &copy; {new Date().getFullYear()} Autonomatex
          </p>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// MAIN PAGE
// ==========================================

function SinglePageSite() {
  return (
    <div className="min-h-screen w-full" style={{ background: BG }}>
      {/* Skip-to-content for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-medium focus:text-white"
        style={{ background: DARK }}
      >
        Skip to main content
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <ManifestoSection />
        <WhySection />
        <OperationalIntelligenceSection />
        <OurThinkingSection />
        <ArchitectureSection />
        <PrinciplesSection />
        <SecuritySection />
        <VisionSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={SinglePageSite} />
      <Route component={() => (
        <div className="p-20 text-center text-xl" style={{ color: PRIMARY }}>Page not found</div>
      )} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MotionConfig reducedMotion="user">
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
        </MotionConfig>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
