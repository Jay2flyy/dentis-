import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Upload, X, Shield, Plus, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface MedicalAidData {
    id?: string;
    provider_name: string;
    plan_name: string;
    member_number: string;
    dependent_code: string;
    main_member_name: string;
    card_front_url?: string;
    card_back_url?: string;
    status: 'active' | 'expired' | 'inactive';
}

interface MedicalAidSectionProps {
    patientId: string;
}

const MedicalAidSection = ({ patientId }: MedicalAidSectionProps) => {
    const [medicalAid, setMedicalAid] = useState<MedicalAidData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState<MedicalAidData>({
        provider_name: '',
        plan_name: '',
        member_number: '',
        dependent_code: '',
        main_member_name: '',
        status: 'active'
    });

    const fetchMedicalAid = async () => {
        if (!patientId || patientId.length < 30) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('medical_aid')
                .select('*')
                .eq('patient_id', patientId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setMedicalAid(data);
                setFormData(data);
            }
        } catch (error) {
            console.error('Error fetching medical aid:', error);
            toast.error('Failed to load medical aid information');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) fetchMedicalAid();
    }, [patientId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await supabase
                .from('medical_aid')
                .upsert({
                    patient_id: patientId,
                    ...formData,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'patient_id' });

            if (error) throw error;

            toast.success('Medical aid information updated');
            setIsEditing(false);
            fetchMedicalAid();
        } catch (error) {
            console.error('Error updating medical aid:', error);
            toast.error('Failed to update medical aid information');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `card_${side}_${Date.now()}.${fileExt}`;
            const filePath = `${patientId}/medical_aid/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(filePath);

            const field = side === 'front' ? 'card_front_url' : 'card_back_url';

            const { error: updateError } = await supabase
                .from('medical_aid')
                .update({ [field]: publicUrl })
                .eq('patient_id', patientId);

            if (updateError) throw updateError;

            toast.success(`${side.charAt(0).toUpperCase() + side.slice(1)} side card uploaded`);
            fetchMedicalAid();
        } catch (error) {
            console.error('Error uploading card:', error);
            toast.error('Failed to upload card image');
        } finally {
            setUploading(false);
        }
    };

    if (loading && !medicalAid && !isEditing) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Medical Aid</h1>
                    <p className="text-gray-600 mt-1">Manage your medical aid information and documents</p>
                </div>
                {!isEditing && medicalAid && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold"
                    >
                        Edit Information
                    </button>
                )}
            </div>

            {!isEditing && !medicalAid ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Medical Aid Linked</h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        Provide your medical aid details to simplify billing and treatment claims.
                    </p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-bold shadow-lg"
                    >
                        Add Medical Aid
                    </button>
                </div>
            ) : isEditing ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Aid Provider</label>
                                <input
                                    type="text"
                                    value={formData.provider_name}
                                    onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                                    placeholder="e.g. Discovery Health, Momentum"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Plan / Scheme Name</label>
                                <input
                                    type="text"
                                    value={formData.plan_name}
                                    onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                                    placeholder="e.g. Classic Comprehensive"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Member Number</label>
                                <input
                                    type="text"
                                    value={formData.member_number}
                                    onChange={(e) => setFormData({ ...formData, member_number: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Dependent Code</label>
                                <input
                                    type="text"
                                    value={formData.dependent_code}
                                    onChange={(e) => setFormData({ ...formData, dependent_code: e.target.value })}
                                    placeholder="e.g. 00, 01"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Main Member Full Name</label>
                                <input
                                    type="text"
                                    value={formData.main_member_name}
                                    onChange={(e) => setFormData({ ...formData, main_member_name: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex-1 p-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 p-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition shadow-lg disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Information'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        {/* Info Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                                    <Shield size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{medicalAid.provider_name}</h2>
                                    <p className="text-purple-600 font-semibold">{medicalAid.plan_name || 'Standard Plan'}</p>
                                </div>
                                <div className="ml-auto">
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${medicalAid.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {medicalAid.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Member Number</p>
                                    <p className="text-xl font-bold text-gray-800">{medicalAid.member_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Dependent Code</p>
                                    <p className="text-xl font-bold text-gray-800">{medicalAid.dependent_code || 'Main'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500 mb-1">Main Member</p>
                                    <p className="text-xl font-bold text-gray-800">{medicalAid.main_member_name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Document Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <p className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Plus size={18} className="text-purple-600" />
                                    Card Front
                                </p>
                                {medicalAid.card_front_url ? (
                                    <div className="relative group rounded-xl overflow-hidden border-2 border-gray-100 aspect-[1.6/1]">
                                        <img src={medicalAid.card_front_url} alt="Card Front" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                                            <label className="p-2 bg-white rounded-full text-gray-800 cursor-pointer hover:bg-gray-100 transition">
                                                <Upload size={20} />
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'front')} accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center aspect-[1.6/1] border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition">
                                        <Plus size={32} className="text-gray-400 mb-2" />
                                        <span className="text-sm font-semibold text-gray-500">Upload Front Side</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'front')} accept="image/*" />
                                    </label>
                                )}
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <p className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Plus size={18} className="text-purple-600" />
                                    Card Back
                                </p>
                                {medicalAid.card_back_url ? (
                                    <div className="relative group rounded-xl overflow-hidden border-2 border-gray-100 aspect-[1.6/1]">
                                        <img src={medicalAid.card_back_url} alt="Card Back" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                                            <label className="p-2 bg-white rounded-full text-gray-800 cursor-pointer hover:bg-gray-100 transition">
                                                <Upload size={20} />
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'back')} accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center aspect-[1.6/1] border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition">
                                        <Plus size={32} className="text-gray-400 mb-2" />
                                        <span className="text-sm font-semibold text-gray-500">Upload Back Side</span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'back')} accept="image/*" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-indigo-900 rounded-2xl shadow-xl p-8 text-white">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Info size={24} />
                                Why this matters?
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <CheckCircle size={20} className="text-green-400 shrink-0" />
                                    <p className="text-indigo-100 text-sm">Faster check-ins at your appointments</p>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle size={20} className="text-green-400 shrink-0" />
                                    <p className="text-indigo-100 text-sm">Automated treatment claims processing</p>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle size={20} className="text-green-400 shrink-0" />
                                    <p className="text-indigo-100 text-sm">Transparent pricing based on your cover</p>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                            <div className="flex gap-3">
                                <AlertCircle className="text-amber-600 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold text-amber-800 mb-1">Identity Required</h4>
                                    <p className="text-sm text-amber-700">
                                        Please ensure the member name matches your ID document for claim approval.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default MedicalAidSection;
