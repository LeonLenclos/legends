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
            success: (data)=>{
                alert(data);
            },
            error: (errMsg)=>{
                console.log('erreur!', errMsg)
                alert('Erreur!');
            }
            });
    })
}
