"use strict";var bimSelectWindow={btnElement:null,beVisible:!1,doSelectWindow:function(){bimSelectWindow.init(),bimSelectWindow.toggleVisibilityForSelectWindow()},init:function(){var i=BimBdip.view.getToolbar(!0).getControl("bimbdip_viewToolBar").getControl("bimbdip_button_selectWindow");bimSelectWindow.btnElement=i.container},dockingPanelNone:function(){},setVisibleForSelectWindow:function(i){bimSelectWindow.beVisible=i,bimSelectWindow.btnElement.classList.toggle("active"),i?(BimBdip.view.canvas.classList.add("crosshair"),BimBdip.view.loadExtension("MySelectionWindow").then(function(i){setTimeout(function(){i.handleSelect(BimBdip.isFullScreen)},300)})):(BimBdip.view.canvas.classList.remove("crosshair"),BimBdip.view.loadExtension("MySelectionWindow").then(function(i){i.handleSelect(BimBdip.isFullScreen)}))},toggleVisibilityForSelectWindow:function(){bimSelectWindow.setVisibleForSelectWindow(!bimSelectWindow.beVisible)},hideButtonForSelectWindow:function(){bimSelectWindow.beVisible=!1,$(bimSelectWindow.btnElement).removeClass("active"),$(bimSelectWindow.btnElement).addClass("inactive"),BimBdip.view.canvas.classList.remove("crosshair"),BimBdip.view.loadExtension("MySelectionWindow").then(function(i){i.handleSelect(BimBdip.isFullScreen)})}};