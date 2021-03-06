angular.module('starter.services', [])

.factory('Chats', function() {

})

.factory('PathGenerator', function($rootScope) {


  var module = {};

  module.parseXml = function(xml){
    var xmlDoc = $.parseXML(xml);
    var $xml = $(xmlDoc);

    var points = new Array();
    var elevation = new Array();
    var wpts = new Array();
    var trkName = $xml.find('trk name').text();
    var trks = $xml.find('trk trkseg trkpt');
    var wpt = $xml.find('wpt');

    /*
    alert(trkName);
    alert(trks.length);
    */

    try {

      $(wpt).each(function(){
        //var coord = new plugin.google.maps.LatLng($(this).attr('lat'), $(this).attr('lon'));
        var coord = {lat: $(this).attr('lat'), lng: $(this).attr('lon')};
        var name = $(this).find('name').text();
        var cmt = $(this).find('cmt').text();

        wpts.push({name: name, cmt: cmt, coord: coord});
      });

      $(trks).each(function(){
        //points.push(new plugin.google.maps.LatLng($(this).attr('lat'), $(this).attr('lon')));
        points.push({lat: $(this).attr('lat'), lng: $(this).attr('lon')});
        elevation.push(parseFloat($(this).find('ele').text()));
      });

      var length = module.inKm(points);

      module.trk = {
        name : trkName,
        points : points,
        wpts : wpts,
        length : Math.round(length.dist * 100) / 100,
        lengthPoints: length.distPoints,
        elevationPoints : elevation
      };

    }
    catch(err) {
      alert(err.message);    
    }
    
  }//end parse XML

  module.kmTo = function(_a, a){ 
      var e = Math, ra = e.PI/180; 
      var b = _a.lat * ra, c = a.lat * ra, d = b - c; 
      var g = _a.lng * ra - a.lng * ra; 
      var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d/2), 2) + e.cos(b) * e.cos 
      (c) * e.pow(e.sin(g/2), 2))); 
      return f * 6378.137; 
  }

  module.inKm = function(n){
    var distPoints = new Array();
      var a = n, 
          len = n.length, 
          dist = 0; 

    //start at 0
    distPoints.push(dist);

      for (var i=0; i < len-1; i++) { 
         dist += module.kmTo(a[i], a[i+1]); 

         distPoints.push(Math.round(dist * 100) / 100);
      }
      return {dist: dist, distPoints: distPoints}; 
  }


  return module;

})

;
