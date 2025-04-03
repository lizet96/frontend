import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic frontend validation
    if (!formData.email || !formData.username || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
      setError('Password must contain at least one letter and one number');
      return;
    }

    try {
      // Use environment variable for server URL
      const serverUrl = process.env.REACT_APP_SERVER2_URL || 'http://localhost:3002';
      const response = await axios.post(`${serverUrl}/api/auth/register`, formData);
      setQrCode(response.data.qrCode);
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
      console.error('Registration error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
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
            error={!!error && !formData.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            error={!!error && !formData.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            name="password"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            error={!!error && !formData.password}
            helperText="Password must be at least 8 characters with letters and numbers"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </Button>
        </Box>
        {qrCode && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Scan this QR code with your authenticator app
            </Typography>
            <img src={qrCode} alt="QR Code for 2FA" />
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Proceed to Login
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Register;