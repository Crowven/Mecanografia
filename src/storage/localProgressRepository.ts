import {
  LocalPersistenceService,
  type ExerciseHistoryRecord,
  type InitialAssessmentRecord,
  type ProgressRecord
} from '../services/localStorageService';

export type { ExerciseHistoryRecord, InitialAssessmentRecord, ProgressRecord } from '../services/localStorageService';

export interface ProgressRepository {
  list(): ProgressRecord[];
  save(record: ProgressRecord): void;
  clear(): void;
  exportJson(): string;
  importJson(json: string, options?: { merge?: boolean }): void;
}

export const isInitialAssessmentRecord = (record: ProgressRecord): record is InitialAssessmentRecord =>
  record.type === 'initial-assessment';

export const isExerciseProgressRecord = (record: ProgressRecord): record is ExerciseHistoryRecord =>
  record.type === 'exercise';

export const getLatestInitialAssessmentRecord = (
  records: ProgressRecord[]
): InitialAssessmentRecord | undefined => records.find(isInitialAssessmentRecord);

export const createLocalProgressRepository = (storageKey: string): ProgressRepository => {
  const service = new LocalPersistenceService({ storageKey });

  return {
    list() {
      return service.listProgressRecords();
    },
    save(record) {
      service.addProgressRecord(record);
    },
    clear() {
      service.clearProgressRecords();
    },
    exportJson() {
      return service.exportJson();
    },
    importJson(json, options) {
      service.importJson(json, options);
    }
  };
};
