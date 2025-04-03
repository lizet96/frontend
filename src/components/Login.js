import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mfaToken: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Use environment variable for server URL
      const serverUrl = process.env.REACT_APP_SERVER2_URL || 'http://localhost:3002';
      const response = await axios.post(`${serverUrl}/api/auth/login`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            name="password"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="MFA Token"
            name="mfaToken"
            onChange={(e) => setFormData({...formData, mfaToken: e.target.value})}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/register')}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;