var bimFileterColoring = {
		beVisibleToColoring : false,
		btnColoring : null,
		currentModelUrl : null,			//模型路劲
		currentModelid : null,   		//模型ID
		currentUserid : null,				//用户ID
		currentUsername : null,		//用户名
		currentDbid:"",
		dbidcheck : [],
		isFirstClick : true,
		childid : null,
		check_val : [],
		colors : [],
		checkName : null,
		getselectdbid : null,
		deletedbids : null,
		dbids : null,
		isFirst : null,
		colorClose : null,
		init : function(){
			/*** 定义button按钮对象 **/
			var viewer = BimBdip.view;
			var viewerToolbar = viewer.getToolbar(true);
			var ctrlGroup=viewerToolbar.getControl("bimbdip_viewToolBar");
			var button = ctrlGroup.getControl('bimbdip_button_coloring');
			bimFileterColoring.btnColoring = button.container;
			
			/*** 获取模型ID、模型URL、用户名、用户名ID  **/
			bimFileterColoring.currentModelUrl = BimBdip.view_modelUrl;
			bimFileterColoring.currentModelid = BimBdip.lvmid;
			bimFileterColoring.currentUserid = BimBdip.currentUserid;
			bimFileterColoring.currentUsername = BimBdip.currentUsername;
			
			/*bimFileterColoring.currentModelUrl =currentUrl;
			//bimFileterColoring.currentModelid = '592';
			bimFileterColoring.currentModelid = BimBdip.modelObject.id;
			bimFileterColoring.currentUserid = BimBdip.userid;
			bimFileterColoring.currentUsername = BimBdip.username;*/
			
			
			//BimBdip.view.unloadExtension('Autodesk.ADN.Viewing.Extension.Color');
			BimBdip.view.loadExtension('Autodesk.ADN.Viewing.Extension.Color');
		},
		hideColoringButtonFrame : function(){   //点击其他按钮后取消“过滤着色管理” 按钮的选中状态
			$(bimFileterColoring.btnColoring ).removeClass('active');
			$(bimFileterColoring.btnColoring ).addClass('inactive');
			bimFileterColoring.beVisibleToColoring = false;
			//$("#colorBoard").css("display","none");
			//bimFileterColoring.colorClose.click();
			var viewer = BimBdip.view;
			bimFileterColoring.removeAllColors();
			//侧边栏收起
			hideSidePanel();
	   		window.parent.hideSidePanel();
	   		//$('.coloringbox').html("");
		},
		dockingPanel : function(){     //点击“过滤着色管理” 按钮取消“视点保存”的选中状态
			if(bimViewPointNew){
				bimViewPointNew.hiddenViewPoint_new();
			}
		},
		showAllDbids : function(){
			var dbids = BimBdip.view.model.getFragmentList().fragments.fragId2dbId;
			for(var i=0;i<dbids.length;i++){
				BimBdip.view.getColors(dbids[i],"#666666");
			}
		},
		removeAllColors:function(){
			BimBdip.view.showAll();
			var dbidArr = BimBdip.view.model.getFragmentList().fragments.fragId2dbId;
			for(var j=0;j<dbidArr.length;j++){
				if(BimBdip.view.restoreColorMaterial == undefined || BimBdip.view.restoreColorMaterial == 'undefined'){
					
				}else{
					BimBdip.view.restoreColorMaterial(parseInt(dbidArr[j]));
				}
            }
		},
		CustomDisplay : function(click){  //点击自定义显示tab页时
			var click =1 ;
			bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
			bimFileterColoring.showAllDbids();
			bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click); 
		},
		FilterResults : function(click){  //点击过滤显示tab页时
			var click = 3;
			bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
			bimFileterColoring.showAllDbids();
			setTimeout(function(){
				bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click); 
			},1000);
			//bimFileterColoring.selectAllFilterByModelId(bimFileterColoring.currentModelid,click); 
		},
		coloring_load : function(){
			$("#ffilter_coloring_box_bt ").innerHTML = "";
			bimFileterColoring.dockingPanel();
			bimFileterColoring.init();
			bimFileterColoring.toggleVisibilityForColoring();
		},
		toggleVisibilityForColoring : function(){
			bimFileterColoring.setVisibleForColoring(!bimFileterColoring.beVisibleToColoring);
		},
		setVisibleForColoring : function(show){
			var viewer = BimBdip.view;
			bimFileterColoring.beVisibleToColoring = show;
			bimFileterColoring.btnColoring.classList.toggle('active');
			var click=1;
			if(show){
				//bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click); //点击按钮查询所有信息
				bimFileterColoring.CustomDisplay(click);
				bimFileterColoring.showAllDbids();
			}else{
				BimBdip.view.showAll();
				var dbidArr = BimBdip.view.model.getFragmentList().fragments.fragId2dbId;
				for(var j=0;j<dbidArr.length;j++){
					BimBdip.view.restoreColorMaterial(parseInt(dbidArr[j]));
	            }
			}
		},
		/**================自定义显示模块操作--开始======================**/
		insertDefaultData : function(){   		//点击过滤着色管理按钮时，若无数据默认插入三条数据
			var date=new Date();
	      	var year = date.getFullYear();
	      	var month = date.getMonth()+1;
	      	var day = date.getDate();
	      	var hour = date.getHours();
	      	var minute = date.getMinutes();
	      	var second = date.getSeconds();
	      	var time=year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
			var fileterColor=new FormData();
			fileterColor.append("modelurl",bimFileterColoring.currentModelUrl);
			fileterColor.append("modelid",bimFileterColoring.currentModelid);
			fileterColor.append("username",bimFileterColoring.currentUsername);
			fileterColor.append("userid",bimFileterColoring.currentUserid);
			fileterColor.append("createTime",time);
			console.log(fileterColor);
			//var realurl = publicJS.tomcat_url+"/fileterColor/insertDefaultData";
			var realurl = '../FilterColoring_insertDefaultData.action';
		  	$.ajax({
		  		url:realurl,
		  		data:fileterColor,
		  		type:'POST',
		  		dataType:'text',
		    	processData:false,
		    	contentType:false,
		    	success:function(data){
		    		console.log("保存成功....");
		    		var click =1;
		    		bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
		    	 },
		    	 error:function(){
		    		 console.log("保存失败......");
		    	 }
		  	});
		},
		selectAllByModelId : function(modelID,click){   //自定义结果显示
			//var realurl = publicJS.tomcat_url+"/fileterColor/selectAllByModelId?modelid="+modelID;
			var realurl =  '../FilterColoring_selectAllByModelId.action?modelid='+modelID;
			$.ajax({
			    type: "POST",
			    async:false,
				url: realurl, 
				//processData: false,
				//contentType: false,
				dataType:"json",
				success: function(data){
					//$(".filter_coloring_box").show();
					bimFileterColoring.isFirst  = true;
					var htmli = "";
					if(data.code==200){
						var _data = data.data;
						if(_data.length>0 && _data != null){
							for (var i = 0; i < _data.length; i++) {
								var qybtn = ""; 
								var gbbtn = "";
								bimFileterColoring.childid = _data[i].childid;
								var colortext = _data[i].color;
								var fname = _data[i].fname
								var id = _data[i].id;
								var modelurl = _data[i].modelUrl;
								var modelid = _data[i].modelid;
								var filter_result = _data[i].filterResult;
								var filterId= _data[i].filterid;
								if(click==1 && filter_result != 'true' && filter_result !="false"){
									htmli+="<tr  class='tr_"+id+"'>";
										  htmli+="<td style='position: relative;width: 20px;'><i class='check_b'onclick='bimFileterColoring.isCheck(event)' style='display:block;float:left;width:16px;height:16px; background: url(img/modeltool/filtercoloring/deng.png) 0px 0px / 200%;cursor: pointer;position: absolute;top:2px;' _isChecked='false'></i><input style='display:none;' class='check_btn' type='checkbox' onchange='bimFileterColoring.onCheck(\""+bimFileterColoring.childid+"\",\""+colortext+"\",\"customColor"+id+"\")' name='answer' value='"+bimFileterColoring.childid+","+colortext+"'  id='customColor"+id+"'/></td>",
					                  	  htmli+="<td class='table_name' title='"+fname+"'>"+fname+"</td>";
					                      htmli+="<td style='vertical-align: bottom;width:29%'><span class='color_input' style='margin: 0 auto;background:"+colortext +"'></span></td>";
					                      htmli+="<td><a href='#' onclick='bimFileterColoring.ColoringComponent(\""+bimFileterColoring.childid+"\",\""+colortext+"\",\""+fname+"\")'>"+bdip4dLang[langType]["-15283"]+"</a></td>";	//着色
					                      htmli+="<td><a href='#' onclick='bimFileterColoring.CancelColoring(\""+bimFileterColoring.childid+"\",\""+modelurl+"\",\""+modelid+"\",\""+colortext+"\")'>"+bdip4dLang[langType]["-15284"]+"</a></td>";//清除
				                    htmli+="</tr>";
									$('#coloring-tbody').html(htmli);
								}
								else if(click==2 &&  filter_result!="true" && filter_result !="false"){  //点击tab1中的“编辑着色方案” 按钮显示页面
									htmli+="<tr class='tr_"+id+"'>";
										  //htmli+="<td></td>";
					                  	  htmli+="<td style='width:35%;' class='table_name' title='"+fname+"' onClick='bimFileterColoring.updateFilterColorName(this,\""+bimFileterColoring.childid+"\",\""+id+"\",\""+modelid+"\")'>"+fname+"</td>";
					                  	  htmli+="<td style='vertical-align: bottom;width:29%;'><span class='color_input' onclick="+"bimFileterColoring.colorSelect('nowColor','pageColorViews','event','updateColor',\""+bimFileterColoring.childid+"\",\""+modelid+"\")"+" style='margin" +
					                  	  		":0 auto;background:"+colortext +";'></span></td>";
				                          htmli+="<td style='width:30%;'><a style='margin:0 auto;' href='#' onclick='bimFileterColoring.deleteFileterColoring(\""+bimFileterColoring.childid+"\",\""+id+"\",\""+modelid+"\")'>"+bdip4dLang[langType]["-15285"]+"</a></td>";//删除
				                    htmli+="</tr>";
									$('#editorColor-tbody').html(htmli);
								}
								else if(click == 3 && filter_result=="true"){ //点击tab2
									htmli+="<tr  class='tr_"+id+"' style='width:100%;display:block;'>";
										  htmli+="<td id='check' style='position: relative;width: 20px;vertical-align: top;'><i class='check_filter_b'onclick='bimFileterColoring.isCheck(event)' style='display:block;float:left;width:16px;height:16px;background: url(img/modeltool/filtercoloring/deng.png) 0px 0px / 200%;cursor: pointer;position: absolute;top:2px;' _isChecked='false'></i><input style='display:none;' class='check_btn' type='checkbox' onchange='bimFileterColoring.onCheck(\""+bimFileterColoring.childid+"\",\""+colortext+"\",\"customColor"+id+"\")' name='answer' value='"+bimFileterColoring.childid+","+colortext+"'  id='customColor"+id+"'/></td>",
					                  	  htmli+="<td class='table_name filt_name' title='"+fname+"'>"+fname+"</td>";
					                      htmli+="<td style='vertical-align: bottom;width:25%;'><span class='color_input' style="+"background:"+colortext +";"+"></span></td>";
				                   htmli+="</tr>";
								   $('#filterResult-tbody').html(htmli);
								}
								else if(click == 4 && filter_result!='' && filter_result!='undefined' && filter_result!=undefined){   //点击tab2中的“编辑着色方案” 按钮显示页面
									htmli+="<tr  class='tr_"+id+"'>";
										  //onClick='bimFileterColoring.updateFilterColorName(this,\""+bimFileterColoring.childid+"\",\""+id+"\",\""+modelid+"\")'
					                  	  htmli+="<td class='w_24' title='"+fname+"' style='width:35%'>"+fname+"</td>";
					                      htmli+="<td style='vertical-align: bottom;width: 34%;'><span class='color_input' onclick="+"bimFileterColoring.colorSelect('nowColor','pageColorViews','event','updateFilterResultColor',\""+bimFileterColoring.childid+"\",\""+modelid+"\")"+" style='margin: 0 auto;background:"+colortext +";'></span></td>";
					                      if(filter_result == "false"){
					                    	  qybtn = "";
					                    	  gbbtn = "background:#0c92f3;text-shadow:none;color:#FFF";
					                      }else{
					                    	  qybtn = "background:#0c92f3;text-shadow:none;color:#FFF";
					                    	  gbbtn = "";
					                      }
					                      htmli+="<td><a style="+ qybtn +" href='#' onclick='bimFileterColoring.EnableFilterResults(\""+id+"\",\""+bimFileterColoring.childid+"\",\""+filter_result+"\")'>"+bdip4dLang[langType]["-15286"]+"</a></td>";	//启用
					                      htmli+="<td><a class='' style="+ gbbtn +" href='#' onclick='bimFileterColoring.CloseFileterResult(\""+id+"\",\""+bimFileterColoring.childid+"\",\""+filter_result+"\")'>"+bdip4dLang[langType]["-15287"]+"</a></td>";		//关闭
					                      
				                   htmli+="</tr>";
								   $('#editorColor-filterResult--tbody').html(htmli);
								}
								else{
									
								}
							}
							//当不打开自定义显示界面而直接从过滤器那边保存数据时,没有添加默认状态
							if(bimFileterColoring.isFirst == true){
								var htmlInfo = $('#coloring-tbody')[0].innerText;
								if(htmlInfo != ""){
									bimFileterColoring.isFirst=false;
								}else{
									bimFileterColoring.insertDefaultData();
									bimFileterColoring.isFirst=false;
								}
							}
						}else{ //若一开始没有数据就默认插入几条数据
							bimFileterColoring.insertDefaultData();
						}
					}
				},
				error : function(data){
					console.log("查询失败......");
				}
		    });
		},
		ColoringComponent : function(childid,colortext,fname){		//点击"着色"按钮——添加构件并对其着色
			 var clickTag = 0;
			 var selDbid = BimBdip.view.getSelection();
			 
			 var modelTree = $('#ViewerModelStructurePanel');
			 if(selDbid.length == null || selDbid.length == []){
				 //window.parent.newsPrompt("请先选择需要着色的构件");
				 layer.msg(bdip4dLang[langType]["-15289"],{icon:7,time:2000});//"请先选择需要着色的构件"
				 /*alert("请先选择需要着色的构件");*/
				 return;
			 }else{
				 /*if(modelTree[0].style.display =='block'){
					 //window.parent.newsPrompt("浏览器着色暂不支持,请使用过滤器或手动选择构件");
					 layer.msg("浏览器着色暂不支持,请使用过滤器或手动选择构件",{icon:0,time:2000});
					 return;
				 }else{
					 getselectdbid.push(BimBdip.view.getSelection());
				 }*/
				 bimFileterColoring.getselectdbid=[];
				 for (var i = 0;i <BimBdip.view.getSelection().length; i++) {
					 bimFileterColoring.checkMenuDbid(BimBdip.view.getSelection()[i]);
				 }
			 }
			 
	      	 //在列表里面添加相应字段值
	      	 var date=new Date();
	      	 var year = date.getFullYear();
	      	 var month = date.getMonth()+1;
	      	 var day = date.getDate();
	      	 var hour = date.getHours();
	      	 var minute = date.getMinutes();
	      	 var second = date.getSeconds();
	      	 var time=year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
	      	
			 //保存构件
			 //var name=$("#txt_childid").val();
	      	 //var name="8wxuq5UhwbK17h5g";  //先填写死值，对应——质量管理
			 var gj_name = fname;
			 var dbid = bimFileterColoring.getselectdbid;
			 var gj_id = childid;
			 var cmodelurl = bimFileterColoring.currentModelUrl;
			 var cmodelid= bimFileterColoring.currentModelid;
			 var username = bimFileterColoring.currentUsername;
			 var userid = bimFileterColoring.currentUserid;
			 
			 var gj=new FormData();
			 gj.append("cname",gj_name);
			 gj.append("dbid",dbid);
			 gj.append("gjid",gj_id);
			 gj.append("modelurl",cmodelurl);
			 gj.append("modelid",cmodelid);
			 gj.append("username",username);
			 gj.append("userid",userid);
			 gj.append("color",colortext);
			 gj.append("createTime",time);
			 console.log(gj);
			 
			 //var realurl = publicJS.tomcat_url+"/fileterColor/addGoujian";
			 var realurl = '../FilterColoring_addGoujian.action';
			 $.ajax({
				  url:realurl,
	   	    	  type:'POST',
	   	    	  data:gj,
	   	    	  dataType:'text',
	   	    	  processData:false,
	   	    	  contentType:false,
	   	    	  success:function(data){
	   	    		  layer.msg(bdip4dLang[langType]["-15290"],{icon:1,time:1000});//添加成功
	   	    		  var childidArr = new Array();
	   	    		  var checkValue,childid,colortext;
	   	    		  var checkBoxs = $(".check_btn");
	   	    		  for(var i = 0 ;i <checkBoxs.length;i++ ){
	   	    			  if($(checkBoxs[i]).is(":checked")){
	   	    				  checkValue = $(checkBoxs[i]).val();
	   	    				  childid=checkValue.split(",")[0];
	   	    				  colortext=checkValue.split(",")[1];
	   	    				  childidArr.push(childid);
	   	    				  //bimFileterColoring.showColoringDbid(childid,colortext);
	   	    			  }
	   	    		  }
	   	    		  if(childidArr.length>0){
	   	    			  bimFileterColoring.showColoringDbid(childidArr);
	   	    		  }
	   	    		  return;
	   	    	  },
	   	    	  error:function(){
	   	    		  console.log("保存失败！");
	   	    		  return ;
	   	    	  }
			 });
		},
		checkMenuDbid : function(dbid){	//点击模型浏览器时——批量添加构件
			var isdbids = false;
		    var it = BimBdip.view.model.getData().instanceTree;
		    it.enumNodeChildren(dbid, function(childId) {
		        isdbids = true;    
		        bimFileterColoring.checkMenuDbid(childId);  
		    });
		    if(!isdbids) {
		    	bimFileterColoring.getselectdbid.push(dbid);
		    }
		},
		IsInArray : function(arr,val){   //判断一个值是否存在该数组中
			var testStr=','+arr.join(",")+","; 
			return testStr.indexOf(","+val+",")!=-1; 
		},
		deleteDbid : function(dbid){	//点击模型浏览器时——批量删除构件
			var isdbids = false;
		    var it = BimBdip.view.model.getData().instanceTree;
		    it.enumNodeChildren(dbid, function(childId) {
		        isdbids = true;    
		        bimFileterColoring.deleteDbid(childId);  
		    });
		    if(!isdbids) {
		    	bimFileterColoring.deletedbids.push(dbid);
		    }
		},
		CancelColoring : function(gj_id,modelurl,modelid,colortext){		//点击“清除”，将之前着过色的构件颜色取消
			//var deletedbid=[];
			var dbidChanged = [];
			var DbidresultArr = [];
			bimFileterColoring.deletedbids=[];
			for (var i = 0;i <BimBdip.view.getSelection().length; i++) {
				bimFileterColoring.deleteDbid(BimBdip.view.getSelection()[i]);
			}
			//deletedbid.push(BimBdip.view.getSelection());
			var deletedbid = bimFileterColoring.deletedbids;
			console.log("点到已变色值==="+deletedbid);		
			var gj=new FormData();
			gj.append("gjid",gj_id);
			gj.append("cmodelid",modelid);
			var realurl = '../FilterColoring_selectAllByGjid.action';
		    $.ajax({
		    	url:realurl,
		    	type:'POST',
		    	data : gj,
		    	dataType:'json',
		    	processData:false,
		    	contentType:false,
		    	async:false,
		    	success:function(data){
		    		if(data.code==200){
		    			var _data = data.data;	
	    				if(BimBdip.view.getSelection().length>0){
    						if(bimFileterColoring.currentDbid && deletedbid){
    							//var deletedbidArr = deletedbid.split(",");
    							for(var i = 0 ;i <_data.length;i++){
    		    					var dbidArr=_data[i].dbid.split(",");
    		    					DbidresultArr.push(dbidArr);
    		    					console.log("全部已变色值==="+DbidresultArr);  //bimFileterColoring.currentDbid
    		    				}
    							var finallyDbid=[];
    							for(var i = 0; i < DbidresultArr.length; finallyDbid.indexOf(DbidresultArr[i++]) === -1 && finallyDbid.push(DbidresultArr[i - 1]));
    							//var dbidcheckTemp = "," + finallyDbid + ",";//,4080,4081,
    							var dbidcheckTemp = finallyDbid + ",";//,4080,4081,
    							if(deletedbid && deletedbid.length>0){//deletedbidArr
    								//for(var i = 0; i < deletedbid[0].length; i++){
    								for(var i = 0; i < deletedbid.length; i++){
    									//var deletedbidArrItem = "," + deletedbid[i] + ",";//,4081,
    									var deletedbidArrItem = deletedbid[i]+ ",";//,4081,
    									dbidcheckTemp = dbidcheckTemp.split(deletedbidArrItem).join("");
    									//dbidcheckTemp =dbidcheckTemp.replace(deletedbidArrItem , ",");
    								}
    								//,4080,
    								dbidChanged = dbidcheckTemp.length > 2 ? dbidcheckTemp.substring(0,dbidcheckTemp.length-1) : "";
    							}
    							//bimFileterColoring.removeRepeat(dbidChanged);
    							var ary = dbidChanged.split(","); 
    							var json = {}; 
    							var str2 = ""; 
    							for (var i = 0; i < ary.length; i++) { // 去重的算法
    								if (ary[i] != "") { 
    									json["a" + ary[i]] = ary[i]; 
    								} 
    							} 
    							for (var key in json) { // 查看结果
    								str2 += "," + json[key]; 
    							} 
    							var dbids = str2.toString(); 
    							if (dbids.substr(0, 1) == ',') { //去掉第一个逗号
    								dbids = dbids.substr(1); 
    							} 
    							
    							//var dbids = bimFileterColoring.dbids;
    						    var showDbid = [];
    						    var formData=new FormData();
    						    formData.append("gjid",gj_id);
    						    formData.append("modelurl",modelurl);
    						    formData.append("modelid",modelid);
    						    formData.append("dbid",dbids);
    						    var realurl ='../FilterColoring_updateDbidByGjid.action';
    						    var msg = bdip4dLang[langType]["-15294"];//"是否确认清除构件颜色";
    							Dialog.confirm(msg,function(){
    							    $.ajax({
    							    	url:realurl,
    							    	type:'POST',
    							    	data:formData,
    							    	dataType:'json',
    							    	processData:false,
    							    	contentType:false,
    							    	success:function(data){
    							    		layer.msg(bdip4dLang[langType]["-15295"],{icon:1,time:1000});//清除成功
    							    		BimBdip.view.showAll();
    						    			bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
    						    			bimFileterColoring.showAllDbids();
    						    			var childidArr =[];
    							    		var checkBoxs = $(".check_btn");
    										for(var i = 0 ;i <checkBoxs.length;i++ ){
    											if($(checkBoxs[i]).is(":checked")){
    												var checkValue = $(checkBoxs[i]).val();
    												var childid=checkValue.split(",")[0];
    												var colortext=checkValue.split(",")[1];
    												childidArr.push(childid)
    											}
    										}
    										if(childidArr.length>0){
    						   	    			 bimFileterColoring.showColoringDbid(childidArr);
    						   	    		 }
    							    		return;
    							    	},
    							    	error:function(data){
    							    		console.log("修改失败.....");
    							    	}
    							    });
    							});
    						}
	    				}else{
	    					layer.msg(bdip4dLang[langType]["-15297"],{icon:0,time:2000});//"请选择需要清除颜色的构件"
	    					return ;
	    				}
		    		}else{
		    			return ;
		    		}
		    	},
		    	error:function(data){
		    		console.log("此处无构件，请重新添加构件");
		    	}
		    });
		},
		removeRepeat : function(dbidChanged){
			var ary = dbidChanged.split(","); 
			// 去重的算法
			var json = {}; 
			for (var i = 0; i < ary.length; i++) { 
				if (ary[i] != "") { 
					json["a" + ary[i]] = ary[i]; 
				} 
			} 
			// 查看结果
			var str2 = ""; 
			for (var key in json) { 
				str2 += "," + json[key]; 
			} 
			var dbids = str2.toString(); 
			//去掉第一个逗号
			if (dbids.substr(0, 1) == ',') { 
				dbids = dbids.substr(1); 
			} 
			return dbids;
		},
		EditorColoring : function(){
			$(".filter_coloring_box_content").hide();
			//var realurl = publicJS.tomcat_url+"/fileterColor/selectAllByModelId?modelid="+bimFileterColoring.currentModelid;
			var realurl ='../FilterColoring_selectAllByModelId.action?modelid='+bimFileterColoring.currentModelid;
			$.ajax({
			    type: "POST",
				url: realurl, 
				//processData: false,
				//contentType: false,
				dataType:"json",
				success: function(data){
					$("#editorColorbox").show();
					var htmli = "";
					if(data.code==200){
						var _data = data.data;
						if(_data.length>0 && _data != null){
							var click =2;
							setTimeout(() => {
								bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
							}, 500);
						}
					}
				},
				error : function(data){
					console.log("查询失败......");
				}
		    });
		},
		insertFileterColoring : function(colortext){  
			var click =2;
			var id = bimFileterColoring.randomWord(true,16,32);
			
			var date=new Date();
	      	var year = date.getFullYear();
	      	var month = date.getMonth()+1;
	      	var day = date.getDate();
	      	var hour = date.getHours();
	      	var minute = date.getMinutes();
	      	var second = date.getSeconds();
	      	var time=year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
			
			var name = bdip4dLang[langType]["-15299"];//"状态管理";
			
			var fileterColor = new FormData();
			fileterColor.append("fname",name);
			fileterColor.append("childid",id);
			fileterColor.append("color",colortext);
		    fileterColor.append("modelurl",bimFileterColoring.currentModelUrl);
			fileterColor.append("modelid",bimFileterColoring.currentModelid);
			fileterColor.append("username",bimFileterColoring.currentUsername);
			fileterColor.append("userid",bimFileterColoring.currentUserid);
			fileterColor.append("createTime",time);
			
			//var realurl = publicJS.tomcat_url+"/fileterColor/insertFileterColoring";
			var realurl = '../FilterColoring_insertFileterColoring.action';
			$.ajax({
		    	  url:realurl,
		    	  type:'POST',
		    	  data:fileterColor,
		    	  dataType:'text',
		    	  processData:false,
		    	  contentType:false,
		    	  success:function(data){
	    			    console.log(data.data);
	    			    //window.parent.newsPrompt('新建成功');
	    			    layer.msg(bdip4dLang[langType]["-15300"],{icon:1,time:1000});	//新建成功
	    			    /*alert('新建成功');*/
	    			    setTimeout(() => {
	    			    	//bimFileterColoring.ColoringComponent(id);
	    			    	bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
						}, 500);
	    				return;
		    	  },
		    	  error:function(){
		    		  console.log("新建失败.....");
		    	  }
		     });
		},
		deleteFileterColoring : function(childid,id,cmodelid){
        	var click = 2;
			//var realurl = publicJS.tomcat_url+"/fileterColor/selectAllByGjid?gjid="+gj_id+"&cmodelid="+cmodelid;
			var realurl ='../FilterColoring_selectAllByGjid.action?gjid='+childid+'&modelid='+cmodelid;
			var msg = bdip4dLang[langType]["-15302"];//"是否确认删除";
			Dialog.confirm(msg,function(){
			    $.ajax({
			    	url:realurl,
			    	type:'POST',
			    	dataType:'json',
			    	processData:false,
			    	contentType:false,
			    	success:function(data){
			    		if(data.code == 200){
			    			var _data = data.data;
				    		if(_data.length>0 && _data.length != null){
				    			var dbid = _data[0].dbid;
				    			if(dbid != null && dbid != '' && dbid != [] && dbid !='null'){
				    				//Dialog.alert("模型中有构件使用当前配色，无法删除，请先清除构件着色");
				    				layer.msg(bdip4dLang[langType]["-15303"],{icon:0,time:2000});
				    				return;
				    			}else{
				    				//var url = publicJS.tomcat_url+"/fileterColor/deleteFileterColoring?id="+id+"&childid="+childid;
				    				var url = '../FilterColoring_deleteFileterColoring.action?id='+id+'&childid='+childid;
				    				$.ajax({
				    	                url:url,
				    	                type:'GET',
				    	                dataType:'text',
				    	                processData:false,
				    	                contentType:false,
				    	                success:function(data){
				    	                	//window.parent.newsPrompt('删除成功!');
				    	                	layer.msg(bdip4dLang[langType]["-15304"],{icon:1,time:1000});
				    	                	/*alert('删除成功');*/
				    	                	bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
				    						bimFileterColoring.showAllDbids();
				    	                	setTimeout(function(){
				    	                		bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
				    	                	},500);
				    	                	return;
				    	                },
				    	                error:function(data){
				    	                	console.log('删除失败!');
				    	                	return false;
				    	                }
				    	             });
				    			}
				    		}else{
			    				//var realurl = publicJS.tomcat_url+"/fileterColor/deleteFileterColoring?id="+id;
			    				var realurl ='../FilterColoring_deleteFileterColoring.action?id='+id+'&childid='+childid;
			    				$.ajax({
			    	                url:realurl,
			    	                type:'GET',
			    	                dataType:'text',
			    	                processData:false,
			    	                contentType:false,
			    	                success:function(data){
			    	                	 //window.parent.newsPrompt('删除成功!');
			    	                	 layer.msg(bdip4dLang[langType]["-15304"],{icon:1,time:1000});
			    	                	/* alert("删除成功");*/
			    	                	 setTimeout(() => {
			    		    			    	bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
			    						  }, 500);
			    	                	 return ;
			    	                },
			    	                error:function(data){
			    	                	console.log('删除失败!');
			    	                	return false;
			    	                }
			    	             });
			    			}
			    		}
			    	},
			    	error : function(data){
			    		console.log('删除失败!');
			    		return false;
			    	}
			    });
			});
		},
		ReturnCustom : function(){   //返回自定义显示页面
			$("#colorBoard").remove();
			$(".editorColorbox").hide();
			//$(".editorColorbox").empty();
			$(".filter_coloring_box_content").show();
			var click = 1;
			setTimeout(() => {
			    bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
			}, 500);
		},
		/**================自定义显示模块操作--结束======================**/
		selectFilterByLmvid : function(lmvid,treeid){	//过滤器新增一条数据后快速查询该数据（最新添加的一条记录）
			var realurl =  '../FilterColoring_selectFilterByLmvid.action?lmvid='+lmvid;
			$.ajax({
			    type: "POST",
			    async:false,
				url: realurl, 
				//processData: false,
				//contentType: false,
				dataType:"json",
				success: function(data){
					if(data.code=='200'){
						var _data = data.data;
						if(_data.length>0 && _data!=null){
							for(var i =0;i<_data.length;i++){
								var filterid = _data[i].id;
								var conditionName =_data[i].conditionName ;
							    var finaldbids =_data[i].dbids ;
							    var modelurl = BimBdip.view_modelUrl;
							    var username = BimBdip.currentUsername;
							    var userid = BimBdip.currentUserid;
							    bimFileterColoring.insertEnableFilterColoring(filterid,treeid,conditionName,finaldbids,modelurl,lmvid,username,userid);
							}
						}
					}
				},
				error : function(data){
					console.log("查询失败");
				}
			});
		},
		insertEnableFilterColoring : function(filterid,treeid,fname,dbid,model_url,modelid,username,userid){   //拿到鹏鹏的过滤器数据后保存到fileter_coloring数据库中
			var filter_result = "false";
			var childid = bimFileterColoring.randomWord(true,16,32);
			var colortext = '#00FFFF';
			var date=new Date();
	      	var year = date.getFullYear();
	      	var month = date.getMonth()+1;
	      	var day = date.getDate();
	      	var hour = date.getHours();
	      	var minute = date.getMinutes();
	      	var second = date.getSeconds();
	      	var time=year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;	
	      	
			var fileterColor = new FormData();
			fileterColor.append("fname",fname);
			fileterColor.append("childid",childid);
			fileterColor.append("color",colortext);
		    fileterColor.append("modelurl",model_url);
			fileterColor.append("modelid",modelid);
			fileterColor.append("username",username);
			fileterColor.append("userid",userid);
			fileterColor.append("filterResult",filter_result);
			fileterColor.append("createTime",time);
			fileterColor.append("dbid",dbid);
			fileterColor.append("filterid",filterid);
			fileterColor.append("treeid",treeid);

			//var realurl = publicJS.tomcat_url+"/fileterColor/insertEnableFilterColoring";
			var realurl = '../FilterColoring_insertEnableFilterColoring.action';
			$.ajax({
		    	  url:realurl,
		    	  async:false,
		    	  type:'POST',
		    	  data:fileterColor,
		    	  dataType:'text',
		    	  processData:false,
		    	  contentType:false,
		    	  success:function(data){
		    		  //window.parent.newsPrompt('新建成功!');
		    		  layer.msg(bdip4dLang[langType]["-15300"],{icon:1,time:1000});
		    		  var click = 4;
					  bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
					  return;
		    	  },
		    	  error:function(){
		    		  console.log('新建失败!');
		    		  return false;
		    	  }
		     });
		},
		deleteFilterResultByFilterid : function(id){   //过滤器那边删除数据，着色跟着删除
			var realurl =  '../FilterColoring_selectFilterResultById.action?filterid='+id+'&modelid='+BimBdip.lvmid;
			$.ajax({
			    type: "POST",
			    async:false,
				url: realurl, 
				//processData: false,
				//contentType: false,
				dataType:"json",
				success: function(data){
					if(data.code == 200){
						var _data = data.data;
						if(_data.length>0 && _data != null){
							var childid = _data[0].childid; 
							var url = '../FilterColoring_deleteFilterResultByFilterid.action?filterid='+id+'&modelid='+BimBdip.lvmid+'&childid='+childid;
							$.ajax({
				                url:url,
				                type:'GET',
				                dataType:'text',
				                processData:false,
				                contentType:false,
				                success:function(data){
				                	layer.msg(bdip4dLang[langType]["-15304"],{icon:1,time:1000});//删除成功
				                	var click = 4;
				                	$('#editorColor-filterResult--tbody').html("");
				                	bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
				                	setTimeout(function(){
				                		var showTab2 = 3;  //"按过滤结果显示"页面跟着刷新
				                		$('#filterResult-tbody').html("");
				                		bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,showTab2);
				                	},1000);
				                },
				                error : function(data){
				                	console.log("删除失败");
				                }
							});
						}
					}
				},
				error : function(data){
					console.log("查询失败");
				}
			});
		},
		deleteFilterResultByTreeid : function(treeid){
			var url = '../FilterColoring_deleteFilterResultByTreeid.action?treeid='+treeid+'&modelid='+BimBdip.lvmid;
			$.ajax({
                url:url,
                type:'GET',
                dataType:'text',
                processData:false,
                contentType:false,
                success:function(data){
                	//layer.msg("删除成功",{icon:1,time:1000});
                	var click = 4;
                	$('#editorColor-filterResult--tbody').html("");
                	setTimeout(function(){
	                	bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
	                },500);
                	setTimeout(function(){
                		$('#filterResult-tbody').html("");
                		var showTab2 = 3; //"按过滤结果显示"页面跟着刷新
                		bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,showTab2);
                	},1500);
                },
                error : function(data){
                	console.log("删除失败");
                }
			});
		},
		updateFilterResultName : function(filterid,newName){
			var realurl = '../FilterColoring_updateFilterResultName.action?filterid='+filterid+'&modelid='+BimBdip.lvmid+'&fname='+newName;
    		$.ajax({
		  		url:realurl,
		  		type:'POST',
		  		dataType:'text',
		    	processData:false,
		    	contentType:false,
		    	success:function(data){
		    		console.log("修改成功....");
		    		var click = 4;
			    	bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
			    	setTimeout(function(){
                		var showTab2 = 3;  //"按过滤结果显示"页面跟着刷新
                		bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,showTab2);
                	},1000);
		    	 },
		    	 error:function(){
		    		 console.log("修改失败......");
		    	 }
		  	});
		},
		EnableFilterResults : function(id,childid,filter_result){   //点击"启用"将filter_result字段值“false”改为“true” 则表示启动
			if(filter_result == 'true'){
				//window.parent.newsPrompt("该构件已经被启用");
	    		layer.msg(bdip4dLang[langType]["-15307"],{icon:0,time:1000});
				return;
			}else{
				var filter_result ="true";
				//var realurl = publicJS.tomcat_url+"/fileterColor/updateEnableFilterResults?id="+id+"&childid="+childid+'&filter_result='+filter_result;
				var realurl = '../FilterColoring_updateEnableFilterResults.action?id='+id+'&childid='+childid+'&filterResult='+filter_result;
	    		$.ajax({
			  		url:realurl,
			  		type:'GET',
			  		dataType:'text',
			    	processData:false,
			    	contentType:false,
			    	async:false,
			    	success:function(data){
			    		//window.parent.newsPrompt("启用成功");
			    		layer.msg(bdip4dLang[langType]["-15308"],{icon:1,time:1000});
			    		bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
						bimFileterColoring.showAllDbids();
			    		var click = 4;
						bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
						return;
			    	},
			    	error:function(){
			    		console.log("启用失败");
			    	}
			  	});
			}
		},
		CloseFileterResult : function(id,childid,filter_result){ 		//点击"关闭"将filter_result字段值“false”改为“true” 则表示启动
			if(filter_result == 'false'){
				//window.parent.newsPrompt("该构件已经被关闭");
				layer.msg(bdip4dLang[langType]["-15310"],{icon:0,time:2000});
				return;
			}else{
				var filter_result = 'false';
				//var realurl = publicJS.tomcat_url+"/fileterColor/updateCloseFilterResults?id="+id+'&childid='+childid+'&filter_result='+filter_result;
				var realurl = '../FilterColoring_updateCloseFilterResults.action?id='+id+'&childid='+childid+'&filterResult='+filter_result;
				$.ajax({
				    type: "POST",
					url: realurl, 
					processData: false,
					contentType: false,
					dataType:"text",
					success: function(data){
						//window.parent.newsPrompt("关闭成功");
						layer.msg(bdip4dLang[langType]["-15311"],{icon:1,time:1000});
						bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
						bimFileterColoring.showAllDbids();
						var click = 4;
						bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
						return;
					},
					error : function(data){
						console.log("修改失败");
					}
			    });
			}
		},
		EditorTabtwoColoring : function(){    //点击tab2 “编辑着色方案”
			var click =4;
			$(".filter_coloring_box_content").hide();
			//$(".filter_coloring_box_content").empty();
			//var realurl = publicJS.tomcat_url+"/fileterColor/selectAllByModelId?modelid="+bimFileterColoring.currentModelid;
			var realurl = '../FilterColoring_selectAllByModelId.action?modelid='+bimFileterColoring.currentModelid;
			$.ajax({
			    type: "GET",
				url: realurl, 
				processData: false,
				contentType: false,
				dataType:"json",
				success: function(data){
					$("#editorColorbox_filterResult").show();
					var htmli = "";
					if(data.code == 200){
						var _data = data.data;
						if(_data.length>0 && _data != null){
							bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
						}
					}
				},
				error : function(data){
					console.log("查询失败");
				}
		    });
		},
		ReturnFilterResults : function(){  //点击tab2 “返回”
			$("#editorColorbox_filterResult").hide();
			$(".filter_coloring_box_content").show();
			bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
			bimFileterColoring.showAllDbids();
			$('#filterResult-tbody').html("");
			var click = 3;
			bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
		},
		/**====================公用方法--开始=======================**/
		updateFilterColorName : function(element,childid,id,modelid){
			var click = 2;
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
		        	//var realurl = publicJS.tomcat_url+"/fileterColor/updateFilterColorName?childid="+childid+"&fname="+newobj.value;
		        	var realurl = '../FilterColoring_updateFilterColorName.action?childid='+childid+'&fname='+newobj.value+'&id='+id+'&modelid='+modelid;
	        		$.ajax({
				  		url:realurl,
				  		type:'POST',
				  		dataType:'text',
				    	processData:false,
				    	contentType:false,
				    	success:function(data){
				    		console.log("修改成功....");
				    		setTimeout(() => {
		    			    	bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
							},500);
				    	 },
				    	 error:function(){
				    		 console.log("修改失败......");
				    	 }
				  	});
	        	}
	        }
		},
		checkAllColors : function(event){
			var event = event.srcElement?event.srcElement:event.target;
			var status = event.getAttribute("_isChecked");
			var allBtn = event.nextSibling;
			if(status == "false"){
				event.style.backgroundPosition = "18px";
				event.setAttribute("_isChecked","true");
				event.nextSibling.checked = true;
				bimFileterColoring.checkAllColoring(allBtn);
			}else{
				event.style.backgroundPosition = "0px";/*black*/
				event.setAttribute("_isChecked","false");
				event.nextSibling.checked = false;
				bimFileterColoring.checkAllColoring(allBtn);
			} 
		},
		checkFileterAllColors : function(event){
			var event = event.srcElement?event.srcElement:event.target;
			var status = event.getAttribute("_isChecked");
			var allBtn = event.nextSibling;
			if(status == "false"){
				event.style.backgroundPosition = "18px";
				event.setAttribute("_isChecked","true");
				event.nextSibling.checked = true;
				bimFileterColoring.checkFilterAllColoring(allBtn);
			}else{
				event.style.backgroundPosition = "0px";/*black*/
				event.setAttribute("_isChecked","false");
				event.nextSibling.checked = false;
				bimFileterColoring.checkFilterAllColoring(allBtn);
			} 
		},
		checkAllColoring : function(obj){    //全选
			  showMask("loading...");
			  var childidArr = new Array();
//	          var checkName=document.getElementsByName("answer");
			  var table = obj.closest("table");
	          var checkName= $(table).find("input[name=answer]");
	          var checkB = document.getElementsByClassName("check_b");
	          var checkBtn = document.getElementsByClassName("check_btn_color")[0];
	          for(var i=0;i<checkName.length;i++){
	        	  checkName[i].checked=obj.checked;
	        	  if(checkName[i].checked == false){
	        		  checkBtn.style.backgroundPosition = "0px";/*black*/
	        		  checkBtn.setAttribute("_isChecked","false");
	        		  checkB[i].style.backgroundPosition = "0px";/*black*/
	        		  checkB[i].setAttribute("_isChecked","false");
	        		  BimBdip.view.showAll();
	        		  bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
	        		  bimFileterColoring.showAllDbids();
	        	  }else{
	        		  checkBtn.style.backgroundPosition = "18px";
	        		  checkBtn.setAttribute("_isChecked","true");
	        		  checkB[i].style.backgroundPosition = "18px";
	        		  checkB[i].setAttribute("_isChecked","true");
		        	  var checkValue = checkName[i].value;
		        	  var childid=checkValue.split(",")[0];
					  var colortext=checkValue.split(",")[1];
		        	 /* var key1 = "fileterColorings["+i+"].childid";
		        	  var key2 = "fileterColorings["+i+"].color";
		        	  tmp[key1] = checkValue.split(",")[0];
					  tmp[key2] = checkValue.split(",")[1]
					  childidArr.push(tmp);*/
					  childidArr.push(childid);
					  //bimFileterColoring.showColoringDbid(childid,colortext);
	        	  }
	          }
	          console.log(childidArr);
	          if(childidArr.length>0){
	        	  bimFileterColoring.showColoringDbid(childidArr);
	          }else{
	        	  if($(":checkbox[name=answer]:checked").size() == 0){
						BimBdip.view.showAll();   //若复选框全部取消则显示全部构件
						bimFileterColoring.showAllDbids();
						var checkAll = $(".checkAll");
						checkAll.checked = false;
					}
	          }
	          hideMask();
		},
       checkFilterAllColoring : function(obj){    //按过滤器结果显示——全选
			  showMask("loading...");
			  var table = obj.closest("table");
	          var checkName= $(table).find("input[name=answer]");//getElementsByName("answer_filter");
	          var checkB = document.getElementsByClassName("check_filter_b");
	          var checkBtn = document.getElementsByClassName("check_btn_color")[0];
	          var childidArr = new Array();
	          for(var i=0;i<checkName.length;i++){
	        	  checkName[i].checked=obj.checked;
	        	  if(checkName[i].checked == false){
	        		  checkBtn.style.backgroundPosition = "0px";/*black*/
	        		  checkBtn.setAttribute("_isChecked","false");
	        		  checkB[i].style.backgroundPosition = "0px";/*black*/
	        		  checkB[i].setAttribute("_isChecked","false");
	        		  BimBdip.view.showAll();
	        		  bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
	        		  bimFileterColoring.showAllDbids();
	        	  }else{
	        		  checkBtn.style.backgroundPosition = "18px";
	        		  checkBtn.setAttribute("_isChecked","true");
	        		  checkB[i].style.backgroundPosition = "18px";
	        		  checkB[i].setAttribute("_isChecked","true");
		        	  var checkValue = checkName[i].value;
		        	  var childid=checkValue.split(",")[0];
					  var colortext=checkValue.split(",")[1];
					  childidArr.push(childid);
	        	  }
	          }
	          console.log(childidArr);
	          if(childidArr.length>0){
	        	  bimFileterColoring.showColoringDbid(childidArr);
	          }else{
	        	  if($(":checkbox[name=answer]:checked").size() == 0){
						BimBdip.view.showAll();   //若复选框全部取消则显示全部构件
						bimFileterColoring.showAllDbids();
						var checkAll = $(".checkAll");
						checkAll.checked = false;
					}
	          }
	          hideMask();
		},
		isCheck:function(event){
			var event = event.srcElement?event.srcElement:event.target;
			var status = event.getAttribute("_isChecked");
			if(status == "false"){
				event.style.backgroundPosition = "18px";
				event.setAttribute("_isChecked","true");
				event.nextSibling.checked = true;
				bimFileterColoring.onCheck();
			}else{
				event.style.backgroundPosition = "0px";/*black*/
				event.setAttribute("_isChecked","false");
				event.nextSibling.checked = false;
				bimFileterColoring.onCheck();
			}
		},
		onCheck:function(){    //勾选列表构件
			showMask("loading...");
			bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
			bimFileterColoring.showAllDbids();
			var checkBoxs = $(".check_btn");
			var childidArr =[];
			for(var i = 0 ;i <checkBoxs.length;i++ ){
				if($(checkBoxs[i]).is(":checked")){
					//bimFileterColoring.isFirstClick = true;
					var checkValue = $(checkBoxs[i]).val();
					var childid=checkValue.split(",")[0];
					var colortext=checkValue.split(",")[1];
					childidArr.push(childid);
					//bimFileterColoring.showColoringDbid(childid,colortext);
				}
			}
			if(childidArr.length>0){
				bimFileterColoring.showColoringDbid(childidArr);
			}else{
				if($(":checkbox[name=answer]:checked").size() == 0){
					BimBdip.view.showAll();   //若复选框全部取消则显示全部构件
					bimFileterColoring.showAllDbids();
					var checkAll = $(".checkAll");
					checkAll.checked = false;
				}
			}
			hideMask();
		},
		//showColoringDbid: function(childid,colortext){		//勾选显示隐藏着色构件
		showColoringDbid: function(childidArr){		//勾选显示隐藏着色构件

			var bimRoomCheck = new Array();
			bimFileterColoring.dbidcheck=[];
			//var realurl = publicJS.tomcat_url+"/fileterColor/selectAllByGjid?cmodelid="+bimFileterColoring.currentModelid+"&gjid="+childidArr;
			var realurl = '../FilterColoring_selectAllByGjid.action?modelid='+bimFileterColoring.currentModelid+'&gjid='+childidArr;
		    $.ajax({
		    	url:realurl,
		    	type:'get',
		    	//data : JSON.stringify(childidArr),
		    	dataType:'json',
		    	//contentType : 'application/json;charset=utf-8', //设置请求头信息  
		    	//processData:false,
		    	//contentType:false,
		    	async:false,
		    	success:function(data){ 
		    		if(data.code==200){
		    			var _data = data.data;
		    			var dbidArr;
		    			if(_data.length>0){
		    				for(var i = 0 ;i <_data.length;i++){
	    						bimFileterColoring.currentDbid += _data[i].dbid +",";
								dbidArr=_data[i].dbid.split(",");
                                for(var j = 0 ; j <  dbidArr.length;j++){
                                    bimRoomCheck.push(dbidArr[j]);
							    }

								var colortext = _data[i].compColor;
								if(colortext!='undefined' && colortext !=undefined){
									for(var j=0;j<dbidArr.length;j++){
			    						BimBdip.view.getColors(parseInt(dbidArr[j]),colortext);
			    						bimFileterColoring.dbidcheck.push(parseInt(dbidArr[j]));
						            }
								}
		    				}
                            BimBdip.checkRoomDbids(bimRoomCheck);
		    				if(dbidArr[0] == [""] || dbidArr[0] == "null"){
								//window.parent.newsPrompt("此处无构件，请重新添加构件");
								layer.msg(bdip4dLang[langType]["-15298"],{icon:7,time:2000});								
				    			return false;
							}
		    			}else{
		    				layer.msg(bdip4dLang[langType]["-15298"],{icon:7,time:2000});
			    			return false;
		    			}
		    		}
		    	},
		    	error:function(data){
		    		console.log("勾选显示错误");
		    	}
		    });
		},
		removeColor:function(currentDbid){
			BimBdip.view.getColors(0,"#000000");
			if(currentDbid){
				var dbidArr=currentDbid.split(",");
				for(var j=0;j<dbidArr.length;j++){
					BimBdip.view.restoreColorMaterial(parseInt(dbidArr[j]));
	            }
			}
			bimFileterColoring.currentDbid ="";
		},
		dbidIsolate:function(currentDbid){
			if(currentDbid){
				var dbidarr = [];
				var tempArr = currentDbid.split(",");
				for(var i = 0 ; i <  tempArr.length ; i++){
					if(tempArr[i]){
						dbidarr.push(parseInt(tempArr[i]));
					}
				}
				BimBdip.view.isolate(dbidarr);
			}
		},
		hideNonColoring : function(){  ///“隐藏未选择的构件”
			showMask("loading...");
            var checkName=document.getElementsByName("answer");
		    var childidArr =[];
		    if($(".checkHidden")[0].checked == true){
		    	//勾选“隐藏未选中的构件”，当没有勾选列表里面的构件时就隔离模型全部构件
     		    if($(":checkbox[name=answer]:checked").size() == 0){   
   					var dbids = BimBdip.view.model.getFragmentList().fragments.fragId2dbId;
					BimBdip.view.isolate(dbids);
					//layer.msg("此处无构件，请重新添加构件",{icon:7,time:2000});
					hideMask();
	    			return ;
				}
		    }
            for(var i=0;i<checkName.length;i++){
        	   bimFileterColoring.checkName = $(checkName[i]).is(":checked");
        	   if($(".checkHidden")[0].checked == true){
        		   if(bimFileterColoring.checkName){
        			   var checkValue = checkName[i].value;
     	        	   var childid = checkValue.split(",")[0];
     				   var colortext = checkValue.split(",")[1];
     				   childidArr.push(childid);
     				   bimFileterColoring.dbidIsolate(bimFileterColoring.currentDbid);
            	   }
        	   }else{
					BimBdip.view.showAll();   //若复选框全部取消则显示全部构件
					bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
					bimFileterColoring.showAllDbids();
					if($(":checkbox[name=answer]:checked").size() == 0){   
						hideMask();
						return;
					}else{
      					var checkBoxs = $(".check_btn");
     	       		   	for(var i = 0 ;i <checkBoxs.length;i++ ){
     	       				if($(checkBoxs[i]).is(":checked")){
     	       					var checkValue = $(checkBoxs[i]).val();
     	       					var childid=checkValue.split(",")[0];
     	       					var colortext=checkValue.split(",")[1];
     	       					childidArr.push(childid);
     	       				}
     	       		   	}
      				}
        	   }
           }
   		   bimFileterColoring.showColoringDbid(childidArr);
           hideMask();
		},
		hideNonFilterColoring : function(){
			showMask("loading...");
		    var checkName=document.getElementsByName("answer");
		    var childidArr =[];
		    if($(".checkHiddenFilter")[0].checked == true){
		    	//勾选“隐藏未选中的构件”，当没有勾选列表里面的构件时就隔离模型全部构件
        		if($(":checkbox[name=answer]:checked").size() == 0){   
      				var dbids = BimBdip.view.model.getFragmentList().fragments.fragId2dbId;
       				BimBdip.view.isolate(dbids);
       				//window.parent.newsPrompt("此处无构件，请重新添加构件");
       				hideMask();
		    		return ;
       			}
		    }
	        for(var i=0;i<checkName.length;i++){
	        	bimFileterColoring.checkName = $(checkName[i]).is(":checked");
	        	if($(".checkHiddenFilter")[0].checked == true){
	        		if(bimFileterColoring.checkName){
	        			var checkValue = checkName[i].value;
	     	        	var childid = checkValue.split(",")[0];
	     				var colortext = checkValue.split(",")[1];
	     				childidArr.push(childid);
	     				bimFileterColoring.dbidIsolate(bimFileterColoring.currentDbid);
	     				hideMask();
	     				return;
	            	 }
	        	}else{
	        		   BimBdip.view.showAll();   //若复选框全部取消则显示全部构件
	        		   bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
	        		   bimFileterColoring.showAllDbids();
	        		   if($(":checkbox[name=answer]:checked").size() == 0){   
							hideMask();
							return;
						}else{
		        		   var checkBoxs = $(".check_btn");
			       		   for(var i = 0 ;i <checkBoxs.length;i++ ){
			       				if($(checkBoxs[i]).is(":checked")){
			       					var checkValue = $(checkBoxs[i]).val();
			       					var childid=checkValue.split(",")[0];
			       					var colortext=checkValue.split(",")[1];
			       					childidArr.push(childid);
			       				}
			       		  }
					  }
	        	}
	        }
	        bimFileterColoring.showColoringDbid(childidArr);
            hideMask();
		},
		showNonColoring : function(childidArr){
			bimFileterColoring.dbidcheck=[];
			//var gj_id = childid;
			//var realurl = publicJS.tomcat_url+"/fileterColor/selectAllByGjid?gjid="+gj_id;
			var realurl = '../FilterColoring_selectAllByGjid.action?modelid='+bimFileterColoring.currentModelid+'&gjid='+childidArr;
		    $.ajax({
		    	url:realurl,
		    	type:'POST',
		    	dataType:'json',
		    	processData:false,
		    	contentType:false,
		    	async:false,
		    	success:function(data){
		    		if(data.code==200){
		    			var _data = data.data;	
		    				for(var i = 0 ;i <_data.length;i++){
		    					bimFileterColoring.currentDbid += _data[i].dbid +",";
		    					var dbidArr=_data[i].dbid.split(",");
								var colortext = _data[i].compColor;
		    					for(var j=0;j<dbidArr.length;j++){
		    						var dbid = parseInt(dbidArr[j]);
		    						if(dbid==NaN || dbid=="" || dbid =='NaN'){
		    						}else{
		    							BimBdip.view.getColors(dbid,colortext);
		    						}
					            }
		    				}
		    		}else{
		    			return ;
		    		}
		    	},
		    	error:function(data){
		    		console.log("此处无构件，请重新添加构件");
		    	}
		    });
		},
		doUpdateColor : function(colortext,childid,modelid){
			var click =2;
		  	var changeColor=colortext.replace(/#/g,'');
		  	//var realurl = publicJS.tomcat_url+"/fileterColor/updateColor?color="+changColor+"&childid="+childid;
		  	var realurl = '../FilterColoring_updateColor.action?color='+changeColor+'&childid='+childid+"&modelid="+modelid;
		  	$.ajax({
				  url:realurl,
				  type:'POST',
				  dataType:'text',
				  processData:false,
				  contentType:false,
				  success:function(data){
					  BimBdip.view.navigation.setRequestHomeView(true);
					  bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
					  bimFileterColoring.showAllDbids();
					  setTimeout(() => {
		    			    bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
						}, 500);
				  },
				  error:function(data){
					  console.log("修改颜色错误");
				  }
			  }); 
		},
		doUpdateFilterResultColor : function(colortext,childid,modelid){
			var click =4;
		  	var changeColor=colortext.replace(/#/g,'');
		  	//var realurl = publicJS.tomcat_url+"/fileterColor/updateColor?color="+changColor+"&childid="+childid;
		  	var realurl = '../FilterColoring_updateColor.action?color='+changeColor+'&childid='+childid+"&modelid="+modelid;
		  	$.ajax({
				  url:realurl,
				  type:'POST',
				  dataType:'text',
				  processData:false,
				  contentType:false,
				  success:function(data){
					  BimBdip.view.navigation.setRequestHomeView(true);
					  bimFileterColoring.removeColor(bimFileterColoring.currentDbid);
					  bimFileterColoring.showAllDbids();
					  setTimeout(() => {
		    			    bimFileterColoring.selectAllByModelId(bimFileterColoring.currentModelid,click);
						}, 500);
				  },
				  error:function(data){
					  console.log("修改颜色错误");
				  }
			  }); 
		},
		/**====================公用方法--结束=======================**/
		NewBuild : function(newBuild){  //tab1  “新建”
			newBuild= "newBuild";
			bimFileterColoring.colorSelect('nowColor','pageColorViews','event',newBuild)
		},
		NewBuildFilterResult : function(newBuildResult){   //tab2  “新建”
			newBuildFilterResult= "newBuildFilterResult";
			$('.filter_box').show();
			filterExecute.modelAttributeTypes();
			//bimFileterColoring.insertEnableFilterColoring('测试111','4339');
		},
		/**===================调色板开始======================**/
		getScrollPos : function() {
			var t, l;
			if(typeof window.pageYOffset != 'undefined') {
				t = window.pageYOffset;
				l = window.pageXOffset;
			} else {
				t = getBody().scrollTop;
				l = getBody().scrollLeft;
			}
			return {
				t: t,
				l: l
			};
		},
		getBody : function(){
			var Body;
			if(typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
				Body = document.documentElement;
			} else if(typeof document.body != 'undefined') {
				Body = document.body;
			}
			return Body;
		},
		formatRgb : function(rgb){
			rgb = rgb.replace("rgb", "");
			rgb = rgb.replace("(", "");
			rgb = rgb.replace(")", "");
			format = rgb.split(",");
			a = eval(format[0]).toString(16);
			b = eval(format[1]).toString(16);
			c = eval(format[2]).toString(16);
			rgb = "#" + checkFF(a) + checkFF(b) + checkFF(c);

			function checkFF(str) {
				if(str.length == 1) {
					str = str + "" + str;
					return str;
				} else {
					return str;
				}
			}
			return rgb;
		},
		colorSelect : function(now, page, event,newBuild,childid,modelid) {	 //now, page, e  //onclick="colorSelect('nowColor','pageColorViews',event)"
			if(document.getElementById("colorBoard")) {
				return;
			}
			var evt = getEvent();  
			//var event = event.srcElement ? event.srcElement:event.target;
			var el=evt.target||evt.srcElement;  
			var top=0;  
            var left=0;  
            while(el){//递归求元素所在页面的位置  
                top += el.offsetTop;//el.offsetTop的值是el元素的上起始位置相对于父元素的上起始位置的差值，所以需要递归相加  
                left += el.offsetLeft;  
                el = el.offsetParent;  
            }  
            var clientX=left;  
            var clientY=top;  
			 
			//关于出现位置
			var scrollpos = bimFileterColoring.getScrollPos();
			var le = scrollpos.l + clientX;
			var to = scrollpos.t + clientY + 10;
			if(le > bimFileterColoring.getBody().clientWidth - 320) {
				le = bimFileterColoring.getBody().clientWidth - 320;
			}
			//创建DOM
			var nowColor = document.getElementById(now);
			var pageColorViews = document.getElementById(page);
			var ColorHex = new Array('00', '33', '66', '99', 'CC', 'FF');
			var SpColorHex = new Array('FF0000', '00FF00', '0000FF', 'FFFF00', '00FFFF', 'FF00FF');
			var colorBank = document.createElement("div");
			colorBank.setAttribute("id", "colorBank");
			var colorViews = document.createElement("div");
			colorViews.setAttribute("id", "colorViews");
			var colorInput = document.createElement("input");
			colorInput.setAttribute("id", "colorInput");
			colorInput.setAttribute("type", "text");
			colorInput.setAttribute("disabled", "disabled");
			bimFileterColoring.colorClose = document.createElement("input");
			bimFileterColoring.colorClose.setAttribute("id", "colorClose");
			bimFileterColoring.colorClose.setAttribute("value", bdip4dLang[langType]["-15313"]);
			bimFileterColoring.colorClose.setAttribute("type", "button");
			bimFileterColoring.colorClose.onclick = function() {
				document.body.removeChild(colorBoard)
			};
			
			var colorBoard = document.createElement("div");
			colorBoard.id = "colorBoard";
			colorBoard.appendChild(colorViews);
			colorBoard.appendChild(colorInput);
			colorBoard.appendChild(bimFileterColoring.colorClose);
			colorBoard.appendChild(colorBank);
			document.body.appendChild(colorBoard);
			colorBoard.style.left = le + "px";
			colorBoard.style.top = to + "px";
			//wyj 点击底部选颜色时 控制着色版位置
			var maxTop = document.body.clientHeight - 300
			if(to > maxTop ){
				colorBoard.style.top =  "auto";
				colorBoard.style.bottom = "5%";
			}
			//循环出调色板
			for(b = 0; b < 6; b++) {
				for(a = 0; a < 3; a++) {
					for(i = 0; i < 6; i++) {
						colorItem = document.createElement("div");
						colorItem.style.backgroundColor = "#" + ColorHex[a] + ColorHex[i] + ColorHex[b];
						colorBank.appendChild(colorItem);
					}
				}
			}
			for(b = 0; b < 6; b++) {
				for(a = 3; a < 6; a++) {
					for(i = 0; i < 6; i++) {
						colorItem = document.createElement("div");
						colorItem.style.backgroundColor = "#" + ColorHex[a] + ColorHex[i] + ColorHex[b];
						colorBank.appendChild(colorItem);
					}
				}
			}
			for(i = 0; i < 6; i++) {
				colorItem = document.createElement("div");
				colorItem.style.backgroundColor = "#" + ColorHex[0] + ColorHex[0] + ColorHex[0];
				colorBank.appendChild(colorItem);
			}
			for(i = 0; i < 6; i++) {
				colorItem = document.createElement("div");
				colorItem.style.backgroundColor = "#" + ColorHex[i] + ColorHex[i] + ColorHex[i];
				colorBank.appendChild(colorItem);
			}
			for(i = 0; i < 6; i++) {
				colorItem = document.createElement("div");
				colorItem.style.backgroundColor = "#" + SpColorHex[i];
				colorBank.appendChild(colorItem);
			}
			var colorItems = colorBank.getElementsByTagName("div");
			for(i = 0; i < colorItems.length; i++) {
				colorItems[i].onmouseover = function() {
					a = this.style.backgroundColor;
					if(a.length > 7) {
						a = bimFileterColoring.formatRgb(a); 
					}
					colorViews.style.background = a.toUpperCase();
					colorInput.value = a.toUpperCase();
				}
				colorItems[i].onclick = function() {
					a = this.style.backgroundColor;
					if(a.length > 7) {
						a = bimFileterColoring.formatRgb(a); 
					}
					nowColor.value = a.toUpperCase();
					colortext=nowColor.value;
					pageColorViews.style.background = a.toUpperCase();
					if(newBuild == "newBuild"){
						console.log("newBuild------");
						bimFileterColoring.insertFileterColoring(colortext)
					}
					else if(newBuild=="updateFilterResultColor"){
						bimFileterColoring.doUpdateFilterResultColor(colortext,childid,modelid);
					}
					else{
						console.log("updateColor------");
						bimFileterColoring.doUpdateColor(colortext,childid,modelid);
					}
					document.body.removeChild(colorBoard);
				}
			}
		},/**====================调色板结束====================**/
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
	  }
}

function getEvent() {  
    if (document.all) {  
        return window.event;// 如果是ie  
    }  
    func = getEvent.caller;  
    while (func != null) {  
        var arg0 = func.arguments[0];  
        if (arg0) {  
            if ((arg0.constructor == Event || arg0.constructor == MouseEvent)  
                    || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {  
                return arg0;  
            }  
        }  
        func = func.caller;  
    }  
    return null;  
}  


$('#filter_coloring_tabs li').click(function() {
    var i = $(this).index();//下标第一种写法
    //var i = $('tabs').index(this);//下标第二种写法
    $(this).addClass('filter_coloring_current').siblings().removeClass('filter_coloring_current');
    $('#filter_coloring_menu_content_box div.filter_coloring_menu_table').eq(i).show().siblings().hide();
});
