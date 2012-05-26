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

        $.each(links, function(idx, el){
            el.href = el.href + hashstr;
        });
    }

    if(location.href.match('/commit/') && location.search.match('hashes=')){
        hashes = location.search.substr(8).split(',');
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
        var markup = '<div class="margin: 1em 0;">' + prev + next + '<p style="margin: 0; clear:both">&nbsp;</p></div>';
        var bottom_el = $('#all_commit_comments');
        var top_el = $('#files');
        bottom_el.html(markup + bottom_el.html());
        top_el.html(markup + top_el.html());
    }

});