# ParkingFlow — Sesión 03
## Firestore + API REST de cajones

---

## Objetivo

Eliminar los datos mock y obtener los cajones desde Express + Firestore.

## 1. Firebase

1. Crear proyecto en Firebase Console.
2. Crear Firestore Database.
3. Crear Service Account.
4. Copiar `project_id`, `client_email` y `private_key` al `.env`.
5. No subir secretos al repositorio.

## 2. Instalar Firebase Admin

```bash
npm install -w apps/api firebase-admin
```

## 3. `apps/api/.env`

```env
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 4. `src/config/env.ts`

```ts
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z.string(),
})

export const env = envSchema.parse(process.env)
```

## 5. `src/config/firebase.ts`

```ts
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { env } from './env.js'

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  })
}

export const db = getFirestore()
```

## 6. Crear módulo

```text
src/modules/parking-spaces/
├── parking-space.types.ts
├── parking-space.schema.ts
├── parking-space.repository.ts
├── parking-space.service.ts
├── parking-space.controller.ts
└── parking-space.routes.ts
```

## 7. `parking-space.types.ts`

```ts
export type ParkingSpaceStatus = 'AVAILABLE' | 'OCCUPIED' | 'OUT_OF_SERVICE'
export type ParkingSpaceType = 'REGULAR' | 'DISABLED' | 'MOTORCYCLE'

export interface ParkingSpace {
  id: string
  code: string
  zone: string
  type: ParkingSpaceType
  status: ParkingSpaceStatus
  active: boolean
}
```

## 8. `parking-space.schema.ts`

```ts
import { z } from 'zod'

export const createParkingSpaceSchema = z.object({
  code: z.string().min(2).max(10),
  zone: z.string().min(1).max(10),
  type: z.enum(['REGULAR', 'DISABLED', 'MOTORCYCLE']),
})

export type CreateParkingSpaceInput = z.infer<typeof createParkingSpaceSchema>
```

## 9. `parking-space.repository.ts`

```ts
import { db } from '../../config/firebase.js'
import type { ParkingSpace } from './parking-space.types.js'

const collection = db.collection('parkingSpaces')

export const parkingSpaceRepository = {
  async list(): Promise<ParkingSpace[]> {
    const snapshot = await collection.orderBy('code').get()
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<ParkingSpace, 'id'>),
    }))
  },

  async findByCode(code: string): Promise<ParkingSpace | null> {
    const snapshot = await collection.where('code', '==', code).limit(1).get()
    const doc = snapshot.docs[0]
    if (!doc) return null
    return { id: doc.id, ...(doc.data() as Omit<ParkingSpace, 'id'>) }
  },

  async create(data: Omit<ParkingSpace, 'id'>): Promise<ParkingSpace> {
    const ref = await collection.add(data)
    return { id: ref.id, ...data }
  },
}
```

## 10. `parking-space.service.ts`

```ts
import { parkingSpaceRepository } from './parking-space.repository.js'
import type { CreateParkingSpaceInput } from './parking-space.schema.js'

export const parkingSpaceService = {
  list() {
    return parkingSpaceRepository.list()
  },

  async create(input: CreateParkingSpaceInput) {
    const existing = await parkingSpaceRepository.findByCode(input.code)
    if (existing) throw new Error('PARKING_SPACE_CODE_EXISTS')

    return parkingSpaceRepository.create({
      ...input,
      status: 'AVAILABLE',
      active: true,
    })
  },
}
```

## 11. `parking-space.controller.ts`

```ts
import type { Request, Response } from 'express'
import { createParkingSpaceSchema } from './parking-space.schema.js'
import { parkingSpaceService } from './parking-space.service.js'

export const listParkingSpaces = async (_request: Request, response: Response) => {
  const data = await parkingSpaceService.list()
  response.json({ data })
}

export const createParkingSpace = async (request: Request, response: Response) => {
  const input = createParkingSpaceSchema.parse(request.body)

  try {
    const data = await parkingSpaceService.create(input)
    response.status(201).json({ data })
  } catch (error) {
    if (error instanceof Error && error.message === 'PARKING_SPACE_CODE_EXISTS') {
      response.status(409).json({ message: 'Parking space code already exists' })
      return
    }
    throw error
  }
}
```

## 12. `parking-space.routes.ts`

```ts
import { Router } from 'express'
import { createParkingSpace, listParkingSpaces } from './parking-space.controller.js'

export const parkingSpaceRouter = Router()

parkingSpaceRouter.get('/', listParkingSpaces)
parkingSpaceRouter.post('/', createParkingSpace)
```

## 13. `shared/middleware/error.middleware.ts`

```ts
import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof ZodError) {
    response.status(400).json({ message: 'Validation error', issues: error.issues })
    return
  }

  console.error(error)
  response.status(500).json({ message: 'Internal server error' })
}
```

## 14. Actualizar `src/app.ts`

```ts
import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { parkingSpaceRouter } from './modules/parking-spaces/parking-space.routes.js'
import { healthRouter } from './routes/health.routes.js'
import { errorMiddleware } from './shared/middleware/error.middleware.js'

export const createApp = () => {
  const app = express()

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
  app.use(express.json())

  app.use('/api/v1/health', healthRouter)
  app.use('/api/v1/parking-spaces', parkingSpaceRouter)

  app.use((_request, response) => {
    response.status(404).json({ message: 'Route not found' })
  })

  app.use(errorMiddleware)
  return app
}
```

## 15. Crear cajones

```bash
curl -X POST http://localhost:3001/api/v1/parking-spaces \
  -H "Content-Type: application/json" \
  -d '{"code":"A01","zone":"A","type":"REGULAR"}'
```

Repetir con A02, A03, A04, B01 y B02.

## 16. Frontend `useParkingSpaces.ts`

```ts
import type { ParkingSpace } from '~/types/parking'

interface ParkingSpacesResponse {
  data: ParkingSpace[]
}

export const useParkingSpaces = () => {
  const api = useApi()

  const { data, error, status, refresh } = useAsyncData(
    'parking-spaces',
    () => api<ParkingSpacesResponse>('/parking-spaces'),
  )

  const spaces = computed(() => data.value?.data ?? [])
  const total = computed(() => spaces.value.length)
  const available = computed(() => spaces.value.filter(item => item.status === 'AVAILABLE').length)
  const occupied = computed(() => spaces.value.filter(item => item.status === 'OCCUPIED').length)
  const outOfService = computed(() => spaces.value.filter(item => item.status === 'OUT_OF_SERVICE').length)
  const occupancyPercentage = computed(() => total.value === 0 ? 0 : Math.round((occupied.value / total.value) * 100))

  return {
    spaces,
    total,
    available,
    occupied,
    outOfService,
    occupancyPercentage,
    error,
    status,
    refresh,
  }
}
```

## 17. Actualizar `pages/index.vue`

Cambiar `useParkingMock()` por:

```ts
const {
  spaces,
  total,
  available,
  occupied,
  outOfService,
  occupancyPercentage,
  error,
  status,
  refresh,
} = useParkingSpaces()
```

Antes del `ParkingGrid` usar:

```vue
<div v-if="status === 'pending'" class="rounded-2xl bg-white p-6 text-slate-500">
  Cargando cajones...
</div>

<div v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-6">
  <p class="font-bold text-red-700">No fue posible cargar los cajones.</p>
  <button class="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white" @click="refresh()">
    Reintentar
  </button>
</div>

<ParkingGrid v-else :spaces="spaces" @select="handleSelect" />
```

## 18. Pruebas

```bash
npm run dev:api
npm run dev:web
```

Validar `GET /api/v1/parking-spaces` y que el dashboard muestre Firestore.

## 19. Commit

```bash
git add .
git commit -m "feat: persist parking spaces with Firestore"
```

---

[← Regresar al índice](./README.md)
