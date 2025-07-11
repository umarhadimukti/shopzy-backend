import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Logger } from 'nestjs-pino';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
