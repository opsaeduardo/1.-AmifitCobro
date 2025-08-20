import React, { useMemo } from "react";
import { Dialog, DialogContent, CircularProgress, Typography, IconButton, Stack, Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import { useTheme } from "@mui/material/styles";

const StatusDialog = ({
    open,
    onClose,
    status = "loading",
    title = "",
    message = "",
    showCloseButton = true,
    confirmButtonText = "Aceptar",
    onConfirm,
}) => {
    const theme = useTheme();

    const statusConfig = useMemo(
        () => ({
            loading: {
                icon: (
                    <CircularProgress
                        size={100}
                        thickness={4}
                        sx={{ color: theme?.customColors?.yellow || "#f4d100" }}
                    />
                ),
                color: theme?.customColors?.yellow || "#f4d100",
                defaultTitle: "Cargando...",
                defaultMessage: "",
                disableClose: true,
            },
            success: {
                icon: <CheckCircleIcon sx={{ fontSize: 100, color: "#4caf50" }} />,
                color: "#4caf50",
                defaultTitle: "Operación exitosa",
                defaultMessage: "La operación se completó correctamente.",
            },
            error: {
                icon: <ErrorIcon sx={{ fontSize: 100, color: "#ff5252" }} />,
                color: "#ff5252",
                defaultTitle: "Error",
                defaultMessage:
                    "No se pudo completar la operación. Por favor, contacte al administrador.",
            },
            info: {
                icon: <InfoIcon sx={{ fontSize: 100, color: "#2196f3" }} />,
                color: "#2196f3",
                defaultTitle: "Información",
                defaultMessage: "",
            },
            warning: {
                icon: <WarningIcon sx={{ fontSize: 100, color: "#ff9800" }} />,
                color: "#ff9800",
                defaultTitle: "Advertencia",
                defaultMessage: "Por favor, revise los datos ingresados.",
            },
        }),
        [theme]
    );

    const currentStatus = statusConfig[status] || statusConfig.info;

    const handleClose = (_, reason) => {
        if (currentStatus.disableClose) return;
        onClose?.();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            disableEscapeKeyDown={!!currentStatus.disableClose}
            sx={{
                "& .MuiDialog-paper": {
                    backgroundColor: theme?.customColors?.black || "#000",
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "30px",
                    boxShadow: "0px 5px 20px rgba(0,0,0,0.3)",
                    textAlign: "center",
                    minWidth: "320px",
                    position: "relative",
                },
            }}
        >
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "35px",
                }}
            >
                {showCloseButton && !currentStatus.disableClose && (
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "#fff",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}

                {currentStatus.icon}

                <Stack spacing={2}>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                        {title || currentStatus.defaultTitle}
                    </Typography>

                    {(message || currentStatus.defaultMessage) && (
                        <Typography variant="body1">
                            {message || currentStatus.defaultMessage}
                        </Typography>
                    )}
                </Stack>

                {!currentStatus.disableClose && (
                    <Stack direction="row" justifyContent="center" width="100%">
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: currentStatus.color,
                                color: status === "warning" ? "#000" : "#fff",
                                fontWeight: "bold",
                                padding: "10px 20px",
                                fontSize: "1rem",
                                minWidth: "120px",
                                "&:hover": {
                                    backgroundColor: currentStatus.color,
                                    opacity: 0.9,
                                },
                            }}
                            onClick={onConfirm || onClose}
                        >
                            {confirmButtonText}
                        </Button>
                    </Stack>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default StatusDialog;
