/**
 * 
 */

var filterExecute = {
	finaldbids : null,
	finalTypeNames : null,
	type_floor :null,
	type_group :null,
	type_class :null,
	tree_id :null,
	condition_name :null,
	isDir:null,
	condition:null,
	final_condition : null,
    final_conditionid : null,
	init : function() {
		FilterAttribute.init();
		filterExecute.finaldbids = [];
		filterExecute.finalTypeNames = [];
		filterExecute.type_floor = "";
		filterExecute.type_group = "";
		filterExecute.type_class = "";
		filterExecute.tree_id = "";
		filterExecute.condition_name="";
		filterExecute.isDir=false;
		filterExecute.condition="";
        filterExecute.final_condition = "";
        filterExecute.final_conditionid = "";
	},
	checkMenuDbid : function(dbid) {
		
		var isdbids = false;
		var it = BimBdip.view.model.getData().instanceTree;
		it.enumNodeChildren( dbid, function( childId ) {
	        isdbids = true;    
	        filterExecute.checkMenuDbid(childId);  
	    });
	    if(!isdbids) {
	    	filterExecute.finaldbids.push(dbid);
	    }
	},
	modelAttributeTypes : function() {
		
		
		
			if(BimBdip.view.getSelection().length == 0) {
				filterExecute.finaldbids = filterExecute.getAllDbIds(BimBdip.view);
				
				//BimBdip.view.select(filterExecute.finaldbids);
			} else {
				filterExecute.finaldbids = [];
				for (var num = 0;num < BimBdip.view.getSelection().length; num++) {//forge3.1.1 (数组) oViewer.getAggregateSelection()[0].selection;
					filterExecute.checkMenuDbid(BimBdip.view.getSelection()[num]);
				}
			// BimBdip.view.getSelection();
			}
		
		var fd = new FormData();
		var dbidss = "";
		
		
		for(var j = 0 ; j <filterExecute.finaldbids.length;j++) {
			if(j == filterExecute.finaldbids.length-1) {
				dbidss+=filterExecute.finaldbids[j];
			} else {
				dbidss+=filterExecute.finaldbids[j] + ",";
			}
		}
		fd.append("dbids",dbidss);
		fd.append("typeName",FilterAttribute.attr_floor);//标高
		//var pathuse = BimBdip.sdbPath;
		/*var pathuse = "";*/
		/*for(var i = 0 ,leni = pathdbid.length; i < leni ; i++) {
			if(i == leni - 1 ) {
				pathuse+=pathdbid;
			} else {
				pathuse+=pathdbid+";";
			}
		}*/

		//pathuse = "D:;BdipMaster;Nginx;html;filebim;wendang;2;model;201711;DEMO;model.sdb";


		//pathuse = "D:;BdipMaster;Nginx;html;filebim;wendang;2;model;201711;DEMO;model.sdb";


		//fd.append("path",pathuse); //"D:;BdipMaster;Nginx;html;filebim;wendang;2;model;201711;DEMO;model.sdb"
		fd.append("lvmid",BimBdip.lvmid);
		fd.append("modelversion",BimBdip.modelVersion);
		var htmlall = "<ul>";
		var html = "";
		
        $.ajax({
            url:publicJS.tomcat_url+"/modelSearchCondition.action",
            type:'post',
            data:fd,
            async:false,
            processData:false,
            contentType : false,   
            dataType:'json',
            success : function(data){
             //   if(data.code == "200"){
             //   debugger;
              /*  console.log(data.data);
                var zNodes = new Array();
                for(var i = 0 ; i < data.data.length;i++) {
                	zNodes.push(JSON.parse(data.data[i]));
                }*/
//                	zNodes = data.data;
                	//bimOriginFilter.initialize();
    				bimOriginFilter.loadTree(data);
                	/*var zNodes = [
                		{"id":"1","name":"过滤器牛B","pId":"0","isParent":true,"open":false},
                		{"id":"2","name":"对对对，过滤器牛B","pId":"0","isParent":true,"open":false},
                		{"id":"3","name":"godFather说的对，过滤器牛B","pId":"1","isParent":true},
                		{"id":"4","name":"godFather说的对，过滤器牛B","pId":"3","isParent":true},
                		{"id":"5","name":"godFather说的对，过滤器牛B","pId":"4","isParent":false},
                		{"id":"6","name":"godFather说的对，过滤器牛B","pId":"4","isParent":false}
                		]; */
//                   for(var i = 0 ; i < data.data.length;i++) {
//                	   html += '<li><input type="checkbox" id=type_'+i+' value='+data.data[i].entityId+' ><a href = "#" >'+data.data[i].name +' ( '+ data.data[i].value +' ) '+'</a></li>'; 
//                	   var fd = new FormData();
//                	   var htmls = '<ul show="true">';
//               		   var dbIds = data.data[i].entityId;
//               		   fd.append("dbIds",dbIds);
//               		   fd.append("path","F:\\forge3.1\\modelnews\\model.sdb");
//               		   var names = data.data[i].name;
//               		   $.ajax({
//	                        url:'http://127.0.0.1:8081/bim-bdip-cloud-home-biz-web/attribute/modelSearchSecound',
//	                        type:'post',
//	                        data:fd,
//	                        async:false,
//	                        processData:false,
//	                        contentType : false,   
//	                        dataType:'json',
//	                        success : function(data){
//	                            if(data.code == "200"){
//	                               for(var j = 0 ; j < data.data.length;j++) {
//	                            	   
//	                            	   htmls += '<li><input type="checkbox" id='+names+'_'+j+' name = "attribute" value='+data.data[j].entityId+' ><a href = "#" >'+data.data[j].value+'</a></li>'; 
//	                               }
//	                               htmlall += html+htmls +"</ul>";
//	                       		   html = "";
//	                       		   htmls = "";
//	                                
//	                            }
//	                        }
//                       })
//                      
//                       // console.log(data.data[i].name+"-------"+data.data[i].value+"--------"+data.data[i].entityId);
//                   }
//                   htmlall =htmlall + "</ul>";
//                   document.getElementById("showAllType").innerHTML = htmlall ;
                    
             //   }
            }
        })    
	} , 
	arrNotSame : function(arr) {
		var result=[]
		for(var i=0; i<arr.length; i++){
		   if(result.indexOf(arr[i])==-1){
			   result.push(arr[i])
		   }
		}
		return result;
	} , 
	attribute_pro : function() {
		
		var fd = new FormData();
		var html = '';
		filterExecute.finaldbids=chooseDbidYes();
		var dbidss = "";
		for(var j = 0 ; j <filterExecute.finaldbids.length;j++) {
			if(j == filterExecute.finaldbids.length-1) {
				dbidss+=filterExecute.finaldbids[j];
			} else {
				dbidss+=filterExecute.finaldbids[j] + ",";
			}
		}
		fd.append("dbIds",dbidss);

//		var pathuse = BimBdip.sdbPath;

		//pathuse = "D:/BdipMaster/Nginx/html/filebim/wendang/2/model/201711/DEMO/model.sdb";

	
		/*var pathuse = "";
=======
		var pathuse = BimBdip.sdbPath;
	//	pathuse = "D:/BdipMaster/Nginx/html/filebim/wendang/2/model/201711/DEMO/model.sdb";
>>>>>>> .r3045
		/*var pathuse = "";
>>>>>>> .r3032
		for(var i = 0 ,leni = pathdbid.length; i < leni ; i++) {
			if(i == leni - 1 ) {
				pathuse+=pathdbid;
			} else {
				pathuse+=pathdbid+";";
			}
		}*/
//		fd.append("path",pathuse);
		fd.append("lvmid",BimBdip.lvmid);
		fd.append("modelversion",BimBdip.modelVersion);
		fd.append("typeName",filterExecute.finalTypeNames);
		$.ajax({
            url:publicJS.tomcat_url+"/modelSearchHightFirst.action",
            type:'post',
            data:fd,
            async:false,
            processData:false,
            contentType : false,   
            dataType:'json',
            success : function(data){
            //    if(data.code == "200"){
                   for(var i = 0 ; i < data.length;i++) {
                       html += ' <option value='+data[i].name+'>'+data[i].name+'</option>   ';
                   }
                   document.getElementById("canshu").innerHTML = html;
                    
            //    }
            }
        }) 
		
		
		
	} , 
	attribute_select : function() {
        var relationID = $("input[name='relation']:checked").val();
        var condition_use = "";
        var checkElements = document.getElementsByClassName('relations');
        for(var i = 0 ; i <checkElements.length;i++) {

                condition_use += checkElements[i].value+";";

		}
        filterExecute.final_condition = condition_use;
		if(condition_use!="") {
            condition_use = condition_use.substring(0,condition_use.length-1);

            filterExecute.finaldbids = chooseDbidYes();
            if(filterExecute.finaldbids.length == 0 ) {
                if(BimBdip.view.getSelection().length == 0) {
                    filterExecute.modelAttributeTypes();
                    return true;
                } else {
                    filterExecute.finaldbids = [];
                    for (var num = 0;num < BimBdip.view.getSelection().length; num++) {//forge3.1.1 (数组) oViewer.getAggregateSelection()[0].selection;
                        filterExecute.checkMenuDbid(BimBdip.view.getSelection()[num]);
                    }
                }
            }
            var fd = new FormData();
            //var html = ' <option value="请选择属性">请选择属性</option>   ';

            var dbidss = "";
            for(var j = 0 ; j <filterExecute.finaldbids.length;j++) {
                if(j == filterExecute.finaldbids.length-1) {
                    dbidss+=filterExecute.finaldbids[j];
                } else {
                    dbidss+=filterExecute.finaldbids[j] + ",";
                }
            }
            filterExecute.final_condition = condition_use;

            fd.append("dbIds",dbidss);
            fd.append("lvmid",BimBdip.lvmid);
            fd.append("modelversion",BimBdip.modelVersion);
            fd.append("typeName",filterExecute.finalTypeNames);
            fd.append("connections",condition_use);
            fd.append("connectionCondition",relationID);
            filterExecute.final_condition = relationID+";"+condition_use;
            var dbid = [];
            $.ajax({
                url:publicJS.tomcat_url+"/modelSearchHightSecound.action",
                type:'post',
                data:fd,
                async:false,
                processData:false,
                contentType : false,
                dataType:'json',
                success : function(data){
                    if( data.length >0 ) {
                        BimBdip.view.clearSelection();
                        for(var i = 0 ; i < data.length;i++) {
                            var dbiduse = data[i] - 0;
                            dbid.push(dbiduse);
                        }
                        BimBdip.view.select(dbid);
                        filterExecute.modelAttributeTypes();
                    }
                }
            })
		} else {
        	Dialog.alert(bdip4dLang[langType]["-16353"])
		}
    },attribute_refalse:function () {
            filterExecute.modelAttributeTypes();
    //    }//,actionForTrue : function() {
        //var msg = "查询结果为空，是否继续进行筛选？\n\n请确认！";
        //if (confirm(msg)==true){
        //return true;
        //	}else{
        //	$('.btnClose').click();
        //}
    }, getAllDbIds : function (viewer) {
	    var instanceTree = viewer.model.getData().instanceTree;
	    var allDbIdss = new Array();
	    var allDbIds = Object.keys(instanceTree.nodeAccess.dbIdToIndex);
	    for(var i = 0 ; i < allDbIds.length; i++) {
	    	allDbIdss.push(allDbIds[i]-0);
	    }
	    return allDbIdss;
	},
	attribute_save:function() {
		//debugger;
		//console.log(bimOriginFilter.zTree);

		var nodes = bimOriginFilter.zTree.getNodes();    //map形式存储，解析后存储   id-name  id需要判断层次，name需要剖切
	    for(var i=0,lenNodes= nodes.length;i<lenNodes;i++){    
	        if(typeof(nodes[i].children)!="undefined") {
	        	if(nodes[i].chooseName==FilterAttribute.attr_floor) {     		
	        		filterExecute.type_floor += nodes[i].name.split("(")[0]+",";	
	        	} else if(nodes[i].chooseName==FilterAttribute.attr_group) {
	        		filterExecute.type_group += nodes[i].name.split("(")[0]+",";
	        	} else if(nodes[i].chooseName==FilterAttribute.attr_class) {
	        		filterExecute.type_class += nodes[i].name.split("(")[0]+",";
	        	}
	        	var newSecound = nodes[i].children;
	        	for(var j=0,lenNodesj= newSecound.length;j<lenNodesj;j++) {
	        		if(typeof(newSecound[j].children)!="undefined") {
	        			if(newSecound[j].chooseName==FilterAttribute.attr_group) {
	    	        		filterExecute.type_group += newSecound[j].name.split("(")[0]+",";
	    	        	} else if(newSecound[j].chooseName==FilterAttribute.attr_class) {
	    	        		filterExecute.type_class += newSecound[j].name.split("(")[0]+",";
	    	        	}
	        			var newThreed = newSecound[j].children;
	        			for(var k = 0 ,lenk =newThreed.length ; k <lenk;k++) {
	        				filterExecute.type_class += newThreed[k].name.split("(")[0]+",";
	        			}
	        		} else{
	        			if(newSecound[j].chooseName==FilterAttribute.attr_group) {
	    	        		filterExecute.type_group += newSecound[j].name.split("(")[0]+",";
	    	        	} else if(newSecound[j].chooseName==FilterAttribute.attr_class) {
	    	        		filterExecute.type_class += newSecound[j].name.split("(")[0]+",";
	    	        	}
	        		}
	        	}
	        } else {
	        	
	        	if(nodes[i].chooseName==FilterAttribute.attr_floor) {     		
	        		filterExecute.type_floor += nodes[i].name.split("(")[0]+",";	
	        	} else if(nodes[i].chooseName==FilterAttribute.attr_group) {
	        		filterExecute.type_group += nodes[i].name.split("(")[0]+",";
	        	} else if(nodes[i].chooseName==FilterAttribute.attr_class) {
	        		filterExecute.type_class += nodes[i].name.split("(")[0]+",";
	        	}
	        }	    	
	    }  
	    filterExecute.type_floor = filterExecute.type_floor.substring(0,filterExecute.type_floor.length-1);
	    filterExecute.type_group = filterExecute.type_group.substring(0,filterExecute.type_group.length-1);
	    filterExecute.type_class = filterExecute.type_class.substring(0,filterExecute.type_class.length-1);
	    
	    var html = "";
	    var fd = new FormData();
	    var lmvid = BimBdip.lvmid;
	    var modelversion = BimBdip.modelVersion;
		fd.append("lmvid",lmvid);
	    fd.append("modelversion",modelversion);
	    $.ajax({
            url:publicJS.tomcat_url+"/selectDir.action",
            type:'post',
            data:fd,
            async:false,
            processData:false,
            contentType : false,   
            dataType:'json',
            success : function(data){
                filterExecute.type_floor = "";
                filterExecute.type_group = "";
                filterExecute.type_class = "";
                if(data.code == "200"){
                	
                	console.log(data);
                  for(var i = 0 ; i < data.data.length;i++) {
                	  
              		  
                	  html += '<li onclick="filterExecute.valueScreen('+data.data[i].id+')"><input type="button" id="value'+data.data[i].id+'" valueId="'+data.data[i].id+'" value="'+data.data[i].conditionName+'" title="'+data.data[i].conditionName+'" ></li>';
              		 
                  }
                 /* html+='<li><input type="button" value="新增" onclick="filterExecute.newScreen()"></li>';*/
                  document.getElementById("m-screenUl").innerHTML = html;                  
                  //$(window.parent.document).find('#gray_1').show();                                
                  $(".m-screenBom").show();
                  $(".gray").show();   
                  document.getElementById('box_gray').style.zIndex=1001;
          		
                //  filterExecute.attribute_save();
                }
            }
        }) 
	  /*   $('.m-screenUl li').bind("click",function(event){
      			var event = event.srcElement?event.srcElement:event.target;
      			var val = event.innerText;
      			$(".m-srceenVal").html(val)
      		})*/
	},attribute_true_save : function() {
        var condition_use = "";
       /* var relationID = $("input[name='relation']:checked").val();

        var checkElements = document.getElementsByClassName('relations');
        for(var i = 0 ; i <checkElements.length;i++) {
            if(checkElements[i].checked) {
                condition_use += checkElements[i].value+";";
            }

        }


        if(condition_use!="") {
            condition_use = relationID+";"+condition_use;
            condition_use = condition_use.substring(0,condition_use.length-1);
        }*/
        condition_use = filterExecute.final_condition;
        filterExecute.type_floor = "";
        filterExecute.type_group = "";
        filterExecute.type_class = "";
        var nodes = bimOriginFilter.zTree.getNodes();    //map形式存储，解析后存储   id-name  id需要判断层次，name需要剖切
        for(var i=0,lenNodes= nodes.length;i<lenNodes;i++){
            if(typeof(nodes[i].children)!="undefined") {
                if(nodes[i].chooseName==FilterAttribute.attr_floor) {
                    filterExecute.type_floor += nodes[i].name.split("(")[0]+",";
                } else if(nodes[i].chooseName==FilterAttribute.attr_group) {
                    filterExecute.type_group += nodes[i].name.split("(")[0]+",";
                } else if(nodes[i].chooseName==FilterAttribute.attr_class) {
                    filterExecute.type_class += nodes[i].name.split("(")[0]+",";
                }
                var newSecound = nodes[i].children;
                for(var j=0,lenNodesj= newSecound.length;j<lenNodesj;j++) {
                    if(typeof(newSecound[j].children)!="undefined") {
                        if(newSecound[j].chooseName==FilterAttribute.attr_group) {
                            filterExecute.type_group += newSecound[j].name.split("(")[0]+",";
                        } else if(newSecound[j].chooseName==FilterAttribute.attr_class) {
                            filterExecute.type_class += newSecound[j].name.split("(")[0]+",";
                        }
                        var newThreed = newSecound[j].children;
                        for(var k = 0 ,lenk =newThreed.length ; k <lenk;k++) {
                            filterExecute.type_class += newThreed[k].name.split("(")[0]+",";
                        }
                    } else{
                        if(newSecound[j].chooseName==FilterAttribute.attr_group) {
                            filterExecute.type_group += newSecound[j].name.split("(")[0]+",";
                        } else if(newSecound[j].chooseName==FilterAttribute.attr_class) {
                            filterExecute.type_class += newSecound[j].name.split("(")[0]+",";
                        }
                    }
                }
            } else {

                if(nodes[i].chooseName==FilterAttribute.attr_floor) {
                    filterExecute.type_floor += nodes[i].name.split("(")[0]+",";
                } else if(nodes[i].chooseName==FilterAttribute.attr_group) {
                    filterExecute.type_group += nodes[i].name.split("(")[0]+",";
                } else if(nodes[i].chooseName==FilterAttribute.attr_class) {
                    filterExecute.type_class += nodes[i].name.split("(")[0]+",";
                }
            }
        }
        filterExecute.type_floor = filterExecute.type_floor.substring(0,filterExecute.type_floor.length-1);
        filterExecute.type_group = filterExecute.type_group.substring(0,filterExecute.type_group.length-1);
        filterExecute.type_class = filterExecute.type_class.substring(0,filterExecute.type_class.length-1);
		var conditionName = document.getElementById("m-srceenValue").value;
	
		 if(conditionName!="") {
			 var fd = new FormData();
				
			 var lmvid = BimBdip.lvmid;
			 var modelversion = BimBdip.modelVersion;
			 fd.append("lmvid",lmvid);
			 fd.append("modelversion",modelversion);
		   
	    	 fd.append("dbids",filterExecute.finaldbids);
			 fd.append("condition",condition_use);
			 fd.append("conditionName",conditionName);
			 fd.append("treeId",filterExecute.tree_id);
			 fd.append("nodeType","0");
			 fd.append("ifOpen","0");
			 fd.append("ifDrag","1");
			 fd.append("ifDrop","0");
			 fd.append("attrFlow",filterExecute.type_floor);
			 fd.append("attrGroup",filterExecute.type_group);
			 fd.append("attrType",filterExecute.type_class);
		     
			 
			 $.ajax({
		        url:publicJS.tomcat_url+"/saveFilter.action",
	            type:'post',
	            data:fd,
	            async:false,
	            processData:false,
	            contentType : false,   
	            dataType:'json',
	            success : function(data){
	                if(data.code == "200"){
	                	bimOriginFilter.loadTreeOther();
	                   // alert("保存成功");
	              //      var model_url = BimBdip.view_modelUrl;
	               //     var modelid = BimBdip.lvmid;
	               //     var username = window.parent.BimUser.identifier;
	              //      var userid = window.parent.BimUser.id;
	                	//tzw
	                	bimFileterColoring.selectFilterByLmvid(lmvid,filterExecute.tree_id);
	                    //bimFileterColoring.insertEnableFilterColoring(filterExecute.tree_id,conditionName,filterExecute.finaldbids,model_url,modelid,username,userid);
	                    filterExecute.closeScreen();
	                    layer.msg(bdip4dLang[langType]["-15334"],{icon:1,time:1000});
	                }
	            },
	            error:function(){
	            	layer.msg(bdip4dLang[langType]["-15335"],{icon:2,time:1000});
	            	/*Dialog.alert("保存失败！");*/
	            }
	        }) 
		 } else {
		 	layer.msg(bdip4dLang[langType]["-15336"],{icon:7,time:1000});
			/* Dialog.alert("过滤名称不能为空！");*/
		 }

		
	},
	closeScreen : function(){
		$('.m-screenBom').hide();
		$('.gray').show();
		document.getElementById('box_gray').style.zIndex=999;
		$('#m-srceenValue').text();
		$('.m-srceenVal').text();
	},
	newScreen:function(){
	    var diag = new Dialog();
	    diag.Width = 300;
	    diag.Height = 100;
	    diag.Title = bdip4dLang[langType]["-15337"];
	    diag.InnerHtml = '<div style="margin-top: 20px;" addDictionary>' +
	    					'<p><span style="display:inline-block;text-align:right;">'+bdip4dLang[langType]["-15338"]+' ：</span>' +
	    						'<input type="text" style="width: 60%;height: 22px;line-height: 22px;" id = "newConditionId" required="required"  /></p>' +
	    					  '<p class="errorHelp" style="display:none;color:red">文件夹名称不能为空</p>'

	    					/*'<p><span style="display:inline-block;width:25%;text-align:right;">创建位置：</span>' +
	    						'<select style="width: 60%;height: 22px;line-height: 22px;"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></p>' +*/
	    				 '</div>'	    	
	    	
	    /*	'<div  class="addDictionary"style="position:  absolute;top: 35%;width: 100%;">
			<input id = "newConditionId" value=""  style="margin:0 auto;padding:0;width:150px;height:30px;text-indent:5px;display:  block;border-radius:  3px;border: 1px solid #ccc;outline:  none;">
		  </div>'
*/	    diag.OKEvent = function(){
	    	 var fd = new FormData();
	    	 var values = window.parent.document.getElementById("newConditionId").value;
	    	 if(values == ''){
	    	   $('.errorHelp',window.parent.document).show(); 
	    		 setTimeout(function () {  
	    		        $(".errorHelp",window.parent.document).hide();  
	    		    }, 1000);
	    		 return true
	    	 }
	    	 var lmvid = BimBdip.lvmid;
			 var modelversion = BimBdip.modelVersion;
			 fd.append("lmvid",lmvid);
			 fd.append("modelversion",modelversion);
			 fd.append("conditionName",values);
			 fd.append("treeId","0");
			 fd.append("nodeType","1");
			 fd.append("ifOpen","0");
			 fd.append("ifDrag","1");
			 fd.append("ifDrop","1");
			 $.ajax({
			        url:publicJS.tomcat_url+"/saveFilter.action",
		            type:'post',
		            data:fd,
		            async:false,
		            processData:false,
		            contentType : false,   
		            dataType:'json',
		            success : function(data){
		                if(data.code == "200"){
		                
	                		filterExecute.tree_id = data.data.id;
		            		filterExecute.condition_name=data.data.conditionName;
		            		document.getElementById("m-srceenVal").innerHTML = filterExecute.condition_name;
		            		bimOriginFilter.loadTreeOther();
		            		diag.close();
		            	//	filterExecute.newScreen();
			            		/*Dialog.getInstance('0').close();*/
		                	
		                	
		                } else {
		                	Dialog.alert(bdip4dLang[langType]["-15339"]);
		                }
		            }
		        })	
		    
	    	
	    };//点击确定后调用的方法
	    diag.show();
	    diag.okButton.value=bdip4dLang[langType]["-15340"];
	},
	valueScreen : function(id) {
		var value_id = "value"+id;
		var useValue = document.getElementById(value_id).value;
		
		document.getElementById("m-srceenVal").innerHTML = useValue;
        document.getElementById("m-srceenVal").setAttribute("title",useValue)  ;
		filterExecute.tree_id = id;
		filterExecute.condition_name=useValue;
	}
	
}