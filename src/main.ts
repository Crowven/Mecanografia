import './styles/app.css';
import { mountPracticeApp } from './features/practice/practiceApp';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('No se encontró el contenedor principal de la aplicación.');
}

mountPracticeApp(app);
