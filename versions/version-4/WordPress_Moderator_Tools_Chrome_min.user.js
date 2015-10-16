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
// @version     4.0.1
// @downloadURL https://github.com/keesiemeijer/WordPress-moderator-tools/raw/master/WordPress_Moderator_Tools_Chrome_min.user.js
// @updateURL https://github.com/keesiemeijer/WordPress-moderator-tools/raw/master/WordPress_Moderator_Tools_Chrome_min.user.js
// @grant       none
// ==/UserScript==

function moderator_tools_with_jquery(b){var a=document.createElement("script");a.type="text/javascript";a.textContent="("+b.toString()+")(jQuery)";document.body.appendChild(a)}moderator_tools_with_jquery(function(N){var aa="hide";var g="#e3cebd";var M="#moderator_tools_menu{position:fixed;top:10px;left:65px;background:white;border:3px solid #333333; color:#333333; padding: 0 3em 0 10px;}#moderator_tools_menu a{text-decoration:none;border:none;}#moderator_tools_menu a:hover{color:#d54e21;}#wordpress-org #moderator_tools_menu{font-size:13px}#wordpress-org #moderator_tools_menu .wpmt_close_menu span{display:none; }.wpmt_stats{padding-bottom:1em;}.wpmt_stats span{display:inline-block;margin:5px 0;}.wpmt_shortcuts_help{margin-left:5px;} .wpmt_shortcut{background-color:#cae8f7;padding:1px 3px;display:inline-block;margin-bottom:4px;font-weight:bold}.wpmt_shortcuts_title{display:block;font-weight:bold;margin:1em 0}#wordpress-org .wpmt_shortcuts_title{display:inline}.wpmt_shortcuts_top{margin-bottom:1em}.wpmt_close_menu{position: absolute; right: 0; top: 5px;padding:0;margin:4px 1em 0 0; }.wpmt_close_menu a{font-size:1.8em;border:0;}.wpmt_is_admin .wpmt_close_menu a{font-size:1.5em;}.wpmt_menu_state{margin-right:40px}.wpmt_profile_edit{display:block;margin-top:5px}.wpmt_modlook{background-color:#efeef5;margin-left:.5em;padding:1px 2px;}.wpmt_ip-warning{color:red;display:block;} .reviewer .wpmt_ip-warning{display:inline-block;margin-right:1em;}.wpmt_screen_reader_text{clip: rect(1px, 1px, 1px, 1px);position: absolute !important;height: 1px;width: 1px;overflow: hidden;}",e="wpmt_current",ag="https://wordpress.org/support/bb-admin",G='<span class="wpmt_shortcuts_title">Shortcuts available for this page:</span>',b=N('<div id="moderator_tools_menu"></div>'),y=N('<span class="wpmt_close_menu"><a href="#" >&times;</a></span>'),K=N('<span class="wpmt_menu_state"></span>'),V=N('<p class="wpmt_shortcuts_top"></p>'),i={},F={},H=false,a=false,d=false,Q=true,Z="",f,R,r,C,af;var h={ANT:new RegExp('id="elf_not_trusted".+?checked="checked"',"gi"),EditPost:new RegExp(".+?/support/edit.php.+?","gi"),username:new RegExp('id="userlogin">(.+?)<',"gi")};var J={a:"%a% - <span class='wpmt_select'>select</span>/deselect all posts",d:"%d% - loop through Bulk Actions dropdown options",e1:"%e% - edit the user profile from the current post in a new tab.",e2:"%e% - refresh this profile page",e3:"%e% - open the edit profile page in a new tab",e4:"%e% - open the current post's user profile page in a new tab",h:"%h% - show/hide shortcuts",i:"%i% - edit all user profiles from <span class='wpmt_select'>selected posts</span> in new tabs.",shift_i:"%shift i% to edit non bozo user profiles only",m:"%m% - show/hide menu",n:"%n% - go to User Activity",r:"%r% - open the user's bb-admin posts page in a new tab",s:"%s% - <span class='wpmt_select'>select</span>/deselect current post",v:"%v% - view current post in a new tab",w:"%w% - remove website url (or add it back)",x:'%x% - select/deselect "Akismet Never Trust" checkbox',z:'%z% - select/deselect "This user is a bozo" checkbox',z_x:"%z% - go to the next normal profile post | %x% - go to the previous normal profile post",z_x1:"%z% - go to the next user with a duplicate IP | %x% - go to the previous user with a duplicate IP",shift_z_x:"%shift z% - go to the next bozo profile post | %shift x% - go to the previous bozo profile post",t_b:"%t% - go to the top of this page  | %b% - go to the bottom of this page",n_p:"%n% - go to the next post | %p% - go to the previous post",click_author:"%mouse click% - Click in the Author column to <span class='wpmt_select'>select</span>/deselect a post (also sets the post to current)",click_post:"%mouse click% - Click anywhere in a post to set it to current, for navigation with the shortcuts %n% and %p% (see above)"};function X(){if(u(N("#moderator_tools_menu"))||u(N("#moderator_tools_ed_uncap"))){return}var ah=true;if(u(N("#posts-list"))){a=true;d=true;S("posts")}if(u(N("#topics-list"))){a=true;d=true;S("topics")}if(!a){var ai=N(".mod-login");if(u(ai)){d=true;N("head").append('<style type="text/css">#headline .login{text-align:right;}</style>');ai.append(' | <a href="'+ag+'/posts.php?forum_id=0&post_status=2">Spam Queue</a> | <a href="https://wordpress.org/tags/modlook">Modlook</a>');if(u(N("#profile-form"))){O()}if(u(N(".edit-form"))){j();Y();ah=false}if(u(N(".forumlist"))){ab(".widefat")}if(u(N(".all-reviews"))){Z=s("filter");l();ah=false}}if(u(N("#user-replies"))||u(N("#user-threads"))){o()}if(u(N("#thread"))){x();ah=false}}else{b.addClass("wpmt_is_admin")}if(ah){ae();L();t()}D();w()}function S(ai){var al=(ai==="topics")?"topic":"post";F={bulk_actions:"",topics:ai==="topics"?true:false,column:".check-column > input",author:N("td.author"),toggle:N('<a href="#">shortcuts</a>'),help:N(' <span class="wpmt_shortcuts_help">(h) </span>'),stats:N('<span class="wpmt_stats"></span>')};F.bulk_actions_checkbox=N("thead tr "+F.column+",tfoot tr "+F.column);var ah="table.widefat tr.wpmt_current td{border:solid #9f9f9f;border-width:2px 0}table.widefat tr.wpmt_current td.check-column{border-left:2px solid #9f9f9f}table#posts-list tr.wpmt_current td.date,table#topics-list tr.wpmt_current td.freshness{border-right:2px solid #9f9f9f}{border-right:2px solid #9f9f9f}.wpmt_bozo_profile{display:block;margin-top:10px;color:white;text-align:center;background:red}.wpmt_profile_type{padding:4px 6px;border:1px solid red}.wpmt_profile_type.wpmt_green{border:1px solid green}.wpmt_selected,.wpmt_select{background-color: "+g+";}.wpmt_profile_type.wpmt_selected{padding: 5px 7px;border:none;}";N("head").append('<style type="text/css">'+M+ah+"</style>");var ak=k([J.m,J.t_b,J.n_p,J.h,J.d,J.a,J.s,J.v,J.e1,J.i]);if(!F.topics){ak=ak.replace(/<br\/>$/g,"");ak+=" | "+k([J.shift_i,J.z_x,J.shift_z_x])}ak+=k([J.click_author,J.click_post]);ak=(F.topics)?ak.split("post").join(al):ak;F.shortcuts=N('<p style="display: none;">'+G+ak+"</p>");b.append(F.stats,F.help,F.toggle,y,F.shortcuts);N("body").append(b);N("#bbUserInfo > p").prepend(K);c();r="tr."+e;C="tr:first";af=N("#"+ai+"-list tbody tr");f=N("#bbHead");R=af.last();ad();m();var aj=N(".post");p(aj)}function O(){var ai=N("#user_url");F={website:ai,site_url:ai.val(),bozo:N("input#is_bozo"),askimet:N("#elf_not_trusted")};N("head").append('<style type="text/css">'+M+"</style>");var ah=J.n_p.split("post").join("section");var aj=k([J.m,J.t_b,ah,J.e2,J.r,J.w,J.z,J.x]);V.append(G,y);aj="<p>"+aj+"</p>";b.append(V,aj);N("body").append(b);K.insertBefore(N("#profile-form")).wrap("<p></p>");c();r="#profile-form h3."+e;C="h3.wpmt_section:first";af=N("#profile-form h3");af.addClass("wpmt_section");N("h3:contains('Mailing Lists')").removeClass("wpmt_section");N("h3:contains('Administration')").addClass("wpmt_admin_section");N("label[for='user_url']").append(B(" %(w)%"));N("label[for='is_bozo']").append(B(" %(z)%"));N("label[for='elf_not_trusted']").append(B(" %(x)%"));f=N("#wporg-header");R=N("#wporg-footer");U();v()}function o(){N("head").append('<style type="text/css">'+M+"</style>");var ai=k([J.m,J.t_b,J.n]);if(d){ai+=k([J.e3,J.r])}V.append(G,y);ai="<p>"+ai+"</p>";b.append(V,ai);N("body").append(b);var ah=N(".topicnav").first().find("p");ah.css("margin","0 0 .5em");K.insertAfter(ah).wrap("<p></p>");c();N.each(["#user-replies","#user-threads"],function(aj,ak){ab(ak)});r="#useractivity."+e;C=0;af=N("#useractivity");f=N("#wporg-header");R=N("#wporg-footer");if(d){U()}}function x(){F={tags:N("#yourtaglist"),author:".threadauthor > p > strong"};var ah=".wpmt_current .authortitle a, .reviewer-name {background-color: #efeef5;padding: 3px 6px;margin: 3px 0;display: inline-block;}.wpmt_ip-warning{color:red;}";N("head").append('<style type="text/css">'+M+ah+"</style>");var ak="<p>"+k([J.m,J.t_b,J.n_p,J.z_x1,J.e4,J.click_post])+"</p>";V.append(G,y);b.append(V,ak);N("body").append(b);var aj=N(".topicnav").first().find(".bbcrumb");aj.css("margin","0 0 .5em");K.insertAfter(aj).wrap("<p></p>");c();r="li."+e;C="li:first";af=N(".postitem");f=N("#wporg-header");R=af.last();if(u(af)>1){W()}T();L();t();E();I();if(af.length===1){af.first().trigger("click.wpmt")}if((N("#thread").length!==0)&&u(N(".mod-login"))){var ai=N(".threadpost .post");p(ai)}}function l(){af=N(".review");if(u(af)<1){return}F={author:".reviewer-name"};var ah="<p>"+k([J.m,J.t_b,J.n_p,J.z_x1])+"</p>";V.append(G,y);b.append(V,ah);N("body").append(b);N(".all-reviews").prepend(K);K.wrap("<p></p>");c();r="div."+e;f=N("#wporg-header");R=N("#wporg-footer");W();A();T();L();t();M+=".wpmt_current a.reviewer-name {background-color: #efeef5;padding: 3px 6px;margin: 3px 0;display: inline-block;}";N("head").append('<style type="text/css">'+M+"</style>")}function v(){N("html").bind("keydown.wpmt",function(al){var ah=n(al);var ak;if((H!==false)||(1!==ah)){return}if((87===al.keyCode)&&(u(F.website)===1)){N(r).removeClass(e);ak=af.first();ak.addClass(e);ac(ak);if(F.site_url){if(""===F.website.val()){F.website.val(F.site_url)}else{F.website.val("")}clearTimeout(aj);F.website.parents("tr").css("background-color","#FFFFCC");var aj=setTimeout(function(){F.website.parents("tr").css("background-color","#FFFFFF")},300)}}if(al.keyCode===90||al.keyCode===88){var ai=(al.keyCode===90)?F.bozo:F.askimet;if(ai){N(r).removeClass(e);ak=N("h3.wpmt_admin_section").addClass(e);if(u(ak)===1){ac(N(ak));if(ai.attr("checked")){ai.removeAttr("checked")}else{ai.click()}clearTimeout(am);ai.parents("tr").css("background-color","#FFFFCC");var am=setTimeout(function(){ai.parents("tr").css("background-color","#FFFFFF")},300)}}}})}function I(){af.bind("click.wpmt",function(ah){if(ah.target.nodeName!=="A"){z();N(this).addClass(e)}});N("html").bind("keydown.wpmt",function(ak){if(H!==false){return}var ai=n(ak);var aj=N(r);if(u(aj)){var ah=N(aj).find(".authortitle a");if(u(ah)){if((ak.keyCode===69)&&(ai=1)){P(ah.attr("href"))}}}});N('[class^="delete:yourtaglist:"]').click(function(aj){if(Q){aj.preventDefault();var ai=N(this).closest("li"),ah=N(this).attr("href");N.ajax({url:ah,async:true,dataType:"html",success:function(ak){ai.fadeOut()}})}})}function m(){N("html").bind("keydown.wpmt",function(ap){if(H!==false){return}var ao=n(ap);var aq,ai;if((ap.keyCode===83)&&(ao===1)){aq=N(r);if(u(aq)===1){ac(aq);var aj=aq.find(F.column);aj.attr("checked",!aj.attr("checked"));ad()}}if((ap.keyCode===86)&&(ao===1)){aq=N(r);if(u(aq)){var au=F.topics?aq.find(".row-title > a:first"):aq.find(".row-actions > a:first");if(u(au)){if(F.topics){ai=au.attr("href")}else{ai=(au.text()==="View")?au.attr("href"):0}if(ai.length){P(ai)}}}}if((ap.keyCode===68)&&(ao===1)){N(".bulk-form select[name=action] > option:selected").removeAttr("selected").next("option").attr("selected","selected")}if((ap.keyCode===65)&&(ao===1)){F.bulk_actions=(F.bulk_actions_checkbox.attr("checked"))?"off":"on";q()}if((ap.keyCode===72)&&(ao===1)){F.shortcuts.toggle();aq=N(r);if(u(aq)){ac(aq)}}if(i.hasOwnProperty(73)){var am,at=[],ar=false;if(!F.topics&&(i.hasOwnProperty(16)&&ao===2)){ar=true;am=N(".wpmt_normal_post").find(".post_selected")}else{if(ao===1){ar=true;am=N(".post_selected")}}if(ar&&u(am)){am.each(function(){ai=N(this).children().first("a").attr("href");if(at.indexOf(ai)===-1){at.push(ai);P(ai+"/edit")}})}}if((ap.keyCode===69)&&(ao===1)){aq=N(r);if(u(aq)===1){ai=aq.find(".wpmt_profile_edit > a").attr("href");if(ai.length){P(ai)}}}if(!F.topics&&(af.length>=1)){if(i.hasOwnProperty(90)||i.hasOwnProperty(88)){var al=(i.hasOwnProperty(16)&&(ao===2))?"bozo":"normal";var av=i.hasOwnProperty(90)?"z":"x",ak=N(".wpmt_"+al+"_post");if(u(ak)){if(!u(N(r))){if(av==="z"||((ak.length===1)&&av==="x")){aq=ak.first();aq.addClass(e);ac(aq)}}else{if(ak.length===1){var an=ak.first();z();an.addClass(e);ac(an)}else{var ah;aq=N(r);if(av==="z"){ah=aq.nextAll(".wpmt_"+al+"_post:first")}if(av==="x"){ah=aq.prevAll(".wpmt_"+al+"_post:first")}if(u(ah)){z();ah.addClass(e);ac(ah)}}}}}}});if(Q){N(".post-delete-link, .post-spam-link").click(function(aj){aj.preventDefault();var ai=N(this).closest("tr"),ah=N(this).attr("href");N.ajax({url:ah,async:true,dataType:"html",success:function(ak){ai.fadeOut(300,function(){N(this).remove()})}})})}F.bulk_actions_checkbox.bind("click.wpmt",function(){F.bulk_actions=(N(this).attr("checked"))?"on":"off";q()});af.bind("click.wpmt",function(ah){if(ah.target.nodeName!=="A"){N("tbody tr").removeClass(e);N(this).addClass(e)}});N("tbody > tr > "+F.column).bind("click.wpmt",function(ah){ad()});F.author.bind("click.wpmt",function(ah){if(ah.target.nodeName!=="A"){ad(N(this).parent().attr("id"))}});F.toggle.bind("click.wpmt",function(ah){ah.preventDefault();F.shortcuts.toggle()});y.bind("click.wpmt",function(ah){ah.preventDefault();F.shortcuts.hide()})}function U(){var ah=N("#profile-menu");var am;var aj;var al;if(u(ah)){am=ah.find("a").filter(function(an){return N(this).text()==="Edit"})}else{return}if(u(am)){am.text("Edit (e)");aj=am.attr("href");var ai=N("#userlogin");if(u(ai)){al=ag+"/posts.php?forum_id=0&post_author="+ai.text();var ak=N('<li><a href="'+al+'">bb-admin (r)</a></li>');am.parent().after(ak)}}if(!(aj.length||al.length)){return}N("html").bind("keydown.wpmt",function(ao){var an=n(ao);if((H!==false)||(an!==1)){return}if((ao.keyCode===69)&&(aj.length)){if(u(N("#profile-form"))){location.reload(true)}else{P(aj)}}if((ao.keyCode===82)&&(al.length)){P(al)}})}function ae(){var ah;N("html").bind("keydown.wpmt",function(ak){if(H!==false||(typeof(af)==="undefined")){return}var aj=n(ak);if(!(ak.keyCode===78||ak.keyCode===80)||(aj!==1)){return}var ai=ak.keyCode===78?"n":"p";if(!u(N(r))){if(ai==="n"){ah=af.first();ac(ah);ah.addClass(e)}}else{ah=N(r);if(ai==="n"){if(u(ah.nextAll(C))){ah.removeClass(e).nextAll(C).addClass(e);ac(N(r))}else{ac(N(r))}}if(ai==="p"){if(u(ah.prevAll(C))){ah.removeClass(e).prevAll(C).addClass(e);ac(N(r))}else{ah.removeClass(e);if(u(f)&&C){ac(f)}}}}})}function T(){var ah;N("html").bind("keydown.wpmt",function(an){if(H!==false||(typeof(af)==="undefined")){return}var ak=n(an);var ai=0;N.each({90:"z",88:"x",78:"n",80:"p"},function(ap,aq){if(an.keyCode===parseInt(ap)){ai=aq}});if(!(ai&&(ak===1))){return}var ao=u(N(r));if(!ao&&((ai==="n")||(ai==="p"))){am=af.first();ac(am);am.addClass(e)}else{var am=false,aj=false,al=false;af.each(function(ap){var ar=false,aq=false;if(!N(this).hasClass(e)){if(N(this).has(".wpmt_ip-warning").length){aj=ap}al=ap}if(N(this).hasClass(e)){am=ap;if(ai==="x"&&(aj!==false)){ar=aj}if(ai==="p"&&(al!==false)){ar=al}if(ar!==false){af.eq(am).removeClass(e);af.eq(ar).addClass(e);ac(af.eq(ar));return false}}if(((am!==false)&&(am!==ap))||!ao){if((ai==="z")&&N(this).has(".wpmt_ip-warning").length){aq=ap}if(ai==="n"){aq=ap}if(aq!==false){af.eq(am).removeClass(e);af.eq(aq).addClass(e);ac(af.eq(aq));return false}}})}})}function L(){N("html").bind("keydown.wpmt",function(ai){if(H!==false){return}var ah=n(ai);if(u(f)&&(ai.keyCode===84)&&(ah===1)){ac(f);if(typeof(af)!=="undefined"){z()}}if(u(R)&&(ai.keyCode===66)&&(ah===1)){ac(R);if(typeof(af)!=="undefined"){z();af.last().addClass(e)}}})}function t(){y.bind("click.wpmt",function(ai){ai.preventDefault();b.toggle();aa=(b.is(":visible"))?"show":"hide";c();var ah=N(r);if(u(ah)){ac(ah)}});N("html").bind("keydown.wpmt",function(ai){if(H!==false){return}var ah=n(ai);if((ai.keyCode===77)&&(ah===1)){y.trigger("click.wpmt")}})}function q(){F.author.each(function(){var ah=N(this).parent().find(F.column);if(F.bulk_actions==="on"){ah.attr("checked",true)}else{ah.attr("checked",false)}});ad();F.bulk_actions=false}function ad(am){F.stats.empty();var al=0;F.author.each(function(){var at=N(this).parent().children(".check-column").css("background-color"),ap=N.trim(N(this).children().first("a").text()),aq=N(this).parent().find(F.column);N(this).css("background",at);if(!u(N(this).children(".wpmt_profile_edit"))){var ao=N("img",N(this).children().first("a")),an='<br/><span class="wpmt_profile_edit"><a href="'+N(this).children().first("a").attr("href")+'/edit">Edit Profile</a></span>';if(ap.indexOf("(BOZO)")>=0){ap=N.trim(ap.replace("(BOZO)",""));N(this).children().first("a").text(" "+ap);if(ao){N(this).children().first("a").prepend(ao)}if(Q){var ar=N(this).children().first("a");N.ajax({url:ar.attr("href")+"/edit",async:true,dataType:"html",success:function(au){if(-1!=au.search(h.ANT)){ar.append('<span class="wpmt_bozo_profile" >BOZO (ANT)</span>');ar.parent().addClass("wpmt_bozo_post")}else{ar.append('<span class="wpmt_bozo_profile" >BOZO</span>');ar.parent().addClass("wpmt_bozo_post")}}})}else{N(this).append('<span class="wpmt_bozo_profile" >BOZO</span>');N(this).parent().addClass("wpmt_bozo_post")}++al}else{N(this).parent().addClass("wpmt_normal_post")}N(this).children().first("a").after(an)}else{if(u(N(this).children("span.wpmt_bozo_profile"))){++al}}if(aq.attr("checked")){N(this).attr("style","background: "+g+";");N(this).addClass("post_selected")}else{N(this).css("background",at);N(this).removeClass("post_selected")}if((typeof(am)!=="undefined")&&(am===N(this).parent().attr("id"))){if(aq.attr("checked")){N(this).css("background",at);aq.attr("checked",false);N(this).removeClass("post_selected")}else{N(this).attr("style","background: "+g+";");aq.attr("checked",true);N(this).addClass("post_selected")}}});var ai=N("tbody > tr").length,ak=N("tbody > tr > "+F.column+":checked").length;if(ak<ai){N(F.bulk_actions_checkbox).attr("checked",false)}if(ak===ai){N(F.bulk_actions_checkbox).attr("checked",true)}var ah="";var aj=(F.topics)?"topic":"post";ah+="Current Page: "+ai+" "+aj+((ai===1)?"":"s");if(!F.topics){ah+=' &#10022; <span class="wpmt_profile_type">';ah+=(al>0)?al+" bozo"+((al===1)?"":"s"):"0 bozos";ah+="</span>";ah+=' &#10022; <span class="wpmt_profile_type wpmt_green">';ah+=(ai-al>0)?(ai-al)+" normal profile"+(((ai-al)===1)?"":"s"):"no normal profiles";ah+="</span>"}ah+=' | <span class="wpmt_profile_type wpmt_selected">';ah+=(ak>0)?ak+" "+aj+((ak===1)?"":"s")+" selected":"No "+aj+"s selected";ah+="</span> | ";F.stats.append(ah)}function W(){N(".wpmt_ip-warning").remove();var aj=af;var ai={};var ak={};var ah={};aj=aj.filter(function(){var al=N(this).find(F.author).text();var am=N(this).find(".post-ip-link").text();if(!(al.length&&am.length)){return false}if(ai[al+am]){return false}else{ai[al+am]=true;return true}});N.each(aj,function(al,am){var an=N(this).find(".post-ip-link").text();if(an.length){if(ak[an]){ah[an]=true}else{ak[an]=true}}});if(N.isEmptyObject(ah)){return}af.each(function(){var am=N(this).find(".post-ip-link");if(u(am)===1){var al=am.text();if(ah[al]){am.before(N('<span class="wpmt_ip-warning">(DUPLICATE IP)</span>'))}}})}function E(){N("#yourtaglist").find("a").each(function(){if(N(this).text()==="modlook"){var ai=N(this).parents("li");if(u(ai)){parent_id=ai.attr("id").split("_");if(parent_id[1].length){if(Q){var ah=parent_id[1];N.ajax({url:"https://wordpress.org/support/profile/"+parent_id[1],async:true,dataType:"html",success:function(ak){var aj=h.username.exec(ak);if(aj.length>=2){ah=aj[1]}ai.append(N('<a class="wpmt_modlook" href="https://wordpress.org/support/profile/'+parent_id[1]+'" title="modlook tagged by user '+parent_id[1]+'">'+ah+"</a>"))}})}else{ai.append(N('<a class="wpmt_modlook" href="https://wordpress.org/support/profile/'+parent_id[1]+'" title="modlook tagged by user '+parent_id[1]+'">'+parent_id[1]+"</a>"))}}}}})}function j(){var al=0,ah=0,aj=0;var ak=N("#ed_toolbar");if(u(ak)){var ai=N('<input id="moderator_tools_ed_uncap" class="moderator_tools_ed_button" type="button" value="l-case" accesskey="d">');ak.append(ai);N("#post_content").add(N("#topic")).select(function(am){al=am.target.selectionStart;ah=am.target.selectionEnd;aj=N(this)});ai.bind("click.wpmt",function(ap){ap.preventDefault();if(aj){var ao=aj.val().substring(al,ah).toLowerCase();var am=aj.val().substring(0,al)+ao+aj.val().substring(ah);aj.val(am);aj.focus();var an=aj.get(0);an.selectionStart=ah;an.selectionEnd=ah}al=ah=aj=0})}}function ab(ah){var ai=N(ah).find("a");if(!u(N(ai))){return}N(ai).attr("href",function(){var ak=this.search;var aj=this.protocol+"//"+this.host+this.pathname;var al=false;if(ak){var am=/view=all/g;if(!am.test(ak)){al=aj+ak+"&view=all"}}else{al=aj+"?view=all"}if(al){return al+this.hash}return this})}function D(){el=N("form");if(u(el)){el.focusin(function(){H=true}).focusout(function(){H=false})}}function w(){N(document).bind("keyup.wpmt",function(ah){if(i.hasOwnProperty(ah.which)){delete i[ah.which]}})}function n(ah){i[ah.which]=true;return Object.keys(i).length}function ac(ai){var aj=ai.offset().top;var ah=65;if(b.is(":visible")){ah=b.height();ah+=30}else{if((N(ai).height()+ah)>N(window).height()){ah=5}}aj=aj-ah;N("html, body").animate({scrollTop:aj},{duration:150})}function c(){if("hide"===aa){b.hide();K.text("type m to display the menu")}else{if("show"===aa){K.text("type m to hide the menu")}else{aa="hide";b.hide();K.text("type m to display the menu")}}}function z(){if(u(af)){af.removeClass(e)}}function P(ah){i={};setTimeout(function(){window.open(ah,"_blank")},200)}function k(ah){if(!u(ah)){return""}var ai="";N.each(ah,function(aj,ak){ai+=B(ak)+"<br/>"});return ai}function B(ah){return ah.replace(/\%(.*?)\%/g,'<span class="wpmt_shortcut">$1</span>')}function s(ah){ah=ah.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var aj=new RegExp("[\\?&]"+ah+"=([^&#]*)"),ai=aj.exec(location.search);return ai===null?"":decodeURIComponent(ai[1].replace(/\+/g," "))}function u(ah){if(typeof(ah)!=="undefined"){return ah.length}return 0}function A(){var ap=N("#pages").first(),ak=N(ap).find("a").not(".next"),an=ak.last(),al=1,ao=window.location.href,ai=ao.split("?")[0],aj=N('<div class="all-reviews_container" id="all-reviews_container"/>'),ah=N(".all-reviews").append(aj);if(ap.children().first().hasClass("current")){var am=N('<button aria-controls="all-reviews_container"  aria-expanded="false" class="button reviews-toggle-all">All reviews</button>');ah.prepend(am);am.click(function(){if(am.hasClass("reviews-toggle-all--visible")){aj.hide();z();af=N(".all-reviews > .review");W();am.text("All reviews").removeClass("reviews-toggle-all--visible").attr("aria-expanded",false)}else{if(am.hasClass("reviews-toggle-all--toggled")){aj.show();z();W();am.text("Fewer reviews").addClass("reviews-toggle-all--visible").attr("aria-expanded",true)}else{var aq=1;am.text("Fewer reviews").addClass("reviews-toggle-all--toggled reviews-toggle-all--visible").attr("aria-expanded",true);for(al;al<an.text();al++){var ar="";if(Z.length){ar="?filter="+Z}N.get(ai+"/page/"+(al+1)+ar,function(au){var at=N(au).find(".review");aj.append(at);if(aq===parseInt(an.text())-1){af=N(".review");W()}aq++})}}}});M+='.reviews-toggle-all {margin-bottom: 2em;padding-right: 2em;position: relative;}.reviews-toggle-all:after {content: "+";position: absolute;right: 10px;top: 0;font-family: seriffont-size: 16px;}.reviews-toggle-all--visible:after {content: "-";}'}}function Y(){var ai=N('<input class="ed_button" type="button" value="strip links" />');function aj(){var ak=N("#ed_toolbar");ak.append(ai)}function ah(){var am=N("#post_content"),ak=am.val(),al="<em>[Link redacted]</em>",an,ao={link:/<a.*?<\/a>/gi,http:/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,www:/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi};an=ak.replace(ao.link,al).replace(ao.http,al).replace(ao.www,al);am.val(an)}aj();ai.click(function(ak){ah()})}function p(ah){var ai="border: 2px solid gold; display: inline-block; margin: 5px; padding: 5px;";ah.each(function(){var al=N(this);var ak=al.find("a").filter(function(an){var ao=N.trim(N(this).text());if(ao==""){return true}else{if(ao.length<3){return true}}return false});if(!u(ak)){return true}var aj=N('<div><span class="wpmt_screen_reader_text">Hidden links, or links with less than 3 characters found in post content</span></div>');ak.each(function(){var ao=N(this);var an=a?"font-size:1.4em;":"";ao.text(ao[0].outerHTML);var ap=N('<pre style="'+ai+an+'">'+ao.html()+"</pre>");aj.append(ap);ao.hide()});if(a){var am=N(".row-actions",al).parent();if(u(am)){am.before(aj)}else{al.append(aj)}}else{al.append(aj)}})}X()});