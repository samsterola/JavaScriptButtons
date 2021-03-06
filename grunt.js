var grunt = require('grunt'),
	fs = require('fs'),
	jshintOptions = JSON.parse(fs.readFileSync('./.jshintrc'));


module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: "/*!\n * <%= pkg.name %>\n * <%= pkg.description %>\n * @version <%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd, h:MM:ss TT') %>\n * @author <%= pkg.author.name %> <<%= pkg.author.url %>>\n */"
		},
		lint: {
			all: [ 'src/*.js', 'test/*.js' ]
		},
		jshint: {
			options: jshintOptions
		},
		min: {
			dist: {
				src: [ '<banner:meta.banner>', 'src/paypal-button.js' ],
				dest: 'dist/paypal-button.min.js'
			},
			bundled: {
				src: [ '<banner:meta.banner>', 'lib/MiniCart/minicart.js', 'src/paypal-button.js' ],
				dest: 'dist/paypal-button-minicart.min.js'
			}
		}
	});


	// Default task.
	grunt.registerTask('default', 'min');

};