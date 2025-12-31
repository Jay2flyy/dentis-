import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Phone, ArrowRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryText?: string;
  primaryLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
  theme?: 'gradient' | 'light' | 'dark';
}

export const CTASection = ({
  title = "Ready to Transform Your Smile?",
  description = "Book your appointment today and take the first step towards a healthier, brighter smile",
  primaryText = "Book Appointment",
  primaryLink = "/booking",
  secondaryText = "Call Us Now",
  secondaryLink = "tel:+1234567890",
  theme = 'gradient',
}: CTASectionProps) => {
  const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });

  const themes = {
    gradient: {
      bg: 'bg-gradient-to-br from-dental-primary via-dental-secondary to-dental-accent',
      text: 'text-white',
      btnPrimary: 'bg-white text-dental-primary hover:bg-gray-100',
      btnSecondary: 'border-white text-white hover:bg-white hover:text-dental-primary',
    },
    light: {
      bg: 'bg-dental-light',
      text: 'text-gray-900',
      btnPrimary: 'bg-dental-primary text-white hover:bg-dental-dark',
      btnSecondary: 'border-dental-primary text-dental-primary hover:bg-dental-primary hover:text-white',
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      btnPrimary: 'bg-dental-primary text-white hover:bg-dental-dark',
      btnSecondary: 'border-white text-white hover:bg-white hover:text-gray-900',
    },
  };

  const currentTheme = themes[theme];

  return (
    <section ref={ref} className={`relative py-20 overflow-hidden ${currentTheme.bg}`}>
      {/* Animated background elements */}
      {theme === 'gradient' && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-10 left-10 w-32 h-32 border-4 border-white border-opacity-20 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-10 right-10 w-40 h-40 border-4 border-white border-opacity-20 rounded-lg"
          />
        </>
      )}

      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 ${currentTheme.text}`}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl mb-8 opacity-90"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={primaryLink}
              className={`btn-primary ${currentTheme.btnPrimary} inline-flex items-center justify-center px-8 py-4 text-lg`}
            >
              <Calendar className="mr-2" size={24} />
              {primaryText}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a
              href={secondaryLink}
              className={`btn-secondary ${currentTheme.btnSecondary} inline-flex items-center justify-center px-8 py-4 text-lg`}
            >
              <Phone className="mr-2" size={24} />
              {secondaryText}
            </a>
          </motion.div>
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-sm opacity-75"
        >
          <p>Or chat with us instantly using our AI assistant ↘️</p>
        </motion.div>
      </div>
    </section>
  );
};

// Simple inline CTA
export const InlineCTA = ({ text = "Schedule Your Free Consultation" }: { text?: string }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-r from-dental-primary to-dental-secondary p-8 rounded-2xl text-white text-center my-8"
    >
      <h3 className="text-2xl font-bold mb-4">{text}</h3>
      <Link
        to="/booking"
        className="inline-flex items-center bg-white text-dental-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        Book Now
        <ArrowRight className="ml-2" size={20} />
      </Link>
    </motion.div>
  );
};
