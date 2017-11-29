app = app = angular.module('datavis',[]);

app.controller("mainController",function($scope,$rootScope,$http){

	var url = "http://localhost:8000/"

	$scope.openMenu = function(id,name){
		toggleLoading()
		$http.get(url+"restaurant/itens/"+id).then(res => {
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
						fillColor: '#aaa',
						opacity: 0.8,
						radius: 100
					}).addTo($scope.map);
					marker.menus = []

					$scope.markers[key] = marker
				}

				$scope.markers[key].menus.push(d)

			})

			$.each($scope.markers,(k,m) => {
				let text = "<ul class='res-menus'>"

				m.menus.forEach(menu => {
					text += "<li id='"+menu.id+"'>("+menu.id+") "+menu.place+"</li>"
				})

				text += "</ul>"

				m.bindPopup(text)
			})
		})
		$scope.map.on('popupopen',function(){	
			$(".res-menus li").click(function(){
				$scope.openMenu($(this).attr('id'),$(this).text())
			})
		})

	}
})
