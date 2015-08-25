var configuration = require('./etc/conf.js');

module.exports = function(grunt){
  grunt.initConfig({
    configuration: {
      all: configuration
    },
    watch: {
      javascript: {
        files: ["src/js/**/*.js"],
        tasks: ["javascript", "less", "express"],
        options: {
          atBegin: true,
          spawn: false,
        }
      }
    },
    less: {
      compile: {
        files: {
          "public/css/game.css": "src/less/all.less",
        }
      }
    },
    browserify: {
      dist: {
        files: {
          "public/js/game.js": "src/js/game.js"
        }
      }
    },
    express: {
      all: {
        options: {
          port: 8080,
          script: "server/main.js"
        }
      }
    }
  });

  grunt.loadTasks("tasks");

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-express-server");

  grunt.registerTask("javascript", ["browserify"]);
  grunt.registerTask("default", ["configuration", "javascript", "less"]);
};
