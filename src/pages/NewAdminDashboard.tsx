import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  Download,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Activity,
} from 'lucide-react';

const NewAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'patients' | 'records'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Mock data - will be replaced with Supabase
  const stats = {
    todayAppointments: 8,
    totalPatients: 342,
    revenue: 'R45,230',
    pendingAppointments: 12,
  };

  const appointments = [
    {
      id: 1,
      patient: 'John Doe',
      service: 'Teeth Whitening',
      date: '2024-02-15',
      time: '10:00 AM',
      status: 'confirmed',
      phone: '082 123 4567',
      notes: 'First-time patient',
    },
    {
      id: 2,
      patient: 'Sarah Smith',
      service: 'General Checkup',
      date: '2024-02-15',
      time: '11:30 AM',
      status: 'pending',
      phone: '083 456 7890',
      notes: 'Regular checkup',
    },
    {
      id: 3,
      patient: 'Michael Johnson',
      service: 'Dental Implant',
      date: '2024-02-15',
      time: '2:00 PM',
      status: 'confirmed',
      phone: '084 789 0123',
      notes: 'Follow-up consultation',
    },
    {
      id: 4,
      patient: 'Emily Brown',
      service: 'Root Canal',
      date: '2024-02-16',
      time: '9:00 AM',
      status: 'pending',
      phone: '082 234 5678',
      notes: 'Emergency case',
    },
  ];

  const patients = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '082 123 4567',
      lastVisit: '2024-01-10',
      totalVisits: 5,
      loyaltyPoints: 350,
      medicalAid: 'Discovery Health',
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah.smith@example.com',
      phone: '083 456 7890',
      lastVisit: '2024-01-22',
      totalVisits: 12,
      loyaltyPoints: 850,
      medicalAid: 'Bonitas',
    },
    {
      id: 3,
      name: 'Michael Johnson',
      email: 'michael.j@example.com',
      phone: '084 789 0123',
      lastVisit: '2024-02-01',
      totalVisits: 8,
      loyaltyPoints: 620,
      medicalAid: 'Momentum Health',
    },
  ];

  const patientRecords = selectedPatient ? [
    {
      id: 1,
      date: '2024-01-10',
      service: 'Professional Cleaning',
      dentist: 'Dr. Sarah Smith',
      diagnosis: 'Routine cleaning, no issues found',
      treatment: 'Deep cleaning and fluoride treatment',
      cost: 'R800',
      notes: 'Patient has excellent oral hygiene',
    },
    {
      id: 2,
      date: '2023-12-05',
      service: 'General Checkup',
      dentist: 'Dr. Michael Johnson',
      diagnosis: 'Minor cavity in lower left molar',
      treatment: 'Dental filling',
      cost: 'R1,200',
      notes: 'Advised to reduce sugar intake',
    },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E293B] to-[#334155] text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-gray-300">Makhanda Smiles - Grahamstown</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-300">Logged in as</div>
              <div className="font-semibold">Admin User</div>
            </div>
            <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {activeTab === 'overview' && (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="text-[#6B9BD1]" size={32} />
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Today</span>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.todayAppointments}</div>
                <div className="text-gray-600">Appointments</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <Users className="text-[#B794F6]" size={32} />
                  <TrendingUp className="text-green-500" size={20} />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalPatients}</div>
                <div className="text-gray-600">Total Patients</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="text-green-500" size={32} />
                  <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">MTD</span>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.revenue}</div>
                <div className="text-gray-600">Revenue</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <Clock className="text-yellow-500" size={32} />
                  <span className="text-sm font-semibold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">Pending</span>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.pendingAppointments}</div>
                <div className="text-gray-600">Pending</div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => setActiveTab('appointments')}
                className="bg-gradient-to-r from-[#6B9BD1] to-[#5A8AC0] text-white p-6 rounded-2xl hover:shadow-lg transition-all text-left"
              >
                <Calendar className="mb-3" size={32} />
                <div className="text-xl font-bold mb-2">Manage Appointments</div>
                <div className="text-white/80">View, edit, and schedule appointments</div>
              </button>

              <button
                onClick={() => setActiveTab('patients')}
                className="bg-gradient-to-r from-[#B794F6] to-[#9B7FD6] text-white p-6 rounded-2xl hover:shadow-lg transition-all text-left"
              >
                <Users className="mb-3" size={32} />
                <div className="text-xl font-bold mb-2">Patient Database</div>
                <div className="text-white/80">Access patient information and history</div>
              </button>

              <button
                onClick={() => setActiveTab('records')}
                className="bg-gradient-to-r from-[#1E293B] to-[#334155] text-white p-6 rounded-2xl hover:shadow-lg transition-all text-left"
              >
                <FileText className="mb-3" size={32} />
                <div className="text-xl font-bold mb-2">Medical Records</div>
                <div className="text-white/80">View and manage patient records</div>
              </button>
            </div>
          </>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'overview' ? 'bg-[#1E293B] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'appointments' ? 'bg-[#6B9BD1] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'patients' ? 'bg-[#B794F6] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Patients
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'records' ? 'bg-[#1E293B] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Records
          </button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Appointments</h2>
              <button className="bg-[#6B9BD1] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5A8AC0] transition-colors flex items-center gap-2">
                <Plus size={20} />
                New Appointment
              </button>
            </div>

            <div className="space-y-4">
              {appointments.map((apt) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-3 h-3 rounded-full ${apt.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <h3 className="text-xl font-bold">{apt.patient}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Activity size={18} className="text-[#6B9BD1]" />
                          <span className="font-semibold">{apt.service}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-[#6B9BD1]" />
                          <span>{new Date(apt.date).toLocaleDateString('en-ZA')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={18} className="text-[#6B9BD1]" />
                          <span>{apt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={18} className="text-[#6B9BD1]" />
                          <span>{apt.phone}</span>
                        </div>
                      </div>

                      {apt.notes && (
                        <div className="bg-gray-50 p-3 rounded-lg text-sm">
                          <span className="font-semibold">Notes:</span> {apt.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {apt.status === 'pending' && (
                        <button className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors" title="Confirm">
                          <Check size={20} />
                        </button>
                      )}
                      <button className="p-3 bg-[#6B9BD1] text-white rounded-xl hover:bg-[#5A8AC0] transition-colors" title="Edit">
                        <Edit size={20} />
                      </button>
                      <button className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors" title="Cancel">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Patient Database</h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#B794F6] focus:outline-none"
                  />
                </div>
                <button className="p-2 border-2 border-gray-200 rounded-xl hover:border-[#B794F6] transition-colors">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Patient</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Contact</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Last Visit</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Visits</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Points</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Medical Aid</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold">{patient.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{patient.email}</div>
                        <div className="text-sm text-gray-600">{patient.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(patient.lastVisit).toLocaleDateString('en-ZA')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-[#6B9BD1] text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {patient.totalVisits}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#B794F6] font-semibold">{patient.loyaltyPoints}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{patient.medicalAid}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setActiveTab('records');
                          }}
                          className="p-2 text-[#6B9BD1] hover:bg-[#6B9BD1] hover:text-white rounded-lg transition-colors"
                        >
                          <Eye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div>
            {selectedPatient ? (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{selectedPatient.name}'s Medical Records</h2>
                      <div className="flex gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail size={16} />
                          {selectedPatient.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} />
                          {selectedPatient.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity size={16} />
                          {selectedPatient.totalVisits} visits
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPatient(null)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      ← Back to Patients
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {patientRecords.map((record) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{record.service}</h3>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>{new Date(record.date).toLocaleDateString('en-ZA')}</span>
                            <span>•</span>
                            <span>{record.dentist}</span>
                            <span>•</span>
                            <span className="font-semibold text-green-600">{record.cost}</span>
                          </div>
                        </div>
                        <button className="text-[#6B9BD1] hover:text-[#5A8AC0] flex items-center gap-2">
                          <Download size={20} />
                          Export
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-700 mb-1">Diagnosis</div>
                          <div className="text-gray-600">{record.diagnosis}</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-700 mb-1">Treatment</div>
                          <div className="text-gray-600">{record.treatment}</div>
                        </div>
                      </div>

                      {record.notes && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                          <div className="text-sm font-semibold text-gray-700 mb-1">Notes</div>
                          <div className="text-gray-700">{record.notes}</div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center">
                <FileText className="mx-auto mb-4 text-gray-300" size={64} />
                <h3 className="text-xl font-semibold mb-2">Select a patient to view records</h3>
                <p className="text-gray-600 mb-6">Go to the Patients tab to select a patient</p>
                <button
                  onClick={() => setActiveTab('patients')}
                  className="bg-[#B794F6] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#9B7FD6] transition-colors"
                >
                  View Patients
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewAdminDashboard;
