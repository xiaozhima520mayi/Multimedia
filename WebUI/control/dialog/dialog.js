/// <reference path="jquery-1.4.1.min.js" />
(function () {
    var setting = {
        title: "温馨提示",
        content: "您确定要删除",
        width: 300,
        height: 150,
        Ok: {
            IsShow: true,
            Callback: null,
            Name: "确定"
        },
        Cancel: {
            IsShow: false,
            Callback: null,
            Name: "取消"
        }
    };
    $.extend({
        Alert: {
            Success: function (alertSetting) {
                Merger(alertSetting);
                dialog(setting.content, setting.width, setting.height, "box_success", setting.title, setting.Ok, setting.Cancel)
            },
            Error: function (alertSetting) {
                Merger(alertSetting);
                dialog(setting.content, setting.width, setting.height, "box_error", setting.title, setting.Ok, setting.Cancel)
            },
            Confirm: function (alertSetting) {
                Merger(alertSetting);
                dialog(setting.content, setting.width, setting.height, "box_confirm", setting.title, setting.Ok, setting.Cancel)
            },
            Warning: function (alertSetting) {
                Merger(alertSetting);
                dialog(setting.content, setting.width, setting.height, "box_ico", setting.title, setting.Ok, setting.Cancel)
            }
        }
    });
    function dialog(content, width, height, icoCss, title, Ok, Cancel) {
        var _box = document.createElement("div");
        _box.setAttribute("tabindex", "true");
        _box.className = "box_dialog";
        _box.style.width = width + "px";
        _box.style.height = height + "px";
        _box.style.zIndex = 399999999;
        var tops = ((document.documentElement.clientHeight / 2) - (height / 2));
        var lefts = (document.documentElement.clientWidth / 2) - (width / 2);
        var ie6 = ! -[1, ] && !window.XMLHttpRequest;
        if (!ie6)
            _box.style.top = tops + "px";
        _box.style.left = lefts + "px";
        var _box_title = document.createElement("div");
        _box_title.className = "box_title";
        var _box_close = document.createElement("a");
        _box_close.className = "box_close";
        _box_close.href = "javascript://";
        _box_close.onclick = function () {
            _box.parentNode.removeChild(_box);
            _iframe.parentNode.removeChild(_iframe);
            _maskDiv.parentNode.removeChild(_maskDiv);
        }
        var _box_prompt = document.createElement("p");
        _box_prompt.className = "box_prompt";
        _box_prompt.innerHTML = title;
        _box_title.appendChild(_box_close);
        _box_title.appendChild(_box_prompt);
        var _bounc_con = document.createElement("div");
        _bounc_con.className = "bounc_con";
        var _box_content = document.createElement("div");
        _box_content.className = "box_content";
        var _box_ico = document.createElement("span");
        _box_ico.className = icoCss;
        var _box_directions = document.createElement("p");
        _box_directions.className = "box_directions";
        _box_content.appendChild(_box_ico);
        _box_content.appendChild(_box_directions);
        _box_directions.innerHTML = content;
        var _fclear = document.createElement("div");
        _fclear.className = "fclear";

        var _iframe = document.createElement("iframe");
        _iframe.frameBorder = "0";
        _iframe.style.cssText = "opacity:0;filter:alpha(opacity=0);position:absolute;top:0;left:0;height:" + document.documentElement.scrollHeight + "px;width:" + document.documentElement.scrollWidth + "px;z-index:199999999";

        var _maskDiv = document.createElement("div");
        _maskDiv.style.cssText = "opacity:0.5;filter:alpha(opacity=50);position:absolute;top:0;left:0;background:#000;height:" + document.documentElement.scrollHeight + "px;width:" + document.documentElement.scrollWidth + "px;z-index:299999999";

        var _box_bottom = document.createElement("div");

        _box_bottom.className = "box_bottom";
        var _no = document.createElement("a");
        _no.className = "no";
        _no.innerHTML = Cancel.Name;
        var _yes = document.createElement("a");
        _yes.className = "yes";
        _yes.innerHTML = Ok.Name;
        _yes.onclick = function () {
            if (Ok.Callback)
                Ok.Callback();
            _box.parentNode.removeChild(_box);
            _iframe.parentNode.removeChild(_iframe);
            _maskDiv.parentNode.removeChild(_maskDiv);
        }

        _no.onclick = function () {
            _box.parentNode.removeChild(_box);
            _iframe.parentNode.removeChild(_iframe);
            _maskDiv.parentNode.removeChild(_maskDiv);
        }
        var _fclears = document.createElement("div");
        _fclears.className = "fclear";
        _bounc_con.appendChild(_box_content);
        _bounc_con.appendChild(_fclear);
        _bounc_con.appendChild(_box_bottom);
        if (Ok.IsShow) {
            _box_bottom.appendChild(_yes);
        }
        if (Cancel.IsShow) {
            _box_bottom.appendChild(_no);
        }
        _bounc_con.appendChild(_fclears);
        _box.appendChild(_box_title);
        _box.appendChild(_bounc_con);
        document.body.appendChild(_box);
        document.body.appendChild(_iframe);
        document.body.appendChild(_maskDiv);
        _box.focus();
    }
    function Merger(newSetting) {
        var settingOk = setting.Ok;
        var settingCancel = setting.Cancel;
        if (newSetting) {
            if (newSetting.Ok) {
                settingOk = $.extend(setting.Ok, newSetting.Ok);
            }
            if (newSetting.Cancel) {
                settingCancel = $.extend(setting.Cancel, newSetting.Cancel);
            }
        }
        setting = $.extend(setting, newSetting);
        setting.Ok = settingOk;
        setting.Cancel = settingCancel;
    }
})();