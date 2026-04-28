import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UiModeContext = createContext(null);
const STORAGE_KEY = 'ui_mode_preference';

export const UiModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') {
      return 'v1_classic';
    }
    return window.localStorage.getItem(STORAGE_KEY) || 'v1_classic';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo(() => ({
    mode,
    setMode,
    toggleMode: () => {
      setMode((prev) => (prev === 'v1_classic' ? 'v2_editorial' : 'v1_classic'));
    },
  }), [mode]);

  return (
    <UiModeContext.Provider value={value}>
      {children}
    </UiModeContext.Provider>
  );
};

export const useUiMode = () => {
  const ctx = useContext(UiModeContext);
  if (!ctx) {
    throw new Error('useUiMode 必须在 UiModeProvider 内使用');
  }
  return ctx;
};
