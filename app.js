'use strict';

var cmonApp = angular.module('cmonApp', ['ngRoute']);

cmonApp
.controller('MainController', function($scope, $rootScope, $location){
	$rootScope.IsAuthenticated = false;

    $scope.logout = function(){
    	var result = $.ajax({
		    url: '/logout',
		    data : { 
		    	username : $rootScope.AuthenticatedUser.username
		    }
    	});

    	result.success(function(response){   
    		if(response.status === 'success')
    		{
  				$rootScope.IsAuthenticated = false;
  				$rootScope.AuthenticatedUser = null;
  				$location.path('/Login');
  				$rootScope.$apply();
    		} 		
    	});
    };
})
.controller('LoginController', function($scope, $rootScope, $location) {     
    $scope.login = function(){
        if($scope.loginform.$valid)
        {            
    			var result = $.ajax({
    			    url: '/login',
    			    type : 'POST',
    			    data: {
    			        username: 'rebecka',// $scope.username,
    			        password: 'secret'//$scope.password
    			    }
    			});

    			result.success(function(response){
    				if(response.status === "success")
    				{
    					$rootScope.AuthenticatedUser = response.player;
    					$rootScope.AuthenticatedUser.username = 'rebecka';//$scope.username;
    					$rootScope.IsAuthenticated = true;
    					$location.path('/Games');
    					$rootScope.$apply();					
    				}
    				else{					
    					alert(response.error);
    				}
    			});
        }    
        else
        {
        	$scope.loginform.$setDirty();
        } 
    };
 })
 .controller('GamesController', function($scope, $routeParams, $route, $location) {
    $scope.name = "GamesController";
    $scope.params = $routeParams;
    $scope.games = $route.current.locals.games;
 	  $scope.categories = $route.current.locals.categories;
    $scope.categoryId = 0; 

    $scope.setCategory = function(id){
      $scope.categoryId = id; 
    };

    $scope.categoryFilter = function(cat){
      return cat.categoryIds.indexOf($scope.categoryId) > -1;
    };

    $scope.play = function(code) {
        $location.path('/Play/' + code);
    };
 })
 .controller('PlayController', function($scope, $routeParams) {

    $scope.name = "PlayController";
    $scope.params = $routeParams;

    $scope.$on("$routeChangeSuccess", function($currentRoute, $previousRoute) {
          debugger
    });
 });

cmonApp.config(function($routeProvider) {
  $routeProvider
	.when('/Login', {
    	templateUrl: 'login.html',
    	controller: 'LoginController'
	  })
  	.when('/Games', {
  		resolve : {  			
  			categories : function(){
  				return $.ajax({
  					url : '/categories'
  				});
  			},
  			games : function(){
  				return $.ajax({
  					url : '/games'
  				});
  			} 
  		},
    	templateUrl: 'games.html',
    	controller: 'GamesController'
  	})
   	.when('/Play/:code', {
        templateUrl: 'play.html',
        controller: 'PlayController',
        resolve: {
      		delay: function($q, $timeout) {
	        	var delay = $q.defer();
	        	$timeout(delay.resolve, 1000);
	        	return delay.promise;
  		    }
		    }
	})	
	.otherwise({
      redirectTo: '/Games'
	});     	
}).run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function () {
    	if(!$rootScope.IsAuthenticated)
  		{
	 		  $location.path('/Login');
	 	  }
    });
}]);

