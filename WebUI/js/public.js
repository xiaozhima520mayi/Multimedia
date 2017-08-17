(function ($) {
    $.ajaxExtend = function (options) {
        $.ajax({
            type: "POST",
            url: "Users.axd",
            data: {
                action: "validata"
            },
            dataType: "text",
            complete: function () {
                $.ajax({
                    type: options.type,
                    url: options.url,
                    data: options.data,
                    beforeSend: options.beforeSend,
                    complete: options.complete,
                    success: options.success
                });
            },
            success: function (data) {
                if (data == "0") {
                    location.href = "/PC/login.aspx";
                }
            }
        });
    }
}(jQuery));

function Dictionary() {
    this.data = new Array();
    this.put = function (key, value) {
        this.data[key] = value;
    };
    this.get = function (key) {
        return this.data[key];
    };
    this.remove = function (key) {
        this.data[key] = null;
    };
    this.isEmpty = function () {
        return this.data.length == 0;
    };
    this.size = function () {
        return this.data.length;
    };
}

function validateString(fieldValue) {
    fieldValue = fieldValue.replace(/^\s+|\s+$/g, "");
    if (fieldValue.indexOf('&') != -1 ||
    fieldValue.indexOf('#') != -1 ||
    fieldValue.indexOf("'") != -1 ||
    fieldValue.indexOf("%") != -1 ||
    fieldValue.indexOf("<") != -1 ||
    fieldValue.indexOf(">") != -1) {
        return true;
    }
    return false;
}

function getIFrameDOM(id) {
    var ofrm1 = document.getElementById(id).document;
    if (ofrm1 == undefined) {
        ofrm1 = document.getElementById(id).contentWindow.document;
    }
    else {
        ofrm1 = document.frames[id].document;
    }
    return ofrm1;
}