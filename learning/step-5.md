#  Implementing JWT Authentication

Today was one of the biggest milestones of my URL Shortener backend project. Instead of simply adding login functionality, I implemented a complete JWT-based authentication system while following a clean layered architecture.

---

#  Features Completed

## Authentication

- User Registration
- User Login
- Password Hashing using bcrypt
- JWT Token Generation
- JWT Token Verification
- Authentication Middleware
- Protected Routes

---

#  Architecture Followed

```
Client
   │
   ▼
Routes
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
PostgreSQL
```

Each layer has a single responsibility.

---

# 📚 Important Concepts Learned

## 1. Authentication vs Authorization

One of the biggest learnings today.

### Authentication

Authentication answers:

> **Who are you?**

Example:

- Register
- Login
- JWT Verification

After successful authentication:

```
req.user = {
    id: 1
}
```

---

### Authorization

Authorization answers:

> **Are you allowed to access this resource?**

Example:

```
User A owns URL A

User B logs in

Can User B access User A's analytics?
```

Current project:

✔ Authentication

Future improvement:

✔ Ownership Authorization

---

# 2. Why Passwords Should Never Be Stored Directly

Instead of storing

```
password123
```

we store

```
$2b$10$.....
```

using bcrypt.

Even the developer cannot recover the original password.

During login:

```
Entered Password

↓

bcrypt.compare()

↓

Stored Hash

↓

Match?
```

---

# 3. JWT Structure

A JWT contains three parts.

```
HEADER

↓

PAYLOAD

↓

SIGNATURE
```

Our payload currently contains

```ts
{
    id: user.id
}
```

No password or email is stored inside the token.

---

# 4. Authentication Middleware

Every protected request follows this flow.

```
Request

↓

Authorization Header

↓

Extract Token

↓

Verify JWT

↓

req.user = { id }

↓

next()
```

---

# 5. Separation of Responsibilities

One important lesson today was understanding where different types of validation belong.

## Controller

Responsible for:

- Reading request
- Sending response

Nothing else.

---

## Service

Responsible for:

- Business Logic

Examples:

- Email already exists
- Username already exists
- Password comparison
- Token generation

---

## Repository

Responsible for:

- Database queries only

No business logic.

---

# 6. Promise.all()

Instead of

```ts
await findByEmail();

await findByUsername();
```

I learned to execute independent queries together.

```ts
const [existingEmail, existingUsername] =
await Promise.all([
    repo.findByEmail(email),
    repo.findByUsername(username)
]);
```

This reduces total waiting time.

---

# 7. Why We Return Safe User Objects

Instead of returning

```ts
{
    id,
    username,
    email,
    password_hash
}
```

we return

```ts
{
    id,
    username,
    email
}
```

Sensitive information should never leave the backend.

---

# 8. Why JWT Only Stores User ID

Instead of

```ts
{
    id,
    username,
    email
}
```

we only store

```ts
{
    id
}
```

Reasons:

- Smaller token
- Less exposed data
- User information can always be fetched from the database if needed

---

# 9. Middleware Order Matters

Protected routes now follow

```
Authentication

↓

Validation

↓

Controller

↓

Service
```

Authentication happens before executing business logic.

---

# 10. Declaration Merging

I learned how to extend Express Request.

Instead of

```ts
(req as any).user
```

I added

```ts
declare global {
    namespace Express {
        interface Request {
            user: TokenPayload;
        }
    }
}
```

This keeps TypeScript type-safe.

---

# 🐞 Mistakes I Made Today

## Mistake 1

Calling controller instead of service.

Wrong

```ts
registerUser(...)
```

Correct

```ts
service.registerUser(...)
```

---

## Mistake 2

Importing the wrong service.

Imported

```
url.service
```

instead of

```
auth.service
```

---

## Mistake 3

Passing wrong arguments.

Instead of

```ts
service.registerUser(username, email, password)
```

the service expected

```ts
service.registerUser({
    username,
    email,
    password
})
```

---

## Mistake 4

Using

```ts
router.post("/register", controller.registerUser())
```

instead of

```ts
router.post("/register", controller.registerUser)
```

Express expects a function reference.

---

## Mistake 5

Forgetting to extend Express Request.

```
req.user
```

showed a TypeScript error until declaration merging was added.

---

## Mistake 6

Forgetting the Bearer format.

The middleware should validate

```
Authorization: Bearer <token>
```

instead of only checking whether a token exists.

---

## Mistake 7

Using HTTP 201 for Login.

Registration:

```
201 Created
```

Login:

```
200 OK
```

---

# 🚀 Current Project Status

## URL Shortener

### Core

- ✅ URL Shortening
- ✅ Redirection
- ✅ Click Counter
- ✅ Browser Analytics

### Authentication

- ✅ Register
- ✅ Login
- ✅ Password Hashing
- ✅ JWT Authentication
- ✅ Route Protection

### Backend Architecture

- ✅ Controllers
- ✅ Services
- ✅ Repository Pattern
- ✅ Middleware
- ✅ Error Handling

---

# 📅 Next Steps

- Zod Validation
- URL Ownership
- Authorization
- "My URLs" Endpoint
- Frontend (React)

---

# Final Thoughts

Today's session completely changed how I think about backend development.

Instead of writing everything inside controllers, I learned how to separate responsibilities between controllers, services, repositories, middleware, and utilities.

I also understood the difference between authentication and authorization, why passwords are hashed instead of encrypted, how JWT works internally, and how middleware protects routes before business logic executes.

This was my biggest backend milestone so far.
