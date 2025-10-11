// js/api.js - Shared server storage API (QUEUE-BASED VERSION)
const API_URL = '/api/data';

// In-memory cache for PUBLIC shared data only (NO credentials)
let serverData = {
  bookings: [],
  cancelled: [],
  annonces: [],
  journal: [],
  income: [],
  debt: []
};

let isLoaded = false;
let isSyncing = false;
let isSaving = false;
let pendingSnapshot = null;

// Load PUBLIC data from server (async)
async function syncFromServer() {
  if (isSyncing) return;
  isSyncing = true;
  
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const data = await response.json();
      serverData = data;
      isLoaded = true;
      
      // Trigger refresh for any rendered content
      if (typeof renderList === 'function') renderList();
      if (typeof renderAnnonces === 'function') renderAnnonces();
      if (typeof renderAdminDays === 'function') renderAdminDays();
      if (typeof renderDebts === 'function') renderDebts();
      if (typeof renderAccounting === 'function') renderAccounting();
    }
  } catch (error) {
    console.warn('⚠️ Could not load from server:', error);
  }
  
  isSyncing = false;
}

// Save PUBLIC data to server (async with queue)
async function syncToServer() {
  // Take snapshot of current state IMMEDIATELY
  pendingSnapshot = JSON.parse(JSON.stringify(serverData));
  
  // If already saving, the snapshot is queued - will be saved when current save completes
  if (isSaving) return;
  
  // Process queue
  while (pendingSnapshot !== null) {
    isSaving = true;
    const dataToSave = pendingSnapshot;
    pendingSnapshot = null; // Clear pending before save
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });
      
      if (response.ok) {
        console.log('✅ Data saved to server');
      } else {
        // Server error - restore to queue for retry
        console.warn('⚠️ Server error, will retry');
        pendingSnapshot = dataToSave;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      }
    } catch (error) {
      // Network error - restore to queue for retry
      console.warn('⚠️ Network error, will retry:', error);
      pendingSnapshot = dataToSave;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
    }
    
    isSaving = false;
    
    // If new snapshot was queued while we were saving, loop continues
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
  
  // Admin credentials stay in localStorage ONLY (not shared)
  if (dataType === 'creds') {
    const stored = localStorage.getItem('bp_creds');
    return stored ? JSON.parse(stored) : {user: 'younes', pass: 'younes'};
  }
  
  // All other data comes from server
  return serverData[dataType] || [];
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
  
  // Admin credentials stay in localStorage ONLY (not shared)
  if (dataType === 'creds') {
    localStorage.setItem('bp_creds', JSON.stringify(value));
    return;
  }
  
  // Update serverData with new value IMMEDIATELY
  serverData[dataType] = value;
  
  // Trigger save (will queue if save in progress)
  syncToServer();
};

window.creds = function() {
  const stored = localStorage.getItem('bp_creds');
  return stored ? JSON.parse(stored) : {user: 'younes', pass: 'younes'};
};

window.saveCreds = function(x) {
  localStorage.setItem('bp_creds', JSON.stringify(x));
};

// Auto-sync from server every 2 seconds to get updates from other users
setInterval(syncFromServer, 2000);

// Initial load
syncFromServer();

console.log('🔒 Secure shared storage initialized (credentials kept local)');
