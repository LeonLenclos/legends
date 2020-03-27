class Interface {
    constructor(interface_id){
        this.id = interface_id;
        this.busy = false;
        $(window).resize(()=> this.on_resize && this.on_resize());
    }

    create(){
            
        $('#game').empty();
        this.container = $('<div>');
        this.container.attr('id', this.id);
        this.container.addClass('interface');
        this.container.appendTo($('#game'));
        this.create_content();

    }

    input(action){
        if(this['on_'+action] && !this.busy){
            this.busy = true;
            setTimeout(()=>{this.busy=false}, 1000/TURN_PER_SEC);
            this['on_'+action]();
        }
    }

    update(){
        this.update_content && this.update_content();
    }
}

class ButtonMenu {
    constructor(text, on_click, disabled){
        this.disabled = disabled;
        this.on_click = on_click;
        this.element = $('<button/>', {class:'button'})
        .html(text)
        .attr("disabled","disabled")
        .css('visibility', 'hidden');

    }

    show(){
        this.element.css('visibility', 'visible');
        if(!this.disabled) {
            this.element.removeAttr('disabled');
            this.element.click(this.on_click);
        }
    }

    select(selected){
        if (selected) this.element.addClass('selected');
        else this.element.removeClass('selected');
    }
}
class InterfaceMenu extends Interface{

    constructor(interface_id){
        super(interface_id);
        this.selected=0;
        this.options=[];
    }
    
    create_content() {
        this.container.addClass('menu');

        this.illu_container = $('<div>', {id:'illu'})
        .appendTo(this.container);

        this.gui = $('<div>', {id:'menu_gui'})
        .appendTo(this.container);

        this.title_container = $('<div>', {id:'title'})
        .appendTo(this.gui);
        this.text_container = $('<div>', {id:'text'})
        .appendTo(this.gui);
        this.options_container = $('<div>', {id:'options'})
        .appendTo(this.gui);
        
        this.clear_options();
        this.create_menu();
    }

    clear_options(){
        this.options_container.empty();
        this.selected=0;
        this.options=[];
    }

    add_option(txt, on_click, disabled){
        if(txt instanceof ScriptText) txt = txt.read();
        let b = new ButtonMenu(txt, on_click, disabled);
        b.element.appendTo(this.options_container);
        this.options.push(b);
        this.update_selection();
    }

    show_options(){
        this.options.forEach(o=>o.show());
    }

    set_illu(illu){
        this.illu_container.empty();
        $(illu).appendTo(this.illu_container);
    }

    set_text(txt){
        if(txt instanceof ScriptText) txt = txt.read();
        this.text_container.typewrite(txt, 20, ()=>this.show_options());
    }

    set_title(txt){
        this.title_container.html(txt);
    }

    move_selection(n){
        this.selected = constrain(this.selected+n, 0, this.options.length-1);
        this.update_selection();
    }

    update_selection(){
        this.options.forEach((o, i)=>o.select(i == this.selected));
    }

    on_down(){
        this.move_selection(+1);
    }

    on_up(){
        this.move_selection(-1);
    }

    on_ok(){
        $('.button').eq(this.selected).trigger('click');
    }

}
