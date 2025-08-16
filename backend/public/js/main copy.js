$(document).ready(function () {

    $(".div-form-inputs").hide(300);
    // $(".div-info-socio").hide(300);
    // $("#selectorPago").modal('show');
    // $("#stripeModal").modal('show');
    // video
    document.querySelector('video').addEventListener('click', function () {
        this.play();
    });

    // FUNCION DE SCROLL
    const $body = $('html, body');


    const $containerCollage = $('#container-collage');
    const $carrera = $('#carrera');
    const $ganadores = $('#ganadores');
    // const ticket = $('#divInscripcion');
    const ticket = $('.form-inputs');

    function smoothScroll(target) {
        $body.animate({
            scrollTop: target.offset().top - 100
        }, 100);
    }

    // ocultar nav
    $('.nav-link').click(function () {
        $('#navbarTogglerDemo02').collapse('hide');
    });

    $("#divEvento").click(function () {
        smoothScroll($containerCollage);
        $("#divEvento").css('border-bottom', '5px solid rgb(255, 255, 255)');
        $("#divCarrera").css('border-bottom', '5px solid transparent');
        $("#divGanadores").css('border-bottom', '5px solid transparent');
        $("#divInscripcion").css('border-bottom', '5px solid transparent');
    });

    $("#divCarrera").click(function () {
        smoothScroll($carrera);
        $("#divCarrera").css('border-bottom', '5px solid rgb(255, 255, 255)');
        $("#divEvento").css('border-bottom', '5px solid transparent');
        $("#divGanadores").css('border-bottom', '5px solid transparent');
        $("#divInscripcion").css('border-bottom', '5px solid transparent');
    });

    $("#divGanadores").click(function () {
        smoothScroll($ganadores);
        $("#divGanadores").css('border-bottom', '5px solid rgb(255, 255, 255)');
        $("#divCarrera").css('border-bottom', '5px solid transparent');
        $("#divEvento").css('border-bottom', '5px solid transparent');
        $("#divInscripcion").css('border-bottom', '5px solid transparent');
    });

    $(".botonRegistro").click(function () {
        smoothScroll(ticket);
        $("#divInscripcion").css('border-bottom', '5px solid rgb(255, 255, 255)');
        $("#divCarrera").css('border-bottom', '5px solid transparent');
        $("#divEvento").css('border-bottom', '5px solid transparent');
        $("#divGanadores").css('border-bottom', '5px solid transparent');
    });

    // funcion para cambiar texto central de vista principal
    var mensajes = [
        "¡Muchas Gracias por Participar!",
        "¡Prepárate Febrero del 2025!",
        "CARRERA DE LAS HORTENSIAS"
    ];
    var i = 0;

    function cambiarTexto() {
        $("#texto").fadeOut(function () {
            $(this).html(mensajes[i]).fadeIn();
            i = (i + 1) == mensajes.length ? 0 : i + 1;
        });
    }
    setInterval(cambiarTexto, 4000);

    // obtener pixeles desplazados y colocar fondo nav
    window.onscroll = function () {
        var y = window.scrollY;
        if (y > 100) {
            $("#nav").addClass("barra-nav");
        }
        else {
            $("#nav").removeClass("barra-nav");
        }


        if (y <= 400) {
            $(".boton-arriba").attr("hidden", true);
        } else {
            $(".boton-arriba").removeAttr("hidden");
        }
    };

    // ir arriba
    $(".boton-arriba").click(function () {
        console.log("dentro")
        $('html, body').animate({
            scrollTop: 0
        }, 100);
    });

    // Efecto parallax
    var images = document.querySelectorAll('.e-right');
    new simpleParallax(images, {
        delay: 0.8,
        orientation: 'right',
    });

    var images = document.querySelectorAll('.e-left');
    new simpleParallax(images, {
        delay: 0.5,

        orientation: 'left',
    });

    var images = document.querySelectorAll('.e-up');
    new simpleParallax(images, {
        delay: .8,

        orientation: 'up',
    });

    var div = document.querySelectorAll('.container-winers-fondo');

    new simpleParallax(div, {
        scale: 0.8,
        orientation: 'up'
    });

    // VERIFICA QUE LA URL SEA CON LOS DATOS DE PAGO
    var url = window.location.href;
    if (!url.includes("StripePasarela_ID")) {
        // CONSULTA SI EL MODULO DE REGISTROS ESTA ACTIVO
        $.ajax({
            type: "POST",
            url: ruta + "/Home/verificarRegistro",
            dataType: "JSON",
            success: function (response) {
                if (response["Status"] == 'Inactivo') {
                    $("#divFormulario").removeClass('d-flex').fadeOut(300);
                    $("#divInscripcion").fadeOut(300);
                    $(".botonRegistro").fadeOut(300);
                }
                $.ajax({
                    type: "GET",
                    url: ruta + "/Home/verificarLimiteRegistros",
                    dataType: "json",
                    success: function (data) {
                        console.log(data);
                        if (data == 'LimiteExcedido') {
                            $(".form-inputs").html(`
                                <div style="width: 100%; padding: 50px; background-color: #ffffff63; border-radius: 15px">
                                    <p style="font-size:50px" class="text-center text-white"><i>El proceso de registro ha concluido</i></p>
                                </div>
                            `);
                            $(".form-inputs").addClass('justify-content-center align-items-center');
                            $("#divInscripcion").fadeOut(300);
                            $(".botonRegistro").fadeOut(300);

                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });

            },
            error: function (e) {
                Swal.fire({
                    title: "Error!",
                    text: "Error al traer al verificar el registro",
                    icon: "error"
                });
                console.log(e);
            }
        });
    }

    $.ajax({
        type: "POST",
        url: ruta + "/Home/verificarModulos",
        dataType: "JSON",
        success: function (response) {
            // VERIFICA EL STATUS DEL MODULO CUPONES
            if (response.cupones.Status != 'Activo') {
                $("#divCupones").fadeOut(500);
                $("#divCupones").html('');
            }

            // VERIFICA EL STATUS DE PASE DOBLE (KEYFOB)
            if (response.paseDoble.Status != 'Activo') {
                $("#divKeyFob").fadeOut(500);
                $("#divKeyFob").html('');
            }
        },
        error: function (e) {
            Swal.fire({
                title: "Error!",
                text: "Hubo un error al traer los campos del formulario, por favor, consulte al administrador.",
                icon: "error"
            });
            console.log(e);
        }
    });

    // MUESTRA/OCULTA INPUT CONTRARIO AL DE CUPON O KEYFOB
    $('#keyfob').on('input', function () {
        if ($(this).val().length > 0) {
            $('#divCupones').hide(400);
        } else {
            $('#divCupones').show(400);
        }
    });

    // EVITA LA TECLA DE ESPACIO
    $('#keyfob').on('keydown', function (e) {
        if (e.keyCode === 32) {
            e.preventDefault();
        }
    });

    $('#cupon').on('input', function () {
        if ($(this).val().length > 0) {
            $('#divKeyFob').hide(400);
        } else {
            $('#divKeyFob').show(400);
        }
    });

    // $('#edad').on('input', function () {
    //     this.value = this.value.replace(/[^0-9]/g, ''); // Reemplaza todo lo que no sea un número
    // });

    $(document).on('input', '#edad', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    // $('#cupon').on('keydown', function (e) {
    //     if (e.keyCode === 32) { // 32 es el código de la tecla espacio
    //         e.preventDefault(); // Evita que se ingrese el espacio
    //     }
    // }).on('input', function () {
    //     // Convierte el texto a mayúsculas
    //     this.value = this.value.toUpperCase();
    // });

    // CONVIERTE A MAYUSCULA
    $('#cupon').on('input', function () {
        this.value = this.value.replace(/\s/g, '').toUpperCase();
    });


    // FUNCION QUE LLENA EL TICKET DE COMPROBANTE DE PAGO
    function llenarTicket(id) {

        // FUNCION AJAX PARA TRAER LA INFORMACION Y LLENAR LOS CAMPOS
        $.ajax({
            type: "GET",
            url: ruta + "/Home/informacionRegistro",
            data: {
                'id': id
            },
            dataType: "json",
            success: function (response) {
                console.log(response)
                $(".container-form").css('background', 'rgb(75 174 79)');
                $(".form-inputs").html(`
                    <div style="margin-top: 100px; margin-bottom: 100px" class="d-flex justify-content-center align-items-center">
                        <div class="col-12 col-md-4 bg-light ticket-general p-3" style="position: relative">
                            <img id="img-paloma" src="${ruta}/public/img/paloma.png" width="140" height="140">
                            <div class="row tickets-div mt-4">
                                <h4 class="text-center mt-3" style="font-weight : 800; letter-spacing: 10px; color: #4bae4f"><i>¡Pago Exitoso!</i></h4>
                                <div class="col-12 mt-3 d-flex justify-content-center">
                                    <h4>${response["Nombre"]}</h4>
                                </div>
                                <hr>
                                <div class="col-6 text-start">
                                    <i class="fas fa-tshirt"></i>&nbsp;&nbsp;<h5>Playera:</h5>
                                </div>
                                <div class="col-6">
                                    <h4>${response["TipoPlayera"]}</h4>
                                </div>
                                <hr>
                                <div class="col-6">
                                    <i style="font-size: 25px;" class="fas fa-walking"></i>&nbsp;&nbsp;&nbsp;<h5>No. Corredor:</h5>
                                </div>
                                <div class="col-6">
                                    <h4>${response["NumeroParticipante"]}</h4>
                                </div>
                                <hr>
                                <div class="col-6">
                                    <i class="far fa-money-bill-alt"></i>&nbsp;&nbsp;<h5>Costo:</h5>
                                </div>
                                <div class="col-6">
                                    <h4>$${response["Total"]}</h4>
                                </div>
                                <hr>
                                <div class="col-6">
                                    <i class="fas fa-key"></i>&nbsp;&nbsp;<h5>KeyFob:</h5>
                                </div>
                                <div class="col-6">
                                    <h4><i>${(response["KeyFob"]) ? response["KeyFob"] : "No Aplica"}</i></h4>
                                </div>
                                <hr>
                                <div class="col-6">
                                    <i class="fas fa-ticket-alt"></i>&nbsp;&nbsp;<h5>Cupón:</h5>
                                </div>
                                <div class="col-6">
                                    <h4><i>${(response["Cupon"]) ? response["Cupon"] : "No Aplica"}</i></h4>
                                </div>
                                <hr>
                                <div class="col-6">
                                    <i style="font-size: 25px;" class="fas fa-dollar-sign"></i>&nbsp;&nbsp;&nbsp;<h5>Monto Total:</h5>
                                </div>
                                <div class="col-6">
                                    <h4>$${(response["Cupon"]) ? response["TotalConDescuento"] : response["Total"]}</h4>
                                </div>
                                <hr>
                                <div class="col-12">
                                    <p style="font-size: 15px; color:rgb(75 174 79);" class="text-center">Toda la información del evento ha sido enviada al siguiente correo: <b>${response["Correo"]}</b></p>
                                </div>
                                <div class="col-12 d-flex justify-content-center">
                                    <img alt="Código QR" id="codigo"> 
                                    <p class="mt-4" style="font-size: 15px; color:rgb(75 174 79);">Por favor, toma captura del <b>Código QR</b> es tu pase al evento.</p>
                                </div>
                                <div class="col-12 d-flex justify-content-center">
                                    <button id="redireccionar" class="btn btn-dark">Nuevo Registro</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `);

                // BOTON DE RECARGAR LA PAGINA
                $(document).on('click', '#redireccionar', function () {
                    window.location.href = ruta;
                });

                const codigoElement = document.querySelector("#codigo");
                var qr = new QRious({
                    element: codigoElement,
                    value: ruta + "clienteInformacionUsuario/" + id,
                    size: 200,
                    backgroundAlpha: 1,
                    foreground: "#3c3c3c",
                    background: "white",
                    foregroundAlpha: 1,
                    level: "H",
                });

                var valorUrl = $("#codigo").attr("src");
                console.log(valorUrl);
                $('html, body').animate({
                    scrollTop: $(".form-inputs").offset().top
                }, 2000);

                // CREACION DE IMG DEL QR Y ENVIO DE CORREO
                $.ajax({
                    type: "POST",
                    url: ruta + "/Home/QR",
                    data: {
                        'id': response["Id"],
                        imgBase64: valorUrl,
                    },
                    dataType: "json",
                    success: function (data) {
                        console.log(data);
                        if (data != 'ExisteImagen') {
                            $.ajax({
                                type: "POST",
                                url: ruta + "/Home/Correo",
                                dataType: "text",
                                data: {
                                    'correo': response["Correo"],
                                    'id': response["Id"],
                                },
                                success: function (date) {
                                    console.log(date);
                                },
                                error: function (e) {
                                    console.log(e);
                                }
                            });
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }


        });

    }

    // FUNCION STRIPE
    function pagoStripe(id, tipoPago, monto) {
        // function pagoStripe(monto, idsocio, descripcion, correo, nombre, apellido, sexo, gymId, talla, tipoPago, edad) {
        if (window.stripeInstance) {
            console.log("Ya existe una instancia de Stripe.");
            $("#stripeModal").modal('show');
            return;
        }
        $("#stripeModal").modal('show');
        // PRODUCCION
        const stripe = Stripe(stripePublicId);
        window.stripeInstance = stripe;
        initialize();
        // Fetch Checkout Session and retrieve the client secret
        function initialize() {
            $.ajax({
                url: ruta + "Stripe/createSession",
                type: "POST",
                data: {
                    'id': id,
                    'tipoPago': tipoPago,
                    'monto': monto
                },
                dataType: "JSON",
                success: function (response) {
                    console.log(response);
                    const clientSecret = response.clientSecret;
                    console.log("clientSecret");
                    console.log(clientSecret);
                    stripe.initEmbeddedCheckout({
                        clientSecret,
                    }).then(function (checkout) {
                        console.log("checkout");
                        console.log(checkout);

                        // Mount Checkout
                        checkout.mount('#checkout');
                    });
                },
                error: function (e) {
                    console.log(e.responseText);
                    //console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
                }
            });
        }
    }

    /* botonSocio
botonNoSocio */
    $("#botonSocio").click(function () {
        Swal.fire({
            html: "<h3>Por favor, ingresa tu llave</h3><h4><i> (KEYFOB) </i></h4",
            input: "text",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Enviar",
            showLoaderOnConfirm: true,
            didOpen: () => {
                // Capturar el input
                const input = Swal.getInput();

                // Prevenir la inserción de espacios
                input.addEventListener('keydown', (e) => {
                    if (e.code === 'Space') {
                        e.preventDefault(); // Evita que el espacio sea ingresado
                    }
                });
            },
            preConfirm: (key) => {
                return new Promise((resolve) => {
                    $.ajax({
                        url: ruta + "/Home/validarKeyfobVariable",  // Cambia esta URL por tu endpoint
                        method: "GET",
                        data: { 'keyfob': key },
                        dataType: "json",
                        success: function (response) {
                            if (response == null || response == '') {
                                Swal.showValidationMessage('La llave no es correcta, por favor, inténtalo de nuevo');
                                resolve(false);
                            } else {
                                console.log(response);
                                $('#nombre').val(response["Nombre"] + " " + response["Apellidos"]);
                                $('#correo').val(response["Correo"]);
                                $('#sexo').val(response["Sexo"]);
                                $('#telefono').val(response["Telefono"]);
                                $('#keyfob').val(response["KeyFob"]).attr('readonly', true);
                                $("#textoKeyFob").hide(300);
                                $(".div-form-inputs").show(600);
                                $(".div-info-socio").hide(500);
                                resolve(response);
                            }
                        },
                        error: function () {
                            Swal.showValidationMessage('Hubo un problema con la solicitud');
                            resolve(false);
                        }
                    });
                });
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            // if (result.isConfirmed) {
            //     Swal.fire({
            //         title: "Llave correcta",
            //         text: `La llave es válida.`,
            //         icon: "success"
            //     });
            // }
        });
    });

    $("#botonNoSocio").click(function () {
        $(".div-form-inputs").show(800);
        $(".div-info-socio").hide(500);
    });

    // BOTON DE AGREGAR PARTICIPANTE
    $("#formAgregarParticipante").submit(function (e) {
        e.preventDefault();

        var validacion = 0;

        // FUNCION QUE VALIDA QUE TODO LOS CAMPOS OBLIGATORIOS ESTEN LLENOS
        function validarCampo(campo) {
            if ($(campo).is(':visible')) {
                if ($(campo).val() == "" || $(campo).val() == null) {
                    $(campo).addClass('is-invalid');
                    validacion += 1;
                } else {
                    $(campo).removeClass('is-invalid');
                    validacion += 0;
                }
            }
        }

        // RECORREMOS LOS INPUTS PARA SABER CUALES ESTAN VISIBLES
        $("#nombre, #correo, #playera, #sexo, #telefono, #edad").each(function () {
            validarCampo(this);
        });

        function limpiarInputs() {
            $("#nombre, #correo, #playera, #sexo, #telefono, #cupon, #keyfob, #edad").each(function () {
                $(this).val('');
            });
        }

        if (validacion == 0) {
            if ($("#edad").val() <= 17) {
                Swal.fire({
                    title: "Opss!",
                    text: "Lo sentimos, debes ser mayor de edad para participar en la carrera",
                    icon: "info"
                });
                return;
            }

            $.ajax({
                type: "POST",
                url: $('#formAgregarParticipante').attr('action'),
                data: new FormData(this),
                contentType: false,
                cache: false,
                processData: false,
                dataType: "json",
                beforeSend: function () {
                    Swal.fire({
                        didOpen: function () {
                            Swal.showLoading()
                        },
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showConfirmButton: false
                    });
                },
                success: function (response) {
                    Swal.close();
                    console.log(response);

                    // KEYFOB INVALIDA
                    if (response == 'KeyFobInvalida') {
                        Swal.fire({
                            title: "Error!",
                            text: "La KeyFob no es correcta, por favor, inténtalo de nuevo",
                            icon: "warning"
                        });
                    }

                    // YA EXISTE PASE DOBLE
                    if (response == 'ExistePaseDoble') {
                        Swal.fire({
                            title: "Opss!",
                            text: "Lo sentimos, la promoción ya fue aplicada!",
                            icon: "info"
                        });
                    }

                    // ERROR AL INSERTAR REGISTRO
                    if (response == 'ErrorAgregarParticipante') {
                        Swal.fire({
                            title: "Error!",
                            text: "Hubo un error al guardar tu registro, por favor, inténtalo de nuevo o ponte en contacto con nosotros",
                            icon: "error"
                        });
                    }

                    // NO EXISTE EL CUPON
                    if (response == 'NoExisteCupon') {
                        Swal.fire({
                            title: "Opss!",
                            text: "El cupón no es válido, inténtalo de nuevo",
                            icon: "info"
                        });
                    }

                    // EL CUPON NO ESTÁ ACTIVO
                    if (response == 'CuponInactivo') {
                        Swal.fire({
                            title: "Opss!",
                            text: "Lo sentimos, el cupón no está disponible en este momento",
                            icon: "info"
                        });
                    }

                    // EL CUPON ALCANZO SU LIMITE MAXIMO 
                    if (response == 'CuponLleno') {
                        Swal.fire({
                            title: "Opss!",
                            text: "El cupón ha alcanzado su límite máximo de uso.",
                            // text: "Lo sentimos, el cupón alcanzó su límite máximo",
                            icon: "info"
                        });
                    }

                    // REGISTRO EXITOSO GRATIS
                    if (response["Status"] == 'RegistroExitosoGratuito') {

                        Swal.fire({
                            title: "Registrado",
                            html: "Tu participación en la carrera de las Hortensias se ha registrado correctamente.<br> Te esperamos en el evento!",
                            icon: "success"
                        });

                        // SE LIMPIAN LOS CAMPOS DEL FORMULARIO
                        limpiarInputs();

                        llenarTicket(response["IdParticipante"]);
                    }

                    // LIMITE DE REGISTRO EXCEDIDO
                    if (response == 'LimiteExcedido') {
                        Swal.fire({
                            title: "Lo sentimos",
                            text: "No quedan lugares para la carrera",
                            icon: "info"
                        });
                        window.location.reload();
                    }

                    // REGISTRO CON CUPON/KEYFOB
                    if (response['Status'] == 'RegistroExitoso') {
                        console.log(response);
                        var id = response["IdParticipante"];
                        var montoPagar;

                        // SE REVISA SI EL REGISTRO FUE CON CUPON O SIN CUPON
                        if (response['CuponAplicado'] == 'SinCupon') {

                            var costoTotal = parseFloat(response["PrecioOriginal"]).toLocaleString('es-MX', {
                                style: 'currency',
                                currency: 'MXN'
                            });

                            var costoReal = parseFloat(response["PrecioOriginal"]).toLocaleString('es-MX', {
                                style: 'currency',
                                currency: 'MXN'
                            });

                            // Asignar los valores formateados a los elementos correspondientes
                            $("#ticket-costoTotal").html(costoTotal);

                            $("#ticket-costoReal").html(costoReal);

                            $("#ticket-descuento").html('No Aplica');

                            montoPagar = response["PrecioOriginal"] * 100;

                        } else {

                            var costoTotal = parseFloat(response["PrecioOriginal"]).toLocaleString('es-MX', {
                                style: 'currency',
                                currency: 'MXN'
                            });

                            var costoReal = parseFloat(response["PrecioConDescuento"]).toLocaleString('es-MX', {
                                style: 'currency',
                                currency: 'MXN'
                            });

                            $("#ticket-costoTotal").html(costoTotal);

                            $("#ticket-costoReal").html(costoReal);

                            $("#ticket-descuento").html(response["Descuento"] + '%');

                            montoPagar = response["PrecioConDescuento"] * 100;

                        }

                        Swal.fire({
                            title: "Registrado",
                            html: "<h4>Te has registrado exitosamente.</h4> <h5> A continuación, procederás con el pago...</h5>",
                            icon: "success"
                        }).then(() => {

                            // ABRIR MODAL DE SELECTOR DE PAGO
                            $("#selectorPago").modal('show');

                            // EVITAR CERRAR MODALES
                            $('#selectorPago').modal({
                                backdrop: 'static',
                                keyboard: false
                            })

                            // Encuentra el botón de cierre del modal
                            // var closeButton = $('#selectorPago .btn-close');

                            // MANDA ALERTA DE PERDIDA DE PROCESO EN CASO DE CERRAR MODAL
                            $('#selectorPago').on('hide.bs.modal', function (e) {
                                e.preventDefault();
                                Swal.fire({
                                    title: '¿Estás seguro de cancelar el pago?',
                                    text: "Perderás todo tu proceso",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Sí, cerrar',
                                    cancelButtonText: 'No, cancelar'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        $.ajax({
                                            type: "GET",
                                            url: ruta + "/Home/CancelarRegistro",
                                            data: {
                                                'id': id
                                            },
                                            dataType: "json",
                                            success: function (response) {
                                                console.log(response);
                                                window.location.reload();
                                            },
                                            // ERROR AL CANCELAR REGISTRO
                                            error: function (e) {
                                                console.log(e);
                                                Swal.fire({
                                                    title: "Error",
                                                    text: "Hubo un error al eliminar registro, por favor, comunicate con nosotros",
                                                    icon: "error"
                                                });
                                            }
                                        });
                                    }
                                });
                            });

                            // PAGO CON TARJETA
                            $("#pagoTarjeta").click(function () {

                                // MOSTRAMOS PAGO TARJETA
                                $("#stripeModal").modal('show');
                                $(".title-stripe").html('Pago con Tarjeta (STRIPE)');

                                pagoStripe(id, 'card', montoPagar);
                            });

                            $("#pagoOXXO").click(function () {

                                // MOSTRAMOS PAGO OXXO
                                $("#stripeModal").modal('show');
                                pagoStripe(id, 'oxxo', montoPagar);
                            });

                        });

                    }

                },
                error: function (e) {
                    Swal.close();
                    console.log(e);
                }
            });
        }
    });

    // CUANDO EL PAGO ES CON STRIPE
    if (url.includes("StripePasarela_ID")) {

        // SE CONSULTA EL ESTADO DEL PAGO CON STRIPE
        $.ajax({
            type: "GET",
            url: ruta + "/Stripe/estadoStripe",
            data: {
                'id': datos["StripePasarela_ID"]
            },
            dataType: "json",
            beforeSend: function () {
                Swal.fire({
                    didOpen: function () {
                        Swal.showLoading()
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false
                });
            },
            success: function (response) {
                console.log(response);
                Swal.close();
                if (response.error && response.error.includes("Unexpected error communicating with Stripe")) {
                    Swal.fire({
                        title: "Error",
                        html: "<p>Hubo un error al conectar con Stripe, por favor, recarga la página o copia la siguiente dirección y mándala al administrador </p>" + '<h6 class="text-primary"><i>' + url + '</i></h6>',
                        icon: "error"
                    });
                    return;
                }

                // CARGAMOS LOS DATOS QUE NOS TRAE LA RESPUESTA DE STRIPE
                var idPago = response[0]["payment_intent"];
                var urlPago = response[0]["return_url"];
                var idParticipante = response[0]["metadata"]["id"];
                var idOrden = response[0]["id"];

                // SE ACTUALIZA EL REGISTRO CON LOS ID'S DE PAGO
                $.ajax({
                    type: "GET",
                    url: ruta + "Home/actualizarRegistro",
                    data: {
                        'idParticipante': idParticipante,
                        'idOrden': idOrden,
                        'urlPago': urlPago,
                        'idPago': idPago
                    },
                    dataType: "json",
                    success: function (response) {
                        llenarTicket(idParticipante);
                        console.log(response);
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });

            },
            error: function (e) {
                Swal.close();
                console.log(e);
            }
        });
    }

});