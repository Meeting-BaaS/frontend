BEGIN;

ALTER TABLE accounts
ADD COLUMN full_name text,
ADD COLUMN email_verified boolean NOT NULL DEFAULT false,
ADD COLUMN image text,
ADD COLUMN updated_at timestamp without time zone DEFAULT now() NOT NULL;

ALTER TABLE accounts
ADD CONSTRAINT accounts_email_unique UNIQUE (email);

--For existing data, need to update the new full name column by concatenating first name and last name
--Email verified is set to true, and updated_at column is set with created_at
UPDATE accounts
SET 
    full_name = COALESCE(firstname, '') || ' ' || COALESCE(lastname, ''),
    email_verified = true,
    updated_at = created_at;

COMMIT;