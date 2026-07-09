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
            Dry Van · Reefer · Flatbed · Hotshot · Box Truck
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

// ── S6: Dispatcher + Driver Transitions ───────────────────────────────────────

function TransitionsSection() {
  return (
    <SectionWrap id="big-differentiator" bg={BG}>
      <SectionHead center eyebrow="Intelligence That Stays With Your Business" title="Transitions Become Smooth. Knowledge Never Leaves." />
      <FadeUp delay={0.05}>
        <div className="atx-g2" style={{ gap: 24, maxWidth: 1000, margin: '0 auto 48px' }}>

          {/* Dispatcher card */}
          <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 12, padding: 36 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: P, marginBottom: 12 }}>When Dispatchers Change</p>
            <p style={{ fontSize: 14, color: S, lineHeight: 1.7, marginBottom: 20 }}>
              Operational intelligence belongs to your truck and your business — not to any individual dispatcher. When dispatchers change, accumulated knowledge stays with your operation.
            </p>
            <div style={{ background: BG, borderRadius: 8, padding: '14px 18px' }}>
              <p style={{ fontSize: 13.5, color: P, lineHeight: 1.6 }}>
                Your next dispatcher starts with your truck's accumulated business knowledge instead of starting from zero — becoming productive faster while your business keeps compounding.
              </p>
            </div>
          </div>

          {/* Driver card */}
          <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 12, padding: 36 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1"/>
                <path d="M16 8h4l3 4v4h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: P, marginBottom: 12 }}>When Drivers Change</p>
            <p style={{ fontSize: 14, color: S, lineHeight: 1.7, marginBottom: 20 }}>
              If a driver changes, the truck does not lose its operational history. Business knowledge, equipment preferences, operational patterns and customer communication history remain with the business.
            </p>
            <div style={{ background: BG, borderRadius: 8, padding: '14px 18px' }}>
              <p style={{ fontSize: 13.5, color: P, lineHeight: 1.6 }}>
                This helps new drivers understand the operation faster — under full human management, not automated systems.
              </p>
            </div>
          </div>
        </div>

        <div style={{
          background: D, borderRadius: 12, padding: '24px 36px', textAlign: 'center',
          border: `1px solid ${A}`, maxWidth: 640, margin: '0 auto',
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
            <p style={{ fontSize: 13, fontWeight: 700, color: S, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20 }}>The Truck Remembers</p>
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
            <p style={{ fontSize: 13, fontWeight: 700, color: A, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 20 }}>The Business Remembers</p>
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

// ── S9: Customer Lifecycle ────────────────────────────────────────────────────

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

function TechnicalSideSection() {
  const flow = [
    { label: 'Business Experience', desc: 'Every load, every broker call, every decision — captured and organized.' },
    { label: 'Operational Memory', desc: 'Your truck\'s history, preferences, patterns and outcomes — stored as intelligence.' },
    { label: 'AI Intelligence', desc: 'The platform analyzes patterns, surfaces signals and builds recommendations from your own history.' },
    { label: 'Recommendations', desc: '3 loads worth calling, ranked specifically for your truck and your operation.' },
    { label: 'Human Decision', desc: 'Your dispatcher or you make every call. The platform informs. Humans decide.' },
    { label: 'Continuous Learning', desc: 'Every outcome feeds back into the system. The intelligence improves with every cycle.' },
  ];

  return (
    <SectionWrap id="technical-side" bg={SF}>
      <SectionHead center eyebrow="Technical Side" title="How the Intelligence Works." desc="Business-focused. No technical jargon. The platform stays invisible." />
      <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', top: 24, bottom: 24, left: 19, width: 2, background: `rgba(13,148,136,0.18)` }} />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          {flow.map((step, i) => (
            <motion.div key={step.label} variants={staggerItem} style={{ position: 'relative', paddingLeft: 56, marginBottom: i < flow.length - 1 ? 40 : 0, display: 'flex', gap: 0 }}>
              {/* Step number circle */}
              <div style={{
                position: 'absolute', left: 8, top: 6, width: 24, height: 24, borderRadius: '50%',
                background: i === flow.length - 1 ? A : BG,
                border: `2px solid ${A}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: i === flow.length - 1 ? '#fff' : A,
              }}>
                {i + 1}
              </div>
              <div>
                <p style={{ fontSize: 15.5, fontWeight: 700, color: P, marginBottom: 6 }}>{step.label}</p>
                <p style={{ fontSize: 14, color: S, lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
    { q: 'What equipment types are supported?', a: 'Dry Van, Reefer, Flatbed, Hotshot, and Box Truck. You select your equipment type during onboarding.' },
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
                  {['Dry Van', 'Reefer', 'Flatbed', 'Hotshot', 'Box Truck'].map(t => (
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
      <TransitionsSection />
      <TruckMemorySection />
      <CarrierTimelineSection />
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
