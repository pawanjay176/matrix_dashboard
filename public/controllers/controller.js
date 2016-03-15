var myApp = angular.module('MatrixApp', ['ngRoute']);

myApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'login.html',
        controller: 'LoginCtrl'
      }).
      when('/home', {
        templateUrl: 'home.html',
        controller: 'HomeCtrl'
      });
  }]);

myApp.controller('LoginCtrl', ['$scope', '$http','$location', function($scope, $http, $location) {
	console.log("Hello World from controller");

	$scope.login = function() {
  		var data = JSON.stringify({user: $scope.user.id, password: $scope.user.password, type: "m.login.password"});
  		$http.post("http://localhost:8008/_matrix/client/api/v1/login", data).then(function mySuccess(details){
  			$http.post('/login',details.data).success(function(response){
  				console.log(response);
  			});
  			$location.path('home');
  		}, function myError(err) {
  			console.log(err);
  			alert("Invalid username/password")
  		});
	};
}]);

myApp.controller('HomeCtrl', ['$scope', '$http','$location', function($scope, $http, $location) {
	console.log("Hello World from home controller");
}]);