// JavaScript Document
angular.module( "appModule" )
.directive("slideContent" , function () {
	return {
		restrict : "EA" ,
		replace : true ,
		transclde : true ,
		template : "<div class=\"detalied\">" +
						"<hgroup>" +
							"<p>{{data.detial.title}}</p>" +
							"<span class=\"btn-release\">{{data.detial.category}}</span>" +
							"<font><img src=\"asset/image/index_news_icon05.png\" alt=\"\" />{{ data.detial.orgName }}</font>" +
							"<time><img src=\"asset/image/index_news_icon06.png\" />{{ data.detial.publishTime | date : 'yyyy-MM-dd' }}</time>" +
						"</hgroup>" +
						"<article>" +
							"<div ng-bind-html='data.detial.content'></div>" +
							"<a style=\"display:block;\" href=\"{{data.detial.attachement}}\">{{data.detial.attachement | spliceUrl }}</a>" +
							"<p class=\"lastElem\">编辑人: {{ data.detial.ownerName }}</p>" +
							
						"</article>" +
				   "</div>"
	}
})
.filter("spliceUrl", function () {
	return function ( url ) {
		if( url ) {
			return url.lastIndexOf("/") > -1 ? url.substr(url.lastIndexOf("/") + 1 , url.length-1 ) : url;
		}
		
		
	}
})
.directive("slideList" , function () {
	return {
		restrict : "EA" ,
		replace : true ,
		transclde : true ,
		template : "<ul class=\"content light\">" +
				   		"<li ng-repeat=\"t in data.list\" ng-click=\"method.showDeta($event,$index)\" data-id=\"{{t.id}}\" ng-switch=\"t.level\" data-index=\"{{$index}}\">" +
				   			"<i class=\"{{t.state=='unread' ? 'icon_speech_blue' : 'icon_speech_greey'}}\"></i>" +
				   			"<div>" +
				   				"<font>{{t.title}}</font>" +
				   				"<time>{{t.date | date : 'yyyy-MM-dd'}}</time>" +
				   				"<span ng-switch-when=\"important\" class=\"import_red\"></span>" +
				   				"<span ng-switch-when=\"major\" class=\"import_yellow\"></span>" +
				   				"<span ng-switch-default class=\"\"></span>" +
				   			"</div>" +
				   			"<small></small>" +
				   		"</li>" +
				   		"<li class=\"showMore\" style=\"height:30px; text-align:center; background:#f6f7f8; line-height:30px; padding:0;\" ng-click=\"method.getMoreList()\"><span>查看更多信息</span></li>" +
				  "</ul>"
	}
})
.controller("menu",["$scope","$http","$interval","$log","$location","$timeout","$rootScope", function ($scope,$http,$interval,$log,$location,$timeout,$rootScope) {
	
	//================== attr =============================
	$scope.attrs = {
		timer : null ,
		color : "#3bc0c3" ,
		level : "normal" ,			//important, major, normal;
		id : null ,
		host : "/g1/api/af/api/BulletinMgmt/bulletin/"
	};
	$scope.data = {
		list : []		
	}
	//================== function =============================
	$scope.method = {
		show : function () {
					if( angular.element(".toggle-show").hasClass("toggle-hide") ) {
						angular.element(".toggle-show").removeClass("toggle-hide");
						angular.element(".column").removeClass("column_out1").removeClass("column_out2");
						angular.element(".mask").hide();
						angular.element("#content-1 li").children("small").css({"transform":"scaleY(0)","-webkit-transform" : "scaleY(0)","-moz-transform" : "scaleY(0)" , "-ms-transform" : "scale(0)" , "-o-transform" : "scale(0)"});
						
						
					} else {
						angular.element(".toggle-show").addClass("toggle-hide");
						angular.element(".column").addClass("column_out1");
						angular.element(".mask").show();
						$scope.method.getList();
					}
			 	} ,
		showDeta : function ($event,$index) {
					var target = $event.target;
					var liText = angular.element("#content-1 li");
					var parent = target.tagName.toLowerCase() != "li" ? angular.element(target).parents("li") : target;
					
						console.log($index)
	
						$(".light").find("small").removeClass("small_show");
						$(parent).find("small").addClass("small_show");

						angular.element(".column").addClass("column_out2");
						
						
						var index = angular.element(parent).attr("data-index");
						var id = angular.element(parent).attr("data-id");
						$scope.data.list[index].state = "read";
						//$log.log("提交的数据$scope.data.list[index]" , "\n\n" , $scope.data.list[index]);
						
						
						//$scope.data.list[index] ,
						
						$scope.method.getDetail(parent);
						$http({
							method : "get" ,
							//contentType : "application/json,charset=utf-8" ,
							//data : { id : $scope.data.list[index].id , state : "read" } ,
							url : $scope.attrs.host + "" + $scope.data.list[index].id + "/" + "read"
						}).success(function(d){
							//$log.log("updateState + ",d)
							
						}).error(function(e){
							//$log.log("updateState + ",e)
						});
						
					} ,
		getCount : function () {
					$http({
						method : "get" ,
						url : $scope.attrs.host + "getNewsCnt" ,
					}).success(function ( d ) {
						$scope.attrs.color = d.count > 0 ? "red" : $scope.attrs.color;
					}).error(function (e) {
						//$log.log(e)
					});
				} ,
		getList : function () {
					$http({
						method : "get" ,
						url : $scope.attrs.host + "getNewsList"
					}).success(function ( d ) {
						$scope.data.list = d.data;
					}).error(function ( e ) {
						$log.log(e)
					});
				} ,
		getMoreList : function () {

					$http({
						method : "post" ,
						data : { maxResults : 10  , firstResult : $scope.data.list.length - 1 } , 
						url : $scope.attrs.host + "getMoreNewsList"
					}).success(function (d) {
						for(var i = 0; i < d.data.length; i ++) {
							$scope.data.list.push(d.data[i]);
						}
					}).error(function(e){
						$log.log(e)
					});
				} ,
		getDetail : function ( elem ) {
					$http({
						method : "get" ,
						url : $scope.attrs.host + ""+ angular.element(elem).attr("data-id") +"/detail"
					}).success(function(d){
						$scope.data.detial = d;
						$scope.data.detial.publishTime = new Date($scope.data.detial.publishTime);
					}).error(function(e){
						$log.log(e);
					});
				}
		
	}
	
	//http://172.16.8.138:8280/services/ciic_api_proxy/BulletinMgmt/bulletin/updateStates
		$scope.method.getCount();
		$interval(function () {
			$scope.method.getCount();
		}, 1000*60*5);
		
}]);
