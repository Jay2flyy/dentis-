import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Phone, Mail, Plus, Edit, X, Download, CheckCircle } from 'lucide-react';
import { Appointment } from '../../types';

interface AppointmentsSectionProps {
  appointments: Appointment[];
  onBookNew: () => void;
  onReschedule: (appointmentId: string) => void;
  onCancel: (appointmentId: string) => void;
  onDownload: (appointmentId: string) => void;
}

const AppointmentsSection = ({ 
  appointments, 
  onBookNew, 
  onReschedule, 
  onCancel,
  onDownload 
}: AppointmentsSectionProps) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const upcomingAppointments = appointments.filter(
    apt => apt.status !== 'completed' && apt.status !== 'cancelled' && new Date(apt.appointment_date) >= new Date()
  );
  
  const pastAppointments = appointments.filter(
    apt => apt.status === 'completed' || new Date(apt.appointment_date) < new Date()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your dental appointments</p>
        </div>
        <button
          onClick={onBookNew}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold shadow-lg"
        >
          <Plus size={20} />
          Book New Appointment
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Calendar className="mb-2" size={32} />
          <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
          <p className="text-purple-100">Upcoming</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <CheckCircle className="mb-2" size={32} />
          <p className="text-3xl font-bold">{pastAppointments.filter(a => a.status === 'completed').length}</p>
          <p className="text-green-100">Completed</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Clock className="mb-2" size={32} />
          <p className="text-3xl font-bold">{appointments.length}</p>
          <p className="text-purple-100">Total Appointments</p>
        </div>
      </div>

      {/* Tabs and View Toggle */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center border-b p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'upcoming'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Upcoming ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === 'past'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Past ({pastAppointments.length})
            </button>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                viewMode === 'list'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                viewMode === 'calendar'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>

        <div className="p-6">
          {viewMode === 'list' ? (
            <div className="space-y-4">
              {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
                  <p className="text-gray-600 text-lg">No {activeTab} appointments</p>
                  {activeTab === 'upcoming' && (
                    <button
                      onClick={onBookNew}
                      className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Book Your First Appointment
                    </button>
                  )}
                </div>
              ) : (
                (activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{appointment.service_type}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 text-gray-600">
                            <Calendar className="text-purple-600" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="font-semibold">{new Date(appointment.appointment_date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-gray-600">
                            <Clock className="text-purple-600" size={20} />
                            <div>
                              <p className="text-sm text-gray-500">Time</p>
                              <p className="font-semibold">{appointment.appointment_time}</p>
                            </div>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600"><span className="font-semibold">Notes:</span> {appointment.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 md:w-48">
                        {activeTab === 'upcoming' && appointment.status !== 'cancelled' && (
                          <>
                            <button
                              onClick={() => onReschedule(appointment.id)}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                              <Edit size={18} />
                              Reschedule
                            </button>
                            <button
                              onClick={() => onCancel(appointment.id)}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                            >
                              <X size={18} />
                              Cancel
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                              <Calendar size={18} />
                              Add to Calendar
                            </button>
                          </>
                        )}
                        
                        {activeTab === 'past' && appointment.status === 'completed' && (
                          <>
                            <button
                              onClick={() => onDownload(appointment.id)}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                              <Download size={18} />
                              Download Summary
                            </button>
                            <button
                              onClick={onBookNew}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              <Plus size={18} />
                              Book Follow-up
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-gray-600 text-lg">Calendar view coming soon!</p>
              <p className="text-gray-500 text-sm mt-2">This feature will allow you to view appointments in a calendar format</p>
            </div>
          )}
        </div>
      </div>

      {/* Clinic Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Clinic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <MapPin className="text-purple-600 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-800">Location</p>
              <p className="text-gray-600">123 Dental Street</p>
              <p className="text-gray-600">Cape Town, 8001</p>
              <a href="#" className="text-purple-600 text-sm hover:underline mt-1 inline-block">Get Directions →</a>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Phone className="text-purple-600 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-800">Phone</p>
              <p className="text-gray-600">+27 21 123 4567</p>
              <a href="tel:+27211234567" className="text-purple-600 text-sm hover:underline mt-1 inline-block">Call Now →</a>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Mail className="text-purple-600 mt-1" size={24} />
            <div>
              <p className="font-semibold text-gray-800">Email</p>
              <p className="text-gray-600">info@dentalcare.com</p>
              <a href="mailto:info@dentalcare.com" className="text-purple-600 text-sm hover:underline mt-1 inline-block">Send Email →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsSection;
