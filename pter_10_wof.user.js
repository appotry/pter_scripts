// ==UserScript==
// @name         Pter Bonus Eater
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.0.1
// @description  consume your bonus immediately
// @author       scatking
// @match        https://pterclub.com/wof.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// ==/UserScript==
function do_wof(times) {
    var awards = [];
    for (var i = 1;i <= times;i++){
        fetch("https://pterclub.com/dowof.php").then(res => res.text()).then(res => /wof\.php\?pid=(\d)/.exec(res).pop()).then(res => awards.push(res))
        // location.reload()
    }
    console.log(awards)
}

(function() {
$('.Detail').children(":first").before('<a href="javascript:;" id="do" style="color:green">Auto Fill</a>');
$('#do').click(function () {do_wof(5)});
})();