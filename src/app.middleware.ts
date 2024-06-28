import type { INestApplication } from '@nestjs/common'
// import compression from 'compression'
import helmet from 'helmet'
// import passport from 'passport'

export function middleware(app: INestApplication): INestApplication {
  const isProduction = process.env.NODE_ENV === 'production'

  //   app.use(compression())

  //   app.use(passport.initialize())
  //   app.use(passport.session())

  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? undefined : false,
      crossOriginEmbedderPolicy: isProduction ? undefined : false,
    }),
  )

  const CORS_OPTIONS = {
    origin: ['*'], // or '*' or whatever is required
    allowedHeaders: [
    'Access-Control-Allow-Origin',
    'Origin',
    // 'X-Requested-With',
    // 'Accept',
    // 'Content-Type',
    // 'Authorization',
  ],
  credentials: true,
  methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE'],
};

  app.enableCors(CORS_OPTIONS)

  return app
}