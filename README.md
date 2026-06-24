# AI SQL Assistant

Production-ready Node.js + Express backend for an AI SQL Assistant powered by MySQL, Prisma, JWT authentication, and Ollama Llama3.

## Tech Stack

- Node.js 18+
- Express.js
- MySQL
- Prisma ORM
- JWT authentication
- bcryptjs
- dotenv
- cors
- helmet
- express-validator
- morgan
- express-rate-limit
- Ollama with Llama3

## Backend Folder Structure

```text
backend/
  prisma/
    schema.prisma
  src/
    config/
      database.js
      env.js
    controllers/
      analyticsController.js
      authController.js
      historyController.js
      queryController.js
    middleware/
      auth.js
      errorHandler.js
      rateLimiter.js
      validateRequest.js
    routes/
      analyticsRoutes.js
      authRoutes.js
      historyRoutes.js
      queryRoutes.js
    services/
      analyticsService.js
      ollamaService.js
      queryService.js
    utils/
      ApiError.js
      asyncHandler.js
      jwt.js
      sqlSafety.js
    app.js
    server.js
  .env.example
  package.json
```

## Installation Commands

Create a local database in MySQL Workbench first:

1. Open MySQL Workbench and connect to your local MySQL server.
2. Open a new SQL tab.
3. Run:

```sql
CREATE DATABASE ai_sql_assistant;
```

Then install and migrate the backend:

```bash
cd backend
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Install and run Ollama Llama3:

```bash
ollama pull llama3
ollama run llama3
```

The API runs at `http://localhost:5000` by default.

## Environment Variables

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="mysql://root:your_mysql_password@localhost:3306/ai_sql_assistant"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3"
DEFAULT_QUERY_LIMIT=100
MAX_QUERY_LIMIT=1000
ALLOW_MUTATION_QUERIES=false
```

Use a long random `JWT_SECRET` in production and keep `.env` out of git.

Exact local MySQL `DATABASE_URL` format:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
```

For a default MySQL Workbench local setup:

```env
DATABASE_URL="mysql://root:your_mysql_password@localhost:3306/ai_sql_assistant"
```

## Database Tables

The Prisma schema defines:

- `User`
- `QueryHistory`
- `SavedQuery`
- `QueryExecution`
- `Analytics`

## API Routes

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile`
- `POST /query/generate`
- `POST /query/validate`
- `POST /query/impact`
- `POST /query/optimize`
- `POST /query/execute`
- `GET /history`
- `POST /history/save`
- `GET /analytics`

Protected routes require:

```http
Authorization: Bearer <jwt_token>
```

## Security Notes

- Passwords are hashed with `bcryptjs`.
- JWT auth is enforced on query, history, analytics, and profile routes.
- Helmet sets secure HTTP headers.
- CORS is restricted by `CORS_ORIGIN`.
- Rate limiting is enabled globally, with stricter auth and AI limits.
- SQL execution is read-only by default. Mutation queries require `allowMutation: true` and `ALLOW_MUTATION_QUERIES=true` or explicit route opt-in.
- Only one SQL statement is allowed per request.

## Postman Examples

Register:

```http
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "Dev User",
  "email": "dev@example.com",
  "password": "password123"
}
```

Login:

```http
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "dev@example.com",
  "password": "password123"
}
```

Profile:

```http
GET http://localhost:5000/auth/profile
Authorization: Bearer <jwt_token>
```

Generate SQL with Ollama:

```http
POST http://localhost:5000/query/generate
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "question": "Show the top 10 users by number of saved queries",
  "schemaContext": "User(id, name, email), SavedQuery(id, userId, title, createdAt)"
}
```

Validate SQL:

```http
POST http://localhost:5000/query/validate
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "sql": "SELECT id, name, email FROM `User` LIMIT 10"
}
```

Impact analysis:

```http
POST http://localhost:5000/query/impact
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "sql": "SELECT * FROM `QueryHistory` WHERE `userId` = '00000000-0000-0000-0000-000000000000'"
}
```

Optimize SQL:

```http
POST http://localhost:5000/query/optimize
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "sql": "SELECT * FROM `QueryHistory` WHERE `userId` = ? ORDER BY `createdAt` DESC",
  "schemaContext": "QueryHistory has indexes on userId and createdAt"
}
```

Execute SQL:

```http
POST http://localhost:5000/query/execute
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "sql": "SELECT id, title, sql FROM `SavedQuery` ORDER BY `createdAt` DESC",
  "limit": 25
}
```

Get history:

```http
GET http://localhost:5000/history?page=1&limit=20
Authorization: Bearer <jwt_token>
```

Save query:

```http
POST http://localhost:5000/history/save
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Recent saved queries",
  "description": "Useful dashboard query",
  "sql": "SELECT id, title FROM `SavedQuery` ORDER BY `createdAt` DESC",
  "tags": ["dashboard", "saved-query"]
}
```

Analytics:

```http
GET http://localhost:5000/analytics
Authorization: Bearer <jwt_token>
```

## Production Checklist

- Set `NODE_ENV=production`.
- Use a managed MySQL instance and run `npm run prisma:deploy`.
- Set a strong `JWT_SECRET`.
- Set exact frontend domains in `CORS_ORIGIN`.
- Put the API behind HTTPS.
- Keep Ollama on a private network.
- Add centralized logs and process management such as PM2, Docker, or your platform runtime.
