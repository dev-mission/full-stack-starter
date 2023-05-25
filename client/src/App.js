import { Routes, Route } from 'react-router-dom';

import './App.scss';

import { AuthContextProvider } from './AuthContext';
import AppRedirects from './AppRedirects';
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
      <Header />
      <Routes>
        <Route
          path="*"
          element={
            <AppRedirects>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/passwords/*" element={<PasswordsRoutes />} />
                <Route path="/invites/*" element={<InvitesRoutes />} />
                {process.env.REACT_APP_FEATURE_REGISTRATION === 'true' && <Route path="/register" element={<Register />} />}
                <Route path="/teams/*" element={<TeamsRoutes />} />
                <Route path="/account/*" element={<UsersRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
              </Routes>
            </AppRedirects>
          }
        />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
