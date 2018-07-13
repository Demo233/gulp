var bimSelectWindow = {
	btnElement : null,	
	beVisible : false,
	//显示碰撞点列表
	doSelectWindow : function () {
		//bimSelectWindow.dockingPanelNone();
		bimSelectWindow.init();
		bimSelectWindow.toggleVisibilityForSelectWindow();
	},
	init : function(){
		var viewer = BimBdip.view;
	    
	    var viewerToolbar = viewer.getToolbar(true);
		var ctrlGroup=viewerToolbar.getControl("bimbdip_viewToolBar");
		var button = ctrlGroup.getControl('bimbdip_button_selectWindow');
		bimSelectWindow.btnElement = button.container;
	},
	dockingPanelNone : function () {

	},
	//显示切换
	setVisibleForSelectWindow : function (show){
       // BimBdip.isFullScreen = !BimBdip.isFullScreen;
		bimSelectWindow.beVisible = show;
		bimSelectWindow.btnElement.classList.toggle('active');
		if(show){
			BimBdip.view.canvas.classList.add("crosshair");
            BimBdip.view.loadExtension('MySelectionWindow').then(function(ext){
                setTimeout(function() {
                    ext.handleSelect(BimBdip.isFullScreen);
                },300)
            });
        //    $(bimSelectWindow.btnElement).removeClass('active').addClass('inactive');
		}else{
			BimBdip.view.canvas.classList.remove("crosshair");
            BimBdip.view.loadExtension('MySelectionWindow').then(function(ext){
                ext.handleSelect(BimBdip.isFullScreen);
            });
		}
	},
	//按钮事件控制函数
	toggleVisibilityForSelectWindow : function (){
		bimSelectWindow.setVisibleForSelectWindow(!bimSelectWindow.beVisible);

	},
	hideButtonForSelectWindow : function (){
    	bimSelectWindow.beVisible = false;
		
		$(bimSelectWindow.btnElement).removeClass('active');
		$(bimSelectWindow.btnElement).addClass('inactive');
		
		BimBdip.view.canvas.classList.remove("crosshair");
        BimBdip.view.loadExtension('MySelectionWindow').then(function(ext){
            ext.handleSelect(BimBdip.isFullScreen);
        });
	}
	
}
