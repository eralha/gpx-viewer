var appModule = angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, PathGenerator) {

  $rootScope.settings = {};
  $rootScope.settings.followGPS = false;
  $rootScope.settings.rotateMap = false;
  $rootScope.settings.isCentering = false;

  $scope.settings = $rootScope.settings;

  var map;
  var currPosition;
  var currPosiMarker;
  var zoom = 13;
  var locationWatchID;
  var trackOverLay;
  var startMarker;
  var endMarker;

  function getGeolocation(position){
    currPosition = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);

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

      map.moveCamera({
        'target' : currPosition
      });
  }//end getGeolocation;

  function onMapReady() {
    //var watchID = navigator.geolocation.watchPosition(getGeolocation, null, { timeout: 500 });

    navigator.geolocation.getCurrentPosition(getGeolocation);
    initCompassWatch();

    map.setMapTypeId(plugin.google.maps.MapTypeId.HYBRID);
  }//end onMapReady


  function initMap(){
    var div = document.getElementById("map_canvas");
    // Initialize the map view
    map = plugin.google.maps.Map.getMap(div);
    // Wait until the map is ready status.
    map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

    map.on(plugin.google.maps.event.CAMERA_CHANGE, function(position){
      //on camera change listener
      if($rootScope.settings.rotateMap == false){
        zoom = position.zoom;
      }
    });
  }


  function initCompassWatch(){
    var options = {
        frequency: 200
    }; // Update every 3 seconds

    var watchID = navigator.compass.watchHeading(function(heading){
      if(map && $rootScope.settings.rotateMap && $rootScope.settings.isCentering == false){
        map.moveCamera({
          'zoom' : zoom,
          'bearing': heading.magneticHeading
        });
      }
    }, function(){}, options);//end watch

  }//end initCompassWatch


      $scope.centerMap = function(){
        if(currPosition){ 
          $rootScope.settings.isCentering = true;

          map.animateCamera({
            'target' : currPosition,
            'duration' : 500
          });

          setTimeout(function(){
            $rootScope.settings.isCentering = false;
          }, 500);
        }
      }//end centerMap

      $scope.startFollow = function(){
        if(map){
          if(locationWatchID){
            navigator.geolocation.clearWatch(locationWatchID);
            locationWatchID = null;

            $scope.msg = 'watch cleared';

            return;
          }

          $scope.msg = 'watch started';

          locationWatchID = navigator.geolocation.watchPosition(function(position){
            if($rootScope.settings.followGPS == false){
              $scope.msg = 'watch called - not following gps';
              $scope.$apply();

              currPosition = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);

              return;
            }

            $scope.msg = '';

            getGeolocation(position);

            $scope.msg = $scope.msg+' - watch called';
            $scope.$apply();

          }, function(error){
            $scope.msg = 'gps erro '+error.message;
            $scope.$apply();
          }, { timeout: 30000, enableHighAccuracy: true });
        }//en if map
      }

      $scope.zoomIn = function(){
        zoom ++;
        zoom = (zoom > 19)? 19 : zoom;
        if(map){
          map.animateCamera({
            'zoom' : zoom,
            'duration' : 500
          });
        }
      }

      $scope.zoomOut = function(){
        zoom --;
        zoom = (zoom < 3)? 3 : zoom;
        if(map){
          map.animateCamera({
            'zoom' : zoom,
            'duration' : 500
          });
        }
      }

      $scope.rotateMap = function(){
        $rootScope.settings.rotateMap = ($rootScope.settings.rotateMap) ? false : true;
      }




      document.addEventListener("deviceready", function() {
        
        initMap();

        $scope.startFollow();

        //keep device awake
        window.plugins.insomnia.keepAwake();

      }, false);//end device ready


      function onGPXFileLoaded(e, trk) {
        $rootScope.settings.rotateMap = false;
        $rootScope.settings.followGPS = false;

        if(trackOverLay){ 
          trackOverLay.remove(); 
          trackOverLay = null;

          startMarker.remove();
          endMarker.remove();
        }

        var latLngBounds = new plugin.google.maps.LatLngBounds(trk.points);

        map.addPolyline({
          points: trk.points,
          'color' : '#AA00FF',
          'width': 3,
          'geodesic': false
        }, function(polyline) {

          trackOverLay = polyline;
        });

        // start and finish markers
        try{
          map.addMarker({
            'position': trk.points[0],
            'title': "Start"
          }, function(marker) {
            startMarker = marker;
            startMarker.showInfoWindow();
          });

          map.addMarker({
            'position': trk.points[trk.points.length - 1],
            'title': "End"
          }, function(marker) {
            endMarker = marker;
          });
        } catch(err) {
          alert(err.message);    
        }

        try {
          map.animateCamera({
            'target' : latLngBounds,
            'bearing' : 0,
            'duration' : 1000
          });
        } catch(err) {
          alert(err.message);    
        }
      }
      //when a GPX file is ready to be drawn on map
      $rootScope.$on("FileLoaded", onGPXFileLoaded);


      /*MOCK READ OFF GPX FILE
      $.get('caparide-manique.gpx', function(xml){
         PathGenerator.parseXml(xml);
        });
      */

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



.controller('AccountCtrl', function($rootScope, $scope, $ionicPlatform, $fileFactory) {
  $scope.settings = $rootScope.settings;
})
;
