
class World {

    constructor(resources){
        this.resources = resources;
        this.walls = [];
        this.objects = [];
        this.player = undefined;
    }


    setup(){
        let world_data = this.resources.json.world;
        let map_data = this.resources.json.map;

        world_data.objects.forEach((obj_data)=>{
            this.objects.push(new Obj(obj_data, this.resources));
        });
        this.hero = this.get_obj('hero');
        this.width = map_data.width;
        this.height = map_data.height;
        for (var i = 0; i < map_data.layers.length; i++) {
            if (map_data.layers[i].name == "walls") {
                this.walls = map_data.layers[i].data;
                break;
            }
        }
    }

    get_obj(id){
        for (var i = 0; i < this.objects.length; i++) {
            if(this.objects[i].id == id){
                return this.objects[i];
            }
        }
    }
 
    move_hero(action) {
        let dest_x = this.hero.x;
        let dest_y = this.hero.y;
        // set destination
        if (action === NORTH) dest_y --;
        else if (action === SOUTH) dest_y ++;
        else if (action === EAST) dest_x ++;
        else if (action === WEST) dest_x --;
        else return;
        // look for an object at dest and return it
        for(let key in this.objects){
            let obj = this.objects[key]
            if(obj.x == dest_x && obj.y == dest_y){
                return obj;
            }
        }
        // look for wall at dest
        if(this.walls[dest_y*this.width+dest_x]>0){
            return;
        }
        // move hero
        this.hero.x = dest_x;
        this.hero.y = dest_y;
        this.hero.direction = action;
    }
}