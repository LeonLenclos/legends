class InteractionInterface extends Interface {

    on_setup(){
        this.illu_div = $("#interaction-illu")
        this.title_div = $("#interaction-title")
        this.text_div = $("#interaction-text")
        this.actions_div = $("#interaction-actions")
    }
    open_interaction(entity, action_call_back){
        this.entity = entity;
        this.action_call_back = action_call_back;
    }

    update(script){
        this.set_illu(script.illu);
        this.set_title(script.title);
        this.set_text(script.txt);
        this.set_actions(script.actions);
    }

    set_illu(illu){
        this.illu_div.empty();
        $(illu).appendTo(this.illu_div);

        // !!!!!!!!!!!!!!!!!!!!!!!
    }
    set_text(txt){
        if(txt instanceof ScriptText) txt = txt.read();

        this.text_div.html(txt)
    }
    set_title(txt){
        this.title_div.html(txt);
    }
    set_actions(actions){
        this.actions_div.empty();
        actions.forEach((action)=>this.create_action(action))
    }
    create_action(action){
        let txt = action.txt;
        if(txt instanceof ScriptText) txt = txt.read();

        $('<button/>',{
            class:'button'
        })
        .html(txt)
        .attr("disabled", !action.do.every((c)=>doable_command(this.game, this.entity, c)))
        .click(()=>this.action_call_back(action))
        .appendTo(this.actions_div);
    }


}
