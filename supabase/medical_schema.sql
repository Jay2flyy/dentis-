-- Medical & Document Management Schema

-- Medical Documents Table
CREATE TABLE IF NOT EXISTS medical_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    document_type TEXT NOT NULL CHECK (document_type IN ('xray', 'scan', 'photo', 'report', 'insurance', 'consent', 'other')),
    description TEXT,
    uploaded_by TEXT DEFAULT 'Patient',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical Aid Table
CREATE TABLE IF NOT EXISTS medical_aid (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    provider_name TEXT NOT NULL,
    plan_name TEXT,
    member_number TEXT NOT NULL,
    dependent_code TEXT,
    main_member_name TEXT,
    card_front_url TEXT,
    card_back_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(patient_id)
);

-- Enable RLS
ALTER TABLE medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_aid ENABLE ROW LEVEL SECURITY;

-- Policies for medical_documents
CREATE POLICY "Patients can view their own documents"
    ON medical_documents FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users) OR 
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
    );

CREATE POLICY "Patients can upload their own documents"
    ON medical_documents FOR INSERT
    WITH CHECK (
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
    );

CREATE POLICY "Admins can manage all documents"
    ON medical_documents FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Policies for medical_aid
CREATE POLICY "Patients can view their own medical aid"
    ON medical_aid FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users) OR 
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
    );

CREATE POLICY "Patients can manage their own medical aid"
    ON medical_aid FOR ALL
    USING (
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
    );

CREATE POLICY "Admins can manage all medical aid"
    ON medical_aid FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_medical_docs_patient ON medical_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_aid_patient ON medical_aid(patient_id);
