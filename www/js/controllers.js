angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope) {

  $rootScope.settings = {};
  $rootScope.settings.followGPS = false;
  $rootScope.settings.rotateMap = false;

  $scope.settings = $rootScope.settings;

  var map;
  var currPosition;
  var currPosiMarker;
  var zoom = 13;
  var locationWatchID;

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
      //on camera change listener
      if($rootScope.settings.rotateMap == false){
        zoom = position.zoom;
      }
    });
  }


  function initCompassWatch(){
    var options = {
        frequency: 500
    }; // Update every 3 seconds

    var watchID = navigator.compass.watchHeading(function(heading){
      if(map && $rootScope.settings.rotateMap){
        map.moveCamera({
          'zoom' : zoom,
          'bearing': heading.magneticHeading
        });
      }
    }, function(){}, options);//end watch

  }//end initCompassWatch


      $scope.centerMap = function(){
        if(currPosition){ 
          map.setCenter(currPosition);
          map.setZoom(zoom);
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

      $scope.rotateMap = function(){
        $rootScope.settings.rotateMap = ($rootScope.settings.rotateMap) ? false : true;
      }




      document.addEventListener("deviceready", function() {
        
        initMap();

        $scope.startFollow();

        //keep device awake
        window.plugins.insomnia.keepAwake();

        var HandleIntent = function (Intent) {
             alert(Intent);
             // With intent you'll do almost everything        

             if(Intent.hasOwnProperty('data')){
               // Do something with the File
             }else{
               // this will happen in getCordovaIntent when the app starts and there's no
               // active intent
               alert("The app was opened manually and there's not file to open");
             }
        };
                
        // Handle the intent when the app is open
        // If the app is running in the background, this function
        // will handle the opened file
        window.plugins.intent.setNewIntentHandler(HandleIntent);

        // Handle the intent when the app is not open
        // This will be executed only when the app starts or wasn't active
        // in the background
        window.plugins.intent.getCordovaIntent(HandleIntent, function () {
           alert("Error: Cannot handle open with file intent");
        });

      }, false);//end device ready

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

.controller('AccountCtrl', function($rootScope, $scope, $ionicPlatform, $fileFactory) {
  $scope.settings = $rootScope.settings;

  var fs = new $fileFactory();

    $ionicPlatform.ready(function() {
        
        fs.getEntriesAtRoot().then(function(result) {
            $scope.files = result;
        }, function(error) {
            console.error(error);
        });
        

        $scope.getContents = function(path) {
            fs.getEntries(path).then(function(result) {
                $scope.files = result;
                $scope.files.unshift({name: "[parent]"});
                fs.getParentDirectory(path).then(function(result) {
                    result.name = "[parent]";
                    $scope.files[0] = result;
                });
            });
        }

        //$scope.getContents('file:///storage/emulated/0/');

    });


})


.factory("$fileFactory", function($q) {

    var File = function() { };

    File.prototype = {

        getParentDirectory: function(path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURI(path, function(fileSystem) {
                fileSystem.getParent(function(result) {
                    deferred.resolve(result);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getEntriesAtRoot: function() {
            var deferred = $q.defer();
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                var directoryReader = fileSystem.root.createReader();
                directoryReader.readEntries(function(entries) {
                    deferred.resolve(entries);
                }, function(error) {
                    deferred.reject(error);
                });

            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getEntries: function(path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURI(path, function(fileSystem) {
                var directoryReader = fileSystem.createReader();
                directoryReader.readEntries(function(entries) {
                    deferred.resolve(entries);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

    };

    return File;

});


;
