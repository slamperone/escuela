<!DOCTYPE html>
<html lang="en">
<head>
	<title>Formulario de contacto</title>
  <meta name="charset" content="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
</head>
<body>
<style type="text/css">
  body{
    font-family: Arial, Helvetica, sans-serif;
  }
</style>
  <div class="contenedor" style="position: relative; margin: auto; width: 600px; height: auto;">

    <div>
      <table width="550px" border="0" cellspacing="0" cellpadding="0" align="center" style="background: white;margin: auto;border-radius: 5px;  padding: 20px 65px;">
        <tr>
          <td align="left" colspan="2">
            <p style="  font-size: 16px;"><?= $params['yo']; ?> ha solicitado información a traves del sitio web.</p>
          </td>
        </tr>
        <tr>
          <td align="left">Nombre: </td>
          <td><?= $params['yo'] ?></td>
        </tr>
        <tr>
          <td align="left">Correo: </td>
          <td><?= $params['mail'] ?></td>
        </tr>
        <tr>
          <td align="left">Teléfono: </td>
          <td><?= $params['telefono'] ?></td>
        </tr>
        <tr>
          <td align="left">Mensaje: </td>
          <td><?= $params['mensaje'] ?></td>
        </tr>
        <tr>
          <td align="left" colspan="2">Correo autogenerado el <?= $params['fecha'] ?> a las <?= $params['hora'] ?> </td>
        </tr>
      </table>
    </div>
  </div>
</body>

</html>
