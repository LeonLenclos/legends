// c.f. https://hashrocket.com/blog/posts/using-tiled-and-canvas-to-render-game-screens

class MapInterface extends Interface {

    on_setup(){
        this.layers = [];

        this.canvas = $('#map').get(0);
        this.ctx = this.canvas.getContext("2d");
        this.data = this.assets.json.map
        this.tileset = this.assets.png.tileset;
        this.ready=true;
        this.display_width=MAP_WIDTH;
         this.display_height=MAP_HEIGHT;
    }

    on_resize(){
        this.scale = 1;
        while(this.display_width*TILE_SIZE*(this.scale+1) < this.container.innerWidth()
            && this.display_height*TILE_SIZE*(this.scale+1) < this.container.innerHeight()){
            this.scale ++;
        }
        this.canvas.width = this.display_width*TILE_SIZE*this.scale;
        this.canvas.height = this.display_height*TILE_SIZE*this.scale;
    }

    is_visible(x, y){
        return x >= 0 && x < this.display_width && y >= 0 && y < this.display_height;
    }

    update(turn_moment){
        this.offset_x = - this.world.hero.x + this.display_width/2
        this.offset_y = - this.world.hero.y + this.display_height/2

        let ctx_cache = this.ctx.canvas.cloneNode().getContext("2d");
        ctx_cache.imageSmoothingEnabled = false;
        this.render_layers(ctx_cache);
        this.render_entities(this.world.entities, ctx_cache)
        this.ctx.drawImage(ctx_cache.canvas, 0, 0);
    }


    render_entity(img, x, y, ctx){
        
        let canvas_x = x * TILE_SIZE + TILE_SIZE/2;
        canvas_x -= img.width /2;
        let canvas_y = y * TILE_SIZE + TILE_SIZE/2;
        canvas_y += TILE_SIZE/2 -img.height;


        ctx.drawImage(img,
            canvas_x*this.scale, canvas_y*this.scale,
            img.width*this.scale, img.height*this.scale
        );
    }

    render_entities(entities, ctx){
        entities.sort((a,b)=>a.y-b.y);
        entities.forEach((o)=>{
            let pos_x = o.x + this.offset_x;
            let pos_y = o.y + this.offset_y;
            if(this.is_visible(pos_x, pos_y) && o.img && !o.invisible){
                this.render_entity(o.img, pos_x, pos_y, ctx)
            }
        }, this);
    }

    render_tile(tile_idx, x, y, ctx){
        if (!tile_idx) {return;}

        let canvas_x = x * TILE_SIZE;
        let canvas_y = y * TILE_SIZE;

        let tile = this.data.tilesets[0];

        let tileset_x = ((tile_idx-1) % (tile.imagewidth / TILE_SIZE)) * TILE_SIZE;
        let tileset_y = ~~((tile_idx-1) / (tile.imagewidth / TILE_SIZE)) * TILE_SIZE;

        ctx.drawImage(this.tileset,
            tileset_x, tileset_y, TILE_SIZE, TILE_SIZE,
            canvas_x*this.scale, canvas_y*this.scale, TILE_SIZE*this.scale, TILE_SIZE*this.scale
        );
    }

    render_layer(layer, ctx){
        // call render_tile for each tile
        for (let x = 0-this.offset_x; x < this.display_width-this.offset_x; x++) {
            for (let y = 0-this.offset_y; y < this.display_height-this.offset_y; y++) {
                let i = y*layer.width + x;
                this.render_tile(layer.data[i], x+this.offset_x, y+this.offset_y, ctx)
            }
        }   
    }

    render_layers(ctx){
        // call render_layer for each layers
        this.data.layers.forEach(
            (layer)=> {if(layer.visible){
                this.render_layer(layer, ctx)
        }},this);
    }



}

