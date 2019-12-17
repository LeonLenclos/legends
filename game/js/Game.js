class Game {

    constructor(){
        this.assets = new Assets(()=>{this.setup()});
        this.world = new World(this.assets);
        this.map_interface = new MapInterface(this, 'interface-map');
        this.interaction_interface = new InteractionInterface(this, 'interface-interaction');
        this.status_bar_interface = new StatusBarInterface(this, 'status-bar');
    }

    setup(){
        this.world.setup();
        this.map_interface.setup();
        this.interaction_interface.setup();
        this.status_bar_interface.setup();
        this.setup_keys();
        this.open_map();
    }

    setup_keys(){
        this.input = {};
        for(let k in KEYS) this.input[KEYS[k]] = false;
        $(document).keydown((e)=>{this.onkey(e, true)});
        $(document).keyup((e)=>{this.onkey(e, false)});
    }

    onkey(ev, pressed) {
        if (ev.key in KEYS){
            this.input[KEYS[ev.key]] = pressed
            ev.preventDefault();
        }
    }

    on_tick(){

        let now = Date.now();
        this.action = undefined;
        for(let act in this.input){
            if (this.input[act]) this.last_input_action = this.action = Number(act);
        }
        if(now - this.last_turn > 1000 / TURN_PER_SEC){
            this.last_turn = now;
            if (this.action === undefined && this.last_action_played !== this.last_input_action){
                this.action = this.last_input_action;
            }
            this.on_turn(this.action);
            this.last_action_played = this.action;
            this.last_input_action = undefined;
        }
        this.map_interface.update();
    }

    on_turn(action){
        
        if([NORTH,EAST,SOUTH,WEST].includes(action)){
            let hero_move_on = this.world.move_hero(action);
            if(hero_move_on){
                this.open_interaction(hero_move_on);
            }
        }
        this.status_bar_interface.update();
    }

    open_interaction(entity){
        this.map_interface.hide();
        this.interaction_interface.show();
        clearInterval(this.tick_interval);
        this.interaction_interface.open_interaction(entity, (todos)=>this.on_action(todos, entity));
    }

    open_map(){
        this.map_interface.show();
        this.interaction_interface.hide();
        this.tick_interval = setInterval(()=>this.on_tick(), 1000/TICK_PER_SEC);
        this.last_turn = Date.now();
    }

    on_action(todos, entity){
        let exit = false;
        todos.forEach((todo)=>{
            if(todo.startsWith('EXIT')){
                exit=true;
            }
            do_command(this, entity, todo)
        })
        if(!exit) this.interaction_interface.update();
        this.status_bar_interface.update();
    }
}
