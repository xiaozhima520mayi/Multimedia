/// <reference path="jquery-1.4.1.min.js" />
var arrayObj = new Array(); //创建一个数组
var detailScreent = {
    id: 0,
    fid: 0,
    load: function () {
        detailScreent.id = $.getUrlParam("id");
        detailScreent.fid = $.getUrlParam("fid") == undefined ? 0 : $.getUrlParam("fid");
        detailScreent.getAlbumInfo();
        //        detailScreent.userClick();
    },
    getAlbumInfo: function () {
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "GetAlbumInfo",
                id: detailScreent.id
            },
            dataType: "xml",
            complete: function () {
                //                $('#ulFiles>li').click(function () {
                //                    $('#ulFiles>li').removeClass("e");
                //                    $(this).addClass("e");
                //                    var __index = $(this).index();
                //                    if (arrayObj.length > 0) {
                //                        _videoPlay(arrayObj[__index]);
                //                    }
                //                    $('.list_left').removeClass("opens").addClass("shrink");
                //                    $(".class_list").animate({ "right": '-230px' }, "slow", function () {
                //                        $('.list_right').hide();
                //                    });
                //                });
            },
            success: function (data) {
                var C_Id = $(data).find("AlbumId").text();
                var C_Title = $(data).find("C_Title").text();
                var C_UserRecommend = $(data).find("C_UserRecommend").text();
                var C_Description = $(data).find("C_Description").text();
                var C_CatalogId = $(data).find("C_CatalogId").text();
                var CatalogName = $(data).find("CatalogName").text();
                $("#titleInfo").html(C_Title);
                $("#recommend").html(C_UserRecommend);
                if (C_Description == "") {
                    $("#desc").hide();
                } else {
                    $("#desc>div").html(C_Description);
                }
                //                //获取专辑分类层级
                //                $.ajax({
                //                    type: "POST",
                //                    url: "AlbumUI.axd",
                //                    data: {
                //                        action: "Nav",
                //                        id: C_CatalogId
                //                    },
                //                    dataType: "json",
                //                    success: function (data) {
                //                        //根据专辑所属类别获取最顶级分类
                //                        var obj = eval("(" + data + ")");
                //                        var parentId = "";
                //                        for (var i = 0; i < obj.length; i++) {
                //                            if (parentId == "" && i == 0) {
                //                                parentId = obj[i].id;
                //                            }
                //                            if (i == obj.length - 1) {
                //                                $('.broad').append("<a href='list.aspx?id=" + obj[i].id + "'>" + obj[i].name + "</a>");
                //                            } else {
                //                                //当前分类的父级
                //                                loadData(obj[i].id);
                //                                $('.broad').append("<a href='list.aspx?id=" + obj[i].id + "'>" + obj[i].name + "</a> > ");
                //                            }
                //                        }
                //                    }
                //                });
                $("#titleValue").html(C_Title);
                $(data).find("Files").each(function () {
                    $(this).find("Item").each(function (j) {
                        var C_Name = $(this).children("C_Name").text();
                        var C_FilePath = "BackStageWeb/UpLoad" + $(this).children("C_FilePath").text();
                        var C_Id = $(this).children("C_Id").text();
                        var C_FileSuffix = $(this).children("C_FileSuffix").text();
                        var C_FilePathHtml = $(this).children("C_FilePath").text().split('/');

                        var isPms = $(data).find("IsPms").text();
                        var Percentage = $(data).find("Percentage").text();
                        var C_FileCount = $(data).find("C_FileCount").text();
                        if (isPms == 0) {
                            C_FileCount = Math.ceil(C_FileCount * (Percentage / 100));
                        }

                        var pathHtml = "";
                        if (C_FilePathHtml.length > 0) {
                            var file = C_FilePathHtml[5].split('-');
                            pathHtml = "BackStageWeb/UpLoad/" + C_FilePathHtml[1] + "/" + C_FilePathHtml[2] + "/" + C_FilePathHtml[3] + "/讲义/" + C_FilePathHtml[4] + "/" + file[2] + ".htm";
                        }
                        arrayObj.push({ id: C_Id, path: C_FilePath, ext: C_FileSuffix, htmls: pathHtml });
                        if (detailScreent.fid == 0 && j == 0) {
                            detailScreent.fid = C_Id;
                        }
                        //var html = "<li id='file_" + C_Id + "'><a href='javascript://'>" + C_Name + "</a></li>"; //cutString(C_Name, 28)
                        if (j < C_FileCount) {
                            html = "<li id='file_" + C_Id + "' rel='1'><a href='javascript://' title='" + C_Name + "'>" + cutString(C_Name,22) + "</a></li>";
                        } else {
                            html = "<li id='file_" + C_Id + "' class='lock'><a href='javascript://' title='" + C_Name + "'>" + cutString(C_Name,22) + "</a></li>";
                        }
                        $("#ulFiles").append(html);
                    });
                });
                var ps = detailScreent.getArrayObj(detailScreent.fid);
                addStatistPlay(ps.id, ps.isPms);
                _videoPlay(ps); 
                $("#content").attr("src", ps.htmls);
                screenAuto();
                $("#ulFiles>li").removeClass("e");
                $("#file_" + detailScreent.fid).addClass("e");
                $("#ulFiles>li[rel=1]").click(function () {
                    $("#ulFiles>li").removeClass("e");
                    $(this).addClass("e");
                    var id = $(this).attr("id");
                    id = id.replace("file_", "");
                    detailScreent.fid = parseFloat(id);
                    var c = detailScreent.getArrayObj(detailScreent.fid);
                    _videoPlay(c); 
                    $("#content").attr("src", c.htmls);
                });
            }
        });
    },
    userClick: function () {
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            async: false,
            data: {
                action: "RsOperating",
                type: "1",
                albumId: detail.id
            }
        });
    },
    getArrayObj: function (id) {
        var json = null;
        for (var i = 0; i < arrayObj.length; i++) {
            if (arrayObj[i].id == id) {
                json = arrayObj[i];
                break;
            }
        }
        return json;
    },
    addRecommend: function (id) {
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "RsOperating",
                type: "2",
                albumId: id
            },
            dataType: 'text',
            success: function (data) {
                $(".like").text(data);
            }
        });
    }
}

function screenAuto() {
    var height = $(window).height();
    var width = $(window).width();
    var htmlHeight = height - 120 - 30;
    var fileHeight = height - 446 - 10;
    $("#content").height(htmlHeight);
    $(".vid_list").height(fileHeight);
//    var row = (fileHeight / 32);
    $("#nano").nanoScroller(); 
}

$(window).resize(function () {
    screenAuto();
});

var playIndex = 0;

function _videoPlay(o, _playIndex) {
    if (o.path == "") {
        $("#video").height(180);
        $("#video").tispWarning();
        return;
    } 
    playIndex = _playIndex;
    $("#ulFiles>li").eq(playIndex).addClass("e").addClass("gray");
    //如果你不需要某项设置，可以直接删除，注意var flashvars的最后一个值后面不能有逗号
    var flashvars = {
        f: o.path,
        a: '', //调用时的参数，只有当s>0的时候有效
        s: '0', //调用方式，0=普通方法（f=视频地址），1=网址形式,2=xml形式，3=swf形式(s>0时f=网址，配合a来完成对地址的组装)
        c: '0', //是否读取文本配置,0不是，1是
        x: '', //调用xml风格路径，为空的话将使用ckplayer.js的配置
        r: '', //前置广告的链接地址，多个用竖线隔开，没有的留空
        y: '', //这里是使用网址形式调用广告地址时使用，前提是要设置l的值为空
        e: '0', //视频结束后的动作，0是调用js函数，1是循环播放，2是暂停播放并且不调用广告，3是调用视频推荐列表的插件，4是清除视频流并调用js功能和1差不多，5是暂停播放并且调用暂停广告
        v: '80', //默认音量，0-100之间
        p: '1', //视频默认0是暂停，1是播放
        h: '0', //播放http视频流时采用何种拖动方法，=0不使用任意拖动，=1是使用按关键帧，=2是按时间点，=3是自动判断按什么(如果视频格式是.mp4就按关键帧，.flv就按关键时间)，=4也是自动判断(只要包含字符mp4就按mp4来，只要包含字符flv就按flv来)
        q: '', //视频流拖动时参考函数，默认是start
        m: '0', //默认是否采用点击播放按钮后再加载视频，0不是，1是,设置成1时不要有前置广告
        o: '', //当m=1时，可以设置视频的时间，单位，秒
        w: '', //当m=1时，可以设置视频的总字节数
        g: '', //视频直接g秒开始播放
        j: '', //视频提前j秒结束
        k: '', //提示点时间，如 30|60鼠标经过进度栏30秒，60秒会提示n指定的相应的文字
        wh: '', //这是6.2新增加的宽高比，可以自己定义视频的宽高或宽高比如：wh:'4:3',或wh:'1080:720'
        ct: '2', //6.2新增加的参数，主要针对有些视频拖动时时间出错的修正参数，默认是2，自动修正，1是强制修正，0是强制不修正
        //调用播放器的所有参数列表结束
        //以下为自定义的播放器参数用来在插件里引用的
        my_url: encodeURIComponent(window.location.href)//本页面地址
        //调用自定义播放器参数结束<a href="ckplayer/ckplayer.swf">../OtherPage/ckplayer/ckplayer.swf</a>
    };

    if (o.ext.toLowerCase() == ".wmv" || o.ext.toLowerCase() == ".asf") {
        $('.class_list').height("357px");
        if (t != null) {
            clearInterval(t);
        }
        playWmv(o);
    }
    else if (o.ext.toLowerCase() == ".flv" || o.ext.toLowerCase() == ".mp4") {
        $('.class_list').height("498px");
        if (t != null) {
            clearInterval(t);
        }
        var themeName = "/WebUI/control/video/ckplayer/ckplayer.swf";
        var params = { bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', wmode: 'Opaque' };
        CKobject.embedSWF(themeName, 'video', 'ckplayer_a1', 950, 538, flashvars, params);
    }
    else if (false) {//o.ext.toLowerCase() == ".mp4"
        if (t != null) {
            clearInterval(t);
        }
        //支持HTML5
        //pc版Safari用flash播放 534.57.2
        if ($.browser.safari && parseFloat($.browser.version) <= 534.57) {
            $('.class_list').height("498px");
            var themeName = "/WebUI/control/video/ckplayer/ckplayer.swf";
            var params = { bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', wmode: 'Opaque' };
            CKobject.embedSWF(themeName, 'video', 'ckplayer_a1', 950, 538, flashvars, params);
        }
        else if (typeof (Worker) !== "undefined") {
            var html5Video = "<video id='player1' width='950' height='538' autoplay='autoplay' controls='controls'>";
            html5Video += "<source src=\"" + flashvars.f + "\" type='video/mp4'/>";
            html5Video += "</video>";
            $('#video').html(html5Video);
            $('audio,video').mediaelementplayer({
                success: function (player, node) {
                    //$('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                    player.play();
                    var flag = 0;
                    player.addEventListener('timeupdate', function (e) {
                        if (player.currentTime >= player.duration && flag == 0) {
                            flag = 1;
                            playerstop();
                        }
                    }, false);
                }
            });
        }
        else {
            $('.class_list').height("498px");
            var themeName = "/WebUI/control/video/ckplayer/ckplayer.swf";
            var params = { bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always', wmode: 'Opaque' };
            CKobject.embedSWF(themeName, 'video', 'ckplayer_a1', 950, 538, flashvars, params);
        }
    }

    $.ajax({
        type: "POST",
        url: "AlbumUI.axd",
        data: {
            action: "RsOperating",
            type: "1",
            albumId: $.getUrlParam("id")
        }
    });
}

function isIE() { //ie?  
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}

var t = null;
function playWmv(o) {
    var htmlWmv = "";
    if (isIE()) {//isIE()
        if (document.getElementById("MediaPlayer"))
            document.getElementById("MediaPlayer").controls.stop();
        htmlWmv = "<OBJECT ID='MediaPlayer' WIDTH='434' HEIGHT='357'";
        htmlWmv += " CLASSID='CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6' STANDBY='Loading Windows Media Player components...' TYPE='application/x-oleobject' codebase='http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701standby=Loading'>";
        htmlWmv += " <PARAM NAME='URL' VALUE='"+o.path+"'>";
        htmlWmv += " <PARAM name='ShowControls' VALUE='true'>";
        htmlWmv += " <PARAM name='ShowStatusBar' VALUE='true'>";

        htmlWmv += "<param name='UIMode' value='full'> ";
        htmlWmv += "<param name='Enabled' value='1'>";
        //全屏播放 如果全屏播放的话 层级为最顶级
        htmlWmv += "<param name='WindowlessVideo' value='1'> ";
        htmlWmv += "<param NAME='stretchToFit' VALUE='1'>";
        //右键菜单
        htmlWmv += "<param NAME='enableContextMenu' VALUE='0'>";

        htmlWmv += "<param NAME='wmode' VALUE='Opaque'>";
        htmlWmv += "<param NAME='quality' VALUE='high'>";

        htmlWmv += " <PARAM name='ShowDisplay' VALUE='false'>";
        htmlWmv += " <PARAM name='autostart'   VALUE='true'>";
        htmlWmv += " <EMBED TYPE='application/x-mplayer2' SRC='" + o.path + "' NAME='MediaPlayer'";
        htmlWmv += " width='434' height='357' quality='high' wmode='Opaque' ShowControls='1' ShowStatusBar='1' ShowDisplay='1'";
        htmlWmv += " autostart='1'></EMBED>";
        htmlWmv += " </OBJECT>";
        document.getElementById('video').innerHTML = (htmlWmv);
        if (document.getElementById("MediaPlayer").currentMedia != undefined) {
            t = setInterval(function () {
                var a = document.getElementById("MediaPlayer").currentMedia.duration;
                var b = document.getElementById("MediaPlayer").controls.currentPosition;
                if (parseInt(b) + 1 >= parseInt(a)) {
                    clearInterval(t);
                    playerstop();
                }
            }, 1000);
        }
    } else {
        //var tops = 220;
        //var lefts = 365;
        var tops = 200;
        var lefts = 80;
        htmlWmv = "<div class='mejs-container svg mejs-video' style=' width: 434px; height: 357px;'>";
        htmlWmv += "<div class=\"prompt\" style=\"width:220px;top:" + tops + "px;left:" + lefts + "px;\"><span class=\"warning\">";
        htmlWmv += "</span><div style='width: 160px;'>为了最佳观看效果，请使用IE浏览器播放！";
        htmlWmv += "</div></div>";
        $('#video').html(htmlWmv);
    }
}

function playerstop() {
    //只有当调用视频播放器时设置e=0或4时会有效果 播放完成
    if ($("#ulFiles>li").length >= playIndex + 1) {
        playIndex = playIndex + 1;
        _videoPlay(arrayObj[playIndex], playIndex);
    }
}

//点击播放视频
function actionPlay(obj) {
    //点击wmv视频的时候将当前的wmv视频停止
    if (arrayObj[playIndex].ext.toLowerCase() == ".wmv") {
        document.getElementById("MediaPlayer").controls.stop();
    }
    $(obj).addClass("gray");
    $('#ulFiles>li').removeClass("e");
    $(obj).addClass("e");
    var __index = $(obj).index();
    if (arrayObj.length > 0) {
        _videoPlay(arrayObj[__index], __index);
    }
    $('.list_left').removeClass("opens").addClass("shrink");
    $(".class_list").animate({ "right": '-' + maxWidth + "px" }, "slow", function () {
        //$('.list_right').hide();
    });
}

function cutString(str, len) {
    if (str.length == 0) { return ""; }
    //length属性读出来的汉字长度为1
    if (str.length * 2 <= len) {
        return str;
    }
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if (strlen >= len) {
                return s.substring(0, s.length - 1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if (strlen >= len) {
                return s.substring(0, s.length - 2) + "...";
            }
        }
    }
    return s;
}