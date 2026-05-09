# Mecanografía

## Servicio de almacenamiento local

El proyecto incluye un servicio de persistencia local en `src/services/localStorageService.js` para guardar datos del usuario sin depender de un backend:

- Perfil, configuración básica y progreso se almacenan en `localStorage` con claves prefijadas por `mecanografia:`.
- El historial extenso de resultados de pruebas usa IndexedDB cuando está disponible.
- En entornos sin IndexedDB se puede usar `LocalStorageHistoryStore` como abstracción compatible o inyectar otro adaptador con los métodos `add`, `list`, `clear` y `bulkPut`.
- El servicio permite exportar e importar respaldos completos en JSON.

```js
import LocalPersistenceService from './src/services/localStorageService.js';

const storage = new LocalPersistenceService();

storage.saveProfile({ name: 'Ada' });
storage.updateConfig({ theme: 'dark' });
storage.saveProgress({ currentLessonId: 'home-row' });
await storage.addTestResult({ exerciseId: 'home-row', wpm: 48, accuracy: 97 });

const backup = await storage.exportJSON();
await storage.importJSON(backup, { merge: true });
```
