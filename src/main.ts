require('dotenv').config()
import { otelSDK } from './tracing.adapter'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { fastifyStatic } from '@fastify/static'
import { Logger as NestLogger } from '@nestjs/common'
import multiPart from '@fastify/multipart'

import { join } from 'path'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { env } from '@/config/config'

import { AppModule } from './app.module'
import { middleware } from './app.middleware'

declare const module: any

async function bootstrap() {
  // Start SDK before nestjs factory create
  await otelSDK.start()
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )

  app.register(fastifyStatic, {
    root: join(__dirname, 'public')
  })

  app.register(multiPart)
  

  const config = new DocumentBuilder()
    .setTitle('Daily warning')
    .setDescription('The Daily warning API description')
    .setVersion('1.0')
    .addTag('dailyWarning')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  middleware(app)
  await app.listen(env.PORT_APP || 3000)
}

void (async (): Promise<void> => {
  try {
    const url = await bootstrap()
    NestLogger.log(url, 'Bootstrap')
  } catch (error) {
    NestLogger.error(error, 'Bootstrap')
  }
})()