'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');

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
      : { email, password, name, referralCode };

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="comic-panel max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">💰 Отказник</h1>
          <p className="text-xl text-gray-700">Gamified Savings Tracker</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl font-bold border-4 border-black transition-all ${
              isLogin
                ? 'comic-button-orange'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            🚀 Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl font-bold border-4 border-black transition-all ${
              !isLogin
                ? 'comic-button-orange'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ✨ Register
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

          <button type="submit" className="w-full comic-button-lime text-xl">
            {isLogin ? '🚀 Let\'s Go!' : '✨ Create Account'}
          </button>
        </form>

        <div className="mt-6 speech-bubble text-center">
          <p className="text-sm text-gray-700">
            Track your refusals, earn points, unlock achievements, and see what
            your savings would be worth in crypto! 🎮💎
          </p>
        </div>
      </div>
    </div>
  );
}