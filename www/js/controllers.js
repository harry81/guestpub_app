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

.controller('HouselistCtrl', function($scope, PubService, $http) {
  var next;
  var entries = PubService.query( function() {
      $scope.houselist = entries['results'];
      next = entries['next'];
  });
    lst = [];
    $scope.loadMore = function(){
        if ( next != undefined){
            $http.get(next).then(function(response){
                $scope.houselist = $scope.houselist.concat(response['data']['results']);
                // console.log('response', response['data']['results']);
                next = response['data']['next'];
            });
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }
})


.controller('HousemapCtrl', function($scope, $ionicLoading, $compile) {
    function initialize() {
        var myLatlng = new google.maps.LatLng(44.786683, -101.087618);
        
        var mapOptions = {
            center: myLatlng,
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
                                      mapOptions);
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
            content: compiled[0]
        });

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Uluru (Ayers Rock)'
        });
        console.log('map, marker', map, marker);

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
        });

        $scope.map_canvas = map;
    }
    google.maps.event.addDomListener(window, 'load', initialize);
    
    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };
    console.log('map control');
    initialize();
})


.controller('HouseDetailCtrl', function($scope, PubService, $stateParams) {
  var entry = PubService.query({id: $stateParams.housedetailId }, function() {
      $scope.house = entry;
  });
})

.controller('InqueryCtrl', function($scope, MessageService, $ionicPopup, $timeout, $location, PubService, $stateParams, $filter) {

    var entry = PubService.query({id: $stateParams.housedetailId }, function() {
        $scope.house = entry;
    });

    $scope.showPopup = function() {
        $scope.data = {}


        // An elaborate, custom popup
        var confirmPop = $ionicPopup.show({
            template: '<h2>{{username}}</h2>',
            title: '문자 전송 완료',
            // subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
                {
                    text: '<b>확인</b>',
                    type: 'button-positive',
                }
            ]
        });
        confirmPop.then(function(res) {
            $location.path('/');
            console.log('Tapped!', res);
        });
        $timeout(function() {
            confirmPop.close(); //close the popup after 3 seconds for some reason
        }, 3000);
    };

    $scope.inquery_submit = function() {

        $scope.payload = new MessageService();
        $scope.payload.username = $scope.username;
        $scope.payload.sender_tel = '01064117846';
        $scope.payload.receiver_tel = '01000000000';
        $scope.payload.day = $filter("date")($scope.day, 'MM/dd/yyyy');
        $scope.payload.num_men = $scope.num_men;
        $scope.payload.num_women = $scope.num_women;
        $scope.payload.num_children = $scope.num_children;

        console.log('submit');
        MessageService.save($scope.payload, function() {
            console.log($scope.payload);
            $scope.showPopup();
        });
    }
});
