let debug
"use strict";
$.ajaxSetup({cache: false});
$(document).ready(()=>{
    game = new Game();
    debug = (c)=>{game.debug(c)};
});
