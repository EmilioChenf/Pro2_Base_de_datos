import app from './app.js';
import { env } from './config/env.js';
import { waitForDatabase } from './db/pool.js';

async function bootstrap() {
  await waitForDatabase();

  app.listen(env.port, () => {
    console.log(`[server] Backend escuchando en el puerto ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('[server] No fue posible iniciar el backend.', error);
  process.exit(1);
});
