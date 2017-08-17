/// <reference path="jquery-1.4.1.min.js" />
/// <reference path="jquery-expand.js" />
/// <reference path="ScrollBar/jquery.nanoscroller.js" />
//0点击量1读者推荐2后台推荐3时间
var order = 3;
var _totalPage = 0;
var list = {
    categoryXml: null,
    selectId: 0,
    load: function () {
        list.selectId = $.getUrlParam("id") == undefined ? 0 : $.getUrlParam("id");
        order = $.getUrlParam("o") == undefined ? 3 : $.getUrlParam("o");
        list.getCategory();
        list.eventBind();
        list.maxHostInfo();
    },
    eventBind: function () {
        $(".switch>li").removeClass("e");
        $(".switch>li[rel='" + order + "']").addClass("e");
        $(".switch>li").click(function (e) {
            $(".switch>li").removeClass("e");
            $(this).addClass("e");
            order = $(this).attr("rel");
            if (order == 4) {
                location.href = "/default.aspx";
            } else {
                list.listInfo(1);
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
                list.categoryXml = data;
                $(list.categoryXml).find("Template>Item").each(function () {
                    var id = $(this).find(">Id").text();
                    var cname = $(this).find(">Name").text();
                    var citem = $(this).find(">Child>Item");
                    var cobj = "";
                    var disp = "";
                    for (var i = 0; i < citem.length; i++) {
                        var cid = $(citem[i]).find(">Id").text();
                        cobj += '<p><a href="javascript://" id="c' + cid + '" onclick="list.selectCate(' + cid + ')">' + $(citem[i]).find(">Name").text() + '</a></p>';
                    }
                    if (id == list.selectId)
                        disp = 'style="display: block;"';
                    var html = '<li id="p' + id + '">' +
                        '<span>' + cname + '</span>' +
                        '<div ' + disp + '>' + cobj + '</div>' +
                    '</li>';
                    $("#allcate").append(html);
                });
                list.selectCate(list.selectId);
            }
        });
    },
    listInfo: function (page) {
        $("#pageNav").html("");
        $("#pageNav").hide();
        if (list.selectId == 0) {
            //全部分类查询 没有带分类
            $.ajax({
                type: "POST",
                url: "AlbumUI.axd",
                data: {
                    action: "AllCatalogAlbumPage",
                    showOrder: order,
                    page: page,
                    pageSize: 10,
                    dateCond: "",
                    htmlFile: "/WebUI/XML/list_" + order + ".xml"
                },
                dataType: "xml", 
                complete: function () {
                    var _vmain = $('.video_main');
                    for (var i = 0; i < _vmain.length; i++) {
                        if (_vmain.eq(i).attr("p") != "0") {
                            _vmain.eq(i).find(".locking").remove();
                            _vmain.eq(i).find(".playd").show();
                        }
                        if (_vmain.eq(i).attr("rels") == "1") {
                            list.showFile(_vmain.eq(i).attr("rel"), 1);
                        } else {
                            list.showFile(_vmain.eq(i).attr("rel"));
                        }
                        if (_vmain.eq(i).attr("rels") == "1") {
                            _vmain.eq(i).find(".locking").attr("href", "detailScreen.aspx?id=" + _vmain.eq(i).attr("rel"));
                            _vmain.eq(i).find(".playd").attr("href", "detailScreen.aspx?id=" + _vmain.eq(i).attr("rel"));
                        } else {
                            _vmain.eq(i).find(".locking").attr("href", "detail.aspx?id=" + _vmain.eq(i).attr("rel"));
                            _vmain.eq(i).find(".playd").attr("href", "detail.aspx?id=" + _vmain.eq(i).attr("rel"));
                        }
                    }
                    if (_totalPage == 1) {
                        $('#pageNav').hide();
                    } else {
                        $('#pageNav').show();
                    }
                },
                success: function (data) {
                    $("#center").html($(data).find("Content").text());
                    _totalPage = $(data).find("TotalPage").text();
                    $("#pageNav").pager2({ pagenumber: page, pagecount: _totalPage, buttonPageCallback: buttonPageClick, prev: '上一页', next: '下一页' });
                }
            });
        } else {
            //分类查询
            $.ajax({
                type: "POST",
                url: "AlbumUI.axd",
                data: {
                    action: "GetAlbumByCatalogPage",
                    showOrder: order,
                    page: page,
                    pageSize: 10,
                    catalogid: list.selectId,
                    dateCond: "",
                    htmlFile: "/WebUI/XML/list_" + order + ".xml"
                },
                dataType: "xml", 
                complete: function () {
                    var _vmain = $('.video_main');
                    for (var i = 0; i < _vmain.length; i++) {
                        if (_vmain.eq(i).attr("p") != "0") {
                            _vmain.eq(i).find(".locking").remove();
                            _vmain.eq(i).find(".playd").show();
                        }
                        if (_vmain.eq(i).attr("rels") == "1") {
                            list.showFile(_vmain.eq(i).attr("rel"), 1);
                        } else {
                            list.showFile(_vmain.eq(i).attr("rel"));
                        }
                        if (_vmain.eq(i).attr("rels") == "1") {
                            _vmain.eq(i).find(".locking").attr("href", "detailScreen.aspx?id=" + _vmain.eq(i).attr("rel"));
                            _vmain.eq(i).find(".playd").attr("href", "detailScreen.aspx?id=" + _vmain.eq(i).attr("rel"));
                        } else {
                            _vmain.eq(i).find(".locking").attr("href", "detail.aspx?id=" + _vmain.eq(i).attr("rel"));
                            _vmain.eq(i).find(".playd").attr("href", "detail.aspx?id=" + _vmain.eq(i).attr("rel"));
                        }
                    }
                    if (_totalPage == 1) {
                        $('#pageNav').hide();
                    } else {
                        $('#pageNav').show();
                    }
                },
                success: function (data) {
                    $("#center").html($(data).find("Content").text());
                    _totalPage = $(data).find("TotalPage").text(); 
                    $("#pageNav").pager2({ pagenumber: page, pagecount: _totalPage, buttonPageCallback: buttonPageClick, prev: '上一页', next: '下一页' });
                }
            });
        }
    },
    selectCate: function (id) {
        list.selectId = id;
        $("#allcate p").removeClass("e");
        if ($("#c" + list.selectId).length > 0) {
            $("#c" + list.selectId).parent().addClass("e");
            //            $("#c" + list.selectId).parent().parent().show();
            $("#c" + list.selectId).parent().parent().parent().addClass("e");
        } else {
            $("#p" + list.selectId).addClass("e");
            //            $("#p" + list.selectId + ">div").show();
        }
        list.listInfo(1);
    },
    showFile: function (id, s) {
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "GetAlbumInfo",
                id: id
            },
            dataType: "xml",
            //                complete: function () {
            //                    $(".nano").nanoScroller();
            //                    if ($("#content_" + id + ">li").eq(0).text() == "") {
            //                        $("#content_" + id + ">li").hide();
            //                    }
            //                },
            success: function (data) {
                var AlbumId = $(data).find("AlbumId").text();
                var isPms = $(data).find("IsPms").text();
                var Percentage = $(data).find("Percentage").text();
                var C_FileCount = $(data).find("C_FileCount").text();
                if (isPms == 0) {
                    C_FileCount = Math.ceil(C_FileCount * (Percentage / 100));
                }

                $(data).find("Files").each(function () {
                    $(this).find("Item").each(function (j) {
                        var C_Name = $(this).children("C_Name").text();
                        var C_Id = $(this).children("C_Id").text();
                        var url = "detail.aspx?id=" + AlbumId + "&fid=" + C_Id;
                        if (s) {
                            url = "detailScreen.aspx?id=" + AlbumId + "&fid=" + C_Id;
                        }
                        if (j < C_FileCount) {
                            $("#video_middle_" + id).append('<li><a href="' + url + '" target="_blank" class="plays"></a><a href="' + url + '" target="_blank">' + C_Name + '</a></li>');
                        } else {
                            $("#video_middle_" + id).append('<li><a href="javascript://">' + C_Name + '</a></li>');
                        }
                    });
                });
                //                $("#video_middle_" + id).html($(data).find("Content").text());
                //                if (s) {
                //                    $("#video_middle_" + id).find("a").each(function () {
                //                        var href = $(this).attr("href");
                //                        href = href.replace("detail", "detailScreen");
                //                        $(this).attr("href", href);
                //                    })
                //                }
            }
        });
    },
    stretch: function (id) {
        var pp = $("#video_middle_" + id);
        pp = pp.parent().parent().parent().parent();
        $(".video_middle").slideUp(600);
        if (pp.is(":visible")) {
            pp.slideUp(600);
        }
        else {
            pp.slideDown(600, function () {
                $("#nano2_" + id).nanoScroller();
            });
        }
    },
    maxHostInfo: function () {
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "AllCatalogAlbumPage",
                showOrder: "0",
                page: 1,
                pageSize: 9,
                dateCond: "",
                htmlFile: "/WebUI/XML/newHost.xml"
            },
            dataType: "xml",
            success: function (data) {
                $("#newhost").html($(data).find("Content").text());
            }
        });
    }
}

buttonPageClick = function (e) {
    $("#pageNav").pager2({ pagenumber: parseInt(e), pagecount: _totalPage, buttonPageCallback: buttonPageClick });
    list.listInfo(e);
}
//添加读者推荐量
function addRes(id) {
    $.ajaxExtend({
        type: "POST",
        url: "AlbumUI.axd",
        data: {
            action: "RsOperating",
            type: "2",
            albumId: id
        },
        dataType: 'text',
        success: function (data) {
            $("#link_" + id).text(data);
        }
    });
}