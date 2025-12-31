import { motion } from 'framer-motion';
import { Star, Quote, Calendar, Heart } from 'lucide-react';
import { BeforeAfterSlider, BeforeAfterComparison } from '../components/BeforeAfterSlider';
import { CTASection } from '../components/CTASection';
import { AnimatedText } from '../components/AnimatedText';
import { useInView } from '../hooks/useInView';
import { useState } from 'react';

const TransformationsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Transformations' },
    { id: 'whitening', name: 'Teeth Whitening' },
    { id: 'implants', name: 'Dental Implants' },
    { id: 'braces', name: 'Orthodontics' },
    { id: 'veneers', name: 'Veneers' },
    { id: 'crowns', name: 'Crowns & Bridges' },
  ];

  const transformations = [
    {
      id: 1,
      category: 'whitening',
      before: '/before and after.png',
      after: '/teeth whitening.png',
      title: 'Professional Whitening Transformation',
      service: 'Teeth Whitening',
      patient: {
        name: 'Sarah Johnson',
        age: 32,
        rating: 5,
        review: 'I\'ve always been self-conscious about my smile. After just one whitening session at SmileCare, my teeth are 8 shades whiter! The results are incredible and the whole process was painless. I can\'t stop smiling now!',
        date: '2 months ago',
      },
    },
    {
      id: 2,
      category: 'implants',
      before: '/dental-before-after.png',
      after: '/Cosmetic-23.png',
      title: 'Complete Smile Restoration',
      service: 'Dental Implants',
      patient: {
        name: 'Michael Chen',
        age: 45,
        rating: 5,
        review: 'After losing my front tooth in an accident, I was devastated. Dr. Smith and the team at SmileCare gave me my confidence back with a dental implant. You can\'t even tell it\'s not my natural tooth! Best decision ever.',
        date: '6 months ago',
      },
    },
    {
      id: 3,
      category: 'veneers',
      before: '/veneers-before-and-after.png',
      after: '/veneers.png',
      title: 'Porcelain Veneers Smile Makeover',
      service: 'Porcelain Veneers',
      patient: {
        name: 'Emily Rodriguez',
        age: 28,
        rating: 5,
        review: 'I\'ve had gaps and discolored teeth my whole life. Getting veneers at SmileCare completely transformed my smile! The process was easier than I expected, and the results are stunning. I feel like a new person!',
        date: '4 months ago',
      },
    },
    {
      id: 4,
      category: 'braces',
      before: '/before and after.png',
      after: '/before-after-6-2024-port-1.webp',
      title: 'Invisalign Clear Aligner Success',
      service: 'Invisalign',
      patient: {
        name: 'David Thompson',
        age: 35,
        rating: 5,
        review: 'As an adult, I didn\'t want metal braces. Invisalign was perfect - barely noticeable and my teeth are perfectly straight now after 14 months. The SmileCare team made the whole journey smooth and comfortable.',
        date: '1 year ago',
      },
    },
    {
      id: 5,
      category: 'crowns',
      before: '/dental-before-after.png',
      after: '/crowns.png',
      title: 'Crown and Bridge Restoration',
      service: 'Dental Crowns',
      patient: {
        name: 'Lisa Martinez',
        age: 52,
        rating: 5,
        review: 'I needed multiple crowns and was worried about the cost and pain. SmileCare worked with my insurance, offered financing, and made the process comfortable. My teeth look and feel amazing - like I have my natural smile back!',
        date: '3 months ago',
      },
    },
    {
      id: 6,
      category: 'whitening',
      before: '/veneers-before-and-after.png',
      after: '/Smile-makeover-4.8.25-scaled.png',
      title: 'Dramatic Whitening Results',
      service: 'In-Office Whitening',
      patient: {
        name: 'James Wilson',
        age: 41,
        rating: 5,
        review: 'Years of coffee and wine had stained my teeth badly. The professional whitening at SmileCare reversed all that damage in just one hour! My wife says I look 10 years younger. Worth every penny!',
        date: '2 weeks ago',
      },
    },
  ];

  const filteredTransformations = selectedCategory === 'all'
    ? transformations
    : transformations.filter(t => t.category === selectedCategory);

  const stats = [
    { number: '5,000+', label: 'Smile Transformations' },
    { number: '4.9/5', label: 'Average Rating' },
    { number: '98%', label: 'Patient Satisfaction' },
    { number: '15+', label: 'Years of Excellence' },
  ];

  const TransformationCard = ({ transformation, index }: { transformation: any; index: number }) => {
    const { ref, isInView } = useInView({ threshold: 0.2, triggerOnce: true });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="card"
      >
        {/* Before/After Images */}
        <BeforeAfterComparison
          before={transformation.before}
          after={transformation.after}
          title={transformation.title}
        />

        {/* Service Badge */}
        <div className="mt-6 mb-4">
          <span className="bg-dental-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
            {transformation.service}
          </span>
        </div>

        {/* Review */}
        <div className="border-t pt-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-dental-primary to-dental-secondary rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {transformation.patient.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{transformation.patient.name}</h3>
                <span className="text-gray-500 text-sm">• {transformation.patient.age} years old</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(transformation.patient.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={16} />
                ))}
                <span className="text-sm text-gray-500 ml-2">{transformation.patient.date}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <Quote className="absolute -top-2 -left-2 text-dental-primary opacity-20" size={32} />
            <p className="text-gray-700 italic pl-6">{transformation.patient.review}</p>
          </div>
        </div>

        {/* Verified Badge */}
        <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
          <Heart className="fill-current" size={16} />
          <span className="font-semibold">Verified Patient</span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#6B9BD1] via-[#B794F6] to-[#9B7FD6] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Real Transformations,<br />Real Stories
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-50 max-w-3xl mx-auto">
              See how our patients have transformed their smiles and changed their lives at SmileCare Dental
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20"
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-sm text-purple-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-20 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-2 py-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-dental-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Transformations Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text={`${filteredTransformations.length} Amazing Transformations`}
            className="text-3xl font-bold text-center mb-12"
            type="scale"
          />

          <div className="grid md:grid-cols-2 gap-8">
            {filteredTransformations.map((transformation, index) => (
              <TransformationCard key={transformation.id} transformation={transformation} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Watch Patient Stories"
            className="section-title text-center"
            type="wave"
          />
          <AnimatedText
            text="Hear directly from our patients about their transformation journey"
            className="section-subtitle text-center"
            type="fadeUp"
            delay={0.2}
          />

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {[
              { id: 'mLFDp5_ksVQ', title: 'Patient Smile Transformation Story' },
              { id: 'Z-xZKp5p8Rk', title: 'Before and After Dental Makeover' },
            ].map((video, index) => {
              const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="aspect-video rounded-2xl overflow-hidden shadow-xl bg-gray-900"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Your Transformation Starts Here"
        description="Join thousands of happy patients who've transformed their smiles at SmileCare"
        primaryText="Start Your Journey"
        primaryLink="/booking"
        secondaryText="Call (123) 456-7890"
        secondaryLink="tel:+1234567890"
        theme="gradient"
      />
    </div>
  );
};

export default TransformationsPage;
