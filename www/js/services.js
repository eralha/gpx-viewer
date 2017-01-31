angular.module('starter.services', [])

.factory('Chats', function() {

})

.factory('PathGenerator', function($rootScope) {


  var module = {};

  module.parseXml = function(xml){
    var xmlDoc = $.parseXML(xml);
    var $xml = $(xmlDoc);

    var points = new Array();
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
        var coord = new plugin.google.maps.LatLng($(this).attr('lat'), $(this).attr('lon'));
        var name = $(this).find('name').text();
        var cmt = $(this).find('cmt').text();

        wpts.push({name: name, cmt: cmt, coord: coord});
      });

      $(trks).each(function(){
        points.push(new plugin.google.maps.LatLng($(this).attr('lat'), $(this).attr('lon')));
      });

      module.trk = {
        name : trkName,
        points : points,
        wpts : wpts
      };

    }
    catch(err) {
      alert(err.message);    
    }
    
  }


  return module;

})

;
