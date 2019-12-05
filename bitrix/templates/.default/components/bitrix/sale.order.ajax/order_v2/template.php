<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main,
	Bitrix\Main\Localization\Loc;
// для определения города самовывоза
include_once($_SERVER['DOCUMENT_ROOT'].'/include/ks_pvz/geo_plugin_locate.php');
$geoplugin = new geoPlugin;
$geoplugin->locate();

/**
 * @var array $arParams
 * @var array $arResult
 * @var CMain $APPLICATION
 * @var CUser $USER
 * @var SaleOrderAjax $component
 * @var string $templateFolder
 */

$context = Main\Application::getInstance()->getContext();
$request = $context->getRequest();

$APPLICATION->AddHeadScript('/js/jquery.kladr.min.js');
$APPLICATION->SetAdditionalCSS("/css/jquery.kladr.min.css");


if (empty($arParams['TEMPLATE_THEME']))
{
	$arParams['TEMPLATE_THEME'] = Main\ModuleManager::isModuleInstalled('bitrix.eshop') ? 'site' : 'blue';
}

if ($arParams['TEMPLATE_THEME'] === 'site')
{
	$templateId = Main\Config\Option::get('main', 'wizard_template_id', 'eshop_bootstrap', $component->getSiteId());
	$templateId = preg_match('/^eshop_adapt/', $templateId) ? 'eshop_adapt' : $templateId;
	$arParams['TEMPLATE_THEME'] = Main\Config\Option::get('main', 'wizard_'.$templateId.'_theme_id', 'blue', $component->getSiteId());
}

if (!empty($arParams['TEMPLATE_THEME']))
{
	if (!is_file(Main\Application::getDocumentRoot().'/bitrix/css/main/themes/'.$arParams['TEMPLATE_THEME'].'/style.css'))
	{
		$arParams['TEMPLATE_THEME'] = 'blue';
	}
}

$arParams['ALLOW_USER_PROFILES'] = $arParams['ALLOW_USER_PROFILES'] === 'Y' ? 'Y' : 'N';
$arParams['SKIP_USELESS_BLOCK'] = $arParams['SKIP_USELESS_BLOCK'] === 'N' ? 'N' : 'Y';

if (!isset($arParams['SHOW_ORDER_BUTTON']))
{
	$arParams['SHOW_ORDER_BUTTON'] = 'final_step';
}

$arParams['HIDE_ORDER_DESCRIPTION'] = isset($arParams['HIDE_ORDER_DESCRIPTION']) && $arParams['HIDE_ORDER_DESCRIPTION'] === 'Y' ? 'Y' : 'N';
$arParams['SHOW_TOTAL_ORDER_BUTTON'] = $arParams['SHOW_TOTAL_ORDER_BUTTON'] === 'Y' ? 'Y' : 'N';
$arParams['SHOW_PAY_SYSTEM_LIST_NAMES'] = $arParams['SHOW_PAY_SYSTEM_LIST_NAMES'] === 'N' ? 'N' : 'Y';
$arParams['SHOW_PAY_SYSTEM_INFO_NAME'] = $arParams['SHOW_PAY_SYSTEM_INFO_NAME'] === 'N' ? 'N' : 'Y';
$arParams['SHOW_DELIVERY_LIST_NAMES'] = $arParams['SHOW_DELIVERY_LIST_NAMES'] === 'N' ? 'N' : 'Y';
$arParams['SHOW_DELIVERY_INFO_NAME'] = $arParams['SHOW_DELIVERY_INFO_NAME'] === 'N' ? 'N' : 'Y';
$arParams['SHOW_DELIVERY_PARENT_NAMES'] = $arParams['SHOW_DELIVERY_PARENT_NAMES'] === 'N' ? 'N' : 'Y';
$arParams['SHOW_STORES_IMAGES'] = $arParams['SHOW_STORES_IMAGES'] === 'N' ? 'N' : 'Y';

if (!isset($arParams['BASKET_POSITION']) || !in_array($arParams['BASKET_POSITION'], array('before', 'after')))
{
	$arParams['BASKET_POSITION'] = 'after';
}

$arParams['EMPTY_BASKET_HINT_PATH'] = isset($arParams['EMPTY_BASKET_HINT_PATH']) ? (string)$arParams['EMPTY_BASKET_HINT_PATH'] : '/';
$arParams['SHOW_BASKET_HEADERS'] = $arParams['SHOW_BASKET_HEADERS'] === 'Y' ? 'Y' : 'N';
$arParams['HIDE_DETAIL_PAGE_URL'] = isset($arParams['HIDE_DETAIL_PAGE_URL']) && $arParams['HIDE_DETAIL_PAGE_URL'] === 'Y' ? 'Y' : 'N';
$arParams['DELIVERY_FADE_EXTRA_SERVICES'] = $arParams['DELIVERY_FADE_EXTRA_SERVICES'] === 'Y' ? 'Y' : 'N';
$arParams['SHOW_COUPONS_BASKET'] = $arParams['SHOW_COUPONS_BASKET'] === 'N' ? 'N' : 'Y';
$arParams['SHOW_COUPONS_DELIVERY'] = $arParams['SHOW_COUPONS_DELIVERY'] === 'N' ? 'N' : 'Y';
$arParams['SHOW_COUPONS_PAY_SYSTEM'] = $arParams['SHOW_COUPONS_PAY_SYSTEM'] === 'Y' ? 'Y' : 'N';
$arParams['SHOW_NEAREST_PICKUP'] = $arParams['SHOW_NEAREST_PICKUP'] === 'Y' ? 'Y' : 'N';
$arParams['DELIVERIES_PER_PAGE'] = isset($arParams['DELIVERIES_PER_PAGE']) ? intval($arParams['DELIVERIES_PER_PAGE']) : 9;
$arParams['PAY_SYSTEMS_PER_PAGE'] = isset($arParams['PAY_SYSTEMS_PER_PAGE']) ? intval($arParams['PAY_SYSTEMS_PER_PAGE']) : 9;
$arParams['PICKUPS_PER_PAGE'] = isset($arParams['PICKUPS_PER_PAGE']) ? intval($arParams['PICKUPS_PER_PAGE']) : 5;
$arParams['SHOW_PICKUP_MAP'] = $arParams['SHOW_PICKUP_MAP'] === 'N' ? 'N' : 'Y';
$arParams['SHOW_MAP_IN_PROPS'] = $arParams['SHOW_MAP_IN_PROPS'] === 'Y' ? 'Y' : 'N';
$arParams['USE_YM_GOALS'] = $arParams['USE_YM_GOALS'] === 'Y' ? 'Y' : 'N';
$arParams['USE_ENHANCED_ECOMMERCE'] = isset($arParams['USE_ENHANCED_ECOMMERCE']) && $arParams['USE_ENHANCED_ECOMMERCE'] === 'Y' ? 'Y' : 'N';
$arParams['DATA_LAYER_NAME'] = isset($arParams['DATA_LAYER_NAME']) ? trim($arParams['DATA_LAYER_NAME']) : 'dataLayer';
$arParams['BRAND_PROPERTY'] = isset($arParams['BRAND_PROPERTY']) ? trim($arParams['BRAND_PROPERTY']) : '';

$useDefaultMessages = !isset($arParams['USE_CUSTOM_MAIN_MESSAGES']) || $arParams['USE_CUSTOM_MAIN_MESSAGES'] != 'Y';

if ($useDefaultMessages || !isset($arParams['MESS_AUTH_BLOCK_NAME']))
{
	$arParams['MESS_AUTH_BLOCK_NAME'] = Loc::getMessage('AUTH_BLOCK_NAME_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_REG_BLOCK_NAME']))
{
	$arParams['MESS_REG_BLOCK_NAME'] = Loc::getMessage('REG_BLOCK_NAME_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_BASKET_BLOCK_NAME']))
{
	$arParams['MESS_BASKET_BLOCK_NAME'] = Loc::getMessage('BASKET_BLOCK_NAME_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_REGION_BLOCK_NAME']))
{
	$arParams['MESS_REGION_BLOCK_NAME'] = Loc::getMessage('REGION_BLOCK_NAME_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_PAYMENT_BLOCK_NAME']))
{
	$arParams['MESS_PAYMENT_BLOCK_NAME'] = Loc::getMessage('PAYMENT_BLOCK_NAME_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_DELIVERY_BLOCK_NAME']))
{
	$arParams['MESS_DELIVERY_BLOCK_NAME'] = Loc::getMessage('DELIVERY_BLOCK_NAME_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_BUYER_BLOCK_NAME']))
{
	$arParams['MESS_BUYER_BLOCK_NAME'] = Loc::getMessage('BUYER_BLOCK_NAME_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_BACK']))
{
	$arParams['MESS_BACK'] = Loc::getMessage('BACK_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_FURTHER']))
{
	$arParams['MESS_FURTHER'] = Loc::getMessage('FURTHER_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_EDIT']))
{
	$arParams['MESS_EDIT'] = Loc::getMessage('EDIT_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_ORDER']))
{
	$arParams['MESS_ORDER'] = $arParams['~MESS_ORDER'] = Loc::getMessage('ORDER_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_PRICE']))
{
	$arParams['MESS_PRICE'] = Loc::getMessage('PRICE_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_PERIOD']))
{
	$arParams['MESS_PERIOD'] = Loc::getMessage('PERIOD_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_NAV_BACK']))
{
	$arParams['MESS_NAV_BACK'] = Loc::getMessage('NAV_BACK_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_NAV_FORWARD']))
{
	$arParams['MESS_NAV_FORWARD'] = Loc::getMessage('NAV_FORWARD_DEFAULT');
}

$useDefaultMessages = !isset($arParams['USE_CUSTOM_ADDITIONAL_MESSAGES']) || $arParams['USE_CUSTOM_ADDITIONAL_MESSAGES'] != 'Y';

if ($useDefaultMessages || !isset($arParams['MESS_PRICE_FREE']))
{
	$arParams['MESS_PRICE_FREE'] = Loc::getMessage('PRICE_FREE_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_ECONOMY']))
{
	$arParams['MESS_ECONOMY'] = Loc::getMessage('ECONOMY_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_REGISTRATION_REFERENCE']))
{
	$arParams['MESS_REGISTRATION_REFERENCE'] = Loc::getMessage('REGISTRATION_REFERENCE_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_AUTH_REFERENCE_1']))
{
	$arParams['MESS_AUTH_REFERENCE_1'] = Loc::getMessage('AUTH_REFERENCE_1_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_AUTH_REFERENCE_2']))
{
	$arParams['MESS_AUTH_REFERENCE_2'] = Loc::getMessage('AUTH_REFERENCE_2_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_AUTH_REFERENCE_3']))
{
	$arParams['MESS_AUTH_REFERENCE_3'] = Loc::getMessage('AUTH_REFERENCE_3_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_ADDITIONAL_PROPS']))
{
	$arParams['MESS_ADDITIONAL_PROPS'] = Loc::getMessage('ADDITIONAL_PROPS_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_USE_COUPON']))
{
	$arParams['MESS_USE_COUPON'] = Loc::getMessage('USE_COUPON_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_COUPON']))
{
	$arParams['MESS_COUPON'] = Loc::getMessage('COUPON_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_PERSON_TYPE']))
{
	$arParams['MESS_PERSON_TYPE'] = Loc::getMessage('PERSON_TYPE_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_SELECT_PROFILE']))
{
	$arParams['MESS_SELECT_PROFILE'] = Loc::getMessage('SELECT_PROFILE_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_REGION_REFERENCE']))
{
	$arParams['MESS_REGION_REFERENCE'] = Loc::getMessage('REGION_REFERENCE_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_PICKUP_LIST']))
{
	$arParams['MESS_PICKUP_LIST'] = Loc::getMessage('PICKUP_LIST_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_NEAREST_PICKUP_LIST']))
{
	$arParams['MESS_NEAREST_PICKUP_LIST'] = Loc::getMessage('NEAREST_PICKUP_LIST_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_SELECT_PICKUP']))
{
	$arParams['MESS_SELECT_PICKUP'] = Loc::getMessage('SELECT_PICKUP_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_INNER_PS_BALANCE']))
{
	$arParams['MESS_INNER_PS_BALANCE'] = Loc::getMessage('INNER_PS_BALANCE_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_ORDER_DESC']))
{
	$arParams['MESS_ORDER_DESC'] = Loc::getMessage('ORDER_DESC_DEFAULT');
}

$useDefaultMessages = !isset($arParams['USE_CUSTOM_ERROR_MESSAGES']) || $arParams['USE_CUSTOM_ERROR_MESSAGES'] != 'Y';

if ($useDefaultMessages || !isset($arParams['MESS_PRELOAD_ORDER_TITLE']))
{
	$arParams['MESS_PRELOAD_ORDER_TITLE'] = Loc::getMessage('PRELOAD_ORDER_TITLE_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_SUCCESS_PRELOAD_TEXT']))
{
	$arParams['MESS_SUCCESS_PRELOAD_TEXT'] = Loc::getMessage('SUCCESS_PRELOAD_TEXT_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_FAIL_PRELOAD_TEXT']))
{
	$arParams['MESS_FAIL_PRELOAD_TEXT'] = Loc::getMessage('FAIL_PRELOAD_TEXT_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_DELIVERY_CALC_ERROR_TITLE']))
{
	$arParams['MESS_DELIVERY_CALC_ERROR_TITLE'] = Loc::getMessage('DELIVERY_CALC_ERROR_TITLE_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_DELIVERY_CALC_ERROR_TEXT']))
{
	$arParams['MESS_DELIVERY_CALC_ERROR_TEXT'] = Loc::getMessage('DELIVERY_CALC_ERROR_TEXT_DEFAULT');
}

if ($useDefaultMessages || !isset($arParams['MESS_PAY_SYSTEM_PAYABLE_ERROR']))
{
	$arParams['MESS_PAY_SYSTEM_PAYABLE_ERROR'] = Loc::getMessage('PAY_SYSTEM_PAYABLE_ERROR_DEFAULT');
}

$scheme = $request->isHttps() ? 'https' : 'http';

switch (LANGUAGE_ID)
{
	case 'ru':
		$locale = 'ru-RU'; break;
	case 'ua':
		$locale = 'ru-UA'; break;
	case 'tk':
		$locale = 'tr-TR'; break;
	default:
		$locale = 'en-US'; break;
}
?>
	<NOSCRIPT>
		<div style="color:red"><?=Loc::getMessage('SOA_NO_JS')?></div>
	</NOSCRIPT>
<?

if (strlen($request->get('ORDER_ID')) > 0)
{
	include(Main\Application::getDocumentRoot().$templateFolder.'/confirm.php');
}
/*
elseif ($arParams['DISABLE_BASKET_REDIRECT'] === 'Y' && $arResult['SHOW_EMPTY_BASKET'])
{
	//include(Main\Application::getDocumentRoot().$templateFolder.'/empty.php');
}
*/
else
{
	
//pre($arParams);
//pre($arResult); 
/* 	
global $KOLLEKTSIYA_ID;

pre($KOLLEKTSIYA);
*/
	
?>






<div action="<?=POST_FORM_ACTION_URI?>" method="POST" name="ORDER_FORM" id="bx-soa-order-form" enctype="multipart/form-data">

<? 
echo bitrix_sessid_post(); 
if (strlen($arResult['PREPAY_ADIT_FIELDS']) > 0) {echo $arResult['PREPAY_ADIT_FIELDS'];}
?>

		<input type="hidden" name="<?=$arParams['ACTION_VARIABLE']?>" value="saveOrderAjax">
		<input type="hidden" name="location_type" value="code">
		<input type="hidden" name="BUYER_STORE" id="BUYER_STORE" value="<?=$arResult['BUYER_STORE']?>">
		<input type="hidden" name="signedParamsString" value="<?$signer = new Main\Security\Sign\Signer;echo $signer->sign(base64_encode(serialize($arParams)), 'sale.order.ajax');?>">		
		<input type="hidden" name="PERSON_TYPE" value="1">
		<input type="hidden" name="ORDER_PROP_39" value="">
		<input type="hidden" name="ORDER_PROP_40" value="">
		<input type="hidden" name="ORDER_PROP_41" value="">
		<input type="hidden" name="your_city" value="<?=$geoplugin->city;?>">
					
		
				<div class="cartBlock">
					<div class="cartBlock__plug"><div class="preloader"></div></div>  
					<div class="cartBlock__inner">
						<div class = 'cartBlock__message gift' data-gift></div>
						<div class="cartBlock__message" style="display:none" data-freedelivery>Стоимость доставки <font data='delivery_price'></font> ₽ - до бесплатной доставки вам осталось <font data="delivery_left"></font> ₽</div> 
						<div class="cartCols">
							<div class="cartCol__items">
								<div class="cartItems" data="basket-list">
								
									<?foreach ( $arResult['BASKET_ITEMS'] as $item){?>	
									<div class="cartItem" data-item="<?=$item['ID']?>" data-item-product="<?=$item['PRODUCT_ID']?>">
										<div class="cartItem__img"><img src="<?=$item['PREVIEW_PICTURE_SRC_2X']?$item['PREVIEW_PICTURE_SRC_2X']:'/images/no_pic.jpg'?>" alt="" title=""/></div>
										<div class="basketCols">
											<div class="basketItems">
																		
												<div class="basketItem">
													<div class="basketItem__inner">
														<div class="basketItem__name"><a href="<?=$item['DETAIL_PAGE_URL']?>"><?=$item['NAME']?></a></div>
														<div class="basketItem__options">
															<?foreach ( array_reverse($item['PROPS']) as $prop){
															//if ($prop['NAME'] == 'Артикул') continue;	
															if ($prop['NAME'] == 'Код') continue;	
															if ($prop['NAME'] == 'Размер')	continue;
															?>
															<div class="basketItem__option"><?=$prop['NAME']?>: <span><?=$prop['VALUE']?></span></div>
															<?}?>														
															<?
															$collect_name = GetCollectionToId($item['PRODUCT_ID']);
															if($collect_name){
															?>
															<div class="basketItem__option">Коллекция: <span><?=$collect_name;?></span></div> 
															<?
															}
															?>
														</div>
														<div class="basketItem__csBlock">
															<div class="basketItem__countBlock">
																<div class="basketItem__sizeTitle">Кол-во:</div>
																<div class="basketItem__remove" data="item_minus"></div>
																<input type="text" placeholder="" value="<?=$item["QUANTITY"]?>" data="item_quantity" readonly name="QUANTITY_<?=$item['ID']?>" /> 
																<div class="basketItem__add" data="item_plus"></div>
																<div class="cl"></div>
															</div>
															
															<?if (preg_match("/Перчатки/Ui", $item['NAME'])) {
																$arrSize = idToSizeList(['ID'=>$item['PRODUCT_ID']]);
															?>
															
															<div class="basketItem__sizeBlock">
																<div class="basketItem__sizeTitle">Размер:</div>
																<div class="basketItem__select">
																	<select data="selectsize">
																		<?foreach ($arrSize['LIST'] as $size ){?>
																		<option data-size-id="<?=$size['ID']?>" data-size-id1="<?=$size['ID_1']?>" data-size-pic="<?=$size['PREVIEW_PICTURE']?>" <?if($size['CHECKED'] == 'Y'){ echo "selected"; }?>><?=$size['SIZE']?></option>
																		<?}?>
																	</select>
																</div>
																<div class="cl"></div>
															</div>		
 															
															<?}?>
															
															<div class="cl"></div>
														</div>
													</div>
												</div>												
												
												<div class="basketItem">
													<div class="basketItem__inner">
														<div class="basketItem__priceItems">
															<!--
															<div class="basketItem__priceItem">
																<div class="basketItem__priceName">Цена</div>
																<div class="basketItem__priceNumber"><span class="oldPrice"><?=$item["SUM_BASE_FORMATED"]?> ₽</span></div> 
																<div class="cl"></div>
															</div>															
															<div class="basketItem__priceItem">
																<div class="basketItem__priceName">Скидка на товар</div>
																<div class="basketItem__priceNumber"><span>x%</span><span>x xxx ₽</span></div>
																<div class="cl"></div>
															</div>															
															<div class="basketItem__priceItem">
																<div class="basketItem__priceName">Скидка промокод</div>
																<div class="basketItem__priceNumber"><span>x%</span><span>xxx ₽</span></div>
																<div class="cl"></div>
															</div>															
															<div class="basketItem__priceItem">
																<div class="basketItem__priceName">Оплата бонусами</div>
																<div class="basketItem__priceNumber"><span>xx%</span><span>xxx ₽</span></div>
																<div class="cl"></div>
															</div>															
															<div class="basketItem__priceItem">
																<div class="basketItem__priceName">Цена к оплате</div>
																<div class="basketItem__priceNumber"><span class="totalPrice">x xxx ₽</span></div>
																<div class="cl"></div>
															</div>
															-->
														</div>
														<div class="basketItem__dwBlock">
															<a href="javascript:" class="basketItem__delLink" data="delete_item">Удалить</a>
															<a href="" class="basketItem__wishLink" data="postpone_add">Отложить</a> 
															<div class="cl"></div>
														</div>
													</div>
												</div>
												<div class="cl"></div>
											</div>
										</div>
										<div class="cl"></div>
									</div>	
									<? } ?>
									
<?
//товары не доступный для покупки

include(Main\Application::getDocumentRoot().$templateFolder.'/empty.php');

?>									
									
									
								</div>
							</div>
							
							<?if(count($arResult['BASKET_ITEMS'])>0){?>
							<div class="cartCol__info">
								<div class="orderItems__block">
									<div class="orderItems">
										<div class="orderItem">
											<div class="orderItem__inner">
												<div class="orderItem__promoBlock">
												
												<?if(count($arResult['JS_DATA']['COUPON_LIST'])>0){?>
													<div class="orderItem__promoItem" style="display:block;">
														<div class="promoItem__button"><button data-delcoupon="<?=$arResult['JS_DATA']['COUPON_LIST'][0]['COUPON']?>">Удалить</button></div>
														<div class="promoItem__input"><input type="text" value="<?=$arResult['JS_DATA']['COUPON_LIST'][0]['COUPON']?>" readonly placeholder=""/></div>
														<div class="cl"></div>
														<div class="promoItem__error" style="display:block; <?if($arResult['JS_DATA']['COUPON_LIST'][0]['JS_STATUS'] != 'BAD'){?>color:#000;<?}?>"><?=$arResult['JS_DATA']['COUPON_LIST'][0]['STATUS_TEXT']?></div>
													</div>												
												<? } else {?>
													<div class="orderItem__promoLink">Ввести промокод</div>
													<div class="orderItem__promoClose">Скрыть</div>	
													<div class="orderItem__promoItem">
														<div class="promoItem__button"><button data-addcoupon>Применить</button></div>
														<div class="promoItem__input"><input id="coupon" name="coupon" type="text" placeholder=""/></div>
														<div class="cl"></div>
														<div class="promoItem__error">Неверный промокод</div>
													</div>
												<? } ?>	
												</div>
											</div>
										</div>			
										<?if($arResult["BONUS"]["PAY"]>0){?>
										<input id="PAY_BONUS_SUM" type="hidden" name="PAY_BONUS_SUM" value="<?=$arResult["BONUS"]["PAY"]?>">
									
										<div class="orderItem">
											<div class="orderItem__inner">
												<div class="paymentItem">
													<div class="checkbox">
														<input id="PAY_BONUS" type="checkbox" name="PAY_BONUS" value="Y">											
														<label for="PAY_BONUS">Оплата бонусами</label>
													</div>
													<!--div class="paymentItem__availableBonus">Доступно <span>1795</span> бонусов</div-->
													<div class="paymentItem__availableBonus">Можно списать <span id="order_bonus"><?=$arResult["BONUS"]["PAY"]?></span> бонусов</div>
													<div class="paymentItem__bonusInfo">Вы можете оплатить бонусами до 30% от стоимости заказа.<br>1 бонус = 1 рубль. <a href="/discount_karta/" target="_blank">Подробнее</a></div>
												</div>
											</div>
										</div>	
										
										<script>
										$("#PAY_BONUS").change(function(e) {
											e.stopPropagation(); e.preventDefault(); 
											if($('#PAY_BONUS:checked').val() == 'Y'){
												$('#V_BONUS').show();
											} else {
												$('#V_BONUS').hide();
											}	
											$("[name=DELIVERY_ID]:checked").change();
											//pay_bonus();
										});
										</script>										
										
										<?}?>										
										<div class="orderItem">
											<div class="orderItem__inner">
												<div class="deliveryItem">
													<div class="deliveryItem__title">Доставка</div>
													<div class="deliveryItem__subtitle">Бесплатная доставка от 3000 рублей</div>
													<div class="selection_block">
													<?
													foreach ($arResult["DELIVERY"] as $delivery_id => $arDelivery)
													{
													?>
														<div class="item">
															<input <?if($arDelivery["CHECKED"] == 'Y'){?>checked<?}?> id="<?= $arDelivery["ID"] ?>" type="radio" id="ID_DELIVERY_ID_<?= $arDelivery["ID"] ?>" name="DELIVERY_ID" data-text="<?= htmlspecialcharsbx($arDelivery["NAME"])?>" value="<?= $arDelivery["ID"] ?>">
															<label for="<?= $arDelivery["ID"] ?>"><?= htmlspecialcharsbx($arDelivery["NAME"])?></label>
														</div>	
													<?
													}
													?>									
													</div>
													
													<?
													$rsUser = CUser::GetByID($USER->GetID ());
													$arUser = $rsUser->Fetch();
													?>

													<div class="deliveryItem__link"><a href="#orderWindow" class="popup_order">Заполнить данные для доставки</a></div>
													<div class="windowOrder" id="orderWindow">
														<div class="windowOrder__inner">
															<div class="windowOrder__title">Данные для доставки</div>
															<div class="windowCols">
																<div class="windowCol">
																	<div class="windowCol__items">
																		<div class="windowCol__item" data-delivery-form="ORDER_PROP_20">
																			<div class="windowCol__title">Имя</div>
																			<input type="text" name="ORDER_PROP_20" value="<?=$arUser['NAME']?>"  placeholder=""/>
																			<!--div class="windowCol__errorText">Не заполнено поле</div-->
																		</div>
																		<div class="windowCol__item" data-delivery-form="ORDER_PROP_21">
																			<div class="windowCol__title">Фамилия</div>
																			<input type="text" name="ORDER_PROP_21" value="<?=$arUser['LAST_NAME']?>" placeholder=""/>
																		</div>
																		<div class="windowCol__item" data-delivery-form="ORDER_PROP_22">
																			<div class="windowCol__title">Отчество</div>
																			<input type="text" name="ORDER_PROP_22" value="<?=$arUser['SECOND_NAME']?>" placeholder=""/>
																		</div>
																		<div class="windowCol__item" data-delivery-form="ORDER_PROP_23">
																			<div class="windowCol__title">Номер телефона</div>
																			<input type="tel" name="ORDER_PROP_23" placeholder="" value="<?=$arUser['PERSONAL_PHONE']?>"  id="phone" placeholder=""/>
																		</div>
																		<div class="windowCol__item" data-delivery-form="ORDER_PROP_24">
																			<div class="windowCol__title">E-mail</div>
																			<input type="text" name="ORDER_PROP_24" value="<?=$arUser['EMAIL']?>" readonly placeholder=""/>
																		</div>
																	</div>
																</div>
																<div class="windowCol">
																	<div class="windowCol__items">
																		<!--div class="windowCol__item" data-delivery-form="ORDER_PROP_25">
																			<div class="windowCol__title">Страна</div>
																			<input type="text" name="ORDER_PROP_25" value="<?=$arUser['UF_COUNTRY']?>" placeholder=""/>
																		</div-->																		
																		<div class="windowCol__item" data-delivery-form="ORDER_PROP_27">
																			<div class="windowCol__title">Город, населенный пункт</div>
																			<input type="text" name="ORDER_PROP_27" value="<?=$arUser['PERSONAL_CITY']?>" placeholder=""/>
																			<input type="hidden" name="ORDER_PROP_35" value="<?=$arUser['UF_CITY_KLADR']?>"/>
																		</div>
																		<div class="windowCol__item" data-delivery-form="ORDER_PROP_26">
																			<div class="windowCol__title">Область, регион</div>
																			<input type="text" name="ORDER_PROP_26" value="<?=$arUser['PERSONAL_STATE']?>" placeholder=""/>
																		</div>	
																		<!--div class="windowCol__item">
																			<div class="windowCol__title">Населенный пункт</div>
																			<input type="text" placeholder=""/>
																		</div-->
																		<div class="windowCol__item" data-delivery-form="ORDER_PROP_28">
																			<div class="windowCol__title">Улица, дом, квартира</div>
																			<input type="text" name="ORDER_PROP_28" value="<?=$arUser['PERSONAL_STREET']?>" placeholder=""/>
																		</div>
																		<div class="windowCol__item" data-name="index" data-delivery-form="ORDER_PROP_4"> 
																			<div class="windowCol__title">Индекс</div> 
																			<input type="text" name="ORDER_PROP_4" value="<?=$arUser['PERSONAL_ZIP']?>" placeholder=""/>
																		</div> 
																	</div>
																</div>
																<div class="cl"></div>
															</div>	
															<div class="windowField">
																<div class="windowCol__title">Комментарий к заказу</div>
																<textarea name="ORDER_DESCRIPTION"></textarea>
															</div>
															<div class="windowOrder__btn"><button data="delivery_save">Сохранить</button></div>
														</div>
													</div>
												
													<script>
													$(function () {

														$('[name="ORDER_PROP_27"]').kladr({
															type: $.kladr.type.city,
															withParents: 1,
															//oneString: true,
															type: $.kladr.type.city,
															labelFormat: function (obj, query) {
																		var label = '';
																		label += obj.typeShort + '.' + obj.name + '';
																		if(obj.parents.length > 0){
																		label += ', ' + '' +obj.parents[0].name + ' ' + obj.parents[0].type +', ';
																		}
																		return label;
															},			
															change: function (obj) {
																if(obj.id){
																	$('[name=ORDER_PROP_35]').val(obj.id);
																	if(obj.parents.length > 0){
																		$('[name=ORDER_PROP_26]').val(obj.parents[0].name+' '+obj.parents[0].type);
																	} else {
																		if(obj.id == '7800000000000'){
																			$('[name=ORDER_PROP_26]').val('Ленинградская область');
																		}else if(obj.id == '7700000000000'){
																			$('[name=ORDER_PROP_26]').val('Московская область');
																		}
																	}
																}
																$(this).val(obj.typeShort+'.'+obj.name);
															},
															sendBefore: function (obj) {		
																$('[name=ORDER_PROP_35]').val('');		
															}
														});
													});		
													</script>												
													
												</div>
											</div>
										</div>										
										<div class="orderItem">
											<div class="orderItem__inner">
												<div class="paymentItem">
													<div class="paymentItem__title">Оплата</div>
													<div class="selection_block">
														<?
														foreach($arResult["PAY_SYSTEM"] as $arPaySystem)
														{
														?>	
														<div class="item">
															<input id="ID_PAY_SYSTEM_ID_<?=$arPaySystem["ID"]?>" type="radio" name="PAY_SYSTEM_ID" data-text="<?= htmlspecialcharsbx($arPaySystem["NAME"])?>" value="<?=$arPaySystem["ID"]?>" <?if ($arPaySystem["CHECKED"]=="Y" && !($arParams["ONLY_FULL_PAY_FROM_ACCOUNT"] == "Y" && $arResult["USER_VALS"]["PAY_CURRENT_ACCOUNT"]=="Y")) echo " checked=\"checked\"";?>>
															<label for="ID_PAY_SYSTEM_ID_<?=$arPaySystem["ID"]?>"><?= htmlspecialcharsbx($arPaySystem["NAME"])?></label>
														</div>														
														<?
														}
														?> 							
													</div>
												</div>	
											</div>
										</div>										
										<div class="orderItem">
											<div class="orderItem__inner">
												<div class="orderItem__backcall">
													<div class="checkbox">	 
														<input type="checkbox" id="nocall" name="ORDER_PROP_37" value="Y"><label for="nocall">Оформить заказ без звонка оператора</label>
													</div>
												</div>
											</div>
										</div>										
										<div class="orderItem">
											<div class="orderItem__inner">
												<div class="orderItem__totalBlock">
													<div class="orderItem__totalItems">
														<div class="orderItem__totalItem" id="order_econom">
															<div class="orderItem__totalName">Вы экономите</div>
															<div class="orderItem__totalPrice"><font>x xxx</font> ₽</div>
															<div class="cl"></div>
														</div>														
														<div class="orderItem__totalItem">
															<div class="orderItem__totalName">Доставка</div>
															<div class="orderItem__totalPrice" id="order_delivery">-</div>
															<div class="cl"></div>
														</div>														
														<div class="orderItem__totalItem">
															<div class="orderItem__totalName">Итого</div>
															<div class="orderItem__totalPrice"><span><font id="order_summ">xx xxx</font> ₽</span></div>
															<div class="cl"></div>
														</div>
													</div>
												</div>
												<div class="orderItem__orderBtn"><button id="saveOrder" onclick="return gtag_report_conversion('tel:800-250-05-65')">Оформить заказ</button></div>
                                                <!-- контейнер для гугл пай -->
												<div id = 'googlePay'></div>	
                                                <!-- контейнер для гугл пай -->												
												<div class="orderItem__consent">
													<div class="checkbox">	
														<input type="checkbox" checked="checked" id="check_policy"><label for="check_policy">Согласен с условиями <a href="/buyer/offer/" target="_blank">Публичной оферты</a></label>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<? } ?>
							<div class="cl"></div>
						</div>
					</div>
				</div>


				

</div>
<? // подключаем пвз
$APPLICATION->SetAdditionalCSS("/include/ks_pvz/css/style.css?rand=".rand(1000,99999));
$APPLICATION->AddHeadScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=7fe42279-f7c2-4165-b742-540a2d8cee95');
//$APPLICATION->AddHeadScript('/include/ks_pvz/js/script_new.js');
?>
<a id = 'deliveryPvz' href="#openModal" onclick = 'renderMaps()' style = 'display:none'>Открыть модальное окно</a>

		<div id="openModal" class="modalDialog">
			<div>
				<div class = 'box-clarification'>
                     <div class = 'text'>
                          Ваш город <span id = 'clarificationCity'><?=$geoplugin->city;?></span>?  <?//=get_city_location();?>
                     </div>
                     <div class = 'box-button'>
                          <button id = 'clarOkButton'>Да</button>
                          <button id = 'clarNoButton'>Нет</button>
                     </div>
				</div>
				<a href="#close" title="Закрыть" class="close">X</a>
				<div class = 'box-maps'>
		             <div class = 'list-point'>
		                  <div class = 'thisCity'><?=$geoplugin->city;?></div>
		                  <div class = 'select-city' style = 'display:none;'>
		                  <input type = 'text' name = 'get_city' id = 'get_city' autocomplete="off" placeholder = 'Введите ваш город'>
		                  <ul class = 'response-city'></ul>
		               </div>
		               <div class = 'adressPoint'>
		              	   <div class = 'header'>Выберите одну из точек самовывоза</div>
		              	   <div class = 'searchStreet'>
                                <input rtpe = 'text' name = 'sStreet' autocomplete="off" placeholder = 'Поиск по улицам'>
		              	   </div>
		                   <div class = 'preLoader Error'>Ждите. Данные загружаются...</div>
		                   <ul class="submenu"></ul>
		               </div>
			               <div class = 'buttons'>
			               	   <div class = 'error'>Пожалуйста, выберите одну из точек самовывоза</div>
			                   <div class = 'center'>
			                        <a class = 'btnSelect selectGuid'>Выбрать</a>
			                        <a class = 'btnClose'>Отмена</a>
			                   </div>
			              </div>
		           </div>
              <div class = 'list-maps'>
                 <div id="map"></div>
              </div>
				</div>
			</div>
		</div>

<script defer="" src="/include/ks_pvz/js/dist/class.js" ></script> <!-- it was script_v_2 -->
<script>$('[name=DELIVERY_ID]:checked').change();</script>
<!--<script async src="https://pay.google.com/gp/p/js/pay.js"></script>
<script async src="https://askent-test.site/bitrix/php_interface/include/sale_payment/googlePay/js/googlePay.js"></script>-->



<?	
}	

if($USER->GetID() == 34315){
	?>
	<button id = 'ot'>Тест</button>
	<?
}
?>