# URL Shortener - Dev Notes

## PostgreSQL Setup

```sql
CREATE DATABASE url_shortener;
```

```sql
CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(20) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Packages

```bash
npm install express pg dotenv nanoid
npm install -D typescript ts-node @types/node @types/express @types/pg
```

## Environment Variable

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/url_shortener
```

## DB Connection

```ts
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

## Architecture

```text
Route
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
PostgreSQL
```

### Responsibilities

- Route → Maps endpoints
- Controller → Handles req/res
- Service → Business logic
- Repository → SQL queries
- Database → Stores data

## Common Mistakes

### Wrong Package

❌

```ts
import { Pool } from "pq";
```

✅

```ts
import { Pool } from "pg";
```

### Import Issue

❌

```ts
const pool = require("./config/db");
```

✅

```ts
import { pool } from "./config/db";
```

### Route Usage

❌

```http
POST /shorten/www.youtube.com
```

✅

```http
POST /shorten
```

```json
{
  "url": "https://youtube.com"
}
```

### Params Access

❌

```ts
const { shortCode } = req.params.shortCode;
```

✅

```ts
const { shortCode } = req.params;
```

## Error Flow

```text
Controller
 ↓
asyncHandler
 ↓
errorHandler
 ↓
Response
```

## Current Progress

- [x] PostgreSQL Installed
- [x] Database Created
- [x] Table Created
- [x] DB Connected
- [x] Repository Layer
- [x] Service Layer
- [x] Controller Layer

## Next Tasks

- [ ] POST /shorten
- [ ] GET /:shortCode
- [ ] Redirect URL
- [ ] URL Validation
- [ ] Click Count
- [ ] Stats Endpoint

## Golden Rule

```text
Client
 ↓
Route
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Database
 ↓
Response
```
