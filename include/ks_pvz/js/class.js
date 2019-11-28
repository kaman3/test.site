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
}
// стартуем main
(async (startCity = 'пенза') => {

	let listPvz = Object; 

	try{

		let app = new PvzService;

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
		console.log(listPvz);
	}else{
		console.log("В этом городе нет точек самовывоза");
	}
 

})();



