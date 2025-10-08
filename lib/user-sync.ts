// Utility to sync user data
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