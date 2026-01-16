
-- Clean up transactional data
DELETE FROM appointments;
DELETE FROM payments;

-- Note: We are not deleting profiles to avoid issues with auth.users linkage 
-- and to keep the demo users intact.
