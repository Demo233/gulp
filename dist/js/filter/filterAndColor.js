"use strict";var FilterAndColor={outLoadFilter:function(){var a=BimBdip.lvmid;$.ajax({url:publicJS.tomcat_url+"/saveFilter.action",type:"post",data:{lmvid:a},async:!1,processData:!1,contentType:!1,dataType:"json",success:function(a){a.code,Dialog.alert(bdip4dLang[langType][a.code])}})},inLoadFilter:function(){var a=BimBdip.lvmid;$.ajax({url:publicJS.tomcat_url+"/markFilterColor.action",type:"post",data:{lmvid:a},async:!1,processData:!1,contentType:!1,dataType:"json",success:function(a){a.code,Dialog.alert(bdip4dLang[langType][a.code])}})}};