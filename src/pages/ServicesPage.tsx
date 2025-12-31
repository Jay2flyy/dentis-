import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ServicesPage = () => {
  const featuredServices = [
    {
      title: 'Teeth Whitening',
      icon: '',
      description: 'Get a brighter smile in just 60 minutes with our professional whitening',
      price: 'From R2,500',
      link: '/services/teeth-whitening',
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600',
    },
    {
      title: 'Dental Implants',
      icon: '',
      description: 'Permanent tooth replacement that lasts a lifetime',
      price: 'From R12,000',
      link: '/services/dental-implants',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600',
    },
    {
      title: 'General Dentistry',
      icon: '',
      description: 'Comprehensive care for your whole family',
      price: 'From R1,600',
      link: '/services/general-dentistry',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600',
    },
    {
      title: 'Orthodontics',
      icon: '',
      description: 'Straighten your smile with braces or Invisalign',
      price: 'From R18,000',
      link: '/services/orthodontics',
      image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600',
    },
  ];

  const services = [
    {
      category: 'General Dentistry',
      icon: '',
      description: 'Comprehensive oral health care for the whole family',
      link: '/services/general-dentistry',
      items: [
        { name: 'Dental Checkups', price: 'R1,600-R2,400', duration: '30 min' },
        { name: 'Teeth Cleaning', price: 'R2,400-R4,000', duration: '45 min' },
        { name: 'Fluoride Treatment', price: 'R1,000-R1,600', duration: '20 min' },
        { name: 'Dental X-Rays', price: 'R1,000-R2,000', duration: '15 min' },
      ],
    },
    {
      category: 'Cosmetic Dentistry',
      icon: '',
      description: 'Enhance your smile with our aesthetic treatments',
      link: '/services/teeth-whitening',
      items: [
        { name: 'Teeth Whitening', price: 'R6,000-R8,000', duration: '60 min' },
        { name: 'Porcelain Veneers', price: 'R6,000-R15,000', duration: '90 min' },
        { name: 'Dental Bonding', price: 'R2,000-R4,000', duration: '45 min' },
        { name: 'Smile Makeover', price: 'Custom', duration: 'Multiple visits' },
      ],
    },
    {
      category: 'Restorative Dentistry',
      icon: '',
      description: 'Restore function and appearance of damaged teeth',
      link: '/services/dental-implants',
      items: [
        { name: 'Dental Fillings', price: 'R4,000-R8,000', duration: '45 min' },
        { name: 'Dental Crowns', price: 'R24,000-R40,000', duration: '90 min' },
        { name: 'Dental Bridges', price: 'R40,000-R80,000', duration: 'Multiple visits' },
        { name: 'Dental Implants', price: 'R70,000-R100,000', duration: 'Multiple visits' },
      ],
    },
    {
      category: 'Orthodontics',
      icon: '',
      description: 'Straighten your teeth for a perfect smile',
      link: '/services/orthodontics',
      items: [
        { name: 'Traditional Braces', price: 'R50,000-R80,000', duration: '12-24 months' },
        { name: 'Clear Aligners', price: 'R80,000-R100,000', duration: '12-18 months' },
        { name: 'Retainers', price: 'R6,000-R8,000', duration: 'Ongoing' },
        { name: 'Orthodontic Consultation', price: 'Free', duration: '30 min' },
      ],
    },
    {
      category: 'Periodontics',
      icon: '',
      description: 'Gum disease prevention and treatment',
      items: [
        { name: 'Deep Cleaning (Scaling)', price: 'R4,000-R8,000', duration: '60 min' },
        { name: 'Gum Grafting', price: 'R10,000-R14,000', duration: '90 min' },
        { name: 'Periodontal Maintenance', price: 'R4,000-R8,000', duration: '45 min' },
        { name: 'Gingivitis Treatment', price: 'R4,000-R10,000', duration: '60 min' },
      ],
    },
    {
      category: 'Emergency Services',
      icon: '',
      description: '24/7 emergency dental care when you need it',
      items: [
        { name: 'Emergency Exam', price: 'R3,000-R6,000', duration: '30 min' },
        { name: 'Tooth Extraction', price: 'R4,000-R10,000', duration: '45 min' },
        { name: 'Root Canal Therapy', price: 'R16,000-R32,000', duration: '90 min' },
        { name: 'Pain Management', price: 'R2,000-R6,000', duration: '30 min' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-dental-primary to-dental-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-blue-50 max-w-2xl mx-auto">
              Comprehensive dental care with advanced technology and expert professionals
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Services</h2>
            <p className="text-gray-600 text-lg">Explore our most popular treatments</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={service.link} className="card group hover:shadow-2xl transition-all block">
                  <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-dental-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-dental-primary font-bold">{service.price}</span>
                    <span className="text-dental-primary group-hover:translate-x-2 transition-transform">
                      <ArrowRight size={20} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Complete Service List</h2>
            <p className="text-gray-600 text-lg">Comprehensive dental care for every need</p>
          </div>
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-dental-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{service.category}</h2>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </div>
                  {service.link && (
                    <Link 
                      to={service.link}
                      className="btn-primary text-sm whitespace-nowrap"
                    >
                      Learn More
                    </Link>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {service.items.map((item, idx) => (
                    <div key={idx} className="card hover:scale-105">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <span className="text-dental-primary font-bold">{item.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">Duration: {item.duration}</p>
                      <Link
                        to="/booking"
                        className="text-dental-primary hover:text-dental-dark font-medium text-sm inline-flex items-center"
                      >
                        Book Now <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Services?</h2>
            <p className="text-gray-600 text-lg">Quality care you can trust</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              'Advanced Technology & Equipment',
              'Experienced & Certified Dentists',
              'Comfortable & Modern Facilities',
              'Flexible Payment Options',
              'Insurance Accepted',
              'Same-Day Appointments Available',
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="text-dental-primary flex-shrink-0 mt-1" size={24} />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-dental-primary to-dental-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-50">
            Book your appointment online or call us today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="btn-primary bg-white text-dental-primary hover:bg-gray-100">
              Book Appointment
            </Link>
            <a href="tel:+1234567890" className="btn-secondary border-white text-white hover:bg-white hover:text-dental-primary">
              Call: (123) 456-7890
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
