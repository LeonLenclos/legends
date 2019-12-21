"use strict";
$.ajaxSetup({cache: false});
$(document).ready(main);

function main(argument) {
    $("#auto-assets").click(()=>{
        console.log('clic')
      $.ajax({
            type: "POST",
            url: "/auto_assets",
            data: "",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){alert('ok');},
            failure: function(errMsg) {
                alert(errMsg);
            }
            });
    })
}
