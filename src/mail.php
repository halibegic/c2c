<?php
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];
$company = $_POST['company'];
header('Content-Type: application/json');

if ($name === '') {
    print json_encode(array('message' => 'Name cannot be empty', 'code' => 0));
    exit();
}

if ($company === '') {
    print json_encode(array('message' => 'Company cannot be empty', 'code' => 0));
    exit();
}

if ($email === '') {
    print json_encode(array('message' => 'Email cannot be empty', 'code' => 0));
    exit();
} else {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        print json_encode(array('message' => 'Email format invalid.', 'code' => 0));
        exit();
    }
}

if ($message === '') {
    print json_encode(array('message' => 'Message cannot be empty', 'code' => 0));
    exit();
}

$content = "From: $name \nCompany: $name \nEmail: $email \nMessage: $message";
$recipient = "hasan461@gmail.com";
$mailheader = "From: $email \r\n";
mail($recipient, 'C2C Contact Form', $content, $mailheader) or die("Error!");
print json_encode(array('message' => 'Email successfully sent!', 'code' => 1));
exit();
