# ParkingFlow — Sesión 04
## Usuarios + bcryptjs + JWT access/refresh + roles

---

## Objetivo

Agregar autenticación segura con:

- bcryptjs,
- access token,
- refresh token,
- cookie HttpOnly,
- middleware de autenticación,
- roles ADMIN y OPERATOR,
- login Nuxt.

## 1. Instalar dependencias

```bash
npm install -w apps/api bcryptjs jsonwebtoken cookie-parser
npm install -D -w apps/api @types/jsonwebtoken @types/cookie-parser
```

## 2. Variables de entorno

Agregar a `apps/api/.env`:

```env
JWT_ACCESS_SECRET=change-me-access-secret-minimum-32-characters
JWT_REFRESH_SECRET=change-me-refresh-secret-minimum-32-characters
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
COOKIE_SECURE=false
```

## 3. Actualizar `env.ts`

Agregar al schema existente:

```ts
JWT_ACCESS_SECRET: z.string().min(32),
JWT_REFRESH_SECRET: z.string().min(32),
ACCESS_TOKEN_TTL: z.string().default('15m'),
REFRESH_TOKEN_TTL: z.string().default('7d'),
COOKIE_SECURE: z.string().default('false').transform(value => value === 'true'),
```

## 4. `src/modules/users/user.types.ts`

```ts
export type UserRole = 'ADMIN' | 'OPERATOR'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  active: boolean
  passwordHash: string
  createdAt: string
}

export type PublicUser = Omit<User, 'passwordHash'>
```

## 5. `user.repository.ts`

```ts
import { db } from '../../config/firebase.js'
import type { User } from './user.types.js'

const collection = db.collection('users')

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await collection.where('email', '==', email).limit(1).get()
    const doc = snapshot.docs[0]
    if (!doc) return null
    return { id: doc.id, ...(doc.data() as Omit<User, 'id'>) }
  },

  async findById(id: string): Promise<User | null> {
    const doc = await collection.doc(id).get()
    if (!doc.exists) return null
    return { id: doc.id, ...(doc.data() as Omit<User, 'id'>) }
  },

  async create(data: Omit<User, 'id'>): Promise<User> {
    const ref = await collection.add(data)
    return { id: ref.id, ...data }
  },
}
```

## 6. `shared/security/password.ts`

```ts
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const verifyPassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
}
```

## 7. `shared/security/jwt.ts`

```ts
import jwt from 'jsonwebtoken'
import { env } from '../../config/env.js'

export interface TokenPayload {
  sub: string
  email: string
  role: 'ADMIN' | 'OPERATOR'
}

export const signAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions['expiresIn'],
  })
}

export const signRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_TTL as jwt.SignOptions['expiresIn'],
  })
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload
}
```

## 8. `modules/auth/auth.schema.ts`

```ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(100),
})

export const createUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(100),
  role: z.enum(['ADMIN', 'OPERATOR']),
})
```

## 9. `modules/auth/auth.service.ts`

```ts
import { hashPassword, verifyPassword } from '../../shared/security/password.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../shared/security/jwt.js'
import { userRepository } from '../users/user.repository.js'
import type { PublicUser, User } from '../users/user.types.js'

const toPublicUser = (user: User): PublicUser => {
  const { passwordHash: _passwordHash, ...safe } = user
  return safe
}

export const authService = {
  async createUser(input: {
    name: string
    email: string
    password: string
    role: 'ADMIN' | 'OPERATOR'
  }) {
    const existing = await userRepository.findByEmail(input.email)
    if (existing) throw new Error('EMAIL_ALREADY_EXISTS')

    const passwordHash = await hashPassword(input.password)

    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      role: input.role,
      active: true,
      passwordHash,
      createdAt: new Date().toISOString(),
    })

    return toPublicUser(user)
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email)
    if (!user || !user.active) throw new Error('INVALID_CREDENTIALS')

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) throw new Error('INVALID_CREDENTIALS')

    const payload = { sub: user.id, email: user.email, role: user.role }

    return {
      user: toPublicUser(user),
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    }
  },

  async refresh(token: string) {
    const payload = verifyRefreshToken(token)
    const user = await userRepository.findById(payload.sub)
    if (!user || !user.active) throw new Error('INVALID_REFRESH_TOKEN')

    return {
      accessToken: signAccessToken({ sub: user.id, email: user.email, role: user.role }),
      user: toPublicUser(user),
    }
  },
}
```

## 10. `auth.controller.ts`

```ts
import type { Request, Response } from 'express'
import { env } from '../../config/env.js'
import { loginSchema } from './auth.schema.js'
import { authService } from './auth.service.js'

const cookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: 'lax' as const,
  path: '/api/v1/auth',
}

export const login = async (request: Request, response: Response) => {
  const input = loginSchema.parse(request.body)

  try {
    const result = await authService.login(input.email, input.password)
    response.cookie('refreshToken', result.refreshToken, cookieOptions)
    response.json({
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    })
  } catch {
    response.status(401).json({ message: 'Invalid credentials' })
  }
}

export const refresh = async (request: Request, response: Response) => {
  const token = request.cookies?.refreshToken
  if (!token) {
    response.status(401).json({ message: 'Refresh token required' })
    return
  }

  try {
    const result = await authService.refresh(token)
    response.json({ data: result })
  } catch {
    response.status(401).json({ message: 'Invalid refresh token' })
  }
}

export const logout = (_request: Request, response: Response) => {
  response.clearCookie('refreshToken', cookieOptions)
  response.status(204).send()
}
```

## 11. `auth.routes.ts`

```ts
import { Router } from 'express'
import { login, logout, refresh } from './auth.controller.js'

export const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/refresh', refresh)
authRouter.post('/logout', logout)
```

## 12. `shared/middleware/auth.middleware.ts`

```ts
import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../security/jwt.js'

declare global {
  namespace Express {
    interface Request {
      auth?: {
        sub: string
        email: string
        role: 'ADMIN' | 'OPERATOR'
      }
    }
  }
}

export const requireAuth = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const header = request.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    response.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    request.auth = verifyAccessToken(header.substring(7))
    next()
  } catch {
    response.status(401).json({ message: 'Invalid or expired token' })
  }
}
```

## 13. `role.middleware.ts`

```ts
import type { NextFunction, Request, Response } from 'express'

export const requireRole = (...roles: Array<'ADMIN' | 'OPERATOR'>) => {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.auth || !roles.includes(request.auth.role)) {
      response.status(403).json({ message: 'Forbidden' })
      return
    }
    next()
  }
}
```

## 14. Actualizar `app.ts`

Agregar:

```ts
import cookieParser from 'cookie-parser'
import { authRouter } from './modules/auth/auth.routes.js'
```

Después de `express.json()`:

```ts
app.use(cookieParser())
```

Agregar:

```ts
app.use('/api/v1/auth', authRouter)
```

## 15. Crear ADMIN inicial

`src/scripts/create-admin.ts`

```ts
import { authService } from '../modules/auth/auth.service.js'

const run = async () => {
  const user = await authService.createUser({
    name: 'Administrador',
    email: 'admin@parkingflow.local',
    password: 'Admin123!',
    role: 'ADMIN',
  })
  console.log(user)
}

run().catch(error => {
  console.error(error)
  process.exit(1)
})
```

Agregar script a `apps/api/package.json`:

```json
"seed:admin": "tsx src/scripts/create-admin.ts"
```

Ejecutar una vez:

```bash
npm run seed:admin -w apps/api
```

## 16. Store frontend `app/stores/auth.ts`

```ts
interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'OPERATOR'
  active: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => Boolean(accessToken.value && user.value))

  const setSession = (token: string, nextUser: User) => {
    accessToken.value = token
    user.value = nextUser
  }

  const clearSession = () => {
    accessToken.value = null
    user.value = null
  }

  return { accessToken, user, isAuthenticated, setSession, clearSession }
})
```

## 17. Actualizar `useApi.ts`

```ts
export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  return $fetch.create({
    baseURL: config.public.apiBaseUrl,
    credentials: 'include',
    onRequest({ options }) {
      if (auth.accessToken) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${auth.accessToken}`)
      }
    },
  })
}
```

## 18. `pages/login.vue`

```vue
<script setup lang="ts">
const email = ref('admin@parkingflow.local')
const password = ref('Admin123!')
const errorMessage = ref<string | null>(null)
const loading = ref(false)

const auth = useAuthStore()
const api = useApi()

const submit = async () => {
  loading.value = true
  errorMessage.value = null

  try {
    const response = await api<{
      data: {
        accessToken: string
        user: {
          id: string
          name: string
          email: string
          role: 'ADMIN' | 'OPERATOR'
          active: boolean
        }
      }
    }>('/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })

    auth.setSession(response.data.accessToken, response.data.user)
    await navigateTo('/')
  } catch {
    errorMessage.value = 'Credenciales inválidas.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-slate-950 px-6">
    <form class="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl" @submit.prevent="submit">
      <p class="text-sm font-black uppercase tracking-widest text-indigo-600">ParkingFlow</p>
      <h1 class="mt-2 text-3xl font-black text-slate-900">Iniciar sesión</h1>

      <label class="mt-8 block">
        <span class="text-sm font-semibold text-slate-700">Correo</span>
        <input v-model="email" type="email" class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
      </label>

      <label class="mt-5 block">
        <span class="text-sm font-semibold text-slate-700">Contraseña</span>
        <input v-model="password" type="password" class="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
      </label>

      <p v-if="errorMessage" class="mt-4 text-sm font-semibold text-red-600">{{ errorMessage }}</p>

      <button type="submit" class="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white disabled:opacity-60" :disabled="loading">
        {{ loading ? 'Ingresando...' : 'Entrar' }}
      </button>
    </form>
  </main>
</template>
```

## 19. Prueba

Abrir `http://localhost:3000/login` y autenticarse con el usuario seed.

## 20. Commit

```bash
git add .
git commit -m "feat: add bcrypt and JWT authentication"
```

---

[← Regresar al índice](./README.md)
