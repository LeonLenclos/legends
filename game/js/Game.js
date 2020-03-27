class Game {

    constructor(){
        this.walls = assets.json.map.layers.find(l=>l.name=='walls').data;
        this.entities = assets.json.world.entities.map(data=>new Entity(data))
        this.hero = this.get_entity('hero');
        this.achievments = [];
        this.turn = 0;
        this.interaction_entity = null;
        this.fight_entity = null;

        this.interfaces = {
            'start' : new StartMenuInterface(),
            'gameover' : new StartMenuInterface(),
            //     'inventory' : new InventoryInterface(),
            'map' : new MapInterface(),
            'interaction' : new InteractionInterface(),
            'fight' : new FightInterface(),
        };

        this.status_bar = new StatusBar();
        this.inventory_bar = new InventoryBar();

        this.open('start');

        setInterval(()=>this.update(), 1000/TICK_PER_SEC);
        this.pressed = [];
        $(document).keydown((e)=>{this.onkey(e)});
        $(document).keyup((e)=>{this.onkey(e, true)});
    }

    onkey(ev, keyup) {
        if (ev.key in KEYS) {
            if(keyup) this.pressed = this.pressed.filter(k=>k!=KEYS[ev.key]);
            else if(!this.pressed.includes(KEYS[ev.key])){
                this.pressed.unshift(KEYS[ev.key]);
                this.get_interface().input(KEYS[ev.key]);
            }
            ev.preventDefault();
        }
    }

    update() {
        this.get_interface().input(this.pressed[0]);
        this.get_interface().update();

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
        this.hero.set_image('entities/hero/'+move_to_direction(x, y))

        if(this.entity_at(dest_x, dest_y)){
            this.interact(this.entity_at(dest_x, dest_y));
        }
        else if (!this.wall_at(dest_x, dest_y)){
            this.turn ++;
            this.hero.set_image('entities/hero/walk/'+this.turn%2+'/'+move_to_direction(x, y))
            setTimeout(()=>{this.hero.set_image('entities/hero/'+move_to_direction(x, y))}, 1000/TURN_PER_SEC)
            this.hero.x = dest_x;
            this.hero.y = dest_y;
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



/***************************************
****************************************
****************************************
****************************************
****************************************
****************************************
****************************************
****************************************
***************************************/


class Game_ {

    constructor(){
        this.assets = new Assets(()=>{this.setup()});
        this.world = new World(this);
        this.map_interface = new MapInterface(this, 'interface-map');
        this.interaction_interface = new InteractionInterface(this, 'interface-interaction');
        this.status_bar_interface = new StatusBarInterface(this, 'status-bar');
    }

    on_interaction_turn_fight(entity){
        let hero = this.world.hero;

        let txt = "";
        if (!hero.next_attack) {
            hero.start_fight();
            entity.start_fight();
            txt = this.assets.json.txt.fight.start;
        }

        else {
            txt += hero.execute_attack(entity);
            txt += '<br/>' 
            txt += entity.execute_attack(hero) || "";
        }

        let title = sprintf(this.assets.json.txt.fight.title,{target:entity.title, pv:entity.pv});

        let actions = [];

        if(hero.dead){
            actions.push({"txt":"Ok.", "do":["GAMEOVER"]});
        }
        else if(entity.dead){
            actions.push({"txt":"Ok.", "do":["GOTO dead"]});
            hero.stop_fight();
        }
        else if(hero.flee){
            actions.push({"txt":"Ok.", "do":["EXIT"]});
            hero.stop_fight();
        }
        else {
            hero.attacks.forEach((a)=>{
                if(a.do.every((c)=>doable_command(this, entity, c))){actions.push(a)}
            })                
        }

        return {
            title: title,
            txt: txt,
            actions: actions
        };

    }

    on_interaction_turn_normal(entity){
        let moment = entity.read_script();
        // Do auto actions
        if(moment.auto_actions){
            console.log('AUTO ACTIONS');
           moment.auto_actions.forEach((a)=>{this.on_action(a, entity)});
        }
        return entity.read_script();

    }

    on_interaction_turn(entity){
        if(!this.interaction_interface.visible) return;
        let moment;

        if(this.game_is_over){
            moment = this.on_interaction_turn_gameover(entity);
        }
        else if(entity.fighting){
            moment = this.on_interaction_turn_fight(entity);
        }
        else {
            moment = this.on_interaction_turn_normal(entity);
        }
        // Update interface
        this.interaction_interface.update(moment);
        this.status_bar_interface.update();
    }


}
