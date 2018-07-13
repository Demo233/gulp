var FilterAndColor = {
    outLoadFilter:function(){
        var lmvid = BimBdip.lvmid;
        $.ajax({
            url: publicJS.tomcat_url + "/saveFilter.action",
            type: 'post',
            data: {"lmvid":lmvid},
            async: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (data) {
                if (data.code == "200") {
                    Dialog.alert(bdip4dLang[langType][data.code]);
                } else {
                    Dialog.alert(bdip4dLang[langType][data.code]);
                }
            }
        })
    },inLoadFilter:function(){
        var lmvid = BimBdip.lvmid;
        $.ajax({
            url: publicJS.tomcat_url + "/markFilterColor.action",
            type: 'post',
            data: {"lmvid":lmvid},
            async: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (data) {
                if (data.code == "200") {
                    Dialog.alert(bdip4dLang[langType][data.code]);
                } else {
                    Dialog.alert(bdip4dLang[langType][data.code]);
                }
            }
        })
    }
}