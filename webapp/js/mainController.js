app = app = angular.module('datavis',[]);

app.controller("mainController",function($scope,$rootScope,$http){

	var url = "http://localhost:8000/"
	var fillColor = '#777'
	var color = '#000'
	var rollBackCircle;


	$scope.openMenu = function(markerKey,menuIndex){
		$scope.markers[markerKey].setStyle({fillColor: "red", color:"yellow"})
		
		if(rollBackCircle){
			rollBackCircle.setStyle({"fillColor": fillColor, "color":color})
		}
		rollBackCircle = $scope.markers[markerKey]
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
			console.log(res.data)
			res.data.forEach(d => {
				let key = d.lat.toString()+"_"+d.lng.toString()
				if(!$scope.markers[key]){
					var marker = L.circle([d.lat,d.lng],{
						"color": color,
						"fillColor": fillColor,
						opacity: 0.9,
						radius: 500
					}).addTo($scope.map);
					marker.menus = []

					$scope.markers[key] = marker
				}

				$scope.markers[key].menus.push(d)

			})

			$.each($scope.markers,(k,m) => {

				m.menus.sort((a,b) => {
					return a.date>b.date ? 1 : -1
				})

				let text = "<ul class='res-menus'><h5>"+m.menus[0].place+"</h5>"
				let i=0
				let span = "<span class='glyphicon glyphicon-list-alt'></span>"
				m.menus.forEach(menu => {
					text += "<li marker='"+k+"' menu='"+i+"'>"+span+menu.date+"</li>"
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

})
