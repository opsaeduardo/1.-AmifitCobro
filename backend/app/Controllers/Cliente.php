<?php

namespace App\Controllers;

use App\Models\Clientes;
use App\Models\Gimnasio;
use App\Models\Usuarios;
use App\Controllers\Contacto;
use App\Controllers\ContratosPDF;
use App\Models\Clases;
use App\Models\ClasesModel;

class Cliente extends BaseController
{


    public function __construct()
    {
        // header("Access-Control-Allow-Origin: https://cobro.amifit.mx");
        header("Access-Control-Allow-Origin: http://localhost:3000");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }

    // METODO QUE AGREGA EL CLIENTE DE PASE DE 7 DIAS
    public function agregarClientePase7Dias()
    {
        // Permitir CORS solo para el origen de tu React app
        header("Access-Control-Allow-Origin: https://cobro.amifit.mx");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");

        // Responder a la solicitud de preflight (OPTIONS)
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
        return $this->response->setJSON(['rol' => session('Rol')]);


        $inputData = $this->request->getJSON();
    }

    /* CONSULTA LA INFORMACION DEL CLIENTE POR MEDIO DE LA CLAVE */
    public function infoCliente()
    {
        $clientes = new Clientes();

        $inputData = $this->request->getJSON();

        $gymId = $inputData->gymId;
        $clave = $inputData->clave;

        $infoCliente = $clientes->infoCliente($gymId, $clave);
        return json_encode($infoCliente);
    }

    /* INSCRIPCION Y CORREO ELECTRONICO */
    public function inscripcionClase()
    {
        $participante = new clientes();

        $claseModel = new Clases();

        $clasesModel = new ClasesModel();

        $inputData = $this->request->getJSON();

        $idCliente = $inputData->idCliente;
        $idClase = $inputData->idClase;

        $data = [
            'IdCliente' => $idCliente,
            'IdControldeasistencia' => $idClase,
        ];

        /* VERIFICA SI YA SE REGISTRO PREVIAMENTE */
        $inscripcionExistente = $claseModel->consultarInscripcion($idClase, $idCliente);

        if (!empty($inscripcionExistente)) {
            return json_encode('SocioInscrito');
        }

        $responseInscripcion = $claseModel->inscripcionClase($data);

        $clase = $clasesModel->obtenerClaseAsistencia($idClase);

        if ($clase) {
            $actualizado = $clasesModel->incrementarSocios($idClase);
        }

        if ($responseInscripcion > 0) {
            return json_encode($responseInscripcion);
        } else {
            return json_encode('ErrorGuardar');
        }
    }

    public function guardarQR()
    {
        $inputData = $this->request->getJSON();
        $contacto = new Contacto();

        $idCliente = $inputData->idCliente;
        $responseInscripcion = $inputData->idInscripcion;
        $img = $inputData->qrUrl;

        $correo = $inputData->correo;
        $nombreSocio = $inputData->nombre;
        $clase = $inputData->clase;
        $nombreInstructor = $inputData->nombreInstructor;
        $dia = $inputData->dia;
        $horaInicio = $inputData->horaInicio;
        $horaFin = $inputData->horaFin;

        /* SE GUARDA EL QR */
        $img = str_replace('data:image/png;base64,', '', $img);
        $img = str_replace(' ', '+', $img);
        $data = base64_decode($img);
        $directory = './public/img/sociosClase/' . $idCliente;
        // $directory = './public/img/sociosClase/' . $idCliente . '/' . $responseInscripcion;
        if (!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }
        $file = $directory . '/' . $responseInscripcion . '.png';
        $success = file_put_contents($file, $data);
        if ($success) {
            $correoResp = $contacto->correoInscripcionClase($correo, $nombreSocio, $nombreInstructor, $clase, $dia, $horaInicio, $horaFin, $idCliente, $responseInscripcion);
            if ($correoResp["status"] == 0) {
                return json_encode(['status' => 'CorreoFallido', 'idInscripcion' => $responseInscripcion, 'error' => $correoResp["message"]]);
            }

            return json_encode(['status' => 'CorreoEnviado', 'idInscripcion' => $responseInscripcion]);
        }
    }
}
