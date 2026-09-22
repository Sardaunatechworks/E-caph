-- Add images column to posts table to support multiple image uploads / galleries
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
