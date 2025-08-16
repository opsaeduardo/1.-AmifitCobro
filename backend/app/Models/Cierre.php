<?php

namespace App\Models;

use CodeIgniter\Model;

class Cierre extends Model
{
    protected $table      = 'Cierres';
    protected $primarykey = 'Id';

    public function obtenerCierreCobro($gymId)
    {
        $nuevaHora = mktime(date("H") - 1);
        $Fecha = date('Y-m-d H:i:s', $nuevaHora);
        $info = $this->db->table('Cierres');
        $tablaCierre = $info->OrderBy('Id', 'DESC')->where('Gym', $gymId)->like('Fecha', date('Y-m-d'));
        $informacionCierre = $tablaCierre->get()->getRowArray();
        if (!is_null($informacionCierre)) {
            return $informacionCierre;
        } else {
            return null;
        }
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
