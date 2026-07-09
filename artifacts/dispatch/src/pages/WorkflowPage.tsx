import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { NavHref } from '@/components/NavHref';
import { FadeUp } from '@/components/FadeUp';

const ACCENT = '#0D9488';
const DARK   = '#1E2433';
const BORDER = '#E6EAF0';

const SAMPLE_LOADS = [
  { lane: 'Dallas, TX → Chicago, IL',       miles: 925, rate: 2350, rpm: 2.54, status: 'Call #1',  reason: 'Best balance of RPM, dry-van lane fit, and reload potential out of Chicago.' },
  { lane: 'Fort Worth, TX → St. Louis, MO', miles: 640, rate: 1650, rpm: 2.57, status: 'Call #2',  reason: 'Strong RPM and acceptable pickup timing for Truck 12.' },
  { lane: 'Dallas, TX → Kansas City, MO',   miles: 510, rate: 1250, rpm: 2.45, status: 'Call #3',  reason: 'Good RPM, shorter run, solid backup option.' },
  { lane: 'Dallas, TX → New York, NY',      miles: 1547,rate: 2900, rpm: 1.87, status: 'Rejected', reason: 'No NYC preference on file. Below minimum RPM.' },
  { lane: 'Waco, TX → Denver, CO',          miles: 798, rate: 1400, rpm: 1.75, status: 'Rejected', reason: 'Below $2.30 minimum RPM. Weak reload market on return.' },
  { lane: 'Dallas, TX → Memphis, TN',       miles: 452, rate: 850,  rpm: 1.88, status: 'Rejected', reason: 'Below minimum RPM. Does not meet company lane standards.' },
];

const STEPS = [
  { n: 1, label: 'Truck request',   desc: 'Truck 12 is empty in Dallas tomorrow morning.' },
  { n: 2, label: 'Authorized data', desc: 'Loads enter from approved API or customer-authorized data.' },
  { n: 3, label: 'Truck profile',   desc: 'Preferences, RPM targets, no-go areas, and broker history are checked.' },
  { n: 4, label: 'AI ranking',      desc: 'Autonomatex explains top loads and rejected loads with reasons.' },
  { n: 5, label: 'Human control',   desc: 'Dispatcher calls, negotiates, books, and logs the outcome.' },
];

function pill(status: string) {
  const isGood = status !== 'Rejected';
  return {
    display: 'inline-block', fontSize: 10.5, fontWeight: 700,
    padding: '3px 10px', borderRadius: 20,
    background: isGood ? 'rgba(18,183,106,0.12)' : 'rgba(240,68,56,0.1)',
    color: isGood ? '#059669' : '#dc2626',
    border: `1px solid ${isGood ? 'rgba(18,183,106,0.25)' : 'rgba(240,68,56,0.2)'}`,
  };
}

export function WorkflowPage() {
  const [, rerender] = useState(0);
  const demoRef = useRef<HTMLDivElement>(null);
  const inView = useInView(demoRef, { once: true });

  return (
    <main>
      {/* Hero */}
      <section style={{ padding: '80px 24px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start', flexWrap: 'wrap' }}>
          <FadeUp>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: ACCENT, marginBottom: 14 }}>
              Self-guided workflow preview
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#101828', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 18 }}>
              See how Autonomatex ranks loads without a live sales call.
            </h1>
            <p style={{ fontSize: 17, color: '#667085', lineHeight: 1.7, maxWidth: 560, marginBottom: 28 }}>
              This sample workflow shows how a dispatch request becomes a ranked decision: weak loads rejected, top three worth calling, and the dispatcher makes the final call.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <NavHref href="/#paid-pilot">
                <span style={{ display: 'inline-block', background: ACCENT, color: '#fff', borderRadius: 8, padding: '11px 24px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                  Start Paid Pilot Access
                </span>
              </NavHref>
              <NavHref href="/">
                <span style={{ display: 'inline-block', background: '#F5F7FA', color: '#101828', borderRadius: 8, padding: '11px 24px', fontWeight: 600, fontSize: 14, border: `1px solid ${BORDER}`, cursor: 'pointer' }}>
                  Back to Website
                </span>
              </NavHref>
            </div>
          </FadeUp>

          {/* Mini stat card */}
          <FadeUp delay={0.1}>
            <div style={{ background: DARK, borderRadius: 12, padding: '24px 28px', minWidth: 200, textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 6 }}>42</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>loads scanned</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[['39', 'rejected', '#F04438'], ['3', 'worth calling', ACCENT]].map(([n, label, color]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: color as string }}>{n}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Workflow steps */}
      <section style={{ background: '#F5F7FA', padding: '48px 24px', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {STEPS.map((step, i) => (
            <motion.div key={step.n}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              style={{ flex: '1 1 160px', maxWidth: 220, background: '#fff', borderRadius: 10, padding: '18px 20px', border: `1px solid ${BORDER}`, boxShadow: '0 1px 3px rgba(16,24,40,0.06)' }}
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: ACCENT, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                {step.n}
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#101828', marginBottom: 6 }}>{step.label}</p>
              <p style={{ fontSize: 12, color: '#667085', lineHeight: 1.6 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo console */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }} ref={demoRef}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <FadeUp>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8 }}>
              Sample ranking
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#101828', letterSpacing: '-0.02em' }}>
              Truck 12 · Dallas, TX · Dry van
            </h2>
          </FadeUp>
          <button onClick={() => rerender(n => n + 1)}
            style={{ background: '#F5F7FA', color: '#101828', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { const t = e.currentTarget; t.style.background = '#E6EAF0'; t.style.borderColor = '#d1d9e6'; }}
            onMouseLeave={e => { const t = e.currentTarget; t.style.background = '#F5F7FA'; t.style.borderColor = BORDER; }}
          >
            Rerun Sample Ranking
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Candidate loads */}
          <FadeUp>
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(16,24,40,0.06)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#101828', marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${BORDER}` }}>
                Candidate loads
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SAMPLE_LOADS.map(load => (
                  <div key={load.lane} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: `1px solid #F5F7FA` }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: load.status === 'Rejected' ? '#9ca3af' : '#101828', marginBottom: 3 }}>{load.lane}</p>
                      <p style={{ fontSize: 11.5, color: '#9ca3af' }}>{load.miles} mi · ${load.rate.toLocaleString()} · ${load.rpm.toFixed(2)}/mi</p>
                    </div>
                    <span style={pill(load.status)}>{load.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Decision box */}
          <FadeUp delay={0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(16,24,40,0.06)' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#101828', marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${BORDER}` }}>
                  Autonomatex decision layer
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#101828', marginBottom: 10 }}>
                  Call Dallas → Chicago first.
                </p>
                <p style={{ fontSize: 13.5, color: '#667085', lineHeight: 1.65, marginBottom: 16 }}>
                  It matches Truck 12's Midwest preference, clears the $2.30 minimum RPM, avoids no-go areas, and has the strongest reload potential out of Chicago.
                </p>
                <ol style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['Ask: $2,450', 'Minimum: $2,250', 'Walk away below: $2,150', 'Rejected loads saved to Truck profile.'].map(item => (
                    <li key={item} style={{ fontSize: 12.5, color: '#667085' }}>{item}</li>
                  ))}
                </ol>
              </div>
              <div style={{ background: '#F5F7FA', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#101828', marginBottom: 6 }}>No auto-booking.</p>
                <p style={{ fontSize: 13, color: '#667085', lineHeight: 1.6 }}>
                  The dispatcher calls, negotiates, books manually, and logs the final outcome. Autonomatex updates the truck's profile with the result.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: DARK, padding: '64px 24px', textAlign: 'center' }}>
        <FadeUp>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 12 }}>
            Ready to test the paid pilot path?
          </h2>
          <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.55)', marginBottom: 28 }}>
            Start with paid pilot access and submit questions by email or form. No live call required.
          </p>
          <NavHref href="/#paid-pilot">
            <span style={{ display: 'inline-block', background: ACCENT, color: '#fff', borderRadius: 8, padding: '13px 32px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
              Start 7-Day Paid Pilot
            </span>
          </NavHref>
        </FadeUp>
      </section>
    </main>
  );
}
