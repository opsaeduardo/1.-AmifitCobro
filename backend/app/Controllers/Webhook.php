<?php

namespace App\Controllers;
use App\Controllers\BaseController;
use App\Controllers\Home;
use App\Models\Pago;
use App\Models\participantes;

require 'vendor/autoload.php';

class Webhook extends BaseController
{
    //Regresa la vista
    public function index()
    {
        $stripe = new \Stripe\StripeClient(env('SECRET_KEY'));

        $endpoint_secret = env('ENDPOINT_KEY');

        $payload = @file_get_contents('php://input');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sig_header,
                $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            // Invalid payload
            echo json_encode(['error' => $e->getMessage()]);
            http_response_code(400);
            exit();
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            echo json_encode(['error' => $e->getMessage()]);
            http_response_code(400);
            exit();
        }

        // segunda version
        switch ($event->type) {
            case 'checkout.session.async_payment_failed':
                $session = $event->data->object;
                break;
            case 'checkout.session.async_payment_succeeded':
                $session = $event->data->object;
                break;
            case 'checkout.session.completed':
               
               $session = $event->data->object;

               $pagosModel = new Pago();

               /* OBTENER METADATA ID */
               $idPago = $session->metadata->idPago;
                
                if (isset($session->payment_intent)) {
                $paymentIntentId = $session->payment_intent;
        
                // Ya tienes StripeClient inicializado
                $paymentIntent = $stripe->paymentIntents->retrieve($paymentIntentId, ['expand' => ['charges']]);
                
                $chargeId = $paymentIntent->latest_charge;
                
                $charge = $stripe->charges->retrieve($chargeId);
                
                $balanceTransactionId = $charge->balance_transaction;
                $balanceTransaction = $stripe->balanceTransactions->retrieve($balanceTransactionId);
                
                $montoTotal = $balanceTransaction->amount / 100;
                $totalComisiones = $balanceTransaction->fee / 100;
                $montoRecibido = $balanceTransaction->net / 100;

                $iva = 0;
                $retenciones = 0;
                
                foreach ($balanceTransaction->fee_details as $detalle) {
                    $descripcion = strtolower($detalle->description);
                    $monto = $detalle->amount / 100;
                
                    if (strpos($descripcion, 'iva') !== false) {
                        $iva += $monto;
                    } elseif (strpos($descripcion, 'retención') !== false || strpos($descripcion, 'retencion') !== false) {
                        $retenciones += $monto;
                    }
                }

                $data = [
                    'Importe' => $montoRecibido,
                    'Total' => $montoTotal,
                    'Retencion' => $totalComisiones,
                    'IVA' => '0'
                ];

                $actualizar = $pagosModel->actualizarPagoStandby($idPago, $data);
                
                return  json_encode([
                    'balance' => $balanceTransaction,
                    'total_pagado' => $montoTotal,
                    'total_comisiones' => $totalComisiones,
                    'iva' => $iva,
                    'retenciones' => $retenciones,
                    'monto_recibido' => $montoRecibido,
                    'pago' => $actualizar
                ]);

            }
    
                break;
            case 'checkout.session.expired':
                $session = $event->data->object;
                break;
            case 'payout.canceled':
                $payout = $event->data->object;
                break;
            case 'payout.created':
                $payout = $event->data->object;
                break;
            case 'payout.failed':
                $payout = $event->data->object;
                break;
            case 'payout.paid':
                $payout = $event->data->object;
                break;
            case 'payout.reconciliation_completed':
                $payout = $event->data->object;
                break;
            case 'payout.updated':
                $payout = $event->data->object;
                break;
            case 'payment_intent.created':

                $intent = $event->data->object;

                $data = [
                    'respuesta' => $intent
                    ];
                return json_encode($data);

                break;
            case 'payment_intent.succeeded':
                 echo 'payment intent type: ' . $event;
                break;
            case 'payment_intent.payment_failed':
                break;
            default:
                echo 'Received unknown event type ' . $event;
        }
        http_response_code(200);
    }
}
