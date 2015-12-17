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
				'dest': 'Firefox_uglified.js'
			},
			'chrome': {
				'src': ['WordPress_Moderator_Tools_Chrome.user.js'],
				'dest': 'Chrome_uglified.js'
			},
			'chrome_rosetta': {
				'src': ['WordPress_Moderator_Tools_Rosetta_Chrome.user.js'],
				'dest': 'Rosetta_Chrome_uglified.js'
			},
		}

	} );

	grunt.util.linefeed = '\n';

};