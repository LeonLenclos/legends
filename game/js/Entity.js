class Entity {

    constructor(data){
        
        Object.assign(this, assets.json[data.extra_data], data)
        this.native_data = data;
        this.native_extra_data = data.extra_data;
        this.set_image(this.img)
        this.set_illu(this.illu)
        this.pv_max = this.pv_max || this.pv;

        if(this.script){
            for(let moment in this.script){
                this.script[moment].txt = new ScriptText(this.script[moment].txt)
                this.script[moment].actions.map(action=>{
                    Object.assign(action, {txt:new ScriptText(action.txt)})
                });
            }
        }
    }

    set_image(img){
        if(img){
            this.img = assets.png[img];
        } else {
            this.img = undefined;
        }
    }

    set_illu(illu){
        if(illu){
            this.illu = assets.png[illu]
        } else {
            this.illu = undefined;
        }
    }

    set_pv(v){
        this.pv = constrain(this.pv+v, 0, this.pv_max);
        if(this.pv==0){
            this.interaction_state = 'dead';
            this.dead = true;
        }
    }

    get_interaction_state(){
        return this.interaction_state || 'start';
    }


    fight(target, attack){
        attack = attack || this.random_attack();
        let effect = this.random_effect(attack);
        this.last_effect = effect;
        do_commands(target, effect.do)
    }

    random_attack(){
        return this.attacks[random(0,this.attacks.length)]
    }

    random_effect(attack){
        let dice = random(0, attack.effect.reduce((a, e)=>a+e.prob, 0));
        return attack.effect.find((e)=>{
            dice -= e.prob;
            return dice <= 0;
        })
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

