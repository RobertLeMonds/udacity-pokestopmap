



















      /*
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
          infowindow.setContent('<div>' + marker.title + marker.address + '</div>');
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

      */