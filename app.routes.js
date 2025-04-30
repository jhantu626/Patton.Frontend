(function () {

  //#endregion Routes
  const Routes = function ($routeProvider, $httpProvider) {
    $routeProvider
      .when("/login", {
        templateUrl: "pages/login/login.html",
        controller: "LoginController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/login");
          }
        }
      })
      .when("/", {
        templateUrl: "pages/dashboard/dashboard.html",
        controller: "DashboardController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/dashboard");
          }
        }
      })
      .when("/dashboard", {
        templateUrl: "pages/dashboard/dashboard.html",
        controller: "dashboardController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/dashboard");
          }
        }
      })
      .when("/forgot_password", {
        templateUrl: "pages/forgot_password/forgot_password.html",
        controller: "ForgotPasswordController",
      })
      // .when("/warehouse_release", {
      //   templateUrl: "pages/warehouse/work_release.html",
      //   controller: "WarehouseReleaseController",
      //   resolve: {
      //     'auth': function (AppFactory) {
      //       return AppFactory.authenticated("/warehouse_release");
      //     }
      //   }
      // })

      .when("/user-profile", {
        templateUrl: "pages/user/users_profile.html",
        controller: "UserController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/user_profile");
          }
        }
      })

      .when("/change-password", {
        templateUrl: "pages/user/change_password.html",
        controller: "ChangePasswordController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/change_password");
          }
        }
      })

      .when("/user-details/:username", {
        templateUrl: "pages/user/users_details.html",
        controller: "UserDetailsController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/users_details");
          }
        }
      })

      //-------------- business --------------------------

      .when("/warehouse-release", {
        templateUrl: "pages/business/warehouse_release.html",
        controller: "WarehouseReleaseController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/warehouse_release");
          }
        }
      })

      .when("/release-invoice-from-web-releases", {
        templateUrl: "pages/business/release-invoice-from-web-releases.html",
        controller: "ReleaseInvoiceFromWebReleases",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/release-invoice-from-web-releases");
          }
        }
      })

      .when("/break-pallet-into-cartons-in-warehouse", {
        templateUrl: "pages/business/break_pallet_into_cartons_in_warehouse.html",
        controller: "BreakPalletCartonsController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/break-pallet-into-cartons-in-warehouse");
          }
        }
      })

      .when("/release-order-entry", {
        templateUrl: "pages/business/release_order_entry.html",
        controller: "ReleaseOrderEntryController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/release-order-entry");
          }
        }
      })

      .when("/release-order-dispatch", {
        templateUrl: "pages/business/release_order_dispatch.html",
        controller: "ReleaseOrderDispatchController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/release-order-dispatch");
          }
        }
      })

      .when("/post-invoice-to-workbook", {
        templateUrl: "pages/business/post_invoice_to_workbook.html",
        controller: "PostInvoiceToWorkbookController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/post-invoice-to-workbook");
          }
        }
      })

    
      //-------------- master --------------------------

      .when("/customer", {
        templateUrl: "pages/master/customer.html",
        controller: "CustomerMasterController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/customer");
          }
        }
      })

      .when("/clearing-agent", {
        templateUrl: "pages/master/clearing_agent.html",
        controller: "ClearingAgentMasterController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/clearing_agent");
          }
        }
      })

      .when("/transporter", {
        templateUrl: "pages/master/transporter.html",
        controller: "TransporterMasterController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/transporter");
          }
        }
      })

      .when("/rate-master", {
        templateUrl: "pages/master/rate_master.html",
        controller: "RateMasterController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/rate_master");
          }
        }
      })

      .when("/product", {
        templateUrl: "pages/master/product.html",
        controller: "ProductMasterController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/product");
          }
        }
      })

      .when("/party-reference-master", {
        templateUrl: "pages/master/party_reference_master.html",
        controller: "PartyReferenceController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/party_reference_master");
          }
        }
      })

      .when("/warehouse-consignee-master", {
        templateUrl: "pages/master/warehouse_consignee_master.html",
        controller: "ConsigneeMasterController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/warehouse_consignee_master");
          }
        }
      })

      .when("/destination", {
        templateUrl: "pages/master/destination.html",
        controller: "DestinationMasterController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/destination");
          }
        }
      })

      .when("/hs-code", {
        templateUrl: "pages/master/hs_code.html",
        controller: "HsCodeMasterController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/hs_code");
          }
        }
      })

      .when("/warehouse-master", {
        templateUrl: "pages/master/warehouse_master.html",
        controller: "WarehouseMasterController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/warehouse_master");
          }
        }
      })

      .when("/error-log", {
        templateUrl: "pages/master/error_log.html",
        controller: "ErrorLogController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/error_log");
          }
        }
      })

      //------------------ Role -----------------------

      .when("/role-management", {
        templateUrl: "pages/role/role_management.html",
        controller: "roleManagementController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/role_management");
          }
        }
      })

      .when("/role-group-management", {
        templateUrl: "pages/role/role_group_management.html",
        controller: "roleGroupManagementController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/role_group_management");
          }
        }
      })

      .when("/role-user", {
        templateUrl: "pages/role/role_user.html",
        controller: "roleUsertController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/role_user");
          }
        }
      })

      .when("/role-details/:roleGroupId", {
        templateUrl: "pages/role/role_details.html",
        controller: "roleDetailsController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/role_details");
          }
        }
      })

      .when("/file-generate", {
        templateUrl: "pages/master/file_generate.html",
        controller: "FileGenerateController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/file_generate");
          }
        }
      })

      //-------------- Customer --------------------------

      .when("/customer-warehouse-release", {
        templateUrl: "pages/customer/customer_warehouse_release.html",
        controller: "CustomerWarehouseReleaseController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/customer_warehouse_release");
          }
        }
      })

      .when("/customer-warehouse-stock-view/:location", {
        templateUrl: "pages/customer/customer_warehouse_stock_view.html",
        controller: "CustomerWarehouseStockViewController",
        resolve: {
            'auth': function (AppFactory) {
                return AppFactory.authenticated("/customer_warehouse_stock_view");
            }
        }
      })
    

      .when("/customer-warehouse-release1", {
        templateUrl: "pages/customer/customer_warehouse_release1.html",
        controller: "CustomerWarehouseRelease1Controller",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/customer_warehouse_release1");
          }
        }
      })

      .when("/customer-warehouse-release-view", {
        templateUrl: "pages/customer/customer_warehouse_release_view.html",
        controller: "CustomerWarehouseReleaseViewController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/customer_warehouse_release_view");
          }
        }
      })

      .when("/warehouse-transit-details", {
        templateUrl: "pages/customer/warehouse_transit_details.html",
        controller: "WarehouseTransitDetailsController",
        resolve: {
          'auth': function (AppFactory) {
            return AppFactory.authenticated("/warehouse_transit_details");
          }
        }
      })

      //-------------- end master --------------------------





    .otherwise({ redirectTo: '/' });

    const Interceptor = function ($q) {
      return {
        request: function (config) {
          console.log('request started...');
          //Validating the requests and assign the csrf token to each requests
          // var token = $cookieStore.get("auth");
          // config.headers['x-csrf-token'] = token; 
          return config;
        },
        requestError: function (rejection) {
          console.log(rejection);
          // Contains the data about the error on the request and return the promise rejection.
          return $q.reject(rejection);
        },
        response: function (result) {
          console.log(result);

          //If some manipulation of result is required. 
          console.log('request completed');
          return result;
        },
        responseError: function (response) {
          // console.log('response error started...');

          // //Check different response status and do the necessary actions 400, 401, 403,401, or 500 eror     
          // if (response.status === 401) {
          //     $location.path('/signin');
          //     $rootScope.$broadcast('error');
          // }

          // if (response.status === 500) {
          //     $rootScope.ErrorMsg = "An Unexpected error occured";
          //     $location.path('/Error');
          // }    
          return $q.reject(response);
        }
      };
    };

    $httpProvider.interceptors.push(Interceptor);



    function init() {

    }
    init();


  };
  Routes.$inject = ["$routeProvider", "$httpProvider"];
  angular.module("PattonApp").config(Routes);

  //#region Routes
}());
