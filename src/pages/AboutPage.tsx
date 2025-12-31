import { Award, Users, Heart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { CTASection } from '../components/CTASection';

const AboutPage = () => {
  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Lead Dentist',
      specialty: 'Cosmetic & General Dentistry',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Orthodontist',
      specialty: 'Braces & Clear Aligners',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Periodontist',
      specialty: 'Gum Disease & Implants',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Patient-Centered Care',
      description: 'Your comfort and satisfaction are our top priorities',
    },
    {
      icon: Award,
      title: 'Excellence in Quality',
      description: 'Using the latest technology and best practices',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Highly qualified professionals dedicated to your smile',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Innovation',
      description: 'Always improving our services and technology',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-dental-primary to-dental-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">About SmileCare</h1>
            <p className="text-xl text-blue-50 max-w-3xl mx-auto">
              Transforming smiles and lives with compassionate care and cutting-edge technology since 2010
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  SmileCare Dental was founded in 2010 with a simple mission: to provide exceptional 
                  dental care in a comfortable, modern environment where patients feel like family.
                </p>
                <p>
                  Over the years, we've grown from a small practice to a leading dental care provider, 
                  serving over 10,000 patients and earning numerous awards for excellence in dentistry.
                </p>
                <p>
                  Today, we continue to invest in the latest technology and training to ensure our 
                  patients receive the best possible care. Our online booking system and AI-powered 
                  assistance make it easier than ever to maintain your oral health.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=600&fit=crop"
                alt="Dental office"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg">What drives us every day</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-dental-primary to-dental-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 text-lg">Expert professionals dedicated to your smile</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center hover:scale-105"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-dental-primary font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.specialty}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to Experience the SmileCare Difference?"
        description="Join our family of happy patients and start your journey to a healthier smile"
        primaryText="Book Your Visit"
        primaryLink="/booking"
        secondaryText="View Our Transformations"
        secondaryLink="/transformations"
        theme="gradient"
      />
    </div>
  );
};

export default AboutPage;
