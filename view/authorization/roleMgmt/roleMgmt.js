angular.module('appModule')
    .controller("roleMgmt", ['$scope', '$state', 'authorizationService', 'authorizationUrl', 'cloneservice', function($scope, $state, authorizationService, authorizationUrl, cloneservice) {
        //初始化
        $scope.$emit("CHANGE_STATE_EVENT", 'roleMgmt');
        $scope.initShow = function() {
            $scope.popup_show = false;
            $scope.editRoleShow = false;
            $scope.addRoleShow = false;
            $scope.updateUserShow = false;
            $scope.roleFntShow = false;
            $scope.roleDataShow = false;
        };
        $scope.initShow();
        $scope.selectedOrg = [];
        $scope.$watch(function() {
            return $scope.selectedOrg.length;
        }, function(n, o) {
            console.log($scope.selectedOrg, '111');
        });
        $scope.toggle = "roleUser"; //btn show toggle
        //clone
        var usersCloneObj, positionsClone;
        $scope.selectedIndex = 0; //角色初始时选中第一个
        //右边tab标签
        $scope.goRoleUser = function() {
            $scope.toggle = "roleUser";
        };
        $scope.goRoleOrg = function() {
            $scope.toggle = "roleOrg";
        }
        $scope.goRoleFnt = function() {
            $scope.toggle = "roleFnt";
            $scope.carouse.init();
        }
        $scope.goRoleData = function() {
            $scope.toggle = "roleData";
            $scope.carouse2.init();
        };
        //搜索
        $scope.onRoleSearch = function(conditions, columnIndex) {
            if (columnIndex == 0) {
                var url = authorizationUrl.getEntireMgmtRoles + "?tag=" + conditions;
            } else if (columnIndex == 1) {

                var url = authorizationUrl.getEntireMgmtRoles + "?roleName=" + conditions;

            } else if (columnIndex == 2) {
                var num = ""
                console.log("conditions:", conditions)
                if (conditions.length == 1 && conditions[0] == 1) {
                    var num = "?type=0"
                    console.log("num:", num)
                } else if (conditions.length == 1 && conditions[0] == 2) {
                    var num = "?type=1";
                    console.log("num:", num)
                } else if (conditions.length == 2) {
                    var num = "";
                    console.log("num:", num)
                }
                var url = authorizationUrl.getEntireMgmtRoles + num;
                console.log("url:", url)
            }
            authorizationService.serviceGet(url).then(function(res) {
                $scope.roles = res;
                $scope.cleckedRow(res[0], 0);
                console.log("角色$scope.roles:", $scope.roles)
            }, function(err) {
                $.alert("服务器请求失败");
            });
        };
        //
        $scope.checkoptions = [{
            des: "用户角色",
            img: "./asset/image/icon_juese01.png",
        }, {
            des: "岗位角色",
            img: "./asset/image/icon_juese02.png",
        }];
        //表头
        $scope.roleColumns = [
            { name: '标签', type: ColumnTypeEnum.string, width: '20%', filterDatasource: [] },
            { name: '角色', type: ColumnTypeEnum.string, width: '30%', filterDatasource: [] },
            { name: '类型', type: ColumnTypeEnum.enum, width: '25%', filterDatasource: $scope.checkoptions },
            { name: '新建', type: ColumnTypeEnum.click, width: '25%', filterDatasource: [] }
        ];

        //增加角色
        $scope.onAddRole = function(columnIndex) {
            if (columnIndex == 3) {
                $scope.initShow();
                $scope.popup_show = true;
                $scope.editRoleShow = true;
                $scope.popupTitle = "增加角色";
                $scope.addRoleShow = true;
                $scope.options = [
                    { name: "用户角色", value: 0 },
                    { name: "岗位角色", value: 1 }
                ];
                $scope.addrole = {
                    type: $scope.options[0].value
                };
            } else {
                return;
            }
        };

        $scope.subAddRole = function() {
            var data = {
                tag: $scope.addrole.tag,
                roleName: $scope.addrole.roleName,
                type: $scope.addrole.type
            }
            console.log("角色：", data)
            authorizationService.servicePost(authorizationUrl.createRole, data).then(function(res) {
                console.log("添加角色res:", res)
                if (res.message == "Duplicate") {
                    $.alert("角色名重复");
                } else {
                    $scope.popup_show = false;
                    getMgmtRoles()
                }
            }, function(err) {
                $.alert("服务器请求失败");
            });
        };
        $scope.casAddUser = function() {
            $scope.addrole = {
                type: $scope.options[0].value
            };
            $scope.popup_show = false;
        };
        //编辑
        $scope.editRole = function(role) {
            $scope.initShow();
            $scope.popup_show = true;
            $scope.editRoleShow = true;
            $scope.popupTitle = "编辑角色";
            $scope.addrole = {
                roleId: role.roleId,
                tag: role.tag,
                roleName: role.roleName,
                type: role.type,
            };
        };
        $scope.subEditRole = function() {
            var data = {
                roleId: $scope.addrole.roleId,
                tag: $scope.addrole.tag,
                roleName: $scope.addrole.roleName,
                type: $scope.addrole.type,
            }
            console.log("编辑角色：", data)
                // $scope.updateRole(data)
            authorizationService.servicePost(authorizationUrl.updateRole, data).then(function(res) {
                console.log("添加角色res:", res)
                if (res.message == "Duplicate") {
                    $.alert("角色名重复");
                } else {
                    $scope.popup_show = false;
                    getMgmtRoles()
                }
            }, function(err) {
                $.alert("服务器请求失败");
            });
        };

        //删除按钮
        $scope.deleteRole = function(data) {
            $.confirm("确认删除吗？", function() {
                var url = authorizationUrl.deleteRole + "?roleId=" + data;
                console.log("删除data:", url);
                authorizationService.serviceDelete(url).then(function(res) {
                    getMgmtRoles()
                }, function(err) {
                    $.alert("服务器请求失败");
                });
            }, function() {
                console.log("不删除");
            })
        };

        //获取popup里总用户
        $scope.getEntireUsers = function(searchRoleName) {
            if (!searchRoleName) {
                searchRoleName = "";
            }
            console.log("searchRoleName:", searchRoleName)
            authorizationService.serviceGet(authorizationUrl.getEntireUsers + "?displayName=" + searchRoleName).then(function(res) {

                // console.log("1$scope.entusers:", $scope.entusers)
                res.forEach(function(element, index, array) {
                    if ($scope.users.length) {
                        for (var j = 0, k = $scope.users.length; j < k; j++) {
                            if (element.userName == $scope.users[j].userName) {
                                element.addUserClick = "clicked";
                            }
                        }
                    }
                });
                $scope.entusers = res;
            }, function(err) {
                $.alert("服务器请求失败");
            })
        };
        //获取角色下用户
        $scope.getUsersByRole = function(roleId) {
            authorizationService.serviceGet(authorizationUrl.getRole + "?roleId=" + roleId).then(function(res) {
                // console.log("单个角色的用户:", res)
                $scope.users = res.users;
                // usersCloneObj = cloneservice.clone($scope.users);
                $scope.positions = res.positions;
                console.log("已挂岗位$scope.positions:", $scope.positions)
            }, function(err) {
                $.alert("服务器请求失败");
            })
        };
        //加载岗位树
        function loadPositionTree() {
            authorizationService.serviceGet(authorizationUrl.getOrgTree).then(function(res) {
                $scope.orgData = res.itemList;
                // $scope.orgDataClone = cloneservice.clonearr($scope.orgData);
                // $scope.orgPowerData = cloneservice.clonearr($scope.orgDatatemp);
                console.log("岗位树$scope.orgData：", $scope.orgData)
            }, function(err) {

            })
        };
        //用户角色绑定按钮
        $scope.bindRoleUser = function() {
            $scope.initShow();
            $scope.popup_show = true;
            $scope.updateUserShow = true;
            $scope.popupTitle = "绑定员工";
            $scope.InUsers = cloneservice.clone($scope.users);
            // $scope.getEntireUsers();
        };
        //岗位角色绑定
        $scope.bindRolePosition = function() {
            $scope.initShow();
            $scope.popup_show = true;
            $scope.updateUserShow = true;
            $scope.popupTitle = "绑定岗位";
            loadPositionTree();
            $scope.InPositions = cloneservice.clone($scope.positions);
            // $scope.getEntireUsers();
        };
        $scope.openOrgTree = function($event) {
            $($event.currentTarget).addClass("active").siblings().removeClass("active");
            $scope.orgConf.openTree();
        }
        $scope.closeOrgTree = function($event) {
            $($event.currentTarget).addClass("active").siblings().removeClass("active");
            $scope.orgConf.closeTree();
        }


        //岗位树配置
        $scope.orgConf = {
            clickSelect: false,
            multiple: true,
            multipleType: 'check',
            isOpen: true,
            clearStatus: "close",
            checkItemCallback: function(item) {
                if (item.$$status == "checked") {
                    for (var j = 0, k = $scope.InPositions.length; j < k; j++) {
                        if ($scope.InPositions[j].uuid == item.uuid) {
                            $scope.InPositions.splice(j, 1);
                            break;
                        }
                    }

                } else {
                    var positionTmp = {
                        uuid: item.uuid,
                        name: item.name
                    }
                    $scope.InPositions.push(positionTmp);
                }
            },
            createTreeCallback: function(item) {
                if (item.position) { item.$$isFolder = false; } else { item.$$isFolder = true; }
                for (var i = 0, l = $scope.positions.length; i < l; i++) {
                    if (item.uuid == $scope.positions[i].uuid) {
                        item.$$status = 'checked';
                        var iterator = item
                        expandFolders();

                        function expandFolders() {
                            if (!iterator.$$parent) {
                                iterator.$$isOpen = true;
                            } else {
                                iterator.$$isOpen = true;
                                iterator = iterator.$$parent;
                                expandFolders();
                            }
                        }
                        $scope.selectedOrg.push(item);
                        return;
                    }
                }
                item.$$status = 'unchecked';
            },

        };
        //选择角色行
        $scope.cleckedRow = function(role, $index) {
            console.log("点击的角色:", role)
            $scope.selectedIndex = $index;
            $scope.typeTag = role.type;
            $scope.clickRow = role;
            $scope.clickRowIndex = $index;
            $scope.entusers = []; //每次点击角色，初始化全部用户

            $scope.getUsersByRole(role.roleId);

            $scope.positions = role.positions;
            //取消 编辑用户
            $scope.casEditUser = function() {
                    $scope.addrole = {
                        roleId: role.roleId,
                        tag: role.tag,
                        roleName: role.roleName,
                        type: role.type,
                    };
                    $scope.popup_show = false;
                }
                //==================用户=======================

            //popup 里操作用户
            $scope.dealRoleUserIn = function(user) {
                $scope.InUsers = $scope.InUsers.filter(function(el) {
                    return el.userName != user.userName;
                })
                if ($scope.entusers) {
                    for (var j = 0, k = $scope.entusers.length; j < k; j++) {
                        if ($scope.entusers[j].userName == user.userName) {
                            console.log("$scope.entusers[j]:", $scope.entusers[j])
                            $scope.entusers[j].addUserClick = null;
                            break;
                        }
                    }
                }

            };
            //搜索用户
            $scope.search = {};
            $scope.keypressEnter = function($event) {
                console.log("$scope.search.RoleName:", $scope.search.RoleName)
                if ($event.keyCode == 13) {
                    $scope.getEntireUsers($scope.search.RoleName)
                }
            };

            //点击搜索出的用户
            $scope.clickEntUser = function(entuser) {
                // console.log("entuser:", entuser)
                // $scope.clickItem(entuser);
                if (!entuser.addUserClick) {
                    entuser.addUserClick = "clicked";
                    $scope.InUsers.push(entuser)

                } else {
                    entuser.addUserClick = null;
                    $scope.InUsers = $scope.InUsers.filter(function(el) {
                        return el.userName != entuser.userName;
                    })
                }
            };
            $scope.subBindUser = function(entuser) {
                var bindUserNamesArr = [];
                for (var i = 0, l = $scope.InUsers.length; i < l; i++) {
                    bindUserNamesArr.push($scope.InUsers[i].userName)
                }
                console.log("bindUserNamesArr:", bindUserNamesArr)
                var data = {
                    roleId: role.roleId,
                    roleName: role.roleName,
                    tag: role.tag,
                    userNames: bindUserNamesArr
                };

                authorizationService.servicePost(authorizationUrl.updateRole, data).then(function(res) {
                    $scope.getUsersByRole(role.roleId);
                    $scope.entusers = [];
                    $scope.popup_show = false;
                }, function(err) {
                    $.alert("服务器请求失败");
                });

            };
            $scope.casBindUser = function() {
                $scope.entusers = [];
                $scope.InUsers = cloneservice.clone($scope.users);
                $scope.popup_show = false;
            };
            //popup 里处理岗位
            $scope.dealPosition = function(positon) {
                for (var i = 0; i < $scope.selectedOrg.length; i++) {
                    if (positon.uuid == $scope.selectedOrg[i].uuid) {
                        $scope.selectedOrg[i].$$status = "unchecked";
                        $scope.selectedOrg.splice(i, 1);

                        for (var j = 0, k = $scope.InPositions.length; j < k; j++) {
                            if ($scope.InPositions[j].uuid == positon.uuid) {
                                $scope.InPositions.splice(j, 1);
                                break;
                            }
                        }
                        break;
                    }
                }

            };
            $scope.subBindPosition = function() {

                var data = {
                    roleId: role.roleId,
                    roleName: role.roleName,
                    type: role.type,
                    tag: role.tag,
                    positions: $scope.InPositions
                };
                console.log("岗位post：", data)
                authorizationService.servicePost(authorizationUrl.updateRole, data).then(function(res) {
                    $scope.getUsersByRole(role.roleId);
                    $scope.popup_show = false;
                }, function(err) {
                    $.alert("服务器请求失败");
                });
            }
            $scope.casBindPosition = function() {
                // $scope.positions = positionsClone;
                // $scope.getEntireUsers();
                $scope.InPositions = cloneservice.clone($scope.positions);
                $scope.popup_show = false;
                console.log("取消后InPositions：", $scope.InPositions)

            }



            // ===============功能权限===============
            $scope.rolename = role.roleId;
            $scope.getRolesFnt = function(rolename) {
                // var url = authorizationUrl.getRolesPrivileges + "?roleName=" + rolename + "&appName=salesmgmt";
                authorizationService.serviceGet(authorizationUrl.getAllApps).then(function(res) {
                    $scope.tapps = res;
                    $scope.appCurrent = 0;
                    $scope.appCurrent2 = 0;
                    $scope.appItem = $scope.tapps[0];
                    $scope.appsConf.rootNodeId = $scope.tapps[0].id;
                    $scope.appsConf2.rootNodeId = $scope.tapps[0].id;
                    var url = authorizationUrl.getRolesPrivileges + "?roleName=" + rolename + "&appName=" + $scope.tapps[0].name;
                    authorizationService.serviceGet(url).then(function(res) {
                        $scope.appRole = res;
                        //var array = $scope.appRole.RBSimpleRuleDTOs.concat([]);
                        $scope.appRoleData = cloneservice.clonearr($scope.appRole.RBSimpleRuleDTOs);
                        $scope.appRoleData2 = cloneservice.clonearr($scope.appRole.RBSimpleRuleDTOs);
                        // console.log("功能array:", $scope.appRole.RBSimpleRuleDTOs)
                    }, function(err) {
                        $.alert("服务器请求失败");
                    })
                }, function(err) {
                    $.alert("服务器请求失败");
                });
            };
            $scope.getRolesFnt($scope.rolename);
            $scope.selectedApp = function(item, i) {
                $scope.appCurrent = i;
                // $scope.appItem=item;
                $scope.appsConf.rootNodeId = parseInt(item.id);
                var url = authorizationUrl.getRolesPrivileges + "?roleName=" + $scope.rolename + "&appName=" + item.name;
                authorizationService.serviceGet(url).then(function(res) {
                    $scope.appRoleData = res.RBSimpleRuleDTOs;
                    console.log("功能树appRoleData：", $scope.appRoleData)
                }, function(err) {
                    $.alert("服务器请求失败");
                })
            };
            $scope.selectedApp2 = function(item, i) {
                $scope.appCurrent2 = i;
                $scope.appItem = item;
                $scope.appsConf2.rootNodeId = item.id;
                var url = authorizationUrl.getRolesPrivileges + "?roleName=" + $scope.rolename + "&appName=" + item.name;
                authorizationService.serviceGet(url).then(function(res) {
                    // $scope.appRoleData2 = res.RBSimpleRuleDTOs;
                    $scope.appRole = res;
                    //var array = $scope.appRole.RBSimpleRuleDTOs.concat([]);
                    $scope.appRoleData2 = cloneservice.clonearr($scope.appRole.RBSimpleRuleDTOs);

                }, function(err) {
                    $.alert("服务器请求失败");
                })
            };
            //================数据权限==========
            //切换事件
            $scope.selectedElm = function(i) {
                $scope.current = i;
            };

            var dataCurArr = [];
            $scope.getRolesData = function(rolename) {
                var url = authorizationUrl.getUIElements + "?roleName=" + rolename;
                authorizationService.serviceGet(url).then(function(res) {
                    $scope.apps = res.RBSimpleRuleDTOs;
                    var appear = false;
                    dataCurArr = [];
                    //过滤无内容的tab
                    $scope.apps.forEach(function(element, index, array) {
                        appear = false;
                        if (element.elements && element.elements.length > 0) {
                            element.elements.forEach(function(el, index, array) {
                                if (el.effect == 1 && el.name != "infomgmt" && el.name != "securitymgmt" && el.name != "btpInfomgmt") {
                                    appear = true;
                                }
                            })
                        } else {
                            appear = false;
                        }
                        if (appear) {
                            element.hadShow = true;
                            dataCurArr.push(index)
                        }
                    })
                    console.log("数据$scope.apps：", $scope.apps)
                    $scope.selectedElm(dataCurArr[0]); //初始加载首项
                }, function(err) {
                    $.alert("服务器请求失败");
                });
            };
            $scope.getRolesData($scope.rolename);
        };
        $scope.selectedAppRole = [];
        //=============功能权限=================
        //配置功能权限树
        $scope.appsConf = {
            multiple: false,
            // multipleType: "cascaded",
            multiClick: false,
            isOpen: true,
            clickSelect: false,
            label: "displayName",
            createTreeCallback: function(item) {
                if (item.effect) {
                    item.$$isShow = true;
                    if (item.children.length > 0) {
                        var bool = true;
                        for (var g = 0; g < item.children.length; g++) {
                            if (!item.children[g].effect) { bool = false; }
                        }
                        if (bool) { item.$$status = "checked"; } else { item.$$status = "halfchecked"; }
                    } else {
                        item.$$status = "checked";
                    }
                    $scope.selectedAppRole.push(item);
                } else {
                    item.$$isShow = false;
                }
            }
        };
        $scope.appsConf2 = {
            multiple: true,
            multipleType: "cascaded",
            multiClick: false,
            isOpen: false,
            clickSelect: false,
            label: "displayName",
            createTreeCallback: function(item) {
                if (item.effect) {
                    if (item.children.length > 0) {
                        var bool = true;
                        for (var g = 0; g < item.children.length; g++) {
                            if (!item.children[g].effect) { bool = false; }
                        }
                        if (bool) { item.$$status = "checked"; } else { item.$$status = "halfchecked"; }
                    } else {
                        item.$$status = "checked";
                    }
                    $scope.selectedAppRole.push(item);
                }
            }
        };
        //提交功能权限
        $scope.submitAppRole = function() {
            $scope.appRole.appName = $scope.appItem.name;
            $scope.appRole.roleName = $scope.rolename;
            for (var i = 0; i < $scope.appRole.RBSimpleRuleDTOs.length; i++) {
                var t = false;
                for (var j = 0; j < $scope.selectedAppRole.length; j++) {
                    if ($scope.appRole.RBSimpleRuleDTOs[i].id == $scope.selectedAppRole[j].id) {
                        $scope.appRole.RBSimpleRuleDTOs[i].effect = 1;
                        t = true;
                    }
                }
                if (!t) {
                    $scope.appRole.RBSimpleRuleDTOs[i].effect = 0;
                }
            }
            authorizationService.servicePost(authorizationUrl.createRolesPrivileges, $scope.appRole).then(function(res) {
                //serviceLoading.hideLoading();
                $scope.popup_show = false;
                $scope.getRolesFnt($scope.rolename);
                // $.alert("提交成功");
            }, function(err) {
                //serviceLoading.hideLoading();
                $.alert("服务器请求失败");
            })
        };
        $scope.cansmitAppRole = function() {
            $scope.popup_show = false;
            $scope.getRolesFnt($scope.rolename);
        };
        //增加功能
        $scope.addRoleFnt = function() {
                $scope.initShow();
                $scope.popup_show = true;
                $scope.roleFntShow = true;
                $scope.popupTitle = "功能权限";
            }
            //===============数据权限=============
            //勾选事件
        $scope.selectElement = function(parentIndex, item) {
            var app = $scope.apps[parentIndex];
            var index;
            for (var i = 0; i < app.elements.length; i++) {
                if (item.name == app.elements[i].name) {
                    index = i;
                }

            }
            var effect = $scope.apps[parentIndex].elements[index].effect;
            $scope.apps[parentIndex].elements[index].effect = (effect == 1 ? 0 : 1);
            console.log('apps', $scope.apps);
        };

        //提交页面权限
        $scope.submitUIElements = function() {
            var submitObj = { roleName: $scope.rolename, RBSimpleRuleDTOs: $scope.apps }
            authorizationService.servicePost(authorizationUrl.createUIElements, submitObj).then(function(res) {
                    $scope.popup_show = false;
                    $scope.cleckedRow($scope.clickRow, $scope.clickRowIndex);
                    // $.alert('提交成功');
                }),
                function(error) {
                    $.alert(error);
                }
        };
        //popup取消按钮
        $scope.cansmitUIElements = function() {
            $scope.popup_show = false;
            $scope.getRolesData($scope.rolename);
        };
        //增加数据
        $scope.addRoleData = function() {
            $scope.initShow();
            $scope.popup_show = true;
            $scope.popupTitle = "系统数据权限";
            $scope.roleDataShow = true;
            $scope.getRolesData($scope.rolename);

            // $scope.getEntireUsers();
            // console.log("$scope.users:", $scope.users)
        };

        //===========默认加载centermanager角色=======

        //加载角色
        var endIndex = 15;

        function getMgmtRoles() {
            authorizationService.serviceGet(authorizationUrl.getEntireMgmtRoles).then(function(res) {
                $scope.entRoles = res;
                $scope.roles = res.slice(0, 15);
                $scope.rolesSum = res.length;
                endIndex = 15;
                console.log("rolesSum长度：", $scope.rolesSum)
                console.log("roles长度", $scope.roles.length)
                if ($scope.rolesSum - 15 > 0) {
                    $scope.hasMore = true;
                };
                $scope.cleckedRow(res[0], 0)
                    // $scope.users = res[0].users;
                    // console.log("角色$scope.roles:", res)
            }, function(err) {
                $.alert("服务器请求失败");
            });
        };
        getMgmtRoles();


        $scope.loadMoreRole = function() {
            endIndex = endIndex + 15;
            $scope.roles = $scope.entRoles.slice(0, endIndex);
            if ($scope.rolesSum - endIndex > 0) {
                console.log("多roles长度", $scope.roles.length)
                $scope.hasMore = true;
            } else {
                $scope.hasMore = false;
            }
        }
    }])
    //路由配置
    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home.authorization.roleMgmt', {
                    url: '/roleMgmt',
                    views: {
                        'authorization': {
                            templateUrl: './view/authorization/roleMgmt/roleMgmt.html',
                            controller: 'roleMgmt'
                        }
                    }
                })
        }
    ]);
