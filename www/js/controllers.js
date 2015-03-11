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

.controller('HousemapCtrl', function($scope, PubService, $ionicLoading, $compile) {
    // init map
    function initialize() {
        var myLatlng = new google.maps.LatLng(33.370199, 126.545654);
        var markerLatlng = new google.maps.LatLng(37.505478, 126.993791);
        
        var mapOptions = {
            center: myLatlng,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
                                      mapOptions);

        $scope.map = map;
    }
    google.maps.event.addDomListener(window, 'load', initialize);
    
    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };

    initialize();

    // Load location info
    var entry = PubService.query( function() {
        entry['results'].forEach(function(item){
            addMarker($scope.map, item);
        });
    });

    var addMarker = function(map, item){
        var markerLatlng = new google.maps.LatLng(item['geometry']['coordinates'][1], item['geometry']['coordinates'][0]);

        var marker = new google.maps.Marker({
            position: markerLatlng,
            map: $scope.map,
            title: item['properties']['title']
        });

        //Marker + infowindow + angularjs compiled ng-click
        var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<span><b>' + item["properties"]["title"]  +  '</b></span>'+
      '<div id="bodyContent"><a href="#/app/housedetail/20034967"> <img src='+ item["properties"]["imageurl"]   + ' width=100></a>'
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';

        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
            content: compiled[0]
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
        });

    }
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
