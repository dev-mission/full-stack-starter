import { useRouteMatch, Redirect, Route, Switch } from 'react-router-dom';

import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

function PasswordRoutes() {
  const { path, url } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Redirect to={`${url}/forgot`} />
      </Route>
      <Route path={`${path}/forgot`}>
        <ForgotPassword />
      </Route>
      <Route path={`${path}/reset/:token`}>
        <ResetPassword />
      </Route>
    </Switch>
  );
}

export default PasswordRoutes;
