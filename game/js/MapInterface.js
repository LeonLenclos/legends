// c.f. https://hashrocket.com/blog/posts/using-tiled-and-canvas-to-render-game-screens

class MapInterface extends Interface {

    on_setup(){
        this.layers = [];

        this.canvas = $('#map').get(0);
        this.ctx = this.canvas.getContext("2d");
        this.data = this.resources.json.map
        this.tileset = this.resources.png.tileset;
        this.ready=true;
    }

    on_resize(){
        this.scale = 1;
        while(MAP_WIDTH*TILE_SIZE*(this.scale+1) < this.container.innerWidth()
            && MAP_HEIGHT*TILE_SIZE*(this.scale+1) < this.container.innerHeight()){
            this.scale ++;
        }
        this.canvas.width = MAP_WIDTH*TILE_SIZE*this.scale;
        this.canvas.height = MAP_HEIGHT*TILE_SIZE*this.scale;
    }

    is_visible(x, y){
        return x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT;
    }

    update(turn_moment){
        this.offset_x = - this.world.hero.x + MAP_WIDTH/2
        this.offset_y = - this.world.hero.y + MAP_HEIGHT/2

        let ctx_cache = this.ctx.canvas.cloneNode().getContext("2d");
        ctx_cache.imageSmoothingEnabled = false;
        this.render_layers(ctx_cache);
        this.render_objects(this.world.objects, ctx_cache)
        this.ctx.drawImage(ctx_cache.canvas, 0, 0);
    }


    render_object(img, x, y, ctx){

        let canvas_x = x * TILE_SIZE + TILE_SIZE/2;
        canvas_x -= img.width /2;
        let canvas_y = y * TILE_SIZE + TILE_SIZE/2;
        canvas_y += TILE_SIZE/2 -img.height;


        ctx.drawImage(img,
            canvas_x*this.scale, canvas_y*this.scale,
            img.width*this.scale, img.height*this.scale
        );
    }

    render_objects(objects, ctx){
        objects.sort((a,b)=>a.y-b.y);
        objects.forEach((o)=>{
            let pos_x = o.x + this.offset_x;
            let pos_y = o.y + this.offset_y;
            if(this.is_visible(pos_x, pos_y)){
                this.render_object(o.img, pos_x, pos_y, ctx)
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

        layer.data.forEach((tile_idx, i)=>{
            let pos_x = (i % layer.width) + this.offset_x;
            let pos_y = ~~(i / layer.width) + this.offset_y;

            if(this.is_visible(pos_x, pos_y)){

                this.render_tile(tile_idx, pos_x, pos_y, ctx)
            }
        }, this);
    }

    render_layers(ctx){
        // call render_layer for each layers
        this.data.layers.forEach(
            (layer)=> {if(layer.visible){
                this.render_layer(layer, ctx)
        }},this);
    }



}

