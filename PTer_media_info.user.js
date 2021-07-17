// ==UserScript==
// @name         PTer mediainfo thingy
// @namespace    https://pterclub.com/
// @version      1.0
// @description  Drag & drop files to generate mediainfo
// @author       scatking
// @Credits      Eva
// @match        https://pterclub.com/upload.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrmpw4xvtvgl/b/bucket-20200224-2012/o/CDN%2Fmediainfo.js
// @icon         https://pterclub.com/favicon.ico
// @run-at       document-end
// ==/UserScript==

var CHUNK_SIZE = 5 * 1024 * 1024;
var miLib, mi;
var processing = false;

function parseFile(file) {
    if (processing) {
        return;
    }
    processing = true;
    document.getElementById('userscript_mediainfo_status').innerText = 'Processing...';

    var fileSize = file.size,
        offset = 0,
        state = 0,
        seekTo = -1,
        seek = null;

    mi.open_buffer_init(fileSize, offset);

    var processChunk = function(e) {
        var l;
        if (e.target.error === null) {
            var chunk = new Uint8Array(e.target.result);
            l = chunk.length;
            state = mi.open_buffer_continue(chunk, l);

            var seekTo = -1;
            var seekToLow = mi.open_buffer_continue_goto_get_lower();
            var seekToHigh = mi.open_buffer_continue_goto_get_upper();

            if (seekToLow == -1 && seekToHigh == -1) {
                seekTo = -1;
            } else if (seekToLow < 0) {
                seekTo = seekToLow + 4294967296 + (seekToHigh * 4294967296);
            } else {
                seekTo = seekToLow + (seekToHigh * 4294967296);
            }

            if (seekTo === -1) {
                offset += l;
            } else {
                offset = seekTo;
                mi.open_buffer_init(fileSize, seekTo);
            }
            chunk = null;
        } else {
            var msg = '文件处理出错！';
            console.err(msg, e.target.error);
            processingDone();
            alert(msg);
            return;
        }
        // bit 4 set means finalized
        if (state & 0x08) {
            var result = mi.inform();
            mi.close();
            document.getElementById('descr').value = "[hide=mediainfo]"+result.replace(/^Format\s{7}(\s*)/m, 'Complete name$1: ' + file.name + '\nFormat       $1')+"[/hide]\n"+document.getElementById('descr').value;
            processingDone();
            return;
        }
        seek(l);
    };

    function processingDone() {
      processing = false;
      document.getElementById('userscript_mediainfo_status').innerText = '⬆请将媒体文件拖入上述文件筐⬆';
      document.getElementById('userscript_mediainfo_input').value = '';
    }

    seek = function(length) {
        if (processing) {
            var r = new FileReader();
            var blob = file.slice(offset, length + offset);
            r.onload = processChunk;
            r.readAsArrayBuffer(blob);
        } else {
            mi.close();
            processingDone();
        }
    };

    // start
    seek(CHUNK_SIZE);
}

$("input[name='douban']").parent().parent().after("<tr><td>Media Info</td><td><input type='file' id='userscript_mediainfo_input'></td></tr>");
miLib = MediaInfo(function() {
    mi = new miLib.MediaInfo();
});
$('#userscript_mediainfo_input').after("<p id='userscript_mediainfo_status'>⬆请将媒体文件拖入上述文件筐⬆</p>")
var file_input = document.getElementById("userscript_mediainfo_input");
file_input.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
        parseFile(e.target.files[0]);
    }
});


