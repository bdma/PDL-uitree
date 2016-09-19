/**
 * Created by lica on 7/20/2016.
 */
angular.module('appModule')
    .controller('userMgmt.detail', ['$scope', '$state', 'authorizationService', 'authorizationUrl', function ($scope, $state, authorizationService, authorizationUrl) {
        $scope.$emit("CHANGE_STATE_EVENT", 'userMgmt');
        $scope.user = {};
        $scope.selectedPostsMap = new Map();
        $scope.selectedRolesMap = new Map();

        authorizationService.serviceGet(authorizationUrl.getUser + '?userName=' + $state.params.userName).then(function (res) {
            $scope.user = res;
            for (var i = 0; i < $scope.user.organizations.length; i++) {
                $scope.selectedPostsMap.put($scope.user.organizations[i].uuid, $scope.user.organizations[i].name);
            }
            for (var i = 0; i < $scope.user.roles.length; i++) {
                $scope.selectedRolesMap.put($scope.user.roles[i].roleId, $scope.user.roles[i].roleName);
            }
        }, function (error) {
            $.alert("服务器请求失败");
        })

        $scope.goEdit = function () {
            $state.go('home.authorization.userMgmtEdit', {userName: $state.params.userName});
        }

        $scope.disable = function () {
            $.confirm("确认注销该用户吗？", function () {
                $scope.user.accountLock = true;
                authorizationService.servicePost(authorizationUrl.updateUserProfile, $scope.user).then(function (res) {
                    $state.go('home.authorization.userMgmt', {userName: $state.params.userName});
                    $.alert("注销成功");
                }, function (err) {
                    $.alert("服务器请求失败");
                })
            }, function () {

            })
        }

        $scope.delete = function () {
            authorizationService.serviceDelete(authorizationUrl.deleteUser + '?userName=' + $state.params.userName).then(function (res) {
                $state.go('home.authorization.userMgmt');
                $.alert("删除成功");
            }), function (error) {
                $.alert("服务器请求失败");
            }
        }
    }])
    .filter('arraytostring', function () {
        return function (array, param) {
            var str = '';
            if (array != undefined)
                for (var i = 0; i < array.length; i++) {
                    if (param)
                        str += array[i][param];
                    else
                        str += array[i];
                    if (i != array.length - 1)
                        str += ', ';
                }
            return str;
        }
    })
    //路由配置
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home.authorization.userMgmtDetail', {
                    url: '/detail?userName',
                    views: {
                        'authorization': {
                            templateUrl: './view/authorization/userMgmt/detail.html',
                            controller: 'userMgmt.detail'
                        }
                    }
                });
        }]);