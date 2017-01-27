angular.module('starter.services', [])

.factory('Chats', function() {

})

.factory('PathGenerator', function($rootScope) {


  var module = {};

  module.parseXml = function(xml){
    alert('parseXml');
    alert(xml);

    try {
      var xmlDoc = $.parseXML( xml );
      var $xml = $(xmlDoc);
      alert($xml.find('trk trkseg trkpt').length);
    }
    catch(err) {
      alert(err.message);    
    }

    try {
        var dataJson = $.xml2json(xml);
        var points = new Array();
        var trkName = dataJson.trk.name;
        var trks = dataJson.trk.trkseg.trkpt;

        alert(dataJson);

        for(i in trks){
          points.push(new plugin.google.maps.LatLng(trks[i].lat, trks[i].lon));
        }

        alert('points: '+points.length);
        alert(points);

        module.trk = {
          name : trkName,
          points : points
        };
    }
    catch(err) {
      alert(err.message);    
    }
    
  }


  return module;

})

;
