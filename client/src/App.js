import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import './App.scss';

import {AuthContextProvider, AuthProtectedRoute} from './AuthContext';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Passwords from './Passwords';
import Register from './Register';
import SectionItems from './SectionItems';
import Sections from './Sections/Sections';
import Projects from './Projects';
import Skills from './Skills/Skills';
import WebTechnologies from './LearningOutcomes/WebTechnologies';
import InfraSys from './LearningOutcomes/InfraSys';
import Databases from './LearningOutcomes/Databases';
import Programming from './LearningOutcomes/Programming';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/web_technologies">
            <WebTechnologies />
          </Route>
          <Route path="/databases">
            <Databases />
          </Route>
          <Route path="/infra_and_systems">
            <InfraSys />
          </Route>
          <Route path="/programming">
            <Programming />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/passwords">
            <Passwords />
          </Route>
          <Route path="/sections">
            <Sections />
          </Route> 
          {process.env.REACT_APP_FEATURE_REGISTRATION === 'true' && (
            <Route path="/register">
              <Register />
            </Route>

          )}
          <AuthProtectedRoute path="/sectionItems">
            <SectionItems />
          </AuthProtectedRoute>
        </Switch>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
