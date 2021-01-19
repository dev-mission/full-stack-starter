import {useRouteMatch, Redirect, Route, Switch} from 'react-router-dom';

import SectionItemForm from './SectionItemForm';

function SectionItems() {
  const {path} = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Redirect to="/" />
      </Route>
      <Route path={`${path}/new`}>
        <SectionItemForm />
      </Route>
      <Route path={`${path}/:id/edit`}>
        <SectionItemForm />
      </Route>
    </Switch>
  );
}

export default SectionItems;
