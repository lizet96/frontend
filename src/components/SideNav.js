import React, { useState } from 'react';
import { 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  useTheme
} from '@mui/material';
import { 
  Settings as SettingsIcon,
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

function SideNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'View Logs', icon: <AssessmentIcon />, path: '/logs' }
  ];

  return (
    <>
      <IconButton
        sx={{
          position: 'fixed',
          left: 20,
          top: 10,
          color: 'white',
          zIndex: 2000
        }}
        onClick={() => setOpen(!open)}
      >
        {open ? <SettingsIcon /> : <MenuIcon />}
      </IconButton>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            marginTop: '64px',
            backgroundColor: '#000000',
            borderRight: 'none',
            color: 'white'
          }
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)'
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default SideNav;