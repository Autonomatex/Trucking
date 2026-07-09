import { useState, useRef, FormEvent } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { NavHref } from '@/components/NavHref';
import { FadeUp, staggerContainer, staggerItem } from '@/components/FadeUp';
import { getPaymentUrl, isPlaceholder, PAYMENT_LINKS } from '@/config/stripe';
import { ChevronDown, ChevronUp } from 'lucide-react';

// ── Design tokens ────────────────────────────────────────────────────────────
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

function SectionHead({ eyebrow, title, desc, center }: { eyebrow: string; title: string; desc?: string; center?: boolean }) {
  return (
    <FadeUp>
      <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 56 }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: desc ? 16 : 0, maxWidth: center ? 680 : 680, margin: center ? '0 auto' : undefined }}>{title}</h2>
        {desc && <p style={{ fontSize: 17, color: S, lineHeight: 1.7, maxWidth: 640, marginTop: 14, margin: center ? '14px auto 0' : '14px 0 0' }}>{desc}</p>}
      </div>
    </FadeUp>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 12, padding: '28px 28px 28px', boxShadow: '0 1px 3px rgba(16,24,40,0.06)', ...style }}>{children}</div>;
}

function DarkCard({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 28 }}>
      <p style={{ fontSize: 14.5, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{title}</p>
      <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{body}</p>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }} aria-hidden>
      <div style={{ width: 1, height: 24, background: B }} />
      <svg width="40" height="10" viewBox="0 0 40 10" fill="none" style={{ margin: '0 8px' }}>
        <circle cx="5" cy="5" r="2" fill={B} />
        <circle cx="20" cy="5" r="2.5" fill={A} opacity="0.4" />
        <circle cx="35" cy="5" r="2" fill={B} />
        <line x1="7" y1="5" x2="17.5" y2="5" stroke={B} strokeWidth="0.8" />
        <line x1="22.5" y1="5" x2="33" y2="5" stroke={B} strokeWidth="0.8" />
      </svg>
      <div style={{ width: 1, height: 24, background: B }} />
    </div>
  );
}

// ── Hero illustration ────────────────────────────────────────────────────────
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
          {/* Panel bg */}
          <rect width="504" height="348" fill="#1a2236"/>
          {/* Header bar */}
          <rect width="504" height="46" fill="#2a3550"/>
          {/* Traffic dots */}
          <circle cx="20" cy="23" r="5" fill="#F04438" opacity="0.7"/>
          <circle cx="36" cy="23" r="5" fill="#F79009" opacity="0.7"/>
          <circle cx="52" cy="23" r="5" fill="#12B76A" opacity="0.7"/>
          {/* Console title */}
          <text x="70" y="27" fill="rgba(255,255,255,0.7)" fontSize="11.5" fontFamily="Inter,sans-serif" fontWeight="500">Dispatch Console · Truck 12 · Dallas, TX</text>
          {/* Divider */}
          <line x1="0" y1="46" x2="504" y2="46" stroke="rgba(255,255,255,0.06)"/>
          {/* Sub label */}
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
        <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)' }}>Ranked for one dry van truck</p>
      </motion.div>
    </div>
  );
}

// ── S1: Hero ─────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{ background: BG, padding: '80px 24px 96px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        {/* Left */}
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: A, background: 'rgba(13,148,136,0.08)', padding: '5px 12px', borderRadius: 20, marginBottom: 24, border: '1px solid rgba(13,148,136,0.18)' }}>
              For dry van dispatch companies only
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.75, ease: EASE }}
            style={{ fontSize: 'clamp(30px,3.8vw,50px)', fontWeight: 700, color: P, letterSpacing: '-0.03em', lineHeight: 1.16, marginBottom: 24 }}
          >
            Autonomatex AI for Dry Van Dispatch Companies
          </motion.h1>

          {/* Quote card */}
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
            Turn every dispatch decision into a permanent business asset. Your dispatcher stays in control. Autonomatex becomes the operational intelligence behind every smarter dispatch decision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.65, ease: EASE }}
          >
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
              <NavHref href="/#paid-pilot">
                <span style={{ display: 'inline-block', background: A, color: '#fff', borderRadius: 8, padding: '13px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: `0 4px 14px rgba(13,148,136,0.3)` }}>
                  Start 7-Day Paid Pilot
                </span>
              </NavHref>
              <NavHref href="/workflow">
                <span style={{ display: 'inline-block', background: SF, color: P, border: `1.5px solid ${B}`, borderRadius: 8, padding: '13px 28px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                  See Self-Guided Workflow
                </span>
              </NavHref>
            </div>

            {/* Trust pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['No live call required','Email support only','Dry van dispatch only','No auto-booking','Authorized data only'].map(t => (
                <span key={t} style={{ fontSize: 11.5, color: S, background: '#F0F4F8', padding: '4px 10px', borderRadius: 20, border: `1px solid ${B}` }}>{t}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — illustration */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

// ── S2: Quick Summary ────────────────────────────────────────────────────────
function QuickSummarySection() {
  return (
    <SectionWrap id="quick-summary" bg={SF} style={{ borderTop: `1px solid ${B}`, borderBottom: `1px solid ${B}` }}>
      <FadeUp>
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow>Quick Summary</Eyebrow>
          <h2 style={{ fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.25, marginBottom: 24 }}>
            AI-Powered Dispatch Intelligence for Dry Van Teams
          </h2>
          <p style={{ fontSize: 16, color: S, lineHeight: 1.75, marginBottom: 18 }}>
            Autonomatex is built for dry van dispatch companies that want to handle more trucks, protect senior dispatcher knowledge, reduce daily decision pressure, and create a more professional dispatch operation — without relying only on memory, calls, and scattered notes.
          </p>
          <p style={{ fontSize: 16, color: S, lineHeight: 1.75, marginBottom: 18 }}>
            It acts as an operational intelligence layer for your dispatch business. Every truck becomes easier to dispatch over time. Your broker relationships become permanent company assets. Weak decisions become permanent lessons. Every successful load improves tomorrow's decisions.
          </p>
          <p style={{ fontSize: 16, color: S, lineHeight: 1.75, marginBottom: 18 }}>
            Instead of replacing dispatchers, Autonomatex becomes their right hand. It helps experienced dispatchers make faster, calmer decisions — and helps junior dispatchers learn from company knowledge instead of starting from scratch.
          </p>
          <p style={{ fontSize: 16, color: S, lineHeight: 1.75, marginBottom: 32 }}>
            Start with a paid pilot, complete the onboarding form, test the workflow, ask questions through email support, and upgrade when ready.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            {['Company-Owned Intelligence','AI Decision Layer','Operational Memory','Decision Support Only'].map(t => (
              <span key={t} style={{ fontSize: 12, fontWeight: 600, color: A, background: 'rgba(13,148,136,0.08)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(13,148,136,0.18)' }}>{t}</span>
            ))}
          </div>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S3: Why Dispatch Companies Stop Growing (NEW) ────────────────────────────
function WhyStopGrowingSection() {
  const problems = [
    { n: '01', title: 'Knowledge stays inside people', body: 'Your best dispatcher carries broker history, lane judgment, truck preferences, and years of decision logic in their head — and only in their head.' },
    { n: '02', title: 'Training repeats endlessly', body: 'New team members start from zero. Senior dispatcher knowledge does not transfer cleanly. Every new hire is a reset.' },
    { n: '03', title: 'Growth slows as complexity rises', body: 'Adding trucks means adding pressure. Without organized intelligence behind each truck, more clients create more chaos instead of more revenue.' },
    { n: '04', title: 'Owners become the bottleneck', body: 'When the owner is the only one who knows which brokers are reliable, which lanes work, and which loads to avoid — growth stalls.' },
    { n: '05', title: 'Dispatcher pressure increases', body: 'Without decision support, experienced dispatchers carry an unsustainable load. Good dispatchers burn out or leave.' },
    { n: '06', title: 'Operational intelligence disappears', body: 'Every week of dispatch work creates valuable knowledge. Without a system to capture it, that knowledge evaporates — not into data, but into thin air.' },
  ];

  return (
    <SectionWrap id="why-stop-growing">
      <SectionHead eyebrow="Why dispatch companies stop growing" title="The knowledge problem behind every dispatch company that stops scaling." desc="Most dispatch companies do not stop growing because of a market problem. They stop growing because of a knowledge problem." />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
        {problems.map(p => (
          <motion.div key={p.n} variants={staggerItem}>
            <Card>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: A, marginBottom: 10, letterSpacing: '0.04em' }}>{p.n}</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: P, marginBottom: 8, lineHeight: 1.4 }}>{p.title}</p>
              <p style={{ fontSize: 13.5, color: S, lineHeight: 1.65 }}>{p.body}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <FadeUp>
        <div style={{ background: D, borderRadius: 12, padding: '28px 36px', textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            Autonomatex solves this by turning every dispatch decision into company intelligence that stays — and compounds.
          </p>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S4: The Cost of Doing Nothing (NEW) ─────────────────────────────────────
function CostOfNothingSection() {
  const left = [
    'Senior dispatcher knowledge stays trapped in one person\'s head.',
    'New trucks start from zero every time — no company history to draw from.',
    'Junior dispatchers guess instead of learning from proven decisions.',
    'When a senior dispatcher leaves, years of intelligence disappear overnight.',
    'Owners spend time answering dispatch questions instead of building the business.',
    'The business becomes harder to scale — not because of the market, but because of the operation.',
  ];
  const right = [
    'Every truck your company works with becomes easier to dispatch over time.',
    'New trucks inherit company history — lane patterns, broker intelligence, load outcomes.',
    'Junior dispatchers learn from organized company knowledge instead of starting from scratch.',
    'When a dispatcher transitions, the company intelligence stays inside the business.',
    'Owners can step back knowing the operation has a knowledge layer behind it.',
    'The business becomes more valuable every month — because every decision compounds.',
  ];

  return (
    <SectionWrap id="cost-of-nothing" bg={SF} style={{ borderTop: `1px solid ${B}` }}>
      <SectionHead center eyebrow="The cost of doing nothing" title="Every week without operational intelligence is a week of compounding cost." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <FadeUp>
          <div style={{ background: 'rgba(240,68,56,0.04)', border: '1px solid rgba(240,68,56,0.15)', borderRadius: 12, padding: 28, height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(240,68,56,0.1)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F04438' }} />
              <p style={{ fontSize: 14, fontWeight: 700, color: P }}>Without operational intelligence</p>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none' }}>
              {left.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, color: '#F04438', marginTop: 2, flexShrink: 0 }}>✗</span>
                  <span style={{ fontSize: 13.5, color: S, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{ background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.18)', borderRadius: 12, padding: 28, height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(13,148,136,0.1)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: A }} />
              <p style={{ fontSize: 14, fontWeight: 700, color: P }}>With Autonomatex</p>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none' }}>
              {right.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, color: A, marginTop: 2, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13.5, color: S, lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>
      </div>
    </SectionWrap>
  );
}

// ── S5: Dispatcher Side ───────────────────────────────────────────────────────
function DispatcherSideSection() {
  const cards = [
    { title: 'Less mental load', body: 'Truck preferences, no-go areas, minimum RPM, broker notes, lane history, and past decisions stay organized — not scattered across memory and notes.' },
    { title: 'Better driver relationships', body: 'When weak loads are filtered faster, dispatchers spend more time with drivers, carrier clients, brokers, and team members.' },
    { title: 'Calmer senior dispatchers', body: 'Senior dispatchers make stronger decisions when current market data, stored company history, and decision support reinforce their judgment.' },
    { title: 'Faster team training', body: 'New team members learn from stored rejection reasons, broker history, lane performance, and outcome logs instead of guessing from scratch.' },
    { title: 'More trucks with control', body: 'A cleaner decision workflow helps a dispatch team support more dry van trucks without losing visibility or professionalism.' },
    { title: 'Better work rhythm', body: 'Less chaos, fewer repeated checks, clearer priorities, and less dependence on scattered notes help create a smoother daily operation.' },
  ];

  return (
    <SectionWrap id="dispatcher-side">
      <SectionHead eyebrow="Dispatcher side" title="Give your dispatcher more time to think, lead, and build relationships." desc="Autonomatex reduces the burden of remembering every small truck detail manually, so your dispatcher can focus on higher-value work." />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 32 }}>
        {cards.map(c => (
          <motion.div key={c.title} variants={staggerItem}>
            <Card style={{ borderTop: `3px solid ${A}` }}>
              <p style={{ fontSize: 14.5, fontWeight: 700, color: P, marginBottom: 8 }}>{c.title}</p>
              <p style={{ fontSize: 13.5, color: S, lineHeight: 1.65 }}>{c.body}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <FadeUp>
        <div style={{ background: '#F0F9F8', border: `1px solid rgba(13,148,136,0.2)`, borderRadius: 12, padding: '24px 28px' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: P, marginBottom: 6 }}>Human-in-the-loop dispatch for modern freight teams.</p>
          <p style={{ fontSize: 14, color: S, lineHeight: 1.65 }}>Autonomatex handles ranking, memory, rejection logic, and decision support. Your dispatch team handles relationships, negotiation, final judgment, and control.</p>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S6: Owner Side ────────────────────────────────────────────────────────────
function OwnerSideSection() {
  const items = [
    { n: '01', title: 'Retain senior knowledge', body: 'Your company becomes less dependent on one person\'s memory. Key dispatch knowledge stays inside the business, not inside one dispatcher\'s head.' },
    { n: '02', title: 'Win larger accounts with confidence', body: 'A professional AI-backed workflow gives your company a stronger operational story when handling more dry van trucks or larger carrier clients.' },
    { n: '03', title: 'Build a stronger operating base', body: 'The more your team uses Autonomatex, the more your dispatch intelligence, rejection logic, and outcome knowledge improve — making the business more valuable every month.' },
  ];

  return (
    <SectionWrap id="owner-side" bg={SF} style={{ borderTop: `1px solid ${B}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
        <FadeUp>
          <Eyebrow>Dispatch company owner side</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 18 }}>
            Turn Dry Van Dispatch Knowledge Into Company Intelligence.
          </h2>
          <p style={{ fontSize: 16, color: S, lineHeight: 1.7 }}>
            Every accepted load, rejected load, broker note, lane pattern, and final outcome can become part of your company's private dispatch knowledge base — not disappear when a dispatcher goes home.
          </p>
        </FadeUp>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {items.map((item, i) => (
            <FadeUp key={item.n} delay={i * 0.08}>
              <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: A, flexShrink: 0, paddingTop: 2, letterSpacing: '0.04em' }}>{item.n}</div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: P, marginBottom: 6 }}>{item.title}</p>
                  <p style={{ fontSize: 13.5, color: S, lineHeight: 1.65 }}>{item.body}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

// ── S7: Your Dispatch Company Should Become Smarter Every Day (NEW) ──────────
function SmarterEveryDaySection() {
  const flow = ['Every truck','Every load','Every broker','Every rejection','Every booked outcome','Every month'];

  return (
    <SectionWrap id="smarter-every-day" bg={D}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <FadeUp>
          <Eyebrow>The compounding effect</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px,3.2vw,40px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 20 }}>
            Your Dispatch Company Should Become Smarter Every Day.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 52 }}>
            Every decision your team makes should increase the long-term value of the business. Not disappear. With Autonomatex, every interaction builds the intelligence layer behind your dispatch operation.
          </p>
        </FadeUp>

        {/* Vertical flow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          {flow.map((label, i) => (
            <FadeUp key={label} delay={i * 0.07}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 600,
                  color: '#fff', minWidth: 220, textAlign: 'center',
                }}>
                  {label}
                </div>
                {i < flow.length - 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4px 0' }}>
                    <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.15)' }} />
                    <div style={{ fontSize: 14, color: A }}>↓</div>
                  </div>
                )}
              </div>
            </FadeUp>
          ))}
          <FadeUp delay={0.55}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
              <div style={{ width: 1, height: 16, background: A }} />
              <div style={{ background: A, borderRadius: 10, padding: '16px 32px', fontSize: 16, fontWeight: 700, color: '#fff', minWidth: 260, textAlign: 'center', boxShadow: `0 4px 24px rgba(13,148,136,0.35)` }}>
                Your dispatch company becomes smarter.
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </SectionWrap>
  );
}

// ── S8: New Truck Onboarding ──────────────────────────────────────────────────
function NewTruckOnboardingSection() {
  const cards = [
    { title: 'Professional first impression', body: 'New dry van clients often test a dispatch company for a few days. Autonomatex helps your team show structure, memory, and professionalism from day one.' },
    { title: 'New truck profile from day one', body: 'Home base, preferred lanes, no-go areas, minimum RPM, deadhead limits, driver preferences, broker notes, and load history are organized in one place.' },
    { title: 'First 72-hour plan', body: 'Autonomatex helps your team build a clear first 72-hour dispatch plan so the new truck does not feel randomly managed.' },
    { title: 'Less guessing for dispatchers', body: 'Your dispatcher does not start from zero every time a new truck comes in. Company history and load-ranking logic come forward faster.' },
    { title: 'Better team handoff', body: 'If one dispatcher is busy, another team member can understand the truck quickly because the operating memory stays inside the system — not in one person.' },
    { title: 'Retention risk protection', body: 'Autonomatex helps reduce early confusion, repeated mistakes, weak communication, and poor-fit load decisions that make new dry van clients leave too soon.' },
  ];

  return (
    <SectionWrap id="new-truck-onboarding" bg={SF} style={{ borderTop: `1px solid ${B}` }}>
      <SectionHead eyebrow="New truck onboarding" title="Keep New Dry Van Trucks From Slipping Away." desc="For many dispatch companies, the hardest part is not only finding loads. It is keeping new dry van trucks long enough to prove value." />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 32 }}>
        {cards.map(c => (
          <motion.div key={c.title} variants={staggerItem}>
            <Card>
              <p style={{ fontSize: 14.5, fontWeight: 700, color: P, marginBottom: 8 }}>{c.title}</p>
              <p style={{ fontSize: 13.5, color: S, lineHeight: 1.65 }}>{c.body}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <FadeUp>
        <div style={{ background: '#F0F9F8', border: `1px solid rgba(13,148,136,0.2)`, borderRadius: 12, padding: '24px 28px' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: P, marginBottom: 6 }}>Turn new truck onboarding into a repeatable system — not a stressful guessing game.</p>
          <p style={{ fontSize: 14, color: S, lineHeight: 1.65 }}>The result is a more professional experience for truck owners, less pressure on dispatchers, faster team handoff, and stronger long-term business value.</p>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S9: Existing Client Retention ─────────────────────────────────────────────
function ClientRetentionSection() {
  const cards = [
    { title: 'Remember what worked', body: 'Lane performance, broker behavior, accepted rates, and repeatable patterns become part of the company memory that improves every future decision.' },
    { title: 'Remember what failed', body: 'Rejected loads, weak lanes, bad timing, poor broker behavior, and wrong-fit choices are not forgotten. Weak decisions become permanent lessons.' },
    { title: 'Improve client confidence', body: 'Existing clients do not feel handled randomly. They feel the dispatch company is learning their business and improving over time.' },
    { title: 'Support long-term retention', body: 'Autonomatex helps improve trust, reduce repeated mistakes, make communication smoother, and create a more professional client experience.' },
  ];

  return (
    <section id="client-retention" style={{ background: D }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <FadeUp>
            <Eyebrow>Existing client retention</Eyebrow>
            <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 18 }}>
              Old clients should feel remembered, understood, and professionally managed.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 24 }}>
              Every week your dispatch company works with a dry van truck, valuable knowledge is created. The longer the relationship continues, the stronger the intelligence becomes.
            </p>
            <NavHref href="/#paid-pilot">
              <span style={{ display: 'inline-block', fontSize: 14, fontWeight: 600, color: A, cursor: 'pointer' }}>
                Start paid pilot access →
              </span>
            </NavHref>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {cards.map((c, i) => (
              <FadeUp key={c.title} delay={i * 0.07}>
                <DarkCard title={c.title} body={c.body} />
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── S10: Client Lifecycle ─────────────────────────────────────────────────────
function ClientLifecycleSection() {
  const steps = [
    { n: 1, label: 'Welcome call', desc: 'Your dispatcher captures home base, preferred lanes, no-go areas, minimum RPM, deadhead limits, home-time needs, broker restrictions, and first-week expectations.' },
    { n: 2, label: 'Truck profile', desc: 'Autonomatex turns the welcome-call details into a working truck profile, so the truck\'s requirements are organized before load decisions begin.' },
    { n: 3, label: 'First 72 hours', desc: 'The system helps create a focused first-week dispatch plan using truck preferences, market data, lane intelligence, and senior dispatcher experience.' },
    { n: 4, label: 'Daily load decisions', desc: 'Autonomatex ranks the loads worth calling first, explains weak loads, and helps the dispatcher make faster decisions with less pressure.' },
    { n: 5, label: 'Communication and trust', desc: 'Your team gets clearer reasons behind each decision, helping dispatchers communicate more professionally with drivers, truck owners, and fleet clients.' },
    { n: 6, label: 'Retention of existing clients', desc: 'Autonomatex keeps building intelligence around every truck, broker, lane, rejection, and booked outcome. The longer a client stays, the more valuable their dispatch history becomes.' },
    { n: 7, label: 'Team handoff and growth', desc: 'If one dispatcher is unavailable, another team member can understand the truck faster because the company intelligence stays inside Autonomatex — not inside one person.' },
  ];

  return (
    <SectionWrap id="client-lifecycle" bg={SF} style={{ borderTop: `1px solid ${B}` }}>
      <SectionHead eyebrow="Client lifecycle system" title="From the First Welcome Call, Autonomatex Starts Building the Truck's Intelligence." desc="When a new dry van driver, truck owner, or fleet owner joins your dispatch company, the first few days matter most. That is when trust is built — or lost." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((step, i) => (
          <FadeUp key={step.n} delay={i * 0.06}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', position: 'relative', paddingBottom: i < steps.length - 1 ? 32 : 0 }}>
              {/* Line connector */}
              {i < steps.length - 1 && (
                <div style={{ position: 'absolute', left: 19, top: 44, bottom: 0, width: 2, background: B }} />
              )}
              {/* Number */}
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: i === 0 ? A : '#F5F7FA', border: `2px solid ${i === 0 ? A : B}`, color: i === 0 ? '#fff' : S, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                {step.n}
              </div>
              <div style={{ paddingTop: 8 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: P, marginBottom: 6 }}>{step.label}</p>
                <p style={{ fontSize: 13.5, color: S, lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </SectionWrap>
  );
}

// ── S11: What Happens If Your Best Dispatcher Leaves? (NEW) ──────────────────
function DispatcherLeavesSection() {
  return (
    <SectionWrap id="dispatcher-leaves" bg="#F0F4F8" style={{ borderTop: `1px solid ${B}` }}>
      <FadeUp>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <Eyebrow>Operational continuity</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 14 }}>
            What Happens If Your Best Dispatcher Leaves?
          </h2>
          <p style={{ fontSize: 16, color: S, lineHeight: 1.7, marginBottom: 40 }}>
            This is not a fear question. It is a business continuity question. Most dispatch companies have no answer for it. Autonomatex provides one.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 12, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${B}` }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F04438' }} />
                <p style={{ fontSize: 13, fontWeight: 700, color: P }}>Without Autonomatex</p>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Broker relationships reset. New dispatcher starts building from scratch.','Lane judgment disappears. Years of market knowledge are gone.','Truck preferences must be re-learned through costly trial and error.','Client trust weakens during the transition. Some clients leave.','The business loses value with the person, not with the work.'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: S, lineHeight: 1.6 }}>
                    <span style={{ color: '#F04438', flexShrink: 0 }}>—</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: '#F0F9F8', border: '1px solid rgba(13,148,136,0.2)', borderRadius: 12, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(13,148,136,0.15)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: A }} />
                <p style={{ fontSize: 13, fontWeight: 700, color: P }}>With Autonomatex</p>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Broker relationships stay in the company. History is organized and accessible.','Lane intelligence stays inside the business — not inside one person.','Truck preferences are documented and ready for the next dispatcher.','Client continuity is supported by organized company knowledge.','The business retains its intelligence. Dispatchers come and go. The company gets smarter.'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: S, lineHeight: 1.6 }}>
                    <span style={{ color: A, flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S12: Built for the Future of Dispatch ────────────────────────────────────
function FutureOfDispatchSection() {
  const stackRows = [
    { n: '01', title: 'Authorized load data', body: 'Available loads enter the decision layer only through approved API access or customer-authorized sources. No scraping. No unauthorized data.' },
    { n: '02', title: 'Years of dispatcher experience', body: 'Broker behavior, lane judgment, rejected loads, truck preferences, and real-world decisions become organized company intelligence.' },
    { n: '03', title: 'Autonomatex decision layer', body: 'The system ranks options, explains risk, and brings the right history forward before the dispatcher wastes time on calls that should have been rejected.' },
    { n: '✓',  title: 'Calm human final decision', body: 'Your dispatcher stays in control and makes sharper decisions with less pressure, more context, and the full weight of company history behind them.' },
  ];

  return (
    <SectionWrap id="future-of-dispatch" style={{ borderTop: `1px solid ${B}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <FadeUp>
          <Eyebrow>Built for the future of dispatch</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 18 }}>
            The Operational Intelligence Layer Behind Your Dry Van Dispatch Operation.
          </h2>
          <p style={{ fontSize: 16, color: S, lineHeight: 1.7, marginBottom: 16 }}>
            Freight technology is moving fast. AI recommendations, load-matching systems, and real-time decision software are becoming part of the market.
          </p>
          <p style={{ fontSize: 16, color: S, lineHeight: 1.7, marginBottom: 24 }}>
            Autonomatex is built to handle that intelligence layer for dry van dispatch companies — so your team stays focused on dispatch operations, driver relationships, carrier-client trust, and business growth.
          </p>
          <div style={{ background: D, borderRadius: 10, padding: '18px 22px', borderLeft: `3px solid ${A}` }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>
              Years of dispatcher experience should not leave when your dispatcher leaves.
            </p>
          </div>
        </FadeUp>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {stackRows.map((row, i) => (
            <FadeUp key={row.n} delay={i * 0.07}>
              <div style={{ background: i === stackRows.length - 1 ? 'rgba(13,148,136,0.06)' : SF, border: `1px solid ${i === stackRows.length - 1 ? 'rgba(13,148,136,0.2)' : B}`, borderRadius: 10, padding: '20px 22px', display: 'flex', gap: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === stackRows.length - 1 ? A : '#F5F7FA', color: i === stackRows.length - 1 ? '#fff' : S, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{row.n}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: P, marginBottom: 4 }}>{row.title}</p>
                  <p style={{ fontSize: 13, color: S, lineHeight: 1.6 }}>{row.body}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

// ── S13: Technical Foundation ─────────────────────────────────────────────────
function TechnicalFoundationSection() {
  const steps = [
    { n: 1, title: 'Authorized load data', desc: 'Approved DAT API, approved data partner, or customer-authorized load data. No scraping or unauthorized automation.' },
    { n: 2, title: 'Truck intelligence profile', desc: 'Stores each truck\'s preferences, no-go areas, minimum RPM, driver notes, broker history, and lane patterns.' },
    { n: 3, title: 'Rejection intelligence', desc: 'Weak loads are rejected with documented reasons before the dispatcher wastes time calling them.' },
    { n: 4, title: 'AI load decision layer', desc: 'Ranks the top options and explains why each load is worth calling or avoiding — in plain language, not technical jargon.' },
    { n: 5, title: 'Human dispatcher control', desc: 'The dispatcher calls, negotiates, books manually, and logs the outcome. Autonomatex updates the truck\'s intelligence with the result.' },
  ];
  const compliance = [
    { title: 'Authorized data only', desc: 'Built for approved DAT API, approved data partner access, or customer-authorized load data. No scraping.' },
    { title: 'No auto-booking', desc: 'Autonomatex ranks and explains. Your dispatch team calls, negotiates, and books manually.' },
    { title: 'Audit trail ready', desc: 'Each recommendation can store input, score, reason, human decision, and final outcome.' },
    { title: 'Email-first support', desc: 'Paid pilot users submit questions by email and form so serious customers receive focused support without long calls.' },
  ];

  return (
    <SectionWrap id="technical-side" bg={SF} style={{ borderTop: `1px solid ${B}` }}>
      <SectionHead eyebrow="Technical foundation" title="How Autonomatex works behind the scenes." desc="A simple decision stack for dry van dispatch companies: authorized data, truck intelligence, AI ranking, and human final control." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 56 }}>
        {steps.map((step, i) => (
          <FadeUp key={step.n} delay={i * 0.06}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: '#F5F7FA', border: `1px solid ${B}`, borderRadius: 10, padding: '20px 24px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: A, color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step.n}</div>
              <div>
                <p style={{ fontSize: 14.5, fontWeight: 700, color: P, marginBottom: 5 }}>{step.title}</p>
                <p style={{ fontSize: 13.5, color: S, lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp>
        <Eyebrow>Trust + compliance</Eyebrow>
        <h3 style={{ fontSize: 24, fontWeight: 700, color: P, letterSpacing: '-0.02em', marginBottom: 28 }}>Decision support only. Dispatchers stay in control.</h3>
      </FadeUp>
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {compliance.map(c => (
          <motion.div key={c.title} variants={staggerItem}>
            <Card>
              <p style={{ fontSize: 14, fontWeight: 700, color: P, marginBottom: 8 }}>{c.title}</p>
              <p style={{ fontSize: 13, color: S, lineHeight: 1.65 }}>{c.desc}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

// ── S14: Self Guided Workflow ──────────────────────────────────────────────────
function WorkflowSection() {
  return (
    <SectionWrap id="self-guided-workflow" style={{ borderTop: `1px solid ${B}` }}>
      <SectionHead center eyebrow="Self-guided workflow" title="No live call required. See the dry van workflow yourself." desc="The workflow preview uses sample data to show how Autonomatex ranks loads, rejects weak options, and builds company intelligence. Paid pilot access is separate and begins after account activation." />

      {/* Dashboard mockup */}
      <FadeUp>
        <div style={{ background: D, borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 64px rgba(16,24,40,0.2)', marginBottom: 32 }}>
          {/* Mock header */}
          <div style={{ background: '#2a3550', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#F04438','#F79009','#12B76A'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Autonomatex · Dispatch Console · Sample Data</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 320 }}>
            {/* Sidebar */}
            <div style={{ background: '#151c2a', padding: '24px 16px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Autonomatex</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>Dispatch Console</p>
              {['Dashboard','Trucks','Load Ranking','Rejections','Outcomes'].map((item, i) => (
                <div key={item} style={{ fontSize: 12, padding: '8px 12px', borderRadius: 6, marginBottom: 2, background: i === 2 ? 'rgba(13,148,136,0.15)' : 'transparent', color: i === 2 ? A : 'rgba(255,255,255,0.4)', cursor: 'default', fontWeight: i === 2 ? 600 : 400 }}>{item}</div>
              ))}
            </div>

            {/* Main area */}
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Truck 12 · Dallas, TX</p>
                  <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)' }}>Dry Van · Midwest preferred · Min $2.30/mi</p>
                </div>
                <div style={{ background: 'rgba(13,148,136,0.15)', border: '1px solid rgba(13,148,136,0.25)', borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 600, color: A }}>3 worth calling</div>
              </div>

              {/* Load cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {[
                  { label: 'Call #1', lane: 'Dallas → Chicago', detail: '$2,350 · $2.54/mi', color: A },
                  { label: 'Call #2', lane: 'Fort Worth → St. Louis', detail: '$1,650 · $2.57/mi', color: '#12B76A' },
                  { label: 'Rejected', lane: 'Dallas → NYC', detail: 'No-go area · Low RPM', color: '#F04438' },
                ].map(row => (
                  <div key={row.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: row.label === 'Rejected' ? 'rgba(255,255,255,0.35)' : '#fff', marginBottom: 2 }}>{row.lane}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{row.detail}</p>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: row.color, background: `${row.color}18`, border: `1px solid ${row.color}30`, padding: '3px 10px', borderRadius: 20 }}>{row.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.18)', borderRadius: 8, padding: '14px 18px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Recommendation</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>Call Dallas → Chicago first. It clears the minimum RPM, matches Midwest preference, avoids no-go areas, and has the strongest reload potential.</p>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      <FadeUp>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <NavHref href="/workflow">
            <span style={{ display: 'inline-block', background: A, color: '#fff', borderRadius: 8, padding: '12px 28px', fontWeight: 600, fontSize: 14.5, cursor: 'pointer' }}>Open Self-Guided Workflow</span>
          </NavHref>
          <NavHref href="/#paid-pilot">
            <span style={{ display: 'inline-block', background: SF, color: P, border: `1.5px solid ${B}`, borderRadius: 8, padding: '12px 28px', fontWeight: 600, fontSize: 14.5, cursor: 'pointer' }}>Start Paid Pilot</span>
          </NavHref>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S15: The Real Moat ────────────────────────────────────────────────────────
function RealMoatSection() {
  const cards = [
    { title: 'Every truck becomes easier to dispatch over time', body: 'Minimum RPM, no-go areas, driver notes, home-time preferences, deadhead tolerance — organized and improving with every dispatch cycle.' },
    { title: 'Weak decisions become permanent lessons', body: 'Why bad loads were rejected — before wasting broker calls, dispatcher energy, and truck time.' },
    { title: 'Your broker relationships become permanent company assets', body: 'Communication quality, cancellation history, detention behavior, and rate patterns — not lost when a dispatcher leaves.' },
    { title: 'Every successful load improves tomorrow\'s decisions', body: 'Booked rate, final result, reload quality, and repeat-or-avoid decisions compound into long-term dispatch advantage.' },
  ];

  return (
    <section id="the-real-moat" style={{ background: D }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <FadeUp>
            <Eyebrow>The real moat</Eyebrow>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 18 }}>
              Company-owned operational intelligence that compounds every month.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 24 }}>
              Autonomatex becomes more valuable because it learns what each dry van truck accepts, rejects, wins, loses, and repeats. The operating intelligence compounds inside the dispatch company — not inside a person.
            </p>
            <NavHref href="/#paid-pilot">
              <span style={{ display: 'inline-block', fontSize: 14, fontWeight: 600, color: A, cursor: 'pointer' }}>Start paid pilot access →</span>
            </NavHref>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {cards.map((c, i) => <FadeUp key={c.title} delay={i * 0.07}><DarkCard title={c.title} body={c.body} /></FadeUp>)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── S16: Pricing ──────────────────────────────────────────────────────────────
function PricingSection() {
  const [notice, setNotice] = useState<string | null>(null);
  const plans = [
    { id: 'pilot',    label: 'Paid Pilot Access', price: '$79',      tag: 'Start here', desc: '7 days after account activation · up to 2 dry van trucks · email support only · credit toward first month if you upgrade.', primary: true },
    { id: 'oneTruck', label: '1 Truck Access',    price: '$99/mo',   tag: null,         desc: 'For a dispatcher testing one active dry van truck before expanding.', primary: false },
    { id: 'fourTruck',label: '4 Truck Team',      price: '$199/mo',  tag: null,         desc: 'For a small dry van dispatch team that wants to compare value across several trucks.', primary: false },
    { id: 'core',     label: 'Core Dispatch',     price: '$299/mo',  tag: 'Best base',  desc: 'Up to 10 dry van trucks. Full dispatch intelligence, load ranking, rejection reasons, broker and lane notes, and outcomes.', primary: true },
    { id: 'growth',   label: 'Growth Dispatch',   price: '$749/mo',  tag: null,         desc: 'Up to 30 dry van trucks. Better for growing dry van dispatch teams with multiple dispatchers.', primary: false },
    { id: 'pro',      label: 'Pro Dispatch',      price: '$1,499/mo',tag: null,         desc: 'Up to 75 dry van trucks. For high-volume dry van dispatch operations.', primary: false },
  ];

  const handlePlanClick = (planId: string, planLabel: string) => {
    const url = getPaymentUrl(planId);
    if (url) { window.location.href = url; return; }
    setNotice(planLabel);
    setTimeout(() => {
      const el = document.getElementById('paid-pilot');
      if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top, behavior: 'smooth' }); }
    }, 100);
    setTimeout(() => setNotice(null), 7000);
  };

  return (
    <SectionWrap id="pricing" bg={SF} style={{ borderTop: `1px solid ${B}` }}>
      <SectionHead center eyebrow="Pricing" title="Start small, then scale the dry van dispatch brain." desc="Pricing is designed to show value per truck while keeping the serious dispatch-company path clear." />
      {notice && (
        <div style={{ background: 'rgba(247,144,9,0.08)', border: '1px solid rgba(247,144,9,0.25)', borderRadius: 10, padding: '14px 20px', marginBottom: 24, fontSize: 13.5, color: '#b45309' }}>
          <strong>Stripe payment link needed.</strong> The {notice} button is ready. Add the real Stripe payment link to <code>src/config/stripe.ts</code> before public outreach. Scrolling to the paid pilot form now.
        </div>
      )}
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginBottom: 20 }}>
        {plans.map(plan => (
          <motion.div key={plan.id} variants={staggerItem}>
            <div style={{ background: SF, border: `1.5px solid ${plan.primary ? A : B}`, borderRadius: 12, padding: '28px 24px', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: plan.primary ? `0 0 0 3px rgba(13,148,136,0.08)` : 'none', position: 'relative' }}>
              {plan.tag && <div style={{ position: 'absolute', top: -10, left: 20, background: A, color: '#fff', fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{plan.tag}</div>}
              <p style={{ fontSize: 15, fontWeight: 700, color: P, marginBottom: 8 }}>{plan.label}</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: P, letterSpacing: '-0.03em', marginBottom: 12 }}>{plan.price}</p>
              <p style={{ fontSize: 13, color: S, lineHeight: 1.65, marginBottom: 20, flex: 1 }}>{plan.desc}</p>
              <button onClick={() => handlePlanClick(plan.id, plan.label)}
                style={{ background: plan.primary ? A : '#F5F7FA', color: plan.primary ? '#fff' : P, border: `1.5px solid ${plan.primary ? A : B}`, borderRadius: 8, padding: '11px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, system-ui, sans-serif' }}
                onMouseEnter={e => { const t = e.currentTarget; t.style.background = plan.primary ? '#0f766e' : B; }}
                onMouseLeave={e => { const t = e.currentTarget; t.style.background = plan.primary ? A : '#F5F7FA'; }}
              >
                {plan.primary ? `Choose ${plan.label.split(' ')[0]}` : `Choose ${plan.label.split(' ')[0]}`}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <p style={{ fontSize: 12, color: S, textAlign: 'center' }}>Extra trucks after plan limit: $29/truck/month. Approved load-data and API costs may be billed separately when applicable.</p>
    </SectionWrap>
  );
}

// ── S17: Paid Pilot ───────────────────────────────────────────────────────────
type PilotForm = { name: string; company: string; email: string; phone: string; plan_interest: string; dry_van_trucks: string; load_board: string; payment_link_needed: string; message: string; };
const PILOT_INIT: PilotForm = { name:'', company:'', email:'', phone:'', plan_interest:'', dry_van_trucks:'', load_board:'', payment_link_needed:'Yes, send secure payment link', message:'' };
const encode = (d: Record<string, string>) => Object.keys(d).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(d[k])}`).join('&');

const inp: React.CSSProperties = { width:'100%', padding:'11px 14px', borderRadius:8, border:`1px solid ${B}`, fontSize:14, color:P, background:'#fff', outline:'none', transition:'border-color 0.15s', fontFamily:'Inter, system-ui, sans-serif' };
const lbl: React.CSSProperties = { display:'block', fontSize:13, fontWeight:500, color:P, marginBottom:6 };

function PaidPilotSection() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<PilotForm>(PILOT_INIT);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const set = (k: keyof PilotForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(prev => ({ ...prev, [k]: e.target.value }));
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = A; };
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = B; };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault(); setSubmitting(true); setError('');
    try {
      const res = await fetch('/', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: encode({'form-name':'autonomatex-paid-pilot-interest', ...form}) });
      if (res.ok) { navigate('/thank-you'); window.scrollTo({ top:0 }); }
      else setError('Something went wrong. Please email us directly.');
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return (
    <SectionWrap id="paid-pilot" bg="#F5F7FA" style={{ borderTop: `1px solid ${B}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }}>
        <FadeUp>
          <Eyebrow>No call required</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight:700, color:P, letterSpacing:'-0.025em', lineHeight:1.22, marginBottom:16 }}>Start paid pilot access.</h2>
          <p style={{ fontSize:16, color:S, lineHeight:1.7, marginBottom:20 }}>Use this path if you want to test Autonomatex without a live sales call. Pay first, complete onboarding, then use email support for questions.</p>
          <ul style={{ paddingLeft:20, listStyle:'disc', display:'flex', flexDirection:'column', gap:8 }}>
            {['7-day paid pilot begins after account activation.','Questions are handled by email and form for paid users.','No auto-booking. Dispatcher remains in control.','Dry van dispatch companies only.'].map(item => <li key={item} style={{ fontSize:14, color:S, lineHeight:1.6 }}>{item}</li>)}
          </ul>
          <div style={{ marginTop:28, background:SF, border:`1px solid ${B}`, borderRadius:12, padding:'20px 24px' }}>
            <p style={{ fontSize:13, fontWeight:700, color:P, marginBottom:10 }}>How to contact Autonomatex</p>
            <p style={{ fontSize:13, color:S, lineHeight:1.65 }}>Start with paid pilot access, complete this form, and add your questions below. Support is handled by email for paid users — no live demo call required.</p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div style={{ background:SF, border:`1px solid ${B}`, borderRadius:16, padding:32, boxShadow:'0 4px 16px rgba(16,24,40,0.07)' }}>
            <form onSubmit={handleSubmit} name="autonomatex-paid-pilot-interest" style={{ display:'flex', flexDirection:'column', gap:18 }}>
              <input type="hidden" name="form-name" value="autonomatex-paid-pilot-interest" />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div><label htmlFor="pp-name" style={lbl}>Full name <span style={{color:'#F04438'}}>*</span></label><input id="pp-name" required style={inp} value={form.name} onChange={set('name')} placeholder="John Smith" onFocus={focus} onBlur={blur} /></div>
                <div><label htmlFor="pp-company" style={lbl}>Dispatch company <span style={{color:'#F04438'}}>*</span></label><input id="pp-company" required style={inp} value={form.company} onChange={set('company')} placeholder="ABC Dispatch LLC" onFocus={focus} onBlur={blur} /></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div><label htmlFor="pp-email" style={lbl}>Business email <span style={{color:'#F04438'}}>*</span></label><input id="pp-email" required type="email" style={inp} value={form.email} onChange={set('email')} placeholder="name@company.com" onFocus={focus} onBlur={blur} /></div>
                <div><label htmlFor="pp-phone" style={lbl}>Phone</label><input id="pp-phone" type="tel" style={inp} value={form.phone} onChange={set('phone')} placeholder="+1 210 000 0000" onFocus={focus} onBlur={blur} /></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div><label htmlFor="pp-plan" style={lbl}>Plan interest <span style={{color:'#F04438'}}>*</span></label>
                  <select id="pp-plan" required style={{...inp, appearance:'none'}} value={form.plan_interest} onChange={set('plan_interest')} onFocus={focus} onBlur={blur}>
                    <option value="">Select</option>
                    {['$79 Paid Pilot Access','$99/mo — 1 Truck Access','$199/mo — 4 Truck Team','$299/mo — Core Dispatch up to 10 trucks','$749/mo — Growth up to 30 trucks','$1,499/mo — Pro up to 75 trucks'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div><label htmlFor="pp-trucks" style={lbl}>Dry van trucks dispatched <span style={{color:'#F04438'}}>*</span></label>
                  <select id="pp-trucks" required style={{...inp, appearance:'none'}} value={form.dry_van_trucks} onChange={set('dry_van_trucks')} onFocus={focus} onBlur={blur}>
                    <option value="">Select</option>
                    {['1','2–4','5–10','11–30','31–75','75+'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div><label htmlFor="pp-board" style={lbl}>Current load board / data source</label><input id="pp-board" style={inp} value={form.load_board} onChange={set('load_board')} placeholder="DAT / Truckstop / internal source" onFocus={focus} onBlur={blur} /></div>
              <div><label htmlFor="pp-payment" style={lbl}>Need payment link?</label>
                <select id="pp-payment" style={{...inp, appearance:'none'}} value={form.payment_link_needed} onChange={set('payment_link_needed')} onFocus={focus} onBlur={blur}>
                  <option>Yes, send secure payment link</option><option>I already paid</option><option>I want monthly plan after pilot</option>
                </select>
              </div>
              <div><label htmlFor="pp-message" style={lbl}>Questions for Autonomatex / what do you want help with first?</label>
                <textarea id="pp-message" rows={4} style={{...inp, resize:'vertical'}} value={form.message} onChange={set('message')} placeholder="How does paid pilot access work? Too many weak loads, senior dispatcher knowledge, rejected loads, broker history, lane memory, training team members..." onFocus={focus} onBlur={blur} />
              </div>
              {error && <div style={{ background:'rgba(240,68,56,0.08)', border:'1px solid rgba(240,68,56,0.2)', borderRadius:8, padding:'12px 16px', fontSize:13, color:'#dc2626' }}>{error}</div>}
              <button type="submit" disabled={submitting}
                style={{ background:submitting?'#9ca3af':A, color:'#fff', border:'none', borderRadius:8, padding:'14px', fontWeight:700, fontSize:15, cursor:submitting?'not-allowed':'pointer', fontFamily:'Inter, system-ui, sans-serif', transition:'background 0.15s' }}
                onMouseEnter={e => { if (!submitting) (e.target as HTMLElement).style.background='#0f766e'; }}
                onMouseLeave={e => { if (!submitting) (e.target as HTMLElement).style.background=A; }}
              >{submitting ? 'Submitting…' : 'Submit Paid Pilot Onboarding Request'}</button>
              <p style={{ fontSize:12, color:'#9ca3af', textAlign:'center', lineHeight:1.6 }}>Payment links must be connected through Stripe before public outreach. This form captures serious paid-pilot requests and support questions.</p>
            </form>
          </div>
        </FadeUp>
      </div>
    </SectionWrap>
  );
}

// ── S18: FAQ ──────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: 'Do I need to book a live call?',        a: 'No. The website includes a self-guided workflow preview. Paid users can submit questions by email and form. No live call is required to start.' },
    { q: 'How do I contact Autonomatex?',          a: 'Use the paid pilot form or onboarding form. Autonomatex is designed for email-first support, so serious paid users can get focused answers without long live calls.' },
    { q: 'Is this only for dry van dispatch companies?', a: 'Yes. The first public version is focused only on dry van dispatch companies and dry van dispatch workflows.' },
    { q: 'When does the paid pilot start?',        a: 'The 7-day paid pilot starts after account activation — not immediately after submitting the form.' },
    { q: 'Does Autonomatex book loads?',           a: 'No. Autonomatex ranks and explains. The dispatcher calls, negotiates, books manually, and logs outcomes. The dispatcher stays in full control.' },
    { q: 'Is DAT connected?',                      a: 'The platform is designed for approved DAT API or customer-authorized data sources. The workflow preview uses sample data until an approved connection is active.' },
    { q: 'What happens after the pilot?',          a: 'Upgrade to the monthly plan that matches your dry van truck count. Pilot payment can be credited toward the first month.' },
  ];

  return (
    <SectionWrap id="faq" bg={SF} style={{ borderTop: `1px solid ${B}` }}>
      <SectionHead eyebrow="FAQ" title="Questions dry van dispatch companies may ask before paying." />
      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {faqs.map((faq, i) => (
          <FadeUp key={i} delay={i * 0.04}>
            <div style={{ border:`1px solid ${B}`, borderRadius:10, overflow:'hidden' }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 22px', background:SF, border:'none', cursor:'pointer', textAlign:'left', gap:16, fontFamily:'Inter, system-ui, sans-serif' }}>
                <span style={{ fontSize:15, fontWeight:600, color:P, lineHeight:1.45 }}>{faq.q}</span>
                {open === i ? <ChevronUp size={18} color={S} style={{flexShrink:0}} /> : <ChevronDown size={18} color={S} style={{flexShrink:0}} />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div key="content" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.22}}>
                    <div style={{ padding:'0 22px 18px', fontSize:14.5, color:S, lineHeight:1.7, background:BG, borderTop:`1px solid ${B}`, paddingTop:16 }}>{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeUp>
        ))}
      </div>
    </SectionWrap>
  );
}

// ── S19: Contact ──────────────────────────────────────────────────────────────
function ContactSection() {
  const steps = [
    { n: '1.', title: 'Start paid pilot access', desc: 'Use the paid pilot path to show serious interest before support begins.' },
    { n: '2.', title: 'Complete onboarding',     desc: 'Share your dry van truck count, current load source, dispatch challenge, and first workflow needs.' },
    { n: '3.', title: 'Submit questions by email or form', desc: 'Questions are answered through email support for paid pilot users, without requiring a live call or laptop demo.' },
  ];

  return (
    <SectionWrap id="contact" style={{ borderTop: `1px solid ${B}` }}>
      <SectionHead center eyebrow="Contact Autonomatex" title="Start with paid pilot access. Ask questions by email or form." desc="Autonomatex is built for a no-call buying flow. Choose paid pilot access, complete onboarding, and submit questions through the form or email. This keeps support focused on serious dry van dispatch companies." />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:20, maxWidth:760, margin:'0 auto' }}>
        {steps.map((step, i) => (
          <motion.div key={step.n} variants={staggerItem}>
            <Card style={{ textAlign:'left' }}>
              <div style={{ fontSize:13, fontWeight:700, color:A, marginBottom:10 }}>{step.n}</div>
              <p style={{ fontSize:15, fontWeight:700, color:P, marginBottom:8 }}>{step.title}</p>
              <p style={{ fontSize:13.5, color:S, lineHeight:1.65 }}>{step.desc}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrap>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ background:D, padding:'72px 24px', textAlign:'center' }}>
      <FadeUp>
        <h2 style={{ fontSize:'clamp(24px,3vw,36px)', fontWeight:700, color:'#fff', letterSpacing:'-0.02em', marginBottom:12 }}>
          Ready to test Autonomatex without a sales call?
        </h2>
        <p style={{ fontSize:16, color:'rgba(255,255,255,0.5)', marginBottom:32 }}>
          Start paid pilot access, complete onboarding, and use email support for questions.
        </p>
        <NavHref href="/#paid-pilot">
          <span style={{ display:'inline-block', background:A, color:'#fff', borderRadius:8, padding:'14px 36px', fontWeight:700, fontSize:16, cursor:'pointer', boxShadow:`0 4px 20px rgba(13,148,136,0.35)` }}>
            Start 7-Day Paid Pilot
          </span>
        </NavHref>
      </FadeUp>
    </section>
  );
}

// ── HomePage ──────────────────────────────────────────────────────────────────
export function HomePage() {
  return (
    <main>
      <HeroSection />
      <Divider />
      <QuickSummarySection />
      <WhyStopGrowingSection />
      <CostOfNothingSection />
      <DispatcherSideSection />
      <OwnerSideSection />
      <SmarterEveryDaySection />
      <NewTruckOnboardingSection />
      <ClientRetentionSection />
      <ClientLifecycleSection />
      <DispatcherLeavesSection />
      <FutureOfDispatchSection />
      <TechnicalFoundationSection />
      <WorkflowSection />
      <RealMoatSection />
      <PricingSection />
      <PaidPilotSection />
      <FAQSection />
      <ContactSection />
      <FinalCTA />
    </main>
  );
}
