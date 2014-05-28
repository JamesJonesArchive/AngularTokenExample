'use strict';

angular.module('tokenExampleApp')
  .factory('authService', ['$rootScope','$injector','storage','$window','$q','$log','$cookieStore', function ($rootScope,$injector,storage,$window,$q,$log,$cookieStore) {
    /** Service initialized later because of circular dependency problem. */
    var $http;
    var service = {
      /**
       * Initializes local storage for use by the authService
       */
      initializeStorage: function() {
        storage.bind($rootScope,'buffer',{defaultValue: [] });
        storage.bind($rootScope,'list',{defaultValue: {} });
      },
      /**
      * Call this function to indicate that authentication was successfull and trigger a
      * retry of all deferred requests.
      * @param data an optional argument to pass on to $broadcast which may be useful for
      * example if you need to pass through details of the user that was logged in
      */
      loginConfirmed: function(data, configUpdater) {
        var updater = configUpdater || function(config) {return config;};
        $rootScope.$broadcast('event:auth-loginConfirmed', data);
        this.retryAll(updater);
      },

      /**
      * Call this function to indicate that authentication should not proceed.
      * All deferred requests will be abandoned or rejected (if reason is provided).
      * @param data an optional argument to pass on to $broadcast.
      * @param reason if provided, the requests are rejected; abandoned otherwise.
      */
      loginCancelled: function(data, reason) {
        this.rejectAll(reason);
        $rootScope.$broadcast('event:auth-loginCancelled', data);
      },
      /**
      * Appends HTTP request configuration object with deferred response attached to buffer.
      */
      append: function(config, deferred) {        
        $rootScope.buffer.push({
          config: config,
          deferred: deferred
        });
      },

      /**
      * Abandon or reject (if reason provided) all the buffered requests.
      */
      rejectAll: function(reason) {
        if (reason) {
          for (var i = 0; i < $rootScope.buffer.length; ++i) {
            $rootScope.buffer[i].deferred.reject(reason);
          }
        }
        $rootScope.buffer = [];
      },

      /**
      * Retries all the buffered requests clears the buffer.
      */
      retryAll: function(updater) {
        for (var i = 0; i < $rootScope.buffer.length; ++i) {
          $rootScope.retryHttpRequest(updater($rootScope.buffer[i].config), $rootScope.buffer[i].deferred);
        }
        $rootScope.buffer = [];
      },
      requestTokenByService: function(service) {
        var deferred = $q.defer();
        // var config = $rootScope.buffer.slice(-1)[0].config;
        $.ajax({
          dataType : "jsonp",
          crossDomain: true,
          // type: "POST",
          // contentType: "application/json",
          url: $rootScope[service].tokenService + "/request?callback=?",
          // url: "https://authtest.it.usf.edu/AuthTransferService/webtoken/request?callback=?",
          // data: { "service": "https://dev.it.usf.edu/~james/ExampleApp/" },
          data: { "service": $rootScope[service].appId },
          // jsonpCallback: 'JSON_CALLBACK',
          // jsonp: 'callback',
          //beforeSend: function (XMLHttpRequest, settings) {
          //  XMLHttpRequest.setRequestHeader("Content-Type", "application/json");
          //  XMLHttpRequest.setRequestHeader("Accept", "application/json");
          //  // XMLHttpRequest.setRequestHeader("X-Auth-Token", "123ABC");
          //},
          success: function(response, textStatus, jqXHR) {
            $log.info(textStatus);
            $log.info(response);
            // $rootScope[$rootScope.buffer.slice(-1)[0].config.params.service].token = response.token;
            $rootScope.$apply( function() { 
              deferred.resolve(response); 
            });
          }
        }).fail(function (jqXHR,textStatus, errorThrown) {
          $log.info("Failed URL: " + $rootScope[service].tokenService + "/request?callback=?");
          $log.info(textStatus);
          $log.info(errorThrown);
          $log.info(jqXHR.responseJSON);
          $log.info(jqXHR.responseText);
          $rootScope.$apply( function() { 
            deferred.resolve(jqXHR.responseJSON); 
          });
        });
        //Returning the promise object
        return deferred.promise;
      },
      requestToken: function() {
        var deferred = $q.defer();
        // var config = $rootScope.buffer.slice(-1)[0].config;
        $.ajax({
          dataType : "jsonp",
          crossDomain: true,
          // type: "POST",
          // contentType: "application/json",
          url: $rootScope[$rootScope.buffer.slice(-1)[0].config.params.service].tokenService + "/request?callback=?",
          // url: "https://authtest.it.usf.edu/AuthTransferService/webtoken/request?callback=?",
          // data: { "service": "https://dev.it.usf.edu/~james/ExampleApp/" },
          data: { "service": $rootScope[$rootScope.buffer.slice(-1)[0].config.params.service].appId },
          // jsonpCallback: 'JSON_CALLBACK',
          // jsonp: 'callback',
          //beforeSend: function (XMLHttpRequest, settings) {
          //  XMLHttpRequest.setRequestHeader("Content-Type", "application/json");
          //  XMLHttpRequest.setRequestHeader("Accept", "application/json");
          //  // XMLHttpRequest.setRequestHeader("X-Auth-Token", "123ABC");
          //},
          success: function(response, textStatus, jqXHR) {
            $log.info(textStatus);
            $log.info(response);
            // $rootScope[$rootScope.buffer.slice(-1)[0].config.params.service].token = response.token;
            $rootScope.$apply( function() { 
              deferred.resolve(response); 
            });
          }
        }).fail(function (jqXHR,textStatus, errorThrown) {
          $log.info("Failed URL: " + $rootScope[$rootScope.buffer.slice(-1)[0].config.params.service].tokenService + "/request?callback=?");
          $log.info(textStatus);
          $log.info(errorThrown);
          $log.info(jqXHR.responseJSON);
          $log.info(jqXHR.responseText);
          $rootScope.$apply( function() { 
            deferred.resolve(jqXHR.responseJSON); 
          });
        });
        
        //$http.jsonp($rootScope[$rootScope.buffer.slice(-1)[0].config.params.service].tokenService + "/request?callback=JSON_CALLBACK",{
        //  // method  : 'POST',
        //  params : {
        //    "service": $rootScope[$rootScope.buffer.slice(-1)[0].config.params.service].appId
        //  }
        //  //headers : {
        //  //  'Content-Type': 'application/json',
        //  //  'Accept': 'application/json'
        //  //}
        //}).success(function(data, status, headers, config) {
        //  $log.info(status);
        //  $log.info(headers);
        //  $log.info(config);
        //  deferred.resolve(data);
        //}).error(function(data, status, headers, config){
        //  $log.info(status);
        //  $log.info(headers);
        //  $log.info(config);
        //  deferred.resolve(data);
        //});
        
        //$http.jsonp("https://authtest.it.usf.edu/AuthTransferService/webtoken/request?callback=JSON_CALLBACK",{
        //  // method  : 'POST',
        //  params : {
        //    "service": "https://dev.it.usf.edu/~james/ExampleApp/"
        //  }
        //  //headers : {
        //  //  'Content-Type': 'application/json',
        //  //  'Accept': 'application/json'
        //  //}
        //}).success(function(data) {
        //  deferred.resolve(data);
        //}).error(function(data, status, headers, config){
        //  deferred.resolve(data);
        //});
        
        //$http.jsonp($rootScope[config.params.service].tokenService + "/request?callback=JSON_CALLBACK",{
        //    method  : 'POST',
        //    // url     : 'https://dev.it.usf.edu/~james/ExampleApp/services.php',
        //    // data    : $.param($scope.formData),  // pass in data as strings
        //    // ignoreAuthModule: true,
        //    params: { 
        //        "service": $rootScope[config.params.service].appId
        //        // "callback": "JSON_CALLBACK"
        //    },
        //    headers : { 
        //        // 'Content-Type': 'application/x-www-form-urlencoded',
        //        'Content-Type': 'application/json',
        //        'Accept': 'application/json'
        //    }  // set the headers so angular passing info as form data (not request payload)
        //}).success(function(data) {
        //    //Passing data to deferred's resolve function on successful completion
        //    $window.alert("requestToken RAN as success");
        //    $log.info("requestToken RAN 401 as success");
        //    deferred.resolve(data);
        //}).error(function(data, status, headers, config){
        //    $window.alert("requestToken RAN as error");
        //    $log.info("requestToken RAN");
        //    $log.info(data);
        //    $log.info(status);
        //    
        //    // console.log(data);
        //    // deferred.resolve(data);
        //    //Sending a friendly error message in case of failure
        //    deferred.resolve(data);
        //    // deferred.reject("An error occured while fetching items");
        //});
        
        //Returning the promise object
        return deferred.promise;
      },
      readyToRetrieveToken: function(service) {
        return ('appId' in $rootScope[service] && 'tokenService' in $rootScope[service] && !('token' in $rootScope[service]));
      },
      getMergedTokenHeaders: function(service,headers) {
        if ('appId' in $rootScope[service] && 'tokenService' in $rootScope[service] && !('token' in $rootScope[service])) {
          this.requestToken().then(function(data) {
            //$window.alert("This is the Token response");
            //$window.alert(JSON.stringify(data));
            $log.info(data);
            $rootScope[service].token = data.token;
            return angular.extend(headers, ($rootScope[service].token === undefined || $rootScope[service].token === null)?{}:{'X-Auth-Token': $rootScope[service].token});
            // $window.location.reload();
            //$window.alert("This is the end of the Token response");
          },function(errorMessage) {
            $log.info(errorMessage);
            return headers;
            //$window.alert("This is the Token error response");
            //$window.alert(errorMessage);
          });
        } else {
          return angular.extend(headers, ($rootScope[service].token === undefined || $rootScope[service].token === null)?{}:{'X-Auth-Token': $rootScope[service].token});
        }
      },
      get401response: function() {
        var config = $rootScope.buffer.slice(-1)[0].config;
        var deferred = $q.defer();
        
        $.ajax({
          dataType : "jsonp",
          type: "POST",
          contentType: "application/json",
          url: config.url,
          data: JSON.stringify(config.params),
          jsonpCallback: 'JSON_CALLBACK',
          beforeSend: function (XMLHttpRequest, settings) {
            XMLHttpRequest.setRequestHeader("Content-Type", "application/json");
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
            // XMLHttpRequest.setRequestHeader("X-Auth-Token", "123ABC");
            if (!($rootScope[config.params.service].token === undefined || $rootScope[config.params.service].token === null)) {
              XMLHttpRequest.setRequestHeader('X-Auth-Token', $rootScope[config.params.service].token);
            }
          },
          success: function(response, textStatus, jqXHR) {
            $window.alert(JSON.stringify(response));
            // alert(JSON.stringify(jqXHR.getAllResponseHeaders()));
            $window.alert("The 302 Redirected X-Auth-Token in the headers is: "+jqXHR.getResponseHeader("X-Auth-Token"));
            $rootScope.$apply( function() { 
                deferred.resolve(response); 
            });
          },
          error: function(jqXHR, textStatus, errorThrown ) {
            //if(jqXHR.status === 401) {
            //    alert("It's a 401 error");
            //    alert(jqXHR.responseText);
            //}
          }
        }).fail(function (jqXHR) {
          if(jqXHR.status === 401) {
            var params = {
              getParams: function(queryString) {                                    
                var params = {}, queries, temp, i, l;
            
                // Split into key/value pairs
                queries = queryString.split("&");
            
                // Convert the array of strings into an object
                for ( i = 0, l = queries.length; i < l; i++ ) {
                  temp = queries[i].split('=');
                  params[temp[0]] = decodeURIComponent(temp[1]);
                }
            
                return params;                                                                        
              }
            }.getParams(jqXHR.responseJSON.tokenService.substring( jqXHR.responseJSON.tokenService.indexOf('?') + 1 ));
            $rootScope[config.params.service] = {
              "appId": params.service, 
              "tokenService": {
                removeLogin: function(url) {
                  var lastSlashIndex = url.lastIndexOf("/");
                  if (lastSlashIndex > url.indexOf("/") + 1) { // if not in http://
                    return url.substr(0, lastSlashIndex); // cut it off
                  } else {
                    return url;
                  }                                    
                }
              }.removeLogin(jqXHR.responseJSON.tokenService.substring(0,jqXHR.responseJSON.tokenService.indexOf("?")))
            };
            //$window.location.assign(jqXHR.responseJSON.tokenService);
            $rootScope.$apply( function() { 
                deferred.resolve(jqXHR.responseJSON); 
            });
          }
        });
        //Returning the promise object
        return deferred.promise;
      }
    };
    $rootScope.retryHttpRequest = function(config, deferred) {
      function successCallback(response) {
        deferred.resolve(response);
      }
      function errorCallback(response) {
        deferred.reject(response);
      }
      $http = $http || $injector.get('$http');
      $http(config).then(successCallback, errorCallback);
    };
    $rootScope.$on('event:auth-loginRequired', function() {
      // alert(JSON.stringify($rootScope.buffer.slice(-1)[0].config));
      service.get401response().then(function(data) {
        $log.info(data);
        //$window.alert("This is the JQuery response");
        //$window.alert(JSON.stringify(data));
        $window.alert("This is the end of the JQuery response");
        $window.location.assign(data.tokenService);
      },function(errorMessage) {
      
      });
    });
    $rootScope.$on('event:auth-tokenRequired',function() {
      service.requestToken().then(function(data) {
        //$window.alert("This is the Token response");
        //$window.alert(JSON.stringify(data));
        $rootScope[$rootScope.buffer.slice(-1)[0].config.params.service].token = data.token;
        //$window.alert("This is the end of the Token response");
      },function(errorMessage) {
        $log.info(errorMessage);
        //$window.alert("This is the Token error response");
        //$window.alert(errorMessage);
      });
    });    
    return service;
  }])
  /**
  * $http interceptor.
  * On 401 response (without 'ignoreAuthModule' option) stores the request
  * and broadcasts 'event:angular-auth-loginRequired'.
  */
  .config(['$httpProvider','$injector', function($httpProvider,$injector) {
    $httpProvider.interceptors.push(['$rootScope', '$q', '$window','$log', function($rootScope, $q, $window, $log) {
      return {      
        request: function(config) {
          return config || $q.when(config);
        },
        requestError: function(rejection) {
          $log.info(rejection); // Contains the data about the error on the request.
          
          // Return the promise rejection.
          return $q.reject(rejection);
        },
        response: function(response) {
          // $window.alert(JSON.stringify(response));  
          return response || $q.when(response);
        },                
        responseError: function(rejection) {
          $log.info(rejection); // Contains the data about the error on the response.
          var deferred = $q.defer();
          // if (rejection.status === 401 && !rejection.config.ignoreAuthModule) {
          // alert(JSON.stringify(rejection.config));
          if (rejection.status === 0 && !rejection.config.ignoreAuthModule) {
            // $window.alert(rejection.config.url);
            //var url = rejection.config.url;
            //var params = rejection.config.params;
            $rootScope.buffer.push({
              config: rejection.config,
              deferred: deferred
            });
            $rootScope.$broadcast('event:auth-loginRequired');
            return deferred.promise;
          } else {
            $window.alert("Rejection status is " + rejection.status);
            return deferred.promise;
          }
          // otherwise, default behaviour
          return $q.reject(rejection);
        }
      };
    }]);
    //$injector.invoke(function(authService){
    //  authService.initializeStorage();
    //});
    //var authService = $injector.get('authService');
    //authService.initializeStorage();
    
    //var authRequest= ['authService', function(authService) {
    //  authService.initializeStorage();
    //   //if(authService.isLoggedIn){
    //   //    data['api_key'] = {token: @token};
    //   //}  
    //}];
    //$injector.invoke(authRequest);
    
    
    
    
  }])
  .run(['$rootScope', '$log', '$window', 'storage','authService', function($rootScope, $log, $window, storage, authService) {
    authService.initializeStorage();
    if ($rootScope.buffer.length) {
      var config = $rootScope.buffer.slice(-1)[0].config;
      if ('appId' in $rootScope[config.params.service] && 'tokenService' in $rootScope[config.params.service] && !('token' in $rootScope[config.params.service])) {
        // Get a token for this service
        // $rootScope.$broadcast('event:auth-tokenRequired');
        authService.requestToken().then(function(data) {
          //$window.alert("This is the Token response");
          //$window.alert(JSON.stringify(data));
          $log.info(data);
          $rootScope[$rootScope.buffer.slice(-1)[0].config.params.service].token = data.token;
          $rootScope.buffer.pop();
          // $window.location.reload();
          //$window.alert("This is the end of the Token response");
        },function(errorMessage) {
          $log.info(errorMessage);
          //$window.alert("This is the Token error response");
          //$window.alert(errorMessage);
        });
        
      }
    }    
  }]);
