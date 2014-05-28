'use strict';

angular.module('tokenExampleApp')
  .provider('auth', function () {

    // Private variables
    var salutation = 'Hello';

    // Private constructor
    function Greeter() {
      this.greet = function () {
        return salutation;
      };
    }

    // Public API for configuration
    this.setSalutation = function (s) {
      salutation = s;
    };

    // Method for instantiating
    //this.$get = function () {
    //  return new Greeter();
    //};
    this.$get = ["authService",'storage','$rootScope', function(authService,storage,$rootScope) {
    
      // let's assume that the UnicornLauncher constructor was also changed to
      // accept and use the useTinfoilShielding argument
      return {
        initializeStorage: function() {
          storage.bind($rootScope,'buffer',{defaultValue: [] });
          storage.bind($rootScope,'list',{defaultValue: {} });
        }
      };
      // return authService;
      // return new UnicornLauncher(apiToken, useTinfoilShielding);
    }];
  })
  .config(['$routeProvider','$provide','$injector',function ($routeProvider,authProvider,$provide,$injector) {
    //var ag = authProvider().initializeStorage();
    //alert(JSON.stringify(ag));
  }]);
