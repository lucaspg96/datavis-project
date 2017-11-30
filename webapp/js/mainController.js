app = app = angular.module('datavis',[]);

app.controller("mainController",function($scope,$rootScope,$http){

	var url = "http://localhost:8000/"

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
		$scope.map = L.map('map').setView([0,0], 2);
        L.tileLayer('http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                    maxZoom: 17
                    }).addTo($scope.map);
		
		$http.get(url+"locations").then(res => {
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
		})
		$scope.map.on('popupopen',function(){	
			$(".res-menus li").click(function(){
				console.log("click")
				$scope.openMenu($(this).attr("marker"),$(this).attr('menu'))
			})
		})

	}
})
