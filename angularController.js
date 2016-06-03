var searchInput = [];

app.controller("angCtrl", ['$scope', function($scope) {
    $scope.putin = function(txt) {
        searchInput = angular.copy(txt).split(" ");
    };

    console.log(searchInput.toString());
}]);