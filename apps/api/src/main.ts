import 'dotenv/config'
import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('v1')
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001)
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
