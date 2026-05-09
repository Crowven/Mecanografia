export interface AssessmentText {
  id: string;
  title: string;
  description: string;
  text: string;
}

export const standardAssessmentTexts: AssessmentText[] = [
  {
    id: 'evaluacion-inicial-estandar',
    title: 'Evaluación inicial estándar',
    description:
      'Texto breve para estimar precisión y velocidad neta antes de recomendar un nivel de práctica.',
    text:
      'La mecanografía mejora con práctica constante, postura cómoda y atención al ritmo. Escribe cada palabra con calma, corrige los hábitos poco a poco y busca mantener precisión antes de aumentar la velocidad.'
  }
];

export const defaultAssessmentText = standardAssessmentTexts[0];
