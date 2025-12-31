import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, FileText, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Service } from '../types';

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    fullName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const services: Service[] = [
    { id: '1', name: 'General Checkup', description: 'Comprehensive oral examination', duration: 30, price: 80, category: 'General' },
    { id: '2', name: 'Teeth Cleaning', description: 'Professional cleaning and polishing', duration: 45, price: 120, category: 'Preventive' },
    { id: '3', name: 'Teeth Whitening', description: 'Professional whitening treatment', duration: 60, price: 400, category: 'Cosmetic' },
    { id: '4', name: 'Dental Filling', description: 'Cavity filling procedure', duration: 60, price: 200, category: 'Restorative' },
    { id: '5', name: 'Root Canal', description: 'Root canal therapy', duration: 90, price: 800, category: 'Endodontic' },
    { id: '6', name: 'Emergency Care', description: '24/7 emergency dental service', duration: 30, price: 150, category: 'Emergency' },
  ];

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleSubmit = async () => {
    try {
      const { error } = await supabase.from('appointments').insert([
        {
          patient_name: formData.fullName,
          patient_email: formData.email,
          patient_phone: formData.phone,
          appointment_date: formData.date,
          appointment_time: formData.time,
          service_type: formData.service,
          notes: formData.notes,
          status: 'pending',
        },
      ]);

      if (error) throw error;

      toast.success('Appointment booked successfully!');
      setStep(4);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => {
                    setFormData({ ...formData, service: service.name });
                    setStep(2);
                  }}
                  className={`card cursor-pointer hover:border-dental-primary border-2 transition-all ${
                    formData.service === service.name ? 'border-dental-primary bg-dental-light' : 'border-transparent'
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      <Clock size={16} className="inline mr-1" />
                      {service.duration} min
                    </span>
                    <span className="text-dental-primary font-semibold">R{service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Choose Date & Time</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Select Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>
              {formData.date && (
                <div>
                  <label className="block text-sm font-medium mb-2">Select Time</label>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setFormData({ ...formData, time })}
                        className={`py-3 px-4 rounded-lg border-2 transition-all ${
                          formData.time === time
                            ? 'border-dental-primary bg-dental-primary text-white'
                            : 'border-gray-300 hover:border-dental-primary'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {formData.date && formData.time && (
                <button onClick={() => setStep(3)} className="btn-primary w-full">
                  Continue
                </button>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Your Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="input-field pl-10"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field pl-10"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field pl-10"
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field pl-10 min-h-[100px]"
                    placeholder="Any special requirements or concerns?"
                  />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!formData.fullName || !formData.email || !formData.phone}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Appointment
              </button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-500" size={48} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Appointment Confirmed!</h2>
            <p className="text-gray-600 mb-8">
              We've sent a confirmation email to {formData.email}
            </p>
            <div className="card max-w-md mx-auto text-left">
              <h3 className="font-semibold mb-4">Appointment Details:</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Service:</strong> {formData.service}</p>
                <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {formData.time}</p>
                <p><strong>Name:</strong> {formData.fullName}</p>
              </div>
            </div>
            <button onClick={() => window.location.href = '/'} className="btn-primary mt-8">
              Return to Home
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      s <= step ? 'bg-dental-primary text-white' : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`h-1 flex-1 mx-2 ${s < step ? 'bg-dental-primary' : 'bg-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Service</span>
              <span>Date & Time</span>
              <span>Information</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>

        {step > 1 && step < 4 && (
          <button onClick={() => setStep(step - 1)} className="mt-4 text-dental-primary hover:underline">
            ← Back
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
