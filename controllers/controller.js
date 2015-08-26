(function(app){
	'use strict';

	app.controller('LoginController', function($scope, $route, $routeParams, $location) {
         $scope.$route = $route;
         $scope.$location = $location;
         $scope.$routeParams = $routeParams;
     })
     .controller('GamesController', function($scope, $routeParams) {
         $scope.name = "GamesController";
         $scope.params = $routeParams;
     })
     .controller('PlayController', function($scope, $routeParams) {
         $scope.name = "PlayController";
         $scope.params = $routeParams;
     });
     
})(app);    