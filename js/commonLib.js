//重置 selected 的 td
myApp.directive('clearTd',function(){
    return {
        restrict : 'A',
        link : function(scope,elem){
            $(elem).on('click',function(){
                $('.table-box td').removeClass('selected');
            });
        }
    };
});


//押注  td
myApp.directive('myTd',function(){
    return {
        restrict : 'A',
        scope : {
            flag : '@', // 1-10 or 冠亚和 渲染
            row : '=',
            selectedObj : '=',
            code : '@',
            value :'@'
        },
        template : '<div class="item-td">'+
                            '<p class="item-code">{{ flag=="true" ? row.codeName : value }}</p>'+
                            '<p class="item-value">{{ flag=="true" ? row.codeValue : row.codeValue[code]}}</p>'+
                   '</div>',
        link : function(scope,elem,attr){

            $(elem).on('click',function(){
                var key = attr.key, //字段key
                    rank = attr.rank, //名称
                    code = scope.code, // 冠亚 key
                    tab = attr.tab, // 1-5 or 6-10 or 冠亚
                    trid = attr.trid; //行号
                //console.log(key,rank,trid,code);
                if($('.table-box').hasClass('disabled')){
                    return;
                }
                if(code == 'firstSecond20'||code == 'firstSecond21'||code == 'firstSecond22'){ //空td 不操作
                    return;
                }

                if(!$(this).hasClass('selected')){
                    $(this).addClass('selected');
                    if(scope.flag=='true'){
                        scope.selectedObj[key+'-'+rank+'-'+trid+'-'+tab] = true;
                    }else{
                        scope.selectedObj[key+'-'+code+'-'+tab] = true;
                    }

                }else{
                    $(this).removeClass('selected');
                    if(scope.flag=='true'){
                        delete scope.selectedObj[key+'-'+rank+'-'+trid+'-'+tab];
                    }else{
                        delete scope.selectedObj[key+'-'+code+'-'+tab];
                    }
                }
            });
        }
    };
});




//顶部导航的指令
myApp.directive('navHeader',function() {
    return {
        restrict : 'AE',
        scope : {
            nowSelsect : '@selectActive',
            realtimeSelsect : '@realtimeActive'
        },
        templateUrl : './templates/nav/nav.html',
    };
});

//历史回退
myApp.directive('goback',function(){
    return {
        restrict : 'A',
        link : function(scope,elem){
            $(elem).on('click',function(){
                window.history.back();
            });
        }
    };
});

// 切换 class active 指令
myApp.directive('tabActive',function(){
    return {
        restrict : 'A',
        link : function(scope,elem,attr){
            $(elem).on('click',function(ev){
                $(elem).siblings('li').removeClass('active');
                $(this).addClass('active');
            });
        }
    };
});


//loading
myApp.directive('loading',['$http' ,function ($http){
    return {
        restrict: 'A',
        link: function (scope, elm, attrs){
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading,function(v){
                if(v){
                    elm.show();
                }else{
                    elm.hide();
                }
            });
        }
    };
}]);

//拼接加密算法
myApp.factory('encrypt', ['$location', 'sha1', function($location, sha1) {
    function getUrlInfo(url,bodyQuery) {
        var arrUrl = url.split("//");
        var queryObj = {};
        var start = arrUrl[1].indexOf("/");
        var relUrl = arrUrl[1].substring(start);
        console.log(relUrl,'relUrl');
        var path = '';
        if (relUrl.indexOf("?") != -1) {
            path = relUrl.split("?")[0];
        }else{
            path = relUrl;
        }
        if (url.indexOf("?") != -1) {
            var searchStr = '?'+relUrl.split("?")[1];
            var str = searchStr.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                queryObj[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return {url: url, domain: arrUrl[1].substring(0,start), path: path, searchObj:queryObj,params:bodyQuery};
    }

    return {
        getAuthor: function(url, bodyQuery,secretKey) {
            var urlObj = getUrlInfo(url,bodyQuery);
            console.log(urlObj,'urlObj');
            //return;
            if(angular.isObject(urlObj.params)){
                urlObj.searchObj.requestBody = JSON.stringify(urlObj.params);
            }
            var keyArr = [];
            angular.forEach(urlObj.searchObj, function(val, key) {
                keyArr.push(key);
            });
            keyArr.sort();
            //console.log(keyArr);
            var keyStr = '';
            angular.forEach(keyArr, function(val, index) {
                keyStr += urlObj.searchObj[val];
            });
            console.log(urlObj.path + keyStr + secretKey,'加密的字串');
            console.log(secretKey,'secretKey');
            return sha1.hash(urlObj.path + keyStr + secretKey).toUpperCase();
        }
    };
}]);


//在所有请求中添加 配置
myApp.factory('HttpInterceptor', ['$q','$injector', 'localStorageService', function($q,$injector, localStorageService) {
    return {
        // 请求发出之前，可以用于添加各种身份验证信息
        request: function(config) {
            //对所有的请求添加 验证
            if (localStorageService.get('Authorization')) {
                //console.log(localStorageService.get('Authorization'),'location');
                config.headers.Authorization = localStorageService.get('Authorization');
                config.headers.Accesskey = localStorageService.get('Accesskey');
            }
            return config;
        },
        // 请求发出时出错
        requestError: function(err) {
            //console.log('request config error');
            return $q.reject(err);
        },
        // 成功返回了响应
        response: function(res) {
            console.log(res,'response config success');
            if(res.data.result === 'NO_LOGIN') {
                console.log('登录态丢失');
                $injector.get('$state').transitionTo('login');
                //return $q.reject(response);
            }
            return res;
        },
        // 返回的响应出错，包括后端返回响应时，设置了非 200 的 http 状态码
        responseError: function(err) {
            //console.log('response config error');
            return $q.reject(err);
        }
    };
}]);


//时间格式化
myApp.filter('toMinSec', function() {
    return function(time) {
        if(time<0){
            return '00:00';
        }
        var totalSec = time / 1000;
        var min = parseInt(totalSec / 60);
        var sec = parseInt(totalSec % 60);
        if (min < 10) {
            min = '0' + min;
        }
        if (sec < 10) {
            sec = '0' + sec;
        }
        return min + ':' + sec;
    };
});

//过滤数据
myApp.filter('splitArrFilter',function(){
    return function(o){
        if(typeof o == 'object'){
            var str ='';
            for(var i=0;i<o.length;i++){
                if(i===0){
                    str += o[i];
                }else{
                    str += '<span class="paddingTips">|</span>'+o[i];
                }
            }
            return str;
        }else{
            return o;
        }
    };
});


//组装 押注 要发送的数据
myApp.factory('makeSendData',function(){
    return {
        makeParams : function(sendData,selectData,money){
            var keyCode = ['big','small','odd','even']; //大小单双
            var keyCodeUp = ['firstUp','secondUp','thirdUp','fourthUp','fifthUp'];//龙
            var keyCodeDown = ['firstDowm','secondDowm','thirdDowm','fourthDowm','fifthDowm'];//虎
            var sortArr = ['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth'];

            money = parseInt(money);

            angular.forEach(selectData,function(value,itemkey){
                var arr = itemkey.split('-'); // rankingStakeList-7-4  or commonStake-firstSecond12
                var key = '',carSort='',tr='';
                if(arr[3] == 'tab1'){ //1-5
                        key = arr[0];
                        carSort = arr[1];
                        tr = arr[2];
                    switch (parseInt(tr)) {
                        case 1:  //大小单双
                        case 2:
                        case 3:
                        case 4:
                            //console.log('大小单双');
                            sendData[key][carSort-1][keyCode[tr-1]] = money;
                            break;
                        case 5:
                            //console.log('龙');
                            sendData[key][keyCodeUp[carSort-1]] = money;
                            break;
                        case 6:
                            //console.log('虎');
                            sendData[key][keyCodeDown[carSort-1]] = money;
                            break;
                        default :
                            //console.log('1-10名');
                            sendData[key][tr-7][sortArr[carSort-1]] = money;
                            break;
                    }
                }else if(arr[3]=='tab2'){ // 6-10
                        key = arr[0];
                        carSort = arr[1];
                        tr = arr[2];

                    switch (parseInt(tr)) {
                        case 1:  //大小单双
                        case 2:
                        case 3:
                        case 4:
                            //console.log('大小单双5-10');
                            sendData[key][carSort-1][keyCode[tr-1]] = money;
                            break;
                        default :
                            //console.log('1-10名');
                            sendData[key][tr-5][sortArr[carSort-1]] = money;
                            break;
                    }
                }else{ //冠亚
                    var keyItem = arr[0];
                    var keyCodeItem = arr[1];
                    sendData[keyItem][keyCodeItem] = money;
                }
            });

            return sendData;
        }
    };
});

//初始化数据
myApp.factory('initSendData',function(){
    return {
        init : function(dataJson){
            $.each(dataJson, function(key, obj) {
                switch (key) {
                    case 'commonStake':
                        $.each(obj, function(k, v) {
                            obj[k] = 0;
                        });
                        break;
                    case 'appointStakeList':
                    case 'rankingStakeList':
                        $.each(obj, function(index, val) {
                            $.each(val,function(k,v){
                                if(k !== 'carNum' && k !== 'rankingNum'){
                                    val[k] = 0;
                                }
                            });
                        });
                        break;
                    default:
                        return false;
                }
            });
            return dataJson;
        }
    };
});

//押注时 初始状态的 sendData 数据
myApp.factory('baseData',function(){
    return  {
        'tab1' : [
            {'codeName':'大','codeValue':1.94,'key':'rankingStakeList'},
            {'codeName':'小','codeValue':1.94,'key':'rankingStakeList'},
            {'codeName':'单','codeValue':1.94,'key':'rankingStakeList'},
            {'codeName':'双','codeValue':1.94,'key':'rankingStakeList'},
            {'codeName':'龙','codeValue':1.94,'key':'commonStake'},
            {'codeName':'虎','codeValue':1.94,'key':'commonStake'},
            {'codeName':'1','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'2','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'3','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'4','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'5','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'6','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'7','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'8','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'9','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'10','codeValue':9.7,'key':'appointStakeList'}
        ],
        'tab2' : [
            {'codeName':'大','codeValue':1.94,'key':'rankingStakeList'},
            {'codeName':'小','codeValue':1.94,'key':'rankingStakeList'},
            {'codeName':'单','codeValue':1.94,'key':'rankingStakeList'},
            {'codeName':'双','codeValue':1.94,'key':'rankingStakeList'},
            {'codeName':'1','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'2','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'3','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'4','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'5','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'6','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'7','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'8','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'9','codeValue':9.7,'key':'appointStakeList'},
            {'codeName':'10','codeValue':9.7,'key':'appointStakeList'}
        ],
        'tab3' : [
            {
                'codeName':{
                    'firstSecond3':3,
                    'firstSecond4':4,
                    'firstSecond5':5,
                    'firstSecond6':6
                },
                'codeValue':{
                    'firstSecond3':41,
                    'firstSecond4':41,
                    'firstSecond5':21,
                    'firstSecond6':21
                }
            },
            {
                'codeName':{
                    'firstSecond7':7,
                    'firstSecond8':8,
                    'firstSecond9':9,
                    'firstSecond10':10
                },
                'codeValue':{
                    'firstSecond7':12,
                    'firstSecond8':12,
                    'firstSecond9':10.3,
                    'firstSecond10':10.3
                }
            },
            {
                'codeName':{
                    'firstSecond11':11,
                    'firstSecond12':12,
                    'firstSecond13':13,
                    'firstSecond14':14
                },
                'codeValue':{
                    'firstSecond11':8.3,
                    'firstSecond12':10.3,
                    'firstSecond13':10.3,
                    'firstSecond14':12
                }
            },
            {
                'codeName':{
                    'firstSecond15':15,
                    'firstSecond16':16,
                    'firstSecond17':17,
                    'firstSecond18':18
                },
                'codeValue':{
                    'firstSecond15':12,
                    'firstSecond16':21,
                    'firstSecond17':21,
                    'firstSecond18':41
                }
            },
            {
                'codeName':{
                    'firstSecond19':19,
                    'firstSecond20':'',
                    'firstSecond21':'',
                    'firstSecond22':'',
                },
                'codeValue':{
                    'firstSecond19':41,
                    'firstSecond20':'',
                    'firstSecond21':'',
                    'firstSecond22':'',
                }
            },
            {
                'codeName':{
                    'firstSecondBig':'冠亚大',
                    'firstSecondSmall':'冠亚小',
                    'firstSecondOdd':'冠亚单',
                    'firstSecondEven':'冠亚双'
                },
                'codeValue':{
                    'firstSecondBig':2,
                    'firstSecondSmall':1.63,
                    'firstSecondOdd':1.63,
                    'firstSecondEven':2
                }
            }
        ],
        sendData : {
            "commonStake": {//普通押注
                  "firstUp": 0,//第一名龙金额
                  "firstDowm": 0,//第一名虎金额
                  "secondUp": 0,//第二名龙金额
                  "secondDowm": 0,//第二名虎金额
                  "thirdUp": 0,//第三名龙金额
                  "thirdDowm": 0,//第三名虎金额
                  "fourthUp": 0,//第四名龙金额
                  "fourthDowm": 0,//第四名虎金额
                  "fifthUp": 0,//第五名龙金额
                  "fifthDowm": 0,//第五名虎金额
                  "firstSecondOdd": 0,//冠亚和单金额
                  "firstSecondEven": 0,//冠亚和双金额
                  "firstSecondBig": 0,//冠亚和大金额
                  "firstSecondSmall": 0,//冠亚和小金额
                  "firstSecond3": 0,//冠亚和结果3金额
                  "firstSecond4": 0,//冠亚和结果4金额
                  "firstSecond5": 0,//冠亚和结果5金额
                  "firstSecond6": 0,//冠亚和结果6金额
                  "firstSecond7": 0,//冠亚和结果7金额
                  "firstSecond8": 0,//冠亚和结果8金额
                  "firstSecond9": 0,//冠亚和结果9金额
                  "firstSecond10": 0,//冠亚和结果10金额
                  "firstSecond11": 0,//冠亚和结果11金额
                  "firstSecond12": 0,//冠亚和结果12金额
                  "firstSecond13": 0,//冠亚和结果13金额
                  "firstSecond14": 0,//冠亚和结果14金额
                  "firstSecond15": 0,//冠亚和结果15金额
                  "firstSecond16": 0,//冠亚和结果16金额
                  "firstSecond17": 0,//冠亚和结果17金额
                  "firstSecond18": 0,//冠亚和结果18金额
                  "firstSecond19": 0//冠亚和结果19金额
              },
              "appointStakeList": [//车辆名次指定押注
                  {//车号为1的名次押注
                      "carNum": 1,//车号1，死值
                      "first": 0,//第一名金额
                      "second": 0,//第二名金额
                      "third": 0,//第三名金额
                      "fourth": 0,//第四名金额
                      "fifth": 0,//第五名金额
                      "sixth": 0,//第六名金额
                      "seventh": 0,//第七名金额
                      "eighth": 0,//第八名金额
                      "ninth": 0,//第九名金额
                      "tenth": 0//第十名金额
                  },
                  {//车号为2的名次押注
                      "carNum": 2,//车号2，死值
                      "first": 0,
                      "second": 0,
                      "third": 0,
                      "fourth": 0,
                      "fifth": 0,
                      "sixth": 0,
                      "seventh": 0,
                      "eighth": 0,
                      "ninth": 0,
                      "tenth": 0
                  },
                  {//车号为3的名次押注
                      "carNum": 3,//车号3，死值
                      "first": 0,
                      "second": 0,
                      "third": 0,
                      "fourth": 0,
                      "fifth": 0,
                      "sixth": 0,
                      "seventh": 0,
                      "eighth": 0,
                      "ninth": 0,
                      "tenth": 0
                  },
                  {//车号为4的名次押注
                      "carNum": 4,//车号4，死值
                      "first": 0,
                      "second": 0,
                      "third": 0,
                      "fourth": 0,
                      "fifth": 0,
                      "sixth": 0,
                      "seventh": 0,
                      "eighth": 0,
                      "ninth": 0,
                      "tenth": 0
                  },
                  {//车号为5的名次押注
                      "carNum": 5,//车号5，死值
                      "first": 0,
                      "second": 0,
                      "third": 0,
                      "fourth": 0,
                      "fifth": 0,
                      "sixth": 0,
                      "seventh": 0,
                      "eighth": 0,
                      "ninth": 0,
                      "tenth": 0
                  },
                  {//车号为6的名次押注
                      "carNum": 6,//车号6，死值
                      "first": 0,
                      "second": 0,
                      "third": 0,
                      "fourth": 0,
                      "fifth": 0,
                      "sixth": 0,
                      "seventh": 0,
                      "eighth": 0,
                      "ninth": 0,
                      "tenth": 0
                  },
                  {//车号为7的名次押注
                      "carNum": 7,//车号7，死值
                      "first": 0,
                      "second": 0,
                      "third": 0,
                      "fourth": 0,
                      "fifth": 0,
                      "sixth": 0,
                      "seventh": 0,
                      "eighth": 0,
                      "ninth": 0,
                      "tenth": 0
                  },
                  {//车号为8的名次押注
                      "carNum": 8,//车号8，死值
                      "first": 0,
                      "second": 0,
                      "third": 0,
                      "fourth": 0,
                      "fifth": 0,
                      "sixth": 0,
                      "seventh": 0,
                      "eighth": 0,
                      "ninth": 0,
                      "tenth": 0
                  },
                  {//车号为9的名次押注
                      "carNum": 9,//车号9，死值
                      "first": 0,
                      "second": 0,
                      "third": 0,
                      "fourth": 0,
                      "fifth": 0,
                      "sixth": 0,
                      "seventh": 0,
                      "eighth": 0,
                      "ninth": 0,
                      "tenth": 0
                  },
                  {//车号为10的名次押注
                      "carNum": 10,//车号10，死值
                      "first": 0,
                      "second": 0,
                      "third": 0,
                      "fourth": 0,
                      "fifth": 0,
                      "sixth": 0,
                      "seventh": 0,
                      "eighth": 0,
                      "ninth": 0,
                      "tenth": 0
                  }
              ],
              "rankingStakeList": [//名次情况押注
                  {//排名第一的具体情况
                      "rankingNum": 1,//第1名，死值
                      "big": 0,//大金额
                      "small": 0,//小金额
                      "odd": 0,//单金额
                      "even": 0//双金额
                  },
                  {//排名第二的具体情况
                      "rankingNum": 2,//第2名，死值
                      "big": 0,
                      "small": 0,
                      "odd": 0,
                      "even": 0
                  },
                  {//排名第三的具体情况
                      "rankingNum": 3,//第3名，死值
                      "big": 0,
                      "small": 0,
                      "odd": 0,
                      "even": 0
                  },
                  {//排名第四的具体情况
                     "rankingNum": 4,//第4名，死值
                      "big": 0,
                      "small": 0,
                      "odd": 0,
                      "even": 0
                  },
                  {//排名第五的具体情况
                      "rankingNum": 5,//第5名，死值
                      "big": 0,
                      "small": 0,
                      "odd": 0,
                      "even": 0
                  },
                  {//排名第六的具体情况
                      "rankingNum": 6,//第6名，死值
                      "big": 0,
                      "small": 0,
                      "odd": 0,
                      "even": 0
                  },
                  {//排名第七的具体情况
                      "rankingNum": 7,//第7名，死值
                      "big": 0,
                      "small": 0,
                      "odd": 0,
                      "even": 0
                  },
                  {//排名第八的具体情况
                      "rankingNum": 8,//第8名，死值
                      "big": 0,
                      "small": 0,
                      "odd": 0,
                      "even": 0
                  },
                  {//排名第九的具体情况
                     "rankingNum": 9,//第9名，死值
                      "big": 0,
                      "small": 0,
                      "odd": 0,
                      "even": 0
                  },
                  {//排名第十的具体情况
                      "rankingNum": 10,//第10名，死值
                      "big": 0,
                      "small": 0,
                      "odd": 0,
                      "even": 0
                  }
              ]
        }
    };
});
