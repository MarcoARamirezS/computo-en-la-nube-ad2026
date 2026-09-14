# ParkingFlow — Sesión 02
## Dashboard Nuxt 4: componentes, estructuras y datos mock

---

## Objetivo

Construir la primera interfaz real del estacionamiento utilizando datos locales.

Al terminar:

- dashboard responsive,
- tarjetas de resumen,
- grid de cajones,
- componentes reutilizables,
- tipos TypeScript,
- composable local,
- props y eventos.

## 1. Crear estructura

```text
apps/web/app/
├── components/
│   ├── parking/
│   │   ├── ParkingSpaceCard.vue
│   │   ├── ParkingGrid.vue
│   │   └── ParkingSummary.vue
│   └── ui/
│       └── BaseBadge.vue
├── composables/
│   └── useParkingMock.ts
├── pages/
│   └── index.vue
└── types/
    └── parking.ts
```

### macOS

```bash
mkdir -p apps/web/app/components/parking
mkdir -p apps/web/app/components/ui
mkdir -p apps/web/app/types
```

### Windows

```powershell
New-Item -ItemType Directory -Force apps/web/app/components/parking
New-Item -ItemType Directory -Force apps/web/app/components/ui
New-Item -ItemType Directory -Force apps/web/app/types
```

## 2. `app/types/parking.ts`

```ts
export type ParkingSpaceStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'OUT_OF_SERVICE'

export type ParkingSpaceType =
  | 'REGULAR'
  | 'DISABLED'
  | 'MOTORCYCLE'

export interface ParkingSpace {
  id: string
  code: string
  zone: string
  type: ParkingSpaceType
  status: ParkingSpaceStatus
  active: boolean
}
```

## 3. `app/composables/useParkingMock.ts`

```ts
import type {
  ParkingSpace,
  ParkingSpaceStatus,
} from '~/types/parking'

export const useParkingMock = () => {
  const spaces = ref<ParkingSpace[]>([
    { id: 'A01', code: 'A01', zone: 'A', type: 'REGULAR', status: 'AVAILABLE', active: true },
    { id: 'A02', code: 'A02', zone: 'A', type: 'REGULAR', status: 'OCCUPIED', active: true },
    { id: 'A03', code: 'A03', zone: 'A', type: 'DISABLED', status: 'AVAILABLE', active: true },
    { id: 'A04', code: 'A04', zone: 'A', type: 'REGULAR', status: 'OUT_OF_SERVICE', active: true },
    { id: 'B01', code: 'B01', zone: 'B', type: 'REGULAR', status: 'AVAILABLE', active: true },
    { id: 'B02', code: 'B02', zone: 'B', type: 'MOTORCYCLE', status: 'OCCUPIED', active: true },
  ])

  const total = computed(() => spaces.value.length)
  const available = computed(() => spaces.value.filter(item => item.status === 'AVAILABLE').length)
  const occupied = computed(() => spaces.value.filter(item => item.status === 'OCCUPIED').length)
  const outOfService = computed(() => spaces.value.filter(item => item.status === 'OUT_OF_SERVICE').length)

  const occupancyPercentage = computed(() => {
    if (total.value === 0) return 0
    return Math.round((occupied.value / total.value) * 100)
  })

  const updateStatus = (id: string, status: ParkingSpaceStatus) => {
    const space = spaces.value.find(item => item.id === id)
    if (space) space.status = status
  }

  return {
    spaces,
    total,
    available,
    occupied,
    outOfService,
    occupancyPercentage,
    updateStatus,
  }
}
```

## 4. `components/ui/BaseBadge.vue`

```vue
<script setup lang="ts">
type Variant = 'success' | 'danger' | 'warning' | 'neutral'

interface Props {
  variant?: Variant
}

withDefaults(defineProps<Props>(), {
  variant: 'neutral',
})

const classes: Record<Variant, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-red-100 text-red-700',
  warning: 'bg-amber-100 text-amber-700',
  neutral: 'bg-slate-100 text-slate-700',
}
</script>

<template>
  <span
    class="inline-flex rounded-full px-3 py-1 text-xs font-bold"
    :class="classes[variant]"
  >
    <slot />
  </span>
</template>
```

## 5. `components/parking/ParkingSpaceCard.vue`

```vue
<script setup lang="ts">
import type { ParkingSpace } from '~/types/parking'

interface Props {
  space: ParkingSpace
}

defineProps<Props>()

const emit = defineEmits<{
  select: [space: ParkingSpace]
}>()

const statusData = {
  AVAILABLE: { label: 'Disponible', variant: 'success' as const },
  OCCUPIED: { label: 'Ocupado', variant: 'danger' as const },
  OUT_OF_SERVICE: { label: 'Fuera de servicio', variant: 'warning' as const },
}
</script>

<template>
  <button
    type="button"
    class="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    @click="emit('select', space)"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">Cajón</p>
        <p class="mt-1 text-2xl font-black text-slate-900">{{ space.code }}</p>
      </div>

      <BaseBadge :variant="statusData[space.status].variant">
        {{ statusData[space.status].label }}
      </BaseBadge>
    </div>

    <dl class="mt-5 grid grid-cols-2 gap-3 text-sm">
      <div>
        <dt class="text-slate-400">Zona</dt>
        <dd class="font-semibold text-slate-700">{{ space.zone }}</dd>
      </div>
      <div>
        <dt class="text-slate-400">Tipo</dt>
        <dd class="font-semibold text-slate-700">{{ space.type }}</dd>
      </div>
    </dl>
  </button>
</template>
```

## 6. `components/parking/ParkingGrid.vue`

```vue
<script setup lang="ts">
import type { ParkingSpace } from '~/types/parking'

interface Props {
  spaces: ParkingSpace[]
}

defineProps<Props>()

const emit = defineEmits<{
  select: [space: ParkingSpace]
}>()
</script>

<template>
  <section>
    <div class="mb-5 flex items-center justify-between">
      <h2 class="text-xl font-bold text-slate-900">Estado del estacionamiento</h2>
      <span class="text-sm text-slate-500">{{ spaces.length }} cajones</span>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ParkingSpaceCard
        v-for="space in spaces"
        :key="space.id"
        :space="space"
        @select="emit('select', $event)"
      />
    </div>
  </section>
</template>
```

## 7. `components/parking/ParkingSummary.vue`

```vue
<script setup lang="ts">
interface Props {
  total: number
  available: number
  occupied: number
  outOfService: number
  occupancyPercentage: number
}

defineProps<Props>()
</script>

<template>
  <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
    <article class="rounded-2xl bg-slate-900 p-5 text-white">
      <p class="text-sm text-slate-300">Total</p>
      <p class="mt-2 text-3xl font-black">{{ total }}</p>
    </article>
    <article class="rounded-2xl bg-emerald-600 p-5 text-white">
      <p class="text-sm text-emerald-100">Disponibles</p>
      <p class="mt-2 text-3xl font-black">{{ available }}</p>
    </article>
    <article class="rounded-2xl bg-red-600 p-5 text-white">
      <p class="text-sm text-red-100">Ocupados</p>
      <p class="mt-2 text-3xl font-black">{{ occupied }}</p>
    </article>
    <article class="rounded-2xl bg-amber-500 p-5 text-white">
      <p class="text-sm text-amber-100">Fuera de servicio</p>
      <p class="mt-2 text-3xl font-black">{{ outOfService }}</p>
    </article>
    <article class="rounded-2xl bg-indigo-600 p-5 text-white">
      <p class="text-sm text-indigo-100">Ocupación</p>
      <p class="mt-2 text-3xl font-black">{{ occupancyPercentage }}%</p>
    </article>
  </section>
</template>
```

## 8. `app/pages/index.vue`

```vue
<script setup lang="ts">
import type { ParkingSpace } from '~/types/parking'

const {
  spaces,
  total,
  available,
  occupied,
  outOfService,
  occupancyPercentage,
} = useParkingMock()

const selectedSpace = ref<ParkingSpace | null>(null)

const handleSelect = (space: ParkingSpace) => {
  selectedSpace.value = space
}
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto max-w-7xl px-6 py-10">
        <p class="text-sm font-black uppercase tracking-widest text-indigo-600">ParkingFlow</p>
        <h1 class="mt-2 text-4xl font-black text-slate-900">Dashboard de estacionamiento</h1>
        <p class="mt-3 max-w-2xl text-slate-600">
          Visualización de cajones mediante componentes y estructuras TypeScript.
        </p>
      </div>
    </header>

    <div class="mx-auto max-w-7xl space-y-10 px-6 py-10">
      <ParkingSummary
        :total="total"
        :available="available"
        :occupied="occupied"
        :out-of-service="outOfService"
        :occupancy-percentage="occupancyPercentage"
      />

      <div
        v-if="selectedSpace"
        class="rounded-2xl border border-indigo-200 bg-indigo-50 p-5"
      >
        <p class="text-xs font-black uppercase tracking-widest text-indigo-600">Selección</p>
        <p class="mt-2 text-slate-700">
          Cajón <strong>{{ selectedSpace.code }}</strong> — {{ selectedSpace.status }}
        </p>
      </div>

      <ParkingGrid :spaces="spaces" @select="handleSelect" />
    </div>
  </main>
</template>
```

## 9. Ejecutar

```bash
npm run dev:web
```

## 10. Validaciones

- Deben aparecer 6 cajones.
- Los estados deben mostrarse visualmente.
- Al seleccionar un cajón debe aparecer su información.
- Los contadores deben coincidir.
- El layout debe responder en móvil y escritorio.

## 11. Build y pruebas

```bash
npm run test -w apps/web
npm run build -w apps/web
```

## 12. Commit

```bash
git add .
git commit -m "feat: add parking dashboard with reusable components"
```

---

[← Regresar al índice](./README.md)
