<?php

namespace App\Controllers;

use App\Models\Caja;
use App\Models\Cierre;
use CodeIgniter\RESTful\ResourceController;
use App\Models\Clientes;
use App\Models\Inventarios;
use App\Models\Pago;
use App\Models\PagosStandby;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Stripe\StripeClient;

require 'public/PHPMailer/Exception.php';
require 'public/PHPMailer/PHPMailer.php';
require 'public/PHPMailer/SMTP.php';

class KeyfobController extends ResourceController
{
    /** @var Clientes   */
    public $clientes;
    /** @var Inventarios */
    public $inventarios;

    public function __construct()
    {
        $this->clientes    = new Clientes();
        $this->inventarios = new Inventarios();
        helper('text');
    }

    public function index()
    {
        return view('compra/index');
    }

    /* METODO QUE TRAE EL CLIENTE */
    public function cliente()
    {
        $this->cors();

        $resp = $this->request->getJSON();
        $clave = $resp->cliente ?? null;

        if (!$clave) {
            return $this->respond(['ok' => false, 'error' => 'Por favor, ingresa la información requerida.']);
        }

        $idCliente = $this->clientes->existClave($clave);
        if ($idCliente === '0') {
            return $this->respond(['ok' => false, 'error' => 'No se encontró información.']);
        }

        if ($idCliente === 'duplicadoKeyFob') {
            return $this->respond(['ok' => false, 'error' => 'Se encontro una llave duplicada, por favor, ponte en contacto con Staff.']);
        }

        $cliente = $this->clientes->infoSocio($idCliente);
        if (!$cliente) {
            return $this->respond(['ok' => false, 'error' => 'Socio no disponible.']);
        }

        return $this->respond([
            'cliente' => [
                'Id'       => $cliente['Id'],
                'Nombre'   => $cliente['Nombre'] . ' ' . $cliente['Apellidos'],
                'Correo'   => $cliente['Correo'],
                'Telefono' => $cliente['Telefono'] ?? null,
                'GymId'    => $cliente['GymId'],
                'Clave'    => $cliente['KeyFob'],
                'KeyFob'   => $cliente['KeyFob'] ?? null,
            ]
        ]);
    }

    /* METODO QUE TRAE LOS PRODCUTOS */
    public function productos()
    {
        $this->cors();

        $resp = $this->request->getJSON();
        $id = $resp->id ?? null;

        if (!$id) {
            return $this->fail(['message' => 'Falta el ID del gimnasio.', 'code' => 422]);
        }

        $productos = ['KeyFob', ($id == 2 ? 'Toallas' : 'Toalla'), 'Cordón'];
        $inventario = $this->inventarios
            ->whereIn('Producto', $productos)
            ->where('GymId', $id)
            ->select('Id, Producto, Precio, Cantidad, Img')
            ->findAll();

        if (empty($inventario)) {
            return $this->respond([
                'productos' => []
            ]);
        }

        $productosRespuesta = [];
        foreach ($productos as $nombreProducto) {
            $item = null;
            foreach ($inventario as $inv) {
                if ($inv['Producto'] === $nombreProducto) {
                    $item = $inv;
                    break;
                }
            }
            $precioComision = $this->calcularMontoClienteParaRecibirNetoConExtra($item['Precio'] ?? 0);

            $productosRespuesta[] = [
                'Producto' => $nombreProducto,
                'Id'       => $item['Id']       ?? null,
                'Precio'   => floatval($precioComision["precioClienteDebePagar"])   ?? null,
                'PrecioOriginal' => floatval($item['Precio']) ?? null,
                'Cantidad' => $item['Cantidad'] ?? null,
                'Img'      => $item['Img']      ?? null,
            ];
        }

        return $this->respond([
            'productos' => $productosRespuesta
        ]);
    }

    /* -----------------------------------------------------------
       CORS helper
    ----------------------------------------------------------- */
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

    //SOLO EL TOTAL
    public function calcularNetoRecibido($precio)
    {
        $comisionFija = 3.00;
        $porcentajeStripe = 0.036;
        $ivaPorcentaje = 0.16;

        $comisionPorcentaje = round($precio * $porcentajeStripe, 2);
        $iva = round(($comisionFija + $comisionPorcentaje) * $ivaPorcentaje, 2);
        $montoNeto = round($precio - $comisionFija - $comisionPorcentaje - $iva, 2);

        return [
            'montoOriginal' => $precio,
            'comisionPorcentaje' => $comisionPorcentaje,
            'comisionFija' => $comisionFija,
            'iva' => $iva,
            'totalComisiones' => $comisionFija + $comisionPorcentaje + $iva,
            'montoNetoRecibido' => $montoNeto,
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


    // TOTAL MAS COMISIONES
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

    /* 12,199.95 recibo 11,687.00 */
    public function calcularMontoCliente()
    {
        $calcularNetoRecibido = $this->calcularNetoRecibido(12307.01);

        $calcularMontoClienteParaRecibirNeto = $this->calcularMontoClienteParaRecibirNeto(12307.01);

        $calcularMontoClienteParaRecibirNetoConExtra = $this->calcularMontoClienteParaRecibirNetoConExtra(12307.01);

        return $this->response->setJSON([
            'calcularNetoRecibido' => $calcularNetoRecibido,
            'calcularMontoClienteParaRecibirNeto' => $calcularMontoClienteParaRecibirNeto,
            'calcularMontoClienteParaRecibirNetoConExtra' => $calcularMontoClienteParaRecibirNetoConExtra
        ]);
    }

    public function startPayment()
    {
        $this->cors();
        $d = $this->request->getJSON(true);

        if (!isset($d['clienteId'], $d['importe'], $d['tipoPago'], $d['gymId'], $d['concepto'], $d['PrecioOriginal'])) {
            return $this->failValidationError('Faltan datos');
        }

        $concepto = trim($d['concepto']);
        $stripe   = new StripeClient(env('SECRET_KEY'));
        $precioConComision  = (int) ($d['importe'] * 100);

        $price = $stripe->prices->create([
            'unit_amount'  => $precioConComision,
            'currency'     => 'mxn',
            'product_data' => ['name' => 'Compra ' . $concepto]
        ]);

        /* DATOS GENERALES */
        $idCliente = $d['clienteId'];
        $tipoPago = "Tarjeta";
        $msi = "Stripe";
        $gymid = $d['gymId'];

        $concepto = trim($d['concepto']);

        $map = [
            'Mensualidad' => [
                'cantidad' => '',
                'area'     => 'MembresÍa',
                'status'   => '',
                'IdCliente' => $d["Clave"]
            ],
            'KeyFob' => [
                'cantidad' => '1',
                'area'     => 'Producto',
                'status'   => 'NoEdge',
                'IdCliente' => $d["Clave"]
            ],
            'Cordón' => [
                'cantidad' => '1',
                'area'     => 'Producto',
                'status'   => '',
                'IdCliente' => 'No Aplica'
            ],
            'Toalla' => [
                'cantidad' => '1',
                'area'     => 'Producto',
                'status'   => '',
                'IdCliente' => 'No Aplica'
            ],
            'Toallas' => [
                'cantidad' => '1',
                'area'     => 'Producto',
                'status'   => '',
                'IdCliente' => 'No Aplica'
            ]
        ];

        $aux = strtolower($concepto);

        if (strpos($aux, 'entrenamiento') !== false) {
            $map[$concepto] = [
                'cantidad'  => '0',
                'area'      => 'Servicio',
                'status'    => '',
                'IdCliente' => $d["Clave"]
            ];
        }

        if (isset($map[$concepto])) {
            $cantidad = $map[$concepto]['cantidad'];
            $area     = $map[$concepto]['area'];
            $status   = $map[$concepto]['status'];
            $idCliente = $map[$concepto]['IdCliente'];
        } else {
            $cantidad = '';
            $area     = '';
            $status   = '';
            $idCliente = 'No Aplica';
            return json_encode('ConceptoNoVálido');
        }

        $caja = '';

        $nuevaHora = mktime(date("H") - 1);

        $desglose = $this->calcularNetoRecibido($precioConComision / 100);

        $montoNeto = $desglose['montoNetoRecibido'];

        $totalRetenciones = $desglose['totalComisiones'];

        $precioConComisionFormateado = $precioConComision / 100;

        $data = [
            'GymId' => $gymid,
            'IdCliente' => $idCliente,
            'concepto' => $concepto,
            'importe' => $montoNeto, //NETO DEL PRECIO CON COMISION
            'total' => $precioConComisionFormateado,
            'TotalSinComision' => $d["PrecioOriginal"],
            'Retencion' => $totalRetenciones, // TOTAL DE COMISIONES
            'PorcentajeRetencion' => $montoNeto - $d["PrecioOriginal"],
            'tipopago' => $tipoPago,
            'IVA' => '',
            'msi' => $msi,
            'TipoTarjeta' => 'Crédito',
            'cantidad' => $cantidad,
            'fecha' => date('Y-m-d h:i:s', $nuevaHora),
            'observaciones' => 'Pago desde Stripe',
            'area' => $area,
            'status' => $status
        ];

        $pago = new Pago();

        /* MODEL PAGO STANDBY */
        $IdAgregado = $pago->agregarNuevoPagoStandBy($data);

        $caja = "Standby";

        /* SE CREA EN PAYMENT LINK */
        $paymentLink = $stripe->paymentLinks->create([
            'line_items' => [
                [
                    'price' => $price->id,
                    'quantity' => 1,
                ],
            ],
            'metadata' => [
                'id' => $d['clienteId'],
                'puntoventa' => 'true',
                'idPago' => $IdAgregado,
            ],
            'restrictions' => ['completed_sessions' => ['limit' => 1]],
            'inactive_message' => 'Lo sentimos, el enlace de pago ya no es válido.',
            'after_completion' => [
                'type' => 'redirect',
                'redirect' => [
                    /* IC = Id Cliente, TM = Tipo Mensualidad */
                    // 'url' =>'https://amifit.mx' . "/pago-exitoso?idSocioLink=" . $IdAgregado . '-S' . "&clave=" . $d["Clave"],
                    'url' => base_url() . "pago-exitoso?idSocioLink=" . $IdAgregado . '-S' . "&clave=" . $d["Clave"] . ($concepto == 'Mensualidad' ? '&IC=' . $d['clienteId'] . '&TM=' . $d["tipoMensualidad"] : ''),
                    // 'url' => base_url() . "/pago-exitoso?idSocioLink=" . $IdAgregado . ($caja === 'Abierta' ? '-A' : '-S') . "&clave=" . $d["Clave"],
                ],
            ],
        ]);

        return $this->respond([
            'status'        => 'ok',
            'montoTotal' => $precioConComision,
            'retencion' => $totalRetenciones,
            'iva' => '',
            'porcentaje' => $montoNeto - $d["PrecioOriginal"],
            'neto' => $montoNeto,
            'idPago' => $IdAgregado,
            'caja' => $caja,
            'paymentLink'   => $paymentLink->url,
            'paymentLinkId' => $paymentLink->id,
            'actualizar' => '',
            'inventario' => '',
        ]);
    }

    /* VERIFICA EL STATUS DEL PAGO */
    public function verifyPayment()
    {
        $this->cors();

        $d = $this->request->getJSON(true);

        $id = $d['idPago'];

        $caja = $d['caja'];

        $modelPago = new Pago();

        $consulta = $modelPago->consultarPagoCobro($id, $caja);

        if (!$consulta) {
            return $this->failNotFound('Pago no encontrado');
        }

        if (isset($consulta['Observaciones']) && strpos($consulta['Observaciones'], 'Correo Enviado') !== false) {
            return json_encode([
                'status' => 'ok',
                'message' => 'PagoConfirmado',
                'pago' => $consulta
            ]);
        } else {
            return json_encode([
                'status' => 'ok',
                'message' => 'PagoPendiente',
                'pago' => $consulta
            ]);
        }
    }

    /* CANCELA EL LINK Y ELIMINA EL PAGO */
    public function cancelPayment()
    // public function eliminarPagoStripe($id = null)
    {

        $this->cors();

        try {
            $d = $this->request->getJSON(true);
            $id = $d['idPago'];
            $caja = $d['caja'];
            $idPagoLink = $d['paymentLinkId'];

            $eliminarPago = new Pago();

            $restore = $eliminarPago->infoRegistroCaja($id, $caja);

            if (!$restore) {
                return json_encode([
                    'status' => 'error',
                    'message' => 'No se encontró el registro del pago.'
                ]);
            }

            $datares =  [
                'idPagoEliminado' => $id,
                'status' => 'ok',
            ];

            /* ELIMINA EL PAGO DE LA CAJA */
            $eliminarPago->eliminarPagoStandby($id);

            try {
                // Crear una instancia del cliente de Stripe
                $stripe = new \Stripe\StripeClient(env('SECRET_KEY'));

                // Desactivar el enlace de pago
                $updatedLink = $stripe->paymentLinks->update(
                    $idPagoLink,
                    ['active' => false]
                );

                // Retornar respuesta exitosa
                $datares['stripe'] = [
                    'status' => 'success',
                    'message' => 'El enlace de pago se desactivó correctamente.',
                    'link' => $updatedLink
                ];
            } catch (\Exception $e) {
                // Manejar errores y retornar respuesta
                $datares['stripe'] = [
                    'status' => 'error',
                    'message' => 'Error al desactivar el enlace de pago: ' . $e->getMessage()
                ];
            }

            return json_encode($datares);
        } catch (\Throwable $e) {
            return json_encode([
                'status' => 'error',
                'message' => 'Error interno en el servidor.',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
        }
    }
}
