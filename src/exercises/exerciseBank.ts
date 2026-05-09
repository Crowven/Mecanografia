import { loadExerciseBank } from './loadExerciseBank';

export type ExerciseLevel = 'principiante' | 'basico' | 'intermedio' | 'avanzado' | 'experto';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  level: ExerciseLevel;
  type: string;
  suggestedDurationSeconds?: number;
  technicalObjectives: string[];
  text: string;
  tags: string[];
}

export interface ExerciseFilters {
  level?: ExerciseLevel | 'todos';
  type?: string;
  tag?: string;
}

export const exerciseBank: Exercise[] = loadExerciseBank();

export const getExerciseById = (id: string): Exercise => {
  return exerciseBank.find((exercise) => exercise.id === id) ?? exerciseBank[0];
};

export const getExerciseLevels = (exercises: Exercise[] = exerciseBank): ExerciseLevel[] =>
  Array.from(new Set(exercises.map((exercise) => exercise.level)));

export const getExerciseTypes = (exercises: Exercise[] = exerciseBank): string[] =>
  Array.from(new Set(exercises.map((exercise) => exercise.type))).sort((first, second) => first.localeCompare(second, 'es'));

export const getExerciseTags = (exercises: Exercise[] = exerciseBank): string[] =>
  Array.from(new Set(exercises.flatMap((exercise) => exercise.tags))).sort((first, second) => first.localeCompare(second, 'es'));

export const filterExercises = (exercises: Exercise[], filters: ExerciseFilters): Exercise[] =>
  exercises.filter((exercise) => {
    const matchesLevel = !filters.level || filters.level === 'todos' || exercise.level === filters.level;
    const matchesType = !filters.type || filters.type === 'todos' || exercise.type === filters.type;
    const matchesTag = !filters.tag || filters.tag === 'todos' || exercise.tags.includes(filters.tag);

    return matchesLevel && matchesType && matchesTag;
  });
