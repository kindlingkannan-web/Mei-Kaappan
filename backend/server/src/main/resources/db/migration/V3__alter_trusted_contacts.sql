-- Flyway Migration V3: Make email optional in trusted_contacts for SMS/WhatsApp-only invites
ALTER TABLE trusted_contacts ALTER COLUMN email DROP NOT NULL;
ALTER TABLE trusted_contacts ALTER COLUMN email SET DEFAULT 'guardian@demo.meikaappan.org';
