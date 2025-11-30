import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';
import { employeeService } from '../services/employeeService';

const ViewEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployeeById(id);
      setEmployee(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch employee details. Please try again.');
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (profilePicture) => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith('http')) return profilePicture;
    const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
    const backendUrl = apiUrl.replace('/api', '');
    return `${backendUrl}${profilePicture}`;
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !employee) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Employee not found'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/employees')}
          sx={{ mt: 2 }}
        >
          Back to Employee List
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/employees')}
        sx={{ mb: 2 }}
      >
        Back to Employee List
      </Button>

      <Paper 
        elevation={0}
        sx={{ 
          padding: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              Employee Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View complete employee information
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/employees/edit/${id}`)}
          >
            Edit
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={getImageUrl(employee.profilePicture)}
            sx={{ width: 150, height: 150, mb: 2 }}
          >
            {employee.firstName?.[0]}{employee.lastName?.[0]}
          </Avatar>
          <Typography variant="h5">
            {employee.firstName} {employee.lastName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {employee.position} - {employee.department}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card 
              variant="outlined"
              sx={{
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 2,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {employee.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Phone Number
                </Typography>
                <Typography variant="body1">{employee.phoneNumber}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Department
                </Typography>
                <Typography variant="body1">{employee.department}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Position
                </Typography>
                <Typography variant="body1">{employee.position}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Salary
                </Typography>
                <Typography variant="body1">
                  ${employee.salary?.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Date of Joining
                </Typography>
                <Typography variant="body1">
                  {new Date(employee.dateOfJoining).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewEmployee;

