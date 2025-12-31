import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { Play } from 'lucide-react';
import { useState } from 'react';

interface VideoSectionProps {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  description?: string;
}

export const VideoSection = ({
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  posterUrl,
  title,
  description,
}: VideoSectionProps) => {
  const { ref, isInView } = useInView({ threshold: 0.3, triggerOnce: true });
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          {title}
        </motion.h2>
      )}
      
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-gray-600 text-center mb-8 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl"
      >
        {!isPlaying && posterUrl ? (
          <div className="relative group cursor-pointer" onClick={() => setIsPlaying(true)}>
            <img src={posterUrl} alt="Video thumbnail" className="w-full h-auto" />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center"
              >
                <Play size={32} className="text-dental-primary ml-1" />
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="aspect-video">
            <iframe
              src={videoUrl}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Background video component
export const BackgroundVideo = ({ videoUrl, overlay = true }: { videoUrl: string; overlay?: boolean }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute min-w-full min-h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      {overlay && <div className="absolute inset-0 bg-black bg-opacity-50" />}
    </div>
  );
};
