var chatview = {
	// 生成点
	chat:function(id,dbid,fragId,viewPointNum,typeUrl,enable) {
		var spanClassName = "";
		if(enable == 1){
			typeUrl = './../../bdipCloud/bdipimg/modeltool/chatview/closechat.png';
			spanClassName = "textname_clo";
			
		}else{
			typeUrl = './../../bdipCloud/img/modeltool/chatview/chat2.png';
			spanClassName = "textname";
		}
		_gyroext.chat(id,dbid,fragId,viewPointNum,typeUrl,spanClassName);
	// 定位点
	},focusPoint:function(id) {
		//var str = JSON.stringify(json);
		//str = str.replace(/'/g,'"');
		//var jsonObject = JSON.parse(str);
		//BimBdip.view.restoreState(jsonObject);
		//打开讨论框
		viewChatShow(id);
	// 删除点
	},chatClean:function() {
		var pnames = document.getElementsByName("viewChatTags");
		var len = pnames.length;
		if(len!=0){
			for(var j = 0 ; j <len ; j++) {
				pnames[0].parentNode.removeChild(pnames[0]);
			}
		}
		$(".discussDivClass").remove();
	},cleanAll:function(){
		//删除360 和实时讨论
		var pnames = document.getElementsByClassName("pnamed");
		for(var i = 0 ; i < pnames.length ; i++) {
			pnames[i].style.display = "none";
		}
		$(".discussDivClass").remove();
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
        var userId = BimBdip.currentUserid;
        fd.append("userId",userId);
        fd.append("bdipChatPoint.json",jsonString);
        fd.append("bdipChatPoint.modelUrl",modelUrl);
        fd.append("bdipChatPoint.dbId",dbId);
        fd.append("bdipChatPoint.fragId",fragId);
        fd.append("bdipChatPoint.treeId",lvmid);
        fd.append("projId",BimBdip.modelObject.project);
        fd.append("modelName",BimBdip.view_modelName);
        var base64code = BimBdip.view.getScreenShotBuffer();
        // 上传点压缩图片
        //discussCompress(fd,base64code);
      //压缩图片
    	compressImg(base64code,450,250,function(base64code){
    	    var blob = dataURLToBlob(base64code);
    	    if (blob !== null || blob !== undefined || blob !== '') {
    	        fd.append("file",blob);
    	        savePoint(fd);
    	    }else{
    	        Dialog.alert(bdip4dLang[langType][-16069]);
    	    }
    	});
	},
	/**
	 * 初始化分享人列表
	 */
	loadShareList : function(_detail){
		// 查询模型分享人
		var url = publicJS.tomcat_url + '/chat/getMembersByProjId.action';
		var data = new FormData();
		data.append("createBy",BimBdip.currentUserid);
		data.append("projId",BimBdip.modelObject.project);
		$.ajax({
			url : url,
			type : 'POST',
			data : data,
			dataType : 'json',
			processData:false,
			contentType:false,
			success : function(data){
				
			},
			error : function(error){
				
			}
		})
	},
	viewChatSubmitFunc : function(){
		var comment = $("textarea").val();
		if(comment.trim() == ''){
			Dialog.alert(bdip4dLang[langType][-15055]);
			return;
		}
		
		// 获取接收人
		var receiveId = $("input[name='userId']").val();
		
		var modelUrl = $("input[name='modelUrl']").val();
		var pointId = $("input[name='pointId']").val();
		// 当前用户信息
		var currentUserId = BimBdip.currentUserid;
		var currentUserName = BimBdip.currentUsername;
		
		// 获取模型的名字
		var modelName = BimBdip.view_modelName;
		var data = new FormData();
		data.append("remark",modelName);
		data.append("createBy",currentUserId);
		data.append("updateBy",currentUserId);
		data.append("receiveId",receiveId);
		data.append("userName",currentUserName);
		data.append("modelUrl",modelUrl);
		data.append("pointId",pointId);
		data.append("comment",comment);
		data.append("projId",BimBdip.modelObject.project);
		var sendBysSelect = $("#chatViewForm").find(".dropdown-selected i");
		if(sendBysSelect.length != 0){
			sendBysSelect.each(function(){
				data.append("sendBys",this.getAttribute("data-id"));
			});
		}
		/*data.append("sendBys","222");
		data.append("sendBys","333");*/
		data.append("lvmId", BimBdip.lvmid);
		showMask("loading...");
	 	$.ajax({
	 		url: publicJS.tomcat_url+'/message/saveMessage.action',
	 		type:'POST',
	 		data:data,
	 		dataType:'json',
	 		processData:false,
	 		contentType:false,
	 		success : viewChatSaveCallBack,
	 		error:function(a,b,c){
	 			hideMask();
	 			Dialog.alert(bdip4dLang[langType][-15057]+a+':'+b+':'+c);
	 		}
	 		
	 	});
	},
	offlinePointFunc : function(){
		var pointId = $("input[name='pointId']").val();
		showMask("loading...");
		var data = new FormData();
		data.append("id",pointId);
		$.ajax({
	 		url: publicJS.tomcat_url+'/chat/offlinePoint.action',
	 		type:'post',
	 		data:data,
	 		dataType:'json',
	 		processData:false,
	 		contentType:false,
	 		success : function(data){
	 			if(data.code == 200){
	 				// 修改点为红色
	 				var id = data.data.id;
	 				// 删除原点
	 				$('#a_' + id).parent().remove();
	 				var dbid = data.data.dbId;
	 				var fragId = data.data.fragId;
	 				var viewPointNum = data.data.viewPointNum;
	 				var enable = data.data.enable;
	 				// 重新生成点
	 				chatview.chat(id,dbid,fragId,viewPointNum,'',enable);
	 				window.parent.show_discussRightList();
	 				hideMask();
	 			}else{
	 				Dialog.alert(bdip4dLang[langType][data.code]);
		 			hideMask();
	 			}
	 		},
	 		error:function(error){
	 			Dialog.alert(error);
	 			hideMask();
	 		}
	 	});
	},
	onlinePointFunc : function(){
		var pointId = $("input[name='pointId']").val();
		showMask("loading...");
		$.ajax({
	 		url: publicJS.tomcat_url+'/chat/onlinePoint.action',
	 		type:'post',
	 		data:{id:pointId},
	 		dataType:'json',
	 		success : function(data){
	 			if(data.code == 200){
	 				// 修改点为红色
	 				var id = data.data.id;
	 				// 删除原点
	 				$('#a_' + id).parent().remove();
	 				var dbid = data.data.dbId;
	 				var fragId = data.data.fragId;
	 				var viewPointNum = data.data.viewPointNum;
	 				var enable = data.data.enable;
	 				// 重新生成点
	 				chatview.chat(id,dbid,fragId,viewPointNum,'',enable);
	 				window.parent.show_discussRightList();
	 				hideMask();
	 			}else{
	 				Dialog.alert(bdip4dLang[langType][data.code]);
		 			hideMask();
	 			}
	 		},
	 		error:function(error){
	 			Dialog.alert(error);
	 			hideMask();
	 		}
	 	});
	}
	
}



function discussCompress(fd,base64code){
	//压缩图片
	compressImg(base64code,450,250,function(base64code){
	    var blob = dataURLToBlob(base64code);
	    if (blob !== null || blob !== undefined || blob !== '') {
	        fd.append("file",blob);
	        savePoint(fd);
	    }else{
	        Dialog.alert(bdip4dLang[langType][-16069]);
	    }
	});
}

// 保存视点
function savePoint(fd){
	showMask("loading...");
	var url = publicJS.tomcat_url+"/chat/save.action";
	$.ajax({
   		url:url,
   		type:'POST',
   		data:fd,
   		async:false,
   		processData:false,
   		contentType:false,
   		dataType : "json",
  		//jsonp: "jsonpCallBack",
   		success:function(data){
   			if(data.code == "200"){
   				// 隐藏360框
   				//closePanoramaDiv();
   				// 隐藏360点
   				//closePanoramaPoint();
   				var id = data.data.id;
   				var dbId = data.data.dbId;
   				var fragId = data.data.fragId;
   				var viewPointNum = data.data.viewPointNum;
   				var imgUrl = './../../bdipCloud/img/modeltool/chatview/chat2.png';
   				var enable = "1";
   				var headImage = data.data.headImage;
   				var userName = data.data.userName;
   				var createTime = dateFormatUtil(data.data.createTime);
   				var deleteLogo = publicJS.tomcat_url+'/bdipCloud/img/modeltool/chatview/recycle46.png';
   				var json = data.data.json;
   				//var picture = urlDiscuss + data.data.picture;
   				var picture = publicJS.file_static_prefix() + "/discuss/"+ data.data.picture;
   				
   				chatview.chat(id,dbId,fragId,viewPointNum,imgUrl,enable);
   				viewChatShow(id);
   				var asideChatView = parent.document.getElementById("asideChatView"); 
   				var messageDiv = $(asideChatView).find(".m-message");
   				var html = 
   					'<div class="chatContent" name="chatContent_'+id+'">'	+
   	 				'<div class="top">'	+
   	 					'<img class="chatHeadImage" src="'+headImage+'">'	+
   	 					'<div class="chatUser">'	+
   		 					'<div class="chatUsermessage">'	+
   			 					'<div class="chatUserName">'+userName+'</div>'	+
   			 					'<div class="chatTime">'+createTime+'</div>'	+
   			 				'</div>'	+
   		 					'<div class="chatDelete">'	+
   		 						'<span class="viewPointNum"><b class="textNum">' + viewPointNum +'</b></span>'+
   		 						'<a href="javascript:void(0);" onclick="deleteChat('+id+')" title="'+bdip4dLang[langType][-16052]+'">'	+
   		 							'<img class="deleteLogo" src="'+deleteLogo+'">'	+
   		 						'</a>'	+
   		 					'</div>'	+
   	 					'</div>'	+
   	 				'</div>'	+
   	 				'<div class="middle">'	+
   	 					'<a href="javascript:void(0);" onclick="focusPoint('+id+')">'	+
   	 						'<img class="chatPicture" style="width: 100%;" src="'+picture+'">'	+
   	 					'</a>'	+
   	 				'</div>'	+
    				'</div>';
   				
   				messageDiv.append(html);
   			}else{
   				Dialog.alert(bdip4dLang[langType][data.code]);
   			}
   			hideMask();
   		},
   		error:function(a,b,c){
   			hideMask();
   			Dialog.alert(bdip4dLang[langType][-15392]+a+':'+b+':'+c);
   		}
   	});
	
	
}

// 点的点击事件
function viewChatShow(id){
	var div = $('.viewChatBox');
	if(div){
		div.each(function(){
			this.remove();
		})
	}
	$('#a_' + id).next('div.g-gif-div').html('<img src="' +publicJS.tomcat_url +'/bdipCloud/img/icon/loading01.gif">');
	$.ajax({
		url:publicJS.tomcat_url+"/chat/findById.action",
		type:"POST",
		data:{
			"userId" : BimBdip.currentUserid,
			"id" : id,
			"projId" : BimBdip.modelObject.project
		},
		dataType:"json",
		success : function(msg){
			// 成功回调
			showSuccessCallBack(msg,id);
		},
		error : function(a,b,c){
			Dialog.alert(bdip4dLang[langType][-15365]);
		}
		
	});
}

//成功回调
function showSuccessCallBack(msg,id){
	
	
	var point = msg.data.chatViewPoint;
	var pointId = point.id;
	//var picture = point.picture;
	var pictureUrl = publicJS.file_static_prefix() + "/discuss/"+ point.picture;
	var modelUrl = point.modelUrl;
	var enable = point.enable;
	var json = point.json.replace(/'/g,'"');
	var jsonObject = JSON.parse(json);
	// 点的创建人
	var userName = point.userName;
	var userId = point.createBy;
	
	var createTime = dateFormatUtil(point.createTime);
	var headImage = point.headImage;
	
	// 定位点
	BimBdip.view.restoreState(jsonObject);
	
	//var pictureUrl = urlDiscuss + picture;
	var jjUrl = publicJS.tomcat_url + "/bdipCloud/img/modeltool/chatview/viewChat_pldown.png";
	
	// 定位
	var comment_id = "comment_"+id;
	var comment_div = $("#a_"+id).siblings("div[name='"+comment_id+"']");
	// sessionUser
	//var user = msg.data.user;
	//var user = {id:654321,name:'二嘎子'};
	var currentUserName = BimBdip.currentUsername;
	var currentUserId = BimBdip.currentUserid;
	
	// 开始拼界面弹出框
	// 头部
	var form_html = '<div class="viewChatBox">'	+
						'<form action="#" id="chatViewForm" method="post">'	+
						'<input type="hidden" value="'+currentUserName+'" name="currentUserName">'	+
						'<input type="hidden" value="'+currentUserId+'" name="currentUserId">'	+
						'<input type="hidden" value="'+userId+'" name="userId">'	+
						'<input type="hidden" value="'+modelUrl+'" name="modelUrl">'	+
						'<input type="hidden" value="'+pointId+'" name="pointId">'	+
						'<div class="viewChatTitle">'	+
							'<div class="g-viewChat_title-content">'	+
								'<div class="g-view_title-img">'	+
									'<img src="'+ headImage +'" alt="">'	+
								'</div>'	+
								'<div class="g-view_title-user">'	+
									'<div class="u-view-creatName" id="'+ userId +'">'+ userName +'</div>'	+
									'<div class="u-view-creatTime">'+ createTime +'</div>'	+
								'</div>'	+
							'</div>'	+
							'<div class="g-viewChat_title-aside">'	+
									'<input type="button" value="×" title="'+bdip4dLang[langType][-15287]+'" id="commentClose">'	+
									'<input type="button" title="'+bdip4dLang[langType][-15285]+'" id="commentDelete">'	+
							'</div>'	+
						'</div>'	+
						'<div class="viewChatContent">'	+
							'<div id="viewChatTable">'	+
								'<div class="viewChatPicture" name="picture">'	+
									'<img name="picture" src="'+pictureUrl+'" >'	+
								'</div>'	+
								'<ul id="comment_ul" class="g-content-comment">'
	
	// 中间循环部分
	var msgArr = msg.data.bimChatMessageList;
	var len = msgArr.length;
	if(len > 0) {
		for(var j=0 ; j<len ; j++){
			var li_html = '<li>'	+
							'<div class="g-content-reply">'	+
								'<div class="g-reply-title">'	+
									'<b class="m-reply-userName">'+msgArr[j].userName+'</b>'	+
									'<b class="m-reply-time">'+dateFormatUtil(msgArr[j].createTime)+'</b>'	+
									'<div class="g-reply-content" >'+msgArr[j].comment+'</div>'	+
								'</div>	'	+
								'<div class="vertical-line"></div>'	+
							'</div>'	+
						'</li>'
			form_html += li_html;
		};
	}
	form_html += '</ul>'	+
					'</div>'
	// 尾部
	if(enable == '1'){
		// 启用
		form_html += '<textarea class="reply-area" name="comment" rows="" cols="" placeholder="'+bdip4dLang[langType][-15214]+'"></textarea>'	+
						'<div class="dropdown-sin-discuss discuss-select" readOnly="true">' +
							'<select name="sendBys" style="display:none" multiple placeholder="'+bdip4dLang[langType][-15215]+'">' +
					
							'</select>' +
						'</div>' +
						'<div class="g-comment-footer" name="submit" align="left">'	+
						'<input type="button" value="'+bdip4dLang[langType][-15216]+'" id="viewChatSubmit"/>'	
	   if(currentUserId == userId){
		// 如果当前用户和视点创建者是同一个人就允许结束
		   form_html +=	'<input type="button" id="offlinePoint" value="'+bdip4dLang[langType][-15217]+'"/>'	
	   }								
	   form_html +=		'</div>'	
	}else{
		// 停用
		if(currentUserId == userId){
		// 如果当前用户和视点创建者是同一个人就允许结束
			form_html +=	'<div class="g-comment-footer" name="submit" align="left">'  + 
								'<input type="button" id="onlinePoint" value="'+bdip4dLang[langType][-15218]+'"/>'	+
							'</div>';
		}								
	}
	form_html +=	'</div>'	+
							'<img class="g-add-img" src="'+jjUrl+'">'	+
						'</form>'	+
					'</div>';
	
	comment_div.html(form_html);
	// 启动dropdown插件
	if(typeof(msg.data.members) != 'undefined' && msg.data.members.length != 0 && enable == '1'){
		// 动态为下拉列表添加值
		var discussSelect = $("#chatViewForm").find("select[name='sendBys']");
		var html = "";
		msg.data.members.forEach((elem,index)=>{
			html += '<option value="'+elem.id+'">'+elem.lastname+'</option>';
		});
		// 把创建人添加到分享人列表中
		discussSelect.append(html);
		
		$('.dropdown-sin-discuss').dropdown({
	      input: '<input type="text" maxLength="20" placeholder="'+bdip4dLang[langType][-15219]+'">',
	      choice: function() {
	        console.log(arguments, this);
	      }
	    });
	}
	comment_div.show();
	
	// 为submit添加监听事件
	var viewChatSubmit = $("#viewChatSubmit")[0];
	if(typeof(viewChatSubmit)!="undefined"){ 
		$("#viewChatSubmit").click(chatview.viewChatSubmitFunc);
	}
	
	// 添加停用监听事件
	var offlinePoint = $("#offlinePoint")[0]
	if(typeof(offlinePoint)!="undefined"){ 
		$("#offlinePoint").click(chatview.offlinePointFunc);
	}
	
	// 为启用添加监听事件
	var onlinePoint = $("#onlinePoint")[0]
	if(typeof(onlinePoint)!="undefined"){ 
		$("#onlinePoint").click(chatview.onlinePointFunc);
	}
	
	//为reset添加监听事件
	var viewChatReset = $("#viewChatReset")[0];
	if(typeof(viewChatReset)!="undefined"){ 
		$("#viewChatReset").click(function(){
			var textarea = $('.reply-area')
			textarea.val("");
		});
	}
	
	// 为x添加监听事件
	$("#commentClose").click(function(){
		$('.viewChatBox').hide();
	});

	//增加全选按钮
	$(".dropdown-sin-discuss .dropdown-search").after('<span class="selectAll">'+
								'<input type="checkbox" style="width: ">'+
								'<span style="">'+bdip4dLang[langType][-15220]+'</span></span>');
	//全选按钮的点击事件
	$(".selectAll>input").click(function(){
		var personName='';
		var dropdownTitle=[];
		if($(".selectAll>input").is(':checked')==true){
			$(".dropdown-sin-discuss .dropdown-option").addClass("dropdown-chose");
			$(".dropdown-sin-discuss .dropdown-option").each(function(){
				personName+='<span class="dropdown-selected">' + $(this).text() + '<i class="del" data-id="' + $(this).attr("data-value") + '"></i></span>';
				dropdownTitle.push($(this).text());
			});
			$(".dropdown-sin-discuss .dropdown-chose-list .placeholder").before(personName);
			
		}else{
			$(".dropdown-sin-discuss .dropdown-option").removeClass("dropdown-chose");
			$(".dropdown-sin-discuss .dropdown-chose-list .dropdown-selected").remove();
			dropdownTitle=[];
		}

		$('.dropdown-sin-discuss .dropdown-display').attr('title', dropdownTitle.join(','));
		
	});	
}




function viewChatSaveCallBack(data){
	if(data.code == '200') {
		$(".g-content-comment").empty();
		var len = data.data.length;
		for(var i=0 ; i<len ; i++ ) {
			var html = '<li><div class="g-content-reply"><div class="g-title-right">';
			html += '<b class="m-reply-userName">'+data.data[i].userName+'</b>';
			html += '<b class="m-reply-time">'+dateFormatUtil(data.data[i].createTime)+'</b>';
			html += '</div><b class="m-replay">'+data.data[i].comment+'</b>';
			html += '</div></li>';
			$(".g-content-comment").append(html);
			// 清空textarea文本
			$("textarea[name='comment']").val("");
		};
	}else{
		Dialog.alert(bdip4dLang[langType][-15056]);
	}
	hideMask();
}


