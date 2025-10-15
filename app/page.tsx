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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-enough-yellow">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.1) 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Hero Section */}
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          {/* Main Logo/Title */}
          <motion.div
            className="relative inline-block mb-8"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="enough-text-large text-[clamp(4rem,15vw,10rem)] leading-none"
              style={{
                letterSpacing: '0.05em',
              }}
            >
              ENOUGH.
            </motion.h1>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block"
          >
            <div 
              className="px-8 py-4 bg-white text-black border-3 border-black"
              style={{
                boxShadow: '0 6px 0px rgba(0,0,0,0.3)',
              }}
            >
              <p 
                className="text-xl md:text-2xl font-black uppercase tracking-wide"
              >
                Enough to Change Your Life
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div 
            className="enough-panel"
          >
            {/* Toggle Tabs */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 font-black text-base uppercase tracking-wider bg-white text-black border-3 border-black transition-all
                  ${isLogin 
                    ? 'shadow-[0_4px_0px_rgba(0,0,0,0.3)]' 
                    : 'hover:shadow-[0_0_20px_rgba(245,198,26,0.6)] hover:bg-[rgba(245,198,26,0.1)]'
                  }`}
              >
                LOGIN
              </button>

              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 font-black text-base uppercase tracking-wider bg-white text-black border-3 border-black transition-all
                  ${!isLogin 
                    ? 'shadow-[0_4px_0px_rgba(0,0,0,0.3)]' 
                    : 'hover:shadow-[0_0_20px_rgba(245,198,26,0.6)] hover:bg-[rgba(245,198,26,0.1)]'
                  }`}
              >
                REGISTER
              </button>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'register'}
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                {!isLogin && (
                  <motion.input
                    type="text"
                    placeholder="YOUR NAME"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 text-base font-semibold uppercase placeholder:text-gray-400"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  />
                )}
                
                <input
                  type="email"
                  placeholder="EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-4 text-base font-semibold uppercase placeholder:text-gray-400"
                />
                
                <input
                  type="password"
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-6 py-4 text-base font-semibold uppercase placeholder:text-gray-400"
                />

                {!isLogin && (
                  <>
                    <motion.input
                      type="text"
                      placeholder="REFERRAL CODE (OPTIONAL)"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className="w-full px-6 py-4 text-base font-semibold uppercase placeholder:text-gray-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    />

                    <motion.div 
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div>
                        <label 
                          className="block text-xs font-black mb-2 uppercase tracking-wider"
                        >
                          Currency
                        </label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full px-4 py-4 text-sm font-semibold"
                        >
                          {Object.entries(CURRENCIES).slice(0, 10).map(([code, data]) => (
                            <option key={code} value={code}>
                              {code} {data.symbol}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label 
                          className="block text-xs font-black mb-2 uppercase tracking-wider"
                        >
                          Language
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-4 py-4 text-sm font-semibold"
                        >
                          <option value="en">English</option>
                          <option value="ru">Русский</option>
                        </select>
                      </div>
                    </motion.div>
                  </>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="enough-button-primary w-full py-5 text-xl text-black
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'LOADING...' : isLogin ? 'LET\'S GO' : 'START SAVING'}
                </button>
              </motion.form>
            </AnimatePresence>

            {/* Info Cards */}
            <motion.div 
              className="mt-8 grid grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { text: 'Say Enough', emoji: '✋' },
                { text: 'Build Wealth', emoji: '💎' },
                { text: 'Reach Goals', emoji: '🎯' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white text-black p-4 text-center border-3 border-black transition-all hover:shadow-[0_0_20px_rgba(245,198,26,0.6)] hover:bg-[rgba(245,198,26,0.08)]"
                  style={{
                    boxShadow: '0 3px 0px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <p className="text-xs font-black uppercase tracking-wide">
                    {item.text}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Text */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-black font-bold text-lg uppercase tracking-wider">
            Know When to Stop • Save Smart • Live Better
          </p>
        </motion.div>
      </div>
    </div>
  );
}
