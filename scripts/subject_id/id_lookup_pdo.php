<?php include (__DIR__.'/scripts/sql_config/main_database_config.php');

$subject = $_POST['ID']; 

echo $dbname;
echo $subject;
echo $username;

try {
  $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
  $sql = "SELECT DISTINCT ex_group FROM pilot WHERE subject= '".$subject."'";
  $result = $conn->query($sql);

  echo $result;

  echo '{"success": true}';
} catch(PDOException $e) {
  echo $sql;
  echo '{"success": false, "message": ' . $e->getMessage();
}
$conn = null;
?>