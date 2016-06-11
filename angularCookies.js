
app.controller('cookieHandler', ['$cookies', '$scope', function($cookies, $scope) {
    $scope.UUID = $cookies.get('UUID');
    if(!$scope.UUID.localeCompare('')) {
        var id = Math.floor(Math.random()*100000000000);
        $cookies.set('UUID', id);
        $scope.UUID = id;
    }
}]);
