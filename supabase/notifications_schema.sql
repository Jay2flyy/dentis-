-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE, -- NULL means global/system-wide
    notification_type TEXT NOT NULL CHECK (notification_type IN (
        'appointment_reminder', 
        'appointment_confirmation', 
        'appointment_cancelled', 
        'results_ready', 
        'billing_reminder', 
        'payment_received', 
        'loyalty_points', 
        'general', 
        'marketing'
    )),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    sent_via_email BOOLEAN DEFAULT FALSE,
    sent_via_sms BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
-- Patients can see their own notifications + global ones
CREATE POLICY "Patients can view their own notifications"
    ON notifications FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users) OR 
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email') OR 
        patient_id IS NULL
    );

-- Patients can update is_read status for their own notifications
CREATE POLICY "Patients can update their own notifications"
    ON notifications FOR UPDATE
    USING (
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
    )
    WITH CHECK (
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
    );

-- Admins can do everything
CREATE POLICY "Admins can manage all notifications"
    ON notifications FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_patient ON notifications(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
