(function () {
  //#region PattonAppController
  const PattonAppController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;
    vm.title = "Patton International Limited";
    vm.headerPath = "pages/header/header.html";
    vm.headerPath = "pages/header/header.html";
    rootvm.isLoggedIn = false;
    //

    vm.logout = function () {
      localStorage.clear();
      rootvm.isLoggedIn = false;
      rootvm.loggedInUser = null;
      window.location.reload();
      $location.path("/login");
    };

    function init() {
      if (AppService.isTokenValid()) {
        rootvm.isLoggedIn = true;
        //rootvm.role = rootvm.isLoggedIn ? rootvm.isLoggedIn.roles : [];
        //vm.getMenus();
      } else {
        rootvm.isLoggedIn = false;
      }
    }
    init();
  };
  PattonAppController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("PattonAppController", PattonAppController);
  //#endregion PattonAppController

  //#region LoginController
  const LoginController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory,
    $http
  ) {
    const vm = $scope;
    const rootvm = $rootScope;
    vm.user = {};
    //vm.user = { username: "patton_user", password: "patton@user" };
    //vm.user = { username: "admin", password: "tank321" };
    vm.isValidate = function () {
      vm.loginErrorMessage = "";
      if (!vm.user.username) {
        vm.loginErrorMessage = "Please fill Username";
        return false;
      }
      if (!vm.user.password) {
        vm.loginErrorMessage = "Please fill Password";
        return false;
      }
      return true;
    };

    vm.login = function () {
      if (vm.isValidate()) {
        const url = rootvm.config.API_URL + rootvm.config.EndPoints.Login;
        //const url = "/data/login-success.json";

        const body = {
          username: vm.user.username,
          password: vm.user.password,
        };

        // AppService.get(url)
        AppService.post(url, body).then(
          function (response) {
            if (response && response.data) {
              AppService.setloggedInUser(response.data);
              if (AppService.isTokenValid()) {
                rootvm.isLoggedIn = true;
                $location.path("/");
              } else {
                vm.loginErrorMessage = "Token is Expried";
              }
            }
          },
          function (error) {
            //console.log(error);
            //if (error && error.status == 401) {
            vm.loginErrorMessage = "Invalid Login /password";
            //}
          }
        );
      } else {
        vm.loginErrorMessage = "Validation Failed";
      }
    };

    function init() {
      if (AppService.isTokenValid()) {
        rootvm.isLoggedIn = true;
        $location.path("/");
      } else {
        rootvm.isLoggedIn = false;
      }
    }

    init();
  };
  LoginController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
    "$http",
  ];
  angular.module("PattonApp").controller("LoginController", LoginController);
  //#endregion LoginController

  //#region DashboardController
  const DashboardController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;
    rootvm.menulist = [];
    vm.getMenus = function () {
      if (rootvm.menulist && rootvm.menulist.length < 1) {
        var url2 = rootvm.config.API_URL + rootvm.config.EndPoints.usermenulist;
        var body2 = {};

        //vm.datalookup=[];
        AppService.post(url2, body2).then(
          function (response) {
            if (response.status == 200) {
              if (response && response.data) {
                rootvm.menulist = vm.makeMenuTree(response.data);

                //vm.isBodyLoading = false;
              }
            }
          },
          function (error) {
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      }
    };

    vm.makeMenuTree = function (menus) {
      if (menus && menus.length > 0) {
        const parentMenus = menus.filter((x) => !x.parentId);

        parentMenus.forEach((menu) => {
          menu.menus = menus.filter((x) => x.parentId === menu.id);

          menu.menus.forEach((item) => {
            item.menus1 = menus.filter((x) => x.parentId === item.id);
          });
        });

        //console.log(parentMenus);
        return parentMenus;
      }
      return [];
    };

    vm.init = function () {
      vm.getMenus();
    };

    vm.init();
  };
  DashboardController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("DashboardController", DashboardController);
  //#endregion DashboardController

  //#region ForgotPasswordController
  const ForgotPasswordController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;
    vm.forgot_password = function () {
      var credentials = {
        email: vm.email,
      };
      //console.log(credentials);
    };
    vm.init = function () {};

    vm.init();
  };
  ForgotPasswordController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("ForgotPasswordController", ForgotPasswordController);
  //#endregion ForgotPasswordController

  //#region WarehouseReleaseController
  const WarehouseReleaseController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;
    vm.warehouseReleaseTransfer = null;

    // vm.warehouseRelease = {
    //     action: 'RELEASE' // You can set a default value or leave it empty
    // };

    vm.model = {
      type: "NORMAL",
      source: "PII",
      action: "RELEASE",
      partyCode: "",
      itemNumber: "",
    };

    vm.labelpartyCode = "Party";
    vm.labelitemNumber = "Release";
    vm.labelitemDate = "Release";
    vm.labelbuyerCode = "Buyer";
    vm.labelAddabel = "Release";

    const url =
      rootvm.config.API_URL +
      rootvm.config.EndPoints.warehouse_release_transfer;
    //const url = "/data/work-release-transfer.json";

    //---------------- Reset
    vm.reset = function () {
      location.reload();
    };

    //---------------- Action Data Reset

    vm.ActionReset = function () {
      vm.model.partyCode = "";
      vm.model.itemNumber = "";
      vm.model.itemDate = "";
      vm.model.consigneeCode = "";
      vm.model.buyerCode = "";

      vm.warehouseRelease = [];
      vm.warehouseReleaseSaveData = [];

      $("#loader").css("display", "none");

      if (vm.model.action === "STOCKIN") {
        $("#new_add_others").css("display", "none");
        $("#new_add_others1").css("display", "none");

        $("#new_add_stockin").css("display", "block");
        $("#new_add_stockin1").css("display", "block");
      } else {
        $("#new_add_others").css("display", "block");
        $("#new_add_others1").css("display", "block");

        $("#new_add_stockin").css("display", "none");
        $("#new_add_stockin1").css("display", "none");
      }

      if (vm.model.action === "RELEASE") {
        vm.labelpartyCode = "Party";
        vm.labelitemNumber = "Release";
        vm.labelitemDate = "Release";
        vm.labelbuyerCode = "Buyer";
        vm.labelAddabel = "Release";

        $("#select2-partyCode-container").html("Select Party Code");
        $("#select2-consigneeCode-container").html("Select Consignee Code");
        $("#select2-buyerCode-container").html("Select Buyer Code");
      } else if (vm.model.action === "TRANSFER") {
        vm.labelpartyCode = "Transferor";
        vm.labelitemNumber = "Transfer";
        vm.labelitemDate = "Transfer";
        vm.labelbuyerCode = "Transferee";
        vm.labelAddabel = "Transfer";

        $("#select2-partyCode-container").html("Select Transferor Code");
        $("#select2-consigneeCode-container").html("Select Consignee Code");
        $("#select2-buyerCode-container").html("Select Transferee Code");
      } else if (vm.model.action === "STOCKIN") {
        vm.labelpartyCode = "Party";
        vm.labelitemNumber = "Stock In";
        vm.labelitemDate = "Stock In";
        vm.labelbuyerCode = "Buyer";
        vm.labelAddabel = "Stock In";

        $("#select2-partyCode-container").html("Select Party Code");
        $("#select2-consigneeCode-container").html("Select Consignee Code");
        $("#select2-buyerCode-container").html("Select Buyer Code");
      } else if (vm.model.action === "BREAK") {
        vm.labelpartyCode = "Transferor";
        vm.labelitemNumber = "Break";
        vm.labelitemDate = "Break";
        vm.labelbuyerCode = "Transferee";
        vm.labelAddabel = "Break";

        $("#select2-partyCode-container").html("Select Transferor Code");
        $("#select2-consigneeCode-container").html("Select Consignee Code");
        $("#select2-buyerCode-container").html("Select Transferee Code");
      } else if (vm.model.action === "DISPATCH") {
        vm.labelitemNumber = "Dispatch";
        vm.labelitemDate = "Dispatch";
      } else {
        vm.labelpartyCode = "Party";
        vm.labelitemNumber = "Release";
        vm.labelitemDate = "Release";
        vm.labelbuyerCode = "Buyer";
        vm.labelAddabel = "Release";

        $("#select2-partyCode-container").html("Select Party Code");
        $("#select2-consigneeCode-container").html("Select Consignee Code");
        $("#select2-buyerCode-container").html("Select Buyer Code");
      }
    };

    //------------------ Fdestination

    vm.getFdestination = function () {
      vm.isBodyLoading = true;
      vm.model.consigneeCode = "";
      vm.model.buyerCode = "";
      $("#select2-consigneeCode-container").html("Select Consignee Code");
      $("#select2-buyerCode-container").html("Select Buyer Code");

      vm.warehouseRelease = [];

      vm.warehouseRelease.items = [];
      vm.warehouseRelease.transfers = [];
      vm.warehouseRelease.breaks = [];

      vm.warehouseReleaseSaveData = [];

      vm.ConsigneeCodeList = [];

      const url1 =
        rootvm.config.API_URL + rootvm.config.EndPoints.PartyWiseShiptoList;
      const body1 = { partyCode: vm.model.partyCode };

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.ConsigneeCodeList = response.data;
              vm.isBodyLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );

      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.PartyWiseWarehouseList;
      const body = {
        party: vm.model.partyCode,
      };

      vm.FdestinationList = [];
      vm.model.cfDestimation = "";
      $("#f_destination").css("display", "none");

      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.FdestinationList = response.data;
              vm.isBodyLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );

      const url2 = rootvm.config.API_URL + rootvm.config.EndPoints.PoNumberList;
      const body2 = {
        OrderNo: "",
        Party: vm.model.partyCode,
      };

      AppService.post(url2, body2).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.PoNoList = response.data;

              var orderArray = vm.PoNoList;
              var poArray = vm.warehouseRelease.items;

              var poToOrderFormat = poArray.map(function (item) {
                return { orderNo: item.poNumber };
              });

              var mergedArray = orderArray.concat(poToOrderFormat);

              vm.uniquePoNoList = mergedArray.filter(
                (item, index, self) =>
                  index === self.findIndex((t) => t.orderNo === item.orderNo)
              );

              console.log(vm.uniquePoNoList);
              vm.isBodyLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.f_destination_display_block = function () {
      if (vm.model.cfDestimation.length >= 1) {
        $("#f_destination").css("display", "block");
      } else {
        $("#f_destination").css("display", "none");
      }
    };

    vm.get_fdestination = function (destination) {
      vm.model.cfDestimation = destination;
      $("#f_destination").css("display", "none");
    };

    vm.getPonoForTransfer = function (party) {
      const urll1 = rootvm.config.API_URL + rootvm.config.EndPoints.partno;
      const bodyy1 = {
        party: party,
      };

      vm.partnolistfortrans = [];

      AppService.post(urll1, bodyy1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.partnolistfortrans = response.data;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };
    //----------------- End Fdestination

    //---------------- Data Search

    vm.DataSearch = function () {
      vm.model.pil_pii = "PII";
      vm.model.w2w = false;
      vm.mode = "EDIT";

      if (vm.model.action === "RELEASE") {
        if (vm.model.partyCode.trim() == "") {
          Swal.fire({ allowOutsideClick: false, text: "Select Party Code" });
        } else if (vm.model.itemNumber.trim() == "") {
          Swal.fire({ allowOutsideClick: false, text: "Enter Release Number" });
        } else {
          $("#loader").css("display", "block");

          const body = {
            type: vm.model.type,
            source: vm.model.source,
            action: vm.model.action,
            partyCode: vm.model.partyCode,
            itemNumber: vm.model.itemNumber,
          };
          vm.getReleaseData(body, vm.model.partyCode);
        }
      } else if (vm.model.action === "TRANSFER") {
        if (vm.model.partyCode.trim() == "") {
          Swal.fire({
            allowOutsideClick: false,
            text: "Select Transferor Code",
          });
        } else if (vm.model.itemNumber.trim() == "") {
          Swal.fire({
            allowOutsideClick: false,
            text: "Enter Transfer Number",
          });
        } else {
          $("#loader").css("display", "block");

          const body = {
            type: vm.model.type,
            source: vm.model.source,
            action: vm.model.action,
            partyCode: vm.model.partyCode,
            itemNumber: vm.model.itemNumber,
          };
          vm.getReleaseData(body, vm.model.partyCode);
        }
      } else if (vm.model.action === "STOCKIN") {
        if (vm.model.partyCode.trim() == "") {
          Swal.fire({ allowOutsideClick: false, text: "Select Party Code" });
        } else if (vm.model.itemNumber.trim() == "") {
          Swal.fire({ allowOutsideClick: false, text: "Enter Stock In" });
        } else {
          $("#loader").css("display", "block");

          const body = {
            type: vm.model.type,
            source: vm.model.source,
            action: vm.model.action,
            partyCode: vm.model.partyCode,
            itemNumber: vm.model.itemNumber,
          };
          vm.getReleaseData(body, vm.model.partyCode);
        }
      } else if (vm.model.action === "BREAK") {
        if (vm.model.partyCode.trim() == "") {
          Swal.fire({
            allowOutsideClick: false,
            text: "Select Transferor Code",
          });
        } else if (vm.model.itemNumber.trim() == "") {
          Swal.fire({ allowOutsideClick: false, text: "Enter Break Number" });
        } else {
          $("#loader").css("display", "block");

          const body = {
            type: vm.model.type,
            source: vm.model.source,
            action: vm.model.action,
            partyCode: vm.model.partyCode,
            itemNumber: vm.model.itemNumber,
          };
          vm.getReleaseData(body, vm.model.partyCode);
        }
      } else if (vm.model.action === "DISPATCH") {
        if (vm.model.partyCode.trim() == "") {
          Swal.fire({ allowOutsideClick: false, text: "Select Party Code" });
        } else if (vm.model.itemNumber.trim() == "") {
          Swal.fire({
            allowOutsideClick: false,
            text: "Enter Dispatch Number",
          });
        } else {
          $("#loader").css("display", "block");

          const body = {
            type: vm.model.type,
            source: vm.model.source,
            action: vm.model.action,
            partyCode: vm.model.partyCode,
            itemNumber: vm.model.itemNumber,
          };
          vm.getReleaseData(body, vm.model.partyCode);
        }
      }
    };

    vm.getReleaseData = function (body, Party) {
      vm.warehouseRelease = [];
      vm.warehouseReleaseSaveData = [];
      vm.PoNoList = [];

      AppService.post(url, body).then(
        function (response) {
          console.log("dispatch response", response);
          if (response.status == 200) {
            if (response && response.data) {
              if (response.data.status === "Not found") {
                $("#loader").css("display", "none");
                vm.norRsultFound = "No Record Found";
              } else {
                vm.isReadonly = true;
                vm.warehouseRelease = response.data.data;
                //vm.model.itemDate = '';
                //vm.warehouseRelease.itemDate="";
                vm.model.type = vm.warehouseRelease.type;
                if (vm.warehouseRelease.source !== null) {
                  vm.model.source = vm.warehouseRelease.source;
                } else {
                  vm.model.source = "PII";
                }
                vm.model.action = vm.warehouseRelease.action;
                vm.model.consigneeCode = vm.warehouseRelease.consigneeCode;
                vm.model.buyerCode = vm.warehouseRelease.buyerCode;
                vm.model.cfDestimation = vm.warehouseRelease.cfDestimation;
                //vm.model.itemDate=new Date(vm.warehouseRelease.itemDate).toISOString().split('T')[0];

                var date = new Date(vm.warehouseRelease.itemDate);
                var day = ("0" + date.getDate()).slice(-2);
                var month = ("0" + (date.getMonth() + 1)).slice(-2);
                var year = date.getFullYear();

                $("#select2-consigneeCode-container").html(
                  vm.model.consigneeCode
                );
                $("#select2-buyerCode-container").html(vm.model.buyerCode);
                $("#print_date").html(day + "-" + month + "-" + year);

                vm.model.itemDate = day + "-" + month + "-" + year;

                vm.model.cfDestimation = vm.warehouseRelease.cfDestimation;
                vm.norRsultFound = "";
                $("#loader").css("display", "none");

                if (vm.model.action === "RELEASE") {
                  vm.labelpartyCode = "Party";
                  vm.labelitemNumber = "Release";
                  vm.labelitemDate = "Release";
                  vm.labelbuyerCode = "Buyer";
                  vm.labelAddabel = "Release";
                  vm.btncheck = "RELEASE";
                } else if (vm.model.action === "TRANSFER") {
                  vm.labelpartyCode = "Transferor";
                  vm.labelitemNumber = "Transfer";
                  vm.labelitemDate = "Transfer";
                  vm.labelbuyerCode = "Transferee";
                  vm.labelAddabel = "Transfer";
                  vm.btncheck = "TRANSFER";
                } else if (vm.model.action === "STOCKIN") {
                  vm.labelpartyCode = "Party";
                  vm.labelitemNumber = "Stock In";
                  vm.labelitemDate = "Stock In";
                  vm.labelbuyerCode = "Buyer";
                  vm.labelAddabel = "Stock In";
                  vm.btncheck = "STOCKIN";
                } else if (vm.model.action === "BREAK") {
                  vm.labelpartyCode = "Transferor";
                  vm.labelitemNumber = "Break";
                  vm.labelitemDate = "Break";
                  vm.labelbuyerCode = "Transferee";
                  vm.labelAddabel = "Break";
                  vm.btncheck = "BREAK";
                } else if (vm.model.action === "DISPATCH") {
                  vm.labelitemNumber = "Dispatch";
                  vm.labelitemDate = "Dispatch";
                } else {
                  vm.labelpartyCode = "Party";
                  vm.labelitemNumber = "Release";
                  vm.labelitemDate = "Release";
                  vm.labelbuyerCode = "Buyer";
                  vm.labelAddabel = "Release";
                  vm.btncheck = "RELEASE";
                }

                const url2 =
                  rootvm.config.API_URL + rootvm.config.EndPoints.PoNumberList;
                const body2 = {
                  OrderNo: "",
                  Party: vm.model.partyCode,
                };

                AppService.post(url2, body2).then(
                  function (response) {
                    if (response.status == 200) {
                      if (response && response.data) {
                        vm.PoNoList = response.data;

                        var orderArray = vm.PoNoList;
                        var poArray = vm.warehouseRelease.items;

                        var poToOrderFormat = poArray.map(function (item) {
                          return { orderNo: item.poNumber };
                        });

                        var mergedArray = orderArray.concat(poToOrderFormat);

                        vm.uniquePoNoList = mergedArray.filter(
                          (item, index, self) =>
                            index ===
                            self.findIndex((t) => t.orderNo === item.orderNo)
                        );

                        console.log(vm.uniquePoNoList);
                        vm.isBodyLoading = false;
                      }
                    }
                  },
                  function (error) {
                    if (error.status == 500) {
                      Swal.fire({
                        allowOutsideClick: false,
                        icon: "error",
                        title: error.data,
                      });
                    } else if (error.status == 409) {
                      const errorMessage = Array.isArray(
                        error.data.requestError
                      )
                        ? error.data.requestError.join("<br/>")
                        : error.data.requestError;

                      Swal.fire({
                        allowOutsideClick: false,
                        icon: "error",
                        title: errorMessage,
                      });
                    } else if (
                      error.requestError.status == 400 ||
                      error.requestError.status == 401 ||
                      error.requestError.status == 402 ||
                      error.requestError.status == 403
                    ) {
                      Swal.fire({
                        text: Array.isArray(error.data.requestError)
                          ? error.data.requestError.join("<br/>")
                          : error.data.requestError,
                        allowOutsideClick: false,
                        icon: "error",
                        willClose: () => {
                          location.reload();
                        },
                      });
                    }
                  }
                );
              }
            } else {
              vm.warehouseRelease = [];
              vm.model.action = "";
              vm.model.consigneeCode = "";
              vm.model.buyerCode = "";
              vm.model.itemDate = "";
              vm.model.cfDestimation = "";
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    //-------- check blank field value

    vm.CheckValidate = function () {
      vm.norRsultFound = "";
      vm.loginErrorMessage = "";

      const validateForm = () => {
        const {
          type,
          source,
          action,
          partyCode,
          itemNumber,
          itemDate,
          consigneeCode,
          buyerCode,
        } = vm.model;

        if (type === "") {
          Swal.fire({
            allowOutsideClick: false,
            text: "Type should be among Normal, Rejection",
          });
        } else if (source === "") {
          Swal.fire({
            allowOutsideClick: false,
            text: "Source should be among PIL, PII",
          });
        } else if (action === "") {
          Swal.fire({
            allowOutsideClick: false,
            text: "Action should be among Release, Transfer, Stock In, Break, Stock Adj-Less",
          });
        } else if (action !== "") {
          $("#PartNoItemName").val("");
          $("#PartNoItemSize").val("");

          if (vm.model.action === "RELEASE") {
            if (vm.model.partyCode === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "Party code should not be empty",
              });
            } else if (vm.model.itemNumber === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "Release number should not be empty",
              });
            } else if (
              !vm.model.itemDate ||
              vm.model.itemDate === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Release date should not be empty",
              });
            } else if (
              !vm.model.consigneeCode ||
              vm.model.consigneeCode === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Consignee code should not be empty",
              });
            } else if (
              !vm.model.buyerCode ||
              vm.model.buyerCode === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Buyer code should not be empty",
              });
            } else if (vm.model.cfDestimation === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "FDestination should not be empty",
              });
            } else {
              submitForm();
            }
          } else if (vm.model.action === "TRANSFER") {
            if (vm.model.partyCode === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "Transferor code should not be empty",
              });
            } else if (vm.model.itemNumber === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "Transfer number should not be empty",
              });
            } else if (
              !vm.model.itemDate ||
              vm.model.itemDate === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Transfer date should not be empty",
              });
            } else if (
              !vm.model.consigneeCode ||
              vm.model.consigneeCode === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Consignee code should not be empty",
              });
            } else if (
              !vm.model.buyerCode ||
              vm.model.buyerCode === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Transferee code should not be empty",
              });
            } else if (vm.model.cfDestimation === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "FDestination should not be empty",
              });
            } else {
              submitForm();
            }
          } else if (vm.model.action === "STOCKIN") {
            if (vm.model.partyCode === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "Party code should not be empty",
              });
            } else if (vm.model.itemNumber === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "Stock In number should not be empty",
              });
            } else if (
              !vm.model.itemDate ||
              vm.model.itemDate === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Stock In date should not be empty",
              });
            } else if (
              !vm.model.consigneeCode ||
              vm.model.consigneeCode === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Consignee code should not be empty",
              });
            } else if (
              !vm.model.buyerCode ||
              vm.model.buyerCode === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Buyer code should not be empty",
              });
            } else if (vm.model.cfDestimation === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "FDestination should not be empty",
              });
            } else {
              submitForm();
            }
          } else if (vm.model.action === "BREAK") {
            if (vm.model.partyCode === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "Transferor code should not be empty",
              });
            } else if (vm.model.itemNumber === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "Break number should not be empty",
              });
            } else if (
              !vm.model.itemDate ||
              vm.model.itemDate === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Break date should not be empty",
              });
            } else if (
              !vm.model.consigneeCode ||
              vm.model.consigneeCode === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Consignee code should not be empty",
              });
            } else if (
              !vm.model.buyerCode ||
              vm.model.buyerCode === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Transferee code should not be empty",
              });
            } else if (vm.model.cfDestimation === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "FDestination should not be empty",
              });
            } else {
              submitForm();
            }
          }
        }

        const urll1 = rootvm.config.API_URL + rootvm.config.EndPoints.partno;
        const bodyy1 = {
          party: vm.model.partyCode,
        };

        vm.partnolist = [];

        AppService.post(urll1, bodyy1).then(
          function (response) {
            if (response.status == 200) {
              if (response && response.data) {
                vm.partnolist = response.data;
              }
            }
          },
          function (error) {
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      };

      const submitForm = () => {
        if (vm.warehouseRelease === undefined) {
          vm.warehouseRelease = [];
          vm.warehouseRelease.items = [];
          vm.warehouseRelease.transfers = [];
          vm.warehouseRelease.breaks = [];
        }

        if (vm.warehouseRelease.items === undefined) {
          vm.warehouseRelease.items = [];
        }

        if (vm.warehouseRelease.transfers === undefined) {
          vm.warehouseRelease.transfers = [];
        }

        if (vm.warehouseRelease.breaks === undefined) {
          vm.warehouseRelease.breaks = [];
        }

        vm.model.partNo = "";
        vm.model.avgQty = "";
        vm.warehouseReleaseSaveData = [];
        $("#addrelease").modal("show");
      };

      // Call validateForm function when needed, e.g., on form submission
      validateForm();
    };

    vm.CheckValidateStockin = function () {
      const validateForm = () => {
        const {
          type,
          source,
          action,
          partyCode,
          itemNumber,
          itemDate,
          consigneeCode,
          buyerCode,
        } = vm.model;

        if (type === "") {
          Swal.fire({
            allowOutsideClick: false,
            text: "Type should be among Normal, Rejection",
          });
        } else if (source === "") {
          Swal.fire({
            allowOutsideClick: false,
            text: "Source should be among PIL, PII",
          });
        } else if (action === "") {
          Swal.fire({
            allowOutsideClick: false,
            text: "Action should be Stock In",
          });
        } else if (action !== "") {
          if (vm.model.action === "STOCKIN") {
            if (vm.model.partyCode === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "Party code should not be empty",
              });
            } else if (vm.model.itemNumber === "") {
              Swal.fire({
                allowOutsideClick: false,
                text: "Stock In number should not be empty",
              });
            } else if (
              !vm.model.itemDate ||
              vm.model.itemDate === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Stock In date should not be empty",
              });
            } else if (
              !vm.model.consigneeCode ||
              vm.model.consigneeCode === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Consignee code should not be empty",
              });
            } else if (
              !vm.model.buyerCode ||
              vm.model.buyerCode === "undefined"
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "Buyer code should not be empty",
              });
            } else if (
              vm.model.cfDestimation === "" ||
              vm.model.cfDestimation === null
            ) {
              Swal.fire({
                allowOutsideClick: false,
                text: "FDestination should not be empty",
              });
            } else {
              submitForm();
            }
          }
        }

        const urll1 = rootvm.config.API_URL + rootvm.config.EndPoints.partno;
        const bodyy1 = {
          party: vm.model.partyCode,
        };

        vm.partnolist = [];

        AppService.post(urll1, bodyy1).then(
          function (response) {
            if (response.status == 200) {
              if (response && response.data) {
                vm.partnolist = response.data;
              }
            }
          },
          function (error) {
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      };

      const submitForm = () => {
        if (vm.warehouseRelease === undefined) {
          vm.warehouseRelease = [];
          vm.warehouseRelease.items = [];
          vm.warehouseRelease.transfers = [];
          vm.warehouseRelease.breaks = [];
        }

        if (vm.warehouseRelease.items === undefined) {
          vm.warehouseRelease.items = [];
        }

        if (vm.warehouseRelease.transfers === undefined) {
          vm.warehouseRelease.transfers = [];
        }

        if (vm.warehouseRelease.breaks === undefined) {
          vm.warehouseRelease.breaks = [];
        }

        vm.model.partNo = "";
        vm.model.avgQty = "";
        vm.warehouseReleaseSaveData = [];
        $("#StockInPartNo").val("");
        $("#select2-StockInPartNo-container").html("Select Part No");
        $("#StockinItemName").val("");
        $("#StockinItemSize").val("");
        $("#StockinNoofCartton").val("");
        $("#StockinCartonQty").val("");
        $("#StockinNoofPallet").val("");
        $("#StockinPalletQty").val("");
        $("#StockinPrefix").val("");
        $("#StockinStartNo").val("");
        $("#addStockIn").modal("show");
      };

      // Call validateForm function when needed, e.g., on form submission
      validateForm();
    };

    //---------------- get data for save

    const url1 = rootvm.config.API_URL + rootvm.config.EndPoints.stockvalidate;
    vm.DataGetForSave = function () {
      const body1 = {
        type: vm.model.type,
        source: vm.model.source,
        action: vm.model.action,
        partyCode: vm.model.partyCode,
        itemNumber: "",
        consigneeCode: "",
        buyerCode: "",
        cfDestimation: vm.model.cfDestimation,
        partNumber: vm.model.partNo,
        mnth: 1,
        avgQty: vm.model.avgQty,
      };

      if (
        vm.model.partNo !== "" &&
        vm.model.partNo !== 0 &&
        vm.model.avgQty !== "" &&
        vm.model.avgQty !== 0
      ) {
        vm.getDataForSave(body1);
      } else {
        vm.warehouseReleaseSaveData = [];
      }
    };

    vm.getDataForSave = function (body1) {
      vm.ReleaseSaveDataMessage = "";
      vm.ReleaseSaveDataloader = true;
      vm.warehouseReleaseSaveData = [];
      AppService.post(url1, body1).then(
        function (response) {
          if (response && response.data) {
            if (response.status == 200) {
              if (Object.keys(response.data.data).length === 0) {
                vm.warehouseReleaseSaveData = [];
                vm.ReleaseSaveDataloader = false;
                vm.ReleaseSaveDataMessage = "No Stock Available";
                //Swal.fire({allowOutsideClick: false, text: "No Stock Available" });
              } else {
                vm.ReleaseSaveDataloader = false;
                vm.ReleaseSaveDataMessage = "";
                vm.warehouseReleaseSaveData = response.data.data; // Update the data if not empty
              }
            }
          }
        },
        function (error) {
          $("#addrelease").modal("hide");
          vm.ReleaseSaveDataMessage = "Data Not Found";

          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    //---------------- Part no size and item name

    vm.getSelectedPartNo = function (code) {
      return vm.partnolist.find((part) => part.code === code);
    };

    vm.getPartNoData = function (part_no) {
      if (part_no) {
        $("#PartNoItemName").val("");
        $("#PartNoItemSize").val("");

        $("#StockinItemName").val("");
        $("#StockinItemSize").val("");

        if (part_no.name !== undefined) {
          $("#PartNoItemName").val(part_no.name);
          $("#StockinItemName").val(part_no.name);
        } else {
          $("#PartNoItemName").val("");
          $("#StockinItemSize").val("");
        }

        $("#PartNoItemSize").val(part_no.size);
        $("#StockinItemSize").val(part_no.size);

        vm.model.StockinItemName = part_no.name || "";
        vm.model.StockinItemSize = part_no.size || "";
      }
    };

    //-------- ClearAll

    vm.ClearAll = function () {
      $("#partNo").val("");
      $("#select2-partNo-container").html("Select Part No");

      vm.model.avgQty = "";
      $("#PartNoItemName").val("");
      $("#PartNoItemSize").val("");
      vm.warehouseReleaseSaveData = [];
      vm.loginErrorMessage = "";
    };

    vm.ClearAllStockin = function () {
      $("#StockInPartNo").val("");
      $("#select2-StockInPartNo-container").html("Select Part No");
      $("#StockinItemName").val("");
      $("#StockinItemSize").val("");
      $("#StockinNoofCartton").val("");
      $("#StockinCartonQty").val("");
      $("#StockinNoofPallet").val("");
      $("#StockinPalletQty").val("");
      $("#StockinPrefix").val("");
      $("#StockinStartNo").val("");
    };

    //--------- Print
    vm.print = function () {
      const urll2 =
        rootvm.config.API_URL + rootvm.config.EndPoints.ConsigneeCode;
      const bodyy2 = { code: vm.model.consigneeCode };

      AppService.post(urll2, bodyy2).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data && Array.isArray(response.data)) {
              vm.consigneedetails = response.data[0];
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );

      $("#print_modal").modal("show");
    };

    vm.printDiv = function () {
      // Get the printable content
      var printContents = document.getElementById("printableContent").innerHTML;

      // Open a new window for printing
      var popupWin = window.open("", "_blank", "width=800,height=600");

      popupWin.document.open();
      popupWin.document.write(`
                <html>
                    <head>
                        <title>Print Page</title>
                        <style>
                            @media print {
                                @page { size: portrait; }
                                body { font-family: Arial, sans-serif; margin: 20px; }
                            }
                        </style>
                    </head>
                    <body onload="window.print();window.close()">
                        ${printContents}
                    </body>
                </html>
            `);
      popupWin.document.close();
    };

    vm.getTotalPallets = function () {
      if (!vm.warehouseRelease) {
        vm.warehouseRelease = {};
      }

      if (!vm.warehouseRelease.items) {
        vm.warehouseRelease.items = [];
      }

      return vm.warehouseRelease.items.reduce(function (partialSum, a) {
        return partialSum + (a.pallets || 0);
      }, 0);
    };

    vm.getTotalCarton = function () {
      if (!vm.warehouseRelease) {
        vm.warehouseRelease = {};
      }

      if (!vm.warehouseRelease.items) {
        vm.warehouseRelease.items = [];
      }

      return vm.warehouseRelease.items.reduce(function (partialSum, a) {
        return partialSum + (a.cartons || 0);
      }, 0);
    };

    //--------- remove data

    vm.row_delete = function (type, index) {
      if (type == 3) {
        if (index >= 0 && index < vm.warehouseRelease.breaks.length) {
          vm.warehouseRelease.breaks.splice(index, 1);
        } else {
          Swal.fire({
            text: "Index out of bounds",
            allowOutsideClick: false,
            icon: "error",
          });
        }
      }
    };

    vm.release_items_row_delete = function (index) {
      if (index >= 0 && index < vm.warehouseRelease.items.length) {
        vm.warehouseRelease.items.splice(index, 1);
      } else {
        Swal.fire({
          text: "Index out of bounds",
          allowOutsideClick: false,
          icon: "error",
        });
      }
    };

    vm.release_transfers_row_delete = function (index) {
      if (index >= 0 && index < vm.warehouseRelease.transfers.length) {
        vm.warehouseRelease.transfers.splice(index, 1);
      } else {
        Swal.fire({
          text: "Index out of bounds",
          allowOutsideClick: false,
          icon: "error",
        });
      }
    };

    //----------- copy data

    vm.row_copy = function (type, index) {
      if (type == 3) {
        if (index >= 0 && index < vm.warehouseRelease.breaks.length) {
          var itemToCopy = vm.warehouseRelease.breaks[index];
          var copy_item = Object.assign({}, itemToCopy);
          copy_item.class = "breakcopyrow";
          vm.warehouseRelease.breaks.push(copy_item);
        } else {
          Swal.fire({
            text: "Index out of bounds",
            allowOutsideClick: false,
            icon: "error",
          });
        }
      }
    };

    //------------ row update
    vm.updateItem = function (type, update_field, updatedValue, index) {
      //alert(updatedValue);
      //type 1=break, 2=transfer
      //update_field 1=prefix, 2=startno

      if (type == 1) {
        if (index >= 0 && index < vm.warehouseRelease.breaks.length) {
          if (update_field === "brk_cartons") {
            var copy_item = Object.assign({}, updatedValue);
            vm.warehouseRelease.breaks[index].cartons = copy_item;
          } else if (update_field === "brk_cartonQuantity") {
            vm.warehouseRelease.breaks[index].cartonQuantity = updatedValue;
          } else if (update_field === "brk_pallets") {
            vm.warehouseRelease.breaks[index].pallets = updatedValue;
          } else if (update_field === "brk_quantity") {
            vm.warehouseRelease.breaks[index].quantity = updatedValue;
          } else if (update_field === "brk_prefix") {
            vm.warehouseRelease.breaks[index].prefix = updatedValue;
          } else if (update_field === "brk_startno") {
            vm.warehouseRelease.breaks[index].startno = updatedValue;
          }
        }
      } else if (type == 2) {
        if (index >= 0 && index < vm.warehouseRelease.transfers.length) {
          if (update_field === "partno") {
            vm.warehouseRelease.transfers[index].partNo = updatedValue;
          }
        }
      } else {
        Swal.fire({
          text: "Index out of bounds",
          allowOutsideClick: false,
          icon: "error",
        });
      }
    };

    //------------ row update
    vm.updatePoInvoiceNumber = function (
      type,
      update_field,
      updatedValue,
      index
    ) {
      // alert(type);
      // alert(update_field);
      // alert(updatedValue);
      // alert(index);
      //type 1=po no, 2=invoice no
      //update_field 1=item, 2=transfers, 2=breaks
      //var updatedValue = vm.model.poNumber;
      //alert(updatedValue);
      if (type == 1) {
        if (update_field == 1) {
          if (index >= 0 && index <= vm.warehouseRelease.items.length) {
            vm.warehouseRelease.items[index].poNumber = updatedValue;
          }
        } else {
          if (index >= 0 && index < vm.warehouseRelease.breaks.length) {
            if (update_field === "brk_cartons") {
              var copy_item = Object.assign({}, updatedValue);
              vm.warehouseRelease.breaks[index].cartons = copy_item;
            } else if (update_field === "brk_cartonQuantity") {
              vm.warehouseRelease.breaks[index].cartonQuantity = updatedValue;
            } else if (update_field === "brk_pallets") {
              vm.warehouseRelease.breaks[index].pallets = updatedValue;
            } else if (update_field === "brk_quantity") {
              vm.warehouseRelease.breaks[index].quantity = updatedValue;
            } else if (update_field === "brk_prefix") {
              vm.warehouseRelease.breaks[index].prefix = updatedValue;
            } else if (update_field === "brk_startno") {
              vm.warehouseRelease.breaks[index].startno = updatedValue;
            }
          }
        }
      } else if (type == 2) {
        if (update_field == 1) {
          if (index >= 0 && index <= vm.warehouseRelease.items.length) {
            vm.warehouseRelease.items[index].invoiceNumber = updatedValue;
          }
        } else if (update_field == 2) {
          if (index >= 0 && index <= vm.warehouseRelease.transfers.length) {
            vm.warehouseRelease.transfers[index].invoiceNumber = updatedValue;
          }
        } else if (update_field == 3) {
          if (index >= 0 && index <= vm.warehouseRelease.breaks.length) {
            vm.warehouseRelease.breaks[index].invoiceNumber = updatedValue;
          }
        }
      } else {
        Swal.fire({
          text: "Index out of bounds",
          allowOutsideClick: false,
          icon: "error",
        });
      }
    };

    //-------- Save validate

    vm.SaveValidate = function () {
      const validateForm = () => {
        const {
          action,
          CartonQty,
          PalletQty,
          NoofCartton,
          NoofPallet,
          partNo,
          avgQty,
        } = vm.model;

        if (partNo === undefined || partNo === "" || partNo === null) {
          Swal.fire({
            allowOutsideClick: false,
            text: "Part no should not be empty",
          });
        } else if (
          avgQty === undefined ||
          avgQty === "" ||
          avgQty === null ||
          avgQty == 0
        ) {
          Swal.fire({
            allowOutsideClick: false,
            text: "Average quantity should not be empty or Zero(0)",
          });
        } else if (action === "STOCKIN") {
          if (
            CartonQty !== undefined &&
            CartonQty !== "" &&
            CartonQty !== null &&
            PalletQty !== undefined &&
            PalletQty !== "" &&
            PalletQty !== null
          ) {
            Swal.fire({
              allowOutsideClick: false,
              text: "Carton and Pallet Qty both are not allowed for same row.",
            });
          }

          if (
            NoofCartton !== undefined &&
            NoofCartton !== "" &&
            NoofCartton !== null &&
            NoofPallet !== undefined &&
            NoofPallet !== "" &&
            NoofPallet !== null
          ) {
            Swal.fire({
              allowOutsideClick: false,
              text: "Carton and Pallet Number both are not allowed for same row.",
            });
          }

          if (
            NoofPallet !== undefined &&
            NoofPallet !== "" &&
            NoofPallet !== null &&
            CartonQty !== undefined &&
            CartonQty !== "" &&
            CartonQty !== null
          ) {
            Swal.fire({
              allowOutsideClick: false,
              text: "Pallet Number and Carton Qty both are not allowed for same row.",
            });
          }

          if (
            NoofCartton !== undefined &&
            NoofCartton !== "" &&
            NoofCartton !== null &&
            PalletQty !== undefined &&
            PalletQty !== "" &&
            PalletQty !== null
          ) {
            Swal.fire({
              allowOutsideClick: false,
              text: "Carton Number and Pallet Qty both are not allowed for same row.",
            });
          }

          DataTempSave();
        } else {
          if (
            CartonQty !== undefined &&
            CartonQty !== "" &&
            CartonQty !== null &&
            PalletQty !== undefined &&
            PalletQty !== "" &&
            PalletQty !== null
          ) {
            Swal.fire({
              allowOutsideClick: false,
              text: "Carton and Pallet Qty both are not allowed for same row.",
            });
          }

          if (
            NoofCartton !== undefined &&
            NoofCartton !== "" &&
            NoofCartton !== null &&
            NoofPallet !== undefined &&
            NoofPallet !== "" &&
            NoofPallet !== null
          ) {
            Swal.fire({
              allowOutsideClick: false,
              text: "Carton and Pallet Number both are not allowed for same row.",
            });
          }

          if (
            NoofPallet !== undefined &&
            NoofPallet !== "" &&
            NoofPallet !== null &&
            CartonQty !== undefined &&
            CartonQty !== "" &&
            CartonQty !== null
          ) {
            Swal.fire({
              allowOutsideClick: false,
              text: "Pallet Number and Carton Qty both are not allowed for same row.",
            });
          }

          if (
            NoofCartton !== undefined &&
            NoofCartton !== "" &&
            NoofCartton !== null &&
            PalletQty !== undefined &&
            PalletQty !== "" &&
            PalletQty !== null
          ) {
            Swal.fire({
              allowOutsideClick: false,
              text: "Carton Number and Pallet Qty both are not allowed for same row.",
            });
          }

          DataTempSave();
        }
      };

      const DataTempSave = () => {
        for (var i = 0; i < vm.warehouseReleaseSaveData.items.length; i++) {
          var copy_item = Object.assign(
            {},
            vm.warehouseReleaseSaveData.items[i]
          );
          vm.warehouseRelease.items.push(copy_item);
        }

        if (vm.model.action === "TRANSFER") {
          for (var j = 0; j < vm.warehouseReleaseSaveData.items.length; j++) {
            var copy_item = Object.assign(
              {},
              vm.warehouseReleaseSaveData.items[j]
            );
            vm.warehouseRelease.transfers.push(copy_item);
          }
        }

        if (vm.model.action === "BREAK") {
          for (var k = 0; k < vm.warehouseReleaseSaveData.items.length; k++) {
            var copy_item = Object.assign(
              {},
              vm.warehouseReleaseSaveData.items[k]
            );
            vm.warehouseRelease.breaks.push(copy_item);
          }
        }

        vm.model.partNo = "";
        vm.model.avgQty = "";
        vm.warehouseReleaseSaveData = [];
        $("#addrelease").modal("hide");
      };

      validateForm();
    };

    vm.chk_cartoon_no = function () {
      var StockinNoofCartton = $("#StockinNoofCartton").val();
      var StockinCartonQty = $("#StockinCartonQty").val();

      if (StockinNoofCartton > 0 || StockinCartonQty > 0) {
        $("#StockinNoofPallet").val(0);
        $("#StockinNoofPallet").attr("readonly", "true");
        $("#StockinNoofPallet").css({ "background-color": "#ebebeb" });

        $("#StockinPalletQty").val(0);
        $("#StockinPalletQty").attr("readonly", "true");
        $("#StockinPalletQty").css({ "background-color": "#ebebeb" });
      } else if (StockinNoofCartton === "") {
        $("#StockinNoofPallet").val("");
        $("#StockinNoofPallet").removeAttr("readonly");
        $("#StockinNoofPallet").css({ "background-color": "transparent" });

        $("#StockinPalletQty").val("");
        $("#StockinPalletQty").removeAttr("readonly");
        $("#StockinPalletQty").css({ "background-color": "transparent" });
      }
    };

    vm.chk_pallet_no = function () {
      var StockinNoofPallet = $("#StockinNoofPallet").val();
      var StockinPalletQty = $("#StockinPalletQty").val();

      if (StockinNoofPallet > 0 || StockinPalletQty > 0) {
        $("#StockinNoofCartton").val(0);
        $("#StockinNoofCartton").attr("readonly", "true");
        $("#StockinNoofCartton").css({ "background-color": "#ebebeb" });

        $("#StockinCartonQty").val(0);
        $("#StockinCartonQty").attr("readonly", "true");
        $("#StockinCartonQty").css({ "background-color": "#ebebeb" });
      } else if (StockinNoofPallet === "") {
        $("#StockinNoofCartton").val("");
        $("#StockinNoofCartton").removeAttr("readonly");
        $("#StockinNoofCartton").css({ "background-color": "transparent" });

        $("#StockinCartonQty").val("");
        $("#StockinCartonQty").removeAttr("readonly");
      }
    };

    vm.SaveValidateStockin = function () {
      var StockInPartNo = $("#StockInPartNo").val();
      var StockinItemName = $("#StockinItemName").val();
      var StockinItemSize = $("#StockinItemSize").val();
      var StockinNoofCartton = $("#StockinNoofCartton").val();
      var StockinCartonQty = $("#StockinCartonQty").val();
      var StockinNoofPallet = $("#StockinNoofPallet").val();
      var StockinPalletQty = $("#StockinPalletQty").val();
      var StockinPrefix = $("#StockinPrefix").val();
      var StockinStartNo = $("#StockinStartNo").val();

      if (
        StockInPartNo === undefined ||
        StockInPartNo === "" ||
        StockInPartNo === null
      ) {
        Swal.fire({
          allowOutsideClick: false,
          text: "Part no should not be empty",
        });
        return false;
      }
      // if (StockinItemName === undefined || StockinItemName === '' || StockinItemName === null)
      // {
      //     Swal.fire({allowOutsideClick: false, text: "Item name should not be empty" });
      //     return false;
      // }

      // if (StockinItemSize === undefined || StockinItemSize === '' || StockinItemSize === null)
      // {
      //     Swal.fire({allowOutsideClick: false, text: "Item size should not be empty" });
      //     return false;
      // }

      if (
        (StockinNoofCartton === "" || StockinNoofCartton === 0) &&
        (StockinNoofPallet === "" || StockinNoofPallet === 0)
      ) {
        Swal.fire({
          allowOutsideClick: false,
          text: "Enter Carton or Pallet Number ",
        });
        return false;
      } else {
        if (StockinNoofCartton !== "" && StockinNoofCartton > 0) {
          if (StockinCartonQty === "" || StockinCartonQty === 0) {
            Swal.fire({ allowOutsideClick: false, text: "Enter carton qty" });
            return false;
          }
        } else if (StockinCartonQty !== "" && StockinCartonQty > 0) {
          if (StockinNoofCartton === "" || StockinNoofCartton === 0) {
            Swal.fire({ allowOutsideClick: false, text: "Enter no of carton" });
            return false;
          }
        } else if (StockinNoofPallet !== "" && StockinNoofPallet > 0) {
          if (StockinPalletQty === "" || StockinPalletQty === 0) {
            Swal.fire({ allowOutsideClick: false, text: "Enter pallet qty" });
            return false;
          }
        } else if (StockinPalletQty !== "" && StockinPalletQty > 0) {
          if (StockinNoofPallet === "" || StockinNoofPallet === 0) {
            Swal.fire({ allowOutsideClick: false, text: "Enter no of pallet" });
            return false;
          }
        }
      }

      if (StockinPrefix === "" || StockinPrefix === 0) {
        Swal.fire({
          allowOutsideClick: false,
          text: "Prefix should not be empty",
        });
        return false;
      }

      if (StockinStartNo === "" || StockinStartNo === 0) {
        Swal.fire({
          allowOutsideClick: false,
          text: "Start no should not be empty",
        });
        return false;
      }

      var dateString = vm.model.itemDate;
      var parts = dateString.split("-");
      var formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];

      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();
      var time = hours + ":" + minutes + ":" + seconds;

      var new_date_time = formattedDate + " " + time;

      var date = new Date(new_date_time);
      var itemDate = date.toISOString();

      const body = {
        cartonQuantity: StockinCartonQty,
        cartons: StockinNoofCartton,
        date: itemDate,
        finalDeatination: vm.model.cfDestimation,
        flag: -1,
        invoiceNumber: null,
        invoiceNumberAlt: null,
        item: StockinItemName,
        month: 1,
        paidDate: null,
        pallets: StockinNoofPallet,
        partNo: StockInPartNo,
        party: vm.model.partyCode,
        poNumber: null,
        prefix: StockinPrefix,
        quantity: StockinPalletQty,
        rate: null,
        reQuantity: StockinCartonQty,
        realNumber: vm.model.itemNumber.toUpperCase(),
        refBuyer: vm.model.source,
        reference: "",
        sequence: "",
        shipmentPlan: null,
        size: StockinItemSize,
        slno: 0,
        slno2: 0,
        slno3: null,
        startno: StockinStartNo,
        type: "T",
      };
      vm.StockinDataSave(body);
    };

    vm.StockinDataSave = function (body) {
      vm.warehouseRelease.items.push(body);
      vm.norRsultFound = "";
      //return false;
      $("#StockInPartNo").val("");
      $("#select2-StockInPartNo-container").html("Select Part No");
      $("#StockinItemName").val("");
      $("#StockinItemSize").val("");
      $("#StockinNoofCartton").val("");
      $("#StockinCartonQty").val("");
      $("#StockinNoofPallet").val("");
      $("#StockinPalletQty").val("");
      $("#StockinPrefix").val("");
      $("#StockinStartNo").val("");

      $("#StockinNoofPallet").removeAttr("readonly");
      $("#StockinNoofPallet").css({ "background-color": "transparent" });
      $("#StockinPalletQty").removeAttr("readonly");
      $("#StockinPalletQty").css({ "background-color": "transparent" });

      $("#StockinNoofCartton").removeAttr("readonly");
      $("#StockinNoofCartton").css({ "background-color": "transparent" });
      $("#StockinCartonQty").removeAttr("readonly");
      $("#StockinCartonQty").css({ "background-color": "transparent" });

      //vm.warehouseReleaseSaveData=[];
      vm.btncheck = "STOCKIN";
      $("#addStockIn").modal("hide");
    };

    //------------- Final Save

    vm.FinalSave = function (mode) {
      var dateString = vm.model.itemDate;
      var parts = dateString.split("-");
      var formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];

      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();
      var time = hours + ":" + minutes + ":" + seconds;

      var new_date_time = formattedDate + " " + time;

      var date = new Date(new_date_time);
      var itemDate = date.toISOString();

      if (vm.model.action === "TRANSFER") {
        var destination = vm.model.pil_pii;
        var whToWh = vm.model.w2w;
      } else {
        var destination = null;
        var whToWh = false;
      }

      if (vm.model.action === "RELEASE") {
        var inputString = vm.model.itemNumber.toUpperCase();
        var result = inputString.substring(0, 3);

        if (result === "WEB" && mode === "CREATE") {
          Swal.fire({
            text: "Can not save. Release Number start from WEB",
            allowOutsideClick: false,
            icon: "error",
          });

          return false;
        }
      }

      const body2 = {
        mode: mode,
        type: vm.model.type,
        source: vm.model.source,
        destination: destination,
        action: vm.model.action,
        partyCode: vm.model.partyCode,
        itemNumber: vm.model.itemNumber.toUpperCase(),
        itemDate: itemDate,
        consigneeCode: vm.model.consigneeCode,
        buyerCode: vm.model.buyerCode,
        transferee: null,
        cfDestimation: vm.model.cfDestimation,
        whToWh: whToWh,
        items: vm.warehouseRelease.items,
        transfers: vm.warehouseRelease.transfers,
        breaks: vm.warehouseRelease.breaks,
      };

      console.log("the payload of warehouse release " + JSON.stringify(body2));
      const url2 = rootvm.config.API_URL + rootvm.config.EndPoints.savedata;
      vm.getDataFinalSave(url2, body2);
    };

    vm.getDataFinalSave = function (url2, body2) {
      AppService.post(url2, body2).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              Swal.fire({
                text: response.data.description,
                allowOutsideClick: false,
                icon: "success",
              });
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    //------------- Delete Record

    vm.DeleteRecord = function () {
      Swal.fire({
        title: "Are you sure?",
        text: "you want to delete this record?",
        icon: "warning",
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const body3 = {
            type: vm.model.type,
            source: vm.model.source,
            destination: "PII",
            action: vm.model.action,
            partyCode: vm.model.partyCode,
            itemNumber: vm.model.itemNumber,
            itemDate: vm.model.itemDate,
            consigneeCode: vm.model.consigneeCode,
            buyerCode: vm.model.buyerCode,
            transferee: null,
            cfDestimation: null,
            whToWh: false,
            items: vm.warehouseRelease.items,
            transfers: vm.warehouseRelease.transfers,
            breaks: vm.warehouseRelease.breaks,
          };

          const url3 =
            rootvm.config.API_URL + rootvm.config.EndPoints.deletedata;
          vm.DataDelete(url3, body3);
        }
      });
    };

    vm.DataDelete = function (url3, body3) {
      AppService.post(url3, body3).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              Swal.fire({
                text: "Record Delete Successfully",
                allowOutsideClick: false,
                icon: "success",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.GetDataLookup = function (url4, body4) {
      vm.datalookup = [];
      AppService.post(url4, body4).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.datalookup = response.data;
              vm.isBodyLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    // vm.GetConsigneeCode = function (url5,body5)
    // {
    //     vm.ConsigneeCodeList=[];
    //     AppService.post(url5, body5)
    //     .then(function (response)
    //     {
    //         if(response.status == 200)
    //         {
    //             if (response && response.data)
    //             {
    //                 vm.ConsigneeCodeList=response.data;

    //                 vm.isBodyLoading = false;
    //             }
    //         }

    //     }, function (error)
    //     {
    //         if(error.status == 500)
    //         {
    //             Swal.fire({
    //                 allowOutsideClick: false,
    //                 icon: 'error',
    //                 title: error.data,
    //             });
    //         }
    //         else if(error.status == 409)
    //         {
    //             const errorMessage = Array.isArray(error.data.requestError)
    //                 ? error.data.requestError.join('<br/>')
    //                 : error.data.requestError;

    //             Swal.fire({
    //                 allowOutsideClick: false,
    //                 icon: 'error',
    //                 title: errorMessage,
    //             });
    //         }
    //         else if (error.requestError.status==400 || error.requestError.status==401 || error.requestError.status==402 || error.requestError.status==403)
    //         {
    //             Swal.fire({
    //                 text: Array.isArray(error.data.requestError) ? error.data.requestError.join('<br/>') : error.data.requestError,
    //                 allowOutsideClick: false,
    //                 icon: "error",
    //                 willClose: () => {
    //                     location.reload();
    //                 }
    //             });
    //         }
    //     });
    // };

    init = function () {
      vm.mode = "CREATE";
      vm.isReadonly = false;
      var roles = vm.loggedInUser.roles;
      vm.list = !!roles.find((role) => role === "RELEASE_SEARCH");
      vm.add = !!roles.find((role) => role === "ORDER_RELEASE_SAVE");
      vm.delete = !!roles.find((role) => role === "RELEASE_DELETE");

      if (vm.list === true) {
        vm.isBodyLoading = true;

        const url4 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
        const body4 = {};
        vm.GetDataLookup(url4, body4);

        //const url5 = rootvm.config.API_URL + rootvm.config.EndPoints.ConsigneeCode;
        //const body5 ={};
        //vm.GetConsigneeCode(url5,body5);

        //AppService.isTokenExpired()
      }
    };

    init();
  };
  WarehouseReleaseController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("WarehouseReleaseController", WarehouseReleaseController);
  //#endregion WarehouseReleaseController

  //#region ReleaseInvoiceFromWebReleases
  const ReleaseInvoiceFromWebReleases = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.clear = function () {
      location.reload();
    };

    vm.InvoiceFrom = function () {
      if (vm.model.source == "PII") {
        if ($('input[name="paymentMethod"]:checked').val() == "WIRE") {
          var ConsigneeAddressBankDetails = [
            "Please Transfer Per Details Below:<br>",
            "Beneficiary Name : PATTON INTERNATIONAL INC.<br>",
            "Beneficiary Address : 1744 ENCLAVE GREEN CONCLAVE, GERMANTOWN, TN 38139-5715.<br>",
            "For ACH Transfers :<br>",
            "Routing Number : 021-000-018 (BONYM - Bank of New York Mellon)<br>",
            "Account Number : 30000840000002126<br>",
            "For Wire Transfer :<br>",
            "To : BANK OF NEW YORK MELLON, NEW YORK<br>",
            "Field 56 Swift Code : IRVTUS3N (INTERMEDIARY TRANSFERS)<br>",
            "Routing number - BONYM 021-000-018 (Bank of New York Mellon)<br>",
            "Credit to Account Number : 8900676973 USD<br>",
            "Field 57 Beneficiary Bank : ICICI BANK LTD. NEW YORK (ICICUS3N)<br>",
            "Final Beneficiary : PATTON INTERNATIONAL INC. - A/C # 840000002126<br>",
          ]

            .filter((line) => line && line.trim() !== "")
            .join("\n");
        } else {
          var ConsigneeAddressBankDetails = [
            "Please wire payment to Wachovia Bank",
          ]

            .filter((line) => line && line.trim() !== "")
            .join("\n");
        }
      } else {
        if ($('input[name="paymentMethod"]:checked').val() == "WIRE") {
          var ConsigneeAddressBankDetails = [
            "Please Wire Payment Per Details Below:<br>",
            "Beneficiary Name : PATTON INTERNATIONAL LIMITED<br>",
            "Beneficiary Address : 3C CAMAC STREET, KOLKATA 700016, WB, INDIA<br>",
            "Bank Name & Address : ICICI BANK LIMITED, 20 SIR R N MUKHERJEE ROAD, KOLKATA 700001, WB, INDIA<br>",
            "Swift Code : ICICINBBCTS<br>",
            "Account No : 000651000438",
          ]
            .filter((line) => line && line.trim() !== "")
            .join("\n");
        } else {
          var ConsigneeAddressBankDetails = [
            "Please wire payment to Wachovia Bank",
          ]

            .filter((line) => line && line.trim() !== "")
            .join("\n");
        }
      }

      $("#AddressBankDetails").html(ConsigneeAddressBankDetails);
    };

    vm.getConsigneeDetails = function (code) {
      var newMode = $("#newMode").val();
      vm.isBodyLoading = true;

      const url1 =
        rootvm.config.API_URL +
        rootvm.config.EndPoints.BuyerFromConsignee +
        "conParty=" +
        code;

      AppService.get(url1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.warehouse_consignee_details = response.data;
              if (vm.warehouse_consignee_details.length > 0) {
                vm.invoiceDate = vm.warehouse_consignee_details[0].invoiceDate;
                vm.model.ConsigneeAddress = [
                  vm.warehouse_consignee_details[0].name,
                  vm.warehouse_consignee_details[0].address1,
                  vm.warehouse_consignee_details[0].address2,
                  vm.warehouse_consignee_details[0].city,
                  vm.warehouse_consignee_details[0].country, // Is this a typo? Should it be addressLine4?
                  vm.warehouse_consignee_details[0].zip,
                  //vm.warehouse_consignee_details[0].address6
                ]
                  .filter((line) => line && line.trim() !== "") // Remove null, undefined, and blank values
                  .join("\n");
                $("#consigneeBcode").val(
                  vm.warehouse_consignee_details[0].code
                );
                $("#consigneeAddress").val(vm.model.ConsigneeAddress);

                const url3 =
                  rootvm.config.API_URL +
                  rootvm.config.EndPoints.pendingInvoices +
                  "conParty=" +
                  code +
                  "&billParty=" +
                  vm.warehouse_consignee_details[0].code +
                  "&type=N";

                vm.pendingInvoices = [];
                AppService.get(url3).then(
                  function (response) {
                    if (response.status == 200) {
                      if (response && response.data) {
                        vm.pendingInvoices = response.data;
                        if (newMode == 1) {
                          $('input[name="pendingCheck"]:disabled').prop(
                            "disabled",
                            false
                          );
                        } else if (newMode == 2) {
                          $('input[name="pendingCheck"]:disabled').prop(
                            "disabled",
                            false
                          );
                        } else {
                          $('input[name="pendingCheck"]:disabled').prop(
                            "disabled",
                            true
                          );
                        }
                        //console.log(vm.pendingInvoices);
                      }
                    }
                  },
                  function (error) {
                    if (error.status == 500) {
                      Swal.fire({
                        allowOutsideClick: false,
                        icon: "error",
                        title: error.data,
                      });
                    } else if (error.status == 409) {
                      const errorMessage = Array.isArray(
                        error.data.requestError
                      )
                        ? error.data.requestError.join("<br/>")
                        : error.data.requestError;

                      Swal.fire({
                        allowOutsideClick: false,
                        icon: "error",
                        title: errorMessage,
                      });
                    } else if (
                      error.requestError.status == 400 ||
                      error.requestError.status == 401 ||
                      error.requestError.status == 402 ||
                      error.requestError.status == 403
                    ) {
                      Swal.fire({
                        text: Array.isArray(error.data.requestError)
                          ? error.data.requestError.join("<br/>")
                          : error.data.requestError,
                        allowOutsideClick: false,
                        icon: "error",
                        willClose: () => {
                          location.reload();
                        },
                      });
                    }
                  }
                );
              }
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );

      vm.isBodyLoading = true;
      const url2 =
        rootvm.config.API_URL +
        rootvm.config.EndPoints.completedInvoices +
        "conParty=" +
        code;

      AppService.get(url2).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              if (response.data.length > 0) {
                vm.completedInvoicesList = response.data;
              }
              console.log(vm.completedInvoicesList);
              vm.isBodyLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );

      if (newMode == 2) {
        vm.isdisableRelease = false;
        //alert()
        $('input[name="pendingCheck"]:disabled').prop("disabled", false);
      }
    };

    vm.ReleaseInvoice_display_block = function () {
      if (vm.model.relInvoiceNo.length >= 1) {
        $("#completedInvoices").css("display", "block");
      } else {
        $("#completedInvoices").css("display", "none");
      }
    };

    vm.get_ReleaseInvoice = function (invoice) {
      vm.model.relInvoiceNo = invoice;
      $("#completedInvoices").css("display", "none");
    };

    vm.print = function () {
      var newadd = $("#newMode").val();
      vm.ShowDetails = vm.ReleaseNoList.details;
      Swal.fire({
        //title: 'Are you sure?',
        text: "Do You Really Want to Print These Records?",
        icon: "warning",
        allowOutsideClick: false,
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, print it!",
      }).then((result) => {
        if (result.isConfirmed) {
          if ($('input[name="source"]:checked').val() == "PIL") {
            var invoice_address = [
              "<b>PATTON INTERNATIONAL LIMITED</b><br>",
              "3C CAMAC STREET, KOLKATA - 700016, INDIA<br>",
              "Phone: 91-33-22295049,4148,4369<br>",
              "Fax: 91-33-22458189,2228-5448",
            ]
              .filter((line) => line && line.trim() !== "")
              .join("\n");
          } else {
            var invoice_address = [
              "<b> PATTON INTERNATIONAL INC</b><br>",
              "1744 ENCLAVE GREEN CV, GERMANTOWN<br>",
              "TN 38139-5715, U.S.A.",
            ]
              .filter((line) => line && line.trim() !== "")
              .join("\n");
          }

          $("#from_address").html(invoice_address);

          $("#print_modal").modal("show");
        }
      });
    };

    vm.printDetails = function () {
      // Get the printable content
      var printContents = document.getElementById("printRateContent").innerHTML;

      // Open a new window for printing
      var popupWin = window.open("", "_blank", "width=800,height=600");

      popupWin.document.open();
      popupWin.document.write(`
                <html>
                    <head>
                        <title>Print Page</title>
                        <style>
                            @media print {
                                @page { size: portrait; }
                                body { margin: 20px; padding-top:20px }
                            }
                        </style>
                    </head>
                    <body onload="window.print();window.close()">
                        ${printContents}
                    </body>
                </html>
            `);
      popupWin.document.close();
    };

    vm.delete = function () {
      var RelInvoiceNo = $("#RelInvoiceNo").val();

      if (RelInvoiceNo == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Rel Invoice No should not be empty",
        });
        return false;
      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "you want to delete this record?",
          icon: "warning",
          allowOutsideClick: false,
          showCancelButton: true,
          cancelButtonColor: "#3085d6",
          confirmButtonColor: "#d33",
          confirmButtonText: "Yes, Delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            const url =
              rootvm.config.API_URL +
              rootvm.config.EndPoints.ReleaseInvoiceDelete;
            const body = {
              source: $('input[name="source"]:checked').val(),
              relInvoiceNo: vm.model.relInvoiceNo,
              mode: "delete",
            };

            AppService.post(url, body).then(
              function (response) {
                if (response.status == 200) {
                  Swal.fire({
                    allowOutsideClick: false,
                    text: response.data.description,
                    allowOutsideClick: false,
                    icon: "success",
                  }).then(function () {
                    window.location.reload();
                  });
                }
              },
              function (error) {
                vm.isLoading = false;

                if (error.status == 500) {
                  Swal.fire({
                    allowOutsideClick: false,
                    icon: "error",
                    title: error,
                  });
                } else if (error.status == 409) {
                  const errorMessage = Array.isArray(error.data.requestError)
                    ? error.data.requestError.join("<br/>")
                    : error.data.requestError;

                  Swal.fire({
                    icon: "error",
                    title: errorMessage,
                  });
                } else if (
                  error.requestError.status == 400 ||
                  error.requestError.status == 401 ||
                  error.requestError.status == 402 ||
                  error.requestError.status == 403
                ) {
                  Swal.fire({
                    text: Array.isArray(error.data.requestError)
                      ? error.data.requestError.join("<br/>")
                      : error.data.requestError,
                    allowOutsideClick: false,
                    icon: "error",
                    willClose: () => {
                      location.reload();
                    },
                  });
                }
              }
            );
          }
        });
      }
    };

    vm.newAdd = function () {
      $("#newMode").val(2);
      $('input[name="pendingCheck"]:disabled').prop("disabled", false);

      vm.ReleaseNoList = [];
      vm.pendingInvoices = [];
      vm.ReleaseNoList.releases = [];
      vm.ShowDetails = [];

      $("#btn_save").prop("disabled", false);
      $("#btn_modify").prop("disabled", false);
      $("#btn_print").prop("disabled", false);

      $("#btn_show_details").prop("disabled", false);

      $('input[name="source"]:disabled').prop("disabled", false);
      $('input[name="type"]:disabled').prop("disabled", false);
      $('input[name="saleType"]:disabled').prop("disabled", false);
      $('input[name="paymentMethod"]:disabled').prop("disabled", false);
      $('input[name="paymentType"]:disabled').prop("disabled", false);

      vm.ReleaseNoList.source = "PII";
      vm.ReleaseNoList.type = "NORMAL";
      vm.ReleaseNoList.saleType = "LOCAL";
      vm.ReleaseNoList.paymentMethod = "WIRE";
      vm.ReleaseNoList.paymentType = "RELEASE";

      $("#consigneeCode").val("");
      $("#select2-consigneeCode-container").html("Select Consignee Code");
      $("#consigneeBcode").val("");
      $("#consigneeAddress").val("");

      $("#RelInvoiceNo").val("");
      $("#datepicker1").val("");
      $("#datepicker2").val("");

      var ConsigneeAddressBankDetails = [
        "Please Transfer Per Details Below:<br>",
        "Beneficiary Name : PATTON INTERNATIONAL INC.<br>",
        "Beneficiary Address : 1744 ENCLAVE GREEN CONCLAVE, GERMANTOWN, TN 38139-5715.<br>",
        "For ACH Transfers :<br>",
        "Routing Number : 021-000-018 (BONYM - Bank of New York Mellon)<br>",
        "Account Number : 30000840000002126<br>",
        "For Wire Transfer :<br>",
        "To : BANK OF NEW YORK MELLON, NEW YORK<br>",
        "Field 56 Swift Code : IRVTUS3N (INTERMEDIARY TRANSFERS)<br>",
        "Routing number - BONYM 021-000-018 (Bank of New York Mellon)<br>",
        "Credit to Account Number : 8900676973 USD<br>",
        "Field 57 Beneficiary Bank : ICICI BANK LTD. NEW YORK (ICICUS3N)<br>",
        "Final Beneficiary : PATTON INTERNATIONAL INC. - A/C # 840000002126<br>",
      ]
        .filter((line) => line && line.trim() !== "")
        .join("\n");

      $("#AddressBankDetails").html(ConsigneeAddressBankDetails);
    };

    vm.Modify = function () {
      $("#newMode").val(1);
      //$('input[name="pendingCheck"]:disabled').prop('disabled', false);
      //$('input[name="ReleaseNoCheck"]:disabled').prop('disabled', false);
      //$('input[name="ReleaseNoCheck"]:checked').prop('checked', false);

      //vm.ReleaseNoList=[];
      $("#btn_save").prop("disabled", false);
      $("#btn_modify").prop("disabled", false);
      $("#btn_print").prop("disabled", false);

      $("#btn_show_details").prop("disabled", false);

      $('input[name="source"]:disabled').prop("disabled", false);
      $('input[name="type"]:disabled').prop("disabled", false);
      $('input[name="saleType"]:disabled').prop("disabled", false);
      $('input[name="paymentMethod"]:disabled').prop("disabled", false);
      $('input[name="paymentType"]:disabled').prop("disabled", false);

      vm.isdisableRelease = false;
      vm.isdisableReleaseNo = false;

      vm.ReleaseNoList.source = "PII";
      vm.ReleaseNoList.type = "NORMAL";
      vm.ReleaseNoList.saleType = "LOCAL";
      vm.ReleaseNoList.paymentMethod = "WIRE";
      vm.ReleaseNoList.paymentType = "RELEASE";

      var ConsigneeAddressBankDetails = [
        "Please Transfer Per Details Below:<br>",
        "Beneficiary Name : PATTON INTERNATIONAL INC.<br>",
        "Beneficiary Address : 1744 ENCLAVE GREEN CONCLAVE, GERMANTOWN, TN 38139-5715.<br>",
        "For ACH Transfers :<br>",
        "Routing Number : 021-000-018 (BONYM - Bank of New York Mellon)<br>",
        "Account Number : 30000840000002126<br>",
        "For Wire Transfer :<br>",
        "To : BANK OF NEW YORK MELLON, NEW YORK<br>",
        "Field 56 Swift Code : IRVTUS3N (INTERMEDIARY TRANSFERS)<br>",
        "Routing number - BONYM 021-000-018 (Bank of New York Mellon)<br>",
        "Credit to Account Number : 8900676973 USD<br>",
        "Field 57 Beneficiary Bank : ICICI BANK LTD. NEW YORK (ICICUS3N)<br>",
        "Final Beneficiary : PATTON INTERNATIONAL INC. - A/C # 840000002126<br>",
      ]
        .filter((line) => line && line.trim() !== "")
        .join("\n");

      $("#AddressBankDetails").html(ConsigneeAddressBankDetails);
    };

    vm.GetReleaseInvoiceDetails = function () {
      const inputDate = $("#datepicker3").val();
      const outputDate = convertDateFormat(inputDate);

      const body = {
        source: $('input[name="source"]:checked').val(),
        destination: $("#consigneeCode").val(),
        billParty: $("#consigneeBcode").val(),
        rateDate: outputDate,
        releases: vm.selectedItems, // This should already have the selected items.
      };

      var url =
        rootvm.config.API_URL + rootvm.config.EndPoints.ReleaseInvoicedetails;

      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data.data) {
              vm.ShowDetails = response.data.data;

              vm.totalAmount = 0; // Initialize totalAmount properly

              for (var i = 0; i < vm.ShowDetails.length; i++) {
                vm.totalAmount += vm.ShowDetails[i].amount;
              }
              //vm.totalAmount=response.data.data.totalAmount;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.GetReleasesInvoice = function () {
      var newMode = $("#newMode").val();
      if (newMode == 0) {
        if (vm.model.relInvoiceNo !== undefined) {
          vm.isBodyLoading = true;
          var relInvoiceNo1 = vm.model.relInvoiceNo; // Access it directly, not via vm.model
          //alert(relInvoiceNo1);

          const url =
            rootvm.config.API_URL +
            rootvm.config.EndPoints.ReleaseInvoiceSearch;
          const body = { relInvoiceNo: relInvoiceNo1 };

          AppService.post(url, body).then(
            function (response) {
              if (response && response.data.data) {
                if (response.status == 200) {
                  vm.ReleaseNoList = response.data.data;
                  vm.ShowDetails = response.data.data.details;
                  //console.log(vm.ShowDetails);
                  vm.selectedItems = vm.ReleaseNoList.releases;

                  vm.ReleaseNoList.releases.forEach(function (item) {
                    item.selected = true; // make them checked in the UI
                  });
                  vm.totalAmount = response.data.data.totalAmount;

                  vm.sumOfQty = 0; // Initialize totalAmount properly

                  for (var i = 0; i < vm.ReleaseNoList.details.length; i++) {
                    vm.sumOfQty += vm.ReleaseNoList.details[i].qty;
                  }

                  var date1 = new Date(vm.ReleaseNoList.invoiceDate);
                  var day1 = ("0" + date1.getDate()).slice(-2);
                  var month1 = ("0" + (date1.getMonth() + 1)).slice(-2);
                  var year1 = date1.getFullYear();
                  vm.model.invoiceDate = day1 + "-" + month1 + "-" + year1;

                  var date2 = new Date(vm.ReleaseNoList.dueDate);
                  var day2 = ("0" + date2.getDate()).slice(-2);
                  var month2 = ("0" + (date2.getMonth() + 1)).slice(-2);
                  var year2 = date2.getFullYear();
                  vm.model.dueDate = day2 + "-" + month2 + "-" + year2;

                  $("#bank_address").val(vm.ReleaseNoList.bankDetails);
                  var formattedBankDetails =
                    vm.ReleaseNoList.bankDetails.replace(/\r\n/g, "<br>");
                  $("#AddressBankDetails").html(formattedBankDetails);
                  $("#bank_details").html(formattedBankDetails);

                  $("#btn_delete").prop("disabled", false);
                  $("#btn_adjustment").prop("disabled", false);
                  $("#btn_new").prop("disabled", false);
                  $("#btn_save").prop("disabled", false);
                  $("#btn_modify").prop("disabled", false);
                  $("#btn_print").prop("disabled", false);

                  $("#btn_show_details").prop("disabled", false);

                  vm.isReleaseNoCheck = true;
                  vm.isTableLoading = true;
                  vm.isBodyLoading = false;
                }
                //console.log(vm.ReleaseNoList);
              }
            },
            function (error) {
              $("#addrelease").modal("hide");
              vm.ReleaseSaveDataMessage = "Data Not Found";

              if (error.status == 500) {
                Swal.fire({
                  allowOutsideClick: false,
                  icon: "error",
                  title: error.data,
                });
              } else if (error.status == 409) {
                const errorMessage = Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError;

                Swal.fire({
                  allowOutsideClick: false,
                  icon: "error",
                  title: errorMessage,
                });
              } else if (
                error.requestError.status == 400 ||
                error.requestError.status == 401 ||
                error.requestError.status == 402 ||
                error.requestError.status == 403
              ) {
                Swal.fire({
                  text: Array.isArray(error.data.requestError)
                    ? error.data.requestError.join("<br/>")
                    : error.data.requestError,
                  allowOutsideClick: false,
                  icon: "error",
                  willClose: () => {
                    location.reload();
                  },
                });
              }
            }
          );
        } else {
          vm.isBodyLoading = false;
        }
      }
    };

    vm.selectedItems = [];

    // vm.updateSelectedItems = function(item, type, index) {
    //     if (item.selected === true) {
    //         // Avoid duplicates
    //         var exists = vm.selectedItems.some(i => i.itemNumber === item.itemNumber);
    //         if (!exists) {
    //             vm.selectedItems.push({
    //                 itemDate: item.itemDate,
    //                 itemNumber: item.itemNumber,
    //                 billParty: item.billParty,
    //                 selected: true
    //             });
    //         }
    //     } else {
    //         // Remove from selected items
    //         vm.selectedItems = vm.selectedItems.filter(
    //             (selectedItem) => selectedItem.itemNumber !== item.itemNumber
    //         );
    //     }
    // };

    vm.updateSelectedItems = function (item) {
      if (item.selected === true) {
        vm.selectedItems.push({
          itemDate: item.itemDate,
          itemNumber: item.itemNumber,
          billParty: item.billParty,
        });
      } else {
        vm.selectedItems = vm.selectedItems.filter(
          (selectedItem) => selectedItem.itemNumber !== item.itemNumber
        );
      }
    };

    vm.rateUpdate = function (index) {
      var qty = $("#txtQty" + index).val();
      var rate = $("#txtRate" + index).val();

      var amountt = parseFloat(qty) * parseFloat(rate);
      var amounttt = (parseFloat(qty) * parseFloat(rate)).toFixed(2);
      $("#amount" + index).html(amounttt);

      vm.ReleaseNoList.details[index].amount = amountt;
      vm.ReleaseNoList.details[index].rate = rate;

      vm.totalAmount = 0;

      for (var i = 0; i < vm.ReleaseNoList.details.length; i++) {
        vm.totalAmount += vm.ReleaseNoList.details[i].amount;
      }
      //vm.totalAmount=response.data.data.totalAmount;
      //console.log(vm.ReleaseNoList.details);
    };

    // vm.GetShowRateDetails1 = function()
    // {
    //     vm.isLoading = true;
    //     vm.ShowDetails = vm.ReleaseNoList.details;
    //     vm.isLoading1 = false;
    //     console.log(vm.ShowDetails);
    // }

    vm.ShowRateDetails = function () {
      var mode = $("#newMode").val();

      if (mode == 0) {
        vm.GetReleasesInvoice();
        vm.isRateDisable = true;
      } else if (mode == 1) {
        vm.isRateDisable = false;
        vm.isTableLoading = false;
        vm.isLoading1 = true;
        vm.GetShowRateDetails();
      } else {
        vm.GetShowRateDetails();
        vm.isRateDisable = false;
        vm.isTableLoading = true;
      }
    };

    vm.GetShowRateDetails = function () {
      const body = {
        source: $('input[name="source"]:checked').val(),
        destination: $("#consigneeCode").val(),
        billParty: $("#consigneeBcode").val(),
        rateDate: "",
        releases: vm.selectedItems, // This should already have the selected items.
      };
      console.log(body);
      var url =
        rootvm.config.API_URL + rootvm.config.EndPoints.ReleaseInvoicedetails;

      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data.data) {
              vm.ShowDetails = response.data.data;

              vm.totalAmount = 0; // Initialize totalAmount properly

              for (var i = 0; i < vm.ShowDetails.length; i++) {
                vm.totalAmount += vm.ShowDetails[i].amount;
              }

              vm.sumOfQty = 0; // Initialize totalAmount properly

              for (var i = 0; i < vm.ShowDetails.length; i++) {
                vm.sumOfQty += vm.ShowDetails[i].qty;
              }
              //vm.totalAmount=response.data.data.totalAmount;
              vm.isLoading1 = false;
              vm.isTableLoading = true;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    // vm.sumOfQty = function ()
    // {
    //     vm.total = 0; // Initialize totalAmount properly

    //     for (var i = 0; i < vm.ShowDetails.length; i++)
    //     {
    //         vm.total += vm.ShowDetails[i].amount;
    //     }

    //     // if(!vm.ReleaseNoList.details)
    //     // {
    //     //     vm.ReleaseNoList.details=[];
    //     // }
    //     // let total = vm.ReleaseNoList.details.reduce((partialSum, details) => partialSum + (details.qty || 0), 0);
    //     // return total.toLocaleString(); // Formats with commas

    // };

    vm.SaveReleaseInvoice = function () {
      if ($("#RelInvoiceNo").val() == "") {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "Enter Invoice No",
        });
        return false;
      } else if ($("#datepicker1").val() == "") {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "Enter Invoice Date",
        });
        return false;
      } else if ($("#datepicker2").val() == "") {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "Enter Due Date",
        });
        return false;
      } else {
        var newMode = $("#newMode").val();

        if (newMode == 0) {
          var releases = vm.ReleaseNoList.releases;
          var details = vm.ReleaseNoList.details;
          var adjustments = vm.ReleaseNoList.adjustments;

          var invoiceDate = vm.ReleaseNoList.invoiceDate;
          var dueDate = vm.ReleaseNoList.dueDate;
          var billParty = vm.ReleaseNoList.billParty;
          var billingAddress = vm.ReleaseNoList.billingAddress;
        } else {
          $("#btn_save").css("display", "none");
          $("#btn_loader").css("display", "inline-block");

          var releases = vm.selectedItems;
          var details = vm.ShowDetails;
          var adjustments = [];

          const invoiceDate1 = $("#datepicker1").val();
          const invoiceDate2 = convertDateFormat(invoiceDate1);

          var invoiceDate = invoiceDate2 + "T00:00:00";

          const dueDate1 = $("#datepicker2").val();
          const dueDate2 = convertDateFormat(dueDate1);

          var dueDate = dueDate2 + "T00:00:00";

          var billParty = $("#consigneeBcode").val();
          var billingAddress = [
            vm.warehouse_consignee_details[0].address1,
            vm.warehouse_consignee_details[0].address2,
            vm.warehouse_consignee_details[0].city,
            vm.warehouse_consignee_details[0].country,
            vm.warehouse_consignee_details[0].zip,
          ];

          if (newMode == 1) {
            var mode = "EDIT";
          } else if (newMode == 2) {
            var mode = "CREATE";
          }
        }

        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.ReleaseInvoiceSave;
        const body = {
          mode: mode,
          source: $('input[name="source"]:checked').val(),
          destination: vm.model.consigneeCode,
          relInvoiceNo: vm.model.relInvoiceNo,
          invoiceDate: invoiceDate,
          dueDate: dueDate,
          saleType: $('input[name="saleType"]:checked').val(),
          billParty: billParty,
          billingAddress: billingAddress,
          type: $('input[name="type"]:checked').val(),
          paymentMethod: $('input[name="paymentMethod"]:checked').val(),
          paymentType: $('input[name="paymentType"]:checked').val(),
          adjustmentAmount: 0.0,
          adjustmentDescription: "",
          dateTimeStamp: new Date().toISOString(),
          totalAmount: "",
          bankDetails: vm.ReleaseNoList.bankDetails,

          releases: releases,
          details: details,
          adjustments: adjustments,
        };
        //console.log(body);
        AppService.post(url, body).then(
          function (response) {
            if (response.status == 200) {
              $("#btn_save").css("display", "inline-block");
              $("#btn_loader").css("display", "none");

              Swal.fire({
                text: response.data.description,
                allowOutsideClick: false,
                icon: "success",
              }).then(function () {
                window.location.reload();
              });
            }
          },
          function (error) {
            $("#btn_save").css("display", "inline-block");
            $("#btn_loader").css("display", "none");
            vm.isLoading = false;

            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      }
    };

    function convertDateFormat(date) {
      const [day, month, year] = date.split("-");
      return `${year}-${month}-${day}`;
    }

    vm.init = function () {
      vm.isRateDisable = true;
      vm.isdisableRelease = true;
      vm.isdisableReleaseNo = true;

      $("#newMode").val(0);

      var invoice_address = [
        "<b>PATTON INTERNATIONAL LIMITED</b><br>",
        "3C CAMAC STREET, KOLKATA - 700016, INDIA<br>",
        "Phone: 91-33-22295049,4148,4369<br>",
        "Fax: 91-33-22458189,2228-5448",
      ]
        .filter((line) => line && line.trim() !== "")
        .join("\n");

      $("#from_address").html(invoice_address);

      // $('#btn_delete').prop('disabled', true);
      // $('#btn_adjustment').prop('disabled', true);
      // //$('#btn_new').prop('disabled', true);
      // $('#btn_save').prop('disabled', true);
      // $('#btn_modify').prop('disabled', true);
      // $('#btn_print').prop('disabled', true);

      // $('#btn_show_details').prop('disabled', true);

      vm.ReleaseNoList = [];
      vm.ReleaseNoList.source = "";

      vm.isBodyLoading = true;
      var url3 = rootvm.config.API_URL + rootvm.config.EndPoints.ConsigneeCode;
      var body3 = {};

      vm.ConsigneeCodeList = [];
      AppService.post(url3, body3).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.ConsigneeCodeList = response.data;
            }

            // var ConsigneeAddressBankDetails = [
            //     "Please Transfer Per Details Below:<br>",
            //     "<b>Beneficiary Name :</b> PATTON INTERNATIONAL INC.<br>",
            //     "<b>Beneficiary Address :</b> 1744 ENCLAVE GREEN CONCLAVE, GERMANTOWN, TN 38139-5715.<br>",
            //     "<b>For ACH Transfers :</b><br>",
            //     "<b>Routing Number :</b> 021-000-018 (BONYM - Bank of New York Mellon)<br>",
            //     "<b>Account Number :</b> 30000840000002126<br>",
            //     "<b>For Wire Transfer :</b><br>",
            //     "<b>To :</b> BANK OF NEW YORK MELLON, NEW YORK<br>",
            //     "<b>Field 56 Swift Code :</b> IRVTUS3N (INTERMEDIARY TRANSFERS)<br>",
            //     "<b>Routing number -</b> BONYM 021-000-018 (Bank of New York Mellon)<br>",
            //     "<b>Credit to Account Number :</b> 8900676973 USD<br>",
            //     "<b>Field 57 Beneficiary Bank :</b> ICICI BANK LTD. NEW YORK (ICICUS3N)<br>",
            //     "<b>Final Beneficiary :</b> PATTON INTERNATIONAL INC. - A/C # 840000002126<br>"
            // ]

            // .filter(line => line && line.trim() !== "") // Remove null, undefined, and blank values
            // .join("\n");

            // $('#AddressBankDetails').html(ConsigneeAddressBankDetails);

            vm.isBodyLoading = false;
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.init();
  };
  ReleaseInvoiceFromWebReleases.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("ReleaseInvoiceFromWebReleases", ReleaseInvoiceFromWebReleases);
  //#endregion ReleaseInvoiceFromWebReleases

  //#region CreateBreakPalletCartonsController
  const BreakPalletCartonsController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.GetCustomerDetails = function (url4, body4) {
      vm.CustomerList = [];
      AppService.post(url4, body4).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.CustomerList = response.data;
            }

            vm.isBodyLoading = false;
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.get_party_invoice_details_list = function (partyCode) {
      if (partyCode != "") {
        const url =
          rootvm.config.API_URL +
          rootvm.config.EndPoints.BreakRetainPalletPartyInvoice;
        const body = { party: partyCode };

        vm.isBodyLoading = true;
        vm.PartyInvoiceList = [];
        AppService.post(url, body).then(
          function (response) {
            if (response.status == 200) {
              if (response && response.data.data.length > 0) {
                vm.PartyInvoiceList = response.data.data;
              } else {
                Swal.fire({
                  allowOutsideClick: false,
                  title: "Invoice Not Found",
                });
              }

              vm.isBodyLoading = false;
            }
          },
          function (error) {
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      }
    };

    vm.norRsultFound = "";
    vm.get_pallet_item_list = function () {
      vm.isLoading = true;
      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.BreakRetainPalletList;
      const body = {
        party: vm.model.partyCode,
        invoiceno: vm.model.Invoice,
        breakretain: vm.model.breakretain,
      };
      vm.norRsultFound = "";
      vm.BreakRetainPalletList = [];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data.data.length > 0) {
              vm.BreakRetainPalletList = response.data.data;
            } else {
              vm.norRsultFound = "No Record Found";
            }
            vm.isLoading = false;
          }
        },
        function (error) {
          vm.isLoading = false;

          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.checkPalletCartoon = function (counter) {
      var slno = $("#slno" + counter).val();
      var count = parseInt($("#count").val());

      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.BreakRetainPalletCheck;
      const body = { party: vm.model.partyCode, slNo: slno };

      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.breakpalletcheck = response.data.data;

              if (vm.breakpalletcheck === false) {
                Swal.fire({
                  allowOutsideClick: false,
                  icon: "warning",
                  title: "This Pallet already released. You Can't Change it!!!",
                });

                $("#BreakPallet" + counter).css("color", "#F00F00");
              } else {
                if ($("#BreakPalletConvert" + counter).val() == 0) {
                  $("#BreakPalletConvert" + counter).val(1);
                  $("#BreakPallet" + counter).css("color", "#059301");

                  $("#count").val(count + 1);
                } else {
                  $("#BreakPalletConvert" + counter).val(0);
                  $("#BreakPallet" + counter).css("color", "#000000");

                  $("#count").val(count - 1);
                }
              }
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.checkCartoonPallet = function (counter) {
      var slno = $("#slno" + counter).val();
      var count = parseInt($("#count").val());

      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.BreakRetainPalletCheck;
      const body = { party: vm.model.partyCode, slNo: slno };

      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.breakpalletcheck = response.data.data;

              if (vm.breakpalletcheck === false) {
                Swal.fire({
                  allowOutsideClick: false,
                  icon: "warning",
                  title: "This Pallet already released. You Can't Change it!!!",
                });

                $("#RetainPallet" + counter).css("color", "#F00F00");
              } else {
                if ($("#BreakPalletConvert" + counter).val() == 0) {
                  $("#BreakPalletConvert" + counter).val(1);
                  $("#RetainPallet" + counter).css("color", "#059301");

                  $("#count").val(count + 1);
                } else {
                  $("#BreakPalletConvert" + counter).val(0);
                  $("#RetainPallet" + counter).css("color", "#000000");

                  $("#count").val(count - 1);
                }
              }
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.FinalSave = function () {
      var count = parseInt($("#count").val());

      if (count == 0) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Select Pallet for Break",
        });
      } else {
        var body = { items: [] };

        for (var i = 0; i < vm.BreakRetainPalletList.length; i++) {
          if ($("#BreakPalletConvert" + i).val() == 1) {
            var item = {
              party: vm.model.partyCode,
              slNo: $("#slno" + i).val(),
            };
            body.items.push(item);
          }
        }

        if (vm.model.breakretain == 1) {
          var url4 =
            rootvm.config.API_URL + rootvm.config.EndPoints.BreakPalletToCarton;
        } else {
          var url4 =
            rootvm.config.API_URL +
            rootvm.config.EndPoints.RetainCartonToPallet;
        }

        //const body4 ={body};

        AppService.post(url4, body).then(
          function (response) {
            if (response.status == 200) {
              Swal.fire({
                text: response.data.description,
                allowOutsideClick: false,
                icon: "success",
              }).then(function () {
                window.location.reload();
              });
            }
          },
          function (error) {
            vm.isLoading = false;

            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      }
    };

    init = function () {
      //var roles = vm.loggedInUser.roles;
      var roles = ["BREAK_PALLET_LIST"];
      vm.list = !!roles.find((role) => role === "BREAK_PALLET_LIST");
      //vm.add = !!roles.find(role => role === "PARTY_SAVE");

      if (vm.list === true) {
        vm.isBodyLoading = true;

        const url4 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
        const body4 = {};

        vm.GetCustomerDetails(url4, body4);

        vm.model = {
          breakretain: "1",
        };

        vm.BreakRetainPalletList = [];
      }
    };

    init();
  };
  BreakPalletCartonsController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("BreakPalletCartonsController", BreakPalletCartonsController);
  //#endregion CreateBreakPalletCartonsController

  //#region ReleaseOrderEntryController
  const ReleaseOrderEntryController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    // Function to read the Excel file
    vm.uploadExcel = function () {
      var file = document.getElementById("excelFile").files[0];
      //var sheetno=$('#sheetNo').val();

      if (file) {
        $("#upload_btn").css("display", "none");
        $("#upload_btn_loader").css("display", "inline-block");

        var reader = new FileReader();

        reader.onload = function (e) {
          var data = e.target.result;
          var workbook = XLSX.read(data, { type: "binary" });

          var sheet = workbook.Sheets[workbook.SheetNames[0]];
          var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          vm.$apply(function () {
            vm.excelData = jsonData.slice(1);
            vm.headers = jsonData[0];
            vm.totalRows = vm.excelData.length;
            vm.totalColumns = vm.headers.length;
          });

          vm.orders = vm.excelData.map((row) => ({
            orderNo: row[0],
            orderDate: OrderDateFormat(row[1]),
            customer: row[2],
            shipToParty: row[3],
            shipToAddress: row[4],
            SequenceNo: row[5],
            partNo: row[6],
            qty: row[7],
            unitRate: row[8],
            unit: row[9],
            requiredDate: OrderDateFormat(row[10]),
            buyerName: row[11],
            revisionNo: row[12] ? row[12].toString() : "",
          }));

          function OrderDateFormat(cellValue) {
            if (cellValue === undefined || cellValue === null) {
              return null;
            }

            let date;

            if (typeof cellValue === "string" && cellValue.includes("-")) {
              // Split date parts (assuming format "DD-MM-YYYY")
              var dateParts = cellValue.split("-");
              date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // YYYY, MM, DD
            } else if (cellValue instanceof Date) {
              date = cellValue;
            } else if (typeof cellValue === "number") {
              // Excel date format adjustment
              date = new Date((cellValue - 25569) * 86400 * 1000);
            } else {
              console.error("Invalid date format: " + cellValue);
              return null;
            }

            // Fix the one-day back issue by adjusting for the local timezone
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

            return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format without time
          }

          // console.log(vm.orders);
          // return false;
          // Check uniqueness and customer consistency
          checkData(vm.orders);

          function checkData(arr) {
            const seen = new Map(); // To check uniqueness
            let isUnique = true;
            let duplicates = [];
            let duplicateRows = []; // Store duplicate row numbers

            let firstCustomer = arr.length > 0 ? arr[0].customer : null;
            let isSameCustomer = true;

            // Initialize groupedData
            let groupedData = {
              Party: "", // Assuming Party is not provided dynamically
              date: "", // Assuming Date is not provided dynamically
              PartNo: [],
            };

            for (let i = 0; i < arr.length; i++) {
              let obj = arr[i];
              //console.log(vm.excelData[i][6]);

              // Ensure partNo is stored as a string
              groupedData.PartNo.push(obj.partNo.toString());

              // Create a unique key based on important fields
              let key = `${obj.orderNo}|${obj.orderDate}|${obj.customer}|${obj.shipToParty}|${obj.SequenceNo}|${obj.partNo}`;

              // Check uniqueness
              if (seen.has(key)) {
                console.log(`Duplicate found at row no ${i + 1}:`, obj);
                duplicates.push({
                  index: i + 1,
                  duplicate: obj,
                  originalIndex: seen.get(key),
                });
                duplicateRows.push(i + 1);
                isUnique = false;
              } else {
                seen.set(key, i);
              }

              // Check customer consistency
              if (obj.customer !== firstCustomer) {
                isSameCustomer = false;
              }
            }

            // Alert for customer inconsistency
            if (!isSameCustomer) {
              Swal.fire({
                text: "Different customers found in the dataset.",
                icon: "error",
                allowOutsideClick: false,
              });
            } else {
              if (!isUnique) {
                Swal.fire({
                  text: `Duplicate found at row numbers: ${duplicateRows.join(
                    ", "
                  )}`,
                  icon: "error",
                  allowOutsideClick: false,
                });
              } else {
                const url =
                  rootvm.config.API_URL +
                  rootvm.config.EndPoints.OrderValidationSave;
                const body = vm.orders;
                //console.log(body);
                //return false;
                AppService.post(url, body).then(
                  function (response) {
                    if (response.status == 200) {
                      Swal.fire({
                        text: response.data.description,
                        allowOutsideClick: false,
                        icon: "success",
                      }).then(function () {
                        $("#upload_btn_loader").css("display", "none");
                        $("#upload_btn").css("display", "inline-block");
                        window.location.reload();
                      });
                    }
                  },
                  function (error) {
                    vm.isLoading = false;

                    if (error.status == 500) {
                      Swal.fire({
                        allowOutsideClick: false,
                        icon: "error",
                        title: error,
                      });
                    } else if (error.status == 409) {
                      const errorMessage = Array.isArray(
                        error.data.requestError
                      )
                        ? error.data.requestError.join("<br/>")
                        : error.data.requestError;

                      Swal.fire({
                        allowOutsideClick: false,
                        icon: "error",
                        title: errorMessage,
                      });
                    } else if (
                      error.requestError.status == 400 ||
                      error.requestError.status == 401 ||
                      error.requestError.status == 402 ||
                      error.requestError.status == 403
                    ) {
                      Swal.fire({
                        text: Array.isArray(error.data.requestError)
                          ? error.data.requestError.join("<br/>")
                          : error.data.requestError,
                        allowOutsideClick: false,
                        icon: "error",
                        willClose: () => {
                          location.reload();
                        },
                      });
                    }
                  }
                );
              }
            }
          }
        };

        reader.readAsBinaryString(file);
      } else {
        Swal.fire({
          allowOutsideClick: false,
          title: "Select order excel",
        });

        return false;
      }
    };

    vm.GetReleaseOrderList = function (url, body) {
      vm.isLoading = true;
      //vm.norRsultFound= "";
      vm.ReleaseOrderList = [];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data.length > 0) {
              vm.ReleaseOrderList = response.data;
            }
            // else
            // {
            //     vm.norRsultFound= "No Record Found";
            // }
            vm.isLoading = false;
          }
        },
        function (error) {
          vm.isLoading = false;

          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.search_order = function () {
      var order_no = $("#txt_search_order_no").val();
      var order_from_date = $("#txt_search_order_from_date").val();
      var order_to_date = $("#txt_search_order_to_date").val();
      var customer = $("#search_customer").val();
      var ship_to_party = $("#search_ship_to_party").val();

      if (order_from_date != "") {
        var from_date1 = $("#txt_search_order_from_date").val();

        var parts = from_date1.split("-");
        var day = parts[0];
        var month = parts[1];
        var year = parts[2];

        var from_date = year + "-" + month + "-" + day + " 00:00:00.000";
      } else {
        var from_date = "";
      }

      if (order_to_date != "") {
        var to_date1 = $("#txt_search_order_to_date").val();

        var parts = to_date1.split("-");
        var day = parts[0];
        var month = parts[1];
        var year = parts[2];

        var to_date = year + "-" + month + "-" + day + " 00:00:00.000";
      } else {
        var to_date = "";
      }

      const url1 = rootvm.config.API_URL + rootvm.config.EndPoints.releaseorder;
      const body1 = {
        releaseorderid: "00000000-0000-0000-0000-000000000000",
        orderno: order_no,
        fromdate: from_date,
        todate: to_date,
        customer: customer,
        shiptoparty: ship_to_party,
        isactive: true,
      };

      vm.isLoading = true;
      vm.norRsultFound = "";
      vm.ReleaseOrderList = [];

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data.length > 0) {
              vm.ReleaseOrderList = response.data;
            } else {
              vm.norRsultFound = "No Record Found";
            }
            vm.isLoading = false;
          }
        },
        function (error) {
          vm.isLoading = false;

          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.GetOrderDetails = function (releaseOrderId, type) {
      var url2 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
      var body2 = {};

      vm.datalookup = [];
      AppService.post(url2, body2).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.datalookup = response.data;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );

      var url3 = rootvm.config.API_URL + rootvm.config.EndPoints.ConsigneeCode;
      var body3 = {};

      vm.ConsigneeCodeList = [];
      AppService.post(url3, body3).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.ConsigneeCodeList = response.data;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );

      const url1 = rootvm.config.API_URL + rootvm.config.EndPoints.releaseorder;
      const body1 = {
        releaseorderid: releaseOrderId,
        orderno: "",
        fromdate: "",
        todate: "",
        customer: "",
        shiptoparty: "",
        isactive: true,
      };

      //type = 1 for view, 2 = for edit

      $("#order_no").html("");
      $("#order_date").html("");
      $("#order_customer").html("");
      $("#order_ship_to_party").html("");
      $("#order_ship_to_address").html("");
      $("#revision_no").html("");
      $("#revision_date").html("");

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            vm.OrderDetailList = [];
            if (response && response.data.length > 0) {
              var date = new Date(response.data[0].orderDate);
              var day = ("0" + date.getDate()).slice(-2);
              var month = ("0" + (date.getMonth() + 1)).slice(-2);
              var year = date.getFullYear();
              vm.releaseOrderDetails = response.data[0];

              if (response.data[0].revisionDate != null) {
                var date1 = new Date(response.data[0].revisionDate);
                var day1 = ("0" + date1.getDate()).slice(-2);
                var month1 = ("0" + (date1.getMonth() + 1)).slice(-2);
                var year1 = date1.getFullYear();
              }
              if (type == 1) {
                $("#txt_release_order_id1").val(
                  response.data[0].releaseOrderId
                );
                $("#order_no").html(response.data[0].orderNo);
                $("#order_date").html(day + "-" + month + "-" + year);
                $("#order_customer").html(response.data[0].customer);
                $("#order_ship_to_party").html(response.data[0].shipToParty);
                $("#order_ship_to_address").html(
                  response.data[0].shipToAddress
                );

                $("#revision_no").html(response.data[0].revisionNo);
                if (response.data[0].revisionDate == null) {
                  $("#revision_date").html("");
                } else {
                  $("#revision_date").html(day1 + "-" + month1 + "-" + year1);
                }
              } else if (type == 2) {
                $("#txt_release_order_id").val(response.data[0].releaseOrderId);
                $("#txt_order_no").val(response.data[0].orderNo);
                $("#txt_order_no").val(response.data[0].orderNo);
                $("#txt_order_date").val(day + "-" + month + "-" + year);

                $("#txt_rivision_no").val(response.data[0].revisionNo);

                if (response.data[0].revisionDate == null) {
                  $("#txt_rivision_date").val("");
                } else {
                  $("#txt_rivision_date").val(
                    day1 + "-" + month1 + "-" + year1
                  );
                }

                vm.customer = response.data[0].customer;
                vm.shipToparty = response.data[0].shipToParty;
                $("#txt_order_ship_to_address").val(
                  response.data[0].shipToAddress
                );
              }

              let totalAmount = 0;

              for (let i = 0; i < response.data[0].items.length; i++) {
                const unitRate = response.data[0].items[i].unitRate;
                const qty = response.data[0].items[i].qty;

                if (unitRate && qty && !isNaN(unitRate) && !isNaN(qty)) {
                  totalAmount += parseFloat(unitRate) * parseFloat(qty);
                }
              }

              vm.totalValue = totalAmount;

              vm.OrderDetailList = response.data[0].items;

              for (let j = 0; j < vm.OrderDetailList.length; j++) {
                let unitRate = vm.OrderDetailList[j].unitRate;

                let numericRate = parseFloat(unitRate);

                if (!isNaN(numericRate)) {
                  vm.OrderDetailList[j].unitRate = numericRate.toFixed(4);
                }
              }
            } else {
              Swal.fire({
                allowOutsideClick: false,
                title: "No Record Found",
              });
            }
          }
        },
        function (error) {
          vm.isLoading = false;

          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.ReleaseOrderUpdate = function () {
      var release_order_id = $("#txt_release_order_id").val();
      var order_no = $("#txt_order_no").val();
      var order_date = $("#txt_order_date").val();
      var order_customer = $("#txt_order_customer").val();
      var order_ship_to_party = $("#txt_order_ship_to_party").val();
      var order_ship_to_address = $("#txt_order_ship_to_address").val();
      var rivision_no = $("#txt_rivision_no").val();
      var rivision_date = $("#txt_rivision_date").val();

      var parts = order_date.split("-");
      var formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];

      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();
      var time = hours + ":" + minutes + ":" + seconds;

      var new_date_time = formattedDate + " " + time;

      var date = new Date(new_date_time);
      var OrderDate = date.toISOString();

      if (rivision_date != "") {
        var parts1 = rivision_date.split("-");
        var formattedDate1 = parts1[2] + "-" + parts1[1] + "-" + parts1[0];

        var now1 = new Date();
        var hours1 = now1.getHours();
        var minutes1 = now1.getMinutes();
        var seconds1 = now1.getSeconds();
        var time1 = hours1 + ":" + minutes1 + ":" + seconds1;

        var new_date_time1 = formattedDate1 + " " + time1;

        var date1 = new Date(new_date_time1);
        var RivisionDate = date1.toISOString();
      } else {
        var RivisionDate = null;
      }

      const url1 =
        rootvm.config.API_URL + rootvm.config.EndPoints.releaseorderadd;
      const body1 = [
        {
          ReleaseOrderId: release_order_id,
          OrderNo: order_no,
          OrderDate: OrderDate,
          Customer: order_customer,
          ShipToParty: order_ship_to_party,
          ShipToAddress: order_ship_to_address,
          RevisionNo: rivision_no,
          RevisionDate: RivisionDate,
          Mode: "Update",
          items: [],
        },
      ];

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              text: response.data.description,
              allowOutsideClick: false,
              icon: "success",
            }).then(function () {
              window.location.reload();
            });
          }
        },
        function (error) {
          vm.isLoading = false;

          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.deleteOrder = function (releaseOrderId, orderno, customer) {
      Swal.fire({
        title: "Are you sure?",
        text: "you want to delete this order?",
        icon: "warning",
        allowOutsideClick: false,
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, Delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const url1 =
            rootvm.config.API_URL + rootvm.config.EndPoints.deleteorder;
          const body1 = {
            orderno: orderno,
            customer: customer,
            releaseorderid: releaseOrderId,
          };

          AppService.post(url1, body1).then(
            function (response) {
              if (response.status == 200) {
                Swal.fire({
                  allowOutsideClick: false,
                  text: response.data.description,
                  allowOutsideClick: false,
                  icon: "success",
                }).then(function () {
                  window.location.reload();
                });
              }
            },
            function (error) {
              vm.isLoading = false;

              if (error.status == 500) {
                Swal.fire({
                  allowOutsideClick: false,
                  icon: "error",
                  title: error,
                });
              } else if (error.status == 409) {
                const errorMessage = Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError;

                Swal.fire({
                  icon: "error",
                  title: errorMessage,
                });
              } else if (
                error.requestError.status == 400 ||
                error.requestError.status == 401 ||
                error.requestError.status == 402 ||
                error.requestError.status == 403
              ) {
                Swal.fire({
                  text: Array.isArray(error.data.requestError)
                    ? error.data.requestError.join("<br/>")
                    : error.data.requestError,
                  allowOutsideClick: false,
                  icon: "error",
                  willClose: () => {
                    location.reload();
                  },
                });
              }
            }
          );
        }
      });
    };

    vm.DeleteOrderItem = function (releaseOrderDetailsId, releaseOrderId) {
      Swal.fire({
        title: "Are you sure?",
        text: "you want to delete this order item?",
        icon: "warning",
        allowOutsideClick: false,
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, Delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const url1 =
            rootvm.config.API_URL + rootvm.config.EndPoints.deleteorderitem;
          const body1 = {
            releaseorderdetailsid: releaseOrderDetailsId,
          };

          AppService.post(url1, body1).then(
            function (response) {
              if (response.status == 200) {
                Swal.fire({
                  text: response.data.description,
                  allowOutsideClick: false,
                  icon: "success",
                }).then(function () {
                  const url2 =
                    rootvm.config.API_URL +
                    rootvm.config.EndPoints.releaseorder;
                  const body2 = {
                    releaseorderid: releaseOrderId,
                    orderno: "",
                    fromdate: "",
                    todate: "",
                    customer: "",
                    shiptoparty: "",
                    isactive: true,
                  };

                  AppService.post(url2, body2).then(
                    function (response) {
                      if (response.status == 200) {
                        vm.OrderDetailList = [];
                        if (response && response.data.length > 0) {
                          vm.OrderDetailList = response.data[0].items;

                          for (let j = 0; j < vm.OrderDetailList.length; j++) {
                            let unitRate = vm.OrderDetailList[j].unitRate;

                            let numericRate = parseFloat(unitRate);

                            if (!isNaN(numericRate)) {
                              vm.OrderDetailList[j].unitRate =
                                numericRate.toFixed(4);
                            }
                          }

                          let totalAmount = 0;

                          for (
                            let i = 0;
                            i < response.data[0].items.length;
                            i++
                          ) {
                            const unitRate = response.data[0].items[i].unitRate;
                            const qty = response.data[0].items[i].qty;

                            if (
                              unitRate &&
                              qty &&
                              !isNaN(unitRate) &&
                              !isNaN(qty)
                            ) {
                              totalAmount +=
                                parseFloat(unitRate) * parseFloat(qty);
                            }
                          }

                          vm.totalValue = totalAmount;
                        }
                      }
                    },
                    function (error) {
                      vm.isLoading = false;

                      if (error.status == 500) {
                        Swal.fire({
                          allowOutsideClick: false,
                          icon: "error",
                          title: error,
                        });
                      } else if (error.status == 409) {
                        const errorMessage = Array.isArray(
                          error.data.requestError
                        )
                          ? error.data.requestError.join("<br/>")
                          : error.data.requestError;

                        Swal.fire({
                          allowOutsideClick: false,
                          icon: "error",
                          title: errorMessage,
                        });
                      } else if (
                        error.requestError.status == 400 ||
                        error.requestError.status == 401 ||
                        error.requestError.status == 402 ||
                        error.requestError.status == 403
                      ) {
                        Swal.fire({
                          text: Array.isArray(error.data.requestError)
                            ? error.data.requestError.join("<br/>")
                            : error.data.requestError,
                          allowOutsideClick: false,
                          icon: "error",
                          willClose: () => {
                            location.reload();
                          },
                        });
                      }
                    }
                  );
                });
              }
            },
            function (error) {
              vm.isLoading = false;

              if (error.status == 500) {
                Swal.fire({
                  allowOutsideClick: false,
                  icon: "error",
                  title: error,
                });
              } else if (error.status == 409) {
                const errorMessage = Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError;

                Swal.fire({
                  allowOutsideClick: false,
                  icon: "error",
                  title: errorMessage,
                });
              } else if (
                error.requestError.status == 400 ||
                error.requestError.status == 401 ||
                error.requestError.status == 402 ||
                error.requestError.status == 403
              ) {
                Swal.fire({
                  text: Array.isArray(error.data.requestError)
                    ? error.data.requestError.join("<br/>")
                    : error.data.requestError,
                  allowOutsideClick: false,
                  icon: "error",
                  willClose: () => {
                    location.reload();
                  },
                });
              }
            }
          );
        }
      });
    };

    vm.GetOrderItem = function (releaseOrderDetailsId) {
      vm.saveBtn = "UPDATE";
      vm.order_item_lbl = "Edit";
      $("#txt_unit").val("PC");
      $("#add_new_item").modal("show");

      const url1 =
        rootvm.config.API_URL + rootvm.config.EndPoints.ordersingleitemget;
      const body1 = {
        ReleaseOrderDetailsId: releaseOrderDetailsId,
      };

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            vm.orderitem = response.data[0];

            var date = new Date(vm.orderitem.requiredDate);
            var day = ("0" + date.getDate()).slice(-2);
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var year = date.getFullYear();

            $("#txt_release_order_details_id").val(
              vm.orderitem.releaseOrderDetailsId
            );
            $("#txt_sequence_no").val(vm.orderitem.sequenceNo);
            $("#txt_part_no").val(vm.orderitem.partNo);
            $("#txt_qty").val(vm.orderitem.qty);
            $("#txt_unit_rate").val(vm.orderitem.unitRate);
            $("#txt_unit").val(vm.orderitem.unit);
            $("#txt_required_date").val(day + "-" + month + "-" + year);
            $("#txt_buyer_name").val(vm.orderitem.buyerName);
            $("#txt_revision_no").val(vm.orderitem.revisionNo);
            $("#txt_mode").val("Update");

            //console.log(vm.orderitem);
          }
        },
        function (error) {
          vm.isLoading = false;

          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.OrderItemNewAdd = function () {
      $("#add_new_item").modal("show");
      $("#txt_release_order_details_id").val(
        "00000000-0000-0000-0000-000000000000"
      );
      $("#txt_sequence_no").val("");
      $("#txt_part_no").val("");
      $("#txt_qty").val("");
      $("#txt_unit_rate").val("");
      $("#txt_unit").val("");
      $("#txt_required_date").val("");
      $("#txt_buyer_name").val("");
      $("#txt_revision_no").val("");
      $("#txt_mode").val("Create");

      vm.saveBtn = "ADD";
      vm.order_item_lbl = "Add";
      $("#txt_unit").val("PC");
    };

    vm.OrderItemNewSave = function () {
      var release_order_details_id = $("#txt_release_order_details_id").val();
      var release_order_id = $("#txt_release_order_id1").val();
      var sequence_no = $("#txt_sequence_no").val();
      var part_no = $("#txt_part_no").val();
      var qty = $("#txt_qty").val();
      var unit_rate = $("#txt_unit_rate").val();
      var unit = $("#txt_unit").val();
      var date = $("#txt_required_date").val();
      var buyer_name = $("#txt_buyer_name").val();
      var revision_no = $("#txt_revision_no").val();
      var mode = $("#txt_mode").val();

      if (part_no == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter Part No",
        });
      } else if (qty == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter Qty",
        });
      } else if (unit == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter Unit",
        });
      } else if (date == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter Required Date",
        });
      } else {
        var parts = date.split("-");
        var formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];

        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var time = hours + ":" + minutes + ":" + seconds;

        var new_date_time = formattedDate + " " + time;

        var date = new Date(new_date_time);
        var required_date = date.toISOString();

        const url1 =
          rootvm.config.API_URL + rootvm.config.EndPoints.orderitemnewadd;
        const body1 = {
          ReleaseOrderDetailsId: release_order_details_id,
          ReleaseOrderId: release_order_id,
          SequenceNo: sequence_no,
          PartNo: part_no,
          Qty: qty,
          UnitRate: unit_rate,
          Unit: unit,
          RequiredDate: required_date,
          BuyerName: buyer_name,
          RevisionNo: revision_no,
          Mode: mode,
        };

        AppService.post(url1, body1).then(
          function (response) {
            if (response.status == 200) {
              Swal.fire({
                text: response.data.description,
                allowOutsideClick: false,
                icon: "success",
              }).then(function () {
                $("#add_new_item").modal("hide");

                const url2 =
                  rootvm.config.API_URL + rootvm.config.EndPoints.releaseorder;
                const body2 = {
                  releaseorderid: release_order_id,
                  orderno: "",
                  fromdate: "",
                  todate: "",
                  customer: "",
                  shiptoparty: "",
                  isactive: true,
                };

                AppService.post(url2, body2).then(
                  function (response) {
                    if (response.status == 200) {
                      vm.OrderDetailList = [];
                      if (response && response.data.length > 0) {
                        vm.OrderDetailList = response.data[0].items;

                        for (let j = 0; j < vm.OrderDetailList.length; j++) {
                          let unitRate = vm.OrderDetailList[j].unitRate;

                          let numericRate = parseFloat(unitRate);

                          if (!isNaN(numericRate)) {
                            vm.OrderDetailList[j].unitRate =
                              numericRate.toFixed(4);
                          }
                        }

                        let totalAmount = 0;

                        for (
                          let i = 0;
                          i < response.data[0].items.length;
                          i++
                        ) {
                          const unitRate = response.data[0].items[i].unitRate;
                          const qty = response.data[0].items[i].qty;

                          if (
                            unitRate &&
                            qty &&
                            !isNaN(unitRate) &&
                            !isNaN(qty)
                          ) {
                            totalAmount +=
                              parseFloat(unitRate) * parseFloat(qty);
                          }
                        }

                        vm.totalValue = totalAmount;
                      }
                    }
                  },
                  function (error) {
                    vm.isLoading = false;

                    if (error.status == 500) {
                      Swal.fire({
                        allowOutsideClick: false,
                        icon: "error",
                        title: error,
                      });
                    } else if (error.status == 409) {
                      const errorMessage = Array.isArray(
                        error.data.requestError
                      )
                        ? error.data.requestError.join("<br/>")
                        : error.data.requestError;

                      Swal.fire({
                        allowOutsideClick: false,
                        icon: "error",
                        title: errorMessage,
                      });
                    } else if (
                      error.requestError.status == 400 ||
                      error.requestError.status == 401 ||
                      error.requestError.status == 402 ||
                      error.requestError.status == 403
                    ) {
                      Swal.fire({
                        text: Array.isArray(error.data.requestError)
                          ? error.data.requestError.join("<br/>")
                          : error.data.requestError,
                        allowOutsideClick: false,
                        icon: "error",
                        willClose: () => {
                          location.reload();
                        },
                      });
                    }
                  }
                );
              });
            }
          },
          function (error) {
            vm.isLoading = false;

            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      }
    };

    vm.GetDataLookup = function (url2, body2) {
      vm.datalookup = [];
      AppService.post(url2, body2).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.datalookup = response.data;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.GetConsigneeCode = function (url3, body3) {
      vm.ConsigneeCodeList = [];
      AppService.post(url3, body3).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.ConsigneeCodeList = response.data;
              vm.isBodyLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.exportToExcel = function () {
      vm.tableData = [];
      console.log("i am printing the data", vm.releaseOrderDetails);
      console.log("i am printing the data", vm.totalValue);

      for (let i = 0; i < vm.OrderDetailList.length; i++) {
        vm.tableData.push({
          // Adding By Pritam Start
          "Order Number": vm.releaseOrderDetails.orderNo,
          "Order Date": convertDateFormat(vm.releaseOrderDetails.orderDate),
          Customer: vm.releaseOrderDetails.customer,
          "Ship To Party": vm.releaseOrderDetails.shipToParty,
          "Ship to Address": vm.releaseOrderDetails.shipToAddress,
          // Adding By Pritam end
          "Sequence No": vm.OrderDetailList[i].sequenceNo,
          "Part No": vm.OrderDetailList[i].partNo,
          "Qty (PC)": vm.OrderDetailList[i].qty,
          "Unit Rate (PC)": vm.OrderDetailList[i].unitRate,
          "Value (USD)":
            vm.OrderDetailList[i].qty * vm.OrderDetailList[i].unitRate,
          "Required Date": convertDateFormat(
            vm.OrderDetailList[i].requiredDate
          ),
          "Buyer Name": vm.OrderDetailList[i].buyerName,
          "Revision No": vm.OrderDetailList[i].revisionNo,
          Status: vm.OrderDetailList[i].status,
          "Total Value (USD)": i === 0 ? vm.totalValue.toFixed(4) : "",
        });
      }

      const ws = XLSX.utils.json_to_sheet(vm.tableData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      XLSX.writeFile(wb, "Release Order Details.xlsx");
    };

    function convertDateFormat(dateStr) {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }

    init = function () {
      var roles = vm.loggedInUser.roles;
      //var roles=["RELEASE_ORDER_SEARCH","RELEASE_ORDER_SAVE","PARTY_SEARCH"];
      vm.list = !!roles.find((role) => role === "RELEASE_ORDER_SEARCH");
      vm.add = !!roles.find((role) => role === "RELEASE_ORDER_SAVE");
      vm.edit = !!roles.find((role) => role === "ORDER_UPDATE");
      vm.delete = !!roles.find((role) => role === "RELEASE_ORDER_DELETE");

      vm.itemlist = !!roles.find((role) => role === "ORDER_ITEM_SEARCH");
      vm.itemadd = !!roles.find((role) => role === "RELEASE_ORDER_ITEM_SAVE");
      vm.itemdelete = !!roles.find((role) => role === "ORDER_ITEM_DELETE");

      //vm.partylist = !!roles.find(role => role === "PARTY_SEARCH");

      if (vm.list === true) {
        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.releaseorder;
        const body = {
          releaseorderid: "00000000-0000-0000-0000-000000000000",
          orderno: "",
          fromdate: "",
          todate: "",
          customer: "",
          shiptoparty: "",
          isactive: true,
        };
        vm.GetReleaseOrderList(url, body);

        var url2 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
        var body2 = {};

        vm.datalookup = [];
        AppService.post(url2, body2).then(
          function (response) {
            if (response.status == 200) {
              if (response && response.data) {
                vm.datalookup1 = response.data;
              }
            }
          },
          function (error) {
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );

        var url3 =
          rootvm.config.API_URL + rootvm.config.EndPoints.ConsigneeCode;
        var body3 = {};

        vm.ConsigneeCodeList = [];
        AppService.post(url3, body3).then(
          function (response) {
            if (response.status == 200) {
              if (response && response.data) {
                vm.ConsigneeCodeList1 = response.data;
              }
            }
          },
          function (error) {
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      }
    };

    init();
  };
  ReleaseOrderEntryController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("ReleaseOrderEntryController", ReleaseOrderEntryController);
  //#endregion ReleaseOrderEntryController

  //#region ReleaseOrderDispatchController
  const ReleaseOrderDispatchController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.getDispatchList = function () {
      vm.Orderdispatchlist = [];

      var customer = $("#search_customer").val();
      var warehouse = $("#search_warehouse").val();
      var release_no = $("#txt_release_no").val();
      var ship_to_party = $("#search_ship_to_party").val();
      var from_date = $("#txt_search_from_date").val();
      var to_date = $("#txt_search_to_date").val();

      if (from_date != "") {
        var from_date1 = $("#txt_search_from_date").val();

        var parts = from_date1.split("-");
        var day = parts[0];
        var month = parts[1];
        var year = parts[2];

        var releaseFrom = year + "-" + month + "-" + day + "00:00:00.000";
      } else {
        var releaseFrom = "";
      }

      if (to_date != "") {
        var to_date1 = $("#txt_search_to_date").val();

        var parts = from_date1.split("-");
        var day = parts[0];
        var month = parts[1];
        var year = parts[2];

        var releaseTill = year + "-" + month + "-" + day + "00:00:00.000";
      } else {
        var releaseTill = "";
      }

      if (customer === "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Party selection is required",
        });
        return false;
      } else if (warehouse === "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Warehouse selection is required",
        });
        return false;
      } else if (ship_to_party === "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Ship to party selection is required",
        });
        return false;
      } else {
        vm.isLoading = true;
        vm.norRsultFound = "";

        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.pendingdispatchsearch;
        const body = {
          partyCode: customer,
          warehouse: warehouse,
          itemNumber: release_no,
          consigneeCode: ship_to_party,
          releaseFrom: releaseFrom,
          releaseTill: releaseTill,
        };

        AppService.post(url, body).then(
          function (response) {
            if (response.status == 200) {
              //console.log(response.data.releases);
              if (response && response.data.releases.length > 0) {
                let releases = response.data.releases;
                let items = response.data.item;

                // Map items to their respective releases based on itemNumber
                releases.forEach((release) => {
                  release.items = items.filter(
                    (item) => item.realNumber === release.itemNumber
                  );
                });

                //console.log(releases); // Debugging to check the structure
                vm.Orderdispatchlist = releases; // Assign to Angular scope
                console.log("order dispatch list: ", vm.Orderdispatchlist);
                vm.isLoading = false;
              } else {
                vm.isLoading = false;
                vm.norRsultFound = "No Record Found";
              }
            }
          },
          function (error) {
            vm.isLoading = false;
            vm.norRsultFound = "No Record Found";

            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      }
    };

    vm.checkAll = function (index) {
      var dispatch = vm.Orderdispatchlist[index];

      // Check the master checkbox by its ID
      if ($("#checkBoxClass" + index).is(":checked") == true) {
        var isChecked = $(".checkBoxClass" + index).prop("checked", true);
        dispatch.items.forEach(function (item) {
          //item.selected = isChecked;
          item.selected = true;
          vm.updateSelectedItems(item, dispatch); // This updates vm.selectedItems
        });
      } else {
        var isChecked = $(".checkBoxClass" + index).prop("checked", false);
        dispatch.items.forEach(function (item) {
          item.selected = false;
          vm.updateSelectedItems(item, dispatch);
        });
      }
      console.log("updated selectedItems: ", vm.updateSelectedItems);
      //var isChecked = angular.element('#checkBoxClass' + (index + 1)).prop('checked');
    };

    vm.check_qty = function (count1, count2) {
      let item = vm.Orderdispatchlist[count1 - 1]?.items[count2 - 1];

      let qty = item.qty;
      let pal_cart = item.reqQuantity;
      var qtyy = $("#qtyy" + count1 + "" + count2).val();

      if (pal_cart <= 0) {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "No. of Pallet / Carton Should Not Be Zero(0)",
        });

        $("#pal_cart" + count1 + "" + count2).val(qtyy);
        return false;
      }

      if (pal_cart > qty) {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "Enter quantity is wrong",
        });

        $("#pal_cart" + count1 + "" + count2).val(qtyy);
        return false;
      }
    };

    vm.selectedItems = [];
    //vm.Orderdispatchlist = [];

    vm.updateSelectedItems = function (item, dispatch) {
      //debugger;
      console.log(vm.Orderdispatchlist.item);

      if (item.selected === true) {
        vm.selectedItems.push({
          party: item.party,
          date: item.date,
          partNo: item.partNo,
          size: item.size,
          item: item.item,
          invoiceNumber: item.invoiceNumber,
          paidDate: item.paidDate,
          prefix: item.prefix,
          startno: item.startno,
          pallets: item.pallets,
          cartons: item.cartons,
          quantity: item.quantity,
          type: item.type,
          flag: item.flag,
          realNumber: item.realNumber,
          slno: item.slno,
          reQuantity: item.reqQuantity,
          slno2: item.slno2,
          slno3: item.slno3,
          month: item.month,
          shipmentPlan: item.shipmentPlan,
          cartonQuantity: item.cartonQuantity,
          poNumber: item.poNumber,
          finalDeatination: item.finalDeatination,
          refBuyer: item.refBuyer,
          rate: item.rate,
          invoiceNumberAlt: item.invoiceNumberAlt,
          sequence: item.sequence,
          reference: item.reference,
        });
      } else {
        vm.selectedItems = vm.selectedItems.filter(
          (selectedItem) => selectedItem.slno != item.slno
        );
      }

      let allSelected = dispatch.items.every((i) => i.selected);
      dispatch.masterSelected = allSelected;

      // ✅ Update DOM checkbox accordingly
      const index = vm.Orderdispatchlist.indexOf(dispatch);
      if (index > -1) {
        $("#checkBoxClass" + index).prop("checked", allSelected);
      }

      // vm.selectedItems = vm.selectedItems.filter(
      //     (selectedItem) => selectedItem.slno != item.slno
      // );

      // if (item.selected) {
      //     vm.selectedItems.push({
      //         party: item.party,
      //         date: item.date,
      //         partNo: item.partNo,
      //         size: item.size,
      //         item: item.item,
      //         invoiceNumber: item.invoiceNumber,
      //         paidDate: item.paidDate,
      //         prefix: item.prefix,
      //         startno: item.startno,
      //         pallets: item.pallets,
      //         cartons: item.cartons,
      //         quantity: item.quantity,
      //         type: item.type,
      //         flag: item.flag,
      //         realNumber: item.realNumber,
      //         slno: item.slno,
      //         reQuantity: item.reqQuantity,
      //         slno2: item.slno2,
      //         slno3: item.slno3,
      //         month: item.month,
      //         shipmentPlan: item.shipmentPlan,
      //         cartonQuantity: item.cartonQuantity,
      //         poNumber: item.poNumber,
      //         finalDeatination: item.finalDeatination,
      //         refBuyer: item.refBuyer,
      //         rate: item.rate,
      //         invoiceNumberAlt: item.invoiceNumberAlt,
      //         sequence: item.sequence,
      //         reference: item.reference
      //     });
      // }

      //console.log(vm.selectedItems);
    };

    vm.createDispatchData = function () {
      if (vm.selectedItems.length <= 0) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Please select atleast one item",
        });
        return false;
      }
      // else if (!vm.selectedItems.some(item => item.quantity == null)) {
      //     Swal.fire({
      //         allowOutsideClick: false,
      //         title: "No. of Pallet / Carton should not be empty or zero(0)",
      //     });
      //     return false;
      // }
      else {
        let partyCode = $("#search_customer").val();
        let cfDestimation = $("#search_warehouse").val();
        let buyerCode = $("#search_ship_to_party").val();
        let consigneeCode = $("#search_ship_to_party").val();
        let formattedDate = $("#shipmentDate").val();
        let trackingNumber = $("#trackingNumber").val();
        let remarks = $("#remarks").val();

        if (trackingNumber == "") {
          Swal.fire({
            allowOutsideClick: false,
            title: "BOL No. is required",
          });
          return false;
        } else if (formattedDate == "") {
          Swal.fire({
            allowOutsideClick: false,
            title: "Date is required",
          });
          return false;
        } else if (remarks == "") {
          Swal.fire({
            allowOutsideClick: false,
            title: "Remarks is required",
          });
          return false;
        } else {
          // console.log("Selected Items for Dispatch:", vm.selectedItems);
          // return false;
          let shipmentDate = new Date(formattedDate).toISOString();

          var items = vm.selectedItems.map(function (x) {
            x.slno2 = x.slno;
            return x;
          });
          console.log("buyer code ", vm.Orderdispatchlist[0].buyer.code);
          let body = {
            type: "NORMAL",
            action: "DISPATCH",
            source: "PII",
            destination: "PII",
            cfDestimation: cfDestimation,
            transferee: null,
            whToWh: false,
            itemNumber: "DISPATCH-000",
            partyCode: partyCode,
            // buyerCode: buyerCode,
            buyerCode: vm.Orderdispatchlist[0].buyer.code,
            consigneeCode: consigneeCode,
            itemDate: shipmentDate,
            items: items,
            breaks: [],
            transfers: [],
            shipmentDate: shipmentDate,
            trackingNumber: trackingNumber,
            remarks: remarks,
          };

          console.log("Release order dispace body: ", body);
          // return false;

          const url = rootvm.config.API_URL + rootvm.config.EndPoints.savedata;
          AppService.post(url, body).then(
            function (response) {
              if (response.status == 200) {
                if (response && response.data) {
                  Swal.fire({
                    title: response.data.description,
                    text: "Dispatch Number : " + response.data.data.itemNumber,
                    allowOutsideClick: false,
                    icon: "success",
                  }).then(function () {
                    window.location.reload();
                  });
                }
              }
            },
            function (error) {
              if (error.status == 500) {
                Swal.fire({
                  allowOutsideClick: false,
                  icon: "error",
                  title: error.data,
                });
              } else if (error.status == 409) {
                const errorMessage = Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError;

                Swal.fire({
                  allowOutsideClick: false,
                  icon: "error",
                  title: errorMessage,
                });
              } else if (
                error.requestError.status == 400 ||
                error.requestError.status == 401 ||
                error.requestError.status == 402 ||
                error.requestError.status == 403
              ) {
                Swal.fire({
                  text: Array.isArray(error.data.requestError)
                    ? error.data.requestError.join("<br/>")
                    : error.data.requestError,
                  allowOutsideClick: false,
                  icon: "error",
                  willClose: () => {
                    location.reload();
                  },
                });
              }
            }
          );
        }
      }
      //return dispatchData;
    };

    // Call createDispatchData() when you need to generate the final JSON.

    vm.getFdestination = function () {
      vm.isBodyLoading = true;
      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.PartyWiseWarehouseList;
      const body = {
        party: vm.model.partyCode,
      };

      vm.FdestinationList = [];
      // vm.model.cfDestimation="";
      // $("#f_destination").css("display", "none");

      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.FdestinationList = response.data;
              vm.isBodyLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );

      vm.ConsigneeCodeList = [];

      const url1 =
        rootvm.config.API_URL + rootvm.config.EndPoints.PartyWiseShiptoList;
      const body1 = { partyCode: vm.model.partyCode };

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.ConsigneeCodeList = response.data;
              vm.isBodyLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.GetDataLookup = function (url1, body1) {
      vm.datalookup = [];
      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.datalookup = response.data;
              vm.isBodyLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.hasAllZero = function (dispatch) {
      return dispatch.items.some(
        (item) => item.pallets > 0 || item.cartons > 0
      );
      // return true;
    };

    init = function () {
      vm.isBodyLoading = true;
      vm.norRsultFound = "";

      const url1 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
      const body1 = {};
      vm.GetDataLookup(url1, body1);

      // const url2 = rootvm.config.API_URL + rootvm.config.EndPoints.ConsigneeCode;
      // const body2 ={};

      // vm.ConsigneeCodeList=[];
      // AppService.post(url2, body2)
      // .then(function (response)
      // {
      //     if(response.status == 200)
      //     {
      //         if (response && response.data)
      //         {
      //             vm.ConsigneeCodeList=response.data;
      //             vm.isBodyLoading = false;
      //         }
      //     }

      // }, function (error)
      // {
      //     if(error.status == 500)
      //     {
      //         Swal.fire({
      //             allowOutsideClick: false,
      //             icon: 'error',
      //             title: error.data,
      //         });
      //     }
      //     else if(error.status == 409)
      //     {
      //         const errorMessage = Array.isArray(error.data.requestError)
      //             ? error.data.requestError.join('<br/>')
      //             : error.data.requestError;

      //         Swal.fire({
      //             allowOutsideClick: false,
      //             icon: 'error',
      //             title: errorMessage,
      //         });
      //     }
      //     else if (error.requestError.status==400 || error.requestError.status==401 || error.requestError.status==402 || error.requestError.status==403)
      //     {
      //         Swal.fire({
      //             text: Array.isArray(error.data.requestError) ? error.data.requestError.join('<br/>') : error.data.requestError,
      //             allowOutsideClick: false,
      //             icon: "error",
      //             willClose: () => {
      //                 location.reload();
      //             }
      //         });
      //     }
      // });
    };

    init();
  };
  ReleaseOrderDispatchController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller(
      "ReleaseOrderDispatchController",
      ReleaseOrderDispatchController
    );
  //#endregion ReleaseOrderDispatchController

  //#region PostInvoiceToWorkbookController
  const PostInvoiceToWorkbookController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.PostInvoiceToWorkbookDelete = function () {
      var invoiceNo = $("#InvoiceNo").val();

      if (invoiceNo == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Invoice no is required",
        });
        return false;
      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "you want to delete this invoice?",
          icon: "warning",
          allowOutsideClick: false,
          showCancelButton: true,
          cancelButtonColor: "#3085d6",
          confirmButtonColor: "#d33",
          confirmButtonText: "Yes, Delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            // Loading State
            vm.isProcessingDelete = true;
            const url =
              rootvm.config.API_URL +
              rootvm.config.EndPoints.PostInvoiceToWorkbookDelete;
            const body = { invoiceNo: invoiceNo };

            AppService.post(url, body).then(
              function (response) {
                vm.isProcessingDelete = false;
                if (response.status == 200) {
                  Swal.fire({
                    allowOutsideClick: false,
                    text: response.data.description,
                    icon: "success",
                  }).then(function () {
                    // window.location.reload();
                  });
                }
              },
              function (error) {
                vm.isProcessingDelete = false;
                if (error.data.status === "FAILED") {
                  Swal.fire({
                    allowOutsideClick: false,
                    icon: "error",
                    title: error.data.description,
                  });
                  return;
                }
                if (error.data.status === "FAILURE") {
                  Swal.fire({
                    allowOutsideClick: false,
                    icon: "error",
                    title: error.data.description,
                  });
                  return;
                }

                if (error.status == 500) {
                  Swal.fire({
                    allowOutsideClick: false,
                    icon: "error",
                    title: error,
                  });
                } else if (error.status == 409) {
                  const errorMessage = Array.isArray(error.data.requestError)
                    ? error.data.requestError.join("<br/>")
                    : error.data.requestError;

                  Swal.fire({
                    icon: "error",
                    title: errorMessage,
                  });
                } else if (
                  error.requestError.status == 400 ||
                  error.requestError.status == 401 ||
                  error.requestError.status == 402 ||
                  error.requestError.status == 403
                ) {
                  Swal.fire({
                    text: Array.isArray(error.data.requestError)
                      ? error.data.requestError.join("<br/>")
                      : error.data.requestError,
                    allowOutsideClick: false,
                    icon: "error",
                    willClose: () => {
                      // location.reload();
                    },
                  });
                }
              }
            );
          }
        });
      }
    };

    vm.PostInvoiceToWorkbookPost = function () {
      var invoiceNo = $("#InvoiceNo").val();

      if (invoiceNo == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Invoice no is required",
        });
        return false;
      } else {
        //Loading State
        vm.isProcessingPost = true;
        const url =
          rootvm.config.API_URL +
          rootvm.config.EndPoints.PostInvoiceToWorkbookPost;
        const body = { invoiceNo: invoiceNo };
        AppService.post(url, body).then(
          function (response) {
            vm.isProcessingPost = false;
            if (response.status == 200) {
              Swal.fire({
                allowOutsideClick: false,
                text: response.data.description,
                icon: "success",
              }).then(function () {
                // window.location.reload();
              });
            }
          },
          function (error) {
            vm.isProcessingPost = false;
            vm.isLoading = false;
            if (error.data.status === "FAILURE") {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data.description,
              });
              return;
            }
            if (error.data.status === "FAILED") {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data.description,
              });
              return;
            }

            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  // location.reload();
                },
              });
            }
          }
        );
      }
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      vm.post = !!roles.find(
        (role) => role === "POST_INVOICE_TO_WORKBOOK_POST"
      );
      vm.delete = !!roles.find(
        (role) => role === "POST_INVOICE_TO_WORKBOOK_DELETE"
      );
    };

    init();
  };
  PostInvoiceToWorkbookController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller(
      "PostInvoiceToWorkbookController",
      PostInvoiceToWorkbookController
    );
  //#endregion PostInvoiceToWorkbookController

  //#region CreateUserController
  const UserController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.model = vm.model || {};

    vm.UesrSearch = function () {
      var username = $("#txt_userName").val();
      if (username == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter Usename",
        });
        return false;
      } else {
        vm.isLoading = true;
        vm.userDetails = [];
        vm.norRsultFound = "";

        const body = { username: username };
        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.users_profile_search;

        AppService.post(url, body).then(
          function (response) {
            if (response.status == 200) {
              if (response.data.data.length > 0) {
                vm.userDetails = response.data.data;
                vm.isLoading = false;
                vm.norRsultFound = "";
              } else {
                vm.isLoading = false;
                vm.norRsultFound = "No Record Found";
              }
            }
          },
          function (error) {
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      }
    };

    vm.user_create = function () {
      if (!vm.model || !vm.model.username) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter username",
        });

        return false;
      }

      if (!vm.model || !vm.model.password) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter password",
        });

        return false;
      }

      if (!vm.model || !vm.model.ConfirmPassword) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter confirm password",
        });

        return false;
      }

      if (vm.model.password !== vm.model.ConfirmPassword) {
        Swal.fire({
          allowOutsideClick: false,
          icon: "warning",
          title: "Password & Confirm Password are not matched",
        });

        return false;
      }

      const body = {
        username: vm.model.username,
        password: vm.model.password,
        userCaterory: vm.model.user_caterory || "",
        party: vm.model.party || "",
      };

      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.users_profile_add;
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "success",
              text: response.data.description,
            }).then(function () {
              window.location.reload();
            });
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.GetUserForEdit = function (username) {
      vm.getUserDetails = [];

      const body = { username: username };
      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.users_profile_search;

      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response.data.data.length > 0) {
              vm.getUserDetails = response.data.data;

              $("#edit_user").modal("show");
              $("#edit_username").attr("readonly", true);
              $("#edit_username").css({ "background-color": "#ebebeb" });

              vm.model.edit_username = vm.getUserDetails[0].username;
              vm.model.edit_user_caterory = vm.getUserDetails[0].userCategory;
              vm.model.edit_party = vm.getUserDetails[0].party;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.userUpdate = function () {
      const body = {
        username: vm.model.edit_username,
        password: "",
        userCaterory: vm.model.edit_user_caterory || "",
        party: vm.model.edit_party || "",
      };

      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.users_profile_update;
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "success",
              text: response.data.description,
            }).then(function () {
              window.location.reload();
            });
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.passwordChange = function (UserId) {
      $("#userId").val("");
      $("#userId").val(UserId);
      $("#changePassword").modal("show");
    };

    vm.model = vm.model || {};

    vm.changePassword = function () {
      if (!vm.model || !vm.model.newpassword) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter new password",
        });

        return false;
      }

      if (!vm.model || !vm.model.confirmpassword) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter confirm password",
        });

        return false;
      }

      if (vm.model.newpassword !== vm.model.confirmpassword) {
        Swal.fire({
          allowOutsideClick: false,
          icon: "warning",
          title: "Password and confirmed password do not match",
        });

        return false;
      }

      const body = {
        userId: $("#userId").val(),
        newpassword: vm.model.newpassword,
        confirmpassword: vm.model.confirmpassword,
      };

      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.admin_change_password;
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "success",
              text: response.data.description,
            }).then(function () {
              window.location.reload();
            });
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    function init() {
      var roles = vm.loggedInUser.roles;
      vm.add = !!roles.find((role) => role === "USER_CREATE");

      vm.isLoading = true;

      const body = { username: "" };
      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.users_profile_search;

      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response.data.data.length > 0) {
              vm.userDetails = response.data.data;

              for (i = 0; i < vm.userDetails.length; i++) {
                if (vm.userDetails[i].allowLogin === true) {
                  vm.userDetails[i].allowLogin = "Active";
                } else if (vm.userDetails[i].allowLogin === false) {
                  vm.userDetails[i].allowLogin = "Inactive";
                }
              }

              vm.isLoading = false;
              vm.norRsultFound = "";
            } else {
              vm.isLoading = false;
              vm.norRsultFound = "No Record Found";
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    }

    init();
  };
  UserController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular.module("PattonApp").controller("UserController", UserController);
  //#endregion CreateUserController

  //#region ChangePasswordController
  const ChangePasswordController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.model = vm.model || {};

    vm.changePassword = function () {
      if (!vm.model || !vm.model.password) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter current password",
        });

        return false;
      }

      if (!vm.model || !vm.model.newpassword) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter new password",
        });

        return false;
      }

      if (!vm.model || !vm.model.confirmpassword) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter confirm password",
        });

        return false;
      }

      if (vm.model.newpassword !== vm.model.confirmpassword) {
        Swal.fire({
          allowOutsideClick: false,
          icon: "warning",
          title: "Password and confirmed password do not match",
        });

        return false;
      }

      const body = {
        password: vm.model.password,
        newpassword: vm.model.newpassword,
        confirmpassword: vm.model.confirmpassword,
      };

      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.users_change_password;
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "success",
              text: response.data.description,
            }).then(function () {
              window.location.reload();
            });
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    function init() {}

    init();
  };
  ChangePasswordController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("ChangePasswordController", ChangePasswordController);
  //#endregion ChangePasswordController

  //#region UserDetailsController
  const UserDetailsController = function (
    $scope,
    $rootScope,
    $routeParams,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    var username = $routeParams.username;

    vm.userDetails = [];
    vm.GetUserDetails = function (url, body) {
      vm.isLoading = true;
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response.data.data.length > 0) {
              vm.userDetails = response.data.data;

              vm.userRoleDetails = [];

              const body1 = { Id: vm.userDetails[0].id };
              const url1 =
                rootvm.config.API_URL +
                rootvm.config.EndPoints.SearchUserRoleGroup;

              AppService.post(url1, body1).then(
                function (response) {
                  if (response.status == 200) {
                    vm.userRoleDetails = response.data.data;
                    //console.log(vm.userRoleDetails.activeRoles);
                    vm.isLoading = false;
                    vm.norRsultFound = "";
                  }
                },
                function (error) {
                  if (error.status == 500) {
                    Swal.fire({
                      allowOutsideClick: false,
                      icon: "error",
                      title: error.data,
                    });
                  } else if (error.status == 409) {
                    const errorMessage = Array.isArray(error.data.requestError)
                      ? error.data.requestError.join("<br/>")
                      : error.data.requestError;

                    Swal.fire({
                      allowOutsideClick: false,
                      icon: "error",
                      title: errorMessage,
                    });
                  } else if (
                    error.requestError.status == 400 ||
                    error.requestError.status == 401 ||
                    error.requestError.status == 402 ||
                    error.requestError.status == 403
                  ) {
                    Swal.fire({
                      text: Array.isArray(error.data.requestError)
                        ? error.data.requestError.join("<br/>")
                        : error.data.requestError,
                      allowOutsideClick: false,
                      icon: "error",
                      willClose: () => {
                        location.reload();
                      },
                    });
                  }
                }
              );
            } else {
              vm.isLoading = false;
              vm.norRsultFound = "No Record Found";
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.GetRoleGroupList = function (url, body) {
      vm.isLoading = true;
      // vm.Warehouselabel = "Add Warehouse Details";
      // vm.add_btn = "CREATE";
      // vm.mode=1;
      vm.RoleGroupList = [];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.RoleGroupList = response.data;
              vm.isLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.userRoleAssign = function (type, userId, rolegroupId, mapid) {
      if (type == 1) {
        Swal.fire({
          //title: 'Are you sure?',
          text: "Do You Want to Assign This Role Group For This User?",
          icon: "warning",
          allowOutsideClick: false,
          showCancelButton: true,
          cancelButtonColor: "#3085d6",
          confirmButtonColor: "#d33",
          confirmButtonText: "Yes, Assign it!",
        }).then((result) => {
          if (result.isConfirmed) {
            const body = {
              userId: userId,
              rolegroupId: rolegroupId,
              mode: "create",
            };
            const url =
              rootvm.config.API_URL + rootvm.config.EndPoints.UserRoleGroupSave;

            AppService.post(url, body).then(
              function (response) {
                if (response.status == 200) {
                  if (response && response.data) {
                    Swal.fire({
                      allowOutsideClick: false,
                      icon: "success",
                      text: response.data.description,
                    }).then(function () {
                      window.location.reload();
                    });
                  }
                }
              },
              function (error) {
                if (error.status == 500) {
                  Swal.fire({
                    allowOutsideClick: false,
                    icon: "error",
                    title: error.data,
                  });
                } else if (error.status == 409) {
                  const errorMessage = Array.isArray(error.data.requestError)
                    ? error.data.requestError.join("<br/>")
                    : error.data.requestError;

                  Swal.fire({
                    allowOutsideClick: false,
                    icon: "error",
                    title: errorMessage,
                  });
                } else if (
                  error.requestError.status == 400 ||
                  error.requestError.status == 401 ||
                  error.requestError.status == 402 ||
                  error.requestError.status == 403
                ) {
                  Swal.fire({
                    text: Array.isArray(error.data.requestError)
                      ? error.data.requestError.join("<br/>")
                      : error.data.requestError,
                    allowOutsideClick: false,
                    icon: "error",
                    willClose: () => {
                      location.reload();
                    },
                  });
                }
              }
            );
          }
        });
      } else {
        Swal.fire({
          //title: 'Are you sure?',
          text: "Do You Want to Remove This Role Group For This User?",
          icon: "warning",
          allowOutsideClick: false,
          showCancelButton: true,
          cancelButtonColor: "#3085d6",
          confirmButtonColor: "#d33",
          confirmButtonText: "Yes, Remove it!",
        }).then((result) => {
          if (result.isConfirmed) {
            const body = {
              Id: mapid,
              userId: userId,
              rolegroupId: rolegroupId,
              Active: false,
              mode: "edit",
            };
            const url =
              rootvm.config.API_URL + rootvm.config.EndPoints.UserRoleGroupSave;

            AppService.post(url, body).then(
              function (response) {
                if (response.status == 200) {
                  if (response && response.data) {
                    Swal.fire({
                      allowOutsideClick: false,
                      icon: "success",
                      text: response.data.description,
                    }).then(function () {
                      window.location.reload();
                    });
                  }
                }
              },
              function (error) {
                if (error.status == 500) {
                  Swal.fire({
                    allowOutsideClick: false,
                    icon: "error",
                    title: error.data,
                  });
                } else if (error.status == 409) {
                  const errorMessage = Array.isArray(error.data.requestError)
                    ? error.data.requestError.join("<br/>")
                    : error.data.requestError;

                  Swal.fire({
                    allowOutsideClick: false,
                    icon: "error",
                    title: errorMessage,
                  });
                } else if (
                  error.requestError.status == 400 ||
                  error.requestError.status == 401 ||
                  error.requestError.status == 402 ||
                  error.requestError.status == 403
                ) {
                  Swal.fire({
                    text: Array.isArray(error.data.requestError)
                      ? error.data.requestError.join("<br/>")
                      : error.data.requestError,
                    allowOutsideClick: false,
                    icon: "error",
                    willClose: () => {
                      location.reload();
                    },
                  });
                }
              }
            );
          }
        });
      }
    };

    function init() {
      const body = { username: username };
      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.users_profile_search;
      vm.GetUserDetails(url, body);

      const url1 =
        rootvm.config.API_URL + rootvm.config.EndPoints.SearchRoleGroup;
      const body1 = { name: "" };
      vm.GetRoleGroupList(url1, body1);
    }

    init();
  };
  UserDetailsController.$inject = [
    "$scope",
    "$rootScope",
    "$routeParams",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("UserDetailsController", UserDetailsController);
  //#endregion UserDetailsController

  //-------------------- Master ----------------------------

  //#region CustomerMasterController

  const CustomerMasterController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.GetCustomerList = function (url, body) {
      vm.isLoading = true;
      vm.Customerlabel = "Add Customer Details";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.CustomerList = [];
      vm.model = vm.model || {};
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.CustomerList = response.data;
              for (i = 0; i < vm.CustomerList.length; i++) {
                if (vm.CustomerList[i].buyCon == "B")
                  vm.CustomerList[i].buyConDesc = "Billing";
                else if (vm.CustomerList[i].buyCon == "C")
                  vm.CustomerList[i].buyConDesc = "Consignee";
                else vm.CustomerList[i].buyConDesc = "Both";
              }
              vm.isLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.create = function (mode1) {
      if (!vm.model) {
        vm.model = {};

        var BuyerCode = (vm.model.BuyerCode = "");
        var Name = (vm.model.Name = "");
        var AddressLine1 = (vm.model.AddressLine1 = "");
        var AddressLine2 = (vm.model.AddressLine2 = "");
        var City = (vm.model.City = "");
        var Country = (vm.model.Country = "");
        var ZipCode = (vm.model.ZipCode = "");
        var TelephoneNo = (vm.model.TelephoneNo = "");
        var FaxNo = (vm.model.FaxNo = "");
        var Lc = (vm.model.Lc = "");
        var Cdestin = (vm.model.Cdestin = "");
        var Fdestin = (vm.model.Fdestin = "");
        var DisPort = (vm.model.DisPort = "");
        var Selected = (vm.model.Selected = "");
        var ContactPerson = (vm.model.ContactPerson = "");
        var BeName = (vm.model.BeName = "");
        var BeAddress1 = (vm.model.BeAddress1 = "");
        var BeAddress2 = (vm.model.BeAddress2 = "");
        var BeAddress3 = (vm.model.BeAddress3 = "");
        var BankName = (vm.model.BankName = "");
        var BankTel = (vm.model.BankTel = "");
        var BankFax = (vm.model.BankFax = "");
        var BankAddress1 = (vm.model.BankAddress1 = "");
        var BankAddress2 = (vm.model.BankAddress2 = "");
        var BankAddress3 = (vm.model.BankAddress3 = "");
        var BankAddress4 = (vm.model.BankAddress4 = "");
        var Payment = (vm.model.Payment = "");
        var PayDay = (vm.model.PayDay = "");
        var Agent = (vm.model.Agent = "");
        var PaymentGroup = (vm.model.PaymentGroup = "");
        var BuyCon = vm.model.BuyerType;
      } else {
        var BuyerCode = vm.model.BuyerCode;
        var Name = vm.model.Name;
        var AddressLine1 = vm.model.AddressLine1;
        var AddressLine2 = vm.model.AddressLine2;
        var City = vm.model.City;
        var Country = vm.model.Country;
        var ZipCode = vm.model.ZipCode;
        var TelephoneNo = vm.model.TelephoneNo;
        var FaxNo = vm.model.FaxNo;
        var Lc = vm.model.Lc;
        var Cdestin = vm.model.Cdestin;
        var Fdestin = vm.model.Fdestin;
        var DisPort = vm.model.DisPort;
        var Selected = vm.model.Selected;
        var ContactPerson = vm.model.ContactPerson;
        var BeName = vm.model.BeName;
        var BeAddress1 = vm.model.BeAddress1;
        var BeAddress2 = vm.model.BeAddress2;
        var BeAddress3 = vm.model.BeAddress3;
        var BankName = vm.model.BankName;
        var BankTel = vm.model.BankTel;
        var BankFax = vm.model.BankFax;
        var BankAddress1 = vm.model.BankAddress1;
        var BankAddress2 = vm.model.BankAddress2;
        var BankAddress3 = vm.model.BankAddress3;
        var BankAddress4 = vm.model.BankAddress4;
        var Payment = vm.model.Payment;
        var PayDay = vm.model.PayDay;
        var Agent = vm.model.Agent;
        var PaymentGroup = vm.model.PaymentGroup;
        var BuyCon = vm.model.BuyerType;
      }

      if (BuyerCode === undefined || BuyerCode === "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Please Enter The Buyer's Code",
        });
      } else if (Name === undefined || Name === "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Please Enter The Buyer's Name",
        });
      } else {
        if (mode1 == 1) {
          var mode = "CREATE";
        } else {
          var mode = "EDIT";
        }

        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const day = String(now.getDate()).padStart(2, "0");

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        // Format as "YYYY-MM-DDTHH:MM:SS"
        const creationTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        const body = {
          code: BuyerCode,
          name: Name,
          address1: AddressLine1,
          address2: AddressLine2,
          city: City,
          country: Country,
          zip: ZipCode,
          telephone: TelephoneNo,
          fax: FaxNo,
          bankingName: BankName,
          bankingAddress1: BankAddress1,
          bankingAddress2: BankAddress2,
          bankingAddress3: BankAddress3,
          bankingAddress4: BankAddress4,
          bankingTelephone: BankTel,
          bankingFax: BankFax,
          contactPerson: ContactPerson,
          disPort: DisPort,
          cDestination: Cdestin,
          fDestination: Fdestin,
          payment: Payment,
          payDay: PayDay,
          lc: Lc,
          selected: Selected,
          agent: Agent,
          beName: BeName,
          beAddress: BeAddress1,
          beAddress2: BeAddress2,
          beAddress3: BeAddress3,
          paymentGroup: PaymentGroup,
          buyCon: BuyCon,
          creationTime: creationTime,
          mode: mode,
        };

        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.CreateCustomer;

        vm.CreateCustomer(url, body);
      }
    };

    vm.CreateCustomer = function (url, body) {
      $("#add_edit_customer").modal("hide");
      vm.ConsigneeMasterList = [];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "success",
              text: response.data.description,
            }).then(function () {
              window.location.reload();
            });

            vm.ConsigneeMasterList = response.data;
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.get_customer_details = function (code) {
      vm.Customerlabel = "Edit Customer Details";
      vm.add_btn = "UPDATE";
      vm.mode = 2;
      $("#reset_btn").css("display", "none");
      $("#BuyerCode").attr("readonly", true);
      $("#BuyerCode").css({ "background-color": "#ebebeb" });

      const url1 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
      const body1 = {
        code: code,
      };

      vm.customer_details = [];
      vm.model = vm.model || {};

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.customer_details = response.data;
              if (
                Array.isArray(vm.customer_details) &&
                vm.customer_details.length > 0
              ) {
                // Set the code based on the API response
                vm.model.BuyerCode = vm.customer_details[0].code;
                vm.model.Name = vm.customer_details[0].name;
                vm.model.AddressLine1 = vm.customer_details[0].address1;
                vm.model.AddressLine2 = vm.customer_details[0].address2;
                vm.model.City = vm.customer_details[0].city;
                vm.model.Country = vm.customer_details[0].country;
                vm.model.ZipCode = vm.customer_details[0].zip;
                vm.model.TelephoneNo = vm.customer_details[0].telephone;
                vm.model.FaxNo = vm.customer_details[0].fax;
                vm.model.Lc = vm.customer_details[0].lc;
                vm.model.Cdestin = vm.customer_details[0].cDestination;
                vm.model.Fdestin = vm.customer_details[0].fDestination;
                vm.model.DisPort = vm.customer_details[0].disPort;
                vm.model.Selected = vm.customer_details[0].selected;
                vm.model.ContactPerson = vm.customer_details[0].contactPerson;
                vm.model.BeName = vm.customer_details[0].beName;
                vm.model.BeAddress1 = vm.customer_details[0].beAddress;
                vm.model.BeAddress2 = vm.customer_details[0].beAddress2;
                vm.model.BeAddress3 = vm.customer_details[0].beAddress3;
                vm.model.BankName = vm.customer_details[0].bankingName;
                vm.model.BankTel = vm.customer_details[0].bankingTelephone;
                vm.model.BankFax = vm.customer_details[0].bankingFax;
                vm.model.BankAddress1 = vm.customer_details[0].bankingAddress1;
                vm.model.BankAddress2 = vm.customer_details[0].bankingAddress2;
                vm.model.BankAddress3 = vm.customer_details[0].bankingAddress3;
                vm.model.BankAddress4 = vm.customer_details[0].bankingAddress4;
                vm.model.Payment = vm.customer_details[0].payment;
                vm.model.PayDay = vm.customer_details[0].payDay;
                vm.model.Agent = vm.customer_details[0].agent;
                vm.model.PaymentGroup = vm.customer_details[0].paymentGroup;

                if (
                  vm.customer_details[0].buyCon === "" ||
                  vm.customer_details[0].buyCon === undefined
                ) {
                  vm.model.BuyerType = "O";
                } else {
                  vm.model.BuyerType = vm.customer_details[0].buyCon;
                }
              } else {
                // Fallback value if customer_details is empty
                vm.model.Ucode = "";
                vm.model.Uname = "";
              }
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.reset = function () {
      vm.Customerlabel = "Add Customer Details";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.model = {};
      vm.model.BuyerType = "O";
      $("#BuyerCode").attr("readonly", false);
      $("#BuyerCode").css({ "background-color": "#ffffff" });
      $("#reset_btn").css("display", "inline-block");
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      vm.list = !!roles.find((role) => role === "PARTY_SEARCH");
      vm.add = !!roles.find((role) => role === "PARTY_SAVE");

      if (vm.list === true) {
        const url = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
        const body = {};

        vm.GetCustomerList(url, body);
      }

      //AppService.isTokenExpired()
    };

    init();
  };
  CustomerMasterController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("CustomerMasterController", CustomerMasterController);

  //#endregion CustomerMasterController

  //#region ClearingAgentController

  const ClearingAgentMasterController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.GetClearingAgent = function (url, body) {
      vm.isLoading = true;
      vm.ClearingAgentlabel = "Add Clearing Agent Details";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.ClearingAgentList = [];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.ClearingAgentList = response.data;
              vm.isLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.create = function (mode1) {
      if (!vm.model) {
        vm.model = {};

        var code = (vm.model.code = "");
        var name = (vm.model.name = "");
        var licenceno = (vm.model.licenceno = "");
        var addressline1 = (vm.model.addressline1 = "");
        var addressline2 = (vm.model.addressline2 = "");
        var city = (vm.model.city = "");
        var pin = (vm.model.pin = "");
      } else {
        var code = vm.model.code;
        var name = vm.model.name;
        var licenceno = vm.model.licenceno;
        var addressline1 = vm.model.addressline1;
        var addressline2 = vm.model.addressline2;
        var city = vm.model.city;
        var pin = vm.model.pin;
      }

      if (code === undefined || code === "") {
        Swal.fire({ allowOutsideClick: false, title: "Please Enter The Code" });
      } else if (name === undefined || name === "") {
        Swal.fire({ allowOutsideClick: false, title: "Name is required" });
      } else {
        if (mode1 == 1) {
          const body = {
            code: code.toUpperCase(),
            name: name,
            licenceno: licenceno,
            add1: addressline1,
            add2: addressline2,
            city: city,
            pin: pin,
            mode: "CREATE",
          };

          const url =
            rootvm.config.API_URL + rootvm.config.EndPoints.CreateClearingAgent;
          vm.ClearingAgentCreate(url, body);
        } else if (mode1 == 2) {
          const body = {
            code: code.toUpperCase(),
            name: name,
            licenceno: licenceno,
            add1: addressline1,
            add2: addressline2,
            city: city,
            pin: pin,
            mode: "EDIT",
          };

          const url =
            rootvm.config.API_URL + rootvm.config.EndPoints.CreateClearingAgent;
          vm.ClearingAgentCreate(url, body);
        }
      }
    };

    vm.ClearingAgentCreate = function (url, body) {
      $("#add_edit_clearing_agent").modal("hide");
      //vm.DestinationMasterList=[];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "success",
              text: response.data.description,
            }).then(function () {
              window.location.reload();
            });

            vm.DestinationMasterList = response.data;
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.get_clearing_agent_details = function (code) {
      vm.ClearingAgentlabel = "Edit Clearing Agent Details";
      vm.add_btn = "UPDATE";
      vm.mode = 2;
      $("#reset_btn").css("display", "none");
      $("#code").attr("readonly", true);
      $("#code").css({ "background-color": "#ebebeb" });

      const url1 =
        rootvm.config.API_URL + rootvm.config.EndPoints.ClearingAgentSearch;
      const body1 = {
        code: code,
      };

      vm.clearing_agent_details = [];
      vm.model = vm.model || {};

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.clearing_agent_details = response.data;
              if (
                Array.isArray(vm.clearing_agent_details) &&
                vm.clearing_agent_details.length > 0
              ) {
                // Set the code based on the API response
                vm.model.code = vm.clearing_agent_details[0].code;
                vm.model.name = vm.clearing_agent_details[0].name;
                vm.model.licenceno = vm.clearing_agent_details[0].licenceno;
                vm.model.addressline1 = vm.clearing_agent_details[0].add1;
                vm.model.addressline2 = vm.clearing_agent_details[0].add2;
                vm.model.city = vm.clearing_agent_details[0].city;
                vm.model.pin = vm.clearing_agent_details[0].pin;
              } else {
                vm.model.code = "";
                vm.model.name = "";
                vm.model.licenceno = "";
                vm.model.addressline1 = "";
                vm.model.addressline2 = "";
                vm.model.city = "";
                vm.model.pin = "";
              }
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.reset = function () {
      vm.ClearingAgentlabel = "Add Clearing Agent Details";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.model = {};
      $("#code").attr("readonly", false);
      $("#code").css({ "background-color": "#ffffff" });
      $("#reset_btn").css("display", "inline-block");

      vm.model = {};
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      vm.list = !!roles.find((role) => role === "CLEARING_AGENT_SEARCH");
      vm.add = !!roles.find((role) => role === "CLEARING_AGENT_SAVE");

      if (vm.list === true) {
        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.ClearingAgentSearch;
        const body = {};

        vm.GetClearingAgent(url, body);
      }
      //AppService.isTokenExpired()
    };

    init();
  };
  ClearingAgentMasterController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("ClearingAgentMasterController", ClearingAgentMasterController);

  //#endregion ClearingAgentController

  //#region TransporterMasterController

  const TransporterMasterController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.GetTransporter = function (url, body) {
      vm.isLoading = true;
      vm.Transporterlabel = "Add Transporter Details";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.TransporterList = [];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.TransporterList = response.data;
              vm.isLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.create = function (mode1) {
      if (!vm.model) {
        vm.model = {};

        var code = (vm.model.code = "");
        var name = (vm.model.name = "");
        var licenceno = (vm.model.licenceno = "");
        var addressline1 = (vm.model.addressline1 = "");
        var addressline2 = (vm.model.addressline2 = "");
        var city = (vm.model.city = "");
        var pin = (vm.model.pin = "");
      } else {
        var code = vm.model.code;
        var name = vm.model.name;
        var licenceno = vm.model.licenceno;
        var addressline1 = vm.model.addressline1;
        var addressline2 = vm.model.addressline2;
        var city = vm.model.city;
        var pin = vm.model.pin;
      }

      if (code === undefined || code === "") {
        Swal.fire({ allowOutsideClick: false, title: "Please Enter The Code" });
      } else if (name === undefined || name === "") {
        Swal.fire({ allowOutsideClick: false, title: "Name is required" });
      } else {
        if (mode1 == 1) {
          const body = {
            code: code.toUpperCase(),
            name: name,
            licenceno: licenceno,
            add1: addressline1,
            add2: addressline2,
            city: city,
            pin: pin,
            mode: "CREATE",
          };

          const url =
            rootvm.config.API_URL + rootvm.config.EndPoints.CreateTransporter;
          vm.TransporterCreate(url, body);
        } else if (mode1 == 2) {
          const body = {
            code: code.toUpperCase(),
            name: name,
            licenceno: licenceno,
            add1: addressline1,
            add2: addressline2,
            city: city,
            pin: pin,
            mode: "EDIT",
          };

          const url =
            rootvm.config.API_URL + rootvm.config.EndPoints.CreateTransporter;
          vm.TransporterCreate(url, body);
        }
      }
    };

    vm.TransporterCreate = function (url, body) {
      $("#add_edit_transporter").modal("hide");
      //vm.DestinationMasterList=[];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "success",
              text: response.data.description,
            }).then(function () {
              window.location.reload();
            });

            vm.TransporterList = response.data;
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.get_transporter_details = function (code) {
      vm.Transporterlabel = "Edit Transporter Details";
      vm.add_btn = "UPDATE";
      vm.mode = 2;
      $("#reset_btn").css("display", "none");
      $("#code").attr("readonly", true);
      $("#code").css({ "background-color": "#ebebeb" });

      const url1 =
        rootvm.config.API_URL + rootvm.config.EndPoints.TransporterSearch;
      const body1 = {
        code: code,
      };

      vm.transporter_details = [];
      vm.model = vm.model || {};

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.transporter_details = response.data;
              if (
                Array.isArray(vm.transporter_details) &&
                vm.transporter_details.length > 0
              ) {
                // Set the code based on the API response
                vm.model.code = vm.transporter_details[0].code;
                vm.model.name = vm.transporter_details[0].name;
                vm.model.licenceno = vm.transporter_details[0].licenceno;
                vm.model.addressline1 = vm.transporter_details[0].add1;
                vm.model.addressline2 = vm.transporter_details[0].add2;
                vm.model.city = vm.transporter_details[0].city;
                vm.model.pin = vm.transporter_details[0].pin;
              } else {
                vm.model.code = "";
                vm.model.name = "";
                vm.model.licenceno = "";
                vm.model.addressline1 = "";
                vm.model.addressline2 = "";
                vm.model.city = "";
                vm.model.pin = "";
              }
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.reset = function () {
      vm.Transporterlabel = "Add Transporter Details";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.model = {};
      $("#code").attr("readonly", false);
      $("#code").css({ "background-color": "#ffffff" });
      $("#reset_btn").css("display", "inline-block");
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      vm.list = !!roles.find((role) => role === "TRANSPORTER_SEARCH");
      vm.add = !!roles.find((role) => role === "TRANSPORTER_SAVE");

      if (vm.list === true) {
        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.TransporterSearch;
        const body = {};

        vm.GetTransporter(url, body);
      }

      //AppService.isTokenExpired()
    };

    init();
  };
  TransporterMasterController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("TransporterMasterController", TransporterMasterController);

  //#endregion TransporterMasterController

  //#region RateMasterController

  const RateMasterController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.getDate = function (partyCode) {
      vm.isLoading = false;
      vm.norRsultFound = "";
      vm.RateItemList = [];

      const url4 =
        rootvm.config.API_URL + rootvm.config.EndPoints.RateDateSearch;
      const body4 = { PartyCode: partyCode };

      vm.RateDateList = [];
      AppService.post(url4, body4).then(
        function (response) {
          if (response && response.data) {
            vm.RateDateList = response.data;
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.getRateItem = function () {
      var partycode = $("#partyCode").val();
      var RateDate = $("#RateDate").val();

      if (partycode == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Select Party",
        });
        return false;
      } else if (RateDate == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Select Date",
        });
        return false;
      } else {
        vm.isLoading = true;
        vm.norRsultFound = "";

        var date = new Date(RateDate);
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();

        vm.RateItemList = [];

        const url4 =
          rootvm.config.API_URL + rootvm.config.EndPoints.RateItemSearch;
        const body4 = {
          PartyCode: partycode,
          Date: year + "-" + month + "-" + day,
        };

        AppService.post(url4, body4).then(
          function (response) {
            if (response && response.data) {
              if (response.data.length > 0) {
                vm.RateItemList = response.data;
                vm.isLoading = false;
                vm.norRsultFound = "";
              } else {
                vm.norRsultFound = "No Record Found";
              }
            }
          },
          function (error) {
            vm.isLoading = false;
            vm.norRsultFound = "";

            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      }
    };

    vm.exportToExcel = function () {
      vm.tableData = [];

      for (let i = 0; i < vm.RateItemList.length; i++) {
        vm.tableData.push({
          Name: vm.RateItemList[i].productName,
          ISCode: vm.RateItemList[i].size,
          Rate: vm.RateItemList[i].rate,
          Unit: vm.RateItemList[i].unit,
          "Part No": vm.RateItemList[i].partNo,
          "Release Inv Rate Date": vm.RateItemList[i].releaseInvRateDate,
          "Conf. Date": vm.RateItemList[i].confDate,
          Prefix: vm.RateItemList[i].prefix,
          Suffix: vm.RateItemList[i].suffix,
          "Ref. Party": vm.RateItemList[i].refParty,
          "Original Rate": vm.RateItemList[i].originalRate,
          Deduction: vm.RateItemList[i].deduction,
          "Creation Date Time": vm.RateItemList[i].creationDateTime,
        });
      }

      const ws = XLSX.utils.json_to_sheet(vm.tableData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      XLSX.writeFile(wb, "table_data.xlsx");
    };

    vm.printRateItem = function () {
      Swal.fire({
        //title: 'Are you sure?',
        text: "Do You Really Want to Print These Records?",
        icon: "warning",
        allowOutsideClick: false,
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, print it!",
      }).then((result) => {
        if (result.isConfirmed) {
          $("#partyName").html("");
          $("#print_modal").modal("show");
          var party = $("#partyCode").val();
          $("#partyName").html(party);
        }
      });
    };

    vm.printRateList = function () {
      // Get the printable content
      var printContents = document.getElementById("printRateContent").innerHTML;

      // Open a new window for printing
      var popupWin = window.open("", "_blank", "width=800,height=600");

      popupWin.document.open();
      popupWin.document.write(`
            <html>
                <head>
                    <title>Print Page</title>
                    <style>
                        @media print {
                            @page { size: portrait; }
                            body { font-family: Arial, sans-serif; margin: 20px; }
                        }
                    </style>
                </head>
                <body onload="window.print();window.close()">
                    ${printContents}
                </body>
            </html>
        `);
      popupWin.document.close();
    };

    vm.GetCustomerDetails = function (url4, body4) {
      vm.CustomerList = [];
      AppService.post(url4, body4).then(
        function (response) {
          if (response && response.data) {
            vm.CustomerList = response.data;
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      vm.list = !!roles.find((role) => role === "RATE_SEARCH");
      //vm.add = !!roles.find(role => role === "PARTY_SAVE");

      console.log(vm.list);
      if (vm.list === true) {
        vm.isLoading = false;
        vm.norRsultFound = "";

        const url4 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
        const body4 = {};

        vm.GetCustomerDetails(url4, body4);
      }
    };

    init();
  };
  RateMasterController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("RateMasterController", RateMasterController);

  //#endregion TransporterMasterController

  //#region ProductMasterController

  const ProductMasterController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.GetProduct = function (url, body) {
      vm.ProductMasterList = [];
      vm.isLoading = true;
      AppService.post(url, body).then(
        function (response) {
          //console.log(vm.isLoading);
          if (response && response.data.products) {
            vm.ProductMasterList = response.data.products;
            vm.isLoading = false;
          }
        },
        function (error) {
          Swal.fire({
            allowOutsideClick: false,
            icon: "error",
            title: "",
          });
        }
      );
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      vm.list = !!roles.find((role) => role === "PRODUCT_SEARCH");
      vm.add = !!roles.find((role) => role === "PRODUCT_SAVE");

      if (vm.list === true) {
        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.ProductSearch;
        const body = {
          offset: 0,
          count: 100000,
        };

        vm.GetProduct(url, body);
      }
      //AppService.isTokenExpired()
    };

    init();
  };
  ProductMasterController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("ProductMasterController", ProductMasterController);

  //#endregion ProductMasterController

  //#region PartyReferenceController

  const PartyReferenceController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.GetPartyReference = function (url, body) {
      vm.isLoading = true;
      vm.PartyReferencelabel = "Add Party Reference";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.PartyReferenceMasterList = [];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.PartyReferenceMasterList = response.data;
              vm.isLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.create = function (mode1) {
      if (!vm.model) {
        vm.model = {};

        var code = (vm.model.code = "");
        var partyreference = (vm.model.partyreference = "");
        var name = (vm.model.name = "");
        var group = (vm.model.group = "");
        var harmonised = (vm.model.harmonised = "");
        var tariffnous = (vm.model.tariffnous = "");
        var tariffnoind = (vm.model.tariffnoind = "");
      } else {
        var code = vm.model.code;
        var partyreference = vm.model.partyreference;
        var name = vm.model.name;
        var group = vm.model.group;
        var harmonised = vm.model.harmonised;
        var tariffnous = vm.model.tariffnous;
        var tariffnoind = vm.model.tariffnoind;
      }

      if (code === undefined || code === "") {
        Swal.fire({ allowOutsideClick: false, title: "Please Enter The Code" });
      } else if (partyreference === undefined || partyreference === "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Party Reference is required",
        });
      } else if (name === undefined || name === "") {
        Swal.fire({ allowOutsideClick: false, title: "Name is required" });
      } else {
        if (mode1 == 1) {
          const body = {
            iCode: code.toUpperCase(),
            partyRef: partyreference,
            name: name,
            groupCode: group,
            harmonisedText: harmonised,
            tariffNoUS: tariffnous,
            tariffNoInd: tariffnoind,
            mode: "CREATE",
          };

          const url =
            rootvm.config.API_URL +
            rootvm.config.EndPoints.CreatePartyReference;
          vm.PartyreRerenceCreate(url, body);
        } else if (mode1 == 2) {
          const body = {
            iCode: code.toUpperCase(),
            partyRef: partyreference,
            name: name,
            groupCode: group,
            harmonisedText: harmonised,
            tariffNoUS: tariffnous,
            tariffNoInd: tariffnoind,
            mode: "EDIT",
          };

          const url =
            rootvm.config.API_URL +
            rootvm.config.EndPoints.CreatePartyReference;
          vm.PartyreRerenceCreate(url, body);
        }
      }
    };

    vm.PartyreRerenceCreate = function (url, body) {
      $("#add_edit_party_reference").modal("hide");
      //vm.DestinationMasterList=[];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "success",
              text: response.data.description,
            }).then(function () {
              window.location.reload();
            });

            vm.DestinationMasterList = response.data;
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.get_party_reference_details = function (code, partyRef, name) {
      vm.PartyReferencelabel = "Edit Party Reference";
      vm.add_btn = "UPDATE";
      vm.mode = 2;
      $("#reset_btn").css("display", "none");
      $("#code, #partyreference, #name").attr("readonly", true);
      $("#code, #partyreference, #name").css({ "background-color": "#ebebeb" });

      const url1 =
        rootvm.config.API_URL + rootvm.config.EndPoints.PartyReferenceSearch;
      const body1 = {
        iCode: code,
        partyRef: partyRef,
        name: name,
      };

      vm.party_reference_details = [];
      vm.model = vm.model || {};

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.party_reference_details = response.data;
              if (
                Array.isArray(vm.party_reference_details) &&
                vm.party_reference_details.length > 0
              ) {
                // Set the code based on the API response
                vm.model.code = vm.party_reference_details[0].iCode;
                vm.model.partyreference =
                  vm.party_reference_details[0].partyRef;
                vm.model.name = vm.party_reference_details[0].name;
                vm.model.group = vm.party_reference_details[0].groupCode;
                vm.model.harmonised =
                  vm.party_reference_details[0].harmonisedText;
                vm.model.tariffnous = vm.party_reference_details[0].tariffNoUS;
                vm.model.tariffnoind =
                  vm.party_reference_details[0].tariffNoInd;
              } else {
                vm.model.code = "";
                vm.model.partyreference = "";
                vm.model.name = "";
                vm.model.group = "";
                vm.model.harmonised = "";
                vm.model.tariffnous = "";
                vm.model.tariffnoind = "";
              }
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.reset = function () {
      vm.PartyReferencelabel = "Add Party Reference";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.model = {};
      $("#reset_btn").css("display", "inline-block");
      $("#code, #partyreference, #name").attr("readonly", false);
      $("#code, #partyreference, #name").css({ "background-color": "#ffffff" });
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      vm.list = !!roles.find((role) => role === "PARTY_REFERANCE_SEARCH");
      vm.add = !!roles.find((role) => role === "PARTY_REFERANCE_SAVE");

      if (vm.list === true) {
        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.PartyReferenceSearch;
        const body = {};

        vm.GetPartyReference(url, body);
      }
      //AppService.isTokenExpired()
    };

    init();
  };
  PartyReferenceController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("PartyReferenceController", PartyReferenceController);

  //#endregion PartyReferenceController

  //#region ConsigneeMasterController

  const ConsigneeMasterController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.GetDataLookup = function (url2, body2) {
      vm.isLoading = true;
      vm.datalookup = [];
      AppService.post(url2, body2).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.datalookup = response.data;
              vm.isLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.GetConsigneeList = function (url, body) {
      vm.Consigneelabel = "Add Warehouse Consignee Details";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.ConsigneeMasterList = [];
      vm.isLoading = true;
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.ConsigneeMasterList = response.data;

              for (j = 0; j < vm.ConsigneeMasterList.length; j++) {
                if (vm.ConsigneeMasterList[j].rTag == "R")
                  vm.ConsigneeMasterList[j].rTagDesc = "R (Release Bill)";
                else if (vm.ConsigneeMasterList[j].rTag == "D")
                  vm.ConsigneeMasterList[j].rTagDesc = "D (Direct Bill)";
                else if (vm.ConsigneeMasterList[j].rTag == undefined)
                  vm.ConsigneeMasterList[j].rTagDesc = "";

                if (
                  vm.ConsigneeMasterList[j] &&
                  vm.ConsigneeMasterList[j].email !== undefined
                ) {
                  var emailList = vm.ConsigneeMasterList[j].email;
                  vm.ConsigneeMasterList[j].email = emailList.replace(
                    /,/g,
                    ", "
                  );
                } else {
                  vm.ConsigneeMasterList[j] = vm.ConsigneeMasterList[j] || {};
                  vm.ConsigneeMasterList[j].email = ""; // Initialize with an empty string
                }

                var parties = vm.ConsigneeMasterList[j].party;
                var partyCodes = parties
                  .map((party) => party.partyCode)
                  .join(", ");

                vm.ConsigneeMasterList[j].partycode = partyCodes;
              }
              vm.isLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.add = function () {
      const url2 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
      const body2 = {};
      vm.GetDataLookup(url2, body2);

      vm.model = {};

      vm.Consigneelabel = "Add Warehouse Consignee Details";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      $("#reset_btn").css("display", "inline-block");
      $("#ConsigneeEmail").tagsinput("removeAll");
      $("#ConsigneeCode").attr("readonly", false);
      $("#ConsigneeCode").css({ "background-color": "transparent" });
    };

    vm.create = function (mode1) {
      if (!vm.model) {
        vm.model = {};

        vm.model.ConsigneeCode = "";
        vm.model.ConsigneeName = "";
        vm.model.ConsigneeEmail = "";
        vm.model.BCode = "";
        vm.model.RTag = "";
        vm.model.ConsigneeAddress1 = "";
        vm.model.ConsigneeAddress2 = "";
        vm.model.ConsigneeAddress3 = "";
        vm.model.ConsigneeAddress4 = "";
        vm.model.ConsigneeAddress5 = "";
        vm.model.ConsigneeAddress6 = "";
        vm.model.ConsigneeAttn = "";
        vm.model.ConsigneeAuthorization = "";
        vm.model.ConsigneeTrucking = "";
      }

      var ConsigneeCode = vm.model.ConsigneeCode || "";
      var ConsigneeName = vm.model.ConsigneeName || "";
      var ConsigneeEmail = vm.model.ConsigneeEmail || "";
      var BCode = vm.model.BCode || "";
      var RTag = vm.model.RTag || "";
      var ConsigneeAddress1 = vm.model.ConsigneeAddress1 || "";
      var ConsigneeAddress2 = vm.model.ConsigneeAddress2 || "";
      var ConsigneeAddress3 = vm.model.ConsigneeAddress3 || "";
      var ConsigneeAddress4 = vm.model.ConsigneeAddress4 || "";
      var ConsigneeAddress5 = vm.model.ConsigneeAddress5 || "";
      var ConsigneeAddress6 = vm.model.ConsigneeAddress6 || "";
      var ConsigneeAttn = vm.model.ConsigneeAttn || "";
      var ConsigneeAuthorization = vm.model.ConsigneeAuthorization || "";
      var ConsigneeTrucking = vm.model.ConsigneeTrucking || "";

      if (ConsigneeCode == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Please Enter The Consignee Code",
        });
      } else if (ConsigneeName == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Please Enter The Consignee Name",
        });
      } else if (ConsigneeAddress1 == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Please Enter The Address 1",
        });
      } else {
        if ($("#ConsigneeEmail").val() != "") {
          var emailInput = document.getElementById("ConsigneeEmail");
          if (emailInput != "") {
            var errorMessage = document.getElementById("emailError");
            var emailPattern =
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            var emails = emailInput.value
              .split(",")
              .map((email) => email.trim());

            var invalidEmails = emails.filter(
              (email) => email && !emailPattern.test(email)
            );

            if (invalidEmails.length > 0) {
              Swal.fire({
                text: `Invalid email(s): ${invalidEmails.join(", ")}`,
                allowOutsideClick: false,
                icon: "error",
              });
              return false;
            }
          }
        } else {
          Swal.fire({ allowOutsideClick: false, title: "Enter email address" });
          return false;
        }

        if ($("#partySelect").val() == "") {
          Swal.fire({ allowOutsideClick: false, title: "Select Party" });
          return false;
        }

        if (mode1 == 1) {
          var mode = "CREATE";
        } else {
          var mode = "EDIT";
        }

        const body = {
          code: ConsigneeCode.toUpperCase(),
          name: ConsigneeName,
          email: ConsigneeEmail,
          addressLine1: ConsigneeAddress1,
          addressLine2: ConsigneeAddress2,
          addressLine3: ConsigneeAddress3,
          addressLink4: ConsigneeAddress4,
          addressLine5: ConsigneeAddress5,
          addressLine6: ConsigneeAddress6,
          attn: ConsigneeAttn,
          trucking: ConsigneeTrucking,
          author: ConsigneeAuthorization,
          rTag: RTag,
          bCode: BCode,
          mode: mode,
        };

        var partycode = document.getElementById("partySelect");
        var selectedValues = [];
        for (var i = 0; i < partycode.options.length; i++) {
          if (partycode.options[i].selected) {
            selectedValues.push(partycode.options[i].value);
          }
        }

        body.parties = [];
        for (var i = 0; i < selectedValues.length; i++) {
          body.parties.push({
            code: selectedValues[i],
          });
        }

        //console.log(body);
        //return false;

        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.CreateConsignee;
        vm.CreateConsignee(url, body);
      }
    };

    vm.CreateConsignee = function (url, body) {
      $("#add_edit_warehouse_consignee").modal("hide");

      vm.ConsigneeMasterList = [];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "success",
              text: response.data.description,
            }).then(function () {
              window.location.reload();
            });

            vm.ConsigneeMasterList = response.data;
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.get_warehouse_consignee_details = function (code) {
      const url2 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
      const body2 = {};
      vm.GetDataLookup(url2, body2);

      vm.Consigneelabel = "Edit Warehouse Consignee Details";
      vm.add_btn = "UPDATE";
      vm.mode = 2;
      $("#reset_btn").css("display", "none");
      $("#ConsigneeCode").attr("readonly", true);
      $("#ConsigneeCode").css({ "background-color": "#ebebeb" });

      const url1 =
        rootvm.config.API_URL + rootvm.config.EndPoints.ConsigneeCode;
      const body1 = {
        code: code,
      };

      vm.warehouse_consignee_details = [];
      vm.model.ConsigneeEmail = [];
      vm.model = vm.model || {};

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.warehouse_consignee_details = response.data;
              if (vm.warehouse_consignee_details.length > 0) {
                //vm.warehouse_consignee_details[0].shipto=[];

                vm.model.ConsigneeCode = vm.warehouse_consignee_details[0].code;
                vm.model.ConsigneeName = vm.warehouse_consignee_details[0].name;

                if (vm.warehouse_consignee_details[0].email) {
                  var emails = vm.warehouse_consignee_details[0].email
                    .split(",")
                    .map((email) => email.trim());
                  vm.model.ConsigneeEmail = emails.join(",");

                  $("#ConsigneeEmail").tagsinput("removeAll");
                  vm.model.ConsigneeEmail.split(",").forEach((email) => {
                    $("#ConsigneeEmail").tagsinput("add", email);
                  });
                } else {
                  vm.model.ConsigneeEmail = [];
                }

                vm.model.BCode = vm.warehouse_consignee_details[0].bCode;
                vm.model.RTag = vm.warehouse_consignee_details[0].rTag;
                vm.model.ConsigneeAddress1 =
                  vm.warehouse_consignee_details[0].addressLine1;
                vm.model.ConsigneeAddress2 =
                  vm.warehouse_consignee_details[0].addressLine2;
                vm.model.ConsigneeAddress3 =
                  vm.warehouse_consignee_details[0].addressLine3;
                vm.model.ConsigneeAddress4 =
                  vm.warehouse_consignee_details[0].addressLink4;
                vm.model.ConsigneeAddress5 =
                  vm.warehouse_consignee_details[0].addressLine5;
                vm.model.ConsigneeAddress6 =
                  vm.warehouse_consignee_details[0].addressLine6;
                vm.model.ConsigneeAttn = vm.warehouse_consignee_details[0].attn;
                vm.model.ConsigneeAuthorization =
                  vm.warehouse_consignee_details[0].author;
                vm.model.ConsigneeTrucking =
                  vm.warehouse_consignee_details[0].trucking;

                $("#partySelect").trigger("change");
                $("#partySelect").focus();
                vm.warehouse_consignee_details[0].shipto =
                  vm.warehouse_consignee_details[0].party;

                vm.isSelected = function (code) {
                  return vm.warehouse_consignee_details[0].shipto.some(
                    (item) => item.partyCode === code
                  );
                };
              } else {
                vm.model.ConsigneeCode = "";
                vm.model.ConsigneeName = "";
                vm.model.ConsigneeEmail = "";
                vm.model.BCode = "";
                vm.model.RTag = "";
                vm.model.ConsigneeAddress1 = "";
                vm.model.ConsigneeAddress2 = "";
                vm.model.ConsigneeAddress3 = "";
                vm.model.ConsigneeAddress4 = "";
                vm.model.ConsigneeAddress5 = "";
                vm.model.ConsigneeAddress6 = "";
                vm.model.ConsigneeAttn = "";
                vm.model.ConsigneeAuthorization = "";
                vm.model.ConsigneeTrucking = "";
              }
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.reset = function () {
      $("#ConsigneeCode").attr("readonly", false);
      $("#ConsigneeCode").css({ "background-color": "transparent" });

      vm.model = {};
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      vm.list = !!roles.find((role) => role === "WAREHOUSE_SEARCH");
      vm.add = !!roles.find((role) => role === "WAREHOUSE_SAVE");

      if (vm.list === true) {
        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.ConsigneeCode;
        const body = {};
        vm.GetConsigneeList(url, body);
      }

      // const url2 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
      // const body2 ={};
      // vm.GetDataLookup(url2,body2);

      //AppService.isTokenExpired()

      //$("#partySelect").select2()
    };

    init();
  };
  ConsigneeMasterController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("ConsigneeMasterController", ConsigneeMasterController);

  //#endregion ConsigneeMasterController

  //#region DestinationMasterController

  const DestinationMasterController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.GetDestination = function (url, body) {
      vm.isLoading = true;
      vm.Destinationlabel = "Add Destination";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.DestinationMasterList = [];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.DestinationMasterList = response.data;
              vm.isLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.create = function (mode1) {
      if (!vm.model) {
        vm.model = {};

        var code = (vm.model.code = "");
        var name = (vm.model.name = "");
        var id = (vm.model.id = "");
      } else {
        var code = vm.model.code;
        var name = vm.model.name;
        var id = vm.model.id;
      }

      if (code === undefined || code === "") {
        Swal.fire({ allowOutsideClick: false, title: "Please Enter The Code" });
      } else if (name === undefined || name === "") {
        Swal.fire({ allowOutsideClick: false, title: "Please Enter The Name" });
      } else {
        if (mode1 == 1) {
          const body = {
            code: code.toUpperCase(),
            name: name,
            mode: "CREATE",
          };

          const url =
            rootvm.config.API_URL + rootvm.config.EndPoints.Createdestination;
          vm.CreateDestination(url, body);
        } else if (mode1 == 2) {
          const body = {
            id: id,
            code: code.toUpperCase(),
            name: name,
            mode: "EDIT",
          };

          const url =
            rootvm.config.API_URL + rootvm.config.EndPoints.Createdestination;
          vm.CreateDestination(url, body);
        }
      }
    };

    vm.CreateDestination = function (url, body) {
      //vm.DestinationMasterList=[];
      $("#add_edit_destination").modal("hide");

      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "success",
              text: response.data.description,
            }).then(function () {
              window.location.reload();
            });

            vm.DestinationMasterList = response.data;
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.get_destination_details = function (code) {
      vm.Destinationlabel = "Edit Destination";
      vm.add_btn = "UPDATE";
      vm.mode = 2;
      $("#reset_btn").css("display", "none");
      $("#txt_code").attr("readonly", true);
      $("#txt_code").css({ "background-color": "#ebebeb" });

      const url1 = rootvm.config.API_URL + rootvm.config.EndPoints.destsearch;
      const body1 = {
        code: code,
      };

      vm.destination_details = [];
      vm.model = vm.model || {};

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.destination_details = response.data;
              if (
                Array.isArray(vm.destination_details) &&
                vm.destination_details.length > 0
              ) {
                // Set the code based on the API response
                vm.model.id = vm.destination_details[0].id;
                vm.model.code = vm.destination_details[0].code;
                vm.model.name = vm.destination_details[0].name;
              } else {
                // Fallback value if customer_details is empty
                vm.model.Uid = "";
                vm.model.Ucode = "";
                vm.model.Uname = "";
              }
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.reset = function () {
      vm.Destinationlabel = "Add Destination";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.model = {};
      $("#reset_btn").css("display", "inline-block");
      $("#txt_code").attr("readonly", false);
      $("#txt_code").css({ "background-color": "#ffffff" });
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      vm.list = !!roles.find((role) => role === "DEST_SEARCH");
      vm.add = !!roles.find((role) => role === "DEST_SAVE");

      if (vm.list === true) {
        const url = rootvm.config.API_URL + rootvm.config.EndPoints.destsearch;
        const body = {};

        vm.GetDestination(url, body);
      }

      //AppService.isTokenExpired()
    };

    init();
  };
  DestinationMasterController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("DestinationMasterController", DestinationMasterController);

  //#endregion DestinationMasterController

  //#region HsCodeMasterController

  const HsCodeMasterController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.GetCustomerDetails = function (url4, body4) {
      vm.CustomerList = [];
      AppService.post(url4, body4).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.CustomerList = response.data;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.get_part_no = function () {
      var partycode = $("#partyCode").val();
      if (partycode == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Select Party Code",
        });
      } else {
        vm.hscodelist = [];
        vm.norRsultFound = "";
        vm.isLoading = true;
        const url1 =
          rootvm.config.API_URL + rootvm.config.EndPoints.HSCodeSearch;
        const body1 = {
          PartyCode: partycode,
        };

        AppService.post(url1, body1).then(
          function (response) {
            if (response.status == 200) {
              if (response && response.data.length > 0) {
                vm.hscodelist = response.data;
                vm.isLoading = false;
              } else {
                vm.norRsultFound = "No Record Found";
                vm.isLoading = false;
              }
            }
          },
          function (error) {
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      }
    };

    vm.copyhscode = function () {
      var HSCode = $("#txt_HSCode").val();
      if (vm.hscodelist.length <= 0) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Select Customer and Load",
        });
      } else if (HSCode == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter HS Code",
        });
      } else {
        for (i = 1; i <= vm.hscodelist.length; i++) {
          var checkbox = document.getElementById("chkhcode" + i); // Access the checkbox by id
          if (checkbox.checked) {
            $("#lblhscode" + i).html(HSCode);
            $("#hscode" + i).val(HSCode);
          }
        }
      }
    };

    vm.selectAll = function () {
      if ($("#ckbCheckAll").prop("checked") == true) {
        for (i = 1; i <= vm.hscodelist.length; i++) {
          $("#chkhcode" + i).prop("checked", true);
        }
      } else {
        for (i = 1; i <= vm.hscodelist.length; i++) {
          $("#chkhcode" + i).prop("checked", false);
        }
      }
    };

    vm.savehscode = function () {
      var partycode = $("#partyCode").val();
      var itemsArray = [];

      for (i = 1; i <= vm.hscodelist.length; i++) {
        var partno = $("#partNo" + i).val();
        var hscode = $("#hscode" + i).val();

        if (hscode && hscode.trim() !== "") {
          itemsArray.push({
            partNo: partno,
            hsCode1: hscode,
          });
        }
      }

      const url4 = rootvm.config.API_URL + rootvm.config.EndPoints.HSCodeSave;
      const body4 = [
        {
          partyCode: partycode,
          items: itemsArray,
        },
      ];

      //console.log(body4);

      AppService.post(url4, body4).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              text: response.data.description,
              allowOutsideClick: false,
              icon: "success",
            }).then(function () {
              window.location.reload();
            });
          }
        },
        function (error) {
          vm.isLoading = false;

          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      vm.list = !!roles.find((role) => role === "HS_CODE_SEARCH");
      vm.add = !!roles.find((role) => role === "HS_CODE_SAVE");

      if (vm.list === true) {
        vm.hscodelist = [];
        const url4 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
        const body4 = {};

        vm.GetCustomerDetails(url4, body4);
      }
    };

    init();
  };
  HsCodeMasterController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("HsCodeMasterController", HsCodeMasterController);

  //#endregion HsCodeMasterController

  //#region WarehouseController

  const WarehouseMasterController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.add = function () {
      const url2 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
      const body2 = {};
      vm.GetDataLookup(url2, body2);

      vm.model = {};

      vm.isLoading = true;
      vm.Warehouselabel = "Add Warehouse Details";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      $("#reset_btn").css("display", "inline-block");
      $("#email").tagsinput("removeAll");
      $("#partySelect").val("");
      $("#code").attr("readonly", false);
      $("#code").css({ "background-color": "transparent" });
      vm.warehouse_details[0].party = [];
    };

    vm.create = function (mode1) {
      if (!vm.model) {
        vm.model = {};

        var code = (vm.model.code = "");
        var name = (vm.model.name = "");
        var emailName = (vm.model.emailName = "");
        var email = (vm.model.email = "");
        var partycode = "";
      } else {
        var code = vm.model.code;
        var name = vm.model.name;
        var emailName = vm.model.emailName;
        var email = vm.model.email;
        var partycode = $("#partySelect").val();
      }

      if (code === undefined || code === "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter The Warehouse Code",
        });
      } else if (name === undefined || name === "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter The Warehouse Name",
        });
      } else if (emailName === undefined || emailName === "") {
        Swal.fire({ allowOutsideClick: false, title: "Enter The Email Name" });
      } else {
        if ($("#email").val() != "") {
          var emailInput = document.getElementById("email");
          if (emailInput != "") {
            var errorMessage = document.getElementById("emailError");
            var emailPattern =
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            var emails = emailInput.value
              .split(",")
              .map((email) => email.trim());

            var invalidEmails = emails.filter(
              (email) => email && !emailPattern.test(email)
            );

            if (invalidEmails.length > 0) {
              Swal.fire({
                text: `Invalid email(s): ${invalidEmails.join(", ")}`,
                allowOutsideClick: false,
                icon: "error",
              });
              return false;
            }
          }
        } else {
          Swal.fire({ allowOutsideClick: false, title: "Enter email address" });
          return false;
        }

        if (partycode === undefined || partycode === "") {
          Swal.fire({ allowOutsideClick: false, title: "Select Party" });
          return false;
        }

        if (mode1 == 1) {
          var mode = "CREATE";
        } else {
          var mode = "EDIT";
        }

        const body = {
          warehouseCode: code.toUpperCase(),
          warehouseName: name,
          emailName: emailName,
          email: email,
          mode: mode,
        };

        var partycode = document.getElementById("partySelect");
        var selectedValues = [];
        for (var i = 0; i < partycode.options.length; i++) {
          if (partycode.options[i].selected) {
            selectedValues.push(partycode.options[i].value);
          }
        }

        body.party = [];
        for (var i = 0; i < selectedValues.length; i++) {
          body.party.push({
            partyCode: selectedValues[i],
          });
        }

        //console.log(body);
        //return false;

        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.warehouseCreate;
        vm.CreateWarehouse(url, body);
      }
    };

    vm.CreateWarehouse = function (url, body) {
      $("#add_edit_warehouse").modal("hide");
      //vm.DestinationMasterList=[];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "success",
              text: response.data.description,
            }).then(function () {
              window.location.reload();
            });

            //vm.DestinationMasterList=response.data;
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.get_warehouse_details = function (code) {
      vm.warehouse_details = [];
      vm.warehouse_details[0] = [];
      vm.warehouse_details[0].party = [];
      vm.Warehouselabel = "Edit Warehouse Details";
      vm.add_btn = "UPDATE";
      vm.mode = 2;
      $("#reset_btn").css("display", "none");
      $("#code").attr("readonly", true);
      $("#code").css({ "background-color": "#ebebeb" });

      const url1 =
        rootvm.config.API_URL + rootvm.config.EndPoints.warehouseList;
      const body1 = { WarehouseCode: code };

      vm.warehouse_details = [];
      //vm.model.email = [];
      vm.model = vm.model || {};

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.model.email = [];
              vm.warehouse_details = response.data;
              if (vm.warehouse_details.length > 0) {
                //vm.warehouse_consignee_details[0].shipto=[];

                vm.model.code = vm.warehouse_details[0].warehouseCode;
                vm.model.name = vm.warehouse_details[0].warehouseName;
                vm.model.emailName = vm.warehouse_details[0].emailName;

                if (vm.warehouse_details[0].email) {
                  var emails = vm.warehouse_details[0].email
                    .split(",")
                    .map((email) => email.trim());
                  vm.model.email = emails.join(",");

                  $("#email").tagsinput("removeAll");
                  vm.model.email.split(",").forEach((email) => {
                    $("#email").tagsinput("add", email);
                  });
                } else {
                  vm.model.email = [];
                }

                //vm.warehouse_details[0].party = vm.warehouse_details[0].party;

                if (vm.warehouse_details[0].party) {
                  $("#partySelect").focus();
                  $("#partySelect").trigger("change");

                  vm.isSelected = function (code) {
                    return vm.warehouse_details[0].party.some(
                      (item) => item.partyCode === code
                    );
                  };
                }
              } else {
                vm.model.code = "";
                vm.model.name = "";
                vm.model.emailName = "";
                vm.model.email = "";
              }
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.reset = function () {
      vm.PartyReferencelabel = "Add Party Reference";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.model = {};
      $("#reset_btn").css("display", "inline-block");
      $("#code, #partyreference, #name").attr("readonly", false);
      $("#code, #partyreference, #name").css({ "background-color": "#ffffff" });
    };

    vm.GetwarehouseList = function (url, body) {
      vm.isLoading = true;
      vm.Warehouselabel = "Add Warehouse Details";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.warehouseList = [];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.warehouseList = response.data;

              for (j = 0; j < vm.warehouseList.length; j++) {
                if (
                  vm.warehouseList[j] &&
                  vm.warehouseList[j].email !== undefined
                ) {
                  var emailList = vm.warehouseList[j].email;
                  vm.warehouseList[j].email = emailList.replace(/,/g, ", ");
                } else {
                  vm.warehouseList[j] = vm.warehouseList[j] || {};
                  vm.warehouseList[j].email = "";
                }

                var parties = vm.warehouseList[j].party;
                var partyCodes = parties
                  .map((party) => party.partyCode)
                  .join(", ");

                vm.warehouseList[j].partycode = partyCodes;
              }

              vm.isLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.GetDataLookup = function (url2, body2) {
      vm.isLoading = true;
      vm.datalookup = [];
      AppService.post(url2, body2).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.datalookup = response.data;
              vm.isLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      vm.list = !!roles.find((role) => role === "PARTY_WAREHOUSE_SEARCH");
      vm.add = !!roles.find((role) => role === "PARTY_WAREHOUSE_SAVE");

      if (vm.list === true) {
        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.warehouseList;
        const body = {};
        vm.GetwarehouseList(url, body);

        const url2 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
        const body2 = {};
        vm.GetDataLookup(url2, body2);
      }

      //AppService.isTokenExpired()
    };

    init();
  };
  WarehouseMasterController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("WarehouseMasterController", WarehouseMasterController);

  //#endregion WarehouseMasterController

  //#region ErrorLogController

  const ErrorLogController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.GetErrorDetails = function () {
      var errorcode = $("#errorCode").val();

      if (errorcode == "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Enter Error Code",
        });
      } else {
        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.ErrorLogSearch;
        const body = { requestNo: errorcode };

        AppService.post(url, body).then(
          function (response) {
            if (response.status == 200) {
              if (response && response.data && response.data.length) {
                vm.ErrorLogDetails = response.data;

                const data = vm.ErrorLogDetails[0].logText;

                const textData = JSON.stringify(data, null, 2);

                const blob = new Blob([textData], { type: "text/plain" });

                const anchor = document.createElement("a");
                anchor.href = URL.createObjectURL(blob);
                anchor.download = errorcode + ".txt";

                anchor.click();

                URL.revokeObjectURL(anchor.href);
              } else {
                Swal.fire({
                  allowOutsideClick: false,
                  icon: "error",
                  title: "Error code is not found",
                });
              }
            }
          },
          function (error) {
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }

            vm.loginErrorMessage = "Data Not Found";
          }
        );
      }
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      vm.list = !!roles.find((role) => role === "ERROR_LOG");
    };

    init();
  };
  ErrorLogController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("ErrorLogController", ErrorLogController);

  //#endregion ErrorLogController

  //#region roleManagementController

  const roleManagementController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    // vm.GetRoleGroupList = function (url,body)
    // {
    //     vm.isLoading = true;
    //     // vm.Warehouselabel = "Add Warehouse Details";
    //     // vm.add_btn = "CREATE";
    //     // vm.mode=1;
    //     vm.RoleGroupList=[];
    //     AppService.post(url, body)
    //     .then(function (response)
    //     {
    //         if(response.status == 200)
    //         {
    //             if (response && response.data)
    //             {
    //                 vm.RoleGroupList=response.data;
    //                 vm.isLoading = false;
    //             }
    //         }
    //     }, function (error)
    //     {
    //         if(error.status == 500)
    //         {
    //             Swal.fire({
    //                 allowOutsideClick: false,
    //                 icon: 'error',
    //                 title: error.data,
    //             });
    //         }
    //         else if(error.status == 409)
    //         {
    //             const errorMessage = Array.isArray(error.data.requestError)
    //                 ? error.data.requestError.join('<br/>')
    //                 : error.data.requestError;

    //             Swal.fire({
    //                 allowOutsideClick: false,
    //                 icon: 'error',
    //                 title: errorMessage,
    //             });
    //         }
    //         else if (error.requestError.status==400 || error.requestError.status==401 || error.requestError.status==402 || error.requestError.status==403)
    //         {
    //             Swal.fire({
    //                 text: Array.isArray(error.data.requestError) ? error.data.requestError.join('<br/>') : error.data.requestError,
    //                 allowOutsideClick: false,
    //                 icon: "error",
    //                 willClose: () => {
    //                     location.reload();
    //                 }
    //             });
    //         }
    //     });
    // };

    vm.create = function (mode1, id) {
      if (!vm.model) {
        vm.model = {};

        var rolename = (vm.model.rolename = "");
        var roledescription = (vm.model.roledescription = "");
      } else {
        var rolename = vm.model.rolename;
        var roledescription = vm.model.roledescription;
      }

      if (rolename === undefined || rolename === "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Role  Name is Required",
        });
        return false;
      } else if (roledescription === undefined || roledescription === "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Description is required",
        });
        return false;
      } else {
        if (mode1 == 1) {
          const body = {
            //"id" : id,
            name: rolename.toUpperCase(),
            description: roledescription,
            //"mode" : "CREATE"
          };

          const url = rootvm.config.API_URL + rootvm.config.EndPoints.SaveRole;
          vm.RoleNameCreate(url, body);
        } else if (mode1 == 2) {
          const body = {
            //"id" : id,
            name: rolegroupname.toUpperCase(),
            description: rolegroupdescription,
            //"mode" : "EDIT"
          };

          const url = rootvm.config.API_URL + rootvm.config.EndPoints.SaveRole;
          vm.RoleNameCreate(url, body);
        }
      }
    };

    vm.RoleNameCreate = function (url, body) {
      $("#role-create").modal("hide");
      //vm.DestinationMasterList=[];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "success",
              text: response.data.description,
            }).then(function () {
              window.location.reload();
            });

            vm.RoleGroupList = response.data;
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.get_role_group_details = function (code) {
      vm.RoleGroupLabel = "Edit Role Group";
      vm.add_btn = "UPDATE";
      vm.mode = 2;
      $("#reset_btn").css("display", "none");
      // $("#rolegroupname").attr("readonly", true);
      // $("#rolegroupname").css({"background-color": "#ebebeb"});

      const url1 =
        rootvm.config.API_URL + rootvm.config.EndPoints.SearchRoleGroup;
      const body1 = {
        name: code,
      };

      vm.role_group_details = [];
      vm.model = vm.model || {};

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.role_group_details = response.data;
              if (
                Array.isArray(vm.role_group_details) &&
                vm.role_group_details.length > 0
              ) {
                // Set the code based on the API response
                vm.model.rolegroupname = vm.role_group_details[0].name;
                vm.model.rolegroupdescription =
                  vm.role_group_details[0].description;
                vm.id = vm.role_group_details[0].id;
              } else {
                vm.id = "00000000-0000-0000-0000-000000000000";
                vm.model.rolegroupname = "";
                vm.model.rolegroupdescription = "";
              }
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.reset = function () {
      vm.RoleGroupLabel = "Create Role Name";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.id = "00000000-0000-0000-0000-000000000000";
      vm.model = {};
      // $("#rolegroupname").attr("readonly", false);
      // $("#rolegroupname").css({"background-color": "#ffffff"});
      $("#reset_btn").css("display", "inline-block");
    };

    init = function () {
      vm.RoleGroupLabel = "Create Role Name";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.id = "00000000-0000-0000-0000-000000000000";

      // const url = rootvm.config.API_URL + rootvm.config.EndPoints.SearchRoleGroup;
      // const body ={"name": ""};
      // vm.GetRoleGroupList(url,body);
    };

    init();
  };
  roleManagementController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("roleManagementController", roleManagementController);

  //#endregion roleManagementController

  //#region roleGroupManagementController

  const roleGroupManagementController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.GetRoleGroupList = function (url, body) {
      vm.isLoading = true;
      // vm.Warehouselabel = "Add Warehouse Details";
      // vm.add_btn = "CREATE";
      // vm.mode=1;
      vm.RoleGroupList = [];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.RoleGroupList = response.data;
              vm.isLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.create = function (mode1, id) {
      if (!vm.model) {
        vm.model = {};

        var rolegroupname = (vm.model.rolegroupname = "");
        var rolegroupdescription = (vm.model.rolegroupdescription = "");
      } else {
        var rolegroupname = vm.model.rolegroupname;
        var rolegroupdescription = vm.model.rolegroupdescription;
      }

      if (rolegroupname === undefined || rolegroupname === "") {
        Swal.fire({
          allowOutsideClick: false,
          title: "Role Group Name is Required",
        });
        return false;
      } else if (
        rolegroupdescription === undefined ||
        rolegroupdescription === ""
      ) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Description is required",
        });
        return false;
      } else {
        if (mode1 == 1) {
          const body = {
            id: id,
            name: rolegroupname.toUpperCase(),
            description: rolegroupdescription,
            mode: "CREATE",
          };

          const url =
            rootvm.config.API_URL + rootvm.config.EndPoints.SaveRoleGroup;
          vm.RoleManagementCreate(url, body);
        } else if (mode1 == 2) {
          const body = {
            id: id,
            name: rolegroupname.toUpperCase(),
            description: rolegroupdescription,
            mode: "EDIT",
          };

          const url =
            rootvm.config.API_URL + rootvm.config.EndPoints.SaveRoleGroup;
          vm.RoleManagementCreate(url, body);
        }
      }
    };

    vm.RoleManagementCreate = function (url, body) {
      $("#role-create").modal("hide");
      //vm.DestinationMasterList=[];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "success",
              text: response.data.description,
            }).then(function () {
              window.location.reload();
            });

            vm.RoleGroupList = response.data;
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.get_role_group_details = function (code) {
      vm.RoleGroupLabel = "Edit Role Group";
      vm.add_btn = "UPDATE";
      vm.mode = 2;
      $("#reset_btn").css("display", "none");
      // $("#rolegroupname").attr("readonly", true);
      // $("#rolegroupname").css({"background-color": "#ebebeb"});

      const url1 =
        rootvm.config.API_URL + rootvm.config.EndPoints.SearchRoleGroup;
      const body1 = {
        name: code,
      };

      vm.role_group_details = [];
      vm.model = vm.model || {};

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.role_group_details = response.data;
              if (
                Array.isArray(vm.role_group_details) &&
                vm.role_group_details.length > 0
              ) {
                // Set the code based on the API response
                vm.model.rolegroupname = vm.role_group_details[0].name;
                vm.model.rolegroupdescription =
                  vm.role_group_details[0].description;
                vm.id = vm.role_group_details[0].id;
              } else {
                vm.id = "00000000-0000-0000-0000-000000000000";
                vm.model.rolegroupname = "";
                vm.model.rolegroupdescription = "";
              }
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.reset = function () {
      vm.RoleGroupLabel = "Create Role Group";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.id = "00000000-0000-0000-0000-000000000000";
      vm.model = {};
      // $("#rolegroupname").attr("readonly", false);
      // $("#rolegroupname").css({"background-color": "#ffffff"});
      $("#reset_btn").css("display", "inline-block");
    };

    init = function () {
      vm.RoleGroupLabel = "Create Role Group";
      vm.add_btn = "CREATE";
      vm.mode = 1;
      vm.id = "00000000-0000-0000-0000-000000000000";

      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.SearchRoleGroup;
      const body = { name: "" };
      vm.GetRoleGroupList(url, body);
    };

    init();
  };
  roleGroupManagementController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("roleGroupManagementController", roleGroupManagementController);

  //#endregion roleGroupManagementController

  //#region roleDetailsController

  const roleDetailsController = function (
    $scope,
    $rootScope,
    $routeParams,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    var roleGroupId = $routeParams.roleGroupId;

    vm.GetRoleGroupRoleMapList = function () {
      vm.isLoading = true;

      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.RoleGroupRoleMap;
      const body = { Id: roleGroupId };

      vm.RoleGroupRoleMap = [];
      vm.RoleGroupRoleMapActiveList = [];
      vm.RoleGroupRoleMapInActiveList = [];
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.RoleGroupRoleMap = response.data;
              vm.RoleGroupRoleMapActiveList = response.data[0].activeRole;
              vm.RoleGroupRoleMapInActiveList = response.data[0].inActiveRole;

              vm.isLoading = false;
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.add_remove = function (rolegroupId, roleid, mapId, status) {
      if (status == false) {
        Swal.fire({
          title: "Are you sure?",
          text: "Do You Want to Remove This Role?",
          icon: "warning",
          allowOutsideClick: false,
          showCancelButton: true,
          confirmButtonText: "Yes, Remove it!",
          cancelButtonColor: "#3085d6",
          confirmButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            vm.remove_rolegroup(mapId);
          }
        });
      } else if (status == true) {
        Swal.fire({
          title: "Are you sure?",
          text: "Do You Want to Add This Role?",
          icon: "warning",
          allowOutsideClick: false,
          showCancelButton: true,
          cancelButtonColor: "#3085d6",
          confirmButtonColor: "#d33",
          confirmButtonText: "Yes, Add it!",
        }).then((result) => {
          if (result.isConfirmed) {
            vm.add_remove_rolegroup(rolegroupId, roleid);
          }
        });
      }
    };

    vm.add_remove_rolegroup = function (rolegroupId, roleid) {
      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.RoleGroupSaveRemove;
      const body = {
        rolegroupId: rolegroupId,
        roleid: roleid,
        mode: "create",
      };

      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              Swal.fire({
                text: response.data.description,
                allowOutsideClick: false,
                icon: "success",
                willClose: () => {
                  vm.GetRoleGroupRoleMapList();
                },
              });
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.remove_rolegroup = function (mapId) {
      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.RoleGroupSaveRemove;
      const body = {
        Id: mapId,
        mode: "delete",
      };

      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              Swal.fire({
                text: response.data.description,
                allowOutsideClick: false,
                icon: "success",
                willClose: () => {
                  vm.GetRoleGroupRoleMapList();
                },
              });
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    function init() {
      vm.GetRoleGroupRoleMapList();
    }

    init();
  };

  roleDetailsController.$inject = [
    "$scope",
    "$rootScope",
    "$routeParams",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("roleDetailsController", roleDetailsController);

  //#endregion roleDetailsController

  //#region roleUsertController

  const roleUsertController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    init = function () {};

    init();
  };
  roleUsertController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("roleUsertController", roleUsertController);

  //#endregion roleUsertController

  //#region FileGenerateController

  const FileGenerateController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.generateExcel = function () {
      var data = [
        ["PATTON INTERNATIONAL INC"],
        ["1744 ENCLAVE GREEN CV, GERMANTOWN, TN 38139-5715, U.S.A."],
        ["Phone:"],
        [],
        ["RELEASE AUTHORIZATION"],
        [],
        [
          "PO NO. 240100483462, 240100483462, 240100483462, 240100483462, 240100483462, 240100483462, 240100483462, 240100483462",
        ],
        [],
        ["INVOICE NO.", "PART NO.", "ITEMS", "PALLET", "PIECES", "PO NO."],
        [
          "PIIJB024/2425",
          "K0100S",
          '1" KNOCKOUT',
          "24/29--(1) Cartons",
          "200",
          "240100483462",
        ],
        [
          "PIIJB076/2425",
          "K0150",
          '1 1/2" KNOCKOUT',
          "76/16--(4) Cartons",
          "800",
          "240100483363",
        ],
        [
          "PIIJB076/2425",
          "S125",
          '1 1/4" KNOCKOUT',
          "76/15--(4) Cartons",
          "800",
          "240100483462",
        ],
        [
          "PIIJB053/2425",
          "4300ST",
          '3" SET SCREW CONNECTOR INSULATED',
          "53/26",
          "650",
          "240100483462",
        ],
        [
          "PIIJB057/2425",
          "4400ST",
          '4" SET SCREW CONNECTOR INSULATED',
          "57/12",
          "400",
          "240100483462",
        ],
        [
          "PIIJB070/2425",
          "5400S",
          '4" SET SCREW COUPLING',
          "70/33",
          "480",
          "240100483462",
        ],
        [
          "PIIJB070/2425",
          "5400S",
          '4" SET SCREW COUPLING',
          "70/34",
          "480",
          "240100483462",
        ],
        [
          "PIIJB070/2425",
          "5400S",
          '4" SET SCREW COUPLING',
          "70/35",
          "480",
          "240100483462",
        ],
        [
          "PIIJB070/2425",
          "5400S",
          '4" SET SCREW COUPLING',
          "70/36",
          "480",
          "240100483462",
        ],
        [
          "PIIJB070/2425",
          "5400S",
          '4" SET SCREW COUPLING',
          "70/37",
          "480",
          "240100483462",
        ],
        [],
        ["", "", "", "TOTAL 7 SKIDS AND (9) CARTONS"],
        [],
        ["", "", "", "Thank You"],
        [],
        ["", "", "", "On Behalf of PATTON INTERNATIONAL INC"],
      ];

      // Create a new workbook
      var ws = XLSX.utils.aoa_to_sheet(data);

      ws["!cols"] = [
        { wch: 30 }, // Column 1 width (PATTON INTERNATIONAL INC)
        { wch: 20 }, // Column 2 width (e.g., PO NO.)
        { wch: 20 }, // Column 3 width (e.g., PART NO.)
        { wch: 40 }, // Column 4 width (e.g., ITEMS)
        { wch: 10 }, // Column 5 width (e.g., PIECES)
        { wch: 15 }, // Column 6 width (e.g., INVOICE NO.)
      ];

      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Export the workbook to Excel file
      XLSX.writeFile(wb, "generated_file.xlsx");
    };

    vm.generatePDF = function () {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.text("Hello World!", 10, 10);

      doc.save("generated-file.pdf");
    };

    init = function () {};

    init();
  };
  FileGenerateController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller("FileGenerateController", FileGenerateController);

  //#endregion FileGenerateController

  //-------------------- End Master ------------------------

  //-------------------- Customer ----------------------------

  const CustomerWarehouseReleaseController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.WarehouseLabel = "";
    vm.get_warehouse_details = function () {
      var warehouse = $("#warehouse").val();

      if (warehouse != "") {
        vm.norRsultFound = "";
        $("#warehouse_release").css("display", "block");

        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.CustomerRelease;
        const body = { party: vm.loggedInUser.party, warehouse: warehouse };

        vm.isLoading = true;
        vm.CustomerWarehouseRelease = [];
        AppService.post(url, body).then(
          function (response) {
            vm.norRsultFound = "";
            if (response.status == 200) {
              if (response && response.data && response.data.items.length > 0) {
                vm.CustomerWarehouseRelease = response.data.items;
                vm.CustomerWarehouseReleaseShipto = response.data.shipto;
                vm.isLoading = false; // Uncomment if needed
              } else {
                vm.isLoading = false;
                vm.norRsultFound = "No Record Found";
              }
            }
          },
          function (error) {
            vm.isLoading = false;
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      } else {
        $("#warehouse_release").css("display", "none");
      }
      vm.WarehouseLabel = warehouse;
    };

    vm.get_warehouse_release_view = function (part_no, warehouse) {
      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.CustomerReleaseView;
      const body = {
        party: vm.loggedInUser.party,
        partno: part_no,
        warehouse: warehouse,
        items: [],
        Transit: [],
      };

      vm.CustomerReleaseView = [];
      vm.partno = "";
      vm.size = "";

      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.CustomerReleaseView = response.data;

              vm.partno = vm.CustomerReleaseView.partno;
              vm.size = vm.CustomerReleaseView.size;
            }
          }
        },
        function (error) {
          $("#customer_warehouse_release_view").modal("hide");

          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }

          vm.loginErrorMessage = "Data Not Found";
        }
      );
    };

    vm.CustomerReleaseView = {
      transit: [], // Initialize as an empty array to avoid undefined errors
    };

    vm.getTransitQtySum = function () {
      if (!vm.CustomerReleaseView || !vm.CustomerReleaseView.transit) {
        return 0; // Return 0 if undefined
      }
      return vm.CustomerReleaseView.transit.reduce(function (partialSum, a) {
        return partialSum + (a.qty || 0); // Ensure `a.qty` is valid
      }, 0);
    };

    vm.DataNextt = function (warehouse) {
      var buyerCode = "";
      var selected = $("input:radio[name='shipto']:checked");
      if (selected.length > 0) {
        buyerCode = selected.val();
      } else {
        Swal.fire({
          allowOutsideClick: false,
          title: "Select Shipto",
        });
        return false;
      }

      vm.warehouse_consignee_details = [];

      const url1 =
        rootvm.config.API_URL + rootvm.config.EndPoints.ConsigneeCode;
      const body1 = { code: buyerCode };

      AppService.post(url1, body1).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              vm.warehouse_consignee_details = response.data;
            }
          }
        },
        function (error) {
          $("#customer_warehouse_release_next").modal("hide");
          $("#customer_warehouse_release_next2").modal("show");
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );

      if ($("#pallet_count").val() > 0 || $("#carton_count").val() > 0) {
        vm.CustomerReleaseViewNext = [];
        vm.isModalLoader = true;
        for (var i = 0; i < vm.CustomerWarehouseRelease.length; i++) {
          for (
            var j = 0;
            j < vm.CustomerWarehouseRelease[i].parts.length;
            j++
          ) {
            var partNo = $("#hpartno" + (i + 1) + (j + 1)).val();

            var noofpallet = "noofpallet" + (i + 1) + (j + 1);
            var hpalletqty = "hpalletqty" + (i + 1) + (j + 1);

            var noofcarton = "noofcarton" + (i + 1) + (j + 1);
            var hqtyincarton = "hqtyincarton" + (i + 1) + (j + 1);

            if (
              ($("#" + noofpallet).val() > 0 &&
                $("#" + noofpallet).val() !== "") ||
              ($("#" + noofcarton).val() > 0 &&
                $("#" + noofcarton).val() !== "")
            ) {
              if (
                $("#" + noofpallet).val() > 0 &&
                $("#" + noofpallet).val() !== ""
              ) {
                var palletqty = parseInt($("#" + hpalletqty).val(), 10);
                var noofpalletValue = parseInt($("#" + noofpallet).val(), 10);

                var avgQty = noofpalletValue * palletqty;

                var isPallet = true;
                var isCarton = false;

                var cartonQty = null;
                var palletQty = palletqty;
              }

              if (
                $("#" + noofcarton).val() > 0 &&
                $("#" + noofcarton).val() !== ""
              ) {
                var qtyincarton = parseInt($("#" + hqtyincarton).val(), 10);
                var noofcartonValue = parseInt($("#" + noofcarton).val(), 10);

                var avgQty = noofcartonValue * qtyincarton;

                var isCarton = true;
                var isPallet = false;

                var cartonQty = qtyincarton;
                var palletQty = null;
              }

              var body = {
                type: "NORMAL",
                source: "PII",
                action: "RELEASE",
                partyCode: vm.loggedInUser.party,
                itemNumber: "",
                consigneeCode: "",
                buyerCode: buyerCode,
                cfDestimation: warehouse,
                partNumber: partNo,
                mnth: 1,
                avgQty: avgQty,
                isCarton: isCarton,
                isPallet: isPallet,
                cartonQty: cartonQty,
                palletQty: palletQty,
              };

              var url =
                rootvm.config.API_URL + rootvm.config.EndPoints.stockvalidate;
              vm.getReleaseDetails(url, body);
            }
          }
        }
        vm.isModalLoader = false;
      } else {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "Enter atleast one(1) No. of Pallets or No. of Cartons",
        });
        return false;
      }
    };

    vm.getReleaseDetails = function (url, body) {
      $("#next_btn").css("display", "none");
      $("#next_btn_loader").css("display", "inline-block");
      AppService.post(url, body).then(
        function (response) {
          if (response.status == 200) {
            if (response && response.data) {
              for (var i = 0; i < response.data.data.items.length; i++) {
                var copy_item = Object.assign({}, response.data.data.items[i]);
                copy_item.poNumbers = [copy_item.poNumber];
                console.log("copy items: " + copy_item);
                vm.aa = vm.CustomerReleaseViewNext.push(copy_item);
                // vm.CustomerReleaseViewNext.sort((a, b) => {
                //   console.log(a.item)
                //   const itemA = a.item.toUpperCase(); // Ignore case
                //   const itemB = b.item.toUpperCase(); // Ignore case
                //   if (itemA < itemB) return -1;
                //   if (itemA > itemB) return 1;
                //   return 0;
                // });
                vm.CustomerReleaseViewNext.sort((a, b) => {
                  const itemA = a.item.toUpperCase();
                  const itemB = b.item.toUpperCase();

                  if (itemA < itemB) return -1;
                  if (itemA > itemB) return 1;

                  // If items are the same, then sort by partNo
                  const partNoA = a.partNo.toUpperCase(); // Ignore case
                  const partNoB = b.partNo.toUpperCase(); // Ignore case

                  if (partNoA < partNoB) return -1;
                  if (partNoA > partNoB) return 1;

                  return 0;
                });
                console.log(
                  "CUstomer release view next ",
                  vm.CustomerReleaseViewNext
                );
              }
              console.log("aa", vm.aa);

              $("#customer_warehouse_release_next").modal("show");
              $("#customer_warehouse_release_next2").modal("hide");
              $("#next_btn").css("display", "inline-block");
              $("#next_btn_loader").css("display", "none");
              //next_btn
              //next_btn_loader
            }
          }
        },
        function (error) {
          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.updateNextItem = function (index) {
      var pono = $("#PoNo" + index).val();

      if (index >= 0 && index < vm.CustomerReleaseViewNext.length) {
        vm.CustomerReleaseViewNext[index].poNumber = pono;
      } else {
        console.error(
          "The data structure is not defined properly or index is out of bounds."
        );
      }
    };

    vm.DataNext2 = function () {
      $("#reset_btn1").prop("disabled", false);
      $("#send_email").css("display", "inline-block");
      $("#email_btn_loader").css("display", "none");

      const poNumbers = vm.CustomerReleaseViewNext.filter(
        (item) => item.poNumber
      )
        .map((item) => item.poNumber)
        .filter((value, index, self) => self.indexOf(value) === index);

      vm.commaSeparatedPoNumbers = poNumbers.join(", ");

      $("#customer_warehouse_release_next").modal("hide");
      $("#customer_warehouse_release_next2").modal("show");
    };

    vm.DataSendEmail = function (warehouse) {
      $("#reset_btn1").prop("disabled", true);
      $("#send_email").css("display", "none");
      $("#email_btn_loader").css("display", "inline-block");

      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var day = now.getDate();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();

      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      var formattedDate = year + "-" + month + "-" + day;
      var time = hours + ":" + minutes + ":" + seconds;

      var new_date_time = formattedDate + " " + time;
      var date = new Date(new_date_time);
      var itemDate = date.toISOString();

      var consigneeCode = "";
      var selected = $("input:radio[name='shipto']:checked");
      if (selected.length > 0) {
        consigneeCode = selected.val();
      }

      const body2 = {
        type: "NORMAL",
        source: "PII",
        destination: $("#warehouse").val(),
        action: "RELEASE",
        partyCode: vm.loggedInUser.party,
        itemNumber: "WEB RELEASE-000",
        itemDate: itemDate,
        consigneeCode: consigneeCode,
        buyerCode: vm.loggedInUser.party,
        transferee: null,
        cfDestimation: $("#warehouse").val(),
        whToWh: false,
        items: vm.CustomerReleaseViewNext,
        transfers: [],
        breaks: [],
      };

      const url2 = rootvm.config.API_URL + rootvm.config.EndPoints.savedata;

      AppService.post(url2, body2).then(
        function (response) {
          if (response && response.data) {
            if (response.status == 200) {
              vm.EmailResponse = response.data;

              const body3 = {
                action: "RELEASE",
                type: "NORMAL",
                source: "PII",
                partyCode: vm.loggedInUser.party,
                itemNumber: vm.EmailResponse.data.itemNumber,
                consigneeCode: consigneeCode,
              };
              //                 console.log(body3);
              // return false;
              const url3 =
                rootvm.config.API_URL +
                rootvm.config.EndPoints.CustomerWebReleaseMailSend;

              AppService.post(url3, body3).then(
                function (response) {
                  if (response && response.data) {
                    if (response.status == 200) {
                      $("#customer_warehouse_release_next").modal("hide");
                      $("#customer_warehouse_release_next2").modal("hide");

                      if (response && response.data) {
                        Swal.fire({
                          title: response.data.description,
                          text:
                            "Release Number : " +
                            vm.EmailResponse.data.itemNumber,
                          allowOutsideClick: false,
                          icon: "success",
                          willClose: () => {
                            //location.reload();
                            vm.get_warehouse_details();
                          },
                        });
                      }
                    }
                  }
                },
                function (error) {
                  $("#customer_warehouse_release_next").modal("hide");
                  $("#customer_warehouse_release_next2").modal("hide");

                  if (error.status == 500) {
                    Swal.fire({
                      allowOutsideClick: false,
                      icon: "error",
                      title: error.data,
                    });
                  } else if (error.status == 409) {
                    const errorMessage = Array.isArray(error.data.requestError)
                      ? error.data.requestError.join("<br/>")
                      : error.data.requestError;

                    Swal.fire({
                      allowOutsideClick: false,
                      icon: "error",
                      title: errorMessage,
                    });
                  } else if (
                    error.requestError.status == 400 ||
                    error.requestError.status == 401 ||
                    error.requestError.status == 402 ||
                    error.requestError.status == 403 ||
                    error.requestError.status == 405
                  ) {
                    Swal.fire({
                      text: Array.isArray(error.data.requestError)
                        ? error.data.requestError.join("<br/>")
                        : error.data.requestError,
                      allowOutsideClick: false,
                      icon: "error",
                      willClose: () => {
                        location.reload();
                      },
                    });
                  }
                }
              );
            }
          }
        },
        function (error) {
          $("#customer_warehouse_release_next").modal("hide");
          $("#customer_warehouse_release_next2").modal("hide");

          if (error.status == 500) {
            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: error.data,
            });
          } else if (error.status == 409) {
            const errorMessage = Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError;

            Swal.fire({
              allowOutsideClick: false,
              icon: "error",
              title: errorMessage,
            });
          } else if (
            error.requestError.status == 400 ||
            error.requestError.status == 401 ||
            error.requestError.status == 402 ||
            error.requestError.status == 403
          ) {
            Swal.fire({
              text: Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError,
              allowOutsideClick: false,
              icon: "error",
              willClose: () => {
                location.reload();
              },
            });
          }
        }
      );
    };

    vm.DataNext2Back = function () {
      $("#customer_warehouse_release_next").modal("show");
      $("#customer_warehouse_release_next2").modal("hide");
    };

    vm.CheckNoOfPallet = function (count, count1) {
      var hnoofpallet = parseInt($("#hnoofpallet" + count + count1).val());
      var noofpallet = parseInt($("#noofpallet" + count + count1).val());
      var noofcarton = parseInt($("#noofcarton" + count + count1).val());

      if (noofcarton > 0) {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "Require no. of cartons already put.",
        });
        $("#noofpallet" + count + count1).val("");
      } else if (noofpallet == 0) {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "Require no. of pallets must have minimum 1.",
        });
        $("#noofpallet" + count + count1).val("");
      } else if (noofpallet > 0 && hnoofpallet == 0) {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "No. of pallets is zero(0)",
        });
        $("#noofpallet" + count + count1).val("");
      } else if (noofpallet > hnoofpallet) {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "Require no of pallet is greater than no of pallet",
        });

        $("#noofpallet" + count + count1).val("");
      } else {
        var arr = document.getElementsByClassName("pallet");
        var pallet_count = 0;

        for (var i = 0; i < arr.length; i++) {
          if (parseFloat(arr[i].value))
            pallet_count += parseFloat(arr[i].value);
        }
        $("#pallet_count").val(pallet_count);
      }
    };

    vm.CheckNoOfcarton = function (count, count1) {
      var hnoofcarton = parseInt($("#hnoofcarton" + count + count1).val());
      var noofcarton = parseInt($("#noofcarton" + count + count1).val());
      var noofpallet = parseInt($("#noofpallet" + count + count1).val());

      if (noofpallet > 0) {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "Require no. of pallet already put.",
        });
        $("#noofcarton" + count + count1).val("");
      } else if (noofcarton == 0) {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "Require no. of carton must have minimum 1.",
        });
        $("#noofcarton" + count + count1).val("");
      } else if (noofcarton > 0 && hnoofcarton == 0) {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "No. of carton is zero(0)",
        });
        $("#noofcarton" + count + count1).val("");
      } else if (noofcarton > hnoofcarton) {
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "Require no of carton is greater than no of carton",
        });
        $("#noofcarton" + count + count1).val("");
      } else {
        var arr = document.getElementsByClassName("carton");
        var carton_count = 0;

        for (var i = 0; i < arr.length; i++) {
          if (parseFloat(arr[i].value))
            carton_count += parseFloat(arr[i].value);
        }
        $("#carton_count").val(carton_count);
      }
    };

    vm.CustomerReleaseViewNext = [];
    vm.getTotalPallets1 = function () {
      return vm.CustomerReleaseViewNext.reduce(function (partialSum, item) {
        return partialSum + (item.pallets || 0); // Add pallets or default to 0
      }, 0);
    };

    vm.getTotalCarton1 = function () {
      return vm.CustomerReleaseViewNext.reduce(function (partialSum, item) {
        return partialSum + (item.cartons || 0); // Add pallets or default to 0
      }, 0);
    };

    vm.reset = function () {
      location.reload();
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      vm.list = !!roles.find((role) => role === "PARTY_WISE_WAREHOUSE_SEARCH");

      console.log(vm.list);
      if (vm.list === true) {
        vm.isBodyLoading = true;
        //------ Party wise warehouse ------
        const url1 =
          rootvm.config.API_URL +
          rootvm.config.EndPoints.PartyWiseWarehouseList;
        const body1 = { party: vm.loggedInUser.party };

        vm.WarehouseList = [];

        AppService.post(url1, body1).then(
          function (response) {
            if (response && response.data) {
              if (response.status == 200) {
                vm.WarehouseList = response.data;
                vm.isBodyLoading = false;
              }
            }
          },
          function (error) {
            vm.isBodyLoading = false;
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );

        //---- Party details ------
        vm.PartyNameLabel = "";
        const url2 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
        const body2 = { code: vm.loggedInUser.party };

        AppService.post(url2, body2).then(
          function (response) {
            if (response.status == 200) {
              if (response && response.data) {
                vm.customer_details = response.data;
                if (
                  Array.isArray(vm.customer_details) &&
                  vm.customer_details.length > 0
                ) {
                  vm.PartyNameLabel = vm.customer_details[0].name;
                }
              }
            }
          },
          function (error) {
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );

        //---- Party details ------
        vm.PoNumberList = [];
        const url21 =
          rootvm.config.API_URL + rootvm.config.EndPoints.PoNumberList;
        const body21 = {
          OrderNo: "",
          Party: vm.loggedInUser.party,
        };

        AppService.post(url21, body21).then(
          function (response) {
            if (response.status == 200) {
              if (response && response.data) {
                vm.PoNumberList = response.data;
              }
              //console.log(vm.PoNumberList);
            }
          },
          function (error) {
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );

        const date = new Date();
        let d = new Intl.DateTimeFormat("en-GB", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
          .format(date)
          .split(" ")
          .join("-");
        vm.date = d;
      }
    };

    init();
  };
  CustomerWarehouseReleaseController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller(
      "CustomerWarehouseReleaseController",
      CustomerWarehouseReleaseController
    );

  const CustomerWarehouseStockViewController = function (
    $scope,
    $rootScope,
    $routeParams,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    var partyCode = $routeParams.location;

    const url1 =
      rootvm.config.API_URL + rootvm.config.EndPoints.PartyWiseWarehouseList;
    const body1 = { party: partyCode };

    vm.WarehouseList = [];

    AppService.post(url1, body1).then(
      function (response) {
        if (response && response.data) {
          if (response.status == 200) {
            vm.WarehouseList = response.data;
          }
        }
      },
      function (error) {
        if (error.status == 500) {
          Swal.fire({
            allowOutsideClick: false,
            icon: "error",
            title: error.data,
          });
        } else if (error.status == 409) {
          const errorMessage = Array.isArray(error.data.requestError)
            ? error.data.requestError.join("<br/>")
            : error.data.requestError;

          Swal.fire({
            allowOutsideClick: false,
            icon: "error",
            title: errorMessage,
          });
        } else if (
          error.requestError.status == 400 ||
          error.requestError.status == 401 ||
          error.requestError.status == 402 ||
          error.requestError.status == 403
        ) {
          Swal.fire({
            text: Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError,
            allowOutsideClick: false,
            icon: "error",
            willClose: () => {
              location.reload();
            },
          });
        }
      }
    );

    const url2 = rootvm.config.API_URL + rootvm.config.EndPoints.lookup;
    const body2 = {
      code: partyCode,
    };

    vm.customer_details = [];
    AppService.post(url2, body2).then(
      function (response) {
        if (response.status == 200) {
          if (response && response.data) {
            vm.customer_details = response.data;
            if (
              Array.isArray(vm.customer_details) &&
              vm.customer_details.length > 0
            ) {
              vm.PartyName = vm.customer_details[0].name;
            }
          }
        }
      },
      function (error) {
        if (error.status == 500) {
          Swal.fire({
            allowOutsideClick: false,
            icon: "error",
            title: error.data,
          });
        } else if (error.status == 409) {
          const errorMessage = Array.isArray(error.data.requestError)
            ? error.data.requestError.join("<br/>")
            : error.data.requestError;

          Swal.fire({
            allowOutsideClick: false,
            icon: "error",
            title: errorMessage,
          });
        } else if (
          error.requestError.status == 400 ||
          error.requestError.status == 401 ||
          error.requestError.status == 402 ||
          error.requestError.status == 403
        ) {
          Swal.fire({
            text: Array.isArray(error.data.requestError)
              ? error.data.requestError.join("<br/>")
              : error.data.requestError,
            allowOutsideClick: false,
            icon: "error",
            willClose: () => {
              location.reload();
            },
          });
        }
      }
    );

    vm.WarehouseLabel = "";
    vm.get_warehouse_details = function (warehouse) {
      if (warehouse != "") {
        vm.norRsultFound = "";
        $("#warehouse_release").css("display", "block");

        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.CustomerRelease;
        const body = { party: partyCode, warehouse: warehouse };

        vm.isLoading = true;
        vm.CustomerWarehouseRelease = [];
        AppService.post(url, body).then(
          function (response) {
            vm.norRsultFound = "";

            if (response.status == 200) {
              if (response && response.data && response.data.items.length > 0) {
                vm.CustomerWarehouseRelease = response.data.items;
                vm.CustomerWarehouseReleaseShipto = response.data.shipto;
                vm.isLoading = false; // Uncomment if needed
              } else {
                vm.isLoading = false;
                vm.norRsultFound = "No Record Found";
              }
            }
          },
          function (error) {
            vm.isLoading = false;

            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      } else {
        $("#warehouse_release").css("display", "none");
      }

      vm.WarehouseLabel = warehouse;
    };

    vm.get_warehouse_release_view = function (part_no, warehouse) {
      const url =
        rootvm.config.API_URL + rootvm.config.EndPoints.CustomerReleaseView;
      const body = {
        party: partyCode,
        partno: part_no,
        warehouse: warehouse,
        items: [],
        Transit: [],
      };

      vm.CustomerReleaseView = [];
      vm.partno = "";
      vm.size = "";

      AppService.post(url, body).then(
        function (response) {
          if (response && response.data) {
            vm.CustomerReleaseView = response.data;

            vm.partno = vm.CustomerReleaseView.partno;
            vm.size = vm.CustomerReleaseView.size;
            var today = new Date();
            vm.date = today.toISOString().split("T")[0];
          }
        },
        function (error) {
          vm.loginErrorMessage = "Data Not Found";
        }
      );
    };

    vm.CustomerReleaseView = {
      transit: [],
    };

    vm.getTransitQtySum = function () {
      if (!vm.CustomerReleaseView || !vm.CustomerReleaseView.transit) {
        return 0;
      }
      return vm.CustomerReleaseView.transit.reduce(function (partialSum, a) {
        return partialSum + (a.qty || 0);
      }, 0);
    };

    init = function () {};

    init();
  };
  CustomerWarehouseStockViewController.$inject = [
    "$scope",
    "$rootScope",
    "$routeParams",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller(
      "CustomerWarehouseStockViewController",
      CustomerWarehouseStockViewController
    );

  const CustomerWarehouseRelease1Controller = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    init = function () {};

    init();
  };
  CustomerWarehouseRelease1Controller.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller(
      "CustomerWarehouseRelease1Controller",
      CustomerWarehouseRelease1Controller
    );

  const CustomerWarehouseReleaseViewController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    init = function () {};

    init();
  };
  CustomerWarehouseReleaseViewController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller(
      "CustomerWarehouseReleaseViewController",
      CustomerWarehouseReleaseViewController
    );

  const WarehouseTransitDetailsController = function (
    $scope,
    $rootScope,
    $location,
    AppService,
    AppFactory
  ) {
    const vm = $scope;
    const rootvm = $rootScope;

    vm.WarehouseLabel = "";
    vm.norRsultFound = "";
    vm.get_warehouse_transit_details = function (warehouse) {
      if (warehouse != "") {
        vm.norRsultFound = "";
        $("#warehouse_release").css("display", "block");

        const url =
          rootvm.config.API_URL + rootvm.config.EndPoints.WarehouseTransit;
        const body = { warehousename: warehouse };

        vm.WarehouseTransitDetailsList = [];
        vm.isLoading = true;

        AppService.post(url, body).then(
          function (response) {
            if (response && response.data) {
              vm.norRsultFound = "";

              if (response && response.data && response.data.length > 0) {
                vm.WarehouseTransitDetailsList = response.data;
                vm.isLoading = false; // Uncomment if needed
              } else {
                vm.isLoading = false;
                vm.norRsultFound = "No Record Found";
              }
            }
          },
          function (error) {
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      } else {
        $("#warehouse_release").css("display", "none");
      }
      vm.WarehouseLabel = warehouse;
    };

    init = function () {
      var roles = vm.loggedInUser.roles;
      //var roles = ["WAREHOUSE_TRANSIT_SEARCH","PARTY_WAREHOUSE_SEARCH"];
      vm.list = !!roles.find((role) => role === "PARTY_WISE_WAREHOUSE_SEARCH");
      //vm.list1 = !!roles.find(role => role === "PARTY_WAREHOUSE_SEARCH");

      if (vm.list === true) {
        //------ Party wise warehouse ------
        const url1 =
          rootvm.config.API_URL +
          rootvm.config.EndPoints.PartyWiseWarehouseList;
        const body1 = { party: vm.loggedInUser.party };
        console.log(body1);
        vm.WarehouseList = [];

        AppService.post(url1, body1).then(
          function (response) {
            if (response && response.data) {
              if (response.status == 200) {
                vm.WarehouseList = response.data;
              }
            }
          },
          function (error) {
            if (error.status == 500) {
              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: error.data,
              });
            } else if (error.status == 409) {
              const errorMessage = Array.isArray(error.data.requestError)
                ? error.data.requestError.join("<br/>")
                : error.data.requestError;

              Swal.fire({
                allowOutsideClick: false,
                icon: "error",
                title: errorMessage,
              });
            } else if (
              error.requestError.status == 400 ||
              error.requestError.status == 401 ||
              error.requestError.status == 402 ||
              error.requestError.status == 403
            ) {
              Swal.fire({
                text: Array.isArray(error.data.requestError)
                  ? error.data.requestError.join("<br/>")
                  : error.data.requestError,
                allowOutsideClick: false,
                icon: "error",
                willClose: () => {
                  location.reload();
                },
              });
            }
          }
        );
      }
    };

    init();
  };
  WarehouseTransitDetailsController.$inject = [
    "$scope",
    "$rootScope",
    "$location",
    "AppService",
    "AppFactory",
  ];
  angular
    .module("PattonApp")
    .controller(
      "WarehouseTransitDetailsController",
      WarehouseTransitDetailsController
    );

  //-------------------- End Customer ----------------------------
})();
