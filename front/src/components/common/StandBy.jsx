import React from 'react';
import { Box, Typography, CircularProgress, Button, useTheme } from '@mui/material';
import { Construction, RocketLaunch } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StandBy = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                textAlign: 'center',
                px: 3,
                gap: 3
            }}
        >

            {/* Mensaje principal */}
            <Typography
                variant="h2"
                sx={{
                    fontWeight: 'bold',
                    color: theme.palette.common.white,
                    textShadow: '2px 2px 10px rgba(0,0,0,0.3)'
                }}
            >
                ¡Estamos mejorando!
            </Typography>

            {/* Mensaje secundario más detallado */}
            <Typography
                variant="h6"
                sx={{
                    color: theme.palette.grey[200],
                    maxWidth: 800,
                    lineHeight: 1.6
                }}
            >
                Este módulo está temporalmente fuera de servicio
            </Typography>

            {/* Animación de carga + cohete */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Box
                    sx={{
                        fontSize: 50,
                        color: theme.customColors.yellow,
                        animation: 'bounce 2s infinite',
                        '@keyframes bounce': {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-25px)' },
                        }
                    }}
                >
                    <Construction fontSize="inherit" />
                </Box>
            </Box>

            {/* Botón de volver */}
            <Button
                variant="contained"
                color="secondary"
                sx={{
                    mt: 4,
                    borderRadius: 4,
                    px: 5,
                    py: 1.5,
                    fontWeight: 'bold',
                    background: theme.customColors.yellow,
                    textTransform: 'none',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
                    }
                }}
                onClick={() => navigate('/')}
            >
                Volver
            </Button>
        </Box>
    );
};

export default StandBy;
