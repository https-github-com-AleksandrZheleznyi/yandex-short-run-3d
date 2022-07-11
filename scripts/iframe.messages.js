// Event system
if (window.addEventListener)
{
    window.addEventListener("message", onMessage, false);
}
else if (window.attachEvent)
{
    window.attachEvent("onmessage", onMessage, false);
}

function onMessage(event)
{
    console.log('OnMessage from Web Scripts: '+ data.func);
    var data = event.data;

    if (typeof(window[data.func]) == "function")
    {
        window[data.func].call(null, data.message);
    }
}

function SendEventMessage(func, message)
{
    if(func == null)
        return;

    message = message == null ? '' : message;
    window.parent.postMessage({
        'func': func,
        'message': message
    }, "*");
}
