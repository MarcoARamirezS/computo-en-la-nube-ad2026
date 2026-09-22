# 07 — Sistema de diseño y experiencia

<!-- navigation:start -->

[← Anterior](./06-firestore-modelo-reglas.md) | [Índice del proyecto](./README.md) | [Siguiente →](./08-ruta-frontend.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

## Dirección visual

CineFlow usa un entorno cinematográfico oscuro, portadas grandes, gradientes suaves y acento coral. Mantener marca propia y atribuciones en Créditos. La experiencia prioriza descubrir, guardar y reproducir un tráiler en tres acciones o menos desde inicio.

| Token | Valor propuesto | Uso |
|---|---|---|
| Fondo | #0B0F19 | Página |
| Superficie | #161D2B | Tarjetas y paneles |
| Texto | #F8FAFC | Texto principal |
| Texto secundario | #CBD5E1 | Metadatos |
| Acento | #F43F5E | Identidad y controles destacados |
| Foco | #FDE047 | Indicador visible de teclado |
| Borde | #334155 | Separaciones |
| Espaciado | 4, 8, 12, 16, 24, 32, 48 px | Sistema consistente |
| Radio | 12 px tarjetas; 16 px diálogos | Forma |

Usar texto oscuro sobre botones coral y comprobar contraste con herramienta, no asumir que texto blanco pequeño cumple. Tipografía system-ui evita dependencias y cargas externas. Body 16 px, auxiliar 14 px, títulos con clamp. Sin autoplay de sonido ni video pesado en el hero.

## Pantallas y rutas

| Ruta | Estado requerido | Contenido |
|---|---|---|
| / | Público | Hero, filas de películas y series |
| /explorar | Público | Tipo, género y páginas |
| /buscar?q=... | Público | Resultados y término compartible |
| /titulo/:mediaType/:id | Público | Ficha, reparto y Ver tráiler |
| /acceso | Visitante | Email, contraseña, recuperación |
| /registro | Visitante | Cuenta y términos de uso |
| /recuperar | Público | Envío con respuesta neutra |
| /perfiles | Cuenta | Elegir y gestionar perfiles |
| /mi-lista | Cuenta + perfil | Favoritos |
| /historial | Cuenta + perfil | Historial de tráilers |
| /cuenta | Cuenta | Nombre, idioma, verificación y salida |
| /creditos | Público | Proveedores y alcance |
| * | Público | 404 con regreso |

Si visitante pide favorito, navegar a acceso con returnTo relativo permitido. Validar returnTo con allowlist o URL del mismo origen; nunca redirigir a dominios arbitrarios. Tras entrar, volver al título; pedir de nuevo la acción si no fue conservada de forma segura.

## Componentes y comportamiento

AppHeader fijo con espacio reservado para no tapar contenido; navegación móvil mediante botón accesible. Hero con texto sobre gradiente, no sobre imagen sin contraste. MediaCard es enlace al detalle; botón favorito separado sin anidar button dentro de enlace interactivo. MediaRow usa scroll horizontal y scroll-snap, flechas opcionales; el teclado puede recorrer tarjetas.

Dialog accesible con nombre, foco atrapado, Escape, retorno de foco y scroll bloqueado; preferir elemento dialog nativo bien implementado. TrailerPlayer conserva controles oficiales. FavoriteButton informa estado mediante aria-pressed y texto. Toast usa aria-live polite para confirmaciones, no para cada segundo de progreso.

## Estados obligatorios por pantalla

Loading con skeleton de tamaño final; empty con explicación y acción; error con reintento y requestId cuando sirva; success; offline con aviso de que cambios no se guardaron. No mostrar favorito guardado si falló el servidor. Imágenes rotas usan placeholder local y alt significativo; no reintentar infinitamente onError.

## Responsive y accesibilidad

Validar 360, 768 y 1440 px. Márgenes 16/24/48 px; tarjetas en fila con ancho estable, sin overflow horizontal de toda la página. Controles con área táctil de al menos 44×44 px como objetivo del proyecto. Incluir enlace “Saltar al contenido”, landmarks, un h1 por página, labels visibles, mensajes de error asociados y foco perceptible.

Respetar prefers-reduced-motion. Ningún dato debe mostrarse sólo al hover. Para player respetar dimensiones mínimas del proveedor, en móvil usar altura suficiente (mínimo 200 px) aunque cambie la proporción ideal. No tapar marca ni controles de YouTube.

## Criterio de revisión visual

Capturar inicio, detalle, acceso y favoritos en tres tamaños. Revisar textos largos, portada ausente, listas vacías, zoom 200%, modal y navegación por teclado. Entrega sin botones ficticios, rutas rotas ni pantallas de “próximamente” para funciones incluidas en v1.

---

<!-- navigation:start -->

[← Anterior](./06-firestore-modelo-reglas.md) | [Índice del proyecto](./README.md) | [Siguiente →](./08-ruta-frontend.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
