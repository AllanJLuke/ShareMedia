/**
 * Created by allan on 2015-11-22.
 */



$(document).ready(function()
{

  var socket = io.connect();

  var canvas = document.getElementById("e");
  var context = canvas.getContext("2d");
  var maxWidth = canvas.width;
  var lineHeight = context.measureText("M").width * 1.2;
  context.fillStyle = "black";
  var yoffset = 10;
  var textArray;

  $("#editor").focus();
  $("#e").on('focus', function(){
      $("#editor").focus();
  });

  function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
      };
  }

  function cursorBlink(context, x, y){
    context.strokeStyle="blue";
    context.moveTo(x,y);
    context.lineTo(x,y+lineHeight);
    context.stroke();
  }



  function storeText(text){
    textArray = text.split("\n");
  }

  function printText(context, x, y) {
    for (var i = 0; i < textArray.length; ++i) {
        //context.fillText(textArray[i], x, y);
        var words = textArray[i].split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
        y += lineHeight;
    }
  }
/*
  function fillTextMultiLine(context, text, x, y) {
    var lines = text.split("\n");
    for (var i = 0; i < lines.length; ++i) {
        context.fillText(lines[i], x, y);
        y += lineHeight;
    }
    yoffset = y;
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight) {
      var words = text.split(' ');
      var line = '';

      for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          //context.fillText(line, x, y);
          fillTextMultiLine(context, line, x, y);
          line = words[n] + ' ';
          //y += lineHeight;
          y = yoffset;
        }
        else {
          line = testLine;
        }
      }
      //context.fillText(line, x, y);
      fillTextMultiLine(context, line, x, y);
    }
*/
    //context.font = "bold 12px Arial";
    socket.on('connect',function()
    {
        socket.emit("room",window.location.pathname);

        socket.on('text',function(data){
            context.clearRect(0, 0, canvas.width, canvas.height);
            $("#editor").val(data);
            storeText($("#editor").val());
            printText(context, 10, 10);
            //wrapText(context, $("#editor").val(), 10, 10, maxWidth, lineHeight);
            //fillTextMultiLine(context, $("#editor").val(), 10, 10);
            //context.fillText($("#editor").val(), 10, 10);
        });
    });


    $("#editor").on("keyup",function(){
       context.clearRect(0, 0, canvas.width, canvas.height);
       socket.emit("text",$(this).val());
       storeText($(this).val());
       printText(context, 10, 10);
       //wrapText(context, $(this).val(), 10, 10, maxWidth, lineHeight);
       //fillTextMultiLine(context, $(this).val(), 10, 10);
       //context.fillText($(this).val(), 10, 10);
    });

    $(function(){
        $('#clickme').click(function(){
            $('#upload').click();
        });
    });
    File.prototype.convert = function(callback){
        var FR= new FileReader();
        FR.onload = function(e) {
            callback(e.target.result);
        };
        FR.readAsDataURL(this);
    };
    $("#upload").on('change',function(){
        var selectedFile = this.files[0];
        selectedFile.convert(function(base64){
           console.log(base64);
        });
    });

});
function goToPad(){
    var string = $("#padInput").val();
    window.location.href = ("/" + string);
}
