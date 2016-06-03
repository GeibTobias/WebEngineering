var numResults = 10;
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

    function validation(input) {
        // valid if: op == cl
        var op=0, cl=0;
        var charAt;
        var concANDAt;
        for(var i=0; i<input.length; i++){
            charAt = input.charAt(i);
            if(charAt == "("){op++;}
            if(charAt == ")"){cl++;}
            if (i != 0 && i != input.length-1 && op == cl){concANDAt = i;}
        }

        var andOr = input.split(/\s/);
        // valid if: !twoFollowing
        var twoFollowing = false, lastOperator = false;
        for(var i=0; i<andOr.length; i++) {
            // TODO: AND und OR nicht nach Klammer-Auf und nicht vor Klammer-Zu
            if("AND".localeCompare(andOr(i)) || "OR".localeCompare(andOr(i))){
                if(lastOperator){twoFollowing = true;}
                else {lastOperator = true;}
            } else {lastOperator = false;}
            if("(".localeCompare(andOr(i)) || ")".localeCompare(andOr(i))){
                lastOperator = true;
            }
        }
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