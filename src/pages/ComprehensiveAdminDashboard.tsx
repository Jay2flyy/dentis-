import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Home, Calendar, Users, Gift, FileText, DollarSign, MessageSquare,
  Settings, LogOut, Menu, X, Bell, BarChart3, Briefcase, TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminOverview from '../components/AdminDashboard/AdminOverview';
import PatientsManagement from '../components/AdminDashboard/PatientsManagement';
import LoyaltyManagement from '../components/AdminDashboard/LoyaltyManagement';
import toast from 'react-hot-toast';
import { AdminDashboardStats } from '../types';

const ComprehensiveAdminDashboard = () => {
  const { user, signOut, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(5);

  // Mock data - will be replaced with actual API calls
  const [dashboardData, setDashboardData] = useState({
    stats: {
      appointments_today: 12,
      appointments_this_week: 47,
      appointments_this_month: 186,
      total_patients: 450,
      new_patients_this_month: 23,
      revenue_today: 2850.00,
      revenue_this_week: 14250.00,
      revenue_this_month: 52380.00,
      outstanding_payments: 8450.00,
      pending_redemptions: 7,
      total_loyalty_points_issued: 125000,
      average_rating: 4.8
    } as AdminDashboardStats,
    patients: [],
    appointments: [],
    rewards: [],
    redemptions: [],
    invoices: [],
    staff: []
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to access the admin dashboard');
      navigate('/login');
    } else if (!authLoading && user && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/patient-dashboard');
    } else if (user && isAdmin) {
      loadDashboardData();
    }
  }, [user, authLoading, isAdmin, navigate]);

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const loadDashboardData = async () => {
    try {
      // TODO: Load actual data from Supabase
      toast.success('Admin dashboard loaded');
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
    { id: 'overview', label: 'Dashboard Overview', icon: Home },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patient Management', icon: Users },
    { id: 'loyalty', label: 'Loyalty Program', icon: Gift, badge: dashboardData.stats.pending_redemptions },
    { id: 'billing', label: 'Billing & Payments', icon: DollarSign },
    { id: 'treatments', label: 'Treatments & Plans', icon: FileText },
    { id: 'staff', label: 'Staff Management', icon: Briefcase },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <AdminOverview
            stats={dashboardData.stats}
            onNavigate={setActiveSection}
          />
        );
      case 'patients':
        return (
          <PatientsManagement
            patients={dashboardData.patients}
            onAddPatient={() => toast.info('Add patient feature coming soon')}
            onEditPatient={(id) => toast.info('Edit patient feature coming soon')}
            onViewDetails={(id) => toast.info('View details feature coming soon')}
          />
        );
      case 'loyalty':
        return (
          <LoyaltyManagement
            rewards={dashboardData.rewards}
            redemptions={dashboardData.redemptions}
            onAddReward={() => toast.info('Add reward feature coming soon')}
            onEditReward={(id) => toast.info('Edit reward feature coming soon')}
            onDeleteReward={(id) => toast.info('Delete reward feature coming soon')}
            onApproveRedemption={(id) => toast.success('Redemption approved')}
            onRejectRedemption={(id) => toast.error('Redemption rejected')}
          />
        );
      case 'appointments':
        return (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Calendar size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointments Management</h2>
            <p className="text-gray-600">Full appointment scheduling system coming soon</p>
          </div>
        );
      case 'billing':
        return (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <DollarSign size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Billing & Payments</h2>
            <p className="text-gray-600">Comprehensive billing system coming soon</p>
          </div>
        );
      case 'treatments':
        return (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Treatments & Plans</h2>
            <p className="text-gray-600">Treatment plan management coming soon</p>
          </div>
        );
      case 'staff':
        return (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Briefcase size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Staff Management</h2>
            <p className="text-gray-600">Staff scheduling and management coming soon</p>
          </div>
        );
      case 'communications':
        return (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <MessageSquare size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Communications Center</h2>
            <p className="text-gray-600">Patient communications system coming soon</p>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <BarChart3 size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reports & Analytics</h2>
            <p className="text-gray-600">Advanced analytics dashboard coming soon</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Settings size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">System Settings</h2>
            <p className="text-gray-600">Configuration panel coming soon</p>
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
        className={`hidden lg:block fixed left-0 top-0 h-full bg-gradient-to-b from-indigo-900 to-purple-900 shadow-xl z-40 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Admin Profile */}
          <div className="mb-8 pb-6 border-b border-white border-opacity-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-900 font-bold text-lg">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">Admin</p>
                <p className="text-sm text-indigo-200">Administrator</p>
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
                    ? 'bg-white text-indigo-900'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
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
            className="w-full flex items-center gap-3 px-4 py-3 mt-6 text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition"
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
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-indigo-900 to-purple-900 shadow-xl z-50"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation */}
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
                          ? 'bg-white text-indigo-900'
                          : 'text-white hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 mt-6 text-red-300 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition"
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
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                A
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

export default ComprehensiveAdminDashboard;
