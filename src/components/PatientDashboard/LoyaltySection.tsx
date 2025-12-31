import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, TrendingUp, Star, Users, Calendar, Award, Download, History } from 'lucide-react';
import { LoyaltyPoints, Reward, PointsTransaction, RewardRedemption, Referral } from '../../types';

interface LoyaltySectionProps {
  loyaltyPoints: LoyaltyPoints;
  rewards: Reward[];
  transactions: PointsTransaction[];
  redemptions: RewardRedemption[];
  referrals: Referral[];
  onRedeemReward: (rewardId: string) => void;
}

const LoyaltySection = ({ 
  loyaltyPoints, 
  rewards, 
  transactions, 
  redemptions,
  referrals,
  onRedeemReward 
}: LoyaltySectionProps) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'history' | 'referrals'>('rewards');

  const tierInfo = {
    Bronze: { min: 0, max: 499, color: 'from-amber-700 to-amber-900', discount: 0 },
    Silver: { min: 500, max: 999, color: 'from-gray-400 to-gray-600', discount: 10 },
    Gold: { min: 1000, max: 1999, color: 'from-yellow-400 to-yellow-600', discount: 15 },
    Platinum: { min: 2000, max: Infinity, color: 'from-purple-400 to-purple-600', discount: 20 },
  };

  const currentTier = tierInfo[loyaltyPoints.tier_level];
  const nextTier = loyaltyPoints.tier_level === 'Platinum' ? null : 
    Object.entries(tierInfo).find(([_, info]) => info.min > currentTier.max);

  return (
    <div className="space-y-6">
      {/* Loyalty Header */}
      <div className={`bg-gradient-to-r ${currentTier.color} rounded-2xl p-8 text-white relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{loyaltyPoints.tier_level} Member</h1>
              <p className="text-lg opacity-90">Your Loyalty Dashboard</p>
            </div>
            <Award size={64} className="opacity-50" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-4">
              <p className="text-sm opacity-90 mb-1">Current Points</p>
              <p className="text-3xl font-bold">{loyaltyPoints.points_balance}</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-4">
              <p className="text-sm opacity-90 mb-1">Lifetime Points</p>
              <p className="text-3xl font-bold">{loyaltyPoints.lifetime_points}</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-4">
              <p className="text-sm opacity-90 mb-1">Discount Level</p>
              <p className="text-3xl font-bold">{currentTier.discount}%</p>
            </div>
          </div>

          {/* Tier Progress */}
          {nextTier && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to {nextTier[0]}</span>
                <span>{loyaltyPoints.lifetime_points} / {nextTier[1].min} pts</span>
              </div>
              <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                <div
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${(loyaltyPoints.lifetime_points / nextTier[1].min) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Points Earning Guide */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-purple-600" />
          How to Earn Points
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { action: 'Checkup', points: 50, icon: Calendar },
            { action: 'Cleaning', points: 75, icon: Star },
            { action: 'Referral', points: 200, icon: Users },
            { action: 'Review', points: 25, icon: Star },
          ].map((item) => (
            <div key={item.action} className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-4 text-center">
              <item.icon className="text-purple-600 mx-auto mb-2" size={32} />
              <p className="font-semibold text-gray-800">{item.action}</p>
              <p className="text-2xl font-bold text-purple-600">{item.points}</p>
              <p className="text-xs text-gray-600">points</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-4 px-6 font-semibold transition ${
              activeTab === 'rewards'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Gift className="inline mr-2" size={20} />
            Rewards Catalog
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-4 px-6 font-semibold transition ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <History className="inline mr-2" size={20} />
            Points History
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`flex-1 py-4 px-6 font-semibold transition ${
              activeTab === 'referrals'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="inline mr-2" size={20} />
            Referrals
          </button>
        </div>

        <div className="p-6">
          {/* Rewards Catalog Tab */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.filter(r => r.active).map((reward) => (
                  <motion.div
                    key={reward.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition"
                  >
                    <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <Gift className="text-white" size={64} />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg text-gray-800 mb-2">{reward.name}</h4>
                      <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="text-yellow-500" size={20} />
                          <span className="font-bold text-lg text-purple-600">{reward.points_required}</span>
                          <span className="text-gray-500 text-sm">pts</span>
                        </div>
                        {loyaltyPoints.points_balance >= reward.points_required ? (
                          <button
                            onClick={() => onRedeemReward(reward.id)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                          >
                            Redeem Now
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-semibold"
                          >
                            {reward.points_required - loyaltyPoints.points_balance} more pts
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Redemptions */}
              {redemptions.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Redemptions</h3>
                  <div className="space-y-3">
                    {redemptions.slice(0, 5).map((redemption) => (
                      <div key={redemption.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-800">{redemption.reward_name}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(redemption.redeemed_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            redemption.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                            redemption.status === 'approved' ? 'bg-purple-100 text-purple-800' :
                            redemption.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {redemption.status.charAt(0).toUpperCase() + redemption.status.slice(1)}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">-{redemption.points_spent} pts</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Points History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Transaction History</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                  <Download size={18} />
                  Export PDF
                </button>
              </div>
              
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div>
                      <p className="font-semibold text-gray-800">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-right ${
                      transaction.transaction_type === 'earned' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <p className="text-xl font-bold">
                        {transaction.transaction_type === 'earned' ? '+' : '-'}{transaction.points}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">{transaction.transaction_type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-500 to-teal-500 rounded-xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Refer a Friend, Earn 200 Points!</h3>
                <p className="mb-4">Share your unique referral code and earn points when your friends complete their first visit.</p>
                <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Your Referral Code</p>
                    <p className="text-2xl font-bold tracking-wider">SMILE2024</p>
                  </div>
                  <button className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-semibold">
                    Copy Code
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Your Referrals</h3>
                <div className="space-y-3">
                  {referrals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No referrals yet. Start sharing your code!</p>
                    </div>
                  ) : (
                    referrals.map((referral) => (
                      <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-800">{referral.referred_name || referral.referred_email}</p>
                          <p className="text-sm text-gray-600">
                            Referred on {new Date(referral.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            referral.status === 'rewarded' ? 'bg-green-100 text-green-800' :
                            referral.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                          </span>
                          {referral.points_awarded > 0 && (
                            <p className="text-sm text-green-600 mt-1">+{referral.points_awarded} pts</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoyaltySection;
