<?php
ini_set('max_execution_time', 32000);
//echo ini_get('max_execution_time'); // 100

include_once($_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/main/include.php');    // класы битрикс
include_once('support.php');
include_once('smallORM.php');
include_once('class_pvz.php');

include_once('geo_plugin_locate.php');

/*
для работы необходимы таблицы в базе
p_cse_geo_city_key   - для geo ключей
p_cse_time_delivery  - сроки доставки по напрвлениям
p_cse_data_point_pvz - данные о пунктах выдачи
*/

$api     = new PVZ;
$support = new support;
$db      = new mySql;

$geoplugin = new geoPlugin;

//$data = $api->get_pvz_point();
//$data = $api->GetLocalCity();

$geoplugin->locate();

echo $geoplugin->city;

//echo get_city_location();

//echo '<pre>';print_r($data);echo '</pre>';