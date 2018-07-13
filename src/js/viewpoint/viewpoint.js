var bimViewPoint = {
	//全局变量名：变量值	
	markup : null,	
	mainPanel : null,
	toolPanel : null,
	onceEdit : false,
	count : 0,  //判断工具条出现次数
	showRightandButton : true,
	//清除之前的Panel弹框
	dockingPanelNone : function () {
		var markupClass = $(".markup");
        if(markupClass && markupClass.length>0){
            for(var i = 0;i<markupClass.length;i++){
                var mark = markupClass[i];
                mark.style.display = "none";
            }
        }
        //关闭历史回话
        if(bimHistory){
        	hideButtonForHistory();
        }
        //关闭碰撞点上传
        if(bimCollision){
        	hideButtonForClash();
        }
	},
	//加载视点列表
	viewpoint_load : function () {
		var _this = this;
		_this.dockingPanelNone();
		BimBdip.view.unloadExtension('Autodesk.ADN.Viewing.Extension.Markup');
		BimBdip.view.loadExtension('Autodesk.ADN.Viewing.Extension.Markup');
		_this.mainPanel = BimBdip.view.loadedExtensions['Autodesk.ADN.Viewing.Extension.Markup'].getPanelObject();
	},
	//修改enter按键事件
	viewpoint_keydown : function(e) {
		if(e.keyCode=='13'){
			BimBdip.view.loadedExtensions["Autodesk.ADN.Viewing.Extension.Markup"].getPanelObject().filterNodes();
		}
	},
	//转换baseUrl为Blob格式
	viewpoint_dataURLtoBlob : function (dataurl) {
		var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while(n--){
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {type:mime});
	}
	
} 