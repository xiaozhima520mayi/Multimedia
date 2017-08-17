/// <reference path="jquery-1.4.1.min.js" />
eval(function (p, a, c, k, e, r) { e = function (c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if (!''.replace(/^/, String)) { while (c--) r[e(c)] = k[c] || e(c); k = [function (e) { return r[e] } ]; e = function () { return '\\w+' }; c = 1 }; while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]); return p } ('2(g.h.K("L","3.0")){t.8.9=7(a,b){2(!b)b=1;4 c=1.M(1.u);4 d=1.N(a,b,c,O.P,j);4 e=[];Q(4 i=0;i<d.R;i++)e[i]=d.S(i);6 e};v.8.9=7(a){2(1.f.9)6 1.f.9(a,1);k w"x p y z";};t.8.l=7(a,b){2(!b)b=1;4 c=1.9(a,b);2(c.T>0)6 c[0];k 6 j};v.8.l=7(a){2(1.f.l)6 1.f.l(a,1);k w"x p y z";};A.8.B=7(a,b){U(a){m"V":1.q.s(b,1);o;m"W":1.s(b,1.C);o;m"X":1.D(b);o;m"Y":2(1.E)1.q.s(b,1.E);k 1.q.D(b);o}};A.8.Z=7(a,b){4 r=1.f.10();r.11(1);4 c=r.12(b);1.B(a,c)}}7 13(a){4 b;2(14.F){b=15 F(\'16.17\');b.G=H;b.I(a);6 b.u}2(g.h&&g.h.J){b=g.h.J(\'\',\'\',j);b.G=H;b.I(a);6 b.C}18(\'您的浏览器不支持p操作，请更新您的浏览器！\\n建议使用19.5以上的版本。\');6 j}', 62, 72, '|this|if||var||return|function|prototype|selectNodes||||||ownerDocument|document|implementation||null|else|selectSingleNode|case||break|XML|parentNode||insertBefore|XMLDocument|documentElement|Element|throw|For|Elements|Only|HTMLElement|insertAdjacentElement|firstChild|appendChild|nextSibling|ActiveXObject|async|false|load|createDocument|hasFeature|XPath|createNSResolver|evaluate|XPathResult|ORDERED_NODE_SNAPSHOT_TYPE|for|snapshotLength|snapshotItem|length|switch|beforeBegin|afterBegin|beforeEnd|afterEnd|insertAdjacentHTML|createRange|setStartBefore|createContextualFragment|LoadXml|window|new|Microsoft|XMLDOM|alert|IE5'.split('|'), 0, {}));
var defaultMultime = {
    categoryXml: null,
    reommendcss: ["b_red", "b_brown", "b_green", "b_blue", "b_yellow", "b_light_blue"],
    load: function () {
        defaultMultime.getCategory();
        //最新
        defaultMultime.newInfo();
        //统计
        defaultMultime.statistics();
        defaultMultime.defaultCategory();
        defaultMultime.eventBind();
    },
    eventBind: function () {
        $("#rink_0>li").mouseover(function () {
            $("#rink_0>li").removeClass("e");
            $(this).addClass("e");
            if ($(this).index() == 0) {
                $("#rink_0_1").show();
                $("#rink_0_2").hide();
            } else {
                $("#rink_0_1").hide();
                $("#rink_0_2").show();
            }
        });
        $("#rink_1>li").mouseover(function () {
            $("#rink_1>li").removeClass("e");
            $(this).addClass("e");
            if ($(this).index() == 0) {
                $("#rink_1_1").show();
                $("#rink_1_2").hide();
            } else {
                $("#rink_1_1").hide();
                $("#rink_1_2").show();
            }
        });
        $("#rink_2>li").mouseover(function () {
            $("#rink_2>li").removeClass("e");
            $(this).addClass("e");
            if ($(this).index() == 0) {
                $("#rink_2_1").show();
                $("#rink_2_2").hide();
            } else {
                $("#rink_2_1").hide();
                $("#rink_2_2").show();
            }
        });
    },
    getCategory: function () {
        $.ajax({
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
                defaultMultime.categoryXml = data;
                defaultMultime.recommendCategory();
                //                defaultMultime.allCategory();
                defaultMultime.ramCategory();
            }
        });
    },
    recommendCategory: function () {
        defaultMultime.recommendCategoryInfo("出国英语", 1);
        defaultMultime.recommendCategoryInfo("实用英语", 2);
        defaultMultime.recommendCategoryInfo("职业英语", 3);
        defaultMultime.recommendCategoryInfo("应用外语", 4);
        defaultMultime.recommendCategoryInfo("学历外语", 5);
        defaultMultime.recommendCategoryInfo("考研英语", 6);
    },
    recommendCategoryInfo: function (name, id) {
        $(defaultMultime.categoryXml).find("Template>Item").each(function () {
            var pId = $(this).find(">Id").text();
            var cname = $(this).find(">Name").text();
            if (cname == name) {
                var citem = $(this).find(">Child>Item");
                var defaultHeight = id > 1 ? "style='height:78px'" : "";
                var cobj = "";
                for (var i = 0; i < citem.length; i++) {
                    var cid = $(citem[i]).find(">Id").text(); //list.aspx?id=' + cid + '
                    cobj += '<a href="javascript://" onclick="return defaultMultime.chackJump(arguments[0],' + cid + ')"><span>' + $(citem[i]).find(">Name").text() + '</span></a>';
                }
                var html = '<div class="b_block b' + id + ' margin5" data-url="list.aspx?id=' + pId + '" onclick="defaultMultime.partJump(this)"><div class="b_cont b_cont1" ' + defaultHeight + '>' +
                   '     <h2 class="b_title">' + cname + '</h2>' +
                   '     <p>' + cobj + '</p>' +
                   ' </div>' +
                   ' <div class="b_cont b_cont2">' +
                   '     <h2 class="b_title">' + cname + '</h2>' +
                   '     <p>' + cobj + '</p>' +
                   '     <div class="pic_bg">' +
                   '         <img alt="" src="/WebUI/images/bk_' + id + '_1.png">' +
                   '     </div>' +
                   ' </div>' +
                   ' <div class="b_hover ' + defaultMultime.reommendcss[(id - 1)] + '"></div>' +
                   ' <div class="b_cover">' +
                   '     <img alt="" src="/WebUI/images/bk_' + id + '.jpg ">' +
                   ' </div>' +
                   ' </div>';
                $("#rcategory").append(html);
            }
        });
    },
    chackJump: function (a, cid) {
        var e = window.event || a;
        window.open("list.aspx?id=" + cid, '_blank');
        e.stopPropagation();
        return false;
    },
    allCategory: function () {
        $(defaultMultime.categoryXml).find("Template>Item").each(function () {
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
            $("#subnavContent").append(html);
        });
    },
    newInfo: function () {
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "AllCatalogAlbumPage",
                pageSize: 8,
                page: 1,
                dateCond: '',
                //读者推荐排序
                showOrder: 1,
                htmlFile: '/WebUI/XML/newcourse.xml'
            },
            dataType: "xml",
            complete: function () {
                $('.isPms').each(function () {
                    var p = $(this).attr("p");
                    if (p != "0") {
                        $(this).find("i").remove();
                    }
                });
                ImageScroll(getById("leftAcre"), getById("rigthAcre"), getById("g"), 304, 2434);
                shink();
            },
            success: function (data) {
                $("#coursecontent").append($(data).find("Content").text());
                $("#coursecontent").find("li[rels=1]").each(function () {
                    var href = $(this).find("a").attr("href");
                    href = href.replace("detail", "detailScreen");
                    $(this).find("a").attr("href", href);
                })
            }
        });
    },
    defaultCategory: function () {
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "GetCatalogByChilds",
                id: ""
            },
            dataType: "xml",
            complete: function () {

            },
            success: function (data) {

            }
        });
    },
    ramCategory: function () {
        var i = 0;
        $(defaultMultime.categoryXml).find("Template>Item").each(function (i) {
            if (i <= 2) {
                var name = $(this).children("Name").text();
                var id = $(this).children("Id").text();
                $("#tit_" + i).html('<a href="list.aspx?id=' + id + '" target="_blank">' + name + '</a>');
                //                //2级
                //                $(".middle_infor:eq(" + i + ")>div:eq(0)").html("<p>" + name + "</p>");
                var html = "";
                //3级
                $(this).children("Child").each(function () {
                    $(this).children("Item").each(function (j) {
                        var name = $(this).children("Name").text();
                        var id = $(this).children("Id").text();
                        html += '<li rel="' + i + '" class="tab_ctr_list ' + (j == 0 ? "active" : "") + ' lazyImg"><a class="tab_ctr_link" target="_blank" href="list.aspx?id=' + id + '">' + name + '</a></li>';
                        defaultMultime.childAlbum(id, i);
                    });
                });
                $("#tit_tab_" + i).html(html);
                //大家在看
                loadData(id, 10, 0, ("#rink_" + i + "_1"), "/WebUI/XML/ranking.xml");
                //推荐排行
                loadData(id, 10, 2, ("#rink_" + i + "_2"), "/WebUI/XML/ranking.xml");
            }
        });
        languageInfo();
        catitem();
    },
    childAlbum: function (id, count) {
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "GetAlbumByCatalogTop",
                top: 5,
                showOrder: 2,
                catalogid: id
            },
            dataType: "xml",
            async: false,
            success: function (data) {
                var html = '<div class="recommend-list">';
                $(data).find("Template>Item").each(function (i) {
                    var C_Id = $(this).find("C_Id").text();
                    var C_Title = $(this).find("C_Title").text();
                    var C_Click = $(this).find("C_Click").text();
                    var C_Image = $(this).find("C_Image").text();
                    var C_Rights = $(this).find("C_Rights").text();
                    var C_FileCount = $(this).find("C_FileCount").text();
                    var isPms = $(this).find("IsPms").text();
                    var url = "";
                    if (C_Rights == "1") {
                        url = "detailScreen.aspx?id=" + C_Id;
                    } else {
                        url = "detail.aspx?id=" + C_Id;
                    }
                    var pms = '<i class="icon key"> </i>';
                    if (isPms != "0") pms = "";
                    if (i == 0) {
                        C_Image = C_Image == "" ? "/WebUI/images/recom_img_big.jpg" : C_Image;
                        html += '<div class="recom_list big">' +
                                    '<ul>' +
                                    '<li>' +
                                        '<div class="tab_course">' +
                                            '<a href="' + url + '" target="_blank">' +
                                                '<img src="/WebUI/control/imgloading/point.gif" rel="' + C_Image + '" onload="imgloadimg($(this),1,1)" />' +
                                            '</a>' +
                                        '</div>' +
                                        '<div class="tab_course_shink">' +
                                           ' <a href="' + url + '" target="_blank">' + C_Title + '</a>' +
                                            '<p>课时数：' + C_FileCount + '</p>' +
                                            '<p>点击量：' + C_Click + '</p>' +
                                            '<a class="tab_course_btn" href="' + url + '" target="_blank"><span>查看详情</span><i class="course_btn_icon"></i></a>' + pms +
                                        '</div>' +
                                    '</li>' +
                                '</ul>' +
                            '</div>';
                        html += '<div class="recom_list small2"><ul>';
                    } else {
                        //右边6个
                        C_Image = C_Image == "" ? "/WebUI/images/no_photo.jpg" : C_Image;
                        C_Title = cutString(C_Title, 20);
                        html += '<li>' +
                                        '<div class="tab_course">' +
                                            '<a href="' + url + '" target="_blank">' +
                                               ' <img  src="/WebUI/control/imgloading/point.gif" rel="' + C_Image + '" onload="imgloadimg($(this),1,1)" />' +
                                           ' </a>' +
                                           ' <span>' + C_Title + '</span>' + pms +
                                        '</div>' +
                                       ' <div class="tab_course_shink">' +
                                          '  <a href="' + url + '" target="_blank"> ' + C_Title + '</a>' +
                                          '  <p>课时数：' + C_FileCount + '</p>' +
                                          '  <p>点击量：' + C_Click + '</p>' +
                                          '  <a class="tab_course_btn" href="' + url + '" target="_blank"><span>查看详情</span><i class="course_btn_icon"></i></a>' +
                                       ' </div>' +
                                   ' </li>';
                    }
                });
                html += "</ul></div></div>";
                $("#recommend_" + count).append(html);
            }
        });
    },
    partJump: function (o) {
        //location.href = $(o).attr("data-url");
        window.open($(o).attr("data-url"));
    },
    statistics: function () { 
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "ResourcesStatistics",
                id: ''
            },
            dataType: "json",
            success: function (data) {
                if (data.TotalFileCount == -1) {
                    $(".pic_bg,.b_big_blue,.b_title,.statisticspage").hide();
                } else {
                    $(".pic_bg,.b_big_blue,.b_title,.statisticspage").show();
                    $('.maxc').html("总数：" + data.TotalFileCount + " 课时");
                    $('.newc').html("最新：" + data.NewTotalFileCount + " 课时");
                }
            }
        });
        //访问统计
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "CatalogByStatistics",
                id: ""
            },
            dataType: "json",
            success: function (data) {
                $('#statisticspage').html('访问量：' + data.C_Click + '次');
            }
        });
    }
}

function catitem() {
    $(".tab_ctr_wrap").each(function () {
        var ths = $(this);
        var tli = ths.find("li");
        var tle = ths.find(".tab_head_line");
        var tli_width = $(".tab_ctr li:first").width();
        tle.width(tli_width+20);
        tli.mouseover(function (i) {
            var tw = $(this).width();
            tli.removeClass("active");
            $(this).addClass("active");
            $("#recommend_" + $(this).attr("rel") + " .recommend-list").hide();
            $("#recommend_" + $(this).attr("rel") + " .recommend-list").eq($(this).index()).show();
            tle.stop(true, true).animate({
                width: tw + 20,
                left: $(this).position().left
            })
        })
    })
}
function loadData(catalogid, top, order, t, htmlFile) {
    $.ajax({
        type: "POST",
        url: "AlbumUI.axd",
        data: {
            action: "GetAlbumByCatalogTop",
            showOrder: order,
            top: top,
            catalogid: catalogid,
            dateCond: '',
            htmlFile: htmlFile
        },
        dataType: "xml",
        success: function (data) {
            $(t).html($(data).find("Content").text());
            $(t).find("a[rel=1]").each(function () {
                var href = $(this).attr("href");
                href = href.replace("detail", "detailScreen");
                $(this).attr("href", href);
            })
        }
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