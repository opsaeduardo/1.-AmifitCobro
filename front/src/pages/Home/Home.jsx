import React from 'react';
import { Box, Fade } from '@mui/material';
import Mensualidad from '../Mensualidad/Mensualidad';
import { useNavigate } from 'react-router-dom';
import Productos from '../Productos/Productos';
import Clases from '../Clases/Clases';
import Entrenamiento from '../Entrenamiento/Entrenamiento';

function Home() {

    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: '95%',
                display: 'flex',
                gap: 4,
                alignItems: 'flex-start',
                height: '85%',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    height: '100%',
                    justifyContent: 'space-between',
                }}
            >
                <Fade in timeout={800}>
                    <Box sx={{ height: '30%' }}>
                        <Mensualidad />

                    </Box>
                </Fade>

                <Fade in timeout={1000}>
                    <Box sx={{ height: '30%' }}>
                        <Productos />

                    </Box>
                </Fade>

                <Fade in timeout={1200}>
                    <Box sx={{ height: '30%' }}>
                        <Clases />
                    </Box>
                </Fade>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    height: '100%',
                    justifyContent: 'space-between',
                }}
            >
                <Fade in timeout={1400}>
                    <Box sx={{ height: '30%' }}>
                        <Entrenamiento />
                    </Box>
                </Fade>

                <Fade in timeout={1600}>
                    <Box
                        sx={{
                            height: '65%',
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            backgroundColor: 'white',
                            borderRadius: '25px',
                        }}
                        onClick={() => navigate('/Eventos')}
                    >
                        <Box
                            component="img"
                            src="/img/EVENTOS.svg"
                            alt="Promociones"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                zIndex: 0,
                            }}
                        />

                        <Box sx={{ position: 'relative', width: '100%' }}>
                        </Box>
                    </Box>
                </Fade>


            </Box>
        </Box>
    )
}

export default Home;