class Game {

    constructor(){
        this.assets = new Assets(()=>{this.setup()});
        this.world = new World(this);
        this.map_interface = new MapInterface(this, 'interface-map');
        this.interaction_interface = new InteractionInterface(this, 'interface-interaction');
        this.status_bar_interface = new StatusBarInterface(this, 'status-bar');
    }

    debug(command){
        let hero = this.world.get_entity('hero');
        if(command){
            this.on_action([command], hero);
        }
        else{
            console.log('DEBUG !');
            console.log('-------');
            console.log('The hero : ', hero);
            console.log('The world : ', this.world)
            console.log('type `debug("COMMAND")` to run a command (default entity is the hero)')    
        }
        
    }
    setup(){
        console.log('ASSETS LOADED !')

        this.world.setup();
        this.map_interface.setup();
        this.interaction_interface.setup();
        this.status_bar_interface.setup();
        this.setup_keys();
        this.open_map();
    }

    setup_keys(){
        this.input = {};
        for(let k in MAP_KEYS) this.input[MAP_KEYS[k]] = false;
        $(document).keydown((e)=>{this.onkey(e, true)});
        $(document).keyup((e)=>{this.onkey(e, false)});
    }

    onkey(ev, pressed) {
        if (ev.key in MAP_KEYS){
            this.input[MAP_KEYS[ev.key]] = pressed
            ev.preventDefault();
        }
            if(this.interaction_interface.visible && pressed){
            if(INTERACTION_KEYS[ev.key] == NEXT){
                this.interaction_interface.on_next();
            } else if(INTERACTION_KEYS[ev.key] == PREV){
                this.interaction_interface.on_prev();
            } else if(INTERACTION_KEYS[ev.key] == SUBMIT){
                this.interaction_interface.on_submit();
            }
       }
    }

    on_tick(){

        let now = Date.now();
        let turn_moment = (now-this.last_turn)/(1000/TURN_PER_SEC)
        this.action = undefined;
        for(let act in this.input){
            if (this.input[act]) this.last_input_action = this.action = Number(act);
        }
        if(turn_moment>1){
            this.last_turn = now;
            if (this.action === undefined && this.last_action_played !== this.last_input_action){
                this.action = this.last_input_action;
            }
            this.on_turn(this.action);
            this.last_action_played = this.action;
            this.last_input_action = undefined;
        }
        this.map_interface.update(turn_moment);
        // console.log(Date.now()-now);
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
                console.log('OPEN INTERACTION');

        this.map_interface.hide();
        this.interaction_interface.show();
        clearInterval(this.tick_interval);
        this.interaction_interface.open_interaction(entity, (action)=>{
            console.log('ACTIONS');
            this.on_action(action, entity);
            this.on_interaction_turn(entity);
        });
        this.on_interaction_turn(entity);
    }

    open_map(){
        this.map_interface.show();
        this.interaction_interface.hide();
        this.tick_interval = setInterval(()=>this.on_tick(), 1000/TICK_PER_SEC);
        this.last_turn = Date.now();
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

    on_interaction_turn_gameover(entity){
        return {
                title:'Game over..',
                txt:'Vous avez perdu !',
                actions:[]
            }
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

    game_over(){
        this.game_is_over = true;
        console.log("game_over")
        this.map_interface.hide();
        this.interaction_interface.show();
        clearInterval(this.tick_interval);
    }
    on_action(action, entity){
        console.log('action:', action);
        if(this.world.hero.fighting){
            this.world.hero.next_attack=action;
        }
        let exit = false;
        if(action.do.every((c)=>doable_command(this, entity, c))){
            console.log('doable : TRUE')
            action.do.forEach((todo)=>{
                // if(todo.startsWith('EXIT')) this.open_map;
                do_command(this, entity, todo);
            });
        }
        else console.log('doable : FALSE')
    }
}
