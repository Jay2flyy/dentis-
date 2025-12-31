import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoyaltyPopup from './components/LoyaltyPopup';
import DemoModeBanner from './components/DemoModeBanner';
import HomePage from './pages/NewHomePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import ComprehensivePatientDashboard from './pages/ComprehensivePatientDashboard';
import NewAdminDashboard from './pages/NewAdminDashboard';
import ComprehensiveAdminDashboard from './pages/ComprehensiveAdminDashboard';
import TransformationsPage from './pages/TransformationsPage';

// Service Pages
import TeethWhiteningPage from './pages/services/TeethWhiteningPage';
import DentalImplantsPage from './pages/services/DentalImplantsPage';
import GeneralDentistryPage from './pages/services/GeneralDentistryPage';
import OrthodonticsPage from './pages/services/OrthodonticsPage';

import { AuthProvider } from './contexts/AuthContext';
import { useLenisScroll } from './hooks/useLenisScroll';


function App() {
  // Enable smooth scrolling throughout the app
  useLenisScroll();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Toaster position="top-right" />
          <DemoModeBanner />
          <LoyaltyPopup />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/teeth-whitening" element={<TeethWhiteningPage />} />
              <Route path="/services/dental-implants" element={<DentalImplantsPage />} />
              <Route path="/services/general-dentistry" element={<GeneralDentistryPage />} />
              <Route path="/services/orthodontics" element={<OrthodonticsPage />} />
              <Route path="/transformations" element={<TransformationsPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/patient-portal" element={<ClientDashboard />} />
              <Route path="/patient-dashboard" element={<ComprehensivePatientDashboard />} />
              <Route path="/admin/dashboard" element={<NewAdminDashboard />} />
              <Route path="/admin/comprehensive" element={<ComprehensiveAdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
