
// TRES INSPIRÉ DE https://hashrocket.com/blog/posts/using-tiled-and-canvas-to-render-game-screens


class MapInterface {

    constructor(game){
        console.log('Init Map Interface');
        this.game = game;

        this.layers = [];

        this.canvas = $('#map').get(0);
        this.container = $('#interface-map');
        this.ctx = this.canvas.getContext("2d");

        this.width = 40;
        this.height = 20;
        this.tile_size = 8
        this.resize_canvas();

        this.load('/script/world.json');

    }

    render(){
        let ctx_cache = this.ctx.canvas.cloneNode().getContext("2d");
        ctx_cache.imageSmoothingEnabled = false;

        this.render_layers(ctx_cache);
        this.render_objects(ctx_cache)

        this.ctx.drawImage(ctx_cache.canvas, 0, 0);
    }

    resize_canvas(){
        this.scale = 1;
        while(this.width*this.tile_size*(this.scale+1) < this.container.innerWidth()
            && this.height*this.tile_size*(this.scale+1) < this.container.innerHeight()){
            this.scale ++;
        }
        this.canvas.width = this.width*this.tile_size*this.scale;
        this.canvas.height = this.height*this.tile_size*this.scale;
    }


 

    render_object(obj, ctx){
        let canvas_x = obj.x * this.tile_size;
        let canvas_y = obj.y * this.tile_size;


        ctx.drawImage(obj.img,
            canvas_x*this.scale, canvas_y*this.scale, obj.img.width*this.scale, obj.img.height*this.scale
        );

    }

    render_objects(ctx){
        let player_rendered = false;
        for (var i = this.game.objects.length - 1; i >= 0; i--) {
            if (!player_rendered && this.game.objects[i].y > this.hero.y) {
                this.render_object(this.game.hero, ctx);
                player_rendered = true;
            }
            this.render_object(this.game.objects[i], ctx)
        }
        if (!player_rendered) {
            this.render_object(this.game.hero, ctx);
        }
    }

    render_tile(tile_idx, x, y, ctx){
        if (!tile_idx) {return;}

        let canvas_x = x * this.tile_size;
        let canvas_y = y * this.tile_size;

        let tile = this.data.tilesets[0];

        let tileset_x = ((tile_idx-1) % (tile.imagewidth / this.tile_size)) * this.tile_size;
        let tileset_y = ~~((tile_idx-1) / (tile.imagewidth / this.tile_size)) * this.tile_size;

        ctx.drawImage(this.tileset,
            tileset_x, tileset_y, this.tile_size, this.tile_size,
            canvas_x*this.scale, canvas_y*this.scale, this.tile_size*this.scale, this.tile_size*this.scale
        );
    }

    render_layer(layer, ctx){
        // call render_tile for each tile
        layer.data.forEach((tile_idx, i)=>{
            let pos_x = (i % layer.width);
            let pos_y = ~~(i / layer.width); 
            this.render_tile(tile_idx, pos_x, pos_y, ctx)
        }, this);
    }

    render_layers(ctx){
        // call render_layer for each layers
        this.data.layers.forEach(
            (layer)=>this.render_layer(layer, ctx),
            this);
    }


    load_tileset(json){
        // Load the tileset then call render_layers
        this.data = json;
        this.tileset = $("<img />", {src:json.tilesets[0].image})[0]
        this.tileset.onload = $.proxy(()=>this.ready=true, this);
    }

    load(url){
        // Load the json map then call load_tileset
        return $.ajax({url:url})
        .done($.proxy(this.load_tileset, this))
        .fail((e)=>console.log(e));
    }
}
