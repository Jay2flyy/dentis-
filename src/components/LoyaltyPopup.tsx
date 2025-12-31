import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoyaltyPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem('hasSeenLoyaltyPopup');
    
    if (!hasSeenPopup) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);

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
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
          >
            <div className="relative bg-gradient-to-br from-[#B794F6] to-[#9B7FD6] rounded-3xl shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -ml-20 -mb-20" />
              
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all z-10"
              >
                <X className="text-white" size={20} />
              </button>

              <div className="relative p-8 text-white">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Gift className="text-white" size={40} />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl md:text-4xl font-bold text-center mb-4 uppercase"
                >
                  Get FREE Teeth Whitening!
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg text-center mb-6 text-white/90"
                >
                  Sign up for our NEW Loyalty Points System and get rewarded for EVERY visit to the dentist
                </motion.p>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 mb-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Star className="text-yellow-300 fill-current flex-shrink-0" size={20} />
                      <span className="font-semibold">FREE Teeth Whitening (Worth R2,500)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="text-yellow-300 fill-current flex-shrink-0" size={20} />
                      <span className="font-semibold">FREE Teeth Cleaning (Worth R800)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkles className="text-yellow-300 flex-shrink-0" size={20} />
                      <span className="font-semibold">Earn Points on Every Visit</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkles className="text-yellow-300 flex-shrink-0" size={20} />
                      <span className="font-semibold">Exclusive Discounts for Members</span>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-3"
                >
                  <Link
                    to="/booking"
                    onClick={handleSignUp}
                    className="block w-full bg-white text-[#B794F6] py-4 rounded-full font-bold text-center hover:bg-gray-100 transition-colors text-lg"
                  >
                    Sign Up Now - It's FREE!
                  </Link>
                  <Link
                    to="/faq"
                    onClick={handleSignUp}
                    className="block w-full bg-transparent border-2 border-white text-white py-4 rounded-full font-bold text-center hover:bg-white hover:text-[#B794F6] transition-all"
                  >
                    Learn More
                  </Link>
                </motion.div>

                {/* Small print */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center text-sm text-white/70 mt-4"
                >
                  Limited time offer • Terms and conditions apply
                </motion.p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoyaltyPopup;
