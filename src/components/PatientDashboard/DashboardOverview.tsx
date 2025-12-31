import { Calendar, Gift, TrendingUp, DollarSign, MessageSquare, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PatientDashboardStats, Appointment, LoyaltyPoints } from '../../types';

interface DashboardOverviewProps {
  stats: PatientDashboardStats;
  nextAppointment?: Appointment;
  loyaltyPoints?: LoyaltyPoints;
  onNavigate: (section: string) => void;
}

const DashboardOverview = ({ stats, nextAppointment, loyaltyPoints, onNavigate }: DashboardOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-purple-100">Here's what's happening with your dental care</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 cursor-pointer"
          onClick={() => onNavigate('appointments')}
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="text-purple-600" size={32} />
            <span className="text-3xl font-bold text-gray-800">{stats.upcoming_appointments}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Upcoming Appointments</h3>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 shadow-lg cursor-pointer text-white"
          onClick={() => onNavigate('loyalty')}
        >
          <div className="flex items-center justify-between mb-4">
            <Gift size={32} />
            <span className="text-3xl font-bold">{stats.loyalty_points}</span>
          </div>
          <h3 className="font-medium">Loyalty Points</h3>
          <p className="text-sm opacity-90 mt-2">{stats.points_to_next_reward} pts to next reward</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 cursor-pointer"
          onClick={() => onNavigate('billing')}
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="text-green-600" size={32} />
            <span className="text-3xl font-bold text-gray-800">${stats.outstanding_balance.toFixed(2)}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Outstanding Balance</h3>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 cursor-pointer"
          onClick={() => onNavigate('messages')}
        >
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="text-indigo-600" size={32} />
            <span className="text-3xl font-bold text-gray-800">{stats.unread_messages}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Unread Messages</h3>
        </motion.div>
      </div>

      {/* Next Appointment Card */}
      {nextAppointment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-600"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Next Appointment</h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Date:</span> {new Date(nextAppointment.appointment_date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Time:</span> {nextAppointment.appointment_time}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Service:</span> {nextAppointment.service_type}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onNavigate('appointments')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Manage
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                Add to Calendar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loyalty Progress */}
      {loyaltyPoints && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 shadow-lg text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-1">{loyaltyPoints.tier_level} Member</h3>
              <p className="text-purple-100">Lifetime Points: {loyaltyPoints.lifetime_points}</p>
            </div>
            <TrendingUp size={48} className="opacity-80" />
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to Next Reward</span>
              <span>{stats.loyalty_points} / {stats.loyalty_points + stats.points_to_next_reward} pts</span>
            </div>
            <div className="w-full bg-purple-800 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${(stats.loyalty_points / (stats.loyalty_points + stats.points_to_next_reward)) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm mt-2 text-purple-100">
              You're {stats.points_to_next_reward} points away from your next reward! 🎉
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('appointments')}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
          >
            <Calendar className="text-purple-600 mb-2" size={28} />
            <span className="text-sm font-medium text-gray-700">Book Appointment</span>
          </button>
          <button
            onClick={() => onNavigate('messages')}
            className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
          >
            <MessageSquare className="text-indigo-600 mb-2" size={28} />
            <span className="text-sm font-medium text-gray-700">Contact Dentist</span>
          </button>
          <button
            onClick={() => onNavigate('records')}
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
          >
            <AlertCircle className="text-green-600 mb-2" size={28} />
            <span className="text-sm font-medium text-gray-700">Medical Records</span>
          </button>
          <button
            onClick={() => onNavigate('billing')}
            className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition"
          >
            <DollarSign className="text-yellow-600 mb-2" size={28} />
            <span className="text-sm font-medium text-gray-700">Pay Bill</span>
          </button>
        </div>
      </div>

      {/* Health Overview */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Health Overview</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-gray-600 text-sm">Last Checkup</p>
              <p className="text-gray-800 font-semibold">3 months ago</p>
            </div>
            <button className="text-purple-600 font-medium hover:text-purple-700">View Details</button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-gray-600 text-sm">Next Recommended Appointment</p>
              <p className="text-gray-800 font-semibold">In 3 months</p>
            </div>
            <button 
              onClick={() => onNavigate('appointments')}
              className="text-purple-600 font-medium hover:text-purple-700"
            >
              Book Now
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-amber-600" size={24} />
              <div>
                <p className="text-amber-800 font-semibold">Cleaning Overdue</p>
                <p className="text-amber-600 text-sm">Schedule your cleaning today</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('appointments')}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
