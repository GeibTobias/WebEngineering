// TODO: zehn
var numResults = 1000000;
var searchInput = "";
var userID;
checkCookie();
if(checkCookie()){
    userID = getCookie("UUID");
} else {
    userID = Math.floor(Math.random()*100000000000);
    setCookie("UUID", userID.toString(), 10);
}
var totalOrder = document.getElementById("switch-order");
var mainString = "";
var secString = "";
var out = "";
var mediaType = [], language = [], date = [], provider = [];

app.controller("angCtrl", ['$scope','$http', function($scope, $http) {
    $scope.putin = function() {
        searchInput = document.getElementById("search-input").value;
        sendData();
    };
    
    //$filter('filter')($scope.initInput, 'documentBadge.provider');
    

    $scope.oldInitInput;
    $scope.onAlphaOrderClicked = function(ordered) {
        console.log("onAlphaOderClicked aufgerufen");
        if(Boolean(ordered)) {
            if($scope.oldOrder != null) {
                console.log($scope.oldOrder == $scope.initInput);
                $scope.initInput = $scope.oldOrder;
            }
        } else {
            console.log($scope.initInput);
            $scope.oldOrder = [];
            for(i in $scope.initInput) {
                $scope.oldOrder[i] = $scope.initInput[i];
            }
            $scope.initInput = $scope.initInput.sort(function (a,b) {
                var textA = a.title.toUpperCase();
                var textB = b.title.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        }
    };

    $scope.print = function(){ console.log("update")};
    $scope.initInput = [];
    $scope.unfilteredInput = [];
    $scope.checkBoxes = {};

    $scope.doFilter = function(){
        for(x in $scope.checkBoxes) {
            for(y in x) {
                console.log(y);
                console.log(x);
            }
        }
    $scope.createFilter = function(box, value){
        if($scope.checkBoxes[box][value] != undefined && $scope.checkBoxes[box][value] == false) {
            var size = 0, key;
            for(key in $scope.checkBoxes[box]) {
                if ($scope.checkBoxes[box].hasOwnProperty(key)) size++;
            }
            delete $scope.checkBoxes[box][value];
            if(size == 1) {
                delete $scope.checkBoxes[box];
            }
        }
        console.log($scope.checkBoxes);
    };
    
    $scope.filterOut = function() {
        
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
        out = "\"contextKeywords\":[";
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

        out += "],";

    }

    function mainAndSplit(){
        var charInput;
        var bracketCounter = 0;
        var bracketExist = false;

        for(var i=0 ; i < searchInput.length; i++ ) {
            charInput = String(searchInput).charAt(i);


                if(charInput == '(') {
                    bracketCounter += 1;
                    bracketExist = true;
                } else if(charInput == ')') {
                    bracketCounter += -1;
                }

            if(bracketCounter == 0 && bracketExist) {
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

        mainString = "";
        secString  = "";
        out = "";

        if (validation(searchInput)) {
            mainAndSplit();
            evaluation();
        } else {
            console.log("Sie sind behindert.");
        }
        var data = "{"
            + "\n" + out
            + "\n\"numResults\":" + numResults + ","
            + "\n\"origin\": {"
                +"\n\"clientType\": \"EEXCESS Advanced Search UNI PASSAU\","
                +"\n\"clientVersion\": \"1000.0\","
                +"\n\"userID\":" + String(userID) + ","
                +"\n\"module\": \"curl command line\""
            +"\n}"
        +"\n}";

        var jsonData = JSON.parse(data);

        var config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };


        $http({
            method: 'POST',
            url: 'https://eexcess.joanneum.at/eexcess-privacy-proxy-issuer-1.0-SNAPSHOT/issuer/recommend',
            data: jsonData,
            config: config
        }).then(function successCallback(response) {
            createFilter(response);
            totalOrder.style.visibility="visible";
            $scope.initInput = response.data.result;
            $scope.unfilteredInput = response.data.result;
            $scope.initCheckbox = createFilter(response);
        }, function errorCallback(response) {
            console.log("err: " + response);
        });
    }
}]);

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("UUID");
    if (user != "") {
        console.log("Welcome again " + user);
        return true;
    }
    return false;
}

function createFilter(response){
    mediaType = []; language = []; date = []; provider = [];
    var resp = response.data;
    var totalResults = resp.totalResults;
    for(var i=0; i<totalResults; i++) {
        if(mediaType.indexOf(resp.result[i].mediaType) == -1 && "unknown".localeCompare(resp.result[i].mediaType)) {
            mediaType.push(resp.result[i].mediaType);
        }
        if(language.indexOf(resp.result[i].language) == -1 && "unknown".localeCompare(resp.result[i].language)) {
            language.push(resp.result[i].language);
        }
        if("unknown".localeCompare(resp.result[i].date)) {
            var decade = String(resp.result[i].date).replace(/\[/,"").substring(0, 3) + "0";
            if(date.indexOf(decade) == -1) {
                date.push(decade);
            }
        }
        if(provider.indexOf(resp.result[i].documentBadge.provider) == -1
            && "unknown".localeCompare(resp.result[i].documentBadge.provider)) {
            provider.push(resp.result[i].documentBadge.provider);
        }
    }
    mediaType.sort(); language.sort(); date.sort().reverse(); provider.sort();

    var out = [];
    if(mediaType.length > 1) {out.push({header: "mediaType", title: "Media", data: mediaType});}
    if(language.length > 1) {out.push({header: "language", title: "Language", data: language});}
    if(date.length > 1) {out.push({header: "date", title: "Decade", data: date});}
    if(provider.length > 1) {out.push({header: "provider", title: "Provider", data: provider});}


    return out;
}
