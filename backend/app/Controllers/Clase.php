<?php

namespace App\Controllers;

use App\Models\Clases;
use DateTime;
use DateInterval;

class Clase extends BaseController
{

    public function obtenerClasesFecha()
    {
        header("Access-Control-Allow-Origin: http://localhost:3000");
        // header("Access-Control-Allow-Origin: https://cobro.amifit.mx");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        $inputData = $this->request->getJSON();

        $gymId = $inputData->gymId;

        if (empty($gymId)) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'El gymId es requerido'
            ])->setStatusCode(400);
        }

        $client = new Clases();
        $resultado = $client->obtenerClasesFecha($gymId);

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Clases obtenidas correctamente',
            'data' => $resultado
        ])->setStatusCode(200);
    }

    
}
