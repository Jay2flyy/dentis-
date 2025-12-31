import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Transformations', path: '/transformations' },
    { name: 'FAQ', path: '/faq' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-lg sm:text-xl md:text-2xl font-semibold text-white drop-shadow-lg tracking-tight">
              Makhanda Smiles
            </span>
          </Link>

          {/* Desktop Navigation */}
          {/* Show full nav only from large screens up so it doesn't squash on small widths */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium leading-none transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-white font-bold border-b-2 border-white'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:+27466031234"
              className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
            >
              <Phone size={18} />
              <span className="text-xs md:text-sm font-medium whitespace-nowrap">
                046 603 1234
              </span>
            </a>
            
            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link to="/admin/dashboard" className="btn-secondary text-sm py-2 px-4">
                    Admin
                  </Link>
                )}
                <Link to="/patient-portal" className="flex items-center space-x-2 text-gray-700 hover:text-dental-primary">
                  <User size={18} />
                </Link>
                <button onClick={() => signOut()} className="text-sm text-gray-600 hover:text-gray-900">
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-white/80 font-semibold text-sm transition-colors">
                  Login
                </Link>
                <Link
                  to="/booking"
                  className="bg-white text-purple-600 px-5 py-2 rounded-full font-semibold text-sm md:text-base hover:shadow-lg transition-all hover:bg-purple-50 hover:scale-105 whitespace-nowrap"
                >
                  Book Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-purple-700 transition-colors text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-purple-500 bg-purple-700 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-purple-600 bg-white font-bold'
                    : 'text-white hover:bg-purple-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 px-4 space-y-3">
              <a
                href="tel:+27466031234"
                className="flex items-center space-x-2 text-white py-2"
              >
                <Phone size={18} />
                <span className="text-sm font-medium">046 603 1234</span>
              </a>
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block bg-white text-purple-600 text-sm py-3 text-center rounded-lg font-semibold hover:bg-purple-50"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/patient-portal"
                    onClick={() => setIsOpen(false)}
                    className="block bg-white text-purple-600 text-sm py-3 text-center rounded-lg font-semibold hover:bg-purple-50"
                  >
                    Patient Portal
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-sm text-white hover:text-white/80 py-2 font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block text-white hover:bg-purple-600 text-sm py-3 text-center rounded-lg font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/booking"
                    onClick={() => setIsOpen(false)}
                    className="block bg-white text-purple-600 text-sm py-3 text-center rounded-lg font-semibold hover:bg-purple-50"
                  >
                    Book Appointment
                  </Link>
                </>
              
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
