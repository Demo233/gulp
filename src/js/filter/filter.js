/**
 * 
 */

//拖动
/*$(".box_title_ms").mousedown(function(e){ //鼠标按下事件
	$(this).css("cursor","move");//改变鼠标指针的形状 鼠标移动 
	var offset = $(this).offset();//DIV在页面的位置 offset() 方法返回或设置匹配元素相对于文档的偏移（位置）
	var x = e.pageX - offset.left;//获得鼠标指针离DIV元素左边界的距离 pageX() 属性是鼠标指针的位置，相对于文档的左边缘。
	var y = e.pageY - offset.top;//获得鼠标指针离DIV元素上边界的距离  pageY() 属性是鼠标指针的位置，相对于文档的上边缘。
	$(document).bind("mousemove",function(ev){ //绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件 
	
		//bind() 方法为被选元素添加一个或多个事件处理程序，并规定事件发生时运行的函数
		
		$("#m-4dControl").stop();//加上这个之后 
		
		var _x = ev.pageX - x;//获得X轴方向移动的值 
		var _y = ev.pageY - y;//获得Y轴方向移动的值 
	
		$("#m-4dControl").animate({left:_x+"px",top:_y+"px"},10); 
	}); 

}); 

$(document).mouseup(function() { //mouseup 鼠标松开时
	$("#m-4dControl").css("cursor","default"); //鼠标不履行
	$(this).unbind("mousemove"); //mousemove触发
});
*/

		
$('#advanced_btn').click(function(){	
//var returnDbids = new Array();
	
	var zNtreeArray = bimOriginFilter.zTree.getCheckedNodes();
	//filterExecute.finaldbids=chooseDbidYes();
	var checkArray_read = document.getElementsByName("attribute");
	var finalArr  = [];
	for ( var i = 0; i < checkArray_read.length; i++) {
		if(checkArray_read[i].checked) {
		//debugger;
			finalArr.push(checkArray_read[i].id.split("_")[0]);
		    filterExecute.finaldbids.push(checkArray_read[i].value);
		}
	}
	if(zNtreeArray.length==0) {
		if($(".sidebar_advanced").is(":visible")){
		    $(".sidebar_advanced").hide();
	        $(this).addClass("top_img");
	        $(this).removeClass("bottom_img");
	        	          
	         
		} else {
			Dialog.alert(bdip4dLang[langType]["-15315"]);
		}
		
	} else {
		 if(!$(".sidebar_advanced").is(":visible")){
	         $(".sidebar_advanced").show(); 
	         $(this).addClass("bottom_img");
	         $(this).removeClass("top_img");
	        document.getElementById("chooseValue").value=""; 
	 		filterExecute.attribute_pro();
	        }else{ 
	         $(".sidebar_advanced").hide();
	         $(this).addClass("top_img");
	         $(this).removeClass("bottom_img");
	         $(".titleClose").click();
	          // 清除全选的复选框  
	         document.getElementById("checkItems").checked = null; 
		     var checkElements=document.getElementsByClassName('relations');  		 
		        for(var i=0;i<checkElements.length;i++){  
		            var checkElement=checkElements[i];  
		                checkElement.checked=null;  
		         }  
	       }

			filterExecute.finalTypeNames = filterExecute.arrNotSame(finalArr);
			
	
	}
	
	
	
	
});

$('.btnClose').click(function(){
	$(this).closest('.box_bt').hide();
	$('#box_gray').hide();
});	

$('#daochu_btn').click(function(){
	/*alert();*/
	$('#box_gray').show();
	$('.excel_box').show();
});


$(function(){
	$.fn.extend({
		SimpleTree:function(options){
						
			var option = $.extend({
				click:function(a){ }
			},options);
			
			option.tree=this;	
			
			option._init=function(){
							
				this.tree.find("ul ul").hide();	
				this.tree.find("ul ul").prev("li").removeClass("open");
				
				this.tree.find("ul ul[show='true']").show();	
				this.tree.find("ul ul[show='true']").prev("li").addClass("open");	
			}
			
			
			this.find("a").click(function(){ $(this).parents("li").click(); return false; });
			
			
			this.find("li").click(function(){
				
				
				var a=$(this).find("a")[0];
				if(typeof(a)!="undefined")
					option.click(a);	
				
				
				if($(this).next("ul").attr("show")=="true"){
					$(this).next("ul").attr("show","false");					
				}else{
					$(this).next("ul").attr("show","true");
				}
				
				
				option._init();
			});
			
			this.find("li").hover(
				function(){
					$(this).addClass("hover");
				},
				function(){
					$(this).removeClass("hover");
				}
			);
			
		
			this.find("ul").prev("li").addClass("folder");
			//prev() 方法返回被选元素的前一个同级元素。
			
			this.find("li").find("a").attr("hasChild",false);
			this.find("ul").prev("li").find("a").attr("hasChild",true);
			
			
			option._init();
			
		}/* SimpleTree Function End */
		
	});
});

$(function(){
    $(".st_tree").SimpleTree({
        click:function(a){
            if(!$(a).attr("hasChild"))
                Dialog.alert($(a).attr("ref"));
        }
    });
});

function moveOption(e1, e2){ 
    try{ 
        for(var i=0;i<e1.options.length;i++){ 
                if(e1.options[i].selected){ 
                    var e = e1.options[i]; 
                        e2.options.add(new Option(e.text, e.value)); 
                            e1.remove(i); 
                                ii=i-1 
                } 
          } 
        document.myform.city.value=getvalue(document.myform.list2); 
    } 
    catch(e){} 
} 

function getvalue(geto){ 
    var allvalue = ""; 
        for(var i=0;i<geto.options.length;i++){ 
                allvalue +=geto.options[i].value + ","; 
            } 
        return allvalue; 
     } 



$('#tabs li').click(function() {
    var i = $(this).index();//下标第一种写法
    //var i = $('tabs').index(this);//下标第二种写法
    $(this).addClass('current').siblings().removeClass('current');
    
    $('#menu_content_box div.menu_table').eq(i).show().siblings().hide();  
    
    if($('#menu_content_box #tab2').is(":visible")==false){
    	$('#box_gray').show();
    }else{
    	$('#box_gray').hide();
    }
    
});

/*文档关联*/
$('#document_tabs li').click(function() {
    var i = $(this).index();//下标第一种写法
    //var i = $('tabs').index(this);//下标第二种写法
  
    if(i == 1) {
    	$(this).addClass('current').siblings().removeClass('current');
    	$('#document_menu_content_box div.menu_table').eq(i).show().siblings().hide();
    	if(flowSE.length ==0){
    		document.getElementById("flowyincang").innerHTML = bdip4dLang[langType]["-15316"];
			document.getElementById("page_tableFlow").style.display = "none";//innerHTML = "无绑定流程！";
			document.getElementById("page_table_search_Flow").style.display = "none";
			document.getElementById("page_barFlow").style.display = "none";
		} else {
			document.getElementById("flowyincang").innerHTML = "";
			document.getElementById("page_tableFlow").style.display = "block";
			FlowShow.docDetail(flowSE);
			document.getElementById("page_table_search_Flow").style.display = "block";
			document.getElementById("page_barFlow").style.display = "block";
		}   
    } else {
    	 $(this).addClass('current').siblings().removeClass('current');
    	 $('#document_menu_content_box div.menu_table').eq(i).show().siblings().hide();
    	
    }
   
});



$(".btn_1").click(function(){
    var parentIndex=$(this).parent().index()
    $(".farther .class-2").eq(parentIndex).toggle()
    
})
$(".btn_2").click(function(){
	var parentIndex=$(this).parent().index()
	$(".class-3").eq(parentIndex).toggle()
	/* $(this).parent().children(".class-3").toggle()*/
})
$(".btn_3").click(function(){
	var parentIndex=$(this).parent().index()
	$(".class-4").eq(parentIndex).toggle()
    /*$(this).parent().children(".class-4").toggle()*/
})

$(".checkbox-1").click(function(){
    var parentIndex=$(this).parent().index();
      var isChecked = $(this).prop("checked");
    $(".farther .class-2").eq(parentIndex).find("input").prop("checked", isChecked);
})
$(".checkbox-2").click(function(){
	var parentIndex=$(this).parent().index();
    var isChecked = $(this).prop("checked");
    $(".class-3").eq(parentIndex).find("input").prop("checked", isChecked);
    /*var parentIndex=$(this).parent().index();
      var isChecked = $(this).prop("checked");
    $(this).parent().find("input").prop("checked", isChecked);*/
})
$(".checkbox-3").click(function(){
	var parentIndex=$(this).parent().index();
    var isChecked = $(this).prop("checked");
   $(".farther .class-4").eq(parentIndex).find("input").prop("checked", isChecked);
    /*var parentIndex=$(this).parent().index();
      var isChecked = $(this).prop("checked");
    $(this).parent().find("input").prop("checked", isChecked);*/
})









/*//收缩功能
$("#hytable tbody tr ").on("click","td>img",function () {
    var classname=$(this).attr("class")
    classname="."+classname.substring(2,classname.length);
    // alert(classname)
    if($(this).attr("src")=="../../img/filter/st_icon.png"){
        $("#hytable tbody").children(classname).hide();
        $(this).attr("src","../../img/filter/st_icon_open.png")
    }else{
        $("#hytable tbody").children(classname).show();
        $("#hytable tbody").children(classname).children("td").children("img:first").attr("src","../static/img/down.png")
        $(this).attr("src","../static/img/down.png")
    }
})
*/
//数组去重
function unique1(array){ 
	var n = []; //一个新的临时数组 
	//遍历当前数组 
	for(var i = 0; i < array.length; i++){ 
		//如果当前数组的第i已经保存进了临时数组，那么跳过， 
		//否则把当前项push到临时数组里面 
		if (n.indexOf(array[i]) == -1) n.push(array[i]); 
	} 
	return n; 
}
//XX
function chooseDbidYes() {
	var returnDbids = new Array();
	
	var zNtree = bimOriginFilter.zTree.getCheckedNodes();
	for(var i = 0 ; i < zNtree.length ; i++) {
		
			returnDbids.push(zNtree[i].dbids);
		
		
	}
	
	return returnDbids;
}

var bimOriginFilter = {
	btnElement : null,
	btnFilterAndCollect : null, // fcq 过滤收藏按钮
	beVisible : false,
	currentModelid : null,
	currentModelversion : null,
	zNodestemp : null,/***zTree数据**/
	zTree : null,/***zTree对象**/
	rMenu : null,/***zTree的右键对象**/
	setting : null,/***中zTree的属性配置对象**/
	zNodesOther : null,/***zTree数据**/
	zTreeOther : null,/***zTree对象**/
	rMenuOther : null,/***zTree的右键对象**/
	settingOther : null,/***中zTree的属性配置对象**/
	/*** 初始化参数 **/
	initialize : function () {
		var viewerToolbar = BimBdip.view.getToolbar(true);
		var ctrlGroup=viewerToolbar.getControl("bimbdip_viewToolBar");
		var button = ctrlGroup.getControl('bimbdip_button_filter');
//		bimOriginFilter.btnElement = button.container;
		bimOriginFilter.btnFilterAndCollect = ctrlGroup.getControl('toolbar-pengpeng').container;
		
		/*** 模型信息 **/
		bimOriginFilter.currentModelid = BimBdip.lvmid;
		bimOriginFilter.currentModelversion = BimBdip.modelVersion;
		
		/*** 初始化zTree全局变量 **/
		bimOriginFilter.zNodestemp = null;
		bimOriginFilter.zTree = null;
		bimOriginFilter.rMenu = null;
		bimOriginFilter.setting = {
			async :{
				enable : true,
				autoParam : ["lvmid","dbids","typeName","modelversion"],
				contentType:"application/x-www-form-urlencoded",
				url : publicJS.tomcat_url+"/modelSearchCondition.action",
				type : "post",
				async:false,
				dataType : "json",
				dataFilter : bimOriginFilter.ajaxDataFilter
			},
			view: {
				selectedMulti: false
			},	
			edit: {
				enable: true,
				editNameSelectAll: true,
				showRemoveBtn: false,
				showRenameBtn: false
			},
			data: {
				simpleData: {
					enable: true
				},
				keep:{
					parent:true,
					leaf:true
				}
			},
			check: {
				enable: true,
				chkStyle: "checkbox",
				chkboxType: {"Y":"s","N":"s"}
			},
			callback: {
				beforeAsync: bimOriginFilter.zTreeBeforeAsync,
				onAsyncError: bimOriginFilter.zTreeOnAsyncError,
				onAsyncSuccess: bimOriginFilter.zTreeOnAsyncSuccess,
				beforeDrag: bimOriginFilter.beforeDrag,
				beforeDrop: bimOriginFilter.beforeDrop,
				//onRightClick: bimOriginFilter.OnRightClick,
				beforeClick: bimOriginFilter.beforeClick,
				onClick: bimOriginFilter.onClick,
				beforeCheck: bimOriginFilter.beforeCheck,
				onCheck: bimOriginFilter.onCheck
			}
		};
		
		bimOriginFilter.zNodesOther = null;
		bimOriginFilter.zTreeOther = null;
		bimOriginFilter.rMenuOther = null;
		bimOriginFilter.settingOther = {
			view: {
				selectedMulti: false
			},	
			edit: {
				enable: true,
				editNameSelectAll: true,
				showRemoveBtn: false,
				showRenameBtn: false
			},
			data: {
				simpleData: {
					enable: true
				},
				keep:{
					parent:true,
					leaf:true
				}
			},
			callback: {
				beforeRemove: bimOriginFilter.beforeRemoveOther,
				beforeRename: bimOriginFilter.beforeRenameOther,
//				beforeDrag: bimOriginFilter.beforeDragOther,
//				beforeDrop: bimOriginFilter.beforeDropOther,
//				onDrop: bimOriginFilter.onDropOther,
				onRightClick: bimOriginFilter.OnRightClickOther,
				beforeClick: bimOriginFilter.beforeClickOther,
				onClick: bimOriginFilter.onClickOther
			}
		};
	},
	//显示切换
	setVisibleForFilter : function (show){
		bimOriginFilter.beVisible = show;
//		bimOriginFilter.btnElement.classList.toggle('active');
		if(show){
			/*$(window.parent.document).find('.gray').show();*/
			$('.filter_box').show();	
			$('.gray').show();	
			bimOriginFilter.loadTreeOther();
			if(typeof(filterExecute)!=undefined && filterExecute!=null){
				filterExecute.modelAttributeTypes();				
			}
		}else{
			$('.filter_box').hide();
			$('.gray').hide();	
		}
	},
	//按钮事件控制函数
	toggleVisibilityForFilter : function (){
		bimOriginFilter.setVisibleForFilter(!bimOriginFilter.beVisible);
	},
	hideButtonForFilter : function (){
		$('.filter_box').hide();
    	bimOriginFilter.beVisible = false;
//		$(bimOriginFilter.btnElement).removeClass('active');
//		$(bimOriginFilter.btnElement).addClass('inactive');
		
		$(bimOriginFilter.btnFilterAndCollect).removeClass('active').addClass('inactive');
	},
	doStartFilter : function (){
		bimOriginFilter.initialize();
		bimOriginFilter.toggleVisibilityForFilter();
	},
	/***************************************zTree  starting***************************************/
	getAsyncUrl : function (){
		var asyncUrl = publicJS.tomcat_url+"/modelSearchCondition";
		
		return asyncUrl;
	},
	
	ajaxDataFilter : function (treeId, parentNode, responseData){
		var zNodess = new Array(); 
		for(var i = 0 ; i < responseData.length;i++) {
         	zNodess.push(responseData[i]);
         }
		console.log(zNodess);
		return zNodess;
	},
	
	zTreeBeforeAsync : function (treeId, treeNode){
		if(treeNode && treeNode.isParent){
			return true;
		}
		return false;
	},
	zTreeOnAsyncError : function (event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
	    console.log(bdip4dLang[langType]["-15317"]+XMLHttpRequest);
	},
	zTreeOnAsyncSuccess : function (event, treeId, treeNode, msg) {
		//debugger;
		console.log(treeNode);
		bimOriginFilter.zTree.updateNode(treeNode);
		/*for (var num = 0;num < BimBdip.view.getSelection().length; num++) {//forge3.1.1 (数组) oViewer.getAggregateSelection()[0].selection;
			filterExecute.checkMenuDbid(BimBdip.view.getSelection()[num]);
		}
		fd.append("dbIds",filterExecute.finaldbids);
		fd.append("typeName","标高");//标高
		fd.append("path","D:\\BdipMaster\\Nginx\\html\\filebim\\wendang\\2\\model\\201711\\DEMO\\model.sdb");
		var htmlall = "<ul>";
		var html = "";
		
        $.ajax({
            url:'http://127.0.0.1:8081/bim-bdip-cloud-home-biz-web/attribute/modelSearchCondition',
            type:'post',
            data:fd,
            async:false,
            processData:false,
            contentType : false,   
            dataType:'json',
            success : function(data){
                if(data.code == "200"){
                debugger;
                console.log(data.data);
                var zNodes = new Array();
                for(var i = 0 ; i < data.data.length;i++) {
                	zNodes.push(JSON.parse(data.data[i]));
                }

                bimOriginFilter.initialize();
    			bimOriginFilter.loadTree(zNodes);

                    
                }
            }
        })    */
		
		console.log(bdip4dLang[langType]["-15318"]+msg);
	},
	
	//异步刷新树
	refreshParentNode : function (targetNode){
		//console.log("待异步刷新的父节点："+targetNode);
		//console.log("待异步刷新的父节点（详细信息）："+JSON.stringify(targetNode));
		var reloadType = "refresh";
		var isSilent = false;
		bimOriginFilter.zTree.reAsyncChildNodes(targetNode, reloadType, isSilent);  
	},
	
	//节点复选框被勾选之前的事件	
	beforeCheck : function (treeId, treeNode){
		return true;
	},
	//节点复选框勾选时的事件
	onCheck : function (event, treeId, treeNode){
		if (!treeNode.checked) {
			var parentNodes = treeNode.getPath();
			bimOriginFilter.allGoneParent(parentNodes);
		}else{
			var papaNode = treeNode.getParentNode();
			bimOriginFilter.loopCheck(papaNode);
		}
	},
	loopCheck : function (papaNode){
		if(papaNode!=null){
			var allDo = true;
			var allChild = papaNode.children;
			if(allChild && allChild.length>0){
				for (var i = 0; i < allChild.length; i++) {
					if (allChild[i].checked) {
						continue;
					}else{
						allDo = false;
						break;
					}
				}
			}
			if(allDo){
				papaNode.checked = true;
				bimOriginFilter.zTree.updateNode(papaNode,false);
				papaNode = papaNode.getParentNode();
				bimOriginFilter.loopCheck(papaNode);
			}else{
				var parentNodes = papaNode.getPath();
				bimOriginFilter.allGoneParent(parentNodes);
			}
		}
	},
	allGoneParent : function (parentNodes){
		if(parentNodes && parentNodes.length>0){
			for (var i = 0; i < parentNodes.length; i++) {
				parentNodes[i].checked = false;
				bimOriginFilter.zTree.updateNode(parentNodes[i],false);
			}
		}
	},
	//移入函数
	beforeDrag : function (treeId, treeNodes) {
		return false;
	},
	//移出函数
	beforeDrop : function (treeId, treeNodes, targetNode, moveType) {
		return false;
	},

	//移入函数2
	beforeDragOther : function (treeId, treeNodes) {
		return true;
	},
	//移出函数2
	beforeDropOther : function (treeId, treeNodes, targetNode, moveType) {
		return targetNode ? targetNode.drop !== false : true;
	},
	//拖拽函数（树2）
	onDropOther : function (event, treeId, treeNodes, targetNode, moveType){
		if(!treeNodes || treeNodes.length==0){
			return;
		}
		
		var dragNode = treeNodes[0];
		var msg = bdip4dLang[langType]["-15319"];
		var fid = "0";
		if(targetNode){
			fid = targetNode.id;
			msg = bdip4dLang[langType]["-15320"];
		}
		Dialog.confirm(
			msg,
			function(){
				bimOriginFilter.dropNode(fid,dragNode.id,targetNode);
			},function (){
				bimOriginFilter.loadTreeOther();
			}
		);
	},
	//拖拽后执行后台
	dropNode : function (fid,id,targetNode) {
		$.ajax({
	    	  url:publicJS.tomcat_url+"/updateTree.action?id="+id+"&pId="+fid,
	    	  type:"GET",
	    	  dataType:"text",
	    	  processData:false,
	    	  contentType:false,
	    	  success:function(){
	    		  setTimeout(function(){
	    			  bimOriginFilter.loadTreeOther();
				  },500);
	    	  },
	    	  error:function(){
	    		  Dialog.alert(bdip4dLang[langType]["-15321"]);
	    		  setTimeout(function(){
	    			  bimOriginFilter.loadTreeOther();
				  },500);
	    	  }
	     });
	},
	
	/***点击事件之前的操作**/
	beforeClick : function (treeId, treeNode){
		return true;
	},
	/***每个视点图节点的点击事件****/
	onClick : function (event, treeId, treeNode){
		//BimBdip.view.model.clearThemingColors();
		bimOriginFilter.refreshParentNode(treeNode);
		bimOriginFilter.loopCheck(treeNode);
		var fitdbids = treeNode.dbids.split(",");
		var dbid = new Array();
		for(var i = 0 ; i < fitdbids.length;i++) {
            var dbiduse = fitdbids[i] - 0;
            dbid.push(dbiduse);
           // BimBdip.view.setColorMaterial(dbiduse,"0xFFA400");
        }
		if(BimBdip.view.getSelection().length == 0) {
        	BimBdip.view.select(dbid);
        }
		BimBdip.view.fitToView(dbid);
        
	},
	
	/***点击事件之前的操作2**/
	beforeClickOther : function (treeId, treeNode){
		return !treeNode.isParent;
	},
	/***每个视点图节点的点击事件2****/
	onClickOther : function (event, treeId, treeNode){
		//debugger;
		console.log(treeNode);
		var lmvid_one = treeNode.lmvid;
		var modelversion_one = treeNode.modelversion;
		var lmvid = BimBdip.lvmid;
		var modelversion = BimBdip.modelVersion;
		if(lmvid==lmvid_one&&modelversion ==modelversion_one) {
			var dbid = treeNode.dbids.split(",");
			var userDbids = new Array();
			for(var i = 0 ,leni = dbid.length; i < leni ; i++ ) {
				userDbids.push(dbid[i]-0);
			}
			BimBdip.view.clearSelection();
			BimBdip.view.select(userDbids);
		} else {
			Dialog.alert(bdip4dLang[langType]["-15322"]);
		}
	},

	/**右键菜单相关**/
	OnRightClick : function (event, treeId, treeNode) {
		if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
			bimOriginFilter.zTree.cancelSelectedNode();
			bimOriginFilter.showRMenu("root", event.clientX, event.clientY);
		} else if (treeNode && !treeNode.noR) {
			bimOriginFilter.zTree.selectNode(treeNode);
			if(treeNode.isParent){
				bimOriginFilter.showRMenu("parent", event.clientX, event.clientY);
			} else {
				bimOriginFilter.showRMenu("node", event.clientX, event.clientY);
			}
		}
	},
	showRMenu : function (type, x, y) {
		$("#rMenu_origin_filter ul").show();
		if (type=="root") {
			$("#origin_f_add").show();
			$("#origin_f_del").hide();
			$("#origin_f_ren").hide();
		} else if (type=="parent"){
			$("#origin_f_add").show();
			$("#origin_f_del").show();
			$("#origin_f_ren").show();
		} else {
			$("#origin_f_add").hide();
			$("#origin_f_del").show();
			$("#origin_f_ren").show();
		}
		bimOriginFilter.rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});
		$("body").bind("mousedown", bimOriginFilter.onBodyMouseDown);
	},
	
	/**右键菜单相关2**/
	OnRightClickOther : function (event, treeId, treeNode) {
		//debugger
		if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
			bimOriginFilter.zTreeOther.cancelSelectedNode();
			bimOriginFilter.showRMenuOther("root", event.clientX, event.clientY);
			console.log("clientX:"+ event.clientX, event.clientY);
		} else if (treeNode && !treeNode.noR) {
			bimOriginFilter.zTreeOther.selectNode(treeNode);
			if(treeNode.isParent){
				bimOriginFilter.showRMenuOther("parent", event.clientX, event.clientY);
			} else {
				bimOriginFilter.showRMenuOther("node", event.clientX, event.clientY);
			}
		}
	},
	showRMenuOther : function (type, x, y) {
		$("#rMenu_originOther_filter ul").show();
		var realX = x- $('#filterPosition').position().left ;
		console.log('realX:'+realX);
		if (type=="root") {
			$("#originOther_f_addPlanDir").show();
			$("#originOther_f_delPlan").hide();
			$("#originOther_f_renPlan").hide();
		} else if (type=="parent"){
			$("#originOther_f_addPlanDir").show();
			$("#originOther_f_delPlan").show();
			$("#originOther_f_renPlan").show();
		} else {
			$("originOther_f_addPlanDir").hide();
			$("#originOther_f_delPlan").show();
			$("#originOther_f_renPlan").show();
		}
		bimOriginFilter.rMenuOther.css({"top":y+"px", "left":realX+"px", "visibility":"visible"});
		$("body").bind("mousedown", bimOriginFilter.onBodyMouseDown);
	},
	
	hideRMenu : function () {
		if (bimOriginFilter.rMenu) bimOriginFilter.rMenu.css({"visibility": "hidden"});
		if (bimOriginFilter.rMenuOther) bimOriginFilter.rMenuOther.css({"visibility": "hidden"});
		$("body").unbind("mousedown", bimOriginFilter.onBodyMouseDown);
	},
	onBodyMouseDown : function (event){
		if (!(event.target.id == "rMenu_origin_filter" || $(event.target).parents("#rMenu_origin_filter").length>0)) {
			if(bimOriginFilter.rMenu) bimOriginFilter.rMenu.css({"visibility" : "hidden"});
		}
		if (!(event.target.id == "rMenu_originOther_filter" || $(event.target).parents("#rMenu_originOther_filter").length>0)) {
			if(bimOriginFilter.rMenuOther) bimOriginFilter.rMenuOther.css({"visibility" : "hidden"});
		}
	},
	/*** 销毁zTree **/
	clearTree : function () {
		if(bimOriginFilter.zTree){
			bimOriginFilter.zTree.destroy();
		}
	},
	/*** 销毁zTree2 **/
	clearTree : function () {
		if(bimOriginFilter.zTreeOther){
			bimOriginFilter.zTreeOther.destroy();
		}
	},
	/**加载树执行函数**/
	loadTree : function (zNodes){
		/***获取数据**/
		bimOriginFilter.zNodestemp = bimOriginFilter.loadTreeData(zNodes);
		/***开始生成树**/
		$.fn.zTree.init($("#treeDemo_origin_filter"), bimOriginFilter.setting, bimOriginFilter.zNodestemp);
		bimOriginFilter.zTree = $.fn.zTree.getZTreeObj("treeDemo_origin_filter");
		bimOriginFilter.rMenu = $("#rMenu_origin_filter");
		/***生成树结束，可以自由使用事先定义好的zTree函数**/
	},
	/**专职加载树状图数据源的函数**/
	loadTreeData : function (zNodes){
		
		
		
		return zNodes;
	},
	loadTreeOther : function (){
        var lmvid = BimBdip.lvmid;
        var modelversion = BimBdip.modelVersion;
		$.ajax({
			url:publicJS.tomcat_url+'/selectList.action?lmvid='+lmvid+'&modelversion='+modelversion,
			type:"GET",
			dataType:"json",
			success:function(obj){
				bimOriginFilter.rMenuOther = $("#rMenu_originOther_filter");
				bimOriginFilter.zNodesOther = obj;
				if(bimOriginFilter.zNodesOther && bimOriginFilter.zNodesOther.length>0){
					$.fn.zTree.init($("#treeDemo_originOther_filter"), bimOriginFilter.settingOther, bimOriginFilter.zNodesOther);
					bimOriginFilter.zTreeOther = $.fn.zTree.getZTreeObj("treeDemo_originOther_filter");
				}else{
					bimOriginFilter.zNodesOther = JSON.parse("[]");
					$.fn.zTree.init($("#treeDemo_originOther_filter"), bimOriginFilter.settingOther, bimOriginFilter.zNodesOther);
					bimOriginFilter.zTreeOther = $.fn.zTree.getZTreeObj("treeDemo_originOther_filter");
				}
			},
			error:function(){
				Dialog.alert(bdip4dLang[langType]["-15323"]);
			}
		});

	},
	addPlanDir : function () {
		bimOriginFilter.hideRMenu();
		var id = 0;
		var fid = 0;
		var parentNode = null;
		var newNode = null;
		if (bimOriginFilter.zTreeOther) {
			if(bimOriginFilter.zTreeOther.getSelectedNodes()[0] && bimOriginFilter.zTreeOther.getSelectedNodes()[0].isParent){
				fid = bimOriginFilter.zTreeOther.getSelectedNodes()[0].id;
				parentNode = bimOriginFilter.zTreeOther.getSelectedNodes()[0];
			}
		}
		var name = bdip4dLang[langType]["-15324"];
		//保存到数据库
	  	$.ajax({
    	  	url:publicJS.tomcat_url+"/saveFilter.action?lmvid="+bimOriginFilter.currentModelid+"&modelversion="+bimOriginFilter.currentModelversion+"&conditionName="+name+"&treeId="+fid+"&nodeType=1&ifOpen=0&ifDrag=1&ifDrop=1", 
    	  	type:"POST",
    	  	dataType:"text",
    	  	processData:false,
    	  	contentType:false,
    	  	success:function(obj){
				var result = obj;
	    	  	var targetJson = JSON.parse(result);
	    	  	id = targetJson.data.id;
			    newNode = {id:id, pId:fid, name:name, isParent:true, open:false};
			    bimOriginFilter.zTreeOther.addNodes(parentNode, newNode);
				var currentNode = bimOriginFilter.zTreeOther.getNodeByParam("id", id, parentNode);
				bimOriginFilter.zTreeOther.selectNode(currentNode);
				bimOriginFilter.zTreeOther.editName(currentNode);
    	  	},
    	  	error:function(){
    			Dialog.alert(bdip4dLang[langType]["-15325"]);
    	  	}
      	});
	},
	beforeRemoveOther : function (treeId, treeNode) {
		var id = treeNode.id;
		bimOriginFilter.deleteTreeOther(treeId, treeNode, id);
	},
	deleteTreeOther : function (treeId, treeNode, id) {
		$.ajax({
	    	  url:publicJS.tomcat_url+"/deleteFilter.action?id="+id,
	    	  type:"GET",
	    	  dataType:"text",
	    	  processData:false,
	    	  contentType:false,
	    	  success:function(){
	    		  bimOriginFilter.loadTreeOther();
			  	  return true;	 		
	    	  },
	    	  error:function(){
	    		  Dialog.alert(bdip4dLang[langType]["-15326"]);
	    		  return false;
	    	  }
	     });
	}, 
	removePlan : function () {
		bimOriginFilter.hideRMenu();
		var nodes = bimOriginFilter.zTreeOther.getSelectedNodes();
		if (nodes && nodes.length>0) {
			if (nodes[0].isParent) {
				var msg = bdip4dLang[langType]["-15327"];
				if(nodes[0].children && nodes[0].children.length>0){
					msg = bdip4dLang[langType]["-15328"];
				}
				Dialog.confirm(msg,function(){
					bimOriginFilter.beforeRemoveOther("#treeDemo_originOther_filter",nodes[0]);
					bimOriginFilter.zTreeOther.removeNode(nodes[0]);

		    		//tzw  删除“按过滤结果显示” 中的数据，父节点根据treeid删除
		    		bimFileterColoring.deleteFilterResultByTreeid(nodes[0].id);
				});
			} else {
				var msg = bdip4dLang[langType]["-15329"];
				Dialog.confirm(msg,function(){
					bimOriginFilter.beforeRemoveOther("#treeDemo_originOther_filter",nodes[0]);
					bimOriginFilter.zTreeOther.removeNode(nodes[0]);

	    		    //tzw  删除“按过滤结果显示” 中的数据，子节点根据filterid删除
	    		    bimFileterColoring.deleteFilterResultByFilterid(nodes[0].id);
				});
			}
		}
	},
	beforeRenameOther : function (treeId, treeNode, newName, isCancel) {
		var id = treeNode.id;
		var fid = 0;
		if(treeNode.getParentNode()){
			fid = treeNode.getParentNode().id;
		}
		if (newName.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
			Dialog.alert(bdip4dLang[langType]["-15330"]);
			setTimeout(function() {
				bimOriginFilter.zTreeOther.cancelEditName();
				//Dialog.alert("新名称不能为空");
			}, 1000);
			return false;
		} else {
			return bimOriginFilter.editTreeOther(treeId, treeNode, newName, isCancel, fid, id);
		}
	},
	editTreeOther : function (treeId, treeNode, newName, isCancel, fid, id) {
		newName = encodeURI(newName);
		$.ajax({
	    	  url:publicJS.tomcat_url+"/updateFilter.action?id="+id+"&conditionName="+newName,
	    	  type:"GET",
	    	  dataType:"text",
	    	  processData:false,
	    	  contentType:false,
	    	  success:function(){
	    		  bimOriginFilter.loadTreeOther();
	    		  
	    		  //tzw  修改名称，着色也跟着修改
	    		  bimFileterColoring.updateFilterResultName(id,newName);
    			  return true;
	    	  },
	    	  error:function(){
	    		  bimOriginFilter.zTreeOther.cancelEditName();
	    		  Dialog.alert(bdip4dLang[langType]["-15331"]);
	    		  return false;
	    	  }
	     });
	},
	renamePlan : function () {
		bimOriginFilter.hideRMenu();
		var nodes = bimOriginFilter.zTreeOther.getSelectedNodes();
		if (nodes && nodes.length>0) {
			bimOriginFilter.zTreeOther.selectNode(nodes[0]);
			bimOriginFilter.zTreeOther.editName(nodes[0]);//重命名方法
		}
	},
	/***************************************zTree  ending***************************************/
	
	/***************************************other  starting***************************************/
	//反选
	contreChooseOld : function () {
		var checkedNodes = bimOriginFilter.zTree.getCheckedNodes(true);
		var unCheckedNodes = bimOriginFilter.zTree.getCheckedNodes(false);
		if(checkedNodes && checkedNodes.length>0){
			if(unCheckedNodes && unCheckedNodes.length>0){
				//反选为部分选中
				var arr = new Array();
				for(var i=0;i<checkedNodes.length;i++){
					var tempParentNode = checkedNodes[i].getParentNode();
					if(arr.indexOf && typeof(arr.indexOf)=='function'){
				        var index = arr.indexOf(tempParentNode);
				        if(index == -1){
				        	arr.push(tempParentNode);
				        }
				    }
				}
				if(arr && arr.length>0){
					if(arr.indexOf && typeof(arr.indexOf)=='function'){
				        var index = arr.indexOf(null);
				        if(index >= 0){
				        	var targetNodes = bimOriginFilter.zTree.getNodes();
							if(targetNodes && targetNodes.length>0){
								for(var k=0;k<targetNodes.length;k++){
									if(targetNodes[k].checked){
										bimOriginFilter.zTree.checkNode(targetNodes[k],false,true,true);
									}else{
										bimOriginFilter.zTree.checkNode(targetNodes[k],true,true,true);
									}
								}
							}
				        }else{
				        	for(var j=0;j<arr.length;j++){
				        		var targetNode = arr[j];
				        		var parents = targetNode.getPath();
				        		if(parents && parents.length>0){
				        			var beNeedContinue = true;
				        			for(var m=0;m<parents.length-1;m++){
				        				if(arr.indexOf(parents[m])>=0){
				        					beNeedContinue = false;
				        					break;
				        				}
				        			}
				        			if(beNeedContinue){
				        				var childs = targetNode.children;
				        				if(childs && childs.length>0){
				        					for(var n=0;n<childs.length;n++){
				        						if(childs[n].checked){
													bimOriginFilter.zTree.checkNode(childs[n],false,true,true);
												}else{
													bimOriginFilter.zTree.checkNode(childs[n],true,true,true);
												}
				        					}
				        				}
				        			}
				        		}
							}
				        }
				    }
				}
			}else{
				//反选为全不选
				bimOriginFilter.zTree.checkAllNodes(false);
			}
		}else{
			//反选为全选
			bimOriginFilter.zTree.checkAllNodes(true);
		}
	},
	contreChoose : function () {
		var checkedNodes = bimOriginFilter.zTree.getCheckedNodes(true);
		var unCheckedNodes = bimOriginFilter.zTree.getCheckedNodes(false);
		if(checkedNodes && checkedNodes.length>0){
			if(unCheckedNodes && unCheckedNodes.length>0){
				//建立选中黑名单
				var beIncludeRootNode = false;
				var blackMenu = new Array();
				for(var i=0;i<checkedNodes.length;i++){
					if(blackMenu.indexOf && typeof(blackMenu.indexOf)=='function'){
						if(checkedNodes[i].parentTId==null){//根节点，父类节点只有null
							if(blackMenu.indexOf(null) == -1){
					        	blackMenu.push(null);
					        }
							beIncludeRootNode = true;
						}else{
							var parentNodes = checkedNodes[i].getPath();
							if(parentNodes && parentNodes.length>0){
								for(var ii=0;ii<parentNodes.length-1;ii++){
									if(!parentNodes[ii].checked){
								        if(blackMenu.indexOf(parentNodes[ii]) == -1){
								        	blackMenu.push(parentNodes[ii]);
								        }
								    }
								}
							}
						}
					}
				}
				if(blackMenu && blackMenu.length>0){
					if(blackMenu.indexOf && typeof(blackMenu.indexOf)=='function'){
						if(!beIncludeRootNode){
							for(var j=0;j<unCheckedNodes.length;j++){
						        if(blackMenu.indexOf(unCheckedNodes[j]) == -1 && !bimOriginFilter.beExistMenu(unCheckedNodes[j],blackMenu)){
						        	bimOriginFilter.zTree.checkNode(unCheckedNodes[j],true,true,true);
						        }
							}
						}else{
							var targetNodes = bimOriginFilter.zTree.getNodes();
							if(targetNodes && targetNodes.length>0){
								for(var k=0;k<targetNodes.length;k++){
									if(targetNodes[k].checked){
										bimOriginFilter.zTree.checkNode(targetNodes[k],false,true,true);
									}else{
										if(blackMenu.indexOf(targetNodes[k]) == -1){
											bimOriginFilter.zTree.checkNode(targetNodes[k],true,true,true);
										}
									}
								}
							}
						}
						for(var jj=0;jj<blackMenu.length;jj++){
							if(blackMenu[jj]!=null){
								var childs = blackMenu[jj].children;
								if(childs && childs.length>0){
									for(var kk=0;kk<childs.length;kk++){
										if(childs[kk].checked){
											bimOriginFilter.zTree.checkNode(childs[kk],false,true,true);
										}else{
											if(blackMenu.indexOf(childs[kk]) == -1){
												bimOriginFilter.zTree.checkNode(childs[kk],true,true,true);
											}
										}
									}
								}
							}
						}
					}
				}
			}else{
				//反选为全不选
				bimOriginFilter.zTree.checkAllNodes(false);
			}
		}else{
			//反选为全选
			bimOriginFilter.zTree.checkAllNodes(true);
		}
	},
	beExistMenu : function(unCheckedNode,blackMenu){
		if(blackMenu==null || blackMenu.length==0){
			return false;
		}
		if(unCheckedNode.getParentNode()==null){
			return false;
		}else{
			var parentNodes = unCheckedNode.getPath();
			if(parentNodes && parentNodes.length>0){
				if(blackMenu.indexOf && typeof(blackMenu.indexOf)=='function'){
					for(var ii=0;ii<parentNodes.length-1;ii++){
				        if(blackMenu.indexOf(parentNodes[ii]) >= 0){
				        	return true;
				        }
				    }
				}
			}  
		}
		return false;

	}
	/***************************************other  ending***************************************/
	
}





/* 定义遮罩层 出现*/
function globalShade()  
{  
    //获取页面的高度和宽度  	
    if(window.parent.document.getElementById('mask'))  
        {     
          
        window.parent.document.getElementById('mask').style.display="block";  
      
        }  
    if(document.getElementById("maskIframe"))  
        {  
            document.getElementById("maskIframe").style.display="block";  
              
          
        }  
      
          
};  
/* 定义遮罩消失 */
function deleteGlobalShade()  
{  
    if(window.parent.document.getElementById('mask'))  
    {     
    window.parent.document.getElementById('mask').style.display="none";  
  
    }  
if(document.getElementById("maskIframe"))  
    {  
  
        document.getElementById("maskIframe").style.display="none";  
      
    }  
  
}; 

