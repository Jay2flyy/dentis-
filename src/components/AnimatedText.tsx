import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  type?: 'fadeUp' | 'slideIn' | 'scale' | 'wave';
}

export const AnimatedText = ({ text, className = '', delay = 0, type = 'fadeUp' }: AnimatedTextProps) => {
  const { ref, isInView } = useInView({ threshold: 0.5, triggerOnce: true });

  const variants = {
    fadeUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
    },
    slideIn: {
      hidden: { opacity: 0, x: -100 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    wave: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  };

  // For word-by-word animation
  const words = text.split(' ');

  if (type === 'wave') {
    return (
      <motion.div ref={ref} className={className}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={variants.wave}
            transition={{
              duration: 0.3,
              delay: delay + i * 0.1,
            }}
            className="inline-block mr-2"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[type]}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {text}
    </motion.div>
  );
};

// Typewriter effect component
export const TypewriterText = ({ text, className = '', speed = 50 }: { text: string; className?: string; speed?: number }) => {
  const { ref, isInView } = useInView({ threshold: 0.5, triggerOnce: true });

  return (
    <motion.div ref={ref} className={className}>
      {isInView && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {text.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0,
                delay: i * (speed / 1000),
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      )}
    </motion.div>
  );
};
