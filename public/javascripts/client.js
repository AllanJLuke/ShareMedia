/**
 * Created by allan on 2015-11-22.
 */
$(document).ready(function()
{
    var socket = io.connect("http://localhost:3000");
    var canvas = document.getElementById("e");
    var context = canvas.getContext("2d");
    context.fillStyle = "black";
    //context.font = "bold 12px Arial";
    socket.on('connect',function()
    {
        socket.emit("room",window.location.pathname);

        socket.on('text',function(data){
            context.clearRect(0, 0, canvas.width, canvas.height);
            $("#editor").val(data);
            context.fillText($("#editor").val(), 10, 10);
        });
    });


    $("#editor").on("keyup",function(){
       context.clearRect(0, 0, canvas.width, canvas.height);
       socket.emit("text",$(this).val());
       context.fillText($(this).val(), 10, 10);
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
