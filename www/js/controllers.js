angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

  var map;
  var currPosition;
  var currPosiMarker;
  var zoom = 13;
  var locationWatchID;

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

      $scope.msg = 'lat:'+position.coords.latitude+'lng:'+position.coords.longitude;
      $scope.$apply();

      map.setCenter(currPosition);
      map.setZoom(zoom);
  }//end getGeolocation;


  function onMapReady() {
    //var watchID = navigator.geolocation.watchPosition(getGeolocation, null, { timeout: 500 });

    navigator.geolocation.getCurrentPosition(getGeolocation);
    initCompassWatch();
  }//end onMapReady


  function initMap(){
    var div = document.getElementById("map_canvas");
    // Initialize the map view
    map = plugin.google.maps.Map.getMap(div);
    // Wait until the map is ready status.
    map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

    map.on(plugin.google.maps.event.CAMERA_CHANGE, function(position){
      zoom = position.zoom;
      $scope.camera = position;
      $scope.$apply();
    });
  }


  function initCompassWatch(){
    var options = {
        frequency: 500
    }; // Update every 3 seconds

    var watchID = navigator.compass.watchHeading(function(heading){

      if(map){
        map.moveCamera({
          'zoom' : zoom,
          'bearing': heading.magneticHeading
        });
      }

    }, function(){}, options);//end watch
  }

      document.addEventListener("deviceready", function() {
        
        initMap();

      }, false);//end device ready


      $scope.centerMap = function(){
        if(currPosition){ 
          map.setCenter(currPosition);
          map.setZoom(zoom);
        }

        if(map){
          if(locationWatchID){
            navigator.geolocation.clearWatch(locationWatchID);
            locationWatchID = null;

            $scope.msg = 'watch cleared';

            return;
          }

          $scope.msg = 'watch started';

          locationWatchID = navigator.geolocation.watchPosition(function(position){
            $scope.msg = '';

            getGeolocation(position);

            $scope.msg = $scope.msg+' - watch called';
            $scope.$apply();

          }, function(error){
            $scope.msg = 'gps erro '+error.message;
            $scope.$apply();
          }, { timeout: 30000, enableHighAccuracy: true });
        }
      }

      $scope.zoomIn = function(){
        zoom ++;
        zoom = (zoom > 19)? 19 : zoom;
        if(map){
          map.setZoom(zoom);
        }
      }

      $scope.zoomOut = function(){
        zoom --;
        zoom = (zoom < 3)? 3 : zoom;
        if(map){
          map.setZoom(zoom);
        }
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
