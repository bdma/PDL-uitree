// JavaScript Document
angular.module("appModule")
	.directive("dropDown",function () {
		return {
			restrict : "E" ,
			replace : true ,
			templateUrl : "./view/home/drop_menu.html" ,
			controller : ["$scope","$state",function ($scope,$state) {
				$scope.gorbac = function() {
					$state.go("home.authorization.roleBasedAccessCtrl");
					// location.href = "http://172.16.8.179/g1/app/common/orgmgmt/templates/organization/user-manager.html"
				};
				$scope.goNewsList = function() {
					location.href = "../../common/infopublish-fe/src/app/index.html#/home/newslist";
				};
				$scope.goServiceListConfig = function(){
					// $state.go("home.sysconfig.serviceListConfig");
					location.href = "../../common/infopublish-fe/src/app/index.html#/home/sysconfig/serviceListConfig"
				};
			}]
		}
	});