'use strict'

var app = angular.module("busApp", []);
app.controller("busController", function($scope , $http, $interval)
{
    $scope.fromDistrict = "Kollam";
    $scope.toDistrict = $scope.fromDistrict;

    //For Checking whether to show the results table or not
    $scope.showTable = false ;

    //As fromStop.$dirty and toStop.$dirty is not working
    $scope.dirtyFlag = false;
    
    //For displaying the current time
    var tick = function() {
        $scope.clock = Date.now();
    }
    tick();
    $interval(tick, 1000);

    //For fetching stops according to fromDistrict
    $scope.updateStopWithFromDistrict  = function()
    {
        for(var i in $scope.districts) 
        {
                if($scope.districts[i].district == $scope.fromDistrict) 
                {
                    $scope.fromStops = $scope.districts[i].stops ; 
                    break;
                }
                else
                {
                    console.log("From District cannot be found");
                }
        }

        //Assign first stop from stops list to fromStop
        $scope.fromStop =  $scope.fromStops[0];
        $scope.showTable = false ;

        //Update fromDistrict same as toDistrict whenever district changes 
        $scope.toDistrict= $scope.fromDistrict; 
        $scope.updateStopWithToDistrict();
    }

    //For fetching stops according to toDistrict
    $scope.updateStopWithToDistrict  = function()
    {
        for(var i in $scope.districts)
        {
            if($scope.districts[i].district == $scope.toDistrict) 
            {
                $scope.toStops = $scope.districts[i].stops ;
                break;
            }
            else
            {
                console.log("To District cannot be found");
            }
        }
        $scope.toStop =  $scope.toStops[0]; 
        $scope.showTable = false ;
    }


    $http.get('bus/stops.json').then(function(response)
    {
        $scope.districts = response.data;
        $scope.updateStopWithFromDistrict();
        $scope.updateStopWithToDistrict();
    }).catch(function(response) {
        console.log("ERROR IN FETCHING DISTRICTS DATA:", response);
    });

    $http.get('bus/buses.json').then(function(response)
    {
        $scope.buses = response.data;
    }).catch(function(response) {
        console.log("ERROR IN FETCHING BUS DATA:", response);
    });

    $scope.findBus = function()
    {
        $scope.filteredBuses = [];

        for(var i in $scope.buses)
        {
            var stopNames = Object.keys($scope.buses[i].stops);

            if(stopNames.includes($scope.fromStop) && stopNames.includes($scope.toStop))
            {
                if(stopNames.indexOf($scope.fromStop) < stopNames.indexOf($scope.toStop))
                {
                    $scope.filteredBuses.push($scope.buses[i]);
                }
            }
        }

        console.log( $scope.filteredBuses);

        if($scope.filteredBuses.length === 0)
        {
            $scope.showTable = false;
            $scope.noBusFound = true;
        }
        else
        {
            $scope.showTable = true;
            $scope.noBusFound = false;
        }

    }

} );