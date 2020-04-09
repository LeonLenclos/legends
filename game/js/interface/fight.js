class FightInterface extends InterfaceMenu {

    constructor(){
        super('fight');
    }

    create_menu(){
        let moment = game.interaction_entity.read_script();

        this.set_title(sprintf(assets.json.txt.fight.title,{
            target:game.fight_entity.title,
        }));

        this.set_illu(game.fight_entity.illu);

        let life = new LifeIndicator();
        life.element.appendTo(this.title_container);
        life.update(game.fight_entity.pv, game.fight_entity.pv_max);

        let text = [];
        if(!game.hero.last_effect && !game.fight_entity.last_effect){
            text.push(assets.json.txt.fight.start);
        }
        if(game.hero.last_effect){
            text.push(game.hero.last_effect.txt);
        }
        if(game.fight_entity.dead){
            text.push(sprintf(assets.json.txt.fight.enemy_dead,{
                target:game.fight_entity.title,
            }));
        }
        else if(game.fight_entity.last_effect){
            text.push(game.fight_entity.last_effect.txt);
        }
        if(game.hero.dead){
            text.push(sprintf(assets.json.txt.fight.hero_dead,{
                target:game.fight_entity.title,
            }));
        }

        this.set_text(text.join('<br/>'));
        



        if(game.hero.dead || game.fight_entity.dead){
            this.add_option(assets.json.txt.misc.ok, ()=>{
                game.fight_entity = null;
                game.interact();
            });
        } else {
            game.hero.attacks.filter(a=>doable_commands(game.fight_entity, a.do))
            .forEach(a=>{
                this.add_option(a.txt, ()=>{
                    game.hero.fight(game.fight_entity, a);
                    if(game.fight_entity && !game.fight_entity.dead){
                        game.fight_entity.fight(game.hero);
                    }
                    game.interact();
                });
            });            
        }

        game.inventory_bar.element.appendTo(this.container);
        game.status_bar.element.appendTo(this.container);
    }

    update_content(){
        game.status_bar.update();
        game.inventory_bar.update()
    }
}
