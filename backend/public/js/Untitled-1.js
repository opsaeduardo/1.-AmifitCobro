$(".form-inputs").html(`
        <div class="row">
            <div class="col-6">
            <label for="nombre">Nombre:</label>kgjdkgkgfg kgg jlkgjg jd
            </div>
            <div class="col-6">
            <label for="nombre">Nombre:</label>kgjdkgkgfg kgg jlkgjg jd
            </div>
        </div>
            <div style="margin-top: 100px; margin-bottom: 100px" class="d-flex justify-content-center align-items-center">
                <div class="col-12 col-md-4 bg-light ticket-general p-3" style="position: relative">
                    <img id="img-paloma" src="${ruta}/public/img/paloma.png" width="120" height="120">
                    <div class="row tickets-div mt-4">
                    <h5 class="text-center">Pago Exitoso</h5>
                        <div class="col-12">
                            <h4>Jose Eduardo Contreras Romero</h4>
                        </div>
                        <hr>
                        <div class="col-6 text-start">
                            <i class="fas fa-tshirt"></i>&nbsp;&nbsp; Playera: 
                        </div>
                        <div class="col-6">
                             Chica 
                        </div>
                        <hr>
                        <div class="col-6">
                            <i style="font-size: 25px;" class="fas fa-walking"></i>&nbsp;&nbsp;&nbsp; No. CorredorCorredorCorredor: 
                        </div>
                        <div class="col-6">
                             100 
                        </div>
                        <hr>
                        <div class="col-6">
                            <i class="far fa-money-bill-alt"></i>&nbsp;&nbsp; Costo: 
                        </div>
                        <div class="col-6">
                             $ 250.00 
                        </div>
                        <hr>
                        <div class="col-6">
                            <i class="fas fa-ticket-alt"></i>&nbsp;&nbsp; Cupón: 
                        </div>
                        <div class="col-6">
                             <i>No Aplica</i> 
                        </div>
                        <hr>
                        <div class="col-6">
                            <i style="font-size: 25px;" class="fas fa-dollar-sign"></i>&nbsp;&nbsp;&nbsp; Monto Total: 
                        </div>
                        <div class="col-6">
                             $ 250.00 
                        </div>
                        <hr>
                        <div class="col-6">
                            <i class="fas fa-envelope"></i>&nbsp;&nbsp; Correo: 
                        </div>
                        <div class="col-6">
                             chivaa.97@gmail.com 
                        </div>
                        <hr>
                    </div>
                    
                </div>
            </div>
        `);

        <div class="contenedor-ticket">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <i class="fas fa-tshirt"></i>&nbsp;&nbsp;<h5>Playera: </h5>
                    </div>
                    <div class="col-12 col-md-6">
                        <h5>Mediana</h5>
                    </div>
                    <div class="col-12 col-md-6">
                        <i style="font-size: 25px;" class="fas fa-walking"></i>&nbsp;&nbsp;<h5>No. Corredor:</h5>
                    </div>
                    <div class="col-12 col-md-6">
                        <h5>100</h5>
                    </div>
                    <div class="col-12 col-md-6">
                        <i class="far fa-money-bill-alt"></i>&nbsp;&nbsp;<h5>Costo: </h5>
                    </div>
                    <div class="col-12 col-md-6">
                        <h5>$250.00</h5>
                    </div>
                    <div class="col-12 col-md-6">
                        <i class="fas fa-ticket-alt"></i>&nbsp;&nbsp;<h5>Cupón: </h5>
                    </div>
                    <div class="col-12 col-md-6">
                        <h5><i>No Aplica</i></h5>
                    </div>
                    <div class="col-12 col-md-6">
                        <i style="font-size: 25px;" class="fas fa-dollar-sign"></i>&nbsp;&nbsp;&nbsp;<h5>Monto Total: </h5>
                    </div>
                    <div class="col-12 col-md-6">
                        <h5>$ 250.00 </h5>
                    </div>
                    <div class="col-12 col-md-6">
                    <i class="fas fa-envelope"></i>&nbsp;&nbsp;<h5>Correo: </h5>
                    </div>
                    <div class="col-12 col-md-6">
                        <h5>chivaa.97@gmail.com </h5>
                    </div>
                </div>
            </div>

$('#nombre').val('ValorNombre');
$('#correo').val('ValorCorreo');
$('#playera').val('Mediana');
$('#sexo').val('Masculino');
$('#telefono').val('1234567890');
$('#cupon').val('ValorCupon');
$('#keyfob').val('ValorKeyFob');

{
    "Id"
    "Nombre"
    "Apellidos"
    "Sexo"
    "Correo"
    "Telefono"
    "FechaNacimiento"
    "GymId"
    "Status"
    "Clave"
    "Saldo"
    "CostoMembresia"
    "FechaContrato"
    "Vigencia"
    "KeyFob"
    "CP"
    "Colonia"
    "Municipio"
    "Estado"
    "Calle"
    "NoExt"
    "UsuarioEmergencia1"
    "Parentesco1"
    "NumeroEmergencia1"
    "UsuarioEmergencia2"
    "Parentesco2"
    "NumeroEmergencia2"
    "Img"
    "CAM"
    "FechaCAM"
}
/* {
    "Id"
    "Nombre": "jose eduardo",
    "Correo": "chivaa@gmail.com",
    "Sexo": "Masculino",
    "Telefono": "2229322062",
    "TipoPlayera": "Chica",
    "Categoria": "Sin Categoria",
    "Cupon": "",
    "KeyFob": "",
    "IdCliente": "0",
    "Total": "265.00",
    "ComisionPorcentaje": "9.54",
    "ComisionFija": "3.00",
    "IVA": "2.01",
    "MontoTotal": "250.45",
    "IdOrden": "cs_test_a1G8pmMozc5CayvaXwkNtnu4u38b6eccEdlCO2hSRLvSHYevJtq03zArMp",
    "IdPago": "pi_3PqipMBX9sCWY09W00TvWzUG",
    "GymId": "",
    "NumeroParticipante": "103",
    "Fecha": "2024-08-22 16:45:19",
    "Asistencia": "",
    "UrlPago": "http://localhost/HortensiasActualizado/?StripePasarela_ID={CHECKOUT_SESSION_ID}&idSocio=7",
    "StatusPago": "Pagado"
  } */