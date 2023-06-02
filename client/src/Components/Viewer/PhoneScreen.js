import classNames from 'classnames';

import './PhoneScreen.scss';

function PhoneScreen({ className, children }) {
  return <div className={classNames('phone-screen', className)}>{children}</div>;
}
export default PhoneScreen;
