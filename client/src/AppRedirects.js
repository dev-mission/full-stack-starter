import { Navigate, matchPath, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthContext';

export const ADMIN_AUTH_PROTECTED_PATHS = ['/admin/*'];
export const AUTH_PROTECTED_PATHS = ['/account/*'];
export const REDIRECTS = [
  ['/admin', '/admin/users'],
  ['/passwords', '/passwords/forgot'],
];

export function handleRedirects(authContext, location, pathname, callback) {
  let match;
  for (const pattern of ADMIN_AUTH_PROTECTED_PATHS) {
    match = matchPath(pattern, pathname);
    if (match) {
      if (!authContext.user) {
        return callback('/login', { from: location });
      } else if (!authContext.user.isAdmin) {
        return callback('/');
      }
      break;
    }
  }
  if (!match) {
    for (const pattern of AUTH_PROTECTED_PATHS) {
      match = matchPath(pattern, pathname);
      if (match) {
        if (!authContext.user) {
          return callback('/login', { from: location });
        }
        break;
      }
    }
  }
  for (const redirect of REDIRECTS) {
    match = matchPath(redirect[0], pathname);
    if (match) {
      return callback(redirect[1]);
    }
  }
  return false;
}

function AppRedirects({ children }) {
  const location = useLocation();
  const authContext = useAuthContext();
  const result = handleRedirects(authContext, location, location.pathname, (to, state) => {
    if (state) {
      return <Navigate to={to} state={state} replaces />;
    }
    return <Navigate to={to} />;
  });
  return result ? result : children;
}
export default AppRedirects;
