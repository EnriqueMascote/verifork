/*
  # Add campaign details and improve schema

  1. Updates
    - Add title, description, and author fields to campaign_images table
    - Add indexes for search functionality
  
  2. Changes
    - Adds new columns to existing table
    - Creates indexes for performance
*/

-- Add new columns to campaign_images table
ALTER TABLE campaign_images
ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS author text NOT NULL DEFAULT '';

-- Create indexes for search
CREATE INDEX IF NOT EXISTS idx_campaign_images_title ON campaign_images (title);
CREATE INDEX IF NOT EXISTS idx_campaign_images_upload_date ON campaign_images (upload_date);
CREATE INDEX IF NOT EXISTS idx_campaign_images_author ON campaign_images (author);