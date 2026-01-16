import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Home, Calendar, Users, Gift, FileText, DollarSign, MessageSquare,
  Settings, LogOut, Menu, X, Bell, BarChart3, Briefcase, CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AdminOverview from '../components/AdminDashboard/AdminOverview';
import PatientsManagement from '../components/AdminDashboard/PatientsManagement';
import LoyaltyManagement from '../components/AdminDashboard/LoyaltyManagement';
import CommunicationCenter from '../components/AdminDashboard/CommunicationCenter';
import MedicalAidManagement from '../components/AdminDashboard/MedicalAidManagement';
import AdminUserManagement from '../components/AdminDashboard/AdminUserManagement';
import toast from 'react-hot-toast';
import { AdminDashboardStats, Patient, Appointment, Reward, RewardRedemption, Invoice, StaffMember } from '../types';
import RewardModal from '../components/AdminDashboard/RewardModal';

const ComprehensiveAdminDashboard = () => {
  const { user, signOut, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading for dashboard data
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState(0);

  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | undefined>(undefined);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      appointments_today: 0,
      appointments_this_week: 0,
      appointments_this_month: 0,
      total_patients: 0,
      new_patients_this_month: 0,
      revenue_today: 0,
      revenue_this_week: 0,
      revenue_this_month: 0,
      outstanding_payments: 0,
      pending_redemptions: 0,
      total_loyalty_points_issued: 0,
      average_rating: 0
    } as AdminDashboardStats,
    patients: [] as Patient[],
    appointments: [] as Appointment[],
    rewards: [] as Reward[],
    redemptions: [] as RewardRedemption[],
    invoices: [] as Invoice[],
    staff: [] as StaffMember[]
  });

  useEffect(() => {
    if (isLoggingOut) return;

    if (!authLoading && !user) {
      toast.error('Please login to access the dashboard');
      navigate('/login');
    } else if (user && !authLoading && !isLoggingOut) {
      if (!isAdmin) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
      } else {
        loadDashboardData();
      }
    }
  }, [user, isAdmin, authLoading, navigate, isLoggingOut]);

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
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())).toISOString();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

      // Fetch Appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (appointmentsError) throw appointmentsError;

      // Map appointments to type
      const appointments: Appointment[] = (appointmentsData || []).map(apt => ({
        ...apt,
        id: apt.id,
        patient_id: apt.patient_id,
        patient_name: apt.patient_name || 'Unknown',
        patient_email: apt.patient_email || '',
        patient_phone: apt.patient_phone || '',
        appointment_date: apt.appointment_date,
        appointment_time: apt.appointment_time,
        service_type: apt.service_type || 'General',
        status: apt.status || 'pending',
        created_at: apt.created_at || new Date().toISOString(),
        updated_at: apt.created_at || new Date().toISOString()
      }));

      // Calculate Appointment Stats
      const appointmentsToday = appointments.filter(a => a.appointment_date === today.toISOString().split('T')[0]).length;
      const appointmentsWeek = appointments.length; // Simplified for now
      const appointmentsMonth = appointments.length; // Simplified for now

      // Fetch Patients (Real clinical records)
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (patientsError) {
        console.error('Error fetching patients:', patientsError);
        // Don't throw, just continue with empty patients
      }

      const patients: Patient[] = (patientsData || []).map(p => ({
        id: p.id,
        full_name: p.full_name || 'Unknown',
        email: p.email || '',
        phone: p.phone || '',
        created_at: p.created_at || new Date().toISOString(),
        loyalty_points: 0, // Need to join with loyalty_points table or fetch separately
        status: 'active', // Default
        outstanding_balance: 0,
        last_visit: p.last_visit
      }));

      // Fetch Loyalty Points to merge into patients
      const { data: lpData } = await supabase.from('loyalty_points').select('patient_id, points_balance');
      const lpMap = new Map((lpData || []).map(lp => [lp.patient_id, lp.points_balance]));

      patients.forEach(p => {
        if (lpMap.has(p.id)) {
          p.loyalty_points = lpMap.get(p.id);
        }
      });

      const totalPatients = patients.length;
      const newPatientsMonth = patients.filter(p => p.created_at >= startOfMonth).length;

      // Fetch Payments/Revenue (Mocking logic if table structure is different or empty)
      // Assuming 'payments' table exists
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, created_at');

      // If payments table error (e.g. doesn't exist), handle gracefully
      const payments = paymentsData || [];

      const revenueToday = payments
        .filter(p => p.created_at >= startOfDay)
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      const revenueWeek = payments
        .filter(p => p.created_at >= startOfWeek)
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      const revenueMonth = payments
        .filter(p => p.created_at >= startOfMonth)
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      // Fetch Loyalty/Rewards (if tables exist, else mock 0)
      // Fetch Loyalty/Rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards_catalog')
        .select('*')
        .order('points_required', { ascending: true });

      if (rewardsError) {
        console.error('Error fetching rewards:', rewardsError);
        // Don't throw, just log so dashboard still loads
      }

      // Fetch Redemptions
      const { data: redemptionsData, error: redemptionsError } = await supabase
        .from('reward_redemptions')
        .select(`
          *,
          reward:rewards_catalog(name)
        `)
        .order('redeemed_at', { ascending: false });

      if (redemptionsError) {
        console.error('Error fetching redemptions:', redemptionsError);
      }

      const redemptions: RewardRedemption[] = (redemptionsData || []).map((r: any) => ({
        ...r,
        reward_name: r.reward?.name || 'Unknown Reward'
      }));

      // Assuming 'loyalty_points' on profile
      const totalLoyaltyPoints = (patientsData || []).reduce((sum, p) => sum + (Number(p.loyalty_points) || 0), 0);
      const pendingRedemptionsCount = redemptions.filter(r => r.status === 'pending').length;

      setDashboardData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          appointments_today: appointmentsToday,
          appointments_this_week: appointmentsWeek,
          appointments_this_month: appointmentsMonth,
          total_patients: totalPatients,
          new_patients_this_month: newPatientsMonth,
          revenue_today: revenueToday,
          revenue_this_week: revenueWeek,
          revenue_this_month: revenueMonth,
          total_loyalty_points_issued: totalLoyaltyPoints,
          pending_redemptions: pendingRedemptionsCount,
          average_rating: 5.0, // Placeholder or fetch reviews
          outstanding_payments: 0 // Placeholder
        },
        patients,
        appointments,
        rewards: (rewardsData || []) as Reward[],
        redemptions
      }));

      toast.success('Dashboard data updated');
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
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
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: Home },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patient Management', icon: Users },
    { id: 'loyalty', label: 'Loyalty Program', icon: Gift, badge: dashboardData.stats.pending_redemptions },
    { id: 'medical-aid', label: 'Medical Aid', icon: CreditCard },
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
            appointments={dashboardData.appointments}
            onNavigate={setActiveSection}
          />
        );
      case 'patients':
        return (
          <PatientsManagement
            patients={dashboardData.patients}
            onAddPatient={() => toast('Add patient feature coming soon', { icon: '👤' })}
            onEditPatient={(_id) => toast('Edit patient feature coming soon', { icon: '✏️' })}
            onViewDetails={(_id) => toast('View details feature coming soon', { icon: '👁️' })}
          />
        );
      case 'loyalty':
        return (
          <LoyaltyManagement
            rewards={dashboardData.rewards}
            redemptions={dashboardData.redemptions}
            onAddReward={() => {
              setEditingReward(undefined);
              setIsRewardModalOpen(true);
            }}
            onEditReward={(rewardId) => {
              const reward = dashboardData.rewards.find(r => r.id === rewardId);
              if (reward) {
                setEditingReward(reward);
                setIsRewardModalOpen(true);
              }
            }}
            onDeleteReward={async (rewardId) => {
              if (!window.confirm('Are you sure you want to delete this reward?')) return;
              try {
                const { error } = await supabase
                  .from('rewards_catalog')
                  .delete()
                  .eq('id', rewardId);

                if (error) throw error;
                toast.success('Reward deleted');
                loadDashboardData();
              } catch (error) {
                console.error('Error deleting reward:', error);
                toast.error('Failed to delete reward');
              }
            }}
            onApproveRedemption={async (redemptionId) => {
              try {
                const { data: redemption } = await supabase
                  .from('reward_redemptions')
                  .select('*, reward:rewards_catalog(name)')
                  .eq('id', redemptionId)
                  .single();

                const { error } = await supabase
                  .from('reward_redemptions')
                  .update({ status: 'approved' })
                  .eq('id', redemptionId);

                if (error) throw error;

                if (redemption) {
                  await supabase.from('notifications').insert([{
                    patient_id: redemption.patient_id,
                    notification_type: 'loyalty_points',
                    title: 'Reward Approved!',
                    message: `Your redemption for ${redemption.reward?.name || 'a reward'} has been approved. Enjoy!`,
                    is_read: false
                  }]);
                }

                toast.success('Redemption approved');
                loadDashboardData();
              } catch (error) {
                console.error('Error approving redemption:', error);
                toast.error('Failed to approve redemption');
              }
            }}
            onRejectRedemption={async (redemptionId) => {
              if (!window.confirm('Are you sure you want to reject this redemption?')) return;
              try {
                const { data: redemption } = await supabase
                  .from('reward_redemptions')
                  .select('*, reward:rewards_catalog(name)')
                  .eq('id', redemptionId)
                  .single();

                const { error } = await supabase
                  .from('reward_redemptions')
                  .update({ status: 'cancelled' })
                  .eq('id', redemptionId);

                if (error) throw error;

                if (redemption) {
                  await supabase.from('notifications').insert([{
                    patient_id: redemption.patient_id,
                    notification_type: 'loyalty_points',
                    title: 'Reward Redemption Cancelled',
                    message: `Your redemption request for ${redemption.reward?.name || 'a reward'} has been cancelled. Your points have been noted.`,
                    is_read: false
                  }]);
                }

                toast.success('Redemption rejected');
                loadDashboardData();
              } catch (error) {
                console.error('Error rejecting redemption:', error);
                toast.error('Failed to reject redemption');
              }
            }}
          />
        );
      case 'appointments':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Appointments Management</h2>
              <button
                onClick={() => toast('Feature coming soon', { icon: '➕' })}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                New Appointment
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No appointments found</div>
              ) : (
                dashboardData.appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{apt.patient_name}</h3>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{new Date(apt.appointment_date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{apt.appointment_time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                      <button className="text-gray-400 hover:text-purple-600">
                        <Settings size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
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
          <CommunicationCenter patients={dashboardData.patients} />
        );
      case 'medical-aid':
        return (
          <MedicalAidManagement />
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
          <AdminUserManagement />
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
        className={`hidden lg:block fixed left-0 top-0 h-full bg-gradient-to-b from-indigo-900 to-purple-900 shadow-xl z-40 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSection === item.id
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
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSection === item.id
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

      <RewardModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        initialData={editingReward}
        onSave={async (rewardData) => {
          try {
            if (editingReward) {
              const { error } = await supabase
                .from('rewards_catalog')
                .update(rewardData)
                .eq('id', editingReward.id);
              if (error) throw error;
              toast.success('Reward updated');
            } else {
              const { error } = await supabase
                .from('rewards_catalog')
                .insert([rewardData]);
              if (error) throw error;
              toast.success('Reward created');
            }
            loadDashboardData();
            setIsRewardModalOpen(false);
          } catch (error) {
            console.error('Error saving reward:', error);
            toast.error('Failed to save reward');
            throw error;
          }
        }}
      />
    </div>
  );
};

export default ComprehensiveAdminDashboard;
