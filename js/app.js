var map, style = [{
		featureType: "all",
		elementType: "geometry.fill",
		stylers: [{
			color: "#c4e8c7"
		}]
	}, {
		featureType: "landscape.man_made",
		elementType: "geometry.stroke",
		stylers: [{
			color: "##000000"
		}]
	}, {
		featureType: "poi",
		elementType: "all",
		stylers: [{
			visibility: "on"
		}]
	}, {
		featureType: "poi.park",
		elementType: "geometry.fill",
		stylers: [{
			color: "#a9daba"
		}]
	}, {
		featureType: "road",
		elementType: "geometry.fill",
		stylers: [{
			color: "#b6a7a3"
		}]
	}, {
		featureType: "road",
		elementType: "geometry.stroke",
		stylers: [{
			color: "#f3f5e7"
		}, {
			weight: "0.01"
		}]
	}, {
		featureType: "road",
		elementType: "labels",
		stylers: [{
			visibility: "simplified"
		}]
	}, {
		featureType: "road.highway",
		elementType: "geometry.stroke",
		stylers: [{
			weight: "0.01"
		}]
	}, {
		featureType: "road.arterial",
		elementType: "geometry.fill",
		stylers: [{
			color: "#b6a7a3"
		}]
	}, {
		featureType: "road.arterial",
		elementType: "geometry.stroke",
		stylers: [{
			color: "#f3f5e7"
		}]
	}, {
		featureType: "road.local",
		elementType: "geometry.fill",
		stylers: [{
			color: "#b6a7a3"
		}]
	}, {
		featureType: "road.local",
		elementType: "geometry.stroke",
		stylers: [{
			color: "#f3f5e7"
		}, {
			weight: "0.01"
		}]
	}, {
		featureType: "transit.line",
		elementType: "geometry.fill",
		stylers: [{
			color: "#a1a0a0"
		}]
	}, {
		featureType: "water",
		elementType: "geometry.fill",
		stylers: [{
			color: "#65cee2"
		}]
	}, {
		featureType: "water",
		elementType: "labels",
		stylers: [{
			visibility: "on"
		}]
	}],
	infoWindow = new google.maps.InfoWindow({
		content: '<div><h4 id="pokestop-name"></h4><p id="pokestop-address"></p><p id="yelp"></p></div>'
	}),
	ViewModel = function() {
		"use strict";
		var a = this;
		a.pokestopList = ko.observableArray([]), a.filteredPokestopList = ko.observableArray([]), a.initialize = function() {
			var a = document.getElementById("google-map"),
				b = new google.maps.LatLng(29.5186602, -98.500355),
				c = {
					center: b,
					zoom: 14,
					styles: style,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
			map = new google.maps.Map(a, c), google.maps.event.addDomListener(window, "resize", function() {
				var a = map.getCenter();
				google.maps.event.trigger(map, "resize"), map.setCenter(a)
			})
		}, a.buildPokestopLocations = function() {
			pokestopLocations.forEach(function(b) {
				a.pokestopList.push(new Pokestop(b))
			})
		}, a.setPokestopClickFunctions = function() {
			a.pokestopList().forEach(function(b) {
				google.maps.event.addListener(b.marker(), "click", function() {
					a.pokestopClick(b)
				})
			})
		}, a.pokestopClick = function(b) {
			var c = '<div><h4 id="pokestop-name">' + b.name() + '</h4><h5 id="pokestop-address">' + b.address() + '</h5><h6 id="pokestop-category">' + b.category() + '</h6><p id="text">Rating on <a id="yelp-url">yelp</a>: <img id="yelp"></p></div>';
			infoWindow.setContent(c), a.getYelpData(b), map.panTo(new google.maps.LatLng(b.lat(), b.lng())), infoWindow.open(map, b.marker()), a.setMarkerAnimation(b)
		}, a.setMarkerAnimation = function(a) {
			a.marker().setAnimation(google.maps.Animation.BOUNCE), setTimeout(function() {
				a.marker().setAnimation(null)
			}, 750)
		}, a.filterPokestops = function() {
			a.filteredPokestopList([]);
			for (var b = $("#poke-str").val().toLowerCase(), c = a.pokestopList().length, d = 0; d < c; d++) {
				var e = a.pokestopList()[d].name().toLowerCase(),
					f = a.pokestopList()[d].category().toLowerCase();
				e.indexOf(b) > -1 || f.indexOf(b) > -1 ? (a.filteredPokestopList.push(a.pokestopList()[d]), a.pokestopList()[d].marker().setMap(map)) : a.pokestopList()[d].marker().setMap(null)
			}
		}, a.getYelpData = function(a) {
			var b = "GET",
				c = "http://api.yelp.com/v2/search/",
				d = function(a) {
					for (var b = "", c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", d = 0; d < a; d++) b += c.charAt(Math.floor(Math.random() * c.length));
					return b
				},
				e = {
					oauth_consumer_key: "ilAAduhGGJdadrsYx1Cw2A",
					oauth_token: "_15_VXeH4Vrr7EfX1O7HK9Bjtz4t3JPG",
					oauth_nonce: d(20),
					oauth_timestamp: Math.floor(Date.now() / 1e3),
					oauth_signature_method: "HMAC-SHA1",
					oauth_version: "1.0",
					callback: "cb",
					term: a.name(),
					location: "SAN ANTONIO, TX",
					limit: 1
				},
				f = "omkZj3SL1pH9hIuZfOD0gYnJyXA",
				g = "VfYcYY0oVeACG8RpQjlQ_-qDnd8",
				h = oauthSignature.generate(b, c, e, f, g);
			e.oauth_signature = h;
			var i = {
				url: c,
				data: e,
				cache: !0,
				dataType: "jsonp",
				success: function(a) {
					$("#yelp").attr("src", a.businesses[0].rating_img_url), $("#yelp-url").attr("href", a.businesses[0].url)
				},
				error: function() {
					$("#text").html("Data could not be retrieved from yelp.")
				}
			};
			$.ajax(i)
		}, google.maps.event.addDomListener(window, "load", function() {
			a.initialize(), a.buildPokestopLocations(), a.setPokestopClickFunctions(), a.filteredPokestopList(a.pokestopList())
		})
	},
	Pokestop = function(a) {
		"use strict";
		var b;
		this.name = ko.observable(a.name), this.lat = ko.observable(a.lat), this.lng = ko.observable(a.lng), this.address = ko.observable(a.address), this.category = ko.observable(a.category);
		var c = {
			url: "img/pokemon-marker.png",
			scaledSize: new google.maps.Size(20, 32),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(0, 0)
		};
		b = new google.maps.Marker({
			position: new google.maps.LatLng(this.lat(), this.lng()),
			map: map,
			animation: google.maps.Animation.DROP,
			icon: c,
			title: this.name()
		}), this.marker = ko.observable(b)
	};
ko.applyBindings(new ViewModel);