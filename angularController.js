
var searchInput = "";
var userID = Math.random()* 1000000000;

//TODO: MOUSE POINTER IN SEARCHLINE SETZTEN

app.controller("angCtrl", ['$scope','$http', function($scope, $http) {
    $scope.putin = function() {
        searchInput = document.getElementById("search-input").value;
        sendData();

    };


    successCallback = function () {
        console.log("success")
    };

    errorCallback = function () {
        console.log("error")
    };

    function sendData() {
        var data = {
            "contextKeywords":[
                {
                    "text":"Douglas Adams",
                }
            ],
            "origin": {
                "clientType": "EEXCESS Advanced Search UNI PASSAU",
                "clientVersion": "1000.0",
                "module": "curl command line",
                "userID": userID
            }
        };


        //data = JSON.stringify(searchInput);
        console.log(searchInput);
        console.log(data);

        var config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        $http.post('https://eexcess.joanneum.at/eexcess-privacy-proxy-issuer-1.0-SNAPSHOT/issuer/recommend', data, config).then(successCallback, errorCallback);
    }
}]);