"use strict";
$.ajaxSetup({cache: false});
$(document).ready(main);

function main(argument) {
        let async = $.ajax({
            url:"editor/js/special.json",
            dataType: "json",
            async: true,

        })
        .done((data)=>{
            $('#hello-world').html(data.txt)
        })
        .fail((jqXHR, textStatus, errorThrown)=>{
            $('#hello-world').html('...')
                
        });

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


    $("#update-hello-world").click(()=>{
        console.log('clic')
    let helloworld= prompt('', $('#hello-world').html())

            $.ajax({
            type: "POST",
            url: "/set_json",
            data: JSON.stringify({
                path:"editor/js/special.json",
                data:{txt:helloworld}
            })  ,
            // contentType: "application/json; charset=utf-8",
            // dataType: "json",
            success: (data)=>{
                $('#hello-world').html(helloworld)
                alert('cool.');},
            error: function(errMsg) {
                console.log('error!', errMsg)
                alert('Error!   ');
            }
            });


    })
}
