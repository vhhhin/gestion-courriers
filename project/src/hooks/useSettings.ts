import { useState, useCallback } from 'react';

export interface Settings {
  language: 'fr' | 'ar';
  theme: 'light' | 'dark';
  autoSave: boolean;
  defaultPriority: 'normal' | 'urgent';
  notifications: {
    email: boolean;
    desktop: boolean;
    urgent: boolean;
    digest: boolean;
  };
  security: {
    sessionTimeout: number;
    twoFactor: boolean;
  };
}

const defaultSettings: Settings = {
  language: 'fr',
  theme: 'light',
  autoSave: true,
  defaultPriority: 'normal',
  notifications: {
    email: true,
    desktop: true,
    urgent: true,
    digest: false,
  },
  security: {
    sessionTimeout: 30,
    twoFactor: false,
  },
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('settings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { settings, updateSettings };
}