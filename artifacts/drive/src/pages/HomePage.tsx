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

// ── Shared primitives ────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: A, marginBottom: 14 }}>{children}</div>;
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

function SectionHead({ eyebrow, title, desc, descColor, center }: { eyebrow: string; title: React.ReactNode; desc?: string; descColor?: string; center?: boolean }) {
  return (
    <FadeUp>
      <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 56 }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: desc ? 16 : 0, maxWidth: center ? 680 : 680, margin: center ? '0 auto' : undefined }}>{title}</h2>
        {desc && <p style={{ fontSize: 17, color: descColor ?? S, lineHeight: 1.7, maxWidth: 640, marginTop: 14, margin: center ? '14px auto 0' : '14px 0 0' }}>{desc}</p>}
      </div>
    </FadeUp>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 12, padding: '28px', boxShadow: '0 1px 3px rgba(16,24,40,0.06)', ...style }}>{children}</div>;
}

function DarkCard({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 28 }}>
      <p style={{ fontSize: 14.5, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{title}</p>
      <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{body}</p>
    </div>
  );
}

// ── S1: Hero ─────────────────────────────────────────────────────────────────
function HeroIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
      {/* Floating top card */}
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

      {/* Main panel SVG */}
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

          {/* Row 1 — Call #1 */}
          <rect x="14" y="76" width="476" height="60" rx="8" fill="rgba(13,148,136,0.13)"/>
          <rect x="14" y="76" width="3" height="60" rx="1.5" fill="#0D9488"/>
          <text x="28" y="100" fill="rgba(255,255,255,0.9)" fontSize="11.5" fontFamily="Inter,sans-serif" fontWeight="600">Dallas, TX → Chicago, IL</text>
          <text x="28" y="118" fill="rgba(255,255,255,0.4)" fontSize="10.5" fontFamily="Inter,sans-serif">925 mi · $2,350 · $2.54/mi · Midwest preferred</text>
          <rect x="408" y="88" width="70" height="22" rx="11" fill="rgba(18,183,106,0.2)"/>
          <text x="443" y="102.5" fill="#12B76A" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="700" textAnchor="middle">Call #1</text>

          {/* Row 2 — Call #2 */}
          <rect x="14" y="144" width="476" height="60" rx="8" fill="rgba(13,148,136,0.07)"/>
          <rect x="14" y="144" width="3" height="60" rx="1.5" fill="#0D9488" opacity="0.5"/>
          <text x="28" y="168" fill="rgba(255,255,255,0.8)" fontSize="11.5" fontFamily="Inter,sans-serif" fontWeight="600">Fort Worth, TX → St. Louis, MO</text>
          <text x="28" y="186" fill="rgba(255,255,255,0.4)" fontSize="10.5" fontFamily="Inter,sans-serif">640 mi · $1,650 · $2.57/mi · Strong RPM</text>
          <rect x="408" y="156" width="70" height="22" rx="11" fill="rgba(18,183,106,0.14)"/>
          <text x="443" y="170.5" fill="#12B76A" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="700" textAnchor="middle">Call #2</text>

          {/* Row 3 — Call #3 */}
          <rect x="14" y="212" width="476" height="60" rx="8" fill="rgba(13,148,136,0.04)"/>
          <rect x="14" y="212" width="3" height="60" rx="1.5" fill="#0D9488" opacity="0.28"/>
          <text x="28" y="236" fill="rgba(255,255,255,0.7)" fontSize="11.5" fontFamily="Inter,sans-serif" fontWeight="600">Dallas, TX → Kansas City, MO</text>
          <text x="28" y="254" fill="rgba(255,255,255,0.35)" fontSize="10.5" fontFamily="Inter,sans-serif">510 mi · $1,250 · $2.45/mi · Solid backup</text>
          <rect x="408" y="224" width="70" height="22" rx="11" fill="rgba(18,183,106,0.1)"/>
          <text x="443" y="238.5" fill="#12B76A" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="700" textAnchor="middle">Call #3</text>

          {/* Row 4 — Rejected */}
          <rect x="14" y="280" width="476" height="58" rx="8" fill="rgba(240,68,56,0.05)"/>
          <rect x="14" y="280" width="3" height="58" rx="1.5" fill="#F04438" opacity="0.4"/>
          <text x="28" y="304" fill="rgba(255,255,255,0.35)" fontSize="11.5" fontFamily="Inter,sans-serif" fontWeight="500">Dallas, TX → New York, NY</text>
          <text x="28" y="322" fill="rgba(255,255,255,0.22)" fontSize="10.5" fontFamily="Inter,sans-serif">No-go area on file · Below minimum RPM ($1.87/mi)</text>
          <rect x="404" y="291" width="78" height="22" rx="11" fill="rgba(240,68,56,0.14)"/>
          <text x="443" y="305.5" fill="#F04438" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="700" textAnchor="middle">Rejected</text>
        </svg>
      </motion.div>

      {/* Floating bottom card */}
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
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: A, background: 'rgba(13,148,136,0.08)', padding: '5px 12px', borderRadius: 20, marginBottom: 24, border: '1px solid rgba(13,148,136,0.18)' }}>
              For Owner Operators · Small Fleets · Growing Fleets
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
                <span style={{ display: 'inline-block', background: A, color: '#fff', borderRadius: 8, padding: '13px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: `0 4px 14px rgba(13,148,136,0.3)` }}>
                  Start Paid Pilot
                </span>
              </NavHref>
              <NavHref href="/#how-it-works">
                <span style={{ display: 'inline-block', background: SF, color: P, border: `1.5px solid ${B}`, borderRadius: 8, padding: '13px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                  See How It Works
                </span>
              </NavHref>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Owner Operators', 'Small Fleets', 'Growing Fleets', 'All Equipment Types', 'No Auto-Booking'].map(t => (
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

// ── S2: The Hidden Problem ───────────────────────────────────────────────────
function HiddenProblemSection() {
  const losses = [
    'Preferred brokers and rate patterns',
    'Preferred lanes and seasonal freight patterns',
    'Best-paying freight types for your equipment',
    'Negotiation outcomes and broker relationships',
    'Driver preferences and route patterns',
    'Customer preferences and delivery requirements',
    'Rate expectations and floor minimums',
    'Operational decisions that worked — and those that didn\'t'
  ];

  return (
    <SectionWrap id="hidden-problem" bg={SF}>
      <FadeUp>
        <Eyebrow>The Hidden Problem</Eyebrow>
        <div className="atx-g2-wide">
          <div>
            <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 18 }}>
              Your Truck Builds Knowledge. Almost None Of It Stays.
            </h2>
            <p style={{ fontSize: 16, color: S, lineHeight: 1.7, marginBottom: 24 }}>
              Every truck creates valuable operational intelligence — whether you realize it or not. Every load decision, broker interaction, lane result, and rate outcome adds to an invisible picture of what makes your truck profitable. The problem: almost none of it is captured.
            </p>
          </div>
          <div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', marginBottom: 24 }}>
              {losses.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: A, marginTop: 8, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: P, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
            <div style={{ background: D, borderRadius: 8, padding: 18 }}>
              <p style={{ fontSize: 14, color: '#fff', lineHeight: 1.6 }}>
                Unfortunately most of this knowledge lives inside people. When people change — your business starts over.
              </p>
            </div>
          </div>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S3: The Big Differentiator ───────────────────────────────────────────────
function BigDifferentiatorSection() {
  return (
    <SectionWrap id="big-differentiator" bg={BG}>
      <SectionHead center eyebrow="The Big Differentiator" title="Changing Dispatchers Should Never Mean Starting From Zero." />
      <FadeUp delay={0.1}>
        <p style={{ fontSize: 17, color: S, lineHeight: 1.7, maxWidth: 800, margin: '0 auto 48px', textAlign: 'center' }}>
          The operational intelligence belongs to your truck and your business — not to an individual dispatcher. Whether you change your dispatcher, switch dispatch companies, replace an internal employee, or hire a new operations manager, your truck keeps its intelligence. The new dispatcher starts informed, not from scratch.
        </p>
        <div className="atx-g2" style={{ gap: 24, maxWidth: 960, margin: '0 auto 48px' }}>
          <div style={{ background: D, borderRadius: 12, padding: 32 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Without Autonomatex Drive</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>
              When a dispatcher changes, you lose: preferred lanes, broker history, rate minimums, load rejection logic, truck operational patterns, negotiation context.
            </p>
          </div>
          <div style={{ background: 'rgba(13,148,136,0.05)', border: `1px solid rgba(13,148,136,0.2)`, borderRadius: 12, padding: 32 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: P, marginBottom: 16 }}>With Autonomatex Drive</p>
            <p style={{ fontSize: 14, color: S, lineHeight: 1.65 }}>
              New dispatcher immediately has: preferred lanes, operational history, business preferences, driver notes, previous successful strategies, market insights, historical outcomes, customer preferences, operational patterns.
            </p>
          </div>
        </div>
        <div style={{ background: D, borderRadius: 12, padding: '28px 36px', textAlign: 'center', border: `1px solid ${A}`, maxWidth: 640, margin: '0 auto' }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            Knowledge compounds. The truck never starts over.
          </p>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S4: Your Truck Learns ────────────────────────────────────────────────────
function TruckLearnsSection() {
  const steps = [
    { n: '01', title: 'Truck', body: 'Your dry van, reefer, flatbed, hotshot, or box truck. The asset that earns.' },
    { n: '02', title: 'Load', body: 'A load appears. 42 are evaluated. 39 are filtered. 3 are worth a call.' },
    { n: '03', title: 'Broker', body: 'The broker relationship is logged. Rate history. Reliability. Lane patterns.' },
    { n: '04', title: 'Dispatcher', body: 'Human judgment applies. Decision made. Relationship built.' },
    { n: '05', title: 'Decision', body: 'Accepted or rejected. The reason is captured. Not lost.' },
    { n: '06', title: 'Outcome', body: 'The load runs. Rate, route, driver notes, and delivery logged.' },
    { n: '07', title: 'Knowledge', body: 'Every outcome improves the model. Patterns emerge. Intelligence builds.' },
    { n: '08', title: 'Profitability', body: 'Your truck becomes more profitable — and more valuable — every month.' }
  ];

  return (
    <SectionWrap id="truck-learns" bg={SF}>
      <SectionHead center eyebrow="Your Truck Learns" title="Every Decision Becomes Part of Your Truck's Intelligence." />
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 20, bottom: 20, left: 16, width: 2, background: 'rgba(13,148,136,0.15)' }} />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          {steps.map((step, i) => (
            <motion.div key={step.n} variants={staggerItem} style={{ position: 'relative', paddingLeft: 48, marginBottom: i === steps.length - 1 ? 0 : 32 }}>
              <div style={{ position: 'absolute', left: 12, top: 6, width: 10, height: 10, borderRadius: '50%', background: A }} />
              <p style={{ fontSize: 12, fontWeight: 700, color: A, marginBottom: 4 }}>{step.n} · {step.title}</p>
              <p style={{ fontSize: 15, color: S, lineHeight: 1.6 }}>{step.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrap>
  );
}

// ── S5–8: Segments ───────────────────────────────────────────────────────────
function SegmentsSection() {
  const cards = [
    { title: 'Owner Operator (1 truck)', body: 'Reduces operational stress. Your truck learns which brokers call back, which lanes pay, which loads are worth the time. Even as a solo operator, your intelligence compounds.', pain: 'Finding good loads, Changing dispatchers, Building broker relationships, Growing income' },
    { title: 'Small Fleet (2–10 trucks)', body: 'Autonomatex keeps operational intelligence together across your fleet — one knowledge layer, multiple trucks. Different dispatchers handle different trucks, but they work from the same knowledge.', pain: 'Knowledge begins fragmenting, Different decisions without context' },
    { title: 'Growing Fleet (10–100 trucks)', body: 'Autonomatex creates one intelligence layer across the fleet — every truck contributes, every dispatcher works from the same knowledge base. Rate consistency improves.', pain: 'Operations become difficult to manage, Dispatcher coordination breaks down' },
    { title: 'Enterprise Fleet (100+ trucks)', body: 'Every truck contributes. Every dispatcher contributes. Every driver contributes. Every decision improves the business. Fleet intelligence compounds continuously. The more trucks, the more powerful the intelligence layer becomes.', pain: 'Scaling without losing efficiency, Data fragmentation across teams' }
  ];

  return (
    <SectionWrap id="segments" bg={BG}>
      <SectionHead center eyebrow="Who It's For" title="One Product. Every Fleet Size." desc="Select your equipment during onboarding. No separate plans per segment." />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {cards.map(c => (
          <motion.div key={c.title} variants={staggerItem}>
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: P, marginBottom: 12 }}>{c.title}</p>
              <p style={{ fontSize: 12, color: S, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${B}` }}><strong>Pain points:</strong> {c.pain}</p>
              <p style={{ fontSize: 14, color: S, lineHeight: 1.65 }}>{c.body}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

// ── S9: Truck Value ──────────────────────────────────────────────────────────
function TruckValueSection() {
  return (
    <SectionWrap id="truck-value" bg={D}>
      <SectionHead center eyebrow="Truck Value" title={<span style={{color: '#fff'}}>What Makes a Truck More Valuable?</span>} />
      <div className="atx-g2" style={{ gap: 48, maxWidth: 960, margin: '0 auto 48px', alignItems: 'center' }}>
        <FadeUp>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 32 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>The obvious assets</p>
            <ul style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.8, listStyle: 'none' }}>
              <li>• Truck itself</li>
              <li>• Trailer and equipment</li>
              <li>• Engine quality</li>
              <li>• Maintenance history</li>
              <li>• Equipment age</li>
            </ul>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{ background: 'rgba(13,148,136,0.1)', border: `1px solid rgba(13,148,136,0.3)`, borderRadius: 12, padding: 40 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: A, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>The intelligence asset</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>Operational Intelligence</p>
          </div>
        </FadeUp>
      </div>
      <FadeUp delay={0.2}>
        <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 16 }}>
            The more history your truck builds with Autonomatex, the more valuable it becomes — not just as a vehicle, but as an operational asset.
          </p>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            A truck with 12 months of organized lane history, broker intelligence, and outcome data is worth more than a truck without it. The intelligence is the differentiator.
          </p>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S10: Operational Resilience ──────────────────────────────────────────────
function OperationalResilienceSection() {
  const cards = [
    'Driver changes', 'Dispatcher changes', 'Dispatch company changes', 'Fleet manager changes'
  ];

  return (
    <SectionWrap id="resilience" bg={SF}>
      <SectionHead center eyebrow="Operational Resilience" title="No Matter Who You Work With." />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 48, maxWidth: 1000, margin: '0 auto 48px' }}>
        {cards.map(c => (
          <motion.div key={c} variants={staggerItem}>
            <div style={{ border: `1px solid ${B}`, borderRadius: 8, padding: 20, textAlign: 'center', background: BG }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: P, marginBottom: 8 }}>{c}</p>
              <p style={{ fontSize: 12, color: S }}>Nothing important is lost</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <FadeUp>
        <div style={{ background: A, borderRadius: 12, padding: '24px 32px', textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Your truck remembers.</p>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S11: How It Works ────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { n: '1', title: 'Morning', body: 'Autonomatex analyzes opportunities' },
    { n: '2', title: 'Filter', body: 'Ranks loads based on rules' },
    { n: '3', title: 'Present', body: 'Shows 3 worth calling' },
    { n: '4', title: 'Decide', body: 'Human makes the final call' },
    { n: '5', title: 'Learn', body: 'Truck logs the outcome' },
  ];

  return (
    <SectionWrap id="how-it-works" bg={BG}>
      <SectionHead center eyebrow="How It Works" title="Simple for the Truck Owner. Powerful Behind the Scenes." />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        {steps.map(s => (
          <motion.div key={s.n} variants={staggerItem} style={{ flex: '1 1 180px', maxWidth: 220 }}>
            <Card style={{ textAlign: 'center', height: '100%', padding: '24px 16px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(13,148,136,0.1)', color: A, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, margin: '0 auto 12px' }}>{s.n}</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: P, marginBottom: 6 }}>{s.title}</p>
              <p style={{ fontSize: 13, color: S, lineHeight: 1.5 }}>{s.body}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

// ── S12: The Product ─────────────────────────────────────────────────────────
function TheProductSection() {
  return (
    <SectionWrap id="the-product" bg={D}>
      <SectionHead center eyebrow="The Interface" title={<span style={{color: '#fff'}}>Designed to Be Simple.</span>} />
      <FadeUp>
        <div style={{ background: '#151c2a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '64px 32px', maxWidth: 500, margin: '0 auto 40px', textAlign: 'center', boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }}>
          <p style={{ fontSize: 48, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1 }}>42 Loads</p>
          <p style={{ fontSize: 16, color: 'rgba(240,68,56,0.8)', marginBottom: 24 }}>39 Rejected</p>
          <p style={{ fontSize: 24, fontWeight: 600, color: A, marginBottom: 32 }}>3 Worth Calling</p>
          <button style={{ background: A, color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'default' }}>Call Broker</button>
        </div>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          Behind this simple interface, the platform continuously learns. The intelligence stays invisible. The outcome is simple: your truck gets better every month.
        </p>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S13: Behind the Scenes ───────────────────────────────────────────────────
function BehindTheScenesSection() {
  const items = [
    'Driver input', 'Dispatcher experience', 'Truck history', 'Market conditions',
    'Accepted loads', 'Rejected loads', 'Rate history', 'Broker relationships',
    'Operational outcomes', 'Customer preferences', 'AI reasoning', 'Lane patterns'
  ];

  return (
    <SectionWrap id="behind-scenes" bg={SF}>
      <SectionHead center eyebrow="Behind the Scenes" title="Quietly Improving Every Day." />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, maxWidth: 800, margin: '0 auto 48px' }}>
        {items.map(item => (
          <motion.div key={item} variants={staggerItem}>
            <div style={{ background: BG, border: `1px solid ${B}`, borderRadius: 8, padding: '12px 16px', textAlign: 'center', fontSize: 13, fontWeight: 500, color: P }}>
              {item}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <FadeUp>
        <p style={{ fontSize: 18, color: S, textAlign: 'center', fontWeight: 500 }}>
          Every day, your truck gets a little smarter. Every month, the intelligence compounds.
        </p>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S14: Pricing ─────────────────────────────────────────────────────────────
function PricingSection() {
  return (
    <SectionWrap id="pricing" bg={BG}>
      <SectionHead center eyebrow="Pricing" title="Start Simple. Scale When Ready." />
      <FadeUp>
        <div style={{ background: SF, border: `1px solid ${B}`, borderTop: `4px solid ${A}`, borderRadius: 12, padding: 48, maxWidth: 500, margin: '0 auto', textAlign: 'center', boxShadow: '0 12px 24px rgba(16,24,40,0.04)' }}>
          <p style={{ fontSize: 24, fontWeight: 700, color: P, marginBottom: 16 }}>Paid Pilot</p>
          <p style={{ fontSize: 15, color: S, lineHeight: 1.6, marginBottom: 32 }}>
            Test Autonomatex Drive with your truck before committing. Start with a paid pilot, complete onboarding, use the platform for real loads, and upgrade when ready.
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

// ── S15: FAQ ─────────────────────────────────────────────────────────────────
function FAQSection() {
  const faqs = [
    { q: 'Can I change dispatchers?', a: 'Yes. Autonomatex Drive preserves your truck\'s operational intelligence regardless of who is dispatching. Your new dispatcher starts informed — not from scratch.' },
    { q: 'Will my truck lose its knowledge when I switch dispatch companies?', a: 'No. The intelligence belongs to your truck and your business, not to the dispatch company. When you move to a new dispatch arrangement, your operational history, lane preferences, broker relationships, and decision logic move with you.' },
    { q: 'Does my truck continue learning after a dispatcher change?', a: 'Yes. Every new decision, load outcome, and broker interaction continues to build on the existing intelligence. The learning never resets.' },
    { q: 'Can I use different dispatch companies simultaneously?', a: 'Yes. Autonomatex Drive is designed to work alongside any dispatch arrangement.' },
    { q: 'Can multiple trucks in my fleet build intelligence independently?', a: 'Yes. Each truck builds its own intelligence profile. At the fleet level, patterns across all trucks contribute to a shared knowledge layer.' },
    { q: 'What equipment types are supported?', a: 'Dry Van, Reefer, Flatbed, Hotshot, and Box Truck. You select your equipment types during onboarding.' },
    { q: 'Is this another dispatch software or TMS?', a: 'No. Autonomatex Drive is an operational intelligence layer. It works alongside your dispatch arrangement — not instead of it. Your dispatcher stays in control of every decision.' }
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

function FAQItem({ question, answer, isLast }: { question: string; answer: string; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: isLast ? 'none' : `1px solid ${B}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', padding: '24px 0', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, color: P }}>{question}</span>
        {open ? <ChevronUp size={20} color={S} /> : <ChevronDown size={20} color={S} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 15, color: S, lineHeight: 1.6, paddingBottom: 24 }}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Paid Pilot Form ──────────────────────────────────────────────────────────
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
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <SectionWrap id="paid-pilot" bg={D}>
      <SectionHead center eyebrow="Start Your Paid Pilot" title={<span style={{color: '#fff'}}>Your Truck. Your Intelligence.</span>} desc="Complete the form below. We'll follow up by email. No calls required." descColor="rgba(255,255,255,0.6)" />
      <FadeUp>
        <Card style={{ maxWidth: 600, margin: '0 auto', background: SF }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(13,148,136,0.1)', color: A, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>✓</div>
              <p style={{ fontSize: 18, fontWeight: 600, color: P, marginBottom: 8 }}>Request Received</p>
              <p style={{ fontSize: 15, color: S }}>We'll be in touch via email shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <input type="hidden" name="form-name" value="autonomatex-drive-pilot" />
              
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
                <textarea name="message" rows={4} placeholder="Tell us about your operation — current setup, main pain points, what you'd like to test." style={{ width: '100%', padding: '10px 12px', border: `1px solid ${B}`, borderRadius: 6, fontSize: 14, resize: 'vertical' }} />
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

// ── Contact Form ─────────────────────────────────────────────────────────────
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
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <SectionWrap id="contact" bg={SF}>
      <SectionHead center eyebrow="Contact" title="Get in Touch." desc="No demos. No sales pressure. Just email." />
      <FadeUp>
        <Card style={{ maxWidth: 600, margin: '0 auto' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(13,148,136,0.1)', color: A, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>✓</div>
              <p style={{ fontSize: 18, fontWeight: 600, color: P, marginBottom: 8 }}>Message Sent</p>
              <p style={{ fontSize: 15, color: S }}>We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <input type="hidden" name="form-name" value="autonomatex-drive-contact" />
              
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
                  <option value="2-5 trucks">2-5 trucks</option>
                  <option value="6-10 trucks">6-10 trucks</option>
                  <option value="11-50 trucks">11-50 trucks</option>
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

// ── Main Page Component ──────────────────────────────────────────────────────
export function HomePage() {
  return (
    <div style={{ overflow: 'hidden' }}>
      <HeroSection />
      <HiddenProblemSection />
      <BigDifferentiatorSection />
      <TruckLearnsSection />
      <SegmentsSection />
      <TruckValueSection />
      <OperationalResilienceSection />
      <HowItWorksSection />
      <TheProductSection />
      <BehindTheScenesSection />
      <PricingSection />
      <FAQSection />
      <PilotFormSection />
      <ContactSection />
    </div>
  );
}