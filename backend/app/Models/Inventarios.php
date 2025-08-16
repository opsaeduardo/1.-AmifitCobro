<?php

namespace App\Models;

use CodeIgniter\Model;

class Inventarios extends Model
{
    protected $table      = 'Inventario';
    protected $primarykey = 'Id';
    protected $allowedFields = ['Id', 'Producto', 'Precio', 'Cantidad', 'FechaIngreso', 'FechaSalida', 'Status'];

    /* OBTENER INVENTARIO */
    public function getInventoryCobro($producto, $gymId)
    {
        $Inventario = $this->db->table('Inventario');
        $Inventario->where('Producto', $producto);
        $Inventario->where('GymId', $gymId);
        $Producto = $Inventario->get()->getRowArray();
        if ($Producto == null) {
            return 'NoExiste';
        } else {
            return $Producto['Cantidad'];
        }
    }

    /* UPDTATE VENTA COBRO */
    public function updateVentaCobro($producto, $data, $gymId)
    {
        $inventario = $this->db->table('Inventario');
        $byGym = $inventario->where("GymId", $gymId);
        $byGym->where("Producto", $producto);
        $byGym->update($data);
        return 1;
    }

    /* VERIFICAR PRODUCTO */
    public function existProductCobro($producto, $gymId)
    {
        $Inventario = $this->db->table('Inventario');
        $Inventario->where('Producto', $producto);
        $Inventario->where('GymId', $gymId);
        $Producto = $Inventario->get()->getRowArray();
        if ($Producto == null) {
            return 'NoExiste';
        } else {
            return $Producto['Id'];
        }
    }

    public function returnInfoProducto($idProducto)
    {
        $Inventario = $this->db->table('Inventario');
        $Inventario->where('Id', $idProducto);
        $Producto = $Inventario->get()->getRowArray();
        if ($Producto == null) {
            return 'Empty';
        } else {
            return $Producto;
        }
    }

        public function editProductoCobro($id, $data)
    {
        $inventario = $this->db->table('Inventario');
        $inventario->where("Id", $id);  
        return $inventario->update($data);

    }
}
