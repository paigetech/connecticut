app.controller('ChatController', ['$scope', '$http', '$window', 'socket', function($scope, $http, $window, socket) {

  $scope.messages = [];
  $scope.submit = function(thing) {
    console.log("angular submit");
  }
  // Socket listeners
  // ================

  socket.on('init', function (data) {
    $scope.name = data.name;
    $scope.users = data.users;
  });

  socket.on('chat message', function (message) {
    $scope.messages.push(message);
    console.log(" socekt message: " + message);
  });


  // Methods published to the scope
  // ==============================


  $scope.sendMessage = function () {
    console.log("message: " + $scope.message);
    this_message = $scope.user.email + ": " + $scope.message;
    socket.emit('chat message', this_message );
    //change messages to be an array of objects

    // clear message box
    $scope.message = '';
  };

}]);
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
