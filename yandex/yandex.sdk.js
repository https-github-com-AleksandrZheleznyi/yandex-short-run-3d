var sdk = null;
var player = null;
var payments = null;
var locStorage = null;
var leaderboards = null;
var rtbBannersData =
    {
        mobileBanners: [
            {id: "R-A-1621043-28", position: "Bottom"},
{id: "R-A-1621043-30", position: "Fullscreen"}

        ],
        desktopBanners: [
            {id: "R-A-1621043-29", position: "Bottom"},
{id: "R-A-1621043-31", position: "Center"}

        ]
    };

// User Authorization
function YandexAuthorizationUser(request)
{
    SendEventMessage('AuthorizationUser', request);
}

function YandexShowAuthorizationDialog(request)
{
    SendEventMessage('ShowAuthorizationDialog', request);
}

// Purchases
function YandexInitializePurchases(request)
{
    SendEventMessage('InitializePurchases', request);
}

function YandexPurchase(request)
{
    SendEventMessage('Purchase', request);
}

function YandexGetPurchasedProducts(request)
{
    SendEventMessage('GetPurchasedProducts', request);
}

function YandexGetPurchaseCatalog(request)
{
    SendEventMessage('GetPurchaseCatalog', request);
}


// Ads
function YandexShowInterstitialAd(request)
{
    SendEventMessage('ShowFullscreenAd', request);
}

function YandexHideInterstitialAd(request)
{
    SendEventMessage('HideInterstitialAd', request);
}

let rewardRequest = null;
function YandexShowRewardVideo(request)
{
    SendEventMessage('ShowRewardVideo', request);
}

function YandexShowFullscrenAd()
{
    SendEventMessage('ShowFullscreenAd');
}

function YandexShowBanner(request)
{
    SendEventMessage('ShowBanner', request);
}

function YandexHideBanner(request)
{
    SendEventMessage('HideBanner', request);
}

// Storage
function YandexGetData(request)
{
    SendEventMessage('GetData', request);
}

function YandexSetData(request)
{
    SendEventMessage('SetData', request);
}

function YandexSetStats(request)
{
    SendEventMessage('SetStats', request);
}

function YandexGetStats(request)
{
    SendEventMessage('GetStats', request);
}

function YandexIncrementStats(request)
{
    SendEventMessage('IncrementStats', request);
}


// Leaderboards
function YandexInitializeLeaderboards(request)
{
    SendEventMessage('InitializeLeaderboards', request);
}

function YandexGetLeaderboardInfo(request)
{
    SendEventMessage('GetLeaderboardInfo', request);
}

function YandexSetLeaderboardScore(request)
{
    SendEventMessage('SetLeaderboardScore', request);
}

function YandexLeaderboardPlayer(request)
{
    SendEventMessage('LeaderboardPlayer', request);
}

function YandexGetLeaderboard(request)
{
    SendEventMessage('GetLeaderboard', request);
}

// TODO rewrite this item
// Languages
let browserLanguageCode = null;
function GetLanguageCode()
{
    if(browserLanguageCode != null)
        return browserLanguageCode;
    SendEventMessage('CheckBrowserLanguage');
}

function CacheBrowserLanguage(languageCode)
{
    browserLanguageCode = languageCode;
}

// Envorinment
let yandexEnvironmentData = null;
function GetEnvironmentJson()
{
    if(yandexEnvironmentData == null)
    {
        SendEventMessage('CheckEnvironmentData');
        return;
    }

    environment.appId = yandexEnvironmentData.environment.app.id;
    if(yandexEnvironmentData.environment.payload != null)
        environment.payload = yandexEnvironmentData.environment.payload;

    environment.screen.isFullscreen = yandexEnvironmentData.screen.fullscreen;

    environment.deviceInfo.isTv = yandexEnvironmentData.deviceInfo.isTv;
    environment.deviceInfo.isTable = yandexEnvironmentData.deviceInfo.isTable;
    environment.deviceInfo.deviceType = yandexEnvironmentData.deviceInfo.type;

    environment.browser.languageCode = yandexEnvironmentData.environment.browser.lang;
    environment.browser.topLevelDomain = yandexEnvironmentData.environment.i18n.tld;

    var result = JSON.stringify(environment);
    console.log('-Environment data: ' + result);

    return result;
}

function CacheEnvironmentData(data)
{
    yandexEnvironmentData = data;
}

function InitializeSkd()
{
    var param = {
        isMobile: IsMobilePlatform
    };
    SendEventMessage('Initialize', param);
}

document.onload = function()
{
    SendEventMessage('LoadBanners', rtbBannersData);
    GetEnvironmentJson();
}

InitializeSkd();
GetLanguageCode();
