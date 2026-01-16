-- Migration: Remove deprecated columns from facility_access
-- Removes: website_url, capacity, provisional_capacity, building

BEGIN;

ALTER TABLE public.facility_access
	DROP COLUMN IF EXISTS website_url,
	DROP COLUMN IF EXISTS capacity,
	DROP COLUMN IF EXISTS provisional_capacity,
	DROP COLUMN IF EXISTS building;

COMMIT;