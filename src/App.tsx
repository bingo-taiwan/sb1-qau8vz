import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw } from 'lucide-react';

interface Coin {
  id: string;
  name: string;
  price: number;
}

const availableCoins: Coin[] = [
  { id: 'bitcoin', name: 'Bitcoin', price: 0 },
  { id: 'ethereum', name: 'Ethereum', price: 0 },
  { id: 'binancecoin', name: 'Binance Coin', price: 0 },
  { id: 'cardano', name: 'Cardano', price: 0 },
  { id: 'dogecoin', name: 'Dogecoin', price: 0 },
  { id: 'ripple', name: 'XRP', price: 0 },
  { id: 'polkadot', name: 'Polkadot', price: 0 },
  { id: 'uniswap', name: 'Uniswap', price: 0 },
  { id: 'litecoin', name: 'Litecoin', price: 0 },
  { id: 'chainlink', name: 'Chainlink', price: 0 },
];

function App() {
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['selectedCoins'], (result) => {
      if (result.selectedCoins) {
        setSelectedCoins(result.selectedCoins);
      }
    });

    const updatePrices = () => {
      setIsLoading(true);
      chrome.runtime.sendMessage({ action: 'getPrices' }, (response) => {
        setPrices(response.prices);
        setIsLoading(false);
      });
    };

    updatePrices();
    const interval = setInterval(updatePrices, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCoinSelection = (coinId: string) => {
    const updatedCoins = selectedCoins.includes(coinId)
      ? selectedCoins.filter((id) => id !== coinId)
      : [...selectedCoins, coinId].slice(0, 5);

    setSelectedCoins(updatedCoins);
    chrome.storage.sync.set({ selectedCoins: updatedCoins });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    chrome.runtime.sendMessage({ action: 'getPrices' }, (response) => {
      setPrices(response.prices);
      setIsLoading(false);
    });
  };

  return (
    <div className="w-64 p-4 bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Crypto Price Ticker</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Selected Coins</h2>
        {selectedCoins.map((coinId) => {
          const coin = availableCoins.find((c) => c.id === coinId);
          return (
            <div key={coinId} className="flex justify-between items-center mb-2">
              <span>{coin?.name}</span>
              <span>${prices[coinId]?.toFixed(2) || '0.00'}</span>
            </div>
          );
        })}
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Available Coins</h2>
        {availableCoins.map((coin) => (
          <div key={coin.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={coin.id}
              checked={selectedCoins.includes(coin.id)}
              onChange={() => handleCoinSelection(coin.id)}
              className="mr-2"
            />
            <label htmlFor={coin.id}>{coin.name}</label>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          onClick={handleRefresh}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          disabled={isLoading}
        >
          <RefreshCw className="mr-2" size={16} />
          Refresh
        </button>
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center">
          <Settings className="mr-2" size={16} />
          Settings
        </button>
      </div>
    </div>
  );
}

export default App;