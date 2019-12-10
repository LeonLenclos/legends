class Game {

    constructor(){
        console.log('init game');
        this.hero = new Hero();
        this.objects = [];
        this.map = new MapInterface(this);
        this.turn = 0;

        
        setInterval(this.main_loop, 20);
    }


    main_loop(){
        if (this.hero.ready && this.map.ready) {
            this.map.render();
        }
    }
}