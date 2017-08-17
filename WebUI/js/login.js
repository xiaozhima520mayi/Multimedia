$(function () {
    $.ajax({
        type: "POST",
        url: "AlbumUI.axd",
        data: {
            action: "GetSchool"
        },
        dataType: "json",
        success: function (data) {
            if (data.isPms == "0") {
                $('#spanIp').text(data.ip);
            } else {
                $('.login_bottom').html("");
            }
        }
    });

    $("#txtUserName").focus(function () {
        if ($(this).val() == this.defaultValue) {
            $(this).addClass("sizeColor");
            $(this).val("");
        }
    }).blur(function () {
        if ($(this).val() == "") {
            $(this).removeClass("sizeColor");
            $(this).val(this.defaultValue);
        }
    });
    $("#txtUserPwd").focus(function () {
        if ($(this).val() == "请输入密码") {
            $("#txtUserPwd").hide();
            $("#txtUserPwd2").show();
            $("#txtUserPwd2").addClass("sizeColor");
            $("#txtUserPwd2").focus();
        }
    });

    $("#txtUserPwd2").blur(function () {
        if ($(this).val() == "") {
            $("#txtUserPwd2").hide();
            $("#txtUserPwd").show();
            $("#txtUserPwd2").removeClass("sizeColor");
            $("#txtUserPwd").val("请输入密码");
        }
    });

    document.getElementById("txtUserPwd").onkeypress = function (e) {
        e = window.event || e;
        if (e.keyCode == 13) {
            $("#btnLogin").click();
            return false;
        }
    };

    document.getElementById("txtUserPwd2").onkeypress = function (e) {
        e = window.event || e;
        if (e.keyCode == 13) {
            $("#btnLogin").click();
            return false;
        }
    };

    $("#btnLogin").click(function () {
        if ($("#txtUserName").val() == "" || $("#txtUserName").val() == "请输入用户名") {
            $("#txtUserName").addClass("e");
        } else if ($("#txtUserPwd2").val() == "") {
            $("#txtUserPwd").addClass("e");
        }
        else {
            $.ajax({
                type: "POST",
                url: "Users.axd",
                data: {
                    action: "login",
                    userName: $("#txtUserName").val(),
                    userPwd: $("#txtUserPwd2").val()
                },
                beforeSend: function () {
                    $('#btnLogin').text("登录中...");
                },
                complete: function () {
                    $('#btnLogin').text("登录");
                },
                success: function (data) {
                    if (data == "error") {
                        $('.hint').text("用户名或密码错误");
                    } else {
                        location.href = "/default.aspx"; 
                    }
                }
            });
        }
    });
});