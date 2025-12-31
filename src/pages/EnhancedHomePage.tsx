import { Link } from 'react-router-dom';
import { Calendar, Shield, Clock, Award, Star, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { AnimatedText, TypewriterText } from '../components/AnimatedText';
import { ParallaxSection } from '../components/ParallaxSection';
import { VideoSection } from '../components/VideoSection';
import { useInView } from '../hooks/useInView';

const EnhancedHomePage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const features = [
    {
      icon: Calendar,
      title: 'Easy Online Booking',
      description: 'Book appointments 24/7 with our automated scheduling system',
    },
    {
      icon: Shield,
      title: 'Advanced Technology',
      description: 'State-of-the-art equipment for precise and comfortable treatments',
    },
    {
      icon: Clock,
      title: 'Flexible Hours',
      description: 'Evening and weekend appointments available for your convenience',
    },
    {
      icon: Award,
      title: 'Expert Dentists',
      description: 'Highly qualified professionals with years of experience',
    },
  ];

  const services = [
    {
      name: 'General Dentistry',
      description: 'Comprehensive oral health care and preventive treatments',
      image: '',
      price: 'From R1,600',
    },
    {
      name: 'Cosmetic Dentistry',
      description: 'Transform your smile with whitening, veneers, and more',
      image: '',
      price: 'From R6,000',
    },
    {
      name: 'Orthodontics',
      description: 'Straighten teeth with braces or clear aligners',
      image: '',
      price: 'From R50,000',
    },
    {
      name: 'Emergency Care',
      description: '24/7 emergency dental services when you need them most',
      image: '',
      price: 'Call Now',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'The online booking system made scheduling so easy! The staff is incredibly professional and caring.',
      service: 'Teeth Whitening',
    },
    {
      name: 'Michael Chen',
      rating: 5,
      comment: 'Best dental experience ever. The technology they use is amazing and the results are fantastic!',
      service: 'Dental Implants',
    },
    {
      name: 'Emily Rodriguez',
      rating: 5,
      comment: 'Finally found a dentist that makes me feel comfortable. Highly recommend SmileCare!',
      service: 'General Checkup',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Patients' },
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Awards Won' },
    { number: '24/7', label: 'Emergency Care' },
  ];

  const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
    const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });
    const Icon = feature.icon;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
      >
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 bg-gradient-to-br from-dental-primary to-dental-secondary rounded-2xl flex items-center justify-center mb-6"
        >
          <Icon className="text-white" size={32} />
        </motion.div>
        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </motion.div>
    );
  };

  const ServiceCard = ({ service, index }: { service: any; index: number }) => {
    const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.05 }}
        className="card group cursor-pointer"
      >
        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{service.image}</div>
        <h3 className="text-2xl font-semibold mb-3">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-dental-primary font-semibold text-lg">{service.price}</span>
          <motion.div whileHover={{ x: 5 }}>
            <ArrowRight className="text-dental-primary" />
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Video Background */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute min-w-full min-h-full object-cover"
          >
            <source src="https://player.vimeo.com/external/424495668.hd.mp4?s=8ae0fb1f7d4e6f7f1b5b6e8e1e7e8e8e&profile_id=174" type="video/mp4" />
            <source src="https://cdn.pixabay.com/vimeo/391962059/dental-38991.mp4?width=1280&hash=bcd8f3f71c3d3f3f3f3f3f3f3f3f3f3f3f3f" type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-dental-primary/90 via-dental-secondary/85 to-dental-accent/90" />
        </div>
        
        {/* Animated pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <TypewriterText
                  text="Your Perfect Smile"
                  className="text-5xl md:text-7xl font-bold mb-4"
                  speed={100}
                />
              </motion.div>

              <AnimatedText
                text="Starts Here"
                className="text-5xl md:text-7xl font-bold mb-6 text-dental-light"
                type="fadeUp"
                delay={1.5}
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2 }}
                className="text-xl mb-4 text-blue-50"
              >
                Modern dental care in the heart of Grahamstown, Makhanda. Expert treatment with automated scheduling and AI assistance.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.2 }}
                className="flex items-center gap-3 mb-8 text-white"
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a href="tel:+27466031234" className="font-semibold">046 603 1234</a>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Grahamstown, Makhanda</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/booking"
                    className="bg-white text-dental-primary hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
                  >
                    <Calendar size={20} />
                    <span>Book Appointment</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/services"
                    className="border-2 border-white text-white hover:bg-white hover:text-dental-primary font-semibold py-4 px-8 rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2"
                  >
                    <span>Our Services</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats with animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.6 }}
                className="grid grid-cols-4 gap-4 mt-12"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold">{stat.number}</div>
                    <div className="text-sm text-purple-100">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative"
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10"
              >
                <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
                  <div className="aspect-square bg-gradient-to-br from-white to-dental-light rounded-2xl flex items-center justify-center">
                    <svg className="w-48 h-48 text-dental-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-10 -right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-xl"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-dental-light bg-opacity-10 rounded-full blur-xl"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          >
            <motion.div className="w-1 h-2 bg-white rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section with parallax */}
      <ParallaxSection speed={0.3} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Why Choose SmileCare?"
            className="section-title text-center"
            type="scale"
          />
          <AnimatedText
            text="Experience modern dentistry with compassion and care"
            className="section-subtitle text-center"
            type="fadeUp"
            delay={0.2}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Video Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VideoSection
            title="See Our Practice in Action"
            description="Take a virtual tour of our state-of-the-art facility and meet our friendly team"
            videoUrl="https://www.youtube.com/embed/5YdbKEjNRxE"
            posterUrl="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800"
          />
        </div>
      </section>

      {/* Services Section with stagger animation */}
      <ParallaxSection speed={0.2} className="py-20 bg-gradient-to-br from-dental-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Our Services"
            className="section-title text-center"
            type="wave"
          />
          <AnimatedText
            text="Comprehensive dental care for all your needs"
            className="section-subtitle text-center"
            type="slideIn"
            delay={0.5}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-12"
          >
            <Link to="/services" className="btn-primary inline-block">
              View All Services
              <ArrowRight className="inline ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Testimonials with parallax cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="What Our Patients Say"
            className="section-title text-center"
            type="scale"
          />
          <AnimatedText
            text="Real stories from real patients"
            className="section-subtitle text-center"
            type="fadeUp"
            delay={0.2}
          />

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 50, rotate: -5 }}
                  animate={isInView ? { opacity: 1, y: 0, rotate: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10, rotate: 2 }}
                  className="card"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current" size={20} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.service}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Procedure Video Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VideoSection
            title="Understanding Your Treatment"
            description="Watch how our advanced procedures work and what to expect during your visit"
            videoUrl="https://www.youtube.com/embed/2TLcXRBxu1I"
            posterUrl="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800"
          />
        </div>
      </section>

      {/* CTA Section with animated background */}
      <section className="relative py-20 overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 bg-gradient-to-br from-dental-primary via-dental-secondary to-dental-accent"
          style={{ backgroundSize: '200% 200%' }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <AnimatedText
            text="Ready to Transform Your Smile?"
            className="text-4xl md:text-5xl font-bold mb-6"
            type="scale"
          />
          <AnimatedText
            text="Book your appointment today and experience the SmileCare difference"
            className="text-xl mb-8"
            type="fadeUp"
            delay={0.3}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/booking"
              className="btn-primary bg-white text-dental-primary hover:bg-gray-100 text-xl px-12 py-4 inline-flex items-center"
            >
              <Calendar className="mr-3" size={24} />
              Book Your Appointment
            </Link>
          </motion.div>

          {/* Floating shapes */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-10 left-10 w-20 h-20 border-4 border-white border-opacity-30 rounded-full"
          />
          <motion.div
            animate={{
              y: [0, 30, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-10 right-10 w-32 h-32 border-4 border-white border-opacity-30 rounded-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default EnhancedHomePage;
