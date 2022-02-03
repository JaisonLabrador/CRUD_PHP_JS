<?php

$host = "localhost";
$bd = "crud_test";
$usuario = "root";
$contrasenia = "";

try {
    $conexion = new PDO("mysql:host=$host;dbname=$bd", $usuario, $contrasenia);
    // echo "Conectado...";
} catch (Exception $ex) {
    echo $ex->getMessage();
}

if (isset($_GET['accion']) == "insertar") {

    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $identificacion = $_POST['identificacion'];
    $direcion = $_POST['direccion'];

    $sentenciaSQL = $conexion->prepare("INSERT INTO form_registro (nombre,apellido,identificacion,direccion) VALUES (:nombre,:apellido,:identificacion,:direccion);");

    $sentenciaSQL->bindParam(':nombre', $nombre);
    $sentenciaSQL->bindParam(':apellido', $apellido);
    $sentenciaSQL->bindParam(':identificacion', $identificacion);
    $sentenciaSQL->bindParam(':direccion', $direcion);
    $sentenciaSQL->execute();
    exit();
}

// borrar pero se le debe enviar una clave (para poder borrarlo)

if (isset($_GET["borrar"])) {

    $id = $_GET["borrar"];

    $sentenciaSQL = $conexion->prepare("DELETE FROM form_registro WHERE id=:id");
    $sentenciaSQL->bindParam(':id', $id);
    $sentenciaSQL->execute();
    exit();
}

// se consulta datos con una clave y se puedan editar

if (isset($_GET["consultar"])) {

    $id = $_GET["consultar"];

    $sentenciaSQL = $conexion->prepare("SELECT * FROM form_registro WHERE id=" . $id);
    $sentenciaSQL->execute();
    $listarform_registro = $sentenciaSQL->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($listarform_registro);
    exit();
}

if (isset($_GET["actualizar"])) {
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $identificacion = $_POST['identificacion'];
    $direcion = $_POST['direccion'];

    $sentenciaSQL = $conexion->prepare("UPDATE form_registro SET nombre=:nombre,apellido=:apellido,identificacion=:identificacion,direccion=:direccion WHERE id=:id");

    $sentenciaSQL->bindParam(':id', $id);
    $sentenciaSQL->bindParam(':nombre', $nombre);
    $sentenciaSQL->bindParam(':apellido', $apellido);
    $sentenciaSQL->bindParam(':identificacion', $identificacion);
    $sentenciaSQL->bindParam(':direccion', $direcion);
    $sentenciaSQL->execute();

    echo json_encode(["success" => 1]);
    exit();
}


$sentenciaSQL = $conexion->prepare("SELECT * FROM form_registro");
$sentenciaSQL->execute();
$listarform_registro = $sentenciaSQL->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($listarform_registro);
