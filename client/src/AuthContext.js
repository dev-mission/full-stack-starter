import { createContext, useContext, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';

const authContext = createContext();

function useAuthContext() {
  return useContext(authContext);
}

function AuthContextValue() {
  const [user, setUser] = useState(null);
  return {
    user,
    setUser,
  };
}

function AuthContextProvider({ children }) {
  const value = AuthContextValue();
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

function AuthProtectedRoute({ isAdminRequired, children, ...rest }) {
  const authContext = useAuthContext();
  return (
    <Route
      {...rest}
      render={(props) =>
        authContext.user && (!isAdminRequired || authContext.user.isAdmin) ? (
          children ? (
            children
          ) : (
            rest.render?.(props)
          )
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

export { useAuthContext, AuthContextProvider, AuthProtectedRoute };
