/* Map is Initialized */
var map;
//Style credit: Snazzymaps.com
// Made by JulienJ - https://snazzymaps.com/style/70868/pokemon-go-style
var googleError = function() {
  alert('The map could not be loaded. Please try again later.');
};

var style = [{
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
}];


 function initMap() {

var infoWindow = new google.maps.InfoWindow({
 content: '<div><h4 id="pokestop-name"></h4><p id="pokestop-address"></p><p id="yelp"></p></div>'
});

/* Viewmodel of course */
var ViewModel = function() {
 'use strict';


 var self = this;
 self.query = ko.observable("");
 self.pokestopList = ko.observableArray([]);
 self.filteredPokestopList = ko.observableArray([]);
 self.initialize = function() {
  var mapCanvas = document.getElementById("google-map"),
   cenLatLng = new google.maps.LatLng(29.5186602, -98.500355),
   mapOptions = {
    center: cenLatLng,
    zoom: 14,
    styles: style,
    mapTypeId: google.maps.MapTypeId.ROADMAP
   };
  map = new google.maps.Map(mapCanvas, mapOptions);
  google.maps.event.addDomListener(window, "resize", function() {
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center);
  });
 };

 /* Creates List */
 self.buildPokestopLocations = function() {
  pokestopLocations.forEach(function(pokeItem) {
   self.pokestopList.push(new Pokestop(pokeItem));
  });
 };

 self.setPokestopClickFunctions = function() {
  self.pokestopList().forEach(function(pokestop) {
   google.maps.event.addListener(pokestop.marker(), "click", function() {
    self.pokestopClick(pokestop);
   });
  });
 };

 self.pokestopClick = function(pokestop) {
  var infoContent = '<div><h4 id="pokestop-name">' + pokestop.name() + '</h4>' +
   '<h5 id="pokestop-address">' + pokestop.address() + '</h5>' +
   '<h6 id="pokestop-category">' + pokestop.category() + '</h6>' +
   '<p id="text">Rating on <a id="yelp-url">yelp</a>: ' +
   '<img id="yelp"></p></div>';

  /* SETS CONTENT FOR INFOWINDOW */
  infoWindow.setContent(infoContent);
  self.getYelpData(pokestop);

  /* Re-centers map when marker clicked */
  map.panTo(new google.maps.LatLng(pokestop.lat(), pokestop.lng()));
  infoWindow.open(map, pokestop.marker());

  /* Animates marker when clicked */
  self.setMarkerAnimation(pokestop);
 };

 self.setMarkerAnimation = function(pokestop) {
  pokestop.marker().setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
   pokestop.marker().setAnimation(null);
  }, 750);
 };

 
  self.filterPokestops = ko.computed(function() {

  self.filteredPokestopList([]);

  var searchString = self.query().toLowerCase();
  var len = self.pokestopList().length;
  /* Loops through the array list */
  for (var i = 0; i < len; i++) {
   var pokestopName = self.pokestopList()[i].name().toLowerCase();
   var pokestopCategory = self.pokestopList()[i].category().toLowerCase();

   if (pokestopName.indexOf(searchString) > -1 ||
    pokestopCategory.indexOf(searchString) > -1) {
    self.filteredPokestopList.push(self.pokestopList()[i]);
    self.pokestopList()[i].marker().setVisible(true);
   } else {

    self.pokestopList()[i].marker().setVisible(false);
   }
  }
 }); 

 self.getYelpData = function(pokestop) {

  /*o-auth used to pull YELP API data */
  var httpMethod = "GET";
  var yelpURL = "http://api.yelp.com/v2/search/";

  var nonce = function(length) {
   var text = "";
   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return text;
  };

  /* Required Parameters for authorized search */
  var parameters = {
   oauth_consumer_key: "ilAAduhGGJdadrsYx1Cw2A",
   oauth_token: "_15_VXeH4Vrr7EfX1O7HK9Bjtz4t3JPG",
   oauth_nonce: nonce(20),
   oauth_timestamp: Math.floor(Date.now() / 1000),
   oauth_signature_method: "HMAC-SHA1",
   oauth_version: "1.0",
   callback: "cb",
   term: pokestop.name(),
   location: "SAN ANTONIO, TX",
   limit: 1
  };

  /* My API info */
  var consumerSecret = "omkZj3SL1pH9hIuZfOD0gYnJyXA";
  var tokenSecret = "VfYcYY0oVeACG8RpQjlQ_-qDnd8";

  var signature = oauthSignature.generate(httpMethod, yelpURL, parameters, consumerSecret, tokenSecret);


  parameters.oauth_signature = signature;

  var errorTimeout = setTimeout(function() {
    alert("Something went wrong");
  }, 9000);

  /* AJAX Request to YELP */
  $.ajax({
   url: yelpURL,
   data: parameters,
   cache: true,
   dataType: "jsonp",
   success: function(response) {
    /* Displays YELP rating */
    clearTimeout(errorTimeout);

/*
    $("#yelp").attr("src", response.businesses[0].rating_img_url);
    $("#yelp-url").attr("href", response.businesses[0].url);
*/
   }
  });
 };

 google.maps.event.addDomListener(window, "load", function() {
  self.initialize();
  self.buildPokestopLocations();
  self.setPokestopClickFunctions();
  self.filteredPokestopList(self.pokestopList());
 });
};

var Pokestop = function(data) {
 'use strict';

 /* Knockout Observables */
 var marker;
 this.name = ko.observable(data.name);
 this.lat = ko.observable(data.lat);
 this.lng = ko.observable(data.lng);
 this.address = ko.observable(data.address);
 this.category = ko.observable(data.category);



 /* Custom marker image */
 var image = {
  url: "img/pokemon-marker.png",
  scaledSize: new google.maps.Size(20, 32),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(0, 0)
 };
 marker = new google.maps.Marker({
  position: new google.maps.LatLng(this.lat(), this.lng()),
  map: map,
  animation: google.maps.Animation.DROP,
  icon: image,
  title: this.name()
 });

 /* Knockout Observable for Marker */
 this.marker = ko.observable(marker);
};

/* Run Knockout */
ko.applyBindings(new ViewModel);
}