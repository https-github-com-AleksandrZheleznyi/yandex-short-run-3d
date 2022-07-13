const enums = {
    BANNER_POS: {
        Top: 'Top',
        Bottom: 'Bottom',
        Left: 'Left',
        Right: 'Right',
        Center: 'Center',
        Fullscreen: 'Fullscreen'
    },
    MESSAGES : {
        NotInitPurchases: 'Purchases uninitialized!',
        UserNotLogged: 'The user is not logged in',
        LeaderboardsNotInit: 'Leaderboards not initialized'
    }
}

var sdk = null;
var player = null;
var payments = null;
var locStorage = null;
var leaderboards = null;

function StartPage()
{
    for(var key in enums.BANNER_POS)
    {
        try
        {
            document.getElementById(enums.BANNER_POS[key]).style.display='none';
        }
        catch (error) { }
    }
}

// Init Yandex SKD
function InitializeYandexGamesSdk()
{
    YaGames.init({
        adv: {
            onAdvClose: wasShown => {
                console.info('adv closed!');
            }
        }
    }).then(ysdk => {
        sdk = ysdk;
        YandexShowFullscrenAd();
    });
}

// User Authorization
function YandexAuthorizationUser(request)
{
    sdk.getPlayer({ scopes: JSON.parse(request.jsonData.toLowerCase()) }).then(_player =>
    {
        player = _player;
        SendSuccessMessage(request);
    }).catch(err =>
    {
        player = null;
        SendFailedMessage(request, JSON.stringify(err));
    });
}

function YandexShowAuthorizationDialog(request)
{
    sdk.auth.openAuthDialog().then(() =>
    {
        SendSuccessMessage(request);
    }).catch(() =>
    {
        SendFailedMessage(request, 'Player is not authorized.');
    });
}

// Purchases
function YandexInitializePurchases(request)
{
    sdk.getPayments({ signed: request.jsonData }).then(_payments =>
    {
        payments = _payments;
        SendSuccessMessage(request);
    }).catch(err =>
    {
        SendFailedMessage(request, err);
    });
}

function YandexPurchase(request)
{
    if(payments == null)
    {
        SendFailedMessage(request, enums.MESSAGES.NotInitPurchases);
        return;
    }
    payments.purchase({ id: request.jsonData }).then(purchase =>
    {
        SendSuccessMessage(request);
    }).catch(err =>
    {
        SendFailedMessage(request, err);
    })
}

function YandexGetPurchasedProducts(request)
{
    if(payments == null)
    {
        SendFailedMessage(request, enums.MESSAGES.NotInitPurchases);
        return;
    }
    payments.getPurchases().then(purchases =>
    {
        SendSuccessMessage(request,  JSON.stringify({ products: purchases }));
    }).catch(err =>
    {
        SendFailedMessage(request, err);
    })
}

function YandexGetPurchaseCatalog(request)
{
    if(payments == null)
    {
        SendFailedMessage(request, enums.MESSAGES.NotInitPurchases);
        return;
    }
    payments.getCatalog().then(products =>
    {
        SendSuccessMessage(request,  JSON.stringify({ products: products }));
    }).catch(err =>
    {
        SendFailedMessage(request, err);
    });
}


// Ads
function YandexShowInterstitialAd(request)
{
    var requestData = JSON.parse(request.jsonData);
    if(requestData._id == 'yandex_interstitial_block')
        YandexShowFullscrenAd();

    var render = IsMobilePlatform ? enums.BANNER_POS.Fullscreen : enums.BANNER_POS.Center;
    setElementByIdStyleType(render, 'block');
    SendSuccessMessage(request);
}

function YandexHideInterstitialAd(request)
{
    var render = IsMobilePlatform ? enums.BANNER_POS.Fullscreen : enums.BANNER_POS.Center;
    setElementByIdStyleType(render, 'none');
    SendSuccessMessage(request);
}

let rewardRequest = null;
function YandexShowRewardVideo(request)
{
    if(rewardRequest != null || showedRewardVideo == true)
    {
        console.log('-It is not possible to show the video ad block for the reward yet, since it is already being shown.');
        return;
    }

    rewardRequest = request;
    sdk.adv.showRewardedVideo({
        callbacks: { onOpen: () =>
            {
                showedRewardVideo = true;
            },
            onRewarded: () =>
            {
                SendSuccessMessage(rewardRequest);
            },
            onClose: () => {
                SendClosedMessage(rewardRequest);
                showedRewardVideo = false;
                rewardRequest = null;
            },
            onError: (err) => {
                var errorMessage = '-Reward video: failed show reward video. ' + err;
                SendFailedMessage(rewardRequest, errorMessage);

                showedRewardVideo = false;
                rewardRequest = null;
            }
        }
    })
}

function YandexShowFullscrenAd()
{
    sdk.adv.showFullscreenAdv({
        callbacks: {
            onClose: function(wasShown)
            {
                console.log('-Closed Yandex fullscreen ad. Was showed: '+wasShown)
            },
            onError: function(err)
            {
                console.log('-Failed show Yandex fullscreen ad: '+err)
            }
        }
    })
}

function YandexShowBanner(request)
{
    if(request == null)
    {
        SendFailedMessage(request, '-Failed show banner block. Request equal of null.');
        return;
    }

    var banner = JSON.parse(request.jsonData);
    if(banner == null)
    {
        SendFailedMessage(request, '-Failed show banner block. BannerData equal of null.');
        return;
    }

    setElementByIdStyleType(banner._position, 'block');
    SendSuccessMessage(request);
}

function YandexHideBanner(request)
{
    if(request == null)
    {
        SendFailedMessage(request, '-Failed show banner block. Request equal of null.');
        return;
    }

    var banner = JSON.parse(request.jsonData);
    if(banner == null)
    {
        SendFailedMessage(request, '-Failed show banner block. BannerData equal of null.');
        return;
    }

    setElementByIdStyleType(banner._position, 'none');
    SendSuccessMessage(request);
}

// Storage
function YandexGetData(request)
{
    if(player == null)
    {
        SendFailedMessage(request, enums.MESSAGES.UserNotLogged);
        return;
    }
    var requestData = JSON.parse(request.jsonData);
    player.getData(requestData.keys).then(data =>
    {
        var result = GetKeysValuesArrays(data);
        SendSuccessMessage(request, JSON.stringify(result));
    }).catch(err =>
    {
        SendFailedMessage(request, err);
    });
}

function YandexSetData(request)
{
    if(player == null)
    {
        SendFailedMessage(request, enums.MESSAGES.UserNotLogged);
        return;
    }
    var data = KeysValuesToObject(JSON.parse(request.jsonData));
    player.setData(data).then(() => //(data, true)
    {
        SendSuccessMessage(request);
    }).catch(err =>
    {
        SendFailedMessage(request, err);
    });
}

function YandexSetStats(request)
{
    if(player == null)
    {
        SendFailedMessage(request, enums.MESSAGES.UserNotLogged);
        return;
    }
    var stats = KeysValuesToObject(JSON.parse(request.jsonData));
    player.setStats(stats).then(() =>
    {
        SendSuccessMessage(request);
    }).catch(err =>
    {
        SendFailedMessage(request, err);
    });
}

function YandexGetStats(request)
{
    if(player == null)
    {
        SendFailedMessage(request, enums.MESSAGES.UserNotLogged);
        return;
    }
    var requestData = JSON.parse(request.jsonData);
    player.getStats(requestData.keys).then(stats =>
    {
        var result = GetKeysValuesArrays(stats);
        SendSuccessMessage(request, JSON.stringify(result));
    }).catch(err =>
    {
        SendFailedMessage(request, err);
    });
}

function YandexIncrementStats(request)
{
    if(player == null)
    {
        SendFailedMessage(request, enums.MESSAGES.UserNotLogged);
        return;
    }
    var increments = KeysValuesToObject(JSON.parse(request.jsonData));
    player.incrementStats(increments).then(() =>
    {
        SendSuccessMessage(request);
    }).catch(err =>
    {
        SendFailedMessage(request, err);
    });
}

function KeysValuesToObject(keyPairs)
{
    var stats = {};
    for(var i = 0 ; i < keyPairs.keys.length; i++)
        stats[keyPairs.keys[i]] = keyPairs.values[i];
    return stats;
}

function GetKeysValuesArrays(obj)
{
    var keys = [];
    var values = [];
    for(var key in obj)
        if(obj.hasOwnProperty(key))
        {
            keys.push(key);
            values.push(obj[key]);
        }
    return {
        keys: keys,
        values: values
    }
}


// Leaderboards
function YandexInitializeLeaderboards(request)
{
    sdk.getLeaderboards().then(_lb =>
    {
        leaderboards = _lb;
        SendSuccessMessage(request);
    }).catch(err =>
    {
        SendFailedMessage(request, err);
    });
}

function YandexGetLeaderboardInfo(request)
{
    if(player == null)
    {
        SendFailedMessage(request, enums.MESSAGES.UserNotLogged);
        return;
    }
    if(leaderboards == null)
    {
        SendFailedMessage(request, enums.MESSAGES.LeaderboardsNotInit);
        return;
    }

    leaderboards.getLeaderboardDescription(request.jsonData).then(res =>
    {
        SendSuccessMessage(request, JSON.stringify(res));
    }).catch(err =>
    {
        SendFailedMessage(request, err);
    });
}

function YandexSetLeaderboardScore(request)
{
    if(player == null)
    {
        SendFailedMessage(request, enums.MESSAGES.UserNotLogged);
        return;
    }
    if(leaderboards == null)
    {
        SendFailedMessage(request, enums.MESSAGES.LeaderboardsNotInit);
        return;
    }

    var requestData = JSON.parse(request.jsonData);
    if(requestData.extraData == null)
        leaderboards.setLeaderboardScore(requestData.leaderboardName, requestData.score);
    else
        leaderboards.setLeaderboardScore(requestData.leaderboardName, requestData.score, requestData.extraData);

    SendSuccessMessage(request);
}

function YandexLeaderboardPlayer(request)
{
    if(player == null)
    {
        SendFailedMessage(request, enums.MESSAGES.UserNotLogged);
        return;
    }
    if(leaderboards == null)
    {
        SendFailedMessage(request, enums.MESSAGES.LeaderboardsNotInit);
        return;
    }

    leaderboards.getLeaderboardPlayerEntry(request.jsonData).then(res =>
    {
        SendSuccessMessage(request, JSON.stringify(res));
    }).catch(err =>
    {
        var message = err.code != null ? err.code : JSON.stringify(err);
        SendFailedMessage(request, message);
    });
}

function YandexGetLeaderboard(request)
{
    if(player == null)
    {
        SendFailedMessage(request, enums.MESSAGES.UserNotLogged);
        return;
    }
    if(leaderboards == null)
    {
        SendFailedMessage(request, enums.MESSAGES.LeaderboardsNotInit);
        return;
    }

    var requestData = JSON.parse(request.jsonData);
    leaderboards.getLeaderboardEntries(requestData.leaderboardId, requestData.parameters).then(res =>
    {
        SendSuccessMessage(request, JSON.stringify(res));
    }).catch(err =>
    {
        SendFailedMessage(request, err);
    });
}

// Languages
function GetLanguageCode()
{
    if(enabledDefaultLanguage == true) 
        return defaultLanguageCode;
    if(sdk == null)
        return "en";
    return sdk.environment.i18n.lang;
}

// Native Ads Banner
function RTBrefresh(blockId, render)
{
    console.log('-BlockId: ' + blockId + ', Render: ' + render);
    window.yaContextCb.push(()=>{
        Ya.Context.AdvManager.render({
            renderTo: render,
            blockId: blockId.replace("yandex_rtb_", "")
        })
    });
}

function LoadBanner()
{
    if(IsMobilePlatform)
    {
        RTBrefresh("R-A-1621043-28", "Bottom");
RTBrefresh("R-A-1621043-30", "Fullscreen");

    } else
    {
        RTBrefresh("R-A-1621043-29", "Bottom");
RTBrefresh("R-A-1621043-31", "Center");

    }
}

// Envorinment
function GetEnvironmentJson()
{
    if(sdk == null)
    {
        console.log('--SDK is equal of null');
        return;
    }
    
    environment.appId = sdk.environment.app.id;
    console.log('--App ID : ' + environment.appId);
    if(sdk.environment != null)
    {
        if(sdk.environment.payload != null)
            environment.payload = sdk.environment.payload;

        if(sdk.environment.browser != null)
            environment.browser.languageCode = sdk.environment.browser.lang;
        
        if(sdk.environment.i18n != null)
            environment.browser.topLevelDomain = sdk.environment.i18n.tld;
    }
    
    if(sdk.screen != null)
    {
        environment.screen.isFullscreen = sdk.screen.fullscreen;
        if(sdk.screen.orientation != null
            && sdk.screen.orientation.value
            && sdk.screen.orientation.lock)
        {
            environment.screen.orientation.value = sdk.screen.orientation.value;
            environment.screen.orientation.isLock = sdk.screen.orientation.lock;
        }
    }

    if(sdk.deviceInfo != null)
    {
        environment.deviceInfo.isTv = sdk.deviceInfo.isTV();
        environment.deviceInfo.isTable = sdk.deviceInfo.isTablet();
        environment.deviceInfo.deviceType = sdk.deviceInfo.type;
    }
    
    var result = JSON.stringify(environment);
    console.log(result);
    return result;
}

StartPage();
LoadBanner();
setInterval(LoadBanner, 30000);
