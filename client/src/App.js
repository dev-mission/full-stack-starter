import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.scss';

import { AuthContextProvider, AuthProtected } from './AuthContext';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import AdminRoutes from './Admin/AdminRoutes';
import InvitesRoutes from './Invites/InvitesRoutes';
import PasswordsRoutes from './Passwords/PasswordsRoutes';
import Register from './Register';
import TeamsRoutes from './Teams/TeamsRoutes';
import UsersRoutes from './Users/UsersRoutes';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/passwords/*" element={<PasswordsRoutes />} />
          <Route path="/invites/*" element={<InvitesRoutes />} />
          {process.env.REACT_APP_FEATURE_REGISTRATION === 'true' && <Route path="/register" element={<Register />} />}
          <Route
            path="/account/*"
            element={
              <AuthProtected>
                <UsersRoutes />
              </AuthProtected>
            }
          />
          <Route
            path="/teams/*"
            element={
              <AuthProtected>
                <TeamsRoutes />
              </AuthProtected>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AuthProtected isAdminRequired={true}>
                <AdminRoutes />
              </AuthProtected>
            }
          />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
