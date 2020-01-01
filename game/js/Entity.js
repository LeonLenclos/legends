class Entity {

    constructor(data, game){
        // Position and direction of the Hero in the map
        this.game = game;
        this.world = game.world;
        this.assets = game.assets;

        let extra_data = this.assets.json[data.extra_data];
        for(let attr in extra_data){
            this[attr] = extra_data[attr];
        }
        for(let attr in data){
            this[attr] = data[attr];
        }
        this.set_image(this.img)
        this.set_illu(this.illu)

        if(this.script){
            for(let moment in this.script){
                this.script[moment].txt = new ScriptText(this.script[moment].txt)
                this.script[moment].actions.forEach((action, i, a)=>{
                    a[i].txt = new ScriptText(a[i].txt)
                })
            }
        }
    }

    set_image(img){
        if(img){
            this.img = this.assets.png[img];
        } else {
            this.img = undefined;
        }
    }

    set_illu(illu){
        if(illu){
            this.illu = [
                this.assets.png[illu+1],
                this.assets.png[illu+2],
            ];
        } else {
            this.illu = undefined;
        }
    }

    get_interaction_state(){
        return this.interaction_state || 'start';
    }


    start_fight(target){
        this.fighting = true;
        this.next_attack = undefined;
        this.flee = false;
    }

    stop_fight(target){
        this.fighting = false;
        this.next_attack = undefined;
        this.flee = false;
    }

    choose_attack(){
        this.next_attack = this.attacks[random(0,this.attacks.length)]
    }

    execute_attack(target){
        this.target = target;
        if(this.dead) return;
        if(!this.next_attack) this.choose_attack();
        for (var i = 0; i < this.next_attack.effect.length; i++) {
            let effect = this.next_attack.effect[i]
            let dice = Math.random() 
            if (dice < effect.prob) {
                effect.do.forEach((c)=>do_command(this.game, this, c))
                this.next_attack = undefined;
                return effect.txt;
            }
        }
    }

    kill(){
        this.pv = 0;
        this.dead = true;
        this.fighting = false;
    }

    read_script(){
        let state = this.get_interaction_state();
        return {
            title : this.title,
            illu : this.illu,
            auto_actions : this.script[state].auto_actions,
            txt : this.script[state].txt,
            actions : this.script[state].actions,
        }
    }
}



class ScriptText {
    constructor(txt){

        if(Array.isArray(txt)){
            this.values = txt;
        }
        else if(txt instanceof ScriptText){
            this.values = txt.values;
        }
        else{
            this.values = [txt];
        }
        this.currentIndex = -1;

    }

    read(){
        this.currentIndex ++;
        return this.values[this.currentIndex%this.values.length];
    }
}

