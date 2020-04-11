class DevBox {

    constructor(name, title){
        this.element = $('<div>', {id:'devbox'});

        this.infos = $('<div>', {id:'devbox_infos'})
        .appendTo(this.element);




        let superman = $('<button/>', {class:'button'})
        .html('superman').click(()=>{
            game.hero.superman=!game.hero.superman;
            superman.html(game.hero.superman ? 'normalman' : 'superman');
        })
        .appendTo(this.element);

        let speed = $('<button/>', {class:'button'})
        .html('speed x4').click(()=>{
            let td = game.turn_duration;
            let x1 = 1000/TURN_PER_SEC;
            let x4 = 1000/TURN_PER_SEC/4;
            speed.html((td == x1) ? 'speed x1' : 'speed x4')
            game.turn_duration = (td == x1) ? game.turn_duration = x4 : game.turn_duration = x1;
        })
        .appendTo(this.element);

        let exit_interaction = $('<button/>', {class:'button'})
        .html('exit interaction').click(()=>{
            game.interaction = null;
            game.fight = null;
            game.open('map');
        })
        .appendTo(this.element);

        let modify = $('<button/>', {class:'button'})
        .html('modify facing entity').click(()=>{this.modify_box()})
        .appendTo(this.element);

        let reload = $('<button/>', {class:'button'})
        .html('reload').click(()=>{this.reload()})
       .appendTo(this.element);

        let reload_same_pos = $('<button/>', {class:'button'})
        .html('reload same position').click(()=>{this.reload_same_pos()})
        .appendTo(this.element);

        let inventory = $('<button/>', {class:'button'})
        .html('set inventory').click(()=>{this.inventory_box()})
        .appendTo(this.element);

    }

    reload_same_pos(){
        let x = game.hero.x;
        let y = game.hero.y;
        this.reload(()=>{
            game.hero.x = x;
            game.hero.y = y;

        })
    }


    reload(callback){
        game.pause=true;
        assets = new Assets(()=>{
            game.new_game();
            game.pause = false;
            callback && callback();

        }) 
    }

    modify_box(){
        let modify = new ModifyBox(game.entity_at(game.hero.x + direction_to_move(game.hero.direction).x, game.hero.y + direction_to_move(game.hero.direction).y));
        modify.element.appendTo($('body'));
    }

    inventory_box(){
        let inventory = new InventoryBox();
        inventory.element.appendTo($('body'));
    }
    
    update(){
        let infos_text = "hero: %(x)s, %(y)s | facing: %(facing_x)s, %(facing_y)s | facing: %(facing_entity)s"
        let look_entity = game.entity_at(game.hero.x + direction_to_move(game.hero.direction).x, game.hero.y + direction_to_move(game.hero.direction).y)

        this.infos.html(sprintf(infos_text, {
            x:game.hero.x,
            y:game.hero.y,
            facing_x:game.hero.x + direction_to_move(game.hero.direction).x,
            facing_y:game.hero.y + direction_to_move(game.hero.direction).y,
            facing_entity:look_entity ? 'entity' +(look_entity.id ? ' ('+look_entity.id+')':'') : '/',
        }));
    }
}


class ModifyBox {
    constructor(look_entity){
        game.pause = true;
        this.element = $('<div>', {id:'devbox'});
        this.x_input = $('<input>', {id:'x', size:3});
        this.y_input = $('<input>', {id:'y', size:3});
        this.extra_data_input = $('<input>', {id:'extra_data', size:30});
        this.extra_data_select = $('<select>', {id:'extra_data'});
        this.extra_data_select.append($("<option>").attr('value','').text(''));
        Object.keys(assets.json).forEach((file)=>{
            if(file.startsWith('entities/')){
                this.extra_data_select
                .append($("<option>").attr('value',file).text(file));
            }
        });
        this.extra_data_select.change(()=>{this.extra_data_input.val(this.extra_data_select.val())})

        let ok = $('<button/>', {class:'button'})
        .html('ok').click(()=>{this.ok()})

        let cancel = $('<button/>', {class:'button'})
        .html('cancel').click(()=>{this.close()})

        let open_editor = $('<button/>', {class:'button'})
        .html('open entity editor').click(()=>{this.open_editor()})

        this.element
        .append('x:')
        .append(this.x_input)
        .append(' y:')
        .append(this.y_input)
        .append('<br/>extra_data:')
        .append(this.extra_data_input)
        .append(this.extra_data_select)
        .append('<br/>')
        .append(ok)
        .append(cancel)
        .append(open_editor);

        this.look_entity = look_entity
        if(this.look_entity){
            this.x_input.val(this.look_entity.native_data.x)
            this.y_input.val(this.look_entity.native_data.y)
            this.extra_data_input.val(this.look_entity.native_data.extra_data)
        } else {
            this.x_input.val(game.hero.x + direction_to_move(game.hero.direction).x)
            this.y_input.val(game.hero.y + direction_to_move(game.hero.direction).y)
        }   
    }

    ok(){
        if(this.look_entity === null){
            this.look_entity = new Entity({
                x:Number(this.x_input.val()),
                y:Number(this.y_input.val()),
                extra_data:this.extra_data_input.val()
            })
            game.entities.push(this.look_entity);
        }
        else {
            this.look_entity.native_data.x = Number(this.x_input.val());
            this.look_entity.native_data.y = Number(this.y_input.val());
            this.look_entity.native_data.extra_data = this.extra_data_input.val();       
        }
        
        let world_data = {
            entities:game.entities.map((e)=>e.native_data)
        };

        $.ajax({
        type: "POST",
        url: "/set_json",
        data: JSON.stringify({
            path:"game/assets/json/world.json",
            data:world_data
        }),
        success: (data)=>{
            alert(data);
            this.close();
        },
        error: function(errMsg) {
            console.log('error!', errMsg)
            alert('Error!   ');
        }
        });

    }

    close(){
        game.pause = false;
        this.element.remove();
    }

    open_editor(){
        window.open('/editor/entity.html?entity='+this.extra_data_input.val(), '_blank');
    }
}

class InventoryBox {
    constructor(){
        game.pause = true;
        this.element = $('<div>', {id:'inventorybox'});

        this.add_inventory_element('or');
        assets.json.inventory.forEach((inventory_element)=>{
            this.add_inventory_element(inventory_element.name);
        })


        let ok = $('<button/>', {class:'button'})
        .html('ok').click(()=>{this.ok()})

        let cancel = $('<button/>', {class:'button'})
        .html('cancel').click(()=>{this.close()})

        this.element
        .append(ok)
        .append(cancel);

    }

    add_inventory_element(name){
        let div = $('<div>', {class:'inventory_element'});
        div.append($('<span>').html(name));
        div.append($('<input>', {size:3})
            .data('inventory_element_id', name)
            .val(game.hero[name]));

        this.element.append(div);
    }
    ok(){

        $('#inventorybox input').each((i, e)=>{
            console.log(e);
            game.hero[$(e).data('inventory_element_id')]=Number($(e).val());
        })
        this.close();
    }

    close(){
        game.pause = false;
        this.element.remove();
    }
}