-- Family Management and Communication Tables

-- Family Groups table
CREATE TABLE IF NOT EXISTS family_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    family_name TEXT,
    combined_loyalty_points BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family Members table (links patients to family groups)
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_group_id UUID REFERENCES family_groups(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    relationship TEXT, -- 'self', 'spouse', 'child', 'parent', 'sibling', 'other'
    is_primary BOOLEAN DEFAULT false,
    can_manage_family BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(family_group_id, patient_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('patient', 'staff', 'system')),
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    subject TEXT,
    message_body TEXT NOT NULL,
    message_type TEXT DEFAULT 'general' CHECK (message_type IN ('general', 'appointment', 'billing', 'results', 'marketing', 'reminder')),
    is_read BOOLEAN DEFAULT false,
    parent_message_id UUID REFERENCES messages(id) ON DELETE SET NULL, -- for threading
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('appointment_reminder', 'appointment_confirmation', 'appointment_cancelled', 'results_ready', 'billing_reminder', 'payment_received', 'loyalty_points', 'general')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    sent_via_email BOOLEAN DEFAULT false,
    sent_via_sms BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient Preferences table
CREATE TABLE IF NOT EXISTS patient_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT true,
    appointment_reminders BOOLEAN DEFAULT true,
    reminder_timing INTEGER DEFAULT 24, -- hours before appointment
    preferred_contact_method TEXT DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'sms', 'phone', 'none')),
    preferred_appointment_time TEXT, -- e.g., 'morning', 'afternoon', 'evening'
    preferred_dentist_id UUID,
    language_preference TEXT DEFAULT 'en',
    accessibility_needs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(patient_id)
);

-- Communication Templates table (for admin)
CREATE TABLE IF NOT EXISTS communication_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name TEXT NOT NULL,
    template_type TEXT NOT NULL CHECK (template_type IN ('email', 'sms', 'notification')),
    category TEXT NOT NULL, -- 'appointment', 'billing', 'marketing', etc.
    subject TEXT,
    body TEXT NOT NULL,
    variables TEXT[], -- Available variables like {patient_name}, {appointment_date}
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled Messages table (for automated campaigns)
CREATE TABLE IF NOT EXISTS scheduled_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES communication_templates(id) ON DELETE SET NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    message_type TEXT NOT NULL CHECK (message_type IN ('email', 'sms')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'failed', 'cancelled')),
    subject TEXT,
    message_body TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Members table
CREATE TABLE IF NOT EXISTS staff_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('dentist', 'hygienist', 'receptionist', 'admin', 'other')),
    specialization TEXT,
    email TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    avatar_url TEXT,
    bio TEXT,
    working_hours JSONB, -- {monday: {start: '09:00', end: '17:00'}, ...}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Staff Availability table
CREATE TABLE IF NOT EXISTS staff_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff_members(id) ON DELETE CASCADE,
    available_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_blocked BOOLEAN DEFAULT false, -- for lunch, meetings, etc.
    block_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_family_groups_primary ON family_groups(primary_patient_id);
CREATE INDEX IF NOT EXISTS idx_family_members_group ON family_members(family_group_id);
CREATE INDEX IF NOT EXISTS idx_family_members_patient ON family_members(patient_id);
CREATE INDEX IF NOT EXISTS idx_messages_patient ON messages(patient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_patient ON notifications(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_patient_preferences_patient ON patient_preferences(patient_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_date ON scheduled_messages(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_status ON scheduled_messages(status);
CREATE INDEX IF NOT EXISTS idx_staff_members_role ON staff_members(role);
CREATE INDEX IF NOT EXISTS idx_staff_availability_staff ON staff_availability(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_availability_date ON staff_availability(available_date);

-- Enable RLS
ALTER TABLE family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Patients can view their family group"
    ON family_groups FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR primary_patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Patients can create family groups"
    ON family_groups FOR INSERT
    WITH CHECK (primary_patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage family groups"
    ON family_groups FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their family members"
    ON family_members FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR 
           family_group_id IN (SELECT id FROM family_groups WHERE primary_patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')));

CREATE POLICY "Patients can manage their family members"
    ON family_members FOR ALL
    USING (family_group_id IN (SELECT id FROM family_groups WHERE primary_patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')));

CREATE POLICY "Admins can manage all family members"
    ON family_members FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their messages"
    ON messages FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Patients can send messages"
    ON messages FOR INSERT
    WITH CHECK (patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email') AND sender_type = 'patient');

CREATE POLICY "Admins can manage all messages"
    ON messages FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their notifications"
    ON notifications FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Patients can update their notifications"
    ON notifications FOR UPDATE
    USING (patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage all notifications"
    ON notifications FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their preferences"
    ON patient_preferences FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Patients can manage their preferences"
    ON patient_preferences FOR ALL
    USING (patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage all preferences"
    ON patient_preferences FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admins can manage communication templates"
    ON communication_templates FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admins can view scheduled messages"
    ON scheduled_messages FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admins can manage scheduled messages"
    ON scheduled_messages FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Anyone can view active staff"
    ON staff_members FOR SELECT
    USING (is_active = true OR auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admins can manage staff"
    ON staff_members FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Anyone can view staff availability"
    ON staff_availability FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage staff availability"
    ON staff_availability FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Triggers
CREATE TRIGGER update_patient_preferences_updated_at
    BEFORE UPDATE ON patient_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communication_templates_updated_at
    BEFORE UPDATE ON communication_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default communication templates
INSERT INTO communication_templates (template_name, template_type, category, subject, body, variables) VALUES
    ('Appointment Reminder', 'email', 'appointment', 'Reminder: Your dental appointment tomorrow', 
     'Hi {patient_name},\n\nThis is a friendly reminder of your appointment:\n\nDate: {appointment_date}\nTime: {appointment_time}\nService: {service_type}\n\nSee you soon!', 
     ARRAY['patient_name', 'appointment_date', 'appointment_time', 'service_type']),
    ('Appointment Confirmation', 'email', 'appointment', 'Appointment Confirmed', 
     'Hi {patient_name},\n\nYour appointment has been confirmed:\n\nDate: {appointment_date}\nTime: {appointment_time}\n\nThank you!', 
     ARRAY['patient_name', 'appointment_date', 'appointment_time']),
    ('Payment Received', 'email', 'billing', 'Payment Received', 
     'Hi {patient_name},\n\nWe have received your payment of {amount}.\n\nThank you!', 
     ARRAY['patient_name', 'amount']),
    ('Birthday Bonus', 'email', 'marketing', 'Happy Birthday! 🎉', 
     'Happy Birthday {patient_name}!\n\nEnjoy 100 bonus loyalty points on us!\n\nYour current balance: {points_balance} points', 
     ARRAY['patient_name', 'points_balance'])
ON CONFLICT DO NOTHING;
