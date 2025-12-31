-- ============================================================================
-- SUPABASE AUTOMATION SETUP SCRIPT
-- EmailJS Integration + Appointment Reminders + Workflow Tracking
-- ============================================================================

-- ============================================================================
-- 1. CREATE AUTOMATION TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    template_type TEXT NOT NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('sent', 'failed', 'pending')),
    error_message TEXT,
    emailjs_message_id TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointment_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL CHECK (reminder_type IN ('24h', '2h', 'followup')),
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_name TEXT NOT NULL,
    workflow_type TEXT NOT NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'running' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    context JSONB,
    results JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_appointment ON email_logs(appointment_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_appointment_reminders_scheduled ON appointment_reminders(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_appointment_reminders_status ON appointment_reminders(status);
CREATE INDEX IF NOT EXISTS idx_appointment_reminders_type ON appointment_reminders(reminder_type);
CREATE INDEX IF NOT EXISTS idx_appointment_reminders_appointment ON appointment_reminders(appointment_id);

CREATE INDEX IF NOT EXISTS idx_workflow_executions_appointment ON workflow_executions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_type ON workflow_executions(workflow_type);

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. CREATE RLS POLICIES
-- ============================================================================

-- Email logs policies
DROP POLICY IF EXISTS "Anyone can create email logs" ON email_logs;
CREATE POLICY "Anyone can create email logs"
    ON email_logs FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view email logs" ON email_logs;
CREATE POLICY "Admins can view email logs"
    ON email_logs FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Appointment reminders policies
DROP POLICY IF EXISTS "Anyone can create reminders" ON appointment_reminders;
CREATE POLICY "Anyone can create reminders"
    ON appointment_reminders FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view reminders" ON appointment_reminders;
CREATE POLICY "Admins can view reminders"
    ON appointment_reminders FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Workflow execution policies
DROP POLICY IF EXISTS "Anyone can create workflow executions" ON workflow_executions;
CREATE POLICY "Anyone can create workflow executions"
    ON workflow_executions FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view workflows" ON workflow_executions;
CREATE POLICY "Admins can view workflows"
    ON workflow_executions FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- ============================================================================
-- 5. CREATE FUNCTIONS FOR AUTOMATION
-- ============================================================================

-- Function to schedule reminders when appointment is created
CREATE OR REPLACE FUNCTION schedule_appointment_reminders()
RETURNS TRIGGER AS $$
DECLARE
    reminder_24h TIMESTAMP WITH TIME ZONE;
    reminder_2h TIMESTAMP WITH TIME ZONE;
    appointment_datetime TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Combine appointment date and time
    appointment_datetime := (NEW.appointment_date || ' ' || NEW.appointment_time)::TIMESTAMP;
    
    -- Calculate reminder times
    reminder_24h := appointment_datetime - INTERVAL '24 hours';
    reminder_2h := appointment_datetime - INTERVAL '2 hours';
    
    -- Insert 24-hour reminder
    INSERT INTO appointment_reminders (appointment_id, reminder_type, scheduled_time, status)
    VALUES (NEW.id, '24h', reminder_24h, 'pending')
    ON CONFLICT DO NOTHING;
    
    -- Insert 2-hour reminder
    INSERT INTO appointment_reminders (appointment_id, reminder_type, scheduled_time, status)
    VALUES (NEW.id, '2h', reminder_2h, 'pending')
    ON CONFLICT DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically schedule reminders on appointment creation
DROP TRIGGER IF EXISTS trigger_schedule_reminders ON appointments;
CREATE TRIGGER trigger_schedule_reminders
    AFTER INSERT ON appointments
    FOR EACH ROW
    WHEN (NEW.status = 'pending' OR NEW.status = 'confirmed')
    EXECUTE FUNCTION schedule_appointment_reminders();

-- ============================================================================
-- 6. CREATE VIEWS FOR EASY QUERYING
-- ============================================================================

-- View for pending reminders that need to be sent
CREATE OR REPLACE VIEW pending_reminders_to_send AS
SELECT
    ar.id,
    ar.appointment_id,
    ar.reminder_type,
    ar.scheduled_time,
    a.patient_name,
    a.patient_email,
    a.appointment_date,
    a.appointment_time,
    a.service_type
FROM appointment_reminders ar
JOIN appointments a ON ar.appointment_id = a.id
WHERE ar.status = 'pending'
AND ar.scheduled_time <= NOW()
ORDER BY ar.scheduled_time ASC;

-- View for email statistics
CREATE OR REPLACE VIEW email_statistics AS
SELECT
    DATE(created_at) as date,
    template_type,
    status,
    COUNT(*) as count
FROM email_logs
GROUP BY DATE(created_at), template_type, status
ORDER BY DATE(created_at) DESC, template_type;

-- View for workflow statistics
CREATE OR REPLACE VIEW workflow_statistics AS
SELECT
    workflow_type,
    status,
    COUNT(*) as total,
    ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at))), 2) as avg_duration_seconds
FROM workflow_executions
WHERE started_at >= NOW() - INTERVAL '30 days'
GROUP BY workflow_type, status;

-- ============================================================================
-- 7. GRANT PERMISSIONS
-- ============================================================================

-- For Supabase service role (used by Edge Functions)
GRANT SELECT, INSERT, UPDATE ON email_logs TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON appointment_reminders TO authenticated, anon;
GRANT SELECT, INSERT ON workflow_executions TO authenticated, anon;

-- ============================================================================
-- 8. SAMPLE DATA FOR TESTING
-- ============================================================================

-- Test appointment (uncomment to create)
-- INSERT INTO appointments (patient_name, patient_email, patient_phone, appointment_date, appointment_time, service_type, status)
-- VALUES (
--   'John Doe',
--   'john@example.com',
--   '+27791234567',
--   CURRENT_DATE + INTERVAL '3 days',
--   '10:00',
--   'Teeth Cleaning',
--   'pending'
-- );

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- Tables created:
-- - email_logs: Tracks all email sending
-- - appointment_reminders: Manages reminder scheduling
-- - workflow_executions: Tracks automation workflows
--
-- Functions created:
-- - schedule_appointment_reminders(): Auto-schedules reminders on appointment creation
--
-- Views created:
-- - pending_reminders_to_send: Get reminders to send now
-- - email_statistics: Email sending statistics
-- - workflow_statistics: Workflow execution statistics
--
-- Next steps:
-- 1. Deploy Edge Functions
-- 2. Set up Supabase webhooks
-- 3. Configure EmailJS credentials
