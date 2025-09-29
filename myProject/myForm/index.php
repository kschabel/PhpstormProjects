<?php
// DB connection
require __DIR__ . '/db.php';

// Count how many messages already exist
$stmt = $PDO->query("SELECT COUNT(*) FROM formInputs");
$totalMessages = $stmt->fetchColumn();

// If form submitted
$lastMessage = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name    = $_POST['name']    ?? '';
    $email   = $_POST['email']   ?? '';
    $message = $_POST['message'] ?? '';
    $time    = date('Y-m-d H:i:s');

    // Save message to DB
    $stmt = $PDO->prepare("INSERT INTO formInputs (name,email,message,time)
                           VALUES (:n,:e,:m,:t)");
    $stmt->execute([
            ':n' => $name,
            ':e' => $email,
            ':m' => $message,
            ':t' => $time
    ]);

    // Store last message for output
    $lastMessage = [
            'name'    => $name,
            'email'   => $email,
            'message' => $message,
            'time'    => $time
    ];

    // Update counter after insert
    $stmt = $PDO->query("SELECT COUNT(*) FROM formInputs");
    $totalMessages = $stmt->fetchColumn();
}
?>

<!DOCTYPE html>
<html>
<body>
<h3>You have already sent <?= $totalMessages ?> message(s).</h3>

<form method="POST" action="">
    <hr>
    <h1>My Form</h1>
    <p>Please fill out our contact form:</p>
    <p><i>(all fields with * are required)</i></p><br>

    <label><strong>*Name:</strong></label><br>
    <input type="text" name="name" placeholder="Enter your name here" required autofocus pattern="[A-Za-z]+"><br><br>

    <label><strong>*E-mail-address:</strong></label><br>
    <input type="email" name="email" placeholder="Enter your e-mail here" required
           pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"><br><br>

    <label><strong>*Message:</strong></label><br>
    <textarea rows="6" name="message" cols="50" maxlength="300"
              placeholder="Enter your message here (max. 300 characters)"></textarea><br><br>

    <input type="checkbox" name="AGB" value="AGB" required>
    Please confirm you have read our policy.<br><br>

    <button type="submit"><strong>Send</strong></button><br><br>
</form>
<hr>

<?php if ($lastMessage): ?>
    <h2>Thank you for your message!</h2>
    <p>We will respond as soon as possible.</p>
    <p><u>Your information:</u></p>
        <p><strong>
        Name: <?= htmlspecialchars($lastMessage['name']) ?><br>
        Email: <?= htmlspecialchars($lastMessage['email']) ?><br>
        Message: <?= htmlspecialchars($lastMessage['message']) ?><br>
        Time: <?= $lastMessage['time'] ?>
        </strong></p>
<?php endif; ?>
</body>
</html>
