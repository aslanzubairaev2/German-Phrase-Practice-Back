# API Documentation

## Overview

This API provides endpoints for managing German phrases and categories for a language learning application. It uses Supabase as the database and is built with Express.js.

**Base URL:**
- **Development:** `http://localhost:3001/api`
- **Production:** `https://german-phrase-practice-back.vercel.app/api`

**Authentication:** JWT-based authentication using Supabase. All protected endpoints require a Bearer token in the Authorization header.

## Authentication

### Overview

The API uses JWT (JSON Web Tokens) for authentication. Users authenticate through Supabase Auth, and the API verifies tokens on protected endpoints.

### Headers

All protected requests must include:
```
Authorization: Bearer <jwt_token>
```

### Endpoints

#### GET /api/auth/profile

Retrieves the authenticated user's profile information.

**Headers:**
- `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

#### GET /api/auth/verify

Verifies the provided JWT token.

**Headers:**
- `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "valid": true,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com"
  }
}
```

### Error Responses

**401 Unauthorized:**
```json
{
  "error": "No token provided"
}
```

or

```json
{
  "error": "Invalid token"
}
```

## Frontend Integration Guide

📖 **Detailed Migration Guide:** See `FRONTEND_MIGRATION_GUIDE.md` for step-by-step instructions on updating your frontend for authentication.

### Authentication Flow

1. **User Registration/Login:**
   - Use Supabase Auth SDK for registration and login
   - Supabase handles user creation and JWT token generation

2. **Token Management:**
   - Store JWT token securely (localStorage/sessionStorage)
   - Include token in all API requests: `Authorization: Bearer <token>`

3. **API Requests:**
   ```javascript
   // Example with fetch
   const response = await fetch('/api/phrases', {
     headers: {
       'Authorization': `Bearer ${userToken}`,
       'Content-Type': 'application/json'
     }
   });
   ```

4. **Error Handling:**
   - Handle 401 responses by redirecting to login
   - Refresh token if needed (Supabase handles this automatically)

### API Configuration

Configure API base URL based on environment:

```javascript
// API URLs
const LOCAL_API_URL = 'http://localhost:3001/api';
const PRODUCTION_API_URL = 'https://german-phrase-practice-back.vercel.app/api';

// Determine API URL
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? PRODUCTION_API_URL
  : LOCAL_API_URL;

// Use in API calls
const response = await fetch(`${API_BASE_URL}/phrases`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Supabase Auth Setup

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Get user session
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token
```

### Data Migration

After user login, call `/api/initial-data` to load user's data. If user is new, they can load initial data via `/api/initial-data` POST request.

### Breaking Changes

- **All endpoints now require authentication**
- **Data is filtered by user_id** - each user sees only their own data
- **Initial data loading** moved to authenticated endpoint

### Migration Steps for Frontend

1. Add Supabase Auth integration
2. Update all API calls to include Authorization header
3. Add login/register UI
4. Handle token refresh and logout
5. Update data loading logic for user-specific data
6. Add error handling for 401 responses

## Endpoints

### Health Check

#### GET /api/health

Checks the health status of the server.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-10-01T12:00:00.000Z"
}
```

### Initial Data

#### GET /api/initial-data

Retrieves all categories and phrases with additional frontend-specific fields for phrases.

**Response (200 OK):**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Basics",
      "color": "#ff0000",
      "is_foundational": true
    }
  ],
  "phrases": [
    {
      "id": 1,
      "russian": "привет",
      "german": "hallo",
      "category": 1,
      "transcription": "halo",
      "context": "Greeting",
      "masteryLevel": 0,
      "lastReviewedAt": null,
      "nextReviewAt": 1640995200000,
      "knowCount": 0,
      "knowStreak": 0,
      "isMastered": false,
      "lapses": 0
    }
  ]
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch initial data",
  "details": "Error message"
}
```

#### POST /api/initial-data

Loads initial data from a predefined JSON file into the database. This endpoint is used to populate the database with default categories and phrases.

**Response (200 OK):**
```json
{
  "message": "Initial data loaded successfully"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to load initial data",
  "details": "Error message"
}
```

### Phrases

#### POST /api/phrases

Creates a new phrase.

**Request Body:**
```json
{
  "russian": "спасибо",
  "german": "danke",
  "category_id": 1
}
```

**Validation:**
- `russian`: Required, non-empty string
- `german`: Required, non-empty string
- `category_id`: Required, number

**Response (201 Created):**
```json
{
  "id": 1,
  "russian": "спасибо",
  "german": "danke",
  "category_id": 1
}
```

**Error Response (400 - Validation Error):**
```json
{
  "error": "Russian text is required and must be a non-empty string"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to create phrase",
  "details": "Error message"
}
```

#### PUT /api/phrases/:id

Updates an existing phrase.

**Path Parameters:**
- `id` (number): Phrase ID

**Request Body:**
```json
{
  "russian": "пожалуйста",
  "german": "bitte",
  "category_id": 1
}
```

**Validation:**
- `russian`: Required, non-empty string
- `german`: Required, non-empty string
- `category_id`: Required, number

**Response (200 OK):**
```json
{
  "id": 1,
  "russian": "пожалуйста",
  "german": "bitte",
  "category_id": 1
}
```

**Error Response (400 - Validation Error):**
```json
{
  "error": "Russian text is required and must be a non-empty string"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to update phrase",
  "details": "Error message"
}
```

#### DELETE /api/phrases/:id

Deletes a phrase.

**Path Parameters:**
- `id` (number): Phrase ID

**Response (204 No Content):** Empty body

**Error Response (500):**
```json
{
  "error": "Failed to delete phrase",
  "details": "Error message"
}
```

### Categories

#### POST /api/categories

Creates a new category.

**Request Body:**
```json
{
  "name": "Verbs",
  "color": "#00ff00",
  "is_foundational": false
}
```

**Validation:**
- `name`: Required, non-empty string
- `color`: Required, valid hex color code (e.g., #00FF00)

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Verbs",
  "color": "#00ff00",
  "is_foundational": false
}
```

**Error Response (400 - Validation Error):**
```json
{
  "error": "Color is required and must be a valid hex color code"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to create category",
  "details": "Error message"
}
```

#### PUT /api/categories/:id

Updates an existing category.

**Path Parameters:**
- `id` (number): Category ID

**Request Body:**
```json
{
  "name": "Updated Verbs",
  "color": "#0000ff"
}
```

**Validation:**
- `name`: Required, non-empty string
- `color`: Required, valid hex color code (e.g., #0000FF)

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Updated Verbs",
  "color": "#0000ff",
  "is_foundational": false
}
```

**Error Response (400 - Validation Error):**
```json
{
  "error": "Color is required and must be a valid hex color code"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to update category",
  "details": "Error message"
}
```

#### DELETE /api/categories/:id

Deletes a category. If `migrationTargetId` is provided in the request body, associated phrases are moved to that category. Otherwise, associated phrases are deleted.

**Path Parameters:**
- `id` (number): Category ID

**Request Body (optional):**
```json
{
  "migrationTargetId": 2
}
```

**Validation:**
- `migrationTargetId`: If provided, must be a positive number

**Response (204 No Content):** Empty body

**Error Response (400 - Validation Error):**
```json
{
  "error": "Migration target ID must be a positive number if provided"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to delete category",
  "details": "Error message"
}
```

## Data Models

### Phrase
- `id` (number): Unique identifier
- `russian` (string): Russian text
- `german` (string): German text
- `category_id` (number): Reference to category
- `transcription` (string, optional): Pronunciation guide
- `context` (string, optional): Usage context

### Category
- `id` (number): Unique identifier
- `name` (string): Category name
- `color` (string): Hex color code
- `is_foundational` (boolean): Whether it's a foundational category

## Error Handling

All endpoints return errors in the following format:
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request (validation errors)
- 500: Internal Server Error

## Middleware

The API uses several middleware for enhanced functionality:

- **CORS**: Enables cross-origin requests
- **JSON Parser**: Parses incoming JSON payloads
- **Error Handler**: Centralized error handling and logging
- **Rate Limiter**: Limits the number of requests per IP address
- **Validation**: Validates incoming request data

## Validation

The API validates incoming request data to ensure data integrity. Validation is applied to POST and PUT requests for phrases and categories, and to DELETE requests for categories when migration is involved.

### Validation Rules

#### Phrases (POST /api/phrases, PUT /api/phrases/:id)
- `russian`: Required, must be a non-empty string
- `german`: Required, must be a non-empty string
- `category_id`: Required, must be a number

#### Categories (POST /api/categories, PUT /api/categories/:id)
- `name`: Required, must be a non-empty string
- `color`: Required, must be a valid hex color code (e.g., #FF0000)

#### Categories (DELETE /api/categories/:id)
- `migrationTargetId`: Optional, but if provided, must be a positive number

### Validation Error Response
If validation fails, the API returns a 400 Bad Request status with the following format:
```json
{
  "error": "Validation error message",
  "details": undefined
}
```

## Testing

Run tests with: `npm test`

Tests cover all endpoints with success and error scenarios.