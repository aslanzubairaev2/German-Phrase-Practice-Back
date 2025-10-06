-- Schema for German Phrase Practice Backend
-- Run this in Supabase SQL Editor to create the required tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    is_foundational BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phrases table
CREATE TABLE IF NOT EXISTS phrases (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    russian TEXT NOT NULL,
    german TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    transcription TEXT,
    context TEXT,
    masteryLevel INTEGER DEFAULT 0,
    lastReviewedAt TIMESTAMP WITH TIME ZONE,
    nextReviewAt BIGINT,
    knowCount INTEGER DEFAULT 0,
    knowStreak INTEGER DEFAULT 0,
    isMastered BOOLEAN DEFAULT FALSE,
    lapses INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_phrases_user_id ON phrases(user_id);
CREATE INDEX IF NOT EXISTS idx_phrases_category_id ON phrases(category_id);

-- Row Level Security (RLS) policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE phrases ENABLE ROW LEVEL SECURITY;

-- Policies for categories
CREATE POLICY "Users can view their own categories" ON categories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON categories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON categories
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON categories
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for phrases
CREATE POLICY "Users can view their own phrases" ON phrases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own phrases" ON phrases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own phrases" ON phrases
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own phrases" ON phrases
    FOR DELETE USING (auth.uid() = user_id);