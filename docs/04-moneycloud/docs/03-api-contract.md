# Contrato API v1

Base local: `http://localhost:3001` · base cloud: `https://<servicio>.onrender.com`.

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/health` | `200 {"status":"ok","service":"moneycloud-api"}` |
| GET | `/api/v1/transactions` | `200 {"data":[...]}` |
| POST | `/api/v1/transactions` | `201 {"data":{...}}` o `400` |
| DELETE | `/api/v1/transactions/:id` | `204` o `404` |
| GET | `/api/v1/summary` | `200 {"data":{"incomeCents":0,"expenseCents":0,"balanceCents":0,"count":0}}` |

POST ejemplo:
```json
{"type":"expense","description":"Comida","category":"Alimentos","amountCents":12950}
```

Validaciones: tipo `income|expense`; descripción 2–100 caracteres; categoría 2–40; amountCents entero positivo hasta 100000000. Campos extra rechazados. Fechas ISO UTC generadas por backend. Errores de infraestructura retornan `500` genérico.
