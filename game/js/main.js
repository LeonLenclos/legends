/**********************************************************************
LEGENDS ENGINE : main.js
This file loads assets then creates game
**********************************************************************/

"use strict";
$.ajaxSetup({cache: false});

let assets, game;

$(()=>{
    assets = new Assets(()=>{
        game = new Game();
    });
});
