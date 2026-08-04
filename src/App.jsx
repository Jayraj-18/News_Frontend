import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { NewsProvider } from "./context/NewsContext";
import { Header } from "./Components/common/Header";
import { HomePage } from "./Pages/HomePage";
import { ArticlePage } from "./Pages/ArticlePage";
import { AdminDashboard } from "./Components/admin/AdminDashboard";
import { AdminLogin } from "./Components/admin/AdminLogin";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import Disclaimer from "./Pages/Disclaimer";
import PrivacyPolicy from "./Pages/PrivacyPolicy";

// Protected Route — shows login if not authenticated
function AdminRoute() {
  const isAuthenticated = sessionStorage.getItem("admin_authenticated") === "true";
  const [authed, setAuthed] = React.useState(isAuthenticated);

  if (!authed) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          sessionStorage.setItem("admin_authenticated", "true");
          setAuthed(true);
        }}
      />
    );
  }

  return (
    <AdminDashboard
      onLogout={() => {
        sessionStorage.removeItem("admin_authenticated");
        setAuthed(false);
      }}
    />
  );
}

// Main shell component handling navigation layout
function MainContent() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header currentPath={currentPath} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage currentPath={currentPath} />} />
          <Route
            path="/category/:category"
            element={<HomePage key={currentPath} currentPath={currentPath} />}
          />
          <Route
            path="/article/:id"
            element={<ArticlePage key={currentPath} currentPath={currentPath} />}
          />
          <Route path="/admin" element={<AdminRoute />} />

          {/* Static Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Fallback route for undefined paths */}
          <Route path="*" element={<HomePage currentPath={currentPath} />} />
        </Routes>
      </main>

      {/* Tailwaind Refactored Footer */}
      <footer className="mt-auto bg-gray-950 text-gray-200 py-10 px-20 border-t-4 border-red-600 dark:border-red-700">
        <div className="container mx-auto px-20 flex flex-col items-center gap-5 text-center">
          <div className="space-y-1">
            <strong className="text-xl font-bold text-white block">
              महाराष्ट्र न्यूज 24
            </strong>
            <p className="text-sm text-gray-400">
              निष्पक्ष, निर्भीड आणि लोकाभिमुख पत्रकारिता.
            </p>
          </div>

          <nav
            className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-sm text-gray-300"
            aria-label="Footer Navigation"
          >
            <Link to="/" className="hover:text-red-500 transition-colors">
              मुख्य पृष्ठ
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/about" className="hover:text-red-500 transition-colors">
              आमच्याबद्दल
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/contact" className="hover:text-red-500 transition-colors">
              संपर्क
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/disclaimer" className="hover:text-red-500 transition-colors">
              अस्वीकरण
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/privacy" className="hover:text-red-500 transition-colors">
              गोपनीयता धोरण
            </Link>
          </nav>

          <nav className="empty:hidden" aria-label="Social Media Links">
            {/* Reserved for future social icons */}
          </nav>

          <p className="text-xs text-gray-400">
            © 2026 Maharashtra News 24. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <NewsProvider>
      <LanguageProvider>
        <Router>
          <MainContent />
        </Router>
      </LanguageProvider>
    </NewsProvider>
  );
}

export default App;