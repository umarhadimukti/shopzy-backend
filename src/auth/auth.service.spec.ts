import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Logger } from 'nestjs-pino';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            getUser: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const mockConfig = {
                PORT: 1000,
                NODE_ENV: 'test',
                DATABASE_URL: 'postgres://user:password@localhost:5432/testdb',
                JWT_EXPIRATION: '1h',
                JWT_SECRET: 'some-secret-key',
              };
              return mockConfig[key];
            }),
          },
        },
        {
          provide: 'JwtService',
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
