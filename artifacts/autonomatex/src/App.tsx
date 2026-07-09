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

// ==========================================
// ANIMATION VARIANTS
// ==========================================

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

const fadeUpVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: custom * 0.12, ease: EASE }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.14 } }
};

const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } }
};

const mobileMenuVariant = {
  hidden: { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } },
  exit: { opacity: 0, x: '100%', transition: { duration: 0.25, ease: EASE } }
};

// ==========================================
// SHARED HELPERS
// ==========================================

function doScrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ── WORDMARK MARK (SVG) ──────────────────────────────────────────────────────
// A minimal node-and-orbit glyph that echoes the hero illustration

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
      <circle cx="11" cy="11" r="2.5" fill="#1E2433" />
      <circle cx="11" cy="11" r="1" fill="#16C6B7" />
      <circle cx="11" cy="4"  r="1.2" fill="#1E2433" opacity="0.5" />
      <circle cx="18" cy="11" r="1.2" fill="#1E2433" opacity="0.5" />
      <circle cx="11" cy="18" r="1.2" fill="#1E2433" opacity="0.5" />
      <circle cx="4"  cy="11" r="1.2" fill="#1E2433" opacity="0.5" />
      <circle cx="16.5" cy="5.5" r="0.9" fill="#16C6B7" opacity="0.6" />
      <line x1="11" y1="11" x2="11" y2="5.2"  stroke="#1E2433" strokeWidth="0.6" opacity="0.3" />
      <line x1="11" y1="11" x2="17" y2="11"   stroke="#1E2433" strokeWidth="0.6" opacity="0.3" />
      <line x1="11" y1="11" x2="11" y2="16.8" stroke="#1E2433" strokeWidth="0.6" opacity="0.3" />
      <line x1="11" y1="11" x2="5"  y2="11"   stroke="#1E2433" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

// ── SECTION NODE DIVIDER ─────────────────────────────────────────────────────
// Visual throughline: small 3-node horizontal motif between sections

function NodeDivider() {
  return (
    <div className="flex items-center justify-center gap-2 py-2" aria-hidden="true">
      <div className="w-[1px] h-5" style={{ background: '#E6EAF0' }} />
      <svg width="40" height="10" viewBox="0 0 40 10" fill="none">
        <circle cx="5"  cy="5" r="2"   fill="#E6EAF0" />
        <circle cx="20" cy="5" r="2.5" fill="#16C6B7" opacity="0.5" />
        <circle cx="35" cy="5" r="2"   fill="#E6EAF0" />
        <line x1="7" y1="5" x2="17.5" y2="5" stroke="#E6EAF0" strokeWidth="0.8" />
        <line x1="22.5" y1="5" x2="33" y2="5" stroke="#E6EAF0" strokeWidth="0.8" />
      </svg>
      <div className="w-[1px] h-5" style={{ background: '#E6EAF0' }} />
    </div>
  );
}

// ==========================================
// SCROLL PROGRESS
// ==========================================

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
      style={{ scaleX, background: '#16C6B7' }}
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

  // Close mobile menu on scroll
  useEffect(() => {
    if (!mobileOpen) return;
    const close = () => setMobileOpen(false);
    window.addEventListener('scroll', close, { once: true, passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [mobileOpen]);

  // Trap scroll behind overlay
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    setTimeout(() => doScrollTo(id), 50);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md border-b py-4'
            : 'bg-transparent py-7'
        }`}
        style={{ borderColor: isScrolled ? '#E6EAF0' : 'transparent' }}
      >
        <div className="mx-auto px-6 md:px-8 max-w-7xl flex items-center justify-between">
          {/* Wordmark */}
          <button
            onClick={() => doScrollTo('home')}
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm"
            style={{ '--tw-ring-color': '#16C6B7' } as React.CSSProperties}
            aria-label="Autonomatex — return to top"
          >
            <AtxMark size={20} />
            <span className="font-semibold text-[17px] tracking-[-0.01em]" style={{ color: '#101828' }}>
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
                  color: activeSection === link.id ? '#16C6B7' : '#667085',
                  '--tw-ring-color': '#16C6B7'
                } as React.CSSProperties}
                onMouseEnter={e => { if (activeSection !== link.id) e.currentTarget.style.color = '#101828'; }}
                onMouseLeave={e => { if (activeSection !== link.id) e.currentTarget.style.color = '#667085'; }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* CTA button — desktop */}
            <button
              onClick={() => handleNavClick('contact')}
              className="hidden lg:block text-[13px] font-medium px-5 py-2.5 rounded-md border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                borderColor: '#E6EAF0',
                color: '#101828',
                '--tw-ring-color': '#16C6B7'
              } as React.CSSProperties}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#16C6B7';
                e.currentTarget.style.color = '#16C6B7';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E6EAF0';
                e.currentTarget.style.color = '#101828';
              }}
            >
              Start a Conversation
            </button>

            {/* Hamburger — mobile/tablet */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ color: '#101828', '--tw-ring-color': '#16C6B7' } as React.CSSProperties}
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
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              variants={mobileMenuVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col"
              style={{ background: '#FFFFFF', borderLeft: '1px solid #E6EAF0' }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#E6EAF0' }}>
                <div className="flex items-center gap-2">
                  <AtxMark size={18} />
                  <span className="font-semibold text-[15px]" style={{ color: '#101828' }}>Autonomatex</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ color: '#667085', '--tw-ring-color': '#16C6B7' } as React.CSSProperties}
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col gap-1 px-4 py-4 flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className="text-left px-3 py-3 rounded-lg text-[15px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      color: activeSection === link.id ? '#16C6B7' : '#101828',
                      background: activeSection === link.id ? 'rgba(22,198,183,0.07)' : 'transparent',
                      '--tw-ring-color': '#16C6B7'
                    } as React.CSSProperties}
                    aria-current={activeSection === link.id ? 'true' : undefined}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              {/* CTA */}
              <div className="px-4 pb-8 pt-2 border-t" style={{ borderColor: '#E6EAF0' }}>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="w-full py-3.5 rounded-md text-[14px] font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ background: '#1E2433', '--tw-ring-color': '#16C6B7' } as React.CSSProperties}
                >
                  Start a Conversation
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
// HERO
// ==========================================

function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center pt-28 pb-24 overflow-hidden"
      style={{ background: '#FAFBFC' }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #1E2433 1px, transparent 1px), linear-gradient(to bottom, #1E2433 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: 0.035
        }}
      />
      {/* Accent glow — subtler */}
      <div
        className="absolute top-1/4 right-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #16C6B7, transparent 70%)', opacity: 0.05 }}
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
              className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase mb-10"
              style={{ color: '#16C6B7' }}
            >
              Operational Intelligence
            </span>
          </motion.div>

          {/* Hero headline — intentional typographic contrast */}
          <motion.h1
            variants={staggerItem}
            className="tracking-[-0.02em] leading-[1.06] mb-10"
          >
            <span
              className="block font-bold"
              style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', color: '#101828' }}
            >
              Every organization
              <br />creates knowledge.
            </span>
            {/* Deliberately smaller + italic + lighter — intentional contrast, not accident */}
            <span
              className="block font-light italic mt-3"
              style={{
                fontSize: 'clamp(1.6rem, 2.8vw, 2.8rem)',
                color: '#667085',
                letterSpacing: '-0.01em'
              }}
            >
              Very few keep it.
            </span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-[17px] leading-[1.75] mb-10 max-w-lg"
            style={{ color: '#667085' }}
          >
            Autonomatex transforms operational experience into long-term business
            intelligence — preserving knowledge, improving decision quality, and keeping
            humans in control.
          </motion.p>

          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => doScrollTo('why')}
              className="px-8 py-4 rounded-md text-[14px] font-medium text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: '#1E2433', '--tw-ring-color': '#16C6B7' } as React.CSSProperties}
              onMouseEnter={e => { e.currentTarget.style.background = '#2F3A4D'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#1E2433'; }}
            >
              Our Purpose
            </button>
            <button
              onClick={() => doScrollTo('contact')}
              className="px-8 py-4 rounded-md text-[14px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: 'transparent',
                color: '#101828',
                border: '1px solid #E6EAF0',
                '--tw-ring-color': '#16C6B7'
              } as React.CSSProperties}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#101828'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E6EAF0'; }}
            >
              Start a Conversation
            </button>
          </motion.div>
        </motion.div>

        {/* Abstract SVG — orbit fixed for cross-browser (no transformOrigin on SVG elements) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
          className="hidden lg:flex items-center justify-center"
          aria-hidden="true"
        >
          <svg viewBox="0 0 480 480" className="w-full max-w-[460px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Rings */}
            <circle cx="240" cy="240" r="210" stroke="#E6EAF0" strokeWidth="1" />
            <circle cx="240" cy="240" r="150" stroke="#E6EAF0" strokeWidth="1" />
            <circle cx="240" cy="240" r="90"  stroke="#E6EAF0" strokeWidth="1" />
            <circle cx="240" cy="240" r="32"  stroke="#E6EAF0" strokeWidth="1" />

            {/* Pulse rings — use <g transform> at center, no CSS transformOrigin */}
            <g transform="translate(240 240)">
              <motion.circle
                cx="0" cy="0" r="32"
                stroke="#16C6B7" strokeWidth="1.5"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
              />
              <motion.circle
                cx="0" cy="0" r="32"
                stroke="#16C6B7" strokeWidth="1"
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 6, opacity: 0 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1.5, repeatDelay: 0.5 }}
              />
            </g>

            {/* Connection lines */}
            <line x1="240" y1="240" x2="360" y2="120" stroke="#2F3A4D" strokeWidth="0.8" opacity="0.4" />
            <line x1="240" y1="240" x2="100" y2="150" stroke="#2F3A4D" strokeWidth="0.8" opacity="0.4" />
            <line x1="240" y1="240" x2="90"  y2="320" stroke="#2F3A4D" strokeWidth="0.8" opacity="0.4" />
            <line x1="240" y1="240" x2="370" y2="340" stroke="#2F3A4D" strokeWidth="0.8" opacity="0.4" />
            <line x1="240" y1="240" x2="240" y2="50"  stroke="#2F3A4D" strokeWidth="0.8" opacity="0.3" />
            <line x1="100" y1="150" x2="360" y2="120" stroke="#2F3A4D" strokeWidth="0.6" opacity="0.2" />
            <line x1="90"  y1="320" x2="370" y2="340" stroke="#2F3A4D" strokeWidth="0.6" opacity="0.2" />
            <line x1="360" y1="120" x2="370" y2="340" stroke="#2F3A4D" strokeWidth="0.6" opacity="0.15" />

            {/* Core */}
            <circle cx="240" cy="240" r="10" fill="#1E2433" />
            <circle cx="240" cy="240" r="4"  fill="#16C6B7" />

            {/* Peripheral nodes */}
            <circle cx="360" cy="120" r="9"   fill="#1E2433" />
            <circle cx="360" cy="120" r="3.5" fill="#3FD9FF" />
            <circle cx="100" cy="150" r="7"   fill="#2F3A4D" />
            <circle cx="100" cy="150" r="2.5" fill="#16C6B7" />
            <circle cx="90"  cy="320" r="9"   fill="#1E2433" />
            <circle cx="90"  cy="320" r="3.5" fill="#16C6B7" />
            <circle cx="370" cy="340" r="7"   fill="#2F3A4D" />
            <circle cx="370" cy="340" r="2.5" fill="#3FD9FF" />
            <circle cx="240" cy="50"  r="5"   fill="#2F3A4D" opacity="0.6" />

            {/* Orbiting dots — use <g transform> at center, rotate the group */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{ originX: '240px', originY: '240px' }}
            >
              <circle cx="240" cy="90" r="5" fill="#16C6B7" />
            </motion.g>

            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              style={{ originX: '240px', originY: '240px' }}
            >
              <circle cx="240" cy="32" r="3.5" fill="#3FD9FF" opacity="0.6" />
            </motion.g>
          </svg>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 1.8 }}
        aria-hidden="true"
      >
        <div className="w-[1px] h-12" style={{ background: '#1E2433' }} />
      </motion.div>
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
      style={{ color: muted ? '#667085' : '#16C6B7' }}
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
    <section id="why" className="py-32 md:py-44" style={{ background: '#FFFFFF' }}>
      <div className="mx-auto px-6 md:px-8 max-w-5xl" ref={ref}>
        <Eyebrow>Why We Exist</Eyebrow>

        <div className="space-y-8 mb-20">
          {statements.map((text, i) => (
            <motion.p
              key={i}
              custom={i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUpVariant}
              className="font-medium tracking-tight leading-[1.12]"
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)',
                color: '#101828',
                opacity: 0.28 + i * 0.2
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
          style={{ borderColor: '#16C6B7' }}
        >
          <p
            className="text-2xl md:text-3xl font-semibold leading-[1.3] mb-4"
            style={{ color: '#101828' }}
          >
            Autonomatex exists so that operational intelligence compounds instead of disappearing.
          </p>
          <p className="text-base leading-relaxed max-w-xl" style={{ color: '#667085' }}>
            Every organization carries knowledge in its people — patterns recognized, decisions made,
            lessons earned over years. When those people move on, that intelligence must not go with them.
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
    <section id="intelligence" className="py-28 md:py-36" style={{ background: '#FAFBFC' }}>
      <div className="mx-auto px-6 md:px-8 max-w-6xl" ref={ref}>
        <Eyebrow>Operational Intelligence</Eyebrow>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.h2
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUpVariant}
            className="text-3xl md:text-4xl font-semibold leading-[1.2] tracking-tight"
            style={{ color: '#101828' }}
          >
            Intelligence built from experience — not assumptions.
          </motion.h2>

          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="space-y-6"
          >
            {[
              'Most systems are built to process data. Operational Intelligence is built to preserve experience — the knowledge of what actually happened, what decisions were made, and why they worked or did not.',
              'It is the discipline of capturing, structuring, and continuously learning from the lived operational reality of an organization — so that knowledge compounds with time rather than dissolving when circumstances change.',
              'Organizations that build Operational Intelligence don\'t just operate better today. They grow wiser with every passing year.'
            ].map((para, i) => (
              <motion.p key={i} variants={staggerItem} className="text-base leading-[1.8]" style={{ color: '#667085' }}>
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
// OUR THINKING — with typographic drama
// ==========================================

function OurThinkingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const pillars = [
    {
      number: '01',
      title: 'Technology should reduce complexity.',
      body: 'If a system makes your operations harder to understand, it is the wrong system. We design for clarity above all else.'
    },
    {
      number: '02',
      title: 'Humans remain responsible.',
      body: 'AI surfaces patterns and supports decisions. Accountability belongs to people. Every recommendation is a suggestion — never a mandate.'
    },
    {
      number: '03',
      title: 'Knowledge compounds.',
      body: 'The longer an intelligence system operates within an environment, the more accurate and valuable it becomes. This is not a feature. It is the architecture.'
    },
    {
      number: '04',
      title: 'Build for decades, not quarters.',
      body: 'We make decisions about technology the same way a sound organization makes decisions about anything important — with long-term consequences in mind.'
    }
  ];

  return (
    <section id="thinking" className="py-28 md:py-36 border-y" style={{ background: '#FFFFFF', borderColor: '#E6EAF0' }}>
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
                borderRight: idx % 2 === 0 ? '1px solid #E6EAF0' : 'none',
                borderBottom: idx < 2 ? '1px solid #E6EAF0' : 'none'
              }}
            >
              {/* Display-scale background number — typographic drama */}
              <div
                className="absolute top-6 right-6 font-bold select-none pointer-events-none leading-none"
                style={{ fontSize: '7rem', color: '#1E2433', opacity: 0.04, lineHeight: 1 }}
                aria-hidden="true"
              >
                {pillar.number}
              </div>

              {/* Small foreground number */}
              <div
                className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-6"
                style={{ color: '#16C6B7' }}
              >
                {pillar.number}
              </div>

              <h3
                className="text-xl md:text-2xl font-semibold mb-4 leading-[1.25] relative z-10"
                style={{ color: '#101828' }}
              >
                {pillar.title}
              </h3>
              <p className="text-[15px] leading-[1.8] relative z-10" style={{ color: '#667085' }}>
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
// INTELLIGENCE ARCHITECTURE
// ==========================================

function ArchitectureSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const cards = [
    {
      title: 'Human Intelligence',
      description: 'Every insight begins with the people who do the work. We build systems that amplify human judgment rather than replace it.',
      icon: <BrainCircuit className="w-5 h-5" style={{ color: '#2F3A4D' }} />
    },
    {
      title: 'Memory Intelligence',
      description: 'Operational patterns, decisions, and outcomes are captured and structured so that institutional knowledge compounds over time.',
      icon: <Database className="w-5 h-5" style={{ color: '#2F3A4D' }} />
    },
    {
      title: 'Decision Intelligence',
      description: 'Context-aware frameworks guide consistent, high-quality decision-making across teams and organizational change.',
      icon: <GitMerge className="w-5 h-5" style={{ color: '#2F3A4D' }} />
    },
    {
      title: 'Operational Intelligence',
      description: 'Real-time synthesis of human experience and operational data creates a living intelligence layer for the entire organization.',
      icon: <Cpu className="w-5 h-5" style={{ color: '#2F3A4D' }} />
    },
    {
      title: 'Continuous Intelligence',
      description: 'Each decision feeds the system forward. The organization grows smarter with every operation, every shift, every year.',
      icon: <RefreshCcw className="w-5 h-5" style={{ color: '#2F3A4D' }} />
    }
  ];

  return (
    <section id="architecture" className="py-28 md:py-36" style={{ background: '#FAFBFC' }}>
      <div className="mx-auto px-6 md:px-8 max-w-7xl" ref={ref}>
        <Eyebrow>Intelligence Architecture</Eyebrow>

        <div className="mb-14 max-w-2xl">
          <motion.h2
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUpVariant}
            className="text-3xl md:text-4xl font-semibold leading-[1.2] tracking-tight"
            style={{ color: '#101828' }}
          >
            Five layers. One compounding system.
          </motion.h2>
        </div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="flex flex-col p-8 rounded-xl border transition-all duration-300"
              style={{
                background: '#FFFFFF',
                borderColor: '#E6EAF0'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(22,198,183,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E6EAF0'; }}
            >
              {/* Icon well — darker/navy, not teal, for accent economy */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-7"
                style={{ background: '#F5F7FA' }}
              >
                {card.icon}
              </div>
              <h3 className="text-[16px] font-semibold mb-3 leading-snug" style={{ color: '#101828' }}>
                {card.title}
              </h3>
              <p className="text-[14px] leading-[1.8] flex-grow" style={{ color: '#667085' }}>
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
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
    { title: 'Experience compounds.', text: 'Every operational cycle adds to the intelligence of the system. The value of Autonomatex grows with time, not against it.' },
    { title: 'Humans remain accountable.', text: 'Intelligence advises. People decide. Responsibility is never delegated to a machine.' },
    { title: 'Knowledge should survive.', text: 'When experience exits the organization, the intelligence stays. Continuity is built in.' },
    { title: 'Trust is earned.', text: 'We build incrementally, transparently, and only claim what we can demonstrate with evidence.' },
    { title: 'Design for decades.', text: 'Every architectural decision considers not just what is needed today, but what must hold for the next twenty years.' },
    { title: 'Reduce complexity.', text: 'If a system makes operations harder to understand, it is the wrong system. Clarity is a design requirement.' },
    { title: 'Build calm technology.', text: 'The best operational tools are the ones you stop noticing — reliable, consistent, and quietly present.' }
  ];

  return (
    <section id="principles" className="py-28 md:py-36" style={{ background: '#FFFFFF' }}>
      <div className="mx-auto px-6 md:px-8 max-w-7xl" ref={ref}>
        <Eyebrow>Our Principles</Eyebrow>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4"
        >
          {principles.map((p, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              className="border rounded-xl p-8"
              style={{ borderColor: '#E6EAF0' }}
            >
              <h3 className="text-[16px] font-semibold mb-3 leading-snug" style={{ color: '#101828' }}>
                {p.title}
              </h3>
              <p className="text-[14px] leading-[1.8]" style={{ color: '#667085' }}>{p.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="mx-auto px-6 md:px-8 max-w-7xl mt-16">
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
    { label: 'Privacy',                    desc: 'Data sovereignty and privacy-by-design at every architectural layer. Your operational data belongs to you.',             icon: <Lock      className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> },
    { label: 'Security by Design',         desc: 'Security is not a feature. It is a foundation. Every system is built with zero-trust principles from the first line.',  icon: <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> },
    { label: 'Responsible AI',             desc: 'All AI systems undergo rigorous evaluation for reliability, consistency, and alignment with human values.',              icon: <Scale     className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> },
    { label: 'Human Oversight',            desc: 'No automated action occurs without defined human review checkpoints. Autonomy is always bounded by accountability.',     icon: <Eye       className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> },
    { label: 'Transparency',               desc: 'Organizations have full visibility into how their intelligence systems operate, evolve, and inform decisions.',           icon: <Activity  className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> },
    { label: 'Compliance-Ready Architecture', desc: 'Built to accommodate regulatory requirements across jurisdictions and industries without architectural rework.',     icon: <FileCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> },
    { label: 'Scalable Infrastructure',    desc: 'Enterprise-grade infrastructure that grows with operational scale without compromising availability or reliability.',     icon: <Server    className="w-4 h-4 flex-shrink-0" style={{ color: '#2F3A4D' }} /> }
  ];

  return (
    <section id="security" className="py-28 md:py-36" style={{ background: '#FAFBFC' }}>
      <div className="mx-auto px-6 md:px-8 max-w-6xl" ref={ref}>
        <Eyebrow>Security and Trust</Eyebrow>

        <div className="mb-14 max-w-2xl">
          <motion.h2
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUpVariant}
            className="text-3xl font-semibold leading-[1.2] tracking-tight"
            style={{ color: '#101828' }}
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
                <h4 className="text-[15px] font-semibold mb-1.5" style={{ color: '#101828' }}>{item.label}</h4>
                <p className="text-[14px] leading-[1.8]" style={{ color: '#667085' }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// VISION — stronger headline, closed narrative arc
// ==========================================

function VisionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section id="vision" className="py-36 md:py-52 text-center px-6 md:px-8" style={{ background: '#1E2433' }}>
      <div className="mx-auto max-w-4xl" ref={ref}>
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.div variants={staggerItem}>
            <span
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-14 inline-block"
              style={{ color: '#16C6B7' }}
            >
              Vision
            </span>
          </motion.div>

          {/* Primary line — the compressed, memorable statement */}
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

          {/* Accent rule */}
          <motion.div
            variants={staggerItem}
            className="w-10 h-[2px] mx-auto mb-10"
            style={{ background: '#16C6B7' }}
          />

          {/* Supporting — closes the arc opened in the Hero */}
          <motion.p
            variants={staggerItem}
            className="text-lg font-light leading-relaxed max-w-2xl mx-auto"
            style={{ color: '#667085' }}
          >
            Every organization creates knowledge. Autonomatex is building the architecture
            that ensures it is never lost — for any organization where experience and
            decision quality matter.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// START A CONVERSATION
// ==========================================

function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitted');
  };

  const inputClass = [
    'w-full bg-white border rounded-md px-4 py-3 text-[14px] transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16C6B7] focus-visible:border-transparent',
    'placeholder:text-[#667085]/50'
  ].join(' ');

  return (
    <section id="contact" className="py-28 md:py-36" style={{ background: '#FFFFFF' }}>
      <div className="mx-auto px-6 md:px-8 max-w-2xl">
        <Eyebrow>Start a Conversation</Eyebrow>
        <h2
          className="text-3xl md:text-4xl font-semibold tracking-tight leading-[1.2] mb-4"
          style={{ color: '#101828' }}
        >
          We would be glad to learn about your organization.
        </h2>
        <p className="text-[15px] mb-12 leading-relaxed" style={{ color: '#667085' }}>
          We engage with a small number of organizations at a time. Tell us about yours.
        </p>

        {status === 'submitted' ? (
          <div
            className="rounded-xl p-14 flex flex-col items-center border"
            style={{ background: '#FAFBFC', borderColor: '#E6EAF0' }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(22,198,183,0.12)' }}
            >
              <ShieldCheck className="w-5 h-5" style={{ color: '#16C6B7' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#101828' }}>Message received.</h3>
            <p className="text-[14px] text-center" style={{ color: '#667085' }}>
              Thank you for reaching out. A representative will be in touch shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border p-8 md:p-10"
            style={{ background: '#FAFBFC', borderColor: '#E6EAF0' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-[13px] font-medium" style={{ color: '#101828' }}>
                  Name
                </label>
                <input
                  required
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  className={inputClass}
                  style={{ borderColor: '#E6EAF0', color: '#101828' }}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-[13px] font-medium" style={{ color: '#101828' }}>
                  Company
                </label>
                <input
                  required
                  type="text"
                  id="company"
                  name="company"
                  autoComplete="organization"
                  className={inputClass}
                  style={{ borderColor: '#E6EAF0', color: '#101828' }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-[13px] font-medium" style={{ color: '#101828' }}>
                Business Email
              </label>
              <input
                required
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                className={inputClass}
                style={{ borderColor: '#E6EAF0', color: '#101828' }}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-[13px] font-medium" style={{ color: '#101828' }}>
                Message
              </label>
              <textarea
                required
                id="message"
                name="message"
                autoComplete="off"
                rows={5}
                placeholder="Tell us about your organization and how Autonomatex may help."
                className={inputClass + ' resize-none'}
                style={{ borderColor: '#E6EAF0', color: '#101828' }}
              />
            </div>

            {/* Submit — CSS hover only, no JS style mutation */}
            <button
              type="submit"
              className="w-full py-4 rounded-md text-[14px] font-medium text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16C6B7] focus-visible:ring-offset-2 hover:bg-[#2F3A4D]"
              style={{ background: '#1E2433' }}
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
// FOOTER
// ==========================================

function Footer() {
  return (
    <footer className="border-t" style={{ background: '#FFFFFF', borderColor: '#E6EAF0' }}>
      <div className="mx-auto px-6 md:px-8 max-w-7xl py-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-2.5">
          <AtxMark size={18} />
          <div>
            <p className="text-[13px] font-medium" style={{ color: '#101828' }}>Autonomatex</p>
            <p className="text-[12px] italic leading-relaxed" style={{ color: '#667085' }}>
              Operational Intelligence
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms'].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16C6B7] focus-visible:ring-offset-2 rounded-sm"
                style={{ color: '#667085' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#101828'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#667085'; }}
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => doScrollTo('contact')}
              className="text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16C6B7] focus-visible:ring-offset-2 rounded-sm"
              style={{ color: '#667085' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#101828'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#667085'; }}
            >
              Contact
            </button>
          </div>
          <p className="text-[12px]" style={{ color: '#667085' }}>
            &copy; {new Date().getFullYear()} Autonomatex
          </p>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// MAIN PAGE / APP
// ==========================================

function SinglePageSite() {
  return (
    <div className="min-h-screen w-full" style={{ background: '#FAFBFC' }}>
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
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
        <div className="p-20 text-center text-xl" style={{ color: '#101828' }}>Page not found</div>
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
