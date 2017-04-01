// inlets and outlets
inlets = 1;
outlets = 1;

var max_string_length = 12;
var msg_formated = "";
    
function text(msg)
{
    if(msg.length > max_string_length)
    {
        msg_formated = msg.substring(0, max_string_length-3);
        outlet(0,msg_formated.concat("..."));    
    }
    else{
        outlet(0,msg);
    }
}