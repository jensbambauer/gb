// Generated on 2015-02-11 using generator-webapp 0.4.9
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('assemble');

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths
    var config = {
        app: 'app',
        dist: 'docs'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        pkg: grunt.file.readJSON('./package.json'),

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            js: {
                files: ['<%= config.app %>/scripts/{,*/}*.js'],
                tasks: ['concat:serve'],
                options: {
                    livereload: true
                }
            },
            jstest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['test:watch']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            styles: {
                files: ['<%= config.app %>/styles/{,*/}*.styl'],
                tasks: ['stylus', 'autoprefixer']
            },
            hbs: {
                files: ['<%= config.app %>/{,*/}*.hbs', '<%= config.app %>/templates/{,*/}*.hbs', '<%= config.app %>/pages/{,*/}*.*'],
                tasks: ['assemble:serve']
            },
            md: {
                files: ['<%= config.app %>/journal/{,*/}*.md'],
                tasks: ['assemble:serve']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '.tmp/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= config.app %>/images/{,*/}*'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    open: false,
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    base: '<%= config.dist %>',
                    livereload: false
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        stylus: {

            options: {
                paths: ['<%= config.app %>/styles/main.styl']
            },
            serve: {
                files: {
                    '.tmp/styles/main.css': ['<%= config.app %>/styles/main.styl'], // compile and concat into single file
                    '.tmp/styles/checkout.css': ['<%= config.app %>/styles/checkout.styl'] // compile and concat into single file
                }
            }

        },

        svgstore: {
            options: {
                prefix: 'icon-'
            },
            default: {
                files: {
                    'app/images/icon-sprite.svg': ['app/images/icons/*.svg'],
                },
            }
        },

        // combine javascript
        concat: {
            options: {
                sourceMap: true
            },
            serve: {
                src: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/chosen/chosen.jquery.min.js',
                    'bower_components/handlebars/handlebars.js',
                    'bower_components/knockout/dist/knockout.js',
                    'bower_components/flexslider/jquery.flexslider.js',
                    'bower_components/swiper/dist/js/swiper.jquery.min.js',
                    'bower_components/velocity/velocity.js',
                    'bower_components/twitter-fetcher/js/twitterFetcher.js',
                    'bower_components/lazysizes/lazysizes.js',
                    'bower_components/moment/min/moment.min.js',
                    'app/scripts/{,*/}*.js'
                ],
                dest: '.tmp/scripts/main.js'
            }
        },

        uglify: {
            dist: {
                files: {
                    'docs/scripts/main.js': '.tmp/scripts/main.js'
                }
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 3 version']
            },
            serve: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: 'docs/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the HTML file
        bowerInstall: {
            app: {
                src: ['<%= config.app %>/index.html'],
                exclude: ['bower_components/bootstrap/dist/js/bootstrap.js']
            }
        },

        assemble: {
            options: {
                assets: '.tmp',
                // metadata
                data: ['<%= config.app %>/data/*.{json,yml}'],
                flatten: false,
                plugins: ['assemble-contrib-permalinks'],
                permalinks: {
                    structure: ':slug/index.html'
                },
                layoutdir: "<%= config.app %>/templates/layouts/",

                // templates
                partials: ['<%= config.app %>/templates/partials/*.hbs'],
                layout: ['default.hbs'],
                helpers: ['node_modules/helper-moment/index.js', 'helpers/helper-*.js', 'node_modules/handlebars-helpers/index.js'],

                collections: [{
                    name: 'journal',
                    sortby: 'date',
                    sortorder: 'descending'
                }]
            },
            // This is really all you need!
            serve: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/pages/',
                    src: ['{,*/}*.hbs', '{,*/}*.md'],
                    dest: '.tmp/'
                }, {
                    expand: true,
                    cwd: '<%= config.app %>/journal/',
                    src: ['{,*/}*.hbs', '{,*/}*.md'],
                    dest: '.tmp/journal/'
                }]

            },
            build: {
                options: {
                    assets: 'docs'
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/pages/',
                    src: ['{,*/}*.hbs', '{,*/}*.md'],
                    dest: 'docs/'
                }, {
                    expand: true,
                    cwd: '<%= config.app %>/journal/',
                    src: ['{,*/}*.hbs', '{,*/}*.md'],
                    dest: 'docs/journal/'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/**',
                        '{,*/}*.html',
                        'data/photowall.json',
                        'data/ups.json',
                        'styles/fonts/{,*/}*.*',
                    ]
                },
                {
                    expand: true,
                    dot: true,
                    cwd: '.tmp',
                    dest: '<%= config.dist %>',
                    src: [
                        'scripts/vendor/{,*/}*.*',
                    ]
                }]
            }
        },

        // Generates a custom Modernizr build that includes only the tests you
        // reference in your app

        modernizr: {
            serve: {
                devFile: 'bower_components/modernizr/modernizr.js',
                dest: '.tmp/scripts/vendor/modernizr.js',
                files: {
                    src: [
                        '<%= config.dist %>/scripts/{,*/}*.js',
                        '<%= config.dist %>/styles/{,*/}*.css',
                        '!<%= config.dist %>/scripts/vendor/*'
                    ]
                },
                options: [
                  'prefixed',
                  'setClasses'
                ],
                uglify: true
            }
        },

        'ftp-deploy': {
            dev: {
                auth: {
                    host: 'www.8ways.de',
                    port: 21,
                    authKey: 'key1'
                },
                src: 'dist',
                dest: '/gandb/preview/webroot'
            }
        },

        nodemailer: {
            options: {
                transport: {
                    type: 'SMTP',
                    options: {
                        service: 'Gmail',
                        auth: {
                            user: 'jens.bambauer@dobago.de',
                            pass: '#Cellardoor00'
                        }
                    }
                },
                message: {
                    subject: 'Geebird&Bamby Dev New Version',
                    html: '<body><a href="http://preview.geebirdandbamby.com">preview.geebirdandbamby.com</a></body>',
                },
                recipients: [{
                    email: 'rob@8ways.de'
                }]
            },
            inline: { /* use above options*/ }
        }

    });


    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'stylus:serve',
            'concat:serve',
            'assemble:serve',
            'svgstore',
            'autoprefixer:serve',
            'connect:livereload',
            'modernizr:serve',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'assemble:build',
        'stylus:serve',
        'autoprefixer:dist',
        'concat:serve',
        'modernizr:serve',
        'copy:dist',
        'uglify'
    ]);

    grunt.registerTask('deploy-dev', [
        'build',
        'ftp-deploy:dev',
        'nodemailer'
    ]);

};
