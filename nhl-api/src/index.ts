import { createApp } from './app';

const PORT = 3000;

createApp().listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
