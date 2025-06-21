## 📂  Project Structure
```
project-root/
├── dist/                   # Compiled output
├── docs/                   # Documentation files
├── node_modules/           # Installed dependencies
├── prisma/                 # Prisma ORM
│   ├── migrations/         # Prisma migrations
│   └── schema.prisma       # Prisma schema definition
├── src/                    # Source code
│   ├── auth/               # Authentication logic
│   ├── common/decimal/     # Shared utilities (decimal handling)
│   ├── prisma/             # Prisma service integration
│   ├── product/            # Product module (routes, service, etc.)
│   ├── user/               # User module
│   ├── app.module.ts       # Root module for NestJS
│   └── main.ts             # Application bootstrap
├── test/                   # Test cases
├── .env                    # Environment variables
├── .env.example            # Example env config
├── .gitignore              # Git ignore rules
├── .prettierrc             # Prettier code style config
├── eslint.config.mjs       # ESLint config
├── nest-cli.json           # Nest CLI config
├── package.json            # NPM package config
├── pnpm-lock.yaml          # Lockfile for pnpm
├── README.md               # This file
├── tsconfig.build.json     # TypeScript config for build
└── tsconfig.json           # TypeScript base config
```

## 🚀 Getting Started

```bash
$ pnpm install
```

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## 🛠️ Tech Stack
- Nest JS
- Typescript
- Prisma
- PNPM