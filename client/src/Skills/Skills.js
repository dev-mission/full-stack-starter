import { Route, Switch, useRouteMatch } from "react-router-dom";

import SkillsList from './SkillsList';
import SkillForm from './SkillForm';

function Skills() {
const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path = {path}>
                <SkillsList />
            </Route>
            <Route path={`${path}/new`}>
                <SkillForm />
            </Route>
            <Route path={`${path}/:id/edit`}>
                <SkillForm />
            </Route>
        </Switch>
    );
}

export default Skills;