appModule.controller('AccountCtrl', function($rootScope, $scope, $ionicPlatform, $fileFactory, PathGenerator) {
  $scope.settings = $rootScope.settings;

  function getPointAtKm(km){
    console.log(km);
    var kms = PathGenerator.trk.lengthPoints;
    var index;

    for(i in kms){
        if(kms[i] == km){ 
            index = i;
            console.log(kms[i] == km, i);
        }
    }

    //console.log(index, PathGenerator.trk.points[index]);

    return PathGenerator.trk.points[index];
  }

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
                data: data.elevationPoints,
                point: {
                events: {
                        click: function(e){
                            var point = getPointAtKm(this.category);

                            $state.go('tab.dash');
                            $rootScope.$emit("MapSetCenter", point);
                        }
                    }
                }
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
    });
*/
    
});