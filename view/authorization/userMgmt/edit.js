/**
 * Created by lica on 7/20/2016.
 */
angular.module('appModule')
    .controller('userMgmt.edit', ['$scope', '$state', '$timeout', '$element', 'authorizationService', 'authorizationUrl', 'cloneservice', function ($scope, $state, $timeout, $element, authorizationService, authorizationUrl, cloneservice) {
        $scope.$emit("CHANGE_STATE_EVENT", 'userMgmt');
        $scope.roleSelected = [];
        $scope.roleSelectedStr = '';
        $scope.selectedRolesMap = new Map();
        $scope.selectedPostsMap = new Map();
        $scope.selectedDepartMap = new Map();
        $scope.uuidPidMap = new Map();
        $scope.idNameMap = new Map();
        $scope.idUuidMap = new Map();
        $scope.userInfo = {};
        $scope.popupShow = false;
        $scope.popupType = '';
        $scope.scrollHeight = 0;

        authorizationService.serviceGet(authorizationUrl.getUser + '?userName=' + $state.params.userName).then(function (res) {
            console.log('res', res);
            $scope.userInfo = res;
            $scope.userInfo.roleNames = [];
            $scope.allRolesMap = new Map();
            //var array = new Array();
            //array.push($scope.userInfo.departmentId);
            //$scope.depart = array;
            if ($scope.userInfo.organizations) {
                for (var i = 0; i < $scope.userInfo.organizations.length; i++) {
                    $scope.selectedPostsMap.put($scope.userInfo.organizations[i].uuid, $scope.userInfo.organizations[i].name);
                }
                $scope.selectedPostsMapCopy = $scope.selectedPostsMap.clone();
            }
            if ($scope.userInfo.department) {
                $scope.selectedDepartMap.put($scope.userInfo.department.uuid, $scope.userInfo.department.name);
                $scope.selectedDepartMapCopy = $scope.selectedDepartMap.clone();
            }
            authorizationService.serviceGet(authorizationUrl.getOrgTree).then(function (res) {
                $scope.orgData = res.itemList;
                $scope.orgData1 = cloneservice.clonearr(res.itemList);
                $scope.orgData2 = cloneservice.clonearr(res.itemList);
                for (var i = 0; i < $scope.orgData.length; i++) {
                    $scope.uuidPidMap.put($scope.orgData[i].uuid, $scope.orgData[i].pId);
                    $scope.idNameMap.put($scope.orgData[i].id, $scope.orgData[i].name);
                    $scope.idUuidMap.put($scope.orgData[i].id, $scope.orgData[i].uuid);
                }
                console.log('$scope.uuidPidMap', $scope.uuidPidMap);
                console.log('$scope.idNameMap', $scope.idNameMap);
            }, function (err) {
                $.alert("服务器请求失败");
            })

            for (var i = 0; i < $scope.userInfo.roles.length; i++)
                $scope.selectedRolesMap.put($scope.userInfo.roles[i].roleId, $scope.userInfo.roles[i].roleName);
            $scope.selectedRolesMapCopy = $scope.selectedRolesMap.clone();
            delete $scope.userInfo.roles;
        }, function (error) {
            $.alert("服务器请求失败");
        })

        $scope.$watch(function () {
            return $scope.selectedRolesMap;
        }, function (newVal, oldVal) {
            $scope.selectedRolesMapCopy = $scope.selectedRolesMap.clone();
            $scope.userInfo.roleNames = newVal.keySet();
        }, true);

        $scope.$watch(function () {
            return $scope.selectedDepartMap;
        }, function (newVal, oldVal) {
            $scope.selectedDepartMapCopy = $scope.selectedDepartMap.clone();
            $scope.userInfo.departmentId = newVal.keySet()[0];
            $scope.userInfo.department = {uuid: newVal.keySet()[0], name: newVal.values()[0]};
        }, true);

        $scope.$watch(function () {
            return $scope.selectedPostsMap;
        }, function (newVal, oldVal) {
            $scope.selectedPostsMapCopy = $scope.selectedPostsMap.clone();
            var entrySet = newVal.entrySet();
            if ($scope.userInfo.organizations) {
                $scope.userInfo.organizations.splice(0);
            }
            for (var i = 0; i < entrySet.length; i++) {
                $scope.userInfo.organizations.push({
                    uuid: entrySet[i].getKey(),
                    name: entrySet[i].getValue()
                });
            }
            //岗位
            //for (var uuid in newVal.container) {
            //    if (uuid == 'extend') {
            //        continue;
            //    }
            //    var pId = $scope.uuidPidMap.get(uuid);
            //    if (!$scope.userInfo.department) {
            //        $scope.userInfo.department = {uuid: '', name: ''};
            //    }
            //    var uuid = $scope.idUuidMap.get(pId) == undefined ? $scope.userInfo.department.uuid : $scope.idUuidMap.get(pId);
            //    var name = $scope.idNameMap.get(pId) == undefined ? $scope.userInfo.department.name : $scope.idNameMap.get(pId);
            //    $scope.userInfo.department.uuid = uuid;
            //    $scope.userInfo.department.name = name;
            //    $scope.userInfo.departmentId = uuid;
            //    break;
            //}
        }, true);

        authorizationService.serviceGet(authorizationUrl.getUserRoles).then(function (res) {
            $scope.roles = res;
        }, function (err) {
            $.alert("服务器请求失败");
        })

        $scope.popRoleDialog = function () {
            $scope.popupType = 'role';
            $scope.popupShow = true;
            $scope.popupTitle = '角 色';
        }

        $scope.popPostDialog = function () {
            $scope.popupType = 'org';
            $scope.popupShow = true;
            $scope.popupTitle = '组 织';
        }

        $scope.popDepartDialog = function () {
            $scope.popupType = 'depart';
            $scope.popupShow = true;
            $scope.popupTitle = '部 门';
        }

        $scope.save = function () {
            if ($scope.checkInput()) {
                $.alert($scope.checkInput());
                return;
            }
            authorizationService.servicePost(authorizationUrl.updateUserProfile, $scope.userInfo).then(function (res) {
                $state.go('home.authorization.userMgmtDetail', {userName: $state.params.userName});
                $.alert("保存成功");
            }, function (err) {
                $.alert("服务器请求失败");
            })
        }

        $scope.cancel = function () {
            $state.go('home.authorization.userMgmtDetail', {userName: $state.params.userName});
        }

        $scope.onClose = function () {
            $scope.popupShow = false;
        }

        $scope.checkInput = function () {
            if (isEmpty($scope.userInfo.userName))
                return '请输入用户名'
            if ($scope.userInfo.userName.length < 5)
                return '用户名至少5位'
            if ($scope.userInfo.userName.length > 20)
                return '用户名至多20位'
            if (isEmpty($scope.userInfo.displayName))
                return '请输入姓名'
            if ($scope.userInfo.displayName.length > 30)
                return '姓名至多30位'
            if (isEmpty($scope.userInfo.email))
                return '请输入邮箱'
            if (!checkEmailAddress($scope.userInfo.email))
                return '请输入正确的邮箱格式';
            return false;
        }

        var checkEmailAddress = function (emailAddress) {
            var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(emailAddress);
        }

        var isEmpty = function (obj) {
            if (obj == undefined || obj == '')
                return true;
            else
                return false;
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
                .state('home.authorization.userMgmtEdit', {
                    url: '/edit?userName',
                    views: {
                        'authorization': {
                            templateUrl: './view/authorization/userMgmt/edit.html',
                            controller: 'userMgmt.edit'
                        }
                    }
                });
        }]);