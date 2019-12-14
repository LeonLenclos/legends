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
        console.log(this.img)
        this.img = assets.png[this.img]
        console.log(this.img)
        
    }

    get_interaction_state(){
        return this.interaction_state || 'start';
    }

    read_script(){
        return this.script[this.get_interaction_state()];
    }
}
