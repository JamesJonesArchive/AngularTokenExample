'use strict';

angular.module('tokenExampleApp')
  .controller('ListCtrl', ['$scope', '$rootScope', '$window', 'tokenjsonp', 'authService', function ($scope,$rootScope,$window,tokenjsonp,authService) {
    $rootScope.$on('event:auth-loginConfirmed', function(data) {
        // $rootScope.login = Adservice.getLogin();
    });   
    $rootScope.$on('event:auth-loginCancelled', function(data) {
        // $rootScope.login = Adservice.getLogin();
    });   
    tokenjsonp.list().then(function(data){
        $scope.elements = data.elements;
    },function(errorMessage) {
        $scope.error=errorMessage;
    });
    //$scope.awesomeThings = [
    //  'HTML5 Boilerplate',
    //  'AngularJS',
    //  'Karma'
    //];
  }]);
