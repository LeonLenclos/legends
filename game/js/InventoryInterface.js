class InventoryElement {

    constructor(name, title){
        this.name=name;
        this.element = $('<div>', {class:'inventory_element'});

        this.title = $('<div>', {class:'inventory_element_title'})
        .text(title)
        .appendTo(this.element);
        this.value = $('<div>', {class:'inventory_element_value'})
        .appendTo(this.element);
    }

    update(new_value, animation){
        if (this.value.text() !== String(new_value)) {
            this.value.html(new_value);
            animation && animation(this.element);
        }
    }
}
class LifeIndicator {

    constructor(name, title){
        this.name=name;
        this.element = $('<div>', {class:'life_indicator'});

        this.title = $('<div>', {class:'life_indicator_title'})
        .text(title)
        .appendTo(this.element);
        this.bar = $('<div>', {class:'progress_bar'})
        .appendTo(this.element);

        this.fill = $('<div>', {class:'progress_bar_fill'})
        .appendTo(this.bar);
        this.value = $('<div>', {class:'inventory_element_value'})
        .appendTo(this.bar);
    }

    update(v, max, animation){
        let new_html = v + '/' + max
        if (this.value.html() != new_html) {
            this.value.html(new_html);
            this.fill.width(Math.floor(v/max*100) + '%');
            animation && animation(this.element);

        }
    }
}

class InventoryBar {

    constructor(){
        this.element = $('<div>', {id:'inventory_bar'});
        this.inventory_elements = assets.json.inventory.map(e=>{
            let inventory_element = new InventoryElement(e.name, e.title, e.type);
            inventory_element.element.hide().appendTo(this.element);
            return inventory_element;
        });
    }

    update(){
        this.inventory_elements.forEach((e)=>{
            if(game.hero[e.name]){
                e.element.show();
            }
            e.update(game.hero[e.name], (element)=>{
                if(element.is(":visible")){
                    element.animate({backgroundColor:'white'}, Math.floor(1000/TURN_PER_SEC *0.2));
                    element.animate({backgroundColor:'gray'}, Math.floor(1000/TURN_PER_SEC *0.8));
                }
            })
        });
    }
}


class InfoBar {

    constructor(){
        this.element = $('<div>', {id:'infos_bar'});
        
        $('<div>', {id:'infos'})
        .html(assets.json.txt.misc.infos)
        .appendTo(this.element);
    }
}

class StatusBar {

    constructor(){
        this.element = $('<div>', {id:'status_bar'});

        let txt = assets.json.txt.status;
        this.pv = new LifeIndicator('pv', txt.pv);
        this.pv.element.appendTo(this.element);
        this.or = new InventoryElement('or', txt.or);
        this.or.element.appendTo(this.element);
        this.achievments = new InventoryElement('achievments', txt.achievments);
        this.achievments.element.appendTo(this.element);
        this.turn = new InventoryElement('turn', txt.turn);
        this.turn.element.appendTo(this.element);
    }

    update(){
        this.pv.update(game.hero.pv, game.hero.pv_max);
        this.or.update(game.hero.or, (element)=>{
            element.animate({backgroundColor:'gray'}, Math.floor(1000/TURN_PER_SEC *0.2));
            element.animate({backgroundColor:'black'}, Math.floor(1000/TURN_PER_SEC *0.8));
        });
        this.achievments.update(game.achievments.length + '/100', (element)=>{
            element.animate({backgroundColor:'gray'}, Math.floor(1000/TURN_PER_SEC *0.2));
            element.animate({backgroundColor:'black'}, Math.floor(1000/TURN_PER_SEC *0.8));
        });
        this.turn.update(game.turn);
    }
}


class InventoryInterface extends Interface {

    on_setup(){
        this.status_bar_infos = this.assets.json.status_bar_infos;
    }

    update(){
        let html = ""
        this.status_bar_infos.forEach((info)=>{
            if(this.world.hero[info.name]){
                html += this.create_info(info.title, this.world.hero[info.name])
            }
        });
        this.set_status_bar(html);
    }

    create_info(title, value){
        return '<div class="status-info"><span class="status-info-title">'+title+' : </span>'+value+'</div>';
    }

    set_status_bar(html){
        if (this.container.html() != html) {
            this.container.html(html)
        }
    }
}
