angular.module('appModule')
    .controller("resourceMgmt", ['$scope', '$state', 'authorizationService', 'authorizationUrl', 'cloneservice', function($scope, $state, authorizationService, authorizationUrl, cloneservice) {
            $scope.$emit("CHANGE_STATE_EVENT", 'resourceMgmt');
            $scope.resourceConf = {
                multiple: false,
                multiClick: false,
                isOpen: false
            };
            $scope.resourceCarousel={};
            authorizationService.serviceGet(authorizationUrl.getResourceType).then(function(res) {
                $scope.resources = res;
                $scope.currentResourceId = $scope.resources[0].resourceTypeId;
                getresourceTree($scope.currentResourceId);
            }, function(err) {
                $.alert(err);
            });

            function getresourceTree(id) {
                var url = authorizationUrl.getBaseTreeForResource + "?resourceTypeId=" + id;
                authorizationService.serviceGet(url).then(function(res) {
                    $scope.resourceTreeData = cloneservice.clonearr(res.itemList);
                }, function(err) {
                    $.alert(err);
                });
            };
            $scope.findResourceTree = function(resource) {
                $scope.currentResourceId = resource.resourceTypeId;
                $scope.checkItems = [];
                $scope.itemList = [];
                getresourceTree($scope.currentResourceId);
            }
            $scope.clickResource = function(item) {
                if(!$scope.treeLength){
                    $scope.treeLength=$scope.resourceConf.getTreeLength()+1;
                }
                console.log(item);
                var url = authorizationUrl.getChoosableRes + "?resourceTypeId=" + $scope.currentResourceId;
                if (item.resource && item.resource.resourceTypeId) { url += "&parentResourceId=" + item.resource.resourceId; }
                if (item.resource && item.resource.resourceTypeId) { url += "&parentResourceTypeId=" + item.resource.resourceTypeId; }
                url += "&parentDn=" + item.dn;
                $scope.clickitem = item;
                authorizationService.serviceGet(url).then(function(res) {
                    $scope.checkItems = res;
                    var obj = {};
                    for (var i = 0; i < $scope.checkItems.length; i++) {
                        obj[$scope.checkItems[i].resourceId] = i;
                    }
                    for (var j = 0; j < item.children.length; j++) {
                        if (item.children[j].resource && obj[item.children[j].resource.resourceId] >= 0) {
                            $scope.checkItems[obj[item.children[j].resource.resourceId]].checked = true;
                            if (item.children[j].resource.isFixed) {
                                $scope.checkItems[obj[item.children[j].resource.resourceId]].isFixed = true;
                            }
                        }
                    }
                }, function(err) {
                    $.alert(err);
                })
            }
            $scope.itemListDeleteItem = function(array, item) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].resource&&item.resource.resourceId == array[i].resource.resourceId) {
                        array.splice(i, 1);
                        break;
                    }
                }
            }
            $scope.itemListDeleteParent = function(array, item) {
                for (var i = 0; i < array.length; i++) {
                    if (item.id == array[i].id) {
                        array.splice(i, 1);
                        break;
                    }
                }
            }
            $scope.itemListAddParent=function(array,item){
                var t=true;
                for (var i = 0; i < array.length; i++) {
                    if (item.id == array[i].id) {
                        t=false;
                    }
                }
                if(t){array.push(item);}
            }
            $scope.checkThisItem = function(item) {
                console.profile('性能分析器一');
                var parent = cloneservice.clone($scope.clickitem);

                if (item.checked) {
                    if (!item.isFixed) {
                        var obj,index;
                        for (var i = 0; i < $scope.clickitem.children.length; i++) {
                            if ($scope.clickitem.children[i].resource&&item.resourceId == $scope.clickitem.children[i].resource.resourceId) {
                                obj = $scope.clickitem.children[i];
                                index=i;
                            }
                        };
                        item.checked = false;
                        $scope.clickitem.children.splice(index,1);
                        if (obj.opt == undefined || obj.opt == null) {
                            obj.opt = "D";
                            $scope.itemList.push(obj);
                            $scope.itemListAddParent($scope.itemList,parent);
                            delete $scope.itemList[$scope.itemList.length - 1].children;
                        } else {
                            $scope.itemListDeleteItem($scope.itemList, obj);
                            var t = true;
                            for (var j = 0; j < parent.children.length;j++) {
                                if (parent.children[j].opt) { t = false }
                            }
                            if (t) { $scope.itemListDeleteParent($scope.itemList, parent); }
                        }
                    }
                } else {
                    item.checked = true;
                    var t=true,obj,index;
                    for(var i=0;i<$scope.itemList.length;i++){
                        if($scope.itemList[i].resource&&$scope.itemList[i].resource.resourceId==item.resourceId){
                            obj=$scope.itemList[i];
                            index=i;
                            t=false;
                        }
                    }
                    if(t){
                        obj = {
                            display: false,
                            id: $scope.treeLength++,
                            name: item.resourceName,
                            opt: "A",
                            pId: $scope.clickitem.id,
                            resource: {
                                resourceId: item.resourceId,
                                resourceTypeId: item.resourceTypeId,
                                resourceName: item.resourceName,
                                resourceTypeName: item.resourceTypeName
                            }
                        };
                        $scope.clickitem.children.push(obj);
                        $scope.itemList.push(obj);
                        $scope.itemListAddParent($scope.itemList,parent);
                    }else{
                        $scope.clickitem.children.push(obj);
                        $scope.itemList.splice(index,i);
                        $scope.itemListDeleteParent($scope.itemList, parent);
                    }
                
            }
            console.profileEnd();
        }
        $scope.submitItemList=function(){
            console.log($scope.itemList,'$scope.itemList');
            authorizationService.servicePost(authorizationUrl.updOrgTree,{itemList:$scope.itemList}).then(function(res){
                $.alert("保存成功!");
                getresourceTree($scope.currentResourceId);
            },function(err){
                $.alert(err);
            })
        }
    }])
//路由配置
.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home.authorization.resourceMgmt', {
                url: '/resourceMgmt',
                views: {
                    'authorization': {
                        templateUrl: './view/authorization/resourceMgmt/resourceMgmt.html',
                        controller: 'resourceMgmt'
                    }
                }
            });
    }
]);

