import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, Gift, Clock, MapPin, Phone, Edit, Trash2, Plus, Award, TrendingUp, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'loyalty' | 'history'>('appointments');

  // Mock data - will be replaced with Supabase data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '082 123 4567',
    loyaltyPoints: 350,
    memberSince: 'January 2024',
  };

  const appointments = [
    {
      id: 1,
      service: 'Teeth Whitening',
      date: '2024-02-15',
      time: '10:00 AM',
      dentist: 'Dr. Sarah Smith',
      status: 'confirmed',
      location: 'High Street, Grahamstown',
    },
    {
      id: 2,
      service: 'General Checkup',
      date: '2024-03-20',
      time: '2:30 PM',
      dentist: 'Dr. Michael Johnson',
      status: 'pending',
      location: 'High Street, Grahamstown',
    },
  ];

  const appointmentHistory = [
    {
      id: 1,
      service: 'Professional Cleaning',
      date: '2024-01-10',
      pointsEarned: 80,
      amount: 'R800',
    },
    {
      id: 2,
      service: 'General Checkup',
      date: '2023-12-05',
      pointsEarned: 50,
      amount: 'R500',
    },
    {
      id: 3,
      service: 'Dental Filling',
      date: '2023-11-15',
      pointsEarned: 120,
      amount: 'R1,200',
    },
  ];

  const loyaltyRewards = [
    { name: 'FREE Teeth Cleaning', points: 100, value: 'R800', available: true },
    { name: 'FREE Teeth Whitening', points: 500, value: 'R2,500', available: false },
    { name: '20% Off Cosmetic Procedures', points: 200, value: 'Up to R5,000', available: true },
    { name: 'Priority Booking', points: 150, value: 'Priceless', available: true },
  ];

  const pointsProgress = (userData.loyaltyPoints / 500) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6B9BD1] to-[#B794F6] rounded-3xl p-8 mb-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {userData.name}!</h1>
              <p className="text-white/80 mb-4">{userData.email}</p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  {userData.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Member since {userData.memberSince}
                </div>
              </div>
            </div>
            <Link
              to="/booking"
              className="bg-white text-[#B794F6] px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Book Appointment
            </Link>
          </div>
        </div>

        {/* Loyalty Points Card */}
        <div className="bg-gradient-to-br from-[#B794F6] to-[#9B7FD6] rounded-3xl p-8 mb-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-yellow-300 fill-current" size={24} />
                <h2 className="text-2xl font-bold">Loyalty Points</h2>
              </div>
              <p className="text-white/80">Keep earning to unlock amazing rewards!</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{userData.loyaltyPoints}</div>
              <div className="text-white/80">Total Points</div>
            </div>
          </div>
          
          {/* Progress to next reward */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Progress to FREE Whitening</span>
              <span className="text-sm font-semibold">{userData.loyaltyPoints} / 500 pts</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pointsProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400"
              />
            </div>
            <p className="text-sm text-white/70 mt-2">
              Only {500 - userData.loyaltyPoints} points away from your next reward!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-sm">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'appointments' ? 'bg-[#6B9BD1] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Calendar size={20} />
            My Appointments
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'loyalty' ? 'bg-[#B794F6] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Gift size={20} />
            Rewards
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'history' ? 'bg-[#1E293B] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <History size={20} />
            History
          </button>
        </div>

        {/* Content */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
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
                      <h3 className="text-xl font-bold">{apt.service}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-[#6B9BD1]" />
                        <span>{new Date(apt.date).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-[#6B9BD1]" />
                        <span>{apt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-[#6B9BD1]" />
                        <span>{apt.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award size={18} className="text-[#6B9BD1]" />
                        <span>{apt.dentist}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button className="p-3 bg-[#6B9BD1] text-white rounded-xl hover:bg-[#5A8AC0] transition-colors">
                      <Edit size={20} />
                    </button>
                    <button className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {appointments.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center">
                <Calendar className="mx-auto mb-4 text-gray-300" size={64} />
                <h3 className="text-xl font-semibold mb-2">No upcoming appointments</h3>
                <p className="text-gray-600 mb-6">Book your next dental visit today!</p>
                <Link to="/booking" className="btn-primary inline-block">
                  Book Appointment
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'loyalty' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Available Rewards</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {loyaltyRewards.map((reward, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl p-6 shadow-sm ${
                    reward.available ? 'border-2 border-[#B794F6]' : 'opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{reward.name}</h3>
                      <p className="text-gray-600">{reward.value} value</p>
                    </div>
                    <Gift className={reward.available ? 'text-[#B794F6]' : 'text-gray-400'} size={32} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-400 fill-current" size={20} />
                      <span className="font-bold">{reward.points} points</span>
                    </div>
                    {reward.available ? (
                      <button className="bg-[#B794F6] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#9B7FD6] transition-colors">
                        Redeem
                      </button>
                    ) : (
                      <span className="text-gray-400 font-semibold">{reward.points - userData.loyaltyPoints} more points needed</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* How to earn more */}
            <div className="bg-gradient-to-r from-[#6B9BD1] to-[#B794F6] rounded-2xl p-6 text-white mt-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp size={32} />
                <h3 className="text-2xl font-bold">How to Earn More Points</h3>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Star className="text-yellow-300 fill-current flex-shrink-0" size={20} />
                  <span>Earn 10 points for every R100 spent on services</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="text-yellow-300 fill-current flex-shrink-0" size={20} />
                  <span>Get 50 bonus points for referring a friend</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="text-yellow-300 fill-current flex-shrink-0" size={20} />
                  <span>Earn double points on your birthday month</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Appointment History</h2>
            {appointmentHistory.map((record) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold mb-2">{record.service}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>{new Date(record.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span>•</span>
                      <span>{record.amount}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-[#B794F6] font-bold mb-1">
                      <Star className="fill-current" size={20} />
                      +{record.pointsEarned} points
                    </div>
                    <button className="text-sm text-gray-600 hover:text-[#6B9BD1]">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
