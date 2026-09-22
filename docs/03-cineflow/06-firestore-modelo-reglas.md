# 06 — Modelo de Firestore

<!-- navigation:start -->

[← Anterior](./05-backend-completo.md) | [Índice del proyecto](./README.md) | [Siguiente →](./07-ui-ux.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->

## Colecciones

| Ruta | Campos principales |
|---|---|
| users/{uid} | displayName, locale, profileCount, createdAt, updatedAt |
| users/{uid}/profiles/{profileId} | name, avatarId, isMain, status, historyEpoch, createdAt, updatedAt |
| .../profiles/{profileId}/favorites/{mediaKey} | mediaType, mediaId, media, addedAt |
| .../profiles/{profileId}/history/{historyKey} | mediaType, mediaId, videoId, media, positionSeconds, durationSeconds, completed, version, epoch, lastPlayedAt |

Email y estado de verificación se consultan en Auth. Nunca almacenar contraseña, refresh token o ID token en estas colecciones. Todos los timestamps son Firestore Timestamp de servidor; API los serializa ISO. media es snapshot de MediaSummary, no respuesta cruda ilimitada.

## Ejemplo conceptual

Ana/main guarda movie_900001 en favorites. Bruno/main puede tener el mismo ID sin conflicto porque cada ruta tiene distinto uid. El path nunca se reconstruye tomando uid del cliente. Un ID de perfil de Ana enviado por Bruno se busca bajo users/Bruno y no encuentra datos de Ana.

## Reglas: bloquear acceso directo

Guardar en firebase/firestore.rules:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Es intencional: la app sólo usa SDK Auth; Express con Admin SDK accede a Firestore. Admin omite estas reglas, por lo que se requiere IAM y validación de propiedad en todos los servicios. Probar reglas desde SDK cliente con @firebase/rules-unit-testing; probar autorización del backend con Supertest. Una prueba no sustituye a la otra.

## Consultas e índices

Favoritos: orderBy addedAt desc y documentId desc, limit, startAfter. Historial: where epoch == profile.historyEpoch, orderBy lastPlayedAt desc y documentId desc. Definir índice compuesto del historial; orden de documentId debe coincidir con el orden elegido.

firebase/firestore.indexes.json inicial:

```json
{
  "indexes": [
    {
      "collectionGroup": "history",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "epoch", "order": "ASCENDING" },
        { "fieldPath": "lastPlayedAt", "order": "DESCENDING" },
        { "fieldPath": "__name__", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Para favoritos conservar índice descendente de addedAt y el orden correspondiente de __name__; validar consulta en proyecto de desarrollo. Los emuladores no garantizan detectar todos los índices faltantes de producción. Si el entorno exige otro índice, registrarlo en este archivo a partir de la consulta exacta y desplegarlo antes de liberar.

No filtrar completed en Firestore para “Continuar tráiler” en v1: filtrar la página obtenida y ofrecer “Ver historial”; no afirmar que representa todos los pendientes si sólo se cargó una página. Para listado completo de pendientes futuro agregar ruta/índice y contrato específico.

## Integridad y concurrencia

- Creación de perfil lee/escribe profileCount en transacción, main cuenta dentro de cinco.
- Cada escritura personal lee perfil activo en la misma transacción.
- Cada progreso usa expectedVersion; no confiar en timestamps del dispositivo.
- historyEpoch permite invalidar historial previo durante limpieza. Si se recrea la misma historyKey en un epoch nuevo, tratarla como registro nuevo expectedVersion=0.
- Limpieza física de epochs viejos debe volver a leer cada registro dentro de transacción antes de eliminar: si fue actualizado al epoch nuevo, conservarlo. No borrar a ciegas una lista de IDs antigua.
- Borrar perfil elimina subcolecciones primero, padre y contador al final. Reintentar es seguro.

## Retención y costos

v1 conserva historial hasta que el usuario lo borre. Informar este comportamiento en la pantalla de cuenta. Listar en páginas de 20, máximo 50, sin listeners permanentes. Registrar métricas de peticiones y errores, no consumo detallado por persona en logs. Crear presupuesto/alertas en el proyecto real según el uso esperado; no se fijan costos inventados.

---

<!-- navigation:start -->

[← Anterior](./05-backend-completo.md) | [Índice del proyecto](./README.md) | [Siguiente →](./07-ui-ux.md)

[🏠 Índice general](../../README.md)

<!-- navigation:end -->
