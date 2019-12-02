class PvzService{
    // страрая версия ajax запроса
    async requestAjax(urle, object, method = "POST", typeData = "json", async = 'false'){

      return new Promise(function(resolve, reject){	

	       const request =  new XMLHttpRequest();
	       const url     =  urle;

	       let params = this.createQueryString(object);
	
	       request.async        = async;
	       request.responseType = typeData;
	      
	       request.open(method, url, true);
	       request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	       request.send(params);
	       		    
			    request.onload = function(){
				  	if(request.status == 200){
				  	   resolve(request.response);	
				  	}else{
				  	   reject(new Error('Ошибка, данные не были полученны')); 	
				  	}
			  	}
	 		
        });  

	}
    // создаем из объекта сторку вида value=1&value2=2
	createQueryString(object){
        if(typeof object !== undefined && typeof object == 'object'){
           let query = '';
           for(let item in object)  query += item+"="+object[item]+'&';
           return (query.length > 1) ? query.substring(0, query.length - 1) : '';
        }else{
           return 'Переменная не является объектом или не определенна';
        }  	
	}
	// собираем ballon для точек на карте
	createTemplateBallon(idObject, dataGeoPoint, maxPeriodDelivery){
		                      
		let time = JSON.parse(dataGeoPoint.issue); // часы работы пункта выдачи
		let line = '';
 
		for (let key in time) {
			 line += '<div style = "display:inline-block">'+
						  '<div class = "timeExtradition">'+
								'<div style = "font-weight:bold;">'+key+'</div>'+
								'<div style = "">'+time[key].startIssue+'</div>'+
								'<div style = "">'+time[key].endIssue+'</div>'+
						  '</div>'+
					 '</div>';
		}
		
		let dTime = '';
		if(maxPeriodDelivery !== undefined && maxPeriodDelivery != ''){
		    dTime = maxPeriodDelivery.replace("'","").replace("'","");
		}else{
		    dTime = 'уточните у оператора интернет-магазина';
		}
		
		let dPhone = '';
		if(dataGeoPoint.phone !== undefined && dataGeoPoint.phone != ''){
		   dPhone = dataGeoPoint.phone;
		}else{
		   dPhone = 'на точке нет телефона';
		}
 
		const termsReceipt = '<div class = "termsReceipt">'+
							   '<p>Внимание! Для получения товара необходимо при себе иметь паспорт.</p>'+
							   '<button id = "btnTR">Понятно</button>'+
						   '</div>';
		
 
		const balloonHeader = '<div class = "bHeader" id = "'+idObject+'" style = "padding:5px 0 5px 0; font-weight:bold; color:#000; line-height:17px;">'+dataGeoPoint.name+'</div>';
 
		const ballonHtml = '<div style = "font-size:14px; font-weight:normal; position:relative">'+
				'<div style = "padding:0 0 5px 0"><span style = "color:#767676">Адрес: </span>'+dataGeoPoint.adress+'</div>'+
				'<div style = "padding:0 0 5px 0"><span style = "color:#767676">Телефон: </span>'+dPhone+'</div>'+
				'<div style = "padding:0 0 5px 0"><span style = "color:#767676">Срок доставки в днях:</span> '+dTime+' </div>'+
				'<div id = "paymentCard" style = "padding:0 0 5px 0;"><span style = "color:#767676">Оплата банковской картой:</span> '+dataGeoPoint.paymentByCard+' </div>'+
				'<div id = "paymentCash" style = "padding:0 0 5px 0"><span style = "color:#767676">Оплата наличными:</span> '+dataGeoPoint.paymentByCash+' </div>'+       
				'<div class = "boxTermReceipt"><p>Обязательно ознакомьтесь с условиями получения товара</p>'+termsReceipt+'</div>'+
				'<div style = "padding:0 0 5px 0"><span style = "color:#767676">Срок хранения в днях:</span> '+dataGeoPoint.storageLife+' </div>'+
				'<div style = "padding:5px 0 5px 0; font-weight:bold">Часы выдачи товара</div>'+
				'<div class = "timeExtradition">'+line+'</div>'+
				'<div class = "buttonsBallon">'+
				'<a class = "btnSelectBallon selectGuid">Выбрать</a>'+
				'<a class = "btnCloseBallon">Отмена</a>'+
				'</div>'+
		 '</div>';
		 
		 let PointHtml = {
			 id:idObject,
			 header:balloonHeader,
			 body:ballonHtml,
		 };
 
	   return PointHtml;
 
	 }
	// создаем меню
	createMapMenu(dataGeoPoint){

		let submenuItem = '';
		
		if(typeof dataGeoPoint !== undefined && Object.keys(dataGeoPoint.pointPvz).length > 0){

			dataGeoPoint.pointPvz.forEach((element) => {
				let setTemplateBallon = this.createTemplateBallon(element.id, element, dataGeoPoint.deliveryTime.maxPeriod);
				submenuItem += '<li class = "point" id = "'+ element.id +'" data_id_cse = "'+element.guid+'">'+ element.adress + '</li><div class = "dpoint" id = "'+ element.id +'">'+setTemplateBallon.body+'</div>';
			});
		
			return (typeof submenuItem == 'string' && submenuItem.length > 0) ? submenuItem : submenuItem = 'В вашем городе нет точек самовывоза';

		}else{
			return false;
		}
	}
	// создание гео объекта
	async createGeoObject(dataGeoPoint){
		
		if(typeof dataGeoPoint !== undefined && Object.keys(dataGeoPoint.pointPvz).length > 0){
			
			let geoObjectClaster = [];

			dataGeoPoint.pointPvz.forEach( (element) => {
				
				let point_pvz = JSON.parse(element.geo_point);
				let setTemplateBallon = this.createTemplateBallon(element.id, element, dataGeoPoint.deliveryTime.maxPeriod); // отправляем данный по каждой точке
				
				geoObjectClaster.push({"type": "Feature", "id": element.id, "geometry":{"type": "Point", "coordinates": [parseFloat(point_pvz.lat), parseFloat(point_pvz.lan)]},"properties":{"balloonContentHeader":setTemplateBallon.header, "balloonContentBody":setTemplateBallon.body},"options": {iconLayout: 'default#imageWithContent',iconImageHref: '/include/ks_pvz/img/point.png', iconImageSize: [58, 58], iconImageOffset: [-24, -24],iconContentOffset: [15, 15], id : element.id,} },);
			
			});

			return geoObjectClaster;

		}else{

			return false;
		}
	}
	
	// рисуем карту
    createMap(dataGeoPoint,geoObjectClaster){ 

    	document.querySelector("#map").innerHTML = '';
    	document.querySelector(".submenu").innerHTML = '';

    	let centerMaps = dataGeoPoint.centerMaps.centerMaps.split(',');

    	return function(){
         
	         let myMap = new ymaps.Map("map", {
		         center: [centerMaps[0],centerMaps[1]],
		         zoom: 11,
		         controls: [],
			     }, {
	             searchControlProvider: 'yandex#search'
	             }
	          );
	          // сначало очищаем, затем создаем объект для записи гео данных
	          let listPoint = {
	            'type':'featureCollection',
	            'feature':'',
	          }


	          let objectManager = new ymaps.ObjectManager({
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


	          // управление элементами карты

	          // open ballon on maps
			  document.querySelectorAll('li.point').forEach(function(adress, index){
			      adress.addEventListener('click', () => {
                     
                      let idListElement = adress.getAttribute('id');

					  let zoomMap = myMap.getZoom();
					  
                      if(zoomMap < 16){
                         myMap.setZoom( 16 );
                      }
                      myMap.setCenter(objectManager.objects.getById(idListElement).geometry.coordinates );

                      if (!objectManager.objects.balloon.isOpen(idListElement)) {
                           objectManager.objects.balloon.open(idListElement);

                          document.querySelectorAll('li.point').forEach(function(el, index){ el.classList.remove("active"); });
                          adress.classList.add('active');
  
                      }else{
                          objectManager.objects.balloon.close(idListElement);
                      }
			      
			      });
			  });

              // click ballon active element on lists menu right
			  myMap.geoObjects.events.add('click', function(e){
                 
				 let eMap = e.get('objectId');
				//  console.log(e.originalEvent.currentTarget._map.balloon._balloon); //._data.geoObjects
				//  console.log(e.get);
                 //console.log(`id Точки ${eMap}`);
				 console.log(e.get('target'));

                 document.querySelectorAll('li.point').forEach(function(el, index){
                    el.classList.remove("active");
                 });
                 
                 if(document.querySelector('li.point[id="'+eMap+'"]')){

                    document.querySelector('li.point[id="'+eMap+'"]').classList.add('active');
	                document.querySelector('ul.submenu').scrollTo(0,0);
	                 
	                let itemTop = document.querySelector('li.point[id="'+eMap+'"]').offsetTop;
	                 
	                if(itemTop != undefined && itemTop >= 147){
	                   let newHeight = itemTop - 147 - (parseInt(document.querySelector('ul.submenu').offsetHeight) / 2);
	                   document.querySelector('ul.submenu').scrollTo(newHeight,newHeight);
	                } 
                } 
              });
              
            //   // if on 1 ballon be contained many elements
            //   document.querySelectorAll('.bHeader').forEach(function(element, index){
            //        element.addEventListener('click', () => {
            //        	    console.log(2222222);
            //        	    document.querySelectorAll('li.point').forEach(function(point, index_point){
            //                   point.classList.remove("active");
            //             });
            //             document.querySelector('li.point[id="'+eMap+'"]').classList.add('active');

            //        });
            //   });
                    
        }
    }

}
// стартуем main
async function map(startCity = 'санкт-петербург'){
//(async (startCity = 'пенза') => {
	
	let app       = new PvzService;
	let listPvz   = Object; 
	let geoObject = Object;
	
	try{

		let valuePostRequest = {
			start_city:startCity,
		}
        // делаем запрос на сервер, получаем данные
		const dbObject = await fetch("/include/ks_pvz/index.php",{
			method:"post",
			headers: {
			  'Content-Type':'application/x-www-form-urlencoded',
			},
			body:app.createQueryString(valuePostRequest),
			
		});
	
		listPvz = await dbObject.json();

	}catch(error){
		console.log(new Error(`Ошибка получения данных с сервера ${error}`));
	}

	// проверяем готовы вы данные для работы/построения карты
	if(Object.keys(listPvz.pointPvz).length > 0 && typeof listPvz.pointPvz){

		// рисуем карту, но только на пк - мобильные не загружаем
		if(window.innerWidth > 980){
		
			// создаем гео объект для размещения на карте
			try{
				geoObject = await app.createGeoObject(listPvz);
			}catch(error){
				console.log(new Error(`Данные о расположении точек не были получены`));
			}

			// создаем карту
			if(typeof geoObject == 'object'){
				new ymaps.ready(app.createMap(listPvz, geoObject));
			}

		}
		
		try{
			
			let menu = app.createMapMenu(listPvz);
		   
			if(menu.length > 0){
				document.querySelector(".preLoader.Error").style.display = "none";
				document.querySelector('.submenu').innerHTML = menu;
			}

		}catch(error){
            console.log(new Error(`Error ${error}`));
		}

		delete listPvz;
		
	}else{
		console.log("В этом городе нет точек самовывоза");
	}
 

};

map();


document.addEventListener("DOMContentLoaded", function() { 
      
	document.querySelector('.deliveryItem').addEventListener('change', () => {
	   let valueDelivery = document.querySelector('[name=DELIVERY_ID]:checked').value;
	   if(valueDelivery != 52){
			let prop_delivery_form = ["26","27","28"];
			for(let item in prop_delivery_form){
				document.querySelector('input[name="ORDER_PROP_'+prop_delivery_form[item]+'"]').value = '';
				document.querySelector('input[name="ORDER_PROP_'+prop_delivery_form[item]+'"]').removeAttribute("disabled");
			}

			let prop_hidden = ["39","40","41"];
			for(let item in prop_hidden){
				document.querySelector('input[name="ORDER_PROP_'+prop_hidden[item]+'"]').value = '';
			}                
		}
  
	});
	// скрыть блок выбора города если автоматичеки выбран правильный город
	document.querySelector("#clarOkButton").addEventListener('click', function(){
		document.querySelector(".box-clarification").style.display = 'none';
	});
	// если автоматически сформирован не правильный город, выбрать нужный
	document.querySelector("#clarNoButton").addEventListener('click', function(){
		document.querySelector(".modalDialog > div .box-clarification").style.display = 'none';
		document.querySelector(".select-city").style.display = 'block';
		document.querySelector("#get_city").focus();
	});
	// поиск города из доступных в списке
	document.querySelector("#get_city").addEventListener('keyup', function(){
		
		  const request = new XMLHttpRequest();
		  const url     = "/include/ks_pvz/list-city.json";
		  
		  request.responseType =	"json";
		  request.open("POST", url, true);

		  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		  request.addEventListener("readystatechange", () => {
				if(request.readyState === 4 && request.status === 200) {    
					
				   let regex  = new RegExp(this.value,'i');

				   let output = '';

				   request.response.forEach(function(element, index){
						 if(element.search(regex) != -1){
						 output += "<li>"+element+"</li>";
					  }
				   });

				   document.querySelector(".response-city").innerHTML = output;
				}
			});
		  
		  request.send();

	});

	// запускаем поиск по точкам
	document.querySelector(".box-maps .thisCity").addEventListener('click', function(){
		let display = document.querySelector(".select-city").style.display;
		
		if(display == '' || display == 'none'){
			document.querySelector(".select-city").style.display = 'block';
			document.getElementById("get_city").focus();
		}else{
			document.querySelector(".select-city").style.display = 'none';
		}
	});

	// поиск по улицам
	document.querySelector('input[name="sStreet"]').addEventListener('keyup', function(){
		let search = this.value.toUpperCase();
		document.querySelectorAll("ul.submenu li").forEach(function(element, index){
			if(element.innerText.toUpperCase().includes(search)){
				element.style.display = 'block';
			}else{
				element.style.display = 'none';
			}
		});
	});

	// кнопка отмена
	document.querySelector(".btnClose").addEventListener('click', function(){
		  setTimeout(function() { // таймер-планировщик
				document.querySelector('a.close').click(); // вызвать клик на кнопку
			  }, 10);
	});

  // получение размеров экрана пользователя
  let height = window.innerHeight;
  let width  = window.innerWidth;

  if(width > 980){

	 let newHeightPopap = parseInt(height) - 140;
	 let heightSubMenu = newHeightPopap - 220;  // добавили строку 
	 document.querySelector(".box-maps").style.height = newHeightPopap+'px';
	 document.querySelector(".modalDialog > div").style.margin = '70px auto';
	 document.querySelector(".box-maps .list-point ul.submenu").style.height = heightSubMenu+"px";
	 //console.log(height);


	 let newWidthPopap = parseInt(width) - 140;
	 document.querySelector(".modalDialog > div").style.width = newWidthPopap+"px";
  
  }else{

	  let body = document.body, html = document.documentElement;
	  let heightDocument = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
	  let heightMobileDefault = height - 180;

	  document.querySelector(".box-maps").style.height = heightDocument+"px";
	  document.querySelector(".box-maps .list-point ul.submenu").style.height = heightMobileDefault+"px";
	
  }

	// обработка динамических узлов
	document.querySelector('.box-maps').onclick = (e) => {

		   // const boxTermReceipt = e.target // элемент который вызвал событие
		   // предупреждение о паспорте
		   if(e.target.parentElement.classList.contains('boxTermReceipt')){		   	     
					let el = e.target.parentElement.querySelector('.termsReceipt');
					  let display = el.style.display;
					  (display == '' || display == 'none') ? el.style.display = 'block' : el.style.display = 'none';
		   }
		   // кнопка понятно - предупреждение о паспорте
		   if(e.target.id == 'btnTR'){
				let display = e.target.parentElement.style.display;
				(display == '' || display == 'none') ? e.target.parentElement.style.display = 'block' : e.target.parentElement.style.display = 'none';  
		   }

		   // выбераем новый город из списка
		   if(e.target.parentElement.classList.contains("response-city")){
				  if(e.target.innerText){
						map(e.target.innerText);
						document.querySelector(".select-city").style.display = 'none';
						document.querySelector(".thisCity").innerHTML = e.target.innerText;
				  } 
		   }
		   // переносим данные выбранной точки в форму
		   if(e.target.classList.contains("selectGuid")){
				 
				 let guid   = document.querySelector(".point.active").getAttribute('data_id_cse');
				 let adress = document.querySelector(".point.active").innerText; 
				 let id     = document.querySelector(".point.active").id;
                 
				 let paymentCash = document.querySelector('.dpoint[id="'+ id +'"] > div > #paymentCash').innerText;
				 let paymentCard = document.querySelector('.dpoint[id="'+ id +'"] > div > #paymentCard').innerText;
				 let fieldAdminPayment = '| '+ paymentCash +' | '+ paymentCard +'|';
			  
			  if(guid){
				  
				  document.querySelector('input[name="ORDER_PROP_39"]').value = guid;
				  document.querySelector('input[name="ORDER_PROP_40"]').value = adress;
				  document.querySelector('input[name="ORDER_PROP_41"]').value = fieldAdminPayment; 

				  // подставляем адрес в форму и информацией о доставке
				  document.querySelector('input[name="ORDER_PROP_28"]').value = adress; 
				  document.querySelector('input[name="ORDER_PROP_28"]').setAttribute('disabled', 'disabled');

				  // получаем название текущего города
				  let selectCity = document.querySelector(".thisCity").innerText;

				  document.querySelector('input[name="ORDER_PROP_27"]').value = selectCity;
				  document.querySelector('input[name="ORDER_PROP_27"]').setAttribute('disabled', 'disabled');

				  document.querySelector('input[name="ORDER_PROP_26"]').value = selectCity;
				  document.querySelector('input[name="ORDER_PROP_26"]').setAttribute('disabled', 'disabled');

				  document.querySelector(".deliveryItem .selection_block .item a[href='#openModal']").innerHTML = adress;

					setTimeout(function() { // таймер-планировщик
							  document.querySelector('a.close').click(); // вызвать клик на кнопку
							}, 10);

						  document.querySelector(".box-maps .list-point .buttons .error").style.display = 'none';

				// устанавливаем скрол на высоте блока выбора доставки, актуально для мобильной версии
						  let heightDeliveryBlock = getCoords(document.querySelector('.deliveryItem__title'));
						  window.scrollTo(0,heightDeliveryBlock.top);
				  
			  }else{
				  document.querySelector(".box-maps .list-point .buttons .error").style.display = 'block';
			  }

				 
		   }

		   // если в одном балуне 2 точки
		   if(e.target.classList.contains("bHeader")){
			
			   document.querySelectorAll('li.point').forEach(function(el, index){
				  el.classList.remove("active");
			   });

			   document.querySelector(".point[id='"+e.target.id+"']").classList.add('active');

			   document.querySelector('ul.submenu').scrollTo(0,0);
	                 
			   let itemTop = document.querySelector('li.point[id="'+e.target.id+'"]').offsetTop;
					
			   if(itemTop != undefined && itemTop >= 147){
				  let newHeight = itemTop - 147 - (parseInt(document.querySelector('ul.submenu').offsetHeight) / 2);
				  document.querySelector('ul.submenu').scrollTo(newHeight,newHeight);
			   }
			   //console.log(e.target.id);
		   } 
	 // при клики по блоку с адресом покажем подробное описание, работает только на мобильном
	 if(e.target.classList.contains("point") && e.target.id != undefined && width < 980){
		
		let id = e.target.id;
	 
		let display = document.querySelector(".dpoint[id='"+id+"']").style.display; //console.log(e.target.nextElementSibling);

		if(display == '' || display == 'none'){
			 // скрываем все открыте блоки прежде чем открыть новый
			 document.querySelectorAll(".dpoint").forEach(function(element, index){
				element.style.display = "none";
			 });
			 // возвращаем к только что скрытым блокам начальное состояние - цвет шрифта и фона
			 document.querySelectorAll(".point").forEach(function(element, index){
				element.classList.remove('active');
			 });
			 // открываем новый блок
			 document.querySelector(".dpoint[id='"+id+"']").style.display = "block";
			 document.querySelector(".point[id='"+id+"']").classList.add('active');
		}else{

			 document.querySelector(".dpoint[id='"+id+"']").style.display = "none";
			 document.querySelector(".point[id='"+id+"']").classList.remove('active');
		}
	 }
	 // кнопка отмена - закрыает блок подробного описания у точки самовывоза на мобильной версии 
	 if(e.target.classList.contains("btnCloseBallon")){
		let id = e.target.parentElement.parentElement.parentElement.id;
		document.querySelector(".dpoint[id='"+id+"']").style.display = "none";
		document.querySelector(".point[id='"+id+"']").classList.remove('active');
	 }

	} 	

});

// вычисление координат элемента
function getCoords(elem) { 
	let box = elem.getBoundingClientRect();

	return {
	  top: box.top + pageYOffset,
	  left: box.left + pageXOffset
	};

}



