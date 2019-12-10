class Hero extends Obj{

    constructor(){
        console.log('init Hero');
        super('script/hero.json');

        // Position and direction of the Hero in the map
        this.direction=SOUTH;

        // //
        // // this.life=3;
        // // this.inventory=[];
        // // this.secrets={}
    }
}