(function () {

  angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {

      $stateProvider
        .state('hire-me', {
          url: '/hire-me',
          views: {
            'content@': {
              templateUrl: '/components/hire-me/index.html'
            }
          }
        });

    }]);

})();
