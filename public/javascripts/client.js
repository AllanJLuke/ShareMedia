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

    $(function(){
        $('#clickme').click(function(){
            $('#upload').click();
        });
    });
    File.prototype.convert = function(callback){
        var FR= new FileReader();
        FR.onload = function(e) {
            callback(e.target.result)
        };
        FR.readAsDataURL(this);
    }
    $("#upload").on('change',function(){
        var selectedFile = this.files[0];
        selectedFile.convert(function(base64){
           console.log(base64);
        })
    });

});