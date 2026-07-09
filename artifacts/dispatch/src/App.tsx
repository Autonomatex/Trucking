import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { WorkflowPage } from '@/pages/WorkflowPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { ThankYouPage } from '@/pages/ThankYouPage';

function NotFound() {
  const [, navigate] = useLocation();
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#101828' }}>Page not found</h1>
      <button onClick={() => navigate('/')}
        style={{ background: '#0D9488', color: '#fff', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif' }}>
        Back to Home
      </button>
    </div>
  );
}

function Router() {
  return (
    <>
      <Nav />
      <Switch>
        <Route path="/"           component={HomePage} />
        <Route path="/workflow"   component={WorkflowPage} />
        <Route path="/onboarding" component={OnboardingPage} />
        <Route path="/thank-you"  component={ThankYouPage} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}

export default App;
