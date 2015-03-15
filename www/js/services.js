angular.module('starter.services', [])

.factory('PubService', function($resource) {
    return $resource('http://guestpub.hoodpub.com/api/pub/:id/',{},{
        query: {method:'GET', isArray: false}
    }); 
})

.factory('CommentService', function($resource) {
    return $resource('http://guestpub.hoodpub.com/api/comment/?pub=:id/',{},{
        query: {method:'GET', isArray: false}
    });
})

.factory('MessageService', function($resource) {
    return $resource('http://guestpub.hoodpub.com/api/message/:id', { id: '@_id' }, {
        update: {
            method: 'PUT' // this method issues a PUT request
        }
    }, {
        stripTrailingSlashes: false
    });
});
