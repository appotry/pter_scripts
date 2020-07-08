// ==UserScript==
// @name         Pter game Uploady
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.2
// @description  Game Uploady for Pterclub
// @author       NeutronNoir, ZeDoCaixao, scatking
// @match        https://pterclub.com/uploadgameinfo.php*
// @match        https://pterclub.com/editgameinfo.php*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// ==/UserScript==

function html2bb(str) {
    if (!str) return "";
    str = str.replace(/< *br *\/*>/g, "\n\n"); //*/
    str = str.replace(/< *b *>/g, "[b]");
    str = str.replace(/< *\/ *b *>/g, "[/b]");
    str = str.replace(/< *u *>/g, "[u]");
    str = str.replace(/< *\/ *u *>/g, "[/u]");
    str = str.replace(/< *i *>/g, "[i]");
    str = str.replace(/< *\/ *i *>/g, "[/i]");
    str = str.replace(/< *strong *>/g, "[b]");
    str = str.replace(/< *\/ *strong *>/g, "[/b]");
    str = str.replace(/< *em *>/g, "[i]");
    str = str.replace(/< *\/ *em *>/g, "[/i]");
    str = str.replace(/< *li *>/g, "[*]");
    str = str.replace(/< *\/ *li *>/g, "");
    str = str.replace(/< *ul *class=\\*\"bb_ul\\*\" *>/g, "");
    str = str.replace(/< *\/ *ul *>/g, "");
    str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "\n[center][u][b]");
    str = str.replace(/< *h[12] *>/g, "\n[center][u][b]");
    str = str.replace(/< *\/ *h[12] *>/g, "[/b][/u][/center]\n");
    str = str.replace(/\&quot;/g, "\"");
    str = str.replace(/\&amp;/g, "&");
    str = str.replace(/< *img *src="([^"]*)".*>/g, "\n");
    str = str.replace(/< *a [^>]*>/g, "");
    str = str.replace(/< *\/ *a *>/g, "");
    str = str.replace(/< *p *>/g, "\n\n");
    str = str.replace(/< *\/ *p *>/g, "");
    //Yeah, all these damn stars. Because people put spaces where they shouldn't.
    str = str.replace(//g, "\"");
    str = str.replace(//g, "\"");
    str = str.replace(/  +/g, " ");
    str = str.replace(/\n +/g, "\n");
    str = str.replace(/\n\n\n+/gm, "\n\n");
    str = str.replace(/\n\n\n+/gm, "\n\n");
    str = str.replace(/\[\/b\]\[\/u\]\[\/align\]\n\n/g, "[/b][/u][/align]\n");
    str = str.replace(/\n\n\[\*\]/g, "\n[*]");
    return str;
}

function markdown2bb(str) {
    if (!str) return "";
    str = str.replace(/!\[.*?\.(?:jpg|png)\)\n\n/g, '');//删除markdown格式的图片
    str = str.replace(/#(.*?)\n\n/g, '[b]$1:[/b]');//修改markdown标题为bbcode
    return str;
}

function fix_emptylines(str) {
    var lst = str.split("\n");
    var result = "";
    var empty = 1;
    lst.forEach(function(s) {
        if (s) {
            empty = 0;
            result = result + s + "\n";
        } else if (empty < 1) {
            empty = empty + 1;
            result = result + "\n";
        }
    });
    return result;
}

function pretty_sr(str) {
    if (!str) return "";
    str = str.replace(/™/g, "");
    str = str.replace(/®/g, "");
    str = str.replace(/:\[\/b\] /g, "[/b]: ");
    str = str.replace(/:\n/g, "\n");
    str = str.replace(/:\[\/b\]\n/g, "[/b]\n");
    str = str.replace(/\n\n\[b\]/g, "\n[b]");
    return str;
}

function steam_form(response) {
    //We store the data in gameInfo, since it's much easier to access this way
    //var steamid = /app\/(\d+)\//g.exec($("#gameid").val()).pop();
    var gameInfo = response.response[steamid].data;
    var about = gameInfo.about_the_game;
    var date = gameInfo.release_date.date.split(", ").pop();
    var year = date.split("年").shift();
    var store = 'https://store.steampowered.com/app/' + steamid;
    var genres = [];
    gameInfo.genres.forEach(function (genre) {
        var tag = genre.description.toLowerCase().replace(/ /g, ".");
        genres.push(tag);
    });
    genres = genres.join("," );
    if (about === '') { about = gameInfo.detailed_description; }
    about = "[center][b][u]关于游戏[/u][/b][/center]\n" +`[b]发行日期[/b]：${date}\n\n[b]商店链接[/b]：${store}\n\n[b]游戏标签[/b]：${genres}\n\n` + html2bb(about).trim();
    var screens = '';
    gameInfo.screenshots.forEach(function(screen) {
        screens += "[center][img]"+ screen.path_full.split("?")[0] + "[/img][/center]\n"
    });
    var sc = "[center][b][u]游戏截图[/u][/b][/center]\n" + screens;
    try {
        var trailer = gameInfo.movies[0].webm.max.split("?")[0];
        var tr = "\n\n[center][b][u]预告欣赏[/u][/b][/center]\n" + `[center][video]${trailer}[/video][/center]`;
    }catch (e) {
        tr = ''
    }
    var platform = "Windows";
    //var cover_field = "input[name='image']";
    var desc_field = "textarea[name='body']";


    $("input[name ='name']").val(gameInfo.name);  //Get the name of the game
    //$("#year").val(year);
    /*
    var genres = [];
    gameInfo.genres.forEach(function (genre) {
        var tag = genre.description.toLowerCase().replace(/ /g, ".");
        genres.push(tag);
    });
    $("#tags").val(genres.join(", "));*/
    //cover_field = "#image";
    desc_field = "#descr";
    platform = $("#console").val();

    var recfield = gameInfo.pc_requirements;
    switch (platform) {
        case "16":
            recfield = gameInfo.pc_requirements;
            break;
        case "46":
            recfield = gameInfo.linux_requirements;
            break;
        case "37":
            recfield = gameInfo.mac_requirements;
            break;
    }
    var sr = html2bb(recfield.minimum) + "\n" + html2bb(recfield.recommended);
    sr = "\n\n[center][b][u]配置要求[/u][/b][/center]\n\n" +
             pretty_sr(html2bb("[quote]\n" + recfield.minimum + "\n" + recfield.recommended + "[/quote]\n"));
    var cover = "[center][img]" + gameInfo.header_image.split("?")[0] + "[/img][/center]";       //Get the image URL
    var big_cover = "[center][img]" + "https://steamcdn-a.akamaihd.net/steam/apps/" + steamid + "/library_600x900_2x.jpg" + "[/img][/center]";
    GM.xmlHttpRequest({
        method: "GET",                  //We call the Steam API to get info on the game
        url: big_cover,
        responseType: "json",
        onload: function(response) {
            if(response.status === 200){
                cover = big_cover;
            }
        }
    });
    $(desc_field).val(cover);
    $(desc_field).val($(desc_field).val() + about + sr + tr + sc);
    $(desc_field).val(fix_emptylines($(desc_field).val()));
    $("input[name ='year']").val(year)
    /*if (gameInfo.metacritic) {
        $("#meta").val(gameInfo.metacritic.score);
        $("#metauri").val(gameInfo.metacritic.url.split("?")[0] + "/critic-reviews");
    }*/
}

function epic_form(response) {
    //We store the data in gameInfo, since it's much easier to access this way
    var gameInfo = response.response["pages"];
    for (let i=0; i<gameInfo.length;i++){
        if(gameInfo[i]['_title'] === "home"||gameInfo[i]['_title'] === "主页"){
            gameInfo = gameInfo[i];
            break;
        }
    }
    var about = gameInfo.data.about.description;
    var date = gameInfo.data.meta['releaseDate'];
    var year = date.split("-").shift();
    var store = 'https://www.epicgames.com/store/zh-CN/product/' + $("#epicid").val();
    if (about === "") {about = gameInfo.data.about.shortDescription; }
    about = "[center][b][u]关于游戏[/u][/b][/center]\n" + `[b]发行日期[/b]：${date}\n\n[b]商店链接[/b]：${store}\n\n` + markdown2bb(about).trim();
    var screens = '';
    gameInfo.data.gallery.galleryImages.forEach(function (screen) {
        screens += "[center][img]" + screen["src"] + "[/img][/center]\n"
    });
    var sc = "[center][b][u]游戏截图[/u][/b][/center]\n" + screens;
    // var trailer = gameInfo.data.carousel.items[0].video.contentId;
    // var tr = "\n\n[center][b][u]预告欣赏[/u][/b][/center]\n"+ `[center][video]${trailer}[/video][/center]`
    // var platform = "Windows"
    //var cover_field = "input[name='image']";
    var desc_field = "textarea[name='body']";


   $("input[name ='name']").val(gameInfo.productName);  //Get the name of the game
   // $("input[name='small_descr']").val(gameInfo.data.about.title); //暂时不获取中文名了
    //$("#year").val(year);
    /*
    var genres = [];
    gameInfo.genres.forEach(function (genre) {
        var tag = genre.description.toLowerCase().replace(/ /g, ".");
        genres.push(tag);
    });
    $("#tags").val(genres.join(", "));*/
    //cover_field = "#image";
    desc_field = "#descr";
    platform = $("#console").val();

    var recfield = gameInfo.data.requirements.systems[0].details;
    var minimum = '[b]最低配置[/b]\n';
    var recommended = '[b]推荐配置[/b]\n';
    recfield.forEach(function (sysrec, index) {
        minimum += "[b]" + sysrec['title'] + "[/b]" + ': ' + sysrec['minimum'] + '\n';
        recommended += "[b]" + sysrec['title'] + "[/b]" + ': ' + sysrec['recommended'] + '\n'
    });
    /*switch (platform) {
        case "Windows":
            recfield = gameInfo.pc_requirements;
            break;
        case "Linux":
            recfield = gameInfo.linux_requirements;
            break;
        case "Mac":
            recfield = gameInfo.mac_requirements;
            break;
    }*/
    var sr = html2bb(recfield.minimum) + "\n" + html2bb(recfield.recommended);
    sr = "\n\n[center][b][u]配置要求[/u][/b][/center]\n\n" +
        pretty_sr(html2bb("[quote]\n" + minimum + "\n" + recommended + "[/quote]\n"));
    var age_rate = "[center][b][u]游戏评级[/u][/b][/center]\n";
    try {
        gameInfo.data.requirements.legalTags.forEach(function (pic) {
            age_rate += "[center][img]" + pic["src"] + "[/img][/center]\n"
        });
    } catch (e) {
        age_rate=''
    }
    var cover = "[center][img]" + gameInfo.data.about.image.src + "[/img][/center]";       //Get the image URL
    $(desc_field).val(cover);
    $(desc_field).val($(desc_field).val() + about + sr + age_rate + sc);
    $(desc_field).val(fix_emptylines($(desc_field).val()));
    $("input[name ='year']").val(year)
    /*if (gameInfo.metacritic) {
        $("#meta").val(gameInfo.metacritic.score);
        $("#metauri").val(gameInfo.metacritic.url.split("?")[0] + "/critic-reviews");
    }*/
}

function indienova_form(response) {
    var gameInfo = response.response;
    $("input[name ='name']").val(gameInfo.english_title);
    $("input[name ='small_descr']").val(gameInfo.chinese_title);
    $("input[name ='year']").val(gameInfo.release_date.split("-").shift());
    $("#descr").val(gameInfo.format)
}

function choose_form(key) {
    let url;
    if (!key.endsWith('/')){
        key += '/'
    }
    if (key.indexOf("https://store.steampowered.com/") !== -1) {
        steamid = /app\/(\d+)/g.exec(key).pop();
        url = "https://store.steampowered.com/api/appdetails?l=schinese&appids="+steamid;
        fill_form = steam_form
    }
    else if(key.indexOf("epicgames.com") !== -1) {

        var epicid = /product\/(.+?)\//g.exec(key).pop();
        url ="https://store-content.ak.epicgames.com/api/zh-CN/content/products/"+epicid;
        fill_form = epic_form;
        console.log(url)
    }
    else if(key.indexOf('indienova') !== -1){
        url = "https://api.rhilip.info/tool/movieinfo/gen?url="+key;
        fill_form = indienova_form
    }
    return url;
}

(function() {
    'use strict';
    $("input[name='name']").parent().parent().after(
        "<tr><td>Game URL</td><td><input style='width: 450px;' id='gameid' /></td></tr>"
    );
    const gameid = $("#gameid");
    gameid.after(
        '<a href="javascript:;" id="fill_win" style="color:green">Win</a> <a href="javascript:;" id="fill_lin" style="color:blue">Lin</a> <a href="javascript:;" id="fill_mac" style="color:orange">Mac</a> <a href="javascript:;" id="fill_ns" style="color:red">NS</a>');
    $('#fill_win').click(function () { $("#console").val("16"); });
    $('#fill_lin').click(function () { $("#console").val("46"); });
    $('#fill_mac').click(function () { $("#console").val("37"); });
    $('#fill_ns').click(function () { $("#console").val("20"); });
    gameid.blur(function() { //After the "appid" input loses focus
        const url = choose_form(gameid.val());
        GM.xmlHttpRequest({
            method: "GET",                  //We call the Steam API to get info on the game
            url: url,
            responseType: "json",
            onload: fill_form
        });
    });
})();
