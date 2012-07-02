

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}



$(document).ready(function(){

    // var timetag = $('body.page-commit-show time.js-relative-date');
    // var time = timetag.attr('title');

    var links = [];
    var hashes = [];
    if(location.href.match('/pull/[0-9]+')){
        $.each($('.commit-list-comment table.commits tr'), function(idx, el){
            el = $(el);
            var shortlink = el.find('.commit-meta a')[0];
            hashes.push(shortlink.text);
        });
        var hashstr = '?hashes=' + hashes.join(',');
        //strip https://github.com
        hashstr += '&pullrequest=' + location.href.substr(18);
        $.each($('table.commits tr .commit a'), function(idx, el){
            el.href = el.href + hashstr;
        });
        $.each($('table.commits tr .message a'), function(idx, el){
            el.href = el.href + hashstr;
        });

    }

    if(location.href.match('/commit/') && location.search.match('hashes=')){
        var vars = getUrlVars();
        hashes = vars['hashes'].split(',');
        var current_commit = $('.full-commit .commit-meta.clearfix .sha-block span.sha').text().substr(0, hashes[0].length);
        var idx = hashes.indexOf(current_commit);
        var prev = '';
        var next = '';
        var info = '<p class="bubble"><strong>commit ' + (idx + 1) + '/' + hashes.length + '</strong><p>';
        if(idx > 0){
            prev = '<a href="../commit/' + hashes[idx-1] + location.search + '" accesskey="p" class="minibutton" style="float: left;">&lt; go to previous commit</a>';
        }
        if(idx < hashes.length - 1){
            next = '<a href="../commit/' + hashes[idx+1] + location.search + '" accesskey="n" class="minibutton" style="float: right;">go to next commit &gt;</a>';
        }
        var up = '<a href="' + vars['pullrequest'] + '" accesskey="b" class="minibutton" style="text-align: center; display:block; width: 10em; margin: 0 auto;">back to pullrequest</a>';
        var topmarkup = '<div style="margin: 1em 0; text-align:center;">' + info + prev + next + up +  '<p style="margin: 0; clear:both">&nbsp;</p></div>';
        var bottommarkup = '<div style="margin: 1em 0; text-align:center;">' + prev + next + up +  '<p style="margin: 0; clear:both">&nbsp;</p></div>';
        var bottom_el = $('#all_commit_comments');
        var top_el = $('#files');
        bottom_el.html(bottommarkup + bottom_el.html());
        top_el.html(topmarkup + top_el.html());

        $.each($('form'), function(idx, el){
            el = $(el);
            if(el.attr('action') && el.attr('action').match('commit_comment')){
                el.attr('action', el.attr('action') + location.search);
            }
        });
    }

});