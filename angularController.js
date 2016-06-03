var searchInput = [];

app.controller("angCtrl", ['$scope', function($scope) {
    $scope.putin = function(searchTerm) {
        searchInput = angular.copy(searchTerm).split(" ");
    };

    console.log(searchInput.toString());
}]);