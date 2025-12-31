import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, CheckCircle, Smile } from 'lucide-react';
import { BeforeAfterSlider } from '../../components/BeforeAfterSlider';
import { CTASection, InlineCTA } from '../../components/CTASection';
import { AnimatedText } from '../../components/AnimatedText';
import { useInView } from '../../hooks/useInView';

const OrthodonticsPage = () => {
  const beforeAfterImages = [
    {
      before: '/before and after.png',
      after: '/before-after-6-2024-port-1.webp',
      title: 'Traditional Braces Success',
      description: 'Perfectly straight teeth in 24 months',
    },
    {
      before: '/dental-before-after.png',
      after: '/Smile-makeover-4.8.25-scaled.png',
      title: 'Invisalign Transformation',
      description: 'Clear aligners, beautiful results',
    },
    {
      before: '/veneers-before-and-after.png',
      after: '/teeth whitening.png',
      title: 'Confident Smile',
      description: 'Life-changing orthodontic treatment',
    },
  ];

  const options = [
    {
      name: 'Traditional Braces',
      description: 'Metal or ceramic brackets for comprehensive treatment',
      price: 'R18,000 - R40,000',
      duration: '18-36 months',
      pros: ['Most effective for complex cases', 'Proven results', 'Lower cost option'],
    },
    {
      name: 'Invisalign',
      description: 'Clear, removable aligners that are nearly invisible',
      price: 'R25,000 - R50,000',
      duration: '12-18 months',
      pros: ['Nearly invisible', 'Removable for eating', 'Comfortable', 'Easier to clean teeth'],
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-[#B794F6] to-[#9B7FD6] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Smile size={24} />
                <span className="text-lg">Straighten Your Smile</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Orthodontics</h1>
              <p className="text-xl mb-8 text-blue-50">
                Achieve the straight, confident smile you've always wanted with modern orthodontic solutions.
              </p>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock size={24} />
                  <div>
                    <div className="text-sm opacity-75">Treatment Time</div>
                    <div className="font-semibold">12-36 Months</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={24} />
                  <div>
                    <div className="text-sm opacity-75">From</div>
                    <div className="font-semibold">R6,000</div>
                  </div>
                </div>
              </div>
              <Link to="/booking" className="btn-primary bg-white text-dental-primary hover:bg-gray-100 inline-block">
                Free Consultation
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800"
                alt="Orthodontics"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Treatment Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText text="Choose Your Solution" className="section-title text-center" type="scale" />
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {options.map((option, index) => {
              const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="card"
                >
                  <h3 className="text-2xl font-bold mb-3 text-dental-primary">{option.name}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="flex justify-between items-center mb-6 pb-6 border-b">
                    <div>
                      <div className="text-sm text-gray-500">Investment</div>
                      <div className="text-xl font-semibold">{option.price}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="text-xl font-semibold">{option.duration}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {option.pros.map((pro, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText text="Amazing Transformations" className="section-title text-center" type="wave" />
          <BeforeAfterSlider images={beforeAfterImages} />
        </div>
      </section>

      <InlineCTA text="Ready for Straight Teeth? Get Your Free Consultation!" />

      <CTASection
        title="Start Your Orthodontic Journey"
        description="Free consultation to determine the best treatment plan for you"
        primaryText="Book Free Consultation"
        primaryLink="/booking"
        theme="gradient"
      />
    </div>
  );
};

export default OrthodonticsPage;
