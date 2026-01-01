import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoyaltyPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the popup before
    // const hasSeenPopup = localStorage.getItem('hasSeenLoyaltyPopup');
    const hasSeenPopup = false; // FORCE SHOW FOR TESTING
    
    if (!hasSeenPopup) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000); // Reduced delay for faster testing

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenLoyaltyPopup', 'true');
  };

  const handleSignUp = () => {
    localStorage.setItem('hasSeenLoyaltyPopup', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-[250px]"
          >
            <div className="relative bg-gradient-to-br from-[#B794F6] to-[#9B7FD6] rounded-xl shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />
              
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all z-10"
              >
                <X className="text-white" size={12} />
              </button>

              <div className="relative p-2 text-white">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="w-8 h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-1"
                >
                  <Gift className="text-white" size={16} />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base font-bold text-center mb-0 uppercase leading-tight"
                >
                  Get FREE Teeth Whitening!
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-[10px] text-center mb-1.5 text-white/90 leading-snug"
                >
                  Sign up for our NEW Loyalty Points System & get rewarded!
                </motion.p>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-1.5 py-4 mb-1.5 min-h-[300px] flex flex-col justify-center"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Star className="text-yellow-300 fill-current flex-shrink-0" size={10} />
                      <span className="font-semibold text-[9px]">FREE Teeth Whitening (Worth R2,500)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="text-yellow-300 fill-current flex-shrink-0" size={10} />
                      <span className="font-semibold text-[9px]">FREE Teeth Cleaning (Worth R800)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="text-yellow-300 flex-shrink-0" size={10} />
                      <span className="font-semibold text-[9px]">Earn Points on Every Visit</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="text-yellow-300 flex-shrink-0" size={10} />
                      <span className="font-semibold text-[9px]">Exclusive Discounts for Members</span>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-1"
                >
                  <Link
                    to="/booking"
                    onClick={handleSignUp}
                    className="block w-full bg-white text-[#B794F6] py-1 rounded-full font-bold text-center hover:bg-gray-100 transition-colors text-[10px]"
                  >
                    Sign Up Now - It's FREE!
                  </Link>
                  <Link
                    to="/faq"
                    onClick={handleSignUp}
                    className="block w-full bg-transparent border border-white text-white py-1 rounded-full font-bold text-center hover:bg-white hover:text-[#B794F6] transition-all text-[10px]"
                  >
                    Learn More
                  </Link>
                </motion.div>

                {/* Small print */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center text-[8px] text-white/60 mt-1"
                >
                  Limited time offer • T&Cs apply
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoyaltyPopup;
