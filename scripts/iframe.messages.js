// Event system
function onMessage(event)
{
    var data = event.data;

    if (data.func != undefined && typeof(window[data.func]) == "function")
    {
        console.log('OnMessage from Web Scripts: '+ data.func);
        window[data.func].call(null, JSON.parse(data.message));
    }
}

if (window.addEventListener)
{
    window.addEventListener("message", onMessage, false);
}
else if (window.attachEvent)
{
    window.attachEvent("onmessage", onMessage, false);
}

function SendEventMessage(func, message)
{
    if(func == null)
        return;

    message = message == null ? '' : message;
    var messageData = {
        'func': func,
        'message': JSON.stringify(message)
    };
    
    window.parent.postMessage(JSON.stringify(messageData), "*");
}
