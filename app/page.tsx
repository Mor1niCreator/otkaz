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
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      
      {/* Hero Section */}
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Main Logo/Title */}
          <motion.h1
            className="text-7xl font-bold mb-4"
            style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontWeight: 900,
              color: '#000000',
              letterSpacing: '-0.04em',
            }}
          >
            ENOUGH
          </motion.h1>

          {/* Tagline */}
          <p 
            className="text-lg text-gray-600"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
            }}
          >
            Know When to Stop
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        >
          {/* Toggle Tabs */}
          <div className="flex gap-2 mb-8 bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
                isLogin 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
                !isLogin 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'register'}
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              )}
              
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />

              {!isLogin && (
                <>
                  <input
                    type="text"
                    placeholder="Referral Code (optional)"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {Object.entries(CURRENCIES).slice(0, 10).map(([code, data]) => (
                          <option key={code} value={code}>
                            {code} {data.symbol}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-3 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif" }}
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
                className="w-full py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {isLoading ? 'Loading...' : isLogin ? 'Continue' : 'Get Started'}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Info Pills */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            {[
              { icon: '✋', text: 'Say Enough' },
              { icon: '💎', text: 'Build Wealth' },
              { icon: '🎯', text: 'Reach Goals' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span className="mr-1">{item.icon}</span>
                {item.text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
