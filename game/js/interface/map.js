// c.f. https://hashrocket.com/blog/posts/using-tiled-and-canvas-to-render-game-screens

class MapInterface extends Interface {

    constructor(){
        super('map');

        this.map_canvas = new MapCanvas();
        this.map_canvas.resize(960,480);

        this.mouse_is_down = false;
        this.mouse_x = 0;
        this.mouse_y = 0;
    }

    create_content(){
        this.map_canvas.element.appendTo(this.container);
        this.map_canvas.element.mousemove((e)=>{
            // let rect = this.map_canvas.element.getBoundingClientRect();
            this.mouse_x=e.clientX - this.map_canvas.element.offset().left;
            this.mouse_y=e.clientY - this.map_canvas.element.offset().top;
        });
        this.map_canvas.element.mousedown(()=>this.mouse_is_down = true);
        $(document).mouseup(()=>this.mouse_is_down = false)
        $(document).mouseout(()=>this.mouse_is_down = false);

        game.inventory_bar.element.appendTo(this.container);
        game.status_bar.element.appendTo(this.container);
    }

    update_content(){
        if(this.mouse_is_down){
            this.input(pos_to_direction(this.mouse_x, this.mouse_y, this.map_canvas.ctx.canvas.width, this.map_canvas.ctx.canvas.height));
        }

        let hero_image = 'entities/hero/'
        if(game.hero.superman) hero_image += 'superman/';
        else if (game.hero.walking) hero_image += 'walk/'+game.turn%2+'/';
        hero_image += game.hero.direction;
        game.hero.set_image(hero_image);

        this.map_canvas.render()

        game.inventory_bar.update();
        game.status_bar.update();
    }

    on_ok(){
        game.open('stories');
    }

    on_up(){
        game.move_hero(0, -1)
    }

    on_down(){
        game.move_hero(0, 1)
    }

    on_left(){
        game.move_hero(-1, 0)
    }

    on_right(){
        game.move_hero(1, 0)
    }
}


class MapCanvas {

    constructor(){
        this.element = $('<canvas>', {id:'map_canvas'});
        this.ctx = this.element[0].getContext("2d");
    
    }

    resize(max_width, max_height){
        let scale = calculate_max_scale(VIEW_PX_WIDTH, VIEW_PX_HEIGHT,max_width, max_height);
        this.ctx.canvas.width = VIEW_PX_WIDTH*scale;
        this.ctx.canvas.height = VIEW_PX_HEIGHT*scale;
        this.ctx.imageSmoothingEnabled = false;        
    }

    render(){
        this.offset_x = - game.hero.x + VIEW_TILE_WIDTH/2
        this.offset_y = - game.hero.y + VIEW_TILE_HEIGHT/2

        let ctx_cache = $('<canvas>', {width:VIEW_PX_WIDTH, height:VIEW_PX_HEIGHT})[0].getContext("2d");
        this.render_layers(ctx_cache);
        this.render_entities(ctx_cache)

        this.ctx.drawImage(ctx_cache.canvas, 0, 0,this.ctx.canvas.width, this.ctx.canvas.height);
    }

    render_entities(ctx){
        game.entities.sort((a,b)=>a.y-b.y).forEach((e)=>{
            let x = e.x + this.offset_x;
            let y = e.y + this.offset_y;
            if(pos_is_in_rect(x, y, VIEW_TILE_WIDTH, VIEW_TILE_HEIGHT)
                && e.img && !e.invisible){
                this.render_entity(e.img, x, y, ctx)
            }
        }, this);
    }

    render_entity(img, x, y, ctx){
        
        let canvas_x = x*TILE_SIZE + (TILE_SIZE-img.width)/2;
        let canvas_y = (y+1)*TILE_SIZE - img.height;


        ctx.drawImage(img, canvas_x, canvas_y);
    }

    render_layers(ctx){
        assets.json.map.layers.forEach((layer)=> {
            if(layer.visible){
                this.render_layer(layer, ctx);
            }
        }, this);
    }

    render_layer(layer, ctx){
        for (let x=0; x<VIEW_TILE_WIDTH; x++){
            for (let y=0; y<VIEW_TILE_HEIGHT; y++){
                let i = pos_to_index(x-this.offset_x, y-this.offset_y, layer.width);
                if(layer.data[i]){
                    this.render_tile(layer.data[i], x, y, ctx);
                }
            }
        }   
    }

    render_tile(tile_idx, x, y, ctx){
        let ts_width = assets.json.map.tilesets[0].imagewidth;
        let ts_x = ((tile_idx-1) % (ts_width/TILE_SIZE)) * TILE_SIZE;
        let ts_y = ~~((tile_idx-1) / (ts_width/TILE_SIZE)) * TILE_SIZE;

        ctx.drawImage(assets.png.tileset, ts_x, ts_y, TILE_SIZE, TILE_SIZE, x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
}