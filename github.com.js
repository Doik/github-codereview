/*

github.com.js modifies the DOM for more
convenience while reviewing pull requests.

require dot.js

https://github.com/Doik/github-codereview

*/


(

function( $ ){

    var hashes = [];
    var pullrequest_url = null;
    var current_commit = null;

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

    if(window.location.pathname.match('/commit/') && window.location.search.match('hashes=')){
        insertButtons();
        $('[data-pjax-container]').bind('DOMSubtreeModified', function(event){
            if(window.location.href.match('/commit/')){
                insertButtons();
            } else if(!window.location.href.match('/(commit|pull)/')){
                hashes = [];
            }
        });
    }

    if(window.location.pathname.match('/pull/[0-9]+$')){

        pullrequest_url = window.location.pathname;

        $('[data-pjax-container]').bind('DOMSubtreeModified', function(event){
            if(window.location.href.match('/commit/')){
                insertButtons();
            } if(!window.location.href.match('/(commit|pull)/')){
                hashes = [];
            }
        });

        var links = [];
        $.each($('.timeline-commits tr'), function(idx, el){
            el = $(el);
            if(el.is(':visible')){
                var shortlink = el.find('.commit-meta code a');
                if(shortlink){
                    hashes.push(shortlink.attr('href').split('/').reverse()[0]);
                }
            }
        });
        var hashstr = '?hashes=' + hashes.join(',');
        //strip https://github.com
        hashstr += '&pullrequest=' + encodeURIComponent(pullrequest_url);
        $.each($('.timeline-commits tr .commit-message code a'), function(idx, el){
            el.href = el.href + hashstr;
            $(el).queue('click', insertButtons);
        });
        $.each($('.timeline-commits tr .commit-meta code a'), function(idx, el){
            el.href = el.href + hashstr;
            $(el).queue('click', insertButtons);
        });

    }

    function insertButtons(){
        var up_url;
        if(hashes.length == 0){
            var vars = getUrlVars();
            if(!vars['hashes']){
                return;
            }
            hashes = vars['hashes'].split(',');
            up_url = vars['pullrequest'];
        }
        else {
            if(pullrequest_url){
                up_url = pullrequest_url;
            } else {
                var vars = getUrlVars();
                up_url = vars['pullrequest'];
            }
        }
        if(current_commit == window.location.pathname)
            return;

        var bottom_el = $('#all_commit_comments');
        var top_el = $('#files');

        if(!bottom_el.length || !top_el.length){
            return
        }
        if($('#dom_modified_by_dotjs_helper').length){
            return;
        }
        current_commit = window.location.pathname;
        var current_commit_hash = window.location.pathname.split('/').reverse()[0].substr(0, hashes[0].length);
        var idx = hashes.indexOf(current_commit_hash);
        var prev = '';
        var next = '';
        var info = '<h3 id="dom_modified_by_dotjs_helper" style="text-align:center">commit ' + (idx + 1) + '/' + hashes.length + '</h3>';
        if(idx > 0){
            prev = '<a href="../commit/' + hashes[idx-1] + window.location.search + '" data-pjax="true" accesskey="p" class="btn btn-sm" style="float: left;">&lt; go to previous commit</a>';
        }
        if(idx < hashes.length - 1){
            next = '<a href="../commit/' + hashes[idx+1] + window.location.search + '" data-pjax="true" accesskey="n" class="btn btn-sm" style="float: right;">go to next commit &gt;</a>';
        }
        var up = '<a href="' + decodeURIComponent(up_url) + '" accesskey="b" class="btn btn-sm" style="text-align: center; display:block; width: 11em; margin: 0 auto;">back to pullrequest</a>';
        var links = '<div class="boxed-group-inner"><p>' + prev + next + up + '</p></div>';
        var topmarkup = '<div class="boxed-group style="text-align:center">' + info + links +  '<p style="margin: 0; clear:both">&nbsp;</p></div>';
        var bottommarkup = '<div class="boxed-group" style="text-align:center;">' + links +  '<p style="margin: 0; clear:both">&nbsp;</p></div>';
        top_el.html(topmarkup + top_el.html());
        bottom_el.html(bottommarkup + bottom_el.html());

        $.each($('form'), function(idx, el){
            el = $(el);
            if(el.attr('action') && el.attr('action').match('commit_comment')){
                el.attr('action', el.attr('action') + window.location.search);
            }
        });
    }

}(jQuery));