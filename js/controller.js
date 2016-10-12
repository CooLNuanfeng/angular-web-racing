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
    }
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
            console.log(res,'分盘用户登录');

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
            console.log(err);
        });
    }
}]);


//实时开奖
myApp.controller('realtimeCtrl',['$scope','$rootScope','$http','$timeout','$filter','$state','encrypt','localStorageService',function($scope,$rootScope,$http,$timeout,$filter,$state,encrypt,localStorageService){

    //1-10 表格数据
    $scope.table1 = [
        //1
        [
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'}
        ],
        //2
        [
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'}
        ],
        //3
        [
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'}
        ],
        //4
        [
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'}
        ],
        //5
        [
            {key:'龙',value:1.94,money:'aa'},
            {key:'龙',value:1.94,money:'aa'},
            {key:'龙',value:1.94,money:'aa'},
            {key:'龙',value:1.94,money:'aa'},
            {key:'龙',value:1.94,money:'aa'},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''}
        ],
        //6
        [
            {key:'虎',value:1.94,money:'aa'},
            {key:'虎',value:1.94,money:'aa'},
            {key:'虎',value:1.94,money:'aa'},
            {key:'虎',value:1.94,money:'aa'},
            {key:'虎',value:1.94,money:'aa'},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''}
        ],
        //7
        [
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'}
        ],
        //8
        [
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'}
        ],
        //9
        [
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'}
        ],
        //10
        [
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'}
        ],
        //11
        [
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'}
        ],
        //12
        [
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'}
        ],
        //13
        [
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'}
        ],
        //14
        [
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'}
        ],
        //15
        [
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'}
        ],
        //16
        [
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'}
        ],
    ];


    //冠亚组 表格数据
    $scope.table2 = [
        [{'key':'3','value':'41','money':'100'},{'key':'4','value':'41','money':'100'},{'key':'5','value':'21','money':'100'},{'key':'6','value':'21','money':'100'}],
        [{'key':'7','value':'12','money':'100'},{'key':'8','value':'12','money':'100'},{'key':'9','value':'10.3','money':'100'},{'key':'10','value':'10.3','money':'100'}],
        [{'key':'11','value':'8.3','money':'100'},{'key':'12','value':'10.3','money':'100'},{'key':'13','value':'10.3','money':'100'},{'key':'14','value':'12','money':'100'}],
        [{'key':'15','value':'12','money':'100'},{'key':'16','value':'21','money':'100'},{'key':'17','value':'21','money':'100'},{'key':'18','value':'41','money':'100'}],
        [{'key':'19','value':'12','money':'100'},{'key':'','value':''},{'key':'','value':''},{'key':'','value':''}],
        [{'key':'冠亚大','value':'2','money':'100'},{'key':'冠亚小','value':'1.63','money':'100'},{'key':'冠亚单','value':'1.63','money':'100'},{'key':'冠亚双','value':'2','money':'100'}]
    ];


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
        //console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        //console.log(authoriza,'set');
    }

    //修改比赛结果的url
    var modifyUrl = 'http://192.168.5.109:8080/stake/result';
    var modifyflag = true;

    //全局配置控制
    //var config = {
        // racingNum : '',  //本次期号
        // setInterval : 2000,  //多少时间请求一次
        // url : 'http://192.168.5.109:8080/stake/config', //实时请求url
        //yazhuUrl : 'http://192.168.5.109:8080/stake/invoke',  //押注url
        //modifyUrl : 'http://192.168.5.109:8080/stake/result?racingNum=',
        //newflag : true,  //是否为新一轮开始
        //stage : false  //是否所处于修改结果阶段，控制重复渲染
    //};

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
    // console.log(authoriza,'set');


    $timeout.cancel($rootScope.timer);
    function action(){
        initEncrypt('./data/data.php',null);
        $http({
            url : './data/data.php',
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
            $scope.nowStatus = json.nowStatus;
            $scope.preRacingNum = json.preRacingNum;

            // if(resData.result==='验签失败'){
            //     $state.go('login');
            //     return;
            // }

            if(resData.result==='ERROR'){
                console.log('暂无比赛结果');

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
                console.log('不可押注');

                $scope.modifyNotice = '';
                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;

                return;
            }

            if(resData.result==='SUCCESS' && resData.data.stage == 2){ //计算最优结果
                console.log('计算最优结果中..');

                $scope.modifyNotice = '';
                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = true;
                $scope.computering = true;
                $scope.modifying = false;
                return;
            }

            if(resData.result==='SUCCESS' && resData.data.stage == 3){ //改比赛结果
                console.log('修改比赛结果');
                // config.racingNum = resData.data.racingNum;
                // $('.toast').hide();
                // $('.table-box').addClass('disabled');
                // $('.notice-info').html('现在可以修改比赛结果');
                //modifyResult(resData.data.result);
                // return;

                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = true;
                $scope.computering = false;
                $scope.modifying = true;
                if(modifyflag){
                    $scope.arrResult = resData.data.result;
                    modifyflag = false;
                }

                $scope.modifyNotice = '';
                return;

            }


            if(resData.result==='SUCCESS' && resData.data.stage == 1){          //押注阶段
                console.log('押注时间');

                $scope.toast = false;
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;
                $scope.tableDisabled = false;
            }

        },function(err){
            console.log(err);
        });
        $rootScope.timer = $timeout(action,3000);
    }
    $rootScope.timer = $timeout(action,3000);



    //修改比赛结果
    $scope.modifyReslut = function(){
        console.log($scope.arrResult,'drag end');
        return;
        $http({
            url : modifyUrl,
            method : 'put',
            dataType : 'json',
            data : {'racingNum':$scope.racingNum,racingResult:$scope.arrResult}
        }).then(function(res){
            console.log(res,'modifyReslut');
        },function(err){
            console.log(err);
            $scope.modifyNotice = '请求失败请重试';
        })
    }


}]);

//开奖列表
myApp.controller('lotterylistCtrl',['$scope','$http',function($scope,$http){
    $scope.text = '开奖列表页';

    // $scope.tableRows = [{"date":"20161003043","reslut":[9,3,4,1,2,7,6,8,10,5],"item1":["\u662f","\u5426","\u662f","\u5426"],"item2":["\u662f","\u5426","\u662f","\u5426"]},{"date":"20161003044","reslut":[2,7,6,8,10,9,3,4,1,5],"item1":["\u662f","\u5426","\u662f","\u5426"],"item2":["\u662f","\u5426","\u662f","\u5426"]}]

    /*
    // var params = $.param({
    //     email: 'blue@qq.com',
    //     password: '123456'
    // });
    $http({
        url : './data/lotterylist.php',
        method : 'POST',
        // headers : {
        //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        // },
        //data : params
    }).then(function(res){
        if(res.status==200){
            $scope.tableRows = res.data;
        }
    },function(err){
        console.log(err);
    });
    */

    $scope.tableRows = [{"date":"20161003043","reslut":[9,3,4,1,2,7,6,8,10,5],"item1":["\u662f","\u5426","\u662f","\u5426"],"item2":["\u662f","\u5426","\u662f","\u5426"]},{"date":"20161003044","reslut":[2,7,6,8,10,9,3,4,1,5],"item1":["\u662f","\u5426","\u662f","\u5426"],"item2":["\u662f","\u5426","\u662f","\u5426"]}];


    $scope.currentPage = 30;
    //$scope.pageSize = 5;  //每页显示多少
    $scope.total = 100;
    $scope.goPage = function(a,b){
        console.log(a,b);
    }

}]);



//分盘的 押注 页
myApp.controller('betshowCtrl',['$scope','$rootScope','$http','$timeout','$filter','$state','$location','encrypt','localStorageService','baseData','initSendData','makeSendData',function($scope,$rootScope,$http,$timeout,$filter,$state,$location,encrypt,localStorageService,baseData,initSendData,makeSendData){
    //未登录先登录
    // if(!localStorageService.get('username')){
    //     $state.go('login');
    //     return;
    // }

    function initEncrypt(url,bodyQuery){
        //console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        //console.log(authoriza,'set');
    }


    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);

    //console.log(baseData);
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
        console.log('nowtab',tab);
        $scope.nowTab = tab;
    };
    //确认押注
    $scope.confim = function(){
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
        var params = makeSendData.makeParams($scope.sendData,$scope.selectedObj,$scope.money)
        console.log(params);
    };

    //重置押注
    $scope.reset = function(){
        console.log('reset 押注');
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
    // console.log(authoriza,'set');


    //修改比赛结果的url
    var modifyUrl = 'http://192.168.5.109:8080/stake/result';
    var modifyflag = true;


    $timeout.cancel($rootScope.yztimer);
    function action(){
        initEncrypt('./data/data.php',null);
        $http({
            url : './data/data.php',
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
            $scope.nowStatus = json.nowStatus;
            $scope.preRacingNum = json.preRacingNum;

            // if(resData.result==='验签失败'){
            //     $state.go('login');
            //     return;
            // }

            if(resData.result==='ERROR'){
                console.log('暂无比赛结果');

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
                console.log('不可押注');

                $scope.modifyNotice = '';
                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;

                return;
            }

            if(resData.result==='SUCCESS' && resData.data.stage == 2){ //计算最优结果
                console.log('计算最优结果中..');

                $scope.modifyNotice = '';
                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = true;
                $scope.computering = true;
                $scope.modifying = false;
                return;
            }

            if(resData.result==='SUCCESS' && resData.data.stage == 3){ //改比赛结果
                console.log('修改比赛结果');
                // config.racingNum = resData.data.racingNum;
                // $('.toast').hide();
                // $('.table-box').addClass('disabled');
                // $('.notice-info').html('现在可以修改比赛结果');
                //modifyResult(resData.data.result);
                // return;

                $scope.tableDisabled = true;
                $scope.toast = false;
                $scope.mask = true;
                $scope.computering = false;
                $scope.modifying = true;
                if(modifyflag){
                    $scope.arrResult = resData.data.result;
                    modifyflag = false;
                }

                $scope.modifyNotice = '';
                return;

            }


            if(resData.result==='SUCCESS' && resData.data.stage == 1){          //押注阶段
                console.log('押注时间');

                $scope.toast = false;
                $scope.mask = false;
                $scope.computering = false;
                $scope.modifying = false;
                $scope.tableDisabled = false;
            }

        },function(err){
            console.log(err);
        });
        $rootScope.yztimer = $timeout(action,3000);
    }
    $rootScope.yztimer = $timeout(action,3000);



    //修改比赛结果
    $scope.modifyReslut = function(){
        console.log($scope.arrResult,'drag end');
        return;
        $http({
            url : modifyUrl,
            method : 'put',
            dataType : 'json',
            data : {'racingNum':$scope.racingNum,racingResult:$scope.arrResult}
        }).then(function(res){
            console.log(res,'modifyReslut');
        },function(err){
            console.log(err);
            $scope.modifyNotice = '请求失败请重试';
        })
    }


}]);

//机器人管理
myApp.controller('robotCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('robotStatusCtrl',['$scope',function($scope){
    $scope.text = "机器人状态管理";
}]).controller('robotOddsCtrl',['$scope',function($scope){
    $scope.text = "机器人赔率管理";
}]);
//玩家管理
myApp.controller('playerCtrl',['$scope','$location',function($scope,$location){
    //页面一进来控制 class active
    $scope.selectClass = $location.path().substr(1);
}]).controller('playerlistCtrl',['$scope','$http','encrypt','localStorageService',function($scope,$http,encrypt,localStorageService){
    $scope.text = "玩家列表管理";

    $scope.queryNickName = '';
    $scope.queryPage = '';

    function initEncrypt(url,bodyQuery){
        //console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        //console.log(authoriza,'set');
    }

    function initData(){
        $http({
           url : 'http://60.205.163.65:8080/user/members?nickname='+$scope.queryNickName+'&page='+$scope.queryPage,
           method : 'get',
        }).then(function(res){
           console.log(res);
           var data = res.data;

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
        console.log('search');
        $scope.queryNickName = $scope.nickname;
        initEncrypt('http://60.205.163.65:8080/user/members?nickname='+$scope.queryNickName+'&page='+$scope.queryPage,null);
        initData();
    }

    //分页
    $scope.goPage = function(page){
        console.log(page);
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
        //console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        //console.log(authoriza,'set');
    }

    $scope.selectActive = 'byDate';

    function byDate(){
        initEncrypt('http://60.205.163.65:8080/user/members/income/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/user/members/income/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;

            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }
    function byIssue(){
        initEncrypt('http://60.205.163.65:8080/user/members/income/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/user/members/income/racing?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&racingNum='+$scope.queryIssue+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;

            $scope.tableData = data.data;

            $scope.currentPage = data.page;
            //$scope.pageSize = data.pageSize;  //每页显示多少
            $scope.total = data.totalPage;

        },function(){
            alert('请求失败，请重试或缺失必要内容');
        });
    }

    byDate();


    $scope.nickSearch = function(event){
        $timeout.cancel(timer);
        timer = $timeout(function(){
            console.log($scope.nickname);
            //initEncrypt('./data/list.php',null);
            $http({
                url : './data/list.php',
                method : 'get'
            }).then(function(res){
                // var data = res.data;
                // console.log(res);
                // if(data.result == 'SUCCESS'){
                //     $scope.nicklist = true;
                //     $scope.listItems = data.data;
                // }

                if(res.status ==200){
                    console.log(res);
                    $scope.nicklist = true;
                    $scope.listItems = res.data;
                }

            },function(){

            });

        },300);
    }
    $scope.listClick = function(str){
        $scope.nicklist = false;
        $scope.nickname = str;
    }

    $scope.searchByDate = function() {
        console.log('search by date');
        console.log($scope.startTime,$scope.endTime);
        $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
        $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        byDate();
    };

    $scope.searchByIssue = function() {
        console.log('search by issue');
        console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
        $scope.queryStartDate = new Date($scope.startTimeIssue+' 00:00:00').getTime();
        $scope.queryEndDate = new Date($scope.endTimeIssue+' 23:59:59').getTime();
        $scope.queryIssue = $scope.issue;
        byIssue();
    }


    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        console.log(page);
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
    //console.log($stateParams);
    $scope.queryMemberId = $stateParams.memberId;
    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryType = '';
    $scope.queryPage = '';

    function initEncrypt(url,bodyQuery){
        //console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        //console.log(authoriza,'set');
    }
    function initData(){
        initEncrypt('http://60.205.163.65:8080/user/members/'+$scope.queryMemberId+'?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&type='+$scope.queryType+'&page='+$scope.queryPage,null);
        $http({
           url : 'http://60.205.163.65:8080/user/members/'+$scope.queryMemberId+'?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&type='+$scope.queryType+'&page='+$scope.queryPage,
           method : 'get',
        }).then(function(res){
           console.log(res);
           var data = res.data;

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
        console.log($scope.startTime,$scope.endTime,$scope.type);
        $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
        $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        $scope.queryType = $scope.type;
        initData();
    }

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
    $scope.info = '当前总积分 == 当前结余积分 === 玩家总积分';

    $scope.queryStatus = '';
    $scope.queryStartDate = '';
    $scope.queryEndDate = '';
    $scope.queryPage = '';

    function initEncrypt(url,bodyQuery){
        //console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        //console.log(authoriza,'set');
    }
    function initData(){
        initEncrypt('http://60.205.163.65:8080/user/points?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&status='+$scope.queryStatus+'&page='+$scope.queryPage,null);
        $http({
           url : 'http://60.205.163.65:8080/user/points?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&status='+$scope.queryStatus+'&page='+$scope.queryPage,
           method : 'get',
        }).then(function(res){
           console.log(res);
           var data = res.data;

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



    //select
    $scope.selectOptions =[{key:'UNTREATED',value:'申请中'},{key:'AUDIT',value:'已批准'},{key:'REJECT',value:'已拒绝'},{key:'CANCEL',value:'已取消'}];
    $scope.selection = $scope.selectOptions[0];
    $scope.selectChange = function(){
        console.log($scope.selection.key);
        $scope.queryStatus = $scope.selection.key;
        // $scope.queryPage = 1;
        // initData();
    };

    //新增 确认
    $scope.confirm = function() {
        console.log($scope.applyText,$scope.money);
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
           console.log(res);
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
    };


    //取消
    $scope.cancel = function(id){
        console.log(id);
        initEncrypt('http://60.205.163.65:8080/user/points/status/cancel',null);
        $http({
           url : 'http://60.205.163.65:8080/user/points/status/cancel',
           method : 'put',

        }).then(function(res){
           console.log(res);
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

    $scope.search = function(){
        console.log($scope.selection);
        $scope.queryStatus = $scope.queryStatus;
        $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
        $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        $scope.queryPage = 1;
        initData();
    }

    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        initData();
    };

}]).controller('listCtrl',['$scope','$http','encrypt','localStorageService',function($scope,$http,encrypt,localStorageService){
    $scope.text = "操作记录";
    $scope.info = '当前总积分 == 当前结余积分 === 玩家总积分';

    //默认选择
    $scope.status = 1;

    $scope.queryStatus = 1;
    $scope.queryPage = 1;


    function initEncrypt(url,bodyQuery){
        //console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        //console.log(authoriza,'set');
    }
    function initData(){
        initEncrypt('http://60.205.163.65:8080/user/state?status='+$scope.queryStatus+'&page='+$scope.queryPage,null);
        $http({
           url : 'http://60.205.163.65:8080/user/state?status='+$scope.queryStatus+'&page='+$scope.queryPage,
           method : 'get',
        }).then(function(res){
           console.log(res);
           var data = res.data;

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

    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        initData();
    };

    //change
    $scope.change = function(){
        console.log($scope.status);
        initData();
    }

    // $scope.tableData = [
    //     {'code':1,'content':'aa','time':'2016-04-06','bb':[1,2],'cc':[3,4],'dd':[5,6]},
    //     {'code':2,'content':'aa','time':'2016-04-06','bb':[1,2],'cc':[3,4],'dd':[5,6]}
    // ];

}]);


//查看积分详情
// myApp.controller('integralDetailCtrl',['$scope','$stateParams','$sanitize',function($scope,$stateParams,$sanitize){
//     //console.log($stateParams);
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
//         console.log(page);
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
        //console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        //console.log(authoriza,'set');
    }

    function byDate(){
        initEncrypt('http://60.205.163.65:8080/user/income/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/user/income/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;

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
        console.log('search by date');
        console.log($scope.startTime,$scope.endTime);
        $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
        $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        byDate();
    };

    $scope.searchByIssue = function() {
        console.log('search by issue');
        console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
        $scope.queryStartDate = new Date($scope.startTimeIssue+' 00:00:00').getTime();
        $scope.queryEndDate = new Date($scope.endTimeIssue+' 23:59:59').getTime();
        $scope.queryIssue = $scope.issue;
        byIssue();
    }

    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        console.log(page);
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
        //console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        //console.log(authoriza,'set');
    }


    function byDate(){
        initEncrypt('http://60.205.163.65:8080/user/bat/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,null);
        $http({
            url : 'http://60.205.163.65:8080/user/bat/day?startDate='+$scope.queryStartDate+'&endDate='+$scope.queryEndDate+'&page='+$scope.queryPage,
            method : 'get'
        }).then(function(res){
            var data = res.data;

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
        console.log('search by date');
        console.log($scope.startTime,$scope.endTime);
        $scope.queryStartDate = new Date($scope.startTime+' 00:00:00').getTime();
        $scope.queryEndDate = new Date($scope.endTime+' 23:59:59').getTime();
        byDate();
    };

    $scope.searchByIssue = function() {
        console.log('search by issue');
        console.log($scope.startTimeIssue,$scope.endTimeIssue,$scope.issue);
        $scope.queryStartDate = new Date($scope.startTimeIssue+' 00:00:00').getTime();
        $scope.queryEndDate = new Date($scope.endTimeIssue+' 23:59:59').getTime();
        byIssue();
    };

    //分页
    $scope.goPage = function(page){
        $scope.queryPage = page;
        console.log(page);
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

}]).controller('betDetailCtrl',['$scope','$stateParams',function($scope,$stateParams){

    $scope.dateIssue = $stateParams.racingNum;
    $scope.lotteryRestut = '';
    $scope.count = $stateParams.count;
    $scope.money = 1000;
    $scope.fitloss = 23;
    $scope.allfitloss = 43;



    //1-10 表格数据
    $scope.table1 = [
        //1
        [
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'},
            {key:'大',value:1.94,money:'aa'}
        ],
        //2
        [
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'},
            {key:'小',value:1.94,money:'aa'}
        ],
        //3
        [
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'},
            {key:'单',value:1.94,money:'aa'}
        ],
        //4
        [
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'},
            {key:'双',value:1.94,money:'aa'}
        ],
        //5
        [
            {key:'龙',value:1.94,money:'aa'},
            {key:'龙',value:1.94,money:'aa'},
            {key:'龙',value:1.94,money:'aa'},
            {key:'龙',value:1.94,money:'aa'},
            {key:'龙',value:1.94,money:'aa'},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''}
        ],
        //6
        [
            {key:'虎',value:1.94,money:'aa'},
            {key:'虎',value:1.94,money:'aa'},
            {key:'虎',value:1.94,money:'aa'},
            {key:'虎',value:1.94,money:'aa'},
            {key:'虎',value:1.94,money:'aa'},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''},
            {key:'',value:'',money:''}
        ],
        //7
        [
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'},
            {key:1,value:9.7,money:'aa'}
        ],
        //8
        [
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'},
            {key:2,value:9.7,money:'aa'}
        ],
        //9
        [
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'},
            {key:3,value:9.7,money:'aa'}
        ],
        //10
        [
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'},
            {key:4,value:9.7,money:'aa'}
        ],
        //11
        [
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'},
            {key:5,value:9.7,money:'aa'}
        ],
        //12
        [
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'},
            {key:6,value:9.7,money:'aa'}
        ],
        //13
        [
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'},
            {key:7,value:9.7,money:'aa'}
        ],
        //14
        [
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'},
            {key:8,value:9.7,money:'aa'}
        ],
        //15
        [
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'},
            {key:9,value:9.7,money:'aa'}
        ],
        //16
        [
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'},
            {key:10,value:9.7,money:'aa'}
        ],
    ];


    //冠亚组 表格数据
    $scope.table2 = [
        [{'key':'3','value':'41','money':'100'},{'key':'4','value':'41','money':'100'},{'key':'5','value':'21','money':'100'},{'key':'6','value':'21','money':'100'}],
        [{'key':'7','value':'12','money':'100'},{'key':'8','value':'12','money':'100'},{'key':'9','value':'10.3','money':'100'},{'key':'10','value':'10.3','money':'100'}],
        [{'key':'11','value':'8.3','money':'100'},{'key':'12','value':'10.3','money':'100'},{'key':'13','value':'10.3','money':'100'},{'key':'14','value':'12','money':'100'}],
        [{'key':'15','value':'12','money':'100'},{'key':'16','value':'21','money':'100'},{'key':'17','value':'21','money':'100'},{'key':'18','value':'41','money':'100'}],
        [{'key':'19','value':'12','money':'100'},{'key':'','value':''},{'key':'','value':''},{'key':'','value':''}],
        [{'key':'冠亚大','value':'2','money':'100'},{'key':'冠亚小','value':'1.63','money':'100'},{'key':'冠亚单','value':'1.63','money':'100'},{'key':'冠亚双','value':'2','money':'100'}]
    ];


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
        //console.log(url,'url');
        var authoriza = encrypt.getAuthor(url,bodyQuery,localStorageService.get('secretKey'));
        localStorageService.set('Authorization',authoriza);
        localStorageService.set('Accesskey',localStorageService.get('Accesskey'));
        //console.log(authoriza,'set');
    }

    $scope.modify = function(){
        console.log($scope.nickname,$scope.password);
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
    }

}])
