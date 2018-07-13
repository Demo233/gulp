	//模型加载基础设置
	var BimBdip = {   					//模型基础数据存储表
		currentUserid : null,			//当前用户ID	
		currentUsername : null,			//当前用户名称	
		view : null,      				//模型对象
		viewToolBar : null,				//模型按钮组
		button_viewpoint : null,		//视点保存按钮
		button_panorama : null,			//360全景图按钮
		button_share : null,			//模型链接和二维码分享按钮
		button_room : null,				//模型分享交流按钮
		button_history : null,			//模型分享交流历史记录按钮
		button_collision : null,		//碰撞文件生成模型视点按钮
		button_viewpoint : null,		//涂鸦工具条按钮
		view_modelUrl : null,  			//模型存储路径
		view_modelName : null,  		//模型名称
		lvmid : null,					//模型编号
		modelVersion : null,			//模型版本号
		parentId :null,					//模型所在目录id
		beUploadType : null,            //判定模型是从什么途径上传（第一种线上，第二种离线包插件）
		be3DViewer : null,
		m_count : null,
		btnViewUrl : null,
		sdbPath : null,					//beUploadType 长度为大于0时，为在线上传，为空时为离线插件上传，此时需要查询sdbPath
		isSdbFinished : null,
		button_filter : null,
		button_filter : null,		
		button_coloring : null,		//tzw 过滤着色管理
		filter_open : null,		//是否支持过滤器
		filter_run : null,		//是否支持过滤器
		button_axis : null,            //轴网移动按钮
		button_selectWindow : null,		//模型框选
		init : function (currentUserid,currentUsername) {			//初始化数据
			BimBdip.currentUserid = currentUserid;
			BimBdip.currentUsername = currentUsername;
			BimBdip.viewToolBar = new Autodesk.Viewing.UI.ControlGroup("bimbdip_viewToolBar");
			BimBdip.button_panorama = new Autodesk.Viewing.UI.Button("bimbdip_button_panorama");
			BimBdip.button_share = new Autodesk.Viewing.UI.Button("bimbdip_button_share");
			BimBdip.button_room = new Autodesk.Viewing.UI.Button("bimbdip_button_room");
			BimBdip.button_history = new Autodesk.Viewing.UI.Button("bimbdip_button_history");
			BimBdip.button_collision = new Autodesk.Viewing.UI.Button("bimbdip_button_collision");
			BimBdip.button_viewpoint = new Autodesk.Viewing.UI.Button("bimbdip_button_viewpoint");
			
			BimBdip.button_filter = new Autodesk.Viewing.UI.Button("bimbdip_button_filter");
			BimBdip.button_coloring = new Autodesk.Viewing.UI.Button("bimbdip_button_coloring");//tzw
			BimBdip.button_axis = new Autodesk.Viewing.UI.Button("bimbdip_button_axis");
			BimBdip.button_selectWindow = new Autodesk.Viewing.UI.Button("bimbdip_button_selectWindow");
			BimBdip.be3DViewer = true;
			BimBdip.m_count = 1;
			BimBdip.btnViewUrl = "";
			BimBdip.filter_open = true;
			BimBdip.filter_run = false;
		},

		modelLoad : function (currentUrl,currentUrlName,modelid,modelversion,parentId,beUploadType) {
			if(beUploadType && beUploadType.length>0){
				BimBdip.sdbPath = "";
			}else{//为空表示从离线插件上传
				BimBdip.sdbPath = BimBdip.getSDBPath(modelid,modelversion);
			}
			//console.log("最终的sdb路径："+BimBdip.sdbPath);
			
			
			var doModelShow = true;
			var viewerElement = document.getElementById('viewers');
			var options = {'model':""};
			var urlId= parseInt(100000000*Math.random());
			
			var filepath = publicJS.translocalurl(currentUrl);
			var filepathone = publicJS.translocaloneurl(currentUrl);
			var linepath = currentUrl+"?urlId="+urlId;
			var filepath_check = filepath +"?urlId="+urlId;
			var filepath_one_check = filepathone +"?urlId="+urlId;
			//alert("离线状态："+filepath);
			//alert("在线状态："+linepath);
			if(checkLocalUrl(filepath_check)) {
				doModelShow = true;
				options.model = filepath;
				gotoPage("local");
				BimBdip.m_count = 2;
			} else if(checkLocalUrl(filepath_one_check)) {
				
				
				doModelShow = true;
				options.model = filepathone;
				gotoPage("local");
				BimBdip.m_count = 2;
			} else if(checkLocalUrl(linepath)) {
				doModelShow = true;
				options.model = currentUrl;
				gotoPage("server");
				if(BimBdip.m_count == 1) {
					jQuery("#btnChange").hide();
					BimBdip.m_count = 2;
				}
			} else {
				doModelShow = false;
				BimBdip.m_count = 1;
			}
			if(doModelShow) {
				BimBdip.view_modelUrl = currentUrl;
				BimBdip.view_modelName = currentUrlName;
				BimBdip.parentId = parentId;
				BimBdip.lvmid = modelid;
				BimBdip.modelVersion = modelversion;
				BimBdip.sdbTurn();
				BimBdip.beUploadType = beUploadType;
				BimBdip.view =new Autodesk.Viewing.Private.GuiViewer3D (viewerElement, {}) ;
				Autodesk.Viewing.Initializer (options, function () {
					BimBdip.view.initialize ();
					BimBdip.view.load (options.model);
					BimBdip.view.loadExtension("MyUIExtension");
					BimBdip.view.loadExtension('Viewing.Extension.Transform');
					BimBdip.view.loadExtension('Autodesk.Viewing.ZoomWindow');  
					
					BimBdip.view.fitToView(true);
					BimBdip.creatViewButton();
					BimBdip.view.addEventListener (Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function (event) {
						//debugger;
						 BimBdip.searchDbids = new Array();
	                     BimBdip.searchall();
					})
					/*BimBdip.view.addEventListener( Autodesk.Viewing.SELECTION_CHANGED_EVENT, BimBdip.onSelectionChanged );*/
					/*BimBdip.view.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(event) {
						debugger;
						setTimeout(function(){
							if(document.getElementById("ViewerPropertyPanel")) {
								if(document.getElementById("ViewerPropertyPanel").style.visibility == "visible") {
									for(var i = 0 ; i <document.getElementsByClassName('propertyValue').length;i++) {
									//	alert(1541515);
										if(document.getElementsByClassName('propertyValue')[i].title=="BimAngle.com"){
											document.getElementsByClassName('propertyValue')[i].textContent="cloud.bimbdip.com";
										}
									}
								
								}
							}
						},300)
					})*/
				})
			} else {
				Dialog.alert("模型正在处理中，请耐心等待");
			}
			
		},
		getSDBPath : function (modelid,modelversion) {
			var finalSDBPath = "";
			$.ajax({
	    	  	url:publicJS.tomcat_url+"/bimmodelversion/getSDBFilePath?modelid="+modelid+"&modelversion="+modelversion,
	    	  	type:"GET",
	    	  	dataType:"JSON",
	    	  	processData:false,
	    	  	contentType:false,
	    	  	async : false,
	    	  	success:function(obj){
	    	  		var result = obj.data;
	    	  		//console.log("获取sdb结果："+JSON.stringify(result));
	    	  		if(result != null){
	    	  			if(result.sdbstatus==1 || result.sdbstatus=="1"){
	    	  				BimBdip.sdbPath = result.dbpath;
	    	  				BimBdip.isSdbFinished = true;
	    	  				finalSDBPath = result.dbpath;
	    	  			}else{
	    	  				BimBdip.sdbPath = "";
	    	  				BimBdip.isSdbFinished = false;
	    	  			}
	    	  		}
	    	  	},
	    	  	error:function(){
	    	  		console.log("获取sdb文件路径异常");
	    	  	}
		    });
			return finalSDBPath;
		},
		//在线离线加载
		localServerModels : function (url) {
			BimBdip.view =new Autodesk.Viewing.Private.GuiViewer3D (viewerElement, {}) ;
			Autodesk.Viewing.Initializer (options, function () {
				BimBdip.view.initialize ();
				BimBdip.view.load (url);
				BimBdip.view.loadExtension("MyUIExtension");
				BimBdip.view.loadExtension('Autodesk.Viewing.ZoomWindow');  
				BimBdip.view.loadExtension('Viewing.Extension.Transform');
				BimBdip.view.fitToView(true);
				BimBdip.creatViewButton();
				
			})
		},
		//加载按钮到模型上
		creatViewButton : function () {
			BimBdip.setUp_button_panorama();
			BimBdip.setUp_button_share();
			BimBdip.setUp_button_room();
			BimBdip.setUp_button_history();
			BimBdip.setUp_button_collision();
			BimBdip.setUp_button_viewpoint();
			
			BimBdip.setUp_button_filter();
			BimBdip.setUp_button_coloring();  
			BimBdip.setUp_button_selectWindow();
			BimBdip.viewToolBar.addControl(BimBdip.button_panorama);
			BimBdip.viewToolBar.addControl(BimBdip.button_share);
			BimBdip.viewToolBar.addControl(BimBdip.button_room);
			BimBdip.viewToolBar.addControl(BimBdip.button_history);
			BimBdip.viewToolBar.addControl(BimBdip.button_collision);
			BimBdip.viewToolBar.addControl(BimBdip.button_viewpoint);
			
		    BimBdip.viewToolBar.addControl(BimBdip.button_filter);
		    BimBdip.viewToolBar.addControl(BimBdip.button_coloring);
		    BimBdip.viewToolBar.addControl(BimBdip.button_selectWindow);
			BimBdip.view.toolbar.addControl(BimBdip.viewToolBar);
			
		},
		//360全景图按钮设置
		setUp_button_panorama : function () {
			BimBdip.button_panorama.setIcon("panorama-play");
			BimBdip.button_panorama.setToolTip("资料管理 ");
			BimBdip.button_panorama.onClick = function(e) {
				//bimPanorama.doPanorama();
				bimPanorama.showAllPan();
				bimFileterColoring.removeAllColors(); //清除所有构件颜色
			}
		},
		//模型分享链接及二维码按钮设置
		setUp_button_share : function () {
			BimBdip.button_share.setIcon("share-play");
			BimBdip.button_share.setToolTip("模型分享");
			BimBdip.button_share.onClick = function(e) {
				bimShare.doShare();
				bimFileterColoring.removeAllColors(); //清除所有构件颜色
			}
		},
		//模型分享房间链接按钮设置
		setUp_button_room : function () {
			BimBdip.button_room.setIcon("room-play");
			BimBdip.button_room.setToolTip("模型共享交流");
			BimBdip.button_room.onClick = function(e) {
				bimRoom.doRoom();
				bimFileterColoring.removeAllColors(); //清除所有构件颜色
			}
		},
		//模型分享交流历史记录按钮设置
		setUp_button_history : function () {
			BimBdip.button_history.setIcon("history-play");
			BimBdip.button_history.setToolTip("会话历史记录");
			BimBdip.button_history.onClick = function(e) {
				bimHistory.clean();
				bimHistory.doHistory();
				bimFileterColoring.removeAllColors(); //清除所有构件颜色
			}
		},
		//碰撞点上传按钮设置
		setUp_button_collision : function () {
			BimBdip.button_collision.setIcon("collision-play");
			BimBdip.button_collision.setToolTip("碰撞点上传");
			BimBdip.button_collision.onClick = function(e) {
				bimCollision.doCollision();
				bimFileterColoring.removeAllColors(); //清除所有构件颜色
			}
		},
		//视点保存按钮设置
		setUp_button_viewpoint : function () {
			BimBdip.button_viewpoint.setIcon("viewpoint-play");
			BimBdip.button_viewpoint.setToolTip("视点保存");
			BimBdip.button_viewpoint.onClick = function(e) {
				bimViewPointNew.viewpoint_load();
				bimFileterColoring.removeAllColors(); //清除所有构件颜色
				
				/*侧边栏展示*/
				var sideDiv = $('#div_viewpoint');
				if(sideDiv.css('right') == "-300px"){
		       		hideSidePanel();
		       		window.parent.hideSidePanel();
		       		sideDiv.css("right","0px");
		       	}else{
		       		sideDiv.css("right","-300px");
		       	}
			}
		},
		setUp_button_coloring : function () {  //tzw
			BimBdip.button_coloring.setIcon("colour");
			BimBdip.button_coloring.setToolTip("过滤着色管理");
			BimBdip.button_coloring.onClick = function(e) {
				bimFileterColoring.coloring_load();
				/*侧边栏展示*/
				var sideDiv = $('.filter_coloring_box');
				if(sideDiv.css('right') == "-320px"){
		       		hideSidePanel();
		       		window.parent.hideSidePanel();
		       		sideDiv.css("right","0px");
		       	}else{
		       		sideDiv.css("right","-320px");
		       	}
			}
		},
		//过滤器按钮设置
		setUp_button_filter : function () {
			BimBdip.button_filter.setIcon("filtration");
			BimBdip.button_filter.setToolTip("过滤器");
			BimBdip.button_filter.onClick = function(e) {
				bimFileterColoring.removeAllColors(); //清除所有构件颜色
				if(BimBdip.filter_open) {
					if(BimBdip.view.getSelection().length == 0) {
						Dialog.alert("请先选择需要过滤的模型构件！");
					} else {
						$('.filter_box').show();
						$(".gray").show();   
						bimOriginFilter.initialize();
						bimOriginFilter.loadTreeOther();
						filterExecute.modelAttributeTypes();
					}
					
				} else {
					if(BimBdip.filter_run) {
						
						$.ajax({
				    	  	url:publicJS.tomcat_url+"/bimmodelversion/getSDBFilePath?modelid="+modelid+"&modelversion="+modelversion,
				    	  	type:"GET",
				    	  	dataType:"JSON",
				    	  	processData:false,
				    	  	contentType:false,
				    	  	async : false,
				    	  	success:function(obj){
				    	  		var result = obj.data;
				    	  		//console.log("获取sdb结果："+JSON.stringify(result));
				    	  		if(result != null){
				    	  			if(result.sdbstatus==1 || result.sdbstatus=="1"){
				    	  				BimBdip.filter_run = false;
				    	  				BimBdip.filter_open = true;
				    	  				BimBdip.sdbPath = result.dbpath;
				    	  			} else {
				    	  				Dialog.alert("数据转化中，请稍后");
				    	  			}
				    	  		}
				    	  	},
				    	  	error:function(){
				    	  		Dialog.log("获取sdb文件路径异常");
				    	  	}
					    });
						
					} else {
						Dialog.alert("属性文件缺失或正在处理中，请稍后或者联系客服！");
						BimBdip.sdbTurn();
						
					}
					
				}
				
				
			}
		},
		
		onSelectionChanged  : function(event ){
			//debugger;
			var offset = new THREE.Vector3( -100, 0 , 0 );
			var model = event.model;
			var fragIdsArray = event.fragIdsArray;
			for(var i = 0; i < fragIdsArray.length ; i++) {
				fragProxy = BimBdip.view.impl.getFragmentProxy( model, fragIdsArray[i] );
				fragProxy.getAnimTransform();
				var position = new THREE.Vector3(
			        fragProxy.position.x + offset.x,
			        fragProxy.position.y + offset.y,
			        fragProxy.position.z + offset.z
				);
				fragProxy.position = position;

			    fragProxy.updateAnimTransform();
			}
			BimBdip.view.impl.sceneUpdated( true );
		},
		talking : function() {
			var tmpState=BimBdip.view.getState();
			 var jsonString=JSON.stringify(tmpState);
			 jsonString=jsonString.replace(/\"/g,"'");
			 var fragId = "";
			 var dbId = "";
			 BimBdip.view.model.getData().instanceTree.enumNodeFragments(BimBdip.view.getSelection()[0],function(msg){
				 fragId = msg;
				 dbId = BimBdip.view.getSelection()[0];
            });
            
			if(dbId == ""){
	        	// 解决bug 1460
	        	Dialog.alert("暂不支持多构件发起实时讨论");
	        	return;
	        }
            var modelUrl = BimBdip.view_modelUrl;
            //var treeId = BimBdip.lvmid;
            var lvmid = BimBdip.lvmid;
            var fd = new FormData();
            fd.append("json",jsonString);
            fd.append("modelUrl",modelUrl);
            fd.append("dbId",dbId);
            fd.append("fragId",fragId);
            fd.append("lvmid",lvmid);
            
            var base64code = BimBdip.view.getScreenShotBuffer();
            // 上传点压缩图片
            discussCompress(fd,base64code);
		},sdbTurn : function() {
			var fd = new FormData();
			var lmvid = BimBdip.lvmid;
			var modelversion = BimBdip.modelVersion;
			fd.append("lmvid",lmvid);
			fd.append("modelversion",modelversion);
			$.ajax({
	            url:publicJS.tomcat_url+"/attribute/sdbtrun",
	            type:'post',
	            data:fd,
	            processData:false,
	            contentType : false,   
	            dataType:'json',
	            success : function(data){
	            	if(data.code=="200") {
	            		console.log("模型编号"+lmvid+"---版本号---"+modelversion+"现在文件状态"+data.msg);
	            		if(data.msg == "none") {
	            			BimBdip.filter_open = false;
	            			
	            		} else if(data.msg == "Done") {
	            			BimBdip.filter_open = false;
	            			BimBdip.filter_run = true;
	            		}else {
	            			BimBdip.filter_open = true;
	            		}
	            	}
	            }
			})
		},setUp_button_axis : function () {
            if(  BimBdip.checkZW&&(BimBdip.searchDbids.length !=0)){
                BimBdip.button_axis.setIcon("axis-net");
                BimBdip.button_axis.setToolTip("轴网移动");
                BimBdip.button_axis.onClick = function(e) {
                	bimAxisMove.doAxisMove();
                }
                //BimBdip.view.getToolbar()._controls[5].addControl(BimBdip.button_axis);//MODELTOOLSID  //SETTINGSTOOLSID
                BimBdip.view.getToolbar(true).getControl(av.TOOLBAR.BASEMODELSHOWSID).addControl(BimBdip.button_axis);
			}

		},searchall:function(){
			var count = 0 ;
            BimBdip.view.search('"轴网"', function (idArray) {
               
                count = count + 1 ;
                BimBdip.checkZW = true;
                BimBdip.searchDbids = idArray;
                if(count == 1 ) {
                    BimBdip.setUp_button_axis();
				}

			})
		},
	//模型框选
		setUp_button_selectWindow : function () {
            BimBdip.button_selectWindow.setIcon("kuangxuan");
            BimBdip.button_selectWindow.setToolTip("模型框选");
            BimBdip.button_selectWindow.onClick = function(e) {
                BimBdip.startSelection();
                BimBdip.isFullScreen = !BimBdip.isFullScreen;
				bimSelectWindow.doSelectWindow();
//              // 判断按钮是否包含class-active
//              if(!this.container.classList.contains("active")) {
//                  this.container.classList.add("active");
//                  BimBdip.view.canvas.classList.add("crosshair");
//
//                  BimBdip.view.loadExtension('MySelectionWindow').then(function(ext){
//                      // ext.init();
//
//                      setTimeout(function() {
//                          ext.handleSelect(BimBdip.isFullScreen);
//                      },300)
//                  });
//              }else {
//                  this.container.classList.remove("active");
//                  BimBdip.view.canvas.classList.remove("crosshair");
//
//                  // BimBdip.view.clearSelection(); // 清除选中
//                  BimBdip.view.loadExtension('MySelectionWindow').then(function(ext){
//                      ext.handleSelect(BimBdip.isFullScreen);
//                  });
//              }
            }
        },
		//框选方法
		startSelection() {
            BimBdip.view.loadExtension('MySelectionWindow').then(function(ext){
                ext.init();
            });
        }
		
	}
	