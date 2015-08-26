var configuration = require('./etc/conf.js');

module.exports = function(grunt){
  grunt.initConfig({
    configuration: {
      all: configuration
    },
    watch: {
      javascript: {
        files: ["src/js/**/*.js", "src/templates/**/*._tmpl.html"],
        tasks: ["javascript", "less", "express"],
        options: {
          atBegin: true,
          spawn: false,
        }
      },
      less: {
        files: ["src/less/**/*.less"],
        tasks: ["less"],
        options: {
          atBegin: true
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
    },
    jst: {
      compile: {
        options: {
          namespace: "Templates",
          processName: function(filename) {
            return filename.replace(/.*\/([^\/]+)\._tmpl\.html$/, "$1");
          }
        },
        files: {
          "src/js/templates.js": ["src/templates/**/*._tmpl.html"]
        }
      }
    }
  });

  grunt.loadTasks("tasks");

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-express-server");
  grunt.loadNpmTasks("grunt-contrib-jst");

  grunt.registerTask("javascript", ["configuration", "jst", "exportTemplates", "browserify"]);
  grunt.registerTask("default", ["javascript", "less"]);
};
