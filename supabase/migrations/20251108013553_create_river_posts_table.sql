/*
  # Create River Posts Table for Water Flow Calculator

  1. New Tables
    - `river_posts`
      - `id` (uuid, primary key) - Unique identifier for each post
      - `post_name` (text) - Name of the hydro post/reservoir
      - `post_type` (text) - Type: водохранилище, гидропост, плотина, гидроузел
      - `order_index` (integer) - Sequential order in the river chain
      - `accumulated_distance_km` (numeric) - Total distance from Toktogul
      - `segment_distance_km` (numeric) - Distance from previous post
      - `min_time_hours` (numeric, nullable) - Minimum flow time to this post
      - `max_time_hours` (numeric, nullable) - Maximum flow time to this post
      - `segment_min_time_hours` (numeric, nullable) - Min time from previous post
      - `segment_max_time_hours` (numeric, nullable) - Max time from previous post
      - `is_reset_point` (boolean) - Whether this post resets accumulated time
      - `max_flow_rate` (numeric, nullable) - Maximum flow rate constraint (m³/s)
      - `notes` (text, nullable) - Additional information
      - `created_at` (timestamptz) - Record creation time

  2. Security
    - Enable RLS on `river_posts` table
    - Add policy for public read access (this is reference data)
*/

CREATE TABLE IF NOT EXISTS river_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_name text NOT NULL,
  post_type text NOT NULL,
  order_index integer NOT NULL UNIQUE,
  accumulated_distance_km numeric NOT NULL DEFAULT 0,
  segment_distance_km numeric NOT NULL DEFAULT 0,
  min_time_hours numeric,
  max_time_hours numeric,
  segment_min_time_hours numeric,
  segment_max_time_hours numeric,
  is_reset_point boolean DEFAULT false,
  max_flow_rate numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE river_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to river posts"
  ON river_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);