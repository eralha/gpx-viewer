angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

  var map;
  var currPosition;
  var currPosiMarker;
  var zoom = 13;

  function getGeolocation(position){
    var currPosition = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      if(!currPosiMarker){
        map.addMarker({
          'position': currPosition,
          'title': "Hello GoogleMap for Cordova!"
        }, function(marker) {
          currPosiMarker = marker;
        });
      }else{
        currPosiMarker.setPosition(currPosition);
      }

      map.setCenter(currPosition);
  }//end getGeolocation;


  function onMapReady() {
    navigator.geolocation.getCurrentPosition(getGeolocation);
    initCompassWatch();
  }//end onMapReady


  function initMap(){
    var div = document.getElementById("map_canvas");
    // Initialize the map view
    map = plugin.google.maps.Map.getMap(div);
    // Wait until the map is ready status.
    map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
  }


  function initCompassWatch(){
    var options = {
        frequency: 500
    }; // Update every 3 seconds

    var watchID = navigator.compass.watchHeading(function(heading){

      $scope.heading = heading;
      $scope.$apply();

      if(map){
        map.moveCamera({
          'bearing': heading.magneticHeading,
          'zoom': zoom,
          'duration': 0
        });
      }

    }, function(){}, options);//end watch
  }

      document.addEventListener("deviceready", function() {
        
        initMap();

      }, false);//end device ready


      $scope.centerMap = function(){
        if(map){
          navigator.geolocation.getCurrentPosition(getGeolocation);
        }
      }

      $scope.zoomIn = function(){
        zoom ++;
      }

      $scope.zoomOut = function(){
        zoom --;
      }

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
