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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: A, marginBottom: 14 }}>
      {children}
    </div>
  );
}

function SectionWrap({ id, children, bg, style }: { id?: string; children: React.ReactNode; bg?: string; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ background: bg || BG, ...style }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
        {children}
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, desc, descColor, center }: {
  eyebrow: string; title: React.ReactNode; desc?: string; descColor?: string; center?: boolean
}) {
  return (
    <FadeUp>
      <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 56 }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 style={{
          fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700, color: P,
          letterSpacing: '-0.025em', lineHeight: 1.22,
          marginBottom: desc ? 16 : 0,
          maxWidth: 680, margin: center ? '0 auto' : undefined,
        }}>
          {title}
        </h2>
        {desc && (
          <p style={{
            fontSize: 17, color: descColor ?? S, lineHeight: 1.7,
            maxWidth: 640, marginTop: 14,
            margin: center ? '14px auto 0' : '14px 0 0',
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
      padding: 28, boxShadow: '0 1px 3px rgba(16,24,40,0.06)', ...style,
    }}>
      {children}
    </div>
  );
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
          padding: '12px 18px', boxShadow: '0 8px 24px rgba(16,24,40,0.12)',
          minWidth: 190,
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 700, color: P, marginBottom: 3 }}>42 loads scanned</p>
        <p style={{ fontSize: 11.5, color: S }}>39 rejected before wasted calls</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
        style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 64px rgba(16,24,40,0.18)', border: `1px solid rgba(255,255,255,0.06)` }}
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
          padding: '12px 18px', boxShadow: '0 8px 24px rgba(16,24,40,0.25)',
          minWidth: 180,
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
    <section style={{ background: BG, padding: '72px 24px 80px' }}>
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
            style={{ fontSize: 17, color: S, lineHeight: 1.7, marginBottom: 32 }}
          >
            Every mile, every load, every dispatcher and every decision continuously improve the profitability of your truck.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.65, ease: EASE }}
          >
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
              <NavHref href="/#paid-pilot">
                <span style={{
                  display: 'inline-block', background: A, color: '#fff', borderRadius: 8,
                  padding: '13px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer',
                  boxShadow: `0 4px 14px rgba(13,148,136,0.3)`,
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
  'Whether you have a brand-new MC, an owner operator business, a growing fleet or an established operation, Autonomatex identifies the few loads worth calling while continuously learning from your truck\'s operational history, dispatcher decisions, broker interactions, driver feedback, market conditions and business outcomes.',
  'If you decide to change dispatchers or even switch dispatch companies, your truck\'s operational intelligence stays with your business—not with an individual dispatcher. Your new dispatcher starts with your truck\'s accumulated knowledge instead of starting from zero, helping them become productive faster while your business continues getting smarter over time.',
  'The interface remains intentionally simple. Behind the scenes, Autonomatex operates as a complete Operational Intelligence Platform, continuously improving every recommendation while keeping humans in complete control.',
];

function QuickSummarySection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <SectionWrap id="quick-summary" bg={D}>
      <FadeUp>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <Eyebrow>Quick Summary</Eyebrow>

          {/* Desktop: all paragraphs always visible */}
          <div className="hidden md:block">
            {QS_PARAGRAPHS.map((p, i) => (
              <p key={i} style={{
                fontSize: 17, color: i === 0 ? '#fff' : 'rgba(255,255,255,0.72)',
                lineHeight: 1.78, marginBottom: i < QS_PARAGRAPHS.length - 1 ? 20 : 32,
                fontWeight: i === 0 ? 500 : 400,
              }}>
                {p}
              </p>
            ))}
          </div>

          {/* Mobile: first paragraph + expandable */}
          <div className="md:hidden">
            <p style={{ fontSize: 16, color: '#fff', lineHeight: 1.75, marginBottom: 16, fontWeight: 500 }}>
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
                    <p key={i} style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: 16 }}>
                      {p}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setExpanded(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                color: A, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', padding: '4px 0', marginBottom: 8,
              }}
            >
              {expanded ? 'Read less' : 'Read full summary'}
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Closing statement — always visible */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 28, marginTop: 4,
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 'clamp(17px,2vw,22px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.015em', lineHeight: 1.35 }}>
              One Truck. One Intelligence Layer. A Business That Becomes More Valuable Every Month.
            </p>
          </div>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S3: Why Choose Autonomatex ────────────────────────────────────────────────

function WhyChooseSection() {
  const outcomes = [
    { title: 'Better Load Decisions', body: 'Stop calling on loads that don\'t fit your truck. Focus only on the three worth pursuing.' },
    { title: 'Less Wasted Calling', body: 'Fewer broker calls. More productive hours. Your time goes where it matters.' },
    { title: 'Knowledge Never Disappears', body: 'Every dispatcher decision, every outcome, every preference — preserved indefinitely.' },
    { title: 'Faster Dispatcher Transitions', body: 'New dispatchers start informed. No ramp-up period. No starting from zero.' },
    { title: 'Long-Term Profitability', body: 'The longer you run, the smarter your operation becomes. Recommendations improve every month.' },
    { title: 'Lower Operational Stress', body: 'The platform handles complexity. You see simplicity. Decisions feel easier over time.' },
    { title: 'Growing Operational Intelligence', body: 'Every load, every broker interaction, every outcome makes the next decision better.' },
  ];

  return (
    <SectionWrap id="why-choose" bg={SF}>
      <SectionHead
        eyebrow="Why Truck Owners Choose Autonomatex"
        title="Business Outcomes That Compound Over Time."
        center
      />
      <motion.div
        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}
      >
        {outcomes.map(o => (
          <motion.div key={o.title} variants={staggerItem}>
            <div style={{ padding: '24px 28px', borderRadius: 10, background: BG, border: `1px solid ${B}`, height: '100%' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: A }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: P, marginBottom: 8 }}>{o.title}</p>
              <p style={{ fontSize: 14, color: S, lineHeight: 1.65 }}>{o.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

// ── S4: The Cost of Starting Over ─────────────────────────────────────────────

function CostOfStartingOverSection() {
  const scenarios = [
    { trigger: 'A dispatcher changes', loss: 'Preferred lanes, rate minimums, broker history, load rejection logic — gone. The new dispatcher starts without context.' },
    { trigger: 'A dispatch company changes', loss: 'Operational patterns built over months reset. Broker relationships have to be rebuilt from scratch.' },
    { trigger: 'A new employee joins', loss: 'Institutional knowledge that lived with the previous person is not transferred. It simply disappears.' },
    { trigger: 'A new operations manager takes over', loss: 'Fleet preferences, historical decisions, and what worked — must be rediscovered rather than inherited.' },
  ];

  return (
    <SectionWrap id="cost-of-starting-over" bg={BG}>
      <div className="atx-g2-wide">
        <FadeUp>
          <div>
            <Eyebrow>The Cost of Starting Over</Eyebrow>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 18 }}>
              Every Change Shouldn't Mean Rebuilding From Zero.
            </h2>
            <p style={{ fontSize: 16, color: S, lineHeight: 1.7, marginBottom: 32 }}>
              In most trucking operations today, critical knowledge lives inside people. When those people change, the knowledge disappears. That cost is real — and often invisible until it's already been paid.
            </p>
            <div style={{ background: D, borderRadius: 10, padding: '20px 24px', borderLeft: `3px solid ${A}` }}>
              <p style={{ fontSize: 15, color: '#fff', lineHeight: 1.6 }}>
                Autonomatex preserves your truck's operational intelligence — so every change becomes a transition, not a restart.
              </p>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {scenarios.map((s, i) => (
              <div key={i} style={{ background: SF, border: `1px solid ${B}`, borderRadius: 10, padding: '20px 24px' }}>
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

// ── S5: The Big Differentiator ────────────────────────────────────────────────

function BigDifferentiatorSection() {
  return (
    <SectionWrap id="big-differentiator" bg={SF}>
      <SectionHead center eyebrow="The Big Differentiator" title="Changing Dispatchers Should Never Mean Starting From Zero." />
      <FadeUp delay={0.1}>
        <p style={{ fontSize: 17, color: S, lineHeight: 1.7, maxWidth: 800, margin: '0 auto 48px', textAlign: 'center' }}>
          Operational intelligence belongs to your truck and your business — not to an individual dispatcher. Whether you change dispatchers, switch dispatch companies, or hire a new manager, your truck keeps its intelligence. The new dispatcher starts informed, not from scratch.
        </p>
        <div className="atx-g2" style={{ gap: 24, maxWidth: 960, margin: '0 auto 48px' }}>
          <div style={{ background: D, borderRadius: 12, padding: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Without Autonomatex</p>
            <p style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Knowledge resets with every change.</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>
              Preferred lanes, broker history, rate minimums, load rejection logic, operational patterns — all of it disappears when a dispatcher leaves.
            </p>
          </div>
          <div style={{ background: 'rgba(13,148,136,0.05)', border: `1px solid rgba(13,148,136,0.2)`, borderRadius: 12, padding: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: A, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>With Autonomatex Carrier</p>
            <p style={{ fontSize: 14.5, fontWeight: 600, color: P, marginBottom: 12 }}>Intelligence accumulates. Transitions become smooth.</p>
            <p style={{ fontSize: 14, color: S, lineHeight: 1.65 }}>
              New dispatchers immediately work from your truck's history — preferred lanes, outcomes, patterns, broker relationships, and business preferences — all preserved.
            </p>
          </div>
        </div>
        <div style={{
          background: D, borderRadius: 12, padding: '28px 36px', textAlign: 'center',
          border: `1px solid ${A}`, maxWidth: 640, margin: '0 auto',
        }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            Knowledge compounds. The truck never starts over.
          </p>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S6: Your Truck Has a Memory ───────────────────────────────────────────────

function TruckMemorySection() {
  return (
    <SectionWrap id="truck-memory" bg={BG}>
      <FadeUp>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Eyebrow>Two Layers of Intelligence</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 0 }}>
            Your Truck Has a Memory.<br />Your Business Has Intelligence.
          </h2>
        </div>
      </FadeUp>

      <div className="atx-g2" style={{ gap: 32, maxWidth: 960, margin: '0 auto 48px' }}>
        <FadeUp>
          <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 12, padding: 36, height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16,24,40,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="1"/>
                  <path d="M16 8h4l3 4v4h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: P }}>The Truck Remembers</p>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none' }}>
              {['Load history and lane patterns', 'Equipment preferences and restrictions', 'Operating patterns by region and season', 'Rate history by lane and broker'].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: A, marginTop: 9, flexShrink: 0 }} />
                  <span style={{ fontSize: 14.5, color: S, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div style={{ background: D, borderRadius: 12, padding: 36, height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(13,148,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>The Business Remembers</p>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none' }}>
              {['Broker relationships and reliability', 'Dispatcher decisions and reasoning', 'Customer preferences and delivery patterns', 'Accumulated operational knowledge'].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: A, marginTop: 9, flexShrink: 0 }} />
                  <span style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>
      </div>

      <FadeUp delay={0.15}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: S, maxWidth: 680, margin: '0 auto' }}>
            AI continuously strengthens both layers — making each load decision smarter than the last.
          </p>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S7: Operational Intelligence Starts on Day One ────────────────────────────

function IntelligenceDayOneSection() {
  const stages = [
    { label: 'Brand-New MC', body: 'Intelligence starts building from your very first load. Every early decision becomes part of your operational foundation.' },
    { label: 'Three-Month Authority', body: 'Lane patterns emerge. Broker preferences take shape. Recommendations begin reflecting your truck\'s history.' },
    { label: 'Six-Month Authority', body: 'Seasonal patterns appear. Rate floors become clearer. The platform recognizes what works for your operation.' },
    { label: 'Established Carrier', body: 'Years of decisions inform every recommendation. Transitions are smooth. The intelligence layer is mature.' },
    { label: 'Long-Term Operation', body: 'Compounding knowledge. Every month builds on the last. Your business becomes more valuable over time.' },
  ];

  return (
    <SectionWrap id="day-one" bg={SF}>
      <SectionHead
        center
        eyebrow="Operational Intelligence Starts on Day One"
        title="Every Carrier Has a Different Journey."
        desc="Regardless of where you are — brand-new MC or long-established carrier — Autonomatex begins preserving intelligence immediately. Recommendations improve as your own operational history grows."
      />
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 24, bottom: 24, left: 18, width: 2, background: 'rgba(13,148,136,0.15)' }} />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          {stages.map((stage, i) => (
            <motion.div key={stage.label} variants={staggerItem} style={{ position: 'relative', paddingLeft: 52, marginBottom: i < stages.length - 1 ? 36 : 0 }}>
              <div style={{
                position: 'absolute', left: 10, top: 8, width: 16, height: 16, borderRadius: '50%',
                background: i === stages.length - 1 ? A : SF,
                border: `2px solid ${A}`,
              }} />
              <p style={{ fontSize: 13, fontWeight: 700, color: A, marginBottom: 5, letterSpacing: '0.02em' }}>{stage.label}</p>
              <p style={{ fontSize: 14.5, color: S, lineHeight: 1.65 }}>{stage.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrap>
  );
}

// ── S8: Carrier Timeline ──────────────────────────────────────────────────────

function CarrierTimelineSection() {
  const milestones = [
    { label: 'New MC', desc: 'First loads. First decisions. Intelligence begins.', accent: false },
    { label: 'Growing Reputation', desc: 'Broker patterns emerge. Preferred lanes take shape.', accent: false },
    { label: 'Established Carrier', desc: 'Consistent rate performance. Operational history deepens.', accent: false },
    { label: 'Trusted Business', desc: 'Strong broker relationships. Reliable outcomes. Growing value.', accent: false },
    { label: 'Compounding Operational Intelligence', desc: 'Every day adds to a growing intelligence layer. The business becomes more valuable every month.', accent: true },
  ];

  return (
    <SectionWrap id="carrier-timeline" bg={D}>
      <SectionHead center eyebrow="The Carrier Journey" title={<span style={{ color: '#fff' }}>Your Business Gets Smarter Every Month.</span>} />
      <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 24, bottom: 24, left: 19, width: 2, background: 'rgba(13,148,136,0.25)' }} />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          {milestones.map((m, i) => (
            <motion.div key={m.label} variants={staggerItem} style={{ position: 'relative', paddingLeft: 56, marginBottom: i < milestones.length - 1 ? 40 : 0 }}>
              <div style={{
                position: 'absolute', left: 10, top: 6, width: 20, height: 20, borderRadius: '50%',
                background: m.accent ? A : 'rgba(13,148,136,0.18)',
                border: `2px solid ${A}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {m.accent && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: m.accent ? A : '#fff', marginBottom: 6 }}>{m.label}</p>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{m.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrap>
  );
}

// ── S9: Segments (5 cards) ────────────────────────────────────────────────────

function SegmentsSection() {
  const cards = [
    {
      title: 'New MC',
      challenge: 'No operational history. Building broker relationships from zero. Early decisions carry significant weight.',
      how: 'Autonomatex begins preserving intelligence from day one. Every early decision builds the foundation of your operation\'s long-term knowledge layer.',
    },
    {
      title: 'Owner Operator (1 truck)',
      challenge: 'Finding good loads, managing dispatcher relationships, building broker credibility while staying operationally lean.',
      how: 'Your truck learns which brokers pay, which lanes work, which loads are worth the call. Intelligence compounds quietly while you focus on driving.',
    },
    {
      title: 'Small Fleet (2–10 trucks)',
      challenge: 'Knowledge begins fragmenting across dispatchers. Different decisions for different trucks without a shared context.',
      how: 'One intelligence layer across all trucks. Every dispatcher works from the same operational knowledge — consistently, across your fleet.',
    },
    {
      title: 'Growing Fleet (10–100 trucks)',
      challenge: 'Operations become difficult to coordinate. Dispatcher turnover disrupts performance. Rate consistency breaks down.',
      how: 'Every truck contributes to a shared intelligence layer. Every dispatcher works from the same base. Rate consistency and onboarding speed improve significantly.',
    },
    {
      title: 'Enterprise Fleet (100+ trucks)',
      challenge: 'Data fragmentation across teams. Scaling without losing operational efficiency. Institutional knowledge at risk.',
      how: 'Fleet intelligence compounds continuously. The more trucks, the more powerful the intelligence layer becomes. Every decision strengthens the whole operation.',
    },
  ];

  return (
    <SectionWrap id="segments" bg={BG}>
      <SectionHead center eyebrow="Who It's For" title="One Product. Every Fleet Size." desc="Select your equipment and fleet size during onboarding. The intelligence layer adapts to your operation." />
      <motion.div
        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}
      >
        {cards.map(c => (
          <motion.div key={c.title} variants={staggerItem}>
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: 15.5, fontWeight: 700, color: P, marginBottom: 16 }}>{c.title}</p>
              <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${B}` }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: S, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>The Challenge</p>
                <p style={{ fontSize: 13.5, color: S, lineHeight: 1.6 }}>{c.challenge}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: A, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>How Autonomatex Helps</p>
                <p style={{ fontSize: 13.5, color: P, lineHeight: 1.6 }}>{c.how}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

// ── S10: Truck Value ──────────────────────────────────────────────────────────

function TruckValueSection() {
  return (
    <SectionWrap id="truck-value" bg={D}>
      <SectionHead center eyebrow="Truck Value" title={<span style={{ color: '#fff' }}>What Makes a Truck More Valuable?</span>} />
      <div className="atx-g2" style={{ gap: 48, maxWidth: 960, margin: '0 auto 48px', alignItems: 'center' }}>
        <FadeUp>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 32 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>The obvious assets</p>
            <ul style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15, lineHeight: 1.9, listStyle: 'none' }}>
              {['Truck and trailer', 'Equipment quality', 'Maintenance history', 'Engine condition'].map(i => (
                <li key={i}>· {i}</li>
              ))}
            </ul>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{ background: 'rgba(13,148,136,0.1)', border: `1px solid rgba(13,148,136,0.3)`, borderRadius: 12, padding: 40 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: A, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>The intelligence asset</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Operational Intelligence</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
              A truck with 12 months of organized lane history, broker intelligence, and outcome data is worth more than a truck without it. The intelligence is the differentiator.
            </p>
          </div>
        </FadeUp>
      </div>
    </SectionWrap>
  );
}

// ── S11: How It Works ─────────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    { n: '1', title: 'Evaluate', body: '42 loads scanned against your truck\'s operational history.' },
    { n: '2', title: 'Filter', body: '39 rejected. Doesn\'t fit your truck, your lanes, or your rates.' },
    { n: '3', title: 'Present', body: '3 worth calling. Ranked and ready.' },
    { n: '4', title: 'Decide', body: 'Human makes the final call. Always.' },
    { n: '5', title: 'Learn', body: 'Every outcome improves the next recommendation.' },
  ];

  return (
    <SectionWrap id="how-it-works" bg={SF}>
      <SectionHead center eyebrow="How It Works" title="Simple for You. Powerful Behind the Scenes." />
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
                fontWeight: 700, fontSize: 13, margin: '0 auto 14px',
              }}>{s.n}</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: P, marginBottom: 8 }}>{s.title}</p>
              <p style={{ fontSize: 13, color: S, lineHeight: 1.55 }}>{s.body}</p>
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
      <SectionHead center eyebrow="The Interface" title={<span style={{ color: '#fff' }}>Designed to Be Simple.</span>} />
      <FadeUp>
        <div style={{
          background: '#151c2a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
          padding: '64px 32px', maxWidth: 480, margin: '0 auto 40px', textAlign: 'center',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
        }}>
          <p style={{ fontSize: 52, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1 }}>42 Loads</p>
          <p style={{ fontSize: 17, color: 'rgba(240,68,56,0.85)', marginBottom: 24, fontWeight: 500 }}>39 Rejected</p>
          <p style={{ fontSize: 26, fontWeight: 600, color: A, marginBottom: 36 }}>3 Worth Calling</p>
          <button style={{
            background: A, color: '#fff', border: 'none', padding: '14px 40px',
            borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'default',
            boxShadow: `0 4px 16px rgba(13,148,136,0.35)`,
          }}>
            Call Broker
          </button>
        </div>
        <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          Behind this simple interface, the platform continuously learns. Complexity belongs to the platform. Simplicity belongs to you.
        </p>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S13: Behind the Scenes ────────────────────────────────────────────────────

function BehindTheScenesSection() {
  const items = [
    'Driver input', 'Dispatcher experience', 'Truck history', 'Market conditions',
    'Accepted loads', 'Rejected loads', 'Rate history', 'Broker relationships',
    'Operational outcomes', 'Customer preferences', 'AI reasoning', 'Lane patterns',
  ];

  return (
    <SectionWrap id="behind-scenes" bg={BG}>
      <SectionHead center eyebrow="Behind the Scenes" title="Quietly Improving Every Day." />
      <motion.div
        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, maxWidth: 800, margin: '0 auto 48px' }}
      >
        {items.map(item => (
          <motion.div key={item} variants={staggerItem}>
            <div style={{
              background: SF, border: `1px solid ${B}`, borderRadius: 8, padding: '11px 14px',
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

// ── S14: Trust ────────────────────────────────────────────────────────────────

function TrustSection() {
  const pillars = [
    { title: 'Human Remains in Control', body: 'Every booking decision is made by a human. Autonomatex never books a load automatically.' },
    { title: 'Decision Support Only', body: 'The platform surfaces the best options. Your dispatcher or you make the call. Always.' },
    { title: 'No Automatic Booking', body: 'No load is accepted on your behalf. The platform recommends. You decide.' },
    { title: 'Secure by Design', body: 'Your operational data belongs to your business. Built with long-term data security in mind.' },
    { title: 'Built for Long-Term Operations', body: 'Designed to grow with your business over years — not just optimize for the next load.' },
  ];

  return (
    <SectionWrap id="trust" bg={SF}>
      <SectionHead center eyebrow="Built on Trust" title="You Stay in Control. Always." />
      <motion.div
        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}
      >
        {pillars.map(p => (
          <motion.div key={p.title} variants={staggerItem}>
            <div style={{ padding: '24px 28px', borderRadius: 10, border: `1px solid ${B}`, background: BG }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: A, marginBottom: 14 }} />
              <p style={{ fontSize: 14.5, fontWeight: 700, color: P, marginBottom: 8 }}>{p.title}</p>
              <p style={{ fontSize: 13.5, color: S, lineHeight: 1.6 }}>{p.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

// ── S15: Pricing ──────────────────────────────────────────────────────────────

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
          <p style={{ fontSize: 15, color: S, lineHeight: 1.65, marginBottom: 32 }}>
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

// ── S16: FAQ ──────────────────────────────────────────────────────────────────

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
            <p style={{ fontSize: 15, color: S, lineHeight: 1.65, paddingBottom: 22 }}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    { q: 'Can I change dispatchers?', a: 'Yes. Autonomatex Carrier preserves your truck\'s operational intelligence regardless of who is dispatching. Your new dispatcher starts informed — not from scratch.' },
    { q: 'Will my truck lose its knowledge when I switch dispatch companies?', a: 'No. The intelligence belongs to your truck and your business. When you move to a new dispatch arrangement, your operational history moves with you.' },
    { q: 'Does my truck continue learning after a dispatcher change?', a: 'Yes. Every new decision, load outcome, and broker interaction continues building on existing intelligence. The learning never resets.' },
    { q: 'Can I use different dispatch companies simultaneously?', a: 'Yes. Autonomatex Carrier is designed to work alongside any dispatch arrangement.' },
    { q: 'What if I\'m a brand-new MC with no history?', a: 'Autonomatex begins building your operational intelligence from your very first load. Recommendations improve continuously as your own history grows.' },
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
      <SectionHead center eyebrow="Start Your Paid Pilot" title={<span style={{ color: '#fff' }}>Your Truck. Your Intelligence.</span>} desc="Complete the form below. We'll follow up by email. No calls required." descColor="rgba(255,255,255,0.6)" />
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
    <SectionWrap id="contact" bg={SF}>
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
      <WhyChooseSection />
      <CostOfStartingOverSection />
      <BigDifferentiatorSection />
      <TruckMemorySection />
      <IntelligenceDayOneSection />
      <CarrierTimelineSection />
      <SegmentsSection />
      <TruckValueSection />
      <HowItWorksSection />
      <TheProductSection />
      <BehindTheScenesSection />
      <TrustSection />
      <PricingSection />
      <FAQSection />
      <PilotFormSection />
      <ContactSection />
    </div>
  );
}
