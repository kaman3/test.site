<?
include_once($_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/main/include.php');    // класы битрикс
include_once('support.php');
include_once('smallORM.php');
include_once('class_pvz.php');

$api     = new PVZ;
$support = new support;
$db      = new mySql;


// $response = $db->findAllSql('SELECT city FROM wp_city_russia');

//    foreach ($response as $key => $value) {
//       $data[] = $value['city'];
//    }


// $data = json_encode($data, JSON_UNESCAPED_UNICODE);


// $filename = $_SERVER['DOCUMENT_ROOT'].'/include/ks_pvz/list-city.json';
// $fd = fopen($filename, 'w') or die("не удалось создать файл");

// fwrite($fd, $data);
// fclose($fd);

$data = $api->get_pvz_point();
$support->res($data);

// $data = $api->testGetPvzSource();
// echo '<pre>'; print_r($data); echo '</pre>';

//$data = $api->get_pvz_point();