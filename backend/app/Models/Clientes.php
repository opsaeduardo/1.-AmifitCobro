<?php

namespace App\Models;

use CodeIgniter\Model;

class Clientes extends Model
{
    protected $table      = 'Clientes';
    protected $primarykey = 'Id';
    protected $allowedFields = ['Id', 'Clave', 'Nombre', 'Apellidos', 'Sexo', 'Correo', 'Telefono', 'GymId', 'Status'];

    public function customers()
    {
        $query = $this->db->get('Clientes');
        return $query->result();
    }

    public function infoSocio($id)
    {
        $Cliente = $this->db->table('Clientes');
        $Cliente->where('Id', $id);
        $RowCliente = $Cliente->get()->getRowArray();
        if ($RowCliente == null) {
            return 'NoExiste';
        } else {
            return $RowCliente;
        }
    }
    public function existClave($valor)
    {
        $valorTrim = trim($valor);
        $valorSinEspacios = str_replace(' ', '', $valorTrim);

        // Primero verificamos si hay duplicados de KeyFob
        $duplicadosKeyFob = $this->db->table('Clientes')
            ->where('KeyFob', $valorTrim)
            ->countAllResults();

        if ($duplicadosKeyFob > 1) {
            return 'duplicadoKeyFob';
        }

        // Búsqueda normal si no hay duplicados
        $Cliente = $this->db->table('Clientes');
        $Cliente->groupStart()
            ->where('KeyFob', $valorTrim)
            ->orWhere('TRIM(Nombre)', $valorTrim)
            ->orWhere('REPLACE(Correo, " ", "")', $valorSinEspacios)
            ->orWhere('REPLACE(Telefono, " ", "")', $valorSinEspacios)
            ->groupEnd()
            ->where('Status', 'Activo');

        $RowCliente = $Cliente->get()->getRowArray();

        if ($RowCliente == null) {
            return '0';
        } else {
            return $RowCliente['Id'];
        }
    }

    public function infoCliente($GymId, $clave)
    {
        $clientes = $this->db->table('Clientes')
            ->where('GymId', $GymId)
            ->where('KeyFob', $clave)
            ->where('Status', 'Activo')
            ->get()
            ->getResultArray();

        if (count($clientes) > 1) {
            return 'KeyFobDuplicada';
        } elseif (count($clientes) === 1) {
            return $clientes[0];
        } else {
            return null;
        }
    }

    /* CONSULTA LA TABLA DE SOCIOSDEUDA */
    public function infoSocioDeuda($idCliente, $keyfob)
    {
        $listado = $this->db->table('SociosDeuda')
            ->where('IdSocio', $idCliente)
            ->where('KeyFob', $keyfob)
            ->get()
            ->getRowArray();

        if ($listado) {
            return $listado;
        } else {
            return '0';
        }
    }
}
