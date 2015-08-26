module.exports = function(grunt){
  var fs = require('fs');
  var Bacon = require('baconjs');

  grunt.registerTask("exportTemplates", "test", function(){
    var done = this.async();
    var fileName = "src/js/templates.js";

    var s_content = Bacon.fromNodeCallback(fs.readFile, fileName).map(function(template){
      return 'module.exports = function(){' + template + ' return this["Templates"];}';
    }).flatMapLatest(function(template){
      return Bacon.fromNodeCallback(fs.writeFile, fileName, template);
    });

    s_content.onValue(function(){
      grunt.log.writeln("Templates exported");
      done();
    });
    s_content.onError(function(error){
      grunt.fail.fatal(error);
    });
  });
};
