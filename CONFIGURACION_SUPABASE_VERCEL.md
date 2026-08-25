# 🔐 Guía de Configuración: Supabase + Vercel

## ⚠️ IMPORTANTE: Configuración de Seguridad (CRÍTICO)

Esta guía requiere que accedas a:
1. **Supabase Dashboard** - https://supabase.com/dashboard
2. **Vercel Dashboard** - https://vercel.com/dashboard

---

## PASO 1: Configurar Row Level Security (RLS) en Supabase

### ¿Por qué es crítico?
Sin RLS, **CUALQUIER PERSONA puede leer/escribir/borrar todos tus datos**. Es como dejar la puerta de tu casa abierta.

### Cómo activarlo:

1. **Ir a Supabase Dashboard**
   - https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Authentication → Policies** (menú izquierdo)

3. **Para cada tabla que tengas:**
   
   a) Haz click en la tabla
   
   b) Activa "Enable RLS" (toggle en la parte superior)
   
   c) **Crear políticas básicas:**

#### Ejemplo para tabla `users` (usuarios):
```sql
-- Política: Los usuarios solo pueden ver su propia información
CREATE POLICY "Users can view own data"
ON users
FOR SELECT
USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propia información
CREATE POLICY "Users can update own data"
ON users
FOR UPDATE
USING (auth.uid() = id);
```

#### Ejemplo para tabla `orders` (órdenes):
```sql
-- Política: Los usuarios pueden ver sus propias órdenes
CREATE POLICY "Users can view own orders"
ON orders
FOR SELECT
USING (auth.uid() = user_id);

-- Política: Los usuarios pueden crear sus propias órdenes
CREATE POLICY "Users can create own orders"
ON orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Admin puede ver todas las órdenes
CREATE POLICY "Admin can view all orders"
ON orders
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

#### Ejemplo para tabla `loyalty_stamps` (sellos de lealtad):
```sql
-- Usuarios pueden ver sus propios sellos
CREATE POLICY "Users can view own stamps"
ON loyalty_stamps
FOR SELECT
USING (auth.uid() = user_id);

-- Solo admins pueden insertar sellos
CREATE POLICY "Only admin can insert stamps"
ON loyalty_stamps
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

### ⚠️ IMPORTANTE: Tablas públicas (solo lectura)
Si tienes tablas que DEBEN ser públicas (ej: menú), usa esto:

```sql
-- Tabla menú: todos pueden leer, solo admin puede escribir
CREATE POLICY "Public read access"
ON menu_items
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin write access"
ON menu_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

---

## PASO 2: Configurar CORS en Supabase

### ¿Por qué es importante?
Para que solo TU dominio pueda hacer requests a tu API.

### Cómo configurarlo:

1. **Ir a Supabase Dashboard → Settings → API**

2. **Scroll hasta "CORS Configuration"**

3. **Agregar dominios permitidos:**
   ```
   https://www.rojasstreetfood.com
   https://rojasstreetfood.com
   http://localhost:5173
   http://localhost:3000
   ```

4. **Guardar cambios**

---

## PASO 3: Variables de Entorno en Vercel

### ¿Qué son las variables de entorno reales?

Actualmente tu `.env` tiene valores "dummy" (falsos). Necesitas los valores REALES de Supabase.

### Cómo obtenerlos:

1. **Ir a Supabase Dashboard → Settings → API**

2. **Copiar estos valores:**
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ NUNCA expongas esta en el frontend)

### Configurar en Vercel:

1. **Ir a Vercel Dashboard**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto "rojasstreetfood"

2. **Settings → Environment Variables**

3. **Agregar las siguientes variables:**

   | Name | Value | Environment |
   |------|-------|-------------|
   | `VITE_SUPABASE_URL` | `https://tu-proyecto.supabase.co` | Production, Preview, Development |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` (la key real) | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` (solo para server) | Production |

4. **Guardar y redesplegar**
   ```bash
   vercel --prod
   ```

---

## PASO 4: Actualizar .env local

Actualiza tu archivo `.env` local con los valores reales:

```env
# Supabase (valores REALES)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.real-key-here

# Solo para API routes (NUNCA exponer en frontend)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service-role-key-here

# Otros
RESEND_API_KEY=re_tu_key_real
RESEND_FROM_EMAIL=onboarding@resend.dev
OWNER_EMAIL=tu-email@example.com
APP_URL=https://www.rojasstreetfood.com
```

⚠️ **NUNCA SUBAS ESTE ARCHIVO A GIT** (ya está en .gitignore)

---

## PASO 5: Verificar que todo funciona

### Test de RLS:
```javascript
// En la consola del navegador (F12)
// Esto DEBE fallar si RLS está configurado correctamente:
const { data, error } = await supabase
  .from('users')
  .select('*');

// Si error = "new row violates row-level security policy" → ✅ RLS funcionando
```

### Test de CORS:
```javascript
// Desde otro dominio (ej: codepen.io)
fetch('https://tu-proyecto.supabase.co/rest/v1/users', {
  headers: { 'apikey': 'tu-anon-key' }
});

// Debe dar error CORS si está configurado correctamente → ✅
```

---

## 📊 Resumen de Seguridad

| Componente | Estado Actual | Después de Config | Protege contra |
|------------|---------------|-------------------|----------------|
| RLS | ❌ Desactivado | ✅ Activado | Acceso no autorizado a datos |
| CORS | ⚠️ Abierto | ✅ Restringido | Requests desde otros dominios |
| Security Headers | ❌ Faltantes | ✅ Configurados | XSS, Clickjacking, MIME sniffing |
| Env Variables | ⚠️ Dummy | ✅ Reales | Exposición de credenciales |

---

## 🆘 ¿Necesitas ayuda?

Si tienes problemas:
1. **Error "RLS policy violation"** → Normal, significa que RLS funciona. Verifica que el usuario esté autenticado.
2. **Error "Invalid API key"** → Verifica que las env variables estén correctas en Vercel.
3. **CORS error** → Verifica que el dominio esté en la lista de CORS en Supabase.

---

## 🎯 Próximos pasos (después de configurar)

Una vez configurado todo lo anterior:
1. ✅ Redesplegar en Vercel
2. ✅ Probar el flujo completo de la app
3. ✅ Verificar Lighthouse (debería mejorar de 50% → ~85%)
4. ✅ Verificar que las órdenes se guarden correctamente
