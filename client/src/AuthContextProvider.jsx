import { authContext, AuthContextValue } from './AuthContext';
import PropTypes from 'prop-types';

function AuthContextProvider({ children }) {
  const value = AuthContextValue();
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthContextProvider;
