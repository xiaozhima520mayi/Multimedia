/// <reference path="../jquery-1.4.1.min.js" />
function imgloadimg(obj, parent,mode,wh) {
    /// <summary>图片加载缩略图</summary>
    /// <param name="obj" type="jqueryObj">元素</param>
    /// <param name="parent" type="int">父窗体层级默认为2</param>
    /// <param name="mode" type="int">1：填充，2：缩放，默认为1</param>
    /// <param name="wh" type="string">200_100</param>
    var putObj = obj;
    if (obj.get(0).tagName.toLowerCase() == "img") {
        putObj = obj.parent();
        obj.hide();
    }
    obj.get(0).onload = null;
    var Container;
    if (parent == undefined) {
        Container = obj.parent().parent();
    } else {
        Container = obj;
        for (var i = 0; i < parent; i++) {
            Container = Container.parent();
        }
    }
    var paddWidth = Container.innerWidth() - Container.width();
    var paddHeight = Container.innerHeight() - Container.height();
    var _ddposition = $("<div />").addClass("imgloadimg").height(Container.height()).width(Container.width());
    var position = 0;
    if (Container.css("position") == "static") {
        Container.css("position", "relative");
        position = 1;
    }
    _ddposition.css("z-Index", "11111");
    Container.append(_ddposition);
    var imgload = new Image();
    imgload.src = obj.attr("rel") + "?r=" + Math.random();
    imgload.onload = function () {
        if (position == 1)
            Container.css("position", "static");
        var img;
        if (obj.get(0).tagName.toLowerCase() == "img") {
            img = obj;
            img.show();
        } else {
            img = $("<img />");
            putObj.append(img);
        }
        img.attr("src", this.src);
        var cwidth = Container.innerWidth() - paddWidth, cheight = Container.innerHeight() - paddHeight;
        if (wh != null) {
            var sp = wh.split('_');
            cwidth = parseInt(sp[0]);
            cheight = parseInt(sp[1]);
        }
        var xy = (mode == undefined || mode == 1) ? zoomscreent(this.width, this.height, cwidth, cheight) : zoom(this.width, this.height, cwidth, cheight);
        img.width(xy.w);
        img.height(xy.h);
        img.css({ "margin-top": xy.t, "margin-left": xy.l });
        _ddposition.remove();
    }
}
function zoom(orgw, orgh, w, h) {
    var gss = { cw: w, ch: h };
    if (orgw <= gss.cw && orgh <= gss.ch) {
        return { w: orgw, h: orgh, t: ((gss.ch - orgh) / 2) + "px", l: ((gss.cw - orgw) / 2) + "px" };
    } else if (orgw > gss.cw && orgh > gss.ch) {
        var hh = gss.ch;
        var ww = (orgw * (gss.ch) / orgh);
        if (ww > gss.cw) {
            var ow = ww;
            ww = gss.cw;
            hh = (hh * (gss.cw) / ow);
        }
        return { w: ww, h: hh, p: parseInt(((hh / orgh) * 100)), t: (((gss.ch - hh) / 2) + "px"), l: (((gss.cw - ww) / 2) + "px") };
    } else if (orgw >= gss.cw && orgh <= gss.ch) {
        var hh = (orgh * (gss.cw) / orgw);
        var ww = gss.cw; // (w * (gss.ch) / h);
        return { w: ww, h: hh, p: parseInt(((hh / orgh) * 100)), t: (((gss.ch - hh) / 2) + "px"), l: 0 };
    }
    else if (orgw <= gss.cw && orgh >= gss.ch) {
        var hh = gss.ch;
        var ww = (orgw * (gss.ch) / orgh);
        return { w: ww, h: hh, p: parseInt(((hh / orgh) * 100)), t: 0, l: (((gss.cw - ww) / 2) + "px") };
    }
}
function zoomscreent(orgw, orgh, w, h) {
    var gss = { cw: w, ch: h };
    if ((orgw / gss.cw) > (orgh / gss.ch)) {
        var hh = gss.ch;
        var ww = (orgw * (gss.ch) / orgh);
        return { w: ww, h: hh, t: 0, l: (((gss.cw - ww) / 2) + "px") };
    } else {
        var ww = gss.cw;
        var hh = (orgh * (gss.cw) / orgw);
        return { w: ww, h: hh, t: (((gss.ch - hh) / 2) + "px"), l: 0 };
    }


//    if (orgw <= gss.cw && orgh <= gss.ch) {
//        return { w: orgw, h: orgh, t: ((gss.ch - orgh) / 2) + "px", l: ((gss.cw - orgw) / 2) + "px" };
//    } else if (orgw > gss.cw && orgh > gss.ch) {
//        if (orgw > orgh) {
//            var hh = gss.ch;
//            var ww = (orgw * (gss.ch) / orgh);
//            return { w: ww, h: hh, t: 0, l: (((gss.cw - ww) / 2) + "px") };
//        } else {
//            var ww = gss.cw;
//            var hh = (orgh * (gss.cw) / orgw);
//            return { w: ww, h: hh, t: (((gss.ch - hh) / 2) + "px"), l: 0 };
//        }
//    } else if (orgw >= gss.cw && orgh <= gss.ch) {
//        return { w: orgw, h: orgh, t: (((gss.ch - orgh) / 2) + "px"), l: (((gss.cw - orgw) / 2) + "px") };
//    } else if (orgw <= gss.cw && orgh >= gss.ch) {
//        return { w: orgw, h: orgh, t: (((gss.ch - orgh) / 2) + "px"), l: (((gss.cw - orgw) / 2) + "px") };
//    }
}