import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from '../../utils/axios';

const SuperAdminDashboard = () => {
  const [labs, setLabs] = useState([]);
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchLabs = useCallback(async () => {
    try {
      const response = await axios.get('/api/superadmin/labs');
      setLabs(response.data);
    } catch (error) {
      showSnackbar('Error fetching labs', 'error');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('/api/superadmin/users');
      setUsers(response.data);
    } catch (error) {
      showSnackbar('Error fetching users', 'error');
    }
  }, []);

  useEffect(() => {
    fetchLabs();
    fetchUsers();
  }, [fetchLabs, fetchUsers]);

  const handleOpenDialog = (type, data = {}) => {
    setDialogType(type);
    setFormData(data);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async () => {
    try {
      switch (dialogType) {
        case 'createLab':
          await axios.post('/api/superadmin/labs', formData);
          showSnackbar('Lab created successfully');
          fetchLabs();
          break;
        case 'editLab':
          await axios.put(`/api/superadmin/labs/${formData._id}`, formData);
          showSnackbar('Lab updated successfully');
          fetchLabs();
          break;
        case 'createUser':
          await axios.post('/api/superadmin/users', formData);
          showSnackbar('User created successfully');
          fetchUsers();
          break;
        case 'editUser':
          await axios.put(`/api/superadmin/users/${formData._id}`, formData);
          showSnackbar('User updated successfully');
          fetchUsers();
          break;
        default:
          break;
      }
      handleCloseDialog();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'An error occurred', 'error');
    }
  };

  const handleDelete = async (type, id) => {
    try {
      if (type === 'lab') {
        await axios.delete(`/api/superadmin/labs/${id}`);
        showSnackbar('Lab deleted successfully');
        fetchLabs();
      } else {
        await axios.delete(`/api/superadmin/users/${id}`);
        showSnackbar('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'An error occurred', 'error');
    }
  };

  const renderDialog = () => {
    const isLab = dialogType.includes('Lab');
    const isEdit = dialogType.includes('edit');
    const title = `${isEdit ? 'Edit' : 'Create'} ${isLab ? 'Lab' : 'User'}`;

    return (
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {isLab ? (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Contact"
                name="contact"
                value={formData.contact || ''}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
              />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
              />
              {!isEdit && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                />
              )}
              <TextField
                fullWidth
                margin="normal"
                select
                label="Role"
                name="role"
                value={formData.role || ''}
                onChange={handleInputChange}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="technician">Technician</MenuItem>
              </TextField>
              {labs.length > 0 && (
                <TextField
                  fullWidth
                  margin="normal"
                  select
                  label="Lab"
                  name="lab"
                  value={formData.lab || ''}
                  onChange={handleInputChange}
                >
                  {labs.map((lab) => (
                    <MenuItem key={lab._id} value={lab._id}>
                      {lab.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Super Admin Dashboard
        </Typography>

        {/* Labs Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">Labs</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('createLab')}
            >
              Add Lab
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {labs.map((lab) => (
                  <TableRow key={lab._id}>
                    <TableCell>{lab.name}</TableCell>
                    <TableCell>{lab.address}</TableCell>
                    <TableCell>{lab.contact}</TableCell>
                    <TableCell>{lab.email}</TableCell>
                    <TableCell>{lab.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog('editLab', lab)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete('lab', lab._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {labs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No labs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Users Section */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">Users</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('createUser')}
            >
              Add User
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Lab</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.lab?.name}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog('editUser', user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete('user', user._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {renderDialog()}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default SuperAdminDashboard;
