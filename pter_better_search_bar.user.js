// ==UserScript==
// @name         Pter Better Search-bar
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.0.1
// @description  Game Uploady for Pterclub
// @author       Scatowl
// @match        https://pterclub.com/torrents.php?cat=409*
// @match        https://pterclub.com/torrents.php?cat409=yes*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// ==/UserScript==
function make_better(){
    'use strict';
    <!--   修改标签:-->
    $("select[name='tag_exclusive']").before('<input type="checkbox" name="cat409" style="display: none" value="yes" checked="checked">');
    $("select[name='tag_exclusive']").replaceWith('<input type="checkbox" name="tag_exclusive" value="yes">');
    $("select[name='tag_internal']").replaceWith('<input type="checkbox" name="tag_internal" value="yes">');
    $("select[name='tag_mandarin']").replaceWith('<input type="checkbox" name="tag_mandarin" value="yes">');
    $("select[name='tag_cantonese']").replaceWith('<input type="checkbox" name="tag_cantonese" value="yes">');
    $("select[name='tag_doityourself']").replaceWith('<input type="checkbox" name="tag_doityourself" value="yes">');
    $("select[name='tag_master']").replaceWith('<input type="checkbox" name="tag_sce" value="yes">');
    $("a[href='\/torrents.php?tag_master=yes']").replaceWith("<a style=\"margin-left: 5px;\" href=\"torrents.php?tag_sce=yes\" one-link-mark=\"yes\">Scene</a>")
    $("a[href='\/torrents.php?tag_gg=yes']").after("&nbsp;&nbsp;<input type=\"checkbox\" name=\"tag_vs\" value=\"yes\"> <a style=\"margin-left: 5px;\" href=\"torrents.php?tag_vs=yes\" one-link-mark=\"yes\">可信源</a>");
    <!--   修改平台:-->
    const location = $("input#cat401").parent().parent();
    location.empty();
    append:location.append('<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source16" name="source16"  value="1"><a href="?source=16" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="Windows" title="Windows" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/Windows.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source20" name="source20"  value="1"><a href="?source=20" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="Switch" title="Switch" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/Switch.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source31" name="source31"  value="1"><a href="?source=31" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="PS4" title="PS4" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/PS4.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source46" name="source46"  value="1"><a href="?source=31" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="Linux" title="Linux" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/Linux.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source37" name="source37"  value="1"><a href="?source=31" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="MAC" title="MAC" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/MAC.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source24" name="source24"  value="1"><a href="?source=31" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="GBA" title="GBA" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/GBA.png);"></a></td>\n' +
        '<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source21" name="source21"  value="1"><a href="?source=31" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="FC_NES" title="FC_NES" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/FC_NES.png);"></a></td>\n')
    $("input[name='cat_check']").replaceWith('<td colspan="2" class="bottom" style="padding-left: 15px" align="left"><input name="source_check" value="全选" class="btn medium" type="button" onclick="javascript:SetChecked(\'source\',\'source_check\',\'全选\',\'全不选\',-1,10)"></td>')
    const aim = $("input#cat412").parent().next();
    aim.siblings().remove()
    aim.before('<td class="bottom" style="padding-bottom: 4px; padding-left: 3px;" align="left"> <input type="checkbox" id="source21" name="source21"  value="1"><a href="?source=31" one-link-mark="yes"><img class="c_game" src="pic/cattrans.gif" alt="FC_NES" title="FC_NES" style="background-image: url(pic/category/chd/scenetorrents/chs/additional/FC_NES.png);"></a></td>\n')
}
make_better()