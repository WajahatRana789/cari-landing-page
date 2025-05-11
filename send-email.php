<?php
header('Content-Type: application/json');

require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Read JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (
    !$data ||
    !isset($data['name'], $data['email'], $data['university'], $data['role'])
) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

// Sanitize input
$name = htmlspecialchars($data['name']);
$email = htmlspecialchars($data['email']);
$university = htmlspecialchars($data['university']);
$role = htmlspecialchars($data['role']);
$preferredCallTime = isset($data['preferredCallTime']) ? htmlspecialchars($data['preferredCallTime']) : 'Not specified';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'wajahatrana789@gmail.com';
    $mail->Password = 'jsbi ytdl ctan fcls';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom('wajahatrana789@gmail.com', 'Contact Form');
    $mail->addAddress('wajahatrana789@gmail.com');

    $mail->isHTML(true);
    $mail->Subject = 'New Get In Touch Submission';
    $mail->Body = "
        <h3>New Contact Request</h3>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>University:</strong> {$university}</p>
        <p><strong>Role:</strong> {$role}</p>
        <p><strong>Preferred Call Time:</strong> {$preferredCallTime}</p>
    ";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Mailer Error: {$mail->ErrorInfo}"]);
}