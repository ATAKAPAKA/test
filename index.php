<?
$path = $_SERVER["DOCUMENT_ROOT"] . "/dataBase.json";
$file = fopen($path, 'r+');
$json = fread($file, filesize($path));
if (isset($_REQUEST["url"])) {
    if ($_REQUEST["url"] == "zones") {
        header('Content-Type: application/json');
        echo $json;
        fclose($file);
    }
} else {
    $array = json_decode($json, true);
    include $_SERVER["DOCUMENT_ROOT"] . "/view/main.php";
}
