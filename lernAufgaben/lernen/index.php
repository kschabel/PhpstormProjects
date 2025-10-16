<?php
$count = $_GET['count'];
$count2 = $count * 2;
echo "$count <br>";
for ($i = 1; $i <= $count2 - 1; $i++) {
    $stars = $i <= $count ? $i : $count2 - $i;
    for ($j = 0; $j < $stars; $j++) {
        echo "*";
    }
    echo "<br>";
}

//