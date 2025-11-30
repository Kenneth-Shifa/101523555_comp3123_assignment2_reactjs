import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Logout as LogoutIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { employeeService } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const EmployeeList = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch employees. Please try again.');
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await employeeService.deleteEmployee(id);
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch (error) {
      alert('Failed to delete employee. Please try again.');
      console.error('Error deleting employee:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleLogout = () => {
    logout();
    authService.logout();
    navigate('/login');
  };

  const getImageUrl = (profilePicture) => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith('http')) return profilePicture;
    const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
    const backendUrl = apiUrl.replace('/api', '');
    return `${backendUrl}${profilePicture}`;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: '#8F944C',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              fontSize: '1.25rem',
            }}
          >
            Employee Management System
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                fontWeight: 500,
              }}
            >
              Welcome, <strong>{user?.username}</strong>
            </Typography>
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={() => navigate('/search')}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              Employee List
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your employee database
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/employees/add')}
            sx={{
              px: 3,
              py: 1.5,
            }}
          >
            Add Employee
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" p={8}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <TableContainer 
            component={Paper} 
            elevation={0}
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Profile</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>First Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Salary</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No employees found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Get started by adding your first employee
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => navigate('/employees/add')}
                        >
                          Add Employee
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow 
                      key={employee._id} 
                      hover
                      sx={{ 
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell>
                        <Avatar
                          src={getImageUrl(employee.profilePicture)}
                          alt={`${employee.firstName} ${employee.lastName}`}
                          sx={{ 
                            width: 40, 
                            height: 40,
                            border: '2px solid',
                            borderColor: 'primary.light',
                          }}
                        >
                          {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </Avatar>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{employee.firstName}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{employee.lastName}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.phoneNumber}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: 'primary.light',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {employee.department}
                        </Box>
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'success.main' }}>
                        ${employee.salary?.toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/employees/view/${employee._id}`)}
                            size="small"
                            sx={{
                              '&:hover': {
                                bgcolor: 'primary.light',
                                color: 'white',
                              },
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => navigate(`/employees/edit/${employee._id}`)}
                            size="small"
                            sx={{
                              '&:hover': {
                                bgcolor: 'secondary.light',
                                color: 'white',
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(employee._id)}
                            disabled={deleteLoading === employee._id}
                            size="small"
                            sx={{
                              '&:hover': {
                                bgcolor: 'error.main',
                                color: 'white',
                              },
                            }}
                          >
                            {deleteLoading === employee._id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <DeleteIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default EmployeeList;

