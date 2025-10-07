// Utility to sync user data from API
export async function syncUserData(userId: string): Promise<any> {
  try {
    const res = await fetch(`/api/user/me?userId=${userId}`);
    const data = await res.json();
    
    if (res.ok && data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    }
  } catch (error) {
    console.error('Failed to sync user data:', error);
  }
  
  return null;
}

export function getUserFromStorage() {
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  
  const user = JSON.parse(userData);
  
  // Ensure defaults
  if (!user.currency) user.currency = 'USD';
  if (!user.language) user.language = 'en';
  if (!user.points) user.points = 0;
  if (!user.rank) user.rank = 'Novice Saver';
  
  return user;
}