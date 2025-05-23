-- Upsert admin user (PostgreSQL syntax)
INSERT INTO "User" (name, email, "passwordHash", role, "createdAt")
VALUES (
  'PREDOC Admin',
  'predoc@admin.com',
  '$2b$10$REPLACE_THIS_WITH_YOUR_BCRYPT_HASH',
  'admin',
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  "passwordHash" = EXCLUDED."passwordHash",
  role = EXCLUDED.role;
