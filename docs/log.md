### Logger Documentation

#### 1. Installed packages
```sh
pnpm add nestjs-pino pino-http
```
```sh
pnpm add -D pino-pretty
```

#### 2. Import log module to the application module
*app.module.ts*
```js
@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction: boolean = configService.get('NODE_ENV') === 'production';
        return {
          pinoHttp: {
            transport: isProduction ? undefined : { target: 'pino-pretty', options: { singleLine: true } },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

#### 3. Set default log using pino
*main.ts*
```js
const logger = app.get(PinoLogger);
app.useLogger(logger);
```