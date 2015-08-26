'use strict';

var _ = window._ = require('lodash');

let API = require("./api.js");
let Templates = require('./templates.js')();
let Bacon = require('baconjs');

let Game = {};

Game.init = () => {
  Game.createCharacter()
    .flatMapLatest(Game.map)
    .log();
};

Game.createCharacter = () => {
  if(localStorage.player){
    return Bacon.constant(localStorage.player);
  }

  let s_character = API.get("/classes")
    .flatMapLatest(classes => {
      let $classes = document.querySelector('ul.listeClasse');

      $classes.innerHTML = Templates["classes"]({
        classes: classes
      });

      return Bacon.mergeAll(
        _.map(
          $classes.querySelectorAll('li[data-id]'), $elem => Bacon.fromEvent($elem, 'click')
        )
      );
    })
    .map(e => {
      return parseInt(e.target.getAttribute('data-id'));
    })
    .toProperty();

  let s_pseudo = Bacon.fromEvent(document.querySelector('.player-pseudo'), 'input').log().map(e => {
    let pseudo = e.target.value.trim();
    return pseudo.length > 0 ? pseudo : false;
  });

  let s_player = Bacon.combineTemplate({
    pseudo: s_pseudo,
    classId: s_character
  }).log().filter(obj => {
    return obj.pseudo && obj.classId;
  }).flatMapLatest(obj => {
    return Bacon
      .fromEvent(document.querySelector('.play'), 'click')
      .doAction('.preventDefault')
      .map(obj);
  }).flatMapLatest(obj => {
    return API.post({
      method: 'POST',
      endpoint: '/players',
      data: obj
    });
  });

  s_player.onValue(player => {
    localStorage.player = player;
  });

  return s_player;
};

Game.map = (player) => {
  let s_map = API.get('/map').log();
};

window.onload = () => {
  Game.init();
};
