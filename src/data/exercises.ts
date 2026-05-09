export type ExerciseCategory =
  | 'fila-guia'
  | 'coordinacion'
  | 'repeticion-letras'
  | 'silabas'
  | 'palabras-simples';

export type HandFocus = 'izquierda' | 'derecha' | 'ambas';

export interface TypingExercise {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  level: 'inicial';
  handFocus: HandFocus;
  keys: string[];
  content: string[];
}

export const initialExercises: TypingExercise[] = [
  {
    id: 'fila-guia-posicion-base',
    title: 'Posición base en fila guía',
    description:
      'Practica la ubicación inicial de los dedos sobre A S D F y J K L Ñ sin mirar el teclado.',
    category: 'fila-guia',
    level: 'inicial',
    handFocus: 'ambas',
    keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ñ'],
    content: ['asdf jklñ', 'asdf jklñ', 'a s d f j k l ñ', 'asdf asdf jklñ jklñ'],
  },
  {
    id: 'mano-izquierda-fila-guia',
    title: 'Mano izquierda: A S D F',
    description: 'Refuerza la memoria muscular de la mano izquierda en la fila guía.',
    category: 'repeticion-letras',
    level: 'inicial',
    handFocus: 'izquierda',
    keys: ['a', 's', 'd', 'f'],
    content: ['aaaa ssss dddd ffff', 'asdf fdsa', 'asa dad faf', 'adsf sfda'],
  },
  {
    id: 'mano-derecha-fila-guia',
    title: 'Mano derecha: J K L Ñ',
    description: 'Refuerza la memoria muscular de la mano derecha en la fila guía.',
    category: 'repeticion-letras',
    level: 'inicial',
    handFocus: 'derecha',
    keys: ['j', 'k', 'l', 'ñ'],
    content: ['jjjj kkkk llll ññññ', 'jklñ ñlkj', 'jkj lñl ñjñ', 'jkñl lñkj'],
  },
  {
    id: 'coordinacion-alternada',
    title: 'Coordinación alternada de ambas manos',
    description:
      'Alterna letras de izquierda y derecha para ganar ritmo y coordinación entre ambas manos.',
    category: 'coordinacion',
    level: 'inicial',
    handFocus: 'ambas',
    keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ñ'],
    content: ['aj sk dl fñ', 'ak sl dñ fj', 'af jñ sd kl', 'a j s k d l f ñ'],
  },
  {
    id: 'silabas-fila-guia',
    title: 'Sílabas con fila guía',
    description: 'Construye sílabas sencillas usando solo letras de la fila guía.',
    category: 'silabas',
    level: 'inicial',
    handFocus: 'ambas',
    keys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
    content: ['la las ala sala', 'da das dada lada', 'fa fal faja', 'ka kala alfalfa'],
  },
  {
    id: 'palabras-simples-fila-guia',
    title: 'Palabras simples de fila guía',
    description: 'Practica palabras cortas para pasar de letras aisladas a escritura con significado.',
    category: 'palabras-simples',
    level: 'inicial',
    handFocus: 'ambas',
    keys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
    content: ['ala sala falda', 'sal dada falla', 'alas lada faja', 'salsa alfalfa'],
  },
];

export default initialExercises;
