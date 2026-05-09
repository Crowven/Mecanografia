export type AppRuntime = 'web' | 'pwa' | 'electron' | 'tauri';

export interface AppConfig {
  appName: string;
  defaultExerciseId: string;
  targetWordsPerMinute: number;
  runtime: AppRuntime;
  storageKey: string;
}

const detectRuntime = (): AppRuntime => {
  if ('__TAURI_INTERNALS__' in window) {
    return 'tauri';
  }

  if ('electronAPI' in window) {
    return 'electron';
  }

  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'pwa';
  }

  return 'web';
};

export const appConfig: AppConfig = {
  appName: 'Mecanografía',
  defaultExerciseId: 'home-row-es',
  targetWordsPerMinute: 45,
  runtime: detectRuntime(),
  storageKey: 'mecanografia:progress:v1'
};
