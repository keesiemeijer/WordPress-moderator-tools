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

function moderator_tools_with_jquery( f ) {
	var script = document.createElement( "script" );
	script.type = "text/javascript";
	script.textContent = "(" + f.toString() + ")(jQuery)";
	document.body.appendChild( script );
}

moderator_tools_with_jquery( function( $ ) {

	var menu = 'hide';
	var select_color = '#e3cebd';

	// Next up variables separated by comma's
	var styles = '#moderator_tools_menu{position:fixed;top:10px;left:65px;background:white;border:3px solid #333333; color:#333333; padding: 0 3em 0 10px;}#moderator_tools_menu a{text-decoration:none;border:none;}#moderator_tools_menu a:hover{color:#d54e21;}#wordpress-org #moderator_tools_menu{font-size:13px}#wordpress-org #moderator_tools_menu .wpmt_close_menu span{display:none; }.wpmt_stats{padding-bottom:1em;}.wpmt_stats span{display:inline-block;margin:5px 0;}.wpmt_shortcuts_help{margin-left:5px;} .wpmt_shortcut{background-color:#cae8f7;padding:1px 3px;display:inline-block;margin-bottom:4px;font-weight:bold}.wpmt_shortcuts_title{display:block;font-weight:bold;margin:1em 0}#wordpress-org .wpmt_shortcuts_title{display:inline}.wpmt_shortcuts_top{margin-bottom:1em}.wpmt_close_menu{position: absolute; right: 0; top: 5px;padding:0;margin:4px 1em 0 0; }.wpmt_close_menu a{font-size:1.8em;border:0;}.wpmt_is_admin .wpmt_close_menu a{font-size:1.5em;}.wpmt_menu_state{margin-right:40px}.wpmt_profile_edit{display:block;margin-top:5px}.wpmt_modlook{background-color:#efeef5;margin-left:.5em;padding:1px 2px;}.wpmt_ip-warning{color:red;display:block;} .reviewer .wpmt_ip-warning{display:inline-block;margin-right:1em;}.wpmt_screen_reader_text{clip: rect(1px, 1px, 1px, 1px);position: absolute !important;height: 1px;width: 1px;overflow: hidden;}',
		current_class = 'wpmt_current',
		bb_admin_url = 'https://wordpress.org/support/bb-admin',
		shortcuts_title = '<span class="wpmt_shortcuts_title">Shortcuts available for this page:</span>',

		// re-usable elements
		menu_container = $( '<div id="moderator_tools_menu"></div>' ),
		menu_close = $( '<span class="wpmt_close_menu"><a href="#" >&times;</a></span>' ),
		menu_state = $( '<span class="wpmt_menu_state"></span>' ),
		shortcuts_top = $( '<p class="wpmt_shortcuts_top"></p>' ),

		heldKeys = {},
		options = {},
		form_focus = false,
		is_admin = false,
		logged_in = false,
		ajax = true,
		review_filter = '',
		top_element, bottom_element, current_element, next_element, next_prev_objects;

	var pattern = {
		ANT: new RegExp( "id=\"elf_not_trusted\".+?checked=\"checked\"", "gi" ),
		EditPost: new RegExp( ".+?\/support\/edit\.php.+?", "gi" ),
		username: new RegExp( "id=\"userlogin\">(.+?)<", "gi" )
	};

	var shortcuts = {
		a: "%a% - <span class='wpmt_select'>select</span>/deselect all posts",
		d: "%d% - loop through Bulk Actions dropdown options",
		e1: "%e% - edit the user profile from the current post in a new tab.",
		e2: "%e% - refresh this profile page",
		e3: "%e% - open the edit profile page in a new tab",
		e4: '%e% - open the current post\'s user profile page in a new tab',
		h: "%h% - show/hide shortcuts",
		i: "%i% - edit all user profiles from <span class='wpmt_select'>selected posts</span> in new tabs.",
		shift_i: "%shift i% to edit non bozo user profiles only",
		m: "%m% - show/hide menu",
		n: "%n% - go to User Activity",
		r: "%r% - open the user\'s bb-admin posts page in a new tab",
		s: "%s% - <span class='wpmt_select'>select</span>/deselect current post",
		v: "%v% - view current post in a new tab",
		w: "%w% - remove website url (or add it back)",
		x: '%x% - select/deselect "Akismet Never Trust" checkbox',
		z: '%z% - select/deselect "This user is a bozo" checkbox',
		z_x: "%z% - go to the next normal profile post | %x% - go to the previous normal profile post",
		z_x1: "%z% - go to the next user with a duplicate IP | %x% - go to the previous user with a duplicate IP",
		shift_z_x: "%shift z% - go to the next bozo profile post | %shift x% - go to the previous bozo profile post",
		t_b: "%t% - go to the top of this page  | %b% - go to the bottom of this page",
		n_p: "%n% - go to the next post | %p% - go to the previous post",
		click_author: "%mouse click% - Click in the Author column to <span class='wpmt_select'>select</span>/deselect a post (also sets the post to current)",
		click_post: "%mouse click% - Click anywhere in a post to set it to current, for navigation with the shortcuts %n% and %p% (see above)"
	};


	/**
	 * Initialize moderator tools
	 */
	function init() {

		// check if script is allready running (greasemonkey, bookmarklet or FF addon?)
		if ( obj_exists( $( '#moderator_tools_menu' ) ) || obj_exists( $( '#moderator_tools_ed_uncap' ) ) ) {
			return;
		}

		var navigation = true;

		if ( obj_exists( $( '#posts-list' ) ) ) {
			// wordpress.org/support/bb-admin/posts.php
			is_admin = true;
			logged_in = true;
			bb_admin_posts_init( 'posts' );
		}

		if ( obj_exists( $( '#topics-list' ) ) ) {
			// wordpress.org/support/bb-admin/topics.php
			is_admin = true;
			logged_in = true;
			bb_admin_posts_init( 'topics' );
		}

		if ( !is_admin ) {

			var mod_login = $( '.mod-login' );

			if ( obj_exists( mod_login ) ) {

				logged_in = true;

				$( "head" ).append( '<style type=\"text/css\">#headline .login{text-align:right;}</style>' );
				mod_login.append( ' | <a href="' + bb_admin_url + '/posts.php?forum_id=0&post_status=2">Spam Queue</a> | <a href="https://wordpress.org/tags/modlook">Modlook</a>' );

				if ( obj_exists( $( '#profile-form' ) ) ) {
					// wordpress.org/support/profile/
					profile_edit_init();
				}

				if ( obj_exists( $( '.edit-form' ) ) ) {
					// wordpress.org/support/edit.php
					add_lower_case_button_to_editor();
					add_strip_links_button_to_editor();
					navigation = false;
				}

				if ( obj_exists( $( '.forumlist' ) ) ) {
					// wordpress.org/support/forum/
					add_view_is_all_parameter( '.widefat' );
				}

				if ( obj_exists( $( '.all-reviews' ) ) ) {
					// wordpress.org/support/view/plugin-reviews/
					// wordpress.org/support/view/theme-reviews/
					review_filter = getParameterByName( 'filter' );
					reviews_init();
					navigation = false;
				}
			}

			if ( obj_exists( $( '#user-replies' ) ) || obj_exists( $( '#user-threads' ) ) ) {
				// wordpress.org/support/profile
				profile_posts_init();
			}

			if ( obj_exists( $( '#thread' ) ) ) {
				// wordpress.org/support/topic
				topic_init();
				navigation = false;
			}

		} else {
			menu_container.addClass( 'wpmt_is_admin' );
		}


		// add navigition to pages that need it.
		if ( navigation ) {
			next_previous_navigation();
			top_bottom_navigation();
			menu_navigation();
		}


		// Adds a focusin event to all forms on the page.
		// Disables shortcuts if form fields have focus.
		check_form_focus();

		// empties the heldKeys object on keyup event
		reset_keys();
	}


	/**
	 * wordpress.org/support/bb-admin/topics.php
	 * wordpress.org/support/bb-admin/posts.php
	 */
	function bb_admin_posts_init( type ) {

		var single = ( type === 'topics' ) ? 'topic' : 'post';

		options = {
			bulk_actions: '',
			topics: type === 'topics' ? true : false,
			column: '.check-column > input',
			author: $( "td.author" ),
			toggle: $( '<a href="#">shortcuts</a>' ),
			help: $( ' <span class="wpmt_shortcuts_help">(h) </span>' ),
			stats: $( '<span class="wpmt_stats"></span>' )
		};

		options.bulk_actions_checkbox = $( 'thead tr ' + options.column + ',tfoot tr ' + options.column );

		// menu style
		var style = 'table.widefat tr.wpmt_current td{border:solid #9f9f9f;border-width:2px 0}table.widefat tr.wpmt_current td.check-column{border-left:2px solid #9f9f9f}table#posts-list tr.wpmt_current td.date,table#topics-list tr.wpmt_current td.freshness{border-right:2px solid #9f9f9f}{border-right:2px solid #9f9f9f}.wpmt_bozo_profile{display:block;margin-top:10px;color:white;text-align:center;background:red}.wpmt_profile_type{padding:4px 6px;border:1px solid red}.wpmt_profile_type.wpmt_green{border:1px solid green}.wpmt_selected,.wpmt_select{background-color: ' + select_color + ';}.wpmt_profile_type.wpmt_selected{padding: 5px 7px;border:none;}';
		$( "head" ).append( '<style type=\"text/css\">' + styles + style + '</style>' );

		// menu shortcuts
		var shortcut_str = process_shortcuts( [ shortcuts.m, shortcuts.t_b, shortcuts.n_p, shortcuts.h, shortcuts.d, shortcuts.a, shortcuts.s, shortcuts.v, shortcuts.e1, shortcuts.i ] );

		if ( !options.topics ) {
			// remove last <br/>
			shortcut_str = shortcut_str.replace( /<br\/>$/g, '' );
			shortcut_str += ' | ' + process_shortcuts( [ shortcuts.shift_i, shortcuts.z_x, shortcuts.shift_z_x ] );
		}

		shortcut_str += process_shortcuts( [ shortcuts.click_author, shortcuts.click_post ] );
		shortcut_str = ( options.topics ) ? shortcut_str.split( 'post' ).join( single ) : shortcut_str;

		options.shortcuts = $( '<p style="display: none;">' + shortcuts_title + shortcut_str + '</p>' );

		// append menu elements to container
		menu_container.append( options.stats, options.help, options.toggle, menu_close, options.shortcuts );

		// append container to body
		$( "body" ).append( menu_container );

		// show/hide menu
		$( '#bbUserInfo > p' ).prepend( menu_state );
		show_hide_menu();

		// next previous stuff
		current_element = 'tr.' + current_class;
		next_element = 'tr:first';
		next_prev_objects = $( '#' + type + "-list tbody tr" );

		// top bottom stuff
		top_element = $( '#bbHead' );
		bottom_element = next_prev_objects.last();

		reset_author();

		// event listeners for this page
		bb_admin_posts_event_listeners();

		// Show hidden links
		var posts = $( '.post' );
		showHiddenLinks( posts );
	}


	/**
	 * wordpress.org/support/profile/profile-name/edit
	 */
	function profile_edit_init() {

		var website = $( '#user_url' );

		options = {
			website: website,
			site_url: website.val(),
			bozo: $( 'input#is_bozo' ),
			askimet: $( '#elf_not_trusted' )
		};

		// menu style
		$( "head" ).append( '<style type=\"text/css\">' + styles + '</style>' );

		// menu shortcuts
		var shortcut_n_p = shortcuts.n_p.split( 'post' ).join( 'section' );
		var shortcut_str = process_shortcuts( [ shortcuts.m, shortcuts.t_b, shortcut_n_p, shortcuts.e2, shortcuts.r, shortcuts.w, shortcuts.z, shortcuts.x ] );

		shortcuts_top.append( shortcuts_title, menu_close );
		shortcut_str = '<p>' + shortcut_str + '</p>';

		// append menu elements to container
		menu_container.append( shortcuts_top, shortcut_str );

		// append container to body
		$( "body" ).append( menu_container );

		// show/hide menu
		menu_state.insertBefore( $( '#profile-form' ) ).wrap( '<p></p>' );
		show_hide_menu();

		// next previous stuff
		current_element = '#profile-form h3.' + current_class;
		next_element = 'h3.wpmt_section:first';
		next_prev_objects = $( '#profile-form h3' );

		next_prev_objects.addClass( 'wpmt_section' );
		$( "h3:contains('Mailing Lists')" ).removeClass( 'wpmt_section' );
		$( "h3:contains('Administration')" ).addClass( 'wpmt_admin_section' );

		// add shortcuts to label
		$( "label[for='user_url']" ).append( replace_markers( ' %(w)%' ) );
		$( "label[for='is_bozo']" ).append( replace_markers( ' %(z)%' ) );
		$( "label[for='elf_not_trusted']" ).append( replace_markers( ' %(x)%' ) );

		// top bottom stuff
		top_element = $( '#wporg-header' );
		bottom_element = $( '#wporg-footer' );

		// navigation
		profile_menu_navigagion();

		// functions and event listners for this page
		profile_edit_event_listeners();
	}


	/**
	 * wordpress.org/support/profile/profile-name
	 */
	function profile_posts_init() {

		// menu style
		$( "head" ).append( '<style type=\"text/css\">' + styles + '</style>' );

		// menu shortcuts
		var shortcut_str = process_shortcuts( [ shortcuts.m, shortcuts.t_b, shortcuts.n ] );

		if ( logged_in ) {
			shortcut_str += process_shortcuts( [ shortcuts.e3, shortcuts.r ] );
		}
		shortcuts_top.append( shortcuts_title, menu_close );
		shortcut_str = '<p>' + shortcut_str + '</p>';

		// append menu elements to container
		menu_container.append( shortcuts_top, shortcut_str );

		// append container to body
		$( "body" ).append( menu_container );

		// show/hide menu
		var nav = $( ".topicnav" ).first().find( 'p' );
		nav.css( 'margin', '0 0 .5em' );
		menu_state.insertAfter( nav ).wrap( '<p></p>' );
		show_hide_menu();

		$.each( [ '#user-replies', '#user-threads' ], function( index, value ) {
			add_view_is_all_parameter( value );
		} );

		// next previous stuff
		current_element = '#useractivity.' + current_class;
		next_element = 0;
		next_prev_objects = $( "#useractivity" );

		// top bottom stuff
		top_element = $( '#wporg-header' );
		bottom_element = $( '#wporg-footer' );

		// navigation
		if ( logged_in ) {
			profile_menu_navigagion();
		}
	}

	/**
	 * wordpress.org/support/topic/topic-title
	 */
	function topic_init() {

		options = {
			tags: $( '#yourtaglist' ),
			author: '.threadauthor > p > strong'
		};

		// menu style
		var style = ".wpmt_current .authortitle a, .reviewer-name {background-color: #efeef5;padding: 3px 6px;margin: 3px 0;display: inline-block;}.wpmt_ip-warning{color:red;}";
		$( "head" ).append( '<style type=\"text/css\">' + styles + style + '</style>' );

		// menu shortcuts
		var shortcut_str = '<p>' + process_shortcuts( [ shortcuts.m, shortcuts.t_b, shortcuts.n_p, shortcuts.z_x1, shortcuts.e4, shortcuts.click_post ] ) + '</p>';
		shortcuts_top.append( shortcuts_title, menu_close );

		// append menu elements to container
		menu_container.append( shortcuts_top, shortcut_str );

		// append container to body
		$( "body" ).append( menu_container );

		// show/hide menu
		var nav = $( ".topicnav" ).first().find( '.bbcrumb' );
		nav.css( 'margin', '0 0 .5em' );
		menu_state.insertAfter( nav ).wrap( '<p></p>' );
		show_hide_menu();

		// next previous stuff
		current_element = 'li.' + current_class;
		next_element = 'li:first';
		next_prev_objects = $( ".postitem" );

		// top bottom stuff
		top_element = $( '#wporg-header' );
		bottom_element = next_prev_objects.last();

		if ( obj_exists( next_prev_objects ) > 1 ) {
			// checks for duplicate IPs
			check_duplicate_IPs();
		}

		duplicate_ip_navigation(); //zx np
		top_bottom_navigation();
		menu_navigation();

		add_modlook_profile();

		// functions and event listners for this page	
		topic_event_listeners();

		// set first post as current if only one post
		if ( next_prev_objects.length === 1 ) {
			next_prev_objects.first().trigger( 'click.wpmt' );
		}

		// Show hidden links to moderators
		if ( ( $( '#thread' ).length !== 0 ) && obj_exists( $( '.mod-login' ) ) ) {
			var posts = $( '.threadpost .post' );
			showHiddenLinks( posts );
		}

	}


	function reviews_init() {

		next_prev_objects = $( ".review" );
		if ( obj_exists( next_prev_objects ) < 1 ) {
			return;
		}

		options = {
			author: '.reviewer-name'
		};

		// menu shortcuts
		var shortcut_str = '<p>' + process_shortcuts( [ shortcuts.m, shortcuts.t_b, shortcuts.n_p, shortcuts.z_x1 ] ) + '</p>';
		shortcuts_top.append( shortcuts_title, menu_close );

		// append menu elements to container
		menu_container.append( shortcuts_top, shortcut_str );

		// append container to body
		$( "body" ).append( menu_container );
		$( '.all-reviews' ).prepend( menu_state );
		menu_state.wrap( '<p></p>' );
		show_hide_menu();

		// next previous stuff
		current_element = 'div.' + current_class;

		// top bottom stuff
		top_element = $( '#wporg-header' );
		bottom_element = $( '#wporg-footer' );

		// test if duplicate IPs are found

		// var ip1 = next_prev_objects.eq( 0 ).find( '.post-ip-link' ).text();
		// if ( obj_exists( next_prev_objects.eq( 1 ) ) ) {
		// 	next_prev_objects.eq( 1 ).find( '.post-ip-link' ).text( ip1 );
		// }

		check_duplicate_IPs();
		viewAllReviews();
		duplicate_ip_navigation();
		match_IPs();

		top_bottom_navigation();
		menu_navigation();

		styles += ".wpmt_current a.reviewer-name {background-color: #efeef5;padding: 3px 6px;margin: 3px 0;display: inline-block;}";

		$( "head" ).append( '<style type=\"text/css\">' + styles + '</style>' );
	}


	function profile_edit_event_listeners() {

		$( 'html' ).bind( 'keydown.wpmt', function( e ) {
			var count = get_keydown_count( e );
			var current;

			if ( ( form_focus !== false ) || ( 1 !== count ) ) {
				return;
			}

			// w - toggle website url input field
			if ( ( 87 === e.keyCode ) && ( obj_exists( options.website ) === 1 ) ) {

				$( current_element ).removeClass( current_class );
				current = next_prev_objects.first();
				current.addClass( current_class );
				scrollTo( current );

				if ( options.site_url ) {

					if ( '' === options.website.val() ) {
						options.website.val( options.site_url );
					} else {
						options.website.val( '' );
					}

					clearTimeout( timer_website );
					options.website.parents( 'tr' ).css( 'background-color', '#FFFFCC' );

					var timer_website = setTimeout( function() {
						options.website.parents( 'tr' ).css( 'background-color', '#FFFFFF' );
					}, 300 );
				}

			}

			// z x - set bozo and askitmet 
			if ( e.keyCode === 90 || e.keyCode === 88 ) {
				// admin_section
				var checkbox = ( e.keyCode === 90 ) ? options.bozo : options.askimet;
				if ( checkbox ) {

					$( current_element ).removeClass( current_class );
					current = $( 'h3.wpmt_admin_section' ).addClass( current_class );

					if ( obj_exists( current ) === 1 ) {
						scrollTo( $( current ) );

						if ( checkbox.attr( "checked" ) ) {
							checkbox.removeAttr( "checked" );
						} else {
							checkbox.click();
						}
						clearTimeout( timer_checkbox );
						checkbox.parents( 'tr' ).css( 'background-color', '#FFFFCC' );

						var timer_checkbox = setTimeout( function() {
							checkbox.parents( 'tr' ).css( 'background-color', '#FFFFFF' );
						}, 300 );
					}
				}
			}

		} );

	}


	function topic_event_listeners() {

		// click in post to set it to current
		next_prev_objects.bind( 'click.wpmt', function( e ) {
			if ( e.target.nodeName !== 'A' ) {
				remove_current_class();
				$( this ).addClass( current_class );
			}
		} );


		$( 'html' ).bind( 'keydown.wpmt', function( e ) {

			if ( form_focus !== false ) {
				return;
			}

			var count = get_keydown_count( e );

			var current = $( current_element );

			if ( obj_exists( current ) ) {

				var authortitle = $( current ).find( '.authortitle a' );
				if ( obj_exists( authortitle ) ) {
					// e - go to profile page
					if ( ( e.keyCode === 69 ) && ( count = 1 ) ) {
						window_open( authortitle.attr( 'href' ) );
					}
				}

			}
		} );

		// If ajax mode is enabled, remove tags via ajax instead of reloading the page repeatedly
		$( '[class^="delete:yourtaglist:"]' ).click( function( e ) {
			if ( ajax ) {
				e.preventDefault();

				var $parent = $( this ).closest( 'li' ),
					link = $( this ).attr( 'href' );

				$.ajax( {
					url: link,
					async: true,
					dataType: 'html',
					success: function( html ) {
						$parent.fadeOut();
					}
				} );
			}
		} );
	}


	function bb_admin_posts_event_listeners() {

		$( 'html' ).bind( 'keydown.wpmt', function( e ) {

			if ( form_focus !== false ) {
				return;
			}

			var count = get_keydown_count( e );
			var current, url;

			// s - select/deselect post
			if ( ( e.keyCode === 83 ) && ( count === 1 ) ) {
				current = $( current_element );
				if ( obj_exists( current ) === 1 ) {
					scrollTo( current );
					var current_checkbox = current.find( options.column );
					current_checkbox.attr( "checked", !current_checkbox.attr( "checked" ) );
					reset_author();
				}
			}

			// v = view topic
			if ( ( e.keyCode === 86 ) && ( count === 1 ) ) {
				current = $( current_element );
				if ( obj_exists( current ) ) {
					var link = options.topics ? current.find( '.row-title > a:first' ) : current.find( '.row-actions > a:first' );
					if ( obj_exists( link ) ) {
						if ( options.topics ) {
							url = link.attr( 'href' );
						} else {
							// make sure we have the view url (could be 'Delete')
							url = ( link.text() === 'View' ) ? link.attr( 'href' ) : 0;
						}
						if ( url.length ) {
							window_open( url );
						}
					}
				}
			}

			// d - cycle through bulk dropdown
			if ( ( e.keyCode === 68 ) && ( count === 1 ) ) {
				$( '.bulk-form select[name=action] > option:selected' ).removeAttr( 'selected' ).next( 'option' ).attr( 'selected', 'selected' );
			}

			// a - set bulk actions checkbox
			if ( ( e.keyCode === 65 ) && ( count === 1 ) ) {
				options.bulk_actions = ( options.bulk_actions_checkbox.attr( "checked" ) ) ? 'off' : 'on';
				set_bulk_actions_checkbox();
			}

			// h - toggle shortcuts
			if ( ( e.keyCode === 72 ) && ( count === 1 ) ) {
				options.shortcuts.toggle();
				current = $( current_element );
				if ( obj_exists( current ) ) {
					scrollTo( current );
				}
			}

			// i - open selected profile EDIT pages
			if ( heldKeys.hasOwnProperty( 73 ) ) {

				var selected, urls = [],
					proceed = false;

				// i + shift
				if ( !options.topics && ( heldKeys.hasOwnProperty( 16 ) && count === 2 ) ) {
					proceed = true;
					selected = $( '.wpmt_normal_post' ).find( '.post_selected' );
				} else if ( count === 1 ) {
					proceed = true;
					selected = $( ".post_selected" );
				}
				if ( proceed && obj_exists( selected ) ) {
					selected.each( function() {
						url = $( this ).children().first( 'a' ).attr( "href" );
						if ( urls.indexOf( url ) === -1 ) {
							urls.push( url );
							window_open( url + '/edit' );
						}
					} );
				}
			}

			// e - edit profile
			if ( ( e.keyCode === 69 ) && ( count === 1 ) ) {
				current = $( current_element );
				if ( obj_exists( current ) === 1 ) {
					url = current.find( '.wpmt_profile_edit > a' ).attr( 'href' );
					if ( url.length ) {
						window_open( url );
					}
				}
			}

			if ( !options.topics && ( next_prev_objects.length >= 1 ) ) {
				// z - go to the next normal profile post | x - go to the previous normal profile post
				// shift z - go to the next bozo profile post | shift x - go to the previous bozo profile post		
				if ( heldKeys.hasOwnProperty( 90 ) || heldKeys.hasOwnProperty( 88 ) ) {
					// shift
					var kind = ( heldKeys.hasOwnProperty( 16 ) && ( count === 2 ) ) ? 'bozo' : 'normal';
					var key = heldKeys.hasOwnProperty( 90 ) ? 'z' : 'x',
						kind_post = $( ".wpmt_" + kind + "_post" );
					// there are normal or bozo posts
					if ( obj_exists( kind_post ) ) {
						if ( !obj_exists( $( current_element ) ) ) {
							// there is no current element
							if ( key === 'z' || ( ( kind_post.length === 1 ) && key === 'x' ) ) {
								// go to first post of kind
								current = kind_post.first();
								current.addClass( current_class );
								scrollTo( current );
							}
						} else {
							// there is a current element
							if ( kind_post.length === 1 ) {
								// there is only one post of kind 'bozo' or 'normal'
								var first = kind_post.first();
								remove_current_class();
								first.addClass( current_class );
								scrollTo( first );
							} else {
								// multiple posts of kind 'bozo_post' or 'normal_post'
								var nextprev;
								current = $( current_element );
								if ( key === 'z' ) {
									nextprev = current.nextAll( '.wpmt_' + kind + '_post:first' );
								}
								if ( key === 'x' ) {
									nextprev = current.prevAll( '.wpmt_' + kind + '_post:first' );
								}
								if ( obj_exists( nextprev ) ) {
									remove_current_class();
									nextprev.addClass( current_class );
									scrollTo( nextprev );
								}
							}
						}
					} // bozo_post or normal_post > 0
				} // if( key 90 || 88 ) z x
			} // if(posts_list.length)
		} ); // keydown.event

		// Ajax behavior when deleting or not-spam marking threads
		if ( ajax ) {
			$( ".post-delete-link, .post-spam-link" ).click( function( e ) {
				e.preventDefault();

				var $parent = $( this ).closest( 'tr' ),
					link = $( this ).attr( 'href' );

				$.ajax( {
					url: link,
					async: true,
					dataType: 'html',
					success: function( html ) {
						$parent.fadeOut( 300, function() {
							$( this ).remove();
						} );
					}
				} );
			} );
		}

		options.bulk_actions_checkbox.bind( 'click.wpmt', function() {
			options.bulk_actions = ( $( this ).attr( "checked" ) ) ? 'on' : 'off';
			set_bulk_actions_checkbox();
		} );

		// click in post to set it to current
		next_prev_objects.bind( 'click.wpmt', function( e ) {
			if ( e.target.nodeName !== 'A' ) {
				$( "tbody tr" ).removeClass( current_class );
				$( this ).addClass( current_class );
			}
		} );

		// post checkbox click event
		$( 'tbody > tr > ' + options.column ).bind( 'click.wpmt', function( e ) {
			reset_author();
		} );

		// author colomn click event
		options.author.bind( 'click.wpmt', function( e ) {
			if ( e.target.nodeName !== 'A' ) {
				reset_author( $( this ).parent().attr( 'id' ) );
			}
		} );

		options.toggle.bind( 'click.wpmt', function( e ) {
			e.preventDefault();
			options.shortcuts.toggle();
		} );

		menu_close.bind( 'click.wpmt', function( e ) {
			e.preventDefault();
			options.shortcuts.hide();
		} );
	}


	/**
	 * Adds shortcuts to the #profile-menu. Opens pages on keydown e and r
	 */
	function profile_menu_navigagion() {

		var profile_menu = $( '#profile-menu' );
		var profile_edit;
		var profile_edit_href;
		var bb_link_href;

		// get edit link
		if ( obj_exists( profile_menu ) ) {
			profile_edit = profile_menu.find( 'a' ).filter( function( index ) {
				return $( this ).text() === "Edit";
			} );
		} else {
			return;
		}

		if ( obj_exists( profile_edit ) ) {
			profile_edit.text( 'Edit (e)' );
			profile_edit_href = profile_edit.attr( 'href' );

			var author = $( '#userlogin' );
			if ( obj_exists( author ) ) {

				bb_link_href = bb_admin_url + '/posts.php?forum_id=0&post_author=' + author.text();
				var bb_link = $( '<li><a href="' + bb_link_href + '">bb-admin (r)</a></li>' );
				profile_edit.parent().after( bb_link );

			}
		}

		if ( !( profile_edit_href.length || bb_link_href.length ) ) {
			return;
		}

		// e and r keydown event
		$( 'html' ).bind( 'keydown.wpmt', function( e ) {

			var count = get_keydown_count( e );

			if ( ( form_focus !== false ) || ( count !== 1 ) ) {
				return;
			}

			// e - edit profile
			if ( ( e.keyCode === 69 ) && ( profile_edit_href.length ) ) {

				if ( obj_exists( $( '#profile-form' ) ) ) {
					location.reload( true );
				} else {
					window_open( profile_edit_href );
				}
			}

			// r - open bb-admin posts
			if ( ( e.keyCode === 82 ) && ( bb_link_href.length ) ) {
				window_open( bb_link_href );
			}
		} );
	}



	/**
	 * Scroll navigation to next and previous element
	 */
	function next_previous_navigation() {

		var current;

		$( 'html' ).bind( 'keydown.wpmt', function( e ) {

			if ( form_focus !== false || ( typeof( next_prev_objects ) === 'undefined' ) ) {
				return;
			}

			var count = get_keydown_count( e );

			// not n or p key or more than one key is held
			if ( !( e.keyCode === 78 || e.keyCode === 80 ) || ( count !== 1 ) ) {
				return;
			}

			var key = e.keyCode === 78 ? 'n' : 'p';

			if ( !obj_exists( $( current_element ) ) ) {

				if ( key === 'n' ) {
					current = next_prev_objects.first();
					scrollTo( current );
					current.addClass( current_class );
				}

			} else {

				current = $( current_element );

				if ( key === 'n' ) {
					if ( obj_exists( current.nextAll( next_element ) ) ) {

						current.removeClass( current_class ).nextAll( next_element ).addClass( current_class );
						scrollTo( $( current_element ) );
					} else {
						scrollTo( $( current_element ) );
					}
				}

				if ( key === 'p' ) {
					if ( obj_exists( current.prevAll( next_element ) ) ) {
						current.removeClass( current_class ).prevAll( next_element ).addClass( current_class );
						scrollTo( $( current_element ) );
					} else {
						current.removeClass( current_class );
						if ( obj_exists( top_element ) && next_element ) {
							scrollTo( top_element );
						}
					}

				}
			}

		} );
	}

	/**
	 * Scroll navigation to next and previous element
	 */
	function duplicate_ip_navigation() {

		var current;

		$( 'html' ).bind( 'keydown.wpmt', function( e ) {

			if ( form_focus !== false || ( typeof( next_prev_objects ) === 'undefined' ) ) {
				return;
			}

			var count = get_keydown_count( e );

			var key = 0;
			$.each( {
				90: 'z',
				88: 'x',
				78: 'n',
				80: 'p'
			}, function( index, value ) {
				if ( e.keyCode === parseInt( index ) ) {
					key = value;
				}

			} );

			if ( !( key && ( count === 1 ) ) ) {
				return;
			}

			var current_obj = obj_exists( $( current_element ) );

			if ( !current_obj && ( ( key === 'n' ) || ( key === 'p' ) ) ) {
				current = next_prev_objects.first();
				scrollTo( current );
				current.addClass( current_class );
			} else {

				var current = false,
					warning_pre = false,
					pre = false;

				next_prev_objects.each( function( index ) {
					var previous = false,
						next = false;

					if ( !$( this ).hasClass( current_class ) ) {
						if ( $( this ).has( ".wpmt_ip-warning" ).length ) {
							warning_pre = index;
						}
						pre = index;
					}

					if ( $( this ).hasClass( current_class ) ) {
						current = index;

						if ( key === 'x' && ( warning_pre !== false ) ) {
							previous = warning_pre;
						}
						if ( key === 'p' && ( pre !== false ) ) {
							previous = pre;
						}

						if ( previous !== false ) {
							next_prev_objects.eq( current ).removeClass( current_class );
							next_prev_objects.eq( previous ).addClass( current_class );
							scrollTo( next_prev_objects.eq( previous ) );
							return false;
						}
					}

					if ( ( ( current !== false ) && ( current !== index ) ) || !current_obj ) {
						if ( ( key === 'z' ) && $( this ).has( ".wpmt_ip-warning" ).length ) {
							next = index;
						}

						if ( key === 'n' ) {
							next = index;
						}

						if ( next !== false ) {
							next_prev_objects.eq( current ).removeClass( current_class );
							next_prev_objects.eq( next ).addClass( current_class );
							scrollTo( next_prev_objects.eq( next ) );
							return false;
						}
					}

				} );
			}

		} );
	}


	/**
	 * Scroll navigation to top and bottom elements
	 */
	function top_bottom_navigation() {

		$( 'html' ).bind( 'keydown.wpmt', function( e ) {

			if ( form_focus !== false ) {
				return;
			}

			var count = get_keydown_count( e );

			// t - top
			if ( obj_exists( top_element ) && ( e.keyCode === 84 ) && ( count === 1 ) ) {
				scrollTo( top_element );
				if ( typeof( next_prev_objects ) !== 'undefined' ) {
					remove_current_class();
				}
			}

			// b - bottom
			if ( obj_exists( bottom_element ) && ( e.keyCode === 66 ) && ( count === 1 ) ) {
				scrollTo( bottom_element );
				if ( typeof( next_prev_objects ) !== 'undefined' ) {
					remove_current_class();
					next_prev_objects.last().addClass( current_class );
				}
			}
		} );

	}


	/**
	 * Displays or hides the menu
	 */
	function menu_navigation() {

		menu_close.bind( 'click.wpmt', function( e ) {
			e.preventDefault();
			menu_container.toggle();
			menu = ( menu_container.is( ':visible' ) ) ? 'show' : 'hide';
			show_hide_menu();
			var current = $( current_element );
			if ( obj_exists( current ) ) {
				scrollTo( current );
			}
		} );

		$( 'html' ).bind( 'keydown.wpmt', function( e ) {
			if ( form_focus !== false ) {
				return;
			}
			var count = get_keydown_count( e );
			// m - toggle menu
			if ( ( e.keyCode === 77 ) && ( count === 1 ) ) {
				menu_close.trigger( 'click.wpmt' );
			}
		} );
	}


	/**
	 * Checks or unchecks the bulk action checkbox depending on setting.
	 */
	function set_bulk_actions_checkbox() {

		options.author.each( function() {
			var checkbox = $( this ).parent().find( options.column );

			if ( options.bulk_actions === 'on' ) {
				checkbox.attr( 'checked', true );
			} else {
				checkbox.attr( 'checked', false );
			}
		} );

		reset_author();
		options.bulk_actions = false;
	}


	/**
	 * Resets the author column if posts are selected/deselected
	 * Adds background color and 'edit profile' link to the author column
	 * Updates the menu
	 */
	function reset_author( author_object ) {

		options.stats.empty();
		var bozo = 0;
		options.author.each( function() {
			var post_color = $( this ).parent().children( '.check-column' ).css( "background-color" ),
				displayname = $.trim( $( this ).children().first( 'a' ).text() ),
				checkbox = $( this ).parent().find( options.column );
			// author column to normal post color
			$( this ).css( "background", post_color );
			// replace bozo text and put it in a span for better visibility
			if ( !obj_exists( $( this ).children( '.wpmt_profile_edit' ) ) ) {
				var img = $( "img", $( this ).children().first( 'a' ) ),
					edit_link_span = '<br/><span class="wpmt_profile_edit"><a href="' + $( this ).children().first( 'a' ).attr( "href" ) + '/edit">Edit Profile</a></span>';
				if ( displayname.indexOf( '(BOZO)' ) >= 0 ) {
					// spam and deleted posts
					displayname = $.trim( displayname.replace( '(BOZO)', '' ) );
					$( this ).children().first( 'a' ).text( ' ' + displayname );
					if ( img ) {
						$( this ).children().first( 'a' ).prepend( img );
					}

					if ( ajax ) {
						var $container = $( this ).children().first( 'a' );

						$.ajax( {
							url: $container.attr( "href" ) + '/edit',
							async: true,
							dataType: 'html',
							success: function( html ) {
								if ( -1 != html.search( pattern.ANT ) ) {
									$container.append( '<span class="wpmt_bozo_profile" >BOZO (ANT)</span>' );
									$container.parent().addClass( 'wpmt_bozo_post' );
								} else {
									$container.append( '<span class="wpmt_bozo_profile" >BOZO</span>' );
									$container.parent().addClass( 'wpmt_bozo_post' );
								}
							}
						} );
					} else {
						$( this ).append( '<span class="wpmt_bozo_profile" >BOZO</span>' );
						$( this ).parent().addClass( 'wpmt_bozo_post' );
					}
					++bozo;
				} else {
					$( this ).parent().addClass( 'wpmt_normal_post' );
				}
				// add edit profile link
				$( this ).children().first( 'a' ).after( edit_link_span );
			} else {
				if ( obj_exists( $( this ).children( 'span.wpmt_bozo_profile' ) ) ) {
					++bozo;
				}
			}
			// check if author checkbox is checked
			if ( checkbox.attr( "checked" ) ) {
				$( this ).attr( 'style', 'background: ' + select_color + ';' );
				$( this ).addClass( 'post_selected' );
			} else {
				$( this ).css( "background", post_color );
				$( this ).removeClass( 'post_selected' );
			}
			if ( ( typeof( author_object ) !== 'undefined' ) && ( author_object === $( this ).parent().attr( 'id' ) ) ) {
				// td author has been clicked to select the post
				if ( checkbox.attr( "checked" ) ) {
					$( this ).css( "background", post_color );
					checkbox.attr( 'checked', false );
					$( this ).removeClass( 'post_selected' );
				} else {
					$( this ).attr( 'style', 'background: ' + select_color + ';' );
					checkbox.attr( 'checked', true );
					$( this ).addClass( 'post_selected' );
				}
			}
		} ); // $(td.author a").each
		// reset bulk actions checkbox
		var total_selected = $( "tbody > tr" ).length,
			selected = $( "tbody > tr > " + options.column + ":checked" ).length;
		if ( selected < total_selected ) {
			$( options.bulk_actions_checkbox ).attr( 'checked', false );
		}
		if ( selected === total_selected ) {
			$( options.bulk_actions_checkbox ).attr( 'checked', true );
		}
		// update menu
		var detected_string = '';
		var type = ( options.topics ) ? 'topic' : 'post';
		detected_string += 'Current Page: ' + total_selected + ' ' + type + ( ( total_selected === 1 ) ? '' : 's' );
		if ( !options.topics ) {
			detected_string += ' &#10022; <span class="wpmt_profile_type">';
			detected_string += ( bozo > 0 ) ? bozo + ' bozo' + ( ( bozo === 1 ) ? '' : 's' ) : '0 bozos';
			detected_string += '</span>';
			detected_string += ' &#10022; <span class="wpmt_profile_type wpmt_green">';
			detected_string += ( total_selected - bozo > 0 ) ? ( total_selected - bozo ) + ' normal profile' + ( ( ( total_selected - bozo ) === 1 ) ? '' : 's' ) : 'no normal profiles';
			detected_string += '</span>';
		}
		detected_string += ' | <span class="wpmt_profile_type wpmt_selected">';
		detected_string += ( selected > 0 ) ? selected + ' ' + type + ( ( selected === 1 ) ? '' : 's' ) + ' selected' : 'No ' + type + 's selected';
		detected_string += '</span> | ';
		options.stats.append( detected_string );
	}


	/**
	 * Checks for duplicate IPs
	 */
	function check_duplicate_IPs() {

		// Remove current duplicate IP warnings
		$( '.wpmt_ip-warning' ).remove();

		var _next_prev_objects = next_prev_objects;
		var seen = {};
		var IPs = {};
		var duplicate_IPs = {};

		// remove duplicate objects with same profile name and ip
		_next_prev_objects = _next_prev_objects.filter( function() {

			var txt = $( this ).find( options.author ).text();
			var ip = $( this ).find( '.post-ip-link' ).text();

			if ( !( txt.length && ip.length ) ) {
				return false;
			}

			if ( seen[ txt + ip ] ) {
				// txt + ip is in seen object
				return false;
			} else {
				// txt + ip is not in seen object
				seen[ txt + ip ] = true;
				return true;
			}
		} );

		// get duplicate IPs
		$.each( _next_prev_objects, function( i, el ) {
			var IP = $( this ).find( '.post-ip-link' ).text();
			if ( IP.length ) {
				if ( IPs[ IP ] ) {
					duplicate_IPs[ IP ] = true;
				} else {
					IPs[ IP ] = true;
				}
			}
		} );

		// if no duplicates return
		if ( $.isEmptyObject( duplicate_IPs ) ) {
			return;
		}

		// add warning to posts with duplicat IPs
		next_prev_objects.each( function() {
			var obj = $( this ).find( '.post-ip-link' );
			if ( obj_exists( obj ) === 1 ) {
				var obj_IP = obj.text();
				if ( duplicate_IPs[ obj_IP ] ) {
					obj.before( $( '<span class="wpmt_ip-warning">(DUPLICATE IP)</span>' ) );
				}
			}
		} );
	}


	/**
	 * Adds a profile link to the modlook tag
	 */
	function add_modlook_profile() {
		$( "#yourtaglist" ).find( 'a' ).each( function() {
			if ( $( this ).text() === 'modlook' ) {
				var parent = $( this ).parents( 'li' );
				if ( obj_exists( parent ) ) {
					parent_id = parent.attr( 'id' ).split( '_' );
					if ( parent_id[ 1 ].length ) {
						if ( ajax ) {
							var label = parent_id[ 1 ];
							$.ajax( {
								url: 'https://wordpress.org/support/profile/' + parent_id[ 1 ],
								async: true,
								dataType: 'html',
								success: function( html ) {
									var details = pattern.username.exec( html );
									if ( details.length >= 2 ) {
										label = details[ 1 ];
									}

									parent.append( $( '<a class="wpmt_modlook" href="https://wordpress.org/support/profile/' + parent_id[ 1 ] + '" title="modlook tagged by user ' + parent_id[ 1 ] + '">' + label + '</a>' ) );
								}
							} );
						} else {
							parent.append( $( '<a class="wpmt_modlook" href="https://wordpress.org/support/profile/' + parent_id[ 1 ] + '" title="modlook tagged by user ' + parent_id[ 1 ] + '">' + parent_id[ 1 ] + '</a>' ) );
						}
					}
				}
			}
		} );
	}


	/**
	 * Adds a lower case button when editing a post
	 * wordpress.org/support/edit.php
	 */
	function add_lower_case_button_to_editor() {

		var start = 0,
			end = 0,
			selected_element = 0;

		var toolbar = $( "#ed_toolbar" );
		if ( obj_exists( toolbar ) ) {
			var uncap_button = $( '<input id="moderator_tools_ed_uncap" class="moderator_tools_ed_button" type="button" value="l-case" accesskey="d">' );
			toolbar.append( uncap_button );

			$( '#post_content' ).add( $( '#topic' ) ).select( function( e ) {
				start = e.target.selectionStart;
				end = e.target.selectionEnd;
				selected_element = $( this );
			} );

			uncap_button.bind( 'click.wpmt', function( e ) {
				e.preventDefault();

				if ( selected_element ) {
					var to_lower = selected_element.val().substring( start, end ).toLowerCase();
					var new_text = selected_element.val().substring( 0, start ) + to_lower + selected_element.val().substring( end );
					selected_element.val( new_text );
					selected_element.focus();
					var _selected_element = selected_element.get( 0 );
					_selected_element.selectionStart = end;
					_selected_element.selectionEnd = end;
				}

				start = end = selected_element = 0;
			} );
		}
	}


	/**
	 * Adds view=all to urls found in an element
	 */
	function add_view_is_all_parameter( selector ) {

		var links = $( selector ).find( 'a' );

		if ( !obj_exists( $( links ) ) ) {
			return;
		}

		$( links ).attr( 'href', function() {

			var search = this.search;
			var url = this.protocol + "//" + this.host + this.pathname;
			var new_url = false;

			if ( search ) {

				var pattern = /view=all/g;

				if ( !pattern.test( search ) ) {
					new_url = url + search + '&view=all';
				}

			} else {
				new_url = url + '?view=all';
			}

			if ( new_url ) {
				return new_url + this.hash;
			}

			return this;
		} );

	}


	/**
	 * Checks if a form has focus and sets the form variable
	 */
	function check_form_focus() {
		el = $( 'form' );
		if ( obj_exists( el ) ) {
			el.focusin( function() {
				form_focus = true;
			} ).focusout( function() {
				form_focus = false;
			} );
		}
	}


	/**
	 * Deletes keys from the heldKeys object on keyup
	 */
	function reset_keys() {
		$( document ).bind( 'keyup.wpmt', function( e ) {
			if ( heldKeys.hasOwnProperty( e.which ) ) {
				delete heldKeys[ e.which ];
			}
		} );
	}


	/**
	 * Returns the count of keys currently being held.
	 */
	function get_keydown_count( e ) {
		heldKeys[ e.which ] = true;
		return Object.keys( heldKeys ).length;
	}


	/**
	 * Scrolls to an element on the page
	 */
	function scrollTo( element ) {

		var targetOffset = element.offset().top;
		var menu_height = 65;

		if ( menu_container.is( ':visible' ) ) {
			menu_height = menu_container.height();
			menu_height += 30;
		} else {
			// menu not visible
			if ( ( $( element ).height() + menu_height ) > $( window ).height() ) {
				menu_height = 5;
			}
		}

		targetOffset = targetOffset - menu_height;

		$( 'html, body' ).animate( {
			scrollTop: targetOffset
		}, {
			duration: 150
		} );
	}


	/**
	 * Sets the menu state text based on if the menu is visible or hidden.
	 */
	function show_hide_menu() {

		if ( 'hide' === menu ) {
			menu_container.hide();
			menu_state.text( 'type m to display the menu' );
		} else if ( 'show' === menu ) {
			menu_state.text( 'type m to hide the menu' );
		} else {
			menu = 'hide';
			menu_container.hide();
			menu_state.text( 'type m to display the menu' );
		}
	}


	/**
	 * Removes the "current" class from all next_prev_objects elements
	 */
	function remove_current_class() {
		if ( obj_exists( next_prev_objects ) ) {
			next_prev_objects.removeClass( current_class );
		}
	}


	/**
	 * Opens window in new tab
	 */
	function window_open( url ) {

		// reset held keys
		heldKeys = {};

		// keeps parent page javascript in tact
		setTimeout( function() {
			window.open( url, '_blank' );
		}, 200 );
	}


	/**
	 * Returns a formatted shortcut string
	 */
	function process_shortcuts( _shortcuts ) {
		if ( !obj_exists( _shortcuts ) ) {
			return '';
		}

		var shortcut_str = '';
		$.each( _shortcuts, function( index, value ) {
			shortcut_str += replace_markers( value ) + '<br/>';
		} );

		return shortcut_str;
	}


	/**
	 * Wraps the shortcut letter in a span
	 */
	function replace_markers( text ) {
		return text.replace( /\%(.*?)\%/g, '<span class="wpmt_shortcut">$1</span>' );
	}


	function getParameterByName( name ) {
		name = name.replace( /[\[]/, "\\[" ).replace( /[\]]/, "\\]" );
		var regex = new RegExp( "[\\?&]" + name + "=([^&#]*)" ),
			results = regex.exec( location.search );
		return results === null ? "" : decodeURIComponent( results[ 1 ].replace( /\+/g, " " ) );
	}


	/**
	 * Checks if an object exists
	 */
	function obj_exists( object ) {
		if ( typeof( object ) !== 'undefined' ) {
			return object.length;
		}
		return 0;
	}

	/**
	 * Filter to view all reviews on the first review page
	 */
	function viewAllReviews() {
		var pagination = $( '#pages' ).first(),
			pages = $( pagination ).find( 'a' ).not( '.next' ),
			lastPage = pages.last(),
			pageCount = 1,
			location = window.location.href,
			url = location.split( "?" )[ 0 ],
			container = $( '<div class="all-reviews_container" id="all-reviews_container"/>' ),
			wrapper = $( '.all-reviews' ).append( container );

		// Only apply if on the first reviews page
		if ( pagination.children().first().hasClass( 'current' ) ) {
			var button = $( '<button aria-controls="all-reviews_container"  aria-expanded="false" class="button reviews-toggle-all">All reviews</button>' );

			// Create a button for this filter
			wrapper.prepend( button );

			button.click( function() {
				// If all reviews are shown
				if ( button.hasClass( 'reviews-toggle-all--visible' ) ) {
					// Hide the reviews
					container.hide();
					// Removes the current class for navigation
					remove_current_class();
					// Fill the Duplicate IP variable with the original reviews
					next_prev_objects = $( '.all-reviews > .review' );
					// Run the Duplicate IP script again
					check_duplicate_IPs();

					button
						.text( 'All reviews' )
						.removeClass( 'reviews-toggle-all--visible' )
						.attr( 'aria-expanded', false );
				}
				// If all reviews are hidden but the button has been pressed
				else if ( button.hasClass( 'reviews-toggle-all--toggled' ) ) {
					// Show the reviews
					container.show();

					// Removes the current class for navigation
					remove_current_class();

					// Run the Duplicate IP script again
					check_duplicate_IPs();

					button
						.text( 'Fewer reviews' )
						.addClass( 'reviews-toggle-all--visible' )
						.attr( 'aria-expanded', true );
				} else {
					var i = 1;

					// Update the button attributes accordingly
					button
						.text( 'Fewer reviews' )
						// also add a toggled classes to target
						.addClass( 'reviews-toggle-all--toggled reviews-toggle-all--visible' )
						.attr( 'aria-expanded', true );

					// Looping each review page
					for ( pageCount; pageCount < lastPage.text(); pageCount++ ) {
						var filter = '';

						if ( review_filter.length ) {
							filter = "?filter=" + review_filter;
						}

						// Grab the contents of each review page

						$.get( url + '/page/' + ( pageCount + 1 ) + filter, function( data ) {
							var reviews = $( data ).find( '.review' );

							// Append the reviews to the current first page
							container.append( reviews );

							// If the final set of reviews have been grabbed
							if ( i === parseInt( lastPage.text() ) - 1 ) {
								// Fill the Duplicate IP variable with the updated reviews
								next_prev_objects = $( '.review' );

								// Run the Duplicate IP script again
								check_duplicate_IPs();
							}

							i++;
						} );
					}
				}

			} );

			// Add some CSS
			styles += '.reviews-toggle-all {margin-bottom: 2em;padding-right: 2em;position: relative;}.reviews-toggle-all:after {content: "+";position: absolute;right: 10px;top: 0;font-family: seriffont-size: 16px;}.reviews-toggle-all--visible:after {content: "-";}';
		}
	}

	/**
	 * Adds a button to strip out links when editing a review
	 * wordpress.org/support/edit.php
	 */
	function add_strip_links_button_to_editor() {
		var button = $( '<input class="ed_button" type="button" value="strip links" />' );

		function addBtn() {
			var toolbar = $( '#ed_toolbar' );

			toolbar.append( button );
		}

		function removeLinks() {
			var post = $( '#post_content' ),
				postContent = post.val(),
				replaceContent = '<em>[Link redacted]</em>',
				updatedContent,
				matches = {
					'link': /<a.*?<\/a>/gi,
					'http': /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
					'www': /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
				};

			// Run the Regex to remove the links
			updatedContent = postContent
				.replace( matches.link, replaceContent )
				.replace( matches.http, replaceContent )
				.replace( matches.www, replaceContent );

			// Update the post content 
			post.val( updatedContent );
		}

		addBtn();

		button.click( function( event ) {
			removeLinks();
		});
	}

	/**
	 * Makes visible links that would otherwise be hidden
	 */
	function showHiddenLinks( posts ) {

		var hidden_style = 'border: 2px solid gold; display: inline-block; margin: 5px; padding: 5px;';

		posts.each( function() {
			var post = $( this );

			// find hidden links;
			var hidden_links = post.find( 'a' ).filter( function( index ) {
				var text = $.trim( $( this ).text() );
				if( text == '' ){
					return true;
				} else if ( text.length < 3 ) {
					return true;
				}
				return false;
			} );

			if ( !obj_exists( hidden_links ) ) {
				return true;
			}

			var link_container = $( '<div><span class="wpmt_screen_reader_text">Hidden links, or links with less than 3 characters found in post content</span></div>' );

			hidden_links.each( function() {

				var link = $( this );
				var admin_style = is_admin ? 'font-size:1.4em;' : '';

				// Get the HTML of the link
				link.text( link[ 0 ].outerHTML );
				var pre = $( '<pre style="' + hidden_style + admin_style + '">' + link.html() + '</pre>' );
				link_container.append( pre );

				// Hide the original link
				link.hide();

			} );

			// Output it on the page
			if ( is_admin ) {
				var row_actions = $( '.row-actions', post ).parent();
				if ( obj_exists( row_actions ) ) {
					row_actions.before( link_container );
				} else {
					post.append( link_container );
				}
			} else {
				post.append( link_container );
			}
		} );
	}	 
	
	
	/* Match IPs
	 * Takes a string of IPs and checks whether those IPs exist on the page
	 */
	function match_IPs () {
		var target = $('.review-ratings .col-1'),
			match_summary_list = $('<ol />');

		function create_form(target) {
			var form = $('<form class="mod-tools-check-ips postform" />');

			form.append('<div class="form-row"><label for="mod-tools-check-ips">Match IPs</label></div>');
			form.append('<div class="form-row"><input id="mod-tools-check-ips" placeholder="IPs space separated" type="text" /></div>');
			form.append('<div class="form-row"><button class="button">Match</button></div>'); 

			target.append(form);
		
			// Create custom behaviour on form submit
			form.submit(function(event) {
				event.preventDefault();

				var form = $(this),
					input = form.find('#mod-tools-check-ips').val(),
					input_IPs = input.split(' '),
					document_ips = $('.post-ip-link');      
				
				
				match_summary_list.remove();
				match_summary_list = $('<ol />');

				// For each IP in the DOM
				document_ips.each(function(i, v) {
					var document_IP = $(v);

					// Check the the IP matches any of those submitted in the form
					if ($.inArray(document_IP.text(), input_IPs) !== -1) {
						var id = 'mod-tools-ip-match-' + i;
						
						// If matched
						// - Compile an overview of all of the matched IPs
						match_summary_list.append('<li><a href="#' + id + '">' + document_IP.text() + '</a></li>');
						// - Add a class to style the IP
						document_IP.addClass('mod-tools-ip-matched').attr('id', id);
					} 
				});

				form.after(match_summary_list);
				
				return form;
			});
		}
		
		function init() {
			var form = create_form(target),
				matched_summary_container = $('<div class="mod-tools-match-summary" />');
			
			matched_summary_container.append(form);
			target.append(matched_summary_container);
			
			// Grids
			target.removeClass('col-1').addClass('col-3');
			// Styles
			styles +=  '.form-row { display: block; overflow: hidden; margin-bottom: 5px;} .mod-tools-check-ips label { font-weight: 700; } .mod-tools-ip-matched { border: 2px solid gold; padding: 0 5px; } .mod-tools-ip-matched-text { background: gold; padding: 2px; }';
		}
		
		init();
	}

	init();
} );