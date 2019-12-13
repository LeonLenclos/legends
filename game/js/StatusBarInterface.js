class StatusBarInterface extends Interface {

    on_setup(){
        this.status_bar_infos = this.resources.json.status_bar_infos;
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
