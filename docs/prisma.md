### Prisma Documentation

#### 1. Installed Packages
```sh
pnpm add -D prisma
```
```sh
pnpm add @prisma/client
```
```sh
npx prisma init
```

#### 2. Update prisma.service
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}


model User {
  id Int @id @default(autoincrement())
  name String
  email String @unique
  password String
  created_at DateTime? @default(now())
  updated_at DateTime?

  @@map("users")
}
```

#### 3. Migration model
```sh
npx prisma migrate dev --name "create user table"
```

#### 4. Create prisma resources
```sh
nest g module prisma
```
```sh
nest g service prisma
```

#### 5. Create Prisma Service
```js
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
```

#### 6. Create Prisma Module
```js
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```