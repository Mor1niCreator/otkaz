'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CURRENCIES } from '@/lib/currencies';

export default function HomePage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/calendar');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin
      ? { email, password }
      : { email, password, name, referralCode, currency, language };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/calendar');
      } else {
        alert(data.error || 'Error occurred');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#FAFAFA' }}>
      
      <div className="w-full max-w-md mx-auto">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1
            className="text-8xl font-black mb-3"
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontWeight: 900,
              color: '#212121',
              letterSpacing: '-0.05em',
              lineHeight: 1,
            }}
          >
            ENOUGH
          </h1>
          
          <div className="inline-block px-6 py-2 bg-yellow-500 rounded-full">
            <p 
              className="text-sm font-bold"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                color: '#212121',
                letterSpacing: '0.02em',
              }}
            >
              Know When to Stop
            </p>
          </div>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-3xl shadow-lg p-8"
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-gray-100 rounded-2xl p-1.5">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                isLogin 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              Sign In
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                !isLogin 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'register'}
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 10 : -10 }}
              transition={{ duration: 0.2 }}
            >
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-colors text-gray-900"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-colors text-gray-900"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-colors text-gray-900"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">
                      Referral Code <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="FRIEND123"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-colors text-gray-900"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">
                        Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-colors text-gray-900"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                      >
                        {Object.entries(CURRENCIES).slice(0, 10).map(([code, data]) => (
                          <option key={code} value={code}>
                            {code} {data.symbol}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">
                        Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-yellow-500 focus:outline-none transition-colors text-gray-900"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                      >
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-lg hover:shadow-xl"
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  background: '#FFC107',
                  color: '#212121',
                }}
              >
                {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Get Started'}
              </button>
            </motion.form>
          </AnimatePresence>
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 font-medium mb-4">Trusted by thousands worldwide</p>
          <div className="flex justify-center gap-8 text-gray-600">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">10k+</div>
              <div className="text-xs text-gray-500">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">$2M+</div>
              <div className="text-xs text-gray-500">Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4.9★</div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
