'use strict';
module.exports = function(grunt) {
    // Load all tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time
    require('time-grunt')(grunt);

    grunt.registerTask('default', ['prepAcumen']);
    grunt.registerTask('prepAcumen', ['copy:solr', 'copy:ui']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower_dir: 'bower_components',
        copy: {
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
                        src: ['acumen-ui/dist/**/*'],
                        dest: 'assets/'
                    }
                ]
            },
            indexer: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= bower_dir %>/acumen-indexer',
                        src: ['**/*'],
                        dest: 'indexer/'
                    }
                ]
            }
        }
    });
};