// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngResource', 'starter.controllers', 'starter.services'])
.run(function($ionicPlatform, $ionicPopup, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

$ionicPlatform.onHardwareBackButton(function (event) {
      if($state.$current.name=="app.housemap") { // your check here
          event.preventDefault();
          event.stopPropagation();
          navigator.app.exitApp();
      }
  })

})

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];

  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

    .state('app.houselist', {
      url: "/houselist",
      views: {
        'menuContent': {
          templateUrl: "templates/house_list.html",
          controller: 'HouselistCtrl'
        }
      }
    })

    .state('app.housemap', {
      url: "/housemap",
      views: {
        'menuContent': {
          templateUrl: "templates/house_map.html",
          controller: 'HousemapCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/housedetail/:housedetailId",
    views: {
      'menuContent': {
        templateUrl: "templates/house_detail.html",
        controller: 'HouseDetailCtrl'
      }
    }
  })

  .state('app.inquiry', {
    url: "/inquiry/:housedetailId",
    views: {
      'menuContent': {
        templateUrl: "templates/inquiry.html",
        controller : 'InqueryCtrl'
      }
    }
  })
;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/housemap');
});
