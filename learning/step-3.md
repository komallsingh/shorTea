# Learning Notes - Day 3 (Google Safe Browsing Integration)

## Goal

Add spam/phishing detection before creating a short URL using the Google Safe Browsing API.

---

# Why this Feature?

Instead of blindly shortening every URL:

```text
User
 ↓
Create Short URL
```

We now verify whether the URL is safe.

New flow:

```text
User
 ↓
Validate URL
 ↓
Check Duplicate
 ↓
Google Safe Browsing API
 ↓
Safe?
 ┌────────┴────────┐
 │                 │
Yes               No
 │                 │
Create URL     Reject Request
```

---

# Architecture

```text
Route
 ↓
Controller
 ↓
URL Service
 ↓
Spam Service
 ↓
Google Safe Browsing API
```

### Why Spam Service?

Spam detection is business logic.

It should NOT be inside:

- Controller
- Repository
- Middleware

It belongs inside the Service Layer.

---

# Google Safe Browsing Setup

## 1. Create Google Cloud Project

- Created a new Google Cloud Project.

---

## 2. Enable API

Enabled:

```
Safe Browsing API
```

NOT

```
Safe Browsing API (Legacy)
```

---

## 3. Create API Key

Stored securely in:

```env
GOOGLE_SAFE_BROWSING_API_KEY=AIza....
```

Never hardcode API keys.

---

# Why use .env?

Instead of

```ts
const apiKey = "AIza...";
```

Use

```ts
process.env.GOOGLE_SAFE_BROWSING_API_KEY
```

Benefits:

- Better security
- Different keys for development and production
- Easy key rotation
- Prevents leaking secrets to GitHub

---

# New Folder

```
services/
    spam.service.ts
```

Responsibility:

Only communicate with Google Safe Browsing.

---

# Axios

Installed:

```bash
npm install axios
```

Used because:

- PostgreSQL → `pg`
- External HTTP APIs → `axios`

Different tools for different jobs.

---

# Request Body

Google expects:

```json
{
  "client": {},
  "threatInfo": {}
}
```

Only one value changes:

```json
"url"
```

Everything else remains constant.

---

# POST vs GET

Used:

```ts
axios.post(...)
```

Reason:

Google expects a JSON body.

GET requests don't send request bodies like this.

---

# SafetyResult

Instead of returning:

```ts
true
```

or

```ts
false
```

Created:

```ts
interface SafetyResult {
    safe: boolean;
    threats?: ThreatType[];
    provider: string;
    message: string;
}
```

Benefits:

- More readable
- Easy to extend
- Better API design

---

# ThreatType

Instead of

```ts
Record<string, string>
```

Used

```ts
type ThreatType =
    | "MALWARE"
    | "SOCIAL_ENGINEERING"
    | "UNWANTED_SOFTWARE";
```

Benefits:

- Compile-time checking
- Autocomplete
- Prevents typos

---

# Threat Messages

Mapped Google's threat names to user-friendly messages.

```ts
MALWARE
↓

"This URL contains malware."
```

```ts
SOCIAL_ENGINEERING
↓

"This URL is a phishing website."
```

---

# Safe URL Response

```json
{
    "safe": true,
    "provider": "Google Safe Browsing",
    "message": "URL is safe."
}
```

---

# Unsafe URL Response

```json
{
    "safe": false,
    "provider": "Google Safe Browsing",
    "threats": [
        "SOCIAL_ENGINEERING"
    ],
    "message": "This URL is a phishing website."
}
```

---

# Error Handling

Wrapped API call inside:

```ts
try {

}
catch {

}
```

Why?

Google might be:

- Down
- Slow
- API key invalid
- Network issue

---

# Timeout

Added:

```ts
timeout: 5000
```

Reason:

Never wait forever for external APIs.

---

# API Key Validation

Before calling Google:

```ts
if (!process.env.GOOGLE_SAFE_BROWSING_API_KEY)
```

Reason:

Fail early with a clear error.

---

# Logging

Temporary debugging:

```ts
console.log(response.data);
```

Observed response:

```json
{
  "matches": [
    {
      "threatType": "SOCIAL_ENGINEERING"
    }
  ]
}
```

Meaning:

Google successfully detected a phishing URL.

Remove the log after testing.

---

# Production Improvement

Instead of checking only:

```ts
matches[0]
```

Collect all threats:

```ts
const threats = matches.map(...)
```

Supports multiple threat types.

---

# URL Service Flow

Old:

```text
Create URL
```

New:

```text
Find Duplicate
 ↓
Exists?
 ↓
Yes → Return Existing URL

No
 ↓
Spam Check
 ↓
Safe?
 ↓
Yes
 ↓
Generate Short Code
 ↓
Save to Database
```

---

# Why Duplicate Check First?

Wrong:

```text
Google API
 ↓
Duplicate Check
```

Correct:

```text
Duplicate Check
 ↓
Google API
```

Reason:

Avoid unnecessary API calls.

Saves:

- API quota
- Time
- Network requests

---

# Important Learning

Google returning:

```
200 OK
```

does NOT mean URL is safe.

Need to check:

```ts
response.data.matches
```

Safe:

```json
{}
```

Unsafe:

```json
{
  "matches":[]
}
```

---

# Service Responsibility

spam.service.ts

Responsible for:

- Calling Google
- Parsing response
- Returning clean result

url.service.ts

Responsible for:

- Duplicate check
- Calling spam service
- Creating short URL

Controller

Responsible for:

- HTTP request
- HTTP response

Repository

Responsible for:

- SQL queries

---

# Clean Architecture

```text
Route
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Database
```

Never skip layers.

---

# Interview Questions Learned

### Why use .env?

- Security
- Environment-specific configuration
- Easy key rotation

---

### Why POST?

Because Google expects JSON in request body.

---

### Why Service Layer?

Spam detection is business logic.

---

### Why not check response.status?

Both safe and unsafe URLs return:

```
200 OK
```

Need to inspect:

```ts
response.data.matches
```

---

### Why return object instead of boolean?

Instead of:

```ts
true
```

Return:

```ts
{
    safe,
    provider,
    message,
    threats
}
```

Much easier to extend.

---

### Why timeout?

Prevent hanging requests.

---

### Why duplicate check first?

Avoid unnecessary API requests.

---

# Features Completed

- ✅ Google Cloud Setup
- ✅ Safe Browsing API
- ✅ API Key
- ✅ Axios Integration
- ✅ spam.service.ts
- ✅ Detailed SafetyResult
- ✅ TypeScript Union Types
- ✅ Threat Mapping
- ✅ API Key Validation
- ✅ Timeout
- ✅ Error Handling
- ✅ Production Response Design

---

# Next Phase

- [ ] Browser Analytics
- [ ] OS Analytics
- [ ] Device Analytics
- [ ] Click History Table
- [ ] GROUP BY Queries
- [ ] QR Code Generation
- [ ] Neon PostgreSQL
- [ ] Docker
- [ ] Deployment

---

# Golden Rules

```text
Business Logic → Service
```

```text
SQL → Repository
```

```text
HTTP → Controller
```

```text
Secrets → .env
```

```text
External APIs → Dedicated Service
```

```text
Duplicate Check
    ↓
Spam Check
    ↓
Create URL
```

```text
Never trust HTTP 200 alone.

Always inspect the response body.
```
