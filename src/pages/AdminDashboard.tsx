import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Appointment, AdminStats } from '../types';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    total_patients: 0,
    appointments_today: 0,
    pending_appointments: 0,
    revenue_this_month: 0,
    new_patients_this_month: 0,
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchDashboardData();
    }
  }, [user, isAdmin]);

  const fetchDashboardData = async () => {
    try {
      // Fetch appointments
      const { data: appointmentsData, error: apptError } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: true });

      if (apptError) throw apptError;

      setAppointments(appointmentsData || []);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().slice(0, 7);

      const appointmentsToday = (appointmentsData || []).filter(
        (a: any) => a.appointment_date === today
      ).length;

      const pendingAppointments = (appointmentsData || []).filter(
        (a: any) => a.status === 'pending'
      ).length;

      // Fetch patients count
      const { count: patientsCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      const { count: newPatientsCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${thisMonth}-01`);

      setStats({
        total_patients: patientsCount || 0,
        appointments_today: appointmentsToday,
        pending_appointments: pendingAppointments,
        revenue_this_month: 12500, // Mock data - calculate from completed appointments
        new_patients_this_month: newPatientsCount || 0,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Appointment ${status}`);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const filteredAppointments = appointments.filter((apt) =>
    filter === 'all' ? true : apt.status === filter
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.total_patients,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      change: `+${stats.new_patients_this_month} this month`,
    },
    {
      title: 'Appointments Today',
      value: stats.appointments_today,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      change: `${stats.pending_appointments} pending`,
    },
    {
      title: 'Revenue This Month',
      value: `$${stats.revenue_this_month.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      change: '+12% from last month',
    },
    {
      title: 'Success Rate',
      value: '98%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      change: 'Patient satisfaction',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Appointments Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Appointments</h2>
            <div className="flex space-x-2">
              {['all', 'pending', 'confirmed', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-dental-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Patient</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{appointment.patient_name}</p>
                          <p className="text-sm text-gray-500">{appointment.patient_email}</p>
                          <p className="text-sm text-gray-500">{appointment.patient_phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{appointment.service_type}</td>
                      <td className="py-4 px-4 text-gray-700">
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-gray-700">{appointment.appointment_time}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : appointment.status === 'completed'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                              title="Confirm"
                            >
                              <CheckCircle size={18} className="text-green-600" />
                            </button>
                          )}
                          {appointment.status === 'confirmed' && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                              title="Complete"
                            >
                              <CheckCircle size={18} className="text-purple-600" />
                            </button>
                          )}
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <XCircle size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
