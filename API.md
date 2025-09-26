# API Documentation

## Overview

This API provides endpoints for managing German phrases and categories for a language learning application. It uses Supabase as the database and is built with Express.js.

**Base URL:** `http://localhost:3001/api` (or as configured in environment)

**Authentication:** Not implemented (uses Supabase client directly)

## Endpoints

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
      "lapses": 0,
      "distractors": ["hallo", "tschüss"]
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

**Response (201 Created):**
```json
{
  "id": 1,
  "russian": "спасибо",
  "german": "danke",
  "category_id": 1
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

**Response (200 OK):**
```json
{
  "id": 1,
  "russian": "пожалуйста",
  "german": "bitte",
  "category_id": 1
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
  "id": 1,
  "name": "Verbs",
  "color": "#00ff00",
  "is_foundational": false
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Verbs",
  "color": "#00ff00",
  "is_foundational": false
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

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Updated Verbs",
  "color": "#0000ff",
  "is_foundational": false
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

**Response (204 No Content):** Empty body

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
- `distractors` (array, optional): Alternative answers for quizzes

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
- 500: Internal Server Error

## Testing

Run tests with: `npm test`

Tests cover all endpoints with success and error scenarios.