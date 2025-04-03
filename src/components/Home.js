import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import axios from 'axios';

function Home() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        // Use environment variable for server URL
        const serverUrl = process.env.REACT_APP_SERVER2_URL || 'http://localhost:3002';
        const response = await axios.get(`${serverUrl}/api/info/getInfo`);
        setInfo(response.data);
      } catch (err) {
        setError('Failed to load information');
        console.error('Error fetching info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  if (loading) {
    return (
      <>
        <NavBar />
        <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Paper elevation={6} sx={{ 
          p: 5, 
          borderRadius: 2,
          background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)'
        }}>
          <Typography variant="h3" gutterBottom sx={{ 
            mb: 4,
            fontWeight: 'bold',
            color: '#1976d2',
            textAlign: 'center'
          }}>
            Proyecto de Seguridad
          </Typography>
        
          <Box sx={{ mb: 5, p: 3, bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2', fontWeight: 'medium' }}>
              Información del Estudiante
            </Typography>
            {error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                Nombre: {info?.student?.fullName}
                <br />
                Grupo: {info?.student?.group}
                <br />
                Grado: {info?.student?.grado}
                <br />
                Node Version: {info?.nodeVersion}
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 5, p: 3, bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2', fontWeight: 'medium' }}>
              Información del Profesor
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              Nombre: Emmanuel Martínez Hernández
              <br />
              Grado: 
            </Typography>
          </Box>

          <Box sx={{ mb: 5, p: 3, bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2', fontWeight: 'medium' }}>
              Sobre la Aplicación
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Esta aplicación demuestra autenticación segura utilizando MFA y tokens JWT.
            Incluye limitación de velocidad en el Servidor 1 y funcionalidad de registro (logging) integral.
            El sistema rastrea varios tipos de solicitudes y sus respuestas a través de dos servidores.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default Home;