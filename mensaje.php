<!DOCTYPE html>
<html lang="en">
<head>
	<title>Promociones VW: Grandes ofertas en autos, servicios y refacciones</title>
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
    <div style="width: 550px; margin:auto;">
      <div style="position: relative;height: 100px;width: 100px;float: left;">
        <img src="https://promociones.vw.com.mx/mailing/images/logo.png" alt="">
      </div>
      <div style="position: relative;height: 100px;width: 250px;float: right;">
        <img src="https://promociones.vw.com.mx/mailing/images/copy.png" alt="">
      </div>
    </div>
    <div>
      <table width="550px" border="0" cellspacing="0" cellpadding="0" align="center" style="background: white;margin: auto;border-radius: 5px;  padding: 20px 65px;">
        <tr>
          <td align="left">
            <p style="  font-size: 16px;">¡Hola <?= $params['yo'].'!'; ?></p>
          </td>
        </tr>
        <tr>
          <td align="left">
           <p style="font-size: 14px;">acaba de compartirte una <a href="" style="color:#00b3ee;">promoción especial.</a></p>
          </td>
        </tr>
        <tr>
          <td align="center">
            <p style="font-size:22px;"></p>
          </td>
        </tr>
        <tr>
          <td align="center">
          <img src="?>" width="100%">
          </td>
        </tr>
        <tr>
          <td align="center">
          </td>
        </tr>
        <tr>
          <td align="left">
            <p style="width: 340px; font-size:14px;">
            <?php
  if($params ['cual']!='error'){
    echo '<a href="'.$models[$_POST['model']][1].'" style="color:#00b3ee; ">Configura tu '.$params['cual'].'</a>';
  }
?>


            o entra a <a href="https://promociones.vw.com.mx/" style="color:#00b3ee;">ver más promociones</a> que Volkswagen tiene para ti este mes.</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 20px;">
            <span style="color:#00b3ee; font-size: 16px;">¡Animate a estrenar el tuyo!</span>
          </td>
        </tr>
      </table>
    </div>
    <div class="termimos">
      <p style="background: #F3F5F6; color: #717272; padding: 20px 45px; font-size: 10px;">
      </p>
    </div>
  </div>
</body>

</html>
