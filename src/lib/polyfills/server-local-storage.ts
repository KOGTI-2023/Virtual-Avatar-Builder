// Provide a minimal in-memory localStorage shim for server-side execution.
const ensureServerLocalStorage = () => {
  if (typeof window !== "undefined") {
    return;
  }

  const existing = (globalThis as { localStorage?: Storage }).localStorage;
  if (
    existing &&
    typeof existing.getItem === "function" &&
    typeof existing.setItem === "function"
  ) {
    return;
  }

  const storage = new Map<string, string>();

  const serverStorage: Storage = {
    getItem: (key) => (storage.has(key) ? storage.get(key)! : null),
    setItem: (key, value) => {
      storage.set(key, value);
    },
    removeItem: (key) => {
      storage.delete(key);
    },
    clear: () => {
      storage.clear();
    },
    key: (index) => Array.from(storage.keys())[index] ?? null,
    get length() {
      return storage.size;
    },
  };

  (globalThis as { localStorage?: Storage }).localStorage = serverStorage;
};

ensureServerLocalStorage();
