import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { useLenisScroll } from './hooks/useLenisScroll';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoyaltyPopup from './components/LoyaltyPopup';

// import ThandiVoiceAssistant from './components/ThandiVoiceAssistant';

// Pages
import NewHomePage from './pages/NewHomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import AdminLogin from './pages/AdminLogin';
import TransformationsPage from './pages/TransformationsPage';
import FAQPage from './pages/FAQPage';
import ComprehensivePatientDashboard from './pages/ComprehensivePatientDashboard';
import ComprehensiveAdminDashboard from './pages/ComprehensiveAdminDashboard';

function AppContent() {
  useLenisScroll();
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/admin');

  console.log('AppContent Rendering. Route:', location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans antialiased">
      <Toaster position="top-right" />

      {!isDashboard && <Navbar />}
      {!isDashboard && <LoyaltyPopup />}



      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<NewHomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/transformations" element={<TransformationsPage />} />
          <Route path="/faq" element={<FAQPage />} />

          <Route path="/dashboard" element={<ComprehensivePatientDashboard />} />
          <Route path="/admin" element={<ComprehensiveAdminDashboard />} />
        </Routes>
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
