import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL?.endsWith('/')
    ? process.env.REACT_APP_API_URL
    : process.env.REACT_APP_API_URL + '/';

// METODO QUE OBTIENE LAS CLASES DE UN GIMNASIO
export const obtenerClases = async (id) => {
    try {
        const response = await axios.post(
            `${API_URL}Clase/obtenerClasesFecha`,
            { gymId: id },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al obtener las clases:", error);
        throw error;
    }
};

/* GENERA LA IMG DEL QR EN LA CARPETA DEL SERVIDOR */
export const guardarQR = async (idCliente, idInscripcion, qrUrl, correo, nombre, clase, nombreInstructor, dia, horaInicio, horaFin,) => {
    try {
        const response = await axios.post(
            `${API_URL}Cliente/guardarQR`,
            { idCliente: idCliente, idInscripcion: idInscripcion, qrUrl: qrUrl, correo: correo, nombre: nombre, clase: clase, nombreInstructor: nombreInstructor, dia: dia, horaInicio: horaInicio, horaFin: horaFin },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al obtener las clases:", error);
        throw error;
    }
};

// OBTENER LOS DATOS DEL CLIENTE POR ID Y GYMID
export const infoCliente = async (gymId, clave) => {
    try {
        const response = await axios.post(
            `${API_URL}Cliente/infoCliente`,
            { clave: clave, gymId: gymId },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al obtener las clases:", error);
        throw error;
    }
};

/* INGRESA LA INSCRIPCION POR ID Y GYMID */
export const inscripcionClase = async (idCliente, idClase,) => {
    try {
        const response = await axios.post(
            `${API_URL}Cliente/inscripcionClase`,
            { idCliente: idCliente, idClase: idClase },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al obtener las clases:", error);
        throw error;
    }
};