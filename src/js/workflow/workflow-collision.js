/**
 * workflowCollision方法导航
 * 
 * main					// 发起碰撞报告的主入口
 * initDetailTable		// 初始化表头
 * initCollisionTable	// 初始化collision 中间部分
 * analysisStr
 * initFooterButtonTable	// 初始化底部按钮
 * loadShareShunt		// 初始化表头时初始化分享人分流器
 * loadShareList		// 初始化分享人
 * loadShareEcho		// 分享人数据回显
 * loadFirstColorZone	// 初始化流程第1个节点色区
 * loadSecondColorZone	// 初始化流程第2个节点色区
 * loadThirdColorZone	// 初始化流程第3个节点色区
 * loadFourthColorZone	// 初始化流程第4个节点色区
 * firstStage			// 解除第一个节点要锁的东西
 * secondStage			// 解除第二个节点要锁的东西
 * thirdStage			// 解除第三个节点要锁的东西
 * fourthStage			// 解除第四个节点要锁的东西
 * cleanAllButton		// 隐藏所有的底部按钮
 * sendAjax				// 对ajax做简单封装
 * draft				// 第一阶段的提交或保存需要走的方法
 * check				// 第二阶段的提交或保存需要走的方法
 * checkReturn			// 第二阶段的回退操作需要走的方法
 * confirm				// 第三阶段的保存或提交需要走的方法
 * uploadTwoDimesionalImgage		// 上传2D图纸的方法(wangEditor编辑器点击上传图片后需要走的方法)
 * exportWord			// 导出word需要走的方法
 * fousPoint			// 定位点加载涂鸦的方法
 * clearCollisionMarkups	// 解决视点markup冲突
 * closeMarkUp			// 碰撞报告退出markup的方法
 * clearTable			// 关闭碰撞流程框
 * generatingList		// 生成列表主入口（dataTable）
 * loadHandleList		// 展示已处理列表
 * loadUnHandleList		// 展示未处理列表
 * loadCcList			// 展示抄送人列表
 * getTableMessage		// 根据Url和参数 获取所需要展示的信息(未处理、未处理、抄送人 公用的方法)
 * reloadList			// dataTable reload方法
 * deleteWorkflowByIds	// 删除工作流的方法
 * changeColorStyle		// (未处理、未处理、抄送人button改变颜色的方法)
 * bindListClickEvent	// 给dataTable列表的标题列绑定click事件
 * updateReadByStatusById	// 修改已读未读字段,点击标题的时候消除红点
 * showHandleChildrenTitle	// 显示已处理列表的标题
 * hideHandleChildrenTitle	// 隐藏已处理列表的标题
 * clearList			// 关闭碰撞报告列表的方法
 * getSendee
 * getCc
 * bindSaveSubmitShunt		// 保存和提交的引流
 * changeDropDownReadOnly	// 修改dropdown是否可编辑状态
 * initTextarea				// 初始化2D图纸上传框
 * 
 */

var gloubleVariable = {
		_launch:"",
		_reply:"",
		_confirm:"",
		_closed:"",
		_isReturn:"",
		status:0,
}

var workflowCollision = {
		// currentModelShareUser : '',
		currentListName : null,
		markupObj : null,
		operateEditorTarget : null, // 当前黏贴的textarea对象,是js对象非jQuery
		/**
		 * 点击发起碰撞报告的主入口
		 */
		init : function(){
			workflowCollision.currentListName= '';
			workflowCollision.markupObj = '';
		},
		main : function(_status,_data,_where){
			// 如果检测到视点的涂鸦没关,关闭视点的涂鸦
			if(workflowCollision.markupObj != null && workflowCollision.markupObj.duringEditMode){
				workflowCollision.closeMarkUp();
			}
			
			workflowCollision.init();
			workflowCollision.currentListName = _where;
			if(bimViewPointNew.markup != null && bimViewPointNew.markup.duringEditMode){
				bimViewPointNew.enterViewMode();
			}
			gloubleVariable.status = '0';
			if(_status){
				gloubleVariable.status = _status;
			}
			// 头部信息
			var detail = '';
			// 碰撞点
			var nodes = '';
			// 当前执行的节点信息
			if(gloubleVariable.status == '0'){
				if(_data){
					// 保存草稿
					nodes = _data.collisionLists;
					detail = _data.bimWorkflowDetail;
				}else{
					//nodes = bimViewPointNew.zTree.getCheckedNodes(); 老版本
					nodes = bimViewPointNew.getCheckedSonNodes();
					if(nodes.length == 0){
						layer.msg(bdip4dLang[langType]["-15996"]  ,{icon:7,time:2000});						/*alert("请勾选视点,再发起碰撞报告");*/
						return;
					}
				}
	    	}else{
	    		detail = _data.bimWorkflowDetail;
	    		nodes = _data.collisionLists;
	    	}
			switch(gloubleVariable.status){
				case '0': 
					loadFirstColorZone();
					workflowCollision.initDetailTable(detail);
					workflowCollision.initCollisionTable(nodes,detail);
					// 加载接收人抄送人列表
					workflowCollision.loadShareShunt(detail);
					if(workflowCollision.currentListName != 'cc' && workflowCollision.currentListName != 'handle'){
						workflowCollision.initFooterButtonTable();
						bindSaveSubmitShunt('0');
						workflowCollision.firstStage();
					}else{
						workflowCollision.lockAllEditor();
					}
					break;
				case '1':
					loadSecondColorZone();
					workflowCollision.initDetailTable(detail);
					workflowCollision.initCollisionTable(nodes,detail);
					workflowCollision.loadShareShunt(detail);
					if(workflowCollision.currentListName != 'cc' && workflowCollision.currentListName != 'handle'){
						workflowCollision.initFooterButtonTable();
						bindSaveSubmitShunt('1');
						if(detail.createBy != BimBdip.currentUserid){
							workflowCollision.secondStage();
						}
					}else{
						workflowCollision.lockAllEditor();
					}
					break;
				case '2':
					loadThirdColorZone();
					workflowCollision.initDetailTable(detail);
					workflowCollision.initCollisionTable(nodes,detail);
					workflowCollision.loadShareShunt(detail);
					if(workflowCollision.currentListName != 'cc' && workflowCollision.currentListName != 'handle'){
						workflowCollision.initFooterButtonTable();
						bindSaveSubmitShunt('2');
						if(detail.createBy == BimBdip.currentUserid){
							workflowCollision.thirdStage();
						}
					}else{
						workflowCollision.lockAllEditor();
					}
					break;
				case '3':
					loadFourthColorZone();
					workflowCollision.initDetailTable(detail);
					workflowCollision.initCollisionTable(nodes,detail);
					workflowCollision.loadShareShunt(detail);
					if(workflowCollision.currentListName != 'cc' && workflowCollision.currentListName != 'handle'){
						//workflowCollision.initFooterButtonTable();
						bindSaveSubmitShunt('3');
						workflowCollision.fourthStage();
					}else{
						workflowCollision.lockAllEditor();
					}
					break;
			}
		},
		/**
		 * 初始化表头
		 */
		initDetailTable : function (_detail){
			var workflowDetail = '';
			var workflowId = '';
			var detailSenderId = '';
			var detailSenderName = '';
			var detailXmmc = '';
			var detailReceiveId = '';
			var detailReceiveName = '';
			var detailCcId = '';
			var detailCcName = '';
			var workflowId = '';
			var detailTitle = bdip4dLang[langType]["-15997"]  ;			if(_detail != '' ){
				detailSenderId = _detail.createBy;
				detailSenderName = _detail.createName;
				detailXmmc = _detail.xmmc;
				detailTitle = _detail.title;
				detailReceiveId = _detail.receiveBy;
				detailReceiveName = _detail.receiveName;
				if(typeof(_detail.ccBy) != 'undefined'){
					detailCcId = _detail.ccBy;
					detailCcName = _detail.ccName;
				}
				workflowId = _detail.id;
			}else{
				// 否则senderName为当前登录用户
				//detailXmmc = BimBdip.view_modelName;
				try{
					detailXmmc = window.parent.currentProjectName;
				}catch (e) {
					// TODO: handle exception
				}
				detailSenderId = BimBdip.currentUserid;
				detailSenderName = BimBdip.currentUsername.trim();
				
			}
			$(".m-initating-process").empty();
			// var username = window.parent.BimBdip.currentUsername;
	    	var html = 
				'<form id="collisionForm" enctype="multipart/form-data">'	+
					'<input type="hidden" name="bimWorkflowDetail.id" value="'+workflowId+'">' +
					'<div class="m-initating-title hei30 br34">'	+
						'<span>'+bdip4dLang[langType]["34178"]  +'</span>'	+						'<input class="closeBtn closeInitating floright" onclick="clearTable()" type="button" value="×">'	+
						/* '<hr>' + */
					'</div>'	+
					'<div class="m-initating-header ">'	+/* flcenter */
						'<div class="m-initating-header-title hei30">'	+
							'<input disabled="disabled" class="projectName userinput hei20 floleft firstStageTextarea" name="bimWorkflowDetail.title" cols="20" rows="1" style="overflow-y:hidden;" value="'+detailTitle+'" title="'+detailTitle+'"></textarea>'	+
							'<div class="_export">'+
								'<input type="button" value="'+bdip4dLang[langType]["-15999"]  +'" onclick="workflowCollision.exportWord()">'+							'</div>'+
						'</div>'	+
						'<div class="m-initating-header-content">'	+
							'<div class="wid50 floleft hei20">'	+
								'<span class="floleft wid usespan">'+bdip4dLang[langType]["-16054"]  +'</span>'	+								'<input type="hidden" value="'+detailSenderId+'" name="bimWorkflowDetail.createBy">'	+
								'<input type="hidden" value="'+detailSenderName+'" name="bimWorkflowDetail.createName">'	+
								'<p class="initiatorName userinput hei20 floleft">'+ detailSenderName +'</p>'	+
							'</div>'	+
							'<div class="wid50 floleft hei20">'	+
								'<span class="floleft usespan">'+bdip4dLang[langType]["-16001"]  +'</span>'	+								'<input type="text" disabled="disabled" class="projectName userinput hei20 floleft" name="bimWorkflowDetail.xmmc" cols="20" rows="1" style="overflow-y:hidden;" title="'+detailXmmc+'" value ="'+detailXmmc+'" ></input>'	+
							'</div>'	+
							'<div class="wid50 floleft hei20">' +
								'<span class="floleft usespan">'+bdip4dLang[langType]["896"]  +'</span>'	+							   '<div class="dropdown-sin-1" readOnly="true" style="width: 153px;display: inline-block;">' +
						          	'<select name="bimWorkflowDetail.receiveBy" style="display:none" placeholder="'+bdip4dLang[langType]["-16003"]  +'">' +						          	
						            '</select>' +
						        '</div>' +
					        '</div>' +
					        '<div class="wid50 floleft hei20">' +
							'<span class="floleft usespan">'+bdip4dLang[langType]["-16004"]  +'</span>'	+						'<div class="dropdown-sin-2" style="width: 153px;display: inline-block;">' +
					          	'<select name="ccBy" style="display:none" multiple placeholder="'+bdip4dLang[langType]["-16005"]  +'">' +					          	
					            '</select>' +
					        '</div>' +
				        '</div>' +
						'</div>'	+
					'</div>'	+
					'<div class="m-initating-content scroll_bar flcenter">' +
					'</div>'	+
					'<div class="m-initating-footer">'	+
					'<i class="line"></i>'	+
					'<div class="solid_tishi">'+
						'<p>'+
							'<i class="solid_xt blue_bg"></i>'+
							'<span>'+bdip4dLang[langType]["28499"]  +'</span>'+							'<i class="solid_xt orange_bg"></i>'+
							'<span>'+bdip4dLang[langType]["-16007"]  +'</span>'+							'<i class="solid_xt greenyellow_bg"></i>'+
							'<span>'+bdip4dLang[langType]["-16008"]  +'</span>'+					    '</p>'+
					'</div>'+
					'<ul class="footer-process">'	+
						'<li class="'+ gloubleVariable._launch +'">'+bdip4dLang[langType]["-16009"]  +'</span>'	+						'<li class="'+ gloubleVariable._reply +'">'+bdip4dLang[langType]["-16010"]  +'</span>'	+						'<li class="'+ gloubleVariable._confirm +'">'+bdip4dLang[langType]["-16011"]  +'</span>'	+						'<li class="'+ gloubleVariable._closed +'">'+bdip4dLang[langType]["-16012"]  +'</span>'	+					'</ul>'	+
					'<i class="line"></i>'	+
					'<div class="footer-button">'	+
					'</div>'	+
				'</div>'	+
			'</form>'	
			$(".m-initating-process").html(html);
		},
		/**
		 * 初始化collision 中间部分
		 */
		initCollisionTable : function(nodes,detail){
			var _this = this;
			var html = "";
			var sjtxgyj = "";
			var json = "";
			var mxyzyj = "";
			nodes.forEach((node,index)=>{
				if(typeof(node.isParent)!='undefined' && node.isParent){
					// 如果当前节点是目录就return当前循环
					return ;
				}
				var id = node.id;
				if(typeof(node.vpId)!= 'undefined' && node.vpId!='' ){
					id = node.vpId;
				}
				// console.log(node);
				if(typeof(node.json) != 'undefined'){
					json = node.json;
				}else{
					if(typeof(node.viewpoint) != 'undefined'){
						json = node.viewpoint.json;
					}else{
						console.log(bdip4dLang[langType]["-16013"]   + "workflow-collision.js");					}
				}
				if(typeof(node.sjtxgyj) != 'undefined'){
					//if(node.sjtxgyj != ''){
					sjtxgyj = node.sjtxgyj;
					//}
					var userId = BimBdip.currentUserid;
					if( typeof(node.exField1) != 'undefined' && gloubleVariable.status == '1' && userId == detail.receiveBy){
						sjtxgyj = node.exField1;
					}
				}else{
					sjtxgyj = "";
				}
				
				if(typeof(node.mxyzyj) != 'undefined'){
					mxyzyj = node.mxyzyj;
					var userId = BimBdip.currentUserid;
					if(typeof(node.exField2) != 'undefined' && gloubleVariable.status == '2' && userId == detail.createBy){
						mxyzyj = node.exField2;
					}
				}else{
					mxyzyj = "";
				}
				// console.log(node);
				if(typeof(node.type)!='undefined'){
					if(node.type == 1){
						var uploadViewPoint = workflowCollision.analysisStr(node.info);
						// console.log(uploadViewPoint);
						node.zxwz = uploadViewPoint[1];
						node.lcbh = uploadViewPoint[3];
						node.sjzy = uploadViewPoint[4];
					}
				}
				// 处理mark
				//node.markup
				var mark = "";
				if(typeof(node.markupData)!='undefined'){
					mark = node.markupData;
				}else{
					if(typeof(node.viewpoint)!='undefined'){
						mark = node.viewpoint.mark;
					}
				}
				var arr = mark.split("@#@");
				var handledMark = "";
				if(arr!=''){
					for(var i=0;i<arr.length;i++){
						handledMark += arr[i].split("@BIM@")[1];
					}
				}
				// 遍历生成table 附加到workflow-collision-table div中
				var jbxx_y = bdip4dLang[langType]["1361"]  ;				
				var zybh_y = bdip4dLang[langType]["-16015"]  ;				
				var lbbh_y = bdip4dLang[langType]["-16016"]  ;				
				var yzdjbh_y = bdip4dLang[langType]["-16017"]  ;				
				var sjzy_y = bdip4dLang[langType]["-16018"]  ;				
				var wz_y = bdip4dLang[langType]["22981"]  ;				
				var bz_y = bdip4dLang[langType]["-16020"]  ;				
				var jmyj_y = bdip4dLang[langType]["-16021"]  ;				
				var tzhz_y = bdip4dLang[langType]["-16022"]  ;				
				var th_y = bdip4dLang[langType]["-16023"]  ;				
				var wtfx_y = bdip4dLang[langType]["-16024"]  ;				
				var wtms_y = bdip4dLang[langType]["-16025"]  ;				
				var yhjy_y = bdip4dLang[langType]["-16026"]  ;				
				var wtsd_y = bdip4dLang[langType]["-16027"]  ;				
				var sctz_y = bdip4dLang[langType]["-16029"]  ;	
				var sjtxgyj_y = bdip4dLang.getLang("-16031")  ;		
				var xgfh_y = bdip4dLang[langType]["-16030"]  ;	
				var mxyzyj_y = bdip4dLang.getLang("-16032")  ;	
				html += `
					<table class="m-initating-table hei30" name="initating-table-${index}">
						<tr>
							<td class="bca colorWhite" colspan="6" style="text-indent: 3.7%;">${jbxx_y}</td>
						</tr>
						<tr>
							<td class="center">${zybh_y}</td>
							<td>
								<input readonly="readonly" name="collisionsWrapper.collisions[${index}].zybh" maxlength="16" value="${typeof(node.zybh)=='undefined'?'':node.zybh}" class="tableinput first firstStageInput fourthStageInput" type="text" maxlength="20">
							</td>
							<td class="center">${lbbh_y}</td>
							<td>
								<select disabled="disabled" name="collisionsWrapper.collisions[${index}].lbbh" class="tableSelect first firstStageSelect fourthStageSelect" style="width: 80%;margin: 0 auto;display: block;">
									<option value="A" ${typeof(node.lbbh)=='undefined' || node.lbbh == 'A'?'selected':''}>A</option>
									<option value="B" ${node.lbbh == 'B'?'selected':''}>B</option>
									<option value="C" ${node.lbbh == 'C'?'selected':''}>C</option>
									<option value="D" ${node.lbbh == 'D'?'selected':''}>D</option>
								</select>
							</td>
							<td class="center">${yzdjbh_y}</td>
							<td>
								<select disabled="disabled" name="collisionsWrapper.collisions[${index}].yzdjbh" class="tableSelect first firstStageSelect fourthStageSelect" style="width: 80%;margin: 0 auto;display: block;">
									<option value="1" ${typeof(node.yzdjbh)=='undefined' || node.yzdjbh == '1'?'selected':''}>1</option>
									<option value="2" ${node.yzdjbh == '2'?'selected':''}>2</option>
									<option value="3" ${node.yzdjbh == '3'?'selected':''}>3</option>
									<option value="4" ${node.yzdjbh == '4'?'selected':''}>4</option>
									<option value="5" ${node.yzdjbh == '5'?'selected':''}>5</option>
								</select>
							</td>
						</tr>
						<tr>
							<td class="center">${sjzy_y}</td>
							<td>
								<input readonly="readonly" name="collisionsWrapper.collisions[${index}].sjzy" maxlength="16" value="${typeof(node.sjzy)=='undefined'?'':node.sjzy}" class="tableinput first firstStageInput fourthStageInput" type="text" maxlength="20">
							</td>
							<td class="center">${wz_y}</td>
							<td>
								<input readonly="readonly" name="collisionsWrapper.collisions[${index}].zxwz" maxlength="16" value="${typeof(node.zxwz)=='undefined'?'':node.zxwz}" class="tableinput first firstStageInput fourthStageInput" type="text" maxlength="30">
							</td>
							<td class="center">${bz_y}</td>
							<td>
								<input readonly="readonly" name="collisionsWrapper.collisions[${index}].lcbh" maxlength="16" value="${typeof(node.lcbh)=='undefined'?'':node.lcbh}" class="tableinput first firstStageInput fourthStageInput" type="text" maxlength="30">
							</td>
						</tr>
						<tr>
							<td  class="bca colorWhite" colspan="6" style="text-indent: 3.7%;">${jmyj_y}</td>
						</tr>
						<tr>
							<td class="center">${tzhz_y}</td>
							<td colspan="2">
								<input readonly="readonly" name="collisionsWrapper.collisions[${index}].tzhz" maxlength="16" value="${typeof(node.tzhz)=='undefined'?'':node.tzhz}" class="tableinput first firstStageInput fourthStageInput" type="text" maxlength="40">
							</td>
							<td class="center">${th_y}</td>
							<td colspan="2">
								<input readonly="readonly" name="collisionsWrapper.collisions[${index}].th" maxlength="16" value="${typeof(node.th)=='undefined'?'':node.th}" class="tableinput first firstStageInput fourthStageInput" type="text" maxlength="40">
							</td>
						</tr>
						<tr>
							<td  class="bca colorWhite" colspan="6" style="text-indent: 3.7%;">${wtfx_y}</td>
						</tr>
						<tr>
							<td class="center">${wtms_y}</td>
							<td colspan="5">
								<textarea disabled="disabled" name="collisionsWrapper.collisions[${index}].wtms" class="tableTextarea first firstStageTextarea fourthStageTextarea"style="overflow-y:hidden;" onpropertychange="this.style.height=this.scrollHeight + 'px'" oninput="this.style.height=this.scrollHeight + 'px'">${typeof(node.wtms)=='undefined'?'':node.wtms}</textarea>
							</td>
						</tr>
						<tr>
							<td class="center">${yhjy_y}</td>
							<td colspan="5">
								<textarea disabled="disabled" class="tableTextarea first firstStageTextarea fourthStageTextarea" name="collisionsWrapper.collisions[${index}].yhjy" style="overflow-y:hidden;" onpropertychange="this.style.height=this.scrollHeight + 'px'" oninput="this.style.height=this.scrollHeight + 'px'">${typeof(node.yhjy)=='undefined'?'':node.yhjy}</textarea>
							</td>
						</tr>
						<tr>
							<td class="center" colspan="6">${wtsd_y}</td>
						</tr>
						<tr>
							<td colspan="6">
								<div onclick="workflowCollision.fousPoint(event)" class="tableDiv">
									<input type="hidden" name="collisionsWrapper.collisions[${index}].vpId" value="${id}">
									<input type="hidden" name="collisionsWrapper.collisions[${index}].vpPicture" value="${typeof(node.picture)=='undefined'?node.vpPicture:node.picture}">
									<img src="${typeof(node.picture)=='undefined'?node.vpPicture:node.picture}" alt="${bdip4dLang[langType]["-16028"]  }">									<span _json="${json}" _mark="${mark}" name="table_svg">${handledMark}</span>
								</div>
							</td>
						</tr>
						<tr>
							<td class="center" colspan="6">${sctz_y}</td>
						</tr>
						<tr>
							<td colspan="6">
								<div id="twoDimesional-div-${index}">${typeof(node.twoDimesional)=='undefined'?'':node.twoDimesional}</div>
								<textarea id="twoDimesional-text-${index}" style="display:none" name="collisionsWrapper.collisions[${index}].twoDimesional"></textarea>
							</td>
						</tr>
						<tr>
							<td  class="bca colorWhite" colspan="6" style="text-indent: 3.7%;">${xgfh_y}</td>
						</tr>
						<tr>
							<td class="center">${sjtxgyj_y}</td>
							<td colspan="5">
								<textarea disabled="disabled" class="tableTextarea second secondStageTextarea fourthStageTextarea" name="collisionsWrapper.collisions[${index}].sjtxgyj" style="overflow-y:hidden;" onpropertychange="this.style.height=this.scrollHeight + 'px'" oninput="this.style.height=this.scrollHeight + 'px'">${sjtxgyj}</textarea>
							</td>
						</tr>
						<tr>
							<td class="center">${mxyzyj_y}</td>
							<td colspan="5">
								<textarea disabled="disabled" class="tableTextarea third thirdStageTextarea fourthStageTextarea" name="collisionsWrapper.collisions[${index}].mxyzyj" style="overflow-y:hidden;" onpropertychange="this.style.height=this.scrollHeight + 'px'" oninput="this.style.height=this.scrollHeight+ 'px'">${mxyzyj}</textarea>
							</td>
						</tr>
					</table>
				`;
			})
			$(".m-initating-content").html(html);
			// 初始化textarea
			initTextarea(nodes,detail.createBy);
			$(".m-initating-process").show();
		},
		analysisStr : function(_vp){
			// 解析视点信息
			return _vp.split("@#@");
		},
		/**
		 * 初始化底部按钮
		 */
		initFooterButtonTable : function(){
			var footerButtonHtml = '<div id="initatingControls">'	+
										'<input class="saveInitating" type="button" value="'+bdip4dLang[langType]["-16033"]  +'">'	+										'<input class="submitInitating" type="button" value="'+bdip4dLang[langType]["31582"]  +'">'	+										'<input type="button" class="returnBtn '+ gloubleVariable._isReturn +'" value="'+bdip4dLang[langType]["15408"]  +'" onclick="checkReturn()">'	+									'</div>';
			$("#collisionForm div.footer-button").html(footerButtonHtml);
		},
		/**
		 * 初始化分享人的分流器
		 */
		loadShareShunt : function(_detail){
			if(_detail == '' && gloubleVariable.status == '0'){
				// 直接加载列表
				workflowCollision.loadShareList("");
			}else if(_detail != ''){
				if(workflowCollision.currentListName == 'unHandle' && gloubleVariable.status == '0'){
					// 加载列表做数据回显
					workflowCollision.loadShareList(_detail);
				}else{
					// 数据回显
					workflowCollision.loadShareEcho(_detail);
				}
			}
		},
		/**
		 * 初始化分享人列表
		 */
		loadShareList : function(_detail){
			var projectId = BimBdip.modelObject.project;
			// 查询模型分享人
			var url = publicJS.tomcat_url + '/hrm/selectUsersByProjectId.action';
			//var data = {'projectId':projectId};
			var data = new FormData();
			data.append("projectId",projectId);
			$.ajax({
				url : url,
				type : 'POST',
				data : data,
				dataType : 'json',
				processData:false,
				contentType:false,
				success : function(data){
					if(data.code == '200'){
						// 插入option
						var receiveSelect = $("#collisionForm").find("select[name='bimWorkflowDetail.receiveBy']");
						var ccSelect = $("#collisionForm").find("select[name='ccBy']");
						var html = "";
						data.data.forEach((elem,index)=>{
							// 修复接收人 抄送人接受为null 错误
							var currentUserId = BimBdip.currentUserid;
							if(elem != null && currentUserId != elem.id){
								html += '<option value="'+elem.id+'">'+elem.lastname+'</option>';
							}
						});
						// 把创建人添加到分享人列表中
						receiveSelect.append(html);
						ccSelect.append(html);
						var options = {
					      input: '<input type="text" maxLength="20" placeholder="'+bdip4dLang[langType]["-16035"]  +'">',					      choice: function() {
					        console.log(arguments, workflowCollision);
					      }
					    }
						if(_detail != ''){
							// 做接收人数据回显
							var receiveId = _detail.receiveBy;
							if(receiveId!=''){
								$('.dropdown-sin-1').find('option[value="'+receiveId+'"]').attr("selected",true);
							}
							
							// 做抄送人数据回显
							var ccIds = _detail.ccBys;
							//_detail.ccNames;
							if(ccIds != ''&& ccIds != null && typeof(ccIds) != 'undefiend'){
								var idsArr = ccIds.substring(2,ccIds.length-2).split("||");
								for(var i=idsArr.length-1 ; i>=0 ; i--){
									var optionElem = $('.dropdown-sin-2').find('option[value="'+idsArr[i].trim()+'"]')[0];
									optionElem.selected = true;
								}
							}
						}
						$('.dropdown-sin-1').dropdown(options);
						$('.dropdown-sin-2').dropdown(options);
					}else{
						Dialog.alert(bdip4dLang[langType]["-16036"]  ,function(){							workflowCollision.clearTable();
						});
						return;
					}
				},
				error : function(error){
					Dialog.alert(bdip4dLang[langType]["-16037"]  );				}
			})
		},
		/**
		 * 分享人数据回显
		 */
		loadShareEcho : function(_detail){
			var receiveOption = '<option value="'+_detail.receiveBy+'" selected="selected">'+_detail.receiveName+'</option>';
			var ccBys = _detail.ccBys;
			var ccNames = _detail.ccNames;
			var ccOption = "";
			if(typeof(ccBys) != 'undefined' && ccBys != '' &&
				typeof(ccNames) != 'undefined' && ccNames != ''){
				var ccByArray = ccBys.substring(2,ccBys.length-2).split("||");
				var ccNameArray = ccNames.substring(2,ccNames.length-2).split("||");
				// 循环生成option
				for (var i = ccByArray.length-1; i >=0; i--) {
					ccOption += '<option value="'+ccByArray[i]+'" selected>'+ccNameArray[i]+'</option>';
				}
			}
			
			$('.dropdown-sin-1').find("select[name='bimWorkflowDetail.receiveBy']").html(receiveOption);
			$('.dropdown-sin-2').find("select[name='ccBy']").html(ccOption);
			var options = {
		      input: '<input type="text" maxLength="20" placeholder="'+bdip4dLang[langType]["-16035"]  +'">',		      choice: function() {
		        console.log(arguments, workflowCollision);
		      }
		    }
			try{
				$('.dropdown-sin-1').dropdown(options);
				$('.dropdown-sin-2').dropdown(options);
				// 修改为只读
				changeDropDownReadOnly('dropdown-sin-1',true);
				changeDropDownReadOnly('dropdown-sin-2',true);
			}catch (e) {
				
			}
		},
		/**
		 * 初始化流程第1个节点色区
		 */
		loadFirstColorZone : function(){
			// 第一个节点
			gloubleVariable._launch = 	"_btnOrange";
			gloubleVariable._reply =	"_btnGreen";
			gloubleVariable._confirm =	"_btnGreen";
			gloubleVariable._closed =	"_btnGreen";
			gloubleVariable._isReturn =  "";
		},
		/**
		 * 初始化流程第2个节点色区
		 */
		loadSecondColorZone : function(){
			// 第二个节点
			gloubleVariable._launch = 	"_btnBlue";
			gloubleVariable._reply =	"_btnOrange";
			gloubleVariable._confirm =	"_btnGreen";
			gloubleVariable._closed =	"_btnGreen";
			gloubleVariable._isReturn =  "_show";
		},
		/**
		 * 初始化流程第3个节点色区
		 */
		loadThirdColorZone : function(){
			// 第三个节点
			gloubleVariable._launch = 	"_btnBlue";
			gloubleVariable._reply =	"_btnBlue";
			gloubleVariable._confirm =	"_btnOrange";
			gloubleVariable._closed =	"_btnGreen";
			gloubleVariable._isReturn =  "";
			
		},
		/**
		 * 初始化流程第4个节点色区
		 */
		loadFourthColorZone : function(){
			// 第四个节点
			gloubleVariable._launch = 	"_btnBlue";
			gloubleVariable._reply =	"_btnBlue";
			gloubleVariable._confirm =	"_btnBlue";
			gloubleVariable._closed =	"_btnOrange";
			gloubleVariable._isReturn =  "";
		},
		/**
		 * 解除第一个节点要锁的东西
		 */
		firstStage : function(){
			$(".firstStageInput").each(function(){
				$(this).removeAttr("readonly");
			})
			$(".firstStageTextarea").each(function(){
				$(this).removeAttr("disabled");
			})
			$(".firstStageSelect").each(function(){
				$(this).removeAttr("disabled");
			})
			$(".firstStageA").each(function(){
				$(this).css("display","block");
			})
		},
		/**
		 * 解除第二个节点要锁的东西
		 */
		secondStage : function(){
			$(".secondStageTextarea").each(function(){
				$(this).removeAttr("disabled");
			})
		},
		/**
		 * 解除第三个节点要锁的东西
		 */
		thirdStage : function(){
			$(".thirdStageTextarea").each(function(){
				$(this).removeAttr("disabled");
			})
		},
		/**
		 * 解除第四个节点要锁的东西
		 */
		fourthStage : function(){
			
		},
		/**
		 * 锁定所有可编辑元素
		 */
		lockAllEditor : function(){
			// 由于第一个节点、第二个节点、第三个节点默认为锁定状态，所以在这里只需要在锁定接收人、抄送人 就可以了
			changeDropDownReadOnly('dropdown-sin-1',true); // 锁定接收人
			changeDropDownReadOnly('dropdown-sin-2',true); // 锁定抄送人
		},
		/**
		 * 删除底部所有按钮
		 */
		cleanAllButton : function(){
			$("#collisionForm div.footer-button").empty();
		},
		/**
		 * 对ajax做简单封装 调用-> workflowCollision.sendAjax(url,data,function(){....})
		 */
		sendAjax : function(url,data,callback){
			$.ajax({
				url : url,
				type : 'POST',
				data : data,
				dataType : 'json',
				processData: false,
			    contentType: false,
				success : function(data){
					callback(data)
				},
				error : function(error){
					alert("error" + error);
				}
			})
		},
		/**
		 * 第一阶段的提交或保存
		 */
		draft : function(isSubmit){
			// 校验
			// 项目名称
			var xmmc = $("input[name='bimWorkflowDetail.xmmc']").val().trim();
			if(typeof(xmmc) == 'undefined' || xmmc == ''){
				alert(bdip4dLang[langType]["-16038"]  );				return ;
			}
			// 接收人
			var selectedValue = $("select[name='bimWorkflowDetail.receiveBy'] option:selected").val().trim();
			if(typeof(selectedValue) == 'undefined' || selectedValue == ''){
				alert(bdip4dLang[langType]["-16039"]  );				return ;
			}
			
			var url = publicJS.tomcat_url + '/workflow/saveOrSubmit.action';
			//$("#collisionForm").find("#sjtxgyjTextarea").removeAttr("disabled");
			/*var data = $('#collisionForm').serialize();
			var isSubmitParam = '&isSubmit='+isSubmit;
			var modelId = '&modelId='+BimBdip.lvmid;
			data += isSubmitParam;
			data += modelId;*/
			var data = new FormData($('#collisionForm')[0]);
			data.append("isSubmit",isSubmit);
			data.append("modelId",BimBdip.lvmid);
			data.append("bimWorkflowDetail.xmmc",xmmc);
			data.append("prjId",BimBdip.modelObject.project);
			var str = "";
			// 起草保存、起草提交
			if(isSubmit == '1'){
				str = bdip4dLang[langType]["-16034"]  ;				// 判断表单提交是否完成,只要存在空的选项就抛异常,给用户提醒
				try{
					$('#collisionForm').find('table').each(function(){
						$(this).find('.first').each(function(){
							var value = '';
							if($(this).is('input')){
								  //console.log('input')
								  if($(this).val() == ''){
								  	throw "————————";
								  }
							}else if($(this).is('textarea')){
								  //console.log('textarea')
								  if($(this).val() == ''){
								  	throw "————————";
								  }
							}else if($(this).is('select')){
								  //console.log('select')
								  if($(this).children('option:selected').val() == ''){
								  	throw "————————";
								  }
							}else{
								  //console.log('default')
								  if($(this).val() == ''){
								  	throw "————————";
								  }
							}
						}) // start $(this).find('.first').each(function(){
					}) // start $('#collisionForm').find('table').each(function(){
					
					$('.w-e-text').each(function(){
						 if($(this).html() == '<p><br></p>'){
							 throw "————————";
						 }
					})
					
					workflowCollision.sendAjax(url,data,function(callback_data){
						if(callback_data.code == '200'){
							layer.msg(str+bdip4dLang[langType]["-16040"]  ,{icon:1,time:1000});							/*alert(str+"成功");*/
							//console.log(callback_data);
							workflowCollision.currentListName = "handle";
							workflowCollision.reloadList();
						}else{
							layer.msg(str+bdip4dLang[langType]["-16041"]  ,{icon:2,time:1000});							/*alert(str+"失败,请重试");*/
						}
						// 关闭流程表单
						clearTable();
					});
				}catch(err){
					// 有部分没有提交
					Dialog.confirm(bdip4dLang[langType]["-16042"]  ,function(){						workflowCollision.sendAjax(url,data,function(callback_data){
							if(callback_data.code == '200'){
								layer.msg(str+bdip4dLang[langType]["-16040"]  ,{icon:1,time:1000});								/*alert(str+"成功");*/
								//console.log(callback_data);
								workflowCollision.currentListName = "handle";
								workflowCollision.reloadList();
							}else{
								layer.msg(str+bdip4dLang[langType]["-16041"]  ,{icon:2,time:1000});								/*alert(str+"失败,请重试");*/
							}
							// 关闭流程表单
							clearTable();
						});
					})
				}
			}else{
				str = bdip4dLang[langType]["-16033"]  ;				workflowCollision.sendAjax(url,data,function(callback_data){
					if(callback_data.code == '200'){
						layer.msg(str+bdip4dLang[langType]["-16040"]  ,{icon:1,time:1000});						/*alert(str+"成功");*/
						//console.log(callback_data);
						workflowCollision.reloadList();
					}else{
						layer.msg(str+bdip4dLang[langType]["-16041"]  	,{icon:2,time:1000});						/*alert(str+"失败,请重试");*/
					}
					// 关闭流程表单
					clearTable();
				});
			}
			
		},
		/**
		 * 第二阶段的提交或保存
		 */
		check : function(isSubmit){
			// 签批保存、签批提交
			var url = publicJS.tomcat_url + '/workflow/check.action';
			/*var data = $('#collisionForm').serialize();
			var isSubmitParam = '&isSubmit='+isSubmit;
			data += isSubmitParam;*/
			var data = new FormData($('#collisionForm')[0]);
			data.append("isSubmit",isSubmit);
			data.append("prjId",BimBdip.modelObject.project);
			var str = "";
			if(isSubmit == '1'){
				str = bdip4dLang[langType]["-16034"]  ;				// 判断表单提交是否完成
				try{
					$('#collisionForm').find('table').each(function(){
						if($(this).find('.second').val() == ''){
							throw "————————";
						}
					})
					workflowCollision.sendAjax(url,data,function(callback_data){
						if(callback_data.code == '200'){
							layer.msg(str+bdip4dLang[langType]["-16040"]  ,{icon:1,time:1000});							/*alert(str+"成功");*/
							workflowCollision.reloadList();
						}else{
							layer.msg(str+bdip4dLang[langType]["-16041"]  ,{icon:2,time:1000});							/*alert(str+"失败,请重试");*/
						}
						// 关闭流程表单
						clearTable();
					})
				}catch(err){
					Dialog.confirm(bdip4dLang[langType]["-16043"]  ,function(){						workflowCollision.sendAjax(url,data,function(callback_data){
							if(callback_data.code == '200'){
								layer.msg(str+bdip4dLang[langType]["-16040"]  ,{icon:1,time:1000});								/*alert(str+"成功");*/
								workflowCollision.reloadList();
							}else{
								layer.msg(str+bdip4dLang[langType]["-16041"]  ,{icon:2,time:1000});								/*alert(str+"失败,请重试");*/
							}
							// 关闭流程表单
							clearTable();
						})
					})
				}
			}else{
				str = bdip4dLang[langType]["-16033"]  ;				// 发送ajax请求
				workflowCollision.sendAjax(url,data,function(callback_data){
					if(callback_data.code == '200'){
						layer.msg(str+bdip4dLang[langType]["-16040"]  ,{icon:1,time:1000});						/*alert(str+"成功");*/
						workflowCollision.reloadList();
					}else{
						layer.msg(str+bdip4dLang[langType]["-16041"]  ,{icon:2,time:1000});						/*alert(str+"失败,请重试");*/
					}
					// 关闭流程表单
					clearTable();
				})
			}
			
			
		},
		/**
		 * 第二阶段的回退
		 */
		checkReturn : function(){
			// //签批回退
			var url = publicJS.tomcat_url + '/workflow/checkReturn.action';
			//var data = $('#collisionForm').serialize();
			var data = new FormData($('#collisionForm')[0]);
			data.append("prjId",BimBdip.modelObject.project);
			$.ajax({
				url : url,
				type : 'POST',
				data : data,
				dataType : 'json',
				processData: false,
			    contentType: false,
				success : function(data){
					if(data.code == '200'){
						alert(bdip4dLang[langType]["-16044"]  );						workflowCollision.reloadList();
					}
					// 关闭流程表单
					clearTable();
				},
				error : function(a,b,c){
					alert("error" + a +":"+b+":"+c);
				}
			})
		},
		/**
		 * 第三阶段的保存或提交
		 */
		confirm : function(isSubmit){
			// 确认归档保存、签批提交
			var url = publicJS.tomcat_url + '/workflow/confirm.action';
			/*var data = $('#collisionForm').serialize();
			var isSubmitParam = '&isSubmit='+isSubmit;
			data += isSubmitParam;*/
			var data = new FormData($('#collisionForm')[0]);
			data.append("isSubmit",isSubmit);
			data.append("prjId",BimBdip.modelObject.project);
			var str = '';
			if(isSubmit == '1'){
				str = bdip4dLang[langType]["-16034"]  ;					try{
						$('#collisionForm').find('table').each(function(){
							if($(this).find('.third').val() == ''){
								throw "————————";
							}
						})
						workflowCollision.sendAjax(url,data,function(callback_data){
							if(callback_data.code == '200'){
								layer.msg(str+bdip4dLang[langType]["-16040"]  ,{icon:1,time:1000});								/*alert(str+"成功");*/
								workflowCollision.reloadList();
							}else{
								layer.msg(str+bdip4dLang[langType]["-16041"]  ,{icon:2,time:1000});								/*alert(str+"失败,请重试");*/
							}
							// 关闭流程表单
							clearTable();
						})
					}catch(err){
						Dialog.confirm(bdip4dLang[langType]["-16043"]  ,function(){							workflowCollision.sendAjax(url,data,function(callback_data){
								if(callback_data.code == '200'){
									layer.msg(str+bdip4dLang[langType]["-16040"]  ,{icon:1,time:1000});									/*alert(str+"成功");*/
									workflowCollision.reloadList();
								}else{
									layer.msg(str+bdip4dLang[langType]["-16041"]  ,{icon:2,time:1000});									/*alert(str+"失败,请重试");*/
								}
								// 关闭流程表单
								clearTable();
							})
						})
					}
			}else{
				str = bdip4dLang[langType]["-16033"]  ;				workflowCollision.sendAjax(url,data,function(callback_data){
					if(callback_data.code == '200'){
						layer.msg(str+bdip4dLang[langType]["-16040"]  ,{icon:1,time:1000});						/*alert(str+"成功");*/
						workflowCollision.reloadList();
					}else{
						layer.msg(str+bdip4dLang[langType]["-16041"]  ,{icon:2,time:1000});						/*alert(str+"失败,请重试");*/
					}
					// 关闭流程表单
					clearTable();
				})
			}
		},
		/**
		 * 上传2D图纸的方法(wangEditor编辑器点击上传图片后需要走的方法)
		 */
		uploadTwoDimesionalImgage : function(){
			var url = publicJS.tomcat_url + '/workflow/uploadTwoDimesionalImgage.action';
			var data = $('#collisionForm').serializeArray();
			var isSubmitParam = {name:'isSubmit',value:isSubmit};
			var modelId = {name:'modelId',value:BimBdip.lvmid};
			data.push(isSubmitParam);
			data.push(modelId);
			// 发送ajax请求
			jQuery.ajaxFileUpload({ 
				url : url, // 用于文件上传的服务器端请求地址
				secureuri : false, // 是否需要安全协议，一般设置为false
				fileElementId : $("#file1").attr("id"), // 文件上传域的ID
				dataType : 'json', // 返回值类型 一般设置为json
				success: function (data, status)  // 服务器成功响应处理函数
		            {
					 // 这里是成功后返回的数据,可以返回保存服务器的多张图片的url，然后展示到页面上
						console.log(data);
						console.log(status);
						alert(bdip4dLang[langType]["-16040"]  );		            },
		            error: function (data, status, e)// 服务器响应失败处理函数
		            {
		            	console.log(data);
		            	console.log(status);
		            	console.log(e);
		                alert(e);
		                alert(bdip4dLang[langType]["-16041"]  );		            }
				});
		},
		/**
		 * 导出word需要走的方法
		 */
		exportWord : function(){
			
			// 获取当前流程id
			var workflowId = $('input[name="bimWorkflowDetail.id"]').val();
			if(typeof(workflowId) == 'undefined' || workflowId == ''){
				layer.msg(bdip4dLang[langType]["-16045"]  ,{icon:7,time:1500});				/*alert('空的流程不能导出');*/
				return;
			}
			var url = publicJS.tomcat_url + '/workflow/exportCollision.action?workflowId=' + workflowId;
			/*var data = {
					'workflowId' : workflowId
			}*/
			var form_html = '<form action="'+url+'" enctype="multipart/form-data" method="post" style="display:none"></form>';
			$('.m-initating-process').append(form_html);
			$('.m-initating-process form')[1].submit();
			/*$.ajax({
				url : url,
				type : 'POST',
				data : data,
				dataType : 'json',
				success : function(data){
					if(data.code == '200'){
						alert('导出成功!!!');
					}
				},
				error : function(error){
					console.log(error);
				}
			})*/
		},
		/**
		 * 定位视点加载涂鸦
		 */
		fousPoint : function(_event){
			var elem = _event.target.nodeName == "IMG"?_event.target.nextElementSibling:_event.target.parentElement;
			var json = elem.getAttribute("_json");
			var markup = elem.getAttribute("_mark");
			// 初始化
			if(workflowCollision.markupObj == null || workflowCollision.markupObj == ''){
				var extension = BimBdip.view.getExtension('Autodesk.Viewing.MarkupsCore');
				if(extension == null){
					BimBdip.view.loadExtension('Autodesk.Viewing.MarkupsCore');
				}
				var config = {markupDisableHotkeys:false};
				workflowCollision.markupObj = new Autodesk.Viewing.Extensions.Markups.Core.MarkupsCore(BimBdip.view,config);
				workflowCollision.markupObj.load();
			}
			// 邢星视点
			if(bimViewPointNew.markup != null && bimViewPointNew.markup.duringEditMode){
				bimViewPointNew.enterViewMode();
			}
			// 退出编辑模式
			if(workflowCollision.markupObj.duringEditMode){
				workflowCollision.markupObj.leaveEditMode();
				workflowCollision.markupObj.hide();
			}
			//bimViewPointNew.markup = markup;
			if(json != ''){
				json = json.replace(/'/g,'"');
				var jsonObject = JSON.parse(json);
				BimBdip.view.restoreState(jsonObject);
				if(markup!=''){
					setTimeout(function(){
						//bimViewPointNew.enterEditMode();
						workflowCollision.markupObj.show();
						workflowCollision.markupObj.enterEditMode();
						//bimViewPointNew.markup.enterEditMode();
						if(markup && markup.replace(/(^\s*)|(\s*$)/g, "").length>0){
							markupList = markup.split("@#@");
							if(markupList!=null && markupList.length>0){
								//showMask("loading...");
								for(var i=0,l=markupList.length; i<l; i++){
									var singleMarkup = markupList[i].split("@BIM@");
									workflowCollision.markupObj.loadMarkups(
											singleMarkup[1].replace(/'/g,'"'),
											singleMarkup[0]);
								}
								//hideMask();
							}
						}
					},500);
				}
			}else{
				console.log(bdip4dLang[langType]["-16436"]  );			}
			
			$("#viewers").mousedown(function(){
				if(workflowCollision.markupObj != null && workflowCollision.markupObj.duringEditMode){
					workflowCollision.closeMarkUp();
				}
			});
		},
		/**
		 * 解决视点markup冲突(视点功能viewpoint-newedition.js中需要调用)
		 */
		clearCollisionMarkups : function (){
			if(workflowCollision.markupObj != null && workflowCollision.markupObj.duringEditMode){
				workflowCollision.markupObj.leaveEditMode();
				workflowCollision.markupObj.hide();
			}
		},
		/**
		 * 碰撞报告退出markup的方法
		 */
		closeMarkUp : function(){
			//workflowCollision.markupObj.unloadMarkupsAllLayers();
			workflowCollision.markupObj.leaveEditMode();
			workflowCollision.markupObj.hide();
			BimBdip.view.unloadExtension('Autodesk.Viewing.MarkupsCore');	
			workflowCollision.markupObj = null;
		},
		/**
		 * 关闭碰撞流程框表单
		 */
		clearTable : function(){// 关闭发起框
			$('.m-initating-process').hide();
			$('.m-initating-process').empty();
			if(workflowCollision.markupObj != null && workflowCollision.markupObj.duringEditMode){
				workflowCollision.closeMarkUp();
			}
		},
		/**
		 * 生成列表主入口（dataTable）
		 */
		generatingList : function(data){// 生成对应表格
			/*
			 * $('#m-backlog-process').html( '<table cellpadding="0"
			 * cellspacing="0" border="0" class="display" id="backlogTable"></table>' );
			 */
			// 生成title和table元素
			/* debugger; */
			var collisionInitTableHtml = '<div class="m-initating-title hei30 br34">' +
											  '<span>'+bdip4dLang[langType]["-16046"]  +'</span>' +											  '<input class="closeBtn closeInitating floright" onclick="clearList()" type="button" value="×">' +
											 /* '<hr>' + */
									  	  '</div>' +
									  	  '<div id="m-backlog-title" class="m-backlog-title">' + 
										  	  '<span><a href="#" onclick="workflowCollision.loadHandleList()">'+bdip4dLang[langType]["-16047"]  +'</a></span>' + 										  	  '<span><a href="#" onclick="workflowCollision.loadUnHandleList();">'+bdip4dLang[langType]["-16048"]  +'</a></span>' +										  	  '<span><a href="#" onclick="workflowCollision.loadCcList()">'+bdip4dLang[langType]["-16049"]  +'</a></span>' + 									  	  '</div>' +
										  '<div class="handle-children-title" style="display:none">' + 
										  	  '<span class="bihuan_span"><a href="#" onclick="workflowCollision.loadHandleList(3)">'+bdip4dLang[langType]["-16050"]  +'</a></span>' + 										  	  '<span class="weibihuan_span"><a href="#" onclick="workflowCollision.loadHandleList(0)">'+bdip4dLang[langType]["-16051"]  +'</a></span>' +									  	  '</div>' +
										  '<div class="m-collision-table">' +
									  	  	  '<table id="backlogTable" class="table table-striped table-bordered" cellspacing="0" width="100%">' +
									                '<thead>' +
									                   '<tr>' +
									                       '<th style="background-image:none" class="text_none reme"><a name="deleteCollisionAElement" class="delete-collision-buton" href="#" _method="'+workflowCollision.currentListNamemethod+'" onclick="workflowCollision.deleteWorkflowByIds(event)">'+bdip4dLang[langType]["-15046"]  +'</a></th>' +									                       '<th>'+bdip4dLang[langType]["-16053"]  +'</th>' +									                       '<th>'+bdip4dLang[langType]["-16054"]  +'</th>' +									                       '<th>'+bdip4dLang[langType]["-16055"]  +'</th>' +									                       '<th>'+bdip4dLang[langType]["-16056"]  +'</th>' +									                   '</tr>'+
									               '</thead>' +
									           '</table>' +
									      '</div>';
			  $('.m-backlog-process').html(collisionInitTableHtml);
			  
			  $('#backlogTable').dataTable( {
			        "data": data,
			        "aLengthMenu" : [14],
		        	bAutoWidth: true, 
			        /*destroy: false,*/
			        'oLanguage': {                       // 中文化
                        "sSearch": bdip4dLang[langType]["-16057"]   + ":",                        "sInfo": bdip4dLang[langType]["-16438"]   + "_" + bdip4dLang[langType]["-16440"]   + "_TOTAL_" + bdip4dLang[langType]["-16441"]  ,                    "sZeroRecords": bdip4dLang[langType]["-16059"]  ,                        "sLengthMenu": bdip4dLang[langType]["-16442"]   + " _MENU_" + bdip4dLang[langType]["-16443"]  ,                      "sInfoEmpty": bdip4dLang[langType]["-16061"]  ,                        "sInfoFiltered": "(" + bdip4dLang[langType]["-16444"]   + "_MAX_" + bdip4dLang[langType]["-16445"]   + ")",                      'oPaginate': {
                            'sNext': bdip4dLang[langType]["-16063"]  ,                            'sLast': bdip4dLang[langType]["-16064"]  ,                            'sFirst': bdip4dLang[langType]["-16065"]  ,                            'sPrevious': bdip4dLang[langType]["-16066"]                          },
			        },
			        "columns": [
			           {
			              data: "id",
			              "orderable":false,
			              "defaultContent":"",
			              "class":"textInd width_w",
			              "render":function(data,type,row,meta){
			            	  // 判断当前流程是否为本人创建
			            	  	var userId = BimBdip.currentUserid;
			            	  /*	if(workflowCollision.currentListName =='cc' ){
				            		  $('.reme').remove();
				            		  return;
				            	  }*/
		      					if(userId == row.createBy){
		      						return data = '<input type="checkbox" name="workflowId" _createBy="'+row.createBy+'" value = "'+ data +'">';
		    					}else{
		    						return data = '';
		    					}
			              	}
			            },
			            
			            { 
			              data: "title",
			            /*  "title":"标题",*/
			              defaultContent:"",
			              "class":"font_12",
			              "render":function(data,type,row,meta){
			            	  // 0 未读 1 已读
			            	  var isRead = row.exField4;
			            	  if(workflowCollision.currentListName == 'cc'){
			            		  isRead = row.ccRead;
			            	  }
			            	  if(isRead == '0'){
			            		  return data = '<span class="text_span" title=" '+data+' ">'+data+'</span>&nbsp;&nbsp;<span _data="'+data+'" class="collision-isreadfield"></span>';
			            	  }else{
			            		  return data = '<span class="text_span" title=" '+data+' ">'+data+'</span>';
			            		  
			            	  }
			              	}
			            },
			            {
			              data: "createName",
			              "class":"font_12",
			              /* "title":"创建人", */
			              defaultContent:""
			            },
			            {
			              data: "receiveName",
			              "class":"font_12",
			            /* "title":"接收人", */
			              defaultContent:"",
			              "render":function(data,type,row,meta){
			            	  return data = '<span class="text_span width_66" title=" '+data+' ">'+data+'</span>';
			              }
			            },
			            { 
			              data: "createTime",
			              "class":"date_text",
			              /* "title":"创建时间", */			            						 
			              defaultContent:"",
			              "render":function(data,type,row,meta){
			            	  return (new Date(data)).Format("yyyy-MM-dd hh:mm:ss");
			              }
			            },
			        ]
			    } );
			  $('#m-backlog-process').show();
			  // 给表绑定click事件
			  workflowCollision.bindListClickEvent();
			  
			  // 给表中的单选框绑定事件
			  $('#backlogTable').DataTable().on( 'click','tr td:nth-child(1)',function () {
				  if($(this).find("input")[0].checked){
					  // 选中
					  $("#backlogTable").find("a[name='deleteCollisionAElement']").css('display','block');
				  }else{
					  // 如果该节点未被选中,判断是否还存在被选中的checkbox
					  if( $("#m-backlog-process").find("#backlogTable").find("input:checked").length == 0){
						  $("#backlogTable").find("a[name='deleteCollisionAElement']").css('display','none');
					  }
				  }
			  });
		},
		/**
		 * 加载已处理列表
		 */
		loadHandleList : function(_status){// 读取当前用户已处理列表
			workflowCollision.currentListName = "handle";
			//this.init();
			var currentUserId = BimBdip.currentUserid;
			var message;
			var url = publicJS.tomcat_url + '/workflow/handle.action';
			var modelId = BimBdip.lvmid;
			/*var data = '';
			if(typeof(_status) != 'undefined'){
				data = {
						'currentUserId':currentUserId,
						'modelId' : modelId,
						'status' : _status
					};
			}else{
				data = {
						'currentUserId':currentUserId,
						'modelId' : modelId
					};
			}*/
			var data = new FormData();
			data.append("currentUserId",currentUserId);
			data.append("modelId",modelId);
			if(typeof(_status) != 'undefined'){
				data.append("status",_status);
			}
			message = workflowCollision.getTableMessage(url,data);
			workflowCollision.generatingList(message,'handle');
			workflowCollision.showHandleChildrenTitle();
			workflowCollision.changeColorStyle($("#m-backlog-title").find("span:eq(0)"));
			if(3==_status){
				
				$(".handle-children-title").find("span:eq(0)").addClass('active');
			}else if(0==_status){
				$(".handle-children-title").find("span:eq(1)").addClass('active');
				
			};
			
			//处理多出来的已闭环未闭环高度
			var collisionHeight = $('.m-collision-table').height();
			var moreHeight = $('.handle-children-title').height();
			$('.m-collision-table #backlogTable_wrapper').css('height',collisionHeight -moreHeight +'px')
			 
		},
		/**
		 * 加载未处理列表
		 */
		loadUnHandleList : function(){// 未已处理列表
			workflowCollision.currentListName = "unHandle";
			var currentUserId = BimBdip.currentUserid;
			var message;
			var url = publicJS.tomcat_url + '/workflow/unHandle.action';
			var modelId = BimBdip.lvmid;
			var data = new FormData();
			data.append("currentUserId",currentUserId);
			data.append("modelId",modelId);
			message = workflowCollision.getTableMessage(url,data);
			workflowCollision.generatingList(message,'unHandle');
			workflowCollision.hideHandleChildrenTitle();
			workflowCollision.changeColorStyle($("#m-backlog-title").find("span:eq(1)"));		
		 
		},
		/**
		 * 加载抄送人列表
		 */
		loadCcList : function(){
			workflowCollision.currentListName = "cc";
			var currentUserId = BimBdip.currentUserid;
			var modelId = BimBdip.lvmid;
			var message;
			var url = publicJS.tomcat_url + '/workflow/getCcJson.action';
			var data = new FormData();
			data.append("currentUserId",currentUserId);
			data.append("modelId",modelId);
			/*var data = {
					'currentUserId':currentUserId,
					'modelId' : modelId
			};*/
			message = workflowCollision.getTableMessage(url,data);
			workflowCollision.generatingList(message);
			workflowCollision.hideHandleChildrenTitle();
			workflowCollision.changeColorStyle($("#m-backlog-title").find("span:eq(2)"));
			 
		},
		/**
		 * 根据Url和参数 获取所需要展示的信息(未处理、未处理、抄送人 公用的方法)
		 */
		getTableMessage : function(url,data){
			var message = '';
			$.ajax({
				url:url,
				type:'POST',
				data:data,
				dataType:'json',
				async:false,
				processData: false,
				contentType: false,
				success:function(data){
					message = data.data;
				},
				error:function(data){
					
				}
			})
			return message;
		},
		/**
		 * dataTable reload方法
		 */
		reloadList : function(){
			switch (workflowCollision.currentListName) {
			case "cc":
				workflowCollision.loadCcList();
				break;
			case "handle":
				workflowCollision.loadHandleList();
				break;
			case "unHandle":
				workflowCollision.loadUnHandleList();
				break;
			default:
				workflowCollision.loadUnHandleList();
				break;
			}
		},
		/**
		 * 删除工作流的方法
		 */
		deleteWorkflowByIds : function(_event){
			var arr = "";
			// 根据ids删除流程
			var checkedArr = $('#m-backlog-process').find('input[name="workflowId"]:checked');
			checkedArr.each(function(index){
				index = index + 1;
				if(index != checkedArr.length){
					// 最后一个
					arr = arr + $(this).val() + ",";
				}else{
					arr =  arr + $(this).val();
				}
			});
			//console.log("需要删除的流程id为:"+arr)
			if(arr == ""){
				alert("请勾选需要删除的流程");
				return ;
			}
			Dialog.confirm(bdip4dLang[langType]["-16067"]  ,function(){				//var _method = _event.target.attributes._method.value;
				var url = publicJS.tomcat_url + '/workflow/deleteWorkflowDetailByIdsList.action';
				/*var data = {
						'idsList' : arr
				};*/
				var data = new FormData();
				data.append("idsList",arr);
				$.ajax({
					url : url,
					type : 'POST',
					data : data,
					dataType : 'json',
					processData:false,
					contentType:false,
					success : function(data){
						if(data.code == '200'){
							// 刷新列表
							if(workflowCollision.currentListName == 'handle'){
								workflowCollision.loadHandleList();
							}else if(workflowCollision.currentListName == 'unHandle'){
								workflowCollision.loadUnHandleList();
							}else if(workflowCollision.currentListName == 'cc'){
								workflowCollision.loadCcList();
							}
						}
					},
					error : function(error){
						console.log(error);
					}
				})
			})
		},
		/**
		 * (未处理、未处理、抄送人button改变颜色的方法)
		 */
		changeColorStyle:function(jquery_element){
			jquery_element.css("background","#22a7f0");
			jquery_element.find("a").css("color","#fff");			
		},
		
		/**
		 * 给dataTable列表的标题列绑定click事件
		 */
		bindListClickEvent : function(){
		  $('#backlogTable').DataTable().on( 'click','tr td:nth-child(2)',function () {
				var selectNodeId = $("#backlogTable").DataTable().row(this).data().id;
				//console.log("selectNodeId:"+selectNodeId);
				// selectNodeId = '1516266610263638321';
				// 发送ajax,查询相关信息
				if(typeof(selectNodeId) == 'undefined' || selectNodeId == ''){
					alert(bdip4dLang[langType]["-16068"]  );				}
				var url = publicJS.tomcat_url + '/workflow/getDetailAndCollisionById.action';
				/*var data = {
						'workflowId' : selectNodeId
				};*/
				var data = new FormData();
				data.append('workflowId',selectNodeId);
				var _this = this;
				$.ajax({
					url : url,
					type : 'POST',
					data : data,
					dataType : 'json',
					processData:false,
					contentType:false,
					success : function(data){
						var returnData = data.data;
						if(data.code == '200'){
							// 弹出详情界面
							workflowCollision.main(returnData.bimWorkflowDetail.status,returnData,workflowCollision.currentListName);
							// 移除小红点
							var $redTag = $(_this).children('span:eq(1)');
							if($redTag){
								$redTag.remove();
							}
							// 更新流程为已读
							workflowCollision.updateReadByStatusById(returnData.bimWorkflowDetail);
						}
					},
					error : function(error){
						console.log(error);
					}
				})
			} );
		},
		/**
		 * 修改已读未读字段,点击标题的时候消除红点
		 */
		updateReadByStatusById : function(_detail){
			var status = '';
			if(workflowCollision.currentListName == 'handle'){
				if(gloubleVariable.status == '0'){
					status = (typeof(_detail.status) != 'number'? parseInt(_detail.status) : _detail.status) + 1;			
				}else{
					status = _detail.status - 1;			
				}
			}else{
				status = _detail.status;			
			}
			/*var data = {
					workflowId : _detail.id,
					status : status,
					isRead : '1'
			}*/
			var data = new FormData();
			data.append("workflowId",_detail.id);
			data.append("status",status);
			data.append("isRead",1);
			if(workflowCollision.currentListName == 'cc'){
				data.append("operation","cc");
				data.append("currentUserId",BimBdip.currentUserid);
			}
			var url = publicJS.tomcat_url + '/workflow/updateReadByStatusById.action';
			 // 修改isRead字段
			$.ajax({
				url : url,
				type : 'POST',
				data : data,
				dataType : 'json',
				processData:false,
				contentType:false,
				success : function(data){
				},
				error : function(error){
				}
			})
		},
		/**
		 * 显示已处理列表的标题
		 */
		showHandleChildrenTitle:function(){
			$("#m-backlog-process").find("div.handle-children-title").css('display','block');
		},
		/**
		 * 隐藏已处理列表的标题
		 */
		hideHandleChildrenTitle:function(){
			$("#m-backlog-process").find("div.handle-children-title").css('display','none');
		},
		/**
		 * 关闭碰撞报告列表的方法
		 */
		clearList : function(){// 关闭隐藏列表框
			$('.m-backlog-process').hide();
			$('.m-backlog-process').empty();
		},
		getSendee : function(){
			$('.ui-autocomplete:eq(0)').show();
		},
		getCc : function(){
			$('.ui-autocomplete:eq(1)').show();
		}
}

/**
 * 保存和提交的引流器 根据status判断走哪个后台的saveOrSubmit方法
 * @param status
 * @returns
 */
function bindSaveSubmitShunt(status){
	$("#initatingControls .saveInitating").unbind();
	$("#initatingControls .submitInitating").unbind();
	switch (status){
		case "0":
			$("#initatingControls .saveInitating").click(function(){
				workflowCollision.draft(0);
			})
			$("#initatingControls .submitInitating").click(function(){
				workflowCollision.draft(1);
			})
		break;
		case "1":
			$("#initatingControls .saveInitating").click(function(){
				workflowCollision.check(0);
			})
			$("#initatingControls .submitInitating").click(function(){
				workflowCollision.check(1);
			})
			break;
		case "2":
			$("#initatingControls .saveInitating").click(function(){
				workflowCollision.confirm(0);
			})
			$("#initatingControls .submitInitating").click(function(){
				workflowCollision.confirm(1);
			})
			break;
		case "3":
			$("#initatingControls .saveInitating").click(function(){
				
			})
			$("#initatingControls .submitInitating").click(function(){
				
			})
			break;
	}
		
}

/**
 * 修改dropdown是否可编辑状态 
 * @param className
 * @param boolean true:只读|false:可编辑
 * @returns
 */
function changeDropDownReadOnly(className,boolean){
	var tmp = "."+className;
	var dropDown = $(tmp).data("dropdown");
	if(boolean){
		// 修改为只读
		if(typeof(dropDown) != 'undefined'){
			dropDown.changeStatus('readonly');
		}
	}else{
		// 修改为可编辑
		if(typeof(dropDown) != 'undefined'){
			dropDown.changeStatus();
		}
	}
}

/**
 * 初始化wangEditor用于2D图纸上传框
 * @param nodes
 * @returns
 */
function initTextarea(nodes,createBy){
	var currentUserId = BimBdip.currentUserid;
	var divId = "";
	var textId = "";
	var E = window.wangEditor
	var menu1 = [
	];
	if(gloubleVariable.status == '0' && currentUserId == createBy || typeof(createBy) == 'undefined'){
		menu1 = [
			'head',  // 标题
		    'bold',  // 粗体
		    'italic',  // 斜体
		    'underline',  // 下划线
		    'strikeThrough',  // 删除线
		    'foreColor',  // 文字颜色
		    'backColor',  // 背景颜色
		    'list',  // 列表
		    'justify',  // 对齐方式
		    'emoticon',  // 表情
		    'image',  // 插入图片
		    'undo',  // 撤销
		];
	}
	nodes.forEach((node,index)=>{
		divId = "twoDimesional-div-"+index;
		var editor = new E('#'+divId);
		textId = "twoDimesional-text-"+index;
		var $text = $('#' + textId);
		editor.customConfig.onchange = function (html) {
		// 监控变化，同步更新到 textarea
			$text.val(html)
		}
		editor.customConfig.uploadImgServer = publicJS.tomcat_url + '/workflow/uploadTwoDimesionalImgage.action';
		editor.customConfig.uploadFileName = 'files';
		editor.customConfig.uploadImgTimeout = 20000;
		editor.customConfig.menus = menu1;
		
		editor.customConfig.uploadImgHooks = {
		   before: function (xhr, editor, files) {
			   //showMask("正在上传请耐心等待...");
		        // 图片上传之前触发
		        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
		        
		        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
		        // return {
		        //     prevent: true,
		        //     msg: '放弃上传'
		        // }
		    },
		    success: function (xhr, editor, result) {
		    	//hideMask();
		    	//insertImg(result.data);
		        // 图片上传并返回结果，图片插入成功之后触发
		        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
		    },
		    fail: function (xhr, editor, result) {
		    	//hideMask();
		    	//Dialog.alert("网络原因请重试...");
		        // 图片上传并返回结果，但图片插入错误时触发
		        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
		    },
		    error: function (xhr, editor) {
		    	//hideMask();
		        // 图片上传出错时触发
		        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
		    	//Dialog.alert("网络原因请重试...");
		    },
		    timeout: function (xhr, editor) {
		    	//hideMask();
		    	//Dialog.alert("上传超时图片可能太大了...");
		        // 图片上传超时时触发
		        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
		    },
		    // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
		    // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
		    customInsert: function (insertImg, result, editor) {
		    	//hideMask();
		    	//var url =result.data;
		    	$(result.data).each(function(){
		    		insertImg(this);
		    	});
		        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
		        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

		        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
		        //var urlB = result.url
		        //insertImg(url)
		        // result 必须是一个 JSON 格式字符串！！！否则报错
		    }
		}
		
		editor.create();
		$text.val(editor.txt.html());
		if(gloubleVariable.status == '0' && workflowCollision.currentListName != 'handle' && workflowCollision.currentListName != 'cc'){
			 editor.$textElem.attr('contenteditable', true);
		}else{
			 editor.$textElem.attr('contenteditable', false);
		}
		var selector = '.w-e-text:eq('+index+')';
		// 为每个节点框添加粘贴事件,依赖paste.js
		copyBindEvent($(selector)[0]);
	})
}
/**
 * 绑定粘贴事件
 * @param _target需要绑定粘贴事件的js对象 
 * @returns
 */
function copyBindEvent(_target){
	_target.addEventListener('paste', function (event) {
		workflowCollision.operateEditorTarget = _target;
		// 获取浏览器类型
        var broswerType = GetBrowserType();
        if (broswerType == "Chrome") {

            var clipboard = event.clipboardData;
            var blob = null;
            for (var i = 0; i < event.clipboardData.items.length; i++) {
                if (clipboard.items[i].type.indexOf("image") != -1) {
                    blob = clipboard.items[i].getAsFile();
                    //转成base64编码，获取一个图片
                    var reader = new window.FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = function () {
                        // 压缩图片
                        discussCompress(reader.result);
                    }
                }
                else if (clipboard.items[i].type.indexOf("html") != -1) {
                    var html = $(event.clipboardData.getData("text/html"));
                    html.find("img").each(function () {
                        var canvas = document.createElement("canvas");
                        var context = canvas.getContext("2d");
                        var img = document.createElement("img");
                        var src = $(this).attr("src");
                        var _this = this;
                        img.src = src;
                        var imageS = new Image();
                        context.drawImage(img, 0, 0, img.width, img.height);
                        imageS.src = canvas.toDataURL("image/png");
                        // 压缩图片
                        discussCompress(imageS.src);
                    });
                }
            }
        }
        //阻止默认粘贴事件
//        event.originalEvent.preventDefault();
    });
}

// 图片压缩
function discussCompress(base64code){
	var fd = new FormData();
	//压缩图片
	compressImg(base64code,1024,768,function(base64code){
	    var blob = dataURLToBlob(base64code);
	    if (blob !== null || blob !== undefined || blob !== '') {
	        fd.append("files",blob);
	        // 上传服务器
	        copyDoAjax(fd);
	    }else{
	        Dialog.alert(bdip4dLang[langType]["-16069"]  );	    }
	});
}

/**
 * 上传服务器
 * @param fd
 * @returns
 */
function copyDoAjax(fd) {
	var url = publicJS.tomcat_url + '/workflow/uploadTwoDimesionalImgage.action';
	$.ajax({
   		url:url,
   		type:'POST',
   		data:fd,
   		processData:false,
   		contentType:false,
   		dataType : "json",
  		//jsonp: "jsonpCallBack",
        success: function (data, status) {//操作成功后的操作！data是后台传过来的值
        	//console.log("上传图片成功");
        	//往富文本框添加图片 <img src=publicJS.file_static_prefix() + "/discuss/1522142071651.tmp" style="max-width:100%;">
        	var html = `<img src="${data.data}" style="max-width:100%;">`;
        	$(workflowCollision.operateEditorTarget).append(html);
        	
        },
        error: function (xhr, textStatus, errorThrown) {
        	alert(bdip4dLang[langType]["-16070"]  );        }
    });
}

// 获取浏览器类型
function GetBrowserType() {
    var userAgent = navigator.userAgent;
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }
    ; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器

    return "IE";//其他的就当IE吧
}

function clearTable(){
	workflowCollision.clearTable();
}
function clearList(){
	workflowCollision.clearList();
}
function draft(isSubmit){
	workflowCollision.draft(isSubmit);
}
function checkReturn(){
	workflowCollision.checkReturn();
}
function loadFirstColorZone(){
	workflowCollision.loadFirstColorZone();
}
function loadSecondColorZone(){
	workflowCollision.loadSecondColorZone();
}
function loadThirdColorZone(){
	workflowCollision.loadThirdColorZone();
	
}
function loadFourthColorZone(){
	workflowCollision.loadFourthColorZone();
}
function collisionReport(){
	workflowCollision.loadHandleList();
}
function collisionUnHandle(){
	workflowCollision.loadUnHandleList();
}
function collisionCc(){
	workflowCollision.loadCcList();
}

/**
 * 根据workflowId跳转到对应界面
 * @param workflowId
 * @returns
 */
function toCollisionTable(workflowId,operation){
	var url = publicJS.tomcat_url + '/workflow/getDetailAndCollisionById.action';
	/*var data = {
			'workflowId' : workflowId
	};*/
	var data = new FormData();
	data.append("workflowId",workflowId);
	$.ajax({
		url : url,
		type : 'POST',
		data : data,
		dataType : 'json',
		processData:false,
		contentType:false,
		success : function(data){
			var returnData = data.data;
			if(data.code == '200'){
				// 弹出详情界面
				workflowCollision.main(returnData.bimWorkflowDetail.status,returnData,operation);
				// 更新流程为已读
				workflowCollision.updateReadByStatusById(returnData.bimWorkflowDetail);
			}
		},
		error : function(error){
			console.log(error);
		}
	})
}

Date.prototype.Format = function(fmt) { // author: meizz
    var o = { 
        "M+": this.getMonth() + 1, 
        // 月份
        "d+": this.getDate(), 
        // 日
        "h+": this.getHours(), 
        // 小时
        "m+": this.getMinutes(), 
        // 分
        "s+": this.getSeconds(), 
        // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), 
        // 季度
        "S": this.getMilliseconds() // 毫秒
    }; 
    if (/(y+)/.test(fmt)) { 
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); 
    } 
    for (var k in o) { 
        if (new RegExp("(" + k + ")").test(fmt)) { 
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); 
        } 
    } 
    return fmt; 
}

