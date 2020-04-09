// g is for game
// e is for current entity
// a is for argument
// c is for command




const commands = {
    EXIT:{
        doc:"Ferme l'interaction",
        usage:'EXIT',
        do:(e, a)=>{
            game.interaction_entity=null;
            // game.open('map');
        },
        doable:(e, a)=>true
    },
    GAMEOVER:{
        doc:"Game over...",
        usage:'GAMEOVER',
        do:(e, a)=>{game.open('gameover')},
        doable:(e, a)=>true
    },
    GOTO:{
        doc:"Aller à un autre moment de l'interaction",
        usage:'GOTO moment [entity]',
        do:(e, a)=>{
            let target = a[1] ? game.get_entity(a[1]) : e;
            target.interaction_state = a[0];
        },
        doable:(e, a)=>true
    },
    GIVE:{
        doc:"Additionner une valeur à un attribut",
        usage:'GIVE number attribute [entity]',
        do:(e, a)=>{
            let amount = Number(a[0]);
            let attr = a[1];
            let target = a[2] ? game.get_entity(a[2]) : e;
            target[attr] = target[attr] ? target[attr] + amount : amount;
        },
        doable:(e, a)=>{
            let amount = Number(a[0]);
            let attr = a[1];
            let target = a[2] ? game.get_entity(a[2]) : e;
            result = target[attr] ? target[attr] + amount : amount;
            return result >= 0;
        }
    },
    SET:{
        doc:"Changer la valeur d'un attribut",
        usage:'SET value attribute [entity]',
        do:(e, a)=>{
            let value = Number(a[0]);
            if(isNaN(value)) value = a[0];
            let attr = a[1];
            let target = a[2] ? game.get_entity(a[2]) : e;
            target[attr] = value;
        },
        doable:(e, a)=>true
    },
    SETIMAGE:{
        doc:"Changer l'image qui s'affiche sur la map",
        usage:'SETIMAGE entities/image [entity]',
        do:(e, a)=>{
            let value =  a[0];
            let target = a[1] ? game.get_entity(a[1]) : e;
            target.set_image(value);
        },
        doable:(e, a)=>true
    },
    SETILLU:{
        doc:"Changer l'image qui s'affiche dans l'interaction",
        usage:'SETILLU illu/image [entity]',
        do:(e, a)=>{
            let value =  a[0];
            let target = a[1] ? game.get_entity(a[1]) : e;
            target.set_illu(value);
            target
        },
        doable:(e, a)=>true
    },
    SETPOSITION:{
        doc:"Changer la position",
        usage:'SETPOSITION x y [entity]',
        do:(e, a)=>{
            let value_x =  Number(a[0]);
            let value_y =  Number(a[1]);
            let target = a[2] ? game.get_entity(a[2]) : e;
            target.x = value_x;
            target.y = value_y;
        },
        doable:(e, a)=>true
    },
    COPYPOSITION:{
        doc:"Donner au hero la position de l'entité",
        usage:'COPYPOSITION',
        do:(e, a)=>{
            game.hero.x = e.x;
            game.hero.y = e.y;
        },
        doable:(e, a)=>true
    },
    FIGHT:{
        doc:"Démarrer un combat",
        usage:'FIGHT',
        do:(e, a)=>{
            game.fight_entity=e;
            game.hero.last_effect=null;
            e.last_effect=null;
        },
        doable:(e, a)=>true
    },
    FLEE:{
        doc:"(Combat uniquement) Fuir d'un combat.",
        usage:'FLEE',
        do:(e, a)=>{
            game.fight_entity = null;
            game.interaction_entity = null;
        },
        doable:(e, a)=>true
    },
    HIT:{
        doc:"(Combat uniquement) Retirer des pv à l'adversaire",
        usage:'HIT number',
        do:(e, a)=>{
            let hit = Number(a[0]); 
            e.set_pv(-hit);
        },
        doable:(e, a)=>true
    },
    STORY:{
        doc:"Ajoute une histoire à raconter à la liste",
        usage:'STORY story_id',
        do:(e, a)=>{
            let id = a[0];
            if(!game.strories.includes(a))
                game.strories.push(a);
        },
        doable:(e, a)=>true
    },
    STORYDONE:{
        doc:"Verifier si une histoire est réalisé",
        usage:'STORYDONE story_id',
        do:(e, a)=>{return;},
        doable:(e, a)=>game.strories.includes(a)
    },
    COMPARESTORIES:{
        doc:"Compare le nombre d'histoires réalisées à une valeur",
        usage:'COMPARESTORIES operator value',
        do:(e, a)=>{
            let operator = a[0];
            let v = a[1];

            if (operator == '<') return game.strories.length < v;
            if (operator == '<=') return game.strories.length <= v;
            if (operator == '>') return game.strories.length > v;
            if (operator == '>=') return game.strories.length >= v;
            if (operator == '=') return game.strories.length == v;
            if (operator == '!=') return game.strories.length != v;

        },
        doable:(e, a)=>true
    },
    COMPARE:{
        doc:"Comparer les valeurs de deux attributs (opérateurs disponnibles : < > = <= >= != )",
        usage:'COMPARE attribut [entity] operator attribut [entity]',
        do:(e, a)=>{return;},
        doable:(e, a)=>{
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
                    target = game.get_entity(a[i])
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
                let target = a[i] ? game.get_entity(a[i]) : e;
                value_b = target[attr];
            }
            // compare
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
    return {name:splited[0], args:splited.slice(1)};
}

function do_commands(e, commands) {
    if(commands && commands.every((c)=>doable_command(e, c))){
        commands.forEach((c)=>{do_command(e, c)});
    }
}

function do_command(e, c) {
    let command = commands[split_command(c).name];
    let args = split_command(c).args;
    if(command.doable(e, args)){
        command.do(e, args);
    }
}

function doable_commands(e, commands) {
    if(commands){
        return commands.every((c)=>doable_command(e, c));
    }
}

function doable_command(e, c) {
    let command = commands[split_command(c).name];
    let args = split_command(c).args;
    return command.doable(e, args);
}