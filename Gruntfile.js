module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        yate: {
            examples: {
                options: {
                    runtime: true
                },
                files: {
                    'examples/templates.js': 'examples/templates.yate'
                }
            }
        }
    });

    grunt.registerTask('examples', [
        'yate:examples'
    ]);

};
