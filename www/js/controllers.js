angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

  var map;
      document.addEventListener("deviceready", function() {
        var div = document.getElementById("map_canvas");

        // Initialize the map view
        map = plugin.google.maps.Map.getMap(div);

        // Wait until the map is ready status.
        map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
      }, false);

      function onMapReady() {
        var button = document.getElementById("button");
        button.addEventListener("click", onBtnClicked);
      }//end onMapReady

      function onBtnClicked() {

        // Move to the position with animation
        map.animateCamera({
          target: {lat: 37.422359, lng: -122.084344},
          zoom: 17,
          tilt: 60,
          bearing: 140,
          duration: 5000
        }, function() {

          // Add a maker
          map.addMarker({
            position: {lat: 37.422359, lng: -122.084344},
            title: "Welecome to \n" +
                   "Cordova GoogleMaps plugin for iOS and Android",
            snippet: "This plugin is awesome!",
            animation: plugin.google.maps.Animation.BOUNCE
          }, function(marker) {

            // Show the info window
            marker.showInfoWindow();

            // Catch the click event
            marker.on(plugin.google.maps.event.INFO_CLICK, function() {

              // To do something...
              alert("Hello world!");

            });
          });
        });
      }//end onBtnClicked

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
