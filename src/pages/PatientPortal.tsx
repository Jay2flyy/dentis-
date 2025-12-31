import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Appointment } from '../types';

const PatientPortal = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/booking');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_email', user?.email)
        .order('appointment_date', { ascending: false });

      if (error) throw error;

      setAppointments(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental-primary"></div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) >= new Date() && apt.status !== 'cancelled'
  );

  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) < new Date() || apt.status === 'completed'
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Portal</h1>
          <p className="text-gray-600">Manage your appointments and information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-dental-light rounded-full flex items-center justify-center">
                  <User className="text-dental-primary" size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user?.email?.split('@')[0]}</h2>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full btn-primary text-sm" onClick={() => navigate('/booking')}>
                  <Calendar className="inline mr-2" size={18} />
                  Book New Appointment
                </button>
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Total Appointments</span>
                    <span className="font-semibold">{appointments.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Upcoming</span>
                    <span className="font-semibold text-dental-primary">{upcomingAppointments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
              {upcomingAppointments.length === 0 ? (
                <div className="card text-center py-12">
                  <Calendar className="text-gray-400 mx-auto mb-4" size={48} />
                  <p className="text-gray-600 mb-4">No upcoming appointments</p>
                  <button className="btn-primary" onClick={() => navigate('/booking')}>
                    Book Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{appointment.service_type}</h3>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-2 text-dental-primary" />
                              {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2 text-dental-primary" />
                              {appointment.appointment_time}
                            </div>
                            {appointment.notes && (
                              <div className="flex items-start">
                                <FileText size={16} className="mr-2 text-dental-primary mt-0.5" />
                                <span>{appointment.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Past Appointments</h2>
                <div className="space-y-4">
                  {pastAppointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="card bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{appointment.service_type}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-2" />
                              {new Date(appointment.appointment_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2" />
                              {appointment.appointment_time}
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;
