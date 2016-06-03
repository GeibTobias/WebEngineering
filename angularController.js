
var searchInput = [];


app.controller("angCtrl", ['$scope', function($scope) {
    $scope.putin = function(searchTerm) {
        searchInput = angular.copy(searchTerm).split(" ");
    };


    successCallback = function () {
        console.log("success")
    };

    errorCallback = function () {
        console.log("error")
    }

    data = JSON.parse("{}");

    //$http.post('/https://eexcess.joanneum.at/eexcess-privacy-proxy-issuer-1.0-SNAPSHOT/issuer/recommend', data).then(successCallback, errorCallback);

    console.log(searchInput.toString());
}]);