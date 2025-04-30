angular.module('PattonApp', ["ngRoute",'ngRows']);


(function () {

    //#region  AppRun
    const AppRun = function ($rootScope, $location, $interval, AppService) {
        const rootvm = $rootScope;
        $interval(function () {
            console.log(new Date());
            if(AppService.isTokenExpired())
            {
                AppService.loginExtend();
            }
            else if (rootvm.isLoggedIn && rootvm.loggedInUser) 
            {
                if (!AppService.isTokenValid()) 
                {
                    $location.path("/login");
                    window.location.reload();
                }
            }
        }, 100000);

        $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
            console.log(rejection);
            if (rejection === 'NOT_AUTHENTICATED') {
                $location.path("/login");
            } else {
                $location.path("/login");
            }
        });
    };
    AppRun.$inject = ['$rootScope', "$location", "$interval", "AppService"];
    angular.module("PattonApp").run(AppRun);
    //#region AppRun

    //#region  AppConstant
    angular.module("PattonApp").constant("AppConstant", {
        loggedInUserKey: "8tMOTYrCJEtpCtpZiAaBtapO",
        configPath: "/data/config.json"
    });

    //#region AppConstant


}());


