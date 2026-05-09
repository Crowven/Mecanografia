export interface Exercise {
  id: string;
  title: string;
  description: string;
  level: 'inicial' | 'intermedio' | 'avanzado';
  text: string;
  tags: string[];
}

export const exerciseBank: Exercise[] = [
  {
    id: 'home-row-es',
    title: 'Fila guía en español',
    description: 'Practica precisión con palabras frecuentes y acentos comunes.',
    level: 'inicial',
    text: 'casa sala ala fada jara cada nada dada asada salsas caras claras alas',
    tags: ['fila-guia', 'español']
  },
  {
    id: 'punctuation-flow',
    title: 'Ritmo con puntuación',
    description: 'Entrena pausas, comas y puntos sin perder velocidad.',
    level: 'intermedio',
    text: 'La práctica diaria mejora la memoria muscular, reduce errores y aumenta la confianza.',
    tags: ['puntuación', 'fluidez']
  },
  {
    id: 'accented-words',
    title: 'Acentos y signos',
    description: 'Refuerza caracteres propios del español.',
    level: 'avanzado',
    text: '¿Quién escribió la canción? María, José y Lucía revisarán rápidamente el guion.',
    tags: ['acentos', 'signos']
  }
];

export const getExerciseById = (id: string): Exercise => {
  return exerciseBank.find((exercise) => exercise.id === id) ?? exerciseBank[0];
};
