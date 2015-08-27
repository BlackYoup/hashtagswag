var Templates = require('./templates.js')();
var API = require('./api.js');
var Bacon = require('baconjs');

module.exports = function(player){
  var Map = {};

  Map.init = function(){
    var s_map = API.get('/map')
      .map(Map.drawMap)
      .toProperty();

    var b_userPos = new Bacon.Bus();
    var s_userPos = b_userPos.toProperty();

    s_userPos.onValue(function(){
      // Don't let it to be lazy
    });

    b_userPos.plug(Map.getPlayerPosition(player));

    Bacon.combineTemplate({
      map: s_map,
      position: s_userPos.first()
    }).onValue(Map.spawnPlayer);

    var s_move = s_map
      .flatMapLatest(Map.listenEvents.bind(null, s_userPos))
      .log();

    Bacon.combineTemplate({
      position: s_move,
      map: s_map
    }).onValue(Map.movePlayer);

    s_move.flatMapLatest(Map.apiMove);

    b_userPos.plug(s_move);
  };

  Map.drawMap = function(map){
    var $content = document.querySelector('.content').innerHTML = Templates["map"]();
    var $map = document.querySelector('.mapContener');

    return map.reduce(function($mapHTML, line, x){
      $mapHTML.appendChild(Map.drawLine(line, x));
      return $mapHTML;
    }, $map);
  };

  Map.drawLine = function(line, x){
    var $line = document.createElement('div');
    $line.className += " map-line";
    $line.setAttribute('data-x', x);

    return line.reduce(function($mapHTML, mapCase, y){
      $mapHTML.appendChild(Map.drawCase(mapCase, x, y));
      return $mapHTML;
    }, $line);
  };

  Map.drawCase = function(mapCase, x, y){
    var $mapCase = document.createElement('div');
    $mapCase.className += 'map-case';
    $mapCase.setAttribute('data-x', x);
    $mapCase.setAttribute('data-y', y);

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
        $mapCase.className += " map-player";
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

  Map.getPlayerPosition = function(player){
    return API.get({
      method: 'GET',
      endpoint: '/position',
      qs: {
        playerId: player.id
      }
    });
  };

  Map.spawnPlayer = function(obj){
    return Map.movePlayer(obj);
  };

  Map.listenEvents = function(s_position, $map){
    var s_moveClick = Bacon.mergeAll(_.map($map.querySelectorAll('div[data-x][data-y]'), function($elem){
      return Bacon.fromEvent($elem, 'click');
    })).map(function(e){
      return {
        player_x: parseInt(e.target.getAttribute('data-x')),
        player_y: parseInt(e.target.getAttribute('data-y'))
      };
    });

    var s_moveKeyboard = Bacon.fromEvent(document, 'keypress')
      .map('.keyCode')
      .filter(function(k){
        return k >= 37 && k <= 40;
      })
      .flatMapLatest(function(k){
        return s_position.first().map(function(k, position){
          var x = position.player_x;
          var y = position.player_y;

          if(k === 39){
            y += 1;
          } else if(k === 37){
            y -= 1;
          } else if(k === 38){
            x -= 1;
          } else if(k === 40){
            x += 1;
          }

          return {
            player_x: x,
            player_y: y
          };
        }.bind(null, k));
      });

    return Bacon.mergeAll(s_moveClick, s_moveKeyboard);
  };

  Map.movePlayer = function(obj){
    var $map = obj.map;
    var pos = obj.position;

    var $players = $map.querySelectorAll('div.map-player');

    _.each($players, function($player){
      $player.className = $player.className.replace(/map-player/, "");
    });

    var $playerPos = $map.querySelector('div[data-x="' + pos.player_x + '"][data-y="' + pos.player_y + '"]');
    $playerPos.className += " map-player";
  };

  return Map;
};
