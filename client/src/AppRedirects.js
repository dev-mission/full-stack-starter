import { Navigate, matchPath, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthContext';

export const ADMIN_AUTH_PROTECTED_PATHS = ['/admin/*'];
export const AUTH_PROTECTED_PATHS = ['/account/*', '/teams/*'];
export const REDIRECTS = [
  ['/admin', '/admin/users'],
  ['/passwords', '/passwords/forgot'],
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
      return <Navigate to={redirect[1]} />;
    }
  }
  return children;
}
export default AppRedirects;
