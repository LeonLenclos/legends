/**********************************************************************
LEGENDS ENGINE : Game.js
This file defines Game, the main object of the engine
**********************************************************************/


class Game {
    constructor(){
        console.log('game', game)
        
        // Interface
        this.interfaces = {
            'start' : new StartMenuInterface(),
            'gameover' : new StartMenuInterface(),
            'stories' : new StoriesInterface(),
            'map' : new MapInterface(),
            'interaction' : new InteractionInterface(),
            'fight' : new FightInterface(),
        };
        this.status_bar = new StatusBar();
        this.inventory_bar = new InventoryBar();
        this.devbox = new DevBox();

        // Handle keys
        this.pressed = [];
        $(document).keydown((e)=>{this.onkey(e)});
        $(document).keyup((e)=>{this.onkey(e, true)});

        // Start
        this.open('start');
        this.turn_duration = 1000/TURN_PER_SEC;
        setInterval(()=>this.update(), 1000/TICK_PER_SEC);
    }

    new_game(){
        console.log('NEW GAME');
        this.walls = assets.json.map.layers.find(l=>l.name=='walls').data;
        this.entities = assets.json.world.entities.map(data=>new Entity(data));
        this.hero = this.get_entity('hero');
        console.log(this.hero)
        this.stories = [];
        this.turn = 0;
        this.interaction_entity = null;
        this.fight_entity = null;

        this.open('map');        
    }

    onkey(ev, keyup) {
        if (this.pause) return;
        if (ev.key in KEYS) {
            if(keyup) this.pressed = this.pressed.filter(k=>k!=KEYS[ev.key]);
            else if(!this.pressed.includes(KEYS[ev.key])){
                this.pressed.unshift(KEYS[ev.key]);
            }
            ev.preventDefault();
        }
    }

    request_turn(){
        if(this.busy || this.pause) return false;

        this.busy=true;
        setTimeout(()=>{this.busy=false}, this.turn_duration);
        return true;
    }

    update() {
        if(this.pause) return false;

        if(this.pressed[0]){
            this.get_interface().input(this.pressed[0]);
        }
        this.get_interface().update();

        if(this.devmode) this.devbox.update();
    }

    get_entity(id){
        return this.entities.find(e=>e.id == id);
    }

    entity_at(x,y){
        let e = this.entities.find((e)=>e.x==x && e.y==y)
        return (e && !e.invisible) ? e : null;
    }

    wall_at(x,y){
        return this.walls[pos_to_index(x, y, assets.json.map.width)];
    }

    get_interface(){
        return this.interfaces[this.active_interface];
    }
    
    open(interface_id){
        this.active_interface = interface_id;
        this.get_interface().create();
    }

    move_hero(x, y) {
        let dest_x = this.hero.x + x;
        let dest_y = this.hero.y + y;
        this.hero.direction = move_to_direction(x, y);

        if(this.entity_at(dest_x, dest_y)){
            this.interact(this.entity_at(dest_x, dest_y));
        }

        else if (!this.wall_at(dest_x, dest_y) || game.hero.superman){
            this.turn ++;
            this.hero.x = dest_x;
            this.hero.y = dest_y;
            this.hero.walking = true;
            window.setTimeout(()=>this.hero.walking=false, this.turn_duration);
        }
    }

    interact(entity){
        this.turn ++;

        if(entity){
            this.interaction_entity = entity;
        }

        if(this.interaction_entity && this.interaction_entity.read_script().auto_actions){
            this.interaction_entity.read_script().auto_actions.forEach(
                (a)=>do_commands(this.interaction_entity, a.do));
        }

        if(this.fight_entity){
            this.open('fight');
        }else if(this.hero.dead){
            this.open('gameover');
        }else if(this.interaction_entity){
            this.open('interaction');
        }else{
            this.open('map')
        }
    }
}
