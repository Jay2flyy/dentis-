import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Bell, Send, Search, Filter, History, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Patient, Notification } from '../../types';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import SendNotificationModal from './SendNotificationModal';

interface CommunicationCenterProps {
    patients: Patient[];
}

const CommunicationCenter = ({ patients }: CommunicationCenterProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notification history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this notification record?')) return;
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setNotifications(notifications.filter(n => n.id !== id));
            toast.success('Notification record deleted');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification');
        }
    };

    const filteredNotifications = notifications.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRecipientName = (patientId: string | null) => {
        if (!patientId) return 'All Patients';
        const patient = patients.find(p => p.id === patientId);
        return patient ? patient.full_name : 'Unknown Patient';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Communication Center</h1>
                    <p className="text-gray-600 mt-1">Manage patient notifications and broadcasts</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold shadow-lg"
                >
                    <Send size={20} />
                    New Announcement
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Bell size={24} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Total Sent</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Broadcasts and reminders</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <CheckCircle size={24} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Read Rate</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {notifications.length > 0
                            ? Math.round((notifications.filter(n => n.is_read).length / notifications.length) * 100)
                            : 0}%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Patient engagement metric</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Clock size={24} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Scheduled</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-500 mt-1">Upcoming automated alerts</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <History size={20} className="text-indigo-600" />
                        Notification History
                    </h2>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search history..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Recipient</th>
                                <th className="px-6 py-4 text-left">Type</th>
                                <th className="px-6 py-4 text-left">Content</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                        <p className="mt-2 text-gray-500 font-medium">Loading history...</p>
                                    </td>
                                </tr>
                            ) : filteredNotifications.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-medium text-lg text-gray-400">No notifications sent yet</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredNotifications.map((notif) => (
                                    <motion.tr
                                        key={notif.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {new Date(notif.created_at).toLocaleDateString()}
                                            <br />
                                            <span className="text-xs text-gray-400">{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${!notif.patient_id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {getRecipientName(notif.patient_id)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-700 capitalize">{notif.notification_type.replace('_', ' ')}</span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="text-sm font-bold text-gray-800 truncate">{notif.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{notif.message}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1 text-xs font-bold ${notif.is_read ? 'text-green-600' : 'text-amber-600'}`}>
                                                {notif.is_read ? (
                                                    <><CheckCircle size={14} /> Read</>
                                                ) : (
                                                    <><Clock size={14} /> Unread</>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDelete(notif.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <SendNotificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                patients={patients}
                onSuccess={fetchNotifications}
            />
        </div>
    );
};

export default CommunicationCenter;
