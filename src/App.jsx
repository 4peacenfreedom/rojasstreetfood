import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Registro from './pages/Registro';
import MisPuntos from './pages/MisPuntos';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import KineticMenuDemo from './pages/KineticMenuDemo';

function AppLayout() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#121212]">
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/carrito"    element={<Cart />} />
        <Route path="/registro"   element={<Registro />} />
        <Route path="/mis-puntos" element={<MisPuntos />} />
        <Route path="/admin"      element={<Admin />} />
        <Route path="*"           element={<NotFound />} />
        <Route path="/menu-demo" element={<KineticMenuDemo />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppLayout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
