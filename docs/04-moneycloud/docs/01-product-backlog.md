# Product Backlog

| ID | Historia | Criterio Given/When/Then | Sesión |
|---|---|---|---|
| HU-001 | Ver dashboard | Dado un usuario, cuando abre la página, entonces ve ingresos, egresos y saldo | 1 |
| HU-002 | Crear movimiento | Dado un monto positivo, cuando guarda, entonces aparece en lista | 2 |
| HU-003 | Consultar lista | Dado movimientos, cuando consulta, entonces ve fecha, tipo, categoría e importe | 2 |
| HU-004 | Eliminar | Dado un movimiento, cuando confirma, entonces desaparece | 2 |
| HU-005 | Balance | Dado ingresos y gastos, cuando carga resumen, entonces balance=ingresos−egresos | 2 |
| HU-006 | Docker | Dado Docker Desktop, cuando compila y ejecuta, entonces /health responde | 3 |
| HU-007 | Compose | Dado compose.yaml, cuando levanta, entonces la API queda disponible | 3 |
| HU-008 | Render | Dado repo conectado, cuando despliega, entonces /health HTTPS responde | 4 |
| HU-009 | Netlify | Dado frontend construido, cuando publica, entonces consume la API | 4 |
| HU-010 | CI | Dado push, cuando corre GitHub Actions, entonces pasan tests/build/Docker | 4 |

**Refinamiento**: priorizar HU-001 a HU-009; HU-010 al final de la cuarta sesión. Dividir HU-002 en validación, endpoint y formulario.
