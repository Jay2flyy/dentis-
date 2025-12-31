import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-dental-primary to-dental-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">MS</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-bold">Makhanda Smiles</h3>
                <p className="text-xs text-gray-400">Grahamstown Dental Care</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Quality dental care in Grahamstown, Makhanda. Modern technology with compassionate service. 
              Your smile is our priority.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-dental-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-dental-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-dental-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-sm hover:text-dental-primary transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-sm hover:text-dental-primary transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-dental-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-dental-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/patient-portal" className="text-sm hover:text-dental-primary transition-colors">
                  Patient Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-dental-primary mt-1 flex-shrink-0" />
                <span className="text-sm">High Street, Grahamstown<br />Makhanda, 6139<br />Eastern Cape, South Africa</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-dental-primary flex-shrink-0" />
                <a href="tel:+27466031234" className="text-sm hover:text-dental-primary transition-colors">
                  046 603 1234
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-dental-primary flex-shrink-0" />
                <a href="mailto:info@makhandasmiles.co.za" className="text-sm hover:text-dental-primary transition-colors">
                  info@makhandasmiles.co.za
                </a>
              </li>
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Office Hours</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-3">
                <Clock size={18} className="text-dental-primary mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 3:00 PM</p>
                  <p>Sunday: Closed</p>
                  <p className="mt-2 text-dental-primary font-semibold">Emergency: 24/7</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} Makhanda Smiles. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-dental-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-dental-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
