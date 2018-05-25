<?php
date_default_timezone_set('America/Mexico_City');
require ('libs/PHPMailerAutoload.php');
$msj = '';
$error   = true;
$message = '';
$infoType = '';

if (isset($_POST) && !empty($_POST)) {

	$params  = array(
		'yo'    	=> trim($_POST['name']),
		'mail'  	=> trim($_POST['email']),
		'telefono' => trim($_POST['telephone']),
		'mensaje'  	=> trim($_POST['message']),
		'fecha'     => date('d/F/Y'),
		'hora'      => date('H:i'),
		'asunto'    => 'Formulario de contacto.'
	);
	$tipos = 'mensaje.php';

	ob_start();
	include ($tipos);

	$msj= ob_get_clean();

	if ($error && !empty($message)) {
		echo json_encode(['info' => 'error', 'msg' => $message]);
	} else {

		//echo 'intenta enviar';
		if (send($params, $msj)){
			//echo 'no se fue';
			$infoType = 'error';
			$message  = 'Ocurrió un problema al tratar de enviar tu mensaje, por favor inténtalo de nuevo.';

		} else {
			//echo 'se fue';
			$infoType = 'success';
			$message  = '¡Listo! Tu mensaje fue enviado.';


		}
		//send($params, $msj);
		echo json_encode(['info' => $infoType, 'msg' => $message]);

	}

}

function send($params,$msj)
{
	$res = false;
	$phpMailer = new PHPMailer();
	$phpMailer->isSMTP();
	$phpMailer->IsHTML(true);
	$phpMailer->Debugoutput = 'html';
	$phpMailer->Host        = 'mail.ddbmexico.com.mx';
	$phpMailer->Port        = 587;
	$phpMailer->SMTPAuth    = true;
	$phpMailer->CharSet     = 'UTF-8';

	$phpMailer->Username = 'alberto.perez@ddbmexico.com';
	$phpMailer->Password = 'Enero2018';

	$phpMailer->setFrom('josepc11@hotmail.com', '');
	$phpMailer->addAddress($params['mail'], $params['yo']);
	$phpMailer->Subject = $params['asunto'];
	$phpMailer->Body = (string)$msj;
	$phpMailer->AltBody = "";



	if(!$phpMailer->send()) {
				echo "Mailer Error: " . $phpMailer->ErrorInfo;
				$res = true;
		}
	echo $res;

	return $res;

}
