# Consulta — Diseño visual explicado sin herramientas extra

<!-- navigation:start -->

[← Anterior](./06-firestore-modelo-reglas.md) | [Índice CineFlow](./README.md) | [Siguiente →](./08-ruta-frontend.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

## Objetivo

Que el alumno pueda encontrar un título, abrirlo y guardar un favorito con una interfaz clara en teléfono y computadora. No necesitas Figma ni una librería de componentes para comenzar.

| Elemento | Decisión | Motivo |
|---|---|---|
| Fondo | Azul marino #0B0F19 | Ambiente cinematográfico |
| Paneles | #161D2B | Separar bloques |
| Botón principal | Rosa #FB7185 con texto oscuro | Destacar la acción |
| Texto secundario | #CBD5E1 | Mantener legibilidad |
| Foco | Amarillo #FDE047 | Ver posición del teclado |
| Tarjetas | Rejilla que adapta columnas | Móvil sin scroll horizontal global |
| Tipografía | system-ui | Sin descarga adicional |

## Dónde modificar estilos

El archivo único `apps/web/src/styles.css` contiene Tailwind y las clases básicas. Cambiar `.panel` actualiza paneles; `.btn` actualiza botones; `.grid-media` controla tarjetas. En la etapa 1 se copia completo. No hagas un CSS nuevo por cada pantalla al principio.

## Revisión rápida después de cada etapa

1. Abre DevTools y prueba ancho 390 px.
2. Comprueba que no hay scroll horizontal de toda la página.
3. Navega con Tab: todos los controles deben tener foco visible.
4. Envía un formulario incompleto: debe informar qué falta.
5. Detén API: debe verse error, no una pantalla vacía.
6. Comprueba que las imágenes ausentes no impiden leer el título.
7. Usa zoom 200% y verifica que los controles siguen accesibles.

## Textos correctos

Usar “Ver tráiler”, “Mi lista”, “Historial de tráilers” y “Actualizar desde la nube”. No usar “Ver película completa”. El botón Cuenta / Acceso abre el formulario o la cuenta según haya sesión. Mostrar el perfil activo en el encabezado ayuda a evitar guardar en otra lista.

La guía usa una página de reproducción integrada, no un modal complejo, para facilitar el manejo de foco y el ciclo de vida del player. No se ocultan los controles oficiales de YouTube.

---

<!-- navigation:start -->

[← Anterior](./06-firestore-modelo-reglas.md) | [Índice CineFlow](./README.md) | [Siguiente →](./08-ruta-frontend.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
