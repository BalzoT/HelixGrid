import { Module } from '@nestjs/common'
import { AppController } from './controllers/app.controller'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
