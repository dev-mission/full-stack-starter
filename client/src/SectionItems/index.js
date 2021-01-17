import {useRouteMatch, Redirect, Route, Switch} from 'react-router-dom';

import EditSectionItem from './EditSectionItem';

function SectionItems() {
  const {path} = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Redirect to="/" />
      </Route>
      <Route path={`${path}/new`}>
        <EditSectionItem />
      </Route>
      <Route path={`${path}/:id/edit`}>
        <EditSectionItem />
      </Route>
    </Switch>
  );
}

export default SectionItems;
