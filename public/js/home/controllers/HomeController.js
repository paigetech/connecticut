app.controller('HomeController', ['$scope', '$http', 'User', function($scope, $http, User) {
  // User is the global obj we use to check the user login status
  $scope.user = User;
}]);
app.directive('preventDefault', function() {
    return function(scope, element, attrs) {
          angular.element(element).bing('click', function(event) {
                  event.preventDefault();
                        event.stopPropagation();
                            });
            }
});

