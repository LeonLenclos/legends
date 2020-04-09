/**********************************************************************
LEGENDS ENGINE : interface/start.js
This file defines the start menu interface
**********************************************************************/


class StartMenuInterface extends InterfaceMenu {

    constructor(){
        super('startmenu');
    }

    create_menu(){
        let data = assets.json.txt.startmenu;
        this.set_title(data.title);
        this.set_text(data.txt);
        this.set_illu(assets.png['illu/legends']);
        this.add_option(data.play, ()=>{
            game.new_game();
            console.log('new_game')
        });
        if(ALLOW_DEV_MODE){
            this.add_option(data.devmode, ()=>{
                game.new_game();
                game.devmode = true;
                $('body').append(game.devbox.element);
            });
        }
    
        let info_bar = new InfoBar();
        info_bar.element.appendTo(this.container);
    }
}
