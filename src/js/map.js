var Templates = require('./templates.js')();
var API = require('./api.js');

module.exports = function(player){
  var Map = {};

  Map.init = function(){
    var s_map = API.get('/map').log();

    s_map
      .flatMapLatest(Map.drawMap)
      .log();
  };

  Map.drawMap = function(map){
    var $content = document.querySelector('.content').innerHTML = Templates["map"]();
    var $map = document.querySelector('.mapContener');

    return map.reduce(function($mapHTML, line){
      $mapHTML.appendChild(Map.drawLine(line));
      return $mapHTML;
    }, $map);
  };

  Map.drawLine = function(line){
    var $line = document.createElement('div');
    $line.className += " map-line";

    return line.reduce(function($mapHTML, mapCase){
      $mapHTML.appendChild(Map.drawCase(mapCase));
      return $mapHTML;
    }, $line);
  };

  Map.drawCase = function(mapCase){
    var $mapCase = document.createElement('div');
    $mapCase.className += 'map-case';

    switch(mapCase.toLowerCase()){
      case "w":
        $mapCase.className += " map-wall";
      break;
      case "e":
        $mapCase.className += " map-empty";
      break;
      case "k":
        $mapCase.className += " map-key";
      break;
      case "d":
        $mapCase.className += " map-door";
      break;
      case "h":
        $mapCase.className += " map-hero";
      break;
      case "b":
        $mapCase.className += " map-boss";
      break;
      default:
        console.log('UNKNOWN MAP TYPE ', mapCase);
      break;
    }

    return $mapCase;
  };

  return Map;
};
