// Generated on 2015-02-11 using generator-webapp 0.4.9
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

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
//                tasks: ['jshint'],
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
                /*tasks: ['newer:copy:styles', 'autoprefixer']*/
                tasks: ['stylus', 'autoprefixer']
            },
            hbs: {
                files: ['<%= config.app %>/{,*/}*.hbs', '<%= config.app %>/templates/{,*/}*.hbs', '<%= config.app %>/pages/{,*/}*.*'],
                /*tasks: ['newer:copy:styles', 'autoprefixer']*/
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
                paths: ['<%= config.app %>/styles/main.styl'],
                sourcemap:{
                  comment:true, //Adds a comment with the `sourceMappingURL` to the generated CSS (default: `true`)
                  inline: true, //Inlines the sourcemap with full source text in base64 format (default: `false`)
                  sourceRoot: ".", //"sourceRoot" property of the generated sourcemap
                  basePath:"." //Base path from which sourcemap and all sources are relative (default: `.`)
                }

            },
            serve: {
                files: {
                  '.tmp/styles/main.css': ['<%= config.app %>/styles/main.styl'] // compile and concat into single file
                }
            }

        },

        svgstore: {
            options: {
                prefix : 'icon-'
            },
            default : {
              files: {
                'app/images/icon-sprite.svg': ['app/images/icons/*.svg'],
              },
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
            helpers: ['helpers/helper-*.js'],

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
              files: [
                 {
                     expand: true,
                     cwd: '<%= config.app %>/pages/',
                     src: ['{,*/}*.hbs', '{,*/}*.md'],
                     dest: 'docs/'
                 }, {
                    expand: true,
                    cwd: '<%= config.app %>/journal/',
                    src: ['{,*/}*.hbs', '{,*/}*.md'],
                    dest: 'docs/journal/'
                }
              ]
          }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            scripts: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        'scripts/{,*/}*.*'
                    ]
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.*',
                        '{,*/}*.html',
                        'data/photowall.json',
                        'data/ups.json',
                        'styles/fonts/{,*/}*.*'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        // Generates a custom Modernizr build that includes only the tests you
        // reference in your app
        modernizr: {
            dist: {
                devFile: 'bower_components/modernizr/modernizr.js',
                outputFile: '<%= config.dist %>/scripts/vendor/modernizr.js',
                files: {
                    src: [
                        '<%= config.dist %>/scripts/{,*/}*.js',
                        '<%= config.dist %>/styles/{,*/}*.css',
                        '!<%= config.dist %>/scripts/vendor/*'
                    ]
                },
                uglify: true
            }
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                'stylus:serve',
                'assemble:serve',
                'svgstore'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                //'imagemin',
                'copy'
            ]
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
              recipients: [
                {
                  email: 'rob@8ways.de'
                }
              ]
            },
            inline: { /* use above options*/ }
          }

    });


    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'stylus:serve',
            'assemble:serve',
            'svgstore',
            'autoprefixer:serve',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'assemble:build',
        'stylus:serve',
        'autoprefixer',
        'copy',
        'copy:scripts',
        'copy:dist'
    ]);

    grunt.registerTask('deploy-dev', [
        'build',
        'ftp-deploy:dev',
        'nodemailer'
    ]);

};
