import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Calendar, Gift, FileText, DollarSign, MessageSquare, 
  Users, Settings, LogOut, Menu, X, Bell, User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardOverview from '../components/PatientDashboard/DashboardOverview';
import AppointmentsSection from '../components/PatientDashboard/AppointmentsSection';
import LoyaltySection from '../components/PatientDashboard/LoyaltySection';
import MedicalRecordsSection from '../components/PatientDashboard/MedicalRecordsSection';
import BillingSection from '../components/PatientDashboard/BillingSection';
import toast from 'react-hot-toast';

const ComprehensivePatientDashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, _setNotifications] = useState(3);

  // Mock data - will be replaced with actual API calls
  const [dashboardData, _setDashboardData] = useState({
    stats: {
      upcoming_appointments: 2,
      loyalty_points: 450,
      points_to_next_reward: 50,
      outstanding_balance: 250.00,
      unread_messages: 3
    },
    appointments: [],
    loyaltyPoints: {
      id: '1',
      patient_id: '1',
      points_balance: 450,
      lifetime_points: 1250,
      tier_level: 'Silver' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    rewards: [],
    transactions: [],
    redemptions: [],
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
    if (!authLoading && !user) {
      toast.error('Please login to access the dashboard');
      navigate('/login');
    } else if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, navigate]);

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
      // TODO: Load actual data from Supabase
      toast.success('Dashboard loaded successfully');
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'loyalty', label: 'Loyalty & Rewards', icon: Gift },
    { id: 'records', label: 'Medical Records', icon: FileText },
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
            onReschedule={(_id) => toast('Reschedule feature coming soon', { icon: '📅' })}
            onCancel={(_id) => toast('Cancel feature coming soon', { icon: '❌' })}
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
            onRedeemReward={(_id) => toast('Reward redemption coming soon', { icon: '🎁' })}
          />
        );
      case 'records':
        return (
          <MedicalRecordsSection
            dentalHistory={dashboardData.dentalHistory}
            documents={dashboardData.documents}
            treatmentPlans={dashboardData.treatmentPlans}
            prescriptions={dashboardData.prescriptions}
            medicalInfo={dashboardData.medicalInfo}
            onUploadDocument={() => toast('Upload feature coming soon', { icon: '⬆️' })}
            onDownloadDocument={(_id) => toast('Download feature coming soon', { icon: '⬇️' })}
          />
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
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Settings size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon</p>
          </div>
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
        className={`hidden lg:block fixed left-0 top-0 h-full bg-white shadow-xl z-40 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0'
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeSection === item.id
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
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeSection === item.id
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
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={24} className="text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <User size={24} className="text-gray-600" />
              </button>
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
