// mainctrl
// myApp.controller('mainctrl',['$scope',function($scope){
//
// }]);
//
// //导航控制器
// myApp.controller('navLoginCtrl',['$scope',function($scope){
//
// }]);

//顶部导航的 用户登录显示
myApp.controller('userLoginedCtrl',['$scope','$state','$rootScope','localStorageService',function($scope,$state,$rootScope,localStorageService){
    $scope.username = localStorageService.get('username');
    $scope.logout = function(){
        localStorageService.clearAll();
        $state.go('login');
    };
}]);


//用户登录
myApp.controller('loginCtrl',['$scope','$http','$state','$rootScope','localStorageService',function($scope,$http,$state,$rootScope,localStorageService){


    if(!localStorageService.isSupported){
        alert('您的浏览器版本太低，请升级高版本浏览器');
        return;
    }

    if(localStorageService.get('username')){
        $rootScope.username = localStorageService.get('username');
        $state.go('realtime');
        return;
    }

    //登录请求获取 Accesskey 和 secretKey
    $scope.loginSubmit = function(){
        var params = {
            userName : $scope.username,
            password : $scope.password
        };
        $http({
            url : 'http://60.205.163.65:8080/user/web/login',
            method : 'post',
            headers : {
                'Content-Type': 'application/json;charset=utf-8;'
            },
            data: params
        }).then(function(res){
            //console.log(res,'分盘用户登录');

            var data = res.data;
            if(data.result == 'SUCCESS'){
                //var userType = true; // 用户的级别
                $rootScope.username = $scope.username;
                if(localStorageService.isSupported) {
                    localStorageService.set('Accesskey',data.data.accessKey);
                    localStorageService.set('secretKey',data.data.securityKey);
                    localStorageService.set('username',$scope.username);
                    //localStorageService.set('userType',userType);
                }else{
                    alert('您的浏览器版本太低，请升级高版本浏览器');
                }
                $state.go('realtime');
            }else{
                alert('用户名或密码有误请重试');
            }


        },function(err){
            //console.log(err);
        });
    };
}]);


//实时开奖
myApp.controller('realtimeCtrl',['$scope','$rootScope','$http','$timeout','$filter','$state','encrypt','localStorageService',function($scope,$rootScope,$http,$timeout,$filter,$state,encrypt,localStorageService){

    $scope.table1 = [];
    $scope.table2 = [];
    function maketableDate(json){
        //1-10 表格数据
        $scope.table1 = [
            //1
            [
                {key:'大',value:1.94,money:json.rankingStakeList[0].big},
                {key:'大',value:1.94,money:json.rankingStakeList[1].big},
                {key:'大',value:1.94,money:json.rankingStakeList[2].big},
                {key:'大',value:1.94,money:json.rankingStakeList[3].big},
                {key:'大',value:1.94,money:json.rankingStakeList[4].big},
                {key:'大',value:1.94,money:json.rankingStakeList[5].big},
                {key:'大',value:1.94,money:json.rankingStakeList[6].big},
                {key:'大',value:1.94,money:json.rankingStakeList[7].big},
                {key:'大',value:1.94,money:json.rankingStakeList[8].big},
                {key:'大',value:1.94,money:json.rankingStakeList[9].big}
            ],
            //2
            [
                {key:'小',value:1.94,money:json.rankingStakeList[0].small},
                {key:'小',value:1.94,money:json.rankingStakeList[1].small},
                {key:'小',value:1.94,money:json.rankingStakeList[2].small},
                {key:'小',value:1.94,money:json.rankingStakeList[3].small},
                {key:'小',value:1.94,money:json.rankingStakeList[4].small},
                {key:'小',value:1.94,money:json.rankingStakeList[5].small},
                {key:'小',value:1.94,money:json.rankingStakeList[6].small},
                {key:'小',value:1.94,money:json.rankingStakeList[7].small},
                {key:'小',value:1.94,money:json.rankingStakeList[8].small},
                {key:'小',value:1.94,money:json.rankingStakeList[9].small}
            ],
            //3
            [
                {key:'单',value:1.94,money:json.rankingStakeList[0].odd},
                {key:'单',value:1.94,money:json.rankingStakeList[1].odd},
                {key:'单',value:1.94,money:json.rankingStakeList[2].odd},
                {key:'单',value:1.94,money:json.rankingStakeList[3].odd},
                {key:'单',value:1.94,money:json.rankingStakeList[4].odd},
                {key:'单',value:1.94,money:json.rankingStakeList[5].odd},
                {key:'单',value:1.94,money:json.rankingStakeList[6].odd},
                {key:'单',value:1.94,money:json.rankingStakeList[7].odd},
                {key:'单',value:1.94,money:json.rankingStakeList[8].odd},
                {key:'单',value:1.94,money:json.rankingStakeList[9].odd}
            ],
            //4
            [
                {key:'双',value:1.94,money:json.rankingStakeList[0].even},
                {key:'双',value:1.94,money:json.rankingStakeList[1].even},
                {key:'双',value:1.94,money:json.rankingStakeList[2].even},
                {key:'双',value:1.94,money:json.rankingStakeList[3].even},
                {key:'双',value:1.94,money:json.rankingStakeList[4].even},
                {key:'双',value:1.94,money:json.rankingStakeList[5].even},
                {key:'双',value:1.94,money:json.rankingStakeList[6].even},
                {key:'双',value:1.94,money:json.rankingStakeList[7].even},
                {key:'双',value:1.94,money:json.rankingStakeList[8].even},
                {key:'双',value:1.94,money:json.rankingStakeList[9].even}
            ],
            //5
            [
                {key:'龙',value:1.94,money:json.commonStake.firstUp},
                {key:'龙',value:1.94,money:json.commonStake.secondUp},
                {key:'龙',value:1.94,money:json.commonStake.thirdUp},
                {key:'龙',value:1.94,money:json.commonStake.fourthUp},
                {key:'龙',value:1.94,money:json.commonStake.fifthUp},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''}
            ],
            //6
            [
                {key:'虎',value:1.94,money:json.commonStake.firstDowm},
                {key:'虎',value:1.94,money:json.commonStake.secondDowm},
                {key:'虎',value:1.94,money:json.commonStake.thirdDowm},
                {key:'虎',value:1.94,money:json.commonStake.fourthDowm},
                {key:'虎',value:1.94,money:json.commonStake.fifthDowm},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''},
                {key:'',value:'',money:''}
            ],
            //7
            [
                {key:1,value:9.7,money:json.appointStakeList[0].first},
                {key:1,value:9.7,money:json.appointStakeList[0].second},
                {key:1,value:9.7,money:json.appointStakeList[0].third},
                {key:1,value:9.7,money:json.appointStakeList[0].fourth},
                {key:1,value:9.7,money:json.appointStakeList[0].fifth},
                {key:1,value:9.7,money:json.appointStakeList[0].sixth},
                {key:1,value:9.7,money:json.appointStakeList[0].seventh},
                {key:1,value:9.7,money:json.appointStakeList[0].eighth},
                {key:1,value:9.7,money:json.appointStakeList[0].ninth},
                {key:1,value:9.7,money:json.appointStakeList[0].tenth}
            ],
            //8
            [
                {key:2,value:9.7,money:json.appointStakeList[1].first},
                {key:2,value:9.7,money:json.appointStakeList[1].second},
                {key:2,value:9.7,money:json.appointStakeList[1].third},
                {key:2,value:9.7,money:json.appointStakeList[1].fourth},
                {key:2,value:9.7,money:json.appointStakeList[1].fifth},
                {key:2,value:9.7,money:json.appointStakeList[1].sixth},
                {key:2,value:9.7,money:json.appointStakeList[1].seventh},
                {key:2,value:9.7,money:json.appointStakeList[1].eighth},
                {key:2,value:9.7,money:json.appointStakeList[1].ninth},
                {key:2,value:9.7,money:json.appointStakeList[1].tenth}
            ],
            //9
            [
                {key:3,value:9.7,money:json.appointStakeList[2].first},
                {key:3,value:9.7,money:json.appointStakeList[2].second},
                {key:3,value:9.7,money:json.appointStakeList[2].third},
                {key:3,value:9.7,money:json.appointStakeList[2].fourth},
                {key:3,value:9.7,money:json.appointStakeList[2].fifth},
                {key:3,value:9.7,money:json.appointStakeList[2].sixth},
                {key:3,value:9.7,money:json.appointStakeList[2].seventh},
                {key:3,value:9.7,money:json.appointStakeList[2].eighth},
                {key:3,value:9.7,money:json.appointStakeList[2].ninth},
                {key:3,value:9.7,money:json.appointStakeList[2].tenth}
            ],
            //10
            [
                {key:4,value:9.7,money:json.appointStakeList[3].first},
                {key:4,value:9.7,money:json.appointStakeList[3].second},
                {key:4,value:9.7,money:json.appointStakeList[3].third},
                {key:4,value:9.7,money:json.appointStakeList[3].fourth},
                {key:4,value:9.7,money:json.appointStakeList[3].fifth},
                {key:4,value:9.7,money:json.appointStakeList[3].sixth},
                {key:4,value:9.7,money:json.appointStakeList[3].seventh},
                {key:4,value:9.7,money:json.appointStakeList[3].eighth},
                {key:4,value:9.7,money:json.appointStakeList[3].ninth},
                {key:4,value:9.7,money:json.appointStakeList[3].tenth}
            ],
            //11
            [
                {key:5,value:9.7,money:json.appointStakeList[4].first},
                {key:5,value:9.7,money:json.appointStakeList[4].second},
                {key:5,value:9.7,money:json.appointStakeList[4].third},
                {key:5,value:9.7,money:json.appointStakeList[4].fourth},
                {key:5,value:9.7,money:json.appointStakeList[4].fifth},
                {key:5,value:9.7,money:json.appointStakeList[4].sixth},
                {key:5,value:9.7,money:json.appointStakeList[4].seventh},
                {key:5,value:9.7,money:json.appointStakeList[4].eighth},
                {key:5,value:9.7,money:json.appointStakeList[4].ninth},
                {key:5,value:9.7,money:json.appointStakeList[4].tenth}
            ],
            //12
            [
                {key:6,value:9.7,money:json.appointStakeList[5].first},
                {key:6,value:9.7,money:json.appointStakeList[5].second},
                {key:6,value:9.7,money:json.appointStakeList[5].third},
                {key:6,value:9.7,money:json.appointStakeList[5].fourth},
                {key:6,value:9.7,money:json.appointStakeList[5].fifth},
                {key:6,value:9.7,money:json.appointStakeList[5].sixth},
                {key:6,value:9.7,money:json.appointStakeList[5].seventh},
                {key:6,value:9.7,money:json.appointStakeList[5].eighth},
                {key:6,value:9.7,money:json.appointStakeList[5].ninth},
                {key:6,value:9.7,money:json.appointStakeList[5].tenth}
            ],
            //13
            [
                {key:7,value:9.7,money:json.appointStakeList[6].first},
                {key:7,value:9.7,money:json.appointStakeList[6].second},
                {key:7,value:9.7,money:json.appointStakeList[6].third},
                {key:7,value:9.7,money:json.appointStakeList[6].fourth},
                {key:7,value:9.7,money:json.appointStakeList[6].fifth},
                {key:7,value:9.7,money:json.appointStakeList[6].sixth},
                {key:7,value:9.7,money:json.appointStakeList[6].seventh},
                {key:7,value:9.7,money:json.appointStakeList[6].eighth},
                {key:7,value:9.7,money:json.appointStakeList[6].ninth},
                {key:7,value:9.7,money:json.appointStakeList[6].tenth}
            ],
            //14
            [
                {key:8,value:9.7,money:json.appointStakeList[7].first},
                {key:8,value:9.7,money:json.appointStakeList[7].second},
                {key:8,value:9.7,money:json.appointStakeList[7].third},
                {key:8,value:9.7,money:json.appointStakeList[7].fourth},
                {key:8,value:9.7,money:json.appointStakeList[7].fifth},
                {key:8,value:9.7,money:json.appointStakeList[7].sixth},
                {key:8,value:9.7,money:json.appointStakeList[7].seventh},
                {key:8,value:9.7,money:json.appointStakeList[7].eighth},
                {key:8,value:9.7,money:json.appointStakeList[7].ninth},
                {key:8,value:9.7,money:json.appointStakeList[7].tenth}
            ],
            //15
            [
                {key:9,value:9.7,money:json.appointStakeList[8].first},
                {key:9,value:9.7,money:json.appointStakeList[8].second},
                {key:9,value:9.7,money:json.appointStakeList[8].third},
                {key:9,value:9.7,money:json.appointStakeList[8].fourth},
                {key:9,value:9.7,money:json.appointStakeList[8].fifth},
                {key:9,value:9.7,money:json.appointStakeList[8].sixth},
                {key:9,value:9.7,money:json.appointStakeList[8].seventh},
                {key:9,value:9.7,money:json.appointStakeList[8].eighth},
                {key:9,value:9.7,money:json.appointStakeList[8].ninth},
                {key:9,value:9.7,money:json.appointStakeList[8].tenth}
            ],
            //16
            [
                {key:10,value:9.7,money:json.appointStakeList[9].first},
                {key:10,value:9.7,money:json.appointStakeList[9].second},
                {key:10,value:9.7,money:json.appointStakeList[9].third},
                {key:10,value:9.7,money:json.appointStakeList[9].fourth},
                {key:10,value:9.7,money:json.appointStakeList[9].fifth},
                {key:10,value:9.7,money:json.appointStakeList[9].sixth},
                {key:10,value:9.7,money:json.appointStakeList[9].seventh},
                {key:10,value:9.7,money:json.appointStakeList[9].eighth},
                {key:10,value:9.7,money:json.appointStakeList[9].ninth},
                {key:10,value:9.7,money:json.appointStakeList[9].tenth}
            ],
        ];
        //冠亚组 表格数据
        $scope.table2 = [
            [{'key':'3','value':'41','money':json.commonStake.firstSecond3},{'key':'4','value':'41','money':json.commonStake.firstSecond4},{'key':'5','value':'21','money':json.commonStake.firstSecond5},{'key':'6','value':'21','money':json.commonStake.firstSecond6}],
            [{'key':'7','value':'12','money':json.commonStake.firstSecond7},{'key':'8','value':'12','money':json.commonStake.firstSecond8},{'key':'9','value':'10.3','money':json.commonStake.firstSecond9},{'key':'10','value':'10.3','money':json.commonStake.firstSecond10}],
            [{'key':'11','value':'8.3','money':json.commonStake.firstSecond11},{'key':'12','value':'10.3','money':json.commonStake.firstSecond12},{'key':'13','value':'10.3','money':json.commonStake.firstSecond13},{'key':'14','value':'12','money':json.commonStake.firstSecond14}],
            [{'key':'15','value':'12','money':json.commonStake.firstSecond15},{'key':'16','value':'21','money':json.commonStake.firstSecond16},{'key':'17','value':'21','money':json.commonStake.firstSecond17},{'key':'18','value':'41','money':json.commonStake.firstSecond18}],
            [{'key':'19','value':'12','money':json.commonStake.firstSecond19},{'key':'','value':''},{'key':'','value':''},{'key':'','value':''}],
            [{'key':'冠亚大','value':'2','money':json.commonStake.firstSecondBig},{'key':'冠亚小','value':'1.63','money':json.commonStake.firstSecondSmall},{'key':'冠亚单','value':'1.63','money':json.commonStake.firstSecondOdd},{'key':'冠亚双','value':'2','money':json.commonStake.firstSecondOdd}]
        ];
    }

    //拖拽配置项 jQuery ui
    $scope.sortableOptions = {
        axis: "x"
    };

    //未登录先登录
    // if(!localStorageService.get('username')){
    //     $state.go('login');
    //     return;
    // }


    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    // //修改比赛结果的url
    // var modifyUrl = 'http://192.168.5.109:8080/stake/result';
    // var modifyflag = true;


    $timeout.cancel($rootScope.timer);
    function action(){
        initEncrypt('http://60.205.163.65:8080/user/stake/configer/info',null);
        $http({
            url : 'http://60.205.163.65:8080/user/stake/configer/info',
            method : 'get',
            dataType : 'json',
        }).then(function(res){
            //console.log(res.data,'res');
            var resData = res.data;

            var json = resData.data;


            $scope.racingNum = json.racingNum;
            $scope.stopTime= $filter('toMinSec')(json.endStakeTime);
            $scope.startTime = $filter('toMinSec')(json.startRacingTime);
            $scope.todayIncome = json.todayIncome;
            $scope.preResult = json.preResult;
            $scope.nowStatus = json.stageName;
            $scope.preRacingNum = json.preRacingNum;

            maketableDate(json.stakeVo);


            // if(resData.result==='验签失败'){
            //     $state.go('login');
            //     return;
            // }

            if(resData.result==='ERROR'){
                //console.log('暂无比赛结果');

                $scope.modifyNotice = '';
                $scope.tableDisabled = true;
                $scope.toast = true;
                $scope.toastMessage = '暂无比赛结果';
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;
                return;
            }
            if(resData.result==='SUCCESS' && resData.data.stage == 4){ // 不可押注
                //console.log('不可押注');

                $scope.modifyNotice = '';
                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;

                return;
            }

            // if(resData.result==='SUCCESS' && resData.data.stage == 2){ //计算最优结果
            //     //console.log('计算最优结果中..');

            //     $scope.modifyNotice = '';
            //     $scope.tableDisabled = true;
            //     $scope.toast = false;
            //     $scope.mask = true;
            //     $scope.computering = true;
            //     $scope.modifying = false;
            //     return;
            // }

            // if(resData.result==='SUCCESS' && resData.data.stage == 3){ //改比赛结果
            //     //console.log('修改比赛结果');
            //     // config.racingNum = resData.data.racingNum;
            //     // $('.toast').hide();
            //     // $('.table-box').addClass('disabled');
            //     // $('.notice-info').html('现在可以修改比赛结果');
            //     //modifyResult(resData.data.result);
            //     // return;

            //     $scope.tableDisabled = true;
            //     $scope.toast = false;
            //     $scope.mask = true;
            //     $scope.computering = false;
            //     $scope.modifying = true;
            //     if(modifyflag){
            //         $scope.arrResult = resData.data.result;
            //         modifyflag = false;
            //     }

            //     $scope.modifyNotice = '';
            //     return;

            // }


            if(resData.result==='SUCCESS' && resData.data.stage == 1){          //押注阶段
                //console.log('押注时间');

                $scope.toast = false;
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;
                $scope.tableDisabled = false;
            }

        },function(err){
            //console.log(err);
        });
        $rootScope.timer = $timeout(action,1000);
    }
    $rootScope.timer = $timeout(action,1000);



    // //修改比赛结果
    // $scope.modifyReslut = function(){
    //     //console.log($scope.arrResult,'drag end');
    //     initEncrypt('http://60.205.163.65:8080/user/stake/configer/info',null);
    //     $http({
    //         url : modifyUrl,
    //         method : 'put',
    //         dataType : 'json',
    //         data : {'racingNum':$scope.racingNum,racingResult:$scope.arrResult}
    //     }).then(function(res){
    //         //console.log(res,'modifyReslut');
    //     },function(err){
    //         //console.log(err);
    //         $scope.modifyNotice = '请求失败请重试';
    //     });
    // };


}]);

//开奖列表
myApp.controller('lotterylistCtrl',['$scope','$http','localStorageService','encrypt',function($scope,$http,localStorageService,encrypt){
    $scope.text = '开奖列表页';

    $scope.queryPage = 1;

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    function initData(){
        initEncrypt('http://60.205.163.65:8080/user/racing/result?page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/user/racing/result?page='+$scope.queryPage,
            method : 'get',
        }).then(function(res){
            //console.log(res,'开奖列表');
            var data = res.data;

            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;
            //分页
            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;
            $scope.total = data.totalPage;
        },function(err){
            alert('请求失败，请重试或缺失必要内容');
        });
    }
    initData();
    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        //console.log(page);
        initData();
    };

}]);



//分盘的 押注 页
myApp.controller('betshowCtrl',['$scope','$rootScope','$http','$timeout','$filter','$state','$location','encrypt','localStorageService','baseData','initSendData','makeSendData',function($scope,$rootScope,$http,$timeout,$filter,$state,$location,encrypt,localStorageService,baseData,initSendData,makeSendData){
    //未登录先登录
    // if(!localStorageService.get('username')){
    //     $state.go('login');
    //     return;
    // }

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }


    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);

    ////console.log(baseData);
    // 初始化 格式数据
    $scope.sendData = initSendData.init(baseData.sendData);
    $scope.tableOne = baseData.tab1;
    $scope.tableTwo = baseData.tab2;
    $scope.tableThree = baseData.tab3;

    //初始状态展示
    $scope.nowTab = 'one';
    $scope.selectedObj = {}; //所选的 td 组成的 对象
    //$scope.selectedClass = false;

    //选项切换
    $scope.tabChange = function(tab){
        //console.log('nowtab',tab);
        $scope.nowTab = tab;
    };
    //确认押注
    $scope.confim = function(){
        if($scope.stage!==1){
            alert('当前阶段不能押注');
            return;
        }

        var keyCode = ['big','small','odd','even']; //大小单双
        var keyCodeUp = ['firstUp','secondUp','thirdUp','fourthUp','fifthUp'];//龙
        var keyCodeDown = ['firstDowm','secondDowm','thirdDowm','fourthDowm','fifthDowm'];//虎
        var sortArr = ['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth'];
        var re = /^[0-9]*[1-9][0-9]*$/;
        if(!$scope.money || !re.test($scope.money)){
            alert('请输入合法金额，正整数');
            return;
        }
        if(angular.equals({},$scope.selectedObj)){
            alert('您还没有押注');
            return;
        }
        var params = makeSendData.makeParams($scope.sendData,$scope.selectedObj,$scope.money);
        params.racingNum = $scope.racingNum;

        ////console.log(params);
        initEncrypt('http://60.205.163.65:8080/user/stake',params);
        $http({
            url : 'http://60.205.163.65:8080/user/stake',
            method : 'post',
            data : params
        }).then(function(res){
            //console.log(res);
            var data = res.data;
            if(data.result=='ERROR'){
                alert(data.message);
            }
            if(data.result=='SUCCESS'){
                alert('押注成功');

                $('.table-box td').removeClass('selected');
                $scope.money = '';
                $scope.selectedObj = {};
                $scope.sendData = initSendData.init(baseData.sendData);

            }
        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });

    };

    //重置押注
    $scope.reset = function(){
        //console.log('reset 押注');
        $scope.money = '';
        //$scope.selectedClass = false; // 不起作用
        $scope.selectedObj = {};
        $scope.sendData = initSendData.init(baseData.sendData);
    };


    //拖拽配置项 jQuery ui
    $scope.sortableOptions = {
        axis: "x"
    };
    //每次请求的 url
    // var urlObj = {
    //     url : './data/data.php',
    //     domain : 'http://120.26.75.31:8080',
    //     path : '/data/data.php',
    //     searchObj : {},
    //     params : null
    // };

    // var authoriza = encrypt.getAuthor(urlObj,localStorageService.get('secretKey'));
    // localStorageService.set('Authorization',authoriza);
    // localStorageService.set('Accesskey',localStorageService.get('Accesskey'))
    // //console.log(authoriza,'set');


    //修改比赛结果的url
    //var modifyUrl = 'http://192.168.5.109:8080/stake/result';
    //var modifyflag = true;


    $timeout.cancel($rootScope.yztimer);
    function action(){
        initEncrypt('http://60.205.163.65:8080/user/stake/configer/info',null);
        $http({
            url : 'http://60.205.163.65:8080/user/stake/configer/info',
            method : 'get',
            dataType : 'json',
        }).then(function(res){
            ////console.log(res.data,'res');
            var resData = res.data;

            var json = resData.data;
            $scope.racingNum = json.racingNum;
            $scope.stopTime= $filter('toMinSec')(json.endStakeTime);
            $scope.startTime = $filter('toMinSec')(json.startRacingTime);
            $scope.todayIncome = json.todayIncome;
            $scope.preResult = json.preResult;
            $scope.stage = json.stage;
            $scope.nowStatus = json.stageName;
            $scope.preRacingNum = json.preRacingNum;

            // if(resData.result==='验签失败'){
            //     $state.go('login');
            //     return;
            // }

            if(resData.result==='ERROR'){
                //console.log('暂无比赛结果');

                $scope.modifyNotice = '';
                $scope.tableDisabled = true;
                $scope.toast = true;
                $scope.toastMessage = '暂无比赛结果';
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;
                return;
            }
            if(resData.result==='SUCCESS' && resData.data.stage == 4){ // 不可押注
                //console.log('不可押注');

                $scope.modifyNotice = '';
                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;

                return;
            }

            // if(resData.result==='SUCCESS' && resData.data.stage == 2){ //计算最优结果
            //     //console.log('计算最优结果中..');
            //
            //     $scope.modifyNotice = '';
            //     $scope.tableDisabled = true;
            //     $scope.toast = false;
            //     $scope.mask = true;
            //     $scope.computering = true;
            //     $scope.modifying = false;
            //     return;
            // }

            // if(resData.result==='SUCCESS' && resData.data.stage == 3){ //改比赛结果
            //     //console.log('修改比赛结果');
            //
            //     $scope.tableDisabled = true;
            //     $scope.toast = false;
            //     $scope.mask = true;
            //     $scope.computering = false;
            //     $scope.modifying = true;
            //     if(modifyflag){
            //         $scope.arrResult = resData.data.result;
            //         modifyflag = false;
            //     }
            //
            //     $scope.modifyNotice = '';
            //     return;
            //
            // }


            if(resData.result==='SUCCESS' && resData.data.stage == 1){          //押注阶段
                //console.log('押注时间');

                $scope.toast = false;
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;
                $scope.tableDisabled = false;
            }

        },function(err){
            //console.log(err);
        });
        $rootScope.yztimer = $timeout(action,1000);
    }
    $rootScope.yztimer = $timeout(action,1000);



    //修改比赛结果
    // $scope.modifyReslut = function(){
    //     //console.log($scope.arrResult,'drag end');
    //
    //     $http({
    //         url : modifyUrl,
    //         method : 'put',
    //         dataType : 'json',
    //         data : {'racingNum':$scope.racingNum,racingResult:$scope.arrResult}
    //     }).then(function(res){
    //         //console.log(res,'modifyReslut');
    //     },function(err){
    //         //console.log(err);
    //         $scope.modifyNotice = '请求失败请重试';
    //     });
    // };


}]);

//机器人管理
myApp.controller('robotCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('robotStatusCtrl',['$scope','$http','encrypt','localStorageService',function($scope,$http,encrypt,localStorageService){
    $scope.text = "机器人状态管理";
    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    initEncrypt('http://60.205.163.65:8080/user',null);
    $http({
        url : 'http://60.205.163.65:8080/user',
        method : 'get',
    }).then(function(res){
        //console.log(res,'robot');
        var data = res.data;
        if(data.result=='ERROR'){
            alert(data.message);
        }
        if(data.result=='SUCCESS'){
            $scope.hasRobot = data.data.isHaveClient;
            $scope.hasExpired = data.data.isClientExpired;
        }
    },function(){
        alert('请求失败，请重试或缺失必要内容');
    });


    //是否报盘
    $scope.report = '1';

    $scope.offer = function(){
        //console.log($scope.report,'是否报盘');
        initEncrypt('http://60.205.163.65:8080/user/robot/enable',{
            clientIsEnable : $scope.report == '1'?true:false
        });
        $http({
            url : 'http://60.205.163.65:8080/user/robot/enable',
            method : 'put',
            data : {
                clientIsEnable : $scope.report == '1'?true:false
            }
        }).then(function(res){
            //console.log(res);
            var data = res.data;
            if(data.result=='ERROR'){
                alert(data.message);
            }
            if(data.result=='SUCCESS'){
                alert('操作成功');
            }
        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    };

}]).controller('robotOddsCtrl',['$scope','$http','encrypt','localStorageService',function($scope,$http,encrypt,localStorageService){
    $scope.text = "机器人赔率管理";

    $scope.queryKey = '';

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    function initData(){
        initEncrypt('http://60.205.163.65:8080/user/robot/rate',null);
        $http({
            url : 'http://60.205.163.65:8080/user/robot/rate',
            method : 'get',
        }).then(function(res){
            //console.log(res);
            var data = res.data;
            if(data.result=='ERROR'){
                alert(data.message);
            }
            if(data.result=='SUCCESS'){
                $scope.tableData = data.data;
                //console.log($scope.tableData,'dssfsdfsdfs');
                //分页
                $scope.currentPage = data.page;
                //$scope.pageSize = data.pageSize;
                $scope.total = data.totalPage;
            }
        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }
    initData();


    $scope.mofiy = function(title,key){
        $scope.odds = '';
        $scope.modalTitle = title;
        $scope.queryKey = key;
    };
    $scope.confirm = function(){
        //console.log($scope.odds,$scope.queryKey);

        if($scope.odds === '' || $scope.odds === undefined){
            alert('赔率不为空');
            return;
        }
        $scope.tableData[$scope.queryKey] = $scope.odds;
        initEncrypt('http://60.205.163.65:8080/user/robot/rate',$scope.tableData);
        $http({
            url : 'http://60.205.163.65:8080/user/robot/rate',
            method : 'put',
            data : $scope.tableData
        }).then(function(res){
            //console.log(res);
            var data = res.data;
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            if(data.result=='SUCCESS'){
                alert('修改成功');
                //$scope.tableData[$scope.queryKey] = $scope.odds;
                initData();
            }
        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });

    };

}]);
//玩家管理
myApp.controller('playerCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('playerlistCtrl',['$scope','$http','$timeout','encrypt','localStorageService',function($scope,$http,$timeout,encrypt,localStorageService){
    $scope.text = "玩家列表管理";
    //控制搜索
    var timer = null;
    $scope.nicklist = false;


    $scope.queryNickName = '';
    $scope.queryPage = '';

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }




    $scope.nickSearch = function(event){
        $timeout.cancel(timer);
        timer = $timeout(function(){
            //console.log($scope.nickname);
            initEncrypt('http://60.205.163.65:8080/user/members/nicname?nicName='+$scope.nickname,null);
            $http({
                url : 'http://60.205.163.65:8080/user/members/nicname?nicName='+$scope.nickname,
                method : 'get'
            }).then(function(res){
                var resData = res.data;
                // //console.log(res);
                // if(data.result == 'SUCCESS'){
                //     $scope.nicklist = true;
                //     $scope.listItems = data.data;
                // }

                if(resData.result=='ERROR'){
                    alert(resData.message);
                    return;
                }

                if(resData.result =='SUCCESS'){
                    $scope.nicklist = true;
                    $scope.listItems = resData.data;
                }

            });

        },300);
    };
    $scope.listClick = function(str){
        //console.log(str,'click');
        $scope.nicklist = false;
        $scope.nickname = str;
        $scope.queryNickName = str;
    };

    $scope.blur = function(){
        $timeout(function(){
            $scope.nicklist = false;
        },300);
    };



    function initData(){
        $http({
           url : 'http://60.205.163.65:8080/user/members?nickname='+$scope.queryNickName+'&page='+$scope.queryPage,
           method : 'get',
        }).then(function(res){
           //console.log(res);
           var data = res.data;

           if(data.result=='ERROR'){
               alert(data.message);
               return;
           }
           $scope.tableData = data.data;
           //分页
           $scope.currentPage = data.page;
           //$scope.pageSize = data.pageSize;
           $scope.total = data.totalPage;

        }, function(err){
           alert('请求失败，请重试或缺失必要内容');
        });
    }


    initEncrypt('http://60.205.163.65:8080/user/members?nickname='+$scope.queryNickName+'&page='+$scope.queryPage,null);
    initData();


    $scope.search = function(){
        //console.log('search');
        $scope.queryNickName = $scope.nickname;
        initEncrypt('http://60.205.163.65:8080/user/members?nickname='+$scope.queryNickName+'&page='+$scope.queryPage,null);
        initData();
    };

    //分页
    $scope.goPage = function(page){
        //console.log(page);
        $scope.queryPage = page;
        initEncrypt('http://60.205.163.65:8080/user/members?nickname='+$scope.queryNickName+'&page='+$scope.queryPage,null);
        initData();
    };

}]).controller('playerportCtrl',['$scope','$timeout','$http','encrypt','localStorageService',function($scope,$timeout,$http,encrypt,localStorageService){
    $scope.text = "玩家报表管理";
    //控制搜索
    var timer = null;
    $scope.nicklist = false;


    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryNickName = '';
    $scope.queryIssue = '';
    $scope.queryPage = '';


    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    $scope.selectActive = 'byDate';

    function byDate(){
        initEncrypt('http://60.205.163.65:8080/user/members/income/day?nickName='+$scope.queryNickName+'&startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/user/members/income/day?nickName='+$scope.queryNickName+'&startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;

            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }
    function byIssue(){
        initEncrypt('http://60.205.163.65:8080/user/members/income/racing?nickName='+$scope.queryNickName+'&startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/user/members/income/racing?nickName='+$scope.queryNickName+'&startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;

            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }

    //byDate();


    $scope.nickSearch = function(event){
        $timeout.cancel(timer);
        timer = $timeout(function(){
            //console.log($scope.nickname);
            initEncrypt('http://60.205.163.65:8080/user/members/nicname?nicName='+$scope.nickname,null);
            $http({
                url : 'http://60.205.163.65:8080/user/members/nicname?nicName='+$scope.nickname,
                method : 'get'
            }).then(function(res){
                var resData = res.data;
                // //console.log(res);
                // if(data.result == 'SUCCESS'){
                //     $scope.nicklist = true;
                //     $scope.listItems = data.data;
                // }

                if(resData.result=='ERROR'){
                    alert(resData.message);
                    return;
                }

                if(resData.result =='SUCCESS'){
                    $scope.nicklist = true;
                    $scope.listItems = resData.data;
                }

            });

        },300);
    };
    $scope.listClick = function(str){
        //console.log(str,'click');
        $scope.nicklist = false;
        $scope.nickname = str;
        $scope.queryNickName = str;
    };

    $scope.blur = function(){
        $timeout(function(){
            $scope.nicklist = false;
        },300);
    };

    $scope.searchByDate = function() {
        //console.log('search by date');
        //console.log($scope.startTime,$scope.endTime);
        if(!$scope.startTime || !$scope.endTime){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        }
        byDate();
    };

    $scope.searchByIssue = function() {
        //console.log('search by issue');
        //console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
        if(!$scope.startTimeIssue || !$scope.endTimeIssue){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTimeIssue+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTimeIssue+' 23:59:59').getTime();
        }

        $scope.queryIssue = $scope.issue;
        byIssue();
    };


    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        //console.log(page);
        if($scope.selectActive == 'byDate'){
            byDate();
        }else{
            byIssue();
        }
    };
    // 按日期 与 按 期号 切换
    $scope.reRender = function(item){
        if(item == 'date'){ //按日期
            $scope.selectActive = 'byDate';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTime = '';
            $scope.endTime = '';
            $scope.queryPage = 1;
            byDate();
        }
        if(item == 'issue'){ //按期号
            $scope.selectActive = 'byIssue';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTimeIssue = '';
            $scope.endTimeIssue = '';
            $scope.issue = '';
            $scope.queryPage = 1;
            byIssue();
        }
    };

}]).controller('playerDetailCtrl',['$scope','$stateParams','$http','localStorageService','encrypt',function($scope,$stateParams,$http,localStorageService,encrypt){
    ////console.log($stateParams);
    $scope.queryMemberId = $stateParams.memberId;
    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryType = '';
    $scope.queryPage = '';

    $scope.type = 'ADD';


    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }
    function initData(){
        initEncrypt('http://60.205.163.65:8080/user/members/'+$scope.queryMemberId+'?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&type='+$scope.queryType+'&page='+$scope.queryPage,null);
        $http({
           url : 'http://60.205.163.65:8080/user/members/'+$scope.queryMemberId+'?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&type='+$scope.queryType+'&page='+$scope.queryPage,
           method : 'get',
        }).then(function(res){
           //console.log(res);
           var data = res.data;
           if(data.result=='ERROR'){
               alert(data.message);
               return;
           }
           $scope.tableData = data.data;
           //分页
           $scope.currentPage = data.page;
           //$scope.pageSize = data.pageSize;
           $scope.total = data.totalPage;

        }, function(err){
           alert('请求失败，请重试或缺失必要内容');
        });
    }


    initData();

    $scope.search = function(){
        //console.log($scope.startTime,$scope.endTime,$scope.type);
        if(!$scope.startTime || !$scope.endTime){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        }
        $scope.queryType = $scope.type;
        initData();
    };

    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        initData();
    };

}]);


//积分管理
myApp.controller('integralCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('applyCtrl',['$scope','$http','encrypt','localStorageService',function($scope,$http,encrypt,localStorageService){
    $scope.text = "申请积分";

    $scope.status = '';
    $scope.cancelId = '';

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    function getInfo(){
        initEncrypt('http://60.205.163.65:8080/user/point',null);
        $http({
           url : 'http://60.205.163.65:8080/user/point',
           method : 'get',
        }).then(function(res){
           //console.log(res);
           var resData = res.data;
           if(resData.result=='ERROR'){
               alert(resData.message);
               return;
           }
           $scope.totalPoints = resData.data.totalPoints;
           $scope.surplusPoints = resData.data.userPoints;
           $scope.playerPoints = resData.data.membersPoints;

           initData();
       },function(){
           alert('请求失败，请重试或缺失必要内容');
       });
    }
    getInfo();


    $scope.queryStatus = '';
    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryPage = '';

    function initData(){
        initEncrypt('http://60.205.163.65:8080/user/points?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&status='+$scope.queryStatus+'&page='+$scope.queryPage,null);
        $http({
           url : 'http://60.205.163.65:8080/user/points?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&status='+$scope.queryStatus+'&page='+$scope.queryPage,
           method : 'get',
        }).then(function(res){
           //console.log(res);
           var data = res.data;
           if(data.result=='ERROR'){
               alert(data.message);
               return;
           }
           $scope.tableData = data.data;
           //分页
           $scope.currentPage = data.page;
           //$scope.pageSize = data.pageSize;
           $scope.total = data.totalPage;

        }, function(err){
           alert('请求失败，请重试或缺失必要内容');
        });
    }




    //select
    $scope.selectOptions =[{key:'UNTREATED',value:'申请中'},{key:'AUDIT',value:'已批准'},{key:'REJECT',value:'已拒绝'},{key:'CANCEL',value:'已取消'}];
    $scope.selection = $scope.selectOptions[0];
    $scope.selectChange = function(){
        //console.log($scope.selection.key);
        $scope.queryStatus = $scope.selection.key;
        // $scope.queryPage = 1;
        // initData();
    };

    $scope.toModal = function(status,id){
        if(status == 'add'){
            $scope.title = '新增申请';
            $scope.moneyShow = true;
            $scope.status = status;
            $scope.money = '';
            $scope.applyText = '';
        }
        if(status == 'cancel'){
            $scope.title = '取消申请';
            $scope.moneyShow = false;
            $scope.status = status;
            $scope.cancelId = id;
            $scope.applyText = '';
        }
    };

    //新增 确认
    $scope.confirm = function() {
        if($scope.status == 'add'){
            initEncrypt('http://60.205.163.65:8080/user/points',{
                appComment : $scope.applyText,
                appPoints : $scope.money
            });
            $http({
               url : 'http://60.205.163.65:8080/user/points',
               method : 'post',
               data : {
                   appComment : $scope.applyText,
                   appPoints : $scope.money
               }
            }).then(function(res){
               //console.log(res);
               var data = res.data;
               if(data.result=='ERROR'){
                   alert(data.message);
               }
               if(data.result=='SUCCESS'){
                   alert('操作成功');
                   initData();
               }

            }, function(err){
               alert('请求失败，请重试或缺失必要内容');
            });
        }

        if($scope.status == 'cancel'){
            initEncrypt('http://60.205.163.65:8080/user/points/'+$scope.cancelId+'/status/cancel',{
                comments : $scope.applyText
            });
            $http({
               url : 'http://60.205.163.65:8080/user/points/'+$scope.cancelId+'/status/cancel',
               method : 'put',
               data : {
                   comments : $scope.applyText
               }

            }).then(function(res){
               //console.log(res);
               var data = res.data;
               if(data.result=='ERROR'){
                   alert(data.message);
               }
               if(data.result=='SUCCESS'){
                   alert('操作成功');
                   initData();
               }

            }, function(err){
               alert('请求失败，请重试或缺失必要内容');
            });
        }

    };


    $scope.search = function(){
        //console.log($scope.selection);
        $scope.queryStatus = $scope.queryStatus;
        if(!$scope.startTime || !$scope.endTime){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        }
        $scope.queryPage = 1;
        initData();
    };

    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        initData();
    };

}]).controller('listCtrl',['$scope','$http','encrypt','localStorageService',function($scope,$http,encrypt,localStorageService){
    $scope.text = "操作记录";
    // $scope.info = '当前总积分 == 当前结余积分 === 玩家总积分';

    function getInfo(){
        initEncrypt('http://60.205.163.65:8080/user/point',null);
        $http({
           url : 'http://60.205.163.65:8080/user/point',
           method : 'get',
        }).then(function(res){
           //console.log(res);
           var resData = res.data;
           if(resData.result=='ERROR'){
               alert(resData.message);
               return;
           }
           $scope.totalPoints = resData.data.totalPoints;
           $scope.surplusPoints = resData.data.userPoints;
           $scope.playerPoints = resData.data.membersPoints;

           initData();
       },function(){
           alert('请求失败，请重试或缺失必要内容');
       });
    }
    getInfo();



    //默认选择
    $scope.status = 'MANAGER_ADD';

    $scope.queryStatus = 'MANAGER_ADD';
    $scope.queryPage = 1;


    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }
    function initData(){
        initEncrypt('http://60.205.163.65:8080/user/state?status='+$scope.queryStatus+'&page='+$scope.queryPage,null);
        $http({
           url : 'http://60.205.163.65:8080/user/state?status='+$scope.queryStatus+'&page='+$scope.queryPage,
           method : 'get',
        }).then(function(res){
           //console.log(res);
           var data = res.data;
           if(data.result=='ERROR'){
               alert(data.message);
               return;
           }
           $scope.tableData = data.data;
           //分页
           $scope.currentPage = data.page;
           //$scope.pageSize = data.pageSize;
           $scope.total = data.totalPage;

        }, function(err){
           alert('请求失败，请重试或缺失必要内容');
        });
    }


    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        initData();
    };

    //change
    $scope.change = function(){
        //console.log($scope.status);
        $scope.queryStatus = $scope.status;
        initData();
    };

    // $scope.tableData = [
    //     {'code':1,'content':'aa','time':'2016-04-06','bb':[1,2],'cc':[3,4],'dd':[5,6]},
    //     {'code':2,'content':'aa','time':'2016-04-06','bb':[1,2],'cc':[3,4],'dd':[5,6]}
    // ];

}]);


//查看积分详情
// myApp.controller('integralDetailCtrl',['$scope','$stateParams','$sanitize',function($scope,$stateParams,$sanitize){
//     ////console.log($stateParams);
//
//     $scope.title = $stateParams.item1+'==='+ $stateParams.item2;
//
//     $scope.tableData = [
//         {'code':1,'content':'aa','bb':[1,2],'cc':[3,4],'dd':[5,6]},
//         {'code':2,'content':'aa','bb':[1,2],'cc':[3,4],'dd':[5,6]}
//     ];
//
//     //分页
//     $scope.currentPage = 30;
//     //$scope.pageSize = 5;  //每页显示多少
//     $scope.total = 100;
//     $scope.goPage = function(page){
//         //console.log(page);
//     };
// }]);


//盈亏报表
myApp.controller('profitCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('otherPlCtrl',['$scope','$http','encrypt','localStorageService',function($scope,$http,encrypt,localStorageService){
    $scope.text = "分盘盈亏报表";
    $scope.selectActive = 'byDate';

    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryPage = '';
    $scope.queryIssue = '';

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    function byDate(){
        initEncrypt('http://60.205.163.65:8080/user/income/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/user/income/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }

            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }
    function byIssue(){
        initEncrypt('http://60.205.163.65:8080/user/income/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/user/income/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }

    byDate();


    $scope.searchByDate = function() {
        //console.log('search by date');
        //console.log($scope.startTime,$scope.endTime);
        if(!$scope.startTime || !$scope.endTime){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        }
        byDate();
    };

    $scope.searchByIssue = function() {
        //console.log('search by issue');
        //console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
        if(!$scope.startTimeIssue || !$scope.endTimeIssue){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTimeIssue+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTimeIssue+' 23:59:59').getTime();
        }

        $scope.queryIssue = $scope.issue;
        byIssue();
    };

    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        //console.log(page);
        if($scope.selectActive == 'byDate'){
            byDate();
        }else{
            byIssue();
        }
    };

    // 按日期 与 按 期号 切换
    $scope.reRender = function(item){
        if(item == 'date'){ //按日期
            $scope.selectActive = 'byDate';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTime = '';
            $scope.endTime = '';
            $scope.queryPage = 1;
            byDate();
        }
        if(item == 'issue'){ //按期号
            $scope.selectActive = 'byIssue';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTimeIssue = '';
            $scope.endTimeIssue = '';
            $scope.issue = '';
            $scope.queryPage = 1;
            byIssue();
        }
    };
}]);


//押注报表
myApp.controller('betCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('otherBetCtrl',['$scope','$http','encrypt','localStorageService',function($scope,$http,encrypt,localStorageService){
    $scope.text = "分盘押注报表";
    $scope.selectActive = 'byDate';


    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryPage = '';
    $scope.issue = '';

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }


    function byDate(){
        initEncrypt('http://60.205.163.65:8080/user/bat/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/user/bat/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }
    function byIssue(){
        initEncrypt('http://60.205.163.65:8080/user/bat/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.issue+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/user/bat/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.issue+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;
            if(data.result=='ERROR'){
                alert(data.message);
                return;
            }
            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }

    byDate();

    // 表格数据格式
    // $scope.tableData = [
    //     {'code':1,'aa':'aa','bb':[1,2,3],'cc':[1,2,3],'dd':[1,2,3],'ee':[1,2,3]},
    //     {'code':1,'aa':'aa','bb':[1,2,3],'cc':[1,2,3],'dd':[1,2,3],'ee':[1,2,3]}
    // ];

    // $scope.startTime = '2016-06-12';
    // $scope.endTime = '2016-08-12';
    // $scope.issue = '1232454';
    $scope.searchByDate = function() {
        //console.log('search by date');
        //console.log($scope.startTime,$scope.endTime);
        if(!$scope.startTime || !$scope.endTime){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        }
        byDate();
    };

    $scope.searchByIssue = function() {
        //console.log('search by issue');
        //console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
        if(!$scope.startTimeIssue || !$scope.endTimeIssue){
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
        }else{
            $scope.queryStartDate = new Date($scope.startTimeIssue+' 00:00:00').getTime();
            $scope.queryEndDate = new Date($scope.endTimeIssue+' 23:59:59').getTime();
        }

        byIssue();
    };

    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        //console.log(page);
        if($scope.selectActive == 'byDate'){
            byDate();
        }else{
            byIssue();
        }
    };

    // 按日期 与 按 期号 切换
    $scope.reRender = function(item){
        if(item == 'date'){ //按日期
            $scope.selectActive = 'byDate';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTime = '';
            $scope.endTime = '';
            $scope.queryPage = 1;
            byDate();
        }
        if(item == 'issue'){ //按期号
            $scope.selectActive = 'byIssue';
            $scope.queryStartDate = '';
            $scope.queryEndDate = '';
            $scope.queryIssue = '';
            $scope.startTimeIssue = '';
            $scope.endTimeIssue = '';
            $scope.issue = '';
            $scope.queryPage = 1;
            byIssue();
        }
    };

}]).controller('betDetailCtrl',['$scope','$stateParams','$http','encrypt','localStorageService',function($scope,$stateParams,$http,encrypt,localStorageService){

    //console.log($stateParams.type);
    $scope.type = $stateParams.type;
    $scope.dateIssue = $stateParams.category;



        function initEncrypt(url,bodyQuery){
            ////console.log(url,'url');
            var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
            localStorageService.set('Authorization',authoriza);
            localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
            ////console.log(authoriza,'set');
        }

        function maketableDate(json){
            //1-10 表格数据
            $scope.table1 = [
                //1
                [
                    {key:'大',value:1.94,money:json.rankingStakeList[0].big},
                    {key:'大',value:1.94,money:json.rankingStakeList[1].big},
                    {key:'大',value:1.94,money:json.rankingStakeList[2].big},
                    {key:'大',value:1.94,money:json.rankingStakeList[3].big},
                    {key:'大',value:1.94,money:json.rankingStakeList[4].big},
                    {key:'大',value:1.94,money:json.rankingStakeList[5].big},
                    {key:'大',value:1.94,money:json.rankingStakeList[6].big},
                    {key:'大',value:1.94,money:json.rankingStakeList[7].big},
                    {key:'大',value:1.94,money:json.rankingStakeList[8].big},
                    {key:'大',value:1.94,money:json.rankingStakeList[9].big}
                ],
                //2
                [
                    {key:'小',value:1.94,money:json.rankingStakeList[0].small},
                    {key:'小',value:1.94,money:json.rankingStakeList[1].small},
                    {key:'小',value:1.94,money:json.rankingStakeList[2].small},
                    {key:'小',value:1.94,money:json.rankingStakeList[3].small},
                    {key:'小',value:1.94,money:json.rankingStakeList[4].small},
                    {key:'小',value:1.94,money:json.rankingStakeList[5].small},
                    {key:'小',value:1.94,money:json.rankingStakeList[6].small},
                    {key:'小',value:1.94,money:json.rankingStakeList[7].small},
                    {key:'小',value:1.94,money:json.rankingStakeList[8].small},
                    {key:'小',value:1.94,money:json.rankingStakeList[9].small}
                ],
                //3
                [
                    {key:'单',value:1.94,money:json.rankingStakeList[0].odd},
                    {key:'单',value:1.94,money:json.rankingStakeList[1].odd},
                    {key:'单',value:1.94,money:json.rankingStakeList[2].odd},
                    {key:'单',value:1.94,money:json.rankingStakeList[3].odd},
                    {key:'单',value:1.94,money:json.rankingStakeList[4].odd},
                    {key:'单',value:1.94,money:json.rankingStakeList[5].odd},
                    {key:'单',value:1.94,money:json.rankingStakeList[6].odd},
                    {key:'单',value:1.94,money:json.rankingStakeList[7].odd},
                    {key:'单',value:1.94,money:json.rankingStakeList[8].odd},
                    {key:'单',value:1.94,money:json.rankingStakeList[9].odd}
                ],
                //4
                [
                    {key:'双',value:1.94,money:json.rankingStakeList[0].even},
                    {key:'双',value:1.94,money:json.rankingStakeList[1].even},
                    {key:'双',value:1.94,money:json.rankingStakeList[2].even},
                    {key:'双',value:1.94,money:json.rankingStakeList[3].even},
                    {key:'双',value:1.94,money:json.rankingStakeList[4].even},
                    {key:'双',value:1.94,money:json.rankingStakeList[5].even},
                    {key:'双',value:1.94,money:json.rankingStakeList[6].even},
                    {key:'双',value:1.94,money:json.rankingStakeList[7].even},
                    {key:'双',value:1.94,money:json.rankingStakeList[8].even},
                    {key:'双',value:1.94,money:json.rankingStakeList[9].even}
                ],
                //5
                [
                    {key:'龙',value:1.94,money:json.commonStake.firstUp},
                    {key:'龙',value:1.94,money:json.commonStake.secondUp},
                    {key:'龙',value:1.94,money:json.commonStake.thirdUp},
                    {key:'龙',value:1.94,money:json.commonStake.fourthUp},
                    {key:'龙',value:1.94,money:json.commonStake.fifthUp},
                    {key:'',value:'',money:''},
                    {key:'',value:'',money:''},
                    {key:'',value:'',money:''},
                    {key:'',value:'',money:''},
                    {key:'',value:'',money:''}
                ],
                //6
                [
                    {key:'虎',value:1.94,money:json.commonStake.firstDowm},
                    {key:'虎',value:1.94,money:json.commonStake.secondDowm},
                    {key:'虎',value:1.94,money:json.commonStake.thirdDowm},
                    {key:'虎',value:1.94,money:json.commonStake.fourthDowm},
                    {key:'虎',value:1.94,money:json.commonStake.fifthDowm},
                    {key:'',value:'',money:''},
                    {key:'',value:'',money:''},
                    {key:'',value:'',money:''},
                    {key:'',value:'',money:''},
                    {key:'',value:'',money:''}
                ],
                //7
                [
                    {key:1,value:9.7,money:json.appointStakeList[0].first},
                    {key:1,value:9.7,money:json.appointStakeList[0].second},
                    {key:1,value:9.7,money:json.appointStakeList[0].third},
                    {key:1,value:9.7,money:json.appointStakeList[0].fourth},
                    {key:1,value:9.7,money:json.appointStakeList[0].fifth},
                    {key:1,value:9.7,money:json.appointStakeList[0].sixth},
                    {key:1,value:9.7,money:json.appointStakeList[0].seventh},
                    {key:1,value:9.7,money:json.appointStakeList[0].eighth},
                    {key:1,value:9.7,money:json.appointStakeList[0].ninth},
                    {key:1,value:9.7,money:json.appointStakeList[0].tenth}
                ],
                //8
                [
                    {key:2,value:9.7,money:json.appointStakeList[1].first},
                    {key:2,value:9.7,money:json.appointStakeList[1].second},
                    {key:2,value:9.7,money:json.appointStakeList[1].third},
                    {key:2,value:9.7,money:json.appointStakeList[1].fourth},
                    {key:2,value:9.7,money:json.appointStakeList[1].fifth},
                    {key:2,value:9.7,money:json.appointStakeList[1].sixth},
                    {key:2,value:9.7,money:json.appointStakeList[1].seventh},
                    {key:2,value:9.7,money:json.appointStakeList[1].eighth},
                    {key:2,value:9.7,money:json.appointStakeList[1].ninth},
                    {key:2,value:9.7,money:json.appointStakeList[1].tenth}
                ],
                //9
                [
                    {key:3,value:9.7,money:json.appointStakeList[2].first},
                    {key:3,value:9.7,money:json.appointStakeList[2].second},
                    {key:3,value:9.7,money:json.appointStakeList[2].third},
                    {key:3,value:9.7,money:json.appointStakeList[2].fourth},
                    {key:3,value:9.7,money:json.appointStakeList[2].fifth},
                    {key:3,value:9.7,money:json.appointStakeList[2].sixth},
                    {key:3,value:9.7,money:json.appointStakeList[2].seventh},
                    {key:3,value:9.7,money:json.appointStakeList[2].eighth},
                    {key:3,value:9.7,money:json.appointStakeList[2].ninth},
                    {key:3,value:9.7,money:json.appointStakeList[2].tenth}
                ],
                //10
                [
                    {key:4,value:9.7,money:json.appointStakeList[3].first},
                    {key:4,value:9.7,money:json.appointStakeList[3].second},
                    {key:4,value:9.7,money:json.appointStakeList[3].third},
                    {key:4,value:9.7,money:json.appointStakeList[3].fourth},
                    {key:4,value:9.7,money:json.appointStakeList[3].fifth},
                    {key:4,value:9.7,money:json.appointStakeList[3].sixth},
                    {key:4,value:9.7,money:json.appointStakeList[3].seventh},
                    {key:4,value:9.7,money:json.appointStakeList[3].eighth},
                    {key:4,value:9.7,money:json.appointStakeList[3].ninth},
                    {key:4,value:9.7,money:json.appointStakeList[3].tenth}
                ],
                //11
                [
                    {key:5,value:9.7,money:json.appointStakeList[4].first},
                    {key:5,value:9.7,money:json.appointStakeList[4].second},
                    {key:5,value:9.7,money:json.appointStakeList[4].third},
                    {key:5,value:9.7,money:json.appointStakeList[4].fourth},
                    {key:5,value:9.7,money:json.appointStakeList[4].fifth},
                    {key:5,value:9.7,money:json.appointStakeList[4].sixth},
                    {key:5,value:9.7,money:json.appointStakeList[4].seventh},
                    {key:5,value:9.7,money:json.appointStakeList[4].eighth},
                    {key:5,value:9.7,money:json.appointStakeList[4].ninth},
                    {key:5,value:9.7,money:json.appointStakeList[4].tenth}
                ],
                //12
                [
                    {key:6,value:9.7,money:json.appointStakeList[5].first},
                    {key:6,value:9.7,money:json.appointStakeList[5].second},
                    {key:6,value:9.7,money:json.appointStakeList[5].third},
                    {key:6,value:9.7,money:json.appointStakeList[5].fourth},
                    {key:6,value:9.7,money:json.appointStakeList[5].fifth},
                    {key:6,value:9.7,money:json.appointStakeList[5].sixth},
                    {key:6,value:9.7,money:json.appointStakeList[5].seventh},
                    {key:6,value:9.7,money:json.appointStakeList[5].eighth},
                    {key:6,value:9.7,money:json.appointStakeList[5].ninth},
                    {key:6,value:9.7,money:json.appointStakeList[5].tenth}
                ],
                //13
                [
                    {key:7,value:9.7,money:json.appointStakeList[6].first},
                    {key:7,value:9.7,money:json.appointStakeList[6].second},
                    {key:7,value:9.7,money:json.appointStakeList[6].third},
                    {key:7,value:9.7,money:json.appointStakeList[6].fourth},
                    {key:7,value:9.7,money:json.appointStakeList[6].fifth},
                    {key:7,value:9.7,money:json.appointStakeList[6].sixth},
                    {key:7,value:9.7,money:json.appointStakeList[6].seventh},
                    {key:7,value:9.7,money:json.appointStakeList[6].eighth},
                    {key:7,value:9.7,money:json.appointStakeList[6].ninth},
                    {key:7,value:9.7,money:json.appointStakeList[6].tenth}
                ],
                //14
                [
                    {key:8,value:9.7,money:json.appointStakeList[7].first},
                    {key:8,value:9.7,money:json.appointStakeList[7].second},
                    {key:8,value:9.7,money:json.appointStakeList[7].third},
                    {key:8,value:9.7,money:json.appointStakeList[7].fourth},
                    {key:8,value:9.7,money:json.appointStakeList[7].fifth},
                    {key:8,value:9.7,money:json.appointStakeList[7].sixth},
                    {key:8,value:9.7,money:json.appointStakeList[7].seventh},
                    {key:8,value:9.7,money:json.appointStakeList[7].eighth},
                    {key:8,value:9.7,money:json.appointStakeList[7].ninth},
                    {key:8,value:9.7,money:json.appointStakeList[7].tenth}
                ],
                //15
                [
                    {key:9,value:9.7,money:json.appointStakeList[8].first},
                    {key:9,value:9.7,money:json.appointStakeList[8].second},
                    {key:9,value:9.7,money:json.appointStakeList[8].third},
                    {key:9,value:9.7,money:json.appointStakeList[8].fourth},
                    {key:9,value:9.7,money:json.appointStakeList[8].fifth},
                    {key:9,value:9.7,money:json.appointStakeList[8].sixth},
                    {key:9,value:9.7,money:json.appointStakeList[8].seventh},
                    {key:9,value:9.7,money:json.appointStakeList[8].eighth},
                    {key:9,value:9.7,money:json.appointStakeList[8].ninth},
                    {key:9,value:9.7,money:json.appointStakeList[8].tenth}
                ],
                //16
                [
                    {key:10,value:9.7,money:json.appointStakeList[9].first},
                    {key:10,value:9.7,money:json.appointStakeList[9].second},
                    {key:10,value:9.7,money:json.appointStakeList[9].third},
                    {key:10,value:9.7,money:json.appointStakeList[9].fourth},
                    {key:10,value:9.7,money:json.appointStakeList[9].fifth},
                    {key:10,value:9.7,money:json.appointStakeList[9].sixth},
                    {key:10,value:9.7,money:json.appointStakeList[9].seventh},
                    {key:10,value:9.7,money:json.appointStakeList[9].eighth},
                    {key:10,value:9.7,money:json.appointStakeList[9].ninth},
                    {key:10,value:9.7,money:json.appointStakeList[9].tenth}
                ],
            ];
            //冠亚组 表格数据
            $scope.table2 = [
                [{'key':'3','value':'41','money':json.commonStake.firstSecond3},{'key':'4','value':'41','money':json.commonStake.firstSecond4},{'key':'5','value':'21','money':json.commonStake.firstSecond5},{'key':'6','value':'21','money':json.commonStake.firstSecond6}],
                [{'key':'7','value':'12','money':json.commonStake.firstSecond7},{'key':'8','value':'12','money':json.commonStake.firstSecond8},{'key':'9','value':'10.3','money':json.commonStake.firstSecond9},{'key':'10','value':'10.3','money':json.commonStake.firstSecond10}],
                [{'key':'11','value':'8.3','money':json.commonStake.firstSecond11},{'key':'12','value':'10.3','money':json.commonStake.firstSecond12},{'key':'13','value':'10.3','money':json.commonStake.firstSecond13},{'key':'14','value':'12','money':json.commonStake.firstSecond14}],
                [{'key':'15','value':'12','money':json.commonStake.firstSecond15},{'key':'16','value':'21','money':json.commonStake.firstSecond16},{'key':'17','value':'21','money':json.commonStake.firstSecond17},{'key':'18','value':'41','money':json.commonStake.firstSecond18}],
                [{'key':'19','value':'12','money':json.commonStake.firstSecond19},{'key':'','value':''},{'key':'','value':''},{'key':'','value':''}],
                [{'key':'冠亚大','value':'2','money':json.commonStake.firstSecondBig},{'key':'冠亚小','value':'1.63','money':json.commonStake.firstSecondSmall},{'key':'冠亚单','value':'1.63','money':json.commonStake.firstSecondOdd},{'key':'冠亚双','value':'2','money':json.commonStake.firstSecondOdd}]
            ];
        }


        var url = '';
        if($scope.type == 'byDate'){
            url = 'http://60.205.163.65:8080/user/stake/day/info?day='+$scope.dateIssue;
        }
        if($scope.type == 'byIssue'){
            url = 'http://60.205.163.65:8080/user/stake/racingnum/info?racingNum='+$scope.dateIssue;
        }

        initEncrypt(url,null);
        $http({
            url :  url,
            method : 'get'
        }).then(function(res){
            // //console.log(res,'详情结果');

            var resData = res.data;
            if(resData.result == 'NO_LOGIN'){
                $state.go('login');
                return;
            }
            if(resData.result=='ERROR'){
                alert(resData.message);
                return;
            }

            if($scope.type == 'byIssue'){
                $scope.lotteryRestut = resData.data.result ? resData.data.result.join(''):'';
            }
            $scope.money = resData.data.stakeAmount;
            $scope.number = resData.data.stakeCount;
            $scope.fitloss = resData.data.incomeAmount;
            $scope.allfitloss = resData.data.deficitAmount;
            maketableDate(resData.data.stakeVo);

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });




}]);


//用户管理
myApp.controller('userCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('allUserCtrl',['$scope','$http','encrypt','localStorageService',function($scope,$http,encrypt,localStorageService){
    $scope.text = "查看修改个人信息";

    $scope.nickname = '';
    $scope.password = '';

    function initEncrypt(url,bodyQuery){
        ////console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        ////console.log(authoriza,'set');
    }

    $scope.modify = function(){
        //console.log($scope.nickname,$scope.password);
        initEncrypt('http://60.205.163.65:8080/user/',{
            nickName : $scope.nickname,
            password : $scope.password
        });
        $http({
            url : 'http://60.205.163.65:8080/user/',
            method : 'put',
            data : {
                nickName : $scope.nickname,
                password : $scope.password
            }
        }).then(function(res){
            var data = res.data;
            if(data.result=='ERROR'){
                alert(data.message);
            }
            if(data.result=='SUCCESS'){
                alert('操作成功');
            }
        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    };

}]);
