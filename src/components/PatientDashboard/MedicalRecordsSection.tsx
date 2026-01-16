import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Pill, AlertCircle, Download, Eye, Printer, Activity } from 'lucide-react';
import { DentalHistory, MedicalDocument, TreatmentPlan, Prescription, PatientMedicalInfo } from '../../types';
import DocumentUpload from './DocumentUpload';
import { downloadDocument, mockDownloadDocument } from '../../lib/fileUtils';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface MedicalRecordsSectionProps {
  dentalHistory: DentalHistory[];
  documents: MedicalDocument[];
  treatmentPlans: TreatmentPlan[];
  prescriptions: Prescription[];
  medicalInfo: PatientMedicalInfo[];
  patientId: string;
  onUploadDocument: () => void;
  onDownloadDocument: (documentId: string) => void;
}

const MedicalRecordsSection = ({
  dentalHistory,
  documents,
  treatmentPlans,
  prescriptions,
  medicalInfo,
  patientId,
  onUploadDocument,
  onDownloadDocument,
}: MedicalRecordsSectionProps) => {
  const [activeTab, setActiveTab] = useState<'history' | 'documents' | 'treatments' | 'prescriptions'>('history');
  const { demoMode } = useAuth();

  const handleDownload = (documentId: string, fileName: string, filePath?: string) => {
    if (demoMode) {
      mockDownloadDocument(fileName);
      toast.success('Downloaded in Demo Mode');
    } else {
      if (filePath) {
        downloadDocument(filePath, fileName);
        toast.success('Download started');
      } else {
        onDownloadDocument(documentId);
      }
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const allergies = medicalInfo.filter(info => info.info_type === 'allergy');
  const conditions = medicalInfo.filter(info => info.info_type === 'condition');
  const medications = medicalInfo.filter(info => info.info_type === 'medication');

  const activePrescriptions = prescriptions.filter(p => p.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Medical Records</h1>
          <p className="text-gray-600 mt-1">View and manage your dental health records</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
          >
            <Printer size={20} />
            Print Records
          </button>
          <DocumentUpload
            onUploadSuccess={() => {
              toast.success('Document uploaded successfully!');
              onUploadDocument();
            }}
            patientId={patientId || 'demo-patient-123'}
          />
        </div>
      </div>

      {/* Medical Alerts */}
      {(allergies.length > 0 || conditions.length > 0) && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-800 mb-3">Important Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allergies.length > 0 && (
                  <div>
                    <p className="font-semibold text-red-700 mb-2">Allergies:</p>
                    <ul className="space-y-1">
                      {allergies.map(allergy => (
                        <li key={allergy.id} className="text-red-600 flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          {allergy.name} {allergy.severity && `(${allergy.severity})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {conditions.length > 0 && (
                  <div>
                    <p className="font-semibold text-red-700 mb-2">Medical Conditions:</p>
                    <ul className="space-y-1">
                      {conditions.map(condition => (
                        <li key={condition.id} className="text-red-600 flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          {condition.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Medications */}
      {medications.length > 0 && (
        <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Pill className="text-purple-600 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-purple-800 mb-3">Current Medications</h3>
              <div className="flex flex-wrap gap-2">
                {medications.map(med => (
                  <span key={med.id} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                    {med.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-wrap border-b">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${activeTab === 'history' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Activity size={20} />
            Dental History
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${activeTab === 'documents' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Image size={20} />
            Documents & X-Rays
          </button>
          <button
            onClick={() => setActiveTab('treatments')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${activeTab === 'treatments' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <FileText size={20} />
            Treatment Plans
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition ${activeTab === 'prescriptions' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Pill size={20} />
            Prescriptions
            {activePrescriptions.length > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">{activePrescriptions.length}</span>
            )}
          </button>
        </div>

        <div className="p-6">
          {/* Dental History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {dentalHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Activity size={64} className="mx-auto mb-4 opacity-50" />
                  <p>No dental history records yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dentalHistory.map((record) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-2 border-gray-200 rounded-lg p-5 hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{record.procedure_type}</h3>
                          <p className="text-sm text-gray-600">{new Date(record.procedure_date).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => handleDownload(record.id, `${record.procedure_type}-${record.procedure_date}.pdf`)}
                          className="text-purple-600 hover:text-purple-700"
                          title="Download Record"
                        >
                          <Download size={20} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {record.dentist_name && (
                          <div>
                            <p className="text-gray-500">Dentist</p>
                            <p className="font-semibold text-gray-800">{record.dentist_name}</p>
                          </div>
                        )}
                        {record.tooth_number && (
                          <div>
                            <p className="text-gray-500">Tooth Number</p>
                            <p className="font-semibold text-gray-800">{record.tooth_number}</p>
                          </div>
                        )}
                        {record.diagnosis && (
                          <div className="col-span-2">
                            <p className="text-gray-500">Diagnosis</p>
                            <p className="font-semibold text-gray-800">{record.diagnosis}</p>
                          </div>
                        )}
                        {record.treatment_notes && (
                          <div className="col-span-2">
                            <p className="text-gray-500">Notes</p>
                            <p className="text-gray-700">{record.treatment_notes}</p>
                          </div>
                        )}
                        {record.cost && (
                          <div>
                            <p className="text-gray-500">Cost</p>
                            <p className="font-semibold text-gray-800">${record.cost.toFixed(2)}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <Image size={64} className="mx-auto mb-4 opacity-50" />
                    <p>No documents uploaded yet</p>
                    <button
                      onClick={onUploadDocument}
                      className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Upload Your First Document
                    </button>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      whileHover={{ scale: 1.03 }}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                    >
                      <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg mb-3">
                        {doc.document_type === 'xray' || doc.document_type === 'photo' ? (
                          <Image size={48} className="text-gray-400" />
                        ) : (
                          <FileText size={48} className="text-gray-400" />
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-1 truncate">{doc.file_name}</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {doc.document_type.toUpperCase()} • {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm">
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => handleDownload(doc.id, doc.file_name, doc.file_url)}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-sm"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Treatment Plans Tab */}
          {activeTab === 'treatments' && (
            <div className="space-y-4">
              {treatmentPlans.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText size={64} className="mx-auto mb-4 opacity-50" />
                  <p>No treatment plans yet</p>
                </div>
              ) : (
                treatmentPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{plan.title}</h3>
                        <p className="text-gray-600 mt-1">{plan.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${plan.status === 'completed' ? 'bg-green-100 text-green-800' :
                        plan.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                          plan.status === 'approved' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {plan.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {plan.total_cost && (
                        <div>
                          <p className="text-sm text-gray-500">Total Cost</p>
                          <p className="font-bold text-gray-800">${plan.total_cost.toFixed(2)}</p>
                        </div>
                      )}
                      {plan.estimated_duration && (
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-800">{plan.estimated_duration}</p>
                        </div>
                      )}
                      {plan.priority && (
                        <div>
                          <p className="text-sm text-gray-500">Priority</p>
                          <p className={`font-semibold ${plan.priority === 'urgent' ? 'text-red-600' :
                            plan.priority === 'high' ? 'text-orange-600' :
                              'text-gray-800'
                            }`}>
                            {plan.priority.toUpperCase()}
                          </p>
                        </div>
                      )}
                    </div>

                    {plan.phases && plan.phases.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold text-gray-800 mb-3">Treatment Phases:</p>
                        <div className="space-y-2">
                          {plan.phases.map((phase) => (
                            <div key={phase.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${phase.status === 'completed' ? 'bg-green-500 text-white' :
                                'bg-gray-300 text-gray-600'
                                }`}>
                                {phase.phase_number}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800">{phase.phase_name}</p>
                                {phase.description && <p className="text-sm text-gray-600">{phase.description}</p>}
                              </div>
                              {phase.estimated_cost && (
                                <p className="font-semibold text-gray-800">${phase.estimated_cost.toFixed(2)}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              {prescriptions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Pill size={64} className="mx-auto mb-4 opacity-50" />
                  <p>No prescriptions yet</p>
                </div>
              ) : (
                prescriptions.map((prescription) => (
                  <motion.div
                    key={prescription.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-2 rounded-lg p-5 hover:shadow-lg transition ${prescription.status === 'active' ? 'border-green-300 bg-green-50' : 'border-gray-200'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{prescription.medication_name}</h3>
                        <p className="text-gray-600">{prescription.dosage} • {prescription.frequency}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${prescription.status === 'active' ? 'bg-green-100 text-green-800' :
                        prescription.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {prescription.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-500">Prescribed Date</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(prescription.prescribed_date).toLocaleDateString()}
                        </p>
                      </div>
                      {prescription.duration && (
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-800">{prescription.duration}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500">Refills Remaining</p>
                        <p className="font-semibold text-gray-800">{prescription.refills_remaining}</p>
                      </div>
                      {prescription.prescribed_by && (
                        <div>
                          <p className="text-gray-500">Prescribed By</p>
                          <p className="font-semibold text-gray-800">{prescription.prescribed_by}</p>
                        </div>
                      )}
                    </div>

                    {prescription.instructions && (
                      <div className="bg-white p-3 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Instructions:</p>
                        <p className="text-sm text-gray-600">{prescription.instructions}</p>
                      </div>
                    )}

                    {prescription.status === 'active' && prescription.refills_remaining > 0 && (
                      <button className="mt-4 w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                        Request Refill
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsSection;
