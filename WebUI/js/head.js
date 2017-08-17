var head = {
    load: function () {
        head.getCategory();
        head.eventBind();
        head.getSchoolInfo();
        if (location.href.indexOf('default.aspx') > 0)
            $("#maxtop").append('<li><a href="/list.aspx?o=3">最新资源</a></li><li><a href="/list.aspx?o=0">热门资源</a></li><li><a href="/list.aspx?o=1">推荐资源</a></li><li><a href="/list.aspx?o=2">编辑推荐</a></li>');
        else
            $("#maxtop").hide();
        $("#exit").click(function () { head.exit(); });
    },
    eventBind: function () {
        $('.but_search').click(function () { 
            var content = $("#search").val().replace(/^\s+|\s+$/g, "");
            if (validateString(content)) {
                $.Alert.Warning({ content: '您输入的关键词中含有非法字符', width: 350 });
                return;
            }
            if (content != "" && content != "请输入您要检索的关键词")
                location.href = "search.aspx?a=" + escape($("#search").val()) + "&b=" + escape($("#drop>p").html());
                //location.href = "search.aspx?a=" + $("#search").val() + "&b=" + $("#drop>p").html();
            else
                if ($('.box_dialog').length == 0) {
                    $.Alert.Warning({ content: '请输入您要检索的关键词' });
                }
        });
        $("#search").focus(function () {
            if ($("#search").val() == "请输入您要检索的关键词") {
                $("#search").val("");
                $("#search").addClass("current");
            }
        }).blur(function () {
            if ($("#search").val() == "") {
                $("#search").val("请输入您要检索的关键词");
                $("#search").removeClass("current");
            }
        }).keyup(function (e) {
            if (e.keyCode == 13) {
                $('.but_search').click();
            }
        });
        $("#drop>p").click(function () {
            $("#drop>ul").slideDown("slow", function () {
                $(document).mousedown(function () {
                    $("#drop>ul").slideUp();
                    $(document).unbind();
                });
            });
            $("#drop>ul>li").click(function (e) {
                $("#drop>p").html($(this).html());
                e.stopPropagation();
            }).mouseup(function () {
                $("#drop>ul>li").removeClass("e");
                $(this).addClass("e");
            });
        })
    },
    addAccess: function () {
        addAccessStatistics(1);
    },
    getCategory: function () {
        $.ajaxExtend({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "GetCatalog",
                top: 0,
                showOrder: 1
            },
            async: false,
            dataType: "xml",
            success: function (data) {
                head.allCategory(data);
            }
        });
    },
    allCategory: function (data) {
        var index = 0;
        $(data).find("Template>Item").each(function () {
            var cname = $(this).find(">Name").text();
            var id = $(this).find(">Id").text();
            var citem = $(this).find(">Child>Item");
            var cobj = "";
            for (var i = 0; i < citem.length; i++) {
                var cid = $(citem[i]).find(">Id").text();
                cobj += '<a href="list.aspx?id=' + cid + '">' + $(citem[i]).find(">Name").text() + '</a>';
                if (i == 3)
                    break;
            }
            var html = '<div><h2><a href="list.aspx?id=' + id + '">' + cname + '</a></h2>' + cobj + (citem.length > 3 ? '<a href="list.aspx?id=' + id + '" class="bg">更多</a>' : "") + ' </div>';
            index++;
            $("#subnavContent").append(html);
        });
        var width = index * 200; 
        $("#subnavContent").css("width", width);
    },
    getSchoolInfo: function () {
        //学校信息 
        $.ajaxExtend({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "GetSchool"
            },
            dataType: "json",
            success: function (data) {
                var obj = eval("(" + data + ")");
                $('.tright>.fleft').html("欢迎您 " + obj.name + "&nbsp您的IP：" + obj.ip);
            }
        });
    },
    exit: function () {
        $.ajax({
            type: "POST",
            url: "Users.axd",
            data: {
                action: "logout"
            },
            dataType: "text",
            success: function (data) {
                location.href = "/PC/login.aspx";
            }
        });
    }
}

function addStatistPlay(fileid, isPms) {
    $.ajax({
        type: "POST",
        url: "AlbumUI.axd",
        data: {
            action: "addStatistPlay",
            fileId: fileid,
            type: isPms,
            cilent: 1
        },
        dataType: "text",
        success: function (data) { }
    });
}

function addAccessStatistics(type) {
    var url = window.location;
    var a = getUrlParam("a");
    var b = getUrlParam("b");
    var para = "";
    if (a != null)
        para = "?a=" + a;
    if (b != null)
        para += "&b=" + b;
    if (para == "")
        para = url.search;
    var hpage = url.pathname.replace('/', '') + para;
    $.ajax({
        type: "POST",
        url: "StatisticsPlay.axd",
        data: {
            action: "AddAccessStatistics",
            page: hpage,
            type: type,
            cilent: 1
        },
        dataType: "text",
        success: function (data) { }
    });
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数 
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
