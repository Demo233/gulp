/**
 * 记录过滤器的属性
 */
var FilterAttribute = {
	attr_floor:null,
	attr_group:null,
	attr_class:null,
	attr_name:null,
	init:function() {
		FilterAttribute.attr_floor = "Level"; //参照标高
		FilterAttribute.attr_group = bdip4dLang[langType]["-15332"];
		FilterAttribute.attr_class = bdip4dLang[langType]["-15333"];
		FilterAttribute.attr_name  = "name";
	}
}
var  finaldbids_room = new Array();
function checkMenuDbid_room(dbid) {
		
		var isdbids = false;
		var it =BimBdip.view.model.getData().instanceTree;
		it.enumNodeChildren( dbid, function( childId ) {
	        isdbids = true;    
	        checkMenuDbid_room(childId);  
	    });
	    if(!isdbids) {
	    	finaldbids_room.push(dbid);
	    }
	}
function roomuse() {
    var dbIds = BimBdip.view.getSelection();
    for(var i = 0 ; i < dbIds.length;i++) {
        checkMenuDbid_room(dbIds[i]);
    }
    for(var j = 0 ;j<finaldbids_room.length;j++) {
        getFid(finaldbids_room[j]);
    }
}
function roomfinaluse(dbids) {
//debugger;
    for(var j = 0 ;j<dbids.length;j++) {
    	var i = dbids[j] - 0;
        getFid(i);
    }
}
function getFid(dbId){
	//var BimBdip.view = window.parent.document.getElementById("bdipPanel").contentWindow.BimBdip.view;

	//var dbId = BimBdip.view.getSelection()[0];
	var fargIds = 1;
	var it = BimBdip.view.model.getData().instanceTree;
		//遍历此对象含有的fragment id
	it.enumNodeFragments(dbId, function(fragId) {
      console.log(fragId);
		fargIds = fragId;
        var material = new THREE.MeshPhongMaterial({
            opacity:0.9  //color: getRandomColor(),
        });
        BimBdip.view.impl.matman().addMaterial('ViewerTestMaterial-' + fargIds,material);
        BimBdip.view.model.getFragmentList().setMaterial(fargIds,material);
        BimBdip.view.impl.invalidate(true);
    },false);

}