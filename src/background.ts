import { fetchPrices } from './api';

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('updatePrices', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updatePrices') {
    updatePrices();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPrices') {
    updatePrices().then(sendResponse);
    return true; // Indicates that the response is asynchronous
  }
});

async function updatePrices() {
  try {
    const prices = await fetchPrices();
    chrome.action.setBadgeText({ text: Object.values(prices)[0].toFixed(0) });
    return { prices };
  } catch (error) {
    console.error('Error updating prices:', error);
    return { prices: {} };
  }
}