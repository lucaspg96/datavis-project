app.controller("graphController",function($scope){
	
	$scope.updateGraph = function(attr){
		$scope.generate(attr)
	}

	$scope.generate = function(attrib){

	}

	$scope.$on("setGraph",(event,data) => {
		console.log(data)
	})
})