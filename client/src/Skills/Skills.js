import { Route, Switch, useRouteMatch } from "react-router-dom";

import SkillsList from './SkillsList';
import SkillsForm from './SkillsForm';

function Skills() {
const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path = {path}>
                <SkillsList />
            </Route>
        </Switch>
    );
}

export default Skills;