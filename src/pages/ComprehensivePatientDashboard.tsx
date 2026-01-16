import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Home, Calendar, Gift, FileText, DollarSign, MessageSquare,
  Users, Settings, LogOut, Menu, X, Bell, User, CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import DashboardOverview from '../components/PatientDashboard/DashboardOverview';
import AppointmentsSection from '../components/PatientDashboard/AppointmentsSection';
import LoyaltySection from '../components/PatientDashboard/LoyaltySection';
import MedicalRecordsSection from '../components/PatientDashboard/MedicalRecordsSection';
import MedicalAidSection from '../components/PatientDashboard/MedicalAidSection';
import BillingSection from '../components/PatientDashboard/BillingSection';
import ProfileSection from '../components/PatientDashboard/ProfileSection';
import NotificationPopover from '../components/PatientDashboard/NotificationPopover';
import toast from 'react-hot-toast';

const ComprehensivePatientDashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);

  // Mock data - will be replaced with actual API calls
  const [dashboardData, setDashboardData] = useState({
    stats: {
      upcoming_appointments: 0,
      loyalty_points: 0,
      points_to_next_reward: 0,
      outstanding_balance: 0,
      unread_messages: 0
    },
    appointments: [] as any[],
    loyaltyPoints: null as any,
    rewards: [] as any[],
    transactions: [] as any[],
    redemptions: [] as any[],
    referrals: [],
    dentalHistory: [],
    documents: [],
    treatmentPlans: [],
    prescriptions: [],
    medicalInfo: [],
    invoices: [],
    payments: [],
    paymentPlans: [],
    insuranceInfo: [],
    messages: [],
    familyMembers: []
  });

  useEffect(() => {
    if (isLoggingOut) return;

    if (!authLoading && !user) {
      toast.error('Please login to access the dashboard');
      navigate('/login');
    } else if (user && !isLoggingOut) {
      loadDashboardData();
    }
  }, [user, authLoading, navigate, isLoggingOut]);

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const loadDashboardData = async () => {
    try {
      if (!user) return;

      // Fetch Profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      // Fetch Appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_email', user.email) // Use email as link since patient_id might not map to auth.uid directly yet
        .order('appointment_date', { ascending: true });

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
      }

      // Fetch patient record first to get the correct ID for loyalty/transactions
      const { data: patientRecord } = await supabase.from('patients').select('id').eq('email', user.email).single();

      let realLoyaltyPoints: any = null;
      let realTransactions: any[] = [];
      let realRedemptions: any[] = [];

      if (patientRecord) {
        setPatientId(patientRecord.id);
        const { data: lp } = await supabase.from('loyalty_points').select('*').eq('patient_id', patientRecord.id).single();
        realLoyaltyPoints = lp;

        const { data: trans } = await supabase.from('points_transactions').select('*').eq('patient_id', patientRecord.id).order('created_at', { ascending: false });
        realTransactions = trans || [];

        const { data: reds } = await supabase.from('reward_redemptions').select('*, reward:rewards_catalog(name)').eq('patient_id', patientRecord.id).order('created_at', { ascending: false });
        realRedemptions = reds || [];
      }

      // Fetch Notifications
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .or(`patient_id.eq.${patientRecord?.id || '00000000-0000-0000-0000-000000000000'},patient_id.is.null`)
        .order('created_at', { ascending: false });

      setNotifications(notifs || []);

      // Fetch Rewards Catalog
      const { data: rewards } = await supabase.from('rewards_catalog').select('*').eq('active', true);

      // Process Data
      const now = new Date();
      // Filter appointments manually if date string
      const upcomingAppointments = (appointments || []).filter(a => new Date(a.appointment_date + 'T' + a.appointment_time) >= now);

      const loyaltyBalance = realLoyaltyPoints?.points_balance || 0;
      const pointsToNextReward = Math.max(0, 500 - loyaltyBalance);

      // Map Appointments to expected format
      const mappedAppointments = (appointments || []).map(a => ({
        id: a.id,
        doctor_name: 'General Dentist',
        appointment_date: a.appointment_date + ' ' + a.appointment_time, // Combine for display if needed or keep separate
        service_type: a.service_type || 'General Checkup',
        status: a.status,
        location: 'SmileCare Clinic',
        notes: a.notes
      }));

      // Calculate outstanding balance (mock logic or from payments)
      const outstandingBalance = 0;

      setDashboardData(prev => ({
        ...prev,
        stats: {
          upcoming_appointments: upcomingAppointments.length,
          loyalty_points: loyaltyBalance,
          points_to_next_reward: pointsToNextReward,
          outstanding_balance: outstandingBalance,
          unread_messages: notifs?.filter((n: any) => !n.is_read).length || 0
        },
        appointments: mappedAppointments,
        loyaltyPoints: realLoyaltyPoints || { points_balance: 0, tier_level: 'Bronze', lifetime_points: 0 },
        rewards: rewards || [],
        transactions: realTransactions,
        redemptions: realRedemptions,
      }));

      toast.success('Dashboard updated');
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;
      toast.success('Appointment cancelled');
      loadDashboardData();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    try {
      const reward = dashboardData.rewards.find(r => r.id === rewardId);
      if (!reward) return;

      if (dashboardData.loyaltyPoints.points_balance < reward.points_required) {
        toast.error('Insufficient loyalty points');
        return;
      }

      const { data: redemption, error } = await supabase
        .from('reward_redemptions')
        .insert([{
          patient_id: patientId,
          reward_id: rewardId,
          status: 'pending'
        }]);

      if (error) throw error;
      toast.success('Redemption request submitted!');
      loadDashboardData();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Failed to process redemption');
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
      setIsLoggingOut(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'loyalty', label: 'Loyalty & Rewards', icon: Gift },
    { id: 'medical', label: 'Medical Records', icon: FileText },
    { id: 'medical-aid', label: 'Medical Aid', icon: CreditCard },
    { id: 'billing', label: 'Billing & Payments', icon: DollarSign },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: dashboardData.stats.unread_messages },
    { id: 'family', label: 'Family Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <DashboardOverview
            stats={dashboardData.stats}
            nextAppointment={dashboardData.appointments[0]}
            loyaltyPoints={dashboardData.loyaltyPoints}
            onNavigate={setActiveSection}
          />
        );
      case 'appointments':
        return (
          <AppointmentsSection
            appointments={dashboardData.appointments}
            onBookNew={() => navigate('/booking')}
            onReschedule={(_id) => toast('Please call the clinic to reschedule', { icon: '📞' })}
            onCancel={handleCancelAppointment}
            onDownload={(_id) => toast('Download feature coming soon', { icon: '⬇️' })}
          />
        );
      case 'loyalty':
        return (
          <LoyaltySection
            loyaltyPoints={dashboardData.loyaltyPoints}
            rewards={dashboardData.rewards}
            transactions={dashboardData.transactions}
            redemptions={dashboardData.redemptions}
            referrals={dashboardData.referrals}
            onRedeemReward={handleRedeemReward}
          />
        );
      case 'medical':
        return (
          <MedicalRecordsSection
            dentalHistory={dashboardData.dentalHistory}
            documents={dashboardData.documents}
            treatmentPlans={dashboardData.treatmentPlans}
            prescriptions={dashboardData.prescriptions}
            medicalInfo={dashboardData.medicalInfo}
            patientId={patientId || ''}
            onUploadDocument={loadDashboardData}
            onDownloadDocument={(id) => console.log('Download', id)}
          />
        );
      case 'medical-aid':
        return (
          <MedicalAidSection patientId={patientId || ''} />
        );
      case 'billing':
        return (
          <BillingSection
            invoices={dashboardData.invoices}
            payments={dashboardData.payments}
            paymentPlans={dashboardData.paymentPlans}
            insuranceInfo={dashboardData.insuranceInfo}
            onPayInvoice={(_id) => toast('Payment feature coming soon', { icon: '💳' })}
            onDownloadInvoice={(_id) => toast('Download feature coming soon', { icon: '⬇️' })}
            onPrintInvoice={(_id) => toast('Print feature coming soon', { icon: '🖨️' })}
            onSetupPaymentPlan={(_id) => toast('Payment plan setup coming soon', { icon: '📋' })}
            onAddInsurance={() => toast('Add insurance feature coming soon', { icon: '🛡️' })}
          />
        );
      case 'messages':
        return (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <MessageSquare size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Messages</h2>
            <p className="text-gray-600">Message center coming soon</p>
          </div>
        );
      case 'family':
        return (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Family Management</h2>
            <p className="text-gray-600">Family management features coming soon</p>
          </div>
        );
      case 'settings':
        return (
          <ProfileSection />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className={`hidden lg:block fixed left-0 top-0 h-full bg-white shadow-xl z-40 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'
          }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-purple-600">Dental Care</h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile */}
          <div className="mb-8 pb-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{user?.email}</p>
                <p className="text-sm text-gray-600">Patient</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSection === item.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 mt-6 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-bold text-purple-600">Dental Care</h1>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* User Profile */}
                <div className="mb-8 pb-6 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user?.email?.[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{user?.email}</p>
                      <p className="text-sm text-gray-600">Patient</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSection === item.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                {/* Logout Button */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 mt-6 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <NotificationPopover
                notifications={notifications}
                onMarkAsRead={async (id) => {
                  try {
                    const { error } = await supabase
                      .from('notifications')
                      .update({ is_read: true })
                      .eq('id', id);
                    if (error) throw error;
                    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
                  } catch (error) {
                    console.error('Error marking as read:', error);
                  }
                }}
                onMarkAllAsRead={async () => {
                  try {
                    // Get current user patient ID
                    const { data: p } = await supabase.from('patients').select('id').eq('email', user?.email).single();
                    if (!p) return;

                    const { error } = await supabase
                      .from('notifications')
                      .update({ is_read: true })
                      .eq('patient_id', p.id);
                    if (error) throw error;
                    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                    toast.success('All notifications marked as read');
                  } catch (error) {
                    console.error('Error marking all as read:', error);
                  }
                }}
              />
              <div className="flex items-center gap-2 pl-4 border-l">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <User size={24} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default ComprehensivePatientDashboard;
