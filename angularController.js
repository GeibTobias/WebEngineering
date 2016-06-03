var numResults = 50;

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

    function validation() {
        //TODO
    }
    
    function evaluation() {
        //TODO
    }

    function mainAndSplit(){
        var charInput;
        var bracketCounter;
        for(var i=0 ; i < searchInput.length; i++ ) {
            charInput = searchInput.toLowerCase();
            charInput = searchInput.charAt(i);

            if(charInput = '(') {

            } else if(charInput = ')') {

            }
        }
    }

    function sendData() {
        var main;
        var out;
        searchInput = searchInput.split(")");
        for (var i=0; i<searchInput.length; i++) {


        }
        out += "}";
        var data = {
            "contextKeywords":[
                out
            ],
            "numResults" : numResults,
            "origin": {
                "clientType": "EEXCESS Advanced Search UNI PASSAU",
                "clientVersion": "1000.0",
                "module": "curl command line",
                "userID": userID
            }
        };

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