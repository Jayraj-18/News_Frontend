import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

export const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await credential.user.getIdToken();

      // Store the Firebase ID token used by protected API requests.
      sessionStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('adminToken', idToken);

      // Trigger parent callback to enter CMS
      onLoginSuccess();
    } catch (err) {
      console.error('Login error:', err);
      setError(
        'चुकीचा ईमेल किंवा पासवर्ड. कृपया पुन्हा प्रयत्न करा.\n(Invalid email or password. Please try again.)'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-4 sm:p-8">
      <div className="bg-white rounded-2xl p-6 sm:p-10 w-full max-w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] animate-[slideUp_0.4s_ease]">
        
        {/* LOGO SECTION */}
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">📰</span>
          <h1 className="text-2xl font-extrabold text-red-600 m-0">
            पालघर दृष्टी
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            पत्रकार सीएमएस (Journalist CMS)
          </p>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">
          अ‍ॅडमिन लॉगिन (Admin Login)
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          पुढे जाण्यासाठी कृपया लॉगिन करा.
        </p>

        {/* ERROR BANNER */}
        {error && (
          <div className="flex gap-2.5 items-start bg-red-50 border border-red-300 border-l-4 border-l-red-600 rounded-md p-3 mb-5 text-sm text-red-800 whitespace-pre-line" role="alert">
            <span>⚠️</span>
            <p className="m-0 leading-relaxed">{error}</p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700">
              ईमेल (Email)
            </label>
            <div className="flex items-center border-[1.5px] border-gray-300 rounded-lg bg-gray-50 focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-600/10 focus-within:bg-white transition-all overflow-hidden">
              <span className="px-3 text-base text-gray-400 shrink-0">✉️</span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@palghardrushti.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 border-none outline-none bg-transparent py-2.5 pr-3 text-sm text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-gray-700">
              पासवर्ड (Password)
            </label>
            <div className="flex items-center border-[1.5px] border-gray-300 rounded-lg bg-gray-50 focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-600/10 focus-within:bg-white transition-all overflow-hidden">
              <span className="px-3 text-base text-gray-400 shrink-0">🔒</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex-1 border-none outline-none bg-transparent py-2.5 text-sm text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                className="bg-transparent border-none cursor-pointer px-3 text-base text-gray-400 hover:text-red-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`mt-2 py-3 bg-red-600 text-white border-none rounded-lg text-base font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700 cursor-pointer'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block animate-spin text-xl">⟳</span>
            ) : (
              '🚀 लॉगिन करा (Login)'
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-gray-400">
          © 2026 Maharashtra News 24 · केवळ अधिकृत पत्रकारांसाठी
        </p>
      </div>
    </main>
  );
};