-- LeaseThread PostgreSQL schema (design; not yet deployed). Amazon RDS/Aurora PostgreSQL.
CREATE TABLE organizations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, hubspot_company_id text, created_at timestamptz DEFAULT now());
CREATE TABLE users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), org_id uuid NOT NULL REFERENCES organizations, email text UNIQUE NOT NULL, role text NOT NULL CHECK (role IN ('admin','manager','coordinator','viewer')), cognito_sub text UNIQUE);
CREATE TABLE properties (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), org_id uuid NOT NULL REFERENCES organizations, name text NOT NULL, address text, units int);
CREATE TABLE property_grants (user_id uuid REFERENCES users, property_id uuid REFERENCES properties, PRIMARY KEY (user_id, property_id));
CREATE TABLE leases (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), org_id uuid NOT NULL, property_id uuid NOT NULL REFERENCES properties, unit text, tenant_name text, start_date date, end_date date, monthly_rent numeric(10,2), notice_days int, renewal_action_taken boolean DEFAULT false);
CREATE TABLE documents (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), org_id uuid NOT NULL, property_id uuid REFERENCES properties, lease_id uuid REFERENCES leases, s3_key text NOT NULL, kind text, status text DEFAULT 'uploaded' CHECK (status IN ('uploaded','processing','extracted','failed')), uploaded_at timestamptz DEFAULT now());
-- every AI-extracted value keeps its source passage so humans can verify it
CREATE TABLE lease_extractions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), document_id uuid NOT NULL REFERENCES documents, field text NOT NULL, value text, source_passage text, page int, model_id text, verified_by uuid REFERENCES users, verified_at timestamptz);
CREATE TABLE contractors (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), org_id uuid NOT NULL, name text, trade text, phone text);
CREATE TABLE maintenance_requests (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), org_id uuid NOT NULL, property_id uuid NOT NULL REFERENCES properties, unit text, tenant_name text, body text NOT NULL, status text DEFAULT 'new', category text, urgency text, ai_explanation text, ai_missing_info jsonb, ai_model_id text, contractor_id uuid REFERENCES contractors, created_at timestamptz DEFAULT now(), resolved_at timestamptz);
CREATE TABLE communications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), org_id uuid NOT NULL, request_id uuid REFERENCES maintenance_requests, channel text, direction text, body text, created_at timestamptz DEFAULT now());
CREATE TABLE tasks (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), org_id uuid NOT NULL, title text, due date, done boolean DEFAULT false, source text DEFAULT 'manual');
CREATE TABLE ai_audit_log (id bigserial PRIMARY KEY, org_id uuid, user_id uuid, feature text, model_id text, input_tokens int, output_tokens int, created_at timestamptz DEFAULT now());
-- Row-level security: enforce org isolation in the database as a second line of defence
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON properties USING (org_id = current_setting('app.org_id')::uuid);
-- (repeat for every org-scoped table)
