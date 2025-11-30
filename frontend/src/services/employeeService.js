import api from './api';

export const employeeService = {
  getAllEmployees: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  getEmployeeById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  createEmployee: async (employeeData) => {
    const formData = new FormData();
    Object.keys(employeeData).forEach(key => {
      if (key === 'profilePicture' && employeeData[key]) {
        formData.append('profilePicture', employeeData[key]);
      } else if (employeeData[key] !== null && employeeData[key] !== undefined) {
        formData.append(key, employeeData[key]);
      }
    });

    const response = await api.post('/employees', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const formData = new FormData();
    Object.keys(employeeData).forEach(key => {
      if (key === 'profilePicture' && employeeData[key]) {
        formData.append('profilePicture', employeeData[key]);
      } else if (employeeData[key] !== null && employeeData[key] !== undefined) {
        formData.append(key, employeeData[key]);
      }
    });

    const response = await api.put(`/employees/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },

  searchEmployees: async (department, position) => {
    const params = {};
    if (department) params.department = department;
    if (position) params.position = position;
    
    const response = await api.get('/employees/search', { params });
    return response.data;
  }
};

