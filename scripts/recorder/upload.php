<?php

// pull the raw binary data from the POST array
$data = substr($_POST['data'], strpos($_POST['data'], ",") + 1);
// decode it
$decodedData = base64_decode($data);
// print out the raw data, 
//echo ($decodedData);
$subject = $_POST['subjectID']; 
$filename = $_POST['fname'];//'audio_recording_' . date( 'Y-m-d-H-i-s' ) .'.mp3';

// create data directory if not already present
/*
if(!is_dir('data')){
	$res = mkdir('data',0777); 
}


// create directory for participant if not already present
if(!is_dir('data/'.$subject.'/recordings',0777)) {
    $res =  mkdir('data/'.$subject.'/recordings',0777);
}

// create recordings sub-directory if not already present
if(!is_dir('data/'.$subject,0777)) {
    $res =  mkdir('data/'.$subject,0777);
}

*/

// write the data out to the file
$fp = fopen('../../data/recordings/'.$subject.'/'.$filename, 'wb');
fwrite($fp, $decodedData);
fclose($fp);
?>