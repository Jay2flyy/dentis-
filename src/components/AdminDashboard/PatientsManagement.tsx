import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, Edit, Eye, Mail, Phone, Calendar, Award, DollarSign, FileText } from 'lucide-react';
import { Patient } from '../../types';

interface PatientsManagementProps {
  patients: Patient[];
  onAddPatient: () => void;
  onEditPatient: (patientId: string) => void;
  onViewDetails: (patientId: string) => void;
}

const PatientsManagement = ({ patients, onAddPatient, onEditPatient, onViewDetails }: PatientsManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Mock data - will be replaced with actual data
  const enrichedPatients = patients.map(patient => ({
    ...patient,
    loyaltyPoints: Math.floor(Math.random() * 1000),
    lastVisit: patient.last_visit || '2024-01-15',
    upcomingAppointments: Math.floor(Math.random() * 3),
    outstandingBalance: Math.random() * 500,
    status: patient.last_visit ? 'active' : 'inactive'
  }));

  const filteredPatients = enrichedPatients.filter(patient => {
    const matchesSearch = patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Patient Management</h1>
          <p className="text-gray-600 mt-1">{filteredPatients.length} total patients</p>
        </div>
        <button
          onClick={onAddPatient}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold shadow-lg"
        >
          <Plus size={20} />
          Add New Patient
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Users className="mb-2" size={32} />
          <p className="text-3xl font-bold">{enrichedPatients.length}</p>
          <p className="text-purple-100">Total Patients</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <Calendar className="mb-2" size={32} />
          <p className="text-3xl font-bold">{enrichedPatients.filter(p => p.status === 'active').length}</p>
          <p className="text-green-100">Active Patients</p>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
          <Award className="mb-2" size={32} />
          <p className="text-3xl font-bold">{enrichedPatients.filter(p => p.loyaltyPoints > 500).length}</p>
          <p className="text-amber-100">VIP Patients</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <DollarSign className="mb-2" size={32} />
          <p className="text-3xl font-bold">
            ${enrichedPatients.reduce((sum, p) => sum + p.outstandingBalance, 0).toFixed(0)}
          </p>
          <p className="text-purple-100">Outstanding</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Patients</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="name">Sort by Name</option>
              <option value="lastVisit">Last Visit</option>
              <option value="loyaltyPoints">Loyalty Points</option>
              <option value="balance">Outstanding Balance</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            Export to Excel
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
            Print List
          </button>
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Last Visit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Loyalty Points</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Balance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Users size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No patients found</p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {patient.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{patient.full_name}</p>
                          <p className="text-sm text-gray-500">ID: {patient.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} />
                          {patient.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />
                          {patient.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-800 font-medium">
                          {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}
                        </p>
                        {patient.upcomingAppointments > 0 && (
                          <p className="text-purple-600 text-xs mt-1">
                            {patient.upcomingAppointments} upcoming
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Award className="text-purple-600" size={16} />
                        <span className="font-bold text-purple-600">{patient.loyaltyPoints}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${
                        patient.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ${patient.outstandingBalance.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewDetails(patient.id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEditPatient(patient.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="View Records"
                        >
                          <FileText size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredPatients.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-lg">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredPatients.length}</span> patients
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Previous
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">3</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsManagement;
