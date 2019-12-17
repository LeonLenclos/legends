class Entity {

    constructor(data, assets){
        // Position and direction of the Hero in the map
        let extra_data = assets.json[data.extra_data];
        for(let attr in extra_data){
            this[attr] = extra_data[attr];
        }
        for(let attr in data){
            this[attr] = data[attr];
        }
        this.img = assets.png[this.img]
        if(this.script){
            for(let moment in this.script){
                this.script[moment].txt = new ScriptText(this.script[moment].txt)
                this.script[moment].actions.forEach((action, i, a)=>{
                    a[i].txt = new ScriptText(a[i].txt)
                })
            }
        }
    }

    get_interaction_state(){
        return this.interaction_state || 'start';
    }


    read_script(){
        return this.script[this.get_interaction_state()];
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

