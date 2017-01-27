angular.module('starter.services', [])

.factory('Chats', function() {

})

.factory('PathGenerator', function($rootScope) {


  var module = {};

  module.parseXml = function(xml){
    alert('parseXml');

    var xmlDoc = $.parseXML(xml);
    var $xml = $(xmlDoc);

    var points = new Array();
    var trkName = $xml.find('trk trkseg name').text();
    var trks = $xml.find('trk trkseg trkpt');

    alert(trkName);
    alert(trks.length);

    try {

      $(trks).each(function(){
        points.push(new plugin.google.maps.LatLng($(this).attr('lat'), $(this).attr('lon')));
      });

      module.trk = {
        name : trkName,
        points : points
      };

      alert('points: '+points.length);
    }
    catch(err) {
      alert(err.message);    
    }
    
  }


  return module;

})

;
