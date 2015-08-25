module.exports = function(grunt) {
  var fs = require("fs");

  grunt.registerMultiTask("configuration", "Write configuration in a JS file", function() {
    var done = this.async();
    var filename = "src/js/configuration.js";
    var configuration = this.data;
    var content = "module.exports = " + JSON.stringify(configuration) + ";";

    fs.writeFile(filename, content, function(err) {
      if(err) {
        grunt.log.error(err);
      }
      else {
        grunt.log.writeln("File " + filename + " created.");
      }
      done();
    });
  });
};
