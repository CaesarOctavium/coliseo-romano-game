# El Montmell — Plataforma Dual

Un backend único (API REST) y dos frontends: la app gratuita para vecinos
y el panel de pago para el Ayuntamiento. Ver [`PRESUPUESTO.md`](./PRESUPUESTO.md)
para la propuesta comercial.

## Estructura

```
montmell-platform/
├── backend/            # Express + Prisma + PostgreSQL, autenticación JWT
├── apps/
│   ├── citizen/        # "El Montmell Connect" — PWA gratuita para vecinos
│   └── admin/          # "Montmell Gestiona" — panel para concejales/alcaldía
└── PRESUPUESTO.md
```

## El motor de licencias

`backend/src/middleware/license.js` calcula, en cada petición autenticada,
el `licenseTier` efectivo de la municipalidad del usuario (`req.licenseTier`):

- Si `Municipality.licenseTier` es `PRO`, o hay una ventana de **Demo Mode**
  activa (`demoExpiresAt` en el futuro), el tier efectivo es `PRO`.
- En caso contrario, se usa el tier almacenado (`FREE`/`BASIC`).

Los endpoints leen ese valor para decidir cuánto detalle devolver
(`backend/src/controllers/incidentsController.js`) o si bloquear una acción
premium con `requireLicense('PRO')`.

## Arrancar en local

Requiere Node 18+ y una instancia de PostgreSQL.

```bash
# 1. Backend
cd backend
cp .env.example .env   # editar DATABASE_URL / JWT_SECRET
npm install
npm run prisma:migrate
npm run seed            # crea El Montmell, 3 concejales, 1 alcalde y 1.958 vecinos
npm run dev              # http://localhost:4000

# 2. App ciudadana (otra terminal)
cd apps/citizen
npm install
npm run dev              # http://localhost:5173

# 3. Panel admin (otra terminal)
cd apps/admin
npm install
npm run dev              # http://localhost:5174
```

Todos los usuarios sembrados por `seed.js` usan la contraseña
`montmell2026` (ver `backend/prisma/seed.js`).

## Demo comercial

Desde Montmell Gestiona, el botón **"Activar Demo 15 días"** llama a
`POST /api/license/demo/activate`, que activa el tier `PRO` durante
`DEMO_DURATION_MINUTES` (15 minutos por defecto, configurable en `.env`)
para que el alcalde vea en vivo el Panel IA, los informes PDF y la
asignación con 1 clic antes de decidir si contrata.
