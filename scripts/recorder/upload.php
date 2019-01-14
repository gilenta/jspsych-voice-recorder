<?php

// pull the raw binary data from the POST array
$data = substr($_POST['data'], strpos($_POST['data'], ",") + 1);
// decode it
$decodedData = base64_decode($data);
// print out the raw data, 
//echo ($decodedData);
$subject = $_POST['subjectID']; 
$filename = $_POST['fname'];

// write data to mp3 file
$fp = fopen('../../data/recordings/'.$subject.'/'.$filename, 'wb');
fwrite($fp, $decodedData);
fclose($fp);
?>
