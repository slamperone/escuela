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

		if (send($params, $msj)){
			$infoType = 'error';
			$message  = 'Ocurrió un problema al tratar de enviar tu mensaje, por favor inténtalo de nuevo.';

		} else {
			$infoType = 'success';
			$message  = '¡Listo! Tu mensaje fue enviado.';


		}
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
	//Esta cambialo por 'smtp.gmail.com';
	$phpMailer->Host        = 'mail.develupme.com';
	//587
	$phpMailer->Port        = 465;
	$phpMailer->SMTPSecure = 'ssl';
	$phpMailer->SMTPAuth    = true;
	$phpMailer->CharSet     = 'UTF-8';
//Creo que serias muy pendejo si no entiendes que debes cambiar aqui
	$phpMailer->Username = 'hola@develupme.com';
	$phpMailer->Password = '@lgo123#';
//Este es el remitente
	$phpMailer->setFrom('info@escuelita.com', 'Instituto Cultural de Estudios Superiores del Bosque');
//Este es el destinatario
	$phpMailer->addAddress('miguel.adrian.trejo@gmail.com', 'Oficina virtual');
	$phpMailer->Subject = $params['asunto'];
	$phpMailer->Body = (string)$msj;
	$phpMailer->AltBody = "";



	if(!$phpMailer->send()) {
				//echo "Mailer Error: " . $phpMailer->ErrorInfo;
				$res = true;
		}

	//echo $res;

	return $res;

}
