import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import SideNav from './SideNav';

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#000000'
      }}>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LockIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <SideNav />
      <Toolbar /> {/* This creates space below the fixed AppBar */}
    </>
  );
}

export default NavBar;