var map;
      // Create a new blank array for all the listing markers.
      var self = this;
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
        //Message for Google Maps failing.
  this.mapRequestTimeout = setTimeout(function() {
    $('#map').html('Oops, it seems that you are lost. Google Maps is unable to load to help you. Please Refresh or try again later.');
  }, 8000);

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

        clearTimeout(self.mapRequestTimeout);


        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();

        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].title;
          // Create a marker per location, and put into markers array.
          var address = locations[i].address;
          var image = {
            url: 'img/pokemon-marker.png',
            scaledSize: new google.maps.Size(20, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0)
          };
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            address: address,
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
        document.getElementById('pokestops').addEventListener('click', showPokestops);
        document.getElementById('gyms').addEventListener('click', showGyms);
      }
      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '<br>' + marker.address + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.setMarker(null);
          });
        }
      }
      //This function will loop through the markers array and display them all.
      function showPokestops() {
        var bounds = new google.maps.LatLngBounds();
        //Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }
      //This function will loop through the listings and hide them all.
      function showGyms() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }