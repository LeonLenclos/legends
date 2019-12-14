class Interface {
    constructor(world, assets, container_id){
        this.world = world;
        this.assets = assets;
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
    }
    hide(){
        this.container.hide()
    }
}
