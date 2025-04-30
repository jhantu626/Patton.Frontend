(function () {
	//#region  AppFactory
	const AppFactory = function ($rootScope, $http, $q, AppService, AppConstant, $location) {
		const factory = {};
		const rootvm = $rootScope;
		factory.authenticated = function (path) {
			switch (path) {
				case "/login": {
					if (!AppService.isTokenValid()) {
						return true;
					} else {
						$location.path("/");
					}
				} break;
			}

			if (AppService.isTokenValid()) {
				return true;
			} else {
				return $q.reject("NOT_AUTHENTICATED");
			}
		};

		factory.init = function () {
			// AppService.getConfig();
		};

		factory.init();

		return factory;
	};
	AppFactory.$inject = ["$rootScope", "$http", "$q", "AppService", "AppConstant", "$location"];
	angular.module("PattonApp").factory("AppFactory", AppFactory);

	//#endregion  AppFactory

}());