module.exports = function(grunt){

	var CONCAT_JS_LIST = [
		'development/assets/js/vendor/jquery-ui/ui/jquery.ui.widget.js',
		'development/assets/js/vendor/jquery-easing/jquery.easing.js',
		'development/assets/js/_src/scripts.js'
	];

	var BANNER_TEMPLATE_STRING = '/*! <%= pkg.name %> - v<%= pkg.version %> - '
		+ '<%= grunt.template.today("yyyy-mm-dd") %> */\n';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			production: ['production']
		},
		copy: {
			production: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: 'development/',
						src: ['**', '!**/_src/**'],
						dest: 'production/'
					}
				]
			}
		},
		compress: {
			production: {
				options: {
					archive: 'htdocs<%= grunt.template.today("yyyymmdd") %>.zip'
				},
				files: [
					{
						expand: true,
						cwd: 'production/',
						src: '**',
						dest: 'htdocs/'
					}
				]
			}
		},
		connect: {
			development: {
				options: {
					port: 8000,
					base: 'development'
				}
			},
			production: {
				options: {
					port: 8001,
					base: 'production',
					keepalive: true
				}
			}
		},
		regarde: {
			scripts: {
				files: 'development/assets/js/_src/**/*.js',
				tasks: ['concat', 'uglify']
			},
			sass: {
				files: 'development/assets/css/_src/**/*.scss',
				tasks: ['sass', 'cssmin']
			}
		},
		imagemin: {
			production: {
				options: {
					optimizationLevel: 3
				},
				files: [
					{
						expand: true,
						cwd: 'production/assets/img/',
						src: '**/*.{png,jpg,jpeg}',
						dest: 'production/assets/img/'
					}
				]
			}
		},
		concat: {
			options: {
				banner: BANNER_TEMPLATE_STRING
			},
			assets: {
				files: {
					'development/assets/js/all.js': CONCAT_JS_LIST
				}
			}
		},
		uglify: {
			options: {
				banner: BANNER_TEMPLATE_STRING
			},
			assets: {
				files: {
					'development/assets/js/all.min.js': 'development/assets/js/all.js'
				}
			}
		},
		sass: {
			assets: {
				options: {
					style: 'expanded'
				},
				files: {
					'development/assets/css/all.css': 'development/assets/css/_src/styles.scss'
				}
			}
		},
		cssmin: {
			options: {
				banner: BANNER_TEMPLATE_STRING
			},
			assets: {
				files: {
					'development/assets/css/all.min.css': 'development/assets/css/all.css'
				}
			}
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('development', [
		'concat',
		'uglify',
		'sass',
		'cssmin',
		'connect:development',
		'regarde'
	]);
	grunt.registerTask('production', [
		'clean',
		'copy',
		'imagemin',
		'compress',
		'connect:production'
	]);

};
