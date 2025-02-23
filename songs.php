<?php
$songs = array_diff(scandir('songs'), array('.', '..'));
echo json_encode(array_values($songs));
?>