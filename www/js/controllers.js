angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('HouselistCtrl', function($scope, PubService) {
  var entries = PubService.query( function() {
      $scope.houselist = entries['results'];
  });

})


.controller('HouseDetailCtrl', function($scope, PubService, $stateParams) {
  var entry = PubService.query({id: $stateParams.housedetailId }, function() {
      $scope.house = entry;
  });
})

.controller('InqueryCtrl', function($scope, MessageService) {
    $scope.inquery_submit = function() {
        console.log('submit', $scope.username);
        console.log($scope.people)

        $scope.payload = new MessageService();
        $scope.payload.username = $scope.username;
        $scope.payload.sender_tel = '01064117846';
        $scope.payload.receiver_tel = '01000000000';
        $scope.payload.day = $scope.day;
        $scope.payload.num_men = $scope.num_men;
        $scope.payload.num_women = $scope.num_women;
        $scope.payload.num_children = $scope.num_children;
        MessageService.save($scope.payload, function() {
            console.log($scope.payload);
        });
    }
});
