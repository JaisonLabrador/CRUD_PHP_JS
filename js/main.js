// verificacion form

const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');

const expresiones = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    identificacion: /^\d{5,14}$/, // 7 a 10 numeros.
}

const campos = {
    nombre: false,
    apellido: false,
    identificacion: false,
}

const validarformulario = (e) => {
    switch (e.target.name) {
        case "nombre":
            validarCampo(expresiones.nombre, e.target, 'nombre');
            break;
        case "apellido":
            validarCampo(expresiones.apellido, e.target, 'apellido');
            break;
        case "correo":
            validarCampo(expresiones.correo, e.target, 'correo');
            break;
        case "identificacion":
            validarCampo(expresiones.identificacion, e.target, 'identificacion');
            break;
    }
}

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
        campos[campo] = true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
        campos[campo] = false;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarformulario);
    input.addEventListener('blur', validarformulario);
    limpiar();
});

$(document).ready(function() {});

// acciones de clck de los botones

$('#btn-editar').click(function(e) {
    editar();
});

// funciones CRUD

formulario.addEventListener('submit', (e) => {

    e.preventDefault();

    var datos = new FormData();

    datos.append('nombre', $('#nombre').val());
    datos.append('apellido', $('#apellido').val());
    datos.append('identificacion', $('#identificacion').val());
    datos.append('direccion', $('#direccion').val());

    // console.log(datos.get('nombre'));
    // alert(datos.get('nombre') + ' / ' + datos.get('apellido') + ' / ' + datos.get('identificacion') + ' / ' + datos.get('direccion'));

    $.ajax({
        type: "post",
        url: "index.php?accion=insertar",
        data: datos,
        processData: false,
        contentType: false,
        success: function(respuesta) {
            // console.log(respuesta);
            consultarDatos();
            limpiar();

        }
    });
});

function consultarDatos() {

    $("#registros").empty();

    $.getJSON("index.php", function(registros) {

        var formRegistro = [];

        $.each(registros, function(llave, valor) {

            if (llave >= 0) {

                var template = "<tr>";

                template += "<td>" + valor.id + "</td>";
                template += "<td>" + valor.nombre + "</td>";
                template += "<td>" + valor.apellido + "</td>";
                template += "<td>" + valor.identificacion + "</td>";
                template += "<td>" + valor.direccion + "</td>";
                template += '<td><input class="btn btn-info" type="button" onclick="seleccionar(' + valor.id + ')" value="Selecc" /> ';
                template += '<input class="btn btn-danger" type="button" onclick="borrar(' + valor.id + ')" value="Borrar" /></td>';
                template += "</tr>";

                formRegistro.push(template);
            }
        });

        $("#registros").append(formRegistro.join(""));

        // console.log(registros);

    });
}
consultarDatos();

function borrar(id) {

    $.get("index.php?borrar=" + id, function() {
        consultarDatos();
    });

}

function seleccionar(id) {

    $.getJSON("index.php?consultar=" + id, function(registros) {

        // console.log(registros);

        $('#id').val(registros[0]['id']);
        $('#nombre').val(registros[0]['nombre']);
        $('#apellido').val(registros[0]['apellido']);
        $('#identificacion').val(registros[0]['identificacion']);
        $('#direccion').val(registros[0]['direccion']);

        $('#btn-agregar').addClass('disabled');
        $('#btn-editar').removeClass('disabled');
        $('#btn-cancelar').removeClass('disabled');

    });
}

function editar() {

    var datos = new FormData();

    datos.append('id', $('#id').val());
    datos.append('nombre', $('#nombre').val());
    datos.append('apellido', $('#apellido').val());
    datos.append('identificacion', $('#identificacion').val());
    datos.append('direccion', $('#direccion').val());

    $.ajax({
        type: "post",
        url: "index.php?actualizar=1",
        data: datos,
        processData: false,
        contentType: false,
        success: function(respuesta) {
            // console.log(respuesta);
            consultarDatos();
            limpiar();

        }
    });

}

function limpiar() {

    $('#id').val("");
    $('#nombre').val("");
    $('#apellido').val("");
    $('#identificacion').val("");
    $('#direccion').val("");

    $('#btn-agregar').removeClass('disabled');
    $('#btn-editar').addClass('disabled');
    $('#btn-cancelar').addClass('disabled');

}