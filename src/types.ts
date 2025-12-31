export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  address?: string;
  emergency_contact?: string;
  medical_history?: string;
  insurance_info?: string;
  created_at: string;
  last_visit?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
  image_url?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface DaySchedule {
  date: string;
  slots: TimeSlot[];
}

export interface AdminStats {
  total_patients: number;
  appointments_today: number;
  pending_appointments: number;
  revenue_this_month: number;
  new_patients_this_month: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  notes?: string;
  created_at: string;
}

export interface Review {
  id: string;
  patient_name: string;
  rating: number;
  comment: string;
  service: string;
  created_at: string;
  approved: boolean;
}

// Loyalty Program Types
export interface LoyaltyPoints {
  id: string;
  patient_id: string;
  points_balance: number;
  lifetime_points: number;
  tier_level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  created_at: string;
  updated_at: string;
}

export interface PointsTransaction {
  id: string;
  patient_id: string;
  points: number;
  transaction_type: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  description: string;
  reference_id?: string;
  reference_type?: string;
  created_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  image_url?: string;
  category: string;
  redemption_limit?: number;
  active: boolean;
  created_at: string;
}

export interface RewardRedemption {
  id: string;
  patient_id: string;
  reward_id: string;
  reward_name?: string;
  points_spent: number;
  status: 'pending' | 'approved' | 'fulfilled' | 'cancelled';
  notes?: string;
  redeemed_at: string;
  fulfilled_at?: string;
}

export interface Referral {
  id: string;
  referrer_patient_id: string;
  referred_patient_id?: string;
  referral_code: string;
  referred_email?: string;
  referred_name?: string;
  status: 'pending' | 'completed' | 'rewarded';
  points_awarded: number;
  created_at: string;
  completed_at?: string;
}

// Medical Records Types
export interface DentalHistory {
  id: string;
  patient_id: string;
  appointment_id?: string;
  procedure_type: string;
  procedure_date: string;
  dentist_name?: string;
  tooth_number?: string;
  diagnosis?: string;
  treatment_notes?: string;
  cost?: number;
  created_at: string;
}

export interface MedicalDocument {
  id: string;
  patient_id: string;
  document_type: 'xray' | 'scan' | 'photo' | 'report' | 'insurance' | 'consent' | 'other';
  file_url: string;
  file_name: string;
  file_size?: number;
  description?: string;
  document_date?: string;
  uploaded_by?: string;
  created_at: string;
}

export interface TreatmentPlan {
  id: string;
  patient_id: string;
  title: string;
  description?: string;
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  total_cost?: number;
  estimated_duration?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  end_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  phases?: TreatmentPlanPhase[];
}

export interface TreatmentPlanPhase {
  id: string;
  treatment_plan_id: string;
  phase_number: number;
  phase_name: string;
  description?: string;
  procedures?: string[];
  estimated_cost?: number;
  status: 'pending' | 'completed' | 'skipped';
  completed_date?: string;
  notes?: string;
  created_at: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  appointment_id?: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
  prescribed_by?: string;
  prescribed_date: string;
  refills_remaining: number;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export interface PatientMedicalInfo {
  id: string;
  patient_id: string;
  info_type: 'allergy' | 'condition' | 'medication';
  name: string;
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
  reported_date?: string;
  created_at: string;
}

// Billing Types
export interface Invoice {
  id: string;
  patient_id: string;
  appointment_id?: string;
  invoice_number: string;
  invoice_date: string;
  due_date?: string;
  subtotal: number;
  tax: number;
  discount: number;
  total_amount: number;
  amount_paid: number;
  balance: number;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  service_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Payment {
  id: string;
  patient_id: string;
  invoice_id?: string;
  payment_date: string;
  amount: number;
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'insurance' | 'payment_plan' | 'other';
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  processed_by?: string;
  created_at: string;
}

export interface PaymentPlan {
  id: string;
  patient_id: string;
  invoice_id?: string;
  total_amount: number;
  amount_paid: number;
  remaining_balance: number;
  installment_amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  number_of_installments: number;
  installments_completed: number;
  start_date: string;
  next_payment_date?: string;
  status: 'active' | 'completed' | 'cancelled' | 'defaulted';
  created_at: string;
  updated_at: string;
  installments?: PaymentInstallment[];
}

export interface PaymentInstallment {
  id: string;
  payment_plan_id: string;
  installment_number: number;
  due_date: string;
  amount_due: number;
  amount_paid: number;
  status: 'pending' | 'paid' | 'overdue' | 'skipped';
  paid_date?: string;
  payment_id?: string;
  created_at: string;
}

export interface InsuranceInfo {
  id: string;
  patient_id: string;
  provider_name: string;
  policy_number: string;
  group_number?: string;
  subscriber_name?: string;
  subscriber_relationship?: string;
  coverage_start_date?: string;
  coverage_end_date?: string;
  coverage_details?: string;
  card_front_url?: string;
  card_back_url?: string;
  is_primary: boolean;
  status: 'active' | 'inactive' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface InsuranceClaim {
  id: string;
  patient_id: string;
  invoice_id?: string;
  insurance_id?: string;
  claim_number?: string;
  claim_date: string;
  service_date: string;
  total_billed: number;
  insurance_paid: number;
  patient_responsibility: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'partially_approved' | 'denied' | 'paid';
  denial_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Family and Communication Types
export interface FamilyGroup {
  id: string;
  primary_patient_id: string;
  family_name?: string;
  combined_loyalty_points: boolean;
  created_at: string;
  members?: FamilyMember[];
}

export interface FamilyMember {
  id: string;
  family_group_id: string;
  patient_id: string;
  patient?: Patient;
  relationship?: string;
  is_primary: boolean;
  can_manage_family: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  patient_id: string;
  sender_type: 'patient' | 'staff' | 'system';
  sender_id?: string;
  subject?: string;
  message_body: string;
  message_type: 'general' | 'appointment' | 'billing' | 'results' | 'marketing' | 'reminder';
  is_read: boolean;
  parent_message_id?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  patient_id: string;
  notification_type: 'appointment_reminder' | 'appointment_confirmation' | 'appointment_cancelled' | 'results_ready' | 'billing_reminder' | 'payment_received' | 'loyalty_points' | 'general';
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  sent_via_email: boolean;
  sent_via_sms: boolean;
  created_at: string;
}

export interface PatientPreferences {
  id: string;
  patient_id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  appointment_reminders: boolean;
  reminder_timing: number;
  preferred_contact_method: 'email' | 'sms' | 'phone' | 'none';
  preferred_appointment_time?: string;
  preferred_dentist_id?: string;
  language_preference: string;
  accessibility_needs?: string;
  created_at: string;
  updated_at: string;
}

export interface StaffMember {
  id: string;
  user_id: string;
  full_name: string;
  role: 'dentist' | 'hygienist' | 'receptionist' | 'admin' | 'other';
  specialization?: string;
  email?: string;
  phone?: string;
  is_active: boolean;
  avatar_url?: string;
  bio?: string;
  working_hours?: any;
  created_at: string;
}

// Dashboard Stats Types
export interface PatientDashboardStats {
  upcoming_appointments: number;
  loyalty_points: number;
  points_to_next_reward: number;
  outstanding_balance: number;
  unread_messages: number;
}

export interface AdminDashboardStats {
  appointments_today: number;
  appointments_this_week: number;
  appointments_this_month: number;
  total_patients: number;
  new_patients_this_month: number;
  revenue_today: number;
  revenue_this_week: number;
  revenue_this_month: number;
  outstanding_payments: number;
  pending_redemptions: number;
  total_loyalty_points_issued: number;
  average_rating: number;
}
