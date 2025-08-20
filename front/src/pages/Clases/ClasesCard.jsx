import React from "react";
import { AccessTime, CalendarToday, Person } from '@mui/icons-material';
import { Typography, Card, CardContent, Stack, Divider, Button, Box, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ClasesCard = ({ clase, onSelectClase }) => {
    const theme = useTheme();

    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: 300,
                borderRadius: '12px',
                mb: 4,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                    boxShadow: '0 6px 24px rgba(0,0,0,0.15)'
                }
            }}
        >
            <CardContent sx={{
                backgroundColor: theme.customColors.black,
                color: 'white',
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1,
                }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ flex: 1, pr: 1 }}>
                        {clase.Clase}
                    </Typography>
                    <Chip
                        label={clase.Inscritos?.length >= 10 ? 'No disponible' : 'Disponible'}
                        size="small"
                        sx={{
                            backgroundColor: clase.Inscritos?.length >= 10 ? 'red' : theme.customColors.yellow,
                            color: clase.Inscritos?.length >= 10 ? 'white' : theme.customColors.black,
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            flexShrink: 0,
                        }}
                    />
                </Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                    {clase.Nombre} {clase.Apellidos}
                </Typography>
            </CardContent>
            <CardContent sx={{ padding: '16px' }}>
                <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarToday sx={{ color: (theme.customColors.black), fontSize: '1rem' }} />
                        <Typography variant="body2">
                            {new Date(`${clase.Dia}T12:00:00-06:00`).toLocaleDateString('es-MX', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                timeZone: 'America/Mexico_City'
                            }).replace(/^\w/, c => c.toUpperCase())}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTime sx={{ color: '#10295B', fontSize: '1rem' }} />
                        <Typography variant="body2">
                            {clase.HoraInicio.slice(0, 5)} hrs - {clase.HoraTermino.slice(0, 5)} hrs
                        </Typography>
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    <Stack direction="row" spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Person sx={{ color: '#10295B', fontSize: '1rem' }} />
                            <Typography variant="body2">
                                {clase.Inscritos?.length || 0} Inscritos
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>

                {clase.Inscritos?.length >= 10 ? (
                    <Button
                        disabled
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            backgroundColor: '#D0FF08',
                            color: '#10295B',
                            fontWeight: 'bold',
                            py: 1,
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: '#b8e600',
                            }
                        }}
                    >
                        Reservar
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            backgroundColor: (theme.customColors.yellow),
                            color: (theme.customColors.black),
                            fontWeight: 'bold',
                            py: 1,
                            borderRadius: '8px',
                        }}
                        onClick={() => onSelectClase(clase)}
                    >
                        Reservar
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default ClasesCard;