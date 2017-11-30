app.controller("chartController",function($scope){
	
	$scope.updateGraph = function(attr){
		$scope.generate(attr)
	}

	$scope.generate = function(attrib){
		let width = $("#map").width()
		let labels = {
			menus_appeared:"Ocorrências",
			first_appeared:"Primeira aparição",
			highest_price:"Maior preço"
		}

		$scope.chart = dc.barChart("#bar")
		$scope.scatter = dc.scatterPlot("#scatter")

		let barDim = $scope.fact.dimension(d => d[attrib])
		let barGroup = barDim.group().reduceCount()
		// console.log(barDim.top(5))

		let domain = d3.scale.linear().domain([
						barDim.bottom(1)[0][attrib],
						barDim.top(1)[0][attrib]])

		$scope.chart.width(width)
					.height(150)
					.dimension(barDim)
					.group(barGroup)
					.x(domain)
					// .gap(56)
					.brushOn(false)
					.elasticY(true)
					.centerBar(true)
					// .xAxisLabel(labels[attrib])
					.yAxisLabel("Quantidade")
					.renderHorizontalGridLines(true)
		let i = 0
		function getI(){
			return i++
		}
		let scatterDim = $scope.fact.dimension(d => [getI(),d[attrib]])
		let scatterGroup = scatterDim.group()
		// console.log(scatterGroup.top(5))
		$scope.scatter.width(width)
					.height(150)
					.brushOn(false)
					.dimension(scatterDim)
					.group(scatterGroup)
					.clipPadding(10)
					.x(d3.scale.linear().domain([0,getI()]))
					.symbolSize(8)
					.xAxisLabel("Pratos")
					.yAxisLabel("",10)
					
		
        if(!$scope.dataTable){
        	$scope.dataTable = dc.dataTable("#dc-table-graph");
	        $scope.dataTable.width(width)
	        				.dimension(barDim)
				            .group(d => " ")
				            .size($scope.dataSize)
				            .columns([
				              d => d.name,
				              d => d.first_appeared,
				              d => d.highest_price,
				              d => d.menus_appeared,
				              // d => d.times_appeared
				              ])
        }
		
		$scope.dataTable.sortBy(d => d[attrib])
				        .order(d3.ascending)

        dc.renderAll();
	}

	$scope.$on("setMenu",(event,data) => {
		$scope.dataSize = data.length
		$scope.dataTable = undefined
		$("#analysis div").show()
		// console.log(data)
		$scope.fact = crossfilter(data)
		$scope.attr = "highest_price"
		$scope.generate("highest_price")
	})
})