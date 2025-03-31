/*
  # Campaign Images Schema Update

  1. Tables
    - Ensure `campaign_images` table exists with all required columns
    - Add policies if they don't exist

  2. Security
    - Enable RLS
    - Add policies safely using IF NOT EXISTS:
      - Public read access
      - Authenticated users can insert
      - Users can update/delete their own images
*/

-- Create campaign_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS campaign_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL,
  upload_date timestamptz NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE campaign_images ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- Create "Anyone can view campaign images" policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'campaign_images' 
    AND policyname = 'Anyone can view campaign images'
  ) THEN
    CREATE POLICY "Anyone can view campaign images"
      ON campaign_images
      FOR SELECT
      TO public
      USING (true);
  END IF;

  -- Create "Users can insert their own images" policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'campaign_images' 
    AND policyname = 'Users can insert their own images'
  ) THEN
    CREATE POLICY "Users can insert their own images"
      ON campaign_images
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Create "Users can update their own images" policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'campaign_images' 
    AND policyname = 'Users can update their own images'
  ) THEN
    CREATE POLICY "Users can update their own images"
      ON campaign_images
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Create "Users can delete their own images" policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'campaign_images' 
    AND policyname = 'Users can delete their own images'
  ) THEN
    CREATE POLICY "Users can delete their own images"
      ON campaign_images
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;