import type { AppConfig } from '../config/appConfig';
import type { PlatformCapabilities } from '../platform/platformAdapter';

export const renderHeader = (config: AppConfig, capabilities: PlatformCapabilities): string => `
  <header class="app-header">
    <div>
      <p class="eyebrow">Entrenador modular</p>
      <h1>${config.appName}</h1>
      <p>Practica precisión, ritmo y velocidad con una arquitectura lista para web, PWA y escritorio.</p>
    </div>
    <aside class="runtime-card" aria-label="Entorno de ejecución">
      <span>Runtime</span>
      <strong>${capabilities.runtimeLabel}</strong>
    </aside>
  </header>
`;
