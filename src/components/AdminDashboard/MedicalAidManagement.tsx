import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard, ExternalLink, ShieldCheck, AlertCircle, CheckCircle, Clock, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Patient } from '../../types';
import toast from 'react-hot-toast';

interface MedicalAidRecord {
    id: string;
    patient_id: string;
    provider_name: string;
    plan_name: string;
    member_number: string;
    dependent_code: string;
    main_member_name: string;
    card_front_url?: string;
    card_back_url?: string;
    status: 'active' | 'expired' | 'inactive';
    created_at: string;
    patient?: {
        full_name: string;
        email: string;
    };
}

const MedicalAidManagement = () => {
    const [records, setRecords] = useState<MedicalAidRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const fetchRecords = async () => {
        try {
            setLoading(true);
            // We join with patients to get their names
            const { data, error } = await supabase
                .from('medical_aid')
                .select(`
          *,
          patient:patients(full_name, email)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRecords(data || []);
        } catch (error) {
            console.error('Error fetching medical aid records:', error);
            toast.error('Failed to load medical aid records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase
                .from('medical_aid')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            toast.success('Status updated');
            fetchRecords();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const filteredRecords = records.filter(record => {
        const matchesSearch =
            record.patient?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.member_number.includes(searchTerm);

        const matchesFilter = filterStatus === 'all' || record.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Medical Aid Management</h1>
                    <p className="text-gray-600 mt-1">Review and verify patient insurance information</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search patients or providers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Total Records</p>
                    <p className="text-3xl font-bold text-gray-900">{records.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Active Plans</p>
                    <p className="text-3xl font-bold text-gray-900">{records.filter(r => r.status === 'active').length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-amber-500">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Missing Cards</p>
                    <p className="text-3xl font-bold text-gray-900">{records.filter(r => !r.card_front_url || !r.card_back_url).length}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4 text-left">Patient</th>
                                <th className="px-6 py-4 text-left">Provider & Plan</th>
                                <th className="px-6 py-4 text-left">Member Info</th>
                                <th className="px-6 py-4 text-left">Cards</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                                        Loading records...
                                    </td>
                                </tr>
                            ) : filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                                        No medical aid records found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => (
                                    <motion.tr key={record.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition drop-shadow-sm">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800">{record.patient?.full_name}</div>
                                            <div className="text-xs text-gray-500">{record.patient?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck size={16} className="text-indigo-600" />
                                                <span className="font-semibold text-gray-800">{record.provider_name}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 pl-6">{record.plan_name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-700">#{record.member_number}</div>
                                            <div className="text-xs text-gray-500">Dep: {record.dependent_code || 'Main'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {record.card_front_url ? (
                                                    <a href={record.card_front_url} target="_blank" rel="noreferrer" className="p-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition" title="View Front">
                                                        <CreditCard size={18} />
                                                    </a>
                                                ) : (
                                                    <div className="p-1 bg-gray-50 text-gray-300 rounded" title="Missing Front">
                                                        <CreditCard size={18} />
                                                    </div>
                                                )}
                                                {record.card_back_url ? (
                                                    <a href={record.card_back_url} target="_blank" rel="noreferrer" className="p-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition" title="View Back">
                                                        <CreditCard size={18} />
                                                    </a>
                                                ) : (
                                                    <div className="p-1 bg-gray-50 text-gray-300 rounded" title="Missing Back">
                                                        <CreditCard size={18} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={record.status}
                                                onChange={(e) => updateStatus(record.id, e.target.value)}
                                                className={`text-xs font-bold px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-indigo-500 cursor-pointer ${record.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        record.status === 'expired' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                <option value="active">ACTIVE</option>
                                                <option value="expired">EXPIRED</option>
                                                <option value="inactive">INACTIVE</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MedicalAidManagement;
