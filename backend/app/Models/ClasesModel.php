<?php

namespace App\Models;

use CodeIgniter\Model;
use DateTime;
use DateInterval;

class ClasesModel extends Model
{
    protected $tableClases = 'clases';
    protected $tableControlAsistencia = 'controldeasistencia';
    protected $tableSociocontroldeasistencia = 'sociocontroldeasistencia';

    public function obtenerClasesPorInstructor($id, $fechaInicio = null, $fechaFinal = null)
    {
        $builder = $this->db->table($this->tableControlAsistencia . ' ca')
            ->select('
                ca.Id AS claseId,
                ca.idUsuario,
                ca.GymId,
                ca.idStaffNomina,
                ca.Dia,
                ca.HoraInicio,
                ca.HoraTermino,
                ca.Clase,
                ca.Socios,
                ca.Asistencia AS AsistenciaClase,
                ca.Status
            ')
            ->where('ca.idUsuario', $id);

        if ($fechaInicio && $fechaFinal) {
            $builder->where('ca.Dia >=', $fechaInicio)
                ->where('ca.Dia <=', $fechaFinal);
        }

        $clases = $builder->orderBy('ca.Dia', 'DESC')
            ->orderBy('ca.HoraInicio', 'ASC')
            ->get()
            ->getResult();

        foreach ($clases as $clase) {
            $clase->sociosInscritos = $this->db->table('sociocontroldeasistencia sca')
                ->select('
                    sca.Id AS socioAsistenciaId,
                    sca.IdCliente,
                    c.Nombre,
                    c.Apellidos,
                    c.Clave,
                    c.Correo,
                    sca.Asistencia AS AsistenciaSocio,
                    sca.Fecha
                ')
                ->join('Clientes c', 'c.Id = sca.IdCliente', 'left')
                ->where('sca.IdControldeasistencia', $clase->claseId)
                ->get()
                ->getResult();
        }

        return $clases;
    }

    /* OBTENER CLASE ESPECÍFICA DE CONTROL ASISTENCIA */
    public function obtenerClaseAsistencia($id)
    {
        return $this->db->table($this->tableControlAsistencia)
            ->where('Id', $id)
            ->get()
            ->getRow();  // Usamos getRow() para obtener un solo registro
    }

    /* ACTUALIZAR CONTADOR DE SOCIOS (INCREMENTAR) */
    public function incrementarSocios($id)
    {
        $clase = $this->obtenerClaseAsistencia($id);
        $nuevoValor = $clase->Socios + 1;

        // Luego actualizamos
        return $this->db->table($this->tableControlAsistencia)
            ->set('Socios', $nuevoValor)
            ->where('Id', $id)
            ->update();
    }

    public function consultarClaseRegistro($idSocioControlAsistencia)
    {
        return $this->db->table('sociocontroldeasistencia sca')
            ->select('
            sca.Id AS socioAsistenciaId,
            sca.IdCliente,
            sca.IdControldeasistencia,
            sca.Asistencia AS AsistenciaSocio,
            c.Nombre,
            c.Apellidos,
            c.Clave,
            c.Correo,
            c.Telefono,
            ca.Clase,
            ca.Dia,
            ca.HoraInicio,
            ca.HoraTermino,
        ')
            ->join('Clientes c', 'c.Id = sca.IdCliente', 'left')
            ->join('controldeasistencia ca', 'ca.Id = sca.IdControldeasistencia', 'left')
            ->where('sca.Id', $idSocioControlAsistencia)
            ->get()
            ->getRow();
    }

    /* METODO QUE ACTUALIZA LA ASISTENCIA */
    public function actualizarAsistencia($idSocioControlAsistencia, $estado)
    {
        return $this->db->table($this->tableSociocontroldeasistencia)
            ->where('Id', $idSocioControlAsistencia)
            ->set('Asistencia', $estado)
            ->update();
    }







    // Obtener las clases y los instructores
    public function obtenerClases($id)
    {
        $query = $this->db->table('clases')
            ->where('GymId', $id)
            ->get();
        $res = $query->getResult();
        $queryDos = $this->db->table('Usuarios')
            ->select('Usuarios.Id, Usuarios.Nombre, Usuarios.Apellidos')
            ->where('Usuarios.Rol', 'Instructor')
            ->where('Usuarios.Status', 'Activo')
            ->where('Usuarios.GymId', session("GymId"))
            //->join('staffnomina', 'staffnomina.IdUsuario = Usuarios.Id', 'inner')
            ->get();
        $resDos = $queryDos->getResult();
        $result[] = array(
            'Clases' => $res,
            'Instructor' => $resDos
        );
        return $result;
    }

    //guardar clase
    public function guardarClase($data)
    {
        $query = $this->db->table($this->table)->insert($data);
        return $this->db->insertID();
    }
}
