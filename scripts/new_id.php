<?php

// Extract data from form
$subject = $_POST['ID']; 

// create data directory if not already present
if(!is_dir(__DIR__ .'/../data')){
    $res = mkdir(__DIR__ .'/../data',0777); 
}


// create recordings sub-directory if not already present
if(!is_dir('../data/recordings',0777)) {
    $res =  mkdir('../data/recordings',0777);
}


// create participant folder in recordings sub-directory if not already present
if(!is_dir('../data/recordings/'.$subject,0777)) {
    $res =  mkdir('../data/recordings/'.$subject,0777);
}


