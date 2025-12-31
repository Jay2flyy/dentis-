import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterImage {
  before: string;
  after: string;
  title: string;
  description?: string;
}

interface BeforeAfterSliderProps {
  images: BeforeAfterImage[];
}

export const BeforeAfterSlider = ({ images }: BeforeAfterSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setSliderPosition(50);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setSliderPosition(50);
  };

  const currentImage = images[currentIndex];

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
        {/* Before Image */}
        <div className="absolute inset-0">
          <img
            src={currentImage.before}
            alt={`${currentImage.title} - Before`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
            Before
          </div>
        </div>

        {/* After Image with Clip */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          <img
            src={currentImage.after}
            alt={`${currentImage.title} - After`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
            After
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute inset-y-0 w-1 bg-white cursor-ew-resize shadow-lg"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={(e) => {
            const handleMove = (moveEvent: MouseEvent) => {
              const rect = e.currentTarget.parentElement?.getBoundingClientRect();
              if (rect) {
                const x = moveEvent.clientX - rect.left;
                const percent = (x / rect.width) * 100;
                setSliderPosition(Math.max(0, Math.min(100, percent)));
              }
            };

            const handleUp = () => {
              document.removeEventListener('mousemove', handleMove);
              document.removeEventListener('mouseup', handleUp);
            };

            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleUp);
          }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
            <ChevronLeft size={16} className="text-gray-800 -ml-1" />
            <ChevronRight size={16} className="text-gray-800 -mr-1" />
          </div>
        </div>
      </div>

      {/* Image Info */}
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">{currentImage.title}</h3>
        {currentImage.description && (
          <p className="text-gray-600">{currentImage.description}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevImage}
          className="w-12 h-12 bg-dental-primary text-white rounded-full flex items-center justify-center hover:bg-dental-dark transition-colors"
        >
          <ChevronLeft size={24} />
        </motion.button>

        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setSliderPosition(50);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-dental-primary w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextImage}
          className="w-12 h-12 bg-dental-primary text-white rounded-full flex items-center justify-center hover:bg-dental-dark transition-colors"
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
    </div>
  );
};

// Simple before/after comparison (side by side)
export const BeforeAfterComparison = ({ before, after, title }: { before: string; after: string; title: string }) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-xl overflow-hidden shadow-lg"
      >
        <img src={before} alt="Before" className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
          Before
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative rounded-xl overflow-hidden shadow-lg"
      >
        <img src={after} alt="After" className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
          After
        </div>
      </motion.div>
      <div className="md:col-span-2 text-center">
        <p className="text-lg font-semibold text-gray-800">{title}</p>
      </div>
    </div>
  );
};
