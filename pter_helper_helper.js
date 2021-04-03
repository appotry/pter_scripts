// ==UserScript==
// @name         Pter Helper Helper
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      1.1.6
// @description  Game Uploady for Pterclub
// @author       NeutronNoir, ZeDoCaixao, scatking
// @match        https://pterclub.com/details.php?id=*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// ==/UserScript==
// ">[.\n]+"
const timer = ms => new Promise(res => setTimeout(res, ms));

async function checker(state) {
    state = {1:'种子初步检查无误，建议审核通过',2:'种子存在问题，但已帮忙修改完成，可以审核通过',
        3:'种子存在问题，但已修改完成，可以审核通过',4:'发种人未在48小时内完成种子修改，建议进一步处理'}[state];
    let torrent_url = window.location.href;
    let torrent_id = torrent_url.match(/details\.php\?id=(\d+)/)[1];
    let posts = (await fetch('https://pterclub.com/forums.php?action=editpost&postid=28071'));
    posts = await posts.text();
    posts = posts.match(/">[\s\S]+">([\s\S]+?)<\/textarea>/m)[1];
    posts = `${posts}\n${torrent_url}`;
    console.log(posts)
    await fetch('https://pterclub.com/report.php',{
        method : 'POST',
        body: `taketorrent=${torrent_id}&reason=${state}`,
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
    }).then(function () {fetch('https://pterclub.com/forums.php?action=post',{
        method: 'POST',
        headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        body: `id=28071&type=edit&original_name=''&original_body=''&color=0&font=0&size=0&body=${posts}`
    })

    });
    return `种子：${torrent_id} 检查完毕！`
}

async function old_post() {
    let posts = (await fetch('https://pterclub.com/forums.php?action=editpost&postid=28078'));
    posts = posts.text().match(/">[\s\S]+">([\s\S]+?)<\/textarea>/m)[1];
    let torrent_url = window.location.href;
    let torrent_id = torrent_url.match(/details\.php\?id=(\d+)/)[1];
    posts = posts.replace()
}
