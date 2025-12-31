import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, CheckCircle, Star, Award } from 'lucide-react';
import { BeforeAfterSlider } from '../../components/BeforeAfterSlider';
import { CTASection, InlineCTA } from '../../components/CTASection';
import { AnimatedText } from '../../components/AnimatedText';
import { useInView } from '../../hooks/useInView';

const TeethWhiteningPage = () => {
  const beforeAfterImages = [
    {
      before: '/before and after.png',
      after: '/teeth whitening.png',
      title: 'Professional In-Office Whitening',
      description: '8 shades brighter in just 60 minutes',
    },
    {
      before: '/dental-before-after.png',
      after: '/Smile-makeover-4.8.25-scaled.png',
      title: 'Smile Transformation',
      description: 'Dramatic results with our advanced whitening system',
    },
    {
      before: '/veneers-before-and-after.png',
      after: '/before-after-6-2024-port-1.webp',
      title: 'Confident Smile',
      description: 'Long-lasting whitening that stays bright',
    },
  ];

  const benefits = [
    'Up to 8 shades whiter in one visit',
    'Safe, professional-grade whitening',
    'No sensitivity with our advanced formula',
    'Results last 1-3 years with proper care',
    'FDA-approved whitening agents',
    'Customized treatment for your needs',
  ];

  const faqs = [
    {
      question: 'How long does teeth whitening last?',
      answer: 'Professional teeth whitening results typically last 1-3 years with proper care, including regular brushing, avoiding staining foods, and touch-up treatments as needed.',
    },
    {
      question: 'Will it cause sensitivity?',
      answer: 'Our advanced whitening system is designed to minimize sensitivity. We use desensitizing agents and can adjust the treatment if you experience any discomfort.',
    },
    {
      question: 'How white will my teeth get?',
      answer: 'Most patients see 4-8 shades whiter. Results vary based on your natural tooth color and lifestyle habits. We\'ll show you expected results during your consultation.',
    },
    {
      question: 'Is it safe?',
      answer: 'Yes! Professional teeth whitening is completely safe when performed by a dentist. We use FDA-approved whitening agents and monitor the entire process.',
    },
  ];

  const FAQItem = ({ faq, index }: { faq: any; index: number }) => {
    const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });
    return (
      <motion.div
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
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#B794F6] to-[#9B7FD6] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Star className="text-yellow-300 fill-current" size={24} />
                  <span className="text-lg">Most Popular Service</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Professional Teeth Whitening
                </h1>
                <p className="text-xl mb-8 text-blue-50">
                  Get a brighter, more confident smile in just one visit. Our advanced whitening system delivers dramatic results safely and comfortably.
                </p>
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <Clock size={24} />
                    <div>
                      <div className="text-sm opacity-75">Duration</div>
                      <div className="font-semibold">60 Minutes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={24} />
                    <div>
                      <div className="text-sm opacity-75">Investment</div>
                      <div className="font-semibold">R2,500</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={24} />
                    <div>
                      <div className="text-sm opacity-75">Results</div>
                      <div className="font-semibold">Same Day</div>
                    </div>
                  </div>
                </div>
                <Link to="/booking" className="btn-primary bg-white text-dental-primary hover:bg-gray-100 inline-block">
                  Book Your Whitening
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <img
                src="/teeth whitening.png"
                alt="Teeth Whitening"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before & After Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Real Patient Transformations"
            className="section-title text-center"
            type="scale"
          />
          <AnimatedText
            text="See the dramatic results our patients have achieved"
            className="section-subtitle text-center"
            type="fadeUp"
            delay={0.2}
          />
          <BeforeAfterSlider images={beforeAfterImages} />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="How It Works"
            className="section-title text-center"
            type="fadeUp"
          />
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                step: 1,
                title: 'Consultation & Preparation',
                description: 'We examine your teeth, discuss your goals, and prepare your gums for whitening.',
              },
              {
                step: 2,
                title: 'Whitening Application',
                description: 'Professional-grade whitening gel is applied to your teeth. Our advanced LED light activates the formula.',
              },
              {
                step: 3,
                title: 'Reveal Your Brighter Smile',
                description: 'After 60 minutes, see immediate results! We provide aftercare instructions and a take-home kit.',
              },
            ].map((item, index) => {
              const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="card text-center"
                >
                  <div className="w-16 h-16 bg-dental-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <InlineCTA text="Ready for a Brighter Smile? Book Your Whitening Today!" />

      {/* Benefits */}
      <section className="py-20 bg-dental-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Why Choose Professional Whitening?"
            className="section-title text-center"
            type="wave"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {benefits.map((benefit, index) => {
              const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3 bg-white p-6 rounded-xl shadow-sm"
                >
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                  <span className="text-gray-800 font-medium">{benefit}</span>
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
            text="Frequently Asked Questions"
            className="section-title text-center"
            type="scale"
          />
          <div className="space-y-6 mt-12">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection
        title="Transform Your Smile Today"
        description="Book your professional teeth whitening and see results in just 60 minutes"
        primaryText="Book Whitening Now"
        primaryLink="/booking"
        theme="gradient"
      />
    </div>
  );
};

export default TeethWhiteningPage;
