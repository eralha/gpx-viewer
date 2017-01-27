

appModule.controller('FilesCtrl', function($rootScope, $scope, $ionicPlatform, $fileFactory, PathGenerator, $ionicPopup, $state) {
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

        $scope.isGPX = function(file) {
          return (String(file.name).indexOf('.gpx') != -1) ? true : false;
        }

        $scope.readFile = function(file) {
          /*
          alert(JSON.stringify(file));
          alert(cordova.file.applicationDirectory);
          */
          

          window.resolveLocalFileSystemURL(file.nativeURL, function(fileEntry){
            var fail = function(error) {
                alert(JSON.stringify(error));
            };

            fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(e) {
                    /*
                    alert(this.result);
                    alert($);
                    alert($.xml2json);
                    */

                    PathGenerator.parseXml(this.result);

                    $state.go('tab.dash');

                    var alertPopup = $ionicPopup.alert({
                         title: 'Track Loaded',
                         template: PathGenerator.trk.name
                       });

                    setTimeout(function(){
                        alertPopup.close();
                    }, 2000);

                    alertPopup.then(function(res) {
                        $rootScope.$emit("FileLoaded", PathGenerator.trk);
                    });
                }

                reader.onerror = function(error){
                    alert(JSON.stringify(error));
                }

                reader.readAsText(file);
            }, fail);
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
