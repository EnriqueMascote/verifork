/*
  # Create storage bucket and policies for campaign images

  1. Storage
    - Creates a new storage bucket named 'campaign-images'
    - Configures public access for the bucket
  
  2. Security
    - Enables public read access to all files in the bucket
    - Allows authenticated users to upload files to the 'campaigns' folder
    - Allows users to update and delete their own files
*/

-- Create storage bucket
INSERT INTO storage.buckets (id, name)
VALUES ('campaign-images', 'campaign-images')
ON CONFLICT (id) DO NOTHING;

-- Set bucket to public
UPDATE storage.buckets
SET public = true
WHERE id = 'campaign-images';

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated Users Can Upload" ON storage.objects;
    DROP POLICY IF EXISTS "Users Can Update Own Files" ON storage.objects;
    DROP POLICY IF EXISTS "Users Can Delete Own Files" ON storage.objects;
END $$;

-- Create policies directly on storage.objects
CREATE POLICY "Public Read Access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'campaign-images');

CREATE POLICY "Authenticated Users Can Upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'campaign-images' AND
    (storage.foldername(name))[1] = 'campaigns'
  );

CREATE POLICY "Users Can Update Own Files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'campaign-images' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'campaign-images');

CREATE POLICY "Users Can Delete Own Files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'campaign-images' AND owner = auth.uid());