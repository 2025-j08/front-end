-- Migration: Add columns to facilities
-- Adds: website_url, capacity, provisional_capacity

BEGIN;

ALTER TABLE public.facilities
	ADD COLUMN IF NOT EXISTS website_url text,
	ADD COLUMN IF NOT EXISTS capacity integer,
	ADD COLUMN IF NOT EXISTS provisional_capacity integer;

COMMIT;