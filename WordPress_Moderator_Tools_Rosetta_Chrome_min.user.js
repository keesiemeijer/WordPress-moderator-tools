// ==UserScript==
// @name        WordPress Moderator Tools Rosetta
// @namespace   WordPress_moderator_tools_Rosetta
// @description Adds keyboard shortcut navigation (and more) for WordPress forum moderators. (Rosetta)
// @include     *://*.forums.wordpress.org/bb-admin/posts.php*
// @include     *://*.forums.wordpress.org/bb-admin/topics.php*
// @include     *://*.forums.wordpress.org/profile/*
// @include     *://*.forums.wordpress.org/forum/*
// @include     *://*.forums.wordpress.org/topic/*
// @include     *://*.forums.wordpress.org/edit.php?id=*
// @include     *://*.forums.wordpress.org/view/*
// @include     *://*.forums.wordpress.org/tags/modlook
// @include     *://*.forums.wordpress.org/
// @version     5.0.3
// @downloadURL https://github.com/keesiemeijer/WordPress-moderator-tools/raw/master/WordPress_Moderator_Tools_Rosetta_Chrome_min.user.js
// @updateURL https://github.com/keesiemeijer/WordPress-moderator-tools/raw/master/WordPress_Moderator_Tools_Rosetta_Chrome_min.user.js
// @grant       none
// ==/UserScript==

function moderator_tools_with_jquery(b){var a=document.createElement("script");a.type="text/javascript";a.textContent="("+b.toString()+")(jQuery)";document.body.appendChild(a)}moderator_tools_with_jquery(function(N){var ac="hide";var f="#e3cebd";var M="#moderator_tools_menu{position:fixed;top:10px;left:65px;background:white;border:3px solid #333333; color:#333333; padding: 0 3em 0 10px;}#moderator_tools_menu a{text-decoration:none;border:none;}#moderator_tools_menu a:hover{color:#d54e21;}#wordpress-org #moderator_tools_menu{font-size:13px}#wordpress-org #moderator_tools_menu .wpmt_close_menu span{display:none; }.wpmt_stats{padding-bottom:1em;}.wpmt_stats span{display:inline-block;margin:5px 0;}.wpmt_shortcuts_help{margin-left:5px;} .wpmt_shortcut{background-color:#cae8f7;padding:1px 3px;display:inline-block;margin-bottom:4px;font-weight:bold}.wpmt_shortcuts_title{display:block;font-weight:bold;margin:1em 0}#wordpress-org .wpmt_shortcuts_title{display:inline}.wpmt_shortcuts_top{margin-bottom:1em}.wpmt_close_menu{position: absolute; right: 0; top: 5px;padding:0;margin:4px 1em 0 0; }.wpmt_close_menu a{font-size:1.8em;border:0;}.wpmt_is_admin .wpmt_close_menu a{font-size:1.5em;}.wpmt_menu_state{margin-right:40px}.wpmt_profile_edit{display:block;margin-top:5px}.wpmt_modlook{background-color:#efeef5;margin-left:.5em;padding:1px 2px;}.wpmt_ip-warning{color:red;display:block;} .reviewer .wpmt_ip-warning{display:inline-block;margin-right:1em;}.wpmt_screen_reader_text{clip: rect(1px, 1px, 1px, 1px);position: absolute !important;height: 1px;width: 1px;overflow: hidden;}.wpmt_error{color:red;}",d="wpmt_current",ai="https://wordpress.org/support/bb-admin",G='<span class="wpmt_shortcuts_title">Shortcuts available for this page:</span>',b=N('<div id="moderator_tools_menu"></div>'),y=N('<span class="wpmt_close_menu"><a href="#" >&times;</a></span>'),K=N('<span class="wpmt_menu_state"></span>'),X=N('<p class="wpmt_shortcuts_top"></p>'),h={},F={},H=false,a=false,Y=false,Q=true,e,R,r,C,ah;var g={ANT:new RegExp('id="elf_not_trusted".+?checked="checked"',"gi"),EditPost:new RegExp(".+?/support/edit.php.+?","gi"),username:new RegExp('id="userlogin">(.+?)<',"gi")};var J={a:"%a% - <span class='wpmt_select'>select</span>/deselect all posts",d:"%d% - loop through Bulk Actions dropdown options",e1:"%e% - edit the user profile from the current post in a new tab.",e2:"%e% - refresh this profile page",e3:"%e% - open the edit profile page in a new tab",e4:"%e% - open the current post's user profile page in a new tab",h:"%h% - show/hide shortcuts",i:"%i% - edit all user profiles from <span class='wpmt_select'>selected posts</span> in new tabs.",shift_i:"%shift i% to edit non bozo user profiles only",m:"%m% - show/hide menu",n:"%n% - go to User Activity",r:"%r% - open the user's bb-admin posts page in a new tab",s:"%s% - <span class='wpmt_select'>select</span>/deselect current post",v:"%v% - view current post in a new tab",w:"%w% - remove website url (or add it back)",x:'%x% - select/deselect "Akismet Never Trust" checkbox',z:'%z% - select/deselect "This user is a bozo" checkbox',shift_b:"%shift b% - block the current user",z_x:"%z% - go to the next normal profile post | %x% - go to the previous normal profile post",z_x1:"%z% - go to the next user with a duplicate IP | %x% - go to the previous user with a duplicate IP",shift_z_x:"%shift z% - go to the next bozo or blocked profile post | %shift x% - go to the previous bozo or blocked profile post",t_b:"%t% - go to the top of this page  | %b% - go to the bottom of this page",n_p:"%n% - go to the next post | %p% - go to the previous post",click_author:"%mouse click% - Click in the Author column to <span class='wpmt_select'>select</span>/deselect a post (also sets the post to current)",click_post:"%mouse click% - Click anywhere in a post to set it to current, for navigation with the shortcuts %n% and %p% (see above)"};function aa(){if(u(N("#moderator_tools_menu"))||u(N("#moderator_tools_ed_uncap"))){return}var aj=true;if(u(N("#posts-list"))){a=true;Y=true;S("posts")}if(u(N("#topics-list"))){a=true;Y=true;S("topics")}if(!a){var al=N(".mod-login");if(u(al)){Y=true;N("head").append('<style type="text/css">#headline .login{text-align:right;}</style>');al.append(' | <a href="'+ai+'/posts.php?forum_id=0&post_status=2">Spam Queue</a> | <a href="https://wordpress.org/tags/modlook">Modlook</a>');if(u(N("#profile-form"))){O()}if(u(N(".edit-form"))){i();ab();aj=false}var ak=N(".forumlist");if(u(ak)){if(!ak.hasClass("reviews")){ad(".widefat")}}if(u(N(".all-reviews"))){l();aj=false}}if(u(N("#user-replies"))||u(N("#user-threads"))){o()}if(u(N("#thread"))){x();aj=false}}else{b.addClass("wpmt_is_admin")}if(aj){ag();L();t()}D();w()}function S(ak){var an=(ak==="topics")?"topic":"post";F={bulk_actions:"",topics:ak==="topics"?true:false,column:".check-column > input",author:N("td.author"),toggle:N('<a href="#">shortcuts</a>'),help:N(' <span class="wpmt_shortcuts_help">(h) </span>'),stats:N('<span class="wpmt_stats"></span>')};F.bulk_actions_checkbox=N("thead tr "+F.column+",tfoot tr "+F.column);var aj="table.widefat tr.wpmt_current td{border:solid #9f9f9f;border-width:2px 0}table.widefat tr.wpmt_current td.check-column{border-left:2px solid #9f9f9f}table#posts-list tr.wpmt_current td.date,table#topics-list tr.wpmt_current td.freshness{border-right:2px solid #9f9f9f}{border-right:2px solid #9f9f9f}.wpmt_bozo_profile{display:block;margin-top:10px;color:white;text-align:center;background:red}.wpmt_profile_type{padding:4px 6px;border:1px solid red}.wpmt_profile_type.wpmt_green{border:1px solid green}.wpmt_selected,.wpmt_select{background-color: "+f+";}.wpmt_profile_type.wpmt_selected{padding: 5px 7px;border:none;}";aj+='.mod-tools-ips-btn, .mod-tools-ips-wrapper{font-family: "Lucida Grande", Verdana, Arial, "Bitstream Vera Sans", sans-serif;} .mod-tools-ips-btn {border-radius:10px;padding:4px 9px 5px;background:url(images/white-grad.png) repeat-x #f2f2f2;border:1px solid #bbb;color:#464646;cursor:pointer;line-height:1.1em;font-size:.85em; margin: 1.2em 0 0 5em}.mod-tools-ips-wrapper{font-size: .85em; margin: 1em 0;} .mod-tools-ips-heading {font-weight: 700; margin-bottom: .8em} .mod-tools-results-list {padding-left: 5px; border-left: 2px solid gold;} .mod-tools-ips-button-pressed {border-color: gold;}';N("head").append('<style type="text/css">'+M+aj+"</style>");var am=j([J.m,J.t_b,J.n_p,J.h,J.d,J.a,J.s,J.v,J.e1,J.i]);if(!F.topics){am=am.replace(/<br\/>$/g,"");am+=" | "+j([J.shift_i,J.z_x,J.shift_z_x])}am+=j([J.click_author,J.click_post]);am=(F.topics)?am.split("post").join(an):am;F.shortcuts=N('<p style="display: none;">'+G+am+"</p>");b.append(F.stats,F.help,F.toggle,y,F.shortcuts);N("body").append(b);N("#bbUserInfo > p").prepend(K);c();r="tr."+d;C="tr:first";ah=N("#"+ak+"-list tbody tr");e=N("#bbHead");R=ah.last();af();m();var al=N(".post");p(al);if(s("post_author").length){V()}}function O(){var ak=N("input#user_url");F={website:ak,site_url:ak.val(),bozo:N("input#is_bozo"),askimet:N("input#elf_not_trusted"),trusted:N("input#elf_trusted"),location:N("input#from"),occupation:N("input#occ"),interest:N("input#interest"),user_type:N("select#admininfo_role"),};N("head").append('<style type="text/css">'+M+"</style>");var aj=J.n_p.split("post").join("section");var al=j([J.m,J.t_b,aj,J.e2,J.r,J.w,J.z,J.x,J.shift_b]);X.append(G,y);al="<p>"+al+"</p>";b.append(X,al);N("body").append(b);K.insertBefore(N("#profile-form")).wrap("<p></p>");c();r="#profile-form h3."+d;C="h3.wpmt_section:first";ah=N("#profile-form h3");ah.addClass("wpmt_section");N("h3:contains('Mailing Lists')").removeClass("wpmt_section");N("h3:contains('Administration')").addClass("wpmt_admin_section");N("label[for='user_url']").append(B(" %(w)%"));N("label[for='is_bozo']").append(B(" %(z)%"));N("label[for='elf_not_trusted']").append(B(" %(x)%"));e=N("#wporg-header");R=N("#wporg-footer");W();v()}function o(){N("head").append('<style type="text/css">'+M+"</style>");var ak=j([J.m,J.t_b,J.n]);if(Y){ak+=j([J.e3,J.r])}X.append(G,y);ak="<p>"+ak+"</p>";b.append(X,ak);N("body").append(b);var aj=N(".topicnav").first().find("p");aj.css("margin","0 0 .5em");K.insertAfter(aj).wrap("<p></p>");c();N.each(["#user-replies","#user-threads"],function(al,am){ad(am)});r="#useractivity."+d;C=0;ah=N("#useractivity");e=N("#wporg-header");R=N("#wporg-footer");if(Y){W();if(u(F.edit_href)){N.get(F.edit_href,function(am){var an=N(am).find("#admininfo_role option:selected");var al=N("dl#userinfo");if(u(an)&&u(al)){al.append(N('<dt>User Type</dt><dd><span class="wpmt">'+an.text()+"</span></dd>"))}})}}}function x(){F={tags:N("#yourtaglist"),author:".threadauthor > p > strong",post_content:N("#post_content"),};var ak=".wpmt_current .authortitle a, .reviewer-name {background-color: #efeef5;padding: 3px 6px;margin: 3px 0;display: inline-block;}.wpmt_ip-warning{color:red;}";N("head").append('<style type="text/css">'+M+ak+"</style>");var aj=j([J.m,J.t_b,J.n_p]);if(Y){aj+=j([J.z_x1])}aj+=j([J.e4,J.click_post]);var an="<p>"+aj+"</p>";X.append(G,y);b.append(X,an);N("body").append(b);var am=N(".topicnav").first().find(".bbcrumb");am.css("margin","0 0 .5em");K.insertAfter(am).wrap("<p></p>");c();r="li."+d;C="li:first";ah=N(".postitem");e=N("#wporg-header");R=ah.last();if(Y&&(u(ah)>1)){Z();T()}L();t();E();if(u(F.post_content)){N(".threadauthor > p",ah).each(function(ao){N(this).find(".authortitle").after(' - <a href="#post_content" class="wpmt_ping_link">@</a>')})}I();if(ah.length===1){ah.first().trigger("click.wpmt")}if((N("#thread").length!==0)&&u(N(".mod-login"))){var al=N(".threadpost .post");p(al)}}function l(){ah=N(".review");if(u(ah)<1){return}F={author:".reviewer-name",target:N(".review-ratings .col-1")};var aj="<p>"+j([J.m,J.t_b,J.n_p,J.z_x1])+"</p>";X.append(G,y);b.append(X,aj);N("body").append(b);N(".all-reviews").prepend(K);K.wrap("<p></p>");c();r="div."+d;e=N("#wporg-header");R=N("#wporg-footer");Z();A();T();k();L();t();M+=".wpmt_current a.reviewer-name {background-color: #efeef5;padding: 3px 6px;margin: 3px 0;display: inline-block;}";N("head").append('<style type="text/css">'+M+"</style>")}function v(){N("html").bind("keydown.wpmt",function(ao){var ak=n(ao);var an;if(H!==false){return}if(h.hasOwnProperty(66)&&(ak===2)){if(h.hasOwnProperty(16)){ao.which="";h={};ak=0;var aj=confirm("You're about to block this user!\nThis will remove user fields: Website, Location, Occupation and Interests.\n\n 'Cancel' to stop, 'OK' to block this user.");if(aj==true){F.website.val("");F.location.val("");F.occupation.val("");F.interest.val("");F.user_type.val("blocked");F.bozo.removeAttr("checked");F.trusted.removeAttr("checked");if(!F.askimet.attr("checked")){F.askimet.click()}N("#profile-form").submit()}}}if(1!==ak){return}if((87===ao.keyCode)&&(u(F.website)===1)){N(r).removeClass(d);an=ah.first();an.addClass(d);ae(an);if(F.site_url){if(""===F.website.val()){F.website.val(F.site_url)}else{F.website.val("")}clearTimeout(am);F.website.parents("tr").css("background-color","#FFFFCC");var am=setTimeout(function(){F.website.parents("tr").css("background-color","#FFFFFF")},300)}}if(ao.keyCode===90||ao.keyCode===88){var al=(ao.keyCode===90)?F.bozo:F.askimet;if(al){N(r).removeClass(d);an=N("h3.wpmt_admin_section").addClass(d);if(u(an)===1){ae(N(an));if(al.attr("checked")){al.removeAttr("checked")}else{al.click()}clearTimeout(ap);al.parents("tr").css("background-color","#FFFFCC");var ap=setTimeout(function(){al.parents("tr").css("background-color","#FFFFFF")},300)}}}})}function I(){ah.bind("click.wpmt",function(aj){if(aj.target.nodeName!=="A"){z();N(this).addClass(d)}});N(".wpmt_ping_link").bind("click.wpmt_ping",function(am){am.preventDefault();var ak=N(this).parents(".threadauthor").find("strong").first().text();if(!u(F.post_content)||!ak.length){return}var aj=F.post_content;ak="@"+ak+"\n";var al=N.trim(aj.val());ak=al.length?"\n\n"+ak:ak;aj.val(al+ak);aj[0].focus();aj.scrollTop(aj[0].scrollHeight)});N("html").bind("keydown.wpmt",function(am){if(H!==false){return}var ak=n(am);var al=N(r);if(u(al)){var aj=N(al).find(".authortitle a");if(u(aj)){if((am.keyCode===69)&&(ak=1)){P(aj.attr("href"))}}}});N('[class^="delete:yourtaglist:"]').click(function(al){if(Q){al.preventDefault();var ak=N(this).closest("li"),aj=N(this).attr("href");N.ajax({url:aj,async:true,dataType:"html",success:function(am){ak.fadeOut()}})}})}function m(){N("html").bind("keydown.wpmt",function(ar){if(H!==false){return}var aq=n(ar);var at,ak;if((ar.keyCode===83)&&(aq===1)){at=N(r);if(u(at)===1){ae(at);var al=at.find(F.column);al.attr("checked",!al.attr("checked"));af()}}if((ar.keyCode===86)&&(aq===1)){at=N(r);if(u(at)){var aw=F.topics?at.find(".row-title > a:first"):at.find(".row-actions > a:first");if(u(aw)){if(F.topics){ak=aw.attr("href")}else{ak=(aw.text()==="View")?aw.attr("href"):0}if(ak.length){P(ak)}}}}if((ar.keyCode===68)&&(aq===1)){N(".bulk-form select[name=action] > option:selected").removeAttr("selected").next("option").attr("selected","selected")}if((ar.keyCode===65)&&(aq===1)){F.bulk_actions=(F.bulk_actions_checkbox.attr("checked"))?"off":"on";q()}if((ar.keyCode===72)&&(aq===1)){F.shortcuts.toggle();at=N(r);if(u(at)){ae(at)}}if(h.hasOwnProperty(73)){var ao,av=[],au=false;if(!F.topics&&(h.hasOwnProperty(16)&&aq===2)){au=true;ao=N(".wpmt_normal_post").find(".post_selected")}else{if(aq===1){au=true;ao=N(".post_selected")}}if(au&&u(ao)){ao.each(function(){ak=N(this).children().first("a").attr("href");if(av.indexOf(ak)===-1){av.push(ak);P(ak+"/edit")}})}}if((ar.keyCode===69)&&(aq===1)){at=N(r);if(u(at)===1){ak=at.find(".wpmt_profile_edit > a").attr("href");if(ak.length){P(ak)}}}if(!F.topics&&(ah.length>=1)){if(h.hasOwnProperty(90)||h.hasOwnProperty(88)){var an=(h.hasOwnProperty(16)&&(aq===2))?"bozo":"normal";var ax=h.hasOwnProperty(90)?"z":"x",am=N(".wpmt_"+an+"_post");if(u(am)){if(!u(N(r))){if(ax==="z"||((am.length===1)&&ax==="x")){at=am.first();at.addClass(d);ae(at)}}else{if(am.length===1){var ap=am.first();z();ap.addClass(d);ae(ap)}else{var aj;at=N(r);if(ax==="z"){aj=at.nextAll(".wpmt_"+an+"_post:first")}if(ax==="x"){aj=at.prevAll(".wpmt_"+an+"_post:first")}if(u(aj)){z();aj.addClass(d);ae(aj)}}}}}}});if(Q){N(".post-delete-link, .post-spam-link").click(function(al){al.preventDefault();var ak=N(this).closest("tr"),aj=N(this).attr("href");N.ajax({url:aj,async:true,dataType:"html",success:function(am){ak.fadeOut(300,function(){N(this).remove();H=false;af()})}})})}F.bulk_actions_checkbox.bind("click.wpmt",function(){F.bulk_actions=(N(this).attr("checked"))?"on":"off";q()});ah.bind("click.wpmt",function(aj){if(aj.target.nodeName!=="A"){N("tbody tr").removeClass(d);N(this).addClass(d)}});N("tbody > tr > "+F.column).bind("click.wpmt",function(aj){af()});F.author.bind("click.wpmt",function(aj){if(aj.target.nodeName!=="A"){af(N(this).parent().attr("id"))}});F.toggle.bind("click.wpmt",function(aj){aj.preventDefault();F.shortcuts.toggle()});y.bind("click.wpmt",function(aj){aj.preventDefault();F.shortcuts.hide()})}function W(){var aj=N("#profile-menu");var ao;var an;var al;if(u(aj)){ao=aj.find("a").filter(function(aq){var ap=N(this).attr("href");if(ap.length){ap=ap.split(/[?#]/)[0],ap=ap.replace(/\/$/g,"");ap=ap.substring(ap.lastIndexOf("/")+1);if("edit"===ap.toLowerCase()){return true}}return false})}else{return}if(u(ao)){ao.text("Edit (e)");al=ao.attr("href");var ak=N("#userlogin");if(u(ak)){an=ai+"/posts.php?forum_id=0&post_author="+ak.text();var am=N('<li><a href="'+an+'">bb-admin (r)</a></li>');ao.parent().after(am)}}if(!(u(al)||u(an))){return}F.edit_href=al;N("html").bind("keydown.wpmt",function(aq){var ap=n(aq);if((H!==false)||(ap!==1)){return}if((aq.keyCode===69)&&(al.length)){if(u(N("#profile-form"))){location.reload(true)}else{P(al)}}if((aq.keyCode===82)&&(an.length)){P(an)}})}function ag(){var aj;N("html").bind("keydown.wpmt",function(am){if(H!==false||(typeof(ah)==="undefined")){return}var al=n(am);if(!(am.keyCode===78||am.keyCode===80)||(al!==1)){return}var ak=am.keyCode===78?"n":"p";if(!u(N(r))){if(ak==="n"){aj=ah.first();ae(aj);aj.addClass(d)}}else{aj=N(r);if(ak==="n"){if(u(aj.nextAll(C))){aj.removeClass(d).nextAll(C).addClass(d);ae(N(r))}else{ae(N(r))}}if(ak==="p"){if(u(aj.prevAll(C))){aj.removeClass(d).prevAll(C).addClass(d);ae(N(r))}else{aj.removeClass(d);if(u(e)&&C){ae(e)}}}}})}function T(){var aj;N("html").bind("keydown.wpmt",function(ap){if(H!==false||(typeof(ah)==="undefined")){return}var am=n(ap);var ak=0;N.each({90:"z",88:"x",78:"n",80:"p"},function(ar,at){if(ap.keyCode===parseInt(ar)){ak=at}});if(!(ak&&(am===1))){return}var aq=u(N(r));if(!aq&&((ak==="n")||(ak==="p"))){ao=ah.first();ae(ao);ao.addClass(d)}else{var ao=false,al=false,an=false;ah.each(function(ar){var au=false,at=false;if(!N(this).hasClass(d)){if(N(this).has(".wpmt_ip-warning").length){al=ar}an=ar}if(N(this).hasClass(d)){ao=ar;if(ak==="x"&&(al!==false)){au=al}if(ak==="p"&&(an!==false)){au=an}if(au!==false){ah.eq(ao).removeClass(d);ah.eq(au).addClass(d);ae(ah.eq(au));return false}}if(((ao!==false)&&(ao!==ar))||!aq){if((ak==="z")&&N(this).has(".wpmt_ip-warning").length){at=ar}if(ak==="n"){at=ar}if(at!==false){ah.eq(ao).removeClass(d);ah.eq(at).addClass(d);ae(ah.eq(at));return false}}})}})}function L(){N("html").bind("keydown.wpmt",function(ak){if(H!==false){return}var aj=n(ak);if(u(e)&&(ak.keyCode===84)&&(aj===1)){ae(e);if(typeof(ah)!=="undefined"){z()}}if(u(R)&&(ak.keyCode===66)&&(aj===1)){ae(R);if(typeof(ah)!=="undefined"){z();ah.last().addClass(d)}}})}function t(){y.bind("click.wpmt",function(ak){ak.preventDefault();b.toggle();ac=(b.is(":visible"))?"show":"hide";c();var aj=N(r);if(u(aj)){ae(aj)}});N("html").bind("keydown.wpmt",function(ak){if(H!==false){return}var aj=n(ak);if((ak.keyCode===77)&&(aj===1)){y.trigger("click.wpmt")}})}function q(){F.author.each(function(){var aj=N(this).parent().find(F.column);if(F.bulk_actions==="on"){aj.attr("checked",true)}else{aj.attr("checked",false)}});af();F.bulk_actions=false}function af(ao){F.stats.empty();var an=0;F.author.each(function(){var ax=N(this).parent().children(".check-column").css("background-color"),ar=N.trim(N(this).children().first("a").text()),au=N(this).parent().find(F.column);N(this).css("background",ax);if(!u(N(this).children(".wpmt_profile_edit"))){var aq=N("img",N(this).children().first("a")),ap='<br/><span class="wpmt_profile_edit"><a href="'+N(this).children().first("a").attr("href")+'/edit">Edit Profile</a></span>';var at=(ar.indexOf("(BOZO)")!==-1)?"BOZO":"";if(ar.indexOf("(BLOCKED)")!==-1){at+=(at.length)?" - BLOCKED":"BLOCKED"}if(at.length){ar=N.trim(ar.replace("(BOZO)",""));ar=N.trim(ar.replace("(BLOCKED)",""));N(this).children().first("a").text(" "+ar);if(aq){N(this).children().first("a").prepend(aq)}if(Q){var aw=N(this).children().first("a");N.ajax({url:aw.attr("href")+"/edit",async:true,dataType:"html",success:function(ay){if(-1!=ay.search(g.ANT)){aw.append('<span class="wpmt_bozo_profile" >'+at+" - ANT</span>");aw.parents("tr").addClass("wpmt_bozo_post")}else{aw.append('<span class="wpmt_bozo_profile" >'+at+"</span>");aw.parents("tr").addClass("wpmt_bozo_post")}},error:function(){aw.append('<span class="wpmt_bozo_profile" >'+at+"</span>");aw.parents("tr").addClass("wpmt_bozo_post")}})}else{N(this).append('<span class="wpmt_bozo_profile" >'+at+"</span>");N(this).parents("tr").addClass("wpmt_bozo_post")}if(at.indexOf("BOZO")!==-1){++an}}else{N(this).parent().addClass("wpmt_normal_post")}N(this).children().first("a").after(ap)}else{var av=N(this).find("span.wpmt_bozo_profile");if(u(av)&&(av.text().indexOf("BOZO")!==-1)){++an}}if(au.attr("checked")){N(this).attr("style","background: "+f+";");N(this).addClass("post_selected")}else{N(this).css("background",ax);N(this).removeClass("post_selected")}if((typeof(ao)!=="undefined")&&(ao===N(this).parent().attr("id"))){if(au.attr("checked")){N(this).css("background",ax);au.attr("checked",false);N(this).removeClass("post_selected")}else{N(this).attr("style","background: "+f+";");au.attr("checked",true);N(this).addClass("post_selected")}}});var ak=N("tbody > tr").length,am=N("tbody > tr > "+F.column+":checked").length;if(am<ak){N(F.bulk_actions_checkbox).attr("checked",false)}if(am===ak){N(F.bulk_actions_checkbox).attr("checked",true)}var aj="";var al=(F.topics)?"topic":"post";aj+="Current Page: "+ak+" "+al+((ak===1)?"":"s");if(!F.topics){aj+=' &#10022; <span class="wpmt_profile_type">';aj+=(an>0)?an+" bozo"+((an===1)?"":"s"):"0 bozos";aj+="</span>"}aj+=' | <span class="wpmt_profile_type wpmt_selected">';aj+=(am>0)?am+" "+al+((am===1)?"":"s")+" selected":"No "+al+"s selected";aj+="</span> | ";F.stats.append(aj)}function Z(){N(".wpmt_ip-warning").remove();var al=ah;var ak={};var am={};var aj={};al=al.filter(function(){var an=N(this).find(F.author).text();var ao=N(this).find(".post-ip-link").text();if(!(an.length&&ao.length)){return false}if(ak[an+ao]){return false}else{ak[an+ao]=true;return true}});N.each(al,function(an,ao){var ap=N(this).find(".post-ip-link").text();if(ap.length){if(am[ap]){aj[ap]=true}else{am[ap]=true}}});if(N.isEmptyObject(aj)){return}ah.each(function(){var ao=N(this).find(".post-ip-link");if(u(ao)===1){var an=ao.text();if(aj[an]){ao.before(N('<span class="wpmt_ip-warning">(DUPLICATE IP)</span>'))}}})}function E(){N("#yourtaglist").find("a").each(function(){if(N(this).text()!=="modlook"){return true}var ak=N(this).parents("li");if(!u(ak)){return true}parent_id=ak.attr("id").split("_");if(parent_id[1].length){if(Q){var aj=parent_id[1];N.ajax({url:"https://wordpress.org/support/profile/"+parent_id[1],async:true,dataType:"html",success:function(am){var al=g.username.exec(am);if(al.length>=2){aj=al[1]}ak.append(N('<a class="wpmt_modlook" href="https://wordpress.org/support/profile/'+parent_id[1]+'" title="modlook tagged by user '+parent_id[1]+'">'+aj+"</a>"))}})}else{ak.append(N('<a class="wpmt_modlook" href="https://wordpress.org/support/profile/'+parent_id[1]+'" title="modlook tagged by user '+parent_id[1]+'">'+parent_id[1]+"</a>"))}}})}function i(){var an=0,aj=0,al=0;var am=N("#ed_toolbar");if(u(am)){var ak=N('<input id="moderator_tools_ed_uncap" class="moderator_tools_ed_button" type="button" value="l-case" accesskey="d">');am.append(ak);N("#post_content").add(N("#topic")).select(function(ao){an=ao.target.selectionStart;aj=ao.target.selectionEnd;al=N(this)});ak.bind("click.wpmt",function(ar){ar.preventDefault();if(al){var aq=al.val().substring(an,aj).toLowerCase();var ao=al.val().substring(0,an)+aq+al.val().substring(aj);al.val(ao);al.focus();var ap=al.get(0);ap.selectionStart=aj;ap.selectionEnd=aj}an=aj=al=0})}}function ad(aj){var ak=N(aj).find("a");if(!u(N(ak))){return}N(ak).attr("href",function(){var am=this.search;var al=this.protocol+"//"+this.host+this.pathname;var an=false;if(am){var ao=/view=all/g;if(!ao.test(am)){an=al+am+"&view=all"}}else{an=al+"?view=all"}if(an){return an+this.hash}return this})}function D(){el=N("form");if(u(el)){el.focusin(function(){H=true}).focusout(function(){H=false})}}function w(){N(document).bind("keyup.wpmt",function(aj){if(h.hasOwnProperty(aj.which)){delete h[aj.which]}})}function n(aj){if(N(aj.which).length){h[aj.which]=true}return Object.keys(h).length}function ae(ak){var al=ak.offset().top;var aj=65;if(b.is(":visible")){aj=b.height();aj+=30}else{if((N(ak).height()+aj)>N(window).height()){aj=5}}al=al-aj;N("html, body").animate({scrollTop:al},{duration:150})}function c(){if("hide"===ac){b.hide();K.text("type m to display the menu")}else{if("show"===ac){K.text("type m to hide the menu")}else{ac="hide";b.hide();K.text("type m to display the menu")}}}function z(){if(u(ah)){ah.removeClass(d)}}function P(aj){h={};setTimeout(function(){window.open(aj,"_blank")},200)}function j(aj){if(!u(aj)){return""}var ak="";N.each(aj,function(al,am){ak+=B(am)+"<br/>"});return ak}function B(aj){return aj.replace(/\%(.*?)\%/g,'<span class="wpmt_shortcut">$1</span>')}function U(al){var aj="<em>[Link redacted]</em>",ak={link:/<a.*?<\/a>/gi,http:/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,www:/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi};return al.replace(ak.link,aj).replace(ak.http,aj).replace(ak.www,aj)}function s(aj){aj=aj.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var al=new RegExp("[\\?&]"+aj+"=([^&#]*)"),ak=al.exec(location.search);return ak===null?"":decodeURIComponent(ak[1].replace(/\+/g," "))}function u(aj){if(typeof(aj)!=="undefined"){return aj.length}return 0}function A(){var ar=N("#pages").first(),an=N(ar).find("a").not(".next"),aq=an.last(),ao=1,ak=window.location.href.split(/[?#]/)[0],am=s("filter"),al=N('<div class="all-reviews_container" id="all-reviews_container"/>'),aj=N(".all-reviews").append(al);if(ar.children().first().hasClass("current")){var ap=N('<button aria-controls="all-reviews_container"  aria-expanded="false" class="button reviews-toggle-all">All reviews</button>');aj.prepend(ap);ap.click(function(){if(ap.hasClass("reviews-toggle-all--visible")){al.hide();z();ah=N(".all-reviews > .review");Z();ap.text("All reviews").removeClass("reviews-toggle-all--visible").attr("aria-expanded",false)}else{if(ap.hasClass("reviews-toggle-all--toggled")){al.show();z();Z();ap.text("Fewer reviews").addClass("reviews-toggle-all--visible").attr("aria-expanded",true)}else{var at=1;ap.text("Fewer reviews").addClass("reviews-toggle-all--toggled reviews-toggle-all--visible").attr("aria-expanded",true);for(ao;ao<aq.text();ao++){var au="";if(am.length){au="?filter="+am}N.get(ak+"/page/"+(ao+1)+au,function(aw){var av=N(aw).find(".review");al.append(av);if(at===parseInt(aq.text())-1){ah=N(".review");Z()}at++})}}}});M+='.reviews-toggle-all {margin-bottom: 2em;padding-right: 2em;position: relative;}.reviews-toggle-all:after {content: "+";position: absolute;right: 10px;top: 0;font-family: seriffont-size: 16px;}.reviews-toggle-all--visible:after {content: "-";}'}}function ab(){var ak=N('<input class="ed_button" type="button" value="strip links" />'),al=N("#ed_toolbar"),aj=N("#post_content");if(!u(al)||!u(aj)){return}al.append(ak);ak.click(function(am){updatedContent=U(aj.val());aj.val(updatedContent)})}function p(aj){if(!u(aj)){return}var ak="border: 2px solid gold; display: inline-block; margin: 5px; padding: 5px;";aj.each(function(){var an=N(this);var am=an.find("a").filter(function(ap){var aq=N.trim(N(this).text());if(aq==""){return true}else{if(aq.length<3){return true}}return false});if(!u(am)){return true}var al=N('<div><span class="wpmt_screen_reader_text">Hidden links, or links with less than 3 characters found in post content</span></div>');am.each(function(){var aq=N(this);var ap=a?"font-size:1.4em;":"";aq.text(aq[0].outerHTML);var ar=N('<pre style="'+ak+ap+'">'+aq.html()+"</pre>");al.append(ar);aq.hide()});if(a){var ao=N(".row-actions",an).parent();if(u(ao)){ao.before(al)}else{an.append(al)}}else{an.append(al)}})}function k(){var aj=N("<ol />"),al=F.target,ak=N('<form class="mod-tools-check-ips postform" />'),am=N('<div class="mod-tools-match-summary" />');if(!u(al)){return}al.removeClass("col-1").addClass("col-3");M+=".form-row { display: block; overflow: hidden; margin-bottom: 5px;} .mod-tools-check-ips label { font-weight: 700; } .mod-tools-ip-matched { border: 2px solid gold; padding: 0 5px; } .mod-tools-ip-matched-text { background: gold; padding: 2px; }";ak.append('<div class="form-row"><label for="mod-tools-check-ips">Match IPs</label></div>');ak.append('<div class="form-row"><input id="mod-tools-check-ips" placeholder="IPs space separated" type="text" /></div>');ak.append('<div class="form-row"><button class="button">Match</button></div>');al.append(ak);am.append(ak);al.append(am);ak.submit(function(aq){aq.preventDefault();var an=N(this).find("#mod-tools-check-ips").val(),ar=an.split(" "),ap=N(".post-ip-link"),ao=true;aj.remove();aj=N("<ol />");N(".mod-tools-ip-matched").removeClass("mod-tools-ip-matched");ap.each(function(av,au){var at=N(au);if(N.inArray(at.text(),ar)!==-1){var aw="mod-tools-ip-match-"+av;aj.append('<li><a href="#'+aw+'">'+at.text()+"</a></li>");at.addClass("mod-tools-ip-matched").attr("id",aw);ao=false}});if(ao){aj.append("<li>No matches</li>")}N(this).after(aj)})}function V(){var ao=N("div.submit"),am=N(".table-form"),al=N('<button class="button mod-tools-ips-btn">Extract IPs</button>'),an=N("<div />"),ak=N('<div class="mod-tools-ips-wrapper" />'),aj=N('<ul class="mod-tools-results-list" />');al.click(function(at){at.preventDefault();var ar=N(".post-ip-link"),ap=N('<h3 class="mod-tools-ips-heading">Extracted IPs</h3>'),aq=N(this);aj.remove();aj=N('<ul class="mod-tools-results-list" />');aq.removeClass("mod-tools-ips-button-pressed");ar.each(function(av,au){var ax=N(au),aw=ax.text();if(aj.find("[data-mod-tools-ip="+aw+"]").length===0){aj.append('<li data-mod-tools-ip="'+aw+'">'+aw+"</li>")}});if(ak.find(".mod-tools-ips-heading").length===0){ak.append(ap)}ak.append(aj);aq.addClass("mod-tools-ips-button-pressed")});am.before(ak);an.append(al);ao.after(an)}aa()});