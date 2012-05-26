

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    console.log(vars);
    return vars;
}



$(document).ready(function(){

    // var timetag = $('body.page-commit-show time.js-relative-date');
    // var time = timetag.attr('title');

    var links = [];
    var hashes = [];
    if(location.href.match('/pull/[0-9]+')){
        $.each($('table.commits .commit a'), function(idx, el){
            links.push(el);
            hashes.push($(el).text());
        });
        var hashstr = '?hashes=' + hashes.join(',');
        //strip https://github.com
        hashstr += '&pullrequest=' + location.href.substr(18);
        $.each(links, function(idx, el){
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
        if(idx > 0){
            prev = '<a href="../commit/' + hashes[idx-1] + location.search + '" class="minibutton" style="float: left;">&lt; go to previous commit</a>';
        }
        if(idx < hashes.length - 1){
            next = '<a href="../commit/' + hashes[idx+1] + location.search + '" class="minibutton" style="float: right;">go to next commit &gt;</a>';
        }
        var up = '<a href="' + vars['pullrequest'] + '" class="minibutton" style="text-align: center; display:block; width: 10em; margin: 0 auto;">back to pullrequest</a>';
        var markup = '<div class="margin: 1em 0; text-align:center;">' + prev + next + up +  '<p style="margin: 0; clear:both">&nbsp;</p></div>';
        var bottom_el = $('#all_commit_comments');
        var top_el = $('#files');
        bottom_el.html(markup + bottom_el.html());
        top_el.html(markup + top_el.html());

        $.each($('form'), function(idx, el){
            el = $(el);
            if(el.attr('action') && el.attr('action').match('commit_comment')){
                el.attr('action', el.attr('action') + location.search);
            }
        });
    }

});