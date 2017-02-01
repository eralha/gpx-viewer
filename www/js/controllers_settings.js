appModule.controller('AccountCtrl', function($rootScope, $scope, $ionicPlatform, $fileFactory, PathGenerator) {
  $scope.settings = $rootScope.settings;


  function runChartData(data){
    Highcharts.chart($('#chart').get(0), {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Track Elevation'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                categories: data.lengthPoints
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            exporting: { enabled: false },
            legend: {
                enabled: false
            },

            series: [{
                type: 'area',
                name: 'Track Elevation',
                data: data.elevationPoints
            }]
        });
  }


  $rootScope.$on("FileLoaded", function(e, trk){
    runChartData(PathGenerator.trk);
  });

  /*
  $.ajax({
      url: 'caparide-manique.gpx',
      dataType: 'text',
      success: function(data){
        PathGenerator.parseXml(data);
        
        console.log(PathGenerator.trk);

        runChartData(PathGenerator.trk);
      }
    });*/
    
});