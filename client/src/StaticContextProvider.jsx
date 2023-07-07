import PropTypes from 'prop-types';

import { staticContext } from './StaticContext';

function StaticContextProvider({ value, children }) {
  return <staticContext.Provider value={value}>{children}</staticContext.Provider>;
}

StaticContextProvider.propTypes = {
  children: PropTypes.node,
  value: PropTypes.object,
};

export default StaticContextProvider;
