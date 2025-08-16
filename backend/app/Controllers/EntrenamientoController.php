<?php

namespace App\Controllers;

use App\Models\EntrenamientoModel;

require 'public/PHPMailer/Exception.php';
require 'public/PHPMailer/PHPMailer.php';
require 'public/PHPMailer/SMTP.php';

class EntrenamientoController extends BaseController
{

    private function cors(): void
    {
        header('Access-Control-Allow-Origin: http://localhost:3000');
        // header('Access-Control-Allow-Origin: https://cobro.amifit.mx');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }

    public function calcularMontoClienteParaRecibirNetoConExtra($montoNetoDeseado)
    {
        $comisionFija = 3.00;
        $porcentajeStripe = 0.036;
        $ivaPorcentaje = 0.16;

        // Paso 1: Calcular comisiones con el neto deseado original
        $precioClienteBase = round(
            ($montoNetoDeseado + $comisionFija * (1 + $ivaPorcentaje)) / (1 - $porcentajeStripe * (1 + $ivaPorcentaje)),
            2
        );

        $comisionPorcentajeBase = round($precioClienteBase * $porcentajeStripe, 2);
        $ivaBase = round(($comisionFija + $comisionPorcentajeBase) * $ivaPorcentaje, 2);
        $totalComisionesBase = round($comisionFija + $comisionPorcentajeBase + $ivaBase, 2);

        // Paso 2: Agregar 20% adicional de las comisiones al neto deseado
        $extra = round($totalComisionesBase * 0.20, 2);
        $nuevoNetoDeseado = $montoNetoDeseado + $extra;

        // Paso 3: Recalcular comisiones con el nuevo neto deseado
        $precioCliente = round(
            ($nuevoNetoDeseado + $comisionFija * (1 + $ivaPorcentaje)) / (1 - $porcentajeStripe * (1 + $ivaPorcentaje)),
            2
        );

        $comisionPorcentaje = round($precioCliente * $porcentajeStripe, 2);
        $iva = round(($comisionFija + $comisionPorcentaje) * $ivaPorcentaje, 2);
        $totalComisiones = round($comisionFija + $comisionPorcentaje + $iva, 2);

        // Paso 4: Monto real que terminarás recibiendo después de comisiones
        $montoFinalRecibido = round($precioCliente - $totalComisiones, 2);

        return [
            'MontoNetoDeseado' => $nuevoNetoDeseado,
            'precioClienteDebePagar' => $precioCliente,
            'comisionPorcentaje' => $comisionPorcentaje,
            'comisionFija' => $comisionFija,
            'iva' => $iva,
            'totalComisiones' => $totalComisiones,

            'montoNetoOriginal' => $montoNetoDeseado,
            'extra20porcientoComisiones' => $extra,
            'montoFinalRecibido' => $montoFinalRecibido,
        ];
    }

    public function entrenamientoCostos()
    {
        $this->cors();
        $data = $this->request->getJSON(true);

        $model = new EntrenamientoModel();
        $gymId = $data['GymId'] ?? null;

        if (!$gymId) {
            return json_encode([
                'status' => 'error',
                'message' => 'Falta información para obtener los costos',
                'data' => []
            ]);
        }

        $costos = $model->entrenamientoCostos($gymId);

        // Procesar cada paquete para calcular el precio neto
        $paquetesProcesados = array_map(function ($item) {
            $precioNeto = $this->calcularMontoClienteParaRecibirNetoConExtra($item['PrecioTotal'] ?? 0);

            return [
                'Id' => $item['Id'] ?? null,
                'Concepto' => $item['Concepto'] ?? null,
                'TotalSesiones' => $item['TotalSesiones'] ?? null,
                'PrecioTotal' => floatval($precioNeto["precioClienteDebePagar"] ?? 0), // Precio calculado
                'PrecioOriginal' => floatval($item['PrecioTotal'] ?? 0), // Precio original
                'Club' => $item['Club'] ?? null,
                'Ventas' => $item['Ventas'] ?? null,
                'CoachTotal' => $item['CoachTotal'] ?? null,
                'CoachClase' => $item['CoachClase'] ?? null,
                'Vigencia' => $item['Vigencia'] ?? null,
                'Descuento' => $item['Descuento'] ?? null,
                'Tipo' => $item['Tipo'] ?? null,
                'GymId' => $item['GymId'] ?? null,
                'Status' => $item['Status'] ?? null
            ];
        }, $costos);

        return json_encode([
            'status' => 'success',
            'message' => 'Costos obtenidos correctamente',
            'data' => $paquetesProcesados
        ]);
    }
}
