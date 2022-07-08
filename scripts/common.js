var IsMobilePlatform = false;

let cachedConfigFile = null;
let configUrl = 'https://spgames.s3.ap-south-1.amazonaws.com/short-run-3d/yandex/0.2/RemoteConfig.json';
var showedRewardVideo = false;
var environment = {
    appId: "",
    payload: "",
    screen: {
        isFullscreen: false,
        orientation: {
            value: "",          // portrait, landscape
            isLock: false
        }
    },
    deviceInfo: {
        isTv: false,
        isTable: false,
        isMobile: false,
        deviceType: ""          // desktop, mobile, tablet, tv
    },
    browser: {
        languageCode: "",       // ru, en, tr and more...
        topLevelDomain: ""
    }
};

// Localization
var enabledDefaultLanguage = false;
var defaultLanguageCode = "ru";

// Config
function LoadConfig(successCallback, errorCallback)
{
    if(cachedConfigFile != null)
    {
        successCallback(cachedConfigFile);
        return;
    }
    LoadStringFromUrl(configUrl, successCallback, errorCallback);
}

function CacheLoadedConfig(json)
{
    cachedConfigFile = json;
    console.log(cachedConfigFile);
}

function GetCachedGameConfig()
{
    return cachedConfigFile;
}

LoadConfig(CacheLoadedConfig);

function GetLoadingScreenLocalization()
{
    let langugages = [
        {
            lang: 'en',
            value: 'Loading'
        },
        {
            lang: 'ru',
            value: 'Загрузка'
        },
        {
            lang: 'tr',
            value: 'Yükleniyor'
        },
    ];

    let translated = langugages.find(lang => lang.lang == GetLanguageCode());
    if(translated == null)
        translated = langugages[0];
    return translated;
}

function SendSuccessMessage(request, parameters)
{
    if(request == null) return;
    BaseSendMessage(request.gameObjectName, request.successMethodName, parameters);
}

function SendFailedMessage(request, parameters)
{
    if(request == null) return;
    BaseSendMessage(request.gameObjectName, request.failedMethodName, parameters);
}

function SendClosedMessage(request)
{
    if(request == null) return;
    BaseSendMessage(request.gameObjectName, request.closedMethodName);
}


function BaseSendMessage(gameObjectName, functionName, parameters)
{
    if(unityInstance == null) return;
    if(parameters != null)
    {
        unityInstance.SendMessage(gameObjectName, functionName, parameters);
        return;
    }
    unityInstance.SendMessage(gameObjectName, functionName);
}

function WebRequestToObject(reqeust)
{
    return JSON.parse(reqeust);
}


window.onfocus = function()
{
    if(showedRewardVideo == true)
        return;
    
    BaseSendMessage('GameServices', 'FocusMode', 1);
};

window.onblur = function()
{
    BaseSendMessage('GameServices', 'FocusMode', 0);
};

function setElementByIdStyleType(id, type)
{
    var element = document.getElementById(id);
    if(element == null) return;
    if(element.style == null) return;
    element.style.display=type;
}
