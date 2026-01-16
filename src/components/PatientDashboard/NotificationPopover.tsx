import { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, Calendar, DollarSign, Gift, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '../../types';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface NotificationPopoverProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

const NotificationPopover = ({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationPopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'appointment_reminder':
            case 'appointment_confirmation':
                return <Calendar className="text-blue-500" size={18} />;
            case 'billing_reminder':
            case 'payment_received':
                return <DollarSign className="text-green-500" size={18} />;
            case 'loyalty_points':
                return <Gift className="text-purple-500" size={18} />;
            case 'general':
            case 'marketing':
                return <Bell className="text-indigo-500" size={18} />;
            default:
                return <Info className="text-gray-500" size={18} />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition relative group"
            >
                <Bell size={24} className="text-gray-600 group-hover:text-purple-600 transition" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-purple-50">
                                <h3 className="font-bold text-gray-800">Notifications</h3>
                                <div className="flex gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={onMarkAllAsRead}
                                            className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Bell size={48} className="mx-auto mb-2 opacity-10" />
                                        <p>No notifications yet</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`p-4 hover:bg-gray-50 transition cursor-pointer flex gap-3 ${!notif.is_read ? 'bg-purple-50/30' : ''}`}
                                                onClick={() => {
                                                    if (!notif.is_read) onMarkAsRead(notif.id);
                                                }}
                                            >
                                                <div className={`mt-1 p-2 rounded-lg bg-white shadow-sm border border-gray-100 shrink-0 h-fit`}>
                                                    {getIcon(notif.notification_type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className={`text-sm ${!notif.is_read ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                                                            {notif.title}
                                                        </p>
                                                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                                                            {new Date(notif.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                        {notif.message}
                                                    </p>
                                                    {!notif.is_read && (
                                                        <div className="mt-2 flex items-center gap-1">
                                                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                                                            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">New</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-3 border-t border-gray-100 text-center">
                                <button className="text-sm font-semibold text-gray-500 hover:text-purple-600 transition">
                                    View all activity
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationPopover;
