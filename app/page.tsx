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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #FFE030 0%, #FF6B35 25%, #FF006E 50%, #8338EC 75%, #3A86FF 100%)',
    }}>
      {/* Comic halftone overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          opacity: 0.3,
        }}
      />
      
      {/* Hero Section */}
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center mb-12"
        >
          {/* Main Logo/Title */}
          <motion.div
            className="relative inline-block mb-6"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Explosion lines behind */}
            <div className="absolute inset-0 -z-10">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3"
                  style={{
                    height: '150px',
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'center center',
                    rotate: `${i * 18}deg`,
                    background: i % 2 === 0 ? 'linear-gradient(180deg, #FFE030 0%, transparent 100%)' : 'linear-gradient(180deg, #FF6B35 0%, transparent 100%)',
                    opacity: 0.4,
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: [0, 1, 0.9] }}
                  transition={{ 
                    duration: 1.2,
                    delay: i * 0.04,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                />
              ))}
            </div>

            <motion.h1
              className="text-8xl md:text-9xl font-black relative"
              style={{
                fontFamily: "'Bangers', 'Russo One', cursive",
                color: '#FFFFFF',
                WebkitTextStroke: '6px #000',
                paintOrder: 'stroke fill',
                filter: 'drop-shadow(8px 8px 0px rgba(0,0,0,0.8))',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transform: 'scaleY(1.2)',
              }}
              animate={{
                scale: [1, 1.03, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ENOUGH
            </motion.h1>

            {/* Floating emojis */}
            {['💰', '⚡', '🎯', '🚀'].map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute text-5xl"
                style={{
                  left: `${-10 + i * 40}%`,
                  top: `${-20 + (i % 2) * 140}%`,
                  filter: 'drop-shadow(3px 3px 0px #000)',
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="inline-block"
          >
            <div 
              className="px-8 py-3 rounded-full border-6 border-black relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE030 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: '8px 8px 0px #000',
                borderRadius: '30px 35px 32px 38px / 38px 30px 35px 32px',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_3s_ease-in-out_infinite]" />
              <p 
                className="text-xl md:text-2xl font-black relative z-10"
                style={{
                  fontFamily: "'Titan One', 'Russo One', cursive",
                  textShadow: '3px 3px 0px rgba(0,0,0,0.3)',
                  color: '#000',
                }}
              >
                Know When to Stop • Save Smart • Live Better 🌟
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
          className="max-w-md mx-auto"
        >
          <div 
            className="p-8 border-6 border-black relative"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 224, 48, 0.15) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '12px 12px 0px #000, 0 0 60px rgba(255, 224, 48, 0.6)',
              borderRadius: '35px 30px 40px 32px / 32px 40px 30px 35px',
            }}
          >
            {/* Inner glow */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 
                  'radial-gradient(circle at 30% 20%, rgba(255, 224, 48, 0.2) 0%, transparent 50%)',
                borderRadius: 'inherit',
              }}
            />

            {/* Toggle Tabs */}
            <div className="flex gap-3 mb-8 relative z-10">
              <motion.button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 rounded-2xl font-black text-lg border-6 border-black relative overflow-hidden
                  ${isLogin 
                    ? 'text-white shadow-comic-lg' 
                    : 'text-gray-700 shadow-comic'
                  }`}
                style={{
                  fontFamily: "'Titan One', 'Russo One', cursive",
                  background: isLogin ? 'linear-gradient(135deg, #FF6B35 0%, #FF006E 50%, #8338EC 100%)' : 'rgba(255, 255, 255, 0.8)',
                  textShadow: isLogin ? '3px 3px 0px rgba(0,0,0,0.6)' : 'none',
                  borderRadius: '22px 25px 23px 26px / 26px 22px 25px 23px',
                }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLogin && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_3s_infinite]" />
                )}
                <span className="relative z-10">LOGIN 🚀</span>
              </motion.button>

              <motion.button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 rounded-2xl font-black text-lg border-6 border-black relative overflow-hidden
                  ${!isLogin 
                    ? 'text-white shadow-comic-lg' 
                    : 'text-gray-700 shadow-comic'
                  }`}
                style={{
                  fontFamily: "'Titan One', 'Russo One', cursive",
                  background: !isLogin ? 'linear-gradient(135deg, #FFE030 0%, #FF6B35 50%, #FF006E 100%)' : 'rgba(255, 255, 255, 0.8)',
                  textShadow: !isLogin ? '3px 3px 0px rgba(0,0,0,0.6)' : 'none',
                  borderRadius: '25px 22px 26px 23px / 23px 26px 22px 25px',
                }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {!isLogin && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_3s_infinite]" />
                )}
                <span className="relative z-10">REGISTER ✨</span>
              </motion.button>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? 'login' : 'register'}
                onSubmit={handleSubmit}
                className="space-y-4 relative z-10"
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                {!isLogin && (
                  <motion.input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 text-lg border-5 border-black"
                    style={{
                      fontFamily: "'Chewy', 'Russo One', cursive",
                      borderRadius: '20px 22px 21px 23px / 23px 20px 22px 21px',
                      boxShadow: '4px 4px 0px #000',
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  />
                )}
                
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-4 text-lg border-5 border-black"
                  style={{
                    fontFamily: "'Chewy', 'Russo One', cursive",
                    borderRadius: '20px 22px 21px 23px / 23px 20px 22px 21px',
                    boxShadow: '4px 4px 0px #000',
                  }}
                />
                
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-6 py-4 text-lg border-5 border-black"
                  style={{
                    fontFamily: "'Chewy', 'Russo One', cursive",
                    borderRadius: '20px 22px 21px 23px / 23px 20px 22px 21px',
                    boxShadow: '4px 4px 0px #000',
                  }}
                />

                {!isLogin && (
                  <>
                    <motion.input
                      type="text"
                      placeholder="Referral Code (optional)"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className="w-full px-6 py-4 text-lg border-5 border-black"
                      style={{
                        fontFamily: "'Chewy', 'Russo One', cursive",
                        borderRadius: '20px 22px 21px 23px / 23px 20px 22px 21px',
                        boxShadow: '4px 4px 0px #000',
                      }}
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
                          className="block text-sm font-black mb-2 uppercase"
                          style={{ 
                            fontFamily: "'Lilita One', 'Russo One', cursive",
                            textShadow: '2px 2px 0px rgba(0,0,0,0.2)',
                          }}
                        >
                          💵 Currency
                        </label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full px-4 py-4 text-base border-5 border-black"
                          style={{
                            fontFamily: "'Chewy', 'Russo One', cursive",
                            borderRadius: '18px 20px 19px 21px / 21px 18px 20px 19px',
                            boxShadow: '4px 4px 0px #000',
                          }}
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
                          className="block text-sm font-black mb-2 uppercase"
                          style={{ 
                            fontFamily: "'Lilita One', 'Russo One', cursive",
                            textShadow: '2px 2px 0px rgba(0,0,0,0.2)',
                          }}
                        >
                          🌍 Language
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-4 py-4 text-base border-5 border-black"
                          style={{
                            fontFamily: "'Chewy', 'Russo One', cursive",
                            borderRadius: '18px 20px 19px 21px / 21px 18px 20px 19px',
                            boxShadow: '4px 4px 0px #000',
                          }}
                        >
                          <option value="en">🇬🇧 English</option>
                          <option value="ru">🇷🇺 Русский</option>
                        </select>
                      </div>
                    </motion.div>
                  </>
                )}

                <motion.button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-5 rounded-2xl text-2xl font-black border-6 border-black relative overflow-hidden
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "'Titan One', 'Russo One', cursive",
                    background: 'linear-gradient(135deg, #FFE030 0%, #FF6B35 50%, #FF006E 100%)',
                    boxShadow: '10px 10px 0px #000',
                    textShadow: '4px 4px 0px rgba(0,0,0,0.6)',
                    color: 'white',
                    borderRadius: '25px 28px 26px 30px / 30px 25px 28px 26px',
                  }}
                  whileHover={!isLoading ? { 
                    scale: 1.03, 
                    y: -5,
                    boxShadow: '14px 14px 0px #000'
                  } : {}}
                  whileTap={!isLoading ? { scale: 0.98, y: 2 } : {}}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shine_2s_ease-in-out_infinite]" />
                  <motion.span 
                    className="relative z-10"
                    animate={isLoading ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {isLoading ? '⏳ LOADING...' : isLogin ? '🚀 LET\'S GO!' : '✨ START SAVING!'}
                  </motion.span>
                </motion.button>
              </motion.form>
            </AnimatePresence>

            {/* Info Cards */}
            <motion.div 
              className="mt-8 grid grid-cols-3 gap-3 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { icon: '✋', text: 'Say Enough', color: '#FFE030', gradient: 'linear-gradient(135deg, #FFE030 0%, #FF6B35 100%)' },
                { icon: '💎', text: 'Build Wealth', color: '#FF006E', gradient: 'linear-gradient(135deg, #FF006E 0%, #8338EC 100%)' },
                { icon: '🎯', text: 'Reach Goals', color: '#3A86FF', gradient: 'linear-gradient(135deg, #06FFF0 0%, #3A86FF 100%)' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-4 border-5 border-black relative overflow-hidden"
                  style={{
                    background: item.gradient,
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px 22px 21px 23px / 23px 20px 22px 21px',
                    boxShadow: '6px 6px 0px #000',
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 1 + i * 0.1,
                    type: 'spring',
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.08, y: -6, rotate: 3 }}
                >
                  <div className="absolute inset-0 bg-white/20" />
                  <motion.div 
                    className="text-4xl mb-2"
                    style={{ filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.3))' }}
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {item.icon}
                  </motion.div>
                  <p 
                    className="text-xs font-black text-white uppercase"
                    style={{
                      fontFamily: "'Lilita One', 'Russo One', cursive",
                      textShadow: '2px 2px 0px rgba(0,0,0,0.4)',
                    }}
                  >
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => {
          const colors = ['#FFE030', '#FF6B35', '#FF006E', '#8338EC', '#06FFF0'];
          return (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full border-3 border-black"
              style={{
                left: `${5 + Math.random() * 90}%`,
                top: `${5 + Math.random() * 90}%`,
                background: colors[i % colors.length],
                boxShadow: '2px 2px 0px #000',
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
                rotate: [0, 360, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
