/// <reference path="jquery-1.4.1.min.js" />
(function () {
    var setting = {
        tispCmd: "load",
        content: "数据努力加载中，请稍等。",
        width: 180,
        top: 10,
        isEmpty: true
    };
    $.fn.tispLoad = function (newSetting) {
        var newSettingg = $.extend({},setting, newSetting);
        newSettingg.tispCmd = "load";
        Tisp(this, newSettingg);
        this.tispLoadClose = function () {
            this.o.remove();
        }
        return this;
    }
    $.fn.tispWarning = function (newSetting) {
        var newSettingg = $.extend({}, setting, newSetting);
        newSettingg.tispCmd = "warning";
        if (newSettingg.content == "数据努力加载中，请稍等。") {
            newSettingg.content = "没有更多了！";
        }
        Tisp(this, newSettingg);
        this.tispWarningClose = function () {
            this.o.remove();
        }
        return this;
    }
    function Tisp(obj, newSetting) {
        if (newSetting.isEmpty) {
            obj.html("");
        }
        if (obj.css("position") == "static")
            obj.css("position", "relative");
        var _prompt = $("<div />").addClass("prompt").width(newSetting.width);
        var topV = 0;
        _prompt.css({ "left": ((obj.width() - (newSetting.width+36)) / 2) + "px", top: (newSetting.top == 0 ? "0" : newSetting.top + "px") });
        var _span = $("<span />").addClass(newSetting.tispCmd);
        var _content = $("<div />").width(newSetting.width - 70);
        _content.html(newSetting.content);
        _prompt.append(_span).append(_content);
        obj.o = _prompt;
        obj.append(_prompt);
    }
})();