module.exports = function(grunt) {

	'use strict';

	grunt.initConfig({

		sass : {
			dev : {
				files : {
					'dev/css/main.css': 'dev/sass/main-sass.scss'
				},
				options : {
					debugInfo : true,
					sourcemap : true
				}
			},
			prod : {
				files : {
					'dev/css/main.css': 'dev/sass/main-sass.scss'
				}
			}
		},

		watch : {
			options	: {
				livereload : true
			},
			sassToCSS : {
				files : ['dev/sass/{,*/}*.scss'],
				tasks : ['newer:sass:dev']
			},
			jsHint : {
				files : ['dev/js/*.js'],
				tasks : ['newer:jshint']
			},
			validateHTML : {
				files : ['dev/index.html'],
				tasks : ['newer:validation']
			}
		},

		jshint : {
			options : {
				jshintrc : '.jshintrc',
				reporter : require('jshint-stylish')
			},
			files : {
				src : ['Gruntfile.js']
			}
		},

		autoprefixer : {
			target : {
				src : 'dev/css/main.css'
			}
		},

		sprite : {
			all : {
				src : 'dev/img/sprites/*.png',
				destImg : 'dev/img/sprites.png',
				destCSS : 'dev/sass/sprites.scss',
				cssFormat : 'css'
			}
		},

		validation : {
			options : {
				reset : true,
				reportpath : false,
				stoponerror : true
			},
			files : {
				src : 'dev/index.html'
			}
		},

		imagemin : {
			dist : {
				files : [{
					expand : true,
					cwd : 'dev/',
					src : ['img/*.{png,jpg,gif}'],
					dest : 'assets/'
				}]
			}
		},

		svgmin : {
			dist : {
				files : [{
					expand : true,
					cwd : 'dev/',
					src : ['img/*.svg'],
					dest : 'assets/'
				}]
			}
		},

		uglify : {
			options : {
				banner : '/* Want to see the source? Go to /dev instead :) */'
			},
			build : {
				src : 'dev/js/main.js',
				dest : 'assets/js/main.js'
			}
		},

		cssmin : {
			build : {
				expand : true,
				cwd : 'dev/css/',
				src : ['*.css'],
				dest : 'assets/css/',
				ext : '.css'
			}
		},

		clean : ['assets/'],

		replace : {
			css : {
				options : {
					patterns : [{
						match : /main.css/,
						replacement : 'main.' + Math.ceil(Math.random() * 50000) + '.css',
						expression : true
					}]
				},
				files : [{
					src : ['dev/index.html'],
					dest : 'assets/index.html'
				}],
			}
		},

		notify: {
			deploy: {
				options : {
					title : 'Deploy completed!',
					message : 'Congratulations, your app is up :)'
				}
			}
		},

		rsync : {
			options : {
				exclude : ['.git*','node_modules'],
				recursive : true
			},
			home : {
				options : {
					src : 'assets/',
					dest : 'www/',
					host: 'user@host',
					recursive : true,
					syncDest : true,
				}
			}
		}

	});

	// Load the plugin that preprocess our SASS files into CSS.
	grunt.loadNpmTasks('grunt-contrib-sass');

	// Load the plugin that provides the "watch" task.
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Load the plugin that validates our js files with JSHint.
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Load the plugin that validates our HTML through W3C validator.
	grunt.loadNpmTasks('grunt-html-validation');

	// Load the plugin that automaticaly prefixes our CSS.
	grunt.loadNpmTasks('grunt-autoprefixer');

	// Load the plugin that automaticaly generates sprites and it's CSS.
	grunt.loadNpmTasks('grunt-spritesmith');

	//We can load our tasks like this. This way, we will load the task when we need.
	grunt.registerTask('imagesMin', [], function () {

		// Load the plugin that compress our images assets.
		grunt.loadNpmTasks('grunt-contrib-imagemin');

		// Load the plugin that compress our SVG's.
		grunt.loadNpmTasks('grunt-svgmin');

		grunt.task.run('imagemin', 'svgmin');

	});

	// Load the plugin that only does the respective task if it's destiny is older than it's origin.
	grunt.loadNpmTasks('grunt-newer');

	// Load the plugin that minify and concatenate ".js" files.
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Load the plugin that minify and concatenate ".css" files.
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Load the plugin that clean files and directories.
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Load the plugin that replaces strings and regular expressions in your files.
	grunt.loadNpmTasks('grunt-replace');

	// Automatic notifications when tasks fail.
	grunt.loadNpmTasks('grunt-notify');

	// Publish your files using rsync as protocol.
	grunt.loadNpmTasks('grunt-rsync');

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('deploy', ['jshint', 'clean', 'sass:prod', 'autoprefixer', 'cssmin', 'uglify', 'imagesMin', 'replace', 'rsync']);

};