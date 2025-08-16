<?php

namespace App\Models;

use CodeIgniter\Model;

class Caja extends Model
{
    protected $table      = 'Caja';
    protected $primarykey = 'Id';

    public function cajaCobro($gymId)
    {
        $Caja = $this->db->table('Caja');
        $Caja->OrderBy('Id', 'DESC')->where('Gym', $gymId)->like('Fecha', date('Y-m-d'));
        return $Caja->get()->getRowArray();
    }
}
