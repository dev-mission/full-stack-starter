import { Navigate, matchPath, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthContext';

export const ADMIN_AUTH_PROTECTED_PATHS = ['/admin/*'];
export const AUTH_PROTECTED_PATHS = ['/account/*', '/teams/*'];
export const REDIRECTS = [
  ['/admin', '/admin/users'],
  ['/passwords', '/passwords/forgot'],
  ['/teams/:TeamId/tours/:TourId/stops', '/teams/:TeamId/tours/:TourId'],
  ['/teams/:TeamId', '/teams/:TeamId/tours'],
];

function AppRedirects({ children }) {
  const location = useLocation();
  const authContext = useAuthContext();
  let match;
  for (const pattern of ADMIN_AUTH_PROTECTED_PATHS) {
    match = matchPath(pattern, location.pathname);
    if (match) {
      if (!authContext.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      } else if (!authContext.user.isAdmin) {
        return <Navigate to="/" />;
      }
      break;
    }
  }
  if (!match) {
    for (const pattern of AUTH_PROTECTED_PATHS) {
      match = matchPath(pattern, location.pathname);
      if (match) {
        if (!authContext.user) {
          return <Navigate to="/login" state={{ from: location }} replace />;
        }
        break;
      }
    }
  }
  for (const redirect of REDIRECTS) {
    match = matchPath(redirect[0], location.pathname);
    if (match) {
      let dest = redirect[1];
      if (match.params) {
        for (const key of Object.keys(match.params)) {
          dest = dest.replace(`:${key}`, match.params[key]);
        }
      }
      return <Navigate to={dest} />;
    }
  }
  return children;
}
export default AppRedirects;
