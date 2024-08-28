import { format, FormatDateOptions } from 'date-fns';

import { analytics, logEvent } from '../../firebase';

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

export const sysPhone = (phone: string) => {
  if (phone?.length > 10) {
    phone = phone.substring(phone.length - 10); // Keep only the last 10 characters
  }
  const cleaned = ('' + phone).replace(/\D/g, ''); // Remove non-digit characters
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]})-${match[2]}-${match[3]}`;
  }
  return phone;
};

export const formatDateUI = (
  date: Date,
  formatStr = 'MM-dd-yyyy',
  options?: FormatDateOptions,
) => format(new Date(date), formatStr, options);

export const formatDateAPIpayload = (
  date: any,
  formatStr = 'MM-dd-yyyy',
  options?: FormatDateOptions,
) => format(new Date(date), formatStr, options);

export const addEllipsis = (text: string) => {
  if (text.length > 156) {
    return text.substring(0, 156 + 1) + '...';
  }

  return text;
};

export function formatTickNumber(num: number) {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1) + 'K';
  } else if (num < 1000000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else {
    return (num / 1000000000).toFixed(1) + 'B';
  }
}

export const calculatePercentage = (value = 0, total = 0) => {
  if (total === 0) {
    return 0;
  } else {
    return Math.round((value / total) * 100);
  }
};

export function debounce(func: any, delay: number) {
  let timeoutId: any;
  return (...args: any) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function firebaseAnalytics(eventType: string, options: any = {}) {
  return logEvent(analytics, eventType, options);
}
