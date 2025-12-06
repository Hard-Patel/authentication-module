# TypeORM Migrations Guide

## Setup

1. Copy `.env.example` to `.env` and configure your database connection:
   ```bash
   cp .env.example .env
   ```

2. Ensure your PostgreSQL database is running and accessible.

3. Create the migrations directory (if it doesn't exist):
   ```bash
   mkdir -p src/migrations
   ```

## Generating Migrations

To generate a new migration based on entity changes:

```bash
yarn typeorm:migration:generate -- -n MigrationName
```

**Example:**
```bash
yarn typeorm:migration:generate -- -n CreateAuthTables
```

This will create a new migration file in `src/migrations/` with a timestamp prefix.

## Creating Empty Migrations

To create an empty migration file (for manual SQL):

```bash
yarn typeorm:migration:create src/migrations/MigrationName
```

**Note:** The path must include the full path from project root: `src/migrations/YourMigrationName`

## Running Migrations

To apply all pending migrations:

```bash
yarn typeorm:migration:run
```

## Reverting Migrations

To revert the last executed migration:

```bash
yarn typeorm:migration:revert
```

## Showing Migration Status

To see which migrations have been executed:

```bash
yarn typeorm:migration:show
```

## Notes

- Migrations are stored in `src/migrations/`
- The DataSource configuration reads from `.env` file
- Always review generated migrations before running them
- In production, run migrations as part of your deployment process

## Migrating to Nx Monorepo

When moving this project into an Nx monorepo, consider the following:

1. **Path Adjustments**: Update the DataSource `migrations` path to reflect the new monorepo structure (e.g., `apps/your-app/src/migrations/*{.ts,.js}`)

2. **Entity Imports**: Ensure entity import paths are correct relative to the DataSource file location

3. **TypeScript Paths**: Configure `tsconfig.json` paths in the monorepo to resolve entity imports correctly

4. **Environment Variables**: Use Nx's environment variable management or ensure `.env` files are in the correct location relative to the app

5. **TypeORM CLI**: The migration scripts may need adjustment if the DataSource file location changes. Update the `-d` flag path in `package.json` scripts accordingly

6. **Shared Entities**: If entities are moved to a shared library, update the DataSource `entities` array to import from the library path

7. **Build Output**: Ensure migrations are included in the build output if running migrations from compiled JavaScript

