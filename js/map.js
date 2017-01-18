      var map;
      // Create a new blank array for all the listing markers.
      // Google Maps style contribution of Snazzymaps.com
      // Made by JulienJ - https://snazzymaps.com/style/70868/pokemon-go-style
      var style = [{
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#c4e8c7"
        }]
      }, {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "##000000"
        }]
      }, {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{
          "visibility": "on"
        }]
      }, {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#a9daba"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#b6a7a3"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#f3f5e7"
        }, {
          "weight": "0.01"
        }]
      }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{
          "visibility": "simplified"
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
          "weight": "0.01"
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#b6a7a3"
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#f3f5e7"
        }]
      }, {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#b6a7a3"
        }]
      }, {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#f3f5e7"
        }, {
          "weight": "0.01"
        }]
      }, {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#a1a0a0"
        }]
      }, {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#65cee2"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [{
          "visibility": "on"
        }]
      }]
      var markers = [];

      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {
            lat: 29.5186602,
            lng: -98.520355
          },
          zoom: 13,
          styles: style
        });
        // These are the Pokestop Locations near Northstar Mall San Antonio, TX.
        var locations = [{
          title: 'Slackers',
          location: {
            lat: 29.5161377,
            lng: -98.4978737
          }
        }, {
          title: 'Alamo Drafthouse Cinema',
          location: {
            lat: 29.5181499,
            lng: -98.5051367
          }
        }, {
          title: 'Jims Restaurant',
          location: {
            lat: 29.5197297,
            lng: -98.5081427
          }
        }, {
          title: 'Diversions Game Room',
          location: {
            lat: 29.530484,
            lng: -98.4987076
          }
        }, {
          title: 'Freebirds',
          location: {
            lat: 29.5223566,
            lng: -98.4956672
          }
        }];
        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].title;
          // Create a marker per location, and put into markers array.
          var image = {
            url: 'img/pokemon-marker.png',
            scaledSize: new google.maps.Size(20, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0)
          };
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: image,
            id: i
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open an infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          bounds.extend(markers[i].position);
        }
        document.getElementById('distance').addEventListener('click', showDistance);
        document.getElementById('ratings').addEventListener('click', showRatings);
      }
      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.setMarker(null);
          });
        }
      }
      //This function will loop through the markers array and display them all.
      function showDistance() {
        var bounds = new google.maps.LatLngBounds();
        //Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }
      //This function will loop through the listings and hide them all.
      function showRatings() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }