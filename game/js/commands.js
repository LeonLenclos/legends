// g is for game
// e is for current entity
// a is for argument
// c is for command




const commands = {
    EXIT:{
        do:(g, e, a)=>{g.open_map();},
        doable:(g, e, a)=>true
    },
    GOTO:{
        do:(g, e, a)=>{e.interaction_state = a[0];},
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
    }
}

function split_command(c) {
    let splited = c.split(" ");
    let command_name = splited[0];
    let args = splited.slice(1);
    return {name:command_name, args:args};
}

function do_command(g, e, c) {
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