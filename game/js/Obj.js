class Obj {

    constructor(data, resources){
        // Position and direction of the Hero in the map

        this.x = data.x;
        this.y = data.y;
        this.type = data.type;

        this.data = resources.json[this.type]
        this.img = resources.png['obj/'+this.type]

    }

    get_interaction_state(){
        return this.interaction_state || 'start';
    }

    read_script(){
        return this.data.script[this.get_interaction_state()];
    }
}
