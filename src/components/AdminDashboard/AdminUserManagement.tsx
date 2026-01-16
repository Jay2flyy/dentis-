import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Shield, ShieldAlert, Trash2, Search, UserCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AdminUser {
    id: string;
    user_id: string;
    role: string;
    created_at: string;
    email?: string; // We'll fetch this from profiles/auth if possible
}

const AdminUserManagement = () => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            // We need to fetch from admin_users and ideally get the email.
            // Since we can't easily join auth.users from client-side without a custom function,
            // we'll try to match with 'patients' or 'profiles' if they exist.
            const { data, error } = await supabase
                .from('admin_users')
                .select('*');

            if (error) throw error;

            // For each admin, try to get their email from the profiles/patients table
            const adminsWithEmail = await Promise.all((data || []).map(async (admin) => {
                const { data: profile } = await supabase
                    .from('patients')
                    .select('email, full_name')
                    .eq('email', 'fake@email.com') // Placeholder, real logic below
                    .limit(1);

                // Since we don't have a perfect link without auth.users access,
                // we'll rely on the user running the SQL or use a placeholder.
                // In a real app, you'd have a 'profiles' table that syncs with auth.users.
                return { ...admin, email: 'Admin User' };
            }));

            setAdmins(data || []);
        } catch (error) {
            console.error('Error fetching admins:', error);
            toast.error('Failed to load admin list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAdminEmail) return;

        setIsSubmitting(true);
        try {
            // 1. In a standard setup, we'd need the UUID of the user.
            // Since we only have the email, we'll suggest using the SQL editor 
            // OR if we have a profiles table that contains email and user_id, we use that.

            // Show a message to the user that they need to use SQL to add admins
            // Since we can't access auth.users from the client side due to RLS
            toast.error('Admin privileges must be granted via SQL Editor. Use the following command:');
            
            // Show the SQL command in the console
            console.log(`
-- SQL Command to add admin:
-- First, find the user ID:
SELECT id FROM auth.users WHERE email = '${newAdminEmail}';

-- Then add to admin_users table:
INSERT INTO admin_users (user_id, role) VALUES ('<USER_ID>', 'admin');
`);
            
            // In a real application, you would create a server-side function to handle this
            // or have a dedicated admin panel with proper permissions
            
            // For now, we'll just show the instructions
            alert(`To add an admin:
1. Go to your Supabase Dashboard
2. Open SQL Editor
3. Run: SELECT id FROM auth.users WHERE email = '${newAdminEmail}';
4. Copy the user ID
5. Run: INSERT INTO admin_users (user_id, role) VALUES ('<COPIED_USER_ID>', 'admin');`);

            // If we HAD a searchable profiles table:
            /*
            const { data: profile } = await supabase.from('profiles').select('id').eq('email', newAdminEmail).single();
            if (profile) {
              await supabase.from('admin_users').insert({ user_id: profile.id, role: 'admin' });
            }
            */
        } catch (error) {
            toast.error('User not found or error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeAdmin = async (userId: string) => {
        if (!window.confirm('Remove admin privileges for this user?')) return;
        try {
            const { error } = await supabase
                .from('admin_users')
                .delete()
                .eq('user_id', userId);

            if (error) throw error;
            toast.success('Admin privileges removed');
            fetchAdmins();
        } catch (error) {
            toast.error('Failed to remove admin');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">System Permissions</h1>
                    <p className="text-gray-600 mt-1">Manage administrative access and roles</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            <Shield size={20} className="text-indigo-600" />
                            Active Administrators
                        </h2>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                            {admins.length} Total
                        </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {loading ? (
                            <div className="p-12 text-center text-gray-400">
                                <div className="animate-spin h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                Loading administrative accounts...
                            </div>
                        ) : admins.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <ShieldAlert size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No administrative users found in database</p>
                            </div>
                        ) : (
                            admins.map((admin) => (
                                <div key={admin.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                            {admin.role.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">Admin User</p>
                                            <p className="text-xs text-gray-500">ID: {admin.user_id.substring(0, 8)}...</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                            {admin.role}
                                        </span>
                                        <button
                                            onClick={() => removeAdmin(admin.user_id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Remove Access"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <UserPlus size={20} className="text-indigo-600" />
                            Add New Admin
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 italic">
                            Grant administrative privileges to an existing user by their account email.
                        </p>
                        <form onSubmit={handleAddAdmin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">User Email</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="email"
                                        value={newAdminEmail}
                                        onChange={(e) => setNewAdminEmail(e.target.value)}
                                        placeholder="example@gmail.com"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processing...' : (
                                    <>
                                        <UserCheck size={18} />
                                        Grant Access
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                        <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                            <ShieldAlert size={18} />
                            Security Warning
                        </h4>
                        <p className="text-xs text-amber-700 leading-relaxed">
                            Granting administrative access allows users to view all patient data, manage financial records, and system settings. Only add trusted personnel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserManagement;
