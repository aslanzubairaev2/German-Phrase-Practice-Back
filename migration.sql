-- Migration script to update database schema for German Phrase Practice Backend

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS phrases;
DROP TABLE IF EXISTS categories;

-- Create categories table with new structure
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    is_foundational BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create phrases table with new structure including SRS fields
CREATE TABLE phrases (
    id SERIAL PRIMARY KEY,
    russian TEXT NOT NULL,
    german TEXT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    transcription TEXT,
    context TEXT,

    -- SRS Fields
    "masteryLevel" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" BIGINT,
    "nextReviewAt" BIGINT,
    "knowCount" INTEGER NOT NULL DEFAULT 0,
    "knowStreak" INTEGER NOT NULL DEFAULT 0,
    "isMastered" BOOLEAN NOT NULL DEFAULT FALSE,
    "lapses" INTEGER NOT NULL DEFAULT 0
);

-- Optional: Insert initial data if needed
-- You can run the initial data service after this migration