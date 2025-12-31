import { motion } from 'framer-motion';
import { Zap, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DemoModeBanner = () => {
  const { demoMode, disableDemoMode } = useAuth();

  if (!demoMode) return null;

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={18} />
          <span className="font-semibold text-sm">
            Demo Mode Active - Exploring features without login
          </span>
        </div>
        <button
          onClick={disableDemoMode}
          className="flex items-center gap-1 px-3 py-1 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition text-sm"
        >
          <X size={16} />
          Exit Demo
        </button>
      </div>
    </motion.div>
  );
};

export default DemoModeBanner;
