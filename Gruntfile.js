module.exports = function( grunt ) {

	// Load multiple grunt tasks using globbing patterns
	require( 'load-grunt-tasks' )( grunt );

	'use strict';
	var banner = '/**\n * <%= pkg.homepage %>\n * Copyright (c) <%= grunt.template.today("yyyy") %>\n * This file is generated automatically. Do not edit.\n */\n';
	// Project configuration
	grunt.initConfig( {

		pkg: grunt.file.readJSON( 'package.json' ),

		'min': {
			'firefox': {
				'src': ['WordPress_Moderator_Tools_Firefox.user.js'],
				'dest': 'WordPress_Moderator_Tools_Firefox.uglified.js'
			},
			'chorme': {
				'src': ['WordPress_Moderator_Tools_Chrome.user.js'],
				'dest': 'WordPress_Moderator_Tools_Chrome.uglified.js'
			},
		}

	} );

	grunt.util.linefeed = '\n';

};