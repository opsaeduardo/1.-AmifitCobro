<?php

namespace App\Models;

use CodeIgniter\Model;
use DateTime;
use DateInterval;

class Clases extends Model
{
    protected $table = 'clases';
    protected $table2 = 'controldeasistencia';

    // Obtener las clases y los instructores

    /* METODO QUE INSERTA EN LA TABLA SOCIOCONTROLDEASISTENCIA */
    public function inscripcionClase($data)
    {
        $query = $this->db->table('sociocontroldeasistencia')->insert($data);
        return $this->db->insertID();
    }

    /* METODO QUE CONSULTA SI EXISTE EL REGISTRO DEL SOCIO EN LA CLASE */
    public function consultarInscripcion($IdControldeasistencia, $IdCliente)
    {
        $query = $this->db->table('sociocontroldeasistencia');
        $query->where('IdControldeasistencia', $IdControldeasistencia);
        $query->where('IdCliente', $IdCliente);
        return $query->get()->getResultArray();
    }

    // METODO QUE OBTIENE LAS CLASES POR FECHA
    public function obtenerClasesFecha($id)
    {
        $ahora = date('Y-m-d H:i:s');
        $ahoraConTolerancia = date('Y-m-d H:i:s', strtotime('-15 minutes'));
        $finProxMes = date('Y-m-t 23:59:59', strtotime('+1 month'));

        // 1. Consulta de clases con instructor
        $queryClases = $this->db->table('controldeasistencia a')
            ->select('a.*, u.Nombre, u.Apellidos')
            ->join('Usuarios u', 'a.idUsuario = u.Id', 'inner')
            ->where("CONCAT(a.Dia, ' ', a.HoraInicio) >", $ahoraConTolerancia)
            ->where("CONCAT(a.Dia, ' ', a.HoraInicio) <=", $finProxMes)
            ->where('a.GymId', $id)
            ->orderBy('a.Dia', 'ASC')
            ->orderBy('a.HoraInicio', 'ASC');

        $clases = $queryClases->get()->getResultArray();

        if (empty($clases)) {
            return [];
        }

        $claseIds = array_column($clases, 'Id');

        $queryInscritos = $this->db->table('sociocontroldeasistencia sca')
            ->select('sca.IdControldeasistencia, c.Nombre, c.Apellidos, sca.Asistencia')
            ->join('Clientes c', 'sca.IdCliente = c.Id', 'inner')
            ->whereIn('sca.IdControldeasistencia', $claseIds)
            ->orderBy('c.Apellidos');

        $inscritos = $queryInscritos->get()->getResultArray();

        // 3. Combinar resultados
        foreach ($clases as &$clase) {
            $clase['Inscritos'] = array_values(array_filter(
                $inscritos,
                function ($i) use ($clase) {
                    return $i['IdControldeasistencia'] == $clase['Id'];
                }
            ));
        }

        return $clases;
    }
}
