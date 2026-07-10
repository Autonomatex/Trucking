import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavHref } from '@/components/NavHref';
import { FadeUp, staggerContainer, staggerItem } from '@/components/FadeUp';
import { ChevronDown, ChevronUp } from 'lucide-react';

const A  = '#0D9488'; // accent teal
const D  = '#1E2433'; // dark navy
const P  = '#101828'; // primary text
const S  = '#667085'; // secondary text
const B  = '#E6EAF0'; // border
const BG = '#FAFBFC'; // page bg
const SF = '#FFFFFF'; // surface

const EASE: [number,number,number,number] = [0.25,0.46,0.45,0.94];

// ── Shared primitives ─────────────────────────────────────────────────────────

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.09em',
      textTransform: 'uppercase', color: light ? 'rgba(13,148,136,0.8)' : A, marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

function SectionWrap({ id, children, bg, style }: {
  id?: string; children: React.ReactNode; bg?: string; style?: React.CSSProperties
}) {
  return (
    <section id={id} style={{ background: bg || BG, ...style }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px' }}>
        {children}
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, desc, descColor, center, light }: {
  eyebrow: string; title: React.ReactNode; desc?: string;
  descColor?: string; center?: boolean; light?: boolean;
}) {
  return (
    <FadeUp>
      <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 60 }}>
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <h2 style={{
          fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700,
          color: light ? '#fff' : P,
          letterSpacing: '-0.025em', lineHeight: 1.22,
          maxWidth: 680, margin: center ? '0 auto' : undefined,
          marginBottom: desc ? 0 : undefined,
        }}>
          {title}
        </h2>
        {desc && (
          <p style={{
            fontSize: 17, color: descColor ?? S, lineHeight: 1.75,
            maxWidth: 640, marginTop: 16,
            margin: center ? '16px auto 0' : '16px 0 0',
          }}>
            {desc}
          </p>
        )}
      </div>
    </FadeUp>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: SF, border: `1px solid ${B}`, borderRadius: 12,
      padding: 32, boxShadow: '0 1px 4px rgba(16,24,40,0.05)', ...style,
    }}>
      {children}
    </div>
  );
}

function Dot() {
  return <div style={{ width: 5, height: 5, borderRadius: '50%', background: A, marginTop: 9, flexShrink: 0 }} />;
}

// ── S1: Hero ──────────────────────────────────────────────────────────────────

function HeroIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
        style={{
          position: 'absolute', top: -18, right: 12, zIndex: 2,
          background: SF, border: `1px solid ${B}`, borderRadius: 10,
          padding: '12px 18px', boxShadow: '0 8px 24px rgba(16,24,40,0.12)', minWidth: 190,
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 700, color: P, marginBottom: 3 }}>42 loads scanned</p>
        <p style={{ fontSize: 11.5, color: S }}>39 rejected before wasted calls</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
        style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 64px rgba(16,24,40,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <svg viewBox="0 0 504 348" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
          <rect width="504" height="348" fill="#1a2236"/>
          <rect width="504" height="46" fill="#2a3550"/>
          <circle cx="20" cy="23" r="5" fill="#F04438" opacity="0.7"/>
          <circle cx="36" cy="23" r="5" fill="#F79009" opacity="0.7"/>
          <circle cx="52" cy="23" r="5" fill="#12B76A" opacity="0.7"/>
          <text x="70" y="27" fill="rgba(255,255,255,0.7)" fontSize="11.5" fontFamily="Inter,sans-serif" fontWeight="500">Truck Intelligence Console · Dry Van · Dallas, TX</text>
          <line x1="0" y1="46" x2="504" y2="46" stroke="rgba(255,255,255,0.06)"/>
          <text x="18" y="66" fill="rgba(255,255,255,0.38)" fontSize="10.5" fontFamily="Inter,sans-serif">42 loads evaluated · 39 rejected · 3 worth calling first</text>
          <rect x="14" y="76" width="476" height="60" rx="8" fill="rgba(13,148,136,0.13)"/>
          <rect x="14" y="76" width="3" height="60" rx="1.5" fill="#0D9488"/>
          <text x="28" y="100" fill="rgba(255,255,255,0.9)" fontSize="11.5" fontFamily="Inter,sans-serif" fontWeight="600">Dallas, TX → Chicago, IL</text>
          <text x="28" y="118" fill="rgba(255,255,255,0.4)" fontSize="10.5" fontFamily="Inter,sans-serif">925 mi · $2,350 · $2.54/mi · Midwest preferred</text>
          <rect x="408" y="88" width="70" height="22" rx="11" fill="rgba(18,183,106,0.2)"/>
          <text x="443" y="102.5" fill="#12B76A" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="700" textAnchor="middle">Call #1</text>
          <rect x="14" y="144" width="476" height="60" rx="8" fill="rgba(13,148,136,0.07)"/>
          <rect x="14" y="144" width="3" height="60" rx="1.5" fill="#0D9488" opacity="0.5"/>
          <text x="28" y="168" fill="rgba(255,255,255,0.8)" fontSize="11.5" fontFamily="Inter,sans-serif" fontWeight="600">Fort Worth, TX → St. Louis, MO</text>
          <text x="28" y="186" fill="rgba(255,255,255,0.4)" fontSize="10.5" fontFamily="Inter,sans-serif">640 mi · $1,650 · $2.57/mi · Strong RPM</text>
          <rect x="408" y="156" width="70" height="22" rx="11" fill="rgba(18,183,106,0.14)"/>
          <text x="443" y="170.5" fill="#12B76A" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="700" textAnchor="middle">Call #2</text>
          <rect x="14" y="212" width="476" height="60" rx="8" fill="rgba(13,148,136,0.04)"/>
          <rect x="14" y="212" width="3" height="60" rx="1.5" fill="#0D9488" opacity="0.28"/>
          <text x="28" y="236" fill="rgba(255,255,255,0.7)" fontSize="11.5" fontFamily="Inter,sans-serif" fontWeight="600">Dallas, TX → Kansas City, MO</text>
          <text x="28" y="254" fill="rgba(255,255,255,0.35)" fontSize="10.5" fontFamily="Inter,sans-serif">510 mi · $1,250 · $2.45/mi · Solid backup</text>
          <rect x="408" y="224" width="70" height="22" rx="11" fill="rgba(18,183,106,0.1)"/>
          <text x="443" y="238.5" fill="#12B76A" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="700" textAnchor="middle">Call #3</text>
          <rect x="14" y="280" width="476" height="58" rx="8" fill="rgba(240,68,56,0.05)"/>
          <rect x="14" y="280" width="3" height="58" rx="1.5" fill="#F04438" opacity="0.4"/>
          <text x="28" y="304" fill="rgba(255,255,255,0.35)" fontSize="11.5" fontFamily="Inter,sans-serif" fontWeight="500">Dallas, TX → New York, NY</text>
          <text x="28" y="322" fill="rgba(255,255,255,0.22)" fontSize="10.5" fontFamily="Inter,sans-serif">No-go area on file · Below minimum RPM ($1.87/mi)</text>
          <rect x="404" y="291" width="78" height="22" rx="11" fill="rgba(240,68,56,0.14)"/>
          <text x="443" y="305.5" fill="#F04438" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="700" textAnchor="middle">Rejected</text>
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: EASE }}
        style={{
          position: 'absolute', bottom: 20, left: -20, zIndex: 2,
          background: D, borderRadius: 10,
          padding: '12px 18px', boxShadow: '0 8px 24px rgba(16,24,40,0.25)', minWidth: 180,
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Top 3 worth calling</p>
        <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)' }}>Ranked for this dry van truck</p>
      </motion.div>
    </div>
  );
}

function HeroSection() {
  return (
    <section style={{ background: BG, padding: '72px 24px 88px' }}>
      <div className="atx-hero-g" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.09em',
              textTransform: 'uppercase', color: A, background: 'rgba(13,148,136,0.08)',
              padding: '5px 12px', borderRadius: 20, marginBottom: 24, border: '1px solid rgba(13,148,136,0.18)',
            }}>
              New MC · Owner Operators · Small Fleets · Growing Fleets
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.75, ease: EASE }}
            style={{ fontSize: 'clamp(30px,3.8vw,50px)', fontWeight: 700, color: P, letterSpacing: '-0.03em', lineHeight: 1.16, marginBottom: 24 }}
          >
            Operational Intelligence for Modern Truck Owners
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6, ease: EASE }}
            style={{ fontSize: 13, color: A, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 22 }}
          >
            Dry Van · Reefer · Flatbed · Hotshot · Box Truck · Power Only
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
            style={{ background: D, borderRadius: 10, padding: '18px 22px', marginBottom: 22, borderLeft: `3px solid ${A}` }}
          >
            <p style={{ fontSize: 15.5, fontWeight: 600, color: '#fff', lineHeight: 1.5, fontStyle: 'italic' }}>
              "I found 42 loads. Rejected 39. Here are the 3 worth calling."
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.7, ease: EASE }}
            style={{ fontSize: 17, color: S, lineHeight: 1.75, marginBottom: 36 }}
          >
            Every mile, every load, every dispatcher and every decision continuously improve the profitability of your truck.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.65, ease: EASE }}
          >
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
              <NavHref href="/#paid-pilot">
                <span style={{
                  display: 'inline-block', background: A, color: '#fff', borderRadius: 8,
                  padding: '13px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(13,148,136,0.3)',
                }}>
                  Start Paid Pilot
                </span>
              </NavHref>
              <NavHref href="/#how-it-works">
                <span style={{
                  display: 'inline-block', background: SF, color: P, border: `1.5px solid ${B}`,
                  borderRadius: 8, padding: '13px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer',
                }}>
                  See How It Works
                </span>
              </NavHref>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['New MC', 'Owner Operators', 'Small Fleets', 'Growing Fleets', 'No Auto-Booking'].map(t => (
                <span key={t} style={{ fontSize: 11.5, color: S, background: '#F0F4F8', padding: '4px 10px', borderRadius: 20, border: `1px solid ${B}` }}>{t}</span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="atx-hero-illustration" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

// ── S2: Quick Summary ─────────────────────────────────────────────────────────

const QS_PARAGRAPHS = [
  'Autonomatex helps truck owners make better load decisions while quietly building long-term operational intelligence behind every truck.',
  'Whether you have a brand-new MC, an owner operator business, a growing fleet or an established operation, Autonomatex identifies the few loads worth calling while continuously learning from your truck\'s operational history, dispatcher decisions, broker interactions, market conditions, equipment preferences and business outcomes.',
  'If you decide to change dispatchers, dispatch companies or operational staff, your truck\'s operational intelligence stays with your business—not with an individual person. Your next dispatcher starts with accumulated business knowledge instead of starting from zero.',
  'If drivers change over time, the truck\'s operational knowledge, communication history, customer preferences and operational patterns remain available to help the next driver become productive faster.',
  'The interface stays intentionally simple. Behind the scenes Autonomatex continuously compounds operational intelligence while humans remain fully in control.',
];

function QuickSummarySection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <SectionWrap id="quick-summary" bg={D}>
      <FadeUp>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <Eyebrow light>Quick Summary</Eyebrow>

          {/* Desktop: full text always visible */}
          <div className="hidden md:block">
            {QS_PARAGRAPHS.map((p, i) => (
              <p key={i} style={{
                fontSize: i === 0 ? 18 : 16.5,
                color: i === 0 ? '#fff' : 'rgba(255,255,255,0.7)',
                lineHeight: 1.8, marginBottom: 20,
                fontWeight: i === 0 ? 500 : 400,
              }}>
                {p}
              </p>
            ))}
          </div>

          {/* Mobile: first paragraph + expandable */}
          <div className="md:hidden">
            <p style={{ fontSize: 16.5, color: '#fff', lineHeight: 1.78, marginBottom: 18, fontWeight: 500 }}>
              {QS_PARAGRAPHS[0]}
            </p>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  {QS_PARAGRAPHS.slice(1).map((p, i) => (
                    <p key={i} style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.78, marginBottom: 18 }}>
                      {p}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setExpanded(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', color: A,
                fontSize: 13.5, fontWeight: 600, cursor: 'pointer', padding: '4px 0', marginBottom: 12,
              }}
            >
              {expanded ? 'Read less' : 'Read full summary'}
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Closing statement */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32, marginTop: 8, textAlign: 'center' }}>
            <p style={{ fontSize: 'clamp(18px,2.2vw,24px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.5 }}>
              One Truck.{' '}
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>One Intelligence Layer.</span>{' '}
              A Business That Becomes More Valuable Every Month.
            </p>
          </div>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S3: Why Autonomatex Exists ────────────────────────────────────────────────

function WhyExistsSection() {
  return (
    <SectionWrap id="why-exists" bg={SF}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <FadeUp>
          <Eyebrow>Why Autonomatex Exists</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 36 }}>
            Operational Intelligence Should Compound.<br />Not Disappear.
          </h2>
        </FadeUp>

        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
        >
          {[
            { label: 'Every truck creates experience.', sub: 'Lane history. Broker relationships. Rate patterns. Operational rhythms.' },
            { label: 'Every business earns knowledge.', sub: 'What works. What doesn\'t. Who to call. Who to avoid. What rates hold.' },
            { label: 'People change.', sub: 'Drivers change. Dispatchers move on. Managers transition. Markets shift.' },
            { label: 'Knowledge should not disappear.', sub: 'Today, most of it does — because it lives inside people, not inside the business.' },
          ].map((item, i) => (
            <motion.div key={i} variants={staggerItem} style={{
              borderBottom: i < 3 ? `1px solid ${B}` : 'none',
              padding: '28px 0', display: 'flex', gap: 24, alignItems: 'flex-start',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: A, marginTop: 7, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: P, marginBottom: 6 }}>{item.label}</p>
                <p style={{ fontSize: 15, color: S, lineHeight: 1.65 }}>{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <FadeUp delay={0.15}>
          <div style={{
            background: D, borderRadius: 12, padding: '28px 36px', marginTop: 48,
            borderLeft: `3px solid ${A}`,
          }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>
              Autonomatex exists so operational intelligence compounds instead of disappearing every time something changes.
            </p>
          </div>
        </FadeUp>
      </div>
    </SectionWrap>
  );
}

// ── S4: Why Carriers Choose Autonomatex ───────────────────────────────────────

function WhyCarriersChooseSection() {
  const outcomes = [
    { title: 'Better Load Decisions', body: 'Focus only on the loads worth pursuing. Stop wasting time on calls that don\'t fit your operation.' },
    { title: 'Less Wasted Calling', body: 'Fewer broker calls. More productive hours. Energy goes where it generates real results.' },
    { title: 'Knowledge Never Disappears', body: 'Every dispatcher decision, every outcome, every preference — preserved and compounding indefinitely.' },
    { title: 'Faster Dispatcher Transitions', body: 'New dispatchers start informed. No ramp-up period. Accumulated knowledge transfers instantly.' },
    { title: 'Simpler Driver Transitions', body: 'When drivers change, operational patterns, preferences and truck history remain with the business.' },
    { title: 'Better Customer Experience', body: 'Consistent operations informed by history. Customer preferences are remembered and honored.' },
    { title: 'Long-Term Profitability', body: 'The longer you run, the smarter your operation becomes. Every month builds on the last.' },
    { title: 'Business Continuity', body: 'Operations remain consistent through any transition. No knowledge gap. No restart.' },
    { title: 'Lower Operational Stress', body: 'Complexity stays inside the platform. You see simplicity. Decisions become easier over time.' },
  ];

  return (
    <SectionWrap id="why-choose" bg={BG}>
      <SectionHead center eyebrow="Why Carriers Choose Autonomatex" title="Business Outcomes That Compound Over Time." />
      <motion.div
        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}
      >
        {outcomes.map(o => (
          <motion.div key={o.title} variants={staggerItem}>
            <div style={{ padding: '24px 28px', borderRadius: 10, background: SF, border: `1px solid ${B}`, height: '100%' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: A, marginBottom: 14 }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: P, marginBottom: 8 }}>{o.title}</p>
              <p style={{ fontSize: 13.5, color: S, lineHeight: 1.65 }}>{o.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

// ── S5: The Cost of Starting Over ─────────────────────────────────────────────

function CostOfStartingOverSection() {
  const scenarios = [
    { trigger: 'Changing dispatch companies', loss: 'Operational patterns built over months — preferred lanes, rate floors, broker history — must be rebuilt from scratch with the new arrangement.' },
    { trigger: 'Hiring a new dispatcher', loss: 'The knowledge the previous dispatcher carried leaves with them. The new person must relearn what already existed inside the business.' },
    { trigger: 'Hiring a new driver', loss: 'Truck operational patterns, customer preferences, equipment preferences and route knowledge must be rediscovered instead of inherited.' },
    { trigger: 'Growing the fleet', loss: 'Without a shared intelligence layer, new trucks start from zero. Each addition repeats the same slow learning curve.' },
    { trigger: 'Expanding operations', loss: 'Growth amplifies the knowledge gap. Larger operations with fragmented intelligence create more decisions with less context.' },
  ];

  return (
    <SectionWrap id="cost-of-starting-over" bg={SF}>
      <div className="atx-g2-wide">
        <FadeUp>
          <div>
            <Eyebrow>The Cost of Starting Over</Eyebrow>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 20 }}>
              Every Change Shouldn't Mean Rebuilding From Zero.
            </h2>
            <p style={{ fontSize: 16, color: S, lineHeight: 1.75, marginBottom: 32 }}>
              In most trucking operations today, critical knowledge lives inside people. When those people change, the knowledge disappears. That cost is real — and usually invisible until it's already been paid.
            </p>
            <div style={{ background: D, borderRadius: 10, padding: '20px 24px', borderLeft: `3px solid ${A}` }}>
              <p style={{ fontSize: 15, color: '#fff', lineHeight: 1.65 }}>
                Autonomatex preserves your operational intelligence — so every change becomes a smooth transition, not a restart.
              </p>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {scenarios.map((s, i) => (
              <div key={i} style={{ background: BG, border: `1px solid ${B}`, borderRadius: 10, padding: '20px 24px' }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: P, marginBottom: 6 }}>{s.trigger}</p>
                <p style={{ fontSize: 13, color: S, lineHeight: 1.6 }}>{s.loss}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </SectionWrap>
  );
}

// ── S6: Comparison ────────────────────────────────────────────────────────────

function ComparisonSection() {
  const traditional = [
    'Knowledge lives inside people.',
    'Starts over after personnel changes.',
    'Repeated mistakes.',
    'Manual remembering.',
    'Slow onboarding.',
  ];
  const autonomatex = [
    'Knowledge belongs to the business.',
    'Operational intelligence compounds.',
    'Faster transitions.',
    'Calmer operations.',
    'Better decisions.',
  ];

  return (
    <SectionWrap id="comparison" bg={BG}>
      <SectionHead center eyebrow="Why It Matters" title="Traditional Operations vs. Autonomatex." />
      <FadeUp delay={0.05}>
        <div className="atx-g2" style={{ gap: 20, maxWidth: 920, margin: '0 auto 48px' }}>
          {/* Traditional */}
          <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 12, padding: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF3F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F04438" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: P }}>Traditional Operations</p>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 14, listStyle: 'none' }}>
              {traditional.map(item => (
                <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#FEF3F2', border: '1.5px solid #FECDCA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#F04438" strokeWidth="2.2" strokeLinecap="round">
                      <line x1="2" y1="2" x2="10" y2="10"/><line x1="10" y1="2" x2="2" y2="10"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 14.5, color: S, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Autonomatex */}
          <div style={{ background: D, borderRadius: 12, padding: 36, border: `1px solid rgba(13,148,136,0.3)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(13,148,136,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Autonomatex</p>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 14, listStyle: 'none' }}>
              {autonomatex.map(item => (
                <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(13,148,136,0.2)', border: `1.5px solid ${A}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke={A} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1.5 6 4.5 9 10.5 3"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S7: Transitions ───────────────────────────────────────────────────────────

function TransitionsSection() {
  const transitions = [
    {
      label: 'Dispatcher changes',
      body: 'Accumulated load history, broker relationships and operational patterns stay with your business — not with any individual dispatcher. Your next dispatcher starts informed.',
    },
    {
      label: 'Dispatch company changes',
      body: 'Moving to a new dispatch arrangement does not mean starting over. Your operational intelligence moves with you, not with the company you leave behind.',
    },
    {
      label: 'Driver changes',
      body: 'Truck knowledge, equipment preferences, customer communication history and operational patterns remain with the business. The next driver inherits the foundation — under full human management.',
    },
    {
      label: 'Fleet manager changes',
      body: 'Fleet-wide operational context, performance history and decision patterns belong to your business — not to the individual managing it at any given time.',
    },
    {
      label: 'Operations manager changes',
      body: 'Strategic operational knowledge — lane decisions, broker strategies, rate floors — stays inside the platform and transfers cleanly to whoever steps into the role.',
    },
    {
      label: 'Internal team restructuring',
      body: 'When your team changes shape, your operational intelligence does not scatter. The platform holds the institutional knowledge your business has earned.',
    },
  ];

  return (
    <SectionWrap id="big-differentiator" bg={SF}>
      <SectionHead center eyebrow="Operational Continuity" title="Intelligence That Stays With Your Business — Through Every Change." desc="Operational intelligence remains with the carrier business when any person, role or arrangement changes." />
      <FadeUp delay={0.05}>
        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto 48px' }}
        >
          {transitions.map(t => (
            <motion.div key={t.label} variants={staggerItem}>
              <div style={{ background: BG, border: `1px solid ${B}`, borderRadius: 10, padding: '24px 28px', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: A, flexShrink: 0 }} />
                  <p style={{ fontSize: 14.5, fontWeight: 700, color: P }}>{t.label}</p>
                </div>
                <p style={{ fontSize: 13.5, color: S, lineHeight: 1.65 }}>{t.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div style={{
          background: D, borderRadius: 12, padding: '24px 36px', textAlign: 'center',
          border: `1px solid rgba(13,148,136,0.35)`, maxWidth: 640, margin: '0 auto',
        }}>
          <p style={{ fontSize: 19, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            Knowledge compounds. The business never starts over.
          </p>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S7: Your Truck Has a Memory ───────────────────────────────────────────────

function TruckMemorySection() {
  return (
    <SectionWrap id="truck-memory" bg={SF}>
      <FadeUp>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Eyebrow>Two Layers of Intelligence</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.25 }}>
            Your Truck Has a Memory.<br />Your Business Has Intelligence.
          </h2>
        </div>
      </FadeUp>

      <div className="atx-g2" style={{ gap: 32, maxWidth: 960, margin: '0 auto 48px' }}>
        <FadeUp>
          <div style={{ background: BG, border: `1px solid ${B}`, borderRadius: 12, padding: 36, height: '100%' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: S, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20 }}>Carrier Side</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 14, listStyle: 'none' }}>
              {['Lane history', 'Load history', 'Equipment preferences', 'Operating patterns'].map(item => (
                <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Dot />
                  <span style={{ fontSize: 15, color: P, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div style={{ background: D, borderRadius: 12, padding: 36, height: '100%' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: A, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20 }}>Business Side</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 14, listStyle: 'none' }}>
              {['Broker relationships', 'Dispatcher experience', 'Customer preferences', 'Operational knowledge'].map(item => (
                <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: A, marginTop: 9, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={0.15}>
        <p style={{ fontSize: 16, color: S, textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          AI continuously strengthens both layers — making each load decision smarter than the last.
        </p>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S8: Business Growth Journey ───────────────────────────────────────────────

function CarrierTimelineSection() {
  const milestones = [
    { label: 'New MC', desc: 'First loads. First decisions. Intelligence begins building from day one.' },
    { label: 'Growing Reputation', desc: 'Broker patterns emerge. Preferred lanes take shape. The operation gains clarity.' },
    { label: 'Established Carrier', desc: 'Consistent performance. Operational history deepens. Transitions become smooth.' },
    { label: 'Trusted Carrier', desc: 'Strong relationships. Reliable operations. Growing business value.' },
    { label: 'Operational Intelligence Compounds', desc: 'Every day adds to a growing intelligence layer. The business becomes more valuable every month.', accent: true },
  ];

  return (
    <SectionWrap id="carrier-timeline" bg={D}>
      <SectionHead center light eyebrow="The Business Growth Journey" title={<span style={{ color: '#fff' }}>Autonomatex Grows With Your Business.</span>}
        desc="At every stage, operational intelligence builds continuously — without promising broker approvals or guaranteed loads. Your history improves your recommendations. Nothing more, nothing less."
        descColor="rgba(255,255,255,0.55)"
      />
      <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 28, bottom: 28, left: 19, width: 2, background: 'rgba(13,148,136,0.25)' }} />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          {milestones.map((m, i) => (
            <motion.div key={m.label} variants={staggerItem} style={{ position: 'relative', paddingLeft: 56, marginBottom: i < milestones.length - 1 ? 44 : 0 }}>
              <div style={{
                position: 'absolute', left: 10, top: 6, width: 20, height: 20, borderRadius: '50%',
                background: m.accent ? A : 'rgba(13,148,136,0.18)',
                border: `2px solid ${A}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {m.accent && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: m.accent ? A : '#fff', marginBottom: 6 }}>{m.label}</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{m.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrap>
  );
}

// ── S9: Compounding Timeline ──────────────────────────────────────────────────

function CompoundingTimelineSection() {
  const years = [
    { label: 'Year 1', desc: 'Foundation built. Lane patterns emerge. Broker relationships take shape. Every load decision adds to the intelligence layer.' },
    { label: 'Year 2', desc: 'Recommendations sharpen. Rate floors clarify. Transitions become smooth. The operation stops repeating early mistakes.' },
    { label: 'Year 3', desc: 'Operational consistency compounds. New dispatchers onboard faster. Fleet decisions become more informed. Business value grows.' },
    { label: 'Year 5', desc: 'Institutional knowledge is deep. The business is more resilient, more efficient, and more valuable than any single-person operation could achieve.' },
    { label: 'Smarter Carrier Business', desc: 'Every decision — every load, every broker call, every outcome — has contributed to a business that is more intelligent than when it started.', accent: true },
  ];

  return (
    <SectionWrap id="compounding-timeline" bg={D}>
      <SectionHead center light eyebrow="Operational Intelligence Compounds"
        title={<span style={{ color: '#fff' }}>Every Decision Increases Long-Term Business Intelligence.</span>}
        desc="The longer you operate with Autonomatex, the more intelligent your business becomes. Intelligence is not reset — it compounds."
        descColor="rgba(255,255,255,0.55)"
      />
      <div style={{ maxWidth: 540, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 28, bottom: 28, left: 19, width: 2, background: 'rgba(13,148,136,0.3)' }} />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          {years.map((y, i) => (
            <motion.div key={y.label} variants={staggerItem} style={{ position: 'relative', paddingLeft: 58, marginBottom: i < years.length - 1 ? 48 : 0 }}>
              {/* Connector arrow between items */}
              {i < years.length - 1 && (
                <div style={{ position: 'absolute', left: 16, top: 44, zIndex: 1 }}>
                  <svg width="8" height="16" viewBox="0 0 8 16" fill="none">
                    <path d="M4 0 L4 10 M1 7 L4 11 L7 7" stroke={A} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                  </svg>
                </div>
              )}
              <div style={{
                position: 'absolute', left: 8, top: 4, width: 24, height: 24, borderRadius: '50%',
                background: y.accent ? A : 'rgba(13,148,136,0.15)',
                border: `2px solid ${A}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
              }}>
                {y.accent
                  ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                  : <div style={{ width: 6, height: 6, borderRadius: '50%', background: A, opacity: 0.8 }} />
                }
              </div>
              <div style={{
                background: y.accent ? 'rgba(13,148,136,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${y.accent ? 'rgba(13,148,136,0.4)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 10, padding: '18px 22px',
              }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: y.accent ? A : 'rgba(255,255,255,0.9)', marginBottom: 6, letterSpacing: y.accent ? '-0.01em' : 0 }}>
                  {y.label}
                </p>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{y.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrap>
  );
}

// ── S10: Customer Lifecycle ───────────────────────────────────────────────────

function CustomerLifecycleSection() {
  const stages = [
    { label: 'Welcome', desc: 'Onboarding begins. Truck profile created. Equipment, lanes and preferences established.' },
    { label: 'Truck Profile', desc: 'Operational baseline set. History begins. The intelligence layer starts building.' },
    { label: 'First Week', desc: 'Initial load decisions inform early recommendations. Patterns start emerging.' },
    { label: 'Daily Operations', desc: 'Every accepted and rejected load refines the model. Recommendations improve continuously.' },
    { label: 'Learning', desc: 'Lane preferences clarify. Broker patterns appear. Rate floors take shape.' },
    { label: 'Retention', desc: 'Operations stabilize. Transitions become easy. The platform earns its value daily.' },
    { label: 'Growth', desc: 'Additional trucks inherit the intelligence foundation. The fleet scales with accumulated knowledge.' },
  ];

  return (
    <SectionWrap id="customer-lifecycle" bg={BG}>
      <SectionHead center eyebrow="The Customer Lifecycle" title="Intelligence Grows Throughout the Relationship." />
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 24, bottom: 24, left: 18, width: 2, background: 'rgba(13,148,136,0.15)' }} />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          {stages.map((s, i) => (
            <motion.div key={s.label} variants={staggerItem} style={{ position: 'relative', paddingLeft: 52, marginBottom: i < stages.length - 1 ? 36 : 0 }}>
              <div style={{
                position: 'absolute', left: 10, top: 8, width: 16, height: 16, borderRadius: '50%',
                background: i === stages.length - 1 ? A : SF,
                border: `2px solid ${A}`,
              }} />
              <p style={{ fontSize: 13.5, fontWeight: 700, color: A, marginBottom: 4, letterSpacing: '0.02em' }}>{s.label}</p>
              <p style={{ fontSize: 14.5, color: S, lineHeight: 1.65 }}>{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrap>
  );
}

// ── S10: Who It's For / Segments ──────────────────────────────────────────────

function SegmentsSection() {
  const cards = [
    {
      title: 'New MC',
      challenge: 'No operational history. Every early decision carries significant weight. Building broker relationships from zero.',
      how: 'Intelligence begins from your very first load. Every early decision builds the foundation of your operation\'s long-term knowledge layer.',
    },
    {
      title: 'Owner Operator (1 truck)',
      challenge: 'Finding good loads, managing dispatcher relationships, building broker credibility while staying operationally lean.',
      how: 'Your truck learns which brokers pay, which lanes work, which loads are worth the call. Intelligence compounds quietly every day.',
    },
    {
      title: 'Small Fleet (2–10 trucks)',
      challenge: 'Knowledge fragments across dispatchers. Different decisions for different trucks without shared context.',
      how: 'One intelligence layer across all trucks. Every dispatcher works from the same operational knowledge — consistently, across your fleet.',
    },
    {
      title: 'Growing Fleet (10–100 trucks)',
      challenge: 'Dispatcher turnover disrupts performance. Rate consistency becomes difficult. Coordination breaks down.',
      how: 'Every truck contributes to a shared intelligence layer. Every dispatcher works from the same base. Rate consistency improves.',
    },
    {
      title: 'Enterprise Fleet (100+ trucks)',
      challenge: 'Data fragmentation across teams. Scaling without losing operational efficiency. Institutional knowledge at risk.',
      how: 'Fleet intelligence compounds continuously. The more trucks, the more powerful the intelligence layer. Every decision strengthens the operation.',
    },
  ];

  return (
    <SectionWrap id="segments" bg={SF}>
      <SectionHead center eyebrow="Who It's For" title="One Product. Every Fleet Size." desc="Select your equipment and fleet size during onboarding. The intelligence layer adapts to your operation." />
      <motion.div
        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}
      >
        {cards.map(c => (
          <motion.div key={c.title} variants={staggerItem}>
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: 15.5, fontWeight: 700, color: P, marginBottom: 18 }}>{c.title}</p>
              <div style={{ paddingBottom: 18, marginBottom: 18, borderBottom: `1px solid ${B}` }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: S, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>The Challenge</p>
                <p style={{ fontSize: 13.5, color: S, lineHeight: 1.65 }}>{c.challenge}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: A, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>How Autonomatex Helps</p>
                <p style={{ fontSize: 13.5, color: P, lineHeight: 1.65 }}>{c.how}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

// ── S11: How It Works / Workflow ──────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    { n: '1', title: 'Evaluate', body: '42 loads scanned against your truck\'s operational history and preferences.' },
    { n: '2', title: 'Filter', body: '39 rejected. Doesn\'t fit your truck, your lanes, your rates, or your rules.' },
    { n: '3', title: 'Present', body: '3 worth calling. Ranked and ready for the dispatcher.' },
    { n: '4', title: 'Decide', body: 'Human makes every final call. Always. No automatic booking.' },
    { n: '5', title: 'Learn', body: 'Every outcome — accepted or declined — improves the next recommendation.' },
  ];

  return (
    <SectionWrap id="how-it-works" bg={BG}>
      <SectionHead center eyebrow="Workflow" title="Simple for You. Powerful Behind the Scenes." />
      <motion.div
        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}
      >
        {steps.map(s => (
          <motion.div key={s.n} variants={staggerItem} style={{ flex: '1 1 180px', maxWidth: 220 }}>
            <Card style={{ textAlign: 'center', height: '100%', padding: '28px 16px' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: 'rgba(13,148,136,0.1)', color: A,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13, margin: '0 auto 16px',
              }}>{s.n}</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: P, marginBottom: 8 }}>{s.title}</p>
              <p style={{ fontSize: 13.5, color: S, lineHeight: 1.6 }}>{s.body}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

// ── S12: The Product ──────────────────────────────────────────────────────────

function TheProductSection() {
  return (
    <SectionWrap id="the-product" bg={D}>
      <SectionHead center light eyebrow="The Interface" title={<span style={{ color: '#fff' }}>Designed to Be Simple.</span>} />
      <FadeUp>
        <div style={{
          background: '#151c2a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
          padding: '68px 32px', maxWidth: 480, margin: '0 auto 44px', textAlign: 'center',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
        }}>
          <p style={{ fontSize: 52, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1 }}>42 Loads</p>
          <p style={{ fontSize: 17, color: 'rgba(240,68,56,0.85)', marginBottom: 24, fontWeight: 500 }}>39 Rejected</p>
          <p style={{ fontSize: 26, fontWeight: 600, color: A, marginBottom: 36 }}>3 Worth Calling</p>
          <button style={{
            background: A, color: '#fff', border: 'none', padding: '14px 44px',
            borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'default',
            boxShadow: '0 4px 16px rgba(13,148,136,0.35)',
          }}>
            Call Broker
          </button>
        </div>
        <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          Complexity belongs to the platform. Simplicity belongs to the customer.
        </p>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S13: Intelligence / Behind the Scenes ────────────────────────────────────

function IntelligenceSection() {
  const items = [
    'Driver input', 'Dispatcher experience', 'Truck history', 'Market conditions',
    'Accepted loads', 'Rejected loads', 'Rate history', 'Broker relationships',
    'Operational outcomes', 'Customer preferences', 'AI reasoning', 'Lane patterns',
  ];

  return (
    <SectionWrap id="intelligence" bg={BG}>
      <SectionHead center eyebrow="Intelligence" title="Quietly Improving Every Day." />
      <motion.div
        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, maxWidth: 800, margin: '0 auto 52px' }}
      >
        {items.map(item => (
          <motion.div key={item} variants={staggerItem}>
            <div style={{
              background: SF, border: `1px solid ${B}`, borderRadius: 8, padding: '12px 14px',
              textAlign: 'center', fontSize: 13, fontWeight: 500, color: P,
            }}>
              {item}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <FadeUp>
        <p style={{ fontSize: 17, color: S, textAlign: 'center', fontWeight: 500 }}>
          Every day, your truck gets a little smarter. Every month, the intelligence compounds.
        </p>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S14: Technical Side ───────────────────────────────────────────────────────

const TECH_ICONS: Record<string, React.ReactElement> = {
  'Business Experience': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  'Operational Memory': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
    </svg>
  ),
  'AI Intelligence': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
    </svg>
  ),
  'Recommendations': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  'Human Decision': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  'Continuous Learning': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  ),
};

function TechnicalSideSection() {
  const flow = [
    { label: 'Business Experience', desc: 'Every load, every broker call, every decision — captured and organized as structured operational data.' },
    { label: 'Operational Memory', desc: 'Your truck\'s history, preferences, patterns and outcomes — stored as a durable intelligence layer that belongs to your business.' },
    { label: 'AI Intelligence', desc: 'The platform analyzes patterns across your operational history, surfaces signals and builds ranked recommendations from your own data.' },
    { label: 'Recommendations', desc: 'A ranked shortlist of loads worth calling — specific to your truck, your lanes and your operational preferences.' },
    { label: 'Human Decision', desc: 'Your dispatcher or you make every call. The platform informs. Humans decide. Always.' },
    { label: 'Continuous Learning', desc: 'Every accepted and declined outcome feeds back into the system. The intelligence improves with every cycle — compounding over time.' },
  ];

  return (
    <SectionWrap id="technical-side" bg={BG}>
      <SectionHead center eyebrow="Technical Side" title="How the Intelligence Works." desc="Business-focused architecture. No technical jargon. The platform stays invisible." />
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
        >
          {flow.map((step, i) => (
            <motion.div key={step.label} variants={staggerItem}>
              {/* Step card */}
              <div style={{
                display: 'flex', gap: 20, alignItems: 'flex-start',
                background: SF, border: `1px solid ${B}`, borderRadius: 10,
                padding: '20px 24px', boxShadow: '0 1px 3px rgba(16,24,40,0.04)',
              }}>
                {/* Icon badge */}
                <div style={{
                  width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                  background: i === flow.length - 1 ? A : 'rgba(13,148,136,0.1)',
                  color: i === flow.length - 1 ? '#fff' : A,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {TECH_ICONS[step.label]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: i === flow.length - 1 ? A : S,
                      letterSpacing: '0.07em', textTransform: 'uppercase',
                    }}>Step {i + 1}</span>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: P, marginBottom: 5 }}>{step.label}</p>
                  <p style={{ fontSize: 13.5, color: S, lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              </div>
              {/* Connector arrow */}
              {i < flow.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
                  <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
                    <line x1="7" y1="0" x2="7" y2="14" stroke={A} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5"/>
                    <path d="M3 11 L7 16 L11 11" stroke={A} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7"/>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <FadeUp delay={0.15}>
          <div style={{
            background: D, borderRadius: 10, padding: '20px 28px', marginTop: 32,
            display: 'flex', alignItems: 'center', gap: 16,
            border: '1px solid rgba(13,148,136,0.25)',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(13,148,136,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
              This cycle repeats with every load, every day — building a compounding intelligence layer that makes your operation more valuable over time.
            </p>
          </div>
        </FadeUp>
      </div>
    </SectionWrap>
  );
}

// ── S15: Trust ────────────────────────────────────────────────────────────────

function TrustSection() {
  const pillars = [
    { title: 'Human Remains in Control', body: 'Every booking decision is made by a human. Autonomatex never books a load automatically.' },
    { title: 'Decision Support Only', body: 'The platform surfaces the best options. Your dispatcher or you make every call. Always.' },
    { title: 'No Automatic Booking', body: 'No load is accepted on your behalf. The platform recommends. You decide.' },
    { title: 'Operational Intelligence Belongs to You', body: 'Your data belongs to your business. When you leave, it leaves with you. Not with a third party.' },
    { title: 'Secure by Design', body: 'Built with long-term data security in mind from the ground up.' },
    { title: 'Built for Long-Term Operations', body: 'Designed to grow with your business over years — not just optimize for the next load.' },
  ];

  return (
    <SectionWrap id="trust" bg={D}>
      <SectionHead center light eyebrow="Built on Trust" title={<span style={{ color: '#fff' }}>You Stay in Control. Always.</span>} />
      <motion.div
        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}
      >
        {pillars.map(p => (
          <motion.div key={p.title} variants={staggerItem}>
            <div style={{ padding: '24px 28px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: A, marginBottom: 14 }} />
              <p style={{ fontSize: 14.5, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{p.title}</p>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{p.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

// ── S16: Pricing ──────────────────────────────────────────────────────────────

function PricingSection() {
  return (
    <SectionWrap id="pricing" bg={BG}>
      <SectionHead center eyebrow="Pricing" title="Start Simple. Scale When Ready." />
      <FadeUp>
        <div style={{
          background: SF, border: `1px solid ${B}`, borderTop: `4px solid ${A}`,
          borderRadius: 12, padding: 48, maxWidth: 480, margin: '0 auto', textAlign: 'center',
          boxShadow: '0 12px 24px rgba(16,24,40,0.04)',
        }}>
          <p style={{ fontSize: 22, fontWeight: 700, color: P, marginBottom: 14 }}>Paid Pilot</p>
          <p style={{ fontSize: 15, color: S, lineHeight: 1.7, marginBottom: 32 }}>
            Test Autonomatex Carrier with your truck before committing. Start with a paid pilot, use the platform for real loads, and upgrade when ready.
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', marginBottom: 32, textAlign: 'left' }}>
            {['Full platform access during pilot', 'All equipment types supported', 'Email support included', 'No auto-booking, ever', 'Decision-support only', 'Cancel anytime'].map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ color: A, fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: 14, color: P }}>{item}</span>
              </li>
            ))}
          </ul>
          <NavHref href="/#paid-pilot">
            <button style={{ width: '100%', background: A, color: '#fff', border: 'none', padding: '14px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}>
              Start Paid Pilot
            </button>
          </NavHref>
          <p style={{ fontSize: 13, color: S }}>Contact us for pricing. No sales calls required.</p>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S17: FAQ ──────────────────────────────────────────────────────────────────

function FAQItem({ question, answer, isLast }: { question: string; answer: string; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: isLast ? 'none' : `1px solid ${B}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', padding: '22px 0', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontSize: 15.5, fontWeight: 600, color: P, paddingRight: 16 }}>{question}</span>
        {open ? <ChevronUp size={18} color={S} style={{ flexShrink: 0 }} /> : <ChevronDown size={18} color={S} style={{ flexShrink: 0 }} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 15, color: S, lineHeight: 1.7, paddingBottom: 22 }}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    { q: 'Can I change dispatchers?', a: 'Yes. Autonomatex Carrier preserves your truck\'s operational intelligence regardless of who is dispatching. Your next dispatcher starts informed — not from scratch.' },
    { q: 'Will my truck lose its knowledge when I switch dispatch companies?', a: 'No. The intelligence belongs to your truck and your business — not to any dispatch company or individual. When you move to a new arrangement, your operational history moves with you.' },
    { q: 'What happens when a driver changes?', a: 'The truck does not lose its operational history. Business knowledge, equipment preferences, operational patterns and communication history remain available to help the next driver understand the operation faster — under full human management.' },
    { q: 'What if I\'m a brand-new MC with no history?', a: 'Autonomatex begins building your operational intelligence from your very first load. Recommendations improve continuously as your own history grows.' },
    { q: 'Does my truck continue learning after any change?', a: 'Yes. Every new decision, load outcome, and broker interaction continues building on existing intelligence. The learning never resets.' },
    { q: 'What equipment types are supported?', a: 'Dry Van, Reefer, Flatbed, Hotshot, Box Truck, and Power Only. You select your equipment type during onboarding.' },
    { q: 'Is this another TMS or dispatch software?', a: 'No. Autonomatex Carrier is an operational intelligence layer. It works alongside your dispatch arrangement — not instead of it. Your dispatcher stays in control of every decision.' },
  ];

  return (
    <SectionWrap id="faq" bg={SF}>
      <SectionHead center eyebrow="FAQ" title="Common Questions." />
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.q} answer={faq.a} isLast={i === faqs.length - 1} />
        ))}
      </div>
    </SectionWrap>
  );
}

// ── Paid Pilot Form ───────────────────────────────────────────────────────────

function PilotFormSection() {
  const [status, setStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    const formData = new FormData(e.currentTarget);
    const body = new URLSearchParams();
    formData.forEach((value, key) => body.append(key, value.toString()));
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      if (res.ok) setStatus('success'); else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <SectionWrap id="paid-pilot" bg={D}>
      <SectionHead center light eyebrow="Start Your Paid Pilot"
        title={<span style={{ color: '#fff' }}>Your Truck. Your Intelligence.</span>}
        desc="Complete the form below. We'll follow up by email. No calls required."
        descColor="rgba(255,255,255,0.6)"
      />
      <FadeUp>
        <Card style={{ maxWidth: 600, margin: '0 auto', background: SF }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: A, fontSize: 20 }}>✓</div>
              <p style={{ fontSize: 18, fontWeight: 600, color: P, marginBottom: 8 }}>Request Received</p>
              <p style={{ fontSize: 15, color: S }}>We'll be in touch via email shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <input type="hidden" name="form-name" value="autonomatex-carrier-pilot" />
              <div className="atx-form-g2">
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: P, marginBottom: 6 }}>Name *</label>
                  <input required name="name" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${B}`, borderRadius: 6, fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: P, marginBottom: 6 }}>Company / Fleet Name *</label>
                  <input required name="company" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${B}`, borderRadius: 6, fontSize: 14 }} />
                </div>
              </div>
              <div className="atx-form-g2">
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: P, marginBottom: 6 }}>Email *</label>
                  <input required type="email" name="email" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${B}`, borderRadius: 6, fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: P, marginBottom: 6 }}>Phone</label>
                  <input type="tel" name="phone" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${B}`, borderRadius: 6, fontSize: 14 }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: P, marginBottom: 10 }}>Equipment Types</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                  {['Dry Van', 'Reefer', 'Flatbed', 'Hotshot', 'Box Truck', 'Power Only'].map(t => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: S, cursor: 'pointer' }}>
                      <input type="checkbox" name="equipment_types" value={t.toLowerCase().replace(' ', '_')} style={{ accentColor: A }} />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: P, marginBottom: 6 }}>Number of Trucks</label>
                <select name="trucks_count" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${B}`, borderRadius: 6, fontSize: 14, background: '#fff' }}>
                  <option value="1 truck">1 truck</option>
                  <option value="2-5 trucks">2–5 trucks</option>
                  <option value="6-10 trucks">6–10 trucks</option>
                  <option value="11-25 trucks">11–25 trucks</option>
                  <option value="25+ trucks">25+ trucks</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: P, marginBottom: 6 }}>Message</label>
                <textarea name="message" rows={3} placeholder="Tell us about your operation — current setup, main pain points, what you'd like to test." style={{ width: '100%', padding: '10px 12px', border: `1px solid ${B}`, borderRadius: 6, fontSize: 14, resize: 'vertical' }} />
              </div>
              {status === 'error' && <p style={{ fontSize: 13, color: '#F04438' }}>Something went wrong. Please try again.</p>}
              <button disabled={status === 'submitting'} type="submit" style={{ width: '100%', background: A, color: '#fff', border: 'none', padding: '14px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: status === 'submitting' ? 'wait' : 'pointer', opacity: status === 'submitting' ? 0.7 : 1 }}>
                {status === 'submitting' ? 'Submitting...' : 'Start Paid Pilot'}
              </button>
            </form>
          )}
        </Card>
      </FadeUp>
    </SectionWrap>
  );
}

// ── Contact Form ──────────────────────────────────────────────────────────────

function ContactSection() {
  const [status, setStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    const formData = new FormData(e.currentTarget);
    const body = new URLSearchParams();
    formData.forEach((value, key) => body.append(key, value.toString()));
    try {
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      if (res.ok) setStatus('success'); else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <SectionWrap id="contact" bg={BG}>
      <SectionHead center eyebrow="Contact" title="Get in Touch." desc="No demos. No sales pressure. Just email." />
      <FadeUp>
        <Card style={{ maxWidth: 600, margin: '0 auto' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: A, fontSize: 20 }}>✓</div>
              <p style={{ fontSize: 18, fontWeight: 600, color: P, marginBottom: 8 }}>Message Sent</p>
              <p style={{ fontSize: 15, color: S }}>We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <input type="hidden" name="form-name" value="autonomatex-carrier-contact" />
              <div className="atx-form-g2">
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: P, marginBottom: 6 }}>Name *</label>
                  <input required name="name" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${B}`, borderRadius: 6, fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: P, marginBottom: 6 }}>Company *</label>
                  <input required name="company" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${B}`, borderRadius: 6, fontSize: 14 }} />
                </div>
              </div>
              <div className="atx-form-g2">
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: P, marginBottom: 6 }}>Email *</label>
                  <input required type="email" name="email" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${B}`, borderRadius: 6, fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: P, marginBottom: 6 }}>Phone</label>
                  <input type="tel" name="phone" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${B}`, borderRadius: 6, fontSize: 14 }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: P, marginBottom: 6 }}>Fleet Size</label>
                <select name="fleet_size" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${B}`, borderRadius: 6, fontSize: 14, background: '#fff' }}>
                  <option value="1 truck">1 truck</option>
                  <option value="2-5 trucks">2–5 trucks</option>
                  <option value="6-10 trucks">6–10 trucks</option>
                  <option value="11-50 trucks">11–50 trucks</option>
                  <option value="50+ trucks">50+ trucks</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: P, marginBottom: 6 }}>Message *</label>
                <textarea required name="message" rows={4} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${B}`, borderRadius: 6, fontSize: 14, resize: 'vertical' }} />
              </div>
              {status === 'error' && <p style={{ fontSize: 13, color: '#F04438' }}>Something went wrong. Please try again.</p>}
              <button disabled={status === 'submitting'} type="submit" style={{ width: '100%', background: A, color: '#fff', border: 'none', padding: '14px', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: status === 'submitting' ? 'wait' : 'pointer', opacity: status === 'submitting' ? 0.7 : 1 }}>
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </Card>
      </FadeUp>
    </SectionWrap>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function HomePage() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <HeroSection />
      <QuickSummarySection />
      <WhyExistsSection />
      <WhyCarriersChooseSection />
      <CostOfStartingOverSection />
      <ComparisonSection />
      <TransitionsSection />
      <TruckMemorySection />
      <CarrierTimelineSection />
      <CompoundingTimelineSection />
      <CustomerLifecycleSection />
      <SegmentsSection />
      <HowItWorksSection />
      <TheProductSection />
      <IntelligenceSection />
      <TechnicalSideSection />
      <TrustSection />
      <PricingSection />
      <FAQSection />
      <PilotFormSection />
      <ContactSection />
    </div>
  );
}
