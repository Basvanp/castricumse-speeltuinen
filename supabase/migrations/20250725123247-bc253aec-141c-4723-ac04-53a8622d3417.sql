-- Remove duplicate user role (keep only admin role)
DELETE FROM user_roles 
WHERE user_id = '9b1d5ba0-e8df-41e2-9ac0-b86e4b31aa0c' 
AND role = 'user';

-- Add constraint to prevent duplicate roles per user
ALTER TABLE user_roles 
ADD CONSTRAINT unique_user_role UNIQUE (user_id, role);