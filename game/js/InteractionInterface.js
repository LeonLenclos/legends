class InteractionInterface extends Interface {

    on_setup(){
        this.title_div = $("#interaction-title")
        this.text_div = $("#interaction-text")
        this.actions_div = $("#interaction-actions")
    }
    open_interaction(obj, action_call_back){
        this.obj = obj
        this.action_call_back = action_call_back
        this.update();
    }

    update(){
        this.set_title(this.obj.data.title);
        this.set_text(this.obj.read_script().txt)
        this.set_actions(this.obj.read_script().actions)
    }

    set_text(txt){
        this.text_div.text(txt);
    }
    set_title(txt){
        this.title_div.text(txt);
    }
    set_actions(actions){
        this.actions_div.empty();
        actions.forEach((action)=>this.create_action(action))
    }
    create_action(action){
        console.log(action);
        $('<div/>',{
            class:'button'
        })
        .text(action.txt)
        .click(()=>this.action_call_back(action.do))
        .appendTo(this.actions_div);
    }


}
