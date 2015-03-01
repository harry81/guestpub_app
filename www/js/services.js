angular.module('starter.services', [])

.factory('PubService', function($resource) {
    return $resource('http://guestpub.hoodpub.com/api/pub/:id/',{},{
        query: {method:'GET', isArray: false}
    }); 
});
