export const DEFAULT_GOALS = [
  {
    name: 'iPhone 17 Pro',
    targetUSD: 1199, // Starting price estimate
    icon: '📱',
    description: 'Latest flagship smartphone',
  },
  {
    name: 'Ray-Ban Aviator Sunglasses',
    targetUSD: 165, // Classic Aviator price
    icon: '🕶️',
    description: 'Classic aviator style',
  },
  {
    name: 'AirPods Pro',
    targetUSD: 249,
    icon: '🎧',
    description: 'Wireless earbuds with ANC',
  },
  {
    name: 'Weekend Trip',
    targetUSD: 500,
    icon: '✈️',
    description: 'Short vacation getaway',
  },
];

export function getDefaultGoalsForUser(currency: string) {
  return DEFAULT_GOALS.map(goal => ({
    ...goal,
    currency,
  }));
}