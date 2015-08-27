var _ = window._ = require('lodash');

var API = require("./api.js");
var Templates = require('./templates.js')();
var Bacon = require('baconjs');
var map = require('./map.js');

var Game = {};

Game.init = function() {
  Game.createCharacter()
    .flatMapLatest(Game.map)
    .log();
};

Game.createCharacter = function() {
  if(localStorage.player){
    return Bacon.constant(localStorage.player);
  }

  var s_character = API.get("/classes")
    .flatMapLatest(function(classes){
      var $classes = document.querySelector('ul.listeClasse');

      $classes.innerHTML = Templates["classes"]({
        classes: classes
      });

      return Bacon.mergeAll(_.map($classes.querySelectorAll('li[data-id]'), function($elem){
        return Bacon.fromEvent($elem, 'click');
      }));
    })
    .map(function(e){
      return parseInt(e.target.getAttribute('data-id'));
    })
    .toProperty();

  var s_pseudo = Bacon.fromEvent(document.querySelector('.player-pseudo'), 'input').map(function(e){
    var pseudo = e.target.value.trim();
    return pseudo.length > 0 ? pseudo : false;
  });

  var s_player = Bacon.combineTemplate({
    pseudo: s_pseudo,
    classId: s_character
  }).filter(function(obj){
    return obj.pseudo && obj.classId;
  }).flatMapLatest(function(obj){
    return Bacon
      .fromEvent(document.querySelector('.play'), 'click')
      .doAction('.preventDefault')
      .map(obj);
  }).flatMapLatest(function(obj){
    return API.post({
      method: 'POST',
      endpoint: '/players',
      data: obj
    });
  });

  s_player.onValue(function(player){
    localStorage.player = player;
  });

  return s_player;
};

Game.map = function(player){
  map(player).init();
};

window.onload = function(){
  Game.init();
};
