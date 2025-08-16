<?php

namespace App\Models;

use CodeIgniter\Model;

class EntrenamientoModel extends Model
{
    protected $table = 'entrenamiento';

    public function entrenamientoCostos($gymId)
    {
        $query = $this->db->table($this->table)
            ->where('GymId', $gymId)
            ->where('Status', 1) // 1 = Activo 0 = Inactivo
            ->get();

        return $query->getResultArray();
    }
}
