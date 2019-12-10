class Obj {

    constructor(url){
        // Position and direction of the Hero in the map
        this.load(url)
    }

    setup(json){
        // Load the tileset then call render_layers
        this.data = json;
        this.x=json.x;
        this.y=json.y;
        this.name=json.name;
        this.img = $("<img />", {src:'img/interactive_objects/'+this.name+'.png'})[0]
        this.img.onload = $.proxy(()=>this.ready=true, this);

    }

    load(url){
        // Load the json map then call load_tileset
        return $.ajax({url:url})
        .done($.proxy(this.setup, this))
        .fail((e)=>console.log(e));
    }

}