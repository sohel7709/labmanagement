import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';

// Dashboard Components
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import SuperAdminDashboard from './pages/Dashboard/SuperAdminDashboard';
import PatientList from './pages/PatientList';

// Context
import { RoleProvider } from './context/RoleContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RoleProvider>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Layout>
              <Switch>
                {/* Super Admin Routes */}
                <PrivateRoute
                  exact
                  path="/"
                  roles={['super_admin']}
                  component={SuperAdminDashboard}
                />
                <PrivateRoute
                  exact
                  path="/labs"
                  roles={['super_admin']}
                  component={SuperAdminDashboard}
                />
                <PrivateRoute
                  exact
                  path="/users"
                  roles={['super_admin']}
                  component={SuperAdminDashboard}
                />

                {/* Admin Routes */}
                <PrivateRoute
                  exact
                  path="/admin"
                  roles={['admin']}
                  component={AdminDashboard}
                />
                <PrivateRoute
                  exact
                  path="/technicians"
                  roles={['admin']}
                  component={AdminDashboard}
                />

                {/* Common Routes */}
                <PrivateRoute
                  exact
                  path="/patients"
                  roles={['admin', 'technician']}
                  component={PatientList}
                />
                <PrivateRoute
                  exact
                  path="/dashboard"
                  roles={['admin', 'technician']}
                  component={Dashboard}
                />
              </Switch>
            </Layout>
          </Switch>
        </Router>
      </RoleProvider>
    </ThemeProvider>
  );
}

export default App;
