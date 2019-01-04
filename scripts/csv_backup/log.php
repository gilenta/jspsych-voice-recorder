<?php

// Extract data from form
$data = $_POST['data']; 
$filename = $_POST['filename'];//'audio_recording_' . date( 'Y-m-d-H-i-s' ) .'.mp3';
$subject = $_POST['subject']; 
$subdir = $_POST['subdir']; // subdirectory where file needs to be save ('logs' or 'surveys')

/*
// create recordings directory if not already present
if(!is_dir('data')){
    $res = mkdir('data',0777); 
}

// create directory for participant if not already present
if(!is_dir('data/'.$subject,0777)) {
    $res =  mkdir('data/'.$subject,0777);
}

*/

// write the data out to the file
$fp = fopen('../../data/'.$subdir.'/'.$filename, 'wb');
fwrite($fp, $data);
fclose($fp);
?>
