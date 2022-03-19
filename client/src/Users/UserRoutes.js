import { useRouteMatch, Route, Switch } from 'react-router-dom';

import UserForm from './UserForm';

function UserRoutes() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <UserForm />
      </Route>
    </Switch>
  );
}

export default UserRoutes;
