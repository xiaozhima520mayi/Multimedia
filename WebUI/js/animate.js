/// <reference path="jquery-1.4.1.min.js" />
$(function () {
    /*头部全部分类移上去展开效果*/
    $(".nav_list li").find(".all").mouseover(function () {
        $(".subnav_all").slideDown();
    })
    var $pp;
    $(".subnav_all").mouseover(function () {
        $pp = $(this);
        $pp.stop(true, true).slideDown();
    }).mouseleave(function () {
        $pp.stop(true, true).slideUp();
    })
    /*********************************检索区域*****************************************************/
    $(".se_l li").mousemove(function () {
        $(this).addClass("e").siblings("li").removeClass("e");
        $(this).click(function () {
            var htmls = $(this).html();
            $(".se_l p").html(htmls);
            $(".se_l ul").slideUp();
        })
    });
    var times;
    $(".se_l").mouseover(function () {
        clearTimeout(times);
        $(".se_l ul").slideDown();
    }).mouseleave(function () {
        times = setTimeout(function () {
            $(".se_l ul").slideUp();
        }, 900)
    });

    $(".se_m input").focus(function () {
        if ($(this).val() == this.defaultValue) {
            $(this).val("");
            $(this).addClass("current");
        }
    }).blur(function () {
        if ($(this).val() == "") {
            $(this).val(this.defaultValue);
            $(this).removeClass("current");
        }
    })

    /*****************************************二级列表页area*****************************************/
    /*左侧导航列表*/
    $(".tabulation li>span").click(function () {
        $(this).parent("li").addClass("e").siblings("li").removeClass("e");
        var $mm = $(this).siblings("div");
        $(".tabulation").find("span").siblings("div").slideUp();
        var pid = $(this).parent().attr("id").replace("p", "");
        list.selectCate(pid);
        if ($mm.is(":visible")) {
            $mm.slideUp();
        }
        else {
            $mm.slideDown();
        }
    })
    /*右*/
    $(".opened").click(function () {
        var $dd;
        $dd = $(this).parent(".video_top").siblings(".video_middle");
        $(".opened").parent(".video_top").siblings(".video_middle").slideUp(600);
        if ($dd.is(":visible")) {
            $dd.slideUp(600);
        }
        else {
            $dd.slideDown(600);
        }
        $(this).parents(".video_main").addClass("reds").siblings(".video_main").removeClass("reds");
        $("#nano").nanoScroller();
        $("#nano2").nanoScroller();
    })
})

function shink() {
    /*********************************精品推荐移上去效果*****************************************************/
    var mm;
    $(".small li").mouseover(function () {
        mm = $(this).find(".tab_course_shink");
        mm.stop(false, false).animate({
            top: 0,
            opacity: 1
        }, 160)
    }).mouseleave(function () {
        mm.stop(false, false).animate({
            top: 220 + "px",
            opacity: 0
        }, 250)
    })
}

function languageInfo() {
    /*********************************多语种*****************************************************/
    $(".big li").mouseover(function () {
        mm = $(this).find(".tab_course_shink");
        mm.stop(false, false).animate({
            top: 225 + "px"
        }, 160)
    }).mouseleave(function () {
        mm.stop(false, false).animate({
            top: 272 + "px"
        }, 250)
    })

    $(".small2 li").mouseover(function () {
        mm = $(this).find(".tab_course_shink");
        mm.stop(false, false).animate({
            top: 0,
            opacity: 1
        }, 120)
    }).mouseleave(function () {
        mm.stop(false, false).animate({
            top: 186 + "px",
            opacity: 0
        }, 250)
    })
}

//获取ID
function getById(acre) {
    return document.getElementById(acre);
}

//获取ClassName
function getByclass(trav_all) {
    var ele = []; all = document.getElementsByTagName("*");
    for (var i = 0; i < all.length; i++) {
        if (all[i].className == trav_all) {
            ele[ele.length] = all[i];
        }
    }
    return ele;
}
//移动
function move(t, b, c, d) { return c * (t /= d) * t + b; };
function getChildNodes(banner_main) {
    var aaa = banner_main.childNodes;
    for (var i = 0; i < aaa.length; i++) {
        if (aaa[i].tagName == "UL") {
            return aaa[i];
        }
    }
}
/*精品推荐切换*/
function ImageScroll(leftAcre, rigthAcre, g, longs, allLong) {
    var isRigth = false, isLeft = false;
    var gs = getById("g");
    var aaaa = gs.getElementsByTagName("li");
    var aa_length = aaaa.length;
//    //内容项 大于等于4才出现左右箭头
//    var itemLen = $(".gg>li").length;
//    if (itemLen<=3) {
//        leftAcre.style.display = "none";
//        rigthAcre.style.display = "none";
//    }
    leftAcre.onclick = function () {
        document.selection && document.selection.empty && (document.selection.empty(), 1) || window.getSelection && window.getSelection().removeAllRanges();
        if (isLeft == true) return;
        var t = 0, d = 30;
        var scrollleft = g.scrollLeft;
        function Run() {
            g.scrollLeft = Math.ceil(move(t, scrollleft, (-longs), d));
            isLeft = true;
            if (t < d) {
                t++; setTimeout(Run, 10);
            } else {
                isLeft = false;
            }
        }
        Run();
    }
    rigthAcre.onmousedown = function () {
        document.selection && document.selection.empty && (document.selection.empty(), 1) || window.getSelection && window.getSelection().removeAllRanges();
    }
    rigthAcre.onmouseup = function () {
        document.selection && document.selection.empty && (document.selection.empty(), 1) || window.getSelection && window.getSelection().removeAllRanges();
    }
    rigthAcre.onclick = function () {
        document.selection && document.selection.empty && (document.selection.empty(), 1) || window.getSelection && window.getSelection().removeAllRanges();
        if (isRigth == true) return;
        var t = 0, d = 30;
        var scrollleft = g.scrollLeft;
        function Run() {
            isRigth = true;
            g.scrollLeft = Math.ceil(move(t, scrollleft, (longs), d));
            if (t < d) {
                t++; setTimeout(Run, 10);
            } else {
                isRigth = false;
            }


        }
        Run();
    }
}
/*头部全部分类切换*/
function ImageScroll2(leftAcre, rigthAcre, g, longs, allLong) {
    var isRigth = false, isLeft = false;
    var gs = getById("gg");
    var aaaa = gs.getElementsByTagName("li");
    var aa_length = aaaa.length;
      //内容项 大于等于6才出现左右箭头
       //var itemLen = $(".gg>li").length;
       //if (itemLen<=4) {
        //   leftAcre.style.display = "none";
   //  rigthAcre.style.display = "none";
    //   }
    leftAcre.onclick = function () {
        document.selection && document.selection.empty && (document.selection.empty(), 1) || window.getSelection && window.getSelection().removeAllRanges();
        if (isLeft == true) return;
        var t = 0, d = 30;
        var scrollleft = g.scrollLeft;
        function Run() {
            g.scrollLeft = Math.ceil(move(t, scrollleft, (-longs), d));
            isLeft = true;
            if (t < d) {
                t++; setTimeout(Run, 10);
            } else {
                isLeft = false;
            }
        }
        Run();
    }
    rigthAcre.onmousedown = function () {
        document.selection && document.selection.empty && (document.selection.empty(), 1) || window.getSelection && window.getSelection().removeAllRanges();
    }
    rigthAcre.onmouseup = function () {
        document.selection && document.selection.empty && (document.selection.empty(), 1) || window.getSelection && window.getSelection().removeAllRanges();
    }
    rigthAcre.onclick = function () {
        document.selection && document.selection.empty && (document.selection.empty(), 1) || window.getSelection && window.getSelection().removeAllRanges();
        if (isRigth == true) return;
        var t = 0, d = 30;
        var scrollleft = g.scrollLeft;
        function Run() {
            isRigth = true;
            g.scrollLeft = Math.ceil(move(t, scrollleft, (longs), d));
            if (t < d) {
                t++; setTimeout(Run, 10);
            } else {
                isRigth = false;
            }


        }
        Run();
    }
}
/*播放页相关内容切换*/
function ImageScroll3(leftAcre, rigthAcre, g, longs, allLong) {
    var isRigth = false, isLeft = false;
    var gs = getById("gg");
    var aaaa = gs.getElementsByTagName("li");
    var aa_length = aaaa.length;
    leftAcre.onclick = function () {
        document.selection && document.selection.empty && (document.selection.empty(), 1) || window.getSelection && window.getSelection().removeAllRanges();
        if (isLeft == true) return;
        var t = 0, d = 30;
        var scrollleft = g.scrollLeft;
        function Run() {
            g.scrollLeft = Math.ceil(move(t, scrollleft, (-longs), d));
            isLeft = true;
            if (t < d) {
                t++; setTimeout(Run, 10);
            } else {
                isLeft = false;
            }
        }
        Run();
    }
    rigthAcre.onmousedown = function () {
        document.selection && document.selection.empty && (document.selection.empty(), 1) || window.getSelection && window.getSelection().removeAllRanges();
    }
    rigthAcre.onmouseup = function () {
        document.selection && document.selection.empty && (document.selection.empty(), 1) || window.getSelection && window.getSelection().removeAllRanges();
    }
    rigthAcre.onclick = function () {
        document.selection && document.selection.empty && (document.selection.empty(), 1) || window.getSelection && window.getSelection().removeAllRanges();
        if (isRigth == true) return;
        var t = 0, d = 30;
        var scrollleft = g.scrollLeft;
        function Run() {
            isRigth = true;
            g.scrollLeft = Math.ceil(move(t, scrollleft, (longs), d));
            if (t < d) {
                t++; setTimeout(Run, 10);
            } else {
                isRigth = false;
            }


        }
        Run();
    }
}