import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser    = (data) => API.post('/auth/login', data);
export const getRecords   = (params) => API.get('/records', { params });
export const createRecord = (data) => API.post('/records', data);
export const updateRecord = (id, data) => API.put(`/records/${id}`, data);
export const deleteRecord = (id) => API.delete(`/records/${id}`);
export const getSummary   = () => API.get('/analytics/summary');
export const getTrends    = () => API.get('/analytics/trends');
export const getUsers     = () => API.get('/users');
export const updateUser   = (id, data) => API.patch(`/users/${id}`, data);