var bimRoom = {
	modelurl : null,			//模型路径
	base64url : null,			//模型base64位路径
	modelId:null,
	treeNode : null,			//清空保存过的视点涂鸦
	doRoom : function () {
		bimRoom.modelurl = BimBdip.view_modelUrl;
		bimRoom.modelId = BimBdip.lvmid;
		bimRoom.base64url = $.base64.btoa(bimRoom.modelurl);
		$.ajax({
            type: "GET",
            url: publicJS.tomcat_url+"/roomisOpen.action?url="+bimRoom.modelurl,
            dataType: "json",
            async:"false",
            success: function(data){
                if(data.code == 200){
					var con;
					var flag = true;
					if(data.data.roomName){
						zdconfirm(bdip4dLang[langType]["-15767"],bdip4dLang[langType]["-15425"]+data.data.roomName,function(r){  /*提示,即将进入：*/
							if(r){  
								//...点确定之后执行的内容  
								window.open(publicJS.tomcat_url+"/joinRoom.action?param="+bimRoom.base64url+"&treeId="+bimRoom.modelId+"&room="+data.data.id+"&roomName="+data.data.roomName,"_blank");
								flag = false;
							}
						});  
					}else{
						zdconfirm(bdip4dLang[langType]["-15767"],bdip4dLang[langType]["-15426"]+data.data.id,function(r){  /*提示,'即将进入：默认名称'*/
							if(r){  
								if(flag){
									window.open(publicJS.tomcat_url+"/joinRoom.action?param="+bimRoom.base64url+"&treeId="+bimRoom.modelId+"&room="+data.data.id+"&roomName="+data.data.roomName,"_blank");
								}
							}
						});  
					}
                }else{
                    openconfirm(bdip4dLang[langType]["-15427"],'',function(r){  /*'请输入此次会话的主题'*/
                        if(r){  
                            var name = $('#mb_name').val();
                            console.log($('#mb_name'));//房间名称
                            if(name!=null && name!=""){
              			        $.ajax({
              			            type: "GET",
              			            url: publicJS.tomcat_url+"/createRoom.action?url="+bimRoom.modelurl+"&roomName="+name+"&userid="+BimBdip.currentUserid+"&username="+BimBdip.currentUsername+"&treeId="+bimRoom.modelId,
              			            dataType: "json",
              			            async:"false",
              			            success: function(data){
              			                if(data.code==200){
          			                		window.open(publicJS.tomcat_url+"/joinRoom.action?param="+bimRoom.base64url+"&treeId="+bimRoom.modelId+"&room="+data.data.id+"&roomName="+name,"_blank");
              			                }else{
              			                    Dialog.alert(bdip4dLang[langType]["-15428"]);//房间开启失败
              			                }  
              			            },
              			            error: function(data){
              			            	Dialog.alert(bdip4dLang[langType]["-15428"]);//房间开启失败
              			            }
              			        });
              		         }else{
              		        	Dialog.alert(bdip4dLang[langType]["-15429"]); //请输入一个房间名称
              		         }
                        }  
                    });  
				}
		    },
            error: function(data){
            }
        });
	}	
}