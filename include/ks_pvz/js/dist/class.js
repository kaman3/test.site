"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PvzService = function () {
	function PvzService() {
		_classCallCheck(this, PvzService);
	}

	_createClass(PvzService, [{
		key: "requestAjax",

		// страрая версия ajax запроса
		value: async function requestAjax(urle, object) {
			var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "POST";
			var typeData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "json";
			var async = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'false';


			return new Promise(function (resolve, reject) {

				var request = new XMLHttpRequest();
				var url = urle;

				var params = this.createQueryString(object);

				request.async = async;
				request.responseType = typeData;

				request.open(method, url, true);
				request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				request.send(params);

				request.onload = function () {
					if (request.status == 200) {
						resolve(request.response);
					} else {
						reject(new Error('Error, data no pull'));
					}
				};
			});
		}
		// создаем из объекта сторку вида value=1&value2=2

	}, {
		key: "createQueryString",
		value: function createQueryString(object) {
			if ((typeof object === "undefined" ? "undefined" : _typeof(object)) !== undefined && (typeof object === "undefined" ? "undefined" : _typeof(object)) == 'object') {
				var query = '';
				for (var item in object) {
					query += item + "=" + object[item] + '&';
				}return query.length > 1 ? query.substring(0, query.length - 1) : '';
			} else {
				return 'The variable is not an object or not defined';
			}
		}
		// собираем ballon для точек на карте

	}, {
		key: "createTemplateBallon",
		value: function createTemplateBallon(idObject, dataGeoPoint, maxPeriodDelivery) {

			var time = JSON.parse(dataGeoPoint.issue); // часы работы пункта выдачи
			var line = '';

			for (var key in time) {
				line += '<div style = "display:inline-block">' + '<div class = "timeExtradition">' + '<div style = "font-weight:bold;">' + key + '</div>' + '<div style = "">' + time[key].startIssue + '</div>' + '<div style = "">' + time[key].endIssue + '</div>' + '</div>' + '</div>';
			}

			var dTime = '';
			if (maxPeriodDelivery !== undefined && maxPeriodDelivery != '') {
				dTime = maxPeriodDelivery.replace("'", "").replace("'", "");
			} else {
				dTime = 'уточните у оператора интернет-магазина';
			}

			var dPhone = '';
			if (dataGeoPoint.phone !== undefined && dataGeoPoint.phone != '') {
				dPhone = dataGeoPoint.phone;
			} else {
				dPhone = 'на точке нет телефона';
			}

			var termsReceipt = '<div class = "termsReceipt">' + '<p>Внимание! Для получения товара необходимо при себе иметь паспорт.</p>' + '<button id = "btnTR">Понятно</button>' + '</div>';

			var balloonHeader = '<div class = "bHeader" id = "' + idObject + '" style = "padding:5px 0 5px 0; font-weight:bold; color:#000; line-height:17px;">' + dataGeoPoint.name + '</div>';

			var ballonHtml = '<div style = "font-size:14px; font-weight:normal; position:relative">' + '<div style = "padding:0 0 5px 0"><span style = "color:#767676">Адрес: </span>' + dataGeoPoint.adress + '</div>' + '<div style = "padding:0 0 5px 0"><span style = "color:#767676">Телефон: </span>' + dPhone + '</div>' + '<div style = "padding:0 0 5px 0"><span style = "color:#767676">Срок доставки в днях:</span> ' + dTime + ' </div>' + '<div id = "paymentCard" style = "padding:0 0 5px 0;"><span style = "color:#767676">Оплата банковской картой:</span> ' + dataGeoPoint.paymentByCard + ' </div>' + '<div id = "paymentCash" style = "padding:0 0 5px 0"><span style = "color:#767676">Оплата наличными:</span> ' + dataGeoPoint.paymentByCash + ' </div>' + '<div class = "boxTermReceipt"><p>Обязательно ознакомьтесь с условиями получения товара</p>' + termsReceipt + '</div>' + '<div style = "padding:0 0 5px 0"><span style = "color:#767676">Срок хранения в днях:</span> ' + dataGeoPoint.storageLife + ' </div>' + '<div style = "padding:5px 0 5px 0; font-weight:bold">Часы выдачи товара</div>' + '<div class = "timeExtradition">' + line + '</div>' + '<div class = "buttonsBallon">' + '<a class = "btnSelectBallon selectGuid">Выбрать</a>' + '<a class = "btnCloseBallon">Отмена</a>' + '</div>' + '</div>';

			var PointHtml = {
				id: idObject,
				header: balloonHeader,
				body: ballonHtml
			};

			return PointHtml;
		}
		// создаем меню

	}, {
		key: "createMapMenu",
		value: function createMapMenu(dataGeoPoint) {
			var _this = this;

			var submenuItem = [];

			if ((typeof dataGeoPoint === "undefined" ? "undefined" : _typeof(dataGeoPoint)) !== undefined && Object.keys(dataGeoPoint.pointPvz).length > 0) {

				dataGeoPoint.pointPvz.forEach(function (element) {
					var setTemplateBallon = _this.createTemplateBallon(element.id, element, dataGeoPoint.deliveryTime.maxPeriod);
					submenuItem.push('<li class = "point" id = "' + element.id + '" data_id_cse = "' + element.guid + '">' + element.adress + '</li><div class = "dpoint" id = "' + element.id + '">' + setTemplateBallon.body + '</div>');
				});

				//return (typeof submenuItem == 'object' && submenuItem.length > 0) ? submenuItem : submenuItem = 'В вашем городе нет точек самовывоза';
				return submenuItem;
			} else {
				return false;
			}
		}
		// создание гео объекта

	}, {
		key: "createGeoObject",
		value: async function createGeoObject(dataGeoPoint) {
			var _this2 = this;

			if ((typeof dataGeoPoint === "undefined" ? "undefined" : _typeof(dataGeoPoint)) !== undefined && Object.keys(dataGeoPoint.pointPvz).length > 0) {

				var geoObjectClaster = [];

				dataGeoPoint.pointPvz.forEach(function (element) {

					var point_pvz = JSON.parse(element.geo_point);
					var setTemplateBallon = _this2.createTemplateBallon(element.id, element, dataGeoPoint.deliveryTime.maxPeriod); // отправляем данный по каждой точке

					geoObjectClaster.push({ "type": "Feature", "id": element.id, "geometry": { "type": "Point", "coordinates": [parseFloat(point_pvz.lat), parseFloat(point_pvz.lan)] }, "properties": { "balloonContentHeader": setTemplateBallon.header, "balloonContentBody": setTemplateBallon.body }, "options": { iconLayout: 'default#imageWithContent', iconImageHref: '/include/ks_pvz/img/point.png', iconImageSize: [58, 58], iconImageOffset: [-24, -24], iconContentOffset: [15, 15], id: element.id } });
				});

				return geoObjectClaster;
			} else {

				return false;
			}
		}

		// рисуем карту

	}, {
		key: "createMap",
		value: function createMap(dataGeoPoint, geoObjectClaster) {

			document.querySelector("#map").innerHTML = '';
			document.querySelector(".submenu").innerHTML = '';

			var centerMaps = dataGeoPoint.centerMaps.centerMaps.split(',');

			return function () {

				var myMap = new ymaps.Map("map", {
					center: [centerMaps[0], centerMaps[1]],
					zoom: 11,
					controls: []
				}, {
					searchControlProvider: 'yandex#search'
				});
				// сначало очищаем, затем создаем объект для записи гео данных
				var listPoint = {
					'type': 'featureCollection',
					'feature': ''
				};

				var objectManager = new ymaps.ObjectManager({
					// Чтобы метки начали кластеризоваться, выставляем опцию.
					clusterize: true,
					// ObjectManager принимает те же опции, что и кластеризатор.
					gridSize: 96,
					clusterDisableClickZoom: false,
					minClusterSize: 2,
					hasBalloon: true

				});

				objectManager.objects.options.set('preset', 'islands#greenDotIcon');
				objectManager.clusters.options.set('preset', 'islands#invertedBlackClusterIcons');

				myMap.geoObjects.add(objectManager);

				objectManager.add(geoObjectClaster);

				myMap.options.set({
					balloonMaxWidth: 650,
					balloonMaxHeight: 500
				});

				document.querySelector('ul.submenu').onclick = function (e) {
					var idListElement = e.target.id;
					var zoomMap = myMap.getZoom();

					if (zoomMap < 16) {
						myMap.setZoom(16);
					}

					myMap.setCenter(objectManager.objects.getById(idListElement).geometry.coordinates);

					if (!objectManager.objects.balloon.isOpen(idListElement)) {
						objectManager.objects.balloon.open(idListElement);

						document.querySelectorAll('li.point').forEach(function (el, index) {
							el.classList.remove("active");
						});
						e.target.classList.add('active');
					} else {
						objectManager.objects.balloon.close(idListElement);
					}
				};
				// click ballon active element on lists menu right
				myMap.geoObjects.events.add('click', function (e) {

					var eMap = e.get('objectId');

					document.querySelectorAll('li.point').forEach(function (el, index) {
						el.classList.remove("active");
					});

					if (document.querySelector('li.point[id="' + eMap + '"]')) {

						document.querySelector('li.point[id="' + eMap + '"]').classList.add('active');
						document.querySelector('ul.submenu').scrollTo(0, 0);

						var itemTop = document.querySelector('li.point[id="' + eMap + '"]').offsetTop;

						if (itemTop != undefined && itemTop >= 147) {
							var newHeight = itemTop - 147 - parseInt(document.querySelector('ul.submenu').offsetHeight) / 2;
							document.querySelector('ul.submenu').scrollTo(newHeight, newHeight);
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
			};
		}
	}]);

	return PvzService;
}();
// стартуем main


async function map() {
	var startCity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'пенза';

	//(async (startCity = 'пенза') => {

	var app = new PvzService();
	var listPvz = Object;
	var geoObject = Object;

	try {
		document.querySelector(".modalDialog > div").style.opacity = 0.6;

		var valuePostRequest = {
			start_city: startCity
			// делаем запрос на сервер, получаем данные
		};var dbObject = await fetch("/include/ks_pvz/index.php", {
			method: "post",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: app.createQueryString(valuePostRequest)

		});

		listPvz = await dbObject.json();
	} catch (error) {
		console.log(new Error("Error, failed to get data " + error));
	}

	// проверяем готовы вы данные для работы/построения карты
	if (Object.keys(listPvz.pointPvz).length > 0 && _typeof(listPvz.pointPvz)) {

		// рисуем карту, но только на пк - мобильные не загружаем
		if (window.innerWidth > 980) {

			// создаем гео объект для размещения на карте
			try {
				geoObject = await app.createGeoObject(listPvz);
			} catch (error) {
				console.log(new Error("Point location not received"));
			}

			// создаем карту
			if ((typeof geoObject === "undefined" ? "undefined" : _typeof(geoObject)) == 'object') {
				ymaps.ready(app.createMap(listPvz, geoObject));
			}
		}

		try {
			// создаем меню (список точек)
			var menu = app.createMapMenu(listPvz);
			var count = Object.keys(menu).length;

			if (count > 0) {

				document.querySelector('ul.submenu').innerHTML = '';
				var i = 0;
				var timerId = setInterval(function () {
					var div = document.querySelector('ul.submenu');
					div.insertAdjacentHTML('beforeend', menu[i]);
					if (i < count - 1) {
						i++;
					} else {
						clearTimeout(timerId);
						document.querySelector(".preLoader.Error").style.display = "none";
					}
				}, 5);
			} else {
				console.log(new Error("Error, no points to display"));
			}
		} catch (error) {
			console.log(new Error("Error " + error));
		}

		//delete listPvz;
	} else {
		console.log("there are no pvz points in this city");
	}
};

map();

document.addEventListener("DOMContentLoaded", function () {

	//   let observer = new MutationObserver(mutationRecords => {
	// 	console.log(mutationRecords); // console.log(изменения)
	//   });

	//   // наблюдать за всем, кроме атрибутов
	//   observer.observe(openModal, {
	// 	childList: true, // наблюдать за непосредственными детьми
	// 	subtree: true, // и более глубокими потомками
	// 	characterDataOldValue: true // передавать старое значение в колбэк
	//   });

	//console.log(mutationObserver);

	document.querySelector('.deliveryItem').addEventListener('change', function () {
		var valueDelivery = document.querySelector('[name=DELIVERY_ID]:checked').value;
		if (valueDelivery != 52) {
			var prop_delivery_form = ["26", "27", "28"];
			for (var item in prop_delivery_form) {
				document.querySelector('input[name="ORDER_PROP_' + prop_delivery_form[item] + '"]').value = '';
				document.querySelector('input[name="ORDER_PROP_' + prop_delivery_form[item] + '"]').removeAttribute("disabled");
			}

			var prop_hidden = ["39", "40", "41"];
			for (var _item in prop_hidden) {
				document.querySelector('input[name="ORDER_PROP_' + prop_hidden[_item] + '"]').value = '';
			}
		}
	});
	// скрыть блок выбора города если автоматичеки выбран правильный город
	document.querySelector("#clarOkButton").addEventListener('click', function () {
		document.querySelector(".box-clarification").style.display = 'none';
	});
	// если автоматически сформирован не правильный город, выбрать нужный
	document.querySelector("#clarNoButton").addEventListener('click', function () {
		document.querySelector(".modalDialog > div .box-clarification").style.display = 'none';
		document.querySelector(".select-city").style.display = 'block';
		document.querySelector("#get_city").focus();
	});
	// поиск города из доступных в списке
	document.querySelector("#get_city").addEventListener('keyup', function () {
		var _this3 = this;

		var request = new XMLHttpRequest();
		var url = "/include/ks_pvz/list-city.json";

		request.responseType = "json";
		request.open("POST", url, true);

		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		request.addEventListener("readystatechange", function () {
			if (request.readyState === 4 && request.status === 200) {

				var regex = new RegExp(_this3.value, 'i');

				var output = '';

				request.response.forEach(function (element, index) {
					if (element.search(regex) != -1) {
						output += "<li>" + element + "</li>";
					}
				});

				document.querySelector(".response-city").innerHTML = output;
			}
		});

		request.send();
	});

	// запускаем поиск по точкам
	document.querySelector(".box-maps .thisCity").addEventListener('click', function () {
		var display = document.querySelector(".select-city").style.display;

		if (display == '' || display == 'none') {
			document.querySelector(".select-city").style.display = 'block';
			document.getElementById("get_city").focus();
		} else {
			document.querySelector(".select-city").style.display = 'none';
		}
	});

	// поиск по улицам
	document.querySelector('input[name="sStreet"]').addEventListener('keyup', function () {
		var search = this.value.toUpperCase();
		document.querySelectorAll("ul.submenu li").forEach(function (element, index) {
			if (element.innerText.toUpperCase().includes(search)) {
				element.style.display = 'block';
			} else {
				element.style.display = 'none';
			}
		});
	});

	// кнопка отмена
	document.querySelector(".btnClose").addEventListener('click', function () {
		setTimeout(function () {
			// таймер-планировщик
			document.querySelector('a.close').click(); // вызвать клик на кнопку
		}, 10);
	});

	// получение размеров экрана пользователя
	var height = window.innerHeight;
	var width = window.innerWidth;

	if (width > 980) {

		var newHeightPopap = parseInt(height) - 140;
		var heightSubMenu = newHeightPopap - 220; // добавили строку 
		document.querySelector(".box-maps").style.height = newHeightPopap + 'px';
		document.querySelector(".modalDialog > div").style.margin = '70px auto';
		document.querySelector(".box-maps .list-point ul.submenu").style.height = heightSubMenu + "px";
		//console.log(height);


		var newWidthPopap = parseInt(width) - 140;
		document.querySelector(".modalDialog > div").style.width = newWidthPopap + "px";
	} else {

		var body = document.body,
		    html = document.documentElement;
		var heightDocument = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
		var heightMobileDefault = height - 180;

		document.querySelector(".box-maps").style.height = heightDocument + "px";
		document.querySelector(".box-maps .list-point ul.submenu").style.height = heightMobileDefault + "px";
	}

	// обработка динамических узлов
	document.querySelector('.box-maps').onclick = function (e) {

		// const boxTermReceipt = e.target // элемент который вызвал событие
		// предупреждение о паспорте
		if (e.target.parentElement.classList.contains('boxTermReceipt')) {
			var el = e.target.parentElement.querySelector('.termsReceipt');
			var display = el.style.display;
			display == '' || display == 'none' ? el.style.display = 'block' : el.style.display = 'none';
		}
		// кнопка понятно - предупреждение о паспорте
		if (e.target.id == 'btnTR') {
			var _display = e.target.parentElement.style.display;
			_display == '' || _display == 'none' ? e.target.parentElement.style.display = 'block' : e.target.parentElement.style.display = 'none';
		}

		// выбераем новый город из списка
		if (e.target.parentElement.classList.contains("response-city")) {
			if (e.target.innerText) {
				map(e.target.innerText);
				document.querySelector(".select-city").style.display = 'none';
				document.querySelector(".thisCity").innerHTML = e.target.innerText;
			}
		}
		// переносим данные выбранной точки в форму
		if (e.target.classList.contains("selectGuid")) {

			var guid = document.querySelector(".point.active").getAttribute('data_id_cse');
			var adress = document.querySelector(".point.active").innerText;
			var id = document.querySelector(".point.active").id;

			var paymentCash = document.querySelector('.dpoint[id="' + id + '"] > div > #paymentCash').innerText;
			var paymentCard = document.querySelector('.dpoint[id="' + id + '"] > div > #paymentCard').innerText;
			var fieldAdminPayment = '| ' + paymentCash + ' | ' + paymentCard + '|';

			if (guid) {

				document.querySelector('input[name="ORDER_PROP_39"]').value = guid;
				document.querySelector('input[name="ORDER_PROP_40"]').value = adress;
				document.querySelector('input[name="ORDER_PROP_41"]').value = fieldAdminPayment;

				// подставляем адрес в форму и информацией о доставке
				document.querySelector('input[name="ORDER_PROP_28"]').value = adress;
				document.querySelector('input[name="ORDER_PROP_28"]').setAttribute('disabled', 'disabled');

				// получаем название текущего города
				var selectCity = document.querySelector(".thisCity").innerText;

				document.querySelector('input[name="ORDER_PROP_27"]').value = selectCity;
				document.querySelector('input[name="ORDER_PROP_27"]').setAttribute('disabled', 'disabled');

				document.querySelector('input[name="ORDER_PROP_26"]').value = selectCity;
				document.querySelector('input[name="ORDER_PROP_26"]').setAttribute('disabled', 'disabled');

				document.querySelector(".deliveryItem .selection_block .item a[href='#openModal']").innerHTML = adress;

				setTimeout(function () {
					// таймер-планировщик
					document.querySelector('a.close').click(); // вызвать клик на кнопку
				}, 10);

				document.querySelector(".box-maps .list-point .buttons .error").style.display = 'none';

				// устанавливаем скрол на высоте блока выбора доставки, актуально для мобильной версии
				var heightDeliveryBlock = getCoords(document.querySelector('.deliveryItem__title'));
				window.scrollTo(0, heightDeliveryBlock.top);
			} else {
				document.querySelector(".box-maps .list-point .buttons .error").style.display = 'block';
			}
		}

		// если в одном балуне 2 точки
		if (e.target.classList.contains("bHeader")) {

			document.querySelectorAll('li.point').forEach(function (el, index) {
				el.classList.remove("active");
			});

			document.querySelector(".point[id='" + e.target.id + "']").classList.add('active');

			document.querySelector('ul.submenu').scrollTo(0, 0);

			var itemTop = document.querySelector('li.point[id="' + e.target.id + '"]').offsetTop;

			if (itemTop != undefined && itemTop >= 147) {
				var newHeight = itemTop - 147 - parseInt(document.querySelector('ul.submenu').offsetHeight) / 2;
				document.querySelector('ul.submenu').scrollTo(newHeight, newHeight);
			}
			//console.log(e.target.id);
		}

		// // выбираем точку самовывоза из списка
		// if(e.target.classList.contains("point")){

		//    let idListElement = e.target.id;
		//    let zoomMap = myMap.getZoom();

		//    if(zoomMap < 16){
		// 	  myMap.setZoom( 16 );
		//    }
		//    myMap.setCenter(objectManager.objects.getById(idListElement).geometry.coordinates );

		// 	if (!objectManager.objects.balloon.isOpen(idListElement)) {
		// 		objectManager.objects.balloon.open(idListElement);

		// 		document.querySelectorAll('li.point').forEach(function(el, index){ el.classList.remove("active"); });
		// 		adress.classList.add('active');

		// 	}else{
		// 		objectManager.objects.balloon.close(idListElement);
		// 	}

		// }

		// при клики по блоку с адресом покажем подробное описание, работает только на мобильном
		if (e.target.classList.contains("point") && e.target.id != undefined && width < 980) {

			var _id = e.target.id;

			var _display2 = document.querySelector(".dpoint[id='" + _id + "']").style.display; //console.log(e.target.nextElementSibling);

			if (_display2 == '' || _display2 == 'none') {
				// скрываем все открыте блоки прежде чем открыть новый
				document.querySelectorAll(".dpoint").forEach(function (element, index) {
					element.style.display = "none";
				});
				// возвращаем к только что скрытым блокам начальное состояние - цвет шрифта и фона
				document.querySelectorAll(".point").forEach(function (element, index) {
					element.classList.remove('active');
				});
				// открываем новый блок
				document.querySelector(".dpoint[id='" + _id + "']").style.display = "block";
				document.querySelector(".point[id='" + _id + "']").classList.add('active');
			} else {

				document.querySelector(".dpoint[id='" + _id + "']").style.display = "none";
				document.querySelector(".point[id='" + _id + "']").classList.remove('active');
			}
		}

		//console.log(e.target);
		// кнопка отмена - закрыает блок подробного описания у точки самовывоза на мобильной версии 
		if (e.target.classList.contains("btnCloseBallon")) {
			var _id2 = e.target.parentElement.parentElement.parentElement.id;
			document.querySelector(".dpoint[id='" + _id2 + "']").style.display = "none";
			document.querySelector(".point[id='" + _id2 + "']").classList.remove('active');
		}
	};
});

// вычисление координат элемента
function getCoords(elem) {
	var box = elem.getBoundingClientRect();

	return {
		top: box.top + pageYOffset,
		left: box.left + pageXOffset
	};
}