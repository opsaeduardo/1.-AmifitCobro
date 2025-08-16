<?php

/**esta plantilla contiene un solo metodo para hacer el envío de los todos los correos
 * desde el fontnd solo se debe pasar el numero del mensaje que se requiere, además de enviar
 * un mismo correo a diferentes direcciones
 */

namespace App\Controllers;

use App\Models\Usuarios;
use App\Models\Gimnasio;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'public/PHPMailer/Exception.php';
require 'public/PHPMailer/PHPMailer.php';
require 'public/PHPMailer/SMTP.php';


define('METHOD', 'AES-256-CBC');
define('SECRET_KEY', 'op5813Sa2135So56N');
define('SECRET_IV', '7884588');

class Contacto extends BaseController
{


    public function encriptar($idus)
    {
        $contacto = new Contacto();
        $output = FALSE;
        $key = hash('sha256', SECRET_KEY);
        $iv = substr(hash('sha256', SECRET_IV), 0, 16);
        $output = openssl_encrypt($idus, METHOD, $key, 0, $iv);
        $output = base64_encode($output);
        return $output;
    }

    public function desencriptar($idus)
    {
        $key = hash('sha256', SECRET_KEY);
        $iv = substr(hash('sha256', SECRET_IV), 0, 16);
        $output = openssl_decrypt(base64_decode($idus), METHOD, $key, 0, $iv);
        return $output;
    }


    // METODO QUE MANDA CORREO A LOS INSCRITOS EN UNA CLASE
    public function correoInscripcionClase($correo, $nombreSocio, $nombreInstructor, $nombreClase, $dia, $horaInicio, $horaFin, $idSocio, $idInscripcion)
    {

        $mail = new PHPMailer(true);
        try {

            $mail->SMTPDebug = 0;
            $mail->isSMTP();
            $mail->Host       = 'smtp.hostinger.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'noreply@amifit.mx';
            $mail->Password   = 'n0R3ply$';
            $mail->SMTPSecure = false;
            $mail->SMTPAutoTLS = false;
            $mail->Port       = 587;
            $mail->setFrom('noreply@amifit.mx', 'AmiFit');
            $mail->AddAddress('opsaeduardo@gmail.com');
            // $mail->AddAddress($correo);
            $mail->isHTML(true);
            // **************************************************************LOCALHOST**************************************************************
            // IMAGEN DE CARRERA HORTENSIAS D:\Programas Instalados\XAMPP\htdocs\AmiFitCompleto\public\img\logo\amifitAzul.png
            $mail->AddEmbeddedImage($_SERVER['DOCUMENT_ROOT'] . '/AmifitCobro/BACKEND/public/img/logo/amifitAzul.png', 'amifitAzul', 'amifitAzul.png');
            // IMAGEN DEL QR
            $mail->AddEmbeddedImage($_SERVER['DOCUMENT_ROOT'] . '/AmifitCobro/BACKEND/public/img/sociosClase/' . $idSocio . '/' . $idInscripcion . '.png', $idInscripcion, $idInscripcion . '.png');



            // **************************************************************PRODUCCION**************************************************************
            // IMAGEN LOGO
            // $mail->AddEmbeddedImage($_SERVER['DOCUMENT_ROOT'] . '/public/img/logo/amifitAzul.png', 'amifitAzul', 'amifitAzul.png');
            // $mail->AddEmbeddedImage($_SERVER['DOCUMENT_ROOT'] . '/public/img/amifitAzul.png', 'amifitAzul', 'amifitAzul.png');
            // IMAGEN DEL QR
            // $mail->AddEmbeddedImage($_SERVER['DOCUMENT_ROOT'] . '/public/uploads/VamosAncianos/' . $id . '/' . $id . '.png', $id, $id . '.png');

            $mail->Subject =  mb_convert_encoding('Registro Clase', 'ISO-8859-1', 'UTF-8');
            $mail->Body =
                '<div align="center" style="font-family: Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #D0FF08; border-radius: 0 0 8px 8px; padding: 25px; background-color: #FFFFFF;">
                <!-- Encabezado del boleto -->
                <div style="background-color:rgb(255, 255, 255); padding: 20px; border-radius: 8px 8px 0 0;">
                    <img src="cid:amifitAzul" width="200px" style="display: block; margin: 0 auto;">
                </div>
                
                <!-- Cuerpo del boleto -->
                <!-- Título -->
                <h1 style="color: #10295B; font-size: 28px; margin-bottom: 25px; font-weight: bold;">
                    ¡REGISTRO EXITOSO!
                </h1>
                
                <!-- Sección de información -->
                <div style="text-align: left; margin-bottom: 25px;">
                    <div style="margin-bottom: 15px;">
                        <span style="color: #8B8B8B; font-size: 16px; display: block;">CLASE:</span>
                        <span style="color: #10295B; font-size: 20px; font-weight: bold;">' . $nombreClase . '</span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <span style="color: #8B8B8B; font-size: 16px; display: block;">FECHA:</span>
                        <span style="color: #10295B; font-size: 18px; font-weight: bold;">' . $dia . '</span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <span style="color: #8B8B8B; font-size: 16px; display: block;">HORARIO:</span>
                        <span style="color: #10295B; font-size: 18px; font-weight: bold;">' . substr($horaInicio, 0, 5) . ' - ' . substr($horaFin, 0, 5) . ' hrs</span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <span style="color: #8B8B8B; font-size: 16px; display: block;">INSTRUCTOR(A):</span>
                        <span style="color: #10295B; font-size: 18px; font-weight: bold;">' . $nombreInstructor . '</span>
                    </div>
                </div>
                
                <!-- QR Section -->
                <div style="background-color: #F8F8F8; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                    <img src="cid:' . $idInscripcion . '" width="250px" style="display: block; margin: 0 auto;">
                    <p style="color: #10295B; font-size: 16px; margin-top: 15px; font-weight: bold;">
                        Presenta este código QR al instructor para registrar tu asistencia
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background-color: #D0FF08; color: #10295B; padding: 12px; border-radius: 4px;">
                    <p style="font-size: 18px; font-weight: bold; margin: 0;">
                        ¡NOS VEMOS EN LA CLASE!
                    </p>
                </div>
                
                <!-- Small print -->
                <p style="color: #8B8B8B; font-size: 12px; margin-top: 20px;">
                    Este es un correo electrónico automático, por favor no respondas a este mensaje.
                </p>
            </div>';

            $mail->CharSet = 'UTF-8';
            $mail->send();
            return [
                'status' => 1,
                'message' => 'Correo enviado'
            ];
        } catch (Exception $e) {
            return [
                'status' => 0,
                'message' => $mail->ErrorInfo
            ];
        }
    }
}
