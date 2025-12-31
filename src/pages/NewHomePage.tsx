import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const NewHomePage = () => {
  const ServiceCard = ({ title, description, color, link }: any) => {
    const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });
    
    const colorClasses = {
      blue: 'bg-[#6B9BD1] text-white',
      white: 'bg-white text-gray-900 border-2 border-gray-200',
      purple: 'bg-[#B794F6] text-white',
      green: 'bg-[#7FD99A] text-gray-900',
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className={`${colorClasses[color as keyof typeof colorClasses]} p-8 rounded-2xl hover:scale-105 transition-transform duration-300`}
      >
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="mb-6 opacity-90">{description}</p>
        <Link 
          to={link}
          className="inline-flex items-center gap-2 font-semibold hover:gap-4 transition-all"
        >
          Learn More
          <ArrowRight size={20} />
        </Link>
      </motion.div>
    );
  };

  const TreatmentCard = ({ title, description, icon }: any) => {
    return (
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-colors">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-lg font-bold">{title}</h4>
          <ArrowRight className="text-gray-400" size={20} />
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/heroImage.webp"
            alt="Dental Care"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 md:pt-32 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6"
          >
            <p className="text-sm font-semibold tracking-[0.25em] uppercase text-teal-300">
              Trusted dental care in Makhanda
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-white drop-shadow-2xl">
              Trusted dental care
              <br className="hidden md:block" />
              for your whole family
            </h1>
            <p className="text-base md:text-lg text-gray-200 max-w-xl">
              Expert healthcare for your smile in Grahamstown, Makhanda
            </p>
            <p className="text-sm md:text-base text-gray-300 flex items-center gap-2">
              <Phone size={20} /> 046 603 1234 | Available 24/7 for emergencies
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center justify-center bg-white text-gray-900 px-8 py-3 rounded-full font-semibold text-base md:text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Book Appointment
            </Link>
          </motion.div>
        </div>

        {/* Service Cards Row */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid md:grid-cols-4 gap-6">
            <ServiceCard
              title="GENERAL DENTISTRY"
              description="Comprehensive oral health care for the entire family"
              color="blue"
              link="/services/general-dentistry"
            />
            <ServiceCard
              title="COSMETIC DENTISTRY"
              description="Transform your smile with advanced aesthetic treatments"
              color="white"
              link="/services/teeth-whitening"
            />
            <ServiceCard
              title="PAEDIATRIC DENTISTRY"
              description="Gentle and caring dental care for children"
              color="purple"
              link="/services/general-dentistry"
            />
            <ServiceCard
              title="EMERGENCY DENTISTRY"
              description="Available 24/7 for urgent dental care needs"
              color="green"
              link="/booking"
            />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-semibold tracking-[0.25em] uppercase text-dental-primary mb-3">
                Our experience
              </p>
              <h2 className="section-title">
                Over 15 years of
                <br className="hidden md:block" />
                trusted dental care
              </h2>
              <p className="text-gray-600 text-base md:text-lg mb-6">
                Providing exceptional dental care to the Grahamstown community with state-of-the-art technology and compassionate service.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-dental-primary font-bold hover:gap-4 transition-all">
                Learn About Us
                <ArrowRight size={20} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="/Cosmetic-23.png"
                alt="Dental Experience"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Treatments */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#B794F6] to-[#9B7FD6] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-white">Featured treatments</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TreatmentCard
              title="DENTAL HYGIENE"
              description="Dental hygiene service involves teaching people how to keep their teeth"
            />
            <TreatmentCard
              title="DENTAL FILLINGS"
              description="Dental fillings restore cavities and maintain tooth structure integrity"
            />
            <TreatmentCard
              title="DENTAL CROWNS"
              description="Dental crowns cover damaged teeth and restore both form and function"
            />
            <TreatmentCard
              title="TEETH WHITENING"
              description="Teeth whitening lightens teeth and removes stains for a brighter smile"
            />
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="section-title mb-0">Our success stories</h2>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-gray-900 text-white rounded-full font-semibold">Overall</button>
              <button className="px-6 py-2 bg-white text-gray-900 rounded-full font-semibold border-2 border-gray-200">Whitening</button>
              <button className="px-6 py-2 bg-white text-gray-900 rounded-full font-semibold border-2 border-gray-200">Smile</button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              '/before and after.png',
              '/dental-before-after.png',
              '/before-after-6-2024-port-1.webp',
              '/veneers-before-and-after.png',
              '/Smile-makeover-4.8.25-scaled.png',
              '/teeth whitening.png',
            ].map((imageSrc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="aspect-square rounded-2xl overflow-hidden bg-gray-200 hover:scale-105 transition-transform"
              >
                <img
                  src={imageSrc}
                  alt={`Success Story ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-6 md:p-8 bg-[#E9D7FE] rounded-2xl">
            <p className="text-lg md:text-xl font-semibold text-[#6B21A8]">
              Be part of our service
            </p>
            <Link to="/booking" className="inline-flex items-center gap-2 mt-4 text-[#6B21A8] font-semibold hover:gap-4 transition-all text-base md:text-lg">
              Book Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Find Us Now */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-10 md:mb-12">Find us now</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gray-900 text-white p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold mb-4">GRAHAMSTOWN</h3>
              <p className="text-gray-300 mb-6">
                High Street, Grahamstown<br />
                Makhanda, 6139<br />
                Eastern Cape, South Africa
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Phone size={18} />
                  <span>046 603 1234</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>info@makhandasmiles.co.za</span>
                </div>
              </div>
              <Link
                to="/booking"
                className="inline-block w-full bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-center hover:bg-gray-100 transition-colors"
              >
                Book Your Visit
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-gray-100 p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold mb-4">OPENING HOURS</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold">Monday - Friday</span>
                  <span>8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Saturday</span>
                  <span>9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Sunday</span>
                  <span>Closed</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-300">
                  <span className="font-semibold">Emergency</span>
                  <span className="text-green-600 font-bold">24/7</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-purple-500 text-white p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-bold mb-4">GET IN TOUCH</h3>
              <p className="mb-6">
                Have questions? Our friendly team is here to help you with any inquiries about our services.
              </p>
              <Link
                to="/contact"
                className="inline-block w-full bg-white text-purple-900 px-6 py-3 rounded-full font-bold text-center hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewHomePage;
