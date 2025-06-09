### Authentication Documentation

#### 1. Installed Packages

```sh
pnpm add bcrypt ms
```

```sh
pnpm add -D @types/bcrypt @types/ms
```

```sh
pnpm add @nestjs/passport @nestjs/jwt passport passport-jwt passport-local
```

```sh
pnpm add -D @types/passport @types/passport-jwt @types/passport-local
```

#### 2. Create Auth Resources

```sh
nest g module auth
```
```sh
nest g controller auth
```
```sh
nest g service auth
```

#### 3. Registering some modules in auth module
```js
@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow('JWT_EXPIRATION'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
```

#### 4. Create new decorator to get current user
```js
const getCurrentUserByContext = (context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context)
);
```

#### 5. Create Local Strategy

*auth/guards/local-auth.guard.ts*
```js
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

*auth/strategies/local.strategy.ts*
```js
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: 'email' });
    }

    public async validate(username: string, password: string) {
        return this.authService.verifyUser(username, password);
    }
}
```

#### 6. Create Auth Interface
```js
export interface TokenPayload {
    userId: number;
};
```

#### 7. Create Auth Service
```js
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    public async verifyUser(email: string, password: string) {
        try {
            const user = await this.userService.getUser({ email });
            const isAuthenticated = await bcrypt.compare(password, user.password);

            if (!isAuthenticated) {
                throw new UnauthorizedException();
            }

            return {
                id: user.id,
                email: user.email,
            }
        } catch (error) {
            throw new UnauthorizedException('Credentials are not valid');
        }
    }

    public async login(user: User, response: Response) {
        const jwtExpiration = ms(this.configService.getOrThrow('JWT_EXPIRATION'));
        const expires = new Date(Date.now() + jwtExpiration);

        const tokenPayload: TokenPayload = { userId: user.id };
        const token = this.jwtService.sign(tokenPayload);

        response.cookie('Authentication', token, {
            secure: true,
            httpOnly: true,
            expires,
        });

        return {
            status: true,
            message: 'login successful',
            tokenPayload,
        }
    }
}
```

#### 8. Create Auth Controller
```js
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    /**
     * handle login route
     * @UseGuards
     * @Post
     */
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    public async login(
        @CurrentUser() user: User,
        @Res({ passthrough: true }) response: Response,
    ) {
        return this.authService.login(user, response);
    }

}
```