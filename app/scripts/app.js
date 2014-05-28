'use strict';

angular
  .module('tokenExampleApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'angularLocalStorage'
  ])
  .config(['$routeProvider','$provide','$injector',function ($routeProvider,$provide,$injector) {
    //$injector.invoke(['authService', function(authService){
    //  authService.initializeStorage();
    //}]);
    // $injector.get("authService").initializeStorage();
    // authProviderProvider.initializeStorage();
    //$injector.invoke(function(authService){
    //  authService.initializeStorage();
    //});
    //var authProvider = $provide.provider("auth", function() {
    //  return {
    //    $get: function(authService,storage,$rootScope) {
    //    // $get: ["authService",'storage','$rootScope', function(authService,storage,$rootScope) {
    //      return authService;
    //      //return {
    //      //  initializeStorage: function() {
    //      //    storage.bind($rootScope,'buffer',{defaultValue: [] });
    //      //    storage.bind($rootScope,'list',{defaultValue: {} });
    //      //  },
    //      //  requestTokens: function() {
    //      //    
    //      //  }
    //      //};
    //    //}]
    //    }
    //  };
    //});
    //alert(JSON.stringify(authProvider));
    //authProvider.initializeStorage();
    // $injector.get("authProvider").initializeStorage();
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
        //,
        //resolve: {
        //  initializeApp: function(authService,$rootScope) {
        //    authService.initializeStorage();
        //  }
        //}
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
