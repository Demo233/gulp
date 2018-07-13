//自定义hashmap
function HashMap(){
    this.map = {};
}
HashMap.prototype = {
	put : function(key , value){
		this.map[key] = value;
	},
	isExist : function(key){
		if(this.map.hasOwnProperty(key)){
		    return true;
		}
		return false;
	},
	get : function(key){
		if(this.map.hasOwnProperty(key)){
		    return this.map[key];
		}
		return null;
	},
	remove : function(key){
		if(this.map.hasOwnProperty(key)){
		    return delete this.map[key];
		}
		return false;
	},
	removeAll : function(){
		this.map = {};
	},
	keySet : function(){
		var _keys = [];
		for(var i in this.map){
		    _keys.push(i);
		}
		return _keys;
	},
	size : function(){
		var count = 0;
		for(var i in this.map){
		    count++;
		}
		return count;
	}
};
HashMap.prototype.constructor = HashMap;
var checkedMap = new HashMap();
var successNum = 0;
var bimCollision = {
	btnElement : null,	
	currentCheckedNode : null,
	panelForClash : null,
	markupForClash : null,
	viewMode : true,
	onceEdit : false,
	beVisible : false,
	defaultFid : "0",
	viewType : "1",
	toolCount : 0,
	//显示碰撞点列表
	doCollision : function () {
		bimCollision.dockingPanelNone();
		bimCollision.init();
		toggleVisibilityForClash();
	},
	init : function(){
		var viewer = BimBdip.view;
		viewer.loadExtension('Autodesk.Viewing.MarkupsCore');
	    var config = {markupDisableHotkeys:false};
	  	bimCollision.markupForClash = new Autodesk.Viewing.Extensions.Markups.Core.MarkupsCore(viewer,config);
	  	bimCollision.markupForClash.load();
	    bimCollision.enterViewMode();
	    
	    var viewerToolbar = viewer.getToolbar(true);
		var ctrlGroup=viewerToolbar.getControl("bimbdip_viewToolBar");
		var button = ctrlGroup.getControl('bimbdip_button_collision');
		bimCollision.btnElement = button.container;
	},
	btn_markup : function(){
		if(bimCollision.toolCount==0){
			BimBdip.view.unloadExtension("Autodesk.ADN.Viewing.Extension.ClashPointMarkupTool",null);
			BimBdip.view.loadExtension("Autodesk.ADN.Viewing.Extension.ClashPointMarkupTool",null);
			bimCollision.panelForClash = BimBdip.view.loadedExtensions["Autodesk.ADN.Viewing.Extension.ClashPointMarkupTool"].getClashMarkup();
			bimCollision.toolCount = 1;
		}
	},
	getGuid : function () {
		var d = new Date().getTime();
		var guid = 'xxxx-xxxx-xxxx-xxxx'.replace(
				/[xy]/g,
				function (c) {
					var r = (d + Math.random() * 16) % 16 | 0;
					d = Math.floor(d / 16);
					return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
				});
		return guid;
	},
	randomWord : function (randomFlag, min, max) {
		var str = "",
		range = min,
		arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
		       'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
		       'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
		       'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 
		       'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 
			   'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 
			   'Y', 'Z'];
		// 随机产生
		if(randomFlag){
			range = Math.round(Math.random() * (max-min)) + min;
		}
		for(var i=0; i<range; i++){
			pos = Math.round(Math.random() * (arr.length-1));
			str += arr[pos];
		}
		return str;
	},
	getPreViewData : function (beforeCheckedNode) {
		var markup_id = bimCollision.randomWord(true,16,32);
		if(checkedMap.isExist(beforeCheckedNode.id)){
			var dataJson = checkedMap.get(beforeCheckedNode.id);
			var upd_mark="";
			var bef_mark=dataJson.markup;
			var markupArray = new Array();
			if(bef_mark.length>0){
				markupArray = bef_mark.split("@#@");
			}
			if(!bimCollision.viewMode){
				var markString = bimCollision.markupForClash.generateData().replace(/\"/g,"'");
				if(markString!=null && markString.length>0){
					upd_mark += markup_id+"@BIM@"+markString;
					markupArray.push(upd_mark);
				}
			}
			var markups = markupArray.join("@#@");
			dataJson.markup = markups;
			checkedMap.put(beforeCheckedNode.id,dataJson);
		}else{
			var randomId = bimCollision.getGuid();
			var tmpState=BimBdip.view.getState();
			var jsonString=JSON.stringify(tmpState).replace(/\"/g,"'");
			var dataUrl = BimBdip.view.getScreenShotBuffer();
			var imageString = bimCollision.dataURLtoBlob(dataUrl);
			var data_mark="";
			if(!bimCollision.viewMode){
				var markString = bimCollision.markupForClash.generateData().replace(/\"/g,"'");
				if(markString!=null && markString.length>0){
					data_mark += markup_id+"@BIM@"+markString;
				}
			}
			var targetJson = {
				"jsonString":jsonString,//定位数据
				"imageString":imageString,//截图数据
				"markup":data_mark,//涂鸦数据
				"guid":randomId,
				"add_id":randomId,
				"name":beforeCheckedNode.name,
				"fid":bimCollision.defaultFid,
				"urlString":BimBdip.view_modelUrl,
				"type" : bimCollision.viewType,
				"userid" : BimBdip.currentUserid,
				"username" : BimBdip.currentUsername,
				"modelid" : BimBdip.lvmid
			};
			checkedMap.put(beforeCheckedNode.id,targetJson);
		}
	},
	//转换baseUrl为Blob格式
	dataURLtoBlob : function (dataurl) {
		var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while(n--){
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {type:mime});
	},
	enterEditMode : function () {
		bimCollision.viewMode = false;
	    bimCollision.onceEdit = true;
	    bimCollision.markupForClash.show();
	    bimCollision.markupForClash.enterEditMode();
	},
	enterViewMode : function () {
		bimCollision.viewMode = true;
	    bimCollision.onceEdit = false;
	    bimCollision.markupForClash.leaveEditMode();
	    bimCollision.markupForClash.hide();
	},
	dockingPanelNone : function () {
		var markupClass = $(".markup");
        if(markupClass && markupClass.length>0){
            for(var i = 0;i<markupClass.length;i++){
                var mark = markupClass[i];
                mark.style.display = "none";
            }
        }
        //关闭视点保存
//        if(bimViewPoint && bimViewPoint.mainPanel){
//        	bimViewPoint.mainPanel.setVisible(false);
//        }
        if(bimViewPointNew){
        	bimViewPointNew.hiddenViewPoint();
        }
        //关闭历史回话
        if(bimHistory){
        	hideButtonForHistory();
        }
	}
	
}

	//上传碰撞点文件
	function ajax_clash_upload() {
		//验证是否是正确的碰撞点文件
		var canUpload = true;
		var msg = "文件类型错误（仅支持xml格式的文件）";
		var clashfiles = document.getElementById('clashReport').files;
		if(clashfiles && clashfiles.length>0){
			console.log("选择了文件数量："+clashfiles.length);
			for (var i = 0; i < clashfiles.length; i++) {
				var fileExt = clashfiles[i].name.replace(/.+\./, "").toLowerCase();
				if(fileExt != "xml"){
					canUpload = false;
					break;
				}
			}
		}else{
			msg = "";
			canUpload = false;
		}
		if(!canUpload){
			if(msg && msg.length>0){
				Dialog.alert(msg);
			}
			return;
		}
		
		var currentModelUrl = "";
		var currentModelid = "";
		if(BimBdip.be3DViewer){
			currentModelUrl = BimBdip.view_modelUrl;
			currentModelid = BimBdip.lvmid;
		}else{
			//currentModelUrl = BimBdip.model_2durl;
		}
		var userid = BimBdip.currentUserid;
		var username = BimBdip.currentUsername;
		// var userid = "001";
		// var username = "test";
		showMask(bdip4dLang[langType]["-15403"]+"...");
		$.ajaxFileUpload({
			url : publicJS.tomcat_url+'/ClashPoint_insertClashPoint.action?modelurl='+currentModelUrl+'&userid='+userid+'&username='+username+'&modelid='+currentModelid,
			fileElementId : 'clashReport',
			type : 'POST',
			dataType : 'JSON',
			secureuri : false,
			success : function(obj) {
				changeMask(bdip4dLang[langType]["-15404"]);
				changeMask(bdip4dLang[langType]["-15405"]);
				setTimeout(function(){
					hideMask();
					selectClashAll();
				},10000);
			},
			error : function(obj) {
				changeMask(bdip4dLang[langType]["-15406"]);
				hideMask();
			}
		});
	}
	
	//查询当前模型下的碰撞点列表
	function selectClashAll() {
		//如果涂鸦对象不为空，卸载涂鸦对象
		if(bimCollision.markupForClash){
			bimCollision.enterViewMode();
		}
 		bimCollision.currentCheckedNode = null;
 		checkedMap.removeAll();
		var currentModelUrl = "";
		var currentModelid = "";
		if(BimBdip.be3DViewer){
			currentModelUrl = BimBdip.view_modelUrl;
			currentModelid = BimBdip.lvmid;
		}else{
			//currentModelUrl = BimBdip.model_2durl;
		}
		$.ajax({
	        url:publicJS.tomcat_url+'/ClashPoint_selectAllClashPoint.action?modelurl='+currentModelUrl,
	        type:'POST',
	        dataType:'JSON',
	        timeout : 10000,
	        async: false,
	        success:function(data){
	        	if(data && data.length>0){
	        		showClashAll(data);
	        	} else {
	        		document.getElementById("clashRpt-tbody").innerHTML = "";
	        	}
	        },
	        error:function(obj){
				Dialog.alert(bdip4dLang[langType]["-15407"]+"!");
	        }
	    });
	}
	function showClashAll(data) {
		document.getElementById("clashRpt-tbody").innerHTML = "";
		var html = "";
		for(var i=0; i<data.length; i++) {
      		var objIdArray = new Array();
      		var layerArray = new Array();
      		var pathLinkArray = new Array();
      		var smartTagArray = new Array();
      		
      		var objIds = JSON.parse(data[i].objectId);
      		for(var j=0; j<objIds.length; j++){
      			var sub = objIds[j].objId;
      			if(sub && sub.length>0){
      				objIdArray.push(sub);		
      			}
		    }
		    var ids = objIdArray.join(",");
		    
      		var objLayers = JSON.parse(data[i].layer);
      		for(var xx = 0; xx < objLayers.length; xx++){
      			var sub = objLayers[xx].layer;
      			if(sub && sub.length>0){
      				layerArray.push(sub);
      			}
      		}
      		var layers = layerArray.join(",");
      		
      		var pathLinks = JSON.parse(data[i].pathLink);
		    for(var k=0; k<pathLinks.length; k++){
		    	var sub = pathLinks[k].pathLink;
      			if(sub && sub.length>0){
      				pathLinkArray.push(sub);		
      			}
		    }
		    var paths = pathLinkArray.join(",");
		    //var paths = "Object";
		    
		    var smartTags = JSON.parse(data[i].smartTags);
		    for(var yy = 0; yy < smartTags.length; yy++){
		    	var sub = smartTags[yy].projectName;
      			if(sub && sub.length>0){
      				smartTagArray.push(sub);
      			}
		    }
		    var tags = smartTagArray.join(",");
		    
      		html +='<tr>',
            html+='<td id="check"><input class="check_btn" type="checkbox" onclick="clashChecked(this)" name="answer" value="'+ids+'"  id="'+data[i].id+'" clashType="'+data[i].type+'" layers="'+layers+'" tags="'+tags+'"/></td>',
            html+='<td class="clashname" id="clashname" title="'+data[i].name+'">'+data[i].name+'</td>',
            html+='<td class="gridlocation" id="gridlocation" title="'+data[i].gridLocation+'">'+data[i].gridLocation+'</td>',
            html+='<td class="pathlink" id="pathlink" title="'+paths+'">'+paths+'</td>',
            html+='</tr>';
        }
        document.getElementById("clashRpt-tbody").innerHTML = html;
	}
	//碰撞点批量删除
	function btn_clashDelete() {
		var checkObjs = $("input[name='answer']:checked");
		var checkedNum = $("input[name='answer']:checked").length;
		if(checkedNum==0){
			layer.msg(bdip4dLang[langType]["-15408"]+"!",{icon:7,time:1000});
		   /* Dialog.alert("请至少选择一项!");*/
		    return false;
		}
		Dialog.confirm(bdip4dLang[langType]["-15409"]+"?",function(){
			var checkedList = new Array();
			for(var i=0; i<checkObjs.length; i++){
				var checkid = checkObjs[i].id;
			    checkedList.push(checkid);
			}
			var finalIds = checkedList.join(",");
			var fd = new FormData();
			fd.append("deleteIds",finalIds);
			$.ajax({
				url:publicJS.tomcat_url+'/ClashPoint_deleteClashPoint.action',
				type:"POST",
				data:fd,
				dataType:'JSON',
				processData:false,
				contentType:false,
			  	success:function(){
			  	    Dialog.alert(bdip4dLang[langType]["-15412"]+'!');
			  	    selectClashAll();
			  	},
			  	error:function(){
			  	    Dialog.alert(bdip4dLang[langType]["-15410"]+'!');
			  	}
			});
		},function(){
			Dialog.alert(bdip4dLang[langType]["-15411"]);
		});
	}
	
	//碰撞点批量转为视点
	function btn_clashSave() {
		if(bimCollision.currentCheckedNode){
			bimCollision.getPreViewData(bimCollision.currentCheckedNode);
			//如果涂鸦对象不为空，卸载涂鸦对象
			if(bimCollision.markupForClash){
				bimCollision.enterViewMode();
			}
			bimCollision.currentCheckedNode = null;
		}
		var checkObjs = $("input[name='answer']:checked");
		var checkedNum = $("input[name='answer']:checked").length;
		if(checkedNum==0){
			layer.msg(bdip4dLang[langType]["-15408"]+"!",{icon:7,time:1000});
			/*Dialog.alert("请至少选择一项!");*/
			return false;
		}else{
			var checkedList = new Array();
			for(var i=0; i<checkObjs.length; i++){
				var checkid = checkObjs[i].id;
				checkedList.push(checkid);
			}
			onSave(checkedList,checkedMap);
		}	
	}
	function onSave (checkedList,checkedMap) {
		var targetArray = new Array();
		for(var i = 0;i < checkedList.length;i++){
			if(checkedMap.isExist(checkedList[i])){
				targetArray.push(checkedMap.get(checkedList[i]));
			}
		}
		if(targetArray && targetArray.length>0){
			showMask(bdip4dLang[langType]["-15413"]+"...");
			saveAction(targetArray);
			var endIndex = setInterval(function(){
				if(successNum >= targetArray.length){
					clearInterval(endIndex);
					changeMask(bdip4dLang[langType]["-15414"]);
					hideMask();
					checkedMap.removeAll();
					var answer= document.getElementsByName("answer");
					for(var i=0;i<answer.length;i++){
						answer[i].checked = false;
					}
					successNum = 0;
				}
			}, 200);
		}else{
			showMask(bdip4dLang[langType]["-15415"]);
			hideMask();
		}
	}
	function saveAction (targetArray) {
		var timeIndex = setInterval(function(){
			saveActionOne(targetArray);
			if(successNum >= targetArray.length){
				clearInterval(timeIndex);
			}
		}, 1500);
	}
	function saveActionOne(targetArray){
		if(successNum>=targetArray.length){   
			return;  
		} 
		
		var fd = new FormData();
		var dataJson = targetArray[successNum];
		fd.append("jsonString",dataJson.jsonString);
		fd.append("image",dataJson.imageString);
		fd.append("markup",dataJson.markup);
		fd.append("guid",dataJson.guid);
		fd.append("add_id",dataJson.add_id);
		fd.append("name",dataJson.name);
		fd.append("fid",dataJson.fid);
		fd.append("url",dataJson.urlString);
		fd.append("type",dataJson.type);
		fd.append("userid",dataJson.userid);
		fd.append("username",dataJson.username);
		fd.append("modelid",dataJson.modelid);
		
		$.ajax({
			url:publicJS.tomcat_url+"/ViewerSave_clashToView.action",
			type:"POST",
			data:fd,
			dataType:"text",
			processData:false,
			contentType:false,
			async:false,
			cache:true,
			success:function(){
				successNum++;
			},
			error:function(){
				successNum++;
			}
		});
		
	}
	
	//每个碰撞点的点击事件
	function clashChecked(obj) {
		//保存之前的check的数据，如涂鸦，定位，截图等等转视点所需的数据			
		if(obj.checked==true){
			sureCheck();
			var splitString = "@#@";
			var checkId = obj.id;
			var objValue = obj.value;
			var clashType = obj.getAttribute("clashType");
			var layers = obj.getAttribute("layers").replace(/(^\s*)|(\s*$)/g, "").length==0 ? "0" : obj.getAttribute("layers").replace(/(^\s*)|(\s*$)/g, "");
			var tags = obj.getAttribute("tags").replace(/(^\s*)|(\s*$)/g, "").length==0 ? "0" : obj.getAttribute("tags").replace(/(^\s*)|(\s*$)/g, "");
			var tr = obj.parentNode.parentNode;  
			var tds = tr.cells;  
			var str = "";  
			for(var i = 0;i < tds.length;i++){  
				var tdid = tds[i].id;
				if (tdid=="clashname" || tdid=="gridlocation" || tdid=="pathlink") {  
					if(tds[i].innerHTML.replace(/(^\s*)|(\s*$)/g, "").length>0){
						str += tds[i].innerHTML + splitString;
					}else{
						str += "0" + splitString;
					}  
				}  
			}  
			str += layers + splitString + tags;
			
			if(bimCollision.currentCheckedNode==null){
				bimCollision.currentCheckedNode = {
					id:checkId,
					name:str
				};
			}else{
				bimCollision.getPreViewData(bimCollision.currentCheckedNode);
				//如果涂鸦对象不为空，卸载涂鸦对象
				if(bimCollision.markupForClash){
					bimCollision.enterViewMode();
				}
				bimCollision.currentCheckedNode = {
					id:checkId,
					name:str
				};
			}
			
			var guidArray = objValue.split(",");
			//需要通过guid获取dbid，放入tempArray
			var tempArray = [];
			for(var s=0; s<guidArray.length; s++){
				var sourceSingleId = guidArray[s];
				BimBdip.view.model.search(sourceSingleId, 
					function(idArray){
						tempArray.push(idArray[0]);
						if(s == guidArray.length){
							BimBdip.view.fitToView(tempArray);
							BimBdip.view.isolate(tempArray);
						}
					}
				);
			}
			
//			if(checkedMap.isExist(checkId)){
//				//Dialog.alert("当前选中的碰撞点："+currentCheckedNode.name+"，已经在缓存数据中，或许需要展示涂鸦和定位");
//				var currentMarkup = checkedMap.get(checkId).markup;
//				if(currentMarkup && currentMarkup.replace(/(^\s*)|(\s*$)/g, "").length>0){
//					//Dialog.alert("当前选中的碰撞点："+currentCheckedNode.name+"，已经存在涂鸦，需要展示！");
//					var markupList = currentMarkup.split("@#@");
//					if(markupList!=null && markupList.length>0){
//						bimCollision.enterEditMode();
//						for(var m=0,n=markupList.length; m<n; m++){
//							var singleMarkup = markupList[m].split("@BIM@");
//							bimCollision.markupForClash.loadMarkups(singleMarkup[1].replace(/'/g,'"'),singleMarkup[0]);
//						}
//					}
//				}
//			}
		}else{
			sureUncheck();
			if(bimCollision.currentCheckedNode){
				bimCollision.getPreViewData(bimCollision.currentCheckedNode);
				//如果涂鸦对象不为空，卸载涂鸦对象
				if(bimCollision.markupForClash){
					bimCollision.enterViewMode();	
				}
				bimCollision.currentCheckedNode = null;
			}
		}
	}
	function sureCheck() {
		var checkedNum = 0;
		var answer= document.getElementsByName("answer");
		var answerSize = answer.length;
		if(answer && answer.length>0){
			for(var i=0;i<answer.length;i++){
				if(answer[i].checked){
					checkedNum++;
				}
			}
		}
		if(checkedNum==answerSize){
			$("input:checkbox[name='allClick']").attr("checked",true);
		}else{
			$("input:checkbox[name='allClick']").attr("checked",false);
		}
	}
	function sureUncheck() {
		$("input:checkbox[name='allClick']").attr("checked",false);
	}
	//全选点击事件
	function checkAllBoxForClash(obj) {
		//如果涂鸦对象不为空，卸载涂鸦对象
		if(bimCollision.markupForClash){
			bimCollision.enterViewMode();
		}
		bimCollision.currentCheckedNode = null;
		var answer= document.getElementsByName("answer");
		if(obj.checked==true){
			for(var i=0;i<answer.length;i++){
				answer[i].checked = true;
			}
		}else{
			for(var i=0;i<answer.length;i++){
				answer[i].checked = false;
			}
		}
	}
	//关闭碰撞点列表
	function closeClashRpt() {
		setVisibleForClash(false);
	}
	
	//显示切换
	function setVisibleForClash(show){
		bimCollision.beVisible = show;
		bimCollision.btnElement.classList.toggle('active');
		if(show){
			$("#u-clashRpt-upload").show();
			selectClashAll();
		}else{
			if(bimCollision.markupForClash){
		    	bimCollision.markupForClash.leaveEditMode();
		    	bimCollision.markupForClash.hide();
		    	BimBdip.view.unloadExtension('Autodesk.Viewing.MarkupsCore');	
				bimCollision.markupForClash = null;
	    	}  	
	    	bimCollision.viewMode = true;
	    	bimCollision.onceEdit = false;
			$("#u-clashRpt-upload").hide();
			//如果涂鸦对象不为空，卸载涂鸦对象
			if(bimCollision.panelForClash){
				bimCollision.panelForClash.setVisible(false);			
			}
			//bimCollision.toolbar.style.display = "block";
		}
	}
	//按钮事件控制函数
	function toggleVisibilityForClash(){
		setVisibleForClash(!bimCollision.beVisible);
	}
	
	function hideButtonForClash(){
		if(bimCollision.markupForClash){
	    	bimCollision.markupForClash.leaveEditMode();
	    	bimCollision.markupForClash.hide();
	    	BimBdip.view.unloadExtension('Autodesk.Viewing.MarkupsCore');	
			bimCollision.markupForClash = null;
    	}  	
    	bimCollision.viewMode = true;
    	bimCollision.onceEdit = false;
    	bimCollision.beVisible = false;
		$("#u-clashRpt-upload").hide();
		//如果涂鸦对象不为空，卸载涂鸦对象
		if(bimCollision.panelForClash){
			bimCollision.panelForClash.setVisible(false);			
		}
		//bimCollision.toolbar.style.display = "block";
		
		$(bimCollision.btnElement).removeClass('active');
		$(bimCollision.btnElement).addClass('inactive');
	}
	function showButtonForClash(){
		$(bimCollision.btnElement).removeClass('inactive');
		$(bimCollision.btnElement).addClass('active');
	}
