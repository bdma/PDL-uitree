/**
 * Created by lica on 7/14/2016.
 */
angular.module('appModule')
    .controller("authorizationCtrl", ['$scope', '$state', function ($scope, $state) {
        $scope.authCategory = [
            {
                name: 'userMgmt',
                title: '用户管理',
                imgSrc: './asset/image/quanxian_left_tab_4.fw.png',
                imgSrcPressed: './asset/image/quanxian_left_tab_4_ov.fw.png',
                url: 'home.authorization.userMgmt'
            },
            {
                name: 'roleMgmt',
                title: '角色管理',
                imgSrc: './asset/image/icon02-02.png',
                imgSrcPressed: './asset/image/icon02-01.png',
                url: 'home.authorization.roleMgmt'
            },
            {
                name: 'organizationMgmt',
                title: '组织结构管理',
                imgSrc: './asset/image/quanxian_left_tab_6.fw.png',
                imgSrcPressed: './asset/image/quanxian_left_tab_6_ov.fw.png',
                url: 'home.authorization.organizationMgmt'
            },
            //{
            //    name: 'resourceMgmt',
            //    title: '资源管理',
            //    imgSrc: './asset/image/icon03-02.png',
            //    imgSrcPressed: './asset/image/icon03-01.png',
            //    url: 'home.authorization.resourceMgmt'
            //},
            {
                name: 'resourceSecurityMgmt',
                title: '资源与权限管理',
                imgSrc: './asset/image/icon03-02.png',
                imgSrcPressed: './asset/image/icon03-01.png',
                url: 'home.authorization.resourceSecurityMgmt'
            }
        ];

        $scope.$on("CHANGE_STATE_EVENT", function (event, name) {
            $scope.selectedItemName = name;

        })

        $scope.onClick = function (item) {
            $state.go(item.url);
        }
    }])
    //路由配置
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home.authorization', {
                    url: '/authorization',
                    abstract: true,
                    views: {
                        'homeMain': {
                            templateUrl: './view/authorization/authorization.html',
                            controller: 'authorizationCtrl'
                        }
                    }
                });
        }]);
