angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

  var map;

      document.addEventListener("deviceready", function() {
        var div = document.getElementById("map_canvas");

        // Initialize the map view
        map = plugin.google.maps.Map.getMap(div);

        // Wait until the map is ready status.
        map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

        var options = {
            frequency: 500
        }; // Update every 3 seconds

        var watchID = navigator.compass.watchHeading(function(heading){

          $scope.heading = heading;
          $scope.$apply();

          map.animateCamera({
            'bearing': heading.magneticHeading,
            'zoom': 16,
            'duration': 0
          });

        }, function(){}, options);

      }, false);//end device ready

      function onMapReady() {

      }//end onMapReady

      function readCompass(){

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
