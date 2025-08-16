import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import { Box } from '@mui/material';
import ButtonHome from './components/common/ButtonHome';
import { WhatsApp } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';

import Home from './pages/Home/Home';
import Inicio from './pages/Inicio/Inicio';
import EventosInfo from './pages/Eventos/EventosInfo';
import ProductosInfo from './pages/Productos/ProductosInfo';
import ClasesInfo from './pages/Clases/ClasesInfo';
import EntrenamientoInfo from './pages/Entrenamiento/EntrenamientoInfo';
import MensualidadInfo from './pages/Mensualidad/MensualidadInfo';

function AppContent() {

  const location = useLocation();

  const theme = useTheme();

  // SE OBTIENE LA VARIABLE DE SESSION STORAGE
  const showButton = location.pathname !== '/';
  const selectedId = sessionStorage.getItem('selectedId');

  // SE VERIFICA SI ESTA EN HOME PARA NO MOSTRAR BOTOND DE INICIO
  if (!selectedId && location.pathname !== '/inicio') {
    return <Navigate to="/inicio" replace />;
  }

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', backgroundColor: '#cecece' }}>
      <ButtonHome />
      {/* ICONO PRINCIPAL */}
      <img
        src="/img/Isotipo-verde.svg"
        alt="Logo"
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          height: '50px',
          zIndex: 100,
        }}
      />

      {location.pathname === '/' && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '10px',
            left: 0,
            width: '11%',
            height: '55px',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '0px',
            boxShadow: '0 8px 8px rgba(0,0,0,0.1)',
            borderRadius: '0 25px 25px 0',
          }}
        >
          <IconButton
            aria-label="WhatsApp"
          // onClick={() => window.open('https://wa.me/tunúmero', '_blank')}
          >
            <WhatsApp
              sx={{
                color: '#25D366',
                fontSize: '50px',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            />
          </IconButton>
        </Box>
      )}

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '55%',
          backgroundColor: theme.customColors.black,
          borderBottomLeftRadius: '100%',
          borderBottomRightRadius: '100%',
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80vh',
          minHeight: '300px',
          maxHeight: '1200px',
          backgroundColor: showButton ? 'white' : 'none',
          borderRadius: '50px',
          boxShadow: showButton ? '-1px 5px 10px #00000038' : 'none',
          zIndex: 10,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          overflowY: 'auto',
          gap: '0px',
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/Eventos" element={<EventosInfo />} />
          <Route path="/Productos" element={<ProductosInfo />} />
          <Route path="/Clases" element={<ClasesInfo />} />
          <Route path="/Entrenamiento" element={<EntrenamientoInfo />} />
          <Route path="/Mensualidad" element={<MensualidadInfo />} />
        </Routes>
      </Box>
    </div>
  );
}

// USO DE ROUTER
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;