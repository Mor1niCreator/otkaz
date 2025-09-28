import React, { useState, useEffect } from 'react';
import { SimplePanel } from '../components/SimplePanel';
import axios from 'axios';

export function SimpleHome() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const response = await axios.get('/api/users/me');
      setUser(response.data.user);
    } catch (error) {
      try {
        const response = await axios.post('/api/auth/anon');
        setUser(response.data.user);
      } catch (createError) {
        console.error('Failed to create user:', createError);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">🚫 Отказник</h1>
          {user && (
            <div className="text-sm text-gray-600">
              Поинты: {user.total_points} | Ранг: {user.current_rank}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        <SimplePanel>
          <h2 className="text-xl font-bold mb-4">Добро пожаловать в Отказник!</h2>
          <p className="text-gray-700 mb-4">
            Отслеживайте свои ежедневные отказы от трат и смотрите, сколько вы сэкономили.
          </p>
          
          {user ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-100 p-4 rounded-lg">
                  <h3 className="font-bold text-green-800">Всего поинтов</h3>
                  <p className="text-2xl font-bold text-green-600">{user.total_points}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-800">Текущий ранг</h3>
                  <p className="text-lg font-bold text-blue-600">{user.current_rank}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <h3 className="font-bold text-purple-800">Валюта</h3>
                  <p className="text-lg font-bold text-purple-600">{user.currency}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-bold mb-2">Быстрые действия:</h3>
                <div className="flex gap-2">
                  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Добавить отказ
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Статистика
                  </button>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                    Цели
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Создание пользователя...</p>
            </div>
          )}
        </SimplePanel>

        {/* API Status */}
        <SimplePanel className="mt-4">
          <h3 className="font-bold mb-2">Статус API:</h3>
          <div className="flex gap-4">
            <a href="/api/docs" className="text-blue-600 hover:underline">API Документация</a>
            <a href="/api/health" className="text-green-600 hover:underline">Проверка здоровья</a>
          </div>
        </SimplePanel>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-800 p-4 mt-8">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>Отказник - Track your daily refusals and see crypto ROI potential</p>
          <p className="text-xs mt-2">Это не финансовый совет. Прошлые результаты не гарантируют будущих.</p>
        </div>
      </footer>
    </div>
  );
}