import React, { useState, useEffect, FormEvent } from 'react';
import { motion, useScroll, useSpring, useInView, MotionConfig } from 'framer-motion';
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
  Server
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
    transition: {
      duration: 0.9,
      delay: custom * 0.12,
      ease: EASE
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE }
  }
};

// ==========================================
// SHARED HELPERS
// ==========================================

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// COMPONENTS
// ==========================================

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-accent origin-left z-50"
      style={{ scaleX }}
    />
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
      const sections = ['home', 'why', 'intelligence', 'thinking', 'architecture', 'principles', 'security', 'vision', 'contact'];
      let current = '';
      sections.forEach((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) current = section;
        }
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'why', label: 'Why' },
    { id: 'intelligence', label: 'Intelligence' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'principles', label: 'Principles' },
    { id: 'security', label: 'Security' },
    { id: 'vision', label: 'Vision' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-md border-b border-atx-border py-4'
          : 'bg-transparent py-7'
      }`}
    >
      <div className="mx-auto px-8 max-w-7xl flex items-center justify-between">
        <button
          onClick={() => scrollTo('home')}
          className="font-semibold text-lg tracking-tight text-atx-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
          aria-label="Autonomatex — home"
        >
          Autonomatex
        </button>

        <nav className="hidden md:flex items-center gap-9" aria-label="Main navigation">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              aria-current={activeSection === link.id ? 'true' : undefined}
              className={`text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm ${
                activeSection === link.id
                  ? 'text-accent'
                  : 'text-atx-secondary hover:text-atx-primary'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => scrollTo('contact')}
          className="text-[13px] font-medium px-5 py-2.5 rounded-md border border-atx-border text-atx-primary hover:border-accent hover:text-accent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Start a Conversation
        </button>
      </div>
    </header>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center pt-28 pb-24 overflow-hidden bg-atx-bg"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #1E2433 1px, transparent 1px), linear-gradient(to bottom, #1E2433 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }}
      />

      {/* Accent glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #16C6B7, transparent 70%)' }} />

      <div className="mx-auto px-8 max-w-7xl relative z-10 grid lg:grid-cols-2 gap-20 items-center w-full">
        {/* Text */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-xl"
        >
          <motion.div variants={staggerItem}>
            <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-accent mb-10">
              Operational Intelligence
            </span>
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-bold tracking-[-0.02em] text-atx-primary leading-[1.06] mb-8"
          >
            Every organization
            <br />
            creates knowledge.
            <br />
            <span className="text-atx-secondary font-normal">Very few keep it.</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-lg text-atx-secondary leading-[1.75] mb-10 max-w-lg"
          >
            Autonomatex transforms operational experience into long-term business
            intelligence — preserving knowledge, improving decision quality, and keeping
            humans in control.
          </motion.p>

          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollTo('why')}
              className="bg-atx-primary text-white px-8 py-4 rounded-md text-[14px] font-medium hover:bg-atx-dark transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Our Purpose
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="bg-transparent text-atx-primary border border-atx-border px-8 py-4 rounded-md text-[14px] font-medium hover:border-atx-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Start a Conversation
            </button>
          </motion.div>
        </motion.div>

        {/* Abstract SVG — knowledge flow geometry */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
          className="hidden lg:flex items-center justify-center"
          aria-hidden="true"
        >
          <svg viewBox="0 0 480 480" className="w-full max-w-[460px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer rings */}
            <circle cx="240" cy="240" r="210" stroke="#E6EAF0" strokeWidth="1" />
            <circle cx="240" cy="240" r="150" stroke="#E6EAF0" strokeWidth="1" />
            <circle cx="240" cy="240" r="90" stroke="#E6EAF0" strokeWidth="1" />
            <circle cx="240" cy="240" r="32" stroke="#E6EAF0" strokeWidth="1" />

            {/* Accent pulse ring */}
            <motion.circle
              cx="240" cy="240" r="32"
              stroke="#16C6B7" strokeWidth="1.5"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
              style={{ transformOrigin: '240px 240px' }}
            />
            <motion.circle
              cx="240" cy="240" r="32"
              stroke="#16C6B7" strokeWidth="1"
              initial={{ scale: 1, opacity: 0.3 }}
              animate={{ scale: 6, opacity: 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1.5, repeatDelay: 0.5 }}
              style={{ transformOrigin: '240px 240px' }}
            />

            {/* Connection lines */}
            <line x1="240" y1="240" x2="360" y2="120" stroke="#2F3A4D" strokeWidth="0.8" opacity="0.4" />
            <line x1="240" y1="240" x2="100" y2="150" stroke="#2F3A4D" strokeWidth="0.8" opacity="0.4" />
            <line x1="240" y1="240" x2="90" y2="320" stroke="#2F3A4D" strokeWidth="0.8" opacity="0.4" />
            <line x1="240" y1="240" x2="370" y2="340" stroke="#2F3A4D" strokeWidth="0.8" opacity="0.4" />
            <line x1="240" y1="240" x2="240" y2="50" stroke="#2F3A4D" strokeWidth="0.8" opacity="0.3" />
            <line x1="100" y1="150" x2="360" y2="120" stroke="#2F3A4D" strokeWidth="0.6" opacity="0.2" />
            <line x1="90" y1="320" x2="370" y2="340" stroke="#2F3A4D" strokeWidth="0.6" opacity="0.2" />
            <line x1="360" y1="120" x2="370" y2="340" stroke="#2F3A4D" strokeWidth="0.6" opacity="0.15" />

            {/* Core node */}
            <circle cx="240" cy="240" r="10" fill="#1E2433" />
            <circle cx="240" cy="240" r="4" fill="#16C6B7" />

            {/* Peripheral nodes */}
            <circle cx="360" cy="120" r="9" fill="#1E2433" />
            <circle cx="360" cy="120" r="3.5" fill="#3FD9FF" />

            <circle cx="100" cy="150" r="7" fill="#2F3A4D" />
            <circle cx="100" cy="150" r="2.5" fill="#16C6B7" />

            <circle cx="90" cy="320" r="9" fill="#1E2433" />
            <circle cx="90" cy="320" r="3.5" fill="#16C6B7" />

            <circle cx="370" cy="340" r="7" fill="#2F3A4D" />
            <circle cx="370" cy="340" r="2.5" fill="#3FD9FF" />

            <circle cx="240" cy="50" r="5" fill="#2F3A4D" opacity="0.6" />

            {/* Orbiting accent dot */}
            <motion.circle
              cx="0" cy="-150" r="5"
              fill="#16C6B7"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '240px 240px' }}
            />
            <motion.circle
              cx="0" cy="-210" r="3.5"
              fill="#3FD9FF"
              opacity={0.6}
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '240px 240px' }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.8 }}
        aria-hidden="true"
      >
        <div className="w-[1px] h-12 bg-atx-primary" />
      </motion.div>
    </section>
  );
}

// ── EYEBROW ───────────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold tracking-[0.22em] uppercase text-accent mb-8">
      {children}
    </div>
  );
}

// ── WHY WE EXIST ──────────────────────────────────────────────────────────────

function WhySection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  const statements = [
    { text: 'Knowledge disappears.', weight: 'font-medium' },
    { text: 'Experience leaves.', weight: 'font-medium' },
    { text: 'Operations restart.', weight: 'font-medium' },
    { text: 'Teams begin again.', weight: 'font-medium' },
  ];

  return (
    <section id="why" className="py-32 md:py-44 bg-surface">
      <div className="mx-auto px-8 max-w-5xl" ref={ref}>
        <Eyebrow>Why We Exist</Eyebrow>

        <div className="space-y-10 mb-20">
          {statements.map((s, i) => (
            <motion.p
              key={i}
              custom={i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUpVariant}
              className={`text-3xl md:text-4xl lg:text-5xl ${s.weight} tracking-tight text-atx-primary leading-[1.12]`}
              style={{ opacity: 0.3 + i * 0.18 }}
            >
              {s.text}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUpVariant}
          custom={statements.length + 1}
          className="border-l-[3px] border-accent pl-8 py-2"
        >
          <p className="text-2xl md:text-3xl font-semibold text-atx-primary leading-[1.3] mb-4">
            Autonomatex exists so that operational intelligence compounds instead of disappearing.
          </p>
          <p className="text-base text-atx-secondary leading-relaxed max-w-xl">
            Every organization carries knowledge in its people — patterns recognized, decisions made,
            lessons earned over years. When those people move on, that intelligence must not go with them.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ── OPERATIONAL INTELLIGENCE ──────────────────────────────────────────────────

function OperationalIntelligenceSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section id="intelligence" className="py-28 md:py-36 bg-atx-bg">
      <div className="mx-auto px-8 max-w-6xl" ref={ref}>
        <Eyebrow>Operational Intelligence</Eyebrow>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.h2
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUpVariant}
            className="text-3xl md:text-4xl font-semibold text-atx-primary leading-[1.2] tracking-tight"
          >
            Intelligence built from experience — not assumptions.
          </motion.h2>

          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.p variants={staggerItem} className="text-base text-atx-secondary leading-[1.8]">
              Most systems are built to process data. Operational Intelligence is built to preserve
              experience — the knowledge of what actually happened, what decisions were made, and why
              they worked or did not.
            </motion.p>
            <motion.p variants={staggerItem} className="text-base text-atx-secondary leading-[1.8]">
              It is the discipline of capturing, structuring, and continuously learning from the
              lived operational reality of an organization — so that knowledge compounds with time
              rather than dissolving when circumstances change.
            </motion.p>
            <motion.p variants={staggerItem} className="text-base text-atx-secondary leading-[1.8]">
              Organizations that build Operational Intelligence don't just operate better today.
              They grow wiser with every passing year.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── OUR THINKING ──────────────────────────────────────────────────────────────

function OurThinkingSection() {
  const ref = React.useRef(null);
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
    <section id="thinking" className="py-28 md:py-36 bg-surface border-y border-atx-border">
      <div className="mx-auto px-8 max-w-7xl" ref={ref}>
        <Eyebrow>Our Thinking</Eyebrow>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-atx-border"
        >
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              className="bg-surface p-10 md:p-12"
            >
              <div className="text-[11px] font-semibold tracking-[0.18em] text-accent mb-6">
                {pillar.number}
              </div>
              <h3 className="text-xl font-semibold text-atx-primary mb-4 leading-[1.3]">
                {pillar.title}
              </h3>
              <p className="text-[15px] text-atx-secondary leading-[1.8]">{pillar.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── INTELLIGENCE ARCHITECTURE ─────────────────────────────────────────────────

function ArchitectureSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const cards = [
    {
      title: 'Human Intelligence',
      description:
        'Every insight begins with the people who do the work. We build systems that amplify human judgment rather than replace it.',
      icon: <BrainCircuit className="w-5 h-5" style={{ color: '#16C6B7' }} />
    },
    {
      title: 'Memory Intelligence',
      description:
        'Operational patterns, decisions, and outcomes are captured and structured so that institutional knowledge compounds over time.',
      icon: <Database className="w-5 h-5" style={{ color: '#16C6B7' }} />
    },
    {
      title: 'Decision Intelligence',
      description:
        'Context-aware frameworks guide consistent, high-quality decision-making across teams and organizational change.',
      icon: <GitMerge className="w-5 h-5" style={{ color: '#16C6B7' }} />
    },
    {
      title: 'Operational Intelligence',
      description:
        'Real-time synthesis of human experience and operational data creates a living intelligence layer for the entire organization.',
      icon: <Cpu className="w-5 h-5" style={{ color: '#16C6B7' }} />
    },
    {
      title: 'Continuous Intelligence',
      description:
        'Each decision feeds the system forward. The organization grows smarter with every operation, every shift, every year.',
      icon: <RefreshCcw className="w-5 h-5" style={{ color: '#16C6B7' }} />
    }
  ];

  return (
    <section id="architecture" className="py-28 md:py-36 bg-atx-bg">
      <div className="mx-auto px-8 max-w-7xl" ref={ref}>
        <Eyebrow>Intelligence Architecture</Eyebrow>

        <div className="mb-14 max-w-2xl">
          <motion.h2
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUpVariant}
            className="text-3xl md:text-4xl font-semibold text-atx-primary leading-[1.2] tracking-tight"
          >
            Five layers. One compounding system.
          </motion.h2>
        </div>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="bg-surface border border-atx-border rounded-xl p-8 transition-all duration-300 hover:border-accent/40 hover:shadow-lg flex flex-col"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-7"
                style={{ background: 'rgba(22, 198, 183, 0.1)' }}
              >
                {card.icon}
              </div>
              <h3 className="text-[17px] font-semibold text-atx-primary mb-3 leading-snug">
                {card.title}
              </h3>
              <p className="text-[14px] text-atx-secondary leading-[1.8] flex-grow">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── PRINCIPLES ────────────────────────────────────────────────────────────────

function PrinciplesSection() {
  const ref = React.useRef(null);
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
    <section id="principles" className="py-28 md:py-36 bg-surface">
      <div className="mx-auto px-8 max-w-7xl" ref={ref}>
        <Eyebrow>Our Principles</Eyebrow>

        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
        >
          {principles.map((p, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              className={`border border-atx-border rounded-xl p-8 ${idx === principles.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              <h3 className="text-[17px] font-semibold text-atx-primary mb-3 leading-snug">
                {p.title}
              </h3>
              <p className="text-[14px] text-atx-secondary leading-[1.8]">{p.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── SECURITY ──────────────────────────────────────────────────────────────────

function SecuritySection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const items = [
    {
      label: 'Privacy',
      desc: 'Data sovereignty and privacy-by-design at every architectural layer. Your operational data belongs to you.',
      icon: <Lock className="w-4 h-4 flex-shrink-0" style={{ color: '#16C6B7' }} />
    },
    {
      label: 'Security by Design',
      desc: 'Security is not a feature. It is a foundation. Every system is built with zero-trust principles from the first line.',
      icon: <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#16C6B7' }} />
    },
    {
      label: 'Responsible AI',
      desc: 'All AI systems undergo rigorous evaluation for reliability, consistency, and alignment with human values before deployment.',
      icon: <Scale className="w-4 h-4 flex-shrink-0" style={{ color: '#16C6B7' }} />
    },
    {
      label: 'Human Oversight',
      desc: 'No automated action occurs without defined human review checkpoints. Autonomy is always bounded by accountability.',
      icon: <Eye className="w-4 h-4 flex-shrink-0" style={{ color: '#16C6B7' }} />
    },
    {
      label: 'Transparency',
      desc: 'Organizations have full visibility into how their intelligence systems operate, evolve, and inform decisions.',
      icon: <Activity className="w-4 h-4 flex-shrink-0" style={{ color: '#16C6B7' }} />
    },
    {
      label: 'Compliance-Ready Architecture',
      desc: 'Built to accommodate regulatory requirements across jurisdictions and industries without architectural rework.',
      icon: <FileCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#16C6B7' }} />
    },
    {
      label: 'Scalable Infrastructure',
      desc: 'Enterprise-grade infrastructure that grows with operational scale without compromising availability or reliability.',
      icon: <Server className="w-4 h-4 flex-shrink-0" style={{ color: '#16C6B7' }} />
    }
  ];

  return (
    <section id="security" className="py-28 md:py-36 bg-atx-bg">
      <div className="mx-auto px-8 max-w-6xl" ref={ref}>
        <Eyebrow>Security and Trust</Eyebrow>

        <div className="mb-14 max-w-2xl">
          <motion.h2
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUpVariant}
            className="text-3xl font-semibold text-atx-primary leading-[1.2] tracking-tight"
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
                <h4 className="text-[15px] font-semibold text-atx-primary mb-1.5">{item.label}</h4>
                <p className="text-[14px] text-atx-secondary leading-[1.8]">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── VISION ────────────────────────────────────────────────────────────────────

function VisionSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section id="vision" className="py-36 md:py-52 text-center px-8" style={{ background: '#1E2433' }}>
      <div className="mx-auto max-w-4xl" ref={ref}>
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          <motion.div variants={staggerItem}>
            <span className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-14 inline-block"
              style={{ color: '#16C6B7' }}>
              Vision
            </span>
          </motion.div>

          <motion.p
            variants={staggerItem}
            className="text-3xl md:text-[2.6rem] lg:text-5xl font-semibold leading-[1.18] tracking-tight mb-14"
            style={{ color: '#FAFBFC' }}
          >
            "The future belongs to organizations that preserve experience, improve decision quality, and grow wiser through every operation."
          </motion.p>

          <motion.div variants={staggerItem} className="w-12 h-[2px] mx-auto mb-10"
            style={{ background: '#16C6B7' }} />

          <motion.p
            variants={staggerItem}
            className="text-lg font-light"
            style={{ color: '#667085' }}
          >
            Autonomatex is building the intelligence architecture that enables that future —
            for any organization where experience and decision quality matter.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ── START A CONVERSATION ──────────────────────────────────────────────────────

function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitted');
  };

  return (
    <section id="contact" className="py-28 md:py-36 bg-surface">
      <div className="mx-auto px-8 max-w-2xl">
        <Eyebrow>Start a Conversation</Eyebrow>
        <h2 className="text-3xl md:text-4xl font-semibold text-atx-primary tracking-tight leading-[1.2] mb-4">
          We would be glad to learn about your organization.
        </h2>
        <p className="text-[15px] text-atx-secondary mb-12 leading-relaxed">
          We engage with a small number of organizations at a time. Tell us about yours.
        </p>

        {status === 'submitted' ? (
          <div
            className="rounded-xl p-14 flex flex-col items-center border border-atx-border"
            style={{ background: '#FAFBFC' }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(22,198,183,0.12)' }}
            >
              <ShieldCheck className="w-5 h-5" style={{ color: '#16C6B7' }} />
            </div>
            <h3 className="text-xl font-semibold text-atx-primary mb-2">Message received.</h3>
            <p className="text-[14px] text-atx-secondary text-center">
              Thank you for reaching out. A representative will be in touch shortly.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-atx-border p-8 md:p-10"
            style={{ background: '#FAFBFC' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-[13px] font-medium text-atx-primary">
                  Name
                </label>
                <input
                  required
                  type="text"
                  id="name"
                  className="w-full bg-white border border-atx-border rounded-md px-4 py-3 text-[14px] text-atx-primary placeholder:text-atx-secondary/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': '#16C6B7' } as React.CSSProperties}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-[13px] font-medium text-atx-primary">
                  Company
                </label>
                <input
                  required
                  type="text"
                  id="company"
                  className="w-full bg-white border border-atx-border rounded-md px-4 py-3 text-[14px] text-atx-primary placeholder:text-atx-secondary/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': '#16C6B7' } as React.CSSProperties}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-[13px] font-medium text-atx-primary">
                Business Email
              </label>
              <input
                required
                type="email"
                id="email"
                className="w-full bg-white border border-atx-border rounded-md px-4 py-3 text-[14px] text-atx-primary placeholder:text-atx-secondary/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ '--tw-ring-color': '#16C6B7' } as React.CSSProperties}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-[13px] font-medium text-atx-primary">
                Message
              </label>
              <textarea
                required
                id="message"
                rows={5}
                placeholder="Tell us about your organization and how Autonomatex may help."
                className="w-full bg-white border border-atx-border rounded-md px-4 py-3 text-[14px] text-atx-primary placeholder:text-atx-secondary/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                style={{ '--tw-ring-color': '#16C6B7' } as React.CSSProperties}
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-md text-[14px] font-medium text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: '#1E2433', '--tw-ring-color': '#16C6B7' } as React.CSSProperties}
              onMouseEnter={e => (e.currentTarget.style.background = '#2F3A4D')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1E2433')}
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-atx-border bg-surface">
      <div className="mx-auto px-8 max-w-7xl py-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <p className="text-[13px] font-medium text-atx-primary mb-2">Autonomatex</p>
          <p className="text-[13px] text-atx-secondary italic max-w-xs leading-relaxed">
            Experience becomes intelligence only when it is remembered.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-6">
            <a href="#" className="text-[13px] text-atx-secondary hover:text-atx-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm">
              Privacy
            </a>
            <a href="#" className="text-[13px] text-atx-secondary hover:text-atx-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm">
              Terms
            </a>
            <button
              onClick={() => scrollTo('contact')}
              className="text-[13px] text-atx-secondary hover:text-atx-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
            >
              Contact
            </button>
          </div>
          <p className="text-[12px] text-atx-secondary">
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
    <div className="min-h-screen w-full bg-atx-bg">
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
      <Route component={() => <div className="p-20 text-center text-xl">Not Found</div>} />
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
