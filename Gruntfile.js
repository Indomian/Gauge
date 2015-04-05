module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files:[{
          src: '<%= pkg.main %>',
          dest: 'build/<%= pkg.name %>-<%= pkg.version %>.min.js'
        },{
          src: 'build/<%= pkg.name %>-<%= pkg.version %>.jquery.js',
          dest: 'build/<%= pkg.name %>-<%= pkg.version %>.jquery.min.js'
        }]
      }
    },
    copy: {
      jquery: {
        options: {
          process:createJQueryPlugin
        },
        src: '<%= pkg.main %>',
        dest: 'build/<%= pkg.name %>-<%= pkg.version %>.jquery.js'
      },
      build: {
        files: [{
            src: 'node_modules/jquery/dist/jquery.min.js',
            dest: 'public/js/jquery.min.js'
          },{
            src: 'build/<%= pkg.name %>-<%= pkg.version %>.min.js',
            dest: 'public/js/gauge.js'
          },{
            src: 'build/<%= pkg.name %>-<%= pkg.version %>.jquery.min.js',
            dest: 'public/js/gauge.jquery.js'
        }]
      },
      debug: {
        files: [{
          src: 'node_modules/jquery/dist/jquery.js',
          dest: 'public/js/jquery.min.js'
        },{
          src: 'src/gauge.js',
          dest: 'public/js/gauge.js'
        },{
          src: 'build/<%= pkg.name %>-<%= pkg.version %>.jquery.js',
          dest: 'public/js/gauge.jquery.js'
        }]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['copy:jquery','uglify','copy']);
  grunt.registerTask('debug', ['copy:jquery','copy:debug']);

  function createJQueryPlugin(content,srcpath) {
    var template=grunt.file.read('src/jquery.template');
    return template.replace('#CLASS#',content);
  }
};