import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { OnModuleInit } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, string> implements OnModuleInit, OnModuleDestroy {
    constructor(
        private readonly logger: Logger
    ) {
        super({
            log: [
                { 'emit': 'event', 'level': 'query' },
                { 'emit': 'event', 'level': 'info' },
                { 'emit': 'event', 'level': 'warn' },
                { 'emit': 'event', 'level': 'error' },
            ],
        });
    }
    async onModuleInit() {
        this.$on('query', (e) => {
            this.logger.debug(`Query [${e.query}] : ${e.params}`);
        });
        
        this.$on('error', (e) => {
            this.logger.error(`Error ${e.message}`);
        })

        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
