/*
  # Add user authentication support to campaign_images

  1. Changes
    - Add user_id column to campaign_images table
    - Add foreign key constraint to auth.users
    - Update RLS policies for authenticated uploads and public viewing

  2. Security
    - Enable RLS
    - Add policy for authenticated users to create their own records
    - Add policies for users to manage their own records
*/

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaign_images' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE campaign_images 
    ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE campaign_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can upload campaign images" ON campaign_images;
DROP POLICY IF EXISTS "Users can update their own images" ON campaign_images;
DROP POLICY IF EXISTS "Users can delete their own images" ON campaign_images;

-- Only authenticated users can upload
CREATE POLICY "Users can upload campaign images"
ON campaign_images
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own images
CREATE POLICY "Users can update their own images"
ON campaign_images
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own images
CREATE POLICY "Users can delete their own images"
ON campaign_images
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);