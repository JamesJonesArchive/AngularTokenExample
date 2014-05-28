'use strict';

angular.module('tokenExampleApp')
  .factory('tokenjsonp', ['$q', '$rootScope', '$location', '$window', '$http', '$log', 'storage', 'authService', function ($q, $rootScope, $location, $window, $http, $log, storage, authService) {
    // Public API here

    
    
    return {
      list: function () {
        //Creating a deferred object        
        var deferred = $q.defer();
        var headers = angular.extend({}, ($rootScope.list.token === undefined || $rootScope.list.token === null)?{}:{'X-Auth-Token': $rootScope.list.token});
        $log.info({ "listHeaders": headers});
        // storage.get("list");
        $http.jsonp('https://dev.it.usf.edu/~james/ExampleApp/services.php',{
            method  : 'POST',
            // url     : 'https://dev.it.usf.edu/~james/ExampleApp/services.php',
            // data    : $.param($scope.formData),  // pass in data as strings
            // ignoreAuthModule: true,
            params: { 
              "service": "list"
              // ?callback=JSON_CALLBACK
            },
            headers: headers
        }).success(function(data) {
            //Passing data to deferred's resolve function on successful completion
            $log.info("I RAN 401 as success");
            deferred.resolve(data);
        }).error(function(data, status, headers, config){
            $log.info("I RAN");
            $log.info(data);
            $log.info(status);
            
            // console.log(data);
            // deferred.resolve(data);
            //Sending a friendly error message in case of failure
            deferred.resolve(data);
            // deferred.reject("An error occured while fetching items");
        });
        //Returning the promise object
        return deferred.promise;
      }
    };
  }]);
