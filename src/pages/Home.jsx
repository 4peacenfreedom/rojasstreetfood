import Hero from '../components/Hero';
import QuickInfo from '../components/QuickInfo';
import Menu from '../components/Menu';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

function Home() {
  return (
    <main>
      <Hero />
      <QuickInfo />
      <Menu />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}

export default Home;
