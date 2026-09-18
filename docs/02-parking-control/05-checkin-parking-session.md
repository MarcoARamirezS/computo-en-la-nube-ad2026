# ParkingFlow — Sesión 05
## Check-in: vehículos, sesiones y asignación de cajón

---

## Objetivo

Registrar entrada real de un vehículo.

Reglas:

- no duplicar sesión activa,
- crear vehículo si no existe,
- asignar cajón disponible,
- marcar cajón OCCUPIED.

## 1. `vehicles/vehicle.types.ts`

```ts
export type VehicleType = 'CAR' | 'MOTORCYCLE'

export interface Vehicle {
  id: string
  plate: string
  brand?: string
  model?: string
  color?: string
  type: VehicleType
  createdAt: string
}
```

## 2. `vehicle.repository.ts`

```ts
import { db } from '../../config/firebase.js'
import type { Vehicle } from './vehicle.types.js'

const collection = db.collection('vehicles')

export const vehicleRepository = {
  async findByPlate(plate: string): Promise<Vehicle | null> {
    const snapshot = await collection.where('plate', '==', plate).limit(1).get()
    const doc = snapshot.docs[0]
    if (!doc) return null
    return { id: doc.id, ...(doc.data() as Omit<Vehicle, 'id'>) }
  },

  async create(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const ref = await collection.add(data)
    return { id: ref.id, ...data }
  },
}
```

## 3. `parking-sessions/parking-session.types.ts`

```ts
export type ParkingSessionStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface ParkingSession {
  id: string
  vehicleId: string
  parkingSpaceId: string
  entryAt: string
  exitAt: string | null
  status: ParkingSessionStatus
  durationMinutes: number | null
  total: number | null
  createdBy: string
}
```

## 4. `parking-session.schema.ts`

```ts
import { z } from 'zod'

export const checkInSchema = z.object({
  plate: z.string().min(3).max(15).transform(value => value.trim().toUpperCase()),
  brand: z.string().max(40).optional(),
  model: z.string().max(40).optional(),
  color: z.string().max(30).optional(),
  type: z.enum(['CAR', 'MOTORCYCLE']),
})
```

## 5. `parking-session.repository.ts`

```ts
import { db } from '../../config/firebase.js'
import type { ParkingSession } from './parking-session.types.js'

const sessions = db.collection('parkingSessions')
const spaces = db.collection('parkingSpaces')

export const parkingSessionRepository = {
  async findActiveByVehicle(vehicleId: string): Promise<ParkingSession | null> {
    const snapshot = await sessions
      .where('vehicleId', '==', vehicleId)
      .where('status', '==', 'ACTIVE')
      .limit(1)
      .get()

    const doc = snapshot.docs[0]
    if (!doc) return null

    return { id: doc.id, ...(doc.data() as Omit<ParkingSession, 'id'>) }
  },

  async listActive(): Promise<ParkingSession[]> {
    const snapshot = await sessions.where('status', '==', 'ACTIVE').get()
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<ParkingSession, 'id'>),
    }))
  },

  async createWithSpace(
    data: Omit<ParkingSession, 'id'>,
    vehicleType: 'CAR' | 'MOTORCYCLE',
  ): Promise<ParkingSession> {
    return db.runTransaction(async transaction => {
      const snapshot = await transaction.get(
        spaces.where('status', '==', 'AVAILABLE').where('active', '==', true),
      )

      const compatible = snapshot.docs.find(doc => {
        const type = doc.data().type
        if (vehicleType === 'MOTORCYCLE') {
          return type === 'MOTORCYCLE' || type === 'REGULAR'
        }
        return type === 'REGULAR'
      })

      if (!compatible) throw new Error('NO_AVAILABLE_SPACE')

      const sessionRef = sessions.doc()
      const finalData = { ...data, parkingSpaceId: compatible.id }

      transaction.set(sessionRef, finalData)
      transaction.update(compatible.ref, { status: 'OCCUPIED' })

      return { id: sessionRef.id, ...finalData }
    })
  },
}
```

## 6. `parking-session.service.ts`

```ts
import { vehicleRepository } from '../vehicles/vehicle.repository.js'
import { parkingSessionRepository } from './parking-session.repository.js'

export const parkingSessionService = {
  listActive() {
    return parkingSessionRepository.listActive()
  },

  async checkIn(
    input: {
      plate: string
      brand?: string
      model?: string
      color?: string
      type: 'CAR' | 'MOTORCYCLE'
    },
    userId: string,
  ) {
    let vehicle = await vehicleRepository.findByPlate(input.plate)

    if (!vehicle) {
      vehicle = await vehicleRepository.create({
        plate: input.plate,
        brand: input.brand,
        model: input.model,
        color: input.color,
        type: input.type,
        createdAt: new Date().toISOString(),
      })
    }

    const active = await parkingSessionRepository.findActiveByVehicle(vehicle.id)
    if (active) throw new Error('VEHICLE_ALREADY_INSIDE')

    return parkingSessionRepository.createWithSpace(
      {
        vehicleId: vehicle.id,
        parkingSpaceId: '',
        entryAt: new Date().toISOString(),
        exitAt: null,
        status: 'ACTIVE',
        durationMinutes: null,
        total: null,
        createdBy: userId,
      },
      input.type,
    )
  },
}
```

## 7. `parking-session.controller.ts`

```ts
import type { Request, Response } from 'express'
import { checkInSchema } from './parking-session.schema.js'
import { parkingSessionService } from './parking-session.service.js'

export const listActiveSessions = async (_request: Request, response: Response) => {
  const data = await parkingSessionService.listActive()
  response.json({ data })
}

export const checkIn = async (request: Request, response: Response) => {
  const input = checkInSchema.parse(request.body)

  try {
    const data = await parkingSessionService.checkIn(input, request.auth!.sub)
    response.status(201).json({ data })
  } catch (error) {
    if (error instanceof Error && ['VEHICLE_ALREADY_INSIDE', 'NO_AVAILABLE_SPACE'].includes(error.message)) {
      response.status(409).json({ message: error.message })
      return
    }
    throw error
  }
}
```

## 8. `parking-session.routes.ts`

```ts
import { Router } from 'express'
import { requireAuth } from '../../shared/middleware/auth.middleware.js'
import { checkIn, listActiveSessions } from './parking-session.controller.js'

export const parkingSessionRouter = Router()

parkingSessionRouter.use(requireAuth)
parkingSessionRouter.get('/active', listActiveSessions)
parkingSessionRouter.post('/', checkIn)
```

Agregar en `app.ts`:

```ts
import { parkingSessionRouter } from './modules/parking-sessions/parking-session.routes.js'

app.use('/api/v1/parking-sessions', parkingSessionRouter)
```


## 12. Pruebas

- Registrar `ABC123`.
- Debe crearse sesión.
- Un cajón debe cambiar a OCCUPIED.
- Registrar `ABC123` nuevamente → 409.

## 13. Commit

```bash
git add .
git commit -m "feat: add vehicle check-in and automatic space assignment"
```

---

[← Regresar al índice](./README.md)
