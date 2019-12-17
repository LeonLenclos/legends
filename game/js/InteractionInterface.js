class InteractionInterface extends Interface {

    on_setup(){
        this.title_div = $("#interaction-title")
        this.text_div = $("#interaction-text")
        this.actions_div = $("#interaction-actions")
    }
    open_interaction(entity, action_call_back){
        this.entity = entity;
        this.action_call_back = action_call_back;
        this.update();
    }

    update(){
        this.set_title(this.entity.title);
        this.set_text(this.entity.read_script().txt)
        this.set_actions(this.entity.read_script().actions)
    }

    set_text(txt){
        this.text_div.text(txt.read());
    }
    set_title(txt){
        this.title_div.text(txt);
    }
    set_actions(actions){
        this.actions_div.empty();
        actions.forEach((action)=>this.create_action(action))
    }
    create_action(action){
        $('<button/>',{
            class:'button'
        })
        .text(action.txt.read())
        .attr("disabled", !action.do.every((c)=>doable_command(this.game, this.entity, c)))
        .click(()=>this.action_call_back(action.do))
        .appendTo(this.actions_div);
    }


}
