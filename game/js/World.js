
// class World {

//     constructor(){
//         this.walls = assets.json.map.layers.find(l=>l.name == 'walls').data;
//         this.entities = assets.json.world.entities.map(data=>new Entity(data))
//         this.hero = this.get_entity('hero')
//     }

//     get_entity(id){
//         return this.entities.find(e=>e.id == id);
//     }
    
//     move_hero(x, y) {
//         let dest_x = this.hero.x + x;
//         let dest_y = this.hero.y + y;

//         if(this.entity_at(x,y)){
//             game.interaction = this.entity_at(x,y);
//             game.open('interaction');
//         }
//         else if (!this.wall_at(x,y)){
//             this.hero.x = dest_x;
//             this.hero.y = dest_y;
//         }
//     }

//     entity_at(x,y){
//         let e = this.entities.find((e)=>e.x==x && e.y==y)
//         return e.invisible ? null : e;
//     }

//     wall_at(x,y){
//         return this.walls[pos_to_index(dest_x, dest_y, assets.json.map.width)];
//     }
// }