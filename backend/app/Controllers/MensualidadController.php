<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\Clientes;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'public/PHPMailer/Exception.php';
require 'public/PHPMailer/PHPMailer.php';
require 'public/PHPMailer/SMTP.php';

class MensualidadController extends ResourceController
{
    protected $clientes;

    public function __construct()
    {
        $this->clientes = new Clientes();
        helper('text');
    }

    public function calcularMontoClienteParaRecibirNeto($montoNetoDeseado)
    {
        $comisionFija = 3.00;
        $porcentajeStripe = 0.036;
        $ivaPorcentaje = 0.16;

        $precioCliente = round(
            ($montoNetoDeseado + $comisionFija * (1 + $ivaPorcentaje)) / (1 - $porcentajeStripe * (1 + $ivaPorcentaje)),
            2
        );

        $comisionPorcentaje = round($precioCliente * $porcentajeStripe, 2);
        $iva = round(($comisionFija + $comisionPorcentaje) * $ivaPorcentaje, 2);
        $totalComisiones = round($comisionFija + $comisionPorcentaje + $iva, 2);

        return [
            'montoNetoDeseado' => $montoNetoDeseado,
            'precioClienteDebePagar' => $precioCliente,
            'comisionPorcentaje' => $comisionPorcentaje,
            'comisionFija' => $comisionFija,
            'iva' => $iva,
            'totalComisiones' => $totalComisiones,
        ];
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
            // 'montoNetoOriginal' => $montoNetoDeseado,
            // 'extra20porcientoComisiones' => $extra,
            // 'nuevoMontoNetoDeseado' => $nuevoNetoDeseado,
            // 'precioClienteDebePagar' => $precioCliente,
            // 'comisionPorcentaje' => $comisionPorcentaje,
            // 'comisionFija' => $comisionFija,
            // 'iva' => $iva,
            // 'totalComisiones' => $totalComisiones,
            // 'montoFinalRecibido' => $montoFinalRecibido,
        ];
    }

    public function validar()
    {
        $this->cors();

        $clave = $this->request->getJSON()->clave ?? '';
        if (!$clave) {
            return $this->respond(['ok' => false, 'title' => 'Campo obligatorio', 'info' => 'Por favor, ingresa un dato válido.']);
        }

        $idCliente = $this->clientes->existClave($clave);
        if ($idCliente === '0') {
            return $this->respond(['ok' => false, 'title' => 'Sin información', 'info' => 'Por favor, verifica que la información sea correcta.']);
        }

        if ($idCliente === 'duplicadoKeyFob') {
            return $this->respond(['ok' => false, 'title' => 'Información duplicada', 'info' => 'Se encontro una llave duplicada, por favor, ponte en contacto con Staff.']);
        }

        $cliente = $this->clientes->infoSocio($idCliente);
        if (!$cliente) {
            return $this->respond(['ok' => false, 'title' => 'Sin información', 'info' => 'Por favor, verifica que la información sea correcta.']);
        }

        /* VERIFICA QUE SE ENCUENTRE EN LA TABLA DE SOCIOOSDEUDA */
        $socioDeuda = $this->clientes->infoSocioDeuda($cliente['Id'], $cliente['KeyFob']);

        if (!$socioDeuda) {
            return $this->respond(['ok' => false, 'title' => 'Sin información', 'info' => 'Por favor,verifica con Staff tu status de pago.']);
        }
        // Análisis de deuda
        $statusSocio = $socioDeuda['StatusSocio'];
        $status = $socioDeuda['Status'];
        $saldo = floatval($socioDeuda['Saldo']);
        $costoMensualidad = floatval($socioDeuda['CostoMensualidad']);

        if ($status === 'Completado') {
            return $this->respond(['ok' => false, 'title' => 'Pago completado', 'info' => 'Por favor, espera la otra semana para consultar tus pagos, o puedes preguntar a Staff.']);
        }

        $precioComision = $this->calcularMontoClienteParaRecibirNetoConExtra($costoMensualidad ?? 0);

        return $this->respond([
            'ok' => true,
            'cliente' => [
                'Id' => $cliente['Id'],
                'Nombre' => $cliente['Nombre'] . ' ' . $cliente['Apellidos'],
                'Correo' => $cliente['Correo'],
                'Telefono' => $cliente['Telefono'] ?? null,
                'CostoMensualidad' => $precioComision['precioClienteDebePagar'],
                'CostoMensualidadOriginal' => $costoMensualidad,
                'Saldo' => $saldo,
                'Status' => $status,
                'Clave' => $cliente['KeyFob'],
                'GymId' => $cliente['GymId'],
                'statusSocio' => $statusSocio,
            ]
        ]);
    }

    /* METODO QUE OBTIENE EL MONTO ORIGINAL, LO MULTIPLICA POR LAS MENSUALIDADES, AGREGA COMISIONES Y DESGLOSE */
    public function infoMensualidad()
    {
        $this->cors();

        $data = $this->request->getJSON(true);

        /* EL PRECIO ORIGINAL LO MULTIPLICAMOS POR LOS MESES QUE VA A PAGAR */
        $total = $data['precioOriginal'] * $data['meses'];

        /* SE CALCULA PARA VER CUANTO SE VA A COBRAR */
        $calcularmontoClienteNeto = $this->calcularMontoClienteParaRecibirNetoConExtra($total);

        return json_encode([
            'precioOriginal' => $total,
            // 'precioConComision' => $data['precioConComision'],
            // 'mesesAdelantados' => $data['mesesAdelantados'],
            'meses' => $data['meses'],
            'precioClienteDebePagar' => $calcularmontoClienteNeto['precioClienteDebePagar'],
        ]);
    }

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
}
