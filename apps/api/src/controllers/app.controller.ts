import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async health() {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return { status: 'ok', db: 'ok' }
    } catch (e) {
      return { status: 'degraded', db: 'error' }
    }
  }
}
