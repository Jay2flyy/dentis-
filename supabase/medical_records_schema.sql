-- Medical Records and Treatment Tables

-- Dental History table
CREATE TABLE IF NOT EXISTS dental_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    procedure_type TEXT NOT NULL,
    procedure_date DATE NOT NULL,
    dentist_name TEXT,
    tooth_number TEXT,
    diagnosis TEXT,
    treatment_notes TEXT,
    cost DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical Documents table (X-rays, scans, etc.)
CREATE TABLE IF NOT EXISTS medical_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('xray', 'scan', 'photo', 'report', 'insurance', 'consent', 'other')),
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    description TEXT,
    document_date DATE,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatment Plans table
CREATE TABLE IF NOT EXISTS treatment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'in_progress', 'completed', 'cancelled')),
    total_cost DECIMAL(10,2),
    estimated_duration TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    start_date DATE,
    end_date DATE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatment Plan Phases table
CREATE TABLE IF NOT EXISTS treatment_plan_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    treatment_plan_id UUID REFERENCES treatment_plans(id) ON DELETE CASCADE,
    phase_number INTEGER NOT NULL,
    phase_name TEXT NOT NULL,
    description TEXT,
    procedures TEXT[], -- array of procedure names
    estimated_cost DECIMAL(10,2),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    medication_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration TEXT,
    instructions TEXT,
    prescribed_by TEXT,
    prescribed_date DATE NOT NULL,
    refills_remaining INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allergies and Medical Conditions table
CREATE TABLE IF NOT EXISTS patient_medical_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    info_type TEXT NOT NULL CHECK (info_type IN ('allergy', 'condition', 'medication')),
    name TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
    notes TEXT,
    reported_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dental_history_patient ON dental_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_dental_history_date ON dental_history(procedure_date);
CREATE INDEX IF NOT EXISTS idx_medical_documents_patient ON medical_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_documents_type ON medical_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_treatment_plans_patient ON treatment_plans(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatment_plans_status ON treatment_plans(status);
CREATE INDEX IF NOT EXISTS idx_treatment_plan_phases_plan ON treatment_plan_phases(treatment_plan_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_patient_medical_info_patient ON patient_medical_info(patient_id);

-- Enable RLS
ALTER TABLE dental_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plan_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medical_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Patients can view their dental history"
    ON dental_history FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage dental history"
    ON dental_history FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their medical documents"
    ON medical_documents FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Patients can upload documents"
    ON medical_documents FOR INSERT
    WITH CHECK (patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage medical documents"
    ON medical_documents FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their treatment plans"
    ON treatment_plans FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage treatment plans"
    ON treatment_plans FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their treatment plan phases"
    ON treatment_plan_phases FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR treatment_plan_id IN (SELECT id FROM treatment_plans WHERE patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')));

CREATE POLICY "Admins can manage treatment plan phases"
    ON treatment_plan_phases FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their prescriptions"
    ON prescriptions FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage prescriptions"
    ON prescriptions FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their medical info"
    ON patient_medical_info FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Patients can add their medical info"
    ON patient_medical_info FOR INSERT
    WITH CHECK (patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage patient medical info"
    ON patient_medical_info FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));
