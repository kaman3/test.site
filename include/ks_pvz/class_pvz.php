<?php

class PVZ extends mySql{


  public function __construct() {
     $this->login    = 'Ерютин';
     $this->password = 'iaFQzGeFcNZDTF1';
     $this->tarif    = '18c4f207-458b-11dc-9497-0015170f8c09';
  }

  function curl ($xml){
  
      if( $curl = curl_init() ) {      

        curl_setopt($curl, CURLOPT_URL, 'http://web.cse.ru/1c/ws/web1c.1cws'); 
        curl_setopt($curl, CURLOPT_RETURNTRANSFER,true); 
        curl_setopt($curl, CURLOPT_POST, true); 
        curl_setopt($curl, CURLOPT_POSTFIELDS, $xml);

        $out = curl_exec($curl); 
        
        curl_close($curl);
        
      }             
  
      return $out;
  }


  function getCenterMaps($city){

      $path = 'https://geocode-maps.yandex.ru/1.x/?apikey=7fe42279-f7c2-4165-b742-540a2d8cee95&format=json&results=1&geocode='.rawurlencode($city);
  
      if( $curl = curl_init() ) {      

        curl_setopt($curl, CURLOPT_URL, $path); 
        curl_setopt($curl, CURLOPT_RETURNTRANSFER,true); 
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2); 

        $out = curl_exec($curl);         
        curl_close($curl);
        
      }
      
      if(isset($out)){
         
         $data = json_decode($out,true);
         $coordinats = explode(' ', $data['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']['Point']['pos']);
         $best_coordinates = $coordinats[1].', '.$coordinats[0];

         return $best_coordinates;

      }else{
         return 'Не могу определить гео объект';
      }

  }

  public function getGeoCityKey($city){

    // подгоняем параметры для поиска
    $city_search = trim(strtolower($city));
    $city_search = $city_search.' г';

    // сначло смотрим в базе, если нет то просим по api
    $return = $this->findSql("SELECT * FROM p_cse_geo_city_key WHERE name LIKE '".$city_search."%'");
    if(isset($return['geo'])){
      
       $response['geo']        = $return['geo'];
       $response['centerMaps'] = $return['centerMaps'];
       return $response;

    }

    $request = '
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://www.cargo3.ru">
     <soap:Header/>
       <soap:Body>
         <ns1:GetReferenceData>
         <ns1:login>'.$this->login.'</ns1:login>
         <ns1:password>'.$this->password.'</ns1:password>
           <ns1:parameters>
           <ns1:Key>parameters</ns1:Key>
             <ns1:List>
             <ns1:Key>Reference</ns1:Key>
             <ns1:Value>Geography</ns1:Value>
             <ns1:ValueType>string</ns1:ValueType>
             </ns1:List>
             <ns1:List>
           <ns1:Key>Search</ns1:Key>
           <ns1:Value>'.$city_search.'</ns1:Value>
           <ns1:ValueType>string</ns1:ValueType>
           </ns1:List>
           </ns1:parameters>
         </ns1:GetReferenceData>
       </soap:Body>
    </soap:Envelope>';

    $result = $this->curl($request);
    if(!isset($result)) die('Нет соединения с сервером api');
    $array  = SOAP_parser::toArray($result); 

        if(isset($array['Body']['GetReferenceDataResponse']['return']['List']['Key'])){
            
            $geo = $array['Body']['GetReferenceDataResponse']['return']['List']['Key'];          // общие координаты каталога
            $city_name = $array['Body']['GetReferenceDataResponse']['return']['List']['Value'];  // беем название населенного пункта
            
            if(isset($city_name)){
               $coordinatsCenterMaps = $this->getCenterMaps($city_name);
            }else{
               $coordinatsCenterMaps = '';
            }
            
        
            $insert_db_part = [
              'geo'        => "'".trim($geo)."'",
              'centerMaps' => "'".trim($coordinatsCenterMaps)."'",
              'name'       => "'".trim($city_search)."'",
            ];

            // пишем в базу гео параметры города
            $return = $this->insertSql('p_cse_geo_city_key',$insert_db_part);
             
             if($return != 'ok'){
               return 'Ошибка записи в базу данных';
             }
              // отдаем даные для первоначального формирования карты
              $response['geo']        = $geo;
              $response['centerMaps'] = $coordinatsCenterMaps;

            return $response;
             
           
        }else{
            return 'данный город не найден в базе CSE, доставка не возможна';
        }
    
	}

  public function get_time_delivery($from,$to){
      
      $from_city = trim(strtolower($from));
      $to_city   = trim(strtolower($to));

      // получаем geo данные 
      $from_geo = $this->getGeoCityKey($from_city);
      $to_geo   = $this->getGeoCityKey($to_city);

      if(isset($from_geo) and isset($to_geo)){
        
        // если выбраное направление уже есть в базе
        $return = $this->findSql("SELECT minPeriod, maxPeriod FROM p_cse_time_delivery WHERE fromGuid = '".$from_geo."' AND toGuid = '".$to_geo."'");
        if(isset($return['minPeriod']) and isset($return['maxPeriod'])){
           return $return;
        }

        $request = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns1="http://www.cargo3.ru">
                 <soap:Header/>
                   <soap:Body>
                     <ns1:GetReferenceData>
                     <ns1:login>'.$this->login.'</ns1:login>
                     <ns1:password>'.$this->password.'</ns1:password>
                       <ns1:parameters>
                       <ns1:Key>parameters</ns1:Key>
                       <ns1:List>
                       <ns1:Key>Reference</ns1:Key>
                       <ns1:Value>deliveryinfo</ns1:Value>
                       <ns1:ValueType>string</ns1:ValueType>
                       </ns1:List>
                       <ns1:List>
                       <ns1:Key>Search</ns1:Key>
                       <ns1:Value>'.$to_geo['geo'].'</ns1:Value>
                       <ns1:ValueType>string</ns1:ValueType>
                       </ns1:List>
                       <ns1:List>
                       <ns1:Key>geography</ns1:Key>
                       <ns1:Value>'.$from_geo['geo'].'</ns1:Value>
                       <ns1:ValueType>string</ns1:ValueType>
                       </ns1:List>
                       <ns1:List>
                       <ns1:Key>other</ns1:Key>
                       <ns1:Value>'.$this->tarif.'</ns1:Value>
                       <ns1:ValueType>string</ns1:ValueType>
                       </ns1:List>
                       </ns1:parameters>
                     </ns1:GetReferenceData>
                   </soap:Body>
                </soap:Envelope>';

                $result = $this->curl($request);
                if(!isset($result)) die('Нет соединения с сервером api');
                $array  = SOAP_parser::toArray($result); 


                if(isset($array['Body']['GetReferenceDataResponse']['return']['List']['Fields'])){



                   $data = $array['Body']['GetReferenceDataResponse']['return']['List']['Fields'];

                   $fromGuid  = $data[1]['Value'];
                   $toGuid    = $data[3]['Value'];
                   $minPeriod = $data[5]['Value'];
                   $maxPeriod = $data[6]['Value'];
                   $urgency   = $data[7]['Value'];

                   $insert_db_part = [
                     'fromGuid'   => "'".trim($fromGuid)."'",
                     'toGuid'     => "'".trim($toGuid)."'",
                     'minPeriod'  => "'".trim($minPeriod)."'",
                     'maxPeriod'  => "'".trim($maxPeriod)."'",
                     'urgency'    => "'".trim($urgency)."'",
                   ];

                   // пишем в базу гео параметры города
                   $return = $this->insertSql('p_cse_time_delivery',$insert_db_part);
             
                   if($return != 'ok'){
                      return 'Ошибка записи в базу данных';
                   }
                return $insert_db_part;                   
                }else{
                   return 'По данному направлению нет данных';
                }



      }else{
        return 'Не возможно расчитать срок доставки, доставка по выбраному направлению не доступна';
      }

  }
  public function find_in_str($from,$what){
      if (mb_strpos(mb_strtolower($from,'UTF-8'), mb_strtolower($what,'UTF-8'), 0, 'UTF-8')!==false) return true;
      return false;
  }

  public function testGetPvzSource($exclude = ['Почтомат','Агент']){
        
          $request = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns1="http://www.cargo3.ru">
                 <soap:Header/>
                 <soap:Body>
                 <ns1:GetReferenceData>
                 <ns1:login>'.$this->login.'</ns1:login>
                 <ns1:password>'.$this->password.'</ns1:password>
                 <ns1:parameters>
                 <ns1:Key>parameters</ns1:Key>
                 <ns1:List>
                 <ns1:Key>Reference</ns1:Key>
                 <ns1:Value>pvz</ns1:Value>
                 <ns1:ValueType>string</ns1:ValueType>
                 </ns1:List>
                 </ns1:parameters>
                 </ns1:GetReferenceData>
                 </soap:Body>
                </soap:Envelope>';

          $result = $this->curl($request);
          if(!isset($result)) die('Нет соединения с сервером api');
          $array  = SOAP_parser::toArray($result);

          $data  = $array['Body']['GetReferenceDataResponse']['return']['List'];

          $point = [];

          foreach ($data as $key => $value) {
            if( in_array(mb_strtolower($value['Fields']['4']['Value']), array_map('mb_strtolower', $exclude)) ) continue;
            $point[$key] = $value['Fields']['4']['Value'];
          }

 


          return $point;
  } 
  /*
  $exclude - это массив исключений - например нам не нужны Почтоматы - типы ПВЗ
  Доступные типы ПВЗ (02.12.19) - Офис, Почтоматы, ДопОфис, Агент
  */
  public function get_pvz_point($exclude = ['Почтомат']){   
          // перед каждым запускам очищаем таблицу
          $connection = \Bitrix\Main\Application::getConnection();
          $connection->truncateTable('p_cse_data_point_pvz');
         
          $request = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns1="http://www.cargo3.ru">
                 <soap:Header/>
                 <soap:Body>
                 <ns1:GetReferenceData>
                 <ns1:login>'.$this->login.'</ns1:login>
                 <ns1:password>'.$this->password.'</ns1:password>
                 <ns1:parameters>
                 <ns1:Key>parameters</ns1:Key>
                 <ns1:List>
                 <ns1:Key>Reference</ns1:Key>
                 <ns1:Value>pvz</ns1:Value>
                 <ns1:ValueType>string</ns1:ValueType>
                 </ns1:List>
                 </ns1:parameters>
                 </ns1:GetReferenceData>
                 </soap:Body>
                </soap:Envelope>';

          $result = $this->curl($request);
          if(!isset($result)) die('Нет соединения с сервером api');
          $array  = SOAP_parser::toArray($result);

          if(isset($array['Body']['GetReferenceDataResponse']['return']['List'])){
            
             $data  = $array['Body']['GetReferenceDataResponse']['return']['List'];
             $point = array();

             foreach ($data as $key => $value) {
                 // убираем типы точек - например нам не нужны почтоматы
                 if( in_array(mb_strtolower($value['Fields']['4']['Value']), array_map('mb_strtolower', $exclude)) ) continue;

                 $point[$key]['guid']           = $value['Key'];
                 $point[$key]['name']           = $value['Value'];
                 $point[$key]['geo']            = $value['Fields']['1']['Value'];
                 $point[$key]['phone']          = $value['Fields']['2']['Value'];
                 $point[$key]['adress']         = $value['Fields']['3']['Value'];
                 $point[$key]['storageLife']    = $value['Fields']['21']['Value'];
                 $point[$key]['paymentByCard']  = $value['Fields']['15']['Value'];
                 $point[$key]['paymentByCash']  = $value['Fields']['16']['Value'];

                 foreach ($value['Properties'] as $key_prop => $prop) {
                     
                     $point[$key]['hoursIssue'][$prop['Fields'][0]['Value']]['startIssue'] = $prop['Fields'][3]['Value'];
                     $point[$key]['hoursIssue'][$prop['Fields'][0]['Value']]['endIssue']   = $prop['Fields'][4]['Value'];

                 }
             }
             // координаты
             foreach ($data as $key => $value) {
                $point[$key]['coordinates']['lat'] = $value['List']['Fields'][0]['Value'];
                $point[$key]['coordinates']['lan'] = $value['List']['Fields'][1]['Value'];    
             }

             $pattern = array("'",'"','&nbsp;',';');

             // пишем в базу
             foreach ($point as $key => $value) {

                 $adress    = str_replace($pattern,'',$value['adress']);
                 $namePoint = str_replace($pattern,'',$value['name']);

                ($this->find_in_str($value['paymentByCard'],'true')) ? $paymentByCard = 'да' : $paymentByCard = 'нет';
                ($this->find_in_str($value['paymentByCash'],'true')) ? $paymentByCash = 'да' : $paymentByCash = 'нет';
                
                 $b = 2;
                 
                 $insert_db_part = [
                   'guid'        => "'".$value['guid']."'",
                   'name'        => "'".$namePoint."'",
                   'issue'       => "'".json_encode($value['hoursIssue'],JSON_UNESCAPED_UNICODE)."'",
                   'geo'         => "'".$value['geo']."'",
                   'phone'       => "'".$value['phone']."'",
                   'adress'      => "'".$adress."'",
                   'storageLife' => "'".$value['storageLife']."'",
                   'geo_point'   => "'".json_encode($value['coordinates'],JSON_UNESCAPED_UNICODE)."'",
                   'data_insert' => "'".date('Y-m-d H:i:s')."'",
                   'paymentByCard' => "'".$paymentByCard."'",
                   'paymentByCash' => "'".$paymentByCash."'",
                 ];

                 $return = $this->insertSql('p_cse_data_point_pvz',$insert_db_part);
             
                 if($return != 'ok'){
                    return 'Ошибка записи в базу данных';
                 }


             }


          }

         return $insert_db_part;

  }

  public function GetIP() {
      if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
      } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
      } else {
        $ip = $_SERVER['REMOTE_ADDR'];
      }
      return $ip;
  } 

  public function GetLocalCity(){

    if( $curl = curl_init() ) {
    
        $ip = $this->GetIP();

        curl_setopt($curl, CURLOPT_URL, 'http://ru.sxgeo.city/RAmH9/json/'.$ip);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
        $out = curl_exec($curl);
        $data = json_decode($out,assoc);
        //print_r($data['city']['name_ru']);
        curl_close($curl);

        if(isset($data['city']['name_ru'])){
           $nameCity = $data['city']['name_ru'];
        }else{
           $nameCity = 'Москва';
        }

        $insert_db_part = [
          'ip'          => "'".$ip."'",
          'city'        => "'".$nameCity."'",
          'date_insert' => "'".date('Y-m-d H:i:s')."'",
        ];

        $return = $this->insertSql('p_geo_ip',$insert_db_part);
             
        if($return != 'ok'){
           return 'Ошибка записи в базу данных';
        }



        //return $nameCity;
    }
  }


	
}

?>