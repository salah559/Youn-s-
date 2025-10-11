// js/api.js - Shared server storage API
const API_URL = '/api/data';

// In-memory cache for synchronous access
let serverData = {
  creds: {user: 'younes', pass: 'younes'},
  bookings: [],
  cancelled: [],
  annonces: [],
  journal: [],
  income: [],
  debt: []
};

let isLoaded = false;
let isSyncing = false;

// Load data from server (async, called on init)
async function syncFromServer() {
  if (isSyncing) return;
  isSyncing = true;
  
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const data = await response.json();
      serverData = data;
      isLoaded = true;
      console.log('✅ Data loaded from server');
      
      // Trigger refresh for any rendered content
      if (typeof renderList === 'function') renderList();
      if (typeof renderAnnonces === 'function') renderAnnonces();
      if (typeof renderAdminDays === 'function') renderAdminDays();
    }
  } catch (error) {
    console.warn('⚠️ Could not load from server, using local data:', error);
  }
  
  isSyncing = false;
}

// Save data to server (async, fire and forget)
async function syncToServer() {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serverData)
    });
    console.log('✅ Data saved to server');
  } catch (error) {
    console.warn('⚠️ Could not save to server:', error);
  }
}

// Override localStorage-based functions in main.js
window.load = function(key) {
  const keyMap = {
    'bp_creds': 'creds',
    'bp_bookings': 'bookings',
    'bp_cancelled': 'cancelled',
    'bp_annonces': 'annonces',
    'bp_journal': 'journal',
    'bp_income': 'income',
    'bp_debt': 'debt'
  };
  const dataType = keyMap[key];
  return serverData[dataType] || (dataType === 'creds' ? {user: 'younes', pass: 'younes'} : []);
};

window.save = function(key, value) {
  const keyMap = {
    'bp_creds': 'creds',
    'bp_bookings': 'bookings',
    'bp_cancelled': 'cancelled',
    'bp_annonces': 'annonces',
    'bp_journal': 'journal',
    'bp_income': 'income',
    'bp_debt': 'debt'
  };
  const dataType = keyMap[key];
  serverData[dataType] = value;
  
  // Save to server asynchronously (fire and forget)
  syncToServer();
};

window.creds = function() {
  return serverData.creds || {user: 'younes', pass: 'younes'};
};

window.saveCreds = function(x) {
  serverData.creds = x;
  syncToServer();
};

// Auto-sync from server every 3 seconds to get updates from other users
setInterval(syncFromServer, 3000);

// Initial load
syncFromServer();
