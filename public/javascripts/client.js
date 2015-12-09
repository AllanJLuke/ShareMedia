/**
 * Created by allan on 2015-11-22.
 */



$(document).ready(function()
{

  var socket = io.connect();

  var canvas = document.getElementById("e");
  //canvas.width=window.innerWidth * 0.75;
  //canvas.height=window.innerHeight * 0.75;
  var context = canvas.getContext("2d");
  var maxWidth = canvas.width;
  var lineHeight = context.measureText("M").width * 1.8;
  var charWidth = context.measureText("M").width;
  context.fillStyle = "black";
  context.font = "16px Arial";
  var yoffset = 24;
  var textArray;

  $("#editor").focus();
  $("#e").on('click', function(){
      $("#editor").focus();
  });

  function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
      };
  }

    function addImage(base64)
    {
        $("#imageRow").append( "<img class='imageBox' src='"+base64+"' />");

        $('.imageBox').materialbox();
    }
    /*
  function picture(base64, x, y){
    var image = new Image();
    image.onload = function() {
        context.drawImage(image, x, y);
    };
    image.src = base64;
  }

  function cursorBlink(context, x, y){
    context.fillStyle = "blue";
    context.font = " bold 18px Arial";
    context.fillText("|", x - 2, y);
    context.fillStyle = "black";
    context.font = "12px Arial";
  }
  */

  function storeText(text){
    textArray = text.split("\n");
  }

  function printText(context, x, y) {
    for (var i = 0; i < textArray.length; ++i) {
        //context.fillText(textArray[i], x, y);
        var words = textArray[i].split(' ');
        var line = '';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          metrics = context.measureText(testLine);
          testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            //context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillText(line, x, y);
            //cursorBlink(context, x+testWidth, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        //context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillText(line, x, y);
        //cursorBlink(context, x+testWidth, y);
        y += lineHeight;
    }
    //yoffset = y;
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
    socket.on('connect',function()
    {
        socket.emit("room",window.location.pathname);

        socket.on('text',function(data){
            context.clearRect(0, 0, canvas.width, canvas.height);
            $("#editor").val(data);
            storeText($("#editor").val());
            printText(context, 10, 14);
            //wrapText(context, $("#editor").val(), 10, 10, maxWidth, lineHeight);
            //fillTextMultiLine(context, $("#editor").val(), 10, 10);
            //context.fillText($("#editor").val(), 10, 10);
        });


        socket.on('image',function(data){

            console.log("GOT AN IMAGE");
           addImage(data);
           //picture(data, 10, yoffset);

            //context.drawImage(image, 0, 0);
        });
    });


    $("#editor").on("keyup",function(){
       context.clearRect(0, 0, canvas.width, canvas.height);
       socket.emit("text",$(this).val());
       storeText($(this).val());
       printText(context, 10, 14);
       //wrapText(context, $(this).val(), 10, 10, maxWidth, lineHeight);
       //fillTextMultiLine(context, $(this).val(), 10, 10);
       //context.fillText($(this).val(), 10, 10);
    });
    var bold = false;
    $(function(){
      $('#bold').click(function(){
        //context.font = "bold 12px Arial";
        if(!bold){
          context.font = "bold 16px Arial";
          context.clearRect(0, 0, canvas.width, canvas.height);
          printText(context, 10, 14);
          bold = true;
        }else{
          context.font = "16px Arial";
          context.clearRect(0, 0, canvas.width, canvas.height);
          printText(context, 10, 14);
          bold = false;
        }
      });
    });

    var italic = false;
    $(function(){
      $('#italicize').click(function(){
        //context.font = "italic 12px Arial";
        if(!italic){
          context.font = "italic 16px Arial";
          context.clearRect(0, 0, canvas.width, canvas.height);
          printText(context, 10, 14);
          italic = true;
        }else{
          context.font = "16px Arial";
          context.clearRect(0, 0, canvas.width, canvas.height);
          printText(context, 10, 14);
          italic = false;
        }
      });
    });
    /*
    var bold = false;
    $('#bold').on('change', function(){
      if(bold === false){
        context.font = "bold 12px Arial";
        context.clearRect(0, 0, canvas.width, canvas.height);
        printText(context, 10, 10);
      }else{
        context.font = "12px Arial";
        context.clearRect(0, 0, canvas.width, canvas.height);
        printText(context, 10, 10);
      }
    });

    var italic = false;
    $('#italicize').on('change', function(){
      if(italic === false){
        context.font = "italic 12px Arial";
        context.clearRect(0, 0, canvas.width, canvas.height);
        printText(context, 10, 10);
        italic = true;
      }else{
        context.font = "12px Arial";
        context.clearRect(0, 0, canvas.width, canvas.height);
        printText(context, 10, 10);
      }
    });
    */
    $(function(){
        $('#uploadButton').click(function(){
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
            socket.emit("image",base64);
            addImage(base64);
        });
    });



});
function goToPad(){
    var string = $("#padInput").val();
    window.location.href = ("/" + string);
}
