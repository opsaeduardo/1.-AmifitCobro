import React from 'react';
import { Button, Typography, Stack } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

function ButtonHome() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedId = sessionStorage.getItem('selectedId');
 
  const handleClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.location.href = 'https://www.mostradordigital.shop';
    }
  };


  return (
    <Button
      onClick={handleClick}
      variant="contained"
      sx={{
        position: 'absolute',
        top: '50%',
        left: '3%',
        transform: 'translateY(-50%)',
        backgroundColor: theme.customColors.black,
        color: '#fff',
        borderRadius: '100%',
        padding: '8px 8px',
        fontWeight: 'bold',
        zIndex: 100,
      }}
    >

      <Stack direction="column" alignItems="center" spacing={0.5}>
        <KeyboardArrowLeftIcon
          sx={{
            fontSize: '4rem',
            fontWeight: 'bold',
          }}
        />
      </Stack>
    </Button>
  );
}

export default ButtonHome;