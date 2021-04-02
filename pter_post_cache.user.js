// ==UserScript==
// @name         Pter Post Cache
// @namespace    https://pterclub.com
// @version      0.0.1
// @description  猫站论坛缓存
// @author       scat
// @credits      soleil
// @include      http*://*pterclub.com/forums.php?action=newtopic&forumid=*
// @include      https://pterclub.com/forums.php?action=reply*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @charset		 UTF-8
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        var TOKEN_KEY_TITLE = 'newpost_title';
        var TOKEN_KEY_CONTENT = 'newpost_content';

        //设置缓存
        var setpostca = function () {
            window.localStorage.setItem(TOKEN_KEY_TITLE, $("input[name='subject']").val());
            window.localStorage.setItem(TOKEN_KEY_CONTENT, $("#body").val());
        };
        //删除缓存
        var delpostca = function () {
            window.localStorage.removeItem(TOKEN_KEY_TITLE);
            window.localStorage.removeItem(TOKEN_KEY_CONTENT);
            $("input[name='subject']").val("");
            $("#body").val("");
        };
        //恢复内容
        var recpostca = function () {
            $("input[name='subject']").val(window.localStorage.getItem(TOKEN_KEY_TITLE));
            $("#body").val(window.localStorage.getItem(TOKEN_KEY_CONTENT));
            console.log(window.localStorage.getItem(TOKEN_KEY_CONTENT))
        };
        //输入内容更新缓存
        $("input[name='subject'],#body").bind("input", setpostca );
        //鼠标聚焦更新缓存
        $("input[name='subject'],#body").focus( setpostca );
        //发布文章删除缓存
        //$('#submit_button').on("click", delpostca );
        $(document).on("click", "#get_localstorage", function() {//一键恢复
            recpostca();
        }).on("click", "#del_localstorage", function() {//删除缓存
            $("input[name='subject']").val("");
            $("#body").val("");
            delpostca();
        });
        //增加按钮
        $("#previewbutton").after('&nbsp;&nbsp;<a class="btn2" id="del_localstorage"  href="javascript:void(0);">&#8855 删除缓存</a>');
        $("#previewbutton").after('&nbsp;&nbsp;<a class="btn2" id="get_localstorage"  href="javascript:void(0);">&#8634 恢复缓存</a>');
        //恢复内容
        recpostca();
    });
})();

