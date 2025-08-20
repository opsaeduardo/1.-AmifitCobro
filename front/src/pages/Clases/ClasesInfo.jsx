import React, { useEffect, useState } from "react";
import { obtenerClases } from "../../api/Clases";
import { useNavigate } from "react-router-dom";
import StatusDialog from "../../components/common/StatusDialog";
import { useTheme } from "@mui/material/styles";
import { Typography, Stack, Grow, Box } from "@mui/material";
import ClasesCard from "./ClasesCard";
import ClasesSelected from "./ClasesSelected";

function ClasesInfo() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [clases, setClases] = useState([]);
    const [selectedClase, setSelectedClase] = useState(null);
    const [dialogState, setDialogState] = useState({
        open: false,
        status: "loading",
        title: "",
        message: "",
    });

    const fetchClases = async () => {
        const id = sessionStorage.getItem("selectedId");

        if (!id) {
            setDialogState({
                open: true,
                status: "error",
                title: "Error de sesión",
                message: "No se ha iniciado sesión, por favor, contacta al administrador",
            });
            return;
        }

        setDialogState({
            open: true,
            status: "loading",
            title: "Cargando clases...",
            message: "Por favor espere",
        });

        try {
            const response = await obtenerClases(id);

            if (response.status === "success") {
                setClases(response.data || []);
                setDialogState((prev) => ({ ...prev, open: false }));
            } else {
                setClases([]);
                setDialogState({
                    open: true,
                    status: "error",
                    title: "Error al cargar",
                    message: response.message || "No se pudieron obtener las clases",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            setClases([]);
            setDialogState({
                open: true,
                status: "error",
                title: "Error de conexión",
                message: "No se pudo conectar con el servidor, por favor, contacta al administrador",
            });
        }
    };

    useEffect(() => {
        fetchClases();
    }, []);

    const handleSelectClase = (clase) => {
        setSelectedClase(clase);
    };

    const handleCloseDialog = () => {
        setSelectedClase(null);
        fetchClases();
    };

    const handleConfirmReservation = () => {
        setSelectedClase(null);
    };

    return (
        <>
            <StatusDialog
                open={dialogState.open}
                status={dialogState.status}
                title={dialogState.title}
                message={dialogState.message}
                onClose={() => setDialogState((prev) => ({ ...prev, open: false }))}
            />

            <ClasesSelected
                open={Boolean(selectedClase)}
                clase={selectedClase}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmReservation}
                onRefresh={fetchClases}
            />

            <Grow in={true} timeout={800}>
                <Box sx={{
                    width: '95%',
                    height: '80%',
                    display: 'flex',
                    flexDirection: 'column', // Contenedor principal en columna
                    boxShadow: '0px 20px 15px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden', // Cambiado a hidden para evitar doble scroll
                }}>
                    {/* Título fijo */}
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 2,
                            fontWeight: "bold",
                            backgroundColor: theme.customColors.black,
                            color: 'white',
                            p: 1,
                            borderRadius: 2,
                            textAlign: 'center',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1 // Asegura que el título esté por encima
                        }}
                    >
                        {clases.length === 0 ? "Sin clases" : "Selecciona tu clase"}
                    </Typography>

                    {/* Contenedor de cards con scroll */}
                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        p: 2,
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 3,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            minHeight: 'min-content',
                        }}>
                            {clases.map((clase) => (
                                <ClasesCard
                                    key={clase.Id}
                                    clase={clase}
                                    onSelectClase={handleSelectClase}
                                    sx={{
                                        flex: '0 0 auto', // Evita que las cards se estiren
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Grow>
        </>
    );
}

export default ClasesInfo;