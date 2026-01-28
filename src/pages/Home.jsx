import Hero from '../components/Hero';
import QuickInfo from '../components/QuickInfo';
import Menu from '../components/Menu';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

function Home() {
  return (
    <main>
      <Hero />
      <QuickInfo />
      <Menu />
      <Testimonials />
      <Footer />
    </main>
  );
}

export default Home;
