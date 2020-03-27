class StartMenuInterface extends InterfaceMenu {

    constructor(){
        super('startmenu');
    }

    create_menu(){
        let data = assets.json.txt.startmenu;
        this.set_title(data.title);
        this.set_text(data.txt);
        this.set_illu(assets.png['illu/legends']);
        this.add_option(data.play, ()=>{game.open('map')});
    
        let info_bar = new InfoBar();
        info_bar.element.appendTo(this.container);
    }
}
