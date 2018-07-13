var bimHistory = {
	beShow : false,	
	beVisible : false,
	btnElement : null,
	modelurl : null,			//模型路径
	//清除之前的Panel弹框
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
        //关闭碰撞
        if(bimCollision){
        	hideButtonForClash();
        }
	},
	init : function () {
		var viewer = BimBdip.view;
		var viewerToolbar = viewer.getToolbar(true);
		var ctrlGroup=viewerToolbar.getControl("bimbdip_viewToolBar");
		var button = ctrlGroup.getControl('bimbdip_button_history');
		bimHistory.btnElement = button.container;
	},
	//清除页面其他信息
	clean : function () {
		var _this = this;
		_this.dockingPanelNone();
		_this.init();
		bimHistory.beShow = true;
		BimBdip.view.unloadExtension("Autodesk.ADN.Viewing.Extension.Markup",null);
        BimBdip.view.loadExtension("Autodesk.ADN.Viewing.Extension.Markup",null);
        bimViewPoint.mainPanel = BimBdip.view.loadedExtensions['Autodesk.ADN.Viewing.Extension.Markup'].getPanelObject();
	},
	//执行查询历史会话
	doHistory : function () {
		toggleVisibilityForHistory();
	},
	showContent : function (id,roomName,createtime){
		$(".u-chat-list").hide();
		$(".u-chat-hidden").show();
		$(".u-chat-content").show();
		$("#u-chat-aside-title-content").html(roomName+"  "+createtime);
		$("#u-chat-aside-title-content").attr({'title' : roomName+"  "+createtime});
		$.ajax({
			type: "GET",
			url: publicJS.tomcat_url+"/getMessageByRoomId.action?room="+id,
			dataType: "json",
			success: function(data){
				if(data.code==200){
					var _data = data.data;
					var s = "";
					for(var i = 0 ; i < _data.length ; i ++){
						var content =_data[i].sendContent.split("/nick");
						//var sendTime = getTime(_data[i].sendTime);
						var sendTime = _data[i].sendTime.split(" ")[1].split(".")[0];
						//console.log(content.length);
						if(content.length == 2){
							s += "<li onclick='bimHistory.clickOrdinaryMsg()'>";
							s += "	<div class='g-chat-content'>";
							s += "		<div class='g-chat-title'>";
							s += "			<span>"+_data[i].sendPerson+"进入房间</span>";
							s += "			<span>"+sendTime+"</span>";
							s += "		</div>";
							s += "	</div>";
							s += "</li>"; 
						}else{
							if(_data[i].sendtype==1){
								s += "<li onclick='bimHistory.clickOrdinaryMsg()'>";
								s += "	<div class='g-chat-content'>";
								s += "		<div class='g-chat-title'>";
								s += "			<span>"+_data[i].sendPerson+"</span>";
								s += "			<span>"+sendTime+"</span>";
								s += "		</div>";
								s += "		<div class='g-chat'>";
								s += "			<b>"+_data[i].sendContent+"</b>";
								s += "		</div>";
								s += "	</div>";
								s += "</li>"; 
							}else if(_data[i].sendtype==2){
								s += "<li class='shidian' onclick=\"bimHistory.loadViewPoint('"+_data[i].sendContent+"')\">";
								s += "	<div class='g-chat-content'>";
								s += "		<div class='g-chat-title'>";
								s += "			<span>"+_data[i].sendPerson+"</span>";
								s += "			<span>"+sendTime+"</span>";
								s += "		</div>";
								s += "		<div class='g-chat'>";
								s += "			<b>视点："+_data[i].viewPointName+"</b>";
								s += "		</div>";
								s += "	</div>";
								s += "</li>"; 
							}
						}
						//s +=+":-------,sessionId:"+_data[i].sessionId+"<br/>";
					}
					$("#u-chat-content-ul").html(s);
				}
			},
			error: function(data){
		            
			}
		});
	},
	loadViewPoint : function(id){
		showMask("loading...");
		$.ajax({
			type: "GET",
			url: publicJS.tomcat_url+"/getViewPointByGuid.action?id="+id,
			dataType: "json",
			async: false,
			success: function(data) {  
				//var data = obj.data;
				if(data==null){  
					hideMask();
					Dialog.alert("该视点已被删除，无法查看");
					return;
				}else{
					BimBdip.view.loadedExtensions["Autodesk.ADN.Viewing.Extension.Markup"].getDate(data);
				}
			},
			error:function(data){
				hideMask();
				//alert("视点"); 
			}
		});
	},
	clickOrdinaryMsg : function (){//点击普通聊天记录记录
		BimBdip.view.loadedExtensions["Autodesk.ADN.Viewing.Extension.Markup"].markupDown();
	},
	hiddenChatConten : function (){
		$(".u-chat-content").hide();
		$("#u-chat-content-ul").html("");
		$(".u-chat-list").show();
		$(".u-chat-hidden").hide();
		$("#u-chat-aside-title-content").html("历史会话列表");
	},
	closeChatAside : function (){
		setVisibleForHistory(false);
	}
	
}

//显示切换
function setVisibleForHistory(show){
	bimHistory.beVisible = show;
	bimHistory.btnElement.classList.toggle('active');
	if(show){
		bimHistory.modelurl = BimBdip.view_modelUrl;
        $(".u-chat-aside").show();
        $(".u-chat-hidden").hide();
		$.ajax({
            type: "GET",
            url: publicJS.tomcat_url+"/getRoom.action?sessionId="+bimHistory.modelurl,
            dataType: "json",
            success: function(data){
                if(data.code==200){
                    var  _data = data.data;
                    var s = "";
                    for(var i = 0 ; i < _data.length ; i ++){
                    	//var createTime = getDate(_data[i].createTime);
                    	var createTime = _data[i].createTime.split(" ")[0];
                        if(_data[i].roomName===undefined || _data[i].roomName===null || _data[i].roomName==="" || _data[i].roomName==="null"|| _data[i].roomName==="undefined"){
                            s +="<li onclick='bimHistory.showContent("+_data[i].id+",\"无标题会话"+_data[i].id+"\",\""+createTime+"\")'>";
                            s +="<span class='chat-uname' title='无标题会话"+_data[i].id+"'>无标题会话"+_data[i].id+"</span>";
                        }else{
                            s +="<li onclick='bimHistory.showContent("+_data[i].id+",\""+_data[i].roomName+"\",\""+createTime+"\")'>";
                            s +="<span class='chat-uname' title='"+_data[i].roomName+"'>"+_data[i].roomName+"</span>";
                        }
                        s +="<span class='chat-time'>"+createTime+"</span>";
                        s +="</li>";
                    }
                    $("#u-chat-list-ul").html(s);
                }
            },
            error: function(data){
            }
        });
	}else{
		$(".u-chat-aside").hide();
		$(".u-chat-content").hide();
		$(".u-chat-list").show();
		$("#u-chat-aside-title-content").html("历史会话列表");
		if(bimViewPoint && bimViewPoint.mainPanel){
        	bimViewPoint.mainPanel.setVisible(false);
        }
		bimHistory.beShow = false;
	}
}
//按钮事件控制函数
function toggleVisibilityForHistory(){
	setVisibleForHistory(!bimHistory.beVisible);
}

function hideButtonForHistory(){
	$(".u-chat-aside").hide();
	$(".u-chat-content").hide();
	$(".u-chat-list").show();
	$("#u-chat-aside-title-content").html("历史会话列表");
	if(bimViewPoint && bimViewPoint.mainPanel){
    	bimViewPoint.mainPanel.setVisible(false);
    }
	bimHistory.beShow = false;
	bimHistory.beVisible = false;
	
	$(bimHistory.btnElement).removeClass('active');
	$(bimHistory.btnElement).addClass('inactive');
}
function showButtonForHistory(){
	$(bimHistory.btnElement).removeClass('inactive');
	$(bimHistory.btnElement).addClass('active');
}


