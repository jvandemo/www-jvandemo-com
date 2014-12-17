(function () {

  angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {

      $stateProvider
        .state('homepage', {
          url: '/',
          views: {
            'content@': {
              templateUrl: '/components/homepage/homepage.html',
              controller: 'HomepageCtrl',
              controllerAs: 'HomepageCtrl'
            }
          }
        });

    }]);

})();
