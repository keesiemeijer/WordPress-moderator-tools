// ==UserScript==
// @name        WordPress Moderator Tools
// @namespace   WordPress_moderator_tools
// @description Adds keyboard shortcut navigation (and more) for WordPress forum moderators.
// @include     *://*wordpress.org/support/bb-admin/posts.php*
// @include     *://*wordpress.org/support/bb-admin/topics.php*
// @include     *://*wordpress.org/support/profile/*
// @include     *://*wordpress.org/support/forum/*
// @include     *://*wordpress.org/support/topic/*
// @include     *://*wordpress.org/support/edit.php?id=*
// @include     *://*wordpress.org/support/view/plugin-reviews/*
// @include     *://*wordpress.org/support/view/theme-reviews/*
// @include     *://*wordpress.org/tags/modlook
// @version     3.2.1
// @downloadURL https://github.com/keesiemeijer/WordPress-moderator-tools/raw/master/WordPress_Moderator_Tools_Chrome_min.user.js
// @updateURL https://github.com/keesiemeijer/WordPress-moderator-tools/raw/master/WordPress_Moderator_Tools_Chrome_min.user.js
// @grant       none
// ==/UserScript==

function moderator_tools_with_jquery(b){var a=document.createElement("script");a.type="text/javascript";a.textContent="("+b.toString()+")(jQuery)";document.body.appendChild(a)}moderator_tools_with_jquery(function(L){var Y="hide";var g="#e3cebd";var K="#moderator_tools_menu{position:fixed;top:10px;left:65px;background:white;border:3px solid #333333; color:#333333; padding: 0 3em 0 10px;}#moderator_tools_menu a{text-decoration:none;border:none;}#moderator_tools_menu a:hover{color:#d54e21;}#wordpress-org #moderator_tools_menu{font-size:13px}#wordpress-org #moderator_tools_menu .wpmt_close_menu span{display:none; }.wpmt_stats{padding-bottom:1em;}.wpmt_stats span{display:inline-block;margin:5px 0;}.wpmt_shortcuts_help{margin-left:5px;} .wpmt_shortcut{background-color:#cae8f7;padding:1px 3px;display:inline-block;margin-bottom:4px;font-weight:bold}.wpmt_shortcuts_title{display:block;font-weight:bold;margin:1em 0}#wordpress-org .wpmt_shortcuts_title{display:inline}.wpmt_shortcuts_top{margin-bottom:1em}.wpmt_close_menu{position: absolute; right: 0; top: 5px;padding:0;margin:4px 1em 0 0; }.wpmt_close_menu a{font-size:1.8em;border:0;}.wpmt_is_admin .wpmt_close_menu a{font-size:1.5em;}.wpmt_menu_state{margin-right:40px}.wpmt_profile_edit{display:block;margin-top:5px}.wpmt_modlook{background-color:#efeef5;margin-left:.5em;padding:1px 2px;}.wpmt_ip-warning{color:red;display:block;} .reviewer .wpmt_ip-warning{display:inline-block;margin-right:1em;}",e="wpmt_current",ae="https://wordpress.org/support/bb-admin",E='<span class="wpmt_shortcuts_title">Shortcuts available for this page:</span>',b=L('<div id="moderator_tools_menu"></div>'),w=L('<span class="wpmt_close_menu"><a href="#" >&times;</a></span>'),I=L('<span class="wpmt_menu_state"></span>'),T=L('<p class="wpmt_shortcuts_top"></p>'),i={},D={},F=false,a=false,d=false,O=true,X,W,f,P,q,A,ad;var h={ANT:new RegExp('id="elf_not_trusted".+?checked="checked"',"gi"),EditPost:new RegExp(".+?/support/edit.php.+?","gi"),username:new RegExp('id="userlogin">(.+?)<',"gi")};var H={a:"%a% - <span class='wpmt_select'>select</span>/deselect all posts",d:"%d% - loop through Bulk Actions dropdown options",e1:"%e% - edit the user profile from the current post in a new tab.",e2:"%e% - refresh this profile page",e3:"%e% - open the edit profile page in a new tab",e4:"%e% - open the current post's user profile page in a new tab",h:"%h% - show/hide shortcuts",i:"%i% - edit all user profiles from <span class='wpmt_select'>selected posts</span> in new tabs.",shift_i:"%shift i% to edit non bozo user profiles only",m:"%m% - show/hide menu",n:"%n% - go to User Activity",r:"%r% - open the user's bb-admin posts page in a new tab",s:"%s% - <span class='wpmt_select'>select</span>/deselect current post",v:"%v% - view current post in a new tab",w:"%w% - remove website url (or add it back)",x:'%x% - select/deselect "Akismet Never Trust" checkbox',z:'%z% - select/deselect "This user is a bozo" checkbox',z_x:"%z% - go to the next normal profile post | %x% - go to the previous normal profile post",z_x1:"%z% - go to the next user with a duplicate IP | %x% - go to the previous user with a duplicate IP",shift_z_x:"%shift z% - go to the next bozo profile post | %shift x% - go to the previous bozo profile post",t_b:"%t% - go to the top of this page  | %b% - go to the bottom of this page",n_p:"%n% - go to the next post | %p% - go to the previous post",click_author:"%mouse click% - Click in the Author column to <span class='wpmt_select'>select</span>/deselect a post (also sets the post to current)",click_post:"%mouse click% - Click anywhere in a post to set it to current, for navigation with the shortcuts %n% and %p% (see above)"};function V(){if(s(L("#moderator_tools_menu"))||s(L("#moderator_tools_ed_uncap"))){return}var af=true;if(s(L("#posts-list"))){a=true;d=true;Q("posts")}if(s(L("#topics-list"))){a=true;d=true;Q("topics")}if(!a){var ag=L(".mod-login");if(s(ag)){d=true;L("head").append('<style type="text/css">#headline .login{text-align:right;}</style>');ag.append(' | <a href="'+ae+'/posts.php?forum_id=0&post_status=2">Spam Queue</a> | <a href="https://wordpress.org/tags/modlook">Modlook</a>');if(s(L("#profile-form"))){M()}if(s(L(".edit-form"))){j();af=false}if(s(L(".forumlist"))){Z(".widefat")}if(s(L(".all-reviews"))){l();af=false}}if(s(L("#user-replies"))||s(L("#user-threads"))){o()}if(s(L("#thread"))){v();af=false}}else{b.addClass("wpmt_is_admin")}if(af){ac();J();r()}B();u()}function Q(ag){var ai=(ag==="topics")?"topic":"post";D={bulk_actions:"",topics:ag==="topics"?true:false,column:".check-column > input",author:L("td.author"),toggle:L('<a href="#">shortcuts</a>'),help:L(' <span class="wpmt_shortcuts_help">(h) </span>'),stats:L('<span class="wpmt_stats"></span>')};D.bulk_actions_checkbox=L("thead tr "+D.column+",tfoot tr "+D.column);var af="table.widefat tr.wpmt_current td{border:solid #9f9f9f;border-width:2px 0}table.widefat tr.wpmt_current td.check-column{border-left:2px solid #9f9f9f}table#posts-list tr.wpmt_current td.date,table#topics-list tr.wpmt_current td.freshness{border-right:2px solid #9f9f9f}{border-right:2px solid #9f9f9f}.wpmt_bozo_profile{display:block;margin-top:10px;color:white;text-align:center;background:red}.wpmt_profile_type{padding:4px 6px;border:1px solid red}.wpmt_profile_type.wpmt_green{border:1px solid green}.wpmt_selected,.wpmt_select{background-color: "+g+";}.wpmt_profile_type.wpmt_selected{padding: 5px 7px;border:none;}";L("head").append('<style type="text/css">'+K+af+"</style>");var ah=k([H.m,H.t_b,H.n_p,H.h,H.d,H.a,H.s,H.v,H.e1,H.i]);if(!D.topics){ah=ah.replace(/<br\/>$/g,"");ah+=" | "+k([H.shift_i,H.z_x,H.shift_z_x])}ah+=k([H.click_author,H.click_post]);ah=(D.topics)?ah.split("post").join(ai):ah;D.shortcuts=L('<p style="display: none;">'+E+ah+"</p>");b.append(D.stats,D.help,D.toggle,w,D.shortcuts);L("body").append(b);L("#bbUserInfo > p").prepend(I);c();q="tr."+e;A="tr:first";ad=L("#"+ag+"-list tbody tr");f=L("#bbHead");P=ad.last();ab();m()}function M(){var ag=L("#user_url");D={website:ag,site_url:ag.val(),bozo:L("input#is_bozo"),askimet:L("#elf_not_trusted")};L("head").append('<style type="text/css">'+K+"</style>");var af=H.n_p.split("post").join("section");var ah=k([H.m,H.t_b,af,H.e2,H.r,H.w,H.z,H.x]);T.append(E,w);ah="<p>"+ah+"</p>";b.append(T,ah);L("body").append(b);I.insertBefore(L("#profile-form")).wrap("<p></p>");c();q="#profile-form h3."+e;A="h3.wpmt_section:first";ad=L("#profile-form h3");ad.addClass("wpmt_section");L("h3:contains('Mailing Lists')").removeClass("wpmt_section");L("h3:contains('Administration')").addClass("wpmt_admin_section");L("label[for='user_url']").append(z(" %(w)%"));L("label[for='is_bozo']").append(z(" %(z)%"));L("label[for='elf_not_trusted']").append(z(" %(x)%"));f=L("#wporg-header");P=L("#wporg-footer");S();t()}function o(){L("head").append('<style type="text/css">'+K+"</style>");var ag=k([H.m,H.t_b,H.n]);if(d){ag+=k([H.e3,H.r])}T.append(E,w);ag="<p>"+ag+"</p>";b.append(T,ag);L("body").append(b);var af=L(".topicnav").first().find("p");af.css("margin","0 0 .5em");I.insertAfter(af).wrap("<p></p>");c();L.each(["#user-replies","#user-threads"],function(ah,ai){Z(ai)});q="#useractivity."+e;A=0;ad=L("#useractivity");f=L("#wporg-header");P=L("#wporg-footer");if(d){S()}}function v(){D={tags:L("#yourtaglist"),author:".threadauthor > p > strong"};var af=".wpmt_current .authortitle a, .reviewer-name {background-color: #efeef5;padding: 3px 6px;margin: 3px 0;display: inline-block;}.wpmt_ip-warning{color:red;}";L("head").append('<style type="text/css">'+K+af+"</style>");var ah="<p>"+k([H.m,H.t_b,H.n_p,H.z_x1,H.e4,H.click_post])+"</p>";T.append(E,w);b.append(T,ah);L("body").append(b);var ag=L(".topicnav").first().find(".bbcrumb");ag.css("margin","0 0 .5em");I.insertAfter(ag).wrap("<p></p>");c();q="li."+e;A="li:first";ad=L(".postitem");f=L("#wporg-header");P=ad.last();if(s(ad)>1){U()}R();J();r();C();G();if(ad.length===1){ad.first().trigger("click.wpmt")}}function l(){ad=L(".review");X=ad;if(s(ad)<1){return}D={author:".reviewer-name"};var af="<p>"+k([H.m,H.t_b,H.n_p,H.z_x1])+"</p>";T.append(E,w);b.append(T,af);L("body").append(b);L(".all-reviews").prepend(I);I.wrap("<p></p>");c();q="div."+e;f=L("#wporg-header");P=L("#wporg-footer");U();y();R();J();r();K+=".wpmt_current a.reviewer-name {background-color: #efeef5;padding: 3px 6px;margin: 3px 0;display: inline-block;}";L("head").append('<style type="text/css">'+K+"</style>")}function t(){L("html").bind("keydown.wpmt",function(aj){var af=n(aj);var ai;if((F!==false)||(1!==af)){return}if((87===aj.keyCode)&&(s(D.website)===1)){L(q).removeClass(e);ai=ad.first();ai.addClass(e);aa(ai);if(D.site_url){if(""===D.website.val()){D.website.val(D.site_url)}else{D.website.val("")}clearTimeout(ah);D.website.parents("tr").css("background-color","#FFFFCC");var ah=setTimeout(function(){D.website.parents("tr").css("background-color","#FFFFFF")},300)}}if(aj.keyCode===90||aj.keyCode===88){var ag=(aj.keyCode===90)?D.bozo:D.askimet;if(ag){L(q).removeClass(e);ai=L("h3.wpmt_admin_section").addClass(e);if(s(ai)===1){aa(L(ai));if(ag.attr("checked")){ag.removeAttr("checked")}else{ag.click()}clearTimeout(ak);ag.parents("tr").css("background-color","#FFFFCC");var ak=setTimeout(function(){ag.parents("tr").css("background-color","#FFFFFF")},300)}}}})}function G(){ad.bind("click.wpmt",function(af){if(af.target.nodeName!=="A"){x();L(this).addClass(e)}});L("html").bind("keydown.wpmt",function(ai){if(F!==false){return}var ag=n(ai);var ah=L(q);if(s(ah)){var af=L(ah).find(".authortitle a");if(s(af)){if((ai.keyCode===69)&&(ag=1)){N(af.attr("href"))}}}});L('[class^="delete:yourtaglist:"]').click(function(ah){if(O){ah.preventDefault();var ag=L(this).closest("li"),af=L(this).attr("href");L.ajax({url:af,async:true,dataType:"html",success:function(ai){ag.fadeOut()}})}})}function m(){L("html").bind("keydown.wpmt",function(an){if(F!==false){return}var am=n(an);var ao,ag;if((an.keyCode===83)&&(am===1)){ao=L(q);if(s(ao)===1){aa(ao);var ah=ao.find(D.column);ah.attr("checked",!ah.attr("checked"));ab()}}if((an.keyCode===86)&&(am===1)){ao=L(q);if(s(ao)){var ar=D.topics?ao.find(".row-title > a:first"):ao.find(".row-actions > a:first");if(s(ar)){if(D.topics){ag=ar.attr("href")}else{ag=(ar.text()==="View")?ar.attr("href"):0}if(ag.length){N(ag)}}}}if((an.keyCode===68)&&(am===1)){L(".bulk-form select[name=action] > option:selected").removeAttr("selected").next("option").attr("selected","selected")}if((an.keyCode===65)&&(am===1)){D.bulk_actions=(D.bulk_actions_checkbox.attr("checked"))?"off":"on";p()}if((an.keyCode===72)&&(am===1)){D.shortcuts.toggle();ao=L(q);if(s(ao)){aa(ao)}}if(i.hasOwnProperty(73)){var ak,aq=[],ap=false;if(!D.topics&&(i.hasOwnProperty(16)&&am===2)){ap=true;ak=L(".wpmt_normal_post").find(".post_selected")}else{if(am===1){ap=true;ak=L(".post_selected")}}if(ap&&s(ak)){ak.each(function(){ag=L(this).children().first("a").attr("href");if(aq.indexOf(ag)===-1){aq.push(ag);N(ag+"/edit")}})}}if((an.keyCode===69)&&(am===1)){ao=L(q);if(s(ao)===1){ag=ao.find(".wpmt_profile_edit > a").attr("href");if(ag.length){N(ag)}}}if(!D.topics&&(ad.length>=1)){if(i.hasOwnProperty(90)||i.hasOwnProperty(88)){var aj=(i.hasOwnProperty(16)&&(am===2))?"bozo":"normal";var at=i.hasOwnProperty(90)?"z":"x",ai=L(".wpmt_"+aj+"_post");if(s(ai)){if(!s(L(q))){if(at==="z"||((ai.length===1)&&at==="x")){ao=ai.first();ao.addClass(e);aa(ao)}}else{if(ai.length===1){var al=ai.first();x();al.addClass(e);aa(al)}else{var af;ao=L(q);if(at==="z"){af=ao.nextAll(".wpmt_"+aj+"_post:first")}if(at==="x"){af=ao.prevAll(".wpmt_"+aj+"_post:first")}if(s(af)){x();af.addClass(e);aa(af)}}}}}}});if(O){L(".post-delete-link, .post-spam-link").click(function(ah){ah.preventDefault();var ag=L(this).closest("tr"),af=L(this).attr("href");L.ajax({url:af,async:true,dataType:"html",success:function(ai){ag.fadeOut()}})})}D.bulk_actions_checkbox.bind("click.wpmt",function(){D.bulk_actions=(L(this).attr("checked"))?"on":"off";p()});ad.bind("click.wpmt",function(af){if(af.target.nodeName!=="A"){L("tbody tr").removeClass(e);L(this).addClass(e)}});L("tbody > tr > "+D.column).bind("click.wpmt",function(af){ab()});D.author.bind("click.wpmt",function(af){if(af.target.nodeName!=="A"){ab(L(this).parent().attr("id"))}});D.toggle.bind("click.wpmt",function(af){af.preventDefault();D.shortcuts.toggle()});w.bind("click.wpmt",function(af){af.preventDefault();D.shortcuts.hide()})}function S(){var af=L("#profile-menu");var ak;var ah;var aj;if(s(af)){ak=af.find("a").filter(function(al){return L(this).text()==="Edit"})}else{return}if(s(ak)){ak.text("Edit (e)");ah=ak.attr("href");var ag=L("#userlogin");if(s(ag)){aj=ae+"/posts.php?forum_id=0&post_author="+ag.text();var ai=L('<li><a href="'+aj+'">bb-admin (r)</a></li>');ak.parent().after(ai)}}if(!(ah.length||aj.length)){return}L("html").bind("keydown.wpmt",function(am){var al=n(am);if((F!==false)||(al!==1)){return}if((am.keyCode===69)&&(ah.length)){if(s(L("#profile-form"))){location.reload(true)}else{N(ah)}}if((am.keyCode===82)&&(aj.length)){N(aj)}})}function ac(){var af;L("html").bind("keydown.wpmt",function(ai){if(F!==false||(typeof(ad)==="undefined")){return}var ah=n(ai);if(!(ai.keyCode===78||ai.keyCode===80)||(ah!==1)){return}var ag=ai.keyCode===78?"n":"p";if(!s(L(q))){if(ag==="n"){af=ad.first();aa(af);af.addClass(e)}}else{af=L(q);if(ag==="n"){if(s(af.nextAll(A))){af.removeClass(e).nextAll(A).addClass(e);aa(L(q))}else{aa(L(q))}}if(ag==="p"){if(s(af.prevAll(A))){af.removeClass(e).prevAll(A).addClass(e);aa(L(q))}else{af.removeClass(e);if(s(f)&&A){aa(f)}}}}})}function R(){var af;L("html").bind("keydown.wpmt",function(al){if(F!==false||(typeof(ad)==="undefined")){return}var ai=n(al);var ag=0;L.each({90:"z",88:"x",78:"n",80:"p"},function(an,ao){if(al.keyCode===parseInt(an)){ag=ao}});if(!(ag&&(ai===1))){return}var am=s(L(q));if(!am&&((ag==="n")||(ag==="p"))){ak=ad.first();aa(ak);ak.addClass(e)}else{var ak=false,ah=false,aj=false;ad.each(function(an){var ap=false,ao=false;if(!L(this).hasClass(e)){if(L(this).has(".wpmt_ip-warning").length){ah=an}aj=an}if(L(this).hasClass(e)){ak=an;if(ag==="x"&&(ah!==false)){ap=ah}if(ag==="p"&&(aj!==false)){ap=aj}if(ap!==false){ad.eq(ak).removeClass(e);ad.eq(ap).addClass(e);aa(ad.eq(ap));return false}}if(((ak!==false)&&(ak!==an))||!am){if((ag==="z")&&L(this).has(".wpmt_ip-warning").length){ao=an}if(ag==="n"){ao=an}if(ao!==false){ad.eq(ak).removeClass(e);ad.eq(ao).addClass(e);aa(ad.eq(ao));return false}}})}})}function J(){L("html").bind("keydown.wpmt",function(ag){if(F!==false){return}var af=n(ag);if(s(f)&&(ag.keyCode===84)&&(af===1)){aa(f);if(typeof(ad)!=="undefined"){x()}}if(s(P)&&(ag.keyCode===66)&&(af===1)){aa(P);if(typeof(ad)!=="undefined"){x();ad.last().addClass(e)}}})}function r(){w.bind("click.wpmt",function(ag){ag.preventDefault();b.toggle();Y=(b.is(":visible"))?"show":"hide";c();var af=L(q);if(s(af)){aa(af)}});L("html").bind("keydown.wpmt",function(ag){if(F!==false){return}var af=n(ag);if((ag.keyCode===77)&&(af===1)){w.trigger("click.wpmt")}})}function p(){D.author.each(function(){var af=L(this).parent().find(D.column);if(D.bulk_actions==="on"){af.attr("checked",true)}else{af.attr("checked",false)}});ab();D.bulk_actions=false}function ab(ak){D.stats.empty();var aj=0;D.author.each(function(){var aq=L(this).parent().children(".check-column").css("background-color"),an=L.trim(L(this).children().first("a").text()),ao=L(this).parent().find(D.column);L(this).css("background",aq);if(!s(L(this).children(".wpmt_profile_edit"))){var am=L("img",L(this).children().first("a")),al='<br/><span class="wpmt_profile_edit"><a href="'+L(this).children().first("a").attr("href")+'/edit">Edit Profile</a></span>';if(an.indexOf("(BOZO)")>=0){an=L.trim(an.replace("(BOZO)",""));L(this).children().first("a").text(" "+an);if(am){L(this).children().first("a").prepend(am)}if(O){var ap=L(this).children().first("a");L.ajax({url:ap.attr("href")+"/edit",async:true,dataType:"html",success:function(ar){if(-1!=ar.search(h.ANT)){ap.append('<span class="wpmt_bozo_profile" >BOZO (ANT)</span>');ap.parent().addClass("wpmt_bozo_post")}else{ap.append('<span class="wpmt_bozo_profile" >BOZO</span>');ap.parent().addClass("wpmt_bozo_post")}}})}else{L(this).append('<span class="wpmt_bozo_profile" >BOZO</span>');L(this).parent().addClass("wpmt_bozo_post")}++aj}else{L(this).parent().addClass("wpmt_normal_post")}L(this).children().first("a").after(al)}else{if(s(L(this).children("span.wpmt_bozo_profile"))){++aj}}if(ao.attr("checked")){L(this).attr("style","background: "+g+";");L(this).addClass("post_selected")}else{L(this).css("background",aq);L(this).removeClass("post_selected")}if((typeof(ak)!=="undefined")&&(ak===L(this).parent().attr("id"))){if(ao.attr("checked")){L(this).css("background",aq);ao.attr("checked",false);L(this).removeClass("post_selected")}else{L(this).attr("style","background: "+g+";");ao.attr("checked",true);L(this).addClass("post_selected")}}});var ag=L("tbody > tr").length,ai=L("tbody > tr > "+D.column+":checked").length;if(ai<ag){L(D.bulk_actions_checkbox).attr("checked",false)}if(ai===ag){L(D.bulk_actions_checkbox).attr("checked",true)}var af="";var ah=(D.topics)?"topic":"post";af+="Current Page: "+ag+" "+ah+((ag===1)?"":"s");if(!D.topics){af+=' &#10022; <span class="wpmt_profile_type">';af+=(aj>0)?aj+" bozo"+((aj===1)?"":"s"):"0 bozos";af+="</span>";af+=' &#10022; <span class="wpmt_profile_type wpmt_green">';af+=(ag-aj>0)?(ag-aj)+" normal profile"+(((ag-aj)===1)?"":"s"):"no normal profiles";af+="</span>"}af+=' | <span class="wpmt_profile_type wpmt_selected">';af+=(ai>0)?ai+" "+ah+((ai===1)?"":"s")+" selected":"No "+ah+"s selected";af+="</span> | ";D.stats.append(af)}function U(){L(".wpmt_ip-warning").remove();var ah=ad;var ag={};var ai={};var af={};ah=ah.filter(function(){var aj=L(this).find(D.author).text();var ak=L(this).find(".post-ip-link").text();if(!(aj.length&&ak.length)){return false}if(ag[aj+ak]){return false}else{ag[aj+ak]=true;return true}});L.each(ah,function(aj,ak){var al=L(this).find(".post-ip-link").text();if(al.length){if(ai[al]){af[al]=true}else{ai[al]=true}}});if(L.isEmptyObject(af)){return}ad.each(function(){var ak=L(this).find(".post-ip-link");if(s(ak)===1){var aj=ak.text();if(af[aj]){ak.before(L('<span class="wpmt_ip-warning">(DUPLICATE IP)</span>'))}}})}function C(){L("#yourtaglist").find("a").each(function(){if(L(this).text()==="modlook"){var ag=L(this).parents("li");if(s(ag)){parent_id=ag.attr("id").split("_");if(parent_id[1].length){if(O){var af=parent_id[1];L.ajax({url:"https://wordpress.org/support/profile/"+parent_id[1],async:true,dataType:"html",success:function(ai){var ah=h.username.exec(ai);if(ah.length>=2){af=ah[1]}ag.append(L('<a class="wpmt_modlook" href="https://wordpress.org/support/profile/'+parent_id[1]+'" title="modlook tagged by user '+parent_id[1]+'">'+af+"</a>"))}})}else{ag.append(L('<a class="wpmt_modlook" href="https://wordpress.org/support/profile/'+parent_id[1]+'" title="modlook tagged by user '+parent_id[1]+'">'+parent_id[1]+"</a>"))}}}}})}function j(){var aj=0,af=0,ah=0;var ai=L("#ed_toolbar");if(s(ai)){var ag=L('<input id="moderator_tools_ed_uncap" class="moderator_tools_ed_button" type="button" value="l-case" accesskey="d">');ai.append(ag);L("#post_content").add(L("#topic")).select(function(ak){aj=ak.target.selectionStart;af=ak.target.selectionEnd;ah=L(this)});ag.bind("click.wpmt",function(an){an.preventDefault();if(ah){var am=ah.val().substring(aj,af).toLowerCase();var ak=ah.val().substring(0,aj)+am+ah.val().substring(af);ah.val(ak);ah.focus();var al=ah.get(0);al.selectionStart=af;al.selectionEnd=af}aj=af=ah=0})}}function Z(af){var ag=L(af).find("a");if(!s(L(ag))){return}L(ag).attr("href",function(){var ai=this.search;var ah=this.protocol+"//"+this.host+this.pathname;var aj=false;if(ai){var ak=/view=all/g;if(!ak.test(ai)){aj=ah+ai+"&view=all"}}else{aj=ah+"?view=all"}if(aj){return aj+this.hash}return this})}function B(){el=L("form");if(s(el)){el.focusin(function(){F=true}).focusout(function(){F=false})}}function u(){L(document).bind("keyup.wpmt",function(af){if(i.hasOwnProperty(af.which)){delete i[af.which]}})}function n(af){i[af.which]=true;return Object.keys(i).length}function aa(ag){var ah=ag.offset().top;var af=65;if(b.is(":visible")){af=b.height();af+=30}else{if((L(ag).height()+af)>L(window).height()){af=5}}ah=ah-af;L("html, body").animate({scrollTop:ah},{duration:150})}function c(){if("hide"===Y){b.hide();I.text("type m to display the menu")}else{if("show"===Y){I.text("type m to hide the menu")}else{Y="hide";b.hide();I.text("type m to display the menu")}}}function x(){if(s(ad)){ad.removeClass(e)}}function N(af){i={};setTimeout(function(){window.open(af,"_blank")},200)}function k(af){if(!s(af)){return""}var ag="";L.each(af,function(ah,ai){ag+=z(ai)+"<br/>"});return ag}function z(af){return af.replace(/\%(.*?)\%/g,'<span class="wpmt_shortcut">$1</span>')}function s(af){if(typeof(af)!=="undefined"){return af.length}return 0}function y(){var ah=L("#pages").first(),af=L(ah).find("a").not(".next"),al=af.last(),aj=1,ai=window.location.href,ag=L('<div class="all-reviews_container" id="all-reviews_container"/>'),am=L(".all-reviews").append(ag);if(ah.children().first().hasClass("current")){var ak=L('<button aria-controls="all-reviews_container"  aria-expanded="false" class="button reviews-toggle-all">All reviews</button>');am.prepend(ak);ak.click(function(){if(ak.hasClass("reviews-toggle-all--visible")){ag.hide();x();ad=X;U();ak.text("All reviews").removeClass("reviews-toggle-all--visible").attr("aria-expanded",false)}else{if(ak.hasClass("reviews-toggle-all--toggled")){ag.show();x();ad=W;U();ak.text("Fewer reviews").addClass("reviews-toggle-all--visible").attr("aria-expanded",true)}else{var an=1;ak.text("Fewer reviews").addClass("reviews-toggle-all--toggled reviews-toggle-all--visible").attr("aria-expanded",true);for(aj;aj<al.text();aj++){L.get(ai+"/page/"+(aj+1),function(ap){var ao=L(ap).find(".review");ag.append(ao);if(an===parseInt(al.text())-1){ad=L(".review");W=ad;U()}an++})}}}});K+='.reviews-toggle-all {margin-bottom: 2em;padding-right: 2em;position: relative;}.reviews-toggle-all:after {content: "+";position: absolute;right: 10px;top: 0;font-family: seriffont-size: 16px;}.reviews-toggle-all--visible:after {content: "-";}'}}V()});