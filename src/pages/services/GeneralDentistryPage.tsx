import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, Shield, Heart } from 'lucide-react';
import { BeforeAfterSlider } from '../../components/BeforeAfterSlider';
import { CTASection, InlineCTA } from '../../components/CTASection';
import { AnimatedText } from '../../components/AnimatedText';
import { useInView } from '../../hooks/useInView';

const GeneralDentistryPage = () => {
  const beforeAfterImages = [
    {
      before: '/before and after.png',
      after: '/Cosmetic-23.png',
      title: 'Comprehensive Dental Care',
      description: 'Healthy teeth and gums with regular checkups',
    },
    {
      before: '/dental-before-after.png',
      after: '/Smile-makeover-4.8.25-scaled.png',
      title: 'Preventive Care Results',
      description: 'Maintaining oral health through regular visits',
    },
  ];

  const services = [
    {
      title: 'Comprehensive Oral Exam',
      description: 'Thorough examination of teeth, gums, and overall oral health',
      price: 'R1,600',
      duration: '30 min',
    },
    {
      title: 'Professional Teeth Cleaning',
      description: 'Remove plaque, tartar, and stains for a healthier smile',
      price: 'R2,400',
      duration: '45 min',
    },
    {
      title: 'Digital X-Rays',
      description: '90% less radiation with instant, detailed images',
      price: 'R1,000',
      duration: '15 min',
    },
    {
      title: 'Fluoride Treatment',
      description: 'Strengthen enamel and prevent cavities',
      price: 'R1,000',
      duration: '15 min',
    },
    {
      title: 'Oral Cancer Screening',
      description: 'Early detection can save lives',
      price: 'Included',
      duration: '10 min',
    },
    {
      title: 'Gum Disease Treatment',
      description: 'Prevent and treat periodontal disease',
      price: 'From R4,000',
      duration: '60 min',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#6B9BD1] to-[#5A8AC0] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Heart className="text-red-300" size={24} />
                <span className="text-lg">Foundation of Good Oral Health</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">General Dentistry</h1>
              <p className="text-xl mb-8 text-blue-50">
                Comprehensive dental care for the whole family. Preventive services to keep your smile healthy and bright.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Shield size={24} />
                  <div>
                    <div className="text-sm opacity-75">Prevention First</div>
                    <div className="font-semibold">Stop Problems Early</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={24} />
                  <div>
                    <div className="text-sm opacity-75">Checkup</div>
                    <div className="font-semibold">R1,600</div>
                  </div>
                </div>
              </div>
              <Link to="/booking" className="btn-primary bg-white text-dental-primary hover:bg-gray-100 inline-block">
                Book Checkup
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800"
                alt="General Dentistry"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText text="Our Services" className="section-title text-center" type="scale" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {services.map((service, index) => {
              const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-3 text-dental-primary">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={16} />
                      {service.duration}
                    </div>
                    <div className="text-lg font-semibold text-dental-primary">{service.price}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <InlineCTA text="Schedule Your Checkup Today - Prevention is Key!" />

      {/* Before & After */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText text="Healthy Smiles" className="section-title text-center" type="wave" />
          <BeforeAfterSlider images={beforeAfterImages} />
        </div>
      </section>

      <CTASection
        title="Your Family's Dental Home"
        description="Comprehensive care for patients of all ages. Book your family checkup today!"
        primaryText="Book Appointment"
        primaryLink="/booking"
        theme="light"
      />
    </div>
  );
};

export default GeneralDentistryPage;
