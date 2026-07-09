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
  Server,
  ArrowRight
} from 'lucide-react';

const queryClient = new QueryClient();

// ==========================================
// ANIMATION VARIANTS
// ==========================================

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: custom * 0.1,
      ease: EASE
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE }
  }
};

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
      className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-50"
      style={{ scaleX }}
    />
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'why', 'architecture', 'principles', 'security', 'vision', 'contact'];
      let current = '';

      sections.forEach((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
          }
        }
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'why', label: 'Why' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'principles', label: 'Principles' },
    { id: 'security', label: 'Security' },
    { id: 'vision', label: 'Vision' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <button
          onClick={() => scrollTo('home')}
          className="text-foreground font-bold text-xl tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
        >
          Autonomatex
        </button>
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              aria-current={activeSection === link.id ? 'true' : undefined}
              className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm ${
                activeSection === link.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => scrollTo('contact')}
          className="md:hidden text-sm font-medium text-foreground bg-gray-100 px-4 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Contact
        </button>
      </div>
    </header>
  );
}

function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[100dvh] pt-32 pb-20 flex items-center overflow-hidden">
      {/* Background Dots */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0F172A 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-2xl"
        >
          <motion.h1
            variants={staggerItem}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
          >
            The Intelligence Layer for Operational Businesses.
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl"
          >
            Autonomatex builds AI Operating Systems that transform operational experience into long-term business intelligence—helping organizations make faster, smarter, and more consistent decisions while keeping humans in control.
          </motion.p>
          <motion.p
            variants={staggerItem}
            className="text-sm font-medium text-foreground mb-10 border-l-2 border-primary pl-4 max-w-md"
          >
            Built for industries where experience matters, decisions matter, and knowledge must never be lost.
          </motion.p>
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollTo('architecture')}
              className="bg-foreground text-white px-8 py-4 rounded-lg font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Explore Technology <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="bg-transparent text-foreground border border-gray-200 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Contact
            </button>
          </motion.div>
        </motion.div>

        {/* Hero Abstract SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative aspect-square max-w-lg mx-auto w-full lg:ml-auto"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="180" stroke="#E5E7EB" strokeWidth="1" />
            <circle cx="200" cy="200" r="120" stroke="#E5E7EB" strokeWidth="1" />
            <circle cx="200" cy="200" r="60" stroke="#E5E7EB" strokeWidth="1" />
            
            {/* Pulsing rings */}
            <motion.circle
              cx="200" cy="200" r="60"
              stroke="#2563EB" strokeWidth="2"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            <g>
              <line x1="200" y1="200" x2="280" y2="120" stroke="#94A3B8" strokeWidth="1" />
              <line x1="200" y1="200" x2="120" y2="100" stroke="#94A3B8" strokeWidth="1" />
              <line x1="200" y1="200" x2="100" y2="250" stroke="#94A3B8" strokeWidth="1" />
              <line x1="200" y1="200" x2="290" y2="280" stroke="#94A3B8" strokeWidth="1" />
              <line x1="120" y1="100" x2="280" y2="120" stroke="#94A3B8" strokeWidth="1" opacity="0.5" />
              <line x1="100" y1="250" x2="290" y2="280" stroke="#94A3B8" strokeWidth="1" opacity="0.5" />
            </g>

            {/* Nodes */}
            <circle cx="200" cy="200" r="12" fill="#0F172A" />
            <circle cx="200" cy="200" r="4" fill="#FFFFFF" />

            <circle cx="280" cy="120" r="8" fill="#2563EB" />
            <circle cx="120" cy="100" r="6" fill="#0F172A" />
            <circle cx="100" cy="250" r="8" fill="#0F172A" />
            <circle cx="290" cy="280" r="6" fill="#2563EB" />
            
            {/* Animated outer node */}
            <motion.circle
              cx="20" cy="200" r="4" fill="#2563EB"
              animate={{
                rotate: 360,
                x: 180,
                y: 0
              }}
              style={{ originX: '200px', originY: '200px' }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-6">
      {children}
    </div>
  );
}

function WhySection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  const statements = [
    "Businesses lose valuable knowledge every day.",
    "Experienced people leave.",
    "Critical decisions disappear.",
    "Operational patterns are forgotten.",
    "Teams start over."
  ];

  return (
    <section id="why" className="py-24 md:py-40 bg-white">
      <div className="container mx-auto px-6 max-w-4xl" ref={ref}>
        <SectionEyebrow>Why We Exist</SectionEyebrow>
        
        <div className="space-y-12 md:space-y-20 mb-24">
          {statements.map((statement, index) => (
            <motion.h2
              key={index}
              custom={index}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeUpVariant}
              className={`font-semibold tracking-tight text-foreground`}
              style={{
                fontSize: `clamp(1.5rem, 1rem + ${index * 0.7}vw, 3.5rem)`,
                lineHeight: 1.1,
                opacity: 0.5 + (index * 0.1)
              }}
            >
              {statement}
            </motion.h2>
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUpVariant}
          custom={statements.length}
          className="border-t border-gray-200 pt-12"
        >
          <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed">
            Autonomatex exists to preserve operational intelligence and help organizations continuously improve through experience.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function OperationalIntelligenceSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-3xl text-center" ref={ref}>
        <SectionEyebrow>Operational Intelligence</SectionEyebrow>
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed text-left md:text-center"
        >
          <motion.p variants={staggerItem}>
            Every organization carries knowledge in the minds of its people — the decisions made, the patterns recognized, the hard lessons learned over years of operation. When those people move on, that knowledge often moves with them.
          </motion.p>
          <motion.p variants={staggerItem}>
            Operational intelligence is the discipline of capturing, structuring, and continuously learning from that experience — so organizations grow smarter, not just older.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const cards = [
    {
      title: "Human Intelligence",
      description: "Every insight begins with the people who do the work. We build systems that amplify human judgment, not replace it.",
      icon: <BrainCircuit className="w-6 h-6 text-primary" />
    },
    {
      title: "Memory Intelligence",
      description: "Operational patterns, decisions, and outcomes are captured and structured so that institutional knowledge compounds over time.",
      icon: <Database className="w-6 h-6 text-primary" />
    },
    {
      title: "Decision Intelligence",
      description: "Context-aware frameworks guide consistent decision-making across teams, shifts, and organizational changes.",
      icon: <GitMerge className="w-6 h-6 text-primary" />
    },
    {
      title: "Operational Intelligence",
      description: "Real-time synthesis of human experience and system data creates a living intelligence layer for the entire organization.",
      icon: <Cpu className="w-6 h-6 text-primary" />
    },
    {
      title: "Continuous Intelligence",
      description: "Every decision feeds back into the system. The organization gets smarter with every operation, every day.",
      icon: <RefreshCcw className="w-6 h-6 text-primary" />
    }
  ];

  return (
    <section id="architecture" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6 max-w-7xl" ref={ref}>
        <SectionEyebrow>Intelligence Architecture</SectionEyebrow>
        
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              <div className="bg-gray-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed flex-grow">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PrinciplesSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const principles = [
    { title: "AI should assist.", text: "Autonomatex systems are built to amplify human capability, not automate human judgment away." },
    { title: "Humans remain in control.", text: "Every recommendation is a suggestion. Every decision belongs to a person." },
    { title: "Knowledge should never disappear.", text: "When experience leaves the organization, the intelligence stays." },
    { title: "Every decision should improve the next.", text: "Each outcome feeds forward, making the organization continuously smarter." },
    { title: "Technology should reduce complexity.", text: "If a system makes your operations harder to understand, it is the wrong system." },
    { title: "Trust must be earned.", text: "We build incrementally, transparently, and only claim what we can demonstrate." },
    { title: "Intelligence compounds over time.", text: "The longer Autonomatex operates in an environment, the more valuable it becomes." }
  ];

  return (
    <section id="principles" className="py-24 md:py-32 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-6 max-w-7xl" ref={ref}>
        <SectionEyebrow>Our Principles</SectionEyebrow>
        
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
          {principles.map((principle, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              className={`bg-white border border-gray-200 rounded-xl p-8 shadow-sm ${idx === principles.length - 1 ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">{principle.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{principle.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SecuritySection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const items = [
    { label: "Privacy", desc: "Data sovereignty and privacy-by-design at every architectural layer.", icon: <Lock className="w-5 h-5 text-foreground" /> },
    { label: "Security by Design", desc: "Security is not a feature — it is a foundation. Every system is built with zero-trust principles.", icon: <ShieldCheck className="w-5 h-5 text-foreground" /> },
    { label: "Responsible AI", desc: "All AI systems undergo rigorous evaluation for bias, reliability, and alignment with human values.", icon: <Scale className="w-5 h-5 text-foreground" /> },
    { label: "Human Oversight", desc: "No automated action occurs without defined human review checkpoints.", icon: <Eye className="w-5 h-5 text-foreground" /> },
    { label: "Transparency", desc: "Organizations have full visibility into how their intelligence systems operate and evolve.", icon: <Activity className="w-5 h-5 text-foreground" /> },
    { label: "Compliance Ready Architecture", desc: "Built to support regulatory requirements across jurisdictions and industries.", icon: <FileCheck className="w-5 h-5 text-foreground" /> },
    { label: "Scalable Infrastructure", desc: "Enterprise-grade infrastructure that grows with operational scale without compromising reliability.", icon: <Server className="w-5 h-5 text-foreground" /> }
  ];

  return (
    <section id="security" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6 max-w-5xl" ref={ref}>
        <SectionEyebrow>Security and Trust</SectionEyebrow>
        
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12"
        >
          {items.map((item, idx) => (
            <motion.div key={idx} variants={staggerItem} className="flex gap-4">
              <div className="flex-shrink-0 mt-1">{item.icon}</div>
              <div>
                <h4 className="text-base font-semibold text-foreground mb-2">{item.label}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function VisionSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section id="vision" className="py-32 md:py-48 bg-foreground text-white text-center px-6">
      <div className="container mx-auto max-w-4xl" ref={ref}>
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUpVariant}
        >
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-12">
            Vision
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight mb-12">
            "The future belongs to organizations that preserve experience, improve decision quality, and continuously learn from operations."
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 font-light">
            Autonomatex is building the intelligence layer that enables that future.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitted');
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <SectionEyebrow>Contact</SectionEyebrow>
        <h2 className="text-3xl font-semibold text-foreground mb-4">Get in Touch</h2>
        <p className="text-muted-foreground mb-12">We would be glad to learn about your organization.</p>

        {status === 'submitted' ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Message Received</h3>
            <p className="text-muted-foreground">Thank you for reaching out. A representative will be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="text-left space-y-6 bg-gray-50 p-8 md:p-10 rounded-2xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                <input required type="text" id="name" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-foreground">Company</label>
                <input required type="text" id="company" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Business Email</label>
              <input required type="email" id="email" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
              <textarea required id="message" rows={4} placeholder="Tell us about your organization and how Autonomatex may help." className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"></textarea>
            </div>
            <button type="submit" className="w-full bg-foreground text-white py-4 rounded-lg font-medium hover:bg-foreground/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Autonomatex. All rights reserved.
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
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
    <div className="min-h-screen w-full bg-white selection:bg-primary/20 selection:text-primary">
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        <WhySection />
        <OperationalIntelligenceSection />
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