/// <reference path="jquery-1.4.1.min.js" />
/// <reference path="jquery-expand.js" />
var arrayObj = new Array(); //创建一个数组
var detail = {
    id: 0,
    fid: 0,
    load: function () {
        detail.id = $.getUrlParam("id");
        detail.fid = $.getUrlParam("fid") == undefined ? 0 : $.getUrlParam("fid");
        detail.getAlbumInfo();
        detail.userClick();
        detail.eventBind();
    },
    eventBind: function () {
        //课程目录点击事件
        $('.list_left').click(function () {
            if ($('.list_right').is(":hidden")) {
                $('.list_left').removeClass("shrink").addClass("opens2");
                $('.list_right').show();
                $(".class_list").animate({ "right": '-2px' }, "slow", function () {
                });
            } else {
                $('.list_left').removeClass("opens2").addClass("shrink");
                $(".class_list").animate({ "right": '-230px' }, "slow", function () {
                    $('.list_right').hide();
                });
            }
            $("#nano").nanoScroller();
            $('#nano').height("450px"); 
        });
        $('.like').click(function () {
            detail.addRecommend(detail.id);
        });
    },
    getAlbumInfo: function () {
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "GetAlbumInfo",
                id: detail.id
            },
            dataType: "xml",
            complete: function () {
                $('#ulFiles>li[class!=lock]').click(function () {
                    $('#ulFiles>li').removeClass("e");
                    $(this).addClass("e");
                    var __index = $(this).index();
                    if (arrayObj.length > 0) {
                        _videoPlay(arrayObj[__index]);
                    }
                    $('.list_left').removeClass("opens").addClass("shrink");
                    $(".class_list").animate({ "right": '-230px' }, "slow", function () {
                        $('.list_right').hide();
                    });
                });
            },
            success: function (data) {
                var C_Id = $(data).find("AlbumId").text();
                var C_Title = $(data).find("C_Title").text();
                var C_UserRecommend = $(data).find("C_UserRecommend").text();
                var C_Description = $(data).find("C_Description").text();
                var C_CatalogId = $(data).find("C_CatalogId").text();
                var CatalogName = $(data).find("CatalogName").text();
                var isPms = $(data).find("IsPms").text();
                if (isPms == 0) {
                    $("#titleInfo").html(C_Title + "(您尚未购买，只能部分查看)");
                } else {
                    $("#titleInfo").html(C_Title);
                }
                $("#recommend").html(C_UserRecommend);
                if (C_Description == "") {
                    $("#desc").hide();
                } else {
                    $("#desc>div").html(C_Description);
                }
                //获取专辑分类层级
                $.ajax({
                    type: "POST",
                    url: "AlbumUI.axd",
                    data: {
                        action: "Nav",
                        id: C_CatalogId
                    },
                    dataType: "JSON",  //返回多个json对象，先转义，用JSON
                    success: function (data) {
                        //根据专辑所属类别获取最顶级分类
                        var obj = eval("(" + data + ")");
                        var parentId = "";
                        for (var i = 0; i < obj.length; i++) {
                            if (parentId == "" && i == 0) {
                                parentId = obj[i].id;
                            }
                            if (i == obj.length - 1) {
                                $('.broad').append("<a href='list.aspx?id=" + obj[i].id + "'>" + obj[i].name + "</a>");
                            } else {
                                //当前分类的父级
                                loadData(obj[i].id);
                                $('.broad').append("<a href='list.aspx?id=" + obj[i].id + "'>" + obj[i].name + "</a> > ");
                            }
                        }
                    }
                });
                $(data).find("Files").each(function () {
                    $(this).find("Item").each(function (j) {
                        var C_Name = $(this).children("C_Name").text();
                        var C_FilePath = $(this).children("C_FilePath").text();
                        var C_Id = $(this).children("C_Id").text();
                        var C_FileSuffix = $(this).children("C_FileSuffix").text();
                        var isPms = $(data).find("IsPms").text();
                        var Percentage = $(data).find("Percentage").text();
                        var C_FileCount = $(data).find("C_FileCount").text();
                        if (isPms == 0) {
                            Percentage = Math.ceil(C_FileCount * (Percentage / 100));
                        }
                        arrayObj.push({ id: C_Id, path: C_FilePath, ext: C_FileSuffix });
                        if (detail.fid == 0 && j == 0) {
                            detail.fid = C_Id;
                        }
                        //var html = "<li id='file_" + C_Id + "'>" + C_Name + "</li>"; //cutString(C_Name, 28)
                        var html = "";
                        if (j < Percentage) {
                            html = "<li id='file_" + C_Id + "' rel='1' style='cursor:pointer;'>" + C_Name + "</li>";
                        } else {
                            html = "<li id='file_" + C_Id + "' class='lock'>" + C_Name + "</li>";
                        }
                        $("#ulFiles").append(html);
                    });
                });
                var ps = detail.getArrayObj(detail.fid);
                addStatistPlay(ps.id, ps.isPms);
                _videoPlay(ps);
                $("#ulFiles>li").removeClass("e");
                $("#file_" + detail.fid).addClass("e");
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

function _videoPlay(o) {
    if (o.path.indexOf("/BackStageWeb/UpLoad") < 0)
        o.path = "/BackStageWeb/UpLoad" + o.path;
    //如果你不需要某项设置，可以直接删除，注意var flashvars的最后一个值后面不能有逗号
    var flashvars = {
        f: o.path,
        a: '', //调用时的参数，只有当s>0的时候有效
        s: '0', //调用方式，0=普通方法（f=视频地址），1=网址形式,2=xml形式，3=swf形式(s>0时f=网址，配合a来完成对地址的组装)
        c: '0', //是否读取文本配置,0不是，1是
        x: '', //调用xml风格路径，为空的话将使用ckplayer.js的配置
        //i: 'http://www.ckplayer.com/images/loadimg3.jpg', //初始图片地址
        //i: 'img/2.gif', //初始图片地址
        //d: 'http://www.ckplayer.com/down/pause6.1_1.swf|http://www.ckplayer.com/down/pause6.1_2.swf', //暂停时播放的广告，swf/图片,多个用竖线隔开，图片要加链接地址，没有的时候留空就行
        //d: 'img/2.jpg|img/haha.jpg', //暂停时播放的广告，swf/图片,多个用竖线隔开，图片要加链接地址，没有的时候留空就行
        //u: 'img/2.jpg|img/haha.jpg', //暂停时如果是图片的话，加个链接地址
        //l: 'http://www.ckplayer.com/down/adv6.1_1.swf|http://www.ckplayer.com/down/adv6.1_2.swf', //前置广告，swf/图片/视频，多个用竖线隔开，图片和视频要加链接地址
        //l: 'img/2.gif', //前置广告，swf/图片/视频，多个用竖线隔开，图片和视频   要加链接地址
        r: '', //前置广告的链接地址，多个用竖线隔开，没有的留空
        //t: '10|10', //视频开始前播放swf/图片时的时间，多个用竖线隔开
        y: '', //这里是使用网址形式调用广告地址时使用，前提是要设置l的值为空
        //z: 'http://www.ckplayer.com/down/buffer.swf', //缓冲广告，只能放一个，swf格式
        e: 2, //视频结束后的动作，0是调用js函数，1是循环播放，2是暂停播放并且不调用广告，3是调用视频推荐列表的插件，4是清除视频流并调用js功能和1差不多，5是暂停播放并且调用暂停广告
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
        // n: '好好学习|天天向上', //提示点文字，跟k配合使用，如 提示点1|提示点2
        wh: '', //这是6.2新增加的宽高比，可以自己定义视频的宽高或宽高比如：wh:'4:3',或wh:'1080:720'
        ct: '2', //6.2新增加的参数，主要针对有些视频拖动时时间出错的修正参数，默认是2，自动修正，1是强制修正，0是强制不修正
        //调用播放器的所有参数列表结束
        //以下为自定义的播放器参数用来在插件里引用的
        my_url: encodeURIComponent(window.location.href), //本页面地址
        loaded: 'loadedHandler'
        //调用自定义播放器参数结束<a href="ckplayer/ckplayer.swf">../OtherPage/ckplayer/ckplayer.swf</a>
    };
    //支持HTML5
    if (o.ext.toLowerCase() == ".wmv" || o.ext.toLowerCase() == ".asf") {
        if (t != null) {
            clearInterval(t);
        }
        
        playWmv(o);
    } else if (o.ext.toLowerCase() == ".flv" || o.ext.toLowerCase() == ".mp4") {
        if (typeof (Worker) !== "undefined") {
            var html5Video = "<video id='player1' width='950' height='538' autoplay='autoplay' controls='controls'>";
            html5Video += "<source src=\"" + o.path + "\" type='video/mp4'>";
            html5Video += "</video>";
            $('#video').html(html5Video);
            $('audio,video').mediaelementplayer({
                success: function (player, node) {
                    $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
                }
            });
        }
        else {
            //var params = { bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always' };
            //CKobject.embedSWF(themeName, 'video', 'ckplayer_a1', 950, 538, flashvars, params);
            var video = [o.path];
            var themeName = "/WebUI/control/video/ckplayer/ckplayer.swf";
            CKobject.embed(themeName, 'video', 'ckplayer_a1', 950, 538, false, flashvars, video);
        }
    }
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
        htmlWmv = "<OBJECT ID='MediaPlayer' WIDTH='950' HEIGHT='538'";
        htmlWmv += " CLASSID='CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6' STANDBY='Loading Windows Media Player components...' TYPE='application/x-oleobject' codebase='http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701standby=Loading'>";
        htmlWmv += " <PARAM NAME='URL' VALUE='" + o.path + "'>";
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
        htmlWmv += " width='950' height='538' quality='high' wmode='Opaque' ShowControls='1' ShowStatusBar='1' ShowDisplay='1'";
        htmlWmv += " autostart='1'></EMBED>";
        htmlWmv += " </OBJECT>";
        document.getElementById('video').innerHTML = (htmlWmv);
        if (document.getElementById("MediaPlayer").currentMedia != undefined) {
            t = setInterval(function () {
                if (document.getElementById("MediaPlayer")) {
                    var a = document.getElementById("MediaPlayer").currentMedia.duration;
                    var b = document.getElementById("MediaPlayer").controls.currentPosition;
                    if (parseInt(b) + 1 >= parseInt(a)) {
                        clearInterval(t);
                        playerstop();
                    }
                } else {
                    clearInterval(t);
                }
            }, 1000);
        }
    } else {
        var tops = 220;
        var lefts = 365;

        htmlWmv = "<div class='mejs-container svg mejs-video' style=' width:950px; height:538px;'>";
        htmlWmv += "<div class=\"prompt\" style=\"width:220px;top:" + tops + "px;left:" + lefts + "px;\"><span class=\"warning\">";
        htmlWmv += "</span><div style='width: 160px;'>为了最佳观看效果，请使用IE浏览器播放！";
        htmlWmv += "</div></div>";
        $('#video').html(htmlWmv);
    }
}

function loadData(C_CatalogId) {
    //相关内容
    $.ajax({
        type: "POST",
        url: "AlbumUI.axd",
        data: {
            action: "GetAlbumByCatalogTop",
            top: 5,
            //点击量排序
            showOrder: 0,
            catalogid: C_CatalogId,
            htmlFile: '/WebUI/XML/detail.xml'
        },
        dataType: "xml",
        complete: function () {
        },
        success: function (data) {
            //
            $("#ulArea").append($(data).find("Content").text());
            shink();
            $("#ulArea>li").each(function () {
                var _p = $(this).attr("p");
                var rights = $(this).attr("rights");
                var id = $(this).attr("id");
                if (_p == "1") {
                    $(this).find(".icon").removeClass("key");
                }
                var link = "detail.aspx?id=" + id;
                if (rights == "1") {
                    link = "detailScreen.aspx?id=" + id;
                }
                $(this).find("a").attr("href", link);
            });
        }
    });
}