# Consulta — Qué guarda Firestore en la versión sencilla

<!-- navigation:start -->

[← Anterior](./04-contrato-api.md) | [Índice CineFlow](./README.md) | [Siguiente →](./07-ui-ux.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

**No necesitas crear colecciones manualmente.** Después del primer registro y PUT /api/me aparecerá el documento automáticamente.

## Modelo acotado para aprender

Un documento por cuenta en `cineflowUsers/{uid}` contiene nombre y hasta cinco perfiles. Cada perfil tiene un mapa de favoritos y un mapa de historial. Esto reduce la cantidad de código, evita índices compuestos y permite que una sola transacción mantenga consistente la cuenta.

```text
cineflowUsers
  uid-de-la-cuenta
    name: "Mi cuenta"
    profiles:
      - id: "main"
        name: "Principal"
        favorites: { movie_900001: ... }
        history: { movie_900001_videoId: ... }
```

## Límites explícitos

- Máximo cinco perfiles por cuenta.
- Máximo 50 favoritos por perfil. Si se llena, quitar alguno antes de agregar otro.
- Historial conserva los 50 tráilers más recientes de cada perfil.
- Las sinopsis no se duplican en favoritos/historial; se consultan en la ficha.
- El backend rechaza el estado si el JSON excede 400 KB, dejando margen respecto al límite de documento de Firestore.

Esta elección es para un proyecto educativo pequeño. No es un diseño para millones de eventos o miles de favoritos por usuario. El modelo anterior con subcolecciones queda como evolución futura: aquí se prioriza poder leer y entender todo el código.

## Verificar tu primer guardado

1. Completa etapa 4 y crea tu cuenta.
2. En Firebase Console abre Authentication y confirma que aparece el usuario.
3. Abre Firestore → Data → cineflowUsers.
4. Abre el documento cuyo ID coincide con el uid de Authentication.
5. Comprueba nombre y perfil main.
6. En etapa 6 guarda un favorito y actualiza la consola: aparece bajo favorites del perfil seleccionado.

No guardes contraseñas, tokens o claves privadas en este documento. La API construye el path a partir del uid verificado, no de un uid enviado por formulario.

## Actualización y borrado

Cada modificación usa una transacción de Firestore. Así dos altas simultáneas de perfil no superan el máximo. El callback no llama a TMDB ni realiza efectos externos, ya que Firestore puede reintentarlo. Borrar un perfil elimina sus mapas dentro del mismo documento; no quedan subcolecciones huérfanas. main no se puede borrar.

La sincronización ocurre al guardar o pulsar Actualizar, no mediante listeners en tiempo real. En otro dispositivo pulsa Actualizar para ver lo guardado.

## Qué no hace esta versión

No migra colecciones previas, no incluye borrado completo de cuenta, panel administrador ni cierre global de sesiones. Cerrar sesión actúa en el dispositivo actual. El historial no demuestra consumo real y no debe utilizarse como evidencia de facturación. Mantener estas funciones fuera del ejercicio reduce complejidad sin fingir que están implementadas.

---

<!-- navigation:start -->

[← Anterior](./04-contrato-api.md) | [Índice CineFlow](./README.md) | [Siguiente →](./07-ui-ux.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
