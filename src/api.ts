const API_URL = 'https://api.coingecko.com/api/v3/simple/price';

export async function fetchPrices() {
  const coins = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'dogecoin', 'ripple', 'polkadot', 'uniswap', 'litecoin', 'chainlink'];
  const response = await fetch(`${API_URL}?ids=${coins.join(',')}&vs_currencies=usd`);
  const data = await response.json();
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, (value as { usd: number }).usd]));
}