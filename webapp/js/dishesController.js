app = app = angular.module('datavis',[]);

app.controller("dishesController",function($scope,$rootScope,$http){

	var url = "http://localhost:8000/"
	var dishes = [];

	$scope.init = function(){
		$http.get(url+"dishes/snapshot").then(res => {
			console.log(res.data)
			$scope.drawTable(res.data)
		})
	}

	$scope.drawTable = function(data){
		let fact = crossfilter(data)

		$scope.dataTable = dc.dataTable("#data-table");
        $scope.dataTable.dimension(fact.dimension(d=>d))
			            .group(d => " ")
			            .size(15)
			            .columns([
			              d => d.name,
			              d => d.highest_price,
			              d => d.first_appeared,
			              d => d.menus_appeared,
			            ])
		$scope.dataTable.render()

	}

	$scope.firsAppearenceGrahp = function(){

	};

	$scope.pricesGraph = function(){

		$http.get(url+'restaurant/similar/highest_price/0')
			.then(res=>{
				dishes = res.data
				console.log(dishes)
				$scope.updateGraphLastAppeared(dishes)
			}).catch(err =>{
				console.log(err);
			});
	}

	$scope.updateGraphLastAppeared =  function(dishes){

		var leastAppeareditudeBarChart = dc.barChart("#least-appeared");
		var highestPriceBarChart = dc.barChart("#highest_prices");

		$scope.dishesFiltered = [];

		dishes.forEach(function(d){

			if(d.last_appeared != 0 && d.highest_price != 0){
				d.last_appeared = d.last_appeared
				d.highest_price = d.highest_price
				$scope.dishesFiltered.push(d);
			}
			

		}); 

		console.log($scope.dishesFiltered);

		var factsDishes = crossfilter($scope.dishesFiltered);

		var year_least_appearedDim = factsDishes.dimension(function(d){
			return d.last_appeared;
		  });

		var highest_priceDim = factsDishes.dimension(function(d){
		return d.highest_price;
		});

		var year_least_appearedDimentionCount = year_least_appearedDim.group();

		var highest_pricesDimentionCount = highest_priceDim.group();

		leastAppeareditudeBarChart.width(960)
			.height(150)
			.margins({top:10, right:10, bottom:20, left:40})
			.dimension(year_least_appearedDim)
			.group(year_least_appearedDimentionCount)
			.transitionDuration(500)
			.centerBar(true)
			.gap(40)
			.x(d3.scale.linear().domain([1850,2000]))
			.elasticY(true);  

		highestPriceBarChart.width(960)
			.height(150)
			.margins({top:10, right:10, bottom:20, left:40})
			.dimension(highest_priceDim)
			.group(highest_pricesDimentionCount)
			.transitionDuration(500)
			.centerBar(true)
			.gap(56)
			.x(d3.scale.linear().domain([1,20]))
			.elasticY(true);  
		

		dc.renderAll();
	}

	$scope.dishesFiltered = [];
	$scope.pricesGraph();
})