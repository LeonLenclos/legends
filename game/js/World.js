
class World {

    constructor(game){
        this.game = game;
        this.assets = game.assets;
        this.walls = [];
        this.entities = [];
        this.player = undefined;
    }


    setup(){
        let world_data = this.assets.json.world;
        let map_data = this.assets.json.map;

        world_data.entities.forEach((entity_data)=>{
            this.entities.push(new Entity(entity_data, this.game));
        });
        this.hero = this.get_entity('hero');
        this.width = map_data.width;
        this.height = map_data.height;
        for (var i = 0; i < map_data.layers.length; i++) {
            if (map_data.layers[i].name == "walls") {
                this.walls = map_data.layers[i].data;
                break;
            }
        }
    }

    get_entity(id){
        for (var i = 0; i < this.entities.length; i++) {
            if(this.entities[i].id == id){
                return this.entities[i];
            }
        }
    }
    
    get_hero(){
        return this.get_entity('hero')
    }

    move_hero(action) {
        let dest_x = this.hero.x;
        let dest_y = this.hero.y;
        this.hero.set_image('entities/hero/'+action);
        this.hero.direction = action;

        // set destination
        if (action === NORTH) dest_y --;
        else if (action === SOUTH) dest_y ++;
        else if (action === EAST) dest_x ++;
        else if (action === WEST) dest_x --;
        else return;
        // look for an entity at dest and return it
        for(let key in this.entities){
            let entity = this.entities[key]
            if(entity.x == dest_x && entity.y == dest_y && !entity.invisible){
                return entity;
            }
        }
        // look for wall at dest
        if(this.walls[dest_y*this.width+dest_x]>0){
            return;
        }
        // move hero
        this.hero.x = dest_x;
        this.hero.y = dest_y;
    }
}