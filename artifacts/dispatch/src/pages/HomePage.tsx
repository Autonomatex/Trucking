import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { NavHref } from '@/components/NavHref';
import { FadeUp, staggerContainer, staggerItem } from '@/components/FadeUp';
import { getPaymentUrl } from '@/config/stripe';
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

function SectionHead({ eyebrow, title, desc, descColor, center, light }: {
  eyebrow: string; title: React.ReactNode; desc?: string;
  descColor?: string; center?: boolean; light?: boolean;
}) {
  return (
    <FadeUp>
      <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 56 }}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700, color: light ? '#fff' : P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: desc ? 16 : 0, maxWidth: center ? 680 : 680, margin: center ? '0 auto' : undefined }}>{title}</h2>
        {desc && <p style={{ fontSize: 17, color: descColor ?? S, lineHeight: 1.7, maxWidth: 640, marginTop: 14, margin: center ? '14px auto 0' : '14px 0 0' }}>{desc}</p>}
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
    <section style={{ background: BG, padding: '72px 24px 80px' }}>
      <div className="atx-hero-g" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Left */}
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: A, background: 'rgba(13,148,136,0.08)', padding: '5px 12px', borderRadius: 20, marginBottom: 24, border: '1px solid rgba(13,148,136,0.18)' }}>
              For truck dispatch companies
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.75, ease: EASE }}
            style={{ fontSize: 'clamp(30px,3.8vw,50px)', fontWeight: 700, color: P, letterSpacing: '-0.03em', lineHeight: 1.16, marginBottom: 24 }}
          >
            Operational Intelligence for Modern Truck Dispatch Companies
          </motion.h1>

          {/* Equipment types */}
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6, ease: EASE }}
            style={{ fontSize: 13, color: A, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 22 }}
          >
            Supports Dry Van · Reefer · Flatbed · Hotshot · Box Truck · Power Only
          </motion.p>

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
              {['No live call required','Email support only','All equipment types','No auto-booking','Authorized data only'].map(t => (
                <span key={t} style={{ fontSize: 11.5, color: S, background: '#F0F4F8', padding: '4px 10px', borderRadius: 20, border: `1px solid ${B}` }}>{t}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — illustration (hidden on mobile) */}
        <div className="atx-hero-illustration" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

// ── S2: Quick Summary ────────────────────────────────────────────────────────
function QuickSummarySection() {
  const bullets = [
    'We reduce dispatcher decision pressure — so your team spends less energy on weak loads and more on what matters.',
    'We preserve company operational intelligence — broker history, lane judgment and rejection logic stay inside the business, not inside one person.',
    'We help new dispatchers become productive faster — learning from accumulated company knowledge instead of starting from scratch.',
    'We protect years of senior dispatcher experience — so it compounds inside the company, not disappears when someone leaves.',
    'We help companies scale professionally — more trucks, cleaner operations, consistent decision quality.',
    'Humans stay in control — every load decision is made by your dispatcher. Always.',
  ];

  return (
    <SectionWrap id="quick-summary" bg={D}>
      <FadeUp>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <Eyebrow>Quick Summary</Eyebrow>
          <h2 style={{ fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.25, marginBottom: 32 }}>
            Operational Intelligence for Modern Truck Dispatch Companies
          </h2>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: 16, listStyle: 'none', marginBottom: 36 }}>
            {bullets.map((b, i) => (
              <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(13,148,136,0.2)', border: `1.5px solid ${A}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke={A} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1.5 6 4.5 9 10.5 3"/>
                  </svg>
                </div>
                <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{b}</p>
              </li>
            ))}
          </ul>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 'clamp(18px,2.2vw,24px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.5 }}>
              One Company.{' '}
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>One Intelligence Layer.</span>{' '}
              A Dispatch Business That Becomes More Valuable Every Month.
            </p>
          </div>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S3: Why Autonomatex Exists ───────────────────────────────────────────────
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
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { label: 'Every truck creates experience.', sub: 'Lane history. Broker relationships. Rate patterns. Operational rhythms.' },
            { label: 'Every dispatcher creates knowledge.', sub: 'What works. What to avoid. Who to call. How to negotiate. What rates hold.' },
            { label: 'Every broker interaction teaches something.', sub: 'Communication quality. Cancellation risk. Detention behavior. Reliability patterns.' },
            { label: 'People change. Dispatchers change. Markets change.', sub: 'Operations managers transition. Teams restructure. Markets shift. Dispatchers move on.' },
            { label: 'Knowledge should never disappear.', sub: 'Today, most of it does — because it lives inside people, not inside the business.' },
          ].map((item, i, arr) => (
            <motion.div key={i} variants={staggerItem} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${B}` : 'none', padding: '26px 0', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: A, marginTop: 7, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 17, fontWeight: 700, color: P, marginBottom: 5 }}>{item.label}</p>
                <p style={{ fontSize: 14.5, color: S, lineHeight: 1.65 }}>{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <FadeUp delay={0.15}>
          <div style={{ background: D, borderRadius: 12, padding: '26px 36px', marginTop: 48, borderLeft: `3px solid ${A}` }}>
            <p style={{ fontSize: 17, fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>
              Autonomatex exists so operational intelligence compounds instead of disappearing every time something changes.
            </p>
          </div>
        </FadeUp>
      </div>
    </SectionWrap>
  );
}

// ── S4: Why Dispatch Companies Stop Growing (NEW) ────────────────────────────
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

// ── S6: Comparison ────────────────────────────────────────────────────────────
function ComparisonSection() {
  const traditional = [
    'Knowledge lives inside people.',
    'Manual remembering.',
    'Slow onboarding.',
    'Knowledge disappears.',
    'Stress increases.',
  ];
  const autonomatex = [
    'Knowledge belongs to the company.',
    'Operational intelligence compounds.',
    'Professional onboarding.',
    'Business continuity.',
    'Calmer operations.',
  ];

  return (
    <SectionWrap id="comparison" bg={BG}>
      <SectionHead center eyebrow="Why It Matters" title="Traditional Dispatch vs. Autonomatex Dispatch." />
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
              <p style={{ fontSize: 15, fontWeight: 700, color: P }}>Traditional Dispatch</p>
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
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Autonomatex Dispatch</p>
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

// ── S7: The Cost of Doing Nothing (NEW) ─────────────────────────────────────
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
      <div className="atx-g2" style={{ gap: 24 }}>
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

// ── S6: Operations Side ───────────────────────────────────────────────────────
function OperationsSideSection() {
  const cards = [
    { title: 'Less mental load', body: 'Truck preferences, no-go areas, minimum RPM, broker notes, lane history, and past decisions stay organized — not scattered across memory and notes.' },
    { title: 'Calmer broker communication', body: 'Dispatchers enter broker calls with more context — rate history, past behavior, and lane fit — and spend less energy on calls that should not have happened.' },
    { title: 'Calmer senior dispatchers', body: 'Senior dispatchers make stronger decisions when company history, market data, and decision support reinforce their judgment instead of adding to their burden.' },
    { title: 'Faster team training', body: 'New dispatchers learn from stored rejection reasons, broker history, lane performance, and outcome logs instead of guessing from scratch.' },
    { title: 'Better teamwork', body: 'One shared intelligence layer means every dispatcher on the team works from the same company knowledge — not from fragmented personal notes.' },
    { title: 'Better work rhythm', body: 'Less chaos, clearer priorities, fewer repeated checks, and less dependence on scattered notes help create a smoother, more professional daily operation.' },
  ];

  return (
    <SectionWrap id="operations-side">
      <SectionHead eyebrow="Operations Side" title="Give your team more time to think, lead, and build relationships." desc="Autonomatex reduces the burden of remembering every small truck detail manually, so dispatchers can focus on higher-value work." />
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

// ── S7: Business Side ─────────────────────────────────────────────────────────
function BusinessSideSection() {
  const items = [
    { n: '01', title: 'Company memory', body: 'Every accepted load, rejected load, broker note, lane pattern, and outcome becomes part of a private company knowledge base — not scattered across personal notes.' },
    { n: '02', title: 'Operational continuity', body: 'When dispatchers change, the company does not lose its operational intelligence. Knowledge stays inside the business, not inside any one person.' },
    { n: '03', title: 'Client retention', body: 'Existing clients feel remembered, understood, and professionally managed — because Autonomatex keeps building intelligence around every truck it dispatches.' },
    { n: '04', title: 'Business scalability', body: 'Adding trucks does not mean adding chaos. A shared intelligence layer lets the team handle more operations without losing decision quality or professionalism.' },
    { n: '05', title: 'Knowledge ownership', body: 'Operational intelligence belongs to the dispatch company. Not to any employee, not to any platform. It compounds inside your business.' },
    { n: '06', title: 'Long-term company value', body: 'The longer you use Autonomatex, the more valuable your dispatch operation becomes — because every decision improves every future decision.' },
  ];

  return (
    <SectionWrap id="business-side" bg={SF} style={{ borderTop: `1px solid ${B}` }}>
      <div className="atx-g2-wide">
        <FadeUp>
          <Eyebrow>Business Side</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 18 }}>
            Turn Dispatch Knowledge Into a Permanent Business Asset.
          </h2>
          <p style={{ fontSize: 15.5, color: S, lineHeight: 1.7, marginBottom: 32 }}>
            Every dispatch decision — every load accepted, every load rejected, every broker interaction — can compound into long-term business value instead of disappearing overnight.
          </p>
          <div style={{ background: D, borderRadius: 10, padding: '18px 22px', borderLeft: `3px solid ${A}` }}>
            <p style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>
              The dispatch company becomes smarter, calmer and more valuable every month.
            </p>
          </div>
        </FadeUp>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {items.map((item, i) => (
            <FadeUp key={item.n} delay={i * 0.07}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: BG, border: `1px solid ${B}`, borderRadius: 10, padding: '18px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: A, flexShrink: 0, paddingTop: 3, letterSpacing: '0.05em' }}>{item.n}</div>
                <div>
                  <p style={{ fontSize: 14.5, fontWeight: 700, color: P, marginBottom: 5 }}>{item.title}</p>
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

// ── S8: Business Continuity ───────────────────────────────────────────────────
function BusinessContinuitySection() {
  const scenarios = [
    { label: 'Senior dispatcher leaves', body: 'Broker relationships, lane judgment, and years of market knowledge stay inside the company — not leave with the person.' },
    { label: 'Junior dispatcher joins', body: 'New dispatchers learn from accumulated company intelligence instead of starting from zero. Ramp-up time shortens. Quality stays consistent.' },
    { label: 'Operations manager changes', body: 'Procedures, truck history, broker strategies, lane knowledge, and business rules remain inside the platform — ready for the next person in the role.' },
    { label: 'Dispatch manager changes', body: 'Team-level operational context and performance history compound inside the business, not inside the individual who managed it.' },
    { label: 'Company grows', body: 'New trucks inherit company knowledge from day one. Growth adds capability — not chaos — because intelligence scales with the operation.' },
    { label: 'Departments expand', body: 'A shared intelligence layer means every team works from the same operational foundation, regardless of how the org structure evolves.' },
    { label: 'Shift changes', body: 'The next shift starts informed. Truck context, open decisions, and recent outcomes are organized — not lost between handoffs.' },
    { label: 'Business restructuring', body: 'When teams, roles, or processes change shape, operational intelligence does not scatter. The platform holds what the business has earned.' },
  ];

  return (
    <SectionWrap id="business-continuity" bg={BG}>
      <SectionHead center eyebrow="Business Continuity" title="Knowledge Belongs to the Company. Not to One Employee." desc="Operational intelligence remains with the dispatch company when any role, person, or arrangement changes." />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, maxWidth: 1000, margin: '0 auto 48px' }}>
        {scenarios.map(s => (
          <motion.div key={s.label} variants={staggerItem}>
            <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 10, padding: '22px 24px', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: A, flexShrink: 0 }} />
                <p style={{ fontSize: 14, fontWeight: 700, color: P }}>{s.label}</p>
              </div>
              <p style={{ fontSize: 13.5, color: S, lineHeight: 1.65 }}>{s.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <FadeUp>
        <div style={{ background: D, borderRadius: 12, padding: '24px 36px', textAlign: 'center', border: `1px solid rgba(13,148,136,0.3)`, maxWidth: 640, margin: '0 auto' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            Knowledge compounds. The company never starts over.
          </p>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S12: Compounding Timeline ─────────────────────────────────────────────────
function CompoundingTimelineSection() {
  const years = [
    { label: 'Year 1', desc: 'Foundation built. Every dispatcher decision, every truck profile, every broker interaction starts building the intelligence layer. The company stops repeating early mistakes.' },
    { label: 'Year 2', desc: 'Recommendations sharpen. Rate floors clarify. Transitions become smooth. The dispatch team becomes more consistent — regardless of who is dispatching.' },
    { label: 'Year 3', desc: 'Operational consistency compounds. New dispatchers onboard faster. Fleet decisions become more informed. Business value grows month over month.' },
    { label: 'Year 5', desc: 'Institutional knowledge is deep. The company is more resilient, more efficient, and more valuable than any single-person operation could achieve.' },
    { label: 'Smarter Dispatch Company', desc: 'Every dispatcher. Every truck. Every broker. Every rejection. Every booked load. Every outcome. Improves tomorrow\'s operation.', accent: true },
  ];

  return (
    <SectionWrap id="compounding-timeline" bg={D}>
      <SectionHead center light eyebrow="Operational Intelligence Compounds"
        title={<span style={{ color: '#fff' }}>Every Decision Increases Long-Term Business Intelligence.</span>}
        desc="The longer your company uses Autonomatex, the more intelligent your operation becomes. Intelligence does not reset — it compounds."
        descColor="rgba(255,255,255,0.55)"
      />
      <div style={{ maxWidth: 540, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 28, bottom: 28, left: 19, width: 2, background: 'rgba(13,148,136,0.3)' }} />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          {years.map((y, i) => (
            <motion.div key={y.label} variants={staggerItem} style={{ position: 'relative', paddingLeft: 58, marginBottom: i < years.length - 1 ? 48 : 0 }}>
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
                <p style={{ fontSize: 14, fontWeight: 700, color: y.accent ? A : 'rgba(255,255,255,0.9)', marginBottom: 6 }}>{y.label}</p>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{y.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrap>
  );
}

// ── S13: Your Dispatch Company Should Become Smarter Every Day (NEW) ──────────
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

// ── S10: New Truck Onboarding ─────────────────────────────────────────────────
function NewTruckOnboardingSection() {
  const timeline = [
    { label: 'Welcome Call', desc: 'Your dispatcher captures home base, preferred lanes, no-go areas, minimum RPM, deadhead limits, home-time needs, broker restrictions, and first-week expectations.' },
    { label: 'Truck Profile', desc: 'Autonomatex turns the welcome-call details into a working truck profile — organized and ready before load decisions begin.' },
    { label: 'First 72 Hours', desc: 'A focused first-week dispatch plan using truck preferences, market data, lane intelligence, and company experience. No random start.' },
    { label: 'Daily Operations', desc: 'Autonomatex ranks the loads worth calling first, explains weak loads, and helps the dispatcher make faster decisions with less pressure.' },
    { label: 'Learning', desc: 'Every accepted and rejected load refines the model. The truck\'s profile deepens. Recommendations improve continuously.' },
    { label: 'Retention', desc: 'Existing clients feel remembered and professionally managed. Company intelligence keeps building around every truck.' },
    { label: 'Long-Term Growth', desc: 'The longer the relationship continues, the stronger the intelligence becomes. Old trucks become more valuable every week, every month, every year.' },
  ];

  return (
    <SectionWrap id="new-truck-onboarding" bg={SF} style={{ borderTop: `1px solid ${B}` }}>
      <SectionHead eyebrow="New Truck Onboarding" title="A Professional System. Not a Stressful Guessing Game." desc="For many dispatch companies, keeping new trucks long enough to prove value is the hardest part. Autonomatex makes the onboarding timeline repeatable." />
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 24, bottom: 24, left: 19, width: 2, background: `rgba(13,148,136,0.18)` }} />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          {timeline.map((step, i) => (
            <motion.div key={step.label} variants={staggerItem} style={{ position: 'relative', paddingLeft: 56, marginBottom: i < timeline.length - 1 ? 36 : 0 }}>
              <div style={{
                position: 'absolute', left: 8, top: 4, width: 24, height: 24, borderRadius: '50%',
                background: i === 0 ? A : i === timeline.length - 1 ? A : SF,
                border: `2px solid ${A}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: (i === 0 || i === timeline.length - 1) ? '#fff' : A, zIndex: 1,
              }}>
                {i + 1}
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: A, marginBottom: 3, letterSpacing: '0.02em' }}>{step.label}</p>
              <p style={{ fontSize: 14, color: S, lineHeight: 1.65 }}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrap>
  );
}

// ── S11: Existing Client Retention ────────────────────────────────────────────
function ClientRetentionSection() {
  return (
    <section id="client-retention" style={{ background: D }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
        <div className="atx-g2-wide">
          <FadeUp>
            <Eyebrow>Client Retention</Eyebrow>
            <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 18 }}>
              Old Trucks Become More Valuable. Every Week. Every Month. Every Year.
            </h2>
            <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 24 }}>
              Every week your dispatch company works with a truck, Autonomatex remembers more. The dispatch company becomes stronger. Existing clients feel remembered, understood, and professionally managed — not handled randomly.
            </p>
            <div style={{ background: 'rgba(13,148,136,0.12)', border: '1px solid rgba(13,148,136,0.3)', borderRadius: 10, padding: '18px 22px', marginBottom: 24 }}>
              <p style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', lineHeight: 1.55 }}>
                The longer the relationship continues, the stronger the intelligence becomes — and the harder it is for a competitor to replicate.
              </p>
            </div>
            <NavHref href="/#paid-pilot">
              <span style={{ display: 'inline-block', fontSize: 14, fontWeight: 600, color: A, cursor: 'pointer' }}>
                Start paid pilot access →
              </span>
            </NavHref>
          </FadeUp>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { title: 'Remember what worked', body: 'Lane performance, broker behavior, accepted rates, and repeatable patterns compound into company memory that improves every future decision.' },
              { title: 'Remember what failed', body: 'Rejected loads, weak lanes, bad timing, and wrong-fit choices are not forgotten. Every weak decision becomes a permanent lesson.' },
              { title: 'Improve client confidence', body: 'Existing clients feel the dispatch company is learning their operation and improving over time — not handling them randomly.' },
              { title: 'Build long-term retention', body: 'Autonomatex reduces repeated mistakes, makes communication smoother, and creates a more professional client experience every month.' },
            ].map((c, i) => (
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
      <SectionHead eyebrow="Client lifecycle system" title="From the First Welcome Call, Autonomatex Starts Building the Truck's Intelligence." desc="When a new driver, truck owner, or fleet owner joins your dispatch company, the first few days matter most. That is when trust is built — or lost." />
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

// ── S14: Dispatcher Transition ────────────────────────────────────────────────
function DispatcherLeavesSection() {
  const scenarios = [
    { label: 'A dispatcher leaves', body: 'Broker relationships, lane judgment, truck history, and years of market knowledge stay inside the company — not leave with the person. The next dispatcher starts informed.' },
    { label: 'A dispatcher joins', body: 'New dispatchers learn from accumulated company intelligence. Ramp-up time shortens. Decision quality stays consistent. The company does not restart its knowledge base.' },
    { label: 'Shifts change', body: 'The next shift starts informed. Truck context, open decisions, and recent outcomes are organized and accessible — not lost between handoffs.' },
    { label: 'Departments grow', body: 'As the team expands, every dispatcher works from the same shared intelligence layer. More dispatchers means more capacity — not more fragmentation.' },
  ];

  return (
    <SectionWrap id="dispatcher-leaves" bg={BG} style={{ borderTop: `1px solid ${B}` }}>
      <SectionHead center eyebrow="Dispatcher Transition" title="Operational Intelligence Remains. Every Time." desc="When dispatchers change, shift, or grow — the company keeps its intelligence. Dispatchers come and go. The business gets smarter." />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 1000, margin: '0 auto 48px' }}>
        {scenarios.map(s => (
          <motion.div key={s.label} variants={staggerItem}>
            <div style={{ background: SF, border: `1px solid ${B}`, borderRadius: 10, padding: '24px 26px', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: A, flexShrink: 0 }} />
                <p style={{ fontSize: 14.5, fontWeight: 700, color: P }}>{s.label}</p>
              </div>
              <p style={{ fontSize: 13.5, color: S, lineHeight: 1.65 }}>{s.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <FadeUp>
        <div style={{ background: D, borderRadius: 12, padding: '22px 32px', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <p style={{ fontSize: 16.5, fontWeight: 700, color: '#fff' }}>
            The company keeps improving. Always.
          </p>
        </div>
      </FadeUp>
    </SectionWrap>
  );
}

// ── S15: Operations Manager Transition ────────────────────────────────────────
function OperationsManagerSection() {
  return (
    <SectionWrap id="ops-manager-transition" bg={SF} style={{ borderTop: `1px solid ${B}` }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        <FadeUp>
          <Eyebrow>Operations Manager Transition</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 14 }}>
            If an Operations Manager Changes, the Company Does Not Restart.
          </h2>
          <p style={{ fontSize: 15.5, color: S, lineHeight: 1.7, marginBottom: 36 }}>
            This is not a personnel question. It is a business continuity question. When an operations manager transitions, everything they knew should remain inside the company — not leave with them.
          </p>
        </FadeUp>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Procedures', body: 'Operational workflows, decision logic, and team processes stay documented inside the platform.' },
            { label: 'Truck history', body: 'Every truck\'s profile, preferences, lane history, and operational patterns remain intact and accessible.' },
            { label: 'Broker relationships', body: 'Communication history, rate patterns, cancellation behavior, and reliability data stay inside the business.' },
            { label: 'Lane knowledge', body: 'What lanes work. What lanes to avoid. What markets perform. This intelligence does not leave with the manager.' },
            { label: 'Business rules', body: 'Minimum RPM floors, no-go areas, preferred brokers, and team decision guidelines remain organized and available.' },
            { label: 'Operational intelligence', body: 'Everything the company has earned — every decision, every outcome, every lesson — remains inside the platform.' },
          ].map(item => (
            <motion.div key={item.label} variants={staggerItem}>
              <div style={{ background: BG, border: `1px solid ${B}`, borderRadius: 10, padding: '20px 22px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: A, marginBottom: 10 }} />
                <p style={{ fontSize: 14, fontWeight: 700, color: P, marginBottom: 6 }}>{item.label}</p>
                <p style={{ fontSize: 13, color: S, lineHeight: 1.6 }}>{item.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <FadeUp>
          <div style={{ background: D, borderRadius: 12, padding: '22px 28px', borderLeft: `3px solid ${A}` }}>
            <p style={{ fontSize: 15.5, fontWeight: 600, color: '#fff', lineHeight: 1.55 }}>
              Operational intelligence remains inside the company. The next operations manager inherits a business that is already smarter than the day they arrived.
            </p>
          </div>
        </FadeUp>
      </div>
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
      <div className="atx-g2-wide" style={{ alignItems: 'center' }}>
        <FadeUp>
          <Eyebrow>Built for the future of dispatch</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: P, letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 18 }}>
            The Operational Intelligence Layer Behind Your Truck Dispatch Operation.
          </h2>
          <p style={{ fontSize: 16, color: S, lineHeight: 1.7, marginBottom: 16 }}>
            Freight technology is moving fast. AI recommendations, load-matching systems, and real-time decision software are becoming part of the market.
          </p>
          <p style={{ fontSize: 16, color: S, lineHeight: 1.7, marginBottom: 24 }}>
            Autonomatex is built to handle that intelligence layer for truck dispatch companies — so your team stays focused on dispatch operations, driver relationships, carrier-client trust, and business growth.
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

// ── S17: Technical Foundation ─────────────────────────────────────────────────
function TechnicalFoundationSection() {
  const steps = [
    { n: 1, title: 'Business Experience', desc: 'Every load, every broker call, every dispatch decision — captured and organized as structured operational data.' },
    { n: 2, title: 'Operational Memory', desc: 'Each truck\'s preferences, no-go areas, minimum RPM, driver notes, broker history, and lane patterns — stored as durable intelligence.' },
    { n: 3, title: 'AI Intelligence', desc: 'The platform analyzes patterns across your operational history, surfaces signals, and builds ranked recommendations from your own data.' },
    { n: 4, title: 'Recommendations', desc: 'A ranked shortlist of loads worth calling — explained in plain language, not technical jargon.' },
    { n: 5, title: 'Human Dispatcher', desc: 'The dispatcher calls, negotiates, books manually, and logs the outcome. Humans decide. Always. No automatic booking.' },
    { n: 6, title: 'Continuous Learning', desc: 'Every accepted and declined outcome feeds back into the system. The intelligence improves with every cycle — compounding over time.' },
  ];
  const compliance = [
    { title: 'Authorized data only', desc: 'Built for approved DAT API, approved data partner access, or customer-authorized load data. No scraping.' },
    { title: 'No auto-booking', desc: 'Autonomatex ranks and explains. Your dispatch team calls, negotiates, and books manually.' },
    { title: 'Audit trail ready', desc: 'Each recommendation can store input, score, reason, human decision, and final outcome.' },
    { title: 'Email-first support', desc: 'Paid pilot users submit questions by email and form so serious customers receive focused support without long calls.' },
  ];

  return (
    <SectionWrap id="technical-side" bg={SF} style={{ borderTop: `1px solid ${B}` }}>
      <SectionHead eyebrow="Technical foundation" title="How Autonomatex works behind the scenes." desc="A simple decision stack for truck dispatch companies: authorized data, truck intelligence, AI ranking, and human final control." />
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
      <SectionHead center eyebrow="Self-guided workflow" title="No live call required. See the dispatch workflow yourself." desc="The workflow preview uses sample data to show how Autonomatex ranks loads, rejects weak options, and builds company intelligence. Paid pilot access is separate and begins after account activation." />

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

          <div className="atx-g-workflow">
            {/* Sidebar — hidden on mobile */}
            <div className="atx-workflow-sidebar" style={{ background: '#151c2a', padding: '24px 16px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
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
        <div className="atx-g2-wide" style={{ alignItems: 'center' }}>
          <FadeUp>
            <Eyebrow>The real moat</Eyebrow>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.22, marginBottom: 18 }}>
              Company-owned operational intelligence that compounds every month.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 24 }}>
              Autonomatex becomes more valuable because it learns what each truck accepts, rejects, wins, loses, and repeats. The operating intelligence compounds inside the dispatch company — not inside a person.
            </p>
            <NavHref href="/#paid-pilot">
              <span style={{ display: 'inline-block', fontSize: 14, fontWeight: 600, color: A, cursor: 'pointer' }}>Start paid pilot access →</span>
            </NavHref>
          </FadeUp>
          <div className="atx-g2" style={{ gap: 16 }}>
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
    { id: 'pilot',    label: 'Paid Pilot Access', price: '$79',      tag: 'Start here', desc: '7 days after account activation · up to 2 trucks · email support only · credit toward first month if you upgrade.', primary: true },
    { id: 'oneTruck', label: '1 Truck Access',    price: '$99/mo',   tag: null,         desc: 'For a dispatcher testing one active truck before expanding.', primary: false },
    { id: 'fourTruck',label: '4 Truck Team',      price: '$199/mo',  tag: null,         desc: 'For a small dispatch team that wants to compare value across several trucks.', primary: false },
    { id: 'core',     label: 'Core Dispatch',     price: '$299/mo',  tag: 'Best base',  desc: 'Up to 10 trucks. Full dispatch intelligence, load ranking, rejection reasons, broker and lane notes, and outcomes.', primary: true },
    { id: 'growth',   label: 'Growth Dispatch',   price: '$749/mo',  tag: null,         desc: 'Up to 30 trucks. Better for growing dispatch teams with multiple dispatchers.', primary: false },
    { id: 'pro',      label: 'Pro Dispatch',      price: '$1,499/mo',tag: null,         desc: 'Up to 75 trucks. For high-volume truck dispatch operations.', primary: false },
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
      <SectionHead center eyebrow="Pricing" title="Start small, then scale the dispatch brain." desc="Pricing is designed to show value per truck while keeping the serious dispatch-company path clear." />
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
type PilotForm = { name: string; company: string; email: string; phone: string; plan_interest: string; trucks_dispatched: string; load_board: string; payment_link_needed: string; message: string; };
const PILOT_INIT: PilotForm = { name:'', company:'', email:'', phone:'', plan_interest:'', trucks_dispatched:'', load_board:'', payment_link_needed:'Yes, send secure payment link', message:'' };
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
      <div className="atx-g-pilot">
        <FadeUp>
          <Eyebrow>No call required</Eyebrow>
          <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight:700, color:P, letterSpacing:'-0.025em', lineHeight:1.22, marginBottom:16 }}>Start paid pilot access.</h2>
          <p style={{ fontSize:16, color:S, lineHeight:1.7, marginBottom:20 }}>Use this path if you want to test Autonomatex without a live sales call. Pay first, complete onboarding, then use email support for questions.</p>
          <ul style={{ paddingLeft:20, listStyle:'disc', display:'flex', flexDirection:'column', gap:8 }}>
            {['7-day paid pilot begins after account activation.','Questions are handled by email and form for paid users.','No auto-booking. Dispatcher remains in control.','All equipment types supported.'].map(item => <li key={item} style={{ fontSize:14, color:S, lineHeight:1.6 }}>{item}</li>)}
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
                <div><label htmlFor="pp-trucks" style={lbl}>Trucks dispatched <span style={{color:'#F04438'}}>*</span></label>
                  <select id="pp-trucks" required style={{...inp, appearance:'none'}} value={form.trucks_dispatched} onChange={set('trucks_dispatched')} onFocus={focus} onBlur={blur}>
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
    { q: 'What equipment types does Autonomatex support?', a: 'Autonomatex supports Dry Van, Reefer, Flatbed, Hotshot, Box Truck, and Power Only dispatch operations. During onboarding you select the equipment types your company dispatches and the intelligence layer adapts automatically.' },
    { q: 'When does the paid pilot start?',        a: 'The 7-day paid pilot starts after account activation — not immediately after submitting the form.' },
    { q: 'Does Autonomatex book loads?',           a: 'No. Autonomatex ranks and explains. The dispatcher calls, negotiates, books manually, and logs outcomes. The dispatcher stays in full control.' },
    { q: 'Is DAT connected?',                      a: 'The platform is designed for approved DAT API or customer-authorized data sources. The workflow preview uses sample data until an approved connection is active.' },
    { q: 'What happens after the pilot?',          a: 'Upgrade to the monthly plan that matches your truck count. Pilot payment can be credited toward the first month.' },
  ];

  return (
    <SectionWrap id="faq" bg={SF} style={{ borderTop: `1px solid ${B}` }}>
      <SectionHead eyebrow="FAQ" title="Questions truck dispatch companies may ask before paying." />
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
    { n: '2.', title: 'Complete onboarding',     desc: 'Share your truck count, equipment types, current load source, dispatch challenge, and first workflow needs.' },
    { n: '3.', title: 'Submit questions by email or form', desc: 'Questions are answered through email support for paid pilot users, without requiring a live call or laptop demo.' },
  ];

  return (
    <SectionWrap id="contact" style={{ borderTop: `1px solid ${B}` }}>
      <SectionHead center eyebrow="Contact Autonomatex" title="Start with paid pilot access. Ask questions by email or form." desc="Autonomatex is built for a no-call buying flow. Choose paid pilot access, complete onboarding, and submit questions through the form or email. This keeps support focused on serious truck dispatch companies." />
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
      <QuickSummarySection />
      <WhyExistsSection />
      <WhyStopGrowingSection />
      <ComparisonSection />
      <CostOfNothingSection />
      <OperationsSideSection />
      <BusinessSideSection />
      <BusinessContinuitySection />
      <CompoundingTimelineSection />
      <SmarterEveryDaySection />
      <NewTruckOnboardingSection />
      <ClientRetentionSection />
      <ClientLifecycleSection />
      <DispatcherLeavesSection />
      <OperationsManagerSection />
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
