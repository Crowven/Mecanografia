import {
  LocalPersistenceService,
  type ExerciseHistoryRecord,
  type FreeTestResultRecord,
  type InitialAssessmentRecord,
  type ProgressRecord
} from '../services/localStorageService';

export type { ExerciseHistoryRecord, FreeTestResultRecord, InitialAssessmentRecord, ProgressRecord } from '../services/localStorageService';

export interface ProgressRepository {
  list(): ProgressRecord[];
  listFreeTestResults(): FreeTestResultRecord[];
  save(record: ProgressRecord): void;
  saveFreeTestResult(record: Partial<FreeTestResultRecord>): FreeTestResultRecord;
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
    listFreeTestResults() {
      return service.exportData().freeTestResults;
    },
    save(record) {
      service.addProgressRecord(record);
    },
    saveFreeTestResult(record) {
      return service.addFreeTestResult(record);
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
