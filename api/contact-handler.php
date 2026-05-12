<?php
// Contact Form Handler with Security & Validation
// Place this file in your project root or /api/ directory

// Set proper headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

// Rate limiting (1 request per 5 seconds per IP)
$ip = $_SERVER['REMOTE_ADDR'];
$rateLimitFile = '/tmp/ratelimit_' . md5($ip) . '.txt';
if (file_exists($rateLimitFile)) {
    $lastRequest = file_get_contents($rateLimitFile);
    if (time() - $lastRequest < 5) {
        http_response_code(429);
        echo json_encode(['status' => 'error', 'message' => 'Too many requests. Please wait.']);
        exit();
    }
}
file_put_contents($rateLimitFile, time());

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate CSRF token (if you implement token generation)
if (empty($input['csrf_token'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing CSRF token']);
    exit();
}

// Sanitize and validate inputs
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$service = trim($input['service'] ?? '');
$budget = trim($input['budget'] ?? '');
$message = trim($input['message'] ?? '');

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Name is required (minimum 2 characters)';
}

if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email address';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message is required (minimum 10 characters)';
}

// Check for spam/suspicious content
$spamKeywords = ['viagra', 'casino', 'lottery', 'click here', 'free money'];
$combined = strtolower($name . ' ' . $message);
foreach ($spamKeywords as $keyword) {
    if (strpos($combined, $keyword) !== false) {
        $errors[] = 'Message contains suspicious content';
    }
}

// Return validation errors
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => implode(', ', $errors)]);
    exit();
}

// Sanitize for email
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$service = htmlspecialchars($service, ENT_QUOTES, 'UTF-8');
$budget = htmlspecialchars($budget, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Email to Ashish
$to = 'ashish795806@gmail.com';
$subject = 'New Portfolio Inquiry: ' . $name;

$emailBody = "
New Contact Form Submission
============================

Name: {$name}
Email: {$email}
Service: {$service}
Budget: {$budget}

Message:
{$message}

IP Address: {$_SERVER['REMOTE_ADDR']}
Timestamp: " . date('Y-m-d H:i:s') . "
";

$emailHeaders = "From: {$email}\r\n";
$emailHeaders .= "Reply-To: {$email}\r\n";
$emailHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email (use your preferred method - PHPMailer recommended for production)
$emailSent = mail($to, $subject, $emailBody, $emailHeaders);

// Log the submission
$logEntry = date('Y-m-d H:i:s') . " | {$name} | {$email} | {$service}\n";
file_put_contents('/tmp/portfolio_submissions.log', $logEntry, FILE_APPEND);

// Response
if ($emailSent) {
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you! Your message has been received. I will respond within 4 hours.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to send message. Please try again or contact directly.'
    ]);
}
?>
