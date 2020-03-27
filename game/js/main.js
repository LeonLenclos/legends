"use strict";
$.ajaxSetup({cache: false});

let assets, game;

$(()=>{
    assets = new Assets(()=>{
        game = new Game();
    });
});
