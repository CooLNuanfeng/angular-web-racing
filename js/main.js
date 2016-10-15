var myApp = angular.module('myApp',['ui.router','ui.sortable','bw.paging','ngSanitize','moment-picker','LocalStorageModule','angular-sha1']);

myApp.config(['$stateProvider','$urlRouterProvider','$httpProvider','localStorageServiceProvider',function($stateProvider,$urlRouterProvider,$httpProvider,localStorageServiceProvider){

    //所有请求添加header配置
    $httpProvider.interceptors.push('HttpInterceptor');


    // 路由部分
    $urlRouterProvider.otherwise('/login');


    //实时开奖
    $stateProvider.state('login',{
        url : '/login',
        templateUrl : './templates/login/login.html'
    }).state('realtime',{
        url : '/realtime',
        templateUrl : './templates/realtime/realtime.html',
    })
    //开奖列表
    .state('lottery',{
        url : '/lottery',
        templateUrl : './templates/lottery/lottery.html',
    }).state('lottery.list',{
        url : '/list',
        templateUrl : './templates/lottery/lotterylist.html',
        controller : 'lotterylistCtrl'
    })
    //押注
    .state('betshow',{
        url : '/betshow',
        templateUrl : './templates/betshow/betshow.html',
    })
    //机器人管理
    .state('robot',{
        url : '/robot',
        templateUrl : './templates/robot/robot.html',
    }).state('robot.status',{
        url : '/status',
        templateUrl : './templates/robot/status.html'
    }).state('robot.odds',{
        url : '/odds',
        templateUrl : './templates/robot/odds.html'
    })
    //玩家管理
    .state('player',{
        url : '/player',
        templateUrl : './templates/player/player.html',
    }).state('player.report',{
        url : '/report',
        templateUrl : './templates/player/playerport.html'
    }).state('player.list',{
        url : '/list',
        templateUrl : './templates/player/playerlist.html'
    }).state('playerDetail',{
        url : '/playerDetail/:memberId',
        templateUrl : './templates/player/playerdetail.html'
    }).state('reportDetail',{
        url : '/reportDetail/:racingNum&:count',
        templateUrl : './templates/bet/betDetail.html'
    })
    //积分管理
    .state('integral',{
        url : '/integral',
        templateUrl : './templates/integral/integral.html',
    }).state('integral.apply',{
        url : '/apply',
        templateUrl : './templates/integral/apply.html',
    }).state('integral.list',{
        url : '/list',
        templateUrl : './templates/integral/list.html',
    }).state('integralDetail',{
        url : '/integralDetail/?item1&item2',
        templateUrl : './templates/integral/integralDetail.html',
    })
    //盈亏报表
    .state('profitlose',{
        url : '/profitlose',
        templateUrl : './templates/profitlose/profitlose.html',
    }).state('profitlose.other',{
        url : '/profitloseOther',
        templateUrl : './templates/profitlose/other.html',
    })
    //押注报表
    .state('bet',{
        url : '/bet',
        templateUrl : './templates/bet/bet.html',
    }).state('bet.otherbet',{
        url : '/otherBet',
        templateUrl : './templates/bet/other.html',
    }).state('betDetail',{
        url : '/betDetail/:type&:id',
        templateUrl : './templates/bet/betDetail.html'
    })
    //个人信息管理
    .state('users',{
        url : '/users',
        templateUrl : './templates/users/users.html',
    }).state('users.all',{
        url : '/allUser',
        templateUrl : './templates/users/all.html',
    });

}]);
//监控所有路由 清除 实时监控的 请求定时器
myApp.run(['$state','$rootScope','$timeout','localStorageService',function($state,$rootScope,$timeout,localStorageService){
    $rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams,options){
        console.log('url router change');
        $timeout.cancel($rootScope.yztimer);
        $timeout.cancel($rootScope.timer);
        if(toState.name=='login')return;// 如果是进入登录界面则允许
        if(!localStorageService.get('username')){
    		event.preventDefault();// 取消默认跳转行为
    		$state.go("login");//跳转到登录界面
    	}
    });
}]);
