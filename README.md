# PDL-uitree API
    <ui-tree tree-data="data" conf="treeConf" clickitem="clickNode(node)" clickitems="clickNodes" selected-tree="selectedNode">
## tree-data
tree-data参数传入原始数据。原始数据规范如下：
*原始数据必须是一个array数组。
*数组中存放每个节点的object对象。
*每个节点中必须有id和pId（parentId）属性，对应节点的结构。
*节点对象不限制有其他任何类型的属性。
*节点显示的节点名默认使用节点的name属性，可在conf中配置（具体参照conf中label配置项）。
## conf
conf参数传入树的配置项Object，包括一些回调函数，conf的具体参数如下：
##### multiple
是否开启树的勾选模式,默认为false
##### multipleType
树的勾选方式，需要开启树的勾选模式才能起效，'radio'（单选）,'check'（多选）,'cascaded'（级联多选）,'none'（不选择）,默认为none
##### clickSelect
是否开启点击选中节点名称功能，默认为true
##### multiClick
是否开启点击多选，默认为false
##### isOpen
是否默认展开树，默认为true
##### label
设置树节点的显示名称取自树节点的哪个属性，默认为"name",
##### addChildNode
是否开启新增子节点功能，默认为false
##### editNode
是否开启编辑节点功能，默认为false
##### deleteNode
是否开启删除节点功能，默认为false
##### addChildNodeFn
新增子节点的回调函数，当有回调函数时执行回调函数，没有回调函数时执行默认操作。回调函数默认为null。
##### editNodeFn
编辑节点的回调函数，当有回调函数时执行回调函数，没有回调函数时执行默认操作。回调函数默认为null。
##### deleteNodeFn
删除节点的回调函数，当有回调函数时执行回调函数，没有回调函数时执行默认操作。回调函数默认为null。
##### rootNodeId
设置根节点id，即设置pId为当前值的节点为树的第一层节点，默认是0或者undefined
##### clearStatus
初始化树时是否清除树的展开状态,默认为false
##### isDrag
是否开启拖动功能，默认为false
##### checkItemCallback
勾选模式里点击勾选时的回调函数，回调函数传入一个参数为当前勾选的树节点对象
##### createTreeCallback
初始化树创建每一个树节点之前触发的函数，函数传入当前初始化的树节点对象

### conf的内置公共方法
conf的内置公共方法可以在任何scope域调用，只要能够获取当前树的conf对象。
##### getTreeData
获取整个树的树状结构List
##### getTreeLength
获取树节点的个数
##### openTree
展开当前树所有节点
##### closeTree
收起当前树所有节点
###### 示例
	var length=$scope.conf.getTreeLength();
    $scope.conf.closeTree();


## clickitem
点击节点名称时触发的事件，当conf的clickSelect属性设置为false时失效。事件传入当前点击的树节点对象。
## clickitems
点击节点名称选中节点的List。
## selected-tree
勾选模式下选中的节点的List。
## $uiTreeItem
树节点，树节点是一个Object，树节点的属性会继承传进来的数据对象属性，同时会产生一些树节点私有属性。这些私有属性用来控制每个节点自身的各种状态。节点私有属性如下：
###### $$isOpen
控制节点的展开状态。初始化时若createTreeCallback回调函数没有操作节点的此属性，将默认继承conf的设置。
###### $$isDrag
控制节点是否可拖动。初始化时若createTreeCallback回调函数没有操作节点的此属性，将默认继承conf的设置。
###### $$isShow
控制节点是否显示。初始化时若createTreeCallback回调函数没有操作节点的此属性，将默认继承conf的设置。
###### $$isFolder
控制节点是显示Folder节点还是File节点。初始化时若createTreeCallback回调函数没有操作节点的此属性，将以当前节点是否有子节点为条件做判断，有子节点时显示Folder节点，无子节点时显示File节点。
###### $$clickSelect
控制节点是否可以点击节点名称选中。初始化时若createTreeCallback回调函数没有操作节点的此属性，将默认继承conf的设置。
###### $$active
控制节点是否是节点名称选中状态。初始化时若createTreeCallback回调函数没有操作节点的此属性，将默认为false。
###### $$parent
此属性以指针的方式存储当前节点的父节点整个对象（此对象也是$uiTreeItem，拥有$uiTreeItem的所有属性）。
###### children
此属性存放当前节点的子节点对象数组，当没有子节点时，为空数组。



### 注：
#### 由于angular没有实现HTML5的拖动事件的NG封装，此组件中内置HTML5中的拖动指令。
*ng-dragstart
*ng-dragover
*ng-drop
*ng-dragenter
*ng-dragleave
*ng-dragend
这些事件指令使用方式同ng-click。具体使用方法请参照HTML5drag拖动。
#### 指令中的隔离域双向绑定变量clickitems、selected-tree由于是‘=’绑定方式，并且他们的值随着操作随时会变化，请在操作这两个变量时使用数组的操作方法push、splice等方式。勿使用=表达式赋值，这种赋值方式将会解除变量与指令中的变量双向绑定关系。
#### 树节点对象$uiTreeItem加入私有属性$$parent之后将由于死循环的问题无法深度克隆。请在克隆树节点数据的时候使用传进来之前的数据或者使用angular.toJson()方法去除私有属性。

