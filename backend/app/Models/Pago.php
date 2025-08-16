<?php

namespace App\Models;

use CodeIgniter\Model;

class Pago extends Model
{
    protected $table      = 'Pagos';
    protected $primarykey = 'Id';
    protected $allowedFields = ['IdCliente', 'Concepto', 'Importe', 'TipoPago', 'Folio', 'Fecha', 'Observaciones', 'Archivos'];

    public function agregarNuevoPago($data)
    {
        $query = $this->db->table($this->table)->insert($data);
        return $this->db->insertID();
    }

    public function consultarMontoBanco()
    {
        $qeury = $this->db->table("montobanco")
            ->select('Monto')
            //->where('GymId', session("GymId"))
            ->limit(1)
            ->orderBy('Id desc')
            ->get()->getRowArray();
        if (!is_null($qeury)) {
            return $qeury;
        } else {
            return "null";
        }
    }

    // inserta en tabla montoBanco
    public function insertarMontoBanco($data)
    {
        $query = $this->db->table('montobanco')
            ->insert($data);
        return $this->db->insertID();
    }

    public function insertarPagoBanco($data)
    {
        $query = $this->db->table('pagosbanco')
            ->insert($data);
        return $this->db->insertID();
    }

    /* INSERTA EL PAGO EN STANDBY */
    public function agregarNuevoPagoStandBy($data)
    {
        $query = $this->db->table('pagos_standby')->insert($data);
        return $this->db->insertID();
    }

    /* METODO QUE CONSULTA PAGO */
    public function consultarPagoCobro($id, $caja, $clave = null)
    {

        if ($caja === 'Abierta') {
            $query = $this->db->table('Pagos')
                ->where('Id', $id)
                ->get()->getRowArray();

            if (!is_null($query)) {
                $query['Standby'] = false;
            } else {
                return null;
            }
        } elseif ($caja === 'Standby') {
            $query = $this->db->table('pagos_standby')
                ->where('Id', $id)
                ->get()->getRowArray();

            if (!is_null($query)) {
                $query['Standby'] = true;
            } else {
                return null;
            }
        } else {
            return null;
        }

        // Si hay resultado, buscar datos del cliente
        if (isset($query['IdCliente'])) {
            $cliente = $this->db->table('Clientes')
                ->select('Nombre, Apellidos, Correo')
                ->where('Clave', $clave ?? $query['IdCliente'])
                ->get()
                ->getRowArray();

            if ($cliente) {
                $query['Nombre'] = $cliente['Nombre'];
                $query['Apellidos'] = $cliente['Apellidos'];
                $query['Correo'] = $cliente['Correo'];
            } else {
                $query['Nombre'] = null;
                $query['Apellidos'] = null;
                $query['Correo'] = null;
            }
        }

        return $query;
    }

    /* BUSCA EL PAGO DEPENDIENDO LA CAJA */
    public function infoRegistroCaja($id, $caja)
    {
        if ($caja === 'Abierta') {
            $pagos = $this->db->table('Pagos');
        } elseif ($caja === 'Standby') {
            $pagos = $this->db->table('pagos_standby');
        } else {
            return null; // Si no se especifica caja válida
        }

        $pagos->where('Id', $id);
        $infoPagos = $pagos->get()->getRowArray();

        return $infoPagos;
    }

    //Elimina el pagobanco
    public function eliminarPagoBanco($id)
    {
        $query = $this->db->table('pagosbanco');
        $query->where('IdPago', $id);
        return $query->delete();
    }

    /* ELIMINA EL PAGO DE STANDBY */
    public function eliminarPagoStandby($id)
    {
        $query = $this->db->table('pagos_standby');
        $query->where('Id', $id);
        return $query->delete();
    }

    /* ACTUALIZA EL PAGO STANDBY */
    public function actualizarPagoStandby($id, $data)
    {
        $query = $this->db->table('pagos_standby');
        $query->where('Id', $id);
        return $query->update($data);
    }
}
