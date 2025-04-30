(function () {
  //#region  AppService
  const AppService = function ($rootScope, $q, AppConstant, $http, $location) {

    const rootvm = $rootScope;
    rootvm.loggedInUser = null;
    rootvm.config = null;

    const getHeaders = function () {
      if (rootvm.loggedInUser && rootvm.loggedInUser.token) {
        return {
          'Authorization': 'Bearer ' + rootvm.loggedInUser.token
        };
      } else {
        return {

        };
      }
    };

    this.getloggedInUser = function () {
      if (!rootvm.loggedInUser) {
        const loggedInUserValue = localStorage.getItem(AppConstant.loggedInUserKey);
        if (loggedInUserValue) {
          const decreptedValue = JSON.parse(atob(loggedInUserValue));
          if (decreptedValue) {
            rootvm.loggedInUser = decreptedValue;
          } else {
            rootvm.loggedInUser = null;
            localStorage.removeItem(AppConstant.loggedInUserKey);
          }
        } else {
          rootvm.loggedInUser = null;
          localStorage.removeItem(AppConstant.loggedInUserKey);
        }
      }
      return rootvm.loggedInUser;
    };

    this.setloggedInUser = function (loggedInUser) {
      if (loggedInUser) {
        rootvm.loggedInUser = loggedInUser;
        if (this.isTokenValid()) {
          const encreptedValue = btoa(JSON.stringify(loggedInUser));
          if (encreptedValue) {
            localStorage.setItem(AppConstant.loggedInUserKey, encreptedValue);
          }
        } else {
          localStorage.removeItem(AppConstant.loggedInUserKey);
        }

      }
      return rootvm.loggedInUser;
    };

    this.isTokenValid = function () {
      if (rootvm.loggedInUser && rootvm.loggedInUser.expiration && (new Date() < new Date(rootvm.loggedInUser.expiration))) {
        return true;
      }
      rootvm.isLoggedIn = false;
      rootvm.loggedInUser = null;
      localStorage.removeItem(AppConstant.loggedInUserKey);
      return false;
    };

    this.get = function (urlPath) {
      const config = {
        headers: getHeaders()
      };

      return $http.get(urlPath, config);
    };
    
    this.post = function (urlPath, body) {

      const config = {
        headers: getHeaders()
      };
      return $http.post(urlPath, body, config);
    };

    this.getPromise = function (urlPath) {
      const promiseResponse = $q.defer();
      $http.get(urlPath).then(function (res) {
        promiseResponse.resolve(res);
      });
      return promiseResponse.promise;
    };

    this.getConfig = function () {
      const promiseResponse = $q.defer();
      if (!rootvm.config) {
        this.getPromise(AppConstant.configPath).then(function (res) {
          if (res && res.data) {
            rootvm.config = res.data;
          }
          return promiseResponse.resolve(rootvm.config);
        });
      }
      promiseResponse.resolve(rootvm.config);
      return promiseResponse.promise;;
    };

    this.isTokenExpired = function()
    {
      const fiveMinutesInMs = 5 * 60 * 1000; // 5 minutes in milliseconds
      const expirationDate = new Date(rootvm.loggedInUser.expiration);
      const newExpirationDate = new Date(expirationDate.getTime() - fiveMinutesInMs);

      console.log(fiveMinutesInMs);
      console.log(expirationDate);
      console.log(newExpirationDate);

      if (rootvm.loggedInUser && rootvm.loggedInUser.expiration && (new Date() < newExpirationDate)) 
      {
        return true;
      }
    };

    this.loginExtend=function(){
      const url = rootvm.config.API_URL + rootvm.config.EndPoints.loginextend;
      this.post(url,{}).then(function (res) {
        if (res && res.data) 
        {
          rootvm.loggedInUser.token = res.data.token;
          rootvm.loggedInUser.expiration = res.data.expiration;

          this.setloggedInUser(
            rootvm.loggedInUser
          );
        }
    });
    };



    this.init = function () {
      this.getloggedInUser();
      this.getConfig();
    };
    this.init();

  };
  AppService.$inject = ["$rootScope", "$q", "AppConstant", "$http", "$location"];
  angular.module("PattonApp").service("AppService", AppService);

  //#endregion  AppService

}());