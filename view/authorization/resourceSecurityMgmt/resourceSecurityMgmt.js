Array.prototype.uniqueArray = function() {
    var temp = {};
    for (var i = 0; i < this.length; i++) {
        if (temp[this[i].id] >= 0) {
            this.splice(i, 1);
            i--;
        } else {
            temp[this[i].id] = i;
        }
    }
}
angular.module('appModule')
    .controller("resourceSecurityMgmtCtrl", ['$scope', '$state', 'authorizationService', 'authorizationUrl', 'cloneservice', function($scope, $state, authorizationService, authorizationUrl, cloneservice) {
        $scope.$emit("CHANGE_STATE_EVENT", 'resourceSecurityMgmt');

        $scope.securityConf = {
            clickSelect: true,
            multiClick: false,
            isOpen: true,
            isDrag: true,
            label: "displayName",
            clearStatus: "close"
        };
        $scope.clickSecurity = function(item) {
            var url = authorizationUrl.searchRolesByOptName + '?appName='+$scope.clickApp.name+'&optName='+item.name;
            authorizationService.serviceGet(url).then(function(res) {
                $scope.roleList = res;
            }, function(err) {
                $.alert("服务器请求失败");
            })
        }
        $scope.openOrgTree = function($event) {
            $($event.currentTarget).addClass("active").siblings().removeClass("active");
            $scope.securityConf.openTree();
        }
        $scope.closeOrgTree = function($event) {
            $($event.currentTarget).addClass("active").siblings().removeClass("active");
            $scope.securityConf.closeTree();
        }
        authorizationService.serviceGet(authorizationUrl.getAllApps).then(function(res) {
            $scope.apps = res;
            $scope.carouse.init();
            $scope.appCurrent=0;
            var url = authorizationUrl.getRolesPrivileges + "?roleName=" + 'admin' + "&appName=" + $scope.apps[0].name;
            $scope.clickApp=$scope.apps[0];
            //$scope.securityConf.rootNodeId=$scope.apps[0].id;
            authorizationService.serviceGet(url).then(function(res) {
                $scope.securityData = res.RBSimpleRuleDTOs;
            }, function(err) {
                $.alert("服务器请求失败");
            })
        }, function(err) {
            $.alert("服务器请求失败");
        })
        $scope.selectedApp=function(item,i){
            $scope.appCurrent=i;
            //$scope.securityConf.rootNodeId=item.id;
            $scope.clickApp=item;
            var url = authorizationUrl.getRolesPrivileges + "?roleName=" + 'admin' + "&appName=" + item.name;
            authorizationService.serviceGet(url).then(function(res) {
                $scope.securityData = res.RBSimpleRuleDTOs;
            }, function(err) {
                $.alert("服务器请求失败");
            })
        }
    }])
    //路由配置
    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home.authorization.resourceSecurityMgmt', {
                    url: '/resourceSecurityMgmt',
                    views: {
                        'authorization': {
                            templateUrl: './view/authorization/resourceSecurityMgmt/resourceSecurityMgmt.html',
                            controller: 'resourceSecurityMgmtCtrl'
                        }
                    }
                });
        }
    ] );

