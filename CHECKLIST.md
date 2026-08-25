# ✅ Checklist de Implementación

## FASE 1: Código (✅ COMPLETADO)
- [x] Security headers en vercel.json
- [x] Optimizaciones de performance en index.html
- [x] SEO: structured data, Open Graph, meta tags
- [x] Accesibilidad: skip-to-content, focus-visible
- [x] Logo con width/height
- [x] Hero optimizado (LCP)
- [x] robots.txt y sitemap.xml

## FASE 2: Configuración Externa (⏳ PENDIENTE - REQUIERE TU ACCIÓN)

### A. Supabase Dashboard (15 min)
- [ ] 1. Ir a https://supabase.com/dashboard
- [ ] 2. Seleccionar proyecto
- [ ] 3. Activar RLS en todas las tablas:
  - [ ] users
  - [ ] orders
  - [ ] loyalty_stamps
  - [ ] (otras tablas que tengas)
- [ ] 4. Crear políticas básicas (copiar de CONFIGURACION_SUPABASE_VERCEL.md)
- [ ] 5. Settings → API → CORS → Agregar dominios:
  - [ ] https://www.rojasstreetfood.com
  - [ ] https://rojasstreetfood.com
  - [ ] http://localhost:5173

### B. Vercel Dashboard (5 min)
- [ ] 1. Ir a https://vercel.com/dashboard
- [ ] 2. Seleccionar proyecto rojasstreetfood
- [ ] 3. Settings → Environment Variables
- [ ] 4. Agregar variables (copiar valores reales de Supabase):
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY (solo Production)

### C. Deploy (2 min)
- [ ] 1. Hacer commit:
  ```bash
  git add .
  git commit -m "feat: security, performance, SEO y accesibilidad"
  git push origin main
  ```
- [ ] 2. Esperar deploy automático en Vercel

## FASE 3: Verificación (5 min)

- [ ] 1. Probar sitio en producción
- [ ] 2. Correr Lighthouse en DevTools:
  - [ ] Performance debería estar ~85% (vs 50%)
  - [ ] SEO ~95%
  - [ ] Accessibility ~95%
- [ ] 3. Verificar que las órdenes funcionen
- [ ] 4. Verificar headers de seguridad (DevTools → Network → Headers)

## 🎯 Meta de Mejoras

| Métrica | Antes | Después |
|---------|-------|---------|
| Performance Mobile | 50% | ~85% |
| LCP | 6.9s | ~2.2s |
| TBT | 890ms | ~300ms |
| SEO | ? | ~95% |
| Security | ❌ | ✅ |

## 📞 ¿Necesitas ayuda?

Si tienes problemas con algún paso, avísame y te ayudo con esa parte específica.
