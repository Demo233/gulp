var bimPanorama = {
	lmvId : null,
	modelUrl : null,
	userName : null,
	userId : null,
	btnElement : null,	
	DBID : null,                //模型检测用dbid
	dt_fragId : null,			//模型检测用fragId
	fragId : null,				//模型跳转用fragId
	externalId : null,			//模型跳转用externalId
	dbId : null,				//模型跳转用dbid
	jsonString : null,		//定位全景图
	num_full : 0,
	beVisible : false,
	beVisibleUpload : false,
	type : null,				//判断模型后缀名.f2d .svf
	realpath : null,
	date : null,				//获取当前时间
	f2d_fragId : null,
	getselectdbid : null,	//多个构件实景上传
	fragIdDbidJsonString : null,
	init : function (){
		var viewer = BimBdip.view;
		var viewerToolbar = viewer.getToolbar(true);
		var ctrlGroup=viewerToolbar.getControl("bimbdip_viewToolBar");
		var button = ctrlGroup.getControl('bimbdip_button_panorama');
		bimPanorama.btnElement = button.container;
		
		bimPanorama.lmvId = BimBdip.lvmid;
		bimPanorama.modelUrl = BimBdip.view_modelUrl;
		bimPanorama.modelVersion = BimBdip.modelVersion;
		bimPanorama.userName = BimBdip.currentUsername;
		bimPanorama.userId = BimBdip.currentUserid;
	},
	refreshOptions : function(){
		var click = "options";
		bimPanorama.selectAllTypeName(click);
		$(".tagSet").css("display","none");
	},
	selectAllTypeName : function(click){   //点击标记类型下拉框
		//查询panorama_typename中的数据，若没数据则添加默认数据
		var realurl = publicJS.tomcat_url+"/PanoramaNew_selectAllTypeName.action?modelid="+bimPanorama.lmvId;
		$.ajax({
		    type: "GET",
			url: realurl, 
			processData: false,
			contentType: false,
			dataType:"json",
			success: function(data){
				var htmli="";
				if(data.code==200){
					if(click == "showSelection"){
						htmli += "<li ><span style='color:#333' onclick='bimPanorama.selectOption(event)'>"+bdip4dLang[langType]["-15000"]+"</span></li>";
					}
					var _data = data.data;
					if(_data.length>0 && _data!=null){
						for(var i =0 ;i<_data.length;i++){
							var typename = _data[i].labelName;
							var color = _data[i].labelColor;
							var labelid = _data[i].labelid;
							var isDefault = _data[i].isDefault;
							if(click == "setUp"){
								htmli += "<tr>";
									htmli += "<td>";
									if(isDefault != "true"){
										htmli += "<input type='checkbox' class='selectTag' id='"+labelid+"'/>";
										htmli +="<label></label>";
									}
									htmli += "</td>";
									htmli += "<td>";
									if(isDefault != "true"){
										htmli += "<span class='tagSpan' title='"+typename+"' onClick='bimPanorama.updateLabelTypeName(this,\""+labelid+"\")'>"+typename+"</span>";
									}else{
										htmli += "<span class='tagSpan' title='"+typename+"'>"+typename+"</span>";
									}
										
									htmli += "</td>";
									htmli += "<td >";
										htmli += "<span class='tagSpanShow'  labelid='"+labelid+"' style='background-color:"+color+"'>"+typename+"</span>";
										htmli += "<span class='changeColor' onclick='changeColor(event)''></span>";
									htmli += "</td>";
								htmli += "</tr>";
								$('#setUp_body').html(htmli);
							}
							else if(click == "editPanorama"){
								htmli+="<li class='checkLi'><input type='checkbox' class= 'checkBox' name='checkBoxName' value='"+labelid+","+typename+","+color+"' id='Labeltype"+labelid+"'/><label></label><div class='limitWid'><span style = '"+"background:"+color +";"+"' title='"+typename+"' id='spanId'>"+typename+"</span></div></li>";
								$('#editCheckbox').html(htmli);
							}
							else if(click == "showSelection"){
								htmli += "<li ><span style = '"+"background:"+color +";"+"' title='"+typename+"'  id='"+labelid+"' onclick='bimPanorama.selectOption(event)'>"+typename+"</span></li>";
								$('.selectOptions ul').html(htmli);
							}
							else{
								htmli+="<li class='checkLi'><input type='checkbox' class= 'checkBox' name='checkBoxName' value='"+labelid+","+typename+","+color+"' id='Labeltype"+labelid+"'/><label></label><div class='limitWid'><span style = '"+"background:"+color +";"+"' title='"+typename+"' id='spanId'>"+typename+"</span></div></li>";
								$('#maskCheckbox').html(htmli);
							}
						}
						if(click == "editPanorama"){	//修改反勾选
							selectTag();
						}
					}else{
						bimPanorama.insertDefaultData();
					}
				}
			},error: function(data){
				console.log("查询失败");
			}
		});
	},
	insertDefaultData : function(){
		var date=new Date();
      	var year = date.getFullYear();
      	var month = date.getMonth()+1;
      	var day = date.getDate();
      	var hour = date.getHours();
      	var minute = date.getMinutes();
      	var second = date.getSeconds();
      	var time=year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
		var panorama=new FormData();
		panorama.append("lmvId",bimPanorama.lmvId);
		panorama.append("url",bimPanorama.modelUrl);
		panorama.append("modelVersion",bimPanorama.modelVersion);
		panorama.append("userName",bimPanorama.userName);
		panorama.append("userId",bimPanorama.userId);
		panorama.append("createTime",time);
		console.log(panorama);
		var realurl = publicJS.tomcat_url+"/PanoramaNew_insertDefaultLabelType.action";
	  	$.ajax({
	  		url:realurl,
	  		data:panorama,
	  		type:'POST',
	  		dataType:'text',
	    	processData:false,
	    	contentType:false,
	    	success:function(data){
	    		setTimeout(function(){
	    			bimPanorama.selectAllTypeName();
	    		}, 1000);
	    	 },
	    	 error:function(){
	    		 console.log("保存失败......");
	    	 }
	  	});
	},
	insertLabelTypeInfo : function(){		//添加自定义标签
		var date=new Date();
      	var year = date.getFullYear();
      	var month = date.getMonth()+1;
      	var day = date.getDate();
      	var hour = date.getHours();
      	var minute = date.getMinutes();
      	var second = date.getSeconds();
      	var time=year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
		var panorama=new FormData();
		var id = bimFileterColoring.randomWord(true,16,32);
		panorama.append("lmvId",bimPanorama.lmvId);
		panorama.append("url",bimPanorama.modelUrl);
		panorama.append("modelVersion",bimPanorama.modelVersion);
		panorama.append("userName",bimPanorama.userName);
		panorama.append("userId",bimPanorama.userId);
		console.log(panorama);
		var realurl = publicJS.tomcat_url+"/PanoramaNew_insertLabelTypeInfo.action";
	  	$.ajax({
	  		url:realurl,
	  		data:panorama,
	  		type:'POST',
	  		dataType:'text',
	    	processData:false,
	    	contentType:false,
	    	success:function(data){
	    		layer.msg(bdip4dLang[langType]["-15161"], {icon: 1, time: 1000});//添加成功
	    		var click = "setUp";
	    		bimPanorama.selectAllTypeName(click);
	    	 },
	    	 error:function(){
	    		 console.log("添加失败......");
	    	 }
	  	});
	},
	deleteLabelType : function(labelidArr){		// 删除自定义标签
		var realurl = publicJS.tomcat_url + "/PanoramaNew_getPanorama.action?lmvId="+BimBdip.lvmid;
		var isUsing=0;
        $.ajax({
        	url:realurl,  
	 		type : 'POST',
	 		dataType:'json',
	    	processData:false,
	    	contentType:false,
            success: function (data) {
            	if(data.code == '200'){
            		var _data = data.data;
            		for(var i = 0;i < labelidArr.length;i++){
            			for (var j = 0; j < _data.length; j++) {
                			var nameColorjson=_data[j].nameColorjson;
                			console.log("nameColorjson===="+nameColorjson);
                			if(nameColorjson!="" && nameColorjson.indexOf(labelidArr[i])!= -1){	// 存在引用标签
                				bimPanorama.updateLabeltoNullBynameColorjson(labelidArr);
                				isUsing +=1;
                				return false;
                	        }
    					}
            		}
            		if(isUsing == 0){
        	        	var realurl = publicJS.tomcat_url + "/PanoramaNew_deleteLabelTypeById.action?labelid="+labelidArr+"&lmvId="+BimBdip.lvmid;
        	    		var msg = bdip4dLang[langType]["-15448"];		//是否确认删除该资料
        	            Dialog.confirm(msg, function () {
        	                $.ajax({
        	                	url:realurl,  
        	        	 		type : 'POST',
        	        	 		dataType:'text',
        	        	    	processData:false,
        	        	    	contentType:false,
        	                    success: function (data) {
        	                        layer.msg(bdip4dLang[langType]["-15304"], {icon: 1, time: 1000});	//删除成功
        	                        var click = "setUp";
        	       	    			bimPanorama.selectAllTypeName(click);
        	                        $(".selectTag:checked").parentsUntil("tr").parent().remove();
        	                    },
        	                    error : function(data){
        	                    	console.log("删除失败");
        	                    }
        	               });
        	           });
            		}
            	}
                // bimPanorama.updateLabeltoNullBynameColorjson(labelidArr);
            },
            error : function(data){
            	console.log("删除失败");
            }
       });
	},
	updateLabeltoNullBynameColorjson : function(labelidArr){
		var realurl = publicJS.tomcat_url + "/PanoramaNew_updateLabeltoNullBynameColorjson.action?labelid="+labelidArr+"&lmvId="+BimBdip.lvmid;
		var msg = bdip4dLang[langType]["-16487"];//"该标签已经被引用，确认要删除？";
        Dialog.confirm(msg, function () {
            $.ajax({
            	url:realurl,  
    	 		type : 'POST',
    	 		dataType:'text',
    	    	processData:false,
    	    	contentType:false,
                success: function (data) {
                    layer.msg(bdip4dLang[langType]["-15304"], {icon: 1, time: 1000});	//删除成功
                    var click = "setUp";
   	    			bimPanorama.selectAllTypeName(click);
                    $(".selectTag:checked").parentsUntil("tr").parent().remove();
                },
                error : function(data){
                	console.log("删除失败");
                }
           });
       });
	},
	updateLabelTypeColor : function(colortext,labelid){		//修改自定义标签颜色
		var changeColor=colortext.replace(/#/g,'');
		var realurl = publicJS.tomcat_url + "/PanoramaNew_updateLabelTypeColor.action?labelid="+labelid+'&labelColor='+changeColor;
	  	$.ajax({
			url:realurl,
			type:'POST',
			dataType:'text',
			processData:false,
			contentType:false,
			success:function(){
				layer.msg(bdip4dLang[langType]["-15388"], {icon: 1, time: 1000});	//"修改标签颜色成功"
				var click = "setUp";
	    		bimPanorama.selectAllTypeName(click);
	 		},
	 		error : function(){
	 			console.log("修改失败");
	 		}
		});
	},
	updateLabelTypeName : function(element,labelid){		//修改自定义标签名称
		var oldhtml = element.innerHTML;
		if(oldhtml.indexOf('type="text"') > 0){
			  return;
		}
        var newobj = document.createElement('input');
        newobj.type = 'text';
        newobj.style="width:60px;height:20px";
        newobj.value = oldhtml;
        element.innerHTML = ''; //设置该标签的子节点为空
        element.appendChild(newobj);//添加该标签的子节点，input对象
        newobj.focus();  //设置获得光标
        //为新增元素添加光标离开事件
        newobj.onblur = function() {
            //当触发时判断新增元素值是否为空，为空则不修改，并返回原有值 
        	if(element.innerHTML = this.value == oldhtml ? oldhtml : this.value){
        		if(this.value.length>8){
        			layer.msg(bdip4dLang[langType]["-16488"],{icon:0,time:2000}); //字符不能超过8个
        			return false;
        		}
				var realurl = publicJS.tomcat_url + "/PanoramaNew_updateLabelTypeName.action?labelid="+labelid+'&name='+newobj.value+"&lmvId="+BimBdip.lvmid;
			  	$.ajax({
					url:realurl,
					type:'POST',
					dataType:'text',
					processData:false,
					contentType:false,
					success:function(){
			 			var click = "setUp";
			 			bimPanorama.selectAllTypeName(click);
			 		},
			 		error : function(){
			 			console.log("修改名称失败");
			 		}
				});
        	}
        }
	},
	checkMenuDbid : function(dbid){	//点击模型浏览器时——批量添加构件
		var isdbids = false;
	    var it = BimBdip.view.model.getData().instanceTree;
	    it.enumNodeChildren(dbid, function(childId) {
	        isdbids = true;    
	        bimPanorama.checkMenuDbid(childId);  
	    });
	    if(!isdbids) {
	    	bimPanorama.getselectdbid.push(dbid);
	    }
	},
	//使用全景图方法
	doPanorama : function () {  
		$('.btn_haed').show();
		$('#form_id').show();
		$('.parmaBox2 .right').show();
		bimPanorama.init();
		
		var d = new Date();
		bimPanorama.date = d.getFullYear()+"-"+(d.getMonth() + 1) +"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
		
		var urlIndex = BimBdip.view_modelUrl.lastIndexOf("."); 
		bimPanorama.type = BimBdip.view_modelUrl.substr(urlIndex);
		if(bimPanorama.type == '.f2d'){
			bimPanorama.DBID = BimBdip.view.getSelection()[0];
			var fragId = BimBdip.view.model.getData().fragments.dbId2fragId[bimPanorama.DBID];
			bimPanorama.f2d_fragId = fragId;
			bimPanorama.externalId = '';
			bimPanorama.dbId = bimPanorama.DBID ; 
			$("#ifm1").attr('src','../modeltool/360jsp/bindNew?dbId='+bimPanorama.dbId+'&fragId='+bimPanorama.f2d_fragId+'&lmvId='+BimBdip.lvmid+'&url='+BimBdip.view_modelUrl+'&externalId='+bimPanorama.externalId+'&modelVersion='+BimBdip.modelVersion+'&jsonString='+bimPanorama.jsonString+'&createTime='+bimPanorama.date);
            //bimPanorama.dt_fragId = 0;
		}else{
			var fragIdDbidJson=[];
			var fragIdArr = []
			var itemArr;
			var count =0;
			bimPanorama.getselectdbid=[];
			bimPanorama.fragIdDbidJsonString="";
			for(var i=0;i<BimBdip.view.getSelection().length;i++){
				bimPanorama.checkMenuDbid(BimBdip.view.getSelection()[i]);
			}
			for (var i = 0; i < bimPanorama.getselectdbid.length; i++) {
				/*BimBdip.view.model.getData().instanceTree.enumNodeFragments(BimBdip.view.getSelection()[i],function(fragId){
					bimPanorama.DBID = BimBdip.view.getSelection()[i];
		            bimPanorama.dt_fragId = fragId;      
		        });*/
				var dbids = '"dbidArr":'+bimPanorama.getselectdbid[i];
		        //BimBdip.view.getProperties(bimPanorama.DBID,function (data){
					//bimPanorama.externalId = data.externalId;
					//bimPanorama.dbId = data.dbId;
					BimBdip.view.model.getData().instanceTree.enumNodeFragments(bimPanorama.getselectdbid[i],function(fragId){
						var tmpState=BimBdip.view.getState();
						var jsonTmp=JSON.stringify(tmpState);
						jsonTmp =jsonTmp.replace(/\"/g,"'");
						bimPanorama.jsonString = $.base64.btoa(jsonTmp);
			            var jsonVal = $.base64.atob(bimPanorama.jsonString);
	                    bimPanorama.fragId = fragId;
	                    fragIdArr.push(bimPanorama.fragId);

						//var itemStr = JSON.stringify(itemArr);
	                    
						if(bimPanorama.fragIdDbidJsonString.indexOf(dbids.toString()) == -1){  //不存在
							itemArr = {dbidArr:bimPanorama.getselectdbid[i],fragIdArr:bimPanorama.fragId,jsonVal:jsonVal};
							fragIdDbidJson.push(itemArr);
							bimPanorama.fragIdDbidJsonString = JSON.stringify(fragIdDbidJson);
							console.log(bimPanorama.fragIdDbidJsonString);
						}
						/*else{
							fragIdDbidJson.push("");
						}*/
						
						$("#dbid").val(bimPanorama.getselectdbid[i]);
						$("#fragId").val(fragIdArr);
						$("#lmvId").val(BimBdip.lvmid);
						$("#url").val(BimBdip.view_modelUrl);
						$("#modelVersion").val(BimBdip.modelVersion);
						$("#jsonString").val(jsonVal);
						$("#externalId").val(bimPanorama.externalId);
						$("#userName").val(BimBdip.currentUsername);
						$("#userId").val(BimBdip.currentUserid);
						$("#createTime").val(bimPanorama.date);
						$("#fragidDbidJson").val(bimPanorama.fragIdDbidJsonString);
	                });
	            //});
			}
		}
		bimPanorama.show2();
	},
	hideBox2 : function() {  //alert("关闭资料上传界面div");
		//$("#ifm").attr('src','');
		 $("#frm")[0].reset();
		 $('.panorama_name').text("");
		 $('.panorama_size').text("");
		 $('.panorama_progress').text ("已上传0%") ;
		 $(".maskSpan span").text("");
		 $(".maskSpan").hide();
		 $("#maskCheckbox").empty();
		 $("#progress").hide();
		 $("#show360 embed").attr("src","");
		 $("#show360").hide();
		 $(".gray").hide();
		chooseFile = 0;
		uploadCount = 0;
		document.getElementById("parmaBox2").style.top ="-800px";
		$("#parmaBox2").hide();
		bimPanorama.setVisibleForUpload(!bimPanorama.beVisibleUpload);
	},
	setVisibleForUpload : function(show){
		bimPanorama.init();
		bimPanorama.beVisibleUpload = show;
		var name = "";
	    var typeUrl = "";
	 	var s = ["svf"];
	 	bimPanorama.clear(s,name,typeUrl);
		if(bimPanorama.btnElement.classList.contains('active')==false){ 
			bimPanorama.btnElement.classList.add('active');
		}
	},
	show2 : function(){
		$(".gray").show();   
		$("#parmaBox2").show();
		$(".maskVal").show();
	    document.getElementById('parmaBox2').style.top = "212px";
	    var click = "options";
        bimPanorama.selectAllTypeName(click);
	},
	showAllPan : function(){//查看所有全景图
		bimPanorama.showAllPanToggle();
	},
	showAllPanToggle : function(){
		bimPanorama.setVisibleForPanorama(!bimPanorama.beVisible);
	},
	//显示切换
	setVisibleForPanorama : function (show){
		bimPanorama.init();
		bimPanorama.beVisible = show;
		bimPanorama.btnElement.classList.toggle('active');
		if(show){
			var name = "";
		    var typeUrl = "";
		 	var s = ["svf"];
		 	bimPanorama.clear(s,name,typeUrl);
		}else{
			$("#360showbox").hide();// 关闭360showBox框框
			bimPanorama.clean();		// 隐藏掉构建上的点点
			chatview.chatClean();		//移除实时讨论的点
			$("div[name='360ViewTags']").each(function(){
				if(this!=null){
					this.remove();
				}
			});
			$(".overlayDivClass").remove();
		}
	},
	showSelection : function(event){
		event.cancelBubble=true;
		var click = "showSelection";
		bimPanorama.selectAllTypeName(click);
		$(".selectOptions").toggle();
	},
	searchSelectPan : function(){// 查询全景列表——获取表单中的name和typeUrl
		 var name = $("#search_name").val();
		 var typeUrl = $("#search_Tag").text();
		 if(typeUrl==bdip4dLang[langType]["-15779"]){	//请选择
			 typeUrl="";
		 }
		 var s = ["svf"];
		 bimPanorama.clear(s,name,typeUrl);
	},
	clear : function(s,_name,_typeUrl) {
		  var htmlss = "";
		  var lmvid = BimBdip.lvmid;
		  var realurl = publicJS.tomcat_url+"/PanoramaNew_getPanorama.action?lmvId="+lmvid+"&name="+_name+"&typeUrl="+_typeUrl;
		  $.ajax({
		    type: "GET",
			url: realurl, 
			processData: false,
			contentType: false,
			dataType:"json",
			success: function(data){
				$("#360table").html("");
				// 隐藏实时讨论
				bimPanorama.cleanAll();
				
				if(data.code == 200){
					var _data = data.data;
					bimPanorama.showPanoramaInfo(_data,s,_name,_typeUrl);
					
				};
			},
			error: function(data){
			 //alert("数据传输失败");
			}
		});
	},
	clean:function() {
		_dbid = "svf"; 
		// 隐藏360showbox
		$("#360showbox").hide();
		var pnames = document.getElementsByName("360ViewTags");
		for(var i = 0 ; i < pnames.length ; i++) {
			pnames[i].style.display = "none";
		}
	},
	cleanAll:function(){
		//删除360 和实时讨论
		var pnames = document.getElementsByClassName("pnamed");
		for(var i = 0 ; i < pnames.length ; i++) {
			pnames[i].style.display = "none";
		}
		$(".overlayDivClass").remove();
	},
	restoreMark : function(jsonValue,id){
		BimBdip.view.restoreState(jsonValue);	
		setTimeout(function(){
			show1(id);
		},800);
	},
	showAllLabelByDbid : function(dbid,jsonValue){  //点击模型中的标记，展示相应的标签列表
		BimBdip.view.restoreState(jsonValue);
		if(dbid!=null && dbid != ""){
			//var realurl = publicJS.tomcat_url+"/panorama/getPanoramaById?id="+id;
			var realurl = publicJS.tomcat_url+"/PanoramaNew_showAllLabelByDbid.action?dbid="+dbid+"&lmvId="+BimBdip.lvmid;
			$.ajax({
				url: realurl,
			    type: "GET",
				processData: false,
				contentType: false,
				dataType:"json",
				success: function(data){
					var _data = "" ;
					if(data.code == 200){
						_data = data.data;
						bimPanorama.showPanoramaInfo(_data,"","","");
						
					}
				},
				error: function(data){
					console.log("error");
				}
		   });
		}
	},
	yincang : function(){//点击隐藏全景列表
		$("#360showbox").hide();// 关闭360showBox框框
		bimPanorama.clean();// 隐藏掉构建上的点点
		bimPanorama.setVisibleForPanorama(false);
	},
	hide : function(){
		$(".box").css({"opacity":"0","top":"-500px"});
	    $(".boxs").css({"opacity":"0","top":"-500px"});
	},
	deletePanoramaById : function(id){	//删除资料
		var realurl = publicJS.tomcat_url + "/PanoramaNew_getPanoramaById.action?id="+id;
		$.ajax({  
			url:realurl,  
	 		type : 'POST',
	 		dataType:'json',
	    	processData:false,
	    	contentType:false,
	 		success: function(data){
	 			if(data.code == '200'){
	 				var _data = data.data;
	 				for(var i = 0;i<_data.length;i++){
	 					var nameColorjson = _data[i].nameColorjson;
	 				    var realurl = publicJS.tomcat_url+"/PanoramaNew_deletePanoramaById.action";
	 					var msg = bdip4dLang[langType]["-15049"];	//"是否确认删除该资料";
	 					Dialog.confirm(msg,function(){
	 							$.ajax({  
	 								url:realurl,  
	 						 		type : 'get',
	 						 		data : {id:id},
	 						 		success: function(data){
	 						 			 //刷新界面
	 						 			 var tr_elem = id;
	 						 			$("#" + tr_elem).next().remove();
	 						 			$("#" + tr_elem).remove();
	 						 			 var a_elem = "a_" + id;
	 						 			 $("#" + a_elem).parent().remove();
	 						 		},
	 						 		error : function(){
	 						 			console.log("删除失败");
	 						 		}
	 							});
	 						 });
	 				}
	 			}
	 		},
	 		error : function(){
	 			console.log("删除失败");
	 		}
		});
	},
	updatePanoramaById : function(id,selectedTag){  //点击“编辑”  修改文件名称
		var checkValueArr =[];
		var checkIdArr =[];
		var checkValueJson=[];
		var checkValueJsonString='';
		for (var i = 0; i < selectedTag.length; i++) {
			var checkValue = $(selectedTag[i]).val();
			var labelid = checkValue.split(",")[0];
			var labelname =checkValue.split(",")[1];
			var labelcolor = checkValue.split(",")[2];
			var item = {labelid:labelid,labelname:labelname,labelcolor:labelcolor};
			console.log(item);
			checkValueJson.push(item);
			checkValueJsonString = JSON.stringify(checkValueJson);
			console.log(checkValueJsonString);
		}
		var newName = $('#editName').val();
		var formData=new FormData();
	    formData.append("id",id);
	    formData.append("name",newName);
	    formData.append("nameColorjson",checkValueJsonString);
		var realurl = publicJS.tomcat_url+"/PanoramaNew_updatePanoramaById.action";
		$.ajax({
	  		url:realurl,
	  		type:'POST',
	  		data:formData,
	  		dataType:'text',
	    	processData:false,
	    	contentType:false,
	    	success:function(data){
	    		console.log("修改成功....");
			 	$(".editBox").hide();
	    		var name = "";
			    var typeUrl = "";
			 	var s = ["svf"];
			 	bimPanorama.clear(s,name,typeUrl);
	    	 },
	    	 error:function(){
	    		 console.log("修改失败......");
	    	 }
	  	});
	},
	parmaFull : function(){//360全景放大
		var head = window.location.protocol;
		var body = window.location.host;
	    var cooperation_div = document.getElementById('parmaBox1');
	    var btn_full_img = document.getElementById('btn_full').getElementsByTagName('img')[0];
	    if (bimPanorama.num_full == 0) {
		    cooperation_div.style.top = "0px";
	        cooperation_div.className="parmaBox1_full";
	        document.getElementById('btn_full').title = bdip4dLang[langType]["-15423"];	//"点击缩小全景图";
	        btn_full_img.src="img/modeltool/closeScreens.png";
	        bimPanorama.num_full = 1;
	    }else{
		    cooperation_div.style.top = "200px";
	        cooperation_div.className="parmaBox1";
	        document.getElementById('btn_full').title = bdip4dLang[langType]["-15424"];	//"点击放大全景图";
	        btn_full_img.src="img/modeltool/fullScreens.png";
	        bimPanorama.num_full = 0;
	    }
	},
	hideBox1 : function(){//360全景图定位后关闭
		document.getElementById("parmaBox1").style.top ="-600px";
		$("#parmaBox1").hide();
		document.getElementById('parmaBox1').className="parmaBox1";
	    document.getElementById('btn_full').title = bdip4dLang[langType]["-15424"];	//"点击放大全景图";
	    document.getElementById('btn_full').getElementsByTagName('img')[0].src="img/modeltool/fullScreens.png";
	    bimPanorama.num_full = 0;
	    //$('#LE').css('left','22.2%');
	    //$('.y').css('background-image','url(${pageContext.request.contextPath}/img/modeltool/ri.png)');
	},
	randomWord : function(randomFlag, min, max){
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
  showPanoramaInfo:function(_data,s,_name,_typeUrl){
	  if ($('#panoramaTable').hasClass('dataTable')) {
          var dttable = $('#panoramaTable').dataTable();
          dttable.fnClearTable(); //清空一下table
          dttable.fnDestroy(); //还原初始化了的datatable
      }
	  var htmli ="";
	  if(typeof(_name)!="undefined" && typeof(_typeUrl)!="undefined"){ 
			$("#360showbox").show();
		}
		
		//$("#panoramaUl tr:gt(1)").remove();
		$("div[name='360ViewTags']").each(function(){
			if(this!=null){
				this.remove();
			}
		});
		$(".overlayDivClass").remove();
		var dbid="";
		for(var i = 0 ; i<_data.length ; i++){
			var json = _data[i].jsonString;
			var id = _data[i].id;
			var d = new Date(_data[i].createTime);
			var date = d.getFullYear()+"/"+(d.getMonth() + 1) +"/"+d.getDate();
			if(json =='' || json == undefined || json == null || json=='null'){
				var jsonValue="";
			}else{
				var jsonValue = json.replace(/'/g,'"');
			}
			/*var typeUrl = _data[i].typeUrl;
			
			var jsonStr = JSON.parse(JSON.stringify(typeUrl));*/
            var nameColorjson=_data[i].nameColorjson;
         
			var fragdbidjson = "";
			
			var pic_name;
			if(_data[i].name == ""){
				pic_name= bdip4dLang[langType]["-15421"];   //"未命名文件";
			}else{
				pic_name = _data[i].name;
			}
			htmli += "<tr id='"+id+"' onclick='bimPanorama.restoreMark("+jsonValue+","+id+")'>";
			htmli += "<td title='"+pic_name+"' class='text-hidden'>"+pic_name+"</td>";
			htmli += "<td>"+date+"</td>";
			htmli += "<td><i class='editPanorama' style='background:url(img/icon/operate_wev8.png)'></i></td>";
			htmli += "</tr>";
			
			
			if(dbid.indexOf(_data[i].dbid)==-1){
				_gyroext.do(_data[i].id,_data[i].dbid,_data[i].fragId,_data[i].id,_data[i].typeUrl,nameColorjson,jsonValue);
			}
			dbid += _data[i].dbid+",";
          
		}
		$('#panoramaTable tbody').html(htmli);
		setPanoramaTag(_data,jsonValue,id);
  },
  selectOption:function(event){
	  var evt=event.target||event.srcElement;
	  var tagText=$(evt).text();
	  var tagId=evt.getAttribute("id");
	  var tagBackground=evt.style.background;
	  $(".choiceTag").text(tagText);
	  $(".choiceTag").attr("labelid",tagId);
	  $(".choiceTag").css("background",tagBackground);
	  $("#search_Tag").attr("title",tagText);
  }
}

