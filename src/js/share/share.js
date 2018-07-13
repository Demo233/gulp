var bimShare = {
	btnElement : null,		
	url : null, 			//跳转用路径
	container : null,		//div
	options : null,			//参数合集
	beVisible : false,
	init : function (){
		var viewer = BimBdip.view;
		var viewerToolbar = viewer.getToolbar(true);
		var ctrlGroup=viewerToolbar.getControl("bimbdip_viewToolBar");
		var button = ctrlGroup.getControl('bimbdip_button_share');
		bimShare.btnElement = button.container;
	},
	doShare : function () {
		bimShare.init();
		bimShare.toggleVisibilityForShare();
	},
	closeShare : function(){
		bimShare.setVisibleForShare(false);
	},
	//显示切换
	setVisibleForShare : function (show){
		bimShare.beVisible = show;
		bimShare.btnElement.classList.toggle('active');
		if(show){
			var head = window.location.protocol;
	 		var body = window.location.host;
	 		var cssUrl = publicJS.tomcat_url+"/bdipCloud/js/modeltool/share/";
			bimShare.container = $("#mainPanel");
			bimShare.url = cssUrl+"libs/bdip-qrcode/v1.0/template.jsp";
			bimShare.options = {
				baseUrl  : window.location.origin,//"http://127.0.0.1:8080/",
	            url   : bimShare.url,
	            lmvid : BimBdip.lvmid
	        };
			if(BimBdip.lvmid==null||BimBdip.modelVersion==""){
	            alert("无法获取模型相关信息,请选择模型");
	            return;
	        }
			//调用插件生成
	        bdipQrcodes.loadTemplate(bimShare.options, bimShare.container, function(){});
		}else{
			$(".bdip-qrcode .gray").hide();
			$(".bdip-qrcode .popup1").hide();//查找ID为popup1的DIV hide()隐藏
		}
	},
	//按钮事件控制函数
	toggleVisibilityForShare : function (){
		bimShare.setVisibleForShare(!bimShare.beVisible);
	}
}