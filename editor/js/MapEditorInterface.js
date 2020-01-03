
class MapEditorInterface extends MapInterface {

    on_setup(){
        this.layers = [];

        this.canvas = $('#map').get(0);
        this.ctx = this.canvas.getContext("2d");
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

    on_resize(){
        return;
    }

    on_click(e){
        let s = TILE_SIZE*this.scale;
        let x = Math.floor((e.pageX-$("#map").offset().left) / s);
        let y = Math.floor((e.pageY-$("#map").offset().top) / s);
        this.on_select(x,y);
    }

    select(x,y){
        this.selected_x = x;
        this.selected_y = y;
        this.update();


    }
    resize(scale){
        this.scale = scale;
        this.on_resize();
        this.canvas.width = this.display_width*TILE_SIZE*this.scale;
        this.canvas.height = this.display_height*TILE_SIZE*this.scale;
        this.update();


    }
    is_visible(x, y){
        return true;
    }

    update(turn_moment){
        this.offset_x = 0
        this.offset_y = 0
        let ctx_cache = this.ctx.canvas.cloneNode().getContext("2d");
        ctx_cache.imageSmoothingEnabled = false;

        if(!this.map_ctx){
            this.map_ctx = this.ctx.canvas.cloneNode().getContext("2d");
            this.render_layers(this.map_ctx);
        }
        ctx_cache.drawImage(this.map_ctx.canvas, 0, 0, this.canvas.width, this.canvas.height);

        this.render_entities(this.world.entities, ctx_cache)
        ctx_cache.strokeStyle = "red";
        let s = TILE_SIZE*this.scale;

        ctx_cache.rect(this.selected_x*s, this.selected_y*s, s, s);
        ctx_cache.stroke(); 

        this.ctx.drawImage(ctx_cache.canvas, 0, 0);
    }
}

