angular.module('appModule')
    .controller("userMgmt", ['$scope', '$state', 'authorizationService', 'authorizationUrl', 'cloneservice', function ($scope, $state, authorizationService, authorizationUrl, cloneservice) {
        $scope.$emit("CHANGE_STATE_EVENT", 'userMgmt');
        $scope.popupShow = false;

        $scope.userMgmtColumns = [
            {name: '用户名', type: ColumnTypeEnum.string, width: '15%', filterDatasource: []},
            {name: '姓名', type: ColumnTypeEnum.string, width: '15%', filterDatasource: []},
            {name: '角色', type: ColumnTypeEnum.string, width: '25%', filterDatasource: []},
            {name: '岗位', type: ColumnTypeEnum.string, width: '25%', filterDatasource: []},
            {name: '部门', type: ColumnTypeEnum.string, width: '12%', filterDatasource: []},
            {name: '权限', type: ColumnTypeEnum.operation, width: '8%', filterDatasource: []},
        ];

        $scope.filterParam = {
            //offset: 0,
            //size: 15
        };

        $scope.hasMore = false;
        $scope.pageCursor = 15;
        $scope.pageCursorStep = 15;

        $scope.users = [];

        $scope.addUser = function () {
            $state.go('home.authorization.userMgmtAdd');
        }

        $scope.goDetail = function (userName) {
            $state.go('home.authorization.userMgmtDetail', {userName: userName});
        }

        $scope.onSearch = function (conditions, columnIndex) {
            switch (columnIndex) {
                case 0:
                    if (conditions == undefined || conditions[0] == '')
                        delete $scope.filterParam.userName;
                    else
                        $scope.filterParam.userName = conditions[0];
                    break;
                case 1:
                    if (conditions == undefined || conditions[0] == '')
                        delete $scope.filterParam.displayName;
                    else
                        $scope.filterParam.displayName = conditions[0];
                    break;
                case 2:
                    if (conditions == undefined || conditions[0] == '')
                        delete $scope.filterParam.role;
                    else
                        $scope.filterParam.role = conditions[0];
                    break;
                case 3:
                    if (conditions == undefined || conditions[0] == '')
                        delete $scope.filterParam.organization;
                    else
                        $scope.filterParam.organization = conditions[0];
                    break;
                case 4:
                    if (conditions == undefined || conditions[0] == '')
                        delete $scope.filterParam.department;
                    else
                        $scope.filterParam.department = conditions[0];
                    break;
            }
            $scope.pageCursor = 15;

            authorizationService.serviceGetLite(authorizationUrl.getEntireUsers + '?' + $.param($scope.filterParam, true)).then(function (res) {
                $scope.users = cloneservice.clone(res);
                for (var i = 0; i < $scope.users.length; i++) {
                    if ($scope.users[i].accountLock == 'true') {
                        $scope.users.splice(i, 1);
                        i--;
                    }
                }
                $scope.displayUser = cloneservice.clone($scope.users).splice(0, $scope.pageCursor);
                if ($scope.pageCursor >= $scope.users.length) {
                    $scope.hasMore = false;
                } else {
                    $scope.hasMore = true;
                }
            }), function (error) {
                $.alert("服务器请求失败");
            }
        }

        $scope.loadMoreUser = function () {
            $scope.pageCursor = $scope.pageCursor + $scope.pageCursorStep
            $scope.displayUser = cloneservice.clone($scope.users).splice(0, $scope.pageCursor);
            if ($scope.pageCursor >= $scope.users.length) {
                $scope.hasMore = false;
            }
            //var total = 0;
            //authorizationService.serviceGet(authorizationUrl.getEntireUsersTotal).then(function (res) {
            //    total = res;
            //}), function (error) {
            //    $.alert("服务器请求失败");
            //}

            //TODO 分页接口请求

            //if ($scope.filterParam.offset + $scope.filterParam.size >= total)
            //    $scope.hasMore = false;
        }

        $scope.showPermissionSet = function (user) {
            if (user.roles.length == 0) {
                $.alert("该用户无权限");
                return;
            }
            $scope.currentUser = user;
            $scope.popupShow = true;
            $scope.popupType = "set";
            $scope.popupTitle = "权限集";
        }

        $scope.showPermissionList = function (user) {
            if (user.roles.length == 0) {
                $.alert("该用户无权限");
                return;
            }
            $scope.currentUser = user;
            $scope.popupShow = true;
            $scope.popupType = "list"
            $scope.popupTitle = "权 限";
        }

        authorizationService.serviceGet(authorizationUrl.getEntireUsers).then(function (res) {
            $scope.users = cloneservice.clone(res);
            for (var i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].accountLock == 'true') {
                    $scope.users.splice(i, 1);
                    i--;
                }
            }
            $scope.displayUser = cloneservice.clone($scope.users).splice(0, $scope.pageCursor);
            if ($scope.displayUser.length < $scope.users.length) {
                $scope.hasMore = true;
            }
            $scope.validCount = $scope.users.length;
            //for (var i = 0; i < $scope.users.length; i++) {
            //    if (!$scope.users[i].accountLock || $scope.users[i].accountLock == false) {
            //        $scope.validCount++;
            //    }
            //}
        }, function (err) {
            $.alert("服务器请求失败");
        })
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
                .state('home.authorization.userMgmt', {
                    url: '/userMgmt',
                    views: {
                        'authorization': {
                            templateUrl: './view/authorization/userMgmt/userMgmt.html',
                            controller: 'userMgmt'
                        }
                    }
                });
        }]);

