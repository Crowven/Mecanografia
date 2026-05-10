import type { TypingMetrics } from '../core/metrics/metricsCalculator';
import type { RecommendedLevel } from '../domain/initialAssessment';

export const PERSISTENCE_SCHEMA_VERSION = 1;
export const DEFAULT_PERSISTENCE_KEY = 'mecanografia:persistence:v1';

const LEGACY_PROGRESS_KEY = 'mecanografia:progress:v1';

export type JsonObject = Record<string, unknown>;

export interface UserProfile {
  id: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  theme: 'system' | 'light' | 'dark';
  language: 'es';
  soundEnabled: boolean;
  showKeyboard: boolean;
  difficulty: 'normal' | 'precision' | 'speed';
  maxHistoryItems: number | null;
  updatedAt: string;
}

export interface ExerciseHistoryRecord {
  id: string;
  type: 'exercise';
  exerciseId: string;
  completedAt: string;
  metrics: TypingMetrics;
}

export interface InitialAssessmentRecord {
  id: string;
  type: 'initial-assessment';
  completedAt: string;
  durationSeconds: number;
  accuracy: number;
  keystrokesPerMinute: number;
  grossWordsPerMinute: number;
  netWordsPerMinute: number;
  recommendedLevel: RecommendedLevel;
}

export interface FreeTestResultRecord {
  id: string;
  completedAt: string;
  title: string;
  durationSeconds: number;
  textLength: number;
  accuracy: number;
  keystrokesPerMinute: number;
  grossWordsPerMinute: number;
  netWordsPerMinute: number;
  raw?: JsonObject | null;
}

export interface LevelProgressRecord {
  level: RecommendedLevel;
  completedExercises: string[];
  bestNetWordsPerMinute: number;
  bestAccuracy: number;
  attempts: number;
  updatedAt: string;
}

export interface LocalPersistenceDataV1 {
  schemaVersion: typeof PERSISTENCE_SCHEMA_VERSION;
  profile: UserProfile | null;
  settings: UserSettings;
  initialAssessment: InitialAssessmentRecord | null;
  exerciseHistory: ExerciseHistoryRecord[];
  freeTestResults: FreeTestResultRecord[];
  levelProgress: Record<RecommendedLevel, LevelProgressRecord>;
  updatedAt: string;
}

export type ProgressRecord = ExerciseHistoryRecord | InitialAssessmentRecord;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface ImportPersistenceOptions {
  merge?: boolean;
}

const DEFAULT_SETTINGS: UserSettings = Object.freeze({
  theme: 'system',
  language: 'es',
  soundEnabled: true,
  showKeyboard: true,
  difficulty: 'normal',
  maxHistoryItems: null,
  updatedAt: ''
});

const LEVELS: RecommendedLevel[] = ['inicial', 'basico', 'intermedio', 'avanzado', 'experto'];

const nowIso = (): string => new Date().toISOString();

const createId = (prefix = 'id'): string => {
  const random = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${prefix}_${random}`;
};

const getBrowserLocalStorage = (): StorageLike | undefined => {
  if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
    return globalThis.localStorage;
  }

  return undefined;
};

const parseStoredJson = <T>(value: string | null, fallback: T): T => {
  if (value == null || value === '') return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

function assertPlainObject(value: unknown, name: string): asserts value is JsonObject {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${name} debe ser un objeto JSON.`);
  }
}

const uniqueById = <T extends { id: string }>(records: T[]): T[] => {
  const byId = new Map<string, T>();
  records.forEach((record) => byId.set(record.id, record));
  return [...byId.values()];
};

const sortByCompletedAtDesc = <T extends { completedAt: string }>(records: T[]): T[] =>
  [...records].sort((a, b) => b.completedAt.localeCompare(a.completedAt));

const isRecommendedLevel = (value: unknown): value is RecommendedLevel =>
  typeof value === 'string' && LEVELS.includes(value as RecommendedLevel);

const normalizeLevelProgressRecord = (
  level: RecommendedLevel,
  record?: Partial<LevelProgressRecord>
): LevelProgressRecord => ({
  level,
  completedExercises: Array.isArray(record?.completedExercises) ? [...new Set(record.completedExercises)] : [],
  bestNetWordsPerMinute: Number(record?.bestNetWordsPerMinute ?? 0),
  bestAccuracy: Number(record?.bestAccuracy ?? 0),
  attempts: Number(record?.attempts ?? 0),
  updatedAt: record?.updatedAt ?? nowIso()
});

const createEmptyLevelProgress = (): Record<RecommendedLevel, LevelProgressRecord> =>
  LEVELS.reduce(
    (progress, level) => ({
      ...progress,
      [level]: normalizeLevelProgressRecord(level)
    }),
    {} as Record<RecommendedLevel, LevelProgressRecord>
  );

const createDefaultData = (): LocalPersistenceDataV1 => {
  const timestamp = nowIso();

  return {
    schemaVersion: PERSISTENCE_SCHEMA_VERSION,
    profile: null,
    settings: { ...DEFAULT_SETTINGS, updatedAt: timestamp },
    initialAssessment: null,
    exerciseHistory: [],
    freeTestResults: [],
    levelProgress: createEmptyLevelProgress(),
    updatedAt: timestamp
  };
};

const normalizeExerciseRecord = (record: Partial<ExerciseHistoryRecord>): ExerciseHistoryRecord => {
  if (!record.exerciseId) {
    throw new TypeError('El registro de ejercicio debe incluir exerciseId.');
  }

  if (!record.metrics) {
    throw new TypeError('El registro de ejercicio debe incluir métricas.');
  }

  return {
    id: record.id ?? createId('exercise'),
    type: 'exercise',
    exerciseId: record.exerciseId,
    completedAt: record.completedAt ?? nowIso(),
    metrics: record.metrics
  };
};

const normalizeInitialAssessmentRecord = (record: Partial<InitialAssessmentRecord>): InitialAssessmentRecord => {
  if (!isRecommendedLevel(record.recommendedLevel)) {
    throw new TypeError('La evaluación inicial debe incluir un nivel recomendado válido.');
  }

  return {
    id: record.id ?? createId('assessment'),
    type: 'initial-assessment',
    completedAt: record.completedAt ?? nowIso(),
    durationSeconds: Number(record.durationSeconds ?? 0),
    accuracy: Number(record.accuracy ?? 0),
    keystrokesPerMinute: Number(record.keystrokesPerMinute ?? 0),
    grossWordsPerMinute: Number(record.grossWordsPerMinute ?? 0),
    netWordsPerMinute: Number(record.netWordsPerMinute ?? 0),
    recommendedLevel: record.recommendedLevel
  };
};

const normalizeFreeTestResult = (record: Partial<FreeTestResultRecord>): FreeTestResultRecord => ({
  id: record.id ?? createId('free-test'),
  completedAt: record.completedAt ?? nowIso(),
  title: record.title ?? 'Prueba libre',
  durationSeconds: Number(record.durationSeconds ?? 0),
  textLength: Number(record.textLength ?? 0),
  accuracy: Number(record.accuracy ?? 0),
  keystrokesPerMinute: Number(record.keystrokesPerMinute ?? 0),
  grossWordsPerMinute: Number(record.grossWordsPerMinute ?? 0),
  netWordsPerMinute: Number(record.netWordsPerMinute ?? 0),
  raw: record.raw ?? null
});


const recommendedLevelFromExerciseId = (exerciseId: string): RecommendedLevel => {
  if (exerciseId.startsWith('EXP')) return 'experto';
  if (exerciseId.startsWith('AVA')) return 'avanzado';
  if (exerciseId.startsWith('INT')) return 'intermedio';
  if (exerciseId.startsWith('BAS')) return 'basico';
  return 'inicial';
};

const updateLevelProgressFromExercise = (
  levelProgress: Record<RecommendedLevel, LevelProgressRecord>,
  record: ExerciseHistoryRecord
): Record<RecommendedLevel, LevelProgressRecord> => {
  const level = recommendedLevelFromExerciseId(record.exerciseId);
  const current = levelProgress[level];

  return {
    ...levelProgress,
    [level]: {
      ...current,
      completedExercises: [...new Set([...current.completedExercises, record.exerciseId])],
      bestNetWordsPerMinute: Math.max(current.bestNetWordsPerMinute, record.metrics.netWordsPerMinute),
      bestAccuracy: Math.max(current.bestAccuracy, record.metrics.accuracy),
      attempts: current.attempts + 1,
      updatedAt: nowIso()
    }
  };
};

const normalizeProgressRecord = (record: ProgressRecord): ProgressRecord =>
  record.type === 'initial-assessment' ? normalizeInitialAssessmentRecord(record) : normalizeExerciseRecord(record);

const normalizeData = (data: unknown): LocalPersistenceDataV1 => {
  assertPlainObject(data, 'Los datos de persistencia');
  const defaults = createDefaultData();
  const rawLevelProgress = data.levelProgress && typeof data.levelProgress === 'object' ? data.levelProgress : {};

  return {
    schemaVersion: PERSISTENCE_SCHEMA_VERSION,
    profile: data.profile && typeof data.profile === 'object' ? data.profile as UserProfile : defaults.profile,
    settings: {
      ...defaults.settings,
      ...(data.settings && typeof data.settings === 'object' ? data.settings as Partial<UserSettings> : {})
    },
    initialAssessment: data.initialAssessment && typeof data.initialAssessment === 'object'
      ? normalizeInitialAssessmentRecord(data.initialAssessment as Partial<InitialAssessmentRecord>)
      : null,
    exerciseHistory: Array.isArray(data.exerciseHistory)
      ? sortByCompletedAtDesc(data.exerciseHistory.map((record) => normalizeExerciseRecord(record)))
      : [],
    freeTestResults: Array.isArray(data.freeTestResults)
      ? sortByCompletedAtDesc(data.freeTestResults.map((record) => normalizeFreeTestResult(record)))
      : [],
    levelProgress: LEVELS.reduce(
      (progress, level) => ({
        ...progress,
        [level]: normalizeLevelProgressRecord(
          level,
          (rawLevelProgress as Partial<Record<RecommendedLevel, Partial<LevelProgressRecord>>>)[level]
        )
      }),
      {} as Record<RecommendedLevel, LevelProgressRecord>
    ),
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : defaults.updatedAt
  };
};

export class LocalPersistenceService {
  private readonly storage: StorageLike;
  private readonly storageKey: string;
  private readonly legacyProgressKey: string;

  constructor({
    storage = getBrowserLocalStorage(),
    storageKey = DEFAULT_PERSISTENCE_KEY,
    legacyProgressKey = LEGACY_PROGRESS_KEY
  }: {
    storage?: StorageLike;
    storageKey?: string;
    legacyProgressKey?: string;
  } = {}) {
    if (!storage) {
      throw new Error('localStorage no está disponible. Inyecta un adaptador compatible para pruebas o SSR.');
    }

    this.storage = storage;
    this.storageKey = storageKey;
    this.legacyProgressKey = legacyProgressKey;
    this.migrateLegacyProgressIfNeeded();
  }

  getData(): LocalPersistenceDataV1 {
    return normalizeData(parseStoredJson(this.storage.getItem(this.storageKey), createDefaultData()));
  }

  saveData(data: LocalPersistenceDataV1): LocalPersistenceDataV1 {
    const normalized = normalizeData({ ...data, schemaVersion: PERSISTENCE_SCHEMA_VERSION, updatedAt: nowIso() });
    this.storage.setItem(this.storageKey, JSON.stringify(normalized));
    return normalized;
  }

  updateData(updater: (data: LocalPersistenceDataV1) => LocalPersistenceDataV1): LocalPersistenceDataV1 {
    return this.saveData(updater(this.getData()));
  }

  getProfile(): UserProfile | null {
    return this.getData().profile;
  }

  saveProfile(profile: Partial<UserProfile>): UserProfile {
    const previous = this.getProfile();
    const timestamp = nowIso();
    const nextProfile: UserProfile = {
      id: profile.id ?? previous?.id ?? createId('profile'),
      displayName: profile.displayName ?? previous?.displayName ?? 'Estudiante',
      createdAt: previous?.createdAt ?? profile.createdAt ?? timestamp,
      updatedAt: timestamp
    };

    this.updateData((data) => ({ ...data, profile: nextProfile }));
    return nextProfile;
  }

  getSettings(): UserSettings {
    return this.getData().settings;
  }

  saveSettings(settings: Partial<UserSettings>): UserSettings {
    const nextSettings: UserSettings = { ...this.getSettings(), ...settings, updatedAt: nowIso() };
    this.updateData((data) => ({ ...data, settings: nextSettings }));
    return nextSettings;
  }

  listProgressRecords(): ProgressRecord[] {
    const data = this.getData();
    return sortByCompletedAtDesc([
      ...data.exerciseHistory,
      ...(data.initialAssessment ? [data.initialAssessment] : [])
    ]);
  }

  addProgressRecord(record: ProgressRecord): ProgressRecord {
    const normalized = normalizeProgressRecord(record);

    this.updateData((data) => {
      if (normalized.type === 'initial-assessment') {
        return { ...data, initialAssessment: normalized };
      }

      const maxHistoryItems = data.settings.maxHistoryItems;
      const history = sortByCompletedAtDesc(uniqueById([normalized, ...data.exerciseHistory]));

      return {
        ...data,
        exerciseHistory: typeof maxHistoryItems === 'number' ? history.slice(0, maxHistoryItems) : history,
        levelProgress: updateLevelProgressFromExercise(data.levelProgress, normalized)
      };
    });

    return normalized;
  }

  clearProgressRecords(): void {
    this.updateData((data) => ({
      ...data,
      initialAssessment: null,
      exerciseHistory: [],
      freeTestResults: [],
      levelProgress: createEmptyLevelProgress()
    }));
  }

  addFreeTestResult(record: Partial<FreeTestResultRecord>): FreeTestResultRecord {
    const normalized = normalizeFreeTestResult(record);
    this.updateData((data) => ({
      ...data,
      freeTestResults: sortByCompletedAtDesc(uniqueById([normalized, ...data.freeTestResults]))
    }));
    return normalized;
  }

  exportData(): LocalPersistenceDataV1 {
    return this.getData();
  }

  exportJson(space = 2): string {
    return JSON.stringify(this.exportData(), null, space);
  }

  importData(data: unknown, { merge = false }: ImportPersistenceOptions = {}): LocalPersistenceDataV1 {
    const incoming = normalizeData(data);

    if (!merge) {
      return this.saveData(incoming);
    }

    return this.updateData((current) => ({
      ...incoming,
      profile: incoming.profile ?? current.profile,
      settings: { ...current.settings, ...incoming.settings, updatedAt: nowIso() },
      initialAssessment: incoming.initialAssessment ?? current.initialAssessment,
      exerciseHistory: sortByCompletedAtDesc(uniqueById([...incoming.exerciseHistory, ...current.exerciseHistory])),
      freeTestResults: sortByCompletedAtDesc(uniqueById([...incoming.freeTestResults, ...current.freeTestResults])),
      levelProgress: LEVELS.reduce(
        (progress, level) => ({
          ...progress,
          [level]: {
            ...current.levelProgress[level],
            ...incoming.levelProgress[level],
            completedExercises: [
              ...new Set([
                ...current.levelProgress[level].completedExercises,
                ...incoming.levelProgress[level].completedExercises
              ])
            ],
            bestNetWordsPerMinute: Math.max(
              current.levelProgress[level].bestNetWordsPerMinute,
              incoming.levelProgress[level].bestNetWordsPerMinute
            ),
            bestAccuracy: Math.max(current.levelProgress[level].bestAccuracy, incoming.levelProgress[level].bestAccuracy),
            attempts: current.levelProgress[level].attempts + incoming.levelProgress[level].attempts,
            updatedAt: nowIso()
          }
        }),
        {} as Record<RecommendedLevel, LevelProgressRecord>
      )
    }));
  }

  importJson(json: string, options?: ImportPersistenceOptions): LocalPersistenceDataV1 {
    return this.importData(JSON.parse(json) as unknown, options);
  }

  clearAll(): void {
    this.storage.removeItem(this.storageKey);
  }

  private migrateLegacyProgressIfNeeded(): void {
    if (this.storage.getItem(this.storageKey)) return;

    const legacyRecords = parseStoredJson<ProgressRecord[] | null>(this.storage.getItem(this.legacyProgressKey), null);
    if (!Array.isArray(legacyRecords) || legacyRecords.length === 0) return;

    const data = createDefaultData();
    legacyRecords.forEach((record) => {
      const normalized = normalizeProgressRecord(record);
      if (normalized.type === 'initial-assessment') {
        data.initialAssessment = normalized;
      } else {
        data.exerciseHistory.push(normalized);
      }
    });

    data.exerciseHistory = sortByCompletedAtDesc(data.exerciseHistory);
    this.saveData(data);
  }
}

export const createLocalPersistenceService = (storageKey = DEFAULT_PERSISTENCE_KEY): LocalPersistenceService =>
  new LocalPersistenceService({ storageKey });
