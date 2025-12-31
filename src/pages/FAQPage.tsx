import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CTASection } from '../components/CTASection';

const FAQPage = () => {
  const [openCategory, setOpenCategory] = useState<string>('loyalty');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'loyalty', name: 'Loyalty Points System', icon: '🎁' },
    { id: 'services', name: 'Our Services', icon: '🦷' },
    { id: 'pricing', name: 'Pricing & Payment', icon: '💰' },
    { id: 'booking', name: 'Booking & Appointments', icon: '📅' },
    { id: 'general', name: 'General Information', icon: 'ℹ️' },
  ];

  const faqs = {
    loyalty: [
      {
        id: 'l1',
        question: 'How does the Loyalty Points System work?',
        answer: 'Our Loyalty Points System rewards you for every visit! For every R100 you spend on dental services, you earn 10 loyalty points. Accumulate points and redeem them for FREE services like teeth whitening (R8,000 value) and professional cleaning (R2,400 value). Points never expire as long as you visit us at least once per year.',
      },
      {
        id: 'l2',
        question: 'How do I sign up for the Loyalty Program?',
        answer: 'Signing up is easy and FREE! Simply book an appointment online or call us at 046 603 1234. During your first visit, our reception team will enroll you in the program. You\'ll receive a loyalty card and can start earning points immediately.',
      },
      {
        id: 'l3',
        question: 'What can I get for FREE with my points?',
        answer: 'Loyalty members can earn: FREE Teeth Whitening (500 points - R8,000 value), FREE Professional Cleaning (100 points - R2,400 value), 20% off Cosmetic Procedures, Priority Booking, and Exclusive Member-Only Promotions.',
      },
      {
        id: 'l4',
        question: 'Do my points expire?',
        answer: 'Your points remain valid as long as you visit us at least once within a 12-month period. We\'ll send you a reminder email before your points are due to expire. Active members never lose their points!',
      },
      {
        id: 'l5',
        question: 'Can I transfer my points to family members?',
        answer: 'Points are non-transferable and linked to your individual account. However, family members can each have their own loyalty accounts and earn their own rewards!',
      },
    ],
    services: [
      {
        id: 's1',
        question: 'What dental services do you offer?',
        answer: 'We offer comprehensive dental care including: General Dentistry (checkups, cleanings, fillings), Cosmetic Dentistry (whitening, veneers, bonding), Restorative Dentistry (crowns, bridges, implants), Orthodontics (braces, Invisalign), Periodontics (gum disease treatment), and 24/7 Emergency Dental Services.',
      },
      {
        id: 's2',
        question: 'Do you provide emergency dental care?',
        answer: 'Yes! We provide 24/7 emergency dental services. Call us immediately at 046 603 1234 for severe toothaches, knocked-out teeth, broken teeth, or any dental emergency. We offer same-day emergency appointments and are always here when you need us most.',
      },
      {
        id: 's3',
        question: 'How long does teeth whitening take?',
        answer: 'Our professional in-office teeth whitening takes just 60 minutes! You\'ll see dramatic results immediately - your teeth can be up to 8 shades brighter. Results last 1-3 years with proper care. We also offer take-home kits for gradual whitening over 2 weeks.',
      },
      {
        id: 's4',
        question: 'Are dental implants painful?',
        answer: 'The procedure is done under local anesthesia, so you won\'t feel pain during treatment. Most patients report minimal discomfort afterward - less than a tooth extraction. We use modern techniques and provide detailed aftercare instructions. The 98% success rate and lifetime durability make implants worth it!',
      },
      {
        id: 's5',
        question: 'What\'s the difference between braces and Invisalign?',
        answer: 'Traditional braces (R50,000-R80,000) use metal or ceramic brackets, are visible, fixed in place, and most effective for complex cases. Invisalign (R80,000-R100,000) uses clear removable aligners, is nearly invisible, removable for eating/cleaning, and works great for most alignment issues. Both achieve excellent results!',
      },
    ],
    pricing: [
      {
        id: 'p1',
        question: 'How much do your services cost?',
        answer: 'Our pricing (in South African Rand): Preventive - Checkup R1,600, Cleaning R2,400, Fluoride R1,000. Restorative - Fillings R4,000, Crowns R24,000-R40,000, Root Canal R16,000. Cosmetic - Whitening R8,000, Veneers R24,000-R60,000. Major - Implants R70,000-R100,000, Braces R50,000-R80,000. All prices include materials and follow-up visits.',
      },
      {
        id: 'p2',
        question: 'Do you accept medical aid?',
        answer: 'Yes! We accept most major South African medical aid schemes including Discovery Health, Bonitas, Momentum Health, Fedhealth, GEMS, and Medihelp. We submit claims directly to your medical aid and can verify your coverage before treatment. Most medical aids cover 100% of preventive care.',
      },
      {
        id: 'p3',
        question: 'What payment options are available?',
        answer: 'We offer flexible payment options: Medical Aid (direct claim submission), Cash/Card (all major cards accepted), Payment Plans (0% interest financing for qualified patients, R0 down payment, low monthly installments), CareCredit (healthcare credit line), and Cash Discounts (ask about our cash payment specials).',
      },
      {
        id: 'p4',
        question: 'Do you offer payment plans?',
        answer: 'Absolutely! We understand dental care is an investment. We offer interest-free payment plans for treatments over R6,000. No down payment required for approved patients. Spread payments over 6-24 months. Quick approval process. Ask our team about financing options during your consultation.',
      },
      {
        id: 'p5',
        question: 'Are consultations free?',
        answer: 'Your first consultation is FREE for new patients! This includes a comprehensive oral examination, discussion of your dental goals, treatment plan recommendations, and cost estimates. No obligation to proceed with treatment. Emergency consultations are R3,000 but credited toward treatment if you proceed.',
      },
    ],
    booking: [
      {
        id: 'b1',
        question: 'How do I book an appointment?',
        answer: 'Booking is easy! Online: Click "Book Appointment" on our website anytime 24/7. Phone: Call us at 046 603 1234 during business hours. Email: Send a request to info@makhandasmiles.co.za. Walk-In: Visit us at High Street, Grahamstown. Same-day appointments often available!',
      },
      {
        id: 'b2',
        question: 'What are your office hours?',
        answer: 'Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM, Sunday: Closed. Emergency Services: 24/7 (call 046 603 1234 anytime). We offer early morning and late afternoon slots for working professionals. Saturday appointments fill up quickly - book in advance!',
      },
      {
        id: 'b3',
        question: 'Can I cancel or reschedule my appointment?',
        answer: 'Yes, but please give us at least 24 hours notice to avoid cancellation fees. To cancel/reschedule: Call us at 046 603 1234, Email info@makhandasmiles.co.za, or use our online booking system. Last-minute cancellations (under 24 hours) may incur a R300 fee. Emergencies are exceptions.',
      },
      {
        id: 'b4',
        question: 'How long will my appointment take?',
        answer: 'Appointment times vary by service: Checkup - 30 minutes, Cleaning - 45 minutes, Whitening - 60 minutes, Fillings - 60 minutes, Root Canal - 90 minutes, Consultation - 30 minutes. We always run on time and respect your schedule. Complex procedures may require multiple visits.',
      },
      {
        id: 'b5',
        question: 'What should I bring to my first appointment?',
        answer: 'Please bring: Photo ID, Medical aid card (if applicable), List of current medications, Previous dental records (if available), Completed patient forms (download from our website or arrive 10 minutes early). New patients receive a comprehensive exam, X-rays, cleaning, and treatment plan for R1,600 (regular R2,400).',
      },
    ],
    general: [
      {
        id: 'g1',
        question: 'Where are you located?',
        answer: 'Makhanda Smiles is located at High Street, Grahamstown, Makhanda, 6139, Eastern Cape, South Africa. We\'re in the heart of Grahamstown, near Rhodes University. Street parking is available. Our facility is wheelchair accessible. Directions: Use GPS or call us at 046 603 1234 for detailed directions.',
      },
      {
        id: 'g2',
        question: 'Do you treat children?',
        answer: 'Yes! We welcome patients of all ages, including children. Our Paediatric Dentistry services include: Child-friendly environment, Gentle approach, First dental visit (recommended at age 1), Preventive care (cleanings, fluoride, sealants), Education on proper brushing, and Parent can stay with child during treatment. We make dentistry fun for kids!',
      },
      {
        id: 'g3',
        question: 'What safety measures do you have in place?',
        answer: 'Your safety is our priority! We follow strict protocols: Sterilization of all instruments, Disposable items used when possible, PPE worn by all staff, Social distancing in waiting areas, Regular sanitization of surfaces, State-of-the-art equipment, and Trained infection control officer. We exceed South African dental safety standards.',
      },
      {
        id: 'g4',
        question: 'Do you use modern technology?',
        answer: 'Absolutely! We invest in the latest dental technology: Digital X-Rays (90% less radiation), Intraoral Cameras (see what we see), Laser Dentistry (pain-free procedures), CAD/CAM (same-day crowns), 3D Imaging, and Electronic records. Modern technology means better results, less pain, and faster treatment!',
      },
      {
        id: 'g5',
        question: 'How do I contact you?',
        answer: 'We\'re here to help! Phone: 046 603 1234 (Mon-Fri 8AM-5PM, Sat 9AM-1PM, Emergency 24/7), Email: info@makhandasmiles.co.za (respond within 24 hours), Live Chat: Available on our website, or Visit Us: High Street, Grahamstown. Follow us on social media for updates and dental tips!',
      },
    ],
  };

  const filteredFaqs = searchTerm
    ? Object.entries(faqs).reduce((acc: typeof faqs, [category, questions]) => {
        const filtered = questions.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) {
          (acc as any)[category] = filtered;
        }
        return acc;
      }, {} as typeof faqs)
    : faqs;

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#6B9BD1] to-[#B794F6] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 uppercase"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Everything you need to know about our services, pricing, loyalty program, and more
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setOpenCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
                      openCategory === category.id
                        ? 'bg-[#B794F6] text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions & Answers */}
            <div className="lg:col-span-3">
              {searchTerm && Object.keys(filteredFaqs).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 mb-4">No results found for "{searchTerm}"</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-[#B794F6] font-semibold hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {(searchTerm ? Object.entries(filteredFaqs) : [[openCategory, faqs[openCategory as keyof typeof faqs]]]).map(
                    (entry) => {
                      const [categoryKey, questions] = entry as [string, any];
                      return (
                      <div key={categoryKey}>
                        {searchTerm && (
                          <h2 className="text-2xl font-bold mb-4 uppercase">
                            {categories.find((c) => c.id === categoryKey)?.name}
                          </h2>
                        )}
                        {questions.map((faq: any, index: number) => (
                          <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm overflow-hidden mb-4"
                          >
                            <button
                              onClick={() => toggleQuestion(faq.id)}
                              className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
                              <ChevronDown
                                className={`flex-shrink-0 text-[#B794F6] transition-transform ${
                                  openQuestion === faq.id ? 'transform rotate-180' : ''
                                }`}
                                size={24}
                              />
                            </button>
                            <AnimatePresence>
                              {openQuestion === faq.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                    {faq.answer}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 uppercase">Still Have Questions?</h2>
            <p className="text-xl text-gray-600">Our friendly team is here to help!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#6B9BD1] text-white p-8 rounded-2xl text-center">
              <Phone className="mx-auto mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="mb-4">Mon-Fri: 8AM-5PM<br />Sat: 9AM-1PM</p>
              <a href="tel:+27466031234" className="font-bold text-lg">046 603 1234</a>
            </div>

            <div className="bg-[#B794F6] text-white p-8 rounded-2xl text-center">
              <Mail className="mx-auto mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="mb-4">Response within 24 hours</p>
              <a href="mailto:info@makhandasmiles.co.za" className="font-bold">info@makhandasmiles.co.za</a>
            </div>

            <div className="bg-[#1E293B] text-white p-8 rounded-2xl text-center">
              <MapPin className="mx-auto mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="mb-4">High Street, Grahamstown<br />Makhanda, 6139</p>
              <Link to="/contact" className="font-bold">Get Directions</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to Book Your Appointment?"
        description="Join our loyalty program and start earning rewards today!"
        primaryText="Book Now"
        primaryLink="/booking"
        theme="gradient"
      />
    </div>
  );
};

export default FAQPage;
