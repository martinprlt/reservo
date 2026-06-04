# Skill: Slotify — Turnero dinámico

## Función central

`calcularSlotsLibres(tenantId, servicioId, fecha)` en
`src/services/disponibilidad.service.js`.

Retorna: `Array<{ inicio: Date, fin: Date }>`

## Algoritmo paso a paso

```
1. Obtener servicio → duracionMinutos
   Si tiene variantes: duracion += max(variantes.map(v => v.duracionExtra || 0))

2. Si fecha < hoy → return []

3. Obtener horario del día de tenant.config.horarios[nombreDia]
   Si !horario || !horario.activo → return []
   Estructura: { apertura: '09:00', cierre: '18:00', activo: true }

4. Generar slots cada 30 min desde apertura:
   slot = { inicio, fin: inicio + duracion }
   Solo incluir si fin <= cierre
   Si fecha === hoy: excluir slots con inicio <= ahora

5. Obtener turnos del día:
   WHERE tenantId = X
     AND fechaHora BETWEEN inicioDia AND finDia
     AND estado IN ('RESERVADO', 'SENIADO', 'CONFIRMADO')
   CANCELADO y COMPLETADO NO bloquean slots

6. Detectar solapamiento — un slot está OCUPADO si:
   turno.fechaHora < slot.fin
   AND (turno.fechaHora + turno.duracion minutos) > slot.inicio

7. Retornar slots libres
```

## Casos borde obligatorios

- Fecha pasada → `[]`
- Día no laborable (`activo: false`) → `[]`
- Turno CANCELADO → no bloquea
- Slot que empieza antes del cierre pero termina después → no aparece
- Fecha = hoy → excluir slots ya pasados
- Variantes con `duracionExtra` → usar duración conservadora (máximo)

## Estado de un turno y el turnero

| Estado | ¿Bloquea slot? |
|--------|----------------|
| RESERVADO | Sí (por 15 min, hasta que expira o se paga) |
| SENIADO | Sí |
| CONFIRMADO | Sí |
| COMPLETADO | No |
| CANCELADO | No |

## Expiración de reservas

Al crear un turno se setea `expiraEn = now + 15 minutos`.
El job en `src/jobs/liberarReservas.job.js` corre cada 5 minutos
y pasa a CANCELADO los turnos RESERVADO con `expiraEn <= now`.
Cuando se paga la seña, `expiraEn` se pone en `null`.

## Config del tenant (estructura esperada)

```json
{
  "horarios": {
    "lunes":    { "apertura": "09:00", "cierre": "18:00", "activo": true },
    "martes":   { "apertura": "09:00", "cierre": "18:00", "activo": true },
    "miercoles":{ "apertura": "09:00", "cierre": "18:00", "activo": true },
    "jueves":   { "apertura": "09:00", "cierre": "18:00", "activo": true },
    "viernes":  { "apertura": "09:00", "cierre": "18:00", "activo": true },
    "sabado":   { "apertura": "10:00", "cierre": "14:00", "activo": true },
    "domingo":  { "apertura": "00:00", "cierre": "00:00", "activo": false }
  },
  "telefonoAdmin": "5493804XXXXXX"
}
```
