import { motion } from 'framer-motion';
import { 
  Calendar, Users, DollarSign, TrendingUp, Clock, CheckCircle, 
  AlertCircle, Gift, Star, Activity 
} from 'lucide-react';
import { AdminDashboardStats } from '../../types';

interface AdminOverviewProps {
  stats: AdminDashboardStats;
  onNavigate: (section: string) => void;
}

const AdminOverview = ({ stats, onNavigate }: AdminOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-indigo-100">Welcome back! Here's your practice overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-600"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="text-purple-600" size={32} />
            <span className="text-3xl font-bold text-gray-800">{stats.appointments_today}</span>
          </div>
          <h3 className="text-gray-600 font-medium mb-1">Appointments Today</h3>
          <p className="text-sm text-gray-500">{stats.appointments_this_week} this week</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-600"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="text-green-600" size={32} />
            <span className="text-3xl font-bold text-gray-800">${stats.revenue_today.toFixed(0)}</span>
          </div>
          <h3 className="text-gray-600 font-medium mb-1">Revenue Today</h3>
          <p className="text-sm text-gray-500">${stats.revenue_this_month.toFixed(0)} this month</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-600"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="text-purple-600" size={32} />
            <span className="text-3xl font-bold text-gray-800">{stats.total_patients}</span>
          </div>
          <h3 className="text-gray-600 font-medium mb-1">Total Patients</h3>
          <p className="text-sm text-gray-500">+{stats.new_patients_this_month} new this month</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-600"
        >
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="text-amber-600" size={32} />
            <span className="text-3xl font-bold text-gray-800">${stats.outstanding_payments.toFixed(0)}</span>
          </div>
          <h3 className="text-gray-600 font-medium mb-1">Outstanding Payments</h3>
          <p className="text-sm text-gray-500">Requires attention</p>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Revenue Overview</h3>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>This year</option>
          </select>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Today</p>
            <p className="text-2xl font-bold text-purple-600">${stats.revenue_today.toFixed(2)}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">This Week</p>
            <p className="text-2xl font-bold text-green-600">${stats.revenue_this_week.toFixed(2)}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-2xl font-bold text-purple-600">${stats.revenue_this_month.toFixed(2)}</p>
          </div>
        </div>

        {/* Simple Chart Placeholder */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Activity size={48} className="mx-auto mb-2 opacity-50" />
            <p>Revenue chart visualization</p>
            <p className="text-sm">Coming soon</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Appointments Stats */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-purple-600" size={20} />
            Appointments
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Week</span>
              <span className="font-bold text-gray-800">{stats.appointments_this_week}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Month</span>
              <span className="font-bold text-gray-800">{stats.appointments_this_month}</span>
            </div>
            <button 
              onClick={() => onNavigate('appointments')}
              className="w-full mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Manage Appointments
            </button>
          </div>
        </div>

        {/* Loyalty Program Stats */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Gift className="text-purple-600" size={20} />
            Loyalty Program
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Points Issued</span>
              <span className="font-bold text-gray-800">{stats.total_loyalty_points_issued.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Redemptions</span>
              <span className="font-bold text-amber-600">{stats.pending_redemptions}</span>
            </div>
            <button 
              onClick={() => onNavigate('loyalty')}
              className="w-full mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Manage Loyalty
            </button>
          </div>
        </div>

        {/* Patient Satisfaction */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="text-yellow-600" size={20} />
            Patient Satisfaction
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Rating</span>
              <div className="flex items-center gap-1">
                <Star className="text-yellow-500 fill-yellow-500" size={16} />
                <span className="font-bold text-gray-800">{stats.average_rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Reviews</span>
              <span className="font-bold text-gray-800">247</span>
            </div>
            <button className="w-full mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
              View Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Today's Schedule</h3>
          <button 
            onClick={() => onNavigate('appointments')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            View All →
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { time: '09:00 AM', patient: 'John Doe', service: 'General Checkup', status: 'confirmed' },
            { time: '10:30 AM', patient: 'Jane Smith', service: 'Teeth Cleaning', status: 'confirmed' },
            { time: '02:00 PM', patient: 'Mike Johnson', service: 'Root Canal', status: 'pending' },
            { time: '03:30 PM', patient: 'Sarah Williams', service: 'Dental Implant', status: 'confirmed' },
          ].map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="text-purple-600" size={24} />
                  </div>
                  <p className="text-xs font-semibold text-gray-600 mt-1">{appointment.time}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{appointment.patient}</p>
                  <p className="text-sm text-gray-600">{appointment.service}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('appointments')}
          className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition text-center"
        >
          <Calendar className="text-purple-600 mx-auto mb-2" size={32} />
          <p className="font-semibold text-gray-800">Schedule</p>
        </button>
        <button
          onClick={() => onNavigate('patients')}
          className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition text-center"
        >
          <Users className="text-green-600 mx-auto mb-2" size={32} />
          <p className="font-semibold text-gray-800">Patients</p>
        </button>
        <button
          onClick={() => onNavigate('billing')}
          className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition text-center"
        >
          <DollarSign className="text-yellow-600 mx-auto mb-2" size={32} />
          <p className="font-semibold text-gray-800">Billing</p>
        </button>
        <button
          onClick={() => onNavigate('reports')}
          className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition text-center"
        >
          <TrendingUp className="text-purple-600 mx-auto mb-2" size={32} />
          <p className="font-semibold text-gray-800">Reports</p>
        </button>
      </div>
    </div>
  );
};

export default AdminOverview;
