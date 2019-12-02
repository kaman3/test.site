$(document).ready(function(){

    //renderMaps($('input[name="your_city"]').val()); // инициализация карты
    /*
    console.log('--------');
           console.log('aadasd');
           console.log('--------');
    */

    // отслеживаем измения способа доставки 
    $(".deliveryItem").on('change',function(){
        
        if($('[name=DELIVERY_ID]:checked').val() != 52){
           // отменяем данные доставки
           var prop_delivery_form = ["26","27","28"];

           for(let i = 0; i < prop_delivery_form.length; i++ ){
              $('input[name="ORDER_PROP_'+prop_delivery_form[i]+'"]').val('').removeAttr('disabled');
           }
           // отменяем изменеия в форме данных о доставке
           var prop_hidden = ["39","40","41"];
           
           for(let i = 0; i < prop_hidden.length; i++ ){
              $('input[name="ORDER_PROP_'+prop_hidden[i]+'"]').val('');  
           }

        }

    });

    // условия получения
    $(document).on('click', '.boxTermReceipt', function(){
        var display = $('.modalDialog > div .boxTermReceipt .termsReceipt').css("display");
        if(display == 'none'){
            $('.modalDialog > div .boxTermReceipt .termsReceipt').show();
        }else{
            $('.modalDialog > div .boxTermReceipt .termsReceipt').hide();
        }
    });

    $(document).on('click', '.response-city li', function(){
          if($(this).text()){
             renderMaps($(this).text());
             
             $('.select-city').hide(); // после выбора города скрываем список
             $('.thisCity').text($(this).text());

             $('.preLoader').css({"display":"block"}); // возвращаем загрузчик в исходное состояние
          }
     });

    // окно подтверждения мой город или нет
    $(document).on('click', '#clarOkButton', function(){
        $('.modalDialog > div .box-clarification').hide(200);
    });

    $(document).on('click', '#clarNoButton', function(){
        
        $('.modalDialog > div .box-clarification').hide();
        
        $('.select-city').slideDown(200);
        document.getElementById("get_city").focus();

    });

    // формируем список городов
    $('#get_city').keyup(function(){
       
       $.getJSON('/include/ks_pvz/list-city.json', function(data){
          
           var search = $('#get_city').val();
           var regex  = new RegExp(search,'i');
           
           var output = '';

           $.each(data, function(key, val){
             
             if(val.search(regex) != -1){
               output += "<li>"+val+"</li>";
             }

           });

           $('.response-city').html(output);
       });

    });

    // запускаем поиск по точкам
    $(document).on('click', '.box-maps .thisCity', function(){
         var view = $('.select-city').css("display");
         if(view == 'none'){
            $('.select-city').slideDown(200);
            document.getElementById("get_city").focus(); 
         }else{
            $('.select-city').slideUp(200);
         }
         
         
    });
    // убираем зависимость от регистра в функции contains
    $.expr[":"].contains = $.expr.createPseudo(function(arg) {
      return function( elem ) {
       return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
      };
    });

    // поиск текста в блоке
     $(document).on('keyup', 'input[name="sStreet"]', function(){

      var search = $(this).val();
      $('.box-maps .list-point ul.submenu li').hide();
      $('.box-maps .list-point ul.submenu li:contains("'+search+'")').show();
       
     });

     // кнопка выбрать
     $(document).on('click', '.selectGuid', function(){
        var guid   = $('.point.active').attr('data_id_cse');
        var adress = $('.point.active').text();
        
        var id     = $('.point.active').attr('id');

        // получаем данные о способе оплаты
        var paymentCash = $('.dpoint[id="'+ id +'"] > div > #paymentCash').text();
        var paymentCard = $('.dpoint[id="'+ id +'"] > div > #paymentCard').text();

        var fieldAdminPayment = '| '+ paymentCash +' | '+ paymentCard +'|'; 

          

        if(guid){

              $('input[name="ORDER_PROP_39"]').val(guid);
              $('input[name="ORDER_PROP_40"]').val(adress);
              $('input[name="ORDER_PROP_41"]').val(fieldAdminPayment);

              // подставляем в форму данных доставки
              $('input[name="ORDER_PROP_28"]').val(adress).prop('disabled', 'true');
              $('input[name="ORDER_PROP_27"]').val($('.thisCity').text()).prop('disabled', 'true');
              $('input[name="ORDER_PROP_26"]').val($('.thisCity').text()).prop('disabled', 'true');

              $(".deliveryItem .selection_block .item a[href='#openModal']").html(adress);

              $('.modalDialog div a.close')[0].click();
              
              $('.box-maps .list-point .buttons .error').hide();
              // возращаем на 
              var delive = $('.deliveryItem__title').offset();
              $(window).scrollTop(parseInt(delive.top));
          
          
        }else{
          $('.box-maps .list-point .buttons .error').show();
          //alert('Выберите одну из точек пвз')
        }
     });

     // кнопка отмена
     $(document).on('click', '.btnClose', function(){
       $('.modalDialog div a.close')[0].click();
     });
      
     
      var height = window.innerHeight;
      var width  = window.innerWidth;

      if(parseInt(width) > 980){
        if(height){
           // высота блока
           var newHeightPopap = parseInt(height) - 140;
           //console.log(newHeightPopap)

           var heightSubMenu = newHeightPopap - 220;  // добавили строку 
           $('.box-maps').css({"height":newHeightPopap+"px"});
           $('.modalDialog > div').css({"margin":"70px auto"});
           $('.box-maps .list-point ul.submenu').css({'height':heightSubMenu+'px'}); // список пвз // добавили строку 
        }
   
        if(width){
         // ширина блока
          var newWidthPopap = parseInt(width) - 140;
          $('.modalDialog > div').css({"width":newWidthPopap+"px"})
        }
      }else{
         
          var body = document.body,
          html = document.documentElement;

          var heightDocument = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
          
          var heightMobileDefault = height - 180;                             

          $('.box-maps').css({"height":heightDocument+"px"});                 

          $('.box-maps .list-point ul.submenu').css({'height':heightMobileDefault+'px'}); // список пвз // добавили строку 
      }

      if(parseInt(width) < 1000){
         
         $(document).on('click', 'li.point', function(){

            $('.dpoint').hide();

            var id = $(this).attr('id');

            var view = $('.dpoint[id="'+id+'"]').css("display");

            if(view == 'none'){
                $('.dpoint[id="'+id+'"]').slideDown();
            }else{
                $('.dpoint[id="'+id+'"]').slideUp();
            }
         
         });
         // скрываем продробности пункта на мобильной версии
         
         $(document).on('click', '.btnCloseBallon', function(){
             
             var view = $(this).parent().parent().parent().css('display');
             var id   = $(this).parent().parent().parent().attr('id');

             $('.point[id="'+id+'"]').removeClass('active');

             
             if(view == 'none'){
                $(this).parent().parent().parent().slideDown();
             }else{
                $(this).parent().parent().parent().slideUp();
             }

         });
         
      }

}); 

// собираем карту, функция обновления карты
function renderMaps($city = ''){
 
      $('.submenu').html('');
      $('#map').html('');

      if(!$city){
         $city = 'Москва';
      }else{
         $city = $city;
      }

      $('.thisCity').html($city);

    	// делаем ajax запрос на  получение данных карты
    	$.ajax({
	             
          url: '/include/ks_pvz/index.php',
          type: 'POST',
          data: {'start_city':$city},
          cache: false,
          dataType: 'json',
            
            success: function(result){
            	
                var centerMaps = result.centerMaps.centerMaps.split(',')

                ymaps.ready(init());

                

                if(result.pointPvz != undefined) { 
                  $('.preLoader').slideUp(200);
                   //console.log(result.pointPvz);
                }

    	
		    	      function init(){ 
                 
    			        // Создание карты.  
    			        
    			        var myMap = new ymaps.Map("map", {
    			            // Координаты центра карты.
    			            // Порядок по умолчанию: «широта, долгота».
    			            // Чтобы не определять координаты центра карты вручную,
    			            // воспользуйтесь инструментом Определение координат.
    			            center: [centerMaps[0],centerMaps[1]],
    			            // Уровень масштабирования. Допустимые значения:
    			            // от 0 (весь мир) до 19.
    			            zoom: 11,
    			            controls: [],
    			        }, {
                     searchControlProvider: 'yandex#search'
                     }
                  );
                  // сначало очищаем, затем создаем объект для записи гео данных
                  listPoint = undefined;
                  listPoint = {
                    'type':'featureCollection',
                    'feature':'',
                  }

                  var geoObjectClaster = [];
                  
                  for (var prop in result.pointPvz) {
                      
                       
                       var time = JSON.parse(result.pointPvz[prop].issue);
                       var line = '';
                       
                       for (var key in time) {
                            //line += key+'<br>';
                            line += '<div style = "display:inline-block">'+
                                         '<div class = "timeExtradition">'+
                                               '<div style = "font-weight:bold;">'+key+'</div>'+
                                               '<div style = "">'+time[key].startIssue+'</div>'+
                                               '<div style = "">'+time[key].endIssue+'</div>'+
                                         '</div>'+
                            '</div>'
                       }

                       if(result.deliveryTime.maxPeriod !== undefined && result.deliveryTime.maxPeriod != ''){
                          var dTime = result.deliveryTime.maxPeriod.replace("'","").replace("'","");
                       }else{
                          var dTime = 'уточните у оператора интернет-магазина';
                       }

                       if(result.pointPvz[prop].phone !== undefined && result.pointPvz[prop].phone != ''){
                          var dPhone = result.pointPvz[prop].phone;
                       }else{
                          var dPhone = 'на точке нет телефона';
                       }

                       var termsReceipt = '<div class = "termsReceipt">'+
                                          '<p>Внимание! Для получения товара необходимо при себе иметь паспорт.</p>'+
                                          '<button id = "btnTR">Понятно</button>'+
                                          '</div>';
                       
                       var point_pvz = JSON.parse(result.pointPvz[prop].geo_point); 

                       var balloonHeader = '<div class = "bHeader" id = "'+prop+'" style = "padding:5px 0 5px 0; font-weight:bold; color:#000; line-height:17px;">'+result.pointPvz[prop].name+'</div>'; 

                       var ballonHtml = '<div style = "font-size:14px; font-weight:normal; position:relative">'+
                           //'<div style = "padding:0 0 5px 0; font-weight:bold">'+result.pointPvz[prop].name+'</div>'+
                           '<div style = "padding:0 0 5px 0"><span style = "color:#767676">Адрес: </span>'+result.pointPvz[prop].adress+'</div>'+
                           '<div style = "padding:0 0 5px 0"><span style = "color:#767676">Телефон: </span>'+dPhone+'</div>'+
                           '<div style = "padding:0 0 5px 0"><span style = "color:#767676">Срок доставки в днях:</span> '+dTime+' </div>'+
                           '<div id = "paymentCard" style = "padding:0 0 5px 0;"><span style = "color:#767676">Оплата банковской картой:</span> '+result.pointPvz[prop].paymentByCard+' </div>'+
                           '<div id = "paymentCash" style = "padding:0 0 5px 0"><span style = "color:#767676">Оплата наличными:</span> '+result.pointPvz[prop].paymentByCash+' </div>'+       
                           '<div class = "boxTermReceipt"><p>Обязательно ознакомьтесь с условиями получения товара</p>'+termsReceipt+'</div>'+
                           '<div style = "padding:0 0 5px 0"><span style = "color:#767676">Срок хранения в днях:</span> '+result.pointPvz[prop].storageLife+' </div>'+
                           '<div style = "padding:5px 0 5px 0; font-weight:bold">Часы выдачи товара</div>'+
                           '<div class = "timeExtradition">'+line+'</div>'+
                           '<div class = "buttonsBallon">'+
                           '<a class = "btnSelectBallon selectGuid">Выбрать</a>'+
                           '<a class = "btnCloseBallon">Отмена</a>'+
                           '</div>'+
                       '</div>';

                        
                         var submenuItem = $('<li class = "point" id = "'+ prop +'" data_id_cse = "'+result.pointPvz[prop].guid+'">'+ result.pointPvz[prop].adress + '</li><div class = "dpoint" id = "'+prop+'">'+ballonHtml+'</div>');
                         submenuItem.appendTo('.submenu');
                         

                         geoObjectClaster.push({"type": "Feature", "id": prop, "geometry":{"type": "Point", "coordinates": [parseFloat(point_pvz.lat), parseFloat(point_pvz.lan)]},"properties":{"balloonContentHeader":balloonHeader, "balloonContentBody":ballonHtml},"options": {iconLayout: 'default#imageWithContent',iconImageHref: '/include/ks_pvz/img/point.png', iconImageSize: [58, 58], iconImageOffset: [-24, -24],iconContentOffset: [15, 15], id : prop,} },);
                        
                         
                  }
                   
                    listPoint.feature = geoObjectClaster;

                    console.log(listPoint);

                    objectManager = new ymaps.ObjectManager({
                        // Чтобы метки начали кластеризоваться, выставляем опцию.
                        clusterize: true,
                        // ObjectManager принимает те же опции, что и кластеризатор.
                        gridSize: 96,
                        clusterDisableClickZoom: false,
                        minClusterSize:2,
                        hasBalloon:true,
                       
                    });

                     objectManager.objects.options.set('preset', 'islands#greenDotIcon');
                     objectManager.clusters.options.set('preset', 'islands#invertedBlackClusterIcons');

                     myMap.geoObjects.add(objectManager);

                     objectManager.add(geoObjectClaster);

                     myMap.options.set({
                        balloonMaxWidth: 650,
                        balloonMaxHeight:500,
                     });

                
                  // если нет пункта пвз
                  if(listPoint.feature == '') {    
                     $('.preLoader').slideDown(200).html('В вашем городе нет точек самовывоза. Пожалуйста, выберите другой способ доставки.');
                  }
                       

                  $('li.point').on('click',function(){
                     
                      var id = $(this).attr('id');

                      var zoomMap = myMap.getZoom();
                      if(zoomMap < 16){
                         myMap.setZoom( 16 );
                      }
                      myMap.setCenter(objectManager.objects.getById(id).geometry.coordinates );
                      /*
                      console.log('--------');
                      console.log(zoomMap);
                      console.log('--------');
                      */
                      //myMap.setZoom( 16 );
                      

                      if (!objectManager.objects.balloon.isOpen(id)) {
                           objectManager.objects.balloon.open(id);

                          $('li.point').removeClass('active');
                          $(this).addClass('active');
  
                      }else{
                          objectManager.objects.balloon.close(id);
                      }
                  });
                  // при нажатии на точке выберается пункт из списка слева
                  myMap.geoObjects.events.add('click', function(e){
                     var eMap = e.get('objectId');;
                    
                     $('li.point').removeClass('active');
                     $('li.point[id="'+eMap+'"]').addClass('active');
                     
                     // делаем выбранную пвз видимой в списке
                     if($("li.point").is('#'+eMap+'') == true){
                        $('ul.submenu').scrollTop(0);
                        var itemTop = $('li.point[id="'+eMap+'"]').position();
                        if(itemTop.top != undefined && itemTop.top >= 147){
                           var newHeight = itemTop.top - 147 - (parseInt($('ul.submenu').height()) / 2);
                           $('ul.submenu').scrollTop(newHeight);
                        }
                     }
                     
                  });
                  // если в балуне содержиться несколько точек (есть меню) то берем id таким образом
                  $(document).on('click', '.bHeader', function(){
                      var id = $(this).attr('id');
                      
                      $('li.point').removeClass('active');
                      $('li.point[id="'+id+'"]').addClass('active');
                  });

		          }
              // init
            }
	});
}

    //console.log(height)