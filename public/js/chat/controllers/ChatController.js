app.controller('ChatController', ['$scope', '$http', '$window', 'socket', function($scope, $http, $window, socket) {

  $scope.newMessage = {};
  $scope.chats = [];
  $scope.messages = [];
  init = function() {

    $http.get("/api/chats").success(function (data) {
      //add if
      //hide super secret back door - q5
      for (var msg in data) {
      $scope.messages.push(data[msg]);
      }
    })
    .error(function (err) {
      console.log('Error: ' + err);
    });
  };

  //
  // Socket listeners
  // ================

  socket.on('init', function (data) {
    $scope.name = data.name;
    $scope.users = data.users;
  });

  socket.on('chat message', function (message) {
    $scope.messages.push(message);
    console.log(" socekt message: " + JSON.stringify(message));
  });


  // Methods published to the scope
  // ==============================



  $scope.sendMessage = function (target) {
    console.log("message: " + $scope.newMessage.msg);
    this_message = {
      send: $scope.user.email,
      message: $scope.newMessage.msg,
      recieve: target
    }
    socket.emit('chat message', this_message );

    $http.post("/api/chat", this_message)
    .success(function (data, status) {
      // if successfull redirect to /
      console.log("successfully saved chat");
    })
    .error(function (data) {
      console.log('Error: ' + data);
      $scope.showErrorAlert = true;
      $scope.errorAlert = data[0];
    });

    // clear message box
    $scope.newMessage.msg = '';

  };

  //grabbing users
  $http.get('/api/users')
  .success(function (data) {
    $scope.users = data;
  })
  .error(function (err) {
    console.log('Error: ' + err);
  });

  init();
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
