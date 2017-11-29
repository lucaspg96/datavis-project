app = app = angular.module('datavis',[]);

app.controller("mainController",function($scope,$http){

	var url = "http://localhost:8000/"

	$scope.openMenu = function(id,name){
		$http.get(url+"restaurant/itens/"+id).then(res => {
			console.log(res.data)
		})
	}

	$scope.init = function(){
		$scope.map = L.map('map').setView([0,0], 2);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors',
                    maxZoom: 17
                    }).addTo($scope.map);
		
		$http.get(url+"locations").then(res => {
			$scope.markers = {}

			res.data.forEach(d => {
				let key = d.lat.toString()+"_"+d.lng.toString()
				if(!$scope.markers[key]){
					var marker = L.circle([d.lat,d.lng],{
						color: '#3a3',
						opacity: 0.5
					}).addTo($scope.map);
					marker.menus = []

					$scope.markers[key] = marker
				}

				$scope.markers[key].menus.push(d)

			})

			$.each($scope.markers,(k,m) => {
				let text = "<ul class='res-menus'>"

				m.menus.forEach(menu => {
					text += "<li id='"+menu.id+"'>"+menu.place+"</li>"
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
