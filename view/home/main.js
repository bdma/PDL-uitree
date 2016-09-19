angular.module('appModule')
//路由配置
    .controller('homeCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
        $scope.isCompany = true;
        $scope.switch = function () {
            $scope.isCompany = !$scope.isCompany;
        };
        $scope.keypress = function (event) {
            if (event.keyCode == 13) {
                $state.go('home.accountList',{kw:$scope.searchContent});
            }
        };
        $scope.sendKw = function () {
            $state.go('home.accountList',{kw:$scope.searchContent});
        }
    }])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('home', {
                    url: '/home',
                    abstract:true,
                    views: {
                        'mainframe': {
                            templateUrl: './view/home/main.html',
                            controller: 'homeCtrl'
                        }
                    }
                });
        }]);

