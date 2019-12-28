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
            this.illu = this.assets.png[illu];
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
    }

    choose_attack(){
        if(this.pv > 0){
            this.next_attack = this.attacks[random(0,this.attacks.length-1)]
        }
        else this.next_attack = undefined;
    }

    execute_attack(target){
        let damage = 0
        if(this.next_attack && Math.random()<this.next_attack.prob){
            damage = random(this.next_attack.damage_min,  this.next_attack.damage_max);
        }
        target.pv = damage<target.pv ? target.pv-damage : 0;
        return damage;
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

