"use strict";var bimAxisMove={btnElement:null,beVisible:!1,doAxisMove:function(){bimAxisMove.init(),bimAxisMove.toggleVisibilityForAxisMove()},init:function(){var i=BimBdip.view.getToolbar(!0).getControl("bimbdip_viewToolBar").getControl("bimbdip_button_axis");bimAxisMove.btnElement=i.container},dockingPanelNone:function(){},setVisibleForAxisMove:function(i){if(bimAxisMove.beVisible=i,bimAxisMove.btnElement.classList.toggle("active"),i){if(1==(e=BimBdip.view.getSelection()).length){if(e.length<=0);else if(0!=BimBdip.searchDbids.length)for(var e=BimBdip.view.getSelection()[0],o=buildComponentMesh(BimBdip.view,e).boundingBox.min.z-0,n=(e=BimBdip.searchDbids[BimBdip.searchDbids.length-1],o-(buildComponentMesh(BimBdip.view,e).boundingBox.min.z-0)),t=0;t<BimBdip.searchDbids.length;t++)moveByCondition(BimBdip.searchDbids[t],n)}else Dialog.alert(bdip4dLang[langType][-16352]);bimAxisMove.hideButtonForAxisMove()}},toggleVisibilityForAxisMove:function(){bimAxisMove.setVisibleForAxisMove(!bimAxisMove.beVisible)},hideButtonForAxisMove:function(){bimAxisMove.beVisible=!1,$(bimAxisMove.btnElement).removeClass("active"),$(bimAxisMove.btnElement).addClass("inactive")}};