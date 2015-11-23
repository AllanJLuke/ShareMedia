/**
 * Created by allan on 2015-11-22.
 */
$(document).ready(function()
{

    var socket = io.connect("http://localhost:3000");

    socket.on('connect',function()
    {


        socket.emit("room",window.location.pathname);
       socket.on('text',function(data){
           $("#editor").val(data);
       });

    });


    $("#editor").on("keyup",function(){
       socket.emit("text",$(this).val());
    });
});