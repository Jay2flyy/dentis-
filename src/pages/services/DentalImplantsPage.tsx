import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, CheckCircle, Award, Shield } from 'lucide-react';
import { BeforeAfterSlider } from '../../components/BeforeAfterSlider';
import { CTASection, InlineCTA } from '../../components/CTASection';
import { AnimatedText } from '../../components/AnimatedText';
import { useInView } from '../../hooks/useInView';

const DentalImplantsPage = () => {
  const beforeAfterImages = [
    {
      before: '/before and after.png',
      after: '/Cosmetic-23.png',
      title: 'Single Tooth Implant',
      description: 'Natural-looking replacement that lasts a lifetime',
    },
    {
      before: '/dental-before-after.png',
      after: '/Smile-makeover-4.8.25-scaled.png',
      title: 'Multiple Tooth Replacement',
      description: 'Restored function and beautiful smile',
    },
    {
      before: '/veneers-before-and-after.png',
      after: '/before-after-6-2024-port-1.webp',
      title: 'Full Arch Restoration',
      description: 'Complete smile transformation with implants',
    },
  ];

  const benefits = [
    'Looks and feels like natural teeth',
    '98% success rate',
    'Lasts a lifetime with proper care',
    'Prevents bone loss in jaw',
    'No damage to adjacent teeth',
    'Eat and speak normally',
    'Boost confidence and self-esteem',
    'No messy adhesives like dentures',
  ];

  const process = [
    {
      step: 1,
      title: 'Consultation & Planning',
      description: '3D imaging and CT scans to plan your implant placement. We discuss your goals and create a custom treatment plan.',
      duration: '60 min',
    },
    {
      step: 2,
      title: 'Implant Placement',
      description: 'Titanium post is surgically placed into your jawbone. Done under local anesthesia for comfort.',
      duration: '1-2 hours',
    },
    {
      step: 3,
      title: 'Healing Period',
      description: 'Osseointegration occurs - the implant fuses with your bone. Temporary crown may be placed.',
      duration: '3-6 months',
    },
    {
      step: 4,
      title: 'Crown Placement',
      description: 'Custom-made crown is attached to the implant. Final adjustments for perfect fit and appearance.',
      duration: '1 hour',
    },
  ];

  const faqs = [
    {
      question: 'How long do dental implants last?',
      answer: 'With proper care, dental implants can last a lifetime. The titanium post integrates with your bone and becomes a permanent part of your jaw. The crown on top may need replacement after 10-15 years due to normal wear.',
    },
    {
      question: 'Is the procedure painful?',
      answer: 'Most patients report minimal discomfort. The procedure is done under local anesthesia, and many say it\'s less painful than a tooth extraction. We also offer sedation options for anxious patients.',
    },
    {
      question: 'Am I a candidate for implants?',
      answer: 'Most adults with good general health are candidates. You need adequate bone density and healthy gums. We\'ll evaluate your specific case during a consultation and may suggest bone grafting if needed.',
    },
    {
      question: 'How much do implants cost?',
      answer: 'Dental implants range from R40,000-R80,000 per tooth. While more expensive upfront than other options, they last longer and don\'t require replacement. Many insurance plans cover part of the cost, and we offer financing.',
    },
  ];

  const StepCard = ({ item, index }: { item: any; index: number }) => {
    const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="card"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-dental-primary text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {item.step}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-2">{item.description}</p>
            <div className="flex items-center gap-2 text-dental-primary text-sm font-semibold">
              <Clock size={16} />
              {item.duration}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1E293B] via-[#6B9BD1] to-[#B794F6] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="text-green-300" size={24} />
                  <span className="text-lg">Lifetime Solution</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Dental Implants
                </h1>
                <p className="text-xl mb-8 text-blue-50">
                  Permanent tooth replacement that looks, feels, and functions like natural teeth. Restore your confidence with our advanced implant technology.
                </p>
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <Award size={24} />
                    <div>
                      <div className="text-sm opacity-75">Success Rate</div>
                      <div className="font-semibold">98%+</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={24} />
                    <div>
                      <div className="text-sm opacity-75">From</div>
                      <div className="font-semibold">R12,000-R25,000</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={24} />
                    <div>
                      <div className="text-sm opacity-75">Timeline</div>
                      <div className="font-semibold">3-6 Months</div>
                    </div>
                  </div>
                </div>
                <Link to="/booking" className="btn-primary bg-white text-dental-primary hover:bg-gray-100 inline-block">
                  Schedule Consultation
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800"
                alt="Dental Implants"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Life-Changing Transformations"
            className="section-title text-center"
            type="scale"
          />
          <AnimatedText
            text="See how dental implants have restored smiles and changed lives"
            className="section-subtitle text-center"
            type="fadeUp"
            delay={0.2}
          />
          <BeforeAfterSlider images={beforeAfterImages} />
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Your Implant Journey"
            className="section-title text-center"
            type="wave"
          />
          <div className="space-y-6 mt-12">
            {process.map((item, index) => (
              <StepCard key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <InlineCTA text="Missing Teeth? Get Your Free Implant Consultation!" />

      {/* Benefits */}
      <section className="py-20 bg-dental-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Why Choose Dental Implants?"
            className="section-title text-center"
            type="scale"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {benefits.map((benefit, index) => {
              const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex items-start gap-3 bg-white p-6 rounded-xl shadow-sm"
                >
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-800">{benefit}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Common Questions"
            className="section-title text-center"
            type="fadeUp"
          />
          <div className="space-y-6 mt-12">
            {faqs.map((faq, index) => {
              const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card"
                >
                  <h3 className="text-xl font-semibold mb-3 text-dental-primary">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection
        title="Ready to Restore Your Smile?"
        description="Schedule your free consultation and discover if dental implants are right for you"
        primaryText="Book Free Consultation"
        primaryLink="/booking"
        theme="gradient"
      />
    </div>
  );
};

export default DentalImplantsPage;
