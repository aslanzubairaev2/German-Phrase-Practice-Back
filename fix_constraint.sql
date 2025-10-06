-- SQL script to fix the unique constraint on categories table
-- This changes the UNIQUE constraint from name only to (user_id, name)

-- First, ensure all existing records have user_id set (replace 'your-user-id' with actual UUID)
-- UPDATE categories SET user_id = 'your-user-id' WHERE user_id IS NULL;

-- Optional: Make user_id NOT NULL
-- ALTER TABLE categories ALTER COLUMN user_id SET NOT NULL;

-- Drop the existing global UNIQUE constraint on name
ALTER TABLE categories DROP CONSTRAINT categories_name_key;

-- Add new UNIQUE constraint on (user_id, name)
ALTER TABLE categories ADD CONSTRAINT categories_name_key UNIQUE (user_id, name);