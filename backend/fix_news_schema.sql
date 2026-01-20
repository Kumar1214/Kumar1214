-- SQL Migration to fix "value too long" error for News titles
-- Run this in your cPanel Database (phpMyAdmin or psql terminal)

ALTER TABLE "News" ALTER COLUMN "title" TYPE TEXT;

-- Verify the change
-- \d "News"
