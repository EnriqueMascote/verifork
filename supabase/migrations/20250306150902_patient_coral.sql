/*
  # Campaign Images Schema

  1. New Tables
    - `campaign_images`
      - `id` (uuid, primary key) - Unique identifier for the image
      - `filename` (text) - Original filename
      - `storage_path` (text) - Path in Supabase storage
      - `upload_date` (timestamptz) - When the image was uploaded
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `campaign_images` table
    - Add policies for public read access
    - Add policies for authenticated users to insert
*/

CREATE TABLE IF NOT EXISTS campaign_images (
  id uuid PRIMARY KEY,
  filename text NOT NULL,
  storage_path text NOT NULL,
  upload_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE campaign_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view campaign images"
  ON campaign_images
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Authenticated users can upload images"
  ON campaign_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);