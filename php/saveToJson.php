<?php

    $jsonstring=file_get_contents("php://input");
    $jsonstring=utf8_encode($jsonstring);
    $json=json_decode($jsonstring);

    file_put_contents($json->{"file"}, json_encode($json->{"data"}));
    

?>