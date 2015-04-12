// ==UserScript==
// @name        WordPress topic redirect
// @namespace   WordPress_topic_redirect
// @description Forces https, adds view=all to topic urls and redirects if needed.
// @version     1
// @grant       none
// @run-at      document-start
// @include    *://*wordpress.org/support/topic/*
// ==/UserScript==

( function() {

    var search = window.location.search;
    var https_protocol = window.location.protocol.replace(/http\:/g, 'https:');
    var url = https_protocol + "//" + window.location.host + window.location.pathname;
    var new_url = (https_protocol != window.location.protocol) ? url : false;

    if ( search ) {

        pattern = /view=all/g;

        if ( !pattern.test( search ) ) {
            new_url = ((new_url) ? new_url : url) + search + '&view=all';
        }

    } else {
        new_url = ((new_url) ? new_url : url) + '?view=all';
    }

    if ( new_url ) {
        window.onload =function(){
            window.location.replace( new_url + window.location.hash);
        };
        
    }

} )();