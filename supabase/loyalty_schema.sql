-- Loyalty Program Tables

-- Loyalty Points table
CREATE TABLE IF NOT EXISTS loyalty_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    points_balance INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    tier_level TEXT DEFAULT 'Bronze' CHECK (tier_level IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(patient_id)
);

-- Points Transactions table
CREATE TABLE IF NOT EXISTS points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'adjusted')),
    description TEXT NOT NULL,
    reference_id UUID, -- links to appointment, reward, etc.
    reference_type TEXT, -- 'appointment', 'reward', 'referral', 'review', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewards Catalog table
CREATE TABLE IF NOT EXISTS rewards_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    image_url TEXT,
    category TEXT,
    redemption_limit INTEGER, -- null = unlimited
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reward Redemptions table
CREATE TABLE IF NOT EXISTS reward_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES rewards_catalog(id) ON DELETE CASCADE,
    points_spent INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'fulfilled', 'cancelled')),
    notes TEXT,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fulfilled_at TIMESTAMP WITH TIME ZONE
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    referred_patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    referral_code TEXT UNIQUE NOT NULL,
    referred_email TEXT,
    referred_name TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
    points_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Service Points Configuration table
CREATE TABLE IF NOT EXISTS service_points_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL DEFAULT 0,
    multiplier DECIMAL(3,2) DEFAULT 1.0,
    active BOOLEAN DEFAULT TRUE,
    UNIQUE(service_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_loyalty_points_patient ON loyalty_points(patient_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_patient ON points_transactions(patient_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_date ON points_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_patient ON reward_redemptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_status ON reward_redemptions(status);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_patient_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);

-- Enable RLS
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_points_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Patients can view their loyalty points"
    ON loyalty_points FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage loyalty points"
    ON loyalty_points FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their transactions"
    ON points_transactions FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage transactions"
    ON points_transactions FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Anyone can view active rewards"
    ON rewards_catalog FOR SELECT
    USING (active = true OR auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admins can manage rewards"
    ON rewards_catalog FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their redemptions"
    ON reward_redemptions FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Patients can create redemptions"
    ON reward_redemptions FOR INSERT
    WITH CHECK (patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage redemptions"
    ON reward_redemptions FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Patients can view their referrals"
    ON referrals FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users) OR referrer_patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Patients can create referrals"
    ON referrals FOR INSERT
    WITH CHECK (referrer_patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can manage referrals"
    ON referrals FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Anyone can view service points config"
    ON service_points_config FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage service points config"
    ON service_points_config FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Insert default rewards
INSERT INTO rewards_catalog (name, description, points_required, category, active) VALUES
    ('Free Teeth Whitening', 'Professional in-office whitening treatment', 1000, 'cosmetic', true),
    ('Free Fluoride Treatment', 'Protective fluoride application', 500, 'preventive', true),
    ('50% Off Invisalign Consultation', 'Half price orthodontic consultation', 750, 'orthodontics', true),
    ('Free Electric Toothbrush', 'Premium electric toothbrush', 300, 'product', true),
    ('Priority Booking', 'Skip the waitlist for 3 months', 250, 'service', true),
    ('10% Off Next Visit', 'Discount on your next treatment', 150, 'discount', true),
    ('Free Dental X-Ray', 'Complimentary x-ray imaging', 600, 'diagnostic', true),
    ('Complimentary Deep Cleaning', 'Professional deep cleaning session', 1200, 'preventive', true)
ON CONFLICT DO NOTHING;

-- Insert default service points configuration
INSERT INTO service_points_config (service_id, points_earned)
SELECT id, 
    CASE 
        WHEN name LIKE '%Checkup%' THEN 50
        WHEN name LIKE '%Cleaning%' THEN 75
        WHEN name LIKE '%Filling%' THEN 100
        WHEN name LIKE '%Root Canal%' THEN 150
        WHEN name LIKE '%Whitening%' THEN 200
        WHEN name LIKE '%Crown%' THEN 250
        WHEN name LIKE '%Implant%' THEN 500
        ELSE 50
    END
FROM services
ON CONFLICT DO NOTHING;
