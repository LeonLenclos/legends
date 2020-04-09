
class MapEditorInterface extends MapCanvas {

    on_setup(){
        this.layers = [];

        this.data = this.assets.json.map
        this.tileset = this.assets.png.tileset;
        this.ready=true;
        this.display_width=this.data.layers[0].width
        this.display_height = this.data.layers[0].height
        this.map_ctx;
        this.resize(1);
        $('#map').click((e)=>{this.on_click(e)});

        this.selected_x = 0;
        this.selected_y=0;
        // $('#map').addEventListener("mousedown", clicked, false);
    }

    setup(){
        return
    }

    show(){
        this.render();
    }
    on_resize(){
        return;
    }

    on_click(e){
        let s = TILE_SIZE*this.scale;
        console.log('s', s)
        console.log('map x', e.pageX-$("#map").offset().left)
        let x = Math.floor((e.pageX-$("#map").offset().left)/s);
        let y = Math.floor((e.pageY-$("#map").offset().top)/s);
        console.log('x',x)
        this.on_select(x,y);
    }

    select(x,y){
        this.selected_x = x;
        this.selected_y = y;
        this.update();


    }
    resize(scale){
        this.ctx.canvas.width = VIEW_PX_WIDTH*scale;
        this.ctx.canvas.height = VIEW_PX_HEIGHT*scale;
        this.ctx.imageSmoothingEnabled = false;        
    }

    is_visible(x, y){
        return true;
    }

    update(entities){
        this.offset_x = 0
        this.offset_y = 0
        let ctx_cache = this.ctx.canvas.cloneNode().getContext("2d");
        ctx_cache.imageSmoothingEnabled = false;

        if(!this.map_ctx){
            this.map_ctx = this.ctx.canvas.cloneNode().getContext("2d");
            this.render_layers(this.map_ctx);
        }
        ctx_cache.drawImage(this.map_ctx.canvas, 0, 0, this.element.width, this.element.height);

        this.render_entities(entities, ctx_cache)
        ctx_cache.strokeStyle = "red";
        let s = TILE_SIZE*this.scale;

        ctx_cache.rect(this.selected_x*s, this.selected_y*s, s, s);
        ctx_cache.stroke(); 

        this.ctx.drawImage(ctx_cache.canvas, 0, 0);
    }
}

