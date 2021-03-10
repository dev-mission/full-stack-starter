import { Route, Switch, useRouteMatch } from "react-router-dom";

import SectionsList from './SectionsList';
import SectionForm from './SectionForm';

function Sections() {
  const { path } = useRouteMatch();
  
  return (
    <Switch>
      <Route exact path={path}>
        <SectionsList />
      </Route>
      <Route path={`${path}/new`}>
        <SectionForm />
      </Route>
      <Route path={`${path}/:id/edit`}>
        <SectionForm />
      </Route>
    </Switch>
  );
}
export default Sections;
