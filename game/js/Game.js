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

    on_interaction_turn(entity){
        let moment;
        if(entity.fighting){
            let hero = this.world.get_hero();


            let story = this.assets.json.txt.fight;
            let txt = "";

            if (!hero.next_attack) {
                txt = story.start;
            }
            else {
                let target_damage, damage
                entity.choose_attack();
                damage = hero.execute_attack(entity);
                if(entity.pv == 0) entity.dead = true;
                else {
                    target_damage = entity.execute_attack(hero);
                    if(hero.pv == 0) hero.dead = true;
                }

                let fight = {
                    target: entity.title,
                    attack: hero.next_attack.txt,
                    damage: damage,
                    target_attack: entity.next_attack.txt,
                    target_damage: target_damage,
                };
                txt += damage ? story.hero_success : story.hero_fail;
                txt += '<br/>' 
                txt += target_damage ? story.enemy_success : story.enemy_fail;
                if(entity.dead){
                    txt+= '<br/>' + story.enemy_dead;
                }
                if(hero.dead){
                    txt+= '<br/>' + story.hero_dead;
                }
                txt = sprintf(txt, fight)
            }

            let title = sprintf(story.title,{target:entity.title, pv:entity.pv});

            let actions = []

            if(hero.dead){
                actions.push({
                    "txt":"Ok.",
                    "do":["GAMEOVER"]
                });
                hero.fighting = false;
                hero.next_attack = undefined;
                entity.fighting = false;
                entity.next_attack = undefined;

            }
            else if(hero.flee || entity.dead){
                actions.push({
                    "txt":"Ok.",
                    "do":["EXIT"]
                });
                hero.flee = 0;
                hero.fighting = false;
                hero.next_attack = undefined;
                entity.fighting = false;
                entity.next_attack = undefined;
            }
            else {
                hero.attacks.forEach((a)=>{
                    if(a.do.every((c)=>doable_command(this, entity, c))){
                        actions.push(a);
                    }
                })                
            }

            moment = {
                title: title,
                txt: txt,
                actions: actions
            };
        }
        else {
            moment = entity.read_script();
            // Do auto actions
            if(moment.auto_actions){
                console.log('AUTO ACTIONS');
               moment.auto_actions.forEach((a)=>{this.on_action(a, entity)});
            }
            moment = entity.read_script();

        }
        // Update interface
        this.interaction_interface.update(moment);
        this.status_bar_interface.update();
    }

    game_over(){
        console.log("game_over")
        this.map_interface.hide();
        this.interaction_interface.show();
        clearInterval(this.tick_interval);
        this.interaction_interface.update({
            title:'Game over..',
            txt:'Vous avez perdu !',
            actions:[]
        });
    }
    on_action(action, entity){
        if(entity.fighting){
            this.world.get_hero().next_attack=action;
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
