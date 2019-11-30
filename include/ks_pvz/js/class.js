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
}
// стартуем main
(async (startCity = 'пенза') => {
	
	let app     = new PvzService;
	let listPvz = Object; 
	
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
		
		// подготавливаем данные для карты
		try{
			let menu = app.createMapMenu(listPvz);
		   
			if(menu.length > 0){
				document.querySelector(".preLoader.Error").style.display = "none";
				document.querySelector('.submenu').innerHTML = menu;
			}

		}catch(error){
            console.log(new Error(`Error ${error}`));
		}
		
	}else{
		console.log("В этом городе нет точек самовывоза");
	}
 

})();



