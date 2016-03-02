app.controller('TwilioController', ['$scope', '$http', '$window', function($scope, $http, $window, User) {

  // booleans to show/hide alerts
  $scope.submitted = false;
  $scope.showErrorAlert = false;
  // alert string
  $scope.errorAlert = '';

  $scope.message = {};
  $scope.message.message = "";
  $scope.message.number = "";

  // at sms button click
  $scope.submit = function(message) {
    $scope.submitted = true;
    $scope.success = "Sending your message!";
    var re = /[^0-9]/gi;
    message.number = message.number.replace(re, "");
    console.log("logging the message: " + message.number);
    var send = message;

    $http.post("/api/twilio", send )
    .success(function (data, status) {
      // if successfull redirect to /
      $window.location.href = '/';
      console.log('sent the message');
    })
    .error(function (data) {
      console.log('Error: ' + data);
      $scope.showErrorAlert = true;
      $scope.errorAlert = data[0];
    });
  };

}]);
