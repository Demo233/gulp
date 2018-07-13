var bimAxisMove = {
	btnElement : null,	
	beVisible : false,
	//显示碰撞点列表
	doAxisMove : function () {
		//bimAxisMove.dockingPanelNone();
		bimAxisMove.init();
		bimAxisMove.toggleVisibilityForAxisMove();
	},
	init : function(){
		var viewer = BimBdip.view;
	    
	    var viewerToolbar = viewer.getToolbar(true);
		var ctrlGroup=viewerToolbar.getControl("bimbdip_viewToolBar");
		var button = ctrlGroup.getControl('bimbdip_button_axis');
		bimAxisMove.btnElement = button.container;
	},
	dockingPanelNone : function () {

	},
	//显示切换
	setVisibleForAxisMove : function (show){
		bimAxisMove.beVisible = show;
		bimAxisMove.btnElement.classList.toggle('active');
		if(show){
			var dbIds = BimBdip.view.getSelection();
            if(dbIds.length ==1) {
                if(dbIds.length <= 0 ) {

                } else {
                    if(BimBdip.searchDbids.length !=0) {

                        var dbIds = BimBdip.view.getSelection()[0];
                        var meshd = buildComponentMesh(BimBdip.view,dbIds);
                        var oldz =  meshd.boundingBox.min.z -0;
                        var dbIds = BimBdip.searchDbids[BimBdip.searchDbids.length-1];

                        var meshs = buildComponentMesh(BimBdip.view,dbIds);
                        debugger;
                        var newz = meshs.boundingBox.min.z -0;
                        console.log("xxxx"+oldz);
                        console.log("yyyy"+newz);
                        var move = oldz - newz;
                        console.log(move);

                        for(var j = 0 ; j < BimBdip.searchDbids.length; j++) {
                            moveByCondition(BimBdip.searchDbids[j],move);
                        }

                    }
                }
            } else {
                Dialog.alert(bdip4dLang[langType]["-16352"]);
            }
            bimAxisMove.hideButtonForAxisMove();
		}else{
			//do nothing
		}
	},
	//按钮事件控制函数
	toggleVisibilityForAxisMove : function (){
		bimAxisMove.setVisibleForAxisMove(!bimAxisMove.beVisible);
	},
	hideButtonForAxisMove : function (){
    	bimAxisMove.beVisible = false;
		
		$(bimAxisMove.btnElement).removeClass('active');
		$(bimAxisMove.btnElement).addClass('inactive');
	}
	
}
