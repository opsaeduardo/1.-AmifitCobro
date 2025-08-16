<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\Participantes;
use CodeIgniter\BaseModel;
use Stripe\StripeClient;

require 'vendor/autoload.php';

class Stripe extends BaseController
{

    public function __construct()
    {
        header("Access-Control-Allow-Origin: http://localhost:3000");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }

    public function createSession()
    {

        $monto = $this->request->getVar('monto');

        $id = $this->request->getVar('id');
        $tipoPago = $this->request->getVar('tipoPago');
        // $gymId = $this->request->getVar('gymId');
        // $descripcion = $this->request->getVar('descripcion');
        // $correo = $this->request->getVar('correo');
        // $nombre = $this->request->getVar('nombre');
        // $apellido = $this->request->getVar('apellido');
        // $sexo = $this->request->getVar('sexo');
        // $talla = $this->request->getVar('talla');
        // $edad = $this->request->getVar('edad');

        //return json_encode("desde controller stripe: " . $gymId);

        $stripe = new StripeClient([
            // PRODUCCION
            "api_key" => env('SECRET_KEY'),
        ]);

        $checkout_session = $stripe->checkout->sessions->create([
            //'payment_method_types' => ['card', 'oxxo'],
            'payment_method_types' => [$tipoPago],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'MXN',
                    'product_data' => [
                        'name' => 'VAMOS ANCIANOS',
                    ],
                    'unit_amount' => $monto,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'ui_mode' => 'embedded',
            'return_url' => base_url() . "?StripePasarela_ID={CHECKOUT_SESSION_ID}&idSocio=$id",
            // 'return_url' => base_url() . "?StripePasarela_ID={CHECKOUT_SESSION_ID}&idSocio=$id&descripcion=$descripcion&correo=$correo&talla=$talla&edad=$edad",
            'metadata' => [
                'id' => $id,
                // 'nombre' => $nombre,
                // 'apellido' => $apellido,
                // 'correo' => $correo,
                // 'sexo' => $sexo,
                // 'monto' => $monto,
                // 'descripcion' => $descripcion,
                // 'gymId' => $gymId,
                // 'edad' => $edad,
                // 'talla' => $talla
            ],
            'payment_intent_data' => [
                'metadata' => [
                    'id' => $id,
                    // 'nombre' => $nombre,
                    // 'apellido' => $apellido,
                    // 'correo' => $correo,
                    // 'edad' => $edad,
                    // 'sexo' => $sexo,
                    // 'monto' => $monto,
                    // 'descripcion' => $descripcion,
                    // 'gymId' => $gymId,
                    // 'talla' => $talla
                ]
            ]
        ]);
        echo json_encode(array('clientSecret' => $checkout_session->client_secret));
    }

    public function estadoStripe()
    {
        try {
            $stripe = new StripeClient([
                "api_key" => env('SECRET_KEY'),
            ]);
            $id = $this->request->getVar('id');
            $session = $stripe->checkout->sessions->retrieve($id);
            echo json_encode([
                $session

            ]);
            http_response_code(200);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function createPaymentLink()
    {

        $inputData = $this->request->getJSON();

        // return json_encode($inputData);

        $id = $inputData->id;
        $monto = $inputData->monto;
        $descripcion = $inputData->descripcion;
        
        $monto = $monto * 100;

        $data=[
            'id' => $id,
            'monto' => $monto,
            'descripcion' => $descripcion

        ];


        $stripe = new StripeClient([
            "api_key" => env('SECRET_KEY'),
        ]);

        $price = $stripe->prices->create([
            'unit_amount' => $monto,
            'currency' => 'mxn',
            'product_data' => [
                'name' => $descripcion,
            ],
        ]);

        $paymentLinkStripe = $stripe->paymentLinks->create([
            'line_items' => [
                [
                    'price' => $price->id,
                    'quantity' => 1,
                ],
            ],
            'metadata' => [
                'id' => $id,
                'puntoventa' => 'true',
            ],
            'restrictions' => ['completed_sessions' => ['limit' => 1]],
            'inactive_message' => 'Lo sentimos, el enlace de pago ya no es válido.',
            'after_completion' => [
                'type' => 'redirect',
                'redirect' => [
                    'url' => base_url() . "pago-exitoso?idSocioLink=" . $id,
                    
                    // 'url' => base_url("/pago-exitoso?idSocioLink=" . $id),
                ],
            ],
        ]);
        /* QUEDA PENDIENTE EL ATRAPAR IDSOCIOLINK PARA PODRR ACTUALIZAR URL DE PAGO */

        // Devolver el nuevo enlace de pago
        echo json_encode([
            'paymentLink' => $paymentLinkStripe->url,
            'paymentLinkId' => $paymentLinkStripe->id,
            'debug_redirect' => $paymentLinkStripe->after_completion->redirect->url
        ]);
    }

    public function deactivatePaymentLink()
    {
        // Obtener el ID del enlace de pago desde la solicitud
        $paymentLinkId = $this->request->getVar('paymentLinkId');

        try {
            // Crear una instancia del cliente de Stripe
            $stripe = new \Stripe\StripeClient(env('SECRET_KEY'));

            // Desactivar el enlace de pago
            $updatedLink = $stripe->paymentLinks->update(
                $paymentLinkId,
                ['active' => false]
            );

            // Retornar respuesta exitosa
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'El enlace de pago se desactivó correctamente.',
                'link' => $updatedLink
            ]);
        } catch (\Exception $e) {
            // Manejar errores y retornar respuesta
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Error al desactivar el enlace de pago: ' . $e->getMessage()
            ]);
        }
    }

}
