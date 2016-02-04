app.controller('TwilioController', ['$scope', '$http', '$window', function($scope, $http, $window, User) {

  // booleans to show/hide alerts
  $scope.submitted = false;
  $scope.showErrorAlert = false;
  // alert string
  $scope.errorAlert = '';

  $scope.message = "";

  // at sms button click
  $scope.submit = function(message) {
    $scope.submitted = true;
    var send = {};
    send.message = message;

    $http.post("/api/twilio", send )
    .success(function (data, status) {
      // if successfull redirect to /
      //$window.location.href = '/';
      console.log('sent the message');
    })
    .error(function (data) {
      console.log('Error: ' + data);
      $scope.showErrorAlert = true;
      $scope.errorAlert = data[0];
    });
  };

}]);
