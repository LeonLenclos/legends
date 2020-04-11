class StoriesListElement{
    constructor(story){
        this.id = story.id;
        this.achieved = false;

        this.element = $('<div>', {class:'stories_list_element'});
        
        this.title = $('<div>', {class:'stories_list_element_title'})
        .text(story.title)
        .appendTo(this.element);
        
        this.description = $('<div>', {class:'stories_list_element_desc'})
        .text(story.description);
   }

   achieve(){
        if(!this.achieved){
            this.achieved = true;
            this.element.addClass('achieved');
            this.description.appendTo(this.element);
        }
        
   }
}

class StoriesInterface extends Interface {

    constructor(){
        super('stories');
        this.stories_list_element = [];
        this.stories_list = $('<div>', {id:'stories_list'});
        assets.json.stories.forEach(s=>{
            let e = new StoriesListElement(s)
            this.stories_list_element.push(e)
            e.element.appendTo(this.stories_list)
        });
        this.stories_text = $('<div>', {id:'stories_text'})
    }

    create_content(){
        this.stories_list_element.forEach((s)=>{
            if (game.stories.includes(s.id)){
                s.achieve();
            }
        })
        this.stories_list.appendTo(this.container);
        this.stories_text
        .html(sprintf(assets.json.txt.misc.stories, {stories:game.stories.length}))
        .appendTo(this.container);
    }

    update_content(){

    }

    on_ok(){
        game.open('map');
    }
}
