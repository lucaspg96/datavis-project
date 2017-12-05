app = app = angular.module('datavis',[]);

app.controller("mainController",function($scope,$rootScope,$http){

	var url = "http://localhost:8000/"
	var dishes = [];


	$scope.openMenu = function(markerKey,menuIndex){
		let menu = $scope.markers[markerKey].menus[menuIndex]

		$scope.map.setView([menu.lat,menu.lng], 13);

		toggleLoading()
		$http.get(url+"restaurant/itens/"+menu.id).then(res => {
			$("#menuName").text(menu.place)

			$("#menuData").empty()
			$("#menuData").append("<li>Data: "+menu.date+"</li>")
			$("#menuData").append("<li>Evento: "+menu.event+"</li>")
			$("#menuData").append("<li>Número de páginas: "+menu.page_count+"</li>")
			$("#menuData").append("<li>Número de pratos: "+menu.dish_count+"</li>")
			toggleLoading()
			$rootScope.$broadcast("setMenu",res.data)
		})

		// $http.get(url+"restaurant/similar/"+id).then(res => {
		// 	$rootScope.$broadcast("setGraph",res.data)
		// })
	}

	$scope.init = function(){
		$("#analysis div").hide()
		toggleLoading("body")
		
		$http.get(url+"locations").then(res => {
			$scope.map = L.map('map').setView([0,0], 2);
        	L.tileLayer('http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                    maxZoom: 17
                    }).addTo($scope.map);

			$scope.markers = {}

			res.data.forEach(d => {
				let key = d.lat.toString()+"_"+d.lng.toString()
				if(!$scope.markers[key]){
					var marker = L.circle([d.lat,d.lng],{
						color: '#000',
						fillColor: '#777',
						opacity: 0.9,
						radius: 500
					}).addTo($scope.map);
					marker.menus = []

					$scope.markers[key] = marker
				}

				$scope.markers[key].menus.push(d)

			})

			$.each($scope.markers,(k,m) => {
				let text = "<ul class='res-menus'>"
				let i=0
				m.menus.forEach(menu => {
					text += "<li marker='"+k+"' menu='"+i+"'>("+menu.id+") "+menu.place+"</li>"
					i++
				})

				text += "</ul>"

				m.bindPopup(text)
			})

			toggleLoading("body")
			$scope.map.on('popupopen',function(){	
				$(".res-menus li").click(function(){
					console.log("click")
					$scope.openMenu($(this).attr("marker"),$(this).attr('menu'))
				})
			})
		})

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
