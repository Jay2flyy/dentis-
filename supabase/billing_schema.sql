-- Billing and Payments Tables

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    balance DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid', 'overdue', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice Line Items table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'insurance', 'payment_plan', 'other')),
    transaction_id TEXT,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    notes TEXT,
    processed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Plans table
CREATE TABLE IF NOT EXISTS payment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    remaining_balance DECIMAL(10,2) NOT NULL,
    installment_amount DECIMAL(10,2) NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
    number_of_installments INTEGER NOT NULL,
    installments_completed INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    next_payment_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'defaulted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Plan Installments table
CREATE TABLE IF NOT EXISTS payment_installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_plan_id UUID REFERENCES payment_plans(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL,
    due_date DATE NOT NULL,
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'skipped')),
    paid_date DATE,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance Information table
CREATE TABLE IF NOT EXISTS insurance_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    provider_name TEXT NOT NULL,
    policy_number TEXT NOT NULL,
    group_number TEXT,
    subscriber_name TEXT,
    subscriber_relationship TEXT,
    coverage_start_date DATE,
    coverage_end_date DATE,
    coverage_details TEXT,
    card_front_url TEXT,
    card_back_url TEXT,
    is_primary BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance Claims table
CREATE TABLE IF NOT EXISTS insurance_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    insurance_id UUID REFERENCES insurance_info(id) ON DELETE SET NULL,
    claim_number TEXT UNIQUE,
    claim_date DATE NOT NULL,
    service_date DATE NOT NULL,
    total_billed DECIMAL(10,2) NOT NULL,
    insurance_paid DECIMAL(10,2) DEFAULT 0,
    patient_responsibility DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'partially_approved', 'denied', 'paid')),
    denial_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_patient ON invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_patient ON payments(patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payment_plans_patient ON payment_plans(patient_id);
CREATE INDEX IF NOT EXISTS idx_payment_plans_status ON payment_plans(status);
CREATE INDEX IF NOT EXISTS idx_payment_installments_plan ON payment_installments(payment_plan_id);
CREATE INDEX IF NOT EXISTS idx_insurance_info_patient ON insurance_info(patient_id);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_patient ON insurance_claims(patient_id);
CREATE INDEX IF NOT EXISTS idx_insurance_claims_status ON insurance_claims(status);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Patients can view their invoices"
    ON invoices FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage invoices"
    ON invoices FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their invoice items"
    ON invoice_items FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR invoice_id IN (SELECT id FROM invoices WHERE patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')));

CREATE POLICY "Admins can manage invoice items"
    ON invoice_items FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their payments"
    ON payments FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage payments"
    ON payments FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their payment plans"
    ON payment_plans FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage payment plans"
    ON payment_plans FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their installments"
    ON payment_installments FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR payment_plan_id IN (SELECT id FROM payment_plans WHERE patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')));

CREATE POLICY "Admins can manage installments"
    ON payment_installments FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their insurance info"
    ON insurance_info FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Patients can manage their insurance info"
    ON insurance_info FOR ALL
    USING (patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage all insurance info"
    ON insurance_info FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their insurance claims"
    ON insurance_claims FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage insurance claims"
    ON insurance_claims FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    current_year TEXT;
BEGIN
    current_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    new_number := 'INV-' || current_year || '-' || LPAD((SELECT COUNT(*) + 1 FROM invoices WHERE invoice_date >= DATE_TRUNC('year', CURRENT_DATE))::TEXT, 5, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate invoice number
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL THEN
        NEW.invoice_number := generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_invoice_number
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION set_invoice_number();

-- Trigger to update invoice updated_at
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_plans_updated_at
    BEFORE UPDATE ON payment_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_info_updated_at
    BEFORE UPDATE ON insurance_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_claims_updated_at
    BEFORE UPDATE ON insurance_claims
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
