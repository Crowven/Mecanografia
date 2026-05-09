import type { AppConfig } from '../config/appConfig';

export interface PlatformCapabilities {
  runtimeLabel: string;
  installable: boolean;
  desktopShell: boolean;
}

export const getPlatformCapabilities = (config: AppConfig): PlatformCapabilities => ({
  runtimeLabel:
    config.runtime === 'pwa'
      ? 'PWA instalada'
      : config.runtime === 'electron'
        ? 'Electron'
        : config.runtime === 'tauri'
          ? 'Tauri'
          : 'Web',
  installable: config.runtime === 'web' || config.runtime === 'pwa',
  desktopShell: config.runtime === 'electron' || config.runtime === 'tauri'
});
