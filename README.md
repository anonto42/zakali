root/
├── src/
│   ├── modules/                  # Core modules of the application (features)
│   │   ├── auth/                 # Authentication module (JWT, OAuth, etc.)
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.strategy.ts  # JWT strategy or other authentication strategies
│   │   │   ├── jwt.guard.ts      # JWT guard for protecting routes
│   │   ├── user/                 # User-related features
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.module.ts
│   │   │   ├── user.entity.ts    # Database model or schema
│   │   │   ├── user.repository.ts
│   │   ├── product/              # Product-related features (example)
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   ├── product.module.ts
│   │   │   ├── product.entity.ts
│   │   │   ├── product.repository.ts
│   ├── common/                   # Shared modules and utilities
│   │   ├── filters/              # Custom exception filters
│   │   │   ├── http-exception.filter.ts
│   │   ├── interceptors/         # Response interceptors, logging, etc.
│   │   │   ├── logging.interceptor.ts
│   │   ├── pipes/                # Validation and transformation pipes
│   │   │   ├── validation.pipe.ts
│   │   ├── guards/               # Global guards (auth guards, roles, etc.)
│   │   │   ├── roles.guard.ts
│   │   ├── utils/                # Utility classes/functions
│   │   │   ├── hash.utils.ts
│   │   │   ├── logger.util.ts
│   ├── config/                   # Configuration-related files
│   │   ├── app.config.ts         # Global application config (dotenv)
│   │   ├── database.config.ts    # DB connection and config
│   ├── database/                 # Database-related files
│   │   ├── database.module.ts    # Database module (TypeORM, Mongoose, etc.)
│   │   ├── database.service.ts   # Service for interacting with the DB
│   │   ├── database.providers.ts # DB providers, repositories
│   ├── main.ts                   # Application entry point
│   ├── app.module.ts             # Root module of the app
├── test/                         # Unit and integration tests
│   ├── auth/
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.service.spec.ts
│   ├── user/
│   │   ├── user.controller.spec.ts
│   │   ├── user.service.spec.ts
│   ├── product/
│   │   ├── product.controller.spec.ts
│   │   ├── product.service.spec.ts
├── .env                          # Environment variables
├── .env.example                  # Example environment variables for dev or staging
├── docker-compose.yml            # Docker Compose config for multi-container deployment (optional)
├── Dockerfile                    # Dockerfile for building app container (optional)
├── package.json                  # Main dependencies
├── tsconfig.json                 # TypeScript configuration
├── tslint.json                   # TSLint configuration (optional, or you can use ESLint)
├── jest.config.js                # Jest configuration for tests
├── README.md                     # Project documentation
└── node_modules/                 # Node.js modules
# zakali
