// In-memory fallback storage
const memoryStorage: Record<string, string> = {};

// Check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

const canUseLocalStorage = isLocalStorageAvailable();

export const storage = {
  getItem: (key: string): string | null => {
    try {
      if (canUseLocalStorage) {
        return localStorage.getItem(key);
      } else {
        return memoryStorage[key] || null;
      }
    } catch (e) {
      return memoryStorage[key] || null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      if (canUseLocalStorage) {
        localStorage.setItem(key, value);
      } else {
        memoryStorage[key] = value;
      }
    } catch (e) {
      memoryStorage[key] = value;
    }
  },

  removeItem: (key: string): void => {
    try {
      if (canUseLocalStorage) {
        localStorage.removeItem(key);
      } else {
        delete memoryStorage[key];
      }
    } catch (e) {
      delete memoryStorage[key];
    }
  },

  clear: (): void => {
    try {
      if (canUseLocalStorage) {
        localStorage.clear();
      } else {
        Object.keys(memoryStorage).forEach((key) => {
          delete memoryStorage[key];
        });
      }
    } catch (e) {
      Object.keys(memoryStorage).forEach((key) => {
        delete memoryStorage[key];
      });
    }
  },
};
