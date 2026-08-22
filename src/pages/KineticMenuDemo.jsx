import KineticMenu from '../components/KineticMenu';
import '../components/KineticMenu.css';

export default function KineticMenuDemo() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <KineticMenu />

      {/* Demo Content */}
      <div style={{ paddingTop: '120px', maxWidth: '1200px', margin: '0 auto', padding: '120px 2rem 4rem' }}>
        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>
          Demo del Menú Kinético
        </h1>
        <p style={{ color: '#999', fontSize: '1.25rem', marginBottom: '2rem' }}>
          Haz clic en el botón "Menu" en la esquina superior derecha para ver la animación
        </p>

        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Características:</h2>
          <ul style={{ color: '#ccc', lineHeight: '1.8' }}>
            <li>✨ Animaciones suaves con GSAP</li>
            <li>🎨 Formas abstractas interactivas al hacer hover</li>
            <li>📱 Diseño responsive</li>
            <li>⌨️ Cierra con tecla Escape</li>
            <li>🎭 Overlay con blur backdrop</li>
          </ul>
        </div>

        <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '2rem' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Contenido de ejemplo</h2>
          <p style={{ color: '#ccc', lineHeight: '1.6' }}>
            Este es contenido de relleno para demostrar cómo se ve el menú en contexto.
            Puedes navegar y hacer clic en el botón del menú para ver la transición animada.
            Las formas de fondo cambian cuando pasas el cursor sobre cada opción del menú.
          </p>
        </div>
      </div>
    </div>
  );
}
