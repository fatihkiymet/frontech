'use strict';

var cmonApp = angular.module('cmonApp', ['ngRoute']);

cmonApp.controller('LoginController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;

     $scope.login = function(){
        if($scope.loginform.$valid)
        {            
			var result = $.ajax({
			    url: '/login',
			    type : 'POST',
			    data: {
			        username: $scope.username,
			        password: $scope.password
			    }
			});

			result.success(function(){
				$scope.$root.loggedInUser = $scope.username;
				$scope.$location.path('/Games');
				$scope.$apply();
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
    debugger
 	$scope.categories = $route.current.locals.categories;
 })
 .controller('PlayController', function($scope, $routeParams) {
     $scope.name = "PlayController";
     $scope.params = $routeParams;
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
  			} 
  		},
    	templateUrl: 'games.html',
    	controller: 'GamesController'
  	})
   	.when('/Game/:gameId', {
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
    $rootScope.$on('$routeChangeStart', function (event) {
    	if(!$rootScope.loggedInUser)
		{
			$location.path('/Login');
		}
    });
}]);

