class InteractionInterface extends InterfaceMenu {

    constructor(){
        super('interaction');
    }

    create_menu(){
        let moment = game.interaction_entity.read_script();
        this.set_title(moment.title);
        this.set_text(moment.txt);
        this.set_illu(game.interaction_entity.illu);
        moment.actions.forEach((a)=>{
            this.add_option(a.txt, ()=>{
                do_commands(game.interaction_entity, a.do);
                game.interact();
            }, !doable_commands(game.interaction_entity, a.do))
        });
        game.inventory_bar.element.appendTo(this.container);
        game.status_bar.element.appendTo(this.container);
    }

    update_content(){
        game.status_bar.update();
        game.inventory_bar.update()
    }
}