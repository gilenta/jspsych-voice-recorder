<?php

// this path should point to your configuration file.
include('../sql_config/main_database_config.php');

$subject = $_POST['ID'];


try {
  $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
  // Look up subject ID in database and return subject info
  $stmt = $conn->prepare("SELECT DISTINCT ex_group, list, gi, ro, wa, ne FROM `$table` WHERE subject=?");
  $stmt->execute([$subject]);  
  $result = $stmt->fetchObject();


  echo json_encode($result);
    

} catch(PDOException $e) {
  echo '{"success": false, "message": ' . $e->getMessage();
}
$conn = null;
?>