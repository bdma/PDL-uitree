/**
 *  主文件
 *
 * Description
 */
angular.module('appModule', [])
    .controller("roleMgmt", ['$scope', function($scope) {
        //初始化
            $scope.appRoleData = [{
                id: 1,
                displayName: "主页",
                name: "authority",
                urlName: "entry",
                resourceURI: "/g1/elements/af/salesmgmt/home/entry",
            }, {
                id: 2,
                displayName: "销售管理",
                name: "authority_salse",
                urlName: "projectlisttry",
                resourceURI: "/g1/elements/af/salesmgmt/home/projectlisttry",
            }, {
                id: 4,
                displayName: "项目管理",
                name: "authority_projectmgmt",
                urlName: "projectlist",
                resourceURI: "/g1/elements/af/salesmgmt/home/accountmain/projectlist",
            }, {
                id: 5,
                displayName: "项目详情",
                name: "authority_projectdetail",
                urlName: "projectdetail",
                resourceURI: "/g1/elements/af/salesmgmt/home/accountmain/projectdetail",
            }, {
                id: 6,
                displayName: "管理方管理",
                name: "authority_accountmain",
                urlName: "detail",
                resourceURI: "/g1/elements/af/salesmgmt/home/accountmain/detail",
            }, {
                id: 7,
                displayName: "客户详情",
                name: "authority_legalEntityDetail",
                urlName: "legalEntityDetail",
                resourceURI: "/g1/elements/af/salesmgmt/home/accountmain/legalEntityDetail",
            }, {
                id: 8,
                displayName: "客户管理",
                name: "authority_legalEntity",
                urlName: "legalEntity",
                resourceURI: "/g1/elements/af/salesmgmt/home/accountmain/legalEntity",
            }, {
                id: 9,
                displayName: "客户沟通管理",
                name: "authority_cmctlist",
                urlName: "cmctlist",
                resourceURI: "/g1/elements/af/salesmgmt/home/accountmain/cmctlist",
            }, {
                id: 10,
                displayName: "规则仓库",
                name: "authority_reglist",
                urlName: "reglist",
                resourceURI: "/g1/elements/af/salesmgmt/home/regmain/reglist",
            }, {
                id: 11,
                displayName: "规则明细",
                name: "authority_regdetail",
                urlName: "regdetail",
                resourceURI: "/g1/elements/af/salesmgmt/home/regmain/regdetail",
            }, {
                id: 12,
                displayName: "产品管理",
                name: "authority_prodKernelList",
                urlName: "prodKernelList",
                resourceURI: "/g1/elements/af/salesmgmt/home/prodKernelList",
            }, {
                id: 13,
                displayName: "产品明细",
                name: "authority_prodkerneldetail",
                urlName: "prodkerneldetail",
                resourceURI: "/g1/elements/af/salesmgmt/home/prodkerneldetail",
            }, {
                id: 14,
                displayName: "单项产品",
                name: "authority_prodsinglelist",
                urlName: "prodsinglelist",
                resourceURI: "/g1/elements/af/salesmgmt/home/prodsinglelist",
            }, {
                id: 15,
                displayName: "单项产品明细",
                name: "authority_prodSingledetail",
                urlName: "prodSingledetail",
                resourceURI: "/g1/elements/af/salesmgmt/home/prodSingledetail",
            }, {
                id: 16,
                displayName: "套餐管理",
                name: "authority_prodPackageList",
                urlName: "prodPackageList",
                resourceURI: "/g1/elements/af/salesmgmt/home/prodPackageList",
            }, {
                id: 17,
                displayName: "套餐明细",
                name: "authority_prodPackageDetail",
                urlName: "prodPackageDetail",
                resourceURI: "/g1/elements/af/salesmgmt/home/prodPackageDetail",
            }];
            

       
    }])
    
