// pages/Inicio/Inicio.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

function Inicio() {
    const navigate = useNavigate();

    // SE SELECCIONA POR DEFECTO EL ID DEL GIMNASIO
    useEffect(() => {
        sessionStorage.setItem('selectedId', 3);
        navigate('/');
    },[]);

    const handleSelect = (id) => {
        sessionStorage.setItem('selectedId', id);
        navigate('/');
    };

    return (
        <>
            <div style={{ width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', padding: '10px' }}>
                <Box
                    onClick={() => handleSelect(2)}
                    sx={{
                        borderRadius: '50px',
                        width: '40%',
                        height: '60%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        boxShadow: 6,
                        cursor: 'pointer',
                        backgroundImage: `url('/img/gimnasios/Tux.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            boxShadow: 8,
                            transform: 'scale(1.1)',
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '30%',
                            backgroundColor: '#10295ba6',
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                            TUXTLA
                        </Typography>
                    </Box>
                </Box>
                <Box
                    onClick={() => handleSelect(3)}
                    sx={{
                        borderRadius: '50px',
                        width: '40%',
                        height: '60%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        boxShadow: 6,
                        cursor: 'pointer',
                        backgroundImage: `url('/img/gimnasios/Tapa.jpeg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            boxShadow: 8,
                            transform: 'scale(1.1)',
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '30%',
                            backgroundColor: '#10295ba6',
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                            TAPACHULA
                        </Typography>
                    </Box>
                </Box>
            </div>
        </>
    );
}

export default Inicio;
