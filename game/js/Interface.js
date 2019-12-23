class Interface {
    constructor(game, container_id){
        this.game = game;
        this.world = game.world;
        this.assets = game.assets;
        this.container = $('#' + container_id);

    }

    setup(){
        this.on_setup()
        this.on_resize();        
        $(window).resize(()=>this.on_resize())
    }

    on_resize(){
        // Should be overrided
    }
    on_setup(){
        // Should be overrided
    }

    show(){
        this.container.show()
        this.visible = true;
    }
    hide(){
        this.container.hide()
        this.visible = false;

    }
}
