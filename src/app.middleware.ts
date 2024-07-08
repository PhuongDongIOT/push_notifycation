import type { INestApplication } from '@nestjs/common'
import helmet from 'helmet'

export function middleware(app: INestApplication): INestApplication {
  const isProduction = process.env.NODE_ENV === 'production'

  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? undefined : false,
      crossOriginEmbedderPolicy: isProduction ? undefined : false,
    }),
  )
  
  const CORS_OPTIONS = {
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
  };

  app.enableCors(CORS_OPTIONS)


  return app
}