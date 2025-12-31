import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, TrendingUp, Award, Plus, Edit, Trash2, Check, X, DollarSign, Users, BarChart3 } from 'lucide-react';
import { Reward, RewardRedemption } from '../../types';

interface LoyaltyManagementProps {
  rewards: Reward[];
  redemptions: RewardRedemption[];
  onAddReward: () => void;
  onEditReward: (rewardId: string) => void;
  onDeleteReward: (rewardId: string) => void;
  onApproveRedemption: (redemptionId: string) => void;
  onRejectRedemption: (redemptionId: string) => void;
}

const LoyaltyManagement = ({
  rewards,
  redemptions,
  onAddReward,
  onEditReward,
  onDeleteReward,
  onApproveRedemption,
  onRejectRedemption
}: LoyaltyManagementProps) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'redemptions' | 'settings' | 'analytics'>('rewards');
  const [pointsConfig, setPointsConfig] = useState({
    checkup: 50,
    cleaning: 75,
    filling: 100,
    rootCanal: 150,
    whitening: 200,
    crown: 250,
    implant: 500,
    referral: 200,
    review: 25,
    birthday: 100,
    anniversary: 150
  });

  const pendingRedemptions = redemptions.filter(r => r.status === 'pending');
  const totalPointsIssued = 125000; // Mock data
  const totalPointsRedeemed = 45000; // Mock data
  const activeMembers = 450; // Mock data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Loyalty Program Management</h1>
          <p className="text-gray-600 mt-1">Manage rewards, redemptions, and program settings</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Gift className="mb-2" size={32} />
          <p className="text-3xl font-bold">{rewards.filter(r => r.active).length}</p>
          <p className="text-purple-100">Active Rewards</p>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
          <TrendingUp className="mb-2" size={32} />
          <p className="text-3xl font-bold">{totalPointsIssued.toLocaleString()}</p>
          <p className="text-amber-100">Points Issued</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <Award className="mb-2" size={32} />
          <p className="text-3xl font-bold">{pendingRedemptions.length}</p>
          <p className="text-green-100">Pending Redemptions</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Users className="mb-2" size={32} />
          <p className="text-3xl font-bold">{activeMembers}</p>
          <p className="text-purple-100">Active Members</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-wrap border-b">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
              activeTab === 'rewards' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Gift size={20} />
            Rewards Catalog
          </button>
          <button
            onClick={() => setActiveTab('redemptions')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
              activeTab === 'redemptions' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Award size={20} />
            Redemptions
            {pendingRedemptions.length > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {pendingRedemptions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
              activeTab === 'settings' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <TrendingUp size={20} />
            Points Settings
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${
              activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart3 size={20} />
            Analytics
          </button>
        </div>

        <div className="p-6">
          {/* Rewards Catalog Tab */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={onAddReward}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  <Plus size={20} />
                  Add New Reward
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <Gift size={64} className="mx-auto mb-4 opacity-50" />
                    <p>No rewards in catalog</p>
                  </div>
                ) : (
                  rewards.map((reward) => (
                    <motion.div
                      key={reward.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition"
                    >
                      <div className="h-40 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center relative">
                        <Gift className="text-white" size={64} />
                        {!reward.active && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
                            Inactive
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-lg text-gray-800 mb-2">{reward.name}</h4>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{reward.description}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Award className="text-purple-600" size={18} />
                            <span className="font-bold text-lg text-purple-600">{reward.points_required}</span>
                            <span className="text-gray-500 text-sm">pts</span>
                          </div>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-semibold">
                            {reward.category}
                          </span>
                        </div>

                        {reward.redemption_limit && (
                          <p className="text-xs text-gray-500 mb-3">
                            Limit: {reward.redemption_limit} redemptions
                          </p>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => onEditReward(reward.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteReward(reward.id)}
                            className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Redemptions Tab */}
          {activeTab === 'redemptions' && (
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                  All
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                  Pending ({pendingRedemptions.length})
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                  Approved
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                  Fulfilled
                </button>
              </div>

              {redemptions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Award size={64} className="mx-auto mb-4 opacity-50" />
                  <p>No redemption requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {redemptions.map((redemption) => (
                    <motion.div
                      key={redemption.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-lg text-gray-800">{redemption.reward_name}</h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              redemption.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                              redemption.status === 'approved' ? 'bg-purple-100 text-purple-800' :
                              redemption.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {redemption.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <p className="text-gray-500">Patient ID</p>
                              <p className="font-semibold text-gray-800">{redemption.patient_id.slice(0, 8)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Points Spent</p>
                              <p className="font-bold text-purple-600">{redemption.points_spent} pts</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Redeemed On</p>
                              <p className="font-semibold text-gray-800">
                                {new Date(redemption.redeemed_at).toLocaleDateString()}
                              </p>
                            </div>
                            {redemption.fulfilled_at && (
                              <div>
                                <p className="text-gray-500">Fulfilled On</p>
                                <p className="font-semibold text-gray-800">
                                  {new Date(redemption.fulfilled_at).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>

                          {redemption.notes && (
                            <div className="bg-gray-50 rounded p-3 text-sm text-gray-700">
                              <span className="font-semibold">Notes:</span> {redemption.notes}
                            </div>
                          )}
                        </div>

                        {redemption.status === 'pending' && (
                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => onApproveRedemption(redemption.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition whitespace-nowrap"
                            >
                              <Check size={18} />
                              Approve
                            </button>
                            <button
                              onClick={() => onRejectRedemption(redemption.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition whitespace-nowrap"
                            >
                              <X size={18} />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Points Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Points Configuration</h3>
                <p className="text-purple-700">Configure how many points patients earn for each service and action.</p>
              </div>

              {/* Service Points */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Service Points</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(pointsConfig).filter(([key]) => 
                    !['referral', 'review', 'birthday', 'anniversary'].includes(key)
                  ).map(([key, value]) => (
                    <div key={key} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => setPointsConfig({...pointsConfig, [key]: parseInt(e.target.value)})}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-gray-600 text-sm">pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Points */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Action Bonuses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(pointsConfig).filter(([key]) => 
                    ['referral', 'review', 'birthday', 'anniversary'].includes(key)
                  ).map(([key, value]) => (
                    <div key={key} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                        {key} Bonus
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => setPointsConfig({...pointsConfig, [key]: parseInt(e.target.value)})}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-gray-600 text-sm">pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier Settings */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Membership Tiers</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Bronze', min: 0, max: 499, discount: 0, color: 'amber' },
                    { name: 'Silver', min: 500, max: 999, discount: 10, color: 'gray' },
                    { name: 'Gold', min: 1000, max: 1999, discount: 15, color: 'yellow' },
                    { name: 'Platinum', min: 2000, max: 'Unlimited', discount: 20, color: 'purple' },
                  ].map((tier) => (
                    <div key={tier.name} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-${tier.color}-500 rounded-full flex items-center justify-center text-white font-bold`}>
                            {tier.name[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{tier.name} Tier</h4>
                            <p className="text-sm text-gray-600">
                              {tier.min} - {tier.max} lifetime points
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-800">{tier.discount}%</p>
                          <p className="text-sm text-gray-600">Discount</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full md:w-auto px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
                Save Settings
              </button>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-sm text-gray-600 mb-2">Total Points Issued</h4>
                  <p className="text-3xl font-bold text-purple-600">{totalPointsIssued.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-2">+2,500 this month</p>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-sm text-gray-600 mb-2">Total Points Redeemed</h4>
                  <p className="text-3xl font-bold text-purple-600">{totalPointsRedeemed.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {((totalPointsRedeemed / totalPointsIssued) * 100).toFixed(1)}% redemption rate
                  </p>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-sm text-gray-600 mb-2">Outstanding Points</h4>
                  <p className="text-3xl font-bold text-amber-600">
                    {(totalPointsIssued - totalPointsRedeemed).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Liability</p>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Program Performance</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Analytics charts coming soon</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Most Popular Rewards</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Free Teeth Whitening', redemptions: 45, points: 1000 },
                    { name: 'Free Fluoride Treatment', redemptions: 32, points: 500 },
                    { name: '10% Off Next Visit', redemptions: 28, points: 150 },
                  ].map((reward, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{reward.name}</p>
                        <p className="text-sm text-gray-600">{reward.points} points required</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">{reward.redemptions}</p>
                        <p className="text-sm text-gray-600">redemptions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyManagement;
