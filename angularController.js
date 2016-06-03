var numResults = 10;
var searchInput ="";

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
        var bracketCounter = 0;
        var mainString = "";
        var secString = "";

        for(var i=0 ; i < searchInput.length; i++ ) {
            charInput = String(searchInput).charAt(i);

            if(!(i == 0 && charInput != '(')){
                if(charInput == '(') {
                    bracketCounter += 1;
                } else if(charInput == ')') {
                    bracketCounter += -1;
                }
            }
            if(bracketCounter == 0) {
                break;
            }
        }

        var secBool =  false;
        for(var j = 0; j < searchInput.length; j++) {
            charInput = String(searchInput).charAt(j);

            if(j <= i) {
                mainString += charInput;

            } else if(charInput == '(') {
                secBool = true;
            }
            if(secBool) {
                secString += charInput;
            }
        }

        console.log(mainString);
        console.log(secString);

    }

    function sendData() {
        var main;
        var out;
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

        mainAndSplit();
        
        $http.post('https://eexcess.joanneum.at/eexcess-privacy-proxy-issuer-1.0-SNAPSHOT/issuer/recommend', data, config).then(successCallback, errorCallback);
    }
}]);
var searchInput = "";

var userID = Math.random()* 1000000000;

//TODO: MOUSE POINTER IN SEARCHLINE SETZTEN
