var BimLinkage = {
		iViewer : null,
		ifchoese : true,
		be3DViewer : true,
		clearNum : 1,
		modelids : null,
		arH : null,
		countH : null,
		button1 : null,
		button2 : null,
		button3 : null,
		button4 : null,
		_SubToolbar1 : null,
		_SubToolbar2 : null,
		_SubToolbar3 : null,
		_SubToolbar4 : null,
		Toolbar1 : null,
		Toolbar2 : null,
		Toolbar3 : null,
		Toolbar4 : null,
		currentLmvId : null,
		currentThreeUrl : null,
		currentTwoUrl : null,
		modelVersion : null,
		treeId : null,
		count : 1,
		isFirst : true,
		winWidth : window.innerWidth,
		winHeight : window.innerHeight,
        dockingPanelNone : function(){
            var markupClass = $(".markup");
            if(markupClass && markupClass.length>0){
                for(var i = 0;i<markupClass.length;i++){
                    var mark = markupClass[i];
                    mark.style.display = "none";
                }
            }
        },
        changeToCad : function(){// 执行后，小窗口呈现2D图纸,3D模型放大
        	BimLinkage.show3D();
        	if(BimLinkage._SubToolbar1 != null){
        		BimLinkage._SubToolbar1.addControl(BimLinkage.button1);
        	}
        	if(BimLinkage._SubToolbar2 != null){
        		BimLinkage._SubToolbar2.removeControl(BimLinkage.button2);
        	}
    		if(BimLinkage._SubToolbar3 != null){
    			BimLinkage._SubToolbar3.addControl(BimLinkage.button3);
    		}
        	BimLinkage.count = 0;
        },
        changeToViewer : function(){ //执行后，小窗口呈现3D模型,2D 图纸放大
        	BimLinkage.show2D();
        	BimLinkage._SubToolbar1.removeControl(BimLinkage.button1);
        	BimLinkage._SubToolbar2.addControl(BimLinkage.button2);
        },
        changeToCadlink : function(){		//当2D图纸“小化”时选择下拉框触发事件
        	BimLinkage.show2D();
        	BimLinkage._SubToolbar1.removeControl(BimLinkage.button1);
            BimLinkage._SubToolbar2.addControl(BimLinkage.button2);
            BimLinkage._SubToolbar3.removeControl(BimLinkage.button3);
        },
        changeToCadlink_small : function(){	//当2D图纸“放大”时选择下拉框时触发事件
        	BimLinkage.show3D();  //3D模型放大
        	if(BimLinkage._SubToolbar1 != null){
        		BimLinkage._SubToolbar1.addControl(BimLinkage.button1);
        	}
    		if(BimLinkage._SubToolbar3 != null){
    			BimLinkage._SubToolbar3.addControl(BimLinkage.button3);
    		}
        	if(BimLinkage._SubToolbar4 != null){
        		BimLinkage._SubToolbar4.removeControl(BimLinkage.button4);
        	}
        },
		showTwoDModel : function(docs2D,sharedPropertyDbPath){
			var options2D ={ 'docid2D': docs2D[0].path, env: '' } ;//cad图的路径
			//if(checkLocalUrl(publicJS.tomcat_url+"/filebim/wendang/"+options2D)) {  //tzw
	            var menuElement = document.getElementById('menu');
	            BimLinkage.iViewer =new Autodesk.Viewing.Private.GuiViewer3D (menuElement, {}) ;
	            BimBdip.td_view = BimLinkage.iViewer;
	        	Autodesk.Viewing.Initializer (options2D, function () {
	        		BimLinkage.iViewer.initialize () ;
	        		BimLinkage.iViewer.load (options2D.docid2D,sharedPropertyDbPath);
	        		BimLinkage.iViewer.addEventListener (Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function (event) {
	                    setTimeout (function () {BimLinkage.iViewer.autocam.setHomeViewFrom (BimLinkage.iViewer.navigation.getCamera ()) ; }, 1000) ;
	                    BimLinkage.iViewer.setGhosting(false);
	                    BimLinkage.createToolbar();
	                    if(BimLinkage.clearNum == 0){
	                    	BimLinkage.clear3DBtn();
	                    	BimLinkage.clearNum = 1;
	                    }else{
	                    	BimLinkage.clear2DBtn();
	                    	BimLinkage.clearNum = 0;
	                    }
	                    BimLinkage.iViewer.addEventListener("selection",function (event){
	                        if(BimLinkage.ifchoese==true){
	                        	BimLinkage.iViewer.getProperties(BimLinkage.iViewer.getSelection()[0],BimLinkage.getSelectionCAD);
	                        	BimLinkage.ifchoese=false;
	                        }else{
	                        	BimLinkage.ifchoese=true;
	                        }
	                    });
	                }) ;
				});
	        	BimLinkage.changeToCad();
			//}
		},
		createToolbar : function(){
			BimLinkage._SubToolbar1 = new Autodesk.Viewing.UI.ControlGroup("viewer_control_group");
			BimLinkage.button1 = new Autodesk.Viewing.UI.Button("viewer_tb_button_1");
			BimLinkage.Toolbar1 = BimLinkage.iViewer.getToolbar(true);  
			BimLinkage.button1.setIcon("changeViewer");
			BimLinkage.button1.setToolTip(bdip4dLang[langType]["-16101"]);	//"切换至3D //在2D图纸框中创建按钮
			BimLinkage.button1.onClick = function(e) {
					////clearMarkupStatus(BimLinkage.iViewer);//离开视点涂鸦模型
	            	BimLinkage.clear3DBtn();
	            	BimLinkage.show2DBtn();
	            	////BimLinkage.createToolsOf2D(); //2D 创建视点保存按钮
	            	BimLinkage.changeToViewer();
            };
            BimLinkage._SubToolbar2 = new Autodesk.Viewing.UI.ControlGroup("viewer_control_group");
            BimLinkage.button2 = new Autodesk.Viewing.UI.Button("viewer_tb_button_1");
            BimLinkage.Toolbar2 = BimBdip.view.getToolbar(true);  
            BimLinkage.button2.setIcon("changeViewer");
            BimLinkage.button2.setToolTip(bdip4dLang[langType]["-16102"]);	//"切换至2D");//在3D图纸框中创建按钮
            BimLinkage.button2.onClick = function(e) {
            		////clearMarkupStatus(BimBdip.view);
            		BimLinkage.clear2DBtn();
            		BimLinkage.show3DBtn();
            		BimLinkage.changeToCad();
            };
            BimLinkage.Toolbar1.addControl(BimLinkage._SubToolbar1);
            BimLinkage.Toolbar2.addControl(BimLinkage._SubToolbar2);
            BimLinkage._SubToolbar1.addControl(BimLinkage.button1);
		},
		SelectTdModel : function(currentTwoUrl,currentUrlName,modelid,modelversion,modelObject){
			BimLinkage.Id = modelid;
			BimLinkage.modelVersion = modelversion;
			BimLinkage.currentThreeUrl = currentUrl;
			var tdurl;
			var count = 0;
            $('#menu').show();
            var j=0;
            var nameVal;
            var realurl = '../Linkage_getTdUrl.action?id='+BimLinkage.Id+'&url='+BimLinkage.currentThreeUrl;
	        $.ajax({
	          	  url:realurl,
	              type:'POST',
	              dataType:'json',
	              async: false,
	              success:function(data){
	                console.log("查询成功》》》》");
	                var htmli="";
	                if(data.code==200){
	                	var _data = data.data;
	                	if(_data[0].tdurl != undefined && _data[0].tdurl !="" && _data[0].tdurl != null){
	                		if(_data[0].tdurl.length>0){
				                var td_url=_data[0].tdurl.split(",");//2D
				                var tdName=_data[0].tdurlName;
				                if(tdName==null || tdName=='' || tdName=='undefined' || tdName== undefined){
				                	if(td_url[0].indexOf(".f2d")>0){
					                	for(var i = 0 ; i < td_url.length;i++) {
						                	tdurl=td_url[i].replace(/(^\s*)|(\s*$)/g,'');
						                	var tdurlSub = tdurl.substr(tdurl.lastIndexOf('/', tdurl.lastIndexOf('/') - 1) + 1); //截取倒数第二个斜杠后的内容
						                	var laststr=tdurlSub.lastIndexOf('/');    //截取最后一个斜杠的下标
						                	var newStr=tdurlSub.substring(0,laststr);  //获取最后一个斜杠前的内容
						                	var tdurlValue = newStr.replace("f2d_图纸__"," "); //去掉该部分
						                	htmli +='<li>';
						                	htmli +=  	'<input  type="text" readonly="readonly" class="iftdName" id="'+tdurl+'" value="'+tdurlValue+'" title="'+tdurlSub+'"></input>';
						                	htmli +=  	'<div class="m-change-box">';
						                	htmli +=  		'<b class="changeNameBtn" value="'+bdip4dLang[langType]["-16128"]+'"></b>';		//重命名
						                	htmli +=  		'<input type="button"  class="u-saveName" style="display:none;margin-right: 5px;" value="'+bdip4dLang[langType]["-16128"]+'">';//保存
						                	htmli +=       	'<input type="button"  class="u-closeName" style="display:none;"  value="'+bdip4dLang[langType]["-15110"]+'">';		//取消
						                	htmli +=  	'</div>';
						                	htmli +='</li>';
						                }
		                                //document.getElementById('txt_cad').value=tdurl;
		                                document.getElementById('txt_cad').value=currentUrlName;  //模型名称
							       }
				                }else{
						            console.log(tdName);
					            	var jsonStr = JSON.parse(tdName);
					            	for(var j = 0;j<jsonStr.length;j++){
					            		var tdurl_Name= jsonStr[j].tdurlname;
						            	var tdurlid= jsonStr[j].tdurlid;
						            	if(tdurlid.indexOf(".f2d")>0){
						            		tdurlid=tdurlid.replace(/(^\s*)|(\s*$)/g,'');
						                	htmli +=  '<li>';
						                	htmli +=  		'<input type="text" readonly="readonly" class="td_Name" id="'+tdurlid+'" value="'+tdurl_Name+'" title="'+tdurl_Name+'"></input>';
						                	htmli +=       '<div class="m-change-box">';
						                	htmli +=        	'<b class="changeNameBtn" value="'+bdip4dLang[langType]["-16128"]+'" ></b>'	;
						                	htmli +=       	'<input type="button"  class="u-saveName" style="display:none;margin-right: 5px;"  value="'+bdip4dLang[langType]["-16128"]+'">';
						                	htmli +=       	'<input type="button"  class="u-closeName" style="display:none;"  value="'+bdip4dLang[langType]["-15110"]+'">';
						                	htmli +=        '</div>';
						                	htmli +=  '</li>';
							            }
						            }
		                            document.getElementById('txt_cad').value=jsonStr[0].tdurlname;
		                            nameVal = jsonStr[0].tdurlname;
					             }
		                        BimLinkage.updateByName(nameVal);
			                }else{
			                	$('#menu').hide();
			                }
	                	}
	                	var url=_data[0].url.split(";");//3D
		                var urlName = _data[0].name;
		                if(url[0].indexOf(".svf")>0){
		                	document.getElementById("showBox_vie").innerHTML="<h2>"+urlName+"</h2>";
		                }
		                $('#myTitle').html(htmli);
		                BimLinkage.cadCheck(true);

		                $('#showBox_cad').bind('DOMNodeInserted', function(e) {
		                	var tdurl = $('#showBox_cad input').attr('id');
		                	console.log(tdurl);
		                	//var sharedPropertyDbPath  =  publicJS.local_model_url_one+"/wendang"+modelObject.baseUrl+"/";
		                	//var docs =[{"path":publicJS.local_model_url_one+"/wendang/"+tdurl}];
		                	var sharedPropertyDbPath  =  BimBdip.filepathUrlPre+modelObject.baseUrl+"/";
		                	var docs =[{"path":BimBdip.filepathUrlPre+tdurl}];
		                	//if(checkLocalUrl(publicJS.tomcat_url_one+"/wendang/"+tdurl)) { 	//tzw
		                		setTimeout(function (){
		                			var options2D ={ 'docid2D': docs[0].path, env: '' } ;//cad图的路径
		                            var menuElement = document.getElementById('menu');
		                            BimLinkage.iViewer =new Autodesk.Viewing.Private.GuiViewer3D (menuElement, {}) ; 
		                        	Autodesk.Viewing.Initializer (options2D, function () {
		                        		BimLinkage.iViewer.initialize () ;
		                                
		                        		BimLinkage.iViewer.addEventListener (Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function (event) {
	                                        setTimeout (function () {BimLinkage.iViewer.autocam.setHomeViewFrom (BimLinkage.iViewer.navigation.getCamera ()) ; }, 1000) ;
	                                        BimLinkage.iViewer.setGhosting(false);
	                                        ////BimLinkage.createToolsOf2D();   2D图纸创建视点保存按钮
			                            	
			                                //当2D为“ 小 ”窗口时选中2D下拉框点击切换按钮触发事件
	                                        if(document.getElementById('menu').style.zIndex ==1){
	                                        	 if($('#menu .settingsTools').is(":hidden")){
	 	                                        	return;
	 	                                        }else{
	 	                                        	BimLinkage.clear2DBtn();

	 	                                        	BimLinkage._SubToolbar3= new Autodesk.Viewing.UI.ControlGroup("viewer_control_group3");
	 	                                        	BimLinkage.button3 = new Autodesk.Viewing.UI.Button("lmvdbg_viewer_tb_button_3");
	 	                                        	BimLinkage.Toolbar3 = BimLinkage.iViewer.getToolbar(true);  
	 	                                        	BimLinkage.button3.setIcon("changeViewer");
	 	                                        	BimLinkage.button3.setToolTip(bdip4dLang[langType]["-15385"]);	//切换2D联动
	 	                                        	BimLinkage.button3.onClick = function(e) {
	 	                                        		////clearMarkupStatus(globalVariable.iViewer);  //给2D图纸创建视点保存
	 	                                        		BimLinkage.changeToCadlink();
	 	                                        		BimLinkage.clear3DBtn();
	 	                                        		BimLinkage.show2DBtn();
	                                                };
	                                                BimLinkage.Toolbar3.addControl(BimLinkage._SubToolbar3);
	                                                BimLinkage._SubToolbar3.addControl(BimLinkage.button3);
	 	                                        }
	                                        }
	                                        
	                                       //当3D为“ 小 ”窗口时选中2D下拉框点击切换按钮触发事件
	                                        /*if(document.getElementById('viewers').style.zIndex ==1){
	                                        	 if($('#viewers .settingsTools').is(":hidden")){
	 	                                        	return;
	 	                                        }else{
	 	                                        	//BimLinkage.clear3DBtn();
	 	                                        	//$("#viewer_control_group").hide();
	 	                                        	//在三维模型下创建按钮
	 	                                        	BimLinkage._SubToolbar4= new Autodesk.Viewing.UI.ControlGroup("viewer_control_group4");
	 	                                        	BimLinkage.button4 = new Autodesk.Viewing.UI.Button("lmvdbg_viewer_tb_button_4");
	 	                                        	BimLinkage.Toolbar4 = BimBdip.view.getToolbar(true);  
	 	                                        	BimLinkage.button4.setIcon("changeViewer");
	 	                                        	BimLinkage.button4.setToolTip("切换2D联动");
	 	                                        	BimLinkage.button4.onClick = function(e) {
	 	                                        		BimLinkage.changeToCadlink_small();
	 	                                        		BimLinkage.clear2DBtn();
	 	                                        		BimLinkage.show3DBtn();
	                                                };
	                                                BimLinkage.Toolbar4.addControl(BimLinkage._SubToolbar4);
	                                                BimLinkage._SubToolbar4.addControl(BimLinkage.button4);
	 	                                        }
	                                        }*/
	                                        
	                                        BimLinkage.iViewer.addEventListener("selection",function (event){
			                                    if(BimLinkage.ifchoese==true){
			                                    	BimLinkage._curSelSet=event.dbIdArray;
			                                    	BimLinkage.iViewer.getProperties(BimLinkage.iViewer.getSelection()[0],BimLinkage.getSelectionCAD);
			                                    	BimLinkage.ifchoese=false;
			                                    }else{
			                                    	BimLinkage.ifchoese=true;
			                                    }
			                                });
	                                    }) ;
		                        		BimLinkage.iViewer.load (options2D.docid2D,sharedPropertyDbPath);
		                			});
		                		},1000);
		                	//}
		                });
	                }
	              },
	              error:function(data){
	                console.log("查询失败..");
	              }
	        });
		},
		updateByName : function(nameVal){
			///var treeid = globalVariable.treeNode.pId.split("#@#")[0];
			//var treeid = '592';
			var treeid = BimBdip.modelObject.id;
            var val_tdurl ;
            //保存tdurlName
            $('#saveName').click(function(){
            	//debugger;
            	if(nameVal==null || nameVal=='' || nameVal=='undefined' || nameVal== undefined){ 
            		var ifsavedNameList = [];
            		var ifselectedName = $(".iftdName:eq(0)");//第一个名字
            		var ifallNames=$(".iftdName");//拿到所有的名字
                	//被选择行内容
                	var ifselectedItem = {tdurlid:ifselectedName.attr("id"), tdurlname:ifselectedName.val()};
                	for(var i=0;i<ifallNames.length;i++){
                		var theName = ifallNames[i];
                		var theItem =  {tdurlid:theName.id, tdurlname:theName.value};//修改行内容
                		if(theItem.tdurlname == ""){
                			layer.msg(bdip4dLang[langType]["-15387"],{icon:0,time:2000});	//该楼层名称不能为空
                			return ;
                		}else{
                			//若被选择行内容==修改行内容，则把修改行覆盖给之前存在值
                    		if(theItem.tdurlid == ifselectedItem.tdurlid){
                    			theItem = ifselectedItem;
                    		}
                    		ifsavedNameList.push(theItem);
                		}
                	}
                    var tdurlNameString = JSON.stringify(ifsavedNameList);
            	}
            	else{
                	var selectedName = $(".td_Name:eq(0)");
                	var allNames=$(".td_Name");
                	var selectedItem = {tdurlid:selectedName.attr("id"), tdurlname:selectedName.val()};
                	var savedNameList = [];
                	for(var i=0;i<allNames.length;i++){
                		var theName = allNames[i];
                		var theItem =  {tdurlid:theName.id, tdurlname:theName.value};//修改行内容
                		if(theItem.tdurlname == ""){
                			//alert("该楼层名称不能为空");
                			layer.msg(bdip4dLang[langType]["-15387"],{icon:0,time:2000});
                			return;
                		}else{
                			//若被选择行内容==修改行内容，则把修改行覆盖给之前存在值
                    		if(theItem.tdurlid == selectedItem.tdurlid){
                    			theItem = selectedItem;
                    		}
                    		savedNameList.push(theItem);
                		}
                	}
                    var tdurlNameString = JSON.stringify(savedNameList);
            	}
            	////var url = globalVariable.treeNode.murl;
            	var url = currentUrl;
            	$.ajax({
            		url:'../Linkage_updateBytdUrlName.action?tdurlName='+tdurlNameString+'&id='+treeid+'&url='+url,
	              	type:'POST',
	              	dataType:'json',
	              	async: false,
	              	success:function(){
	              		//alert("修改成功");
	              		layer.msg(bdip4dLang[langType]["-15388"],{icon:1,time:1000});	//修改成功
	                    BimLinkage.cadCheck(true);
	                    BimLinkage.showChangeBtn();
	              	},
	              	error:function(data){
	              		console.log("修改失败.........");
	              	}
            	});
            });
		},
		doClosecad : function(){ //关闭2D图纸窗口
			$('#menu').hide();
          	$('.open2D').show();
		},
		doCloseVie : function(){  //关闭3D图纸窗口
          	$('#viewers').hide();
          	$('.open3D').show();
        },
        cadCheck : function(e){
        	var liArray=$('#myTitle .iftdName');
        	var liArrays = $('#myTitle .td_Name');
        	if(liArray.length > 0){
    			for(var i = 0;i< liArray.length;i++){
		          	liArray[i].onclick = function(){
		          		if(e == true){
			              	var tdurl = this.value;
			              	var tdId = this.id;
			              	showBox_cad.innerHTML = "<input type='text' readonly='readonly' id='"+ tdId +"' value='"+  tdurl +"'>";
			              	//showBox_cad.innerHTML = tdurl;
			              	myTitle.style.display = "none";
			              	$('.title_cad img').attr('src','icon/downTriangle.png');
			              	//queding.style.display = "block";
				          }
				        }
		        	}
        	}
        	else{
        		for(var i = 0;i< liArrays.length;i++){
		          	liArrays[i].onclick = function(){
		          		if(e == true){
			          		var tdurl = this.value;
			          		var tdId = this.id;
			                showBox_cad.innerHTML = "<input type='text' readonly='readonly' id='"+ tdId +"' value='"+  tdurl +"'>";
			                //showBox_cad.innerHTML = tdId;
			              	myTitle.style.display = "none";
			              	$('.title_cad img').attr('src','icon/downTriangle.png');
			              	//queding.style.display = "block";
			            }
			        }
		        }
        	}
        },
		changeCadName : function(){
			var inputs = $('.changeNameBtn');
			var saves = $('.u-saveName');
			var closes = $('.u-closeName');
			var cadNames = $('.iftdName');
			var cadNames1 = $('.td_Name');
			for(var i = 0;i <inputs.length;i++ ){
				inputs[i].index = i;
				inputs[i].onclick = function(){
					BimLinkage.cadCheck(false);
					var j = this.index;
					this.style.display = "none";
					saves[j].style.display = "block";
					closes[j].style.display = "block";
					if(cadNames.length > 0){
						/*cadNames[j].value = "";*/
						cadNames[j].focus();
						cadNames[j].readOnly = false;
					}else{
						/*cadNames1[j].value = "";*/
						cadNames1[j].focus();
						cadNames1[j].readOnly = false;
					}
					
					saves[j].onclick = function(){
							this.style.display = "none";
							closes[j].style.display="none";
							if(cadNames.length > 0){
								cadNames[j].readOnly = true;
							}else{
								cadNames1[j].readOnly = true;
							}
							$('#saveName').click();
							BimLinkage.showChangeBtn();
					}
                    closes[j].onclick = function(){
                        saves[j].style.display="none";
                        this.style.display = "none";
                        if(cadNames.length > 0){
                            cadNames[j].readOnly = true;
                        }else{
                            cadNames1[j].readOnly = true;
                        }
                        BimLinkage.showChangeBtn();
                    }
				}
			}
		},
		showChangeBtn : function(){
			var lis = $('#myTitle li');
			var btns = $('.changeNameBtn');
			var saves = $('.u-saveName');
			for(var i = 0;i < lis.length;i++){
				lis[i].index = i;
				lis[i].onmouseover = function(){
					var j = this.index;
					if(saves[j].style.display == "none"){
						btns[j].style.display = "block";
					}
					this.onmouseout = function(){
						btns[j].style.display = "none";
					}
				}
			}
		},
        show3DBtn : function () { 
              $('#viewers #navTools').show();
              $('#viewers #lmvdbg_viewer_control_group').show();
              $('#viewers #lmvdbg_viewer_control_group1').show();
              $('#viewers #my-custom-buttons-toolbar').show();
              $('#viewers #modelTools').show();
              $('#viewers #settingsTools').show();
              $('#viewers #bimbdip_viewToolBar').show();  //相关功能按钮 
        },show2DBtn : function () { 
              $('#menu #navTools').show();
              $('#menu #modelTools').show();
              $('#menu #settingsTools').show();
              $('#menu #lmvdbg_viewer_control_group').show();
        },clear3DBtn : function () {  //3D模型按钮清除
              //$('.title_vie').show();
              $('#viewers #navTools').hide();
              $('#viewers #lmvdbg_viewer_control_group').hide();
          	  $('#viewers #lmvdbg_viewer_control_group1').hide();
          	  $('#viewers #my-custom-buttons-toolbar').hide();
          	  $('#viewers #modelTools').hide();
          	  $('#viewers #settingsTools').hide();
          	  $('#viewers #bimbdip_viewToolBar').hide(); //相关功能按钮 
        },clear2DBtn : function () {  //2D模型按钮清除        
              //$('.title_vie').hide();
             $('#menu #navTools').hide();
             $('#menu #modelTools').hide();
             $('#menu #settingsTools').hide();
             $('#menu #lmvdbg_viewer_control_group').hide();
        },
        show2D : function(){//2D图纸放大
        	BimLinkage.be3DViewer = false;
        	BimBdip.be3DViewer = false;
            //$('#changeContent').hide();
            $('.title_vie').show();
            $('#conf_cad').hide();
            $('#showBox_cad').css('width','85%');
            $('.title_cad').css({
                width:'15.8%',
            });
            $('#viewers').css({
                height:BimLinkage.winHeight*0.4+'px',
                width:BimLinkage.winWidth*0.3+'px',
                position:'absolute',
                right:'20px',
                top:'5%',
                zIndex:'1',
            })
            $('#viewers .adsk-viewing-viewer').css({
                height:BimLinkage.winHeight*0.4+'px',
                width:BimLinkage.winWidth*0.3+'px',
                zIndex:'1',
            })
            $('#menu').css({
                height:BimLinkage.winHeight+'px',
                width:BimLinkage.winWidth+'px',
                position:'absolute',
                top : '0px',
                right:'0',
                zIndex:'0',
                left:'inherit',
            })
            $('#menu .adsk-viewing-viewer').css({
                height:BimLinkage.winHeight+'px',
                width:BimLinkage.winWidth+'px',
                zIndex:'1',
            })
            $('#menu .canvas').css({
                height:BimLinkage.winHeight+'px',
                width:BimLinkage.winWidth+'px',
                zIndex:'0',
            })
            $('#menu #myTitle').css({
                width:'100%',
                left:'inherit',
            })
            $('#l').hide();
            $('#LE').hide();
            $('.titleName').hide();
            BimBdip.view.onResizeCallback();
            BimLinkage.iViewer.onResizeCallback();
            $(function(){
                //$('#menu').draggable('disable');
            });
        },        
        show3D : function(){//3D图纸放大
            BimLinkage.be3DViewer = true;
            BimBdip.be3DViewer = true;
            $('.title_cad').show();
            //$('#changeContent').show();
            $('#conf_cad').show();
            $('.title_vie').hide();
            $('#showBox_cad').css('width','60%');
            $('.title_cad').css('width','100%');
            $('#menu').css({
                height:BimLinkage.winHeight*0.4+'px',
                width:BimLinkage.winWidth*0.3+'px',
                position:'absolute',
                right:'20px',
                top:'5%',
                zIndex:'1',
                left:'inherit',
            })
            $('#menu .adsk-viewing-viewer').css({
                height:BimLinkage.winHeight*0.4+'px',
                width:BimLinkage.winWidth*0.3+'px',
                zIndex:'1',
            })
            $('#viewers').css({
                height:BimLinkage.winHeight+'px',
                width:BimLinkage.winWidth+'px',
                position:'absolute',
                top:'0',
                right:'0',
                zIndex:'0',
            })
            $('#viewers .adsk-viewing-viewer').css({
                height:BimLinkage.winHeight+'px',
                width:BimLinkage.winWidth+'px',
                zIndex:'1',
            })
            $('#viewers .canvas').css({
                height:BimLinkage.winHeight+'px',
                width:BimLinkage.winWidth+'px',
                zIndex:'0',
            })
            $('#menu #myTitle').css({
                width:'67%',
                left: '23%',
            })
            $('#l').show();
            $('#LE').show();
            $('#LE').css('left','');
            $('.y').css('background-image','url(./img/ri.png)');
            $('.titleName').show();
            
            if(BimLinkage.isFirst == false){
            	BimBdip.view.onResizeCallback();
            	BimLinkage.iViewer.onResizeCallback();
            }
        	BimLinkage.isFirst = false;
            $(function(){
                //$('#menu').draggable('enable');
            });
        },
		getSelectionCAD : function(data){  //点击iViewer构件(CAD模型)
			if((data.dbId==null) || (data.dbId.length==0)){
				//alert("请检查该模型是否存在相关构件的属性");
                return;
            }
        	var mod = data.dbId;
        	BimLinkage.countH=0;
        	//得到iViewerCAD的构建值，搜索相应的3D构建
            if( BimBdip.view!=null &&  BimBdip.view!=""){
            	 BimBdip.view.getProperties(mod,BimLinkage.JumpTo3D);  //跳转到2D图纸
            }
		}, 
		JumpTo3D : function(data){  //点击2D图纸属性后跳转到3D模型定位
			if((data.dbId==null) || (data.dbId.length==0)){
                var countH=BimLinkage.countH+1;
                return;
            }
        	var countH=BimLinkage.countH+1;
    		BimBdip.view.select(data.dbId);
            var aggregateSelection =BimBdip.view.getAggregateSelection();
            aggregateSelection = BimBdip.view.getAggregateSelection();
            if (aggregateSelection.length > 0){
                var singleRes = aggregateSelection[0];
                BimBdip.view.fitToView(singleRes.selection, singleRes.model);
            } else if (aggregateSelection.length === 0) {
            	BimBdip.view.fitToView(); // Fit to whole model, the first one loaded.
            }
	        var j=j+1;
	        if(j==1){
	            return;
	        }
		},
		getSelection3D : function(data){  //点击3D模型构件
			if((data.dbId==null) || (data.dbId.length==0)){
				//alert("请检查该模型是否存在相关构件的属性");
                return;
            }
        	var mod = data.dbId;
        	BimLinkage.countH=0;
            //得到oViewer3D的构建值，搜索相应的2D构建
            if(BimLinkage.iViewer!=null && BimLinkage.iViewer!=""){
            	BimLinkage.iViewer.getProperties(mod,BimLinkage.JumpToCAD);  //跳转到2D图纸
            }
        },
        JumpToCAD : function(data){         //定位到2D图纸
        	if((data.dbId==null) || (data.dbId.length==0)){
                var countH=BimLinkage.countH+1;
                return;
            }
        	var countH=BimLinkage.countH+1;
    		BimLinkage.iViewer.select(data.dbId);
            var iViewerSelection = BimLinkage.iViewer.getAggregateSelection();
            iViewerSelection = BimLinkage.iViewer.getAggregateSelection();
            if (iViewerSelection.length > 0){
                var singleRes = iViewerSelection[0];
                BimLinkage.iViewer.fitToView(singleRes.selection, singleRes.model);
            } else if (iViewerSelection.length === 0) {
            	BimLinkage.iViewer.fitToView(); // Fit to whole model, the first one loaded.
            }
	        var j=j+1;
	        if(j==1){
	            return;
	        }
        }
}
//点击名字——展开收缩下拉框
var showBox_cad = document.getElementById("showBox_cad");
showBox_cad.onclick = function(){
	if (myTitle.style.display == "none") {
		myTitle.style.display = "block";
		$('.title_cad img').attr('src','icon/upTriangle.png');
	}else{
		myTitle.style.display = "none";
		$('.title_cad img').attr('src','icon/downTriangle.png');
	}
}
//点击图标——展开收缩下拉框
var img_down = document.getElementById("img_down");
img_down.onclick = function(){
	if (myTitle.style.display == "none") {
		myTitle.style.display = "block";
		$('.title_cad img').attr('src','icon/upTriangle.png');
	}else{
		myTitle.style.display = "none";
		$('.title_cad img').attr('src','icon/downTriangle.png');
	}
}

$('.open2D').click(function() {
	$('#menu').show();
  	$('.open2D').hide();
});
$('.open3D').click(function() {
	$('#viewers').show();
  	$('.open3D').hide();
});