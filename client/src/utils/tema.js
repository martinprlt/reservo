export function aplicarTema(config) {
  if (!config) return;

  const root = document.documentElement;

  if (config.colorPrimario) {
    root.style.setProperty('--color-primary', config.colorPrimario);
  }

  if (config.colorSecondary) {
    root.style.setProperty('--color-secondary', config.colorSecondary);
  }

  if (config.colorAccent) {
    root.style.setProperty('--color-accent', config.colorAccent);
  }

  if (config.logo) {
    const logoEl = document.querySelector('[data-tenant-logo]');
    if (logoEl) logoEl.src = config.logo;
  }
}

export function resetTema() {
  const root = document.documentElement;
  root.style.removeProperty('--color-primary');
  root.style.removeProperty('--color-secondary');
  root.style.removeProperty('--color-accent');
}
