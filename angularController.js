var totalOrder = document.getElementById("switch-order");
var mainString = "";
var secString = "";
var out = "";
var mediaType = [], language = [], date = [], provider = [];

app.controller("angCtrl", ['$scope', '$cookies', '$http', function($scope, $cookies, $http) {
    $scope.UUID = $cookies.get('UUID');
    if($scope.UUID == undefined || !$scope.UUID.localeCompare('')) {
        var id = Math.floor(Math.random()*100000000000).toString();
        $cookies.put('UUID', id);
        $scope.UUID = id;
    }

    $scope.searchInput = "";
    $scope.putin = function() {
        sendData();
    };
    
    $scope.dropdown = [10, 50, 100, 500];
    $scope.numResults = 10;

    $scope.oldOrder = [];
    $scope.onAlphaOrderClicked = function(ordered) {
        if(Boolean(ordered)) {
            if($scope.oldOrder != null) {
                $scope.initInput = $scope.oldOrder;
            }
        } else {
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

    $scope.initInput = [];
    $scope.checkBoxes = {};

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
    };

    $scope.filteredArray = function() {
        if(isEmpty($scope.checkBoxes)) {return $scope.initInput;}
        var outArr = [];
        var check = false;
        var oneOfEm = false;
        for(var i=0; i<$scope.initInput.length; i++) {
            var value = $scope.initInput[i];
            if(value == undefined || $scope.initInput.length < 1) {return [];}
            check = true;
            for (var box in $scope.checkBoxes) {
                oneOfEm = false;
                for (var searchValue in $scope.checkBoxes[box]) {
                    var search = false;
                    if(!box.toString().localeCompare("date")) {
                        search = getNestedDateOf(searchValue.toString().substring(0, 3), value);
                        if(search != false) {
                            search = search.toString().substring(0,4);
                        }
                    } else {
                        search = getNestedValueOf(searchValue.toString(), value);
                    }
                    if(search == false || searchValue.toString().localeCompare(search)) {
                        check = false;
                    } else {
                        oneOfEm = true;
                    }
                }
                if(oneOfEm) { check = true;}
            }
            if(check) {outArr.push(value);}
        }
        return outArr;
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

        if(op == 0 && cl == 0) {return true;}

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

        for(var i=0 ; i < $scope.searchInput.length; i++ ) {
            charInput = String($scope.searchInput).charAt(i);


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
        for(var j = 0; j < $scope.searchInput.length; j++) {
            charInput = String($scope.searchInput).charAt(j);

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

        if (validation($scope.searchInput)) {
            mainAndSplit();
            evaluation();
        } else {
            // TODO
        }
        var data = "{"
            + "\n" + out
            + "\n\"numResults\":" + $scope.numResults + ","
            + "\n\"origin\": {"
                +"\n\"clientType\": \"EEXCESS Advanced Search UNI PASSAU\","
                +"\n\"clientVersion\": \"1000.0\","
                +"\n\"userID\":" + $scope.UUID.toString() + ","
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
            $scope.initCheckbox = createFilter(response);
        }, function errorCallback(response) {
            console.log("err: " + response);
        });
    }
}]);

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

function getNestedValueOf(header, obj) {
    for(var key in obj) {
        if(!header.toString().localeCompare(obj[key].toString())) return obj[key];
    }
    for(var keyObj in obj) {
        if(!"object".localeCompare(typeof obj[keyObj])) {
            var temp = getNestedValueOf(header, obj[keyObj]);
            if(temp != false) {
                return temp;
            }
        }
    }
    return false;
}

function getNestedDateOf(header, obj) {
    for(var key in obj) {
        if(!header.toString().localeCompare(obj[key].toString().substring(0, 3))) return obj[key].substring(0, 3) + "0";
    }
    for(var keyObj in obj) {
        if(!"object".localeCompare(typeof obj[keyObj])) {
            var temp = getNestedDateOf(header, obj[keyObj]);
            if(temp != false) {
                return temp;
            }
        }
    }
    return false;
}

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
