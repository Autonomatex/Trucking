import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { ThankYouPage } from '@/pages/ThankYouPage';

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Nav />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/thank-you" component={ThankYouPage} />
      </Switch>
      <Footer />
    </WouterRouter>
  );
}
export default App;