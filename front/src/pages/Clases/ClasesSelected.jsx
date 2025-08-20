import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Stack, Divider, Chip, Box, TextField, CircularProgress } from '@mui/material';
import { AccessTime, CalendarToday, Person } from '@mui/icons-material';
import { useTheme } from "@mui/material/styles";
import QRious from 'qrious';
import { guardarQR, infoCliente, inscripcionClase } from '../../api/Clases';
import StatusDialog from '../../components/common/StatusDialog';

const ClasesSelected = ({ open, clase, onClose, onRefresh }) => {
    const theme = useTheme();
    const [clave, setClave] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [socioData, setSocioData] = useState(null);
    const [recargando, setRecargando] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (open) {
            setClave('');
            setError('');
            setSocioData(null);
            setLoading(false);
            setQrDataUrl(null);
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
        }
    }, [open]);

    const handleFinalizar = () => {
        if (onRefresh) onRefresh();
        onClose();
    };

    const generateQR = (inscripcionId) => {
        const qr = new QRious({
            value: `ClasesController/consultarClaseRegistro/${inscripcionId}`,
            size: 200,
            backgroundAlpha: 1,
            foreground: "#10295B",
            background: "white",
            foregroundAlpha: 1,
            level: "H"
        });
        return qr.toDataURL();
    };

    const handleSubmit = async () => {
        if (!clave.trim()) {
            setError('Por favor ingresa tu LLAVE de socio.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const gymId = sessionStorage.getItem('selectedId');
            const idClase = clase.Id;

            const socioResponse = await infoCliente(gymId, clave);
            
            if (!socioResponse) {
                setError('No se encontró información.');
                return;
            }

            if (socioResponse === 'KeyFobDuplicada') {
                setError('La KeyFob está duplicada, por favor, ponte en contacto con Staff.');
                return;
            }

            const inscripcionResponse = await inscripcionClase(
                socioResponse.Id,
                idClase,
            );

            if (inscripcionResponse === "SocioInscrito") {
                setError('Ya estás inscrito en esta clase.');
                return;
            }
            if (inscripcionResponse === "ErrorGuardar") {
                setError('Hubo un error al guardar la inscripción.');
                return;
            }

            const qrData = generateQR(inscripcionResponse);
            setQrDataUrl(qrData);

            await guardarQR(
                socioResponse.Id,
                inscripcionResponse,
                qrData,
                socioResponse.Correo,
                `${socioResponse.Nombre} ${socioResponse.Apellidos}`,
                clase.Clase,
                `${clase.Nombre} ${clase.Apellidos}`,
                clase.Dia,
                clase.HoraInicio,
                clase.HoraTermino,
            );

            setSocioData({
                id: socioResponse.Id,
                nombre: socioResponse.Nombre,
                apellidos: socioResponse.Apellidos,
                correo: socioResponse.Correo,
                telefono: socioResponse.Telefono,
                clave: socioResponse.Clave,
                inscripcionId: inscripcionResponse
            });

        } catch (error) {
            console.error('Error al inscribirse en la clase:', error);
            setError(error.response?.data?.message || error.message || 'Error en el proceso');
        } finally {
            setLoading(false);
        }
    };

    if (!clase) return null;

    return (
        <>
            <Dialog
                open={open}
                onClose={() => {
                    if (onRefresh) onRefresh();
                    onClose();
                }}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(2px)',
                            width: '70%',
                            maxWidth: '700px',
                            p: 2,
                            boxShadow: '0px 5px 20px rgb(0, 0, 0)'
                        }
                    }
                }}
            >

                <DialogContent sx={{ py: 1 }}>
                    <Box sx={{
                        backgroundColor: (theme.customColors.black),
                        color: 'white',
                        p: 2,
                        mb: 2,
                        textAlign: 'center',
                        borderRadius: '16px 16px 0 0',
                    }}>
                        <Typography variant="h5" fontWeight={'bold'}>
                            {clase.Clase}
                        </Typography>
                    </Box>
                    {/* <Typography variant="h6">
                        INSTRUCTOR: {clase.Nombre} {clase.Apellidos}
                        </Typography> */}

                    <Stack spacing={2} sx={{ mt: 2 }}>

                        <Box
                            textAlign={'center'}
                            gap={1}
                            sx={{
                                backgroundColor: theme.customColors.yellow,
                                fontSize: '1.1rem',
                                px: 1.5,
                                py: 0.5,
                                fontWeight: 'bold',
                                color: theme.customColors.black,
                            }}
                        >
                            <Person fontSize="small" />
                            {`Instructor: ${clase?.Nombre} ${clase?.Apellidos}`}
                        </Box>

                        <Stack direction="row" spacing={2} alignItems="center">
                            <CalendarToday sx={{ color: theme.customColors.black }} />
                            <Typography>
                                {new Date(`${clase.Dia}T12:00:00-06:00`).toLocaleDateString('es-MX', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    timeZone: 'America/Mexico_City'
                                }).replace(/^\w/, c => c.toUpperCase())}
                            </Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center">
                            <AccessTime sx={{ color: theme.customColors.black }} />
                            <Typography>
                                {clase.HoraInicio.slice(0, 5)} hrs - {clase.HoraTermino.slice(0, 5)} hrs
                            </Typography>
                        </Stack>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    {!socioData && (
                        <Box>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                }}
                            >
                                <Typography variant="body1" fontSize={"1.1rem"} mt={2} mb={2}>
                                    Para reservar, ingresa tu llave de socio:
                                </Typography>
                                <TextField
                                    inputRef={inputRef}
                                    fullWidth
                                    label="LLAVE"
                                    variant="outlined"
                                    value={clave}
                                    slotProps={{
                                        input: {
                                            maxLength: 10
                                        }
                                    }}
                                    onChange={(e) => {
                                        setClave(e.target.value.replace(/\s/g, ''));
                                        setError('');
                                    }}
                                    error={!!error}
                                    helperText={error || ' '}
                                    autoComplete="off"
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'black',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'black',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'black',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'black',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: 'black',
                                        },
                                    }}
                                />
                            </form>
                        </Box>
                    )}

                    {socioData && (
                        <Box>
                            {/* <Typography variant="h6" fontWeight="bold" color="#4caf50" mb={1}>
                                {socioData?.nombre} {socioData?.apellidos}, has reservado la clase:
                            </Typography> */}
                            <Typography variant="h6">

                            </Typography>
                            <Box sx={{
                                backgroundColor: 'rgb(211, 211, 211)',
                                textAlign: 'center',
                                p: 1,
                            }}>
                                <Typography textAlign={'center'} variant='h6' m={1}>
                                    Inscripción exitosa {socioData?.nombre}
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 3,
                                    alignItems: 'center',
                                }}>
                                    <Box sx={{
                                        flex: 1,
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        {qrDataUrl && (
                                            <Box textAlign="center">
                                                <img src={qrDataUrl} alt="Código QR" style={{ maxWidth: 200 }} />
                                            </Box>
                                        )}
                                    </Box>
                                    <Box sx={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                    }}>
                                        <Typography textAlign={'center'} variant="body1" fontSize="1.1rem">
                                            Se ha mandado un correo electrónico a la siguiente dirección:
                                        </Typography>
                                        <Typography m={1} color='#4caf50' fontWeight={'bold'} variant="body1" fontSize="1.1rem">
                                            {socioData?.correo}
                                        </Typography>
                                        <Typography variant="body1" fontSize="1.1rem">
                                            Por favor, toma captura del código QR, es tu pase a la clase.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    {!socioData ? (
                        <>
                            <Button
                                sx={{
                                    backgroundColor: theme.customColors.black, color: 'white', fontWeight: 'bold', minWidth: '120px'
                                }}
                                onClick={() => {
                                    if (onRefresh) onRefresh();
                                    onClose();
                                }}
                                variant="contained"
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading || clase.Inscritos?.length >= 10}
                                sx={{
                                    backgroundColor: theme.customColors.yellow,
                                    color: theme.customColors.black,
                                    fontWeight: 'bold',
                                    minWidth: '120px'
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Reservar'}
                            </Button>
                        </>
                    ) : (
                        <Button
                            fullWidth
                            variant="text"
                            onClick={handleFinalizar}
                            sx={{
                                backgroundColor: theme.customColors.black,
                                color: 'white',
                                borderRadius: '0 0 16px 16px',
                                p: 2,
                                mb: 2,
                            }}
                        >
                            Finalizar
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};


export default ClasesSelected;