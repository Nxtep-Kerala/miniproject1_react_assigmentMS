import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Stack, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { dataRef } from '../firebase-config'; 

const AdminDashboard = () => {
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', department: '' });
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const snapshot = await dataRef.ref('admin').once('value');
      const data = snapshot.val() || {};
      setAdmins(Object.values(data)); 
    } catch (err) {
      setError('Failed to fetch admins.');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.username || !newAdmin.department) {
      setError('Please fill all fields');
      return;
    }
    if (!newAdmin.password) {
      setError('Please enter a password');
      return;
    }
    setError(null);
    try {
      await dataRef.ref(`admin/${newAdmin.username}`).set({
        username: newAdmin.username,
        password: newAdmin.password,
        department: newAdmin.department
      });
      setNewAdmin({ username: '', password: '', department: '' });
      fetchAdmins();
    } catch (err) {
      setError('Failed to create new admin.');
    }
  };

  const handleDeleteAdmin = async (username) => {
    try {
      await dataRef.ref(`admin/${username}`).remove();
      fetchAdmins();
    } catch (err) {
      setError('Failed to delete admin.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Management Dashboard
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box>
        <Typography variant="h6">Add New Admin</Typography>
        <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
          <TextField label="Username" variant="outlined" name="username" value={newAdmin.username} onChange={handleInputChange} />
          <TextField label="Department" variant="outlined" name="department" value={newAdmin.department} onChange={handleInputChange} />
          <TextField label="Password" variant="outlined" name="password" value={newAdmin.password} onChange={handleInputChange} />
          <Button variant="contained" color="primary" onClick={handleCreateAdmin}>
            Create
          </Button>
        </Stack>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell align="right">Department</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.username}>
                <TableCell component="th" scope="row">
                  {admin.username}
                </TableCell>
                <TableCell align="right">{admin.department}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDeleteAdmin(admin.username)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;
