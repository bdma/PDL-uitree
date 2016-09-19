angular.module('appModule')
    .controller('home.entryCtrl', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {
        $scope.goProjectList = function() {
            // $state.go('home.projectlist');
            location.href = "../../af/salesmgmt/#/home/projectlist"
        }
        $scope.goCustomerList = function() {
            // $state.go('home.customerlist')
            location.href = "../../af/salesmgmt/#/home/customerlist"
        }
        $scope.goProductionMngList = function() {
            // $state.go('home.prodKernelList');
            location.href = "../../af/salesmgmt/#/home/prodKernelList"
        };
        $scope.goRegulationList = function() {
            // $state.go('home.regmain.regList');
            location.href = "../../af/salesmgmt/#/home/regmain/reglist"
        };
        $scope.goProductionList = function() {
            // $state.go('home.prodmain.prodList');
            location.href = "../../af/salesmgmt/#/home/prodmain/prodlist"
        };


    }])
    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider.state('home.entry', {
                url: '/entry',
                views: {
                    'homeMain': {
                        templateUrl: './view/home/entry.html',
                        controller: 'home.entryCtrl'
                    }
                }
            });
        }
    ]);
