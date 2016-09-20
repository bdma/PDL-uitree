Array.prototype.uiTreeUnique = function(array) {
    var temp = {};
    for (var i = 0; i < this.length; i++) {
        temp[this[i].id] = i;
    }
    for (var j = 0; j < array.length; j++) {
        if (temp[array[j].id] == undefined) {
            this.push(array[j]);
        }
    }
}
Array.prototype.uiTreeUniqueDelete = function(array) {
        var temp = {};
        for (var i = 0; i < array.length; i++) {
            temp[array[i].id] = i;
        }
        for (var j = 0; j < this.length; j++) {
            if (temp[this[j].id] >= 0) {
                this.splice(j, 1);
                j--;
            }
        }
    }
    // var app = angular.module('app', []);
app.directive("uiTree", function() {
        return {
            restrict: "E",
            replace: true,
            scope: {
                treeData: "=", //传给组件的基础数据，数据为一个对象数组，需要有id，pId（父级id）字段，如果没有设置label属性，还需要name字段
                selectedTree: "=", //勾选中节点的list
                clickitem: "&", //点击当前节点事件，传递当前点击的节点对象
                conf: "=",
                clickitems: '='
                    /*
                        conf:{
                            multiple: false, //true,false 是否开启勾选,默认为false
                            multipleType: 'none', //勾选方式，'radio'（单选）,'check'（多选）,'cascaded'（级联多选）,'none'（不选择）//默认为none
                            label: "name", //显示树节点名称的字段，默认为name
                            isOpen: true, //是否默认展开树，默认为true
                            multiClick: false,  //true,false 是否开启点击多选
                            addChildNode:false,//新增子节点功能
                            editNode:false,//编辑节点功能
                            deleteNode:false//删除节点功能
                            rootNodeId:0,//自定义根节点id，默认是0或者null
                            createTreeCallback：节点加载时回调函数
                        }
                        conf提供以下方法：
                        getTreeData 无参 获取整棵树list集合
                        getTreeLength 获取树节点总数
                    */
            },
            templateUrl: './uiTree/uiTree.html',
            controller: ["$scope", function($scope) {
                var confDefault = {
                    clickSelect: true,
                    multiple: false,
                    multipleType: 'none',
                    label: "name",
                    isOpen: true,
                    isDrag: false,
                    multiClick: false,
                    addChildNode: false,
                    editNode: false,
                    deleteNode: false,
                    createTreeCallback: null,
                    checkItemCallback: null,
                    clearStatus: "open"
                };
                try {
                    if ($scope.conf) {
                        for (var key in confDefault) {
                            if ($scope.conf[key] == undefined || $scope.conf[key] == null) {
                                $scope.conf[key] = confDefault[key];
                            }
                        };
                    } else {
                        throw new Error(10, "uiTree conf is undefined");
                    }
                } catch (e) {
                    console.error(e);
                };
                $scope.conf.getTreeData = function() {
                    return $scope.tree;
                };
                $scope.conf.getTreeLength = function() {
                    return $scope.treelength.num;
                };
                $scope.conf.openTree = function() {
                    for (var i = 0; i < $scope.treeData.length; i++) {
                        $scope.treeData[i].$$isOpen = true;
                    }
                };
                $scope.conf.closeTree = function() {
                    for (var i = 0; i < $scope.treeData.length; i++) {
                        $scope.treeData[i].$$isOpen = false;
                    }
                };
                $scope.oncallback = function(callback, item, clickitems) {
                    if (callback) {
                        callback(item, clickitems);
                    }
                }
                $scope.checkitem = function(callback, item, $event) {
                    if (callback) {
                        callback(item, $event);
                    }
                }
                $scope.tree = []; //树对象数组
                $scope.treelength = {}; //节点总个数
                if ($scope.selectedTree == undefined) { $scope.selectedTree = []; }
                $scope.clickitemOnce = {};
                /*$scope.selectedTree = [];*/
                //创建树
                $scope.createTree = function(treeArray) {
                    $scope.str = "";
                    $scope.clickitemOnce = {};
                    if ($scope.clickitems) { $scope.clickitems.splice(0); }
                    $scope.currentid = {};
                    $scope.tree = $scope.createTreeObj(treeArray);
                    $scope.createTreeObjChildren($scope.tree, treeArray);
                };
                //获取根节点
                $scope.createTreeObj = function(treeArray) {
                    var objs = [];
                    for (var i = 0; i < treeArray.length; i++) {
                        if (!treeArray[i].pId || treeArray[i].pId == 0 || treeArray[i].pId == $scope.conf.rootNodeId) {
                            var obj = treeArray[i];
                            if (obj.$$isOpen == undefined) { obj.$$isOpen = $scope.conf.isOpen; }
                            if (obj.$$isDrag == undefined) { obj.$$isDrag = $scope.conf.isDrag; }
                            if (obj.$$clickSelect == undefined) { obj.$$clickSelect = $scope.conf.clickSelect; }
                            treeArray.splice(i, 1);
                            i--;
                            objs.push(obj);
                        }
                    }
                    return objs;
                };
                //获取树节点
                $scope.createTreeObjChildren = function(root, treeArray) {
                    for (var i = 0; i < root.length; i++) {
                        root[i].children = [];
                        var t = true;
                        for (var j = 0; j < treeArray.length; j++) {
                            if (root[i].id == treeArray[j].pId) {
                                if (treeArray[j].$$isOpen == undefined) { treeArray[j].$$isOpen = $scope.conf.isOpen; }
                                if (treeArray[j].$$isDrag == undefined) { treeArray[j].$$isDrag = $scope.conf.isDrag; }
                                if (treeArray[j].$$clickSelect == undefined) { treeArray[j].$$clickSelect = $scope.conf.clickSelect; }
                                treeArray[j].$$parent = root[i];
                                root[i].children.push(treeArray[j]);
                                treeArray.splice(j, 1);
                                j--;
                            }
                        }
                        $scope.oncallback($scope.conf.createTreeCallback, root[i], $scope.clickitems);
                        if (root[i].$$isFolder == undefined) {
                            if (root[i].children.length > 0) {
                                root[i].$$isFolder = true;
                            } else {
                                root[i].$$isFolder = false;
                            }
                        }
                        if (root[i].$$isShow == undefined) {
                            root[i].$$isShow = true;
                        }
                        $scope.createTreeObjChildren(root[i].children, treeArray);
                    }
                };
                //节点展开收起
                $scope.slideItem = function($event, item) {
                    var ul = $($event.currentTarget).parent().siblings('ul');
                    if (item.$$isOpen) {
                        item.$$isOpen = false;
                    } else {
                        item.$$isOpen = true;
                    }
                };
                //点击节点：单选&&多选
                $scope.activeitem = function(multiple, $event, item) {
                    if (item.$$clickSelect) {
                        if (multiple) {
                            var t = false,
                                l = 0;
                            for (var i = 0; i < $scope.clickitems.length; i++) {
                                if (item.id == $scope.clickitems[i].id) {
                                    t = true;
                                    l = i;
                                    break;
                                }
                            }
                            if (t) {
                                item.$$active = false;
                                $scope.clickitems.splice(l, 1);
                            } else {
                                item.$$active = true;
                                $scope.clickitems.push(item);
                            }
                            $scope.clickitemparent($scope.clickitems);
                        } else {
                            $scope.clickitemOnce.$$active = false;
                            $scope.clickitemOnce = item;
                            $scope.clickitemOnce.$$active = true;
                            $scope.clickitemparent(item);
                        }
                    }
                };
                $scope.clickitemparent = function(item) {
                    $scope.clickitem({ item: item });
                };
                //克隆节点
                $scope.pushItem = function(array, item) {
                    //var obj = cloneservice.clone(item);
                    array.push(item);
                    return array;
                };
                /*//勾选功能：单选
                $scope.selectedItem = function(item) {
                    
                };
                //勾选功能：多选
                $scope.selectedItemByone = function(item) {
                    
                };*/
                //勾选功能：级联多选
                $scope.selectedItem = function(type, item, $event) {
                    $scope.checkitem($scope.conf.checkItemCallback, item, $event);
                    var scope = angular.element($($event.target).parent().parent()[0]).scope();
                    if (type == 'radio') {
                        var arraydelete = [];
                        var arraycheck = [];
                        arraycheck = $scope.pushItem(arraycheck, item);
                        if (item.$$status != 'checked') {
                            item.$$status = 'checked';
                            if (scope.$parent.$uiTreeItem != undefined && scope.$parent.$uiTreeItem != null) {
                                var parent = scope.$parent.$uiTreeItem;
                                for (var i = 0; i < parent.children.length; i++) {
                                    if (parent.children[i].id != item.id && parent.children[i].$$status == 'checked') {
                                        delete parent.children[i].$$status;
                                        arraydelete = $scope.pushItem(arraydelete, parent.children[i]);
                                    }
                                }
                            }
                        }
                        $scope.concatSelected(arraydelete, 'delete');
                        $scope.concatSelected(arraycheck, 'add');
                    } else if (type == 'check') {
                        var array = [];
                        array = $scope.pushItem(array, item);
                        if (item.$$status == 'checked') {
                            delete item.$$status;
                            $scope.concatSelected(array, 'delete');
                        } else {
                            item.$$status = 'checked';
                            $scope.concatSelected(array, 'add');
                        }
                    } else if (type == 'cascaded') {
                        var changeArray = [];
                        if (!item.$$status) {
                            item.$$status = 'checked';
                        } else {
                            if (item.$$status == 'checked') {
                                delete item.$$status;
                            } else {
                                item.$$status = 'checked';
                            }
                        }
                        changeArray = $scope.pushItem(changeArray, item);
                        $scope.changeChildren(item, changeArray);
                        var parents = $scope.getParents(item);
                        for (var i = 0; i < parents.length; i++) {
                            if (item.$$status == 'checked') {
                                var parentbool = true;
                                for (var b = 0; b < parents[i].children.length; b++) {
                                    if (!parents[i].children[b].$$status || parents[i].children[b].$$status == 'halfchecked') {
                                        parentbool = false;
                                    }
                                }
                                if (parentbool) { parents[i].$$status = 'checked'; } else { parents[i].$$status = 'halfchecked'; }
                                changeArray = $scope.pushItem(changeArray, parents[i]);
                            } else {
                                var parentbool = true;
                                for (var b = 0; b < parents[i].children.length; b++) {
                                    if (parents[i].children[b].$$status) {
                                        parentbool = false;
                                    }
                                }
                                if (parentbool) {
                                    delete parents[i].$$status;
                                    changeArray = $scope.pushItem(changeArray, parents[i]);
                                } else { parents[i].$$status = 'halfchecked'; }
                            }
                        }
                        if (item.$$status == 'checked') {
                            $scope.concatSelected(changeArray, 'add');
                        } else {
                            $scope.concatSelected(changeArray, 'delete');
                        }
                    }
                };
                //勾选功能：级联多选-获取所有父节点
                $scope.getParents = function(item) {
                    var parents = [];
                    if (item.$$parent) {
                        parents.push(item.$$parent);
                        $scope.getParent(item.$$parent, parents);
                    }
                    return parents;
                }
                $scope.getParent = function(parent, array) {
                        if (parent.$$parent) {
                            array.push(parent.$$parent);
                            $scope.getParent(parent.$$parent, array);
                        }
                    }
                    //勾选功能：级联多选-改变子节点状态
                $scope.changeChildren = function(item, changeArray) {
                        for (var i = 0; i < item.children.length; i++) {
                            if (item.$$status == 'checked') { item.children[i].$$status = "checked"; } else { delete item.children[i].$$status; }
                            changeArray = $scope.pushItem(changeArray, item.children[i]);
                            if (item.children[i].children && item.children[i].children.length > 0) { $scope.changeChildren(item.children[i], changeArray); }
                        }
                    }
                    //勾选功能：级联多选-选中节点集合的合并
                $scope.concatSelected = function(array, type) {
                    if ($scope.selectedTree) {
                        if ($scope.selectedTree.length > 0) {
                            if (type == 'delete') {
                                $scope.selectedTree.uiTreeUniqueDelete(array);
                            } else {
                                $scope.selectedTree.uiTreeUnique(array);
                            }
                        } else {
                            if (type == "add") {
                                for (var i = 0; i < array.length; i++) {
                                    $scope.selectedTree.push(array[i]);
                                }
                            }
                        }
                    }
                }
                $scope.addChildNodeFn = function(item) {
                    if ($scope.conf.addChildNodeFn != undefined) {
                        $scope.conf.addChildNodeFn(item, $scope.treelength);
                    } else {
                        item.$$isOpen = true;
                        var obj = {};
                        obj.id = $scope.treelength.num + 1;
                        obj.pId = item.id;
                        obj[$scope.conf.label] = "node " + ($scope.treelength.num + 1);
                        obj.children = [];
                        obj.$$parent = item;
                        item.children.push(obj);
                        $scope.treelength.num++;
                    }
                }
                $scope.deleteNodeFn = function(item, i) {
                    if ($scope.conf.deleteNodeFn != undefined) {
                        $scope.conf.deleteNodeFn(item, $scope.treelength);
                    } else {
                        if (item.$$parent) {
                            item.$$parent.children.splice(i, 1);
                        } else {
                            $scope.tree.splice(i, 1);
                        }
                    }
                }
                $scope.editNodeFn = function(item, $event) {
                    if ($scope.conf.editNodeFn != undefined) {
                        $scope.conf.editNodeFn(item, $scope.treelength);
                    } else {
                        $('.ui-tree').find('.uiTreeName').show();
                        $('.ui-tree').find('.uiTreeNameEdit').hide();
                        $($event.target).siblings('.uiTreeNameEdit').show();
                        $($event.target).siblings('.uiTreeName').hide();
                        $($event.target).find('input').focus();
                        $event.stopPropagation();
                    }
                }
                $scope.stopPro = function($event) {
                        $event.stopPropagation();
                    } //多余
                $scope.enteradd = function($event) {
                    if ($event.keyCode == 13) {
                        $($event.target).parent().hide().siblings('.uiTreeName').show();
                    }
                };
                //拖动
                $scope.dragstart = function(event, uiTreeItem) {
                    console.log(event, uiTreeItem, "1");
                    event.dataTransfer.setData("Text", '1');
                    $scope.conf.dragItem = uiTreeItem;
                };
                $scope.dragover = function(uiTreeItem, event) {
                    var t = false;
                    if (uiTreeItem.id == $scope.conf.dragItem.id) { t = true; } else {
                        var array = [];
                        $scope.getParent(uiTreeItem, array);
                        for (var i = 0; i < array.length; i++) {
                            if (array[i].id == $scope.conf.dragItem.id) {
                                t = true;
                                break;
                            }
                        }
                    }
                    if (t) {
                        event.dataTransfer.dropEffect = "none";
                    }
                    $scope.conf.dragoverFn(event, uiTreeItem, $scope.conf.dragItem);
                    event.preventDefault();
                };
                $scope.dragenter = function(uiTreeItem, event) {
                    event.preventDefault();
                    var t = false;
                    if (uiTreeItem.id == $scope.conf.dragItem.id) { t = true; } else {
                        var array = [];
                        $scope.getParent(uiTreeItem, array);
                        for (var i = 0; i < array.length; i++) {
                            if (array[i].id == $scope.conf.dragItem.id) {
                                t = true;
                                break;
                            }
                        }
                    }
                    if (!t) {
                        $(event.currentTarget).css({ "background": "blue", color: '#fff' })
                    }
                }
                $scope.dragleave = function(uiTreeItem, event) {
                    event.preventDefault();
                    var t = false;
                    if (uiTreeItem.id == $scope.conf.dragItem.id) { t = true; } else {
                        var array = [];
                        $scope.getParent(uiTreeItem, array);
                        for (var i = 0; i < array.length; i++) {
                            if (array[i].id == $scope.conf.dragItem.id) {
                                t = true;
                                break;
                            }
                        }
                    }
                    if (!t) {
                        $(event.currentTarget).css({ "background": "none", color: "#000" })
                    }
                }
                $scope.drop = function(event, uiTreeItem) {
                    $(event.currentTarget).css({ "background": "none", color: '#000' })
                    if ($scope.conf.dropFn) {
                        $scope.conf.dropFn(event, uiTreeItem, $scope.conf.dragItem);
                    } else {
                        if (uiTreeItem.id != $scope.conf.dragItem.id) {
                            uiTreeItem.children.push($scope.conf.dragItem);
                            var parentList = $scope.conf.dragItem.$$parent ? $scope.conf.dragItem.$$parent.children : $scope.tree;
                            for (var i = 0; i < parentList.length; i++) {
                                if (parentList[i].id == $scope.conf.dragItem.id) {
                                    parentList.splice(i, 1);
                                    break;
                                }
                            }
                            $scope.conf.dragItem.$$parent = uiTreeItem;
                        }
                    }
                };
                $scope.getParent = function(item, array) {
                        if (item.$$parent) {
                            array.push(item.$$parent);
                            $scope.getParent(item.$$parent, array);
                        }
                    }
                    //更新树
                var watch = $scope.$watch(function() {
                    return $scope.treeData
                }, function(newVal, oldVal) {
                    if (newVal) {
                        $scope.treelength.num = $scope.treeData.length;
                        $scope.treeData2 = $scope.treeData.concat([]);
                        $scope.selectedTree.splice(0);
                        $scope.createTree($scope.treeData2);
                        if ($scope.conf.clearStatus == "open") {
                            $element.find('.uiTreeName.active').removeClass("active");
                        }
                    }
                });
                $scope.$on("$destroy", function() {
                    if (watch) {
                        watch();
                    }
                });
            }]
        }
    })
    .directive("ngDragstart", ['$parse', '$rootScope', function($parse, $rootScope) {
        return {
            restrict: "A",
            compile: function($element, attr) {
                var fn = $parse(attr.ngDragstart, null, true);
                return function ngEventHandler(scope, element) {
                    element[0].addEventListener('dragstart', function(event) {
                        console.log(event, "e");
                        var callback = function() {
                            fn(scope, { $event: event });
                        };
                        scope.$apply(callback);
                    });
                };
            }
        }
    }])
    .directive("ngDragover", function($parse, $rootScope) {
        return {
            restrict: "A",
            compile: function($element, attr) {
                var fn = $parse(attr.ngDragover, null, true);
                return function ngEventHandler(scope, element) {
                    element[0].addEventListener('dragover', function(event) {
                        var callback = function() {
                            fn(scope, { $event: event });
                        };
                        scope.$apply(callback);
                    });
                };
            }
        }
    })
    .directive("ngDrop", function($parse, $rootScope) {
        return {
            restrict: "A",
            compile: function($element, attr) {
                var fn = $parse(attr.ngDrop, null, true);
                return function ngEventHandler(scope, element) {
                    element[0].addEventListener('drop', function(event) {
                        var callback = function() {
                            fn(scope, { $event: event });
                        };
                        scope.$apply(callback);
                    });
                };
            }
        }
    })
    .directive("ngDragenter", function($parse, $rootScope) {
        return {
            restrict: "A",
            compile: function($element, attr) {
                var fn = $parse(attr.ngDragenter, null, true);
                return function ngEventHandler(scope, element) {
                    element[0].addEventListener('dragenter', function(event) {
                        var callback = function() {
                            fn(scope, { $event: event });
                        };
                        scope.$apply(callback);
                    });
                };
            }
        }
    })
    .directive("ngDragleave", function($parse, $rootScope) {
        return {
            restrict: "A",
            compile: function($element, attr) {
                var fn = $parse(attr.ngDragleave, null, true);
                return function ngEventHandler(scope, element) {
                    element[0].addEventListener('dragleave', function(event) {
                        var callback = function() {
                            fn(scope, { $event: event });
                        };
                        scope.$apply(callback);
                    });
                };
            }
        }
    })
    .directive("ngDragend", function($parse, $rootScope) {
        return {
            restrict: "A",
            compile: function($element, attr) {
                var fn = $parse(attr.ngDragend, null, true);
                return function ngEventHandler(scope, element) {
                    element[0].addEventListener('dragend', function(event) {
                        var callback = function() {
                            fn(scope, { $event: event });
                        };
                        scope.$apply(callback);
                    });
                };
            }
        }
    })
