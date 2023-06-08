import { Navigate, matchPath, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthContext';

export const ADMIN_AUTH_PROTECTED_PATHS = ['/admin/*'];
export const AUTH_PROTECTED_PATHS = ['/account/*', '/teams/*'];
export const REDIRECTS = [
  ['/admin', '/admin/users'],
  ['/passwords', '/passwords/forgot'],
  ['/teams/new', '/teams/new'],
  ['/teams/:TeamId/tours/:TourId/stops', '/teams/:TeamId/tours/:TourId'],
  ['/teams/:TeamId', '/teams/:TeamId/tours'],
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
    let [src, dest] = redirect;
    match = matchPath(src, pathname);
    if (match) {
      if (match.params) {
        for (const key of Object.keys(match.params)) {
          dest = dest.replace(`:${key}`, match.params[key]);
        }
      }
      if (dest !== src) {
        return callback(dest);
      }
      break;
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
