import ejerciciosBasicosData from '../../data/ejercicios-basicos.json';
import ejerciciosData from '../../data/ejercicios.json';
import textosAvanzadosData from '../../data/textos_avanzados.json';
import type { Exercise, ExerciseLevel } from './exerciseBank';

type CoreExerciseEntry = {
  id: string;
  titulo: string;
  nivel: string;
  tipo: string;
  texto: string;
  duracion_sugerida_segundos?: number;
  objetivos_tecnicos?: string[];
  etiquetas?: string[];
};

type BasicExerciseEntry = {
  id: string;
  titulo: string;
  nivel: string;
  tipo: string;
  duracion_estimada?: string;
  dificultad?: number;
  objetivos_tecnicos?: string[];
  contenido: string[];
};

type BasicExerciseBank = {
  idioma?: string;
  filas_trabajadas?: string[];
  ejercicios: BasicExerciseEntry[];
};

type AdvancedTextEntry = {
  id: string;
  categoria: string;
  titulo: string;
  dificultad: string;
  texto: string;
  metadatos?: {
    presencia_cifras?: boolean;
    puntuacion?: boolean;
    simbolos_especiales?: string[];
    numero_palabras?: number;
  };
};

const LEVEL_ALIASES: Record<string, ExerciseLevel> = {
  inicial: 'principiante',
  principiante: 'principiante',
  básico: 'basico',
  basico: 'basico',
  intermedio: 'intermedio',
  avanzado: 'avanzado',
  experto: 'experto'
};

const normalizeTextValue = (value: string): string => value.trim().toLocaleLowerCase('es-ES');

const normalizeLevel = (level: string): ExerciseLevel => LEVEL_ALIASES[normalizeTextValue(level)] ?? 'intermedio';

const normalizeTags = (tags: string[]): string[] =>
  Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)));

const parseDurationEstimate = (durationEstimate?: string): number | undefined => {
  if (!durationEstimate) {
    return undefined;
  }

  const minutes = durationEstimate.match(/(\d+(?:[.,]\d+)?)\s*min/i);
  if (minutes) {
    return Math.round(Number(minutes[1].replace(',', '.')) * 60);
  }

  const seconds = durationEstimate.match(/(\d+(?:[.,]\d+)?)\s*s/i);
  if (seconds) {
    return Math.round(Number(seconds[1].replace(',', '.')));
  }

  return undefined;
};

const createExercise = (exercise: Exercise): Exercise => exercise;

export const loadPrimaryExerciseBank = (entries: CoreExerciseEntry[] = ejerciciosData): Exercise[] =>
  entries.map((entry) =>
    createExercise({
      id: entry.id,
      title: entry.titulo,
      description: `${entry.tipo.replaceAll('_', ' ')} · ${entry.nivel}`,
      level: normalizeLevel(entry.nivel),
      type: entry.tipo,
      suggestedDurationSeconds: entry.duracion_sugerida_segundos,
      technicalObjectives: entry.objetivos_tecnicos ?? [],
      text: entry.texto,
      tags: normalizeTags([...(entry.etiquetas ?? []), entry.tipo, 'banco-principal'])
    })
  );

export const loadBasicExerciseBank = (bank: BasicExerciseBank = ejerciciosBasicosData): Exercise[] =>
  bank.ejercicios.map((entry) =>
    createExercise({
      id: entry.id,
      title: entry.titulo,
      description: `${entry.tipo} · dificultad ${entry.dificultad ?? 1}`,
      level: normalizeLevel(entry.nivel),
      type: entry.tipo,
      suggestedDurationSeconds: parseDurationEstimate(entry.duracion_estimada),
      technicalObjectives: entry.objetivos_tecnicos ?? [],
      text: entry.contenido.join(' '),
      tags: normalizeTags([
        entry.tipo,
        `dificultad-${entry.dificultad ?? 1}`,
        ...(bank.filas_trabajadas ?? []),
        'banco-basico'
      ])
    })
  );

export const loadAdvancedTextBank = (entries: AdvancedTextEntry[] = textosAvanzadosData): Exercise[] =>
  entries.map((entry) =>
    createExercise({
      id: `avanzado-${entry.id}`,
      title: entry.titulo,
      description: `Texto ${entry.categoria} avanzado`,
      level: normalizeLevel(entry.dificultad),
      type: entry.categoria,
      technicalObjectives: [
        'Mantener precisión en textos largos',
        ...(entry.metadatos?.puntuacion ? ['Gestionar puntuación variada sin romper el ritmo'] : []),
        ...(entry.metadatos?.presencia_cifras ? ['Practicar números dentro de texto corrido'] : [])
      ],
      text: entry.texto,
      tags: normalizeTags([
        entry.categoria,
        'texto-avanzado',
        ...(entry.metadatos?.puntuacion ? ['puntuacion'] : []),
        ...(entry.metadatos?.presencia_cifras ? ['cifras'] : []),
        ...(entry.metadatos?.simbolos_especiales ?? [])
      ])
    })
  );

export const loadExerciseBank = (): Exercise[] => [
  ...loadPrimaryExerciseBank(),
  ...loadBasicExerciseBank(),
  ...loadAdvancedTextBank()
];
