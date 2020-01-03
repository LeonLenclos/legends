// g is for game
// e is for current entity
// a is for argument
// c is for command




const commands = {
    EXIT:{
        do:(g, e, a)=>{
            g.open_map();
        },
        doable:(g, e, a)=>true
    },
    GAMEOVER:{
        do:(g, e, a)=>{g.game_over();},
        doable:(g, e, a)=>true
    },
    GOTO:{
        do:(g, e, a)=>{
            let target = a[1] ? g.world.get_entity(a[1]) : e;
            target.interaction_state = a[0];
            // if(!a[1] && target.read_script().auto_actions){
            //     target.read_script().auto_actions.forEach((a)=>{
            //         g.on_action(a.do, target)
            //     })
            // }
        },
        doable:(g, e, a)=>true
    },
    GIVE:{
        do:(g, e, a)=>{
            let amount = Number(a[0]);
            let attr = a[1];
            let target = a[2] ? g.world.get_entity(a[2]) : e;
            target[attr] = target[attr] ? target[attr] + amount : amount;
        },
        doable:(g, e, a)=>{
            let amount = Number(a[0]);
            let attr = a[1];
            let target = a[2] ? g.world.get_entity(a[2]) : e;
            result = target[attr] ? target[attr] + amount : amount;
            return result >= 0;
        }
    },
    SET:{
        do:(g, e, a)=>{
            let value = Number(a[0]);
            if(isNaN(value)) value = a[0];
            let attr = a[1];
            let target = a[2] ? g.world.get_entity(a[2]) : e;
            target[attr] = value;
        },
        doable:(g, e, a)=>true
    },
    SETIMAGE:{
        do:(g, e, a)=>{
            let value =  a[0];
            let target = a[1] ? g.world.get_entity(a[1]) : e;
            target.set_image(value);
            target
        },
        doable:(g, e, a)=>true
    },
    SETPOSITION:{
        do:(g, e, a)=>{
            let value_x =  Number(a[0]);
            let value_y =  Number(a[1]);
            let target = a[2] ? g.world.get_entity(a[2]) : e;
            target.x = value_x;
            target.y = value_y;
        },
        doable:(g, e, a)=>true
    },
    COPYPOSITION:{
        do:(g, e, a)=>{
            g.world.hero.x = e.x;
            g.world.hero.y = e.y;
        },
        doable:(g, e, a)=>true
    },
    FIGHT:{
        do:(g, e, a)=>{
            g.world.get_entity('hero').start_fight();
            e.start_fight();
        },
        doable:(g, e, a)=>true
    },
    FLEE:{
    do:(g, e, a)=>{
        e.flee = true;
    },
    doable:(g, e, a)=>true
    },
    HIT:{
        do:(g, e, a)=>{
            let hit = Number(a[0]); 
            e.target.pv -= hit;
            if(e.target.pv <= 0){
                e.target.kill();
            }
        },
        doable:(g, e, a)=>true
    },
    COMPARE:{
    do:(g, e, a)=>{return;},
    doable:(g, e, a)=>{
        let operators = ['<', '>', '=', '<=', '>=', '!=']
        let i = 0;
        let value_a, value_b;
        //value a
        if(!isNaN(Number(a[i]))){
            value_a = Number(a[i]);
            i++;
        } else {
            let attr = a[i];
            i++;
            let target = e;
            if(!operators.includes(a[i])){
                target = g.world.get_entity(a[i])
                i++;
            }
            value_a = target[attr];
        }
        // op
        let operator = a[i];
        i++;
        // value b
        if(!isNaN(Number(a[i]))){
        value_b = Number(a[i]);
        i++;
        } else {
            let attr = a[i];
            i++;
            let target = a[i] ? g.world.get_entity(a[i]) : e;
            value_b = target[attr];
        }
        // compare
        console.log('compare : ', value_a, operator, value_b, '?');
        if (operator == '<') return value_a < value_b;
        if (operator == '<=') return value_a <= value_b;
        if (operator == '>') return value_a > value_b;
        if (operator == '>=') return value_a >= value_b;
        if (operator == '=') return value_a == value_b;
        if (operator == '!=') return value_a != value_b;
    }
}
}

function split_command(c) {
    let splited = c.split(" ");
    let command_name = splited[0];
    let args = splited.slice(1);
    return {name:command_name, args:args};
}

function do_command(g, e, c) {
    console.log('do : ' + c)
    let command = commands[split_command(c).name];
    let args = split_command(c).args;
    if(command.doable(g, e, args)){
        command.do(g, e, args);
    }
}

function doable_command(g, e, c) {
    let command = commands[split_command(c).name];
    let args = split_command(c).args;
    return command.doable(g, e, args);
}