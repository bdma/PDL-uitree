/**
 *  主文件
 *
 * Description
 */
var app = angular.module('app', []);
app.controller("roleMgmt", ["$scope",
    function($scope) {
        $scope.appsConf = {
            clickSelect: false,
            multiple: true,
            multipleType: 'check',
            isOpen: true,
            clearStatus: "close",
        };

        $scope.appRoleData = [{
            id: 1,
            name: "主页",
        }, {
            id: 2,
            pId: 1,
            name: "销售管理",
        }, {
            id: 4,
            pId: 1,
            name: "项目管理",
        }, {
            id: 5,
            pId: 1,
            name: "项目详情",
        }, {
            id: 6,
            name: "管理方管理",
        }, {
            id: 7,
            pId: 6,
            name: "客户详情",
        }, {
            id: 8,
            pId: 6,
            name: "客户管理",
        }, {
            id: 9,
            pId: 6,
            name: "客户沟通管理",
        }, {
            id: 10,
            pId: 6,
            name: "规则仓库",
        }, {
            id: 11,
            pId: 6,
            name: "规则明细",
        }, {
            id: 12,
            pId: 11,
            name: "产品管理",
        }, {
            id: 13,
            pId: 11,
            name: "产品明细",
        }, {
            id: 14,
            pId: 11,
            name: "单项产品",
        }, {
            id: 15,
            pId: 11,
            name: "单项产品明细",
        }, {
            id: 16,
            pId: 11,
            name: "套餐管理",
        }, {
            id: 17,
            pId: 11,
            name: "套餐明细",
        }];

    }
]);
