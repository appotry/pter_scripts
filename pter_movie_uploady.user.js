// ==UserScript==
// @name         Pter Movie Uploady
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.1.4
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
        var trans_titles='',directors='',casts='';
        if (data['foreign_title'].length == 0){ trans_titles= data['chinese_title']}
        else {
            data.trans_title.forEach(function (trans_title) {
                trans_titles += trans_title + ' '
            });
        }
        data.director.forEach(function (director) {
            directors = /(.+?)\s/.exec(director['name']).pop()
        });
        var actors = data.cast.slice(0,3);
        actors.forEach(function (cast) {
            casts += /(.+?)\s/.exec(cast['name']).pop()+' '
        });
        const subtitle = trans_titles + ' | ' + "导演：" + directors + ' | ' + '主演：' + casts;
        $('input[name="url"][type="text"]').val(data['imdb_link']);
        $('input[name="small_descr"]').val(subtitle)
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
        let id = /\/(tt\d+)/.exec(url).pop();
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

function writeInto(){
    const subtitle = $('input[name="small_descr"]');
    const cstext = subtitle.val() + "[国语中字]";
    subtitle.val(cstext);
}

(function() {
    'use strict';
    let imdb_url = $('input[name="url"][type="text"]');
    let douban_url = $('input[name="douban"]');
    let subtitle = $('input[name="small_descr"]');

    imdb_url.after('<a href="javascript:;" id="fill_imdb" style="color:green">Auto Fill</a>');
    douban_url.after('<a href="javascript:;" id="fill_douban" style="color:green">Auto Fill</a>');
    subtitle.after('<a href="javascript:;" id="fill_cs" style="color:green">[国语中字]</a>');
    $('#fill_cs').click(function () {writeInto()});
    $('#fill_imdb').click(function () {triger(imdb_url.val())});
    $('#fill_douban').click(function () {triger(douban_url.val())})
})();