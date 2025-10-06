-- Migration script to update database schema for German Phrase Practice Backend
-- This migration adds user_id columns to existing tables without dropping data

-- Add user_id to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add user_id to phrases table
ALTER TABLE phrases ADD COLUMN IF NOT EXISTS user_id UUID;

-- Note: Existing records will have user_id = NULL
-- After you register/login and get your user_id, run:
-- UPDATE categories SET user_id = 'your-actual-user-id' WHERE user_id IS NULL;
-- UPDATE phrases SET user_id = 'your-actual-user-id' WHERE user_id IS NULL;

-- Note: Constraints (unique, foreign key) already exist from initial schema
-- No need to add them again

-- Optional: Insert initial data if needed
-- You can run the initial data service after this migration