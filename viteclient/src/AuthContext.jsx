import { createContext, useContext, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useStaticContext } from './StaticContext';

const authContext = createContext();

function useAuthContext() {
  return useContext(authContext);
}

function AuthContextValue() {
  const staticContext = useStaticContext();
  const [user, setUser] = useState(staticContext.authContext?.user);
  return {
    user,
    setUser,
  };
}

function AuthContextProvider({ children }) {
  const value = AuthContextValue();
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

function AuthProtected({ isAdminRequired, children }) {
  const location = useLocation();
  const authContext = useAuthContext();
  return authContext.user && (!isAdminRequired || authContext.user.isAdmin) ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export { useAuthContext, AuthContextProvider, AuthProtected };
