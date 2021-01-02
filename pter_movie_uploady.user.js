// ==UserScript==
// @name         Pter Movie Uploady
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.1.0
// @description  Auto get movie&TV info from douban&imdb for Pterclub
// @author       scatking
// @match        https://pterclub.com/upload.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// ==/UserScript==

function fill_form(response) {
    let data = response.response;
    $('#descr').val(data['format']);
    if (data['site'] === 'douban'){
        $('input[name="url"][type="text"]').val(data['imdb_link']);
        // $('input[name="douban"]').val(douban)
    }
}


function triger(url) {
    function get_info(url) {
        GM.xmlHttpRequest({
            method: "GET",                  //We call the Steam API to get info on the game
            url: "https://autofill.scatowl.workers.dev/?url="+url,
            responseType: "json",
            onload: fill_form
        });
    }
    if (url.indexOf("douban.com/") !== -1){ get_info(url)}
    else {
        let id = /\/(tt\d+)\//.exec(url).pop();
        GM.xmlHttpRequest({
            method: "GET",                  //We call the Steam API to get info on the game
            url: "https://autofill.scatowl.workers.dev/?search="+id,
            responseType: "json",
            onload: function (response) {
                try {
                    url = response.response.data[0].link;
                    $('input[name="douban"]').val(url);

                }
                catch (TypeError)  {console.log('no douban page')}
                finally {get_info(url);}
            }
        });
    }
}
(function() {
    'use strict';
    let imdb_url = $('input[name="url"][type="text"]');
    let douban_url = $('input[name="douban"]');

    imdb_url.after('<a href="javascript:;" id="fill_imdb" style="color:green">Auto Fill</a>');
    douban_url.after('<a href="javascript:;" id="fill_douban" style="color:green">Auto Fill</a>');
    $('#fill_imdb').click(function () {triger(imdb_url.val())})
    $('#fill_douban').click(function () {triger(douban_url.val())})
})();