<?php
// Simple PHP mail handler for contact form
// Replace 'sararellano@gmail.com' with your email if needed

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $eventType = isset($_POST['event_type']) ? htmlspecialchars($_POST['event_type']) : '';
    $name = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '';
    $email = isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '';
    $date = isset($_POST['date']) ? htmlspecialchars($_POST['date']) : '';

    $to = 'sararellano@gmail.com';
    $subject = "Nuevo mensaje de Momento Wow";
    $headers = "From: noreply@" . $_SERVER['SERVER_NAME'] . "\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $body = "Tipo de evento: $eventType\n";
    $body .= "Nombre: $name\n";
    $body .= "Email: $email\n";
    $body .= "Fecha del evento: $date\n";
    $body .= "Enviado el: " . date('d/m/Y H:i') . "\n";

    if ($name && $email) {
        if (mail($to, $subject, $body, $headers)) {
            // Success
            header('Location: index.html?sent=1#contacto');
            exit();
        } else {
            // Failure
            header('Location: index.html?sent=0#contacto');
            exit();
        }
    } else {
        // Missing fields
        header('Location: index.html?sent=0#contacto');
        exit();
    }
} else {
    // Not a POST request
    header('Location: index.html');
    exit();
}
