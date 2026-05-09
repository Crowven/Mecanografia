import type { TypingMetrics } from '../core/metrics/metricsCalculator';
import type { RecommendedLevel } from '../domain/initialAssessment';

export interface ExerciseProgressRecord {
  type?: 'exercise';
  exerciseId: string;
  completedAt: string;
  metrics: TypingMetrics;
}

export interface InitialAssessmentProgressRecord {
  type: 'initial-assessment';
  completedAt: string;
  durationSeconds: number;
  accuracy: number;
  keystrokesPerMinute: number;
  grossWordsPerMinute: number;
  netWordsPerMinute: number;
  recommendedLevel: RecommendedLevel;
}

export type ProgressRecord = ExerciseProgressRecord | InitialAssessmentProgressRecord;

export interface ProgressRepository {
  list(): ProgressRecord[];
  save(record: ProgressRecord): void;
  clear(): void;
}

export const isInitialAssessmentRecord = (record: ProgressRecord): record is InitialAssessmentProgressRecord =>
  record.type === 'initial-assessment';

export const getLatestInitialAssessmentRecord = (
  records: ProgressRecord[]
): InitialAssessmentProgressRecord | undefined => records.find(isInitialAssessmentRecord);

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
