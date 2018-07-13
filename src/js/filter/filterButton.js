var isFirstClick = true; // 是否为进入模型初次点击该按钮
var orbitToolsButton = null; // 按钮组
var currentActiveButton = null; // 当前激活按钮

function createGroupButton() {
  var viewer = BimBdip.view;
  var toolbar = viewer.getToolbar(true);
  var navTools = toolbar.getControl(av.TOOLBAR.BASEMODELSHOWSID);

  orbitToolsButton = new Autodesk.Viewing.UI.ComboButton('toolbar-pengpeng');
  orbitToolsButton.setToolTip('过滤收藏夹');
  orbitToolsButton.setIcon("fl-favorite");
  orbitToolsButton.setDisplay('block');
  createOrbitSubmenu(orbitToolsButton);
  navTools.addControl(orbitToolsButton);
  navTools.orbittoolsbutton = orbitToolsButton;
  // orbitToolsButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);

  navTools.returnToDefault = function () {
    //   orbitToolsButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
  };
  // deactivate();
  // orbitToolsButton.deactivate();
}

var createNavToggler = function (self, button, name) {
  return function () {
    var state = button.getState();
    if (state === Autodesk.Viewing.UI.Button.State.INACTIVE) {
//      self.activate(name);
      button.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
    } else if (state === Autodesk.Viewing.UI.Button.State.ACTIVE) {
//      self.deactivate();
      button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
    }
  };
}

function navActionDisplayMode(action) {
  return BimBdip.view.navigation.isActionEnabled(action) ? 'block' : 'none'
};

function createOrbitSubmenu(parentButton) {
  var viewer = BimBdip.view;
  var toolbar = viewer.getToolbar(true);
  var navTools = toolbar.getControl(av.TOOLBAR.BASEMODELSHOWSID);

  var freeOrbitButtons = new Autodesk.Viewing.UI.Button('btn_filter1');
  freeOrbitButtons.setToolTip('过滤器');
  freeOrbitButtons.setIcon("filtrations");
//  freeOrbitButtons.onClick = createNavToggler(this, freeOrbitButtons, '过滤器');
  freeOrbitButtons.onClick = function() {
	isFirstClick = false;
	orbitToolsButton.setToolTip('过滤器');
	orbitToolsButton.setIcon("filtrations");
	$("#toolbar-pengpeng").addClass("active");
	currentActiveButton = "filtrations";
	activate("filter");
  }

  parentButton.addControl(freeOrbitButtons);
  navTools.freeorbitbutton = freeOrbitButtons;

  var orbitButtons = new Autodesk.Viewing.UI.Button('btn_filter2');
  orbitButtons.setToolTip('收藏夹');
  orbitButtons.setIcon("favorite");
//  orbitButtons.onClick = createNavToggler(this, orbitButtons, '收藏夹');
  orbitButtons.onClick = function() {
	isFirstClick = false;
	orbitToolsButton.setToolTip('收藏夹');
	orbitToolsButton.setIcon("favorite");
	$("#toolbar-pengpeng").addClass("active");
	currentActiveButton = "favorite";
	activate("collection");
  }

  parentButton.addControl(orbitButtons);
  navTools.orbitbutton = orbitButtons;

//  parentButton.onClick = orbitButtons.onClick; // default
  
  /**
   * parentButton初次点击和后面点击事件
   */
  parentButton.onClick = function() { 
	if(isFirstClick) { // 初次点击，只控制显示、隐藏按钮组子集
	  if($("#toolbar-pengpengSubMenu").hasClass("adsk-hidden")) {
		$("#toolbar-pengpengSubMenu").removeClass("adsk-hidden");
	  }else {
		$("#toolbar-pengpengSubMenu").addClass("adsk-hidden");
	  }
	}else {
	  if($("#toolbar-pengpeng").hasClass("active")) {
		$("#toolbar-pengpeng").removeClass("active");
		
	  }else {
	    switch(currentActiveButton) {
	      case "filtrations":
	    	activate("filter");
	        break;
	      case "favorite":
	    	activate("collection");
	    	break;
	      default:
	    	break;
	    }
		  
		$("#toolbar-pengpeng").addClass("active");
	  }
	}
	
  }
}



/**
 * 点击过滤器，点击收藏夹方法
 */
function activate(mode) {
	bimOriginFilter.beVisible = false;
    if(mode === 'filter'){ // 过滤器
       if(BimBdip.view.getSelection().length == 0) {
			Dialog.alert("请先选择需要过滤的模型构件！", function() {
				// 关闭按钮active状态
				$(bimOriginFilter.btnFilterAndCollect).removeClass('active');
				$(bimOriginFilter.btnFilterAndCollect).addClass('inactive');
			});
			
		} else {
			$(".sidebar_advanced").hide();
            $('#advanced_btn').addClass("top_img");
            $('#advanced_btn').removeClass("bottom_img");
            bimOriginFilter.doStartFilter(); // 打开弹窗，执行过滤
			$("#tabs li").eq(0).trigger("click");		
		}
	}else if(mode === 'collection') { // 收藏夹
		$(".sidebar_advanced").hide();
        $('#advanced_btn').addClass("top_img");
        $('#advanced_btn').removeClass("bottom_img");
        bimOriginFilter.doStartFilter();
        bimOriginFilter.loadTreeOther(); // 点击收藏夹执行
        $("#tabs li").eq(1).trigger("click");
        
        $("#tabs li").eq(0)[0].addEventListener("click", handleFilterClick, false);
    }
 
    this.activeStatus = true;
    return true;
	
};
function deactivate() {
  if (this.activeStatus) {
    BimBdip.view.setActiveNavigationTool();
    this.activeStatus = false;
  }
  return true;
};


/**
 * 高级过滤器Dialog展开时，点击过滤器
 */
function handleFilterClick() {
    if(BimBdip.view.getSelection().length == 0) {
//    	$(this).removeClass('current').siblings().addClass('current');
//    	$('#box_gray').hide();
    	
    	if(Dialog.length > 2) { // 防止Dialog多次触发，但没有从本质上解决多次触发问题
    		return;
    	}
    	Dialog.alert("请先选择需要过滤的模型构件！");
    	$("#tabs li").eq(1).trigger("click");
	} else {
		bimOriginFilter.setVisibleForFilter(false); // 设置弹窗显示/隐藏
		bimOriginFilter.doStartFilter();	
	}
}

window.onload = function() {
	var arrowBtn = $("#toolbar-pengpengarrow"); // 三角按钮
	
	/**
	 * 三角按钮点击
	 */
	arrowBtn[0].addEventListener("click", function(event) {
		event.stopPropagation();
		event.preventDefault();
		
		if(!isFirstClick) {
			if($("#toolbar-pengpengSubMenu").hasClass("adsk-hidden")) {
				$("#toolbar-pengpengSubMenu").removeClass("adsk-hidden");
			}else {
				$("#toolbar-pengpengSubMenu").addClass("adsk-hidden");
			}
		}
	}, false)
}
