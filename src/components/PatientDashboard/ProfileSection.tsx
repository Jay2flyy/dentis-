import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfileSection = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        full_name: '',
        phone: '',
        address: '',
        date_of_birth: '',
        emergency_contact: '',
        medical_history: '',
    });

    useEffect(() => {
        if (user) fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .eq('email', user?.email)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            if (data) {
                setProfile({
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    date_of_birth: data.date_of_birth || '',
                    emergency_contact: data.emergency_contact || '',
                    medical_history: data.medical_history || '',
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase
                .from('patients')
                .upsert({
                    email: user?.email,
                    ...profile,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'email' });

            if (error) throw error;
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-8 flex items-end gap-6">
                        <div className="relative group">
                            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
                                <div className="w-full h-full bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-4xl font-bold">
                                    {profile.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                                </div>
                            </div>
                            <button className="absolute bottom-1 right-1 p-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition">
                                <Camera size={16} />
                            </button>
                        </div>
                        <div className="pb-2">
                            <h2 className="text-2xl font-bold text-gray-800">{profile.full_name || 'Valued Patient'}</h2>
                            <p className="text-gray-500 flex items-center gap-1">
                                <Mail size={14} />
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Personal Information</h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        value={profile.date_of_birth}
                                        onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Medical & Emergency</h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Emergency Contact</label>
                                <input
                                    type="text"
                                    value={profile.emergency_contact}
                                    onChange={(e) => setProfile({ ...profile, emergency_contact: e.target.value })}
                                    placeholder="Name and Phone Number"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Medical History Notes</label>
                                <textarea
                                    rows={4}
                                    value={profile.medical_history}
                                    onChange={(e) => setProfile({ ...profile, medical_history: e.target.value })}
                                    placeholder="List any allergies or chronic conditions..."
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-6 border-t flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition shadow-lg disabled:opacity-50"
                            >
                                {saving ? 'Saving Changes...' : (
                                    <>
                                        <Save size={20} />
                                        Save Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;
