var numResults = 10;
var searchInput = "";
var userID = Math.random()* 1000000000;
var mainString = "";
var secString = "";
var out = "";

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
        var concANDAtSet = false;
        // valid if countNBracketAND < 2
        var countNBracketAND = 0;
        for(var i=0; i<input.length; i++){
            charAt = String(input).charAt(i);
            if(!"(".localeCompare(charAt)){op++;}
            if(!")".localeCompare(charAt)){cl++;}
            if (i != 0 && i != input.length-1 && concANDAtSet && op == cl){
                if(!concANDAtSet){concANDAt = i;}
                countNBracketAND ++;
            }
        }

        // valid if exactOneNBracketAND
        var exactOneNBrachetAND = true;
        if(countNBracketAND == 1) {
            var arr = String(input).substring(concANDAt + 1, String(input).length).split(/\s/);
            if("AND".localeCompare(arr[0])){exactOneNBrachetAND = false;}
        }

        var andOr = input.replace(/\(/gi, " ( ").replace(/\)/gi, " ) ").split(/\s/);
        console.log(andOr);
        // valid if: !twoFollowing
        var twoFollowing = false;
        // valid if countOp - 1 == countNOp
        var countOp = 0, countNOp = 0;
        /*
         * -1 if last element was AND || OR
         *  1 if last element was "("
         *  0 else
         */
        var lastOp = 0;
        for(var i=0; i<andOr.length; i++) {
            if(!"AND".localeCompare(andOr[i]) || !"OR".localeCompare(andOr[i])){
                if(lastOp == 1 || lastOp == -1){
                    twoFollowing = true;
                    break;
                } else {lastOp = -1;}
                countOp ++;
            } else if(!")".localeCompare(andOr[i])) {
                if (lastOp == 1 || lastOp == -1) {
                    twoFollowing = true;
                    break;
                }
            } else if(!"(".localeCompare(andOr[i])) {
                lastOp = 1;
            } else {
                if("".localeCompare(andOr[i])) {
                    lastOp = 0;
                    countNOp ++;
                }
            }
        }
        /*
        console.log("Number Brackets: " + String(op == cl));
        console.log("Number non-bracket parts:" + String(countNBracketAND < 2));
        console.log("One non-bracket-part is AND:" + exactOneNBrachetAND);
        console.log("Correct order of arguments:" + !twoFollowing);
        console.log("Correct number of arguments and operators:" + String(countOp == countNOp - 1));
        console.log("###########################################");
        */
        return (op == cl && countNBracketAND < 2 && exactOneNBrachetAND && !twoFollowing && countOp == countNOp - 1);
    }

    function evaluation() {

        var charAt;
        var newMain= "";
        var newSec= "";
        for(var l = 0; l < mainString.length; l++){
            charAt = String(mainString.charAt(l));
            if(!(charAt == '(' || charAt == ')' || charAt == " ")){
                newMain += charAt;
            }
        }

        for(var l = 0; l < secString.length; l++){
            charAt = String(secString.charAt(l));
            if(!(charAt == '(' || charAt == ')' || charAt == " ")){
                newSec += charAt;
            }
        }

        console.log(newMain);
        console.log(newSec);

        var mainOrSplit = newMain.split("OR");
        var secOrSplit  = newSec.split("OR");
        //Maintopic JSON gen
        for (var i = 0; i < mainOrSplit.length; i++) {
            if(i == 0) {
                out += "{ \n";
            } else {
                out += ", { \n";
            }
            var mainAndSplit = mainOrSplit[i].split("AND");
            out +="\t\"text\" : \"";
            for(var j = 0; j < mainAndSplit.length; j++) {
                if(j == 0) {
                    out += mainAndSplit[j];
                } else {
                    out += " " + mainAndSplit[j];
                }
            }
            out += "\", \n\t\"isMainTopic\" : true \n }";
        }
        //Secundar JSON gen
        for (var i = 0; i < secOrSplit.length; i++) {
            out += ", { \n";
            var secAndSplit = secOrSplit[i].split("AND");
            out +="\t\"text\" : \"";
            for(var j = 0; j < secAndSplit.length; j++) {
                if(j == 0) {
                    out += secAndSplit[j];
                } else {
                    out += " " + secAndSplit[j];
                }
            }
            out += "\",\n\t\"isMainTopic\" : false \n }";
        }

        console.log(out)

    }

    function mainAndSplit(){
        var charInput;
        var bracketCounter = 0;


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
    }

    function sendData() {
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

        var config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        mainAndSplit();

        evaluation();

        $http.post('https://eexcess.joanneum.at/eexcess-privacy-proxy-issuer-1.0-SNAPSHOT/issuer/recommend', data, config).then(successCallback, errorCallback);
    }
}]);