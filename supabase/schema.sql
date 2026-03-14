-- ============================================================
-- Rojas Street Food - Programa de Fidelidad
-- Esquema de base de datos Supabase
-- ============================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLAS
-- ============================================================

-- Clientes registrados en el programa
CREATE TABLE IF NOT EXISTS customers (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  telefono    TEXT NOT NULL,          -- Solo dígitos (normalizado al registrar)
  qr_code     TEXT,                   -- URL que codifica el QR (/admin?scan=UUID)
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Compras registradas por visita
CREATE TABLE IF NOT EXISTS purchases (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id    UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  monto          INTEGER NOT NULL,    -- En colones (mínimo 5000 para badge)
  fecha          TIMESTAMPTZ DEFAULT now(),
  registrado_por TEXT DEFAULT 'manual' CHECK (registrado_por IN ('manual', 'qr', 'admin'))
);

-- Estado de badges y recompensas por cliente
CREATE TABLE IF NOT EXISTS rewards (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id         UUID REFERENCES customers(id) ON DELETE CASCADE UNIQUE NOT NULL,
  badges_count        INTEGER DEFAULT 0 CHECK (badges_count >= 0 AND badges_count <= 10),
  total_acumulado     INTEGER DEFAULT 0,   -- Total gastado en colones (histórico)
  recompensa_activa   BOOLEAN DEFAULT false,  -- true cuando llega a 10 badges
  recompensa_canjeada BOOLEAN DEFAULT false,  -- true cuando ya lo canjeó (histórico)
  fecha_canje         TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_customers_email    ON customers (email);
CREATE INDEX IF NOT EXISTS idx_customers_telefono ON customers (telefono);
CREATE INDEX IF NOT EXISTS idx_customers_nombre   ON customers USING gin(to_tsvector('spanish', nombre));
CREATE INDEX IF NOT EXISTS idx_rewards_customer   ON rewards (customer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_customer ON purchases (customer_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases  ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards    ENABLE ROW LEVEL SECURITY;

-- CUSTOMERS --
-- Lectura pública (para /mis-puntos y registro)
CREATE POLICY "public_read_customers"
  ON customers FOR SELECT TO anon, authenticated USING (true);

-- Solo usuarios autenticados (admin) pueden actualizar
CREATE POLICY "auth_update_customers"
  ON customers FOR UPDATE TO authenticated USING (true);

-- PURCHASES --
-- Solo admin autenticado
CREATE POLICY "auth_manage_purchases"
  ON purchases FOR ALL TO authenticated USING (true);

-- REWARDS --
-- Lectura pública (para /mis-puntos)
CREATE POLICY "public_read_rewards"
  ON rewards FOR SELECT TO anon, authenticated USING (true);

-- Solo admin autenticado puede modificar
CREATE POLICY "auth_manage_rewards"
  ON rewards FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "auth_update_rewards"
  ON rewards FOR UPDATE TO authenticated USING (true);

-- ============================================================
-- NOTA: Las inserciones de clientes y rewards se hacen
-- desde el servidor (API route) con la SERVICE_ROLE_KEY,
-- que bypassa RLS automáticamente.
-- ============================================================

-- ============================================================
-- CREAR USUARIO ADMIN
-- ============================================================
-- En el dashboard de Supabase:
-- 1. Ir a Authentication > Users
-- 2. Click "Add user"
-- 3. Ingresar el email y contraseña del administrador
-- 4. El admin usa esas credenciales para hacer login en /admin
-- ============================================================
