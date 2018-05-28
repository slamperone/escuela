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
		'mail'  	=> trim($_POST['mail']),
		'telefono' => trim($_POST['tel']),
		'mensaje'  	=> trim($_POST['msg']),
		'fecha'     => date('d/F/Y'),
		'hora'      => date('H:i'),
		'asunto'    => 'Alguien escribio en la página web'
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
	$phpMailer->Host        = 'mail.develupme.com';
	$phpMailer->Port        = 465;
	$phpMailer->SMTPAuth    = true;
	$phpMailer->CharSet     = 'UTF-8';

	$phpMailer->Username = 'hola@develupme.com';
	$phpMailer->Password = '@lgo123#';

	$phpMailer->setFrom('info@escuelita.com', '');
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
