'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/calendar');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-comic-yellow rounded-full opacity-20 animate-float" 
          style={{ animationDelay: '0s', animationDuration: '4s' }} />
        <div className="absolute top-40 right-20 w-24 h-24 bg-comic-pink rounded-full opacity-20 animate-float" 
          style={{ animationDelay: '1s', animationDuration: '5s' }} />
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-comic-cyan rounded-full opacity-20 animate-float" 
          style={{ animationDelay: '2s', animationDuration: '6s' }} />
        <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-comic-lime rounded-full opacity-20 animate-float" 
          style={{ animationDelay: '1.5s', animationDuration: '4.5s' }} />
      </div>

      <div className="comic-panel max-w-md w-full relative z-10 explosion-lines">
        <div className="text-center mb-8 relative">
          {/* Hero title with comic effect */}
          <div className="relative inline-block mb-4">
            <h1 className="text-6xl font-black mb-2 relative z-10"
              style={{
                background: 'linear-gradient(135deg, #FF006E 0%, #FF6B35 50%, #FFE030 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(4px 4px 0px #000)',
                letterSpacing: '0.05em',
              }}>
              💰 ОТКАЗНИК
            </h1>
            {/* Burst lines behind title */}
            <div className="absolute inset-0 -z-10">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 bg-black opacity-20"
                  style={{
                    height: '100px',
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${i * 30}deg)`,
                    transformOrigin: 'center',
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-2xl font-bold bg-comic-yellow px-6 py-2 rounded-full border-4 border-black inline-block shadow-comic"
            style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>
            Gamified Savings Tracker 🎮
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 rounded-2xl font-black text-lg border-5 border-black transition-all relative overflow-hidden ${
              isLogin
                ? 'bg-gradient-to-br from-comic-orange via-comic-pink to-comic-purple text-white shadow-comic-lg scale-105'
                : 'bg-white hover:bg-gray-100 shadow-comic'
            }`}
            style={{ textShadow: isLogin ? '2px 2px 0px rgba(0,0,0,0.5)' : 'none' }}
          >
            {isLogin && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_3s_ease-in-out_infinite]" />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              🚀 LOGIN
            </span>
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 rounded-2xl font-black text-lg border-5 border-black transition-all relative overflow-hidden ${
              !isLogin
                ? 'bg-gradient-to-br from-comic-lime via-comic-cyan to-comic-blue text-white shadow-comic-lg scale-105'
                : 'bg-white hover:bg-gray-100 shadow-comic'
            }`}
            style={{ textShadow: !isLogin ? '2px 2px 0px rgba(0,0,0,0.5)' : 'none' }}
          >
            {!isLogin && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_3s_ease-in-out_infinite]" />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              ✨ REGISTER
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-4 border-black rounded-xl text-lg focus:outline-none focus:shadow-comic"
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border-4 border-black rounded-xl text-lg focus:outline-none focus:shadow-comic"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border-4 border-black rounded-xl text-lg focus:outline-none focus:shadow-comic"
          />

          {!isLogin && (
            <input
              type="text"
              placeholder="Referral Code (optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border-4 border-black rounded-xl text-lg focus:outline-none focus:shadow-comic"
            />
          )}

          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-3 border-4 border-black rounded-xl text-lg focus:outline-none focus:shadow-comic"
                >
                  {Object.entries(CURRENCIES).slice(0, 10).map(([code, data]) => (
                    <option key={code} value={code}>
                      {code} - {data.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-3 border-4 border-black rounded-xl text-lg focus:outline-none focus:shadow-comic"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="ru">🇷🇺 Русский</option>
                </select>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-5 rounded-2xl text-xl font-black border-5 border-black shadow-comic-lg
              bg-gradient-to-br from-comic-lime via-comic-cyan to-comic-blue text-white
              hover:scale-105 hover:-translate-y-2 hover:shadow-comic-xl
              active:scale-95 active:translate-y-0 active:shadow-comic
              transition-all relative overflow-hidden"
            style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_3s_ease-in-out_infinite]" />
            <span className="relative z-10">
              {isLogin ? '🚀 LET\'S GO!' : '✨ CREATE ACCOUNT'}
            </span>
          </button>
        </form>

        <div className="mt-6 speech-bubble text-center relative">
          <div className="absolute -top-4 -right-4 text-4xl animate-bounce" style={{ animationDuration: '2s' }}>
            💥
          </div>
          <p className="text-base font-bold text-gray-800 leading-relaxed">
            Track your <span className="text-comic-orange">refusals</span>, earn <span className="text-comic-purple">points</span>, 
            unlock <span className="text-comic-pink">achievements</span>, and see what your savings would be worth in 
            <span className="text-comic-cyan"> crypto</span>! 🎮💎✨
          </p>
        </div>
      </div>
    </div>
  );
}