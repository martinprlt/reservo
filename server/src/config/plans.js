export const PLAN_LIMITS = {
  FREE: {
    maxServicios: 3,
    maxTurnosMes: 30,
    maxUsuarios: 1,
    reportes: false,
  },
  BASICO: {
    maxServicios: 10,
    maxTurnosMes: Infinity,
    maxUsuarios: 1,
    reportes: false,
  },
  PRO: {
    maxServicios: Infinity,
    maxTurnosMes: Infinity,
    maxUsuarios: 5,
    reportes: true,
  },
  ENTERPRISE: {
    maxServicios: Infinity,
    maxTurnosMes: Infinity,
    maxUsuarios: Infinity,
    reportes: true,
  },
};

export function getPlanLimits(plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
}
