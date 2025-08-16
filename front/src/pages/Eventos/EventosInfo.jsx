import React, { useState } from 'react';
import { Box, Grow, Dialog } from '@mui/material';

function EventosInfo() {
    const [open, setOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState('');

    const handleOpen = (src) => {
        setImgSrc(src);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setImgSrc('');
    };

    return (
        <>
            <Grow in={true} timeout={500}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    height="100%"
                >
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height="80%"
                        gap={4}
                    >
                        <Box
                            width="auto"
                            height="80%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            boxShadow={3}
                            borderRadius={2}
                            bgcolor="#fff"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => handleOpen('/img/BannerHortensias.jpg')}
                        >
                            <img
                                src="/img/PAGINA-CARRERA.png"
                                alt="CARRERA"
                                style={{ width: '90%', height: '95%', objectFit: 'fill', borderRadius: 8 }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Grow>
            <Dialog open={open} onClose={handleClose} maxWidth="md">
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={2}
                    bgcolor="#fff"
                >
                    {imgSrc && (
                        <img
                            src={imgSrc}
                            alt="Detalle"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                height: 'auto',
                                width: 'auto',
                                objectFit: 'contain',
                                borderRadius: 8
                            }}
                        />
                    )}
                </Box>
            </Dialog>
        </>
    );
}

export default EventosInfo;