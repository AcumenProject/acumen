'use strict';
module.exports = function(grunt) {
    // Load all tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time
    require('time-grunt')(grunt);

    grunt.registerTask('default', ['prepAcumen']);
    grunt.registerTask('prepAcumen', ['copy:api', 'copy:solr', 'copy:ui', 'copy:xsl']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower_dir: 'bower_components',
        copy: {
            api: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= bower_dir %>/acumen-api/',
                        src: ['**/*', '!README.md'],
                        dest: './'
                    }
                ]
            },
            solr: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= bower_dir %>',
                        src: ['acumen-solr/**'],
                        dest: 'solr/'
                    }
                ]
            },
            ui: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= bower_dir %>',
                        src: ['acumen-ui/dist/**'],
                        dest: 'assets/'
                    }
                ]
            },
            xsl: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: '<%= bower_dir %>',
                        src: ['acumen-xsl/**/*.xsl'],
                        dest: 'assets/xsl/'
                    }
                ]
            }
        }
    });
};