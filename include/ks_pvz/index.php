<?
include_once($_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/main/include.php');    // класы битрикс
include_once('support.php');
include_once('smallORM.php');
include_once('class_pvz.php');

/*
для работы необходимы таблицы в базе
p_cse_geo_city_key   - для geo ключей
p_cse_time_delivery  - сроки доставки по напрвлениям
p_cse_data_point_pvz - данные о пунктах выдачи
*/

$api     = new PVZ;
$support = new support;
$db      = new mySql;

$start_city = $_POST['start_city'];

// массив для записи основных данных, для рендера карты
$data = array();

if(isset($start_city)){
   
   $data['centerMaps']   = $api->getGeoCityKey($start_city);
   $data['deliveryTime'] = $api->get_time_delivery('Пенза', $start_city);

   // получаем данные по точкам в выбраном городе
   if(isset($data['centerMaps']['geo'])){
      $listPoint = $db->findAllSql('SELECT * FROM p_cse_data_point_pvz WHERE geo = "'.$data['centerMaps']['geo'].'"');

      foreach ($listPoint as $key => $value) {
      	$data['pointPvz'][$key] = $value;
      }
   }
}

if(is_array($data)){
   header('Content-Type: application/json');
   echo json_encode($data);
}else{
   echo 'error'; 
}
//$data = $api->get_time_delivery('Пенза','Москва');
//$data = $api->get_pvz_point();
//$support->res($data);
?>