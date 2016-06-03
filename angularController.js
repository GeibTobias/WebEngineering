
var searchInput = [];


app.controller("angCtrl", ['$scope','$http', function($scope, $http) {
    $scope.putin = function(searchTerm) {
        searchInput = angular.copy(searchTerm).split(" ");
    };


    successCallback = function () {
        console.log("success")
    };

    errorCallback = function () {
        console.log("error")
    };

    var data = JSON.parse("{}");

    $http.post('/https://eexcess.joanneum.at/eexcess-privacy-proxy-issuer-1.0-SNAPSHOT/issuer/recommend', data).then(successCallback, errorCallback);

    console.log(searchInput.toString());
}]);