// ==UserScript==
// @name         Pter NFO Helper
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.1.0
// @description  NFO image Uploady for Pterclub
// @author       scatking
// @match        https://pterclub.com/uploadgame.php*
// @match        https://pterclub.com/editgame.php*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// ==/UserScript==
function find_rls(rlsid) {
    'use strict';
    const data = "xrel_search_query="+rlsid;
    GM.xmlHttpRequest({
        method: "POST",
        synchronous : true,
        url: "https://www.xrel.to/search.html?mode=rls",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: data,
        onload: function (response) {
            if (response.status === 200){
                const game_url = "https://www.xrel.to/" + /(game-nfo.+?)\.html/.exec(response.responseText).shift();
                 GM.xmlHttpRequest({
                     method: "GET",
                     url: game_url,
                    onload: fill_nfo
                 })
            }
        }
    });
}

function fill_nfo(response) {
    'use strict';
    const token = /nfo=(\d+?)&secret=(.+?)&font=FONTIDX/.exec(response.response);
    const imgurl = `https://www.xrel.to/nfo-a/${token[1]}-${token[2]}/c90fd3b2-2.png`;
    const descr =$('#descr');
    const nfo_descr =  descr.val() + `[img]${imgurl}[/img]`;
    descr.val(nfo_descr)
}

function fill_iso() {
    'use strict';
    const descr =$('#descr');
    const iso_descr = descr.val() +"[center][b][u]安装方法[/u][/b][/center]\n[*]解压缩\n[*]挂载镜像\n[*]安装游戏\n[*]复制破解补丁至游戏安装目录\n[*]游玩\n\n";
    descr.val(iso_descr)
}

function fill_fit() {
    'use strict';
    const descr =$('#descr');
    const fit_descr = descr.val() +"[center][b][u]安装方法[/u][/b][/center]\n[*]运行 \"Verify BIN files before installation.bat\" 进行MD5验证（可选）\n[*]运行 \"setup.exe\"安装游戏\n[*]开始游玩\n[*]游戏经过高压，需要一定时间才能解压完毕，请耐心等待。\n\n";
    descr.val(fit_descr)
}

function fill_3dm() {
    'use strict';
    const descr =$('#descr');
    const tdm_descr = descr.val() +"[center][b][u]安装方法[/u][/b][/center]\n[*]解压缩\n[*]运行游戏\n[*]破解补丁已经预先封装进游戏\n\n";
    descr.val(tdm_descr)
}

(function() {
    'use strict';
    if (window.location.href.includes("uploadgame")){
        const torrent = $('#torrent');
        torrent.change(function () {
            var rlsname = torrent.val().replace('C:\\fakepath\\','').replace('.torrent','');
           $("#rlsid").val (rlsname);
        });
        $("#name").parent().parent().after(
        "<tr><td>rls name</td><td><input style='width: 450px;' id='rlsid' /></td></tr>"
        );
    }
    else {
        $("input[name='torrentname']").parent().parent().after(
        "<tr><td>rls name</td><td><input style='width: 450px;' id='rlsid' /></td></tr>"
        );
    }
    $("#rlsid").after(
        '<a href="javascript:;" id="get_nfo" style="color:green">NFO</a> <a href="javascript:;" id="fill_iso" style="color:blue">ISO</a> <a href="javascript:;" id="fill_fit" style="color:orange">Fitgirl</a> <a href="javascript:;" id="fill_3dm" style="color:red">3DM</a>');
    $('#get_nfo').click(function () { find_rls($("#rlsid").val());});
    $('#fill_iso').click(function () { fill_iso();});
    $('#fill_fit').click(function () { fill_fit();});
    $('#fill_3dm').click(function () { fill_3dm();});
})();