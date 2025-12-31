-- Create tables for dental practice automation

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE,
    address TEXT,
    emergency_contact TEXT,
    medical_history TEXT,
    insurance_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_visit TIMESTAMP WITH TIME ZONE
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    patient_email TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    service_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table (for contact form and marketing)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    service TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table (for authentication)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_email ON appointments(patient_email);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);

-- Enable Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients
CREATE POLICY "Patients can view their own data"
    ON patients FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR email = auth.jwt()->>'email');

CREATE POLICY "Admins can manage patients"
    ON patients FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- RLS Policies for appointments
CREATE POLICY "Anyone can create appointments"
    ON appointments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Patients can view their appointments"
    ON appointments FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_email = auth.jwt()->>'email');

CREATE POLICY "Admins can manage appointments"
    ON appointments FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- RLS Policies for leads
CREATE POLICY "Anyone can create leads"
    ON leads FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view and manage leads"
    ON leads FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- RLS Policies for reviews
CREATE POLICY "Anyone can view approved reviews"
    ON reviews FOR SELECT
    USING (approved = true OR auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Anyone can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can manage reviews"
    ON reviews FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- RLS Policies for services
CREATE POLICY "Anyone can view active services"
    ON services FOR SELECT
    USING (active = true OR auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admins can manage services"
    ON services FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin users"
    ON admin_users FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Insert sample services
INSERT INTO services (name, description, duration, price, category) VALUES
    ('General Checkup', 'Comprehensive oral examination', 30, 1600.00, 'General'),
    ('Teeth Cleaning', 'Professional cleaning and polishing', 45, 2400.00, 'Preventive'),
    ('Teeth Whitening', 'Professional whitening treatment', 60, 8000.00, 'Cosmetic'),
    ('Dental Filling', 'Cavity filling procedure', 60, 4000.00, 'Restorative'),
    ('Root Canal', 'Root canal therapy', 90, 16000.00, 'Endodontic'),
    ('Emergency Care', '24/7 emergency dental service', 30, 3000.00, 'Emergency'),
    ('Dental Crown', 'Crown placement', 90, 24000.00, 'Restorative'),
    ('Dental Implant', 'Implant surgery and placement', 120, 70000.00, 'Surgical'),
    ('Orthodontic Consultation', 'Braces and aligners consultation', 30, 0.00, 'Orthodontics'),
    ('Periodontal Treatment', 'Gum disease treatment', 60, 300.00, 'Periodontics')
ON CONFLICT DO NOTHING;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update appointments updated_at
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create patient from appointment if not exists
CREATE OR REPLACE FUNCTION create_patient_from_appointment()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if patient exists
    IF NOT EXISTS (SELECT 1 FROM patients WHERE email = NEW.patient_email) THEN
        INSERT INTO patients (full_name, email, phone)
        VALUES (NEW.patient_name, NEW.patient_email, NEW.patient_phone)
        ON CONFLICT (email) DO NOTHING;
    END IF;
    
    -- Link appointment to patient
    NEW.patient_id := (SELECT id FROM patients WHERE email = NEW.patient_email);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create patient
CREATE TRIGGER create_patient_on_appointment
    BEFORE INSERT ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION create_patient_from_appointment();
