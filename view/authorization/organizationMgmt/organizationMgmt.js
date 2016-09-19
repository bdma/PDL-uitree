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
    .controller("organizationMgmt", ['$scope', '$state', 'authorizationService', 'authorizationUrl', 'cloneservice', function($scope, $state, authorizationService, authorizationUrl, cloneservice) {
        $scope.$emit("CHANGE_STATE_EVENT", 'organizationMgmt');
        $scope.current = 1;
        $scope.tempnode = {};
        $scope.carouse = {};
        $scope.queryForm = {};
        $scope.updateOrgDialog = {
            btnOpen: true,
            btnsure: function() {
                var array = [];
                if ($scope.tempnode.set == 'add') {
                    $scope.updateNode.$$isOpen = true;
                    var obj = {};
                    obj.id = $scope.treelength.num + 1;
                    obj.pId = $scope.updateNode.id;
                    obj.name = $scope.tempnode.name;
                    obj.children = [];
                    obj.opt = "A";
                    obj.$$parent = $scope.updateNode;
                    obj.$$clickSelect = true;
                    if (parseInt($scope.tempnode.type) == 2) {
                        obj.position = {};
                        obj.position.name = obj.name;
                        obj.position.departmentUuid = $scope.updateNode.uuid;
                        obj.$$isFolder = false;
                    } else { obj.$$isFolder = true; }
                    $scope.updateNode.children.push(obj);
                    $scope.treelength.num++;
                    array.push($scope.updateNode);
                    array.push(obj);
                } else {
                    $scope.updateNode.name = $scope.tempnode.name;
                    $scope.updateNode.opt = "U";
                    if (parseInt($scope.tempnode.type) == 2) {
                        $scope.updateNode.position.name = $scope.tempnode.name;
                    }
                    array.push($scope.updateNode.$$parent);
                    array.push($scope.updateNode);
                }
                authorizationService.servicePost(authorizationUrl.updOrgTree, { itemList: array }).then(function(res) {
                    if(res.message&&res.message=='Duplicate'){
                        $.alert("保存失败，同级组织名称不能重复！");
                    }else{
                    $.alert("保存成功!");
                    }
                    $scope.updateOrgDialog.closeDialog();
                    $scope.$emit("DATAINIT_EVENT");
                }, function(err) {
                    $.alert("保存失败!");
                    $scope.updateOrgDialog.closeDialog();
                    $scope.$emit("DATAINIT_EVENT");
                })
            },
            btncancel: function() {
                $scope.updateOrgDialog.closeDialog('fadeBottom');
            }
        };
        $scope.addUserDialog = {
            btnOpen: true,
            btnsure: function() {
                var array = [];
                for (var i = 0; i < $scope.selectedUser.length; i++) {
                    var obj = { resourceId: $scope.selectedUser[i].userName, resourceName: $scope.selectedUser[i].displayName };
                    array.push(obj);
                }
                var url = authorizationUrl.resetResourceListFromOrg + "?resourceTypeId=resUser&parentUuid=" + $scope.selectNode.uuid;
                authorizationService.servicePost(url, array).then(function(res) {
                    $scope.addUserDialog.closeDialog('fadeBottom');
                    var url1 = authorizationUrl.getResourceListFromOrg + "?searchResourceTypeIds=['resUser']&parentUuid=" + $scope.selectNode.uuid;
                    authorizationService.serviceGet(url1).then(function(res) {
                        $scope.userList = res;
                    }, function(err) { $.alert("提交失败！"); })
                }, function(err) { $.alert("提交失败！"); })
            },
            btncancel: function() {
                $scope.addUserDialog.closeDialog('fadeBottom');
            }
        };
        $scope.seniorDialog = {
            btnOpen: true,
            btnsure: function() {
                if($scope.seniorList.length>0){
                var arrayData = [];
                var tempJuniorMainPosition = $scope.selectNode.juniorMainPosition ? $scope.selectNode.juniorMainPosition : false;
                $scope.selectNode.juniorMainPosition = {};
                $scope.selectNode.juniorMainPosition.uuid = $scope.tempSeniorObj.uuid;
                $scope.selectNode.juniorMainPosition.name = $scope.tempSeniorObj.name;
                $scope.selectNode.opt = "U";
                arrayData.push($scope.selectNode.$$parent);
                arrayData.push($scope.selectNode);
                authorizationService.servicePost(authorizationUrl.updOrgTree, { itemList: arrayData }).then(function(res) {
                    $scope.seniorDialog.closeDialog('fadeBottom');
                    delete $scope.selectNode.opt;
                    $scope.seniorObj = cloneservice.clone($scope.tempSeniorObj);
                }, function(err) {
                    delete $scope.selectNode.opt;
                    if (tempJuniorMainPosition) {
                        $scope.selectNode.juniorMainPosition = tempJuniorMainPosition;
                    } else {
                        delete $scope.selectNode.juniorMainPosition;
                    }
                    $.alert("保存失败!");
                })
            }else{
                $scope.seniorDialog.closeDialog('fadeBottom');
            }
            },
            btncancel: function() {
                $scope.selectedSeniorIndex = -1;
                $scope.seniorDialog.closeDialog("fadeTop");
            }
        };
        $scope.addRoleDialog = {
            btnOpen: true,
            btnsure: function() {
                var url = authorizationUrl.resetResourceListFromOrg + "?resourceTypeId=resRole&parentUuid=" + $scope.selectNode.uuid;
                authorizationService.servicePost(url, $scope.roleSelectData).then(function(res) {
                    $scope.addRoleDialog.closeDialog("fadeTop");
                    var url1 = authorizationUrl.getResourceListFromOrg + "?searchResourceTypeIds=['resRole']&parentUuid=" + $scope.selectNode.uuid;
                    authorizationService.serviceGet(url1).then(function(res) {
                        $scope.roleData = res;
                    }, function(err) { $.alert("获取角色列表失败！"); })
                }, function(err) { $.alert("提交失败！"); })
            },
            btncancel: function() {
                $scope.addRoleDialog.closeDialog("fadeTop");
            }
        };
        $scope.setSenior = function() {
            if($scope.selectNode){
            for (var i = 0; i < $scope.seniorList.length; i++) {
                if ($scope.selectNode.juniorMainPosition && $scope.selectNode.juniorMainPosition.uuid == $scope.seniorList[i].uuid) {
                    $scope.selectedSeniorIndex = i;
                    $scope.tempSeniorObj=$scope.seniorList[i];
                    break;
                }
            }
            $scope.seniorDialog.showDialog("fadeTop");
        }else{
            $.alert('请先点击选择组织！');
        }
        };
        $scope.selectedSenior = function(item, i) {
            $scope.selectedSeniorIndex = i;
            $scope.tempSeniorObj = item;
        }
        $scope.addUser = function() {
            $scope.selectedUser = [];
            if ($scope.selectNode && $scope.selectNode.position) {
                for (var i = 0; i < $scope.userList.length; i++) {
                    var obj = {};
                    obj.userName = $scope.userList[i].resourceId;
                    obj.displayName = $scope.userList[i].resourceName;
                    $scope.selectedUser.push(obj);
                }
                $scope.queryForm.searchUserText = "";
                $scope.userAllList = [];
                $scope.addUserDialog.showDialog("fadeTop");
            } else {
                $.alert("请选择岗位");
            }
        };
        $scope.removeSelectedUser = function(item, $index) {
            $scope.selectedUser.splice($index, 1);
            item.$$active = false;
        }
        var timer;
        $scope.searchUserFn = function($event) {
            if ($scope.queryForm.searchUserText && $scope.queryForm.searchUserText != "" && $scope.queryForm.searchUserText != null) {
                var url = authorizationUrl.getEntireUsers + "?displayName=" + $scope.queryForm.searchUserText;
                authorizationService.serviceGet(url).then(function(res) {
                    $scope.userAllList = res;
                    var map = {};
                    for (var i = 0; i < $scope.userAllList.length; i++) {
                        map[$scope.userAllList[i].userName] = $scope.userAllList[i];
                    }
                    for (var j = 0; j < $scope.selectedUser.length; j++) {
                        if (map[$scope.selectedUser[j].userName]) {
                            $scope.selectedUser[j] = map[$scope.selectedUser[j].userName];
                            $scope.selectedUser[j].$$active = true;
                        }
                    }
                }, function(err) {})
            } else {
                $($event.currentTarget).siblings('span').stop().fadeIn(200);
                if (timer) { clearTimeout(timer); }
                timer = setTimeout(function() { $($event.currentTarget).siblings('span').stop().fadeOut(200); }, 1000);
            }
        }
        $scope.enterSearch = function($event) {
            if ($event.keyCode == 13) {
                $scope.searchUserFn($event);
            }
        }
        $scope.clickUserItem = function(item) {
            if (item.$$active) {
                item.$$active = false;
                for (var i = 0; i < $scope.selectedUser.length; i++) {
                    if ($scope.selectedUser[i].userName == item.userName) {
                        $scope.selectedUser.splice(i, 1);
                        break;
                    }
                }
            } else {
                item.$$active = true;
                $scope.selectedUser.push(item);
            }

        }
        $scope.showBox = function(i) { $scope.current = i; };
        $scope.orgConf = {
            clickSelect: true,
            multiClick: false,
            isOpen: true,
            isDrag: true,
            addChildNode: true,
            editNode: true,
            deleteNode: true,
            clearStatus: "close",
            createTreeCallback: function(item) {
                if (item.position) { item.$$isFolder = false;item.$$addChildNode=-1; } else { item.$$isFolder = true; }
            },
            addChildNodeFn: function(item, treelength) {
                $scope.tempnode = {};
                $scope.tempnode.set = 'add';
                $scope.updateNode = item;
                $scope.treelength = treelength;
                $scope.tempnode.type = '1';
                $scope.updateOrgDialog.showDialog('fadeTop');
            },
            editNodeFn: function(item) {
                $scope.tempnode.set = 'edit';
                $scope.updateNode = item;
                $scope.tempnode.name = $scope.updateNode.name;
                $scope.tempnode.type = $scope.updateNode.position ? '2' : '1';
                $scope.updateOrgDialog.showDialog('fadeTop');
            },
            deleteNodeFn: function(item) {
                $.confirm("是否删除当前组织？",function(){
                    var array = [];
                    item.opt = "D";
                    array.push(item.$$parent);
                    array.push(item);
                    authorizationService.servicePost(authorizationUrl.updOrgTree, { itemList: array }).then(function(res) {
                        $.alert("删除成功!");
                        $scope.updateOrgDialog.closeDialog();
                        $scope.$emit("DATAINIT_EVENT");
                    }, function(err) {
                        $.alert("删除失败!");
                        $scope.updateOrgDialog.closeDialog();
                        $scope.$emit("DATAINIT_EVENT");
                    })
                })
            },
            dragoverFn:function(event, uiTreeItem, dragItem){
                if(uiTreeItem.position){event.dataTransfer.dropEffect = "none";}
            },
            dropFn: function(event, uiTreeItem, dragItem) {
                uiTreeItem.children.push(dragItem);
                var parentList = dragItem.$$parent ? dragItem.$$parent.children : $scope.conf.getTreeData();
                for (var i = 0; i < parentList.length; i++) {
                    if (parentList[i].id == dragItem.id) {
                        parentList.splice(i, 1);
                        break;
                    }
                }
                var array = [];
                dragItem.$$parent = uiTreeItem;
                dragItem.pId = uiTreeItem.id;
                array.push(uiTreeItem);
                dragItem.opt = "U";
                array.push(dragItem);
                authorizationService.servicePost(authorizationUrl.updOrgTree, { itemList: array }).then(function(res) {
                    $.alert("保存成功!");
                    $scope.$emit("DATAINIT_EVENT");
                }, function(err) {
                    $.alert("保存失败!");
                    $scope.$emit("DATAINIT_EVENT");
                })
            }
        };
        $scope.clickOrg = function(item) {
            $scope.selectNode = item;
            console.log(item);
            if (item.position) {
                var url1 = authorizationUrl.getResourceListFromOrg + "?searchResourceTypeIds=['resUser']&parentUuid=" + item.uuid;
                var url2 = authorizationUrl.getResourceListFromOrg + "?searchResourceTypeIds=['resRole']&parentUuid=" + item.uuid;
                authorizationService.serviceGet(url1).then(function(res) {
                    $scope.userList = res;
                }, function(err) {});
                authorizationService.serviceGet(url2).then(function(res) {
                    $scope.roleData = res;
                }, function(err) {});
            } else {
                $scope.seniorList = [];
                for (var i = 0; i < item.children.length; i++) {
                    if (item.children[i].position) {
                        var obj = {};
                        obj.uuid = item.children[i].uuid;
                        obj.name = item.children[i].name;
                        $scope.seniorList.push(obj);
                    }
                }
            }
        }
        $scope.openOrgTree = function($event) {
            $($event.currentTarget).addClass("active").siblings().removeClass("active");
            $scope.orgConf.openTree();
        }
        $scope.closeOrgTree = function($event) {
            $($event.currentTarget).addClass("active").siblings().removeClass("active");
            $scope.orgConf.closeTree();
        }
        $scope.orgPowerConf = {
            clickSelect: false,
            multiClick: false,
            isOpen: false,
            deleteNode: true
        };

        function dataInit() {
            authorizationService.serviceGet(authorizationUrl.getOrgTree).then(function(res) {
                $scope.orgDatatemp = res.itemList;
                $scope.orgData = cloneservice.clonearr($scope.orgDatatemp);
                $scope.orgPowerData = cloneservice.clonearr($scope.orgDatatemp);
                $scope.selectNode=null;
            }, function(err) {

            })
        }
        dataInit();
        $scope.$on("DATAINIT_EVENT", function(event) {
            dataInit();
        });
        $scope.submitOrg = function() {
            $scope.treelist = [];
            var orgtree = [];
            orgtree = $scope.orgConf.getTreeData();
            $scope.treeByList($scope.treelist, orgtree);
            for (var i = 0; i < $scope.treelist.length; i++) {
                delete $scope.treelist[i].children;
            }
            var arrayData = $scope.updTreeData($scope.orgDatatemp, $scope.treelist);
            console.log(arrayData, 1);
            arrayData.uniqueArray();
            authorizationService.servicePost(authorizationUrl.updOrgTree, { itemList: arrayData }).then(function(res) {
                $scope.updateOrgDialog.closeDialog('fadeBottom');
                $scope.$broadcast("DATAINIT_EVENT");
            }, function(err) {
                $scope.updateOrgDialog.closeDialog('fadeBottom');
                $scope.$broadcast("DATAINIT_EVENT");
                $.alert("保存失败!");
            })
            console.log(arrayData, 2);
        };
        $scope.getParentNode = function(array, obj) {
            for (var i = 0; i < array.length; i++) {
                if (obj.pId == array[i].id) {
                    return array[i];
                }
            }
            return null;
        }
        $scope.updTreeData = function(initArray, updateArray) {
            var temp = {},
                array = [];
            for (var i = 0; i < initArray.length; i++) {
                temp[initArray[i].id] = initArray[i];
            }
            for (var j = 0; j < updateArray.length; j++) {
                if (temp[updateArray[j].id]) {
                    if (temp[updateArray[j].id].name != updateArray[j].name) {
                        delete temp[updateArray[j].id];
                        var obj;
                        if (updateArray[j].$$parent) {
                            obj = updateArray[j].$$parent;
                            array.push(obj);
                        }
                        array.push(updateArray[j]);
                        array[array.length - 1].opt = "U";
                        updateArray.splice(j, 1);
                        j--;
                    } else {
                        delete temp[updateArray[j].id];
                    }
                } else {
                    var obj;
                    if (updateArray[j].$$parent) {
                        obj = updateArray[j].$$parent;
                        array.push(obj);
                    }
                    array.push(updateArray[j]);
                    array[array.length - 1].opt = "A";
                    updateArray.splice(j, 1);
                    j--;
                }
            }
            for (var key in temp) {
                var obj;
                if (temp[key].$$parent) {
                    obj = temp[key].$$parent;
                    array.push(obj);
                }
                array.push(temp[key]);
                array[array.length - 1].opt = "D";
            }
            return array;
        };
        $scope.treeByList = function(array, tree) {
            for (var i = 0; i < tree.length; i++) {
                array.push(tree[i]);
                if (tree[i].children.length > 0) {
                    $scope.treeByList(array, tree[i].children);
                }
            }
        };
        $scope.showRbac = function(role, i) {
            role.current = i;
        }
        $scope.clickRole = function($event, item) {
            var tag = $($event.currentTarget).parent();
            if (tag.hasClass("active")) {
                tag.removeClass("active");
                tag.find('.org_role').slideUp(200);
            } else {
                authorizationService.serviceGet(authorizationUrl.getUIElements + "?roleName=" + item.roleId).then(function(res) {
                    tag.addClass("active").siblings().removeClass('active');
                    tag.find('.org_role').slideDown(200);
                    tag.siblings().find('.org_role').slideUp(200);
                    item.rbacData = res.RBSimpleRuleDTOs;
                    item.current = 0;
                    item.carouse.init();
                }, function(err) {

                })
            }
        };
        $scope.openRoleDialog = function() {
            $scope.roleAllData = [];
            $scope.roleSelectData = cloneservice.clonearr($scope.roleData);
            authorizationService.serviceGet(authorizationUrl.getPositionRoles).then(function(res) {
                $scope.roleAllData = res;
                var obj = {};
                for (var i = 0; i < $scope.roleAllData.length; i++) {
                    obj[$scope.roleAllData[i].roleId] = $scope.roleAllData[i];
                }
                for (var j = 0; j < $scope.roleSelectData.length; j++) {
                    if (obj[$scope.roleSelectData[j].resourceId]) {
                        obj[$scope.roleSelectData[j].resourceId].$$active = true;
                    }
                }
                $scope.addRoleDialog.showDialog('fadeTop');
            }, function(err) {});
        };
        $scope.clickRoleItem = function(item) {
            if (item.$$active) {
                item.$$active = false;
                for (var i = 0; i < $scope.roleSelectData.length; i++) {
                    if ($scope.roleSelectData[i].resourceId == item.roleId) {
                        $scope.roleSelectData.splice(i, 1);
                        break;
                    }
                }
            } else {
                item.$$active = true;
                $scope.roleSelectData.push({ resourceId: item.roleId, resourceName: item.roleName });
            }
        };
        $scope.removeSelectedRole=function(item,i){
            $scope.roleSelectData.splice(i,1);
            for(var i=0;i<$scope.roleAllData.length;i++){
                if(item.resourceId==$scope.roleAllData[i].roleId){
                    $scope.roleAllData[i].$$active=false;
                    break;
                }
            }
        }
    }])
    //路由配置
    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home.authorization.organizationMgmt', {
                    url: '/organizationMgmt',
                    views: {
                        'authorization': {
                            templateUrl: './view/authorization/organizationMgmt/organizationMgmt.html',
                            controller: 'organizationMgmt'
                        }
                    }
                });
        }
    ]);

