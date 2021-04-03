// ==UserScript==
// @name         Pter Helper Helper
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      1.1.6
// @description  Game Uploady for Pterclub
// @author       NeutronNoir, ZeDoCaixao, scatking
// @match        https://pterclub.com/details.php?id=*
// @match        https://pterclub.com/usercp.php
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// ==/UserScript==
PERFECTPOST = 'perfect';
GOODPOST = 'good';
PENDINGPOST = 'pending';
FINISHEDPOST = 'finished';
BADPOST = 'bbad';

async function checker(state,post_id) {
    state = {1:'种子初步检查无误，建议审核通过',2:'种子存在问题，但已帮忙修改完成，可以审核通过',
        4:'种子存在问题，但已修改完成，可以审核通过',5:'发种人未在48小时内完成种子修改，建议进一步处理',3:''}[state];
    let torrent_url = window.location.href;
    let torrent_id = torrent_url.match(/details\.php\?id=(\d+)/)[1];
    let posts = (await fetch(`https://pterclub.com/forums.php?action=editpost&postid=${post_id}`));
    posts = await posts.text();
    posts = posts.match(/">[\s\S]+">([\s\S]+?)<\/textarea>/m)[1].replace(torrent_url,'');
    posts = `${posts}\r\n${torrent_url}`.trim();
    let pending_post = (await fetch(`https://pterclub.com/forums.php?action=editpost&postid=${window.localStorage.getItem(PENDINGPOST)}`));
    pending_post = await pending_post.text();
    pending_post = pending_post.match(/">[\s\S]+">([\s\S]+?)<\/textarea>/m)[1].replace(torrent_url,'').trim();
    console.log(pending_post);
    const data = {
          'id': post_id,
          'type': 'edit',
          'quoteid': '0',
          'original_name': '',
          'original_body': '',
          'color': '0',
          'font': '0',
          'size': '0',
          'body': posts
            };
    function formatData(data) {
    const result = Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&');
	return result;
        }
    await fetch('https://pterclub.com/report.php',{
        method : 'POST',
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        body: `taketorrent=${torrent_id}&reason=${state}`,
    }).then(function () {fetch('https://pterclub.com/forums.php?action=post',{
        method: 'POST',
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        body: formatData(data)
    })
    });
    if (state !== 3){
        data.body = pending_post;
        await fetch('https://pterclub.com/forums.php?action=post',{
        method : 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formatData(data),
    })
    }
    return `种子：${torrent_id} 检查完毕！`
}

function set_key() {
    $('#outer > table:nth-child(12) > tbody:nth-child(1) > tr:nth-child(1)').after(
        "<tr><td class='rowhead nowrap' width='1%' valign='top' align='right' style='color: red'>审核无误</td><td><input style='width: 450px;' id='perfect' /></td></tr>" +
        "<tr><td class='rowhead nowrap' width='1%' valign='top' align='right' style='color: red'>帮忙修改</td><td><input style='width: 450px;' id='good' /></td></tr>" +
        "<tr><td class='rowhead nowrap' width='1%' valign='top' align='right' style='color: red'>需要跟进</td><td><input style='width: 450px;' id='pending' /></td></tr>" +
        "<tr><td class='rowhead nowrap' width='1%' valign='top' align='right' style='color: red'>完成修改</td><td><input style='width: 450px;' id='finished' /></td></tr>" +
        "<tr><td class='rowhead nowrap' width='1%' valign='top' align='right' style='color: red'>并不理我</td><td><input style='width: 450px;' id='bbad' /></td></tr>"
    );
    $('#bbad').after('<a href="javascript:;" id="set" style="color:green">完成设置</a>');
    $('#set').click(function () {window.localStorage.setItem(PERFECTPOST,$('#perfect').val());
                                window.localStorage.setItem(GOODPOST,$('#good').val());
                                window.localStorage.setItem(PENDINGPOST,$('#pending').val());
                                window.localStorage.setItem(FINISHEDPOST,$('#finished').val());
                                window.localStorage.setItem(BADPOST,$('#bbad').val());
    })
}

(function () {
    if (window.location.href.includes('pterclub.com/usercp.php')){set_key()}
    $('a.index[href^="download.php?id="]').parent().after('<td class="rowfollow"><a href="javascript:;" id="perfect" style="color:green" ><img src="https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrmpw4xvtvgl/b/bucket-20200224-2012/o/badge_gpchecker.png" title="审核无误"></a> ' +
        '<a href="javascript:;" id="good" style="color:blue"><img src="https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrmpw4xvtvgl/b/bucket-20200224-2012/o/badge_checker.png" title="帮忙修改"></a> ' +
        '<a href="javascript:;" id="pending" style="color:orange"><img src="https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrmpw4xvtvgl/b/bucket-20200224-2012/o/x.png" title="需要跟进"></a> ' +
        '<a href="javascript:;" id="finished" style="color:red"><img src="https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrmpw4xvtvgl/b/bucket-20200224-2012/o/quality.gif" title="完成修改"></a>' +
        '<a href="javascript:;" id="bbad" style="color:purple"><img src="https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrmpw4xvtvgl/b/bucket-20200224-2012/o/disabled.png" title="并不理我"></a></td>')
    $('#perfect').click(function () {checker(1,post_id=window.localStorage.getItem(PERFECTPOST)).then(alert)});
    $('#good').click(function () {checker(2,post_id=window.localStorage.getItem(GOODPOST)).then(alert)});
    $('#pending').click(function () {checker(3,post_id=window.localStorage.getItem(PENDINGPOST)).then(alert)});
    $('#finished').click(function () {checker(4,post_id=window.localStorage.getItem(FINISHEDPOST)).then(alert)});
    $('#bbad').click(function () {checker(5,post_id=window.localStorage.getItem(BADPOST)).then(alert)})
})();

