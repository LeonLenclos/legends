class LoadingInterface extends Interface {

    on_setup(){
        this.text_div = $("#loading-text")
        this.error_div = $("#loading-error")
    }

    set_text(txt){
        this.text_div.text(txt);
    }

    set_error(txt){
        this.text_div.text(txt);
    }

}
