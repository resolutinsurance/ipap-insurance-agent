import Cookies from "js-cookie";

// Helper functions for local storage
export const saveToLocalStorage = (key: string, value: unknown) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getFromLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

export const removeFromLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export const getFromCookies = (key: string) => {
  const item = Cookies.get(key);
  return item ? JSON.parse(item) : null;
};
