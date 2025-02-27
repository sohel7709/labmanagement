import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useRole } from '../context/RoleContext';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { role, logout } = useRole();
  const history = useHistory();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    history.push(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const getMenuItems = () => {
    const menuItems = [];

    if (role === 'super_admin') {
      menuItems.push(
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Labs', icon: <BusinessIcon />, path: '/labs' },
        { text: 'Users', icon: <PeopleIcon />, path: '/users' }
      );
    } else if (role === 'admin') {
      menuItems.push(
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Technicians', icon: <PeopleIcon />, path: '/technicians' },
        { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
        { text: 'Reports', icon: <AssignmentIcon />, path: '/reports' }
      );
    } else if (role === 'technician') {
      menuItems.push(
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
        { text: 'Reports', icon: <AssignmentIcon />, path: '/reports' }
      );
    }

    // Common menu items
    menuItems.push(
      { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
      { text: 'Logout', icon: <LogoutIcon />, onClick: handleLogout }
    );

    return menuItems;
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {getMenuItems().map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={item.onClick || (() => handleNavigation(item.path))}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Lab Management System
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="subtitle1" noWrap component="div">
            {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} (${role})` : ''}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: ['48px', '56px', '64px'],
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
