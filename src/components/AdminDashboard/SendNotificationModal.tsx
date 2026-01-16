import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Users, User, Bell } from 'lucide-react';
import { Patient } from '../../types';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface SendNotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    patients: Patient[];
    onSuccess: () => void;
}

const SendNotificationModal = ({ isOpen, onClose, patients, onSuccess }: SendNotificationModalProps) => {
    const [target, setTarget] = useState<'all' | 'specific'>('all');
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('general');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (target === 'specific' && !selectedPatientId) {
            toast.error('Please select a patient');
            return;
        }

        setLoading(true);
        try {
            const notificationData = {
                patient_id: target === 'all' ? null : selectedPatientId,
                notification_type: type,
                title,
                message,
                is_read: false,
                created_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('notifications')
                .insert([notificationData]);

            if (error) throw error;

            toast.success('Notification sent successfully');
            onSuccess();
            onClose();
            // Reset form
            setTitle('');
            setMessage('');
            setSelectedPatientId('');
        } catch (error) {
            console.error('Error sending notification:', error);
            toast.error('Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-900 text-white">
                            <div className="flex items-center gap-2">
                                <Bell size={24} />
                                <h2 className="text-xl font-bold">Send Notification</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setTarget('all')}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition ${target === 'all' ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                                            }`}
                                    >
                                        <Users size={20} />
                                        All Patients
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTarget('specific')}
                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition ${target === 'specific' ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                                            }`}
                                    >
                                        <User size={20} />
                                        Specific Patient
                                    </button>
                                </div>
                            </div>

                            {target === 'specific' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 text-indigo-900">Select Patient</label>
                                    <select
                                        value={selectedPatientId}
                                        onChange={(e) => setSelectedPatientId(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="">Choose a patient...</option>
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                >
                                    <option value="general">General Broadcast</option>
                                    <option value="appointment_reminder">Appointment Reminder</option>
                                    <option value="billing_reminder">Billing / Overdue Payment</option>
                                    <option value="loyalty_points">Loyalty Reward Update</option>
                                    <option value="marketing">Marketing / Promotion</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Holiday Hours Update"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    rows={4}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 p-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 p-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                                >
                                    {loading ? (
                                        'Sending...'
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Send Now
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SendNotificationModal;
