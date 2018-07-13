var bimCustomAttr = {
	fromSelf : false,	
	ind : "1",
	currentUrl : null,
	currentModelid : null,
	currentModelVersion : null,
	currentSDBPath : null,
	currentUserid : null,
	currentUsername : null,
	targetDBID : null,
	btnElement : null,
	attrDictionaryData : null,
	beVisible : false,
	/*** 清除之前的Panel弹框 **/
	dockingPanelNone : function () {
		//关闭视点保存
		if(bimViewPointNew){
			bimViewPointNew.hiddenViewPoint_new();
		}
		//关闭过滤着色管理
        if(bimFileterColoring){
        	bimFileterColoring.hideColoringButtonFrame();
        }
	},
	/*** 初始化参数 **/
	initialize : function () {
		bimCustomAttr.currentUrl = BimBdip.view_modelUrl;
		bimCustomAttr.currentModelid = BimBdip.lvmid;
		bimCustomAttr.currentModelVersion = BimBdip.modelVersion;
		bimCustomAttr.currentSDBPath = BimBdip.sdbPath;
		bimCustomAttr.currentUserid = BimBdip.currentUserid;
		bimCustomAttr.currentUsername = BimBdip.currentUsername;
		var dbidArr = BimBdip.view.getSelection();
		bimCustomAttr.targetDBID = new Array();
		if(dbidArr && dbidArr.length>0){
			for(var i=0;i<dbidArr.length;i++){
				bimCustomAttr.getUsedDBIDs(dbidArr[i]);
			}
		}else{
			bimCustomAttr.targetDBID.push("1");
		}
		console.log("选中的有效dbid为："+bimCustomAttr.targetDBID);
		
		var button = BimBdip.view.settingsTools.getControl("toolbar-propertiesTool");
		bimCustomAttr.btnElement = button.container;
		
		bimCustomAttr.getAttrDictionary();
	},
	extraInitialize : function () {
		bimCustomAttr.currentUrl = BimBdip.view_modelUrl;
		bimCustomAttr.currentModelid = BimBdip.lvmid;
		bimCustomAttr.currentModelVersion = BimBdip.modelVersion;
		bimCustomAttr.currentSDBPath = BimBdip.sdbPath;
		bimCustomAttr.currentUserid = BimBdip.currentUserid;
		bimCustomAttr.currentUsername = BimBdip.currentUsername;
		var dbidArr = BimBdip.view.getSelection();
		bimCustomAttr.targetDBID = new Array();
		if(dbidArr && dbidArr.length>0){
			for(var i=0;i<dbidArr.length;i++){
				bimCustomAttr.getUsedDBIDs(dbidArr[i]);
			}
		}
		console.log("选中的有效dbid为："+bimCustomAttr.targetDBID);
	},
	getUsedDBIDs : function (dbid) {
		var isUsed = true;
	    var it = BimBdip.view.model.getData().instanceTree;
        it.enumNodeChildren( dbid, function( childId ) {
        	isUsed = false;    
        	bimCustomAttr.getUsedDBIDs(childId);  
        });
	    if(isUsed) {
	    	bimCustomAttr.targetDBID.push(dbid);
	    }
	},
	getAttrDictionary : function () {
		
		var fd = new FormData();
		//fd.append("sdbpath",bimCustomAttr.currentSDBPath);
		fd.append("modelid",bimCustomAttr.currentModelid);
		fd.append("modelversion",bimCustomAttr.currentModelVersion);
		
		$.ajax({
			url:publicJS.tomcat_url+"/ModelAttributeExpand_getAttrDictionary.action",
			type:'POST',
			data:fd,
			dataType:'JSON',
			async: false,
			processData:false,
			contentType:false,
			success:function(result){
				var obj = JSON.parse(result);
				bimCustomAttr.attrDictionaryData = obj.data;
			},
			error:function(){
				console.log("词典数据获取失败");
			}
		});
	},
	//加载属性列表
	customattr_load : function () {
		var _this = this;
		bimCustomAttr.fromSelf = true;
		_this.dockingPanelNone();
		bimCustomAttr.fromSelf = false;
		_this.initialize();
		_this.toggleVisibilityForCustomAttr();
	},
	hiddenCustomAttr : function () {
		hideSidePanel();
   		window.parent.hideSidePanel();
		bimCustomAttr.clearContent();
		if(bimCustomAttr.btnElement){
			$(bimCustomAttr.btnElement).removeClass("active");
			$(bimCustomAttr.btnElement).addClass("inactive");
		}
		bimCustomAttr.beVisible = false;
		bimCustomAttr.ind = "1";
	},
	onlyHiddenCustomAttrButton : function () {
		if(bimCustomAttr.btnElement){
			$(bimCustomAttr.btnElement).removeClass("active");
			$(bimCustomAttr.btnElement).addClass("inactive");
		}
		bimCustomAttr.beVisible = false;
		bimCustomAttr.ind = "1";
	},
	//显示切换
	setVisibleForCustomAttr : function (show){
		bimCustomAttr.beVisible = show;
		var sideDiv = $('#m-attribute');
		if(show){
			bimCustomAttr.loadContent();
			bimCustomAttr.fromSelf = true;
			hideSidePanel();
       		window.parent.hideSidePanel();
       		bimCustomAttr.fromSelf = false;
       		sideDiv.css("right","0px");
		}else{
			sideDiv.css("right","-300px");
			bimCustomAttr.clearContent();
		}
		bimCustomAttr.btnElement.classList.toggle('active');
	},
	//按钮事件控制函数
	toggleVisibilityForCustomAttr : function (){
		bimCustomAttr.setVisibleForCustomAttr(!bimCustomAttr.beVisible);
	},
	/***************************************request  starting***************************************/
	clearContent : function (){
		//清空属性列表
		$('#m-attribute').html("");
	},
	showAllAnnotation : function (){
		bimCustomAttr.getDbidByCustom();
		bimCustomAttr.loadContent();
	},
	hideAllAnnotation : function (){
		$("div[name='customattr_annotation']").each(function(){
			if(this!=null){
				this.remove();
			}
		});
	},
	loadContent : function (){
		bimCustomAttr.showCustomAttr(bimCustomAttr.targetDBID); 
	},
	showCustomAttr : function (dbid){
		
		var fd = new FormData();
		//fd.append("sdbpath",bimCustomAttr.currentSDBPath);
		fd.append("modelid",bimCustomAttr.currentModelid);
		fd.append("modelversion",bimCustomAttr.currentModelVersion);
		fd.append("dbids",dbid.join(","));
		
		$.ajax({
			url:publicJS.tomcat_url+"/ModelAttributeExpand_getCustomAttrList.action",
			type:'POST',
			data:fd,
			dataType:'JSON',
			timeout:30000,
			async: false,
			processData:false,
			contentType:false,
			success:function(result){
				console.log("返回结果为result："+result);
				//清空属性列表
				bimCustomAttr.clearContent();
				var obj = JSON.parse(result);
				bimCustomAttr.showData(obj.data);
			},
			error:function(){
				//清空属性列表
				bimCustomAttr.clearContent();
				Dialog.alert(bdip4dLang[langType]["-15255"]);
			}
		});
	},
	showData : function(data){
		//加载属性列表
		var newLi = "";
		var attrData;
		var attributeName;
		var attributeValue;
		var html ="";
		    html += "<h2>"+bdip4dLang[langType]["-15256"]+"</h2>";
		    html += '<div class=" btnClose " onclick="bimCustomAttr.hiddenCustomAttr()">×</div>';
			html += '<div class="attribute_content">';
			if(!data || data.length==0){
				html += '</div>';
				html += '<div class="attribute_footer">';
				html += 	'<input type="button" onclick="bimCustomAttr.newClassIfication()" class="newCategory btn btn-info" value="'+bdip4dLang[langType]["-15257"]+'">';
				html += 	'<input type="button" class="newAttribute btn btn-info" value="'+bdip4dLang[langType]["-15258"]+'">';
				html += 	'<input type="button" onclick="bimCustomAttr.saveAction()" class="saveAttribute btn btn-info" value="'+bdip4dLang[langType]["-15259"]+'">';
				html +=	'</div>';
			}else{
				for(var i=0;i<data.length;i++){
					html += '<div class="panelClassification">';
					html +=		'<div class="panelClassification_title">';
					html +=			'<div class="attributeName" title="'+data[i].attrCategory+'"><icon></icon>'+ data[i].attrCategory +'</div>';
					if(data[i].attrCategoryType == "#BIM#custom#BIM#"){
						html +=			'<b class="delAttributes fa fa-trash fa-a5x" title="'+bdip4dLang[langType]["-15260"]+'"></b>';
					}
					html +=			'<b class="addAttributes fa fa-plus-square fa-a5x" title="'+bdip4dLang[langType]["-15258"]+'"></b>';
					html +=		'</div>';
					html +=		'<ul class="panelClassification_ul" style="display:block;">';
						attrData = data[i].attrData;
						for(var j=0;j<attrData.length;j++){
							if(attrData[j].attrName){
								attributeName = attrData[j].attrName;
							}else{
								continue;
							}
							if(attrData[j].description == "#BIM#custom#BIM#"||attrData[j].description == "HTTP1"){
								newLi = "newAtt"
							}else{
								newLi = "oldAtt"
							}
							attributeValue = attrData[j].attrValue;
					html +=			'<li class="panelClassification_list '+ newLi +'" _description="'+ attrData[j].description +'" _dataid="'+ attrData[j].id +'">';
					html +=				'<div class="panelClassification_name">';
					html +=					'<input type="text" class="panelClassification_input" value="'+ attributeName +'" title="'+ attributeName +'" readonly="readonly">';
					html +=				'</div>';
					html +=				'<div class="panelClassification_contetn">';
					html +=                  '<b class="attributesControl fa fa-trash fa-a5x" onclick="bimCustomAttr.deleteAttribute(event)"></b>';
					if(attrData[j].description == "HTTP0"||attrData[j].description == "HTTP1"){
						var attributeValueHref=attributeValue;
						if(attributeValue.indexOf("http://")==-1 && attributeValue.indexOf("https://")==-1){
		
						  attributeValueHref="http://"+attributeValue;
						}
						html += 		'<a class="attributeUrl" href="'+ attributeValueHref+ '" title="'+ attributeValueHref+ '" target="_blank" style="width:60%;padding: 3px 5px 3px 5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"> '+ attributeValue +'</a>';
						html +=         '<b class="fa fa-repeat fa-a5x" onclick="bimCustomAttr.changeAttributeUrl(event)"></b>';
					}else{
						var isWritableFir=attrData[j].attrName.indexOf("族");
						var isWritableSec=attrData[j].attrName.indexOf("类型");
						if(attrData[j].description=="system"&&(isWritableFir!=-1||isWritableSec!=-1)){
							html +=				 '<input type="text" class="panelClassification_input classificationValue" title="'+ attributeValue +'" value="'+ attributeValue +'" readonly="readonly">';
						}else{
							html +=				 '<input type="text" class="panelClassification_input classificationValue" title="'+ attributeValue +'" onchange="bimCustomAttr.changeAttribute(event)" value="'+ attributeValue +'" >';
						}
					}
					html +=				'</div>';
					html +=			'</li>';
						}
					html+=		'</ul>';
					html+=	'</div>';
				}	
					html += '</div>';
					html += '<div class="attribute_footer">';
					html += 	'<input type="button" onclick="bimCustomAttr.newClassIfication()" class="newCategory btn btn-info" value="'+bdip4dLang[langType]["-15257"]+'">';
					html += 	'<input type="button" class="newAttribute btn btn-info" value="'+bdip4dLang[langType]["-15258"]+'">';
					html += 	'<input type="button" onclick="bimCustomAttr.saveAction()" class="saveAttribute btn btn-info" value="'+bdip4dLang[langType]["-15259"]+'">';
					html +=	'</div>';
			}
		
		$('#m-attribute').html(html);
		html = "";
		this.bindShowMenu()/*菜单栏操作*/
		this.bindAddAttribute();/*增加属性*/
		this.bindDelAttribute()/*删除类*/
	},
	bindShowMenu : function(){
		var attributeName = $('.attributeName');
		attributeName.bind('click',function(event){
	 		var _this = event.target;
			var panelClassification_ul = _this.parentNode.nextElementSibling;
			var icon = _this.children[0];
			if(panelClassification_ul.style.display == "block"){
				icon.style.background = "url("+publicJS.tomcat_url+"/img/modeltool/xia.png)";
				panelClassification_ul.style.display = "none";
			}else{
				icon.style.background = "url("+publicJS.tomcat_url+"/img/modeltool/xial.png)";
				panelClassification_ul.style.display = "block";
			}
		})
	},
	newClassIfication : function(){
		var divs = "";
		divs += '<div class="panelClassification newClassIfication">';
		divs +=		'<div class="panelClassification_title">';
		divs +=			'<div class="attributeName"><icon></icon> <input class="attrClass" onchange="bimCustomAttr.checkCategory(event)" type="text" placeholder="'+bdip4dLang[langType]["-16446"]+'"></div>';
		divs +=			'<b class="addAttributes fa fa-plus-square fa-a5x" title="'+bdip4dLang[langType]["-15258"]+'"></b>';
		divs +=		'</div>';
		divs +=  '<ul class="panelClassification_ul" style="display:block;">'
		divs +=	 '</ul>'	
		divs+=	'</div>';
		$('.attribute_content').append(divs);
		$('.attribute_content').scrollTop($('.attribute_content')[0].scrollHeight);
		this.bindAddAttribute();
	},
	bindAddAttribute : function(){
		$('.panelClassification_title .addAttributes').bind('click',function(event){
				var event = event.srcElement ? event.srcElement : event.target;
				var attrContent = event.parentNode.nextSibling;
				bimCustomAttr.addAttribute(attrContent);
		})
	},
	bindDelAttribute : function(){
		$('.panelClassification_title .delAttributes').bind('click',function(event){
				var event = event.srcElement ? event.srcElement : event.target;
				var attributeName = event.previousSibling.innerText;
				bimCustomAttr.delAttribute(event.parentNode.nextSibling,attributeName);
		})
	},
	addAttribute : function(attrContent){
		var _this = this;
		var html = "";
		var lis = "";
		lis = document.createElement('li');
		lis.className = "panelClassification_list newAttributeLi";
		html +=				'<div class="panelClassification_name newAttributeDiv">';
		html +=					'<div class="dropdown-sin-2 dropdown-sin-2-'+ bimCustomAttr.ind +'"><select style="display:none"placeholder="'+bdip4dLang[langType]["-15261"]+'"></select></div>';
		html +=				'</div>';
		html +=				'<div class="panelClassification_contetn">';
		html +=					'<input type="text" class="panelClassification_input attrValue" title="'+bdip4dLang[langType]["-15262"]+'" placeholder="'+bdip4dLang[langType]["-15262"]+'" >';
		html +=					'<b class="delAttributes fa fa-trash fa-a5x" onclick="bimCustomAttr.delNewAttr(event)" title="'+bdip4dLang[langType]["-15263"]+'"></b>';
		html +=				'</div>';
		lis.innerHTML = html
		attrContent.appendChild(lis);
		var className = ".dropdown-sin-2-"+ bimCustomAttr.ind +"";
		_this.addSelectInput(className);
		bimCustomAttr.ind++;
	},
	delNewAttr : function(event){
		var event = event.srcElement?event.srcElement:event.target;
		event.parentNode.parentNode.remove();
	},
	delAttribute : function(evn,attributeName){
		if(evn.children.length>0){
			layer.msg(bdip4dLang[langType]["-15264"],{icon:2,time:2000});
			/*Dialog.alert("该类别下含有有效数据，无法删除");*/
			return;
		}else{
			var dbids = bimCustomAttr.targetDBID;
			//var data = {"dbids":dbids,"sdbpath":bimCustomAttr.currentSDBPath,"category":attributeName};
			
			var fd = new FormData();
			fd.append("dbids",dbids.join(","));
			//fd.append("sdbpath",bimCustomAttr.currentSDBPath);
			fd.append("modelid",bimCustomAttr.currentModelid);
			fd.append("modelversion",bimCustomAttr.currentModelVersion);
			fd.append("category",attributeName);
			
			$.ajax({
				url:publicJS.tomcat_url+"/ModelAttributeExpand_deleteCustomAttrCategory.action",
				type:'POST',
				data:fd,
				dataType:'JSON',
				async: false,
				processData:false,
				contentType:false,
				success:function(obj){
					//window.parent.newsPrompt('删除类别成功');
					layer.msg(bdip4dLang[langType]["-15265"],{icon:1,time:1000});
					/*Dialog.alert("删除类别成功");*/
					evn.parentNode.remove()
				},
				error:function(){
					layer.msg(bdip4dLang[langType]["-15266"],{icon:2,time:1000});
					/*Dialog.alert("网络错误，请稍后重试");*/
				}
			});
		}
	},
	addSelectInput : function(className){
		$(className).dropdown({
			      data: bimCustomAttr.attrDictionaryData,
			      input: '<input type="text" maxLength="20" placeholder="'+bdip4dLang[langType]["-15267"]+'">',
			      searchNoData:'<li style="color:#ddd"><input class="newAttributeBtn" type="button" value="'+bdip4dLang[langType]["-15268"]+'" onclick="bimCustomAttr.newAttribute(event)"></li>',
			      choice: function() {
			    	var _this = this;
			    	var category = "";
			    	var innerName = _this.$choseList[0].innerText;
			    	if(this.$choseList[0].parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.children[1].length > 0 ){
			    		category = _this.$choseList[0].parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.children[0].children[1].value;
			    	}else{
			    		category = _this.$choseList[0].parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.children[0].innerText;
			    	}
			  			
			  		var fd = new FormData();
			  		//fd.append("sdbpath",bimCustomAttr.currentSDBPath);
			  		fd.append("modelid",bimCustomAttr.currentModelid);
					fd.append("modelversion",bimCustomAttr.currentModelVersion);
			  		fd.append("dbids",bimCustomAttr.targetDBID.join(","));
			  		fd.append("attrName",innerName);
			  		fd.append("category",category);
			  			
			  		$.ajax({
			  			url:publicJS.tomcat_url+"/ModelAttributeExpand_beExistAttr.action",
			  			type:'POST',
			  			data:fd,
			  			dataType:'JSON',
			  			async: false,
			  			processData:false,
						contentType:false,
			  			success:function(result){
			  			var obj = JSON.parse(result);	
		  				if(obj.data == true){
							Dialog.alert(bdip4dLang[langType]["-15269"]);
							$('.saveAttribute').hide();
							_this.$choseList[0].parentNode.parentNode.style.border = "1px solid red"
							return;
						}else{
							_this.$choseList[0].parentNode.parentNode.style.border = "none"
							$('.saveAttribute').show();
						}
			  			},
			  			error:function(){
			  				console.log("属性查重失败");
			  				return;
			  			}
			  		});
			  		
			    	 if(this.$choseList[0].children[0].children.length >0){
			    		  var ids = this.$choseList[0].children[0].children[0].getAttribute("data-id");
			    	  }
			    	  if(ids == "0"){
			    		  this.$choseList.parent().parent().parent().next('.panelClassification_contetn').html("<input type='date' style='width:100%'>");
			    	  }else{
			    		  this.$choseList.parent().parent().parent().next('.panelClassification_contetn').html('<input type="text" class="panelClassification_input attrValue" title="'+bdip4dLang[langType]["-15262"]+'" placeholder="'+bdip4dLang[langType]["-15262"]+'" ><b class="delAttributes fa fa-trash fa-a5x" onclick="bimCustomAttr.delNewAttr(event)" title="'+bdip4dLang[langType]["-15263"]+'"></b>');
			    	  }
			    	  
			      }
			});
	},
	newAttribute : function(event){//增加词典
		var event = event.srcElement?event.srcElement:event.target;
		var divs = event.parentNode.parentNode.parentNode.parentNode;
		var values = event.parentNode.parentNode.previousSibling.children[0].value;
		var diag = new Dialog();
		diag.Width = 300;
		diag.Height = 100;
		diag.Title = bdip4dLang[langType]["-15271"];
		diag.InnerHtml = '<div class="addDictionary"style="position:  absolute;top: 35%;width: 100%;"><input type="text" value="'+ values +'" style="margin:0 auto;padding:0;width:150px;height:30px;text-indent:5px;display:  block;border-radius:  3px;border: 1px solid #ccc;outline:  none;"></div>'
		diag.OKEvent = function(){
			var innerName = window.parent.document.getElementsByClassName('addDictionary')[0].children[0].value;
			
			var fd = new FormData();
			//fd.append("sdbpath",bimCustomAttr.currentSDBPath);
			fd.append("modelid",bimCustomAttr.currentModelid);
			fd.append("modelversion",bimCustomAttr.currentModelVersion);
			fd.append("attrName",innerName);
			
			$.ajax({
				url:publicJS.tomcat_url+"/ModelAttributeExpand_addDictionary.action",
				type:'POST',
				data:fd,
				dataType:'JSON',
				async: false,
				processData:false,
				contentType:false,
				success:function(result){
					var obj = JSON.parse(result);
					if(obj.code == '222'){
						Dialog.alert(bdip4dLang[langType]["-15269"]);
					}else{
						Dialog.alert(bdip4dLang[langType]["-15279"],function(){
							diag.close();
							divs.parentNode.className = "panelClassification_name";
							divs.innerHTML = '<input type="text" class="panelClassification_input" style="color:#808080;text-indent:5px;" value="'+ innerName +'" title="'+ innerName +'" readonly="readonly">';
							divs.style.border = "none"
							$('.saveAttribute').show();
							bimCustomAttr.getAttrDictionary();
						});
					}
				},
				error:function(){
					Dialog.alert(bdip4dLang[langType]["-15272"]);
				}
			});
		};//点击确定后调用的方法
		diag.show();
		diag.okButton.value=bdip4dLang[langType]["-15259"];
	},
	//属性删除
	deleteAttribute : function(event){
		var event = event.srcElement ? event.srcElement : event.target;
		var _li = event.parentNode.parentNode;
		var _ids = _li.getAttribute("_dataid");
		var ids = _ids.split(",");
		
		var fd = new FormData();
		//fd.append("sdbpath",bimCustomAttr.currentSDBPath);
		fd.append("modelid",bimCustomAttr.currentModelid);
		fd.append("modelversion",bimCustomAttr.currentModelVersion);
		fd.append("ids",ids.join(","));
		
		$.ajax({
			url:publicJS.tomcat_url+"/ModelAttributeExpand_deleteCustomAttr.action",
			type:'POST',
			data:fd,
			dataType:'JSON',
			async: false,
			processData:false,
			contentType:false,
			success:function(obj){
				//window.parent.newsPrompt('删除属性成功');
				layer.msg(bdip4dLang[langType]["-15273"],{icon:1,time:1000});
				/*Dialog.alert("删除属性成功");*/
				_li.remove();
			},
			error:function(){
				layer.msg(bdip4dLang[langType]["-15266"],{icon:2,time:1000});
				/*Dialog.alert("网络错误，请稍后重试");*/
			}
		});
	},
	//更改属性url
	changeAttributeUrl : function(event){
		var event = event.srcElement ? event.srcElement : event.target;
		event.parentNode.innerHTML = '<input type="text" class="panelClassification_input classificationValue" autofocus onchange="bimCustomAttr.changeAttribute(event)">';
		event.parentNode.parentNode.className = ("panelClassification_list m-changeAttribute");
	},
	//属性重名检测
	changeAttribute : function(event){
		var event = event.srcElement ? event.srcElement : event.target;
		event.parentNode.parentNode.className = ("panelClassification_list m-changeAttribute");
		if(event.getAttributeNode("autofocus") != null){
			event.removeAttribute("autofocus");
		}
		
	},
	//属性类别重名检测
	checkCategory : function(event){
		var _this = this;
		var event = event.srcElement ? event.srcElement : event.target;
		var category = event.value;
		if(category.length == "0"){
			Dialog.alert(bdip4dLang[langType]["-15274"]);
			return;
		}
		
		var fd = new FormData();
		//fd.append("sdbpath",bimCustomAttr.currentSDBPath);
		fd.append("modelid",bimCustomAttr.currentModelid);
		fd.append("modelversion",bimCustomAttr.currentModelVersion);
		fd.append("dbids",bimCustomAttr.targetDBID.join(","));
		fd.append("category",category);
		
		$.ajax({
			url:publicJS.tomcat_url+"/ModelAttributeExpand_beExistAttrCategory.action",
			type:'POST',
			data:fd,
			dataType:'JSON',
			async: false,
			processData:false,
			contentType:false,
			success:function(result){
				var obj = JSON.parse(result);
				if(obj.data == true){
					Dialog.alert(bdip4dLang[langType]["-15275"]);
					$('.saveAttribute').hide();
					event.parentNode.parentNode.style.border = "1px solid red"
				}else{
					event.parentNode.parentNode.style.border = "none"
					$('.saveAttribute').show();
				}
			},
			error:function(){
				console.log("属性类别查重失败");
			}
		});
	},
	saveAction : function () {
		var dbidString = bimCustomAttr.targetDBID.join(",");
		var resultData = {};
		var addArr = new Array();
		var addCategory = new Array();
		var updateArr = new Array();
		var addAttrObj = {};
		var newCategory = "";
		var categorys = "";
		var newValue = "";
		var idString = "";
		var updateObj = {};
		var attrValue = "";
		var attrName = "";
		$('.newAttributeLi').each(function(){
			if($(this).find('.dropdown-selected').length>0){
				attrName = $(this).find('.dropdown-selected')[0].innerText;
			}else{
				attrName = $(this).find('.panelClassification_input').val();
			}
			if(attrName.length == 0 ){
				Dialog.alert(bdip4dLang[langType]["-15277"]);
				return;
			}
			if($(this).parent().prev().find('.attrClass').length>0){
				category = $(this).parent().prev().find('.attrClass').val();
			}else{
				category = $(this).parent().prev().find(".attributeName").text()
			}
			
			 attrValue = $(this).find('.attrValue').val();
			addAttrObj = {
					"attrName" : attrName,
					"category" : category,
					"attrValue" : attrValue,
				}
			addArr.push(addAttrObj);
		})
		$('.newClassIfication').each(function(){
			newCategory = $(this).find('.attrClass').val()
			if(newCategory.length == 0 ){
				Dialog.alert(bdip4dLang[langType]["-15278"]);
				return;
			}
			addCategory.push(newCategory);
			categorys = addCategory.join(",");
		})
		$('.m-changeAttribute').each(function(){
			newValue = $(this).find('.classificationValue').val();
			idString = $(this).attr("_dataid")
			description = $(this).attr("_description")
			updateObj = {
				"ids" : idString,
				"attrValue" : newValue,
				"description" : description
			}
			updateArr.push(updateObj);
		})
		//添加属性
		var addAttrPart = {
			"dbids" : dbidString,
			"attrData" : addArr
		}
		//添加属性类
		var addCategoryPart = {
				"dbids" : dbidString,
				"categorys" : categorys	
		}
		resultData = {
			"addAttr" : addAttrPart,
			"addCategory" : addCategoryPart,
			"updateAttrValue" : updateArr
		}
		
		var fd = new FormData();
		//fd.append("sdbpath",bimCustomAttr.currentSDBPath);
		fd.append("modelid",bimCustomAttr.currentModelid);
		fd.append("modelversion",bimCustomAttr.currentModelVersion);
		fd.append("userid",bimCustomAttr.currentUserid);
		fd.append("multiData",JSON.stringify(resultData));
		
		$.ajax({
			url:publicJS.tomcat_url+"/ModelAttributeExpand_multi.action",
			type:'POST',
			dataType:'JSON',
			data:fd,
			async:false,
			processData:false,
			contentType:false,
			success:function(){
				//window.parent.newsPrompt("数据保存成功");
				layer.msg(bdip4dLang[langType]["-15279"],{icon:1,time:1000});
				/*Dialog.alert("数据保存成功");*/
				bimCustomAttr.showCustomAttr(bimCustomAttr.targetDBID);
			},
			error:function(){
				layer.msg(bdip4dLang[langType]["-15280"],{icon:2,time:1000});
				/*Dialog.alert("保存失败");*/
			}
		});
	},
	loadAnnotation : function (dbidArr){
		//测试
		dbidArr = new Array();
		dbidArr.push(7147);
		dbidArr.push(1812);
		dbidArr.push(2982);
		if(dbidArr && dbidArr.length>0){
			for(var i=0;i<dbidArr.length;i++){
				var temp = dbidArr[i];
				BimBdip.view.model.getData().instanceTree.enumNodeFragments(temp,function(fragId){
					_gyroext.loadCustomAttrAnnotation(temp,fragId);
		        });
			}
		}
	},
	selectSelf : function (_this){
		var tempDbid = _this.getAttribute("refdbid");
		BimBdip.view.select(parseInt(tempDbid));
	},
	showHongWaFamilyInfo : function (){
		bimCustomAttr.extraInitialize();
		if(bimCustomAttr.targetDBID.length>1){
			Dialog.alert(bdip4dLang[langType]["-16447"]);
			return;
		}
		
		var fd = new FormData();
		//fd.append("sdbpath",bimCustomAttr.currentSDBPath);
		fd.append("modelid",bimCustomAttr.currentModelid);
		fd.append("modelversion",bimCustomAttr.currentModelVersion);
		fd.append("dbids",bimCustomAttr.targetDBID.join(","));
		
		$.ajax({
			url:publicJS.tomcat_url+"/ModelAttributeExpand_getHWGuidByDbid.action",
			type:'POST',
			dataType:'JSON',
			data:fd,
			processData:false,
			contentType:false,
			success:function(result){
				//layer.msg("数据保存成功",{icon:1,time:1000});
				console.log("返回的红瓦族库信息："+result);
				var obj = JSON.parse(result);
				var targetGuid = obj.data;
				if(targetGuid && targetGuid!=null && targetGuid.length>0){
					window.open('http://www.hwzuku.com/open/zuDetail/'+targetGuid);
				}else{
					Dialog.alert(bdip4dLang[langType]["-16448"]+"<a class='herf-text'  target='_blank' href='http://www.hwzuku.com'>"+bdip4dLang[langType]["-16449"]+"</a>"+bdip4dLang[langType]["-16450"]);
				}
			},
			error:function(result){
				//layer.msg("保存失败",{icon:2,time:1000});
				Dialog.alert(bdip4dLang[langType]["-16448"]+"<a class='herf-text'  target='_blank' href='http://www.hwzuku.com'>"+bdip4dLang[langType]["-16449"]+"</a>"+bdip4dLang[langType]["-16450"]);
			}
		});
	}
	
	/***************************************request  ending***************************************/
	
} 