import { createContext, useContext } from 'react';

const staticContext = createContext();

const defaultValue = {
  authContext: {
    user: null,
  },
  env: {
    VITE_SITE_TITLE: process.env.VITE_SITE_TITLE,
    VITE_FEATURE_REGISTRATION: process.env.VITE_FEATURE_REGISTRATION,
  },
};

function useStaticContext() {
  return useContext(staticContext);
}

function StaticContextProvider({ value, children }) {
  return <staticContext.Provider value={value}>{children}</staticContext.Provider>;
}

export { defaultValue, useStaticContext, StaticContextProvider };
