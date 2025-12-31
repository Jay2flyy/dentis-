import { Link } from 'react-router-dom';
import { Calendar, Shield, Clock, Award, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';



const HomePage = () => {

  
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
      image: '🦷',
      price: 'From R1,600',
    },
    {
      name: 'Cosmetic Dentistry',
      description: 'Transform your smile with whitening, veneers, and more',
      image: '✨',
      price: 'From R6,000',
    },
    {
      name: 'Orthodontics',
      description: 'Straighten teeth with braces or clear aligners',
      image: '😁',
      price: 'From R50,000',
    },
    {
      name: 'Emergency Care',
      description: '24/7 emergency dental services when you need them most',
      image: '🚨',
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dental-primary via-dental-secondary to-dental-accent text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your Perfect Smile
                <span className="block text-dental-light">Starts Here</span>
              </h1>
              <p className="text-xl mb-8 text-blue-50">
                Modern dental care with automated scheduling, AI assistance, and expert treatment.
                Book your appointment in seconds!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/booking" className="btn-primary bg-white text-dental-primary hover:bg-gray-100 text-center">
                  <Calendar className="inline mr-2" size={20} />
                  Book Appointment
                </Link>
                <Link to="/services" className="btn-secondary border-white text-white hover:bg-white hover:text-dental-primary text-center">
                  View Services
                  <ArrowRight className="inline ml-2" size={20} />
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-dental-primary"></div>
                  ))}
                </div>
                <div>
                  <div className="flex text-yellow-300">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-blue-50">Trusted by 10,000+ patients</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-300 rounded-full animate-float"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-dental-accent rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                <img
                  src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=600&fit=crop"
                  alt="Happy patient"
                  className="rounded-2xl shadow-2xl relative z-10"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-dental-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Why Choose SmileCare?</h2>
            <p className="section-subtitle">
              Experience the future of dental care with our modern approach
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card text-center hover:scale-105"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-dental-primary to-dental-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              Comprehensive dental care for all your needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group cursor-pointer"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {service.image}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-dental-primary font-semibold">{service.price}</span>
                  <ArrowRight className="text-dental-primary group-hover:translate-x-2 transition-transform" size={20} />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" className="btn-primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-dental-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">What Our Patients Say</h2>
            <p className="section-subtitle">
              Real stories from real people
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.service}</p>
                  </div>
                  <CheckCircle className="text-dental-primary" size={24} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-dental-primary to-dental-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Smile?
            </h2>
            <p className="text-xl mb-8 text-blue-50">
              Book your appointment online in less than 2 minutes. Our AI assistant is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking" className="btn-primary bg-white text-dental-primary hover:bg-gray-100">
                <Calendar className="inline mr-2" size={20} />
                Book Now
              </Link>
              <a href="tel:+1234567890" className="btn-secondary border-white text-white hover:bg-white hover:text-dental-primary">
                Call: (123) 456-7890
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
