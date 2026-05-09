import type { TypingMetrics } from '../core/metrics/metricsCalculator';

export interface ProgressRecord {
  exerciseId: string;
  completedAt: string;
  metrics: TypingMetrics;
}

export interface ProgressRepository {
  list(): ProgressRecord[];
  save(record: ProgressRecord): void;
  clear(): void;
}

export const createLocalProgressRepository = (storageKey: string): ProgressRepository => ({
  list() {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) {
      return [];
    }

    try {
      return JSON.parse(rawValue) as ProgressRecord[];
    } catch {
      window.localStorage.removeItem(storageKey);
      return [];
    }
  },
  save(record) {
    const records = this.list();
    window.localStorage.setItem(storageKey, JSON.stringify([record, ...records].slice(0, 25)));
  },
  clear() {
    window.localStorage.removeItem(storageKey);
  }
});
