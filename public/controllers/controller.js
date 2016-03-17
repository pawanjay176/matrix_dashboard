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

myApp.run(['$route', function($route)  {
  $route.reload();
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
	
	var refresh = function() {
		$http.get('/roomNames').success(function(response) {
    		console.log("I got the data I requested");
    		$scope.roomNames = response;
    	});
	}
	refresh();
	var scatterPlot = function(data) {
		var margin = {top: 20, right: 15, bottom: 60, left: 80}
      , width = 960 - margin.left - margin.right
      , height = 500 - margin.top - margin.bottom;
    
    var x = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d[0]; })])
              .range([ 0, width ]);
    
    var y = d3.scale.linear()
    	      .domain([0, d3.max(data, function(d) { return d[1]; })])
    	      .range([ height, 0 ]);
 
    var chart = d3.select('body')
	.append('svg:svg')
	.attr('width', width + margin.right + margin.left)
	.attr('height', height + margin.top + margin.bottom)
	.attr('class', 'chart')

    var main = chart.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	.attr('width', width)
	.attr('height', height)
	.attr('class', 'main')   
        
    // draw the x axis
    var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom');

    main.append('g')
	.attr('transform', 'translate(0,' + height + ')')
	.attr('class', 'main axis date')
	.call(xAxis);

    // draw the y axis
    var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left');

    main.append('g')
	.attr('transform', 'translate(0,0)')
	.attr('class', 'main axis date')
	.call(yAxis);

    var g = main.append("svg:g"); 
    
    g.selectAll("scatter-dots")
      .data(data)
      .enter().append("svg:circle")
          .attr("cx", function (d,i) { return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 8);
	}

  	$scope.getRoomData = function(room){
  		var data = JSON.stringify({'room':room});
  		$http.post('roomData', data).success(function(response){
  			var iotdata = response[0].map(function(key){
  				return key.content;
  			});
  			var data = iotdata.map(function(r){
  				return r.split(" ");
  			});
  			for(var i=0;i<data.length;i++){
  				data[i] = data[i].map(Number);
  			}
  			scatterPlot(data);
  			
  		})		
  	}
}]);
