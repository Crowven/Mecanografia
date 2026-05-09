declare module '*.css';

declare module 'vite' {
  export const defineConfig: <T>(config: T) => T;
}

declare module 'vite-plugin-pwa' {
  export const VitePWA: (options: Record<string, unknown>) => unknown;
}
