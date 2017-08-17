/// <reference path="jquery-1.4.1.min.js" />
/// <reference path="jquery-expand.js" />
var _totalPage = 0;
//分类
var catalogid = "";
var fields = "";
var fieldValue = "";
var dictCond = new Dictionary();
dictCond.put("全部", "c_title,c_description");
dictCond.put("名称", "c_title");
dictCond.put("简介", "c_description");

var totalCount = -1;
var search = {
    load: function () {
        fieldValue = $.getUrlParam("a");
        if (fieldValue == "" || fieldValue == null || fieldValue == "请输入您要检索的关键词") {
            $.Alert.Warning({ content: '请输入您要检索的关键词' });
            return;
        }
        else if (validateString(fieldValue)) {
            $.Alert.Warning({ content: '您输入的关键词中含有非法字符', width: 350 });
            return;
        }
        else {
            $('#search').val(fieldValue);
            $("#search").addClass("current");
        }
        fields = $.getUrlParam("b"); 
        if ($.getUrlParam("b") == null) {
            fields = "c_title,c_description";
        } else {
            fields = dictCond.get(fields);
        } 
        search.searchInfo(1);
        search.getCatalog();
    },
    searchInfo: function (page) {
        $('#pageNav').hide();
        var size = 0;
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "SearchAlbum",
                showOrder: 3,
                page: page,
                pageSize: 15,
                catalogid: catalogid,
                fields: fields,
                fieldValue: fieldValue,
                htmlFile: "/WebUI/XML/search.xml"
            },
            dataType: "xml",
            beforeSend: function () {
                $("#center").tispLoad();
            },
            complete: function () {
                if (_totalPage == 0) {
                    $("#center").tispWarning();
                }
                var _vmain = $('.video_main');
                for (var i = 0; i < _vmain.length; i++) {
                    if (_vmain.eq(i).attr("p") != "0") {
                        _vmain.eq(i).find(".locking").remove();
                        _vmain.eq(i).find(".playd").show();
                    }
                    if (_vmain.eq(i).attr("rels") == "1") {
                        search.showFile(_vmain.eq(i).attr("rel"), 1);
                    } else {
                        search.showFile(_vmain.eq(i).attr("rel"));
                    }
                    if (_vmain.eq(i).attr("rels") == "1") {
                        _vmain.eq(i).find(".locking").attr("href", "detailScreen.aspx?id=" + _vmain.eq(i).attr("rel"));
                        _vmain.eq(i).find(".playd").attr("href", "detailScreen.aspx?id=" + _vmain.eq(i).attr("rel"));
                    } else {
                        _vmain.eq(i).find(".locking").attr("href", "detail.aspx?id=" + _vmain.eq(i).attr("rel"));
                        _vmain.eq(i).find(".playd").attr("href", "detail.aspx?id=" + _vmain.eq(i).attr("rel"));
                    }
                }
                if (size == 1) {
                    $(".video_middle").slideDown(600, function () {
                        $(".nano").nanoScroller();
                    });
                }
            },
            success: function (data) {
                $("#center").html($(data).find("Content").text());
                size = $(data).find("Rowcount").text();
                _totalPage = $(data).find("TotalPage").text();
                $('.search_p').html("共检索到<span>\"" + fieldValue + "\"</span>相关内容<span style='color:red;'>" + $(data).find("Rowcount").text() + "</span>条");
                if (totalCount == -1) {
                    totalCount = $(data).find("Rowcount").text();
                    $(".column>h2").html("全部分类（" + totalCount + "）");
                }
                if (_totalPage == 0) {
                    $('#pageNav').hide();
                    $("#content").tispWarning({ top: 120 });
                }
                else if (_totalPage == 1) {
                    $('#pageNav').hide();
                } else {
                    $('#pageNav').show();
                }
                $("#pageNav").pager2({ pagenumber: page, pagecount: _totalPage, buttonPageCallback: buttonPageClick, prev: '上一页', next: '下一页' });
            }
        });
    },
    getCatalog: function () {
        //加载分类
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "GetCatalog",
                top: 0,
                showOrder: 1
            },
            dataType: "xml",
            complete: function () {
                $("#allcate>li").click(function () {
                    $("#allcate>li").removeClass("e");
                    $(this).addClass("e");
                    catalogid = $(this).attr("id");
                    search.searchInfo(1);
                });
                $('#allcate>li').each(function () {
                    var cid = $(this).attr("id");
                    searchCount(cid, $(this));
                });
            },
            success: function (data) { 
                $(data).find("Template").each(function () {
                    var html = "";
                    $(this).children("Item").each(function (i) {
                        html = "";
                        var name = $(this).children("Name").text();
                        var parentid = $(this).children("Id").text();
                        html += '<li id="' + parentid + '"><i style="display:none">10</i><img src="WebUI/control/imgloading/imgloading.gif" /><span>' + name + '</span></li>';
                        $('#allcate').append(html);
                    });
                });
            }
        });
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
            success: function (data) {
                //$("#video_middle_" + id).html($(data).find("Content").text());
                var AlbumId = $(data).find("AlbumId").text();
                var isPms = $(data).find("IsPms").text();
                var Percentage = $(data).find("Percentage").text();
                var C_FileCount = $(data).find("C_FileCount").text();
                if (isPms == 0) {
                    Percentage = Math.ceil(C_FileCount * (Percentage / 100));
                }

                $(data).find("Files").each(function () {
                    $(this).find("Item").each(function (j) {
                        var C_Name = $(this).children("C_Name").text();
                        var C_Id = $(this).children("C_Id").text();
                        var url = "detail.aspx?id=" + AlbumId + "&fid=" + C_Id;
                        if (s) {
                            url = "detailScreen.aspx?id=" + AlbumId + "&fid=" + C_Id;
                        }
                        if (j < Percentage) {
                            $("#video_middle_" + id).append('<li><a href="' + url + '" target="_blank" class="plays"></a><a href="' + url + '" target="_blank">' + C_Name + '</a></li>');
                        } else {
                            $("#video_middle_" + id).append('<li><a href="javascript://">' + C_Name + '</a></li>');
                        }
                    });
                });
            }
        });
    }
}
function stretch(id) {
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
}
function searchCount(cid, target) {
    if (fieldValue != "") {
        var id = $(this).attr("id");
        $.ajax({
            type: "POST",
            url: "AlbumUI.axd",
            data: {
                action: "SearchAlbumCount",
                catalogid: cid,
                fields: fields,
                fieldValue: fieldValue
            },
            dataType: 'text',
            success: function (data) {
                target.find("i").show();
                target.find("i").text(data);
                target.find("img").hide();
            }
        });
    }
}
buttonPageClick = function (e) {
    $("#pageNav").pager2({ pagenumber: parseInt(e), pagecount: _totalPage, buttonPageCallback: buttonPageClick, prev: '上一页', next: '下一页' });
    search.searchInfo(e);
} 