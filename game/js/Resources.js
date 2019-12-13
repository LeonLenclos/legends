// cf https://stackoverflow.com/questions/14465177/multiple-ajax-calls-wait-for-last-one-to-load-then-execute

class Resources {
    constructor(call_back){
        this.asyncs = [];
        this.png = {};
        this.json = {};

        this.add_json('resources')
        .done((json)=>{this.load(json, call_back)})
        //when finished dit oui car ça c'est fini et le reste n'est pas encore demandé
    }

    load(list, call_back){
        list.png.forEach((png_name)=>{this.add_png(png_name)});
        list.json.forEach((json_name)=>{this.add_json(json_name)});
        this.when_finished(call_back);
    }
    add_json(name){
        let url = 'json/'+name+'.json';
        let async = $.ajax({
            url:url,
            dataType: "json",
            async: true,

        })
        .done((data)=>{
            this.json[name] = data
            console.log('loaded json : ' + name)
        })
        .fail((jqXHR, textStatus, errorThrown)=>console.log(textStatus, errorThrown, "loading : " + name));
        this.asyncs.push(async);
        return async;
    }


    add_png(name) {
        let url = 'img/'+name+'.png';
        this.png[name] = $("<img />", {src:url})[0];
    }

    when_json_finished(call_back){
        $.when.apply($, this.asyncs)
        .then(call_back);
    }
    when_png_finished(call_back){
        let image_count = Object.keys(this.png).length;
        let images_loaded = 0;
        for(let key in this.png){
            this.png[key].onload = ()=>{
                images_loaded++;
                console.log('loaded png : ' + key)

                if(images_loaded == image_count){
                    call_back();
                }
            }
        }
    }
    when_finished(call_back){
        this.when_png_finished(()=>{
            this.when_json_finished(call_back);
        })
    }
}
function base64Encode(str) {
        var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out = "", i = 0, len = str.length, c1, c2, c3;
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out += CHARS.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += CHARS.charAt(c3 & 0x3F);
        }
        return out;
    }